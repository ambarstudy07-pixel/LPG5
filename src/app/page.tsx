'use client';

import { RefreshCw, PlusCircle, ChevronDown, Loader2 } from "lucide-react";
import { useState } from "react";

export default function Home() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  
  const [formData, setFormData] = useState({
    dateOfEntry: new Date().toISOString().split('T')[0],
    agencyName: '',
    omcName: '',
    domesticReceived: 0,
    domesticDistributed: 0,
    commercialReceived: 0,
    commercialDistributed: 0,
    industrialReceived: 0,
    industrialDistributed: 0,
    startingStock: 0,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    try {
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: 'Data submitted successfully to Google Sheets!' });
        // Reset form except date and agency
        setFormData(prev => ({
          ...prev,
          omcName: '',
          domesticReceived: 0,
          domesticDistributed: 0,
          commercialReceived: 0,
          commercialDistributed: 0,
          industrialReceived: 0,
          industrialDistributed: 0,
          startingStock: 0,
        }));
      } else {
        setMessage({ type: 'error', text: result.message || 'Failed to submit data.' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An error occurred during submission.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 font-sans text-gray-800">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 px-2">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">LPG District Brain</h1>
            <p className="text-gray-500 font-medium mt-1">Comprehensive analysis and dashboard for LPG agencies.</p>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => window.location.reload()}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
            >
              <RefreshCw className="w-6 h-6" />
            </button>
          
          </div>
        </header>

        {/* Main Content Card */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
          <div className="p-8">
            <div className="flex items-center gap-2 text-blue-600 mb-8 border-b border-gray-100 pb-4">
              <PlusCircle className="w-6 h-6" />
              <h2 className="text-xl font-bold text-gray-900">Log Daily Transaction</h2>
            </div>

            {message && (
              <div className={`mb-6 p-4 rounded-lg text-sm font-medium ${
                message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
              }`}>
                {message.text}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Top Row: Date and Agency */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-gray-700">Date of Entry</label>
                  <div className="relative">
                    <input
                      required
                      type="date"
                      name="dateOfEntry"
                      value={formData.dateOfEntry}
                      onChange={handleChange}
                      className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50/50"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-gray-700">Agency Name/ID</label>
                  <div className="relative">
                    <select
                      required
                      name="agencyName"
                      value={formData.agencyName}
                      onChange={handleChange}
                      className="w-full border border-gray-200 rounded-lg px-4 py-3 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50/50"
                    >
                      <option value="">Select Agency</option>
                      <option value="Agency 1">Agency 1</option>
                      <option value="Agency 2">Agency 2</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* OMC Name */}
              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-700">OMC Name (IOCL/BPCL/HPCL)</label>
                <div className="relative">
                  <select
                    required
                    name="omcName"
                    value={formData.omcName}
                    onChange={handleChange}
                    className="w-full border border-gray-200 rounded-lg px-4 py-3 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50/50"
                  >
                    <option value="">Select OMC</option>
                    <option value="IOCL">IOCL</option>
                    <option value="BPCL">BPCL</option>
                    <option value="HPCL">HPCL</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* Grid of Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Domestic */}
                <div className="border border-gray-100 rounded-xl p-6 bg-gray-50/30">
                  <h3 className="text-sm font-black text-gray-400 uppercase tracking-wider mb-4">Domestic (14.2 KG)</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-400 mb-1">Received</label>
                      <input
                        type="number"
                        min="0"
                        name="domesticReceived"
                        value={formData.domesticReceived}
                        onChange={handleChange}
                        className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-400 mb-1">Distributed</label>
                      <input
                        type="number"
                        min="0"
                        name="domesticDistributed"
                        value={formData.domesticDistributed}
                        onChange={handleChange}
                        className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Commercial */}
                <div className="border border-gray-100 rounded-xl p-6 bg-gray-50/30">
                  <h3 className="text-sm font-black text-gray-400 uppercase tracking-wider mb-4">Commercial (19 KG)</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-400 mb-1">Received</label>
                      <input
                        type="number"
                        min="0"
                        name="commercialReceived"
                        value={formData.commercialReceived}
                        onChange={handleChange}
                        className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-400 mb-1">Distributed</label>
                      <input
                        type="number"
                        min="0"
                        name="commercialDistributed"
                        value={formData.commercialDistributed}
                        onChange={handleChange}
                        className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Industrial */}
                <div className="border border-gray-100 rounded-xl p-6 bg-gray-50/30">
                  <h3 className="text-sm font-black text-gray-400 uppercase tracking-wider mb-4">Industrial (47.5 KG)</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-400 mb-1">Received</label>
                      <input
                        type="number"
                        min="0"
                        name="industrialReceived"
                        value={formData.industrialReceived}
                        onChange={handleChange}
                        className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-400 mb-1">Distributed</label>
                      <input
                        type="number"
                        min="0"
                        name="industrialDistributed"
                        value={formData.industrialDistributed}
                        onChange={handleChange}
                        className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Starting Stock */}
              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-700">Starting Stock (only for new agency setup)</label>
                <input
                  type="number"
                  min="0"
                  name="startingStock"
                  value={formData.startingStock}
                  onChange={handleChange}
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50/50"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-colors shadow-lg shadow-blue-200 text-lg cursor-pointer flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Submitting...
                  </>
                ) : 'Submit to Google Sheets'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
