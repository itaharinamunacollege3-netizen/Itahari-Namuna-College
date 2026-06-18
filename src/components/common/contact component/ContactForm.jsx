import React, { useState } from 'react';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    department: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Submitted:", formData);
    // Add your email/API submission logic here
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <InputField 
          label="Full Name *" 
          name="fullName" 
          value={formData.fullName} 
          onChange={handleChange} 
          placeholder="Ramesh Sharma" 
        />
        <InputField 
          label="Email Address *" 
          name="email" 
          value={formData.email} 
          onChange={handleChange} 
          placeholder="you@email.com" 
        />
      </div>
      
      <InputField 
        label="Phone Number" 
        name="phone" 
        value={formData.phone} 
        onChange={handleChange} 
        placeholder="+977 98XXXXXXXX" 
      />
      
      <div>
        <label className="block text-sm font-semibold text-stone-700 mb-2">Department / Inquiry Type *</label>
        <select 
          name="department"
          value={formData.department}
          onChange={handleChange}
          className="w-full p-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-[#006A38]/20 outline-none"
        >
          <option value="">Select department</option>
          <option value="admissions">Admissions</option>
          <option value="academic">Academic</option>
          <option value="admin">Administrative</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-semibold text-stone-700 mb-2">Your Message *</label>
        <textarea 
          name="message"
          value={formData.message}
          onChange={handleChange}
          rows="4" 
          className="w-full p-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-[#006A38]/20 outline-none" 
        />
      </div>

      <button 
        type="submit"
        className="w-full bg-[#E67E22] text-white py-4 rounded-xl font-bold hover:bg-[#d35400] transition-colors"
      >
        Send Message →
      </button>
    </form>
  );
}

// Helper component for clean inputs
function InputField({ label, name, value, onChange, placeholder }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-stone-700 mb-2">{label}</label>
      <input 
        type="text" 
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder} 
        className="w-full p-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-[#006A38]/20 outline-none" 
      />
    </div>
  );
}