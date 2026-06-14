'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { apiRequest } from '../utils/api';
import {
  GraduationCap,
  Award,
  BookOpen,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Shield,
  Layers,
  Sparkles,
  ArrowRight,
  Clock,
  MapPin,
  Mail,
  Phone,
} from 'lucide-react';

interface Announcement {
  id: number;
  title: string;
  content: string;
  type: string;
  date: string;
}

interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  location: string;
  imageUrl?: string;
}

const slides = [
  {
    image: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1600&fit=crop&q=80',
    title: 'Excellence in Education',
    subtitle: 'Nurturing curiosity, integrity, and leadership values in students.',
  },
  {
    image: 'https://images.unsplash.com/photo-1564951434112-64d74cc2a2d7?w=1600&fit=crop&q=80',
    title: 'State-of-the-Art Science Labs',
    subtitle: 'Equipping learners with modern practical tools and experimental concepts.',
  },
  {
    image: 'https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?w=1600&fit=crop&q=80',
    title: 'Active Sports & Athletics Programs',
    subtitle: 'Building teamwork, physical endurance, and sportsmanship values.',
  },
];

export default function Home() {
  const { settings } = useAuth();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedFacilityTab, setSelectedFacilityTab] = useState('science');

  // Contact form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitMsg, setSubmitMsg] = useState('');

  const schoolName = settings?.schoolName || 'ABC International School';
  const principalName = settings?.principalName || 'Dr. Anjali Sharma';
  const principalMessage = settings?.principalMessage || 'Welcome to our school!';
  const principalPhotoUrl = settings?.principalPhotoUrl || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&fit=crop&q=80';

  useEffect(() => {
    // Fetch announcements & events
    const loadHomeData = async () => {
      try {
        const annData = await apiRequest('/announcements?type=all');
        setAnnouncements(annData.slice(0, 5));
        const evtData = await apiRequest('/events');
        setEvents(evtData.slice(0, 3));
      } catch (error) {
        console.error('Failed to load homepage data:', error);
      }
    };
    loadHomeData();

    // Auto slide transition
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitMsg('Thank you for contacting us! We will get back to you shortly.');
      setName('');
      setEmail('');
      setMessage('');
    }, 1500);
  };

  return (
    <div className="w-full">
      {/* Notice Scroller Ticker */}
      <section className="bg-amber-400 dark:bg-amber-500 text-slate-950 text-xs font-bold py-2 overflow-hidden relative shadow-inner">
        <div className="max-w-7xl mx-auto px-4 flex">
          <span className="bg-red-600 text-white px-2 py-0.5 rounded text-[10px] tracking-wide uppercase shrink-0 mr-3 animate-pulse shadow-sm">
            Latest Announcements:
          </span>
          <div className="overflow-hidden relative w-full flex items-center">
            <div className="animate-marquee whitespace-nowrap flex gap-12">
              {announcements.length > 0 ? (
                announcements.map((ann) => (
                  <span key={ann.id} className="hover:underline cursor-pointer">
                    🚨 {ann.title} ({ann.date}) - {ann.content.slice(0, 100)}...
                  </span>
                ))
              ) : (
                <span>Welcome to {schoolName}! Admissions are open for the session {settings?.academicYear || '2026-2027'}. Contact our office for details.</span>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Hero Banner Slider */}
      <section className="relative w-full h-[55vh] md:h-[70vh] bg-slate-950 overflow-hidden">
        {slides.map((slide, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              idx === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${slide.image})` }}
            />
            {/* Dark overlay */}
            <div className="absolute inset-0 bg-slate-950/60" />
            {/* Text Overlay */}
            <div className="absolute inset-0 flex items-center">
              <div className="max-w-7xl mx-auto px-6 w-full text-left">
                <div className="max-w-2xl text-white flex flex-col gap-4">
                  <span className="text-amber-400 dark:text-amber-400 font-extrabold text-xs tracking-widest uppercase flex items-center gap-1">
                    <Sparkles size={14} /> ADMISSIONS OPEN {settings?.academicYear || '2026-2027'}
                  </span>
                  <h2 className="text-3xl md:text-5xl font-black tracking-tight leading-tight drop-shadow-md">
                    {slide.title}
                  </h2>
                  <p className="text-sm md:text-lg text-slate-200 drop-shadow-sm leading-relaxed">
                    {slide.subtitle}
                  </p>
                  <div className="flex gap-4 mt-2">
                    <Link
                      href="/admissions"
                      className="bg-primary hover:bg-blue-800 text-white font-extrabold px-6 py-3 rounded-md transition-all text-xs flex items-center gap-2 shadow-lg"
                    >
                      Apply Now <ArrowRight size={14} />
                    </Link>
                    <Link
                      href="/about"
                      className="border border-white hover:bg-white/10 text-white font-bold px-6 py-3 rounded-md transition-all text-xs"
                    >
                      Learn More
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Navigation Arrows */}
        <button
          onClick={handlePrevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-slate-900/50 hover:bg-slate-900 text-white cursor-pointer"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          onClick={handleNextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-slate-900/50 hover:bg-slate-900 text-white cursor-pointer"
        >
          <ChevronRight size={20} />
        </button>
      </section>

      {/* Overview Cards (Quick stats) */}
      <section className="bg-slate-100 dark:bg-slate-900 py-10 transition-colors border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-slate-950 p-6 rounded-lg shadow-sm flex items-center gap-4 transition-transform hover:-translate-y-1 border border-slate-200 dark:border-slate-800">
            <div className="p-4 bg-blue-100 dark:bg-blue-900/30 text-primary rounded-full">
              <GraduationCap size={28} />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-slate-800 dark:text-white">Academic Rigor</h3>
              <p className="text-xs text-slate-500 mt-1">Structured CBSE curriculum following active NCERT frameworks.</p>
            </div>
          </div>
          <div className="bg-white dark:bg-slate-950 p-6 rounded-lg shadow-sm flex items-center gap-4 transition-transform hover:-translate-y-1 border border-slate-200 dark:border-slate-800">
            <div className="p-4 bg-amber-100 dark:bg-amber-900/30 text-amber-600 rounded-full">
              <Award size={28} />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-slate-800 dark:text-white">Holistic Growth</h3>
              <p className="text-xs text-slate-500 mt-1">Fostering active participation in sports, co-curricular, and labs.</p>
            </div>
          </div>
          <div className="bg-white dark:bg-slate-950 p-6 rounded-lg shadow-sm flex items-center gap-4 transition-transform hover:-translate-y-1 border border-slate-200 dark:border-slate-800">
            <div className="p-4 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-full">
              <Shield size={28} />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-slate-800 dark:text-white">Secure Environment</h3>
              <p className="text-xs text-slate-500 mt-1">24/7 campus surveillance, strict attendance, and caring staff.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Message from Principal */}
      <section className="py-16 max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 items-center border-b border-slate-200 dark:border-slate-800">
        <div className="md:col-span-1 flex flex-col items-center">
          <div className="relative border-4 border-primary rounded-lg overflow-hidden shadow-lg w-64 h-80">
            <img
              src={principalPhotoUrl}
              alt="Principal"
              className="w-full h-full object-cover object-center"
            />
          </div>
          <h3 className="font-black text-slate-900 dark:text-white mt-4 text-center">{principalName}</h3>
          <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Principal Message</p>
        </div>
        <div className="md:col-span-2 flex flex-col gap-4 text-left">
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white border-l-4 border-secondary pl-3">
            Principal's Desk Message
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-light italic">
            "{principalMessage}"
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 font-medium">
            Warm regards, <br />
            <span className="font-bold text-slate-900 dark:text-white">{principalName}</span> <br />
            Principal, {schoolName}
          </p>
        </div>
      </section>

      {/* Facilities Tab Section */}
      <section className="py-16 bg-slate-50 dark:bg-slate-950 transition-colors border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white mb-2">
            Campus Infrastructure & Facilities
          </h2>
          <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold mb-8">
            Providing modern facilities for smart active learning
          </p>

          {/* Tabs header */}
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {['science', 'computer', 'library', 'sports'].map((tab) => (
              <button
                key={tab}
                onClick={() => setSelectedFacilityTab(tab)}
                className={`px-5 py-2.5 rounded font-extrabold text-xs tracking-wider uppercase transition-all cursor-pointer ${
                  selectedFacilityTab === tab
                    ? 'bg-primary text-white shadow'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-100'
                }`}
              >
                {tab === 'science' && 'Science Labs'}
                {tab === 'computer' && 'Computer Labs'}
                {tab === 'library' && 'Central Library'}
                {tab === 'sports' && 'Sports Arena'}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 p-6 md:p-10 rounded-lg shadow-sm text-left">
            <div className="flex flex-col gap-4">
              {selectedFacilityTab === 'science' && (
                <>
                  <h3 className="text-xl font-extrabold text-slate-800 dark:text-white">Practical Chemistry, Physics & Biology Labs</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Our science laboratories are spacious, well-ventilated, and equipped with the latest scientific specimens, chemical solutions, and equipment designed to safety standards. Guided by expert lab instructors, students conduct active research and experimentation.
                  </p>
                  <ul className="text-xs text-slate-600 dark:text-slate-400 flex flex-col gap-2 font-medium">
                    <li className="flex items-center gap-2">✔ High-grade optical compound microscopes</li>
                    <li className="flex items-center gap-2">✔ Electrical testing circuits, spectrometers, and mirrors</li>
                    <li className="flex items-center gap-2">✔ Comprehensive emergency safety showers and gas pipeline systems</li>
                  </ul>
                </>
              )}
              {selectedFacilityTab === 'computer' && (
                <>
                  <h3 className="text-xl font-extrabold text-slate-800 dark:text-white">High-Speed Technology Center</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    A modern computer workspace with over 45 high-speed desktop terminals. Fitted with broadband fiber internet, projectors, and active smartboard displays.
                  </p>
                  <ul className="text-xs text-slate-600 dark:text-slate-400 flex flex-col gap-2 font-medium">
                    <li className="flex items-center gap-2">✔ Coding & programming tools (Python, Java, scratch)</li>
                    <li className="flex items-center gap-2">✔ Fully air-conditioned environment with ergonomic seating</li>
                    <li className="flex items-center gap-2">✔ Daily classes dedicated to computer application, software development, and AI tools</li>
                  </ul>
                </>
              )}
              {selectedFacilityTab === 'library' && (
                <>
                  <h3 className="text-xl font-extrabold text-slate-800 dark:text-white">Information & Reading Vault</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Our library maintains a collection of over 10,000 reference manuals, curriculum guides, fiction volumes, encyclopedias, and weekly national newspapers.
                  </p>
                  <ul className="text-xs text-slate-600 dark:text-slate-400 flex flex-col gap-2 font-medium">
                    <li className="flex items-center gap-2">✔ Peaceful, well-lit reading halls</li>
                    <li className="flex items-center gap-2">✔ Digital search registers for quick book tracking</li>
                    <li className="flex items-center gap-2">✔ Academic journal subscriptions and research archives</li>
                  </ul>
                </>
              )}
              {selectedFacilityTab === 'sports' && (
                <>
                  <h3 className="text-xl font-extrabold text-slate-800 dark:text-white">Sports Complex & Fields</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Promoting structural athletic growth through a wide array of sport courts including standard concrete basketball courts, football field, cricket training pitch, and indoor rooms for table tennis, gymnastics, and chess.
                  </p>
                  <ul className="text-xs text-slate-600 dark:text-slate-400 flex flex-col gap-2 font-medium">
                    <li className="flex items-center gap-2">✔ Dynamic physical training schedules coached by state-level instructors</li>
                    <li className="flex items-center gap-2">✔ Annual inter-house sporting leagues</li>
                    <li className="flex items-center gap-2">✔ Sports equipment locker arrays available for all grades</li>
                  </ul>
                </>
              )}
            </div>
            <div className="rounded-md overflow-hidden relative shadow h-72 bg-slate-200">
              {selectedFacilityTab === 'science' && <img src="https://images.unsplash.com/photo-1518152006812-edab29b069ac?w=800&fit=crop&q=80" alt="Science Lab" className="w-full h-full object-cover" />}
              {selectedFacilityTab === 'computer' && <img src="https://images.unsplash.com/photo-1547082299-de196ea013d6?w=800&fit=crop&q=80" alt="Computer Lab" className="w-full h-full object-cover" />}
              {selectedFacilityTab === 'library' && <img src="https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=800&fit=crop&q=80" alt="Library" className="w-full h-full object-cover" />}
              {selectedFacilityTab === 'sports' && <img src="https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?w=800&fit=crop&q=80" alt="Sports Field" className="w-full h-full object-cover" />}
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Events Calendar */}
      <section className="py-16 max-w-7xl mx-auto px-4 border-b border-slate-200 dark:border-slate-800">
        <h2 className="text-2xl md:text-3xl font-black text-center text-slate-900 dark:text-white mb-2">
          School News & Events
        </h2>
        <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold text-center mb-10">
          Mark your calendar for upcoming institutional highlights
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {events.length > 0 ? (
            events.map((evt) => (
              <div key={evt.id} className="bg-white dark:bg-slate-950 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm transition-transform hover:-translate-y-1">
                {evt.imageUrl && (
                  <div className="h-44 overflow-hidden relative">
                    <img src={evt.imageUrl} alt={evt.title} className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="p-5 flex flex-col gap-2.5">
                  <div className="flex items-center gap-2 text-[10px] font-bold text-amber-500 uppercase tracking-wider">
                    <Calendar size={12} /> {evt.date} | <Clock size={12} /> {evt.location.slice(0, 20)}
                  </div>
                  <h3 className="font-extrabold text-sm text-slate-800 dark:text-white leading-tight">
                    {evt.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                    {evt.description}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-3 text-center text-slate-500 text-xs py-8 bg-slate-50 dark:bg-slate-900 rounded border border-dashed border-slate-350 dark:border-slate-800">
              No upcoming events declared.
            </div>
          )}
        </div>
      </section>

      {/* Quick Contact & Admission Section */}
      <section className="py-16 bg-slate-900 text-white transition-colors">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Details Column */}
          <div className="flex flex-col gap-6 text-left">
            <div>
              <h2 className="text-2xl md:text-3xl font-black text-white mb-2">
                Have Queries? Reach Out!
              </h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                Contact our administrative officer regarding fee procedures, curriculum, schedules, or admissions registry.
              </p>
            </div>
            <div className="flex flex-col gap-4 text-xs font-light text-slate-300">
              <div className="flex items-center gap-3">
                <MapPin className="text-[var(--secondary-color)]" size={18} />
                <span>{settings?.address || 'Sector 4, Dwarka, New Delhi, Delhi 110075'}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="text-[var(--secondary-color)]" size={18} />
                <span>{settings?.phone || '+91 11 2345 6789'}</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="text-[var(--secondary-color)]" size={18} />
                <span>{settings?.email || 'admissions@abcinternational.edu.in'}</span>
              </div>
            </div>
          </div>

          {/* Form Column */}
          <div className="bg-slate-800 p-6 md:p-8 rounded-lg shadow-lg border border-slate-700">
            <h3 className="font-extrabold text-sm text-white uppercase tracking-wider mb-4">
              Send Message Enquiry
            </h3>
            <form onSubmit={handleContactSubmit} className="flex flex-col gap-4 text-xs">
              <div className="flex flex-col gap-1.5 text-left">
                <label className="font-bold text-slate-400">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-750 focus:border-amber-500 rounded p-2.5 outline-none text-white transition-colors"
                  placeholder="e.g. Ramesh Kumar"
                />
              </div>
              <div className="flex flex-col gap-1.5 text-left">
                <label className="font-bold text-slate-400">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-750 focus:border-amber-500 rounded p-2.5 outline-none text-white transition-colors"
                  placeholder="e.g. ramesh@gmail.com"
                />
              </div>
              <div className="flex flex-col gap-1.5 text-left">
                <label className="font-bold text-slate-400">Enquiry Message</label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-750 focus:border-amber-500 rounded p-2.5 outline-none text-white transition-colors resize-none"
                  placeholder="Explain your query details..."
                />
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-amber-400 hover:bg-amber-500 disabled:bg-slate-600 text-slate-950 font-extrabold py-3 rounded tracking-wider uppercase transition-colors shadow cursor-pointer text-center"
              >
                {submitting ? 'Submitting...' : 'Submit Enquiry'}
              </button>
              {submitMsg && (
                <p className="mt-2 text-emerald-400 font-bold text-center animate-pulse">
                  {submitMsg}
                </p>
              )}
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
