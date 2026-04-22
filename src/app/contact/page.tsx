'use client';

import { useState } from 'react';
import { Phone, Mail, MapPin, Clock, Send, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ContactPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'General Inquiry',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim() || !form.message.trim()) {
      toast.error('Please fill in name, phone, and message.');
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSubmitted(true);
        toast.success('Message sent! We\'ll be in touch soon.');
        setForm({ name: '', email: '', phone: '', subject: 'General Inquiry', message: '' });
      } else {
        toast.error(data.error || 'Something went wrong. Please try again.');
      }
    } catch {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-28 pb-24 bg-cream min-h-screen">
      <div className="max-w-[1200px] mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="flex items-center justify-center gap-3 text-gold text-[11px] font-semibold tracking-[0.14em] uppercase mb-4">
            <span className="w-8 h-[1.5px] bg-gold" />
            Get in Touch
            <span className="w-8 h-[1.5px] bg-gold" />
          </div>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-pine-dark mb-4">
            Contact Us
          </h1>
          <p className="text-stone text-lg max-w-2xl mx-auto">
            Have questions? We&apos;d love to hear from you. Send us a message and we&apos;ll respond as soon as possible.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl p-8 shadow-card border border-cream-dark">
              <h2 className="font-serif text-2xl font-semibold text-pine-dark mb-6">
                Send us a Message
              </h2>

              {submitted ? (
                <div className="text-center py-12">
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h3 className="font-serif text-2xl font-semibold text-pine-dark mb-2">
                    Message Sent!
                  </h3>
                  <p className="text-stone mb-6">
                    Thank you for reaching out. Our team will get back to you within 24 hours.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="inline-flex items-center gap-2 bg-gold text-pine-dark font-semibold px-6 py-3 rounded-lg hover:bg-gold-light transition-colors"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-pine-dark mb-1">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-cream-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold text-pine-dark placeholder:text-stone/50"
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-pine-dark mb-1">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-cream-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold text-pine-dark placeholder:text-stone/50"
                        placeholder="you@example.com"
                      />
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-pine-dark mb-1">
                        Phone <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-cream-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold text-pine-dark placeholder:text-stone/50"
                        placeholder="+91 85956 89569"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-pine-dark mb-1">Subject</label>
                      <select
                        name="subject"
                        value={form.subject}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-cream-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold text-pine-dark bg-white"
                      >
                        <option>General Inquiry</option>
                        <option>Tour Booking</option>
                        <option>Custom Package</option>
                        <option>Feedback</option>
                        <option>Complaint</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-pine-dark mb-1">
                      Message <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-cream-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold text-pine-dark placeholder:text-stone/50"
                      rows={5}
                      placeholder="How can we help you?"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center gap-2 bg-gold text-pine-dark font-semibold tracking-wide px-6 py-3 rounded-lg hover:bg-gold-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="w-4 h-4" />
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-5">
            <div className="bg-white rounded-xl p-6 shadow-card border border-cream-dark">
              <h3 className="font-serif text-lg font-semibold text-pine-dark mb-4">Contact Details</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 bg-gold/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Phone className="w-4 h-4 text-gold" />
                  </div>
                  <div>
                    <p className="text-xs text-stone mb-1">Call Us</p>
                    <a href="tel:+918595689569" className="text-pine-dark font-medium hover:text-gold transition-colors">
                      +91 85956 89569
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 bg-gold/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Mail className="w-4 h-4 text-gold" />
                  </div>
                  <div>
                    <p className="text-xs text-stone mb-1">Email Us</p>
                    <a href="mailto:info@touryaaritravels.com" className="text-pine-dark font-medium hover:text-gold transition-colors">
                      info@touryaaritravels.com
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 bg-gold/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                    <MapPin className="w-4 h-4 text-gold" />
                  </div>
                  <div>
                    <p className="text-xs text-stone mb-1">Our Office</p>
                    <p className="text-pine-dark font-medium">Manali, Himachal Pradesh</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 bg-gold/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Clock className="w-4 h-4 text-gold" />
                  </div>
                  <div>
                    <p className="text-xs text-stone mb-1">Working Hours</p>
                    <p className="text-pine-dark font-medium">Mon–Sat: 9 AM – 7 PM</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-pine rounded-xl p-6 text-white">
              <h3 className="font-serif text-lg font-semibold mb-2">Quick WhatsApp</h3>
              <p className="text-white/70 text-sm mb-4">
                Get an instant response — chat with our travel experts right now.
              </p>
              <a
                href="https://wa.me/918595689569?text=Hi%20Touryaari%20Travels%2C%20I%20have%20a%20query"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#25D366] text-white font-semibold px-4 py-2.5 rounded-lg hover:bg-[#1ebe5d] transition-colors text-sm"
              >
                Chat on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
