'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, MapPin, Calendar, Users } from 'lucide-react';

const destinations = [
  'Leh Ladakh',
  'Spiti Valley',
  'Kedarnath',
  'Kasol',
  'Rishikesh',
  'Manali',
  'Bhutan',
  'Bali',
];

const activities = [
  'Road Trip',
  'Spiritual Yatra',
  'Weekend Getaway',
  'Trekking',
  'Adventure',
  'International',
];

export default function SearchBox() {
  const router = useRouter();
  const [destination, setDestination] = useState('');
  const [activity, setActivity] = useState('');
  const [date, setDate] = useState('');
  const [guests, setGuests] = useState('2');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (destination) params.set('destination', destination);
    if (activity) params.set('activity', activity);
    if (date) params.set('date', date);
    if (guests) params.set('guests', guests);
    router.push(`/tours?${params.toString()}`);
  };

  return (
    <section className="relative z-20 -mt-16 mb-16">
      <div className="container-custom">
        <div className="bg-white rounded-2xl shadow-card-hover p-6 md:p-8">
          <form onSubmit={handleSearch}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
              {/* Destination */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="w-4 h-4 inline mr-1" />
                  Destination
                </label>
                <select
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="select-field"
                >
                  <option value="">Where to?</option>
                  {destinations.map((dest) => (
                    <option key={dest} value={dest}>
                      {dest}
                    </option>
                  ))}
                </select>
              </div>

              {/* Activity */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Activity Type
                </label>
                <select
                  value={activity}
                  onChange={(e) => setActivity(e.target.value)}
                  className="select-field"
                >
                  <option value="">Select Activity</option>
                  {activities.map((act) => (
                    <option key={act} value={act}>
                      {act}
                    </option>
                  ))}
                </select>
              </div>

              {/* Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  Travel Date
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="input-field"
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              {/* Guests */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Users className="w-4 h-4 inline mr-1" />
                  Travelers
                </label>
                <select
                  value={guests}
                  onChange={(e) => setGuests(e.target.value)}
                  className="select-field"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                    <option key={num} value={num}>
                      {num} {num === 1 ? 'Person' : 'People'}
                    </option>
                  ))}
                </select>
              </div>

              {/* Search Button */}
              <div>
                <button type="submit" className="btn-primary w-full py-3.5">
                  <Search className="w-5 h-5" />
                  Search Tours
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
