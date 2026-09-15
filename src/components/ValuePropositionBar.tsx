import React from 'react';
import { Award, Leaf, Users, ShieldCheck } from 'lucide-react';

export const ValuePropositionBar: React.FC = () => {
  const pillars = [
    {
      title: 'Premium Quality Products',
      description: 'Tested, authentic formulations directly from certified laboratories',
      icon: Award,
    },
    {
      title: 'Expert Agronomic Support',
      description: 'Crop diagnostics, calibrated dosage, and seasonal guidance',
      icon: Leaf,
    },
    {
      title: 'Trusted by Farmers',
      description: 'Over 25,000 progressive growers across key agricultural belts',
      icon: Users,
    },
    {
      title: 'Sustainable Farming',
      description: 'Balanced crop protection safeguarding soil biology and water tables',
      icon: ShieldCheck,
    },
  ];

  return (
    <section className="bg-[#0B3D1D] text-white py-10 border-y border-emerald-900/50 shadow-inner">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6 divide-y sm:divide-y-0 sm:divide-x divide-emerald-800/60">
          {pillars.map((item, index) => {
            const Icon = item.icon;
            return (
              <div 
                key={index}
                className={`flex items-center gap-4 ${index > 0 ? 'pt-6 sm:pt-0 sm:pl-6' : ''}`}
              >
                <div className="w-13 h-13 rounded-2xl bg-emerald-900/80 border border-emerald-700/50 flex items-center justify-center shrink-0 text-emerald-300">
                  <Icon className="w-6 h-6 stroke-[1.75]" />
                </div>
                <div>
                  <h4 className="font-bold text-base text-emerald-50 tracking-tight">
                    {item.title}
                  </h4>
                  <p className="text-xs text-emerald-300/80 mt-1 leading-snug">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
