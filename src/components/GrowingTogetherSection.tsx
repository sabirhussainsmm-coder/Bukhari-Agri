import React from 'react';
import { ArrowRight, Activity, TrendingUp, Sprout, HeartHandshake } from 'lucide-react';

interface GrowingTogetherSectionProps {
  onLearnMore: () => void;
}

export const GrowingTogetherSection: React.FC<GrowingTogetherSectionProps> = ({
  onLearnMore,
}) => {
  const values = [
    {
      title: 'Better Crop Health',
      desc: 'Targeted pest and disease protection preserving vegetative leaf area',
      icon: Activity,
    },
    {
      title: 'Higher Productivity',
      desc: 'Optimized grain formation, boll counts, and maximum harvest tonnage',
      icon: TrendingUp,
    },
    {
      title: 'Eco-Friendly Solutions',
      desc: 'Selective chemistries that minimize environmental impact and runoff',
      icon: Sprout,
    },
    {
      title: 'Farmer Empowerment',
      desc: 'Accessible advisory, transparent pricing, and trusted multi-brand supply',
      icon: HeartHandshake,
    },
  ];

  return (
    <section className="py-16 sm:py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Visual with Organic Leaf Curved Frame (Matching image.png) */}
          <div className="lg:col-span-6 relative flex justify-center">
            <div className="relative w-full max-w-lg">
              
              {/* Organic Leaf-shaped frame mask using Tailwind custom radii */}
              <div className="relative overflow-hidden rounded-[40px] sm:rounded-[60px] rounded-tr-[120px] rounded-bl-[120px] border-4 border-emerald-100 shadow-2xl aspect-4/3 sm:aspect-square bg-emerald-900">
                <img
                  src="/images/farmer-field.jpg"
                  alt="Farmer wearing straw hat inspecting lush crops in green field"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              </div>

              {/* Floating Leaf Accent at Top Right of Frame (as in image.png) */}
              <div className="absolute -top-4 -right-2 sm:-right-4 w-16 h-16 bg-[#16A34A] rounded-full rounded-tr-none flex items-center justify-center shadow-lg border-2 border-white transform rotate-12">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/>
                  <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>
                </svg>
              </div>

              {/* Agronomist Advisory Callout Pill */}
              <div className="absolute -bottom-4 left-6 sm:left-10 bg-white/95 backdrop-blur-md rounded-2xl py-3 px-5 border border-emerald-100 shadow-xl flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
                <span className="text-xs sm:text-sm font-bold text-slate-800">
                  On-Farm Crop Advisory Available Across Punjab
                </span>
              </div>
            </div>
          </div>

          {/* Right Narrative & Bullet Points (Matching image.png) */}
          <div className="lg:col-span-6 space-y-6">
            <div className="text-xs sm:text-sm font-bold tracking-wider text-emerald-800 uppercase">
              ABOUT BUKHARI AGRO
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Growing Agriculture <br />
              <span className="text-[#16A34A]">Together</span>
            </h2>

            <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
              Bukhari Agro is committed to supporting farmers with innovative and reliable agro solutions. We believe in sustainable farming, advanced crop care and a greener future for generations to come.
            </p>

            {/* 4 Value Badges (as in image.png) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {values.map((v, i) => {
                const Icon = v.icon;
                return (
                  <div 
                    key={i} 
                    className="flex items-start gap-3 p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-100/70 hover:bg-emerald-50 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-slate-900">
                        {v.title}
                      </h4>
                      <p className="text-xs text-slate-600 mt-0.5 leading-snug">
                        {v.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Learn More Button */}
            <div className="pt-2">
              <button
                onClick={onLearnMore}
                className="inline-flex items-center gap-2 bg-[#1B5E20] hover:bg-[#154b1a] text-white font-semibold px-7 py-3.5 rounded-full shadow-md shadow-emerald-900/10 transition-all duration-200 transform hover:-translate-y-0.5"
                id="about-learn-more-btn"
              >
                <span>Learn More</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
