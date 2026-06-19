import { useState } from 'react';
import { toast } from 'react-hot-toast';
export default function ContactForm() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    department: '',
    message: ''
  });
  const validateForm = () => {
    if (!formData.fullName.trim()) {
      toast.error('Full Name is required.');
      return false;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      toast.error('Please enter a valid email address.');
      return false;
    }
    // 3. Phone Validation
    if (formData.phone.trim() !== '') {
      // Remove '+' and any spaces to get the raw numbers
      const rawNumber = formData.phone.trim().replace('+', '').replace(/\s/g, '');

      // Check if it's only digits and meets the length requirement (10 or 13)
      const isValidLength = rawNumber.length === 10 || rawNumber.length === 13;
      const isOnlyDigits = /^\d+$/.test(rawNumber);

      if (!isOnlyDigits || !isValidLength) {
        toast.error('Enter a valid Number.');
        return false;
      }
    }
    if (!formData.department) {
      toast.error('Please select a department.');
      return false;
    }
    if (!formData.message.trim()) {
      toast.error('Message cannot be empty.');
      return false;
    }
    return true;
  };
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return; // Stop submission if validation fails

    setIsSubmitting(true); // Start loading

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/contacts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        toast.success('Message sent! We will be in touch.');
        setFormData({ fullName: '', email: '', phone: '', department: '', message: '' });
      } else {
        throw new Error();
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false); // Always stop loading, whether success or fail
    }
  };
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <InputField
          label="Full Name *"
          name="fullName"
          type="text"
          value={formData.fullName}
          onChange={handleChange}
          placeholder="Your Full Name"
        />
        <InputField
          label="Email Address *"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter your email address"
        />
      </div>

      <InputField
        label="Phone Number"
        name="phone"
        type="tel"
        value={formData.phone}
        onChange={handleChange}
        placeholder="Your phone number"
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
        disabled={status === 'submitting'}
        className={`w-full py-4 rounded-xl cursor-pointer font-bold text-white transition-colors ${status === 'submitting' ? 'bg-stone-400 cursor-not-allowed' : 'bg-[#E67E22] hover:bg-[#d35400]'}`}
      >
        Send Message →
      </button>
      {status === 'success' && <p className="text-green-600 text-sm mt-2">Message sent successfully!</p>}
      {status === 'error' && <p className="text-red-600 text-sm mt-2">Failed to send. Please try again.</p>}
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