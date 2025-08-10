import { useState } from 'react';
import { CheckCircle, Mail, User, Search, Briefcase, UserPlus, Loader2 } from 'lucide-react';

import React from 'react';
// Mock Supabase client for demo purposes
const mockSupabase = {
  from: () => ({
    insert: (data) => new Promise((resolve) => {
      setTimeout(() => {
        resolve({ data: data, error: null });
      }, 1500);
    })
  })
};

function WaitlistForm({ onClose }) {
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    found_us: '',
    work: '',
    referred_by_email: '',
  });
  const [submitMessage, setSubmitMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleWaitlistSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage('Submitting...');

    try {
      const { data, error } = await mockSupabase
        .from('waitlist')
        .insert([
          {
            name: formData.name,
            email: formData.email,
            found_us: formData.found_us,
            work: formData.work,
            referred_by_email: formData.referred_by_email || null,
          },
        ]);

      if (error) {
        console.error('Supabase error:', error);
        setSubmitMessage('Error: Something went wrong. Please try again.');
      } else {
        setSubmitMessage(
          `Success! You're on the list. Want to get priority access and exclusive bonuses? Share Heloavy! Tell your colleagues to enter **${formData.email}** in the 'Referred by' field when they sign up.`
        );
        setFormData({ 
          email: '',
          name: '',
          found_us: '',
          work: '',
          referred_by_email: '',
        });
      }
    } catch (err) {
      setSubmitMessage('Error: Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitMessage.includes('Success')) {
    return (
      <div className="min-h-[400px] flex items-center justify-center p-8">
        <div className="text-center max-w-md mx-auto">
          <div className="mb-6 flex justify-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center border border-green-200">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </div>
          <div className="space-y-4">
            {(() => {
              const parts = submitMessage.split('**');
              return (
                <div className="text-gray-700 leading-relaxed">
                  {parts[0]}
                  <span className="font-semibold text-purple-700 bg-purple-50 px-2 py-1 rounded border">
                    {parts[1]}
                  </span>
                  {parts[2]}
                </div>
              );
            })()}
          </div>
          <button 
            onClick={onClose}
            className="mt-6 px-6 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg font-medium transition-colors duration-200 border border-gray-200"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto bg-white">
      {/* Header */}
      <div className="text-center mb-8 pb-6 border-b border-gray-100">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-50 rounded-full mb-4 border border-purple-100">
          <Mail className="w-6 h-6 text-purple-600" />
        </div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Join Our Waitlist</h2>
        <p className="text-gray-600">Be the first to know when Heloavy launches</p>
      </div>

      <div className="space-y-6">
        <div className="space-y-5">
          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-1 focus:ring-purple-500 focus:border-purple-500 transition-colors duration-200 bg-white"
                placeholder="your@email.com"
              />
            </div>
          </div>

          {/* Name Field */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Your Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-1 focus:ring-purple-500 focus:border-purple-500 transition-colors duration-200 bg-white"
                placeholder="Your Name"
              />
            </div>
          </div>

          {/* How did you find us */}
          <div>
            <label htmlFor="found_us" className="block text-sm font-medium text-gray-700 mb-2">
              How did you find us? <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <select
                id="found_us"
                name="found_us"
                value={formData.found_us}
                onChange={handleChange}
                required
                className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-1 focus:ring-purple-500 focus:border-purple-500 transition-colors duration-200 bg-white appearance-none"
              >
                <option value="">Select an option</option>
                <option value="Social Media">Social Media</option>
                <option value="Search Engine">Search Engine</option>
                <option value="Friend/Colleague">Friend/Colleague</option>
                <option value="Event/Conference">Event/Conference</option>
                <option value="Other">Other</option>
              </select>
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Work Description */}
          <div>
            <label htmlFor="work" className="block text-sm font-medium text-gray-700 mb-2">
              What kind of work are you looking for Heloavy to do? <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Briefcase className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <textarea
                id="work"
                name="work"
                value={formData.work}
                onChange={handleChange}
                required
                rows={4}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-1 focus:ring-purple-500 focus:border-purple-500 transition-colors duration-200 bg-white resize-none"
                placeholder="Describe the project or services you need..."
              />
            </div>
          </div>

          {/* Referred by */}
          <div>
            <label htmlFor="referred_by_email" className="block text-sm font-medium text-gray-700 mb-2">
              Referred By Email <span className="text-sm text-gray-500">(optional)</span>
            </label>
            <div className="relative">
              <UserPlus className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="email"
                id="referred_by_email"
                name="referred_by_email"
                value={formData.referred_by_email}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-1 focus:ring-purple-500 focus:border-purple-500 transition-colors duration-200 bg-white"
                placeholder="referrer@email.com"
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4 border-t border-gray-100">
          <button 
            type="button" 
            onClick={handleWaitlistSubmit}
            disabled={isSubmitting || !formData.email || !formData.name || !formData.found_us || !formData.work}
            className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Joining Waitlist...
              </>
            ) : (
              'Join Waitlist'
            )}
          </button>
        </div>

        {/* Status Message */}
        {submitMessage && !submitMessage.includes('Success') && (
          <div className={`p-4 rounded-lg text-center font-medium border ${
            submitMessage.includes('Error') 
              ? 'bg-red-50 text-red-700 border-red-200' 
              : 'bg-blue-50 text-blue-700 border-blue-200'
          }`}>
            {submitMessage}
          </div>
        )}

        {/* Footer note */}
        <div className="text-xs text-gray-500 text-center pt-2 border-t border-gray-50">
          We respect your privacy. Unsubscribe at any time.
        </div>
      </div>
    </div>
  );
}

export default WaitlistForm;