'use client';

import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { MapPin, Phone, Mail, Clock, HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';

export default function Contact() {
  const { settings } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // FAQ states
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const schoolName = settings?.schoolName || 'ABC International School';

  const faqs = [
    { q: 'What is the procedure for admissions registration?', a: 'Fill in the online query on our Admissions page. An assessment interview schedule will be shared, followed by standard verification of Transfer Certificates (TCs) and first term fees.' },
    { q: 'What are the school working hours?', a: 'Standard timing is 08:30 AM to 02:30 PM (Mon-Fri) and 08:30 AM to 12:30 PM on Saturdays. However, during summer heatwaves, timings are shifted to 07:30 AM - 12:30 PM.' },
    { q: 'Is transportation service provided?', a: 'Yes, school bus services are provided for pre-mapped routes across the region. Rates are ₹5,000 quarterly, payable along with academic tuition fees.' },
    { q: 'Are study resources accessible on the ERP?', a: 'Yes, teachers upload class homework assignments and study manuals daily. Students can login to view and download study items.' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSuccessMsg('Your request has been submitted successfully! We will get in touch with you shortly.');
      setName('');
      setEmail('');
      setMessage('');
    }, 1200);
  };

  const handleFaqToggle = (idx: number) => {
    setActiveFaq(activeFaq === idx ? null : idx);
  };

  return (
    <div className="w-full py-16 dark:text-slate-200">
      <div className="max-w-7xl mx-auto px-4 text-left">
        
        {/* Header Title */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-2">Contact Us & FAQ</h1>
          <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold">
            Get in Touch with our Administrative Helpdesk
          </p>
        </div>

        {/* Contact Info & Form */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Info Column */}
          <div className="flex flex-col gap-6">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white border-l-4 border-secondary pl-3">
              Office Details
            </h2>
            <div className="text-xs flex flex-col gap-5 text-slate-600 dark:text-slate-400 font-medium">
              <div className="flex items-start gap-3">
                <MapPin className="text-[var(--primary-color)] mt-0.5 shrink-0" size={18} />
                <span>{settings?.address || 'Sector 4, Dwarka, New Delhi, Delhi 110075'}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="text-[var(--primary-color)] shrink-0" size={18} />
                <span>{settings?.phone || '+91 11 2345 6789'}</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="text-[var(--primary-color)] shrink-0" size={18} />
                <span>{settings?.email || 'admissions@abcinternational.edu.in'}</span>
              </div>
              <div className="flex items-start gap-3 border-t border-slate-200 dark:border-slate-800 pt-5">
                <Clock className="text-[var(--primary-color)] mt-0.5 shrink-0" size={18} />
                <div>
                  <h4 className="font-bold text-slate-800 dark:text-white mb-1">Administrative Hours</h4>
                  <p>Monday - Friday: 08:30 AM to 03:30 PM</p>
                  <p>Saturday: 08:30 AM to 01:00 PM</p>
                  <p className="text-slate-400 mt-1 italic">Closed on Sundays and Gazetted Holidays</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form Column */}
          <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 md:p-8 rounded-lg shadow-sm">
            <h3 className="font-extrabold text-sm uppercase tracking-wider mb-4 border-b border-slate-200 dark:border-slate-800 pb-2">
              Send Administration Message
            </h3>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-xs">
              <div className="flex flex-col gap-1">
                <label className="font-bold text-slate-500">Your Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-white dark:bg-slate-950 border border-slate-350 dark:border-slate-800 rounded p-2.5 outline-none focus:border-[var(--primary-color)] text-slate-805 dark:text-white transition-colors"
                  placeholder="e.g. Amit Verma"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="font-bold text-slate-500">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white dark:bg-slate-950 border border-slate-350 dark:border-slate-800 rounded p-2.5 outline-none focus:border-[var(--primary-color)] text-slate-805 dark:text-white transition-colors"
                  placeholder="e.g. amit@gmail.com"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="font-bold text-slate-500">Message Description</label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full bg-white dark:bg-slate-950 border border-slate-350 dark:border-slate-800 rounded p-2.5 outline-none focus:border-[var(--primary-color)] text-slate-805 dark:text-white transition-colors resize-none"
                  placeholder="Write details of your query here..."
                />
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-primary hover:bg-blue-800 text-white font-extrabold py-3 rounded tracking-wider uppercase transition-colors shadow cursor-pointer text-center"
              >
                {submitting ? 'Sending Message...' : 'Send Message'}
              </button>
              {successMsg && (
                <p className="mt-2 text-emerald-600 dark:text-emerald-400 font-bold text-center animate-pulse">
                  {successMsg}
                </p>
              )}
            </form>
          </div>
        </div>

        {/* FAQ Accordions Section */}
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white border-l-4 border-secondary pl-3 mb-6">
            Frequently Asked Questions
          </h2>
          <div className="flex flex-col gap-3">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden transition-all shadow-sm"
              >
                <button
                  onClick={() => handleFaqToggle(idx)}
                  className="w-full p-5 flex justify-between items-center text-xs font-bold text-slate-800 dark:text-white focus:outline-none hover:bg-slate-50 dark:hover:bg-slate-850"
                >
                  <span className="flex items-center gap-2 text-left">
                    <HelpCircle className="text-[var(--primary-color)] shrink-0" size={16} />
                    {faq.q}
                  </span>
                  {activeFaq === idx ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
                {activeFaq === idx && (
                  <div className="px-5 pb-5 pt-1 text-xs text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-850">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
