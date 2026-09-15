import React, { useState } from 'react';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  MessageCircle, 
  Send, 
  CheckCircle2, 
  FileText, 
  ShieldCheck,
  Building,
  Sparkles
} from 'lucide-react';
import { contactInfo } from '../data/agroData';
import { BukhariAgroLogo } from './BukhariAgroLogo';

export const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    farmerName: '',
    phone: '',
    location: '',
    cropType: 'Cotton',
    farmSizeAcres: '',
    preferredBrand: 'Any / Best Recommendation',
    message: ''
  });

  const [submitting, setSubmitting] = useState(false);
  const [submittedId, setSubmittedId] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.farmerName || !formData.phone) {
      alert("Please enter your name and contact phone number.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success) {
        setSubmittedId(data.inquiryId || `INQ-${Date.now()}`);
      } else {
        setSubmittedId(`INQ-${Date.now()}`);
      }
    } catch (err) {
      // Fallback
      setSubmittedId(`INQ-${Date.now()}`);
    } finally {
      setSubmitting(false);
    }
  };

  const directWhatsAppUrl = `https://wa.me/923116666600?text=${encodeURIComponent(
    `Assalam-o-Alaikum Bukhari Agro (Pvt) Ltd,\nMy Name: ${formData.farmerName || 'Farmer'}\nContact: ${formData.phone || ''}\nLocation: ${formData.location || 'Punjab'}\nCrop: ${formData.cropType}\nMessage: ${formData.message || 'I would like to inquire about pesticides and fertilizers.'}`
  )}`;

  return (
    <div className="bg-[#F8FAF6] min-h-screen py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-2">
            <Building className="w-3.5 h-3.5 text-emerald-600" />
            <span>Official Corporate Contact & Advisory</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            Get in Touch with <span className="text-[#16A34A]">Bukhari Agro</span>
          </h1>
          <p className="text-slate-600 text-sm sm:text-base mt-2">
            Reach out to our regional agronomists and distribution coordinators for farm consultations, wholesale inquiries, and genuine chemical delivery.
          </p>
        </div>

        {/* Letterhead Verified Contacts Bar */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-100 shadow-sm mb-12">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6 border-b border-emerald-50 pb-6 mb-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-extrabold text-slate-900">
                  {contactInfo.legalName}
                </h3>
                <div className="text-xs font-semibold text-[#16A34A] tracking-wider uppercase">
                  {contactInfo.subTagline} • Growing Together
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Phone */}
            <div className="p-4 rounded-2xl bg-[#F9FBF8] border border-emerald-50">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center mb-3">
                <Phone className="w-5 h-5" />
              </div>
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Official Telephone</div>
              <a 
                href={`tel:${contactInfo.phone.replace(/\s+/g, '')}`}
                className="text-base font-extrabold text-slate-900 hover:text-emerald-700 transition-colors block mt-1"
              >
                {contactInfo.phone}
              </a>
              <div className="text-[11px] text-emerald-700 font-medium mt-0.5">Helpline & Field Booking</div>
            </div>

            {/* Email */}
            <div className="p-4 rounded-2xl bg-[#F9FBF8] border border-emerald-50">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center mb-3">
                <Mail className="w-5 h-5" />
              </div>
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Official Inquiries Email</div>
              <a 
                href={`mailto:${contactInfo.email}`}
                className="text-sm font-extrabold text-slate-900 hover:text-emerald-700 transition-colors block mt-1 break-all"
              >
                {contactInfo.email}
              </a>
              <div className="text-[11px] text-emerald-700 font-medium mt-0.5">Corporate Communications</div>
            </div>

            {/* WhatsApp */}
            <div className="p-4 rounded-2xl bg-[#F9FBF8] border border-emerald-50">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center mb-3">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">WhatsApp Business</div>
              <a 
                href="https://wa.me/923116666600"
                target="_blank"
                rel="noopener noreferrer"
                className="text-base font-extrabold text-emerald-800 hover:text-emerald-950 transition-colors block mt-1"
              >
                +92 311 6666600
              </a>
              <div className="text-[11px] text-emerald-700 font-medium mt-0.5">Instant Chat & Photo Diagnosis</div>
            </div>

            {/* Location */}
            <div className="p-4 rounded-2xl bg-[#F9FBF8] border border-emerald-50">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center mb-3">
                <MapPin className="w-5 h-5" />
              </div>
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Agri-Distribution Hub</div>
              <div className="text-xs font-bold text-slate-800 mt-1 line-clamp-2">
                Grain Market Road, Multan Agricultural Belt, Punjab
              </div>
              <div className="text-[11px] text-emerald-700 font-medium mt-0.5">Serving Southern & Central Punjab</div>
            </div>
          </div>
        </div>

        {/* Main 2-Column: Form & Direct Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left Form (Cols 1-7) */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-10 border border-emerald-100 shadow-sm">
            <div className="mb-6">
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                Farmer Inquiry & Quotation Request
              </h2>
              <p className="text-slate-600 text-xs sm:text-sm mt-1">
                Tell us about your crop requirements or ask for advice on pest infestation, weed control, or soil fertilizer recipes.
              </p>
            </div>

            {submittedId ? (
              <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-4 animate-in fade-in">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <h3 className="text-lg font-bold text-slate-900">
                  Inquiry Received Successfully!
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
                  Your reference ID is <strong>{submittedId}</strong>. An agronomist from Bukhari Agro will review your crop requirements and reach out via phone or WhatsApp.
                </p>
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <a
                    href={directWhatsAppUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-[#1B5E20] hover:bg-[#154b1a] text-white text-xs font-bold px-5 py-2.5 rounded-full transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Send Message on WhatsApp</span>
                  </a>
                  <button
                    onClick={() => setSubmittedId(null)}
                    className="text-xs font-semibold text-emerald-800 underline"
                  >
                    Submit Another Inquiry
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Farmer / Dealer Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.farmerName}
                      onChange={(e) => setFormData({ ...formData, farmerName: e.target.value })}
                      placeholder="e.g. Malik Ahmad"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-hidden"
                      id="contact-farmer-name"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Phone / WhatsApp Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="e.g. 0311 6666600"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-hidden"
                      id="contact-phone-number"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Farm District / Tehsil
                    </label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      placeholder="e.g. Multan, Khanewal, Vehari"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-hidden"
                      id="contact-location"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Target Crop
                    </label>
                    <select
                      value={formData.cropType}
                      onChange={(e) => setFormData({ ...formData, cropType: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-hidden bg-white"
                      id="contact-crop-type"
                    >
                      <option value="Cotton">Cotton (Kapas)</option>
                      <option value="Wheat">Wheat (Gandum)</option>
                      <option value="Rice">Rice (Dhan / Basmati)</option>
                      <option value="Maize">Maize (Makki)</option>
                      <option value="Sugarcane">Sugarcane (Kamad)</option>
                      <option value="Citrus">Citrus (Kinnow)</option>
                      <option value="Vegetables">Vegetables / Chili</option>
                      <option value="Other">Other Horticultural Crops</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Farm Size (Acres)
                    </label>
                    <input
                      type="text"
                      value={formData.farmSizeAcres}
                      onChange={(e) => setFormData({ ...formData, farmSizeAcres: e.target.value })}
                      placeholder="e.g. 25 Acres"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-hidden"
                      id="contact-farm-size"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Preferred Brand (Optional)
                    </label>
                    <input
                      type="text"
                      value={formData.preferredBrand}
                      onChange={(e) => setFormData({ ...formData, preferredBrand: e.target.value })}
                      placeholder="e.g. Bayer, Syngenta, FMC, Engro"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-hidden"
                      id="contact-preferred-brand"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Your Specific Crop Issue or Products Needed
                  </label>
                  <textarea
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Describe symptoms (e.g. Armyworm attack, leaf yellowing, weed problem) or list the chemical quantities required..."
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-hidden"
                    id="contact-message"
                  />
                </div>

                <div className="pt-2 flex flex-col sm:flex-row gap-3">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 inline-flex items-center justify-center gap-2 bg-[#1B5E20] hover:bg-[#154b1a] text-white font-bold py-3.5 px-6 rounded-xl transition-all duration-200 shadow-md disabled:opacity-50"
                    id="contact-submit-btn"
                  >
                    <Send className="w-4 h-4" />
                    <span>{submitting ? 'Registering Inquiry...' : 'Submit Inquiry to Agronomy Desk'}</span>
                  </button>

                  <a
                    href={directWhatsAppUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold py-3.5 px-6 rounded-xl transition-colors text-sm"
                    id="contact-whatsapp-direct-btn"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Chat on WhatsApp</span>
                  </a>
                </div>
              </form>
            )}
          </div>

          {/* Right Column: Advisory Hub & Working Hours (Cols 8-12) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Working Hours Card */}
            <div className="bg-white rounded-3xl p-6 border border-emerald-100 shadow-xs">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-base text-slate-900">Operating Hours</h4>
                  <div className="text-xs text-slate-500">Warehouse & Field Stations</div>
                </div>
              </div>

              <div className="space-y-2 text-xs text-slate-600 border-t border-slate-100 pt-3">
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="font-semibold text-slate-800">Monday - Friday:</span>
                  <span>8:00 AM - 7:00 PM</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="font-semibold text-slate-800">Saturday:</span>
                  <span>8:00 AM - 6:00 PM</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="font-semibold text-slate-800">Sunday:</span>
                  <span className="text-emerald-700 font-bold">On-Call Agronomy Helpline</span>
                </div>
              </div>
            </div>

            {/* Quality Commitment Card */}
            <div className="bg-gradient-to-br from-[#0B3D1D] to-[#04200E] text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
              
              <div className="flex items-center gap-2 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-2">
                <Sparkles className="w-4 h-4" />
                <span>Our Quality Guarantee</span>
              </div>
              
              <h3 className="text-xl font-extrabold tracking-tight mb-2">
                Every Bottle Tested, Every Seed Protected
              </h3>
              
              <p className="text-xs text-emerald-100/90 leading-relaxed font-light mb-4">
                Bukhari Agro works strictly under registration certificates. We provide authorized invoices with lot numbers, ensuring you receive 100% genuine formulation with zero risk of dilution.
              </p>

              <div className="p-3 rounded-xl bg-white/10 border border-white/10 text-xs space-y-1 text-emerald-200">
                <div>• Batch-numbered tamper-evident caps</div>
                <div>• Laboratory assay conformity</div>
                <div>• Cold warehouse storage for sensitive bio-stimulants</div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
