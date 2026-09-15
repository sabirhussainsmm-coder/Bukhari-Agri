import React from 'react';
import { ArrowRight, Sparkles, CheckCircle2, Shield } from 'lucide-react';

interface HeroSectionProps {
  onExploreProducts: () => void;
  onAboutUs: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onExploreProducts,
  onAboutUs,
}) => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-emerald-50/70 via-white to-emerald-50/30 pt-10 pb-16 lg:pt-16 lg:pb-24">
      {/* Subtle organic background foliage glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-200/30 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute -bottom-10 left-10 w-80 h-80 bg-lime-100/40 rounded-full blur-2xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Hero Content Column (as formatted in image.png) */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Tagline Eyebrow */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100/80 border border-emerald-200 text-emerald-900 text-xs sm:text-sm font-semibold tracking-wider uppercase">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>HEALTHY CROPS | HIGHER YIELDS | A GREENER TOMORROW</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl xl:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.12]">
              Smart Solutions <br className="hidden sm:inline" />
              for <span className="text-[#16A34A] drop-shadow-xs">Stronger Farms</span>
            </h1>

            {/* Subtext */}
            <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              We provide high-quality pesticides, fertilizers and crop care products to help farmers grow more, healthier crops and build a sustainable future.
            </p>

            {/* Multi-brand quick note */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-1 text-xs text-slate-500 font-medium">
              <span className="flex items-center gap-1.5 text-emerald-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Authorized Multi-Brand Distributor
              </span>
              <span className="flex items-center gap-1.5 text-emerald-800">
                <Shield className="w-4 h-4 text-emerald-600" /> 100% Genuine Lab-Certified Stock
              </span>
            </div>

            {/* CTA Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <button
                onClick={onExploreProducts}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-[#1B5E20] hover:bg-[#154b1a] text-white font-semibold px-8 py-3.5 rounded-full shadow-lg shadow-emerald-900/15 transition-all duration-200 transform hover:-translate-y-0.5 text-base"
                id="hero-explore-products-btn"
              >
                <span>Explore Products</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onAboutUs}
                className="w-full sm:w-auto inline-flex items-center justify-center bg-[#E8EED9] hover:bg-[#dce3ca] text-[#2E4A28] border border-[#cbd6b3] font-semibold px-8 py-3.5 rounded-full transition-all duration-200 text-base"
                id="hero-about-us-btn"
              >
                About Us
              </button>
            </div>
          </div>

          {/* Right Visual Image & Floating Badge (Matching image.png) */}
          <div className="lg:col-span-5 relative flex justify-center">
            <div className="relative w-full max-w-md lg:max-w-none">
              {/* Main Sprout Imagery with organic rounded contour */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white aspect-4/3 sm:aspect-square lg:aspect-4/3 group">
                <img
                  src="/images/hero-sprout.jpg"
                  alt="Healthy green crop sprout growing from fertile agricultural soil"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              </div>

              {/* Floating Aesthetic Badge ("Better Crops, Better Tomorrow" as seen in image.png) */}
              <div className="absolute -bottom-5 right-2 sm:-right-4 bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-xl border border-emerald-100 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-3 duration-500">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700 shrink-0">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/>
                    <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>
                  </svg>
                </div>
                <div>
                  <div className="font-['Plus_Jakarta_Sans',sans-serif] font-extrabold text-slate-800 text-sm tracking-tight italic">
                    Better Crops
                  </div>
                  <div className="font-['Plus_Jakarta_Sans',sans-serif] font-bold text-emerald-700 text-xs italic">
                    Better Tomorrow
                  </div>
                </div>
              </div>

              {/* Floating Quality Seal */}
              <div className="absolute -top-4 -left-3 bg-[#1B5E20] text-white rounded-full px-3.5 py-1.5 text-xs font-bold shadow-lg flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-300"></span>
                <span>Bukhari Agro Standard</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
