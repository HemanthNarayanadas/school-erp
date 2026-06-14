'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import { Mail, Phone, MapPin, GraduationCap } from 'lucide-react';

const FacebookIcon: React.FC = () => (
  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
  </svg>
);

const TwitterIcon: React.FC = () => (
  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const InstagramIcon: React.FC = () => (
  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
  </svg>
);

const LinkedinIcon: React.FC = () => (
  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
  </svg>
);

export const Footer: React.FC = () => {
  const { settings } = useAuth();
  const schoolName = settings?.schoolName || 'ABC International School';
  const address = settings?.address || '123 Academic Street, Education Zone, City';
  const phone = settings?.phone || '+91 98765 43210';
  const email = settings?.email || 'info@abcinternational.edu.in';

  const socialFacebook = settings?.socialFacebook || 'https://facebook.com';
  const socialTwitter = settings?.socialTwitter || 'https://twitter.com';
  const socialInstagram = settings?.socialInstagram || 'https://instagram.com';
  const socialLinkedin = settings?.socialLinkedin || 'https://linkedin.com';

  return (
    <footer className="bg-slate-900 text-slate-300 transition-colors">
      {/* Top Footer Sections */}
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        
        {/* School Overview */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 text-white font-extrabold text-lg">
            <div className="w-8 h-8 rounded bg-slate-800 flex items-center justify-center text-[var(--secondary-color)] shadow">
              <GraduationCap size={20} />
            </div>
            <span>{schoolName}</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Nurturing young minds, instilling morals, and empowering students with knowledge and scientific temper to lead the global landscape.
          </p>
          {/* Social Links */}
          <div className="flex gap-3 mt-2">
            <a href={socialFacebook} target="_blank" rel="noopener noreferrer" className="p-2 bg-slate-800 hover:bg-[var(--primary-color)] hover:text-white rounded transition-colors text-slate-400 flex items-center justify-center">
              <FacebookIcon />
            </a>
            <a href={socialTwitter} target="_blank" rel="noopener noreferrer" className="p-2 bg-slate-800 hover:bg-[var(--primary-color)] hover:text-white rounded transition-colors text-slate-400 flex items-center justify-center">
              <TwitterIcon />
            </a>
            <a href={socialInstagram} target="_blank" rel="noopener noreferrer" className="p-2 bg-slate-800 hover:bg-[var(--primary-color)] hover:text-white rounded transition-colors text-slate-400 flex items-center justify-center">
              <InstagramIcon />
            </a>
            <a href={socialLinkedin} target="_blank" rel="noopener noreferrer" className="p-2 bg-slate-800 hover:bg-[var(--primary-color)] hover:text-white rounded transition-colors text-slate-400 flex items-center justify-center">
              <LinkedinIcon />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-4 border-l-2 border-[var(--secondary-color)] pl-2">
            Quick Links
          </h3>
          <ul className="text-xs flex flex-col gap-2.5">
            <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
            <li><Link href="/about" className="hover:text-white transition-colors">About Us & Vision</Link></li>
            <li><Link href="/academics" className="hover:text-white transition-colors">Academics & Curriculum</Link></li>
            <li><Link href="/admissions" className="hover:text-white transition-colors">Admissions Portal</Link></li>
            <li><Link href="/gallery" className="hover:text-white transition-colors">School Gallery</Link></li>
            <li><Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
          </ul>
        </div>

        {/* Contact Information */}
        <div className="flex flex-col gap-3">
          <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-1 border-l-2 border-[var(--secondary-color)] pl-2">
            Get In Touch
          </h3>
          <div className="text-xs flex flex-col gap-3 text-slate-400">
            <div className="flex items-start gap-2.5">
              <MapPin size={16} className="text-[var(--secondary-color)] mt-0.5 shrink-0" />
              <span>{address}</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Phone size={14} className="text-[var(--secondary-color)] shrink-0" />
              <span>{phone}</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Mail size={14} className="text-[var(--secondary-color)] shrink-0" />
              <span>{email}</span>
            </div>
          </div>
        </div>

        {/* Google Map Mini Placeholder */}
        <div>
          <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-4 border-l-2 border-[var(--secondary-color)] pl-2">
            Location Map
          </h3>
          <div className="rounded overflow-hidden border border-slate-800 h-28 bg-slate-800 relative flex items-center justify-center">
            {/* Simple simulated maps representation or clean placeholder */}
            <div className="text-[10px] text-center p-3 text-slate-400">
              <MapPin size={24} className="mx-auto text-red-500 mb-1" />
              <span>Sector 4, Dwarka, New Delhi</span>
            </div>
          </div>
        </div>

      </div>

      {/* Bottom bar */}
      <div className="bg-slate-950 text-slate-500 py-6 border-t border-slate-800 text-center text-[10px]">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p>© {new Date().getFullYear()} {schoolName}. All rights reserved.</p>
          <p className="text-slate-600">
            Designed to match premium educational systems. Enabled with JWT auth and Postgres RBAC.
          </p>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
