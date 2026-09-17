import React from 'react';
import { 
  Tractor, 
  ArrowRight, 
  ShieldCheck, 
  Zap, 
  Cpu, 
  Wrench, 
  CheckCircle2, 
  ExternalLink,
  MessageCircle
} from 'lucide-react';
import { AgriMachine } from '../types';

interface AgriMachinerySectionProps {
  machines: AgriMachine[];
  onSelectMachine: (machine: AgriMachine) => void;
  onViewAllMachinery: () => void;
}

export const AgriMachinerySection: React.FC<AgriMachinerySectionProps> = ({
  machines,
  onSelectMachine,
  onViewAllMachinery
}) => {
  const displayMachines = machines.slice(0, 4);

  return (
    <section className="py-16 sm:py-20 bg-slate-900 text-white relative overflow-hidden">
      {/* Subtle background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30 mb-3">
              <Tractor className="w-3.5 h-3.5 text-amber-400" />
              <span>Modern Farm Machinery • جدید زرعی مشینیں و آلات</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
              High-Efficiency Agricultural Machinery & Implements
            </h2>
            <p className="text-sm sm:text-base text-slate-300 mt-2 leading-relaxed">
              Engineered for endurance in Pakistani field conditions. From power sprayers to laser levelers and drones with full spare parts and warranty.
            </p>
          </div>

          <button
            onClick={onViewAllMachinery}
            className="inline-flex items-center gap-2 text-sm font-bold text-amber-300 hover:text-amber-200 bg-white/10 hover:bg-white/15 px-4 py-2.5 rounded-xl transition-colors shrink-0 cursor-pointer self-start md:self-auto border border-amber-400/30"
            id="home-view-all-machinery-btn"
          >
            <span>View All Agri Machinery & Equipment</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Feature Pillars Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10 text-xs">
          <div className="bg-white/5 border border-white/10 p-3.5 rounded-xl flex items-center gap-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="text-slate-200 font-semibold">1-Year Warranty & Free Service</span>
          </div>
          <div className="bg-white/5 border border-white/10 p-3.5 rounded-xl flex items-center gap-2.5">
            <Wrench className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="text-slate-200 font-semibold">100% Genuine Spare Parts Available</span>
          </div>
          <div className="bg-white/5 border border-white/10 p-3.5 rounded-xl flex items-center gap-2.5">
            <Zap className="w-4 h-4 text-cyan-400 shrink-0" />
            <span className="text-slate-200 font-semibold">Low Fuel & High Energy Efficiency</span>
          </div>
          <div className="bg-white/5 border border-white/10 p-3.5 rounded-xl flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" />
            <span className="text-slate-200 font-semibold">On-Farm Demo & Training</span>
          </div>
        </div>

        {/* Machines Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayMachines.map((machine) => (
            <div
              key={machine.id}
              className="bg-slate-800/90 rounded-2xl border border-slate-700/80 hover:border-amber-400/50 shadow-xl transition-all duration-300 flex flex-col overflow-hidden group hover:-translate-y-1"
            >
              {/* Image & Badges */}
              <div 
                className="relative aspect-4/3 overflow-hidden bg-slate-900 cursor-pointer"
                onClick={() => onSelectMachine(machine)}
              >
                <img
                  src={machine.imageUrl}
                  alt={machine.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                />
                <div className="absolute top-2.5 left-2.5 bg-slate-900/90 backdrop-blur-xs text-amber-300 text-[11px] font-bold px-2.5 py-1 rounded-md border border-amber-400/30">
                  {machine.brand}
                </div>
                <div className="absolute bottom-2.5 right-2.5 bg-emerald-950/90 text-emerald-300 text-[11px] font-semibold px-2 py-0.5 rounded-md backdrop-blur-xs" dir="rtl">
                  {machine.urduName}
                </div>
              </div>

              {/* Machine Info */}
              <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <h3 
                    onClick={() => onSelectMachine(machine)}
                    className="font-extrabold text-base text-white group-hover:text-amber-300 transition-colors cursor-pointer line-clamp-1"
                  >
                    {machine.name}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                    {machine.shortDescription}
                  </p>
                </div>

                {/* Specs Pills */}
                <div className="space-y-1.5 text-[11px] text-slate-300 pt-2 border-t border-slate-700/60">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Power:</span>
                    <span className="font-semibold text-slate-200 truncate max-w-[150px]">{machine.powerSource}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Capacity:</span>
                    <span className="font-semibold text-amber-300 truncate max-w-[150px]">{machine.capacityOrSize}</span>
                  </div>
                </div>

                {/* Price & Action */}
                <div className="pt-3 border-t border-slate-700 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-xs bg-emerald-950/60 px-2.5 py-1.5 rounded-lg border border-emerald-800/60">
                    <MessageCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Price on WhatsApp</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => onSelectMachine(machine)}
                    className="inline-flex items-center gap-1 text-xs font-bold px-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 transition-all shadow-xs cursor-pointer"
                  >
                    <span>Details & Quote</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Bottom CTA */}
        <div className="text-center mt-10">
          <button
            onClick={onViewAllMachinery}
            className="inline-flex items-center gap-2 text-sm font-extrabold text-white hover:text-amber-300 bg-white/10 hover:bg-white/15 border border-white/20 px-6 py-3 rounded-xl shadow-xs transition-all cursor-pointer"
          >
            <span>Explore Complete Agricultural Machinery Catalog (10+ Units)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>
  );
};
