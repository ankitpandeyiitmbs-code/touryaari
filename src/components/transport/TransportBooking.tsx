'use client';

import { useState, useEffect, useCallback } from 'react';
import { Car, Bus, Users, Calendar, Clock, MapPin, CheckCircle, ArrowRight, CreditCard, Loader2, Navigation } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';
import toast from 'react-hot-toast';
import { loadRazorpayScript, type RazorpayOptions } from '@/lib/razorpay';

interface Vehicle {
  id: string;
  name: string;
  vehicle_type: string;
  capacity: number;
  local_base_price: number;
  local_parking_included: boolean;
  outstation_price_per_km: number;
  minimum_km_per_day: number;
  driver_da_per_day: number;
  night_halt_charge: number;
  features: string[];
  luggage_capacity: number;
  is_popular: boolean;
}

interface TransportBookingData {
  booking_type: 'local' | 'outstation';
  vehicle_id: string;
  pickup_location: string;
  pickup_date: string;
  pickup_time: string;
  drop_location: string;
  drop_date: string;
  drop_time: string;
  estimated_distance: number;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  customer_city: string;
  special_requests: string;
}

export default function TransportBooking() {
  const [step, setStep] = useState(1);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [bookingComplete, setBookingComplete] = useState(false);
  const [bookingType, setBookingType] = useState<'local' | 'outstation'>('local');
  const [estimatedDistance, setEstimatedDistance] = useState<number>(0);
  const [estimatedDays, setEstimatedDays] = useState<number>(1);
  const [isCalculatingDistance, setIsCalculatingDistance] = useState(false);
  const [distanceCalculated, setDistanceCalculated] = useState(false);
  
  const [formData, setFormData] = useState<TransportBookingData>({
    booking_type: 'local',
    vehicle_id: '',
    pickup_location: '',
    pickup_date: '',
    pickup_time: '',
    drop_location: '',
    drop_date: '',
    drop_time: '',
    estimated_distance: 0,
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    customer_city: '',
    special_requests: '',
  });

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      console.log('Fetching vehicles from API...');
      const response = await fetch('/api/transport/vehicles');
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Vehicles data:', data);
      setVehicles(data.vehicles || []);
    } catch (error) {
      console.error('Error fetching vehicles:', error);
      toast.error('Failed to load vehicles. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const LOCAL_KM_INCLUDED = 80; // km included in local base price
  const LOCAL_EXTRA_PER_KM = 15; // per km charge beyond included km for local

  const calculatePrice = () => {
    if (!selectedVehicle) {
      return {
        basePrice: 0,
        driverDA: 0,
        extraKmCharge: 0,
        nightHaltCharge: 0,
        tollCharges: 0,
        parkingCharges: 0,
        stateTax: 0,
        subtotal: 0,
        gst: 0,
        total: 0,
        advance: 0,
        balance: 0,
        breakdown: '',
      };
    }
    
    const vehicle = selectedVehicle;
    let basePrice = 0;
    let driverDA = 0;
    let extraKmCharge = 0;
    let nightHaltCharge = 0;
    let breakdown = '';
    
    if (bookingType === 'local') {
      // Local (Same Day) pricing
      // Base price includes first 80 km
      basePrice = vehicle.local_base_price;
      driverDA = vehicle.driver_da_per_day;
      // Charge extra for km beyond included limit
      const extraKm = Math.max(0, estimatedDistance - LOCAL_KM_INCLUDED);
      extraKmCharge = extraKm * LOCAL_EXTRA_PER_KM;
      if (extraKm > 0) {
        breakdown = `${LOCAL_KM_INCLUDED} km included + ${extraKm} km x ₹${LOCAL_EXTRA_PER_KM}`;
      } else {
        breakdown = `Up to ${LOCAL_KM_INCLUDED} km included`;
      }
    } else {
      // Outstation pricing: rate per km × total distance for the trip
      const totalKm = estimatedDistance; // total one-way or round trip km
      basePrice = vehicle.outstation_price_per_km * totalKm;
      driverDA = vehicle.driver_da_per_day * estimatedDays;
      nightHaltCharge = vehicle.night_halt_charge * Math.max(0, estimatedDays - 1);
      breakdown = `${totalKm} km x ₹${vehicle.outstation_price_per_km}/km`;
      if (estimatedDays > 1) {
        breakdown += ` + ${estimatedDays} days DA`;
      }
    }
    
    const subtotal = basePrice + extraKmCharge + driverDA + nightHaltCharge;
    const gst = Math.round(subtotal * 0.05);
    const total = subtotal + gst;
    const advance = Math.round(total * 0.3);
    
    return {
      basePrice,
      driverDA,
      extraKmCharge,
      nightHaltCharge,
      tollCharges: 0,
      parkingCharges: 0,
      stateTax: 0,
      subtotal,
      gst,
      total,
      advance,
      balance: total - advance,
      breakdown,
    };
  };

  const pricing = calculatePrice();

  const estimateDistance = useCallback(async () => {
    if (!formData.pickup_location || !formData.drop_location) {
      toast.error('Please enter both pickup and drop locations');
      return;
    }

    setIsCalculatingDistance(true);
    try {
      // Use Nominatim (OpenStreetMap) to geocode both locations
      const [pickupRes, dropRes] = await Promise.all([
        fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(formData.pickup_location)}&format=json&limit=1&countrycodes=in`),
        fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(formData.drop_location)}&format=json&limit=1&countrycodes=in`),
      ]);

      const pickupData = await pickupRes.json();
      const dropData = await dropRes.json();

      if (!pickupData.length || !dropData.length) {
        toast.error('Could not find locations. Please enter distance manually.');
        setIsCalculatingDistance(false);
        return;
      }

      const pickupLat = parseFloat(pickupData[0].lat);
      const pickupLon = parseFloat(pickupData[0].lon);
      const dropLat = parseFloat(dropData[0].lat);
      const dropLon = parseFloat(dropData[0].lon);

      // Haversine formula for straight-line distance
      const R = 6371; // Earth radius in km
      const dLat = (dropLat - pickupLat) * Math.PI / 180;
      const dLon = (dropLon - pickupLon) * Math.PI / 180;
      const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(pickupLat * Math.PI / 180) * Math.cos(dropLat * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const straightLineKm = Math.round(R * c);

      // Road distance is typically 1.3-1.5x straight line; use 1.4x
      // For outstation round-trip, double it
      let roadKm = Math.round(straightLineKm * 1.4);
      if (bookingType === 'outstation') {
        roadKm = roadKm * 2; // round trip
      }
      roadKm = Math.max(roadKm, bookingType === 'local' ? 10 : selectedVehicle?.minimum_km_per_day || 250);

      setEstimatedDistance(roadKm);
      setFormData(prev => ({ ...prev, estimated_distance: roadKm }));
      setDistanceCalculated(true);
      toast.success(`Estimated ${roadKm} km (${bookingType === 'outstation' ? 'round trip' : 'one way'})`);
    } catch (error) {
      console.error('Distance estimation error:', error);
      toast.error('Could not calculate distance. Please enter manually.');
    } finally {
      setIsCalculatingDistance(false);
    }
  }, [formData.pickup_location, formData.drop_location, bookingType, selectedVehicle]);

  const handleVehicleSelect = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setFormData({ ...formData, vehicle_id: vehicle.id });
  };

  const handleNextStep = () => {
    if (step === 1 && !selectedVehicle) {
      toast.error('Please select a vehicle');
      return;
    }
    if (step === 2) {
      if (!formData.pickup_location || !formData.drop_location) {
        toast.error('Please enter pickup and drop locations');
        return;
      }
      if (!formData.pickup_date || !formData.drop_date) {
        toast.error('Please select pickup and drop dates');
        return;
      }
      if (!formData.pickup_time || !formData.drop_time) {
        toast.error('Please select pickup and drop times');
        return;
      }
      if (!estimatedDistance || estimatedDistance <= 0) {
        toast.error('Please enter or auto-calculate the distance');
        return;
      }
    }
    if (step === 3) {
      if (!formData.customer_name || !formData.customer_email || !formData.customer_phone) {
        toast.error('Please fill in all required fields');
        return;
      }
    }
    setStep(step + 1);
  };

  const handleSubmit = async () => {
    setIsProcessing(true);
    try {
      // Create booking via API
      const bookingRes = await fetch('/api/transport/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vehicle_id: formData.vehicle_id,
          booking_type: bookingType,
          pickup_location: formData.pickup_location,
          pickup_date: formData.pickup_date,
          pickup_time: formData.pickup_time,
          drop_location: formData.drop_location,
          drop_date: formData.drop_date,
          drop_time: formData.drop_time,
          estimated_distance_km: formData.estimated_distance,
          estimated_duration_hours: estimatedDays * 24,
          base_price: pricing.basePrice,
          driver_da: pricing.driverDA,
          extra_km_charge: pricing.extraKmCharge,
          night_halt_charges: pricing.nightHaltCharge,
          toll_charges: pricing.tollCharges,
          parking_charges: pricing.parkingCharges,
          state_tax: pricing.stateTax,
          gst_amount: pricing.gst,
          total_amount: pricing.total,
          advance_amount: pricing.advance,
          balance_amount: pricing.balance,
          customer_name: formData.customer_name,
          customer_email: formData.customer_email,
          customer_phone: formData.customer_phone,
          customer_city: formData.customer_city || null,
          special_requests: formData.special_requests || null,
        }),
      });

      const bookingData = await bookingRes.json();

      if (!bookingData.success || !bookingData.booking) {
        toast.error('Failed to create booking');
        setIsProcessing(false);
        return;
      }

      const booking = bookingData.booking;

      // Create Razorpay order
      const orderRes = await fetch('/api/razorpay/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: pricing.advance,
          currency: 'INR',
          booking_id: booking.id,
          booking_type: 'transport',
        }),
      });
      const orderData = await orderRes.json();

      if (!orderData.success) {
        toast.error('Failed to initiate payment');
        setIsProcessing(false);
        return;
      }

      // If demo mode (no Razorpay credentials), skip checkout and show confirmation
      if (orderData.demo) {
        setBookingComplete(true);
        toast.success('Booking confirmed! (Demo mode)');
        setIsProcessing(false);
        return;
      }

      // Load and open Razorpay
      const loaded = await loadRazorpayScript();
      if (!loaded) {
        toast.error('Payment gateway unavailable');
        setIsProcessing(false);
        return;
      }

      const options: RazorpayOptions = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '',
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Touryaari Travels',
        description: `Transport Booking - ${selectedVehicle?.name}`,
        order_id: orderData.order_id,
        prefill: {
          name: formData.customer_name,
          email: formData.customer_email,
          contact: formData.customer_phone,
        },
        theme: { color: '#C89033' },
        handler: async (response) => {
          const verifyRes = await fetch('/api/razorpay/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              booking_id: booking.id,
              booking_type: 'transport',
            }),
          });
          const verifyData = await verifyRes.json();

          if (verifyData.success) {
            setBookingComplete(true);
            toast.success('Booking confirmed! 🎉');
          } else {
            toast.error('Payment verification failed');
          }
          setIsProcessing(false);
        },
        modal: {
          ondismiss: () => {
            toast('Payment cancelled. Your booking is saved as pending.', { icon: 'ℹ️' });
            setIsProcessing(false);
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error('Booking error:', error);
      toast.error('Something went wrong');
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold mx-auto"></div>
        <p className="text-stone mt-4">Loading vehicles...</p>
      </div>
    );
  }

  if (bookingComplete) {
    return (
      <div className="text-center py-20 bg-white rounded-xl border border-cream-dark">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h2 className="font-serif text-2xl font-bold text-pine-dark mb-2">Booking Confirmed!</h2>
        <p className="text-stone mb-6">
          We've sent a confirmation to your email. Our team will contact you shortly.
        </p>
        <button
          onClick={() => window.location.href = '/'}
          className="bg-gold text-pine-dark font-semibold px-6 py-3 rounded-lg hover:bg-gold-light transition-colors"
        >
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      {/* Main Content */}
      <div className="lg:col-span-2">
        {/* Step Indicators */}
        <div className="flex items-center gap-2 mb-8">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                s === step ? 'bg-gold text-pine-dark' :
                s < step ? 'bg-pine text-white' :
                'bg-cream-dark text-stone'
              }`}>{s}</div>
              {s < 4 && <div className={`h-0.5 w-8 transition-colors ${s < step ? 'bg-pine' : 'bg-cream-dark'}`} />}
            </div>
          ))}
          <div className="ml-2 text-sm text-stone">
            {step === 1 ? 'Select Vehicle' : 
             step === 2 ? 'Trip Details' : 
             step === 3 ? 'Your Details' : 'Confirm & Pay'}
          </div>
        </div>

        {/* Step 1: Vehicle Selection */}
        {step === 1 && (
          <div className="space-y-4">
            <h2 className="font-serif text-xl font-semibold text-pine-dark mb-4">Choose Your Vehicle</h2>
            
            {/* Booking Type Selection */}
            <div className="bg-white rounded-xl p-4 border border-cream-dark mb-4">
              <p className="text-sm font-medium text-pine-dark mb-3">Booking Type</p>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => {
                    setBookingType('local');
                    setFormData({ ...formData, booking_type: 'local' });
                  }}
                  className={`p-3 rounded-lg border transition-colors ${
                    bookingType === 'local' ? 'border-gold bg-gold/10' : 'border-cream-dark hover:border-gold/50'
                  }`}
                >
                  <p className="font-medium text-pine-dark">Local (Same Day)</p>
                  <p className="text-xs text-stone mt-1">Within city limits</p>
                </button>
                <button
                  onClick={() => {
                    setBookingType('outstation');
                    setFormData({ ...formData, booking_type: 'outstation' });
                  }}
                  className={`p-3 rounded-lg border transition-colors ${
                    bookingType === 'outstation' ? 'border-gold bg-gold/10' : 'border-cream-dark hover:border-gold/50'
                  }`}
                >
                  <p className="font-medium text-pine-dark">Outstation</p>
                  <p className="text-xs text-stone mt-1">Inter-city travel</p>
                </button>
              </div>
            </div>

            {vehicles.map((vehicle) => (
              <div
                key={vehicle.id}
                onClick={() => handleVehicleSelect(vehicle)}
                className={`bg-white rounded-xl p-6 border cursor-pointer transition-all hover:shadow-card ${
                  selectedVehicle?.id === vehicle.id ? 'border-gold shadow-card ring-2 ring-gold/20' : 'border-cream-dark'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-pine-dark">{vehicle.name}</h3>
                      {vehicle.is_popular && (
                        <span className="bg-gold text-pine-dark text-xs px-2 py-0.5 rounded-full font-medium">Popular</span>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-stone">
                      <span className="flex items-center gap-1"><Users className="w-4 h-4" /> {vehicle.capacity} seats</span>
                      <span className="flex items-center gap-1"><Car className="w-4 h-4" /> {vehicle.luggage_capacity} bags</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-stone">Local (up to {LOCAL_KM_INCLUDED} km)</p>
                    <p className="font-semibold text-pine-dark">{formatPrice(vehicle.local_base_price)}</p>
                    <p className="text-xs text-stone mt-1">Outstation: {formatPrice(vehicle.outstation_price_per_km)}/km</p>
                    <p className="text-xs text-stone">+ ₹{LOCAL_EXTRA_PER_KM}/km extra (local)</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {vehicle.features.map((feature, idx) => (
                    <span key={idx} className="text-xs bg-cream px-2 py-1 rounded text-stone">{feature}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Step 2: Trip Details */}
        {step === 2 && (
          <div className="bg-white rounded-xl p-6 border border-cream-dark space-y-6">
            <h2 className="font-serif text-xl font-semibold text-pine-dark mb-4">Trip Details</h2>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-pine-dark mb-1.5">
                  <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> Pickup Location</span>
                </label>
                <input
                  type="text"
                  value={formData.pickup_location}
                  onChange={(e) => { setFormData({ ...formData, pickup_location: e.target.value }); setDistanceCalculated(false); }}
                  placeholder="e.g. Delhi, Connaught Place"
                  className="w-full px-4 py-3 border border-cream-dark rounded-lg focus:border-gold focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-pine-dark mb-1.5">
                  <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> Drop Location</span>
                </label>
                <input
                  type="text"
                  value={formData.drop_location}
                  onChange={(e) => { setFormData({ ...formData, drop_location: e.target.value }); setDistanceCalculated(false); }}
                  placeholder="e.g. Noida, Sector 18"
                  className="w-full px-4 py-3 border border-cream-dark rounded-lg focus:border-gold focus:outline-none"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-pine-dark mb-1.5">
                  <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> Pickup Date</span>
                </label>
                <input
                  type="date"
                  value={formData.pickup_date}
                  onChange={(e) => setFormData({ ...formData, pickup_date: e.target.value })}
                  min={new Date(Date.now() + 86400000).toISOString().split('T')[0]}
                  className="w-full px-4 py-3 border border-cream-dark rounded-lg focus:border-gold focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-pine-dark mb-1.5">
                  <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> Pickup Time</span>
                </label>
                <input
                  type="time"
                  value={formData.pickup_time}
                  onChange={(e) => setFormData({ ...formData, pickup_time: e.target.value })}
                  className="w-full px-4 py-3 border border-cream-dark rounded-lg focus:border-gold focus:outline-none"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-pine-dark mb-1.5">
                  <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> Drop Date</span>
                </label>
                <input
                  type="date"
                  value={formData.drop_date}
                  onChange={(e) => {
                    setFormData({ ...formData, drop_date: e.target.value });
                    if (formData.pickup_date) {
                      const pickup = new Date(formData.pickup_date);
                      const drop = new Date(e.target.value);
                      const days = Math.max(1, Math.ceil((drop.getTime() - pickup.getTime()) / (1000 * 60 * 60 * 24)));
                      setEstimatedDays(days);
                    }
                  }}
                  min={formData.pickup_date || new Date(Date.now() + 86400000).toISOString().split('T')[0]}
                  className="w-full px-4 py-3 border border-cream-dark rounded-lg focus:border-gold focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-pine-dark mb-1.5">
                  <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> Drop Time</span>
                </label>
                <input
                  type="time"
                  value={formData.drop_time}
                  onChange={(e) => setFormData({ ...formData, drop_time: e.target.value })}
                  className="w-full px-4 py-3 border border-cream-dark rounded-lg focus:border-gold focus:outline-none"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm font-medium text-pine-dark">Total Distance (km)</label>
                <button
                  type="button"
                  onClick={estimateDistance}
                  disabled={!formData.pickup_location || !formData.drop_location || isCalculatingDistance}
                  className="flex items-center gap-1 text-xs font-medium text-gold hover:text-gold-light disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  {isCalculatingDistance ? <Loader2 className="w-3 h-3 animate-spin" /> : <Navigation className="w-3 h-3" />}
                  {isCalculatingDistance ? 'Calculating...' : 'Auto-calculate'}
                </button>
              </div>
              <input
                type="number"
                value={estimatedDistance || ''}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setEstimatedDistance(val);
                  setFormData({ ...formData, estimated_distance: val });
                }}
                min={bookingType === 'local' ? 10 : selectedVehicle?.minimum_km_per_day || 250}
                placeholder="Enter or auto-calculate"
                className="w-full px-4 py-3 border border-cream-dark rounded-lg focus:border-gold focus:outline-none"
              />
              <p className="text-xs text-stone mt-1">
                {bookingType === 'local' 
                  ? `Base price includes ${LOCAL_KM_INCLUDED} km. Extra km at ₹${LOCAL_EXTRA_PER_KM}/km`
                  : `Min ${selectedVehicle?.minimum_km_per_day || 250} km/day. Enter total round-trip distance.`
                }
              </p>
            </div>
          </div>
        )}

        {/* Step 3: Customer Details */}
        {step === 3 && (
          <div className="bg-white rounded-xl p-6 border border-cream-dark space-y-4">
            <h2 className="font-serif text-xl font-semibold text-pine-dark mb-4">Your Details</h2>
            
            <div>
              <label className="block text-sm font-medium text-pine-dark mb-1.5">Full Name *</label>
              <input
                type="text"
                value={formData.customer_name}
                onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                placeholder="As per ID proof"
                className="w-full px-4 py-3 border border-cream-dark rounded-lg focus:border-gold focus:outline-none"
              />
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-pine-dark mb-1.5">Email *</label>
                <input
                  type="email"
                  value={formData.customer_email}
                  onChange={(e) => setFormData({ ...formData, customer_email: e.target.value })}
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 border border-cream-dark rounded-lg focus:border-gold focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-pine-dark mb-1.5">Phone *</label>
                <input
                  type="tel"
                  value={formData.customer_phone}
                  onChange={(e) => setFormData({ ...formData, customer_phone: e.target.value })}
                  placeholder="+91 98765 43210"
                  className="w-full px-4 py-3 border border-cream-dark rounded-lg focus:border-gold focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-pine-dark mb-1.5">City</label>
              <input
                type="text"
                value={formData.customer_city}
                onChange={(e) => setFormData({ ...formData, customer_city: e.target.value })}
                placeholder="Delhi"
                className="w-full px-4 py-3 border border-cream-dark rounded-lg focus:border-gold focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-pine-dark mb-1.5">Special Requests</label>
              <textarea
                value={formData.special_requests}
                onChange={(e) => setFormData({ ...formData, special_requests: e.target.value })}
                rows={3}
                placeholder="Any special requirements..."
                className="w-full px-4 py-3 border border-cream-dark rounded-lg focus:border-gold focus:outline-none resize-none"
              />
            </div>
          </div>
        )}

        {/* Step 4: Summary */}
        {step === 4 && (
          <div className="bg-white rounded-xl p-6 border border-cream-dark space-y-4">
            <h2 className="font-serif text-xl font-semibold text-pine-dark mb-4">Booking Summary</h2>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-stone">Vehicle</span><span className="font-medium text-pine-dark">{selectedVehicle?.name}</span></div>
              <div className="flex justify-between"><span className="text-stone">Pickup</span><span className="font-medium text-pine-dark">{formData.pickup_location}</span></div>
              <div className="flex justify-between"><span className="text-stone">Drop</span><span className="font-medium text-pine-dark">{formData.drop_location}</span></div>
              <div className="flex justify-between"><span className="text-stone">Date</span><span className="font-medium text-pine-dark">{formData.pickup_date} to {formData.drop_date}</span></div>
              <div className="flex justify-between"><span className="text-stone">Duration</span><span className="font-medium text-pine-dark">{estimatedDays} day{estimatedDays > 1 ? 's' : ''}</span></div>
              <div className="flex justify-between"><span className="text-stone">Distance</span><span className="font-medium text-pine-dark">{estimatedDistance} km {bookingType === 'outstation' ? `(min ${selectedVehicle?.minimum_km_per_day || 250} km/day)` : ''}</span></div>
              
              <div className="border-t border-cream-dark pt-2 mt-2">
                <div className="flex justify-between"><span className="text-stone">{bookingType === 'local' ? `Base Price (${LOCAL_KM_INCLUDED} km incl.)` : `Base Price (${estimatedDistance} km x ₹${selectedVehicle?.outstation_price_per_km}/km)`}</span><span>{formatPrice(pricing.basePrice)}</span></div>
                {pricing.extraKmCharge > 0 && (
                  <div className="flex justify-between"><span className="text-stone">Extra Km ({Math.max(0, estimatedDistance - LOCAL_KM_INCLUDED)} km x ₹{LOCAL_EXTRA_PER_KM})</span><span>{formatPrice(pricing.extraKmCharge)}</span></div>
                )}
                <div className="flex justify-between"><span className="text-stone">Driver DA ({estimatedDays} day{estimatedDays > 1 ? 's' : ''})</span><span>{formatPrice(pricing.driverDA)}</span></div>
                {pricing.nightHaltCharge > 0 && (
                  <div className="flex justify-between"><span className="text-stone">Night Halt ({Math.max(0, estimatedDays - 1)} night{Math.max(0, estimatedDays - 1) > 1 ? 's' : ''})</span><span>{formatPrice(pricing.nightHaltCharge)}</span></div>
                )}
                <div className="flex justify-between"><span className="text-stone">Toll Charges</span><span>{formatPrice(pricing.tollCharges)}</span></div>
                <div className="flex justify-between"><span className="text-stone">Parking Charges</span><span>{formatPrice(pricing.parkingCharges)}</span></div>
                <div className="flex justify-between"><span className="text-stone">State Tax</span><span>{formatPrice(pricing.stateTax)}</span></div>
                <div className="flex justify-between"><span className="text-stone">GST (5%)</span><span>{formatPrice(pricing.gst)}</span></div>
                <div className="flex justify-between font-semibold text-pine-dark text-base mt-1">
                  <span>Total</span><span>{formatPrice(pricing.total)}</span>
                </div>
              </div>
              
              <div className="bg-gold/10 rounded-lg p-3 border border-gold/30">
                <div className="flex justify-between text-gold font-semibold">
                  <span>Advance Payable Now (30%)</span><span>{formatPrice(pricing.advance)}</span>
                </div>
                <div className="flex justify-between text-stone text-xs mt-1">
                  <span>Balance due before pickup</span><span>{formatPrice(pricing.balance)}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between mt-6">
          {step > 1 && (
            <button
              onClick={() => setStep(step - 1)}
              className="flex items-center gap-2 px-5 py-2.5 border border-cream-dark text-stone rounded-lg hover:bg-cream transition-colors"
            >
              Back
            </button>
          )}
          {step < 4 ? (
            <button
              onClick={handleNextStep}
              className="ml-auto flex items-center gap-2 bg-gold text-pine-dark font-semibold px-6 py-2.5 rounded-lg hover:bg-gold-light transition-colors"
            >
              Next <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isProcessing}
              className="ml-auto flex items-center gap-2 bg-gold text-pine-dark font-semibold px-6 py-2.5 rounded-lg hover:bg-gold-light disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <CreditCard className="w-4 h-4" />
              {isProcessing ? 'Processing...' : `Pay ${formatPrice(pricing.advance)}`}
            </button>
          )}
        </div>
      </div>

      {/* Sidebar */}
      <div className="lg:col-span-1">
        <div className="sticky top-24 space-y-4">
          {selectedVehicle && (
            <div className="bg-white rounded-xl p-6 border border-cream-dark">
              <h3 className="font-serif font-semibold text-lg text-pine-dark mb-4">Selected Vehicle</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-stone">Vehicle</span>
                  <span className="font-medium text-pine-dark">{selectedVehicle.name}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-stone">Capacity</span>
                  <span className="font-medium text-pine-dark">{selectedVehicle.capacity} seats</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-stone">Local Rate</span>
                  <span className="font-medium text-pine-dark">{formatPrice(selectedVehicle.local_base_price)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-stone">Outstation</span>
                  <span className="font-medium text-pine-dark">{formatPrice(selectedVehicle.outstation_price_per_km)}/km</span>
                </div>
              </div>
              
              {step >= 2 && (
                <div className="mt-4 pt-4 border-t border-cream-dark">
                  <p className="font-semibold text-pine-dark mb-2">Estimated Cost</p>
                  {pricing.breakdown && (
                    <p className="text-xs text-stone mb-1">{pricing.breakdown}</p>
                  )}
                  <p className="text-2xl font-bold text-gold">{formatPrice(pricing.total)}</p>
                  <p className="text-xs text-stone mt-1">Advance (30%): {formatPrice(pricing.advance)}</p>
                  <p className="text-xs text-stone">Balance: {formatPrice(pricing.balance)}</p>
                </div>
              )}
            </div>
          )}

          <div className="bg-accent/10 border border-accent/20 rounded-xl p-4">
            <p className="text-sm text-accent-dark">
              <strong>Need Help?</strong> Call us at{' '}
              <a href="tel:+918595689569" className="underline">
                +91 85956 89569
              </a>{' '}
              or{' '}
              <a href="https://wa.me/918595689569" className="underline">
                WhatsApp us
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
