import React, { useState, useMemo } from 'react';
import { 
  Tractor, 
  Search, 
  Filter, 
  ShieldCheck, 
  Zap, 
  Cpu, 
  Wrench, 
  MessageCircle, 
  ArrowRight,
  Sparkles,
  HelpCircle,
  FileText
} from 'lucide-react';
import { AgriMachine, MachineCategory } from '../types';

interface AgriMachineryPageProps {
  machines: AgriMachine[];
  onSelectMachine: (machine: AgriMachine) => void;
  onAddToInquiry: (machine: AgriMachine, quantity: number) => void;
  onNavigateToContact: () => void;
}

export const AgriMachineryPage: React.FC<AgriMachineryPageProps> = ({
  machines,
  onSelectMachine,
  onAddToInquiry,
  onNavigateToContact
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'recommended' | 'price-asc' | 'price-desc'>('recommended');

  const categories: { id: string; label: string; urdu: string }[] = [
    { id: 'all', label: 'All Machinery', urdu: 'تمام مشینیں' },
    { id: 'sprayers', label: 'Sprayers & Engines', urdu: 'سپرے پمپ و مشینیں' },
    { id: 'tillage', label: 'Tillage & Cultivators', urdu: 'زمین کی تیاری و روٹاویٹر' },
    { id: 'seeding', label: 'Seed Drills & Planters', urdu: 'بوائی کی مشینیں' },
    { id: 'irrigation', label: 'Solar & Tube-wells', urdu: 'شمسی ٹیوب ویل' },
    { id: 'drones', label: 'Agri Drone Tech', urdu: 'زرعی ڈرونز' },
    { id: 'harvesting', label: 'Harvesting & Toka', urdu: 'ٹوکہ و کٹائی' }
  ];

  const filteredMachines = useMemo(() => {
    return machines
      .filter((mach) => {
        const matchesCategory = selectedCategory === 'all' || mach.category === selectedCategory;
        const q = searchQuery.toLowerCase().trim();
        const matchesSearch = 
          !q ||
          mach.name.toLowerCase().includes(q) ||
          mach.urduName.toLowerCase().includes(q) ||
          mach.brand.toLowerCase().includes(q) ||
          mach.categoryLabel.toLowerCase().includes(q) ||
          mach.powerSource.toLowerCase().includes(q) ||
          mach.shortDescription.toLowerCase().includes(q);

        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      });
  }, [machines, selectedCategory, searchQuery, sortBy]);

  return (
    <div className="py-8 sm:py-12 bg-slate-900 min-h-screen text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Hero Banner */}
        <div className="bg-linear-to-r from-slate-950 via-slate-900 to-slate-950 rounded-3xl p-6 sm:p-10 border border-slate-800 shadow-2xl relative overflow-hidden">
          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30">
              <Tractor className="w-4 h-4 text-amber-400" />
              <span>Bukhari Agro Machinery & Implements Division • زرعی آلات و جدید مشینیں</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
              Commercial Agricultural Machinery, Sprayers & Drone Tech
            </h1>
            
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Equipping Pakistani farmers with fuel-efficient, high-torque, and durable field implements. Complete 1-year warranty, factory-trained technician support, and continuous spare parts supply.
            </p>

            <div className="flex flex-wrap gap-3 pt-2 text-xs">
              <div className="flex items-center gap-2 bg-white/5 px-3.5 py-1.5 rounded-lg border border-white/10 text-emerald-300">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>1-Year Comprehensive Warranty</span>
              </div>
              <div className="flex items-center gap-2 bg-white/5 px-3.5 py-1.5 rounded-lg border border-white/10 text-amber-300">
                <Wrench className="w-4 h-4 text-amber-400" />
                <span>100% Guaranteed Spare Parts Support</span>
              </div>
              <div className="flex items-center gap-2 bg-white/5 px-3.5 py-1.5 rounded-lg border border-white/10 text-cyan-300">
                <FileText className="w-4 h-4 text-cyan-400" />
                <span>Govt. Subsidies & Quotation Invoices</span>
              </div>
            </div>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="bg-slate-800/90 rounded-2xl p-4 sm:p-6 shadow-xl border border-slate-700/80 space-y-4">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search machinery by name, horsepower, or type (e.g., Sprayer, Tiller, Rotavator, Drone)..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm focus:outline-hidden focus:border-amber-400 focus:bg-slate-950 transition-all text-white placeholder:text-slate-500 font-medium"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white font-bold"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-xs font-bold text-slate-400 whitespace-nowrap">Sort By:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-slate-900 border border-slate-700 text-slate-200 text-xs font-semibold rounded-xl px-3 py-2.5 focus:outline-hidden focus:border-amber-400 cursor-pointer"
              >
                <option value="recommended">Featured / High Demand</option>
                <option value="price-asc">Price: Low to High (کم سے زیادہ)</option>
                <option value="price-desc">Price: High to Low (زیادہ سے کم)</option>
              </select>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 no-scrollbar">
            {categories.map((cat) => {
              const active = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                    active
                      ? 'bg-amber-500 text-slate-950 shadow-md font-extrabold'
                      : 'bg-slate-900/80 hover:bg-slate-700 text-slate-300 border border-slate-700/60'
                  }`}
                >
                  <span>{cat.label}</span>
                  <span className="text-[10px] opacity-75" dir="rtl">({cat.urdu})</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between text-xs text-slate-400 px-1">
          <div>
            Showing <strong className="text-amber-300 font-bold">{filteredMachines.length}</strong> farm machinery units
            {selectedCategory !== 'all' && ` in "${categories.find(c => c.id === selectedCategory)?.label}"`}
          </div>
          <div className="text-emerald-400 font-semibold">
            All equipment includes factory test warranty & field manual
          </div>
        </div>

        {/* Machinery Catalog Grid */}
        {filteredMachines.length === 0 ? (
          <div className="bg-slate-800 rounded-2xl p-12 text-center border border-slate-700 space-y-3">
            <Tractor className="w-12 h-12 text-slate-600 mx-auto" />
            <h3 className="text-base font-bold text-slate-200">No machinery matched your search</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Try adjusting your search keywords or select "All Machinery" to see the full equipment inventory.
            </p>
            <button
              onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
              className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 text-slate-950 text-xs font-bold hover:bg-amber-400 transition-colors cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMachines.map((machine) => {
              const whatsAppUrl = `https://wa.me/923116666600?text=${encodeURIComponent(
                `Assalam-o-Alaikum Bukhari Agro,\nI want to inquire about purchasing *${machine.name}* (${machine.urduName}).\nInquiring for official farm price and quotation via WhatsApp.\nPower: ${machine.powerSource}\nCapacity: ${machine.capacityOrSize}\nWarranty: ${machine.warranty}\n\nPlease provide quotation and delivery details.`
              )}`;

              return (
                <div
                  key={machine.id}
                  className="bg-slate-800 rounded-2xl border border-slate-700 hover:border-amber-400/50 shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col overflow-hidden group hover:-translate-y-1"
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
                    <div className="absolute top-3 left-3 bg-slate-950/90 text-amber-300 text-xs font-bold px-2.5 py-1 rounded-lg border border-amber-400/30">
                      {machine.brand}
                    </div>
                    <div className="absolute bottom-3 right-3 bg-emerald-950/90 text-emerald-300 text-xs font-bold px-2.5 py-1 rounded-lg backdrop-blur-xs" dir="rtl">
                      {machine.urduName}
                    </div>
                    <div className="absolute top-3 right-3 bg-emerald-700 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs">
                      {machine.warranty}
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <h3 
                        onClick={() => onSelectMachine(machine)}
                        className="font-extrabold text-lg text-white group-hover:text-amber-300 transition-colors cursor-pointer"
                      >
                        {machine.name}
                      </h3>

                      <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                        {machine.shortDescription}
                      </p>
                    </div>

                    {/* Specs Cards */}
                    <div className="space-y-1.5 text-xs bg-slate-900/70 p-3 rounded-xl border border-slate-700/60">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400 flex items-center gap-1">
                          <Zap className="w-3 h-3 text-amber-400" />
                          <span>Power:</span>
                        </span>
                        <span className="font-semibold text-slate-200 truncate max-w-[170px]">{machine.powerSource}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400 flex items-center gap-1">
                          <Cpu className="w-3 h-3 text-emerald-400" />
                          <span>Capacity:</span>
                        </span>
                        <span className="font-semibold text-amber-300 truncate max-w-[170px]">{machine.capacityOrSize}</span>
                      </div>
                    </div>

                    {/* WhatsApp Price Notice */}
                    <div className="pt-2 border-t border-slate-700/80 flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-xs bg-emerald-950/80 px-2.5 py-1.5 rounded-lg border border-emerald-800/80">
                        <MessageCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>Price on WhatsApp</span>
                      </div>
                      <div className="text-[11px] text-amber-300/90 font-medium text-right" dir="rtl">
                        قیمت واٹس ایپ پر دستیاب
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => onSelectMachine(machine)}
                        className="w-full inline-flex items-center justify-center gap-1 text-xs font-bold py-2.5 px-3 rounded-xl bg-slate-700 hover:bg-slate-600 text-white transition-all shadow-xs cursor-pointer"
                      >
                        <span>Tech Specs</span>
                      </button>

                      <a
                        href={whatsAppUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full inline-flex items-center justify-center gap-1 text-xs font-bold py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white transition-all shadow-xs cursor-pointer"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>WhatsApp Quote</span>
                      </a>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Machinery Workshop and Field Demo Banner */}
        <div className="bg-slate-800/80 rounded-3xl p-6 sm:p-8 border border-slate-700 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-xl sm:text-2xl font-black text-white">
              Need an On-Farm Demonstration or Govt. Subsidy Quotation?
            </h3>
            <p className="text-sm text-slate-400 max-w-2xl leading-relaxed">
              We arrange field demonstrations for tractors, power sprayers, rotavators, and agri drones. Official bank proforma invoices provided for agricultural loans and provincial subsidy schemes.
            </p>
          </div>

          <button
            onClick={onNavigateToContact}
            className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 px-6 py-3.5 rounded-xl font-bold text-sm shadow-lg transition-all shrink-0 cursor-pointer"
          >
            <span>Request Machinery Demo</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
