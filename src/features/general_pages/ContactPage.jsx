// src/features/contact/pages/ContactPage.jsx
import React from 'react';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import ContactForm from '../../components/common/contact component/ContactForm';
import PageBanner from '../../components/common/PageBanner';
import AnimatedSection from '../../components/animations/AnimatedSection';

export default function ContactPage() {
  return (
    <AnimatedSection>
      <div className="w-full min-h-screen bg-stone-50 space-y-12 pb-20">
        {/* Banner */}
        <PageBanner title="Contact Us" subtitle="Reach our admissions, academic, or administrative teams. We respond within 1 working day." />

        <div className="max-w-7xl mx-auto px-6 -mt-10 grid lg:grid-cols-2 gap-8">
          {/* Left: Map & Info */}
          <div className="space-y-6">
            <div className="h-96 w-full rounded-3xl overflow-hidden border border-stone-200">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3565.9215673516514!2d87.27314247543043!3d26.650993576804098!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39ef6dd263d32fa7%3A0x60a68c89ed3190b4!2sItahari%20Namuna%20College!5e0!3m2!1sen!2snp!4v1781598690507!5m2!1sen!2snp" // Paste the link from Google Maps here
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoCard icon={<MapPin size={20} />} title="Address" text="Kathmandu, Bagmati Province, Nepal" />
              <InfoCard icon={<Phone size={20} />} title="Phone" text="+977-01-4567890 / 4567891" />
              <InfoCard icon={<Mail size={20} />} title="Email" text="info@everestcampus.edu.np" />
              <InfoCard icon={<Clock size={20} />} title="Hours" text="Sun-Fri: 7:00 AM – 5:00 PM" />
            </div>
          </div>

          {/* Right: Form */}
          <div className="bg-white p-8 rounded-3xl border border-stone-200 shadow-sm">
            <h2 className="text-2xl font-bold text-stone-800 mb-6">Send a Message</h2>
            <ContactForm />
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}

function InfoCard({ icon, title, text }) {
  return (
    <div className="bg-white p-5 rounded-2xl border border-stone-200 flex gap-4 items-start">
      <div className="text-[#006A38] mt-1">{icon}</div>
      <div>
        <h4 className="text-xs font-bold uppercase text-stone-400 tracking-wider mb-1">{title}</h4>
        <p className="text-sm text-stone-700">{text}</p>
      </div>
    </div>
  );
}