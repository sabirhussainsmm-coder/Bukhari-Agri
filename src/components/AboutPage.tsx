import React, { useEffect, useState } from 'react';
import { 
  ShieldCheck, 
  Award, 
  Users, 
  Sprout, 
  Target, 
  BookOpen, 
  CheckCircle2, 
  Microscope, 
  Layers,
  ArrowRight,
  Server
} from 'lucide-react';
import { TeamMember } from '../types';
import { initialTeamMembers, partnerBrands } from '../data/agroData';
import { fetchTeamFromDb } from '../services/supabaseService';
import { BukhariAgroLogo } from './BukhariAgroLogo';

interface AboutPageProps {
  onNavigateToProducts: () => void;
  onNavigateToContact: () => void;
  teamMembers?: TeamMember[];
}

export const AboutPage: React.FC<AboutPageProps> = ({
  onNavigateToProducts,
  onNavigateToContact,
  teamMembers
}) => {
  const [team, setTeam] = useState<TeamMember[]>(teamMembers ?? []);
  const [loadingTeam, setLoadingTeam] = useState(false);

  useEffect(() => {
    if (teamMembers !== undefined) {
      setTeam(teamMembers);
    }
  }, [teamMembers]);

  // Fetch team from Supabase / Backend database
  useEffect(() => {
    let isMounted = true;
    async function loadBackendTeam() {
      setLoadingTeam(true);
      try {
        const data = await fetchTeamFromDb();
        if (isMounted && Array.isArray(data)) {
          setTeam(data);
        }
      } catch (err) {
        console.warn("Backend team fetch fallback", err);
      } finally {
        if (isMounted) setLoadingTeam(false);
      }
    }

    loadBackendTeam();
    return () => { isMounted = false; };
  }, []);

  return (
    <div className="bg-white min-h-screen">
      
      {/* 1. Page Header / Hero Banner */}
      <section className="relative bg-gradient-to-b from-emerald-950 via-emerald-900 to-[#0A4D2E] text-white py-16 sm:py-24 overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#22c55e_1px,transparent_1px)] [background-size:16px_16px]" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-800/80 border border-emerald-600/50 text-emerald-200 text-xs font-semibold uppercase tracking-wider mb-4">
            <Sprout className="w-3.5 h-3.5 text-emerald-400" />
            <span>Company Profile & Agronomic Mission</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight">
            About <span className="text-emerald-400">Bukhari Agro</span>
          </h1>

          <p className="text-lg sm:text-xl text-emerald-100/90 max-w-3xl mx-auto mt-4 leading-relaxed font-light">
            Empowering Pakistani growers with genuine, science-backed pesticides, fertilizers, and complete crop protection solutions from the world's most trusted agricultural manufacturers.
          </p>

          <div className="flex items-center justify-center gap-6 mt-8 text-xs sm:text-sm text-emerald-200/80 font-medium">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Jhangi Syedan, Islamabad Hub
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Multi-Brand Authorizations
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> ISO Certified Storage
            </span>
          </div>
        </div>
      </section>

      {/* 2. Company Narrative & Multi-Brand Model */}
      <section className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-6 space-y-6">
            <div className="text-xs font-bold uppercase tracking-wider text-emerald-800">
              WHO WE ARE
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
              A Bridge Between World-Class Agri-Science and the <span className="text-[#16A34A]">Farming Community</span>
            </h2>
            <p className="text-slate-600 text-base leading-relaxed">
              Founded on the bedrock principles of trust, agronomic expertise, and unyielding commitment to crop health, <strong>Bukhari Agro (Pvt) Ltd</strong> serves as a premier distribution and technical extension partner in the fertile agricultural heartland of Pakistan.
            </p>
            <p className="text-slate-600 text-base leading-relaxed">
              Unlike single-line vendors, Bukhari Agro curates a <strong>multi-brand portfolio</strong>, bringing together the revolutionary diamide chemistry of FMC, the world-renowned fungicide mastery of Syngenta and Bayer, and the vital macro-nutrition powerhouses of Engro and Fatima Fertilizers.
            </p>

            {/* Core Values / Commitments */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-100">
                <ShieldCheck className="w-6 h-6 text-emerald-700 mb-2" />
                <h4 className="font-bold text-sm text-slate-900">Zero Tolerance on Counterfeits</h4>
                <p className="text-xs text-slate-600 mt-1">
                  Direct factory-sealed shipments with verifiable QR/batch codes protecting farmer investment.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-100">
                <Microscope className="w-6 h-6 text-emerald-700 mb-2" />
                <h4 className="font-bold text-sm text-slate-900">Diagnostic-Led Advisory</h4>
                <p className="text-xs text-slate-600 mt-1">
                  We don't just sell chemicals; our qualified agronomists diagnose the pest threshold and field humidity first.
                </p>
              </div>
            </div>
          </div>

          {/* Right Visual Card */}
          <div className="lg:col-span-6">
            <div className="relative bg-gradient-to-br from-[#0A4D2E] to-[#042816] rounded-3xl p-8 sm:p-10 text-white shadow-2xl overflow-hidden">
              <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
              
              <div className="flex justify-center mb-6">
                <BukhariAgroLogo variant="stacked" inverted={true} size="lg" />
              </div>

              <div className="space-y-4 text-center">
                <div className="text-emerald-400 font-serif italic text-lg">
                  "Healthy Crops, Brighter Future"
                </div>
                <p className="text-sm text-emerald-100/90 leading-relaxed font-light">
                  "Our mission is simple: to make sure every rupee a farmer spends on crop protection translates directly into higher yield, disease immunity, and prosperity for his family."
                </p>
                <div className="pt-4 border-t border-emerald-800/80 flex items-center justify-center gap-8 text-center">
                  <div>
                    <div className="text-2xl font-extrabold text-white">25,000+</div>
                    <div className="text-[11px] text-emerald-300 uppercase tracking-wider">Farmers Assisted</div>
                  </div>
                  <div className="h-8 w-px bg-emerald-800" />
                  <div>
                    <div className="text-2xl font-extrabold text-white">12+</div>
                    <div className="text-[11px] text-emerald-300 uppercase tracking-wider">Brand Alliances</div>
                  </div>
                  <div className="h-8 w-px bg-emerald-800" />
                  <div>
                    <div className="text-2xl font-extrabold text-white">100%</div>
                    <div className="text-[11px] text-emerald-300 uppercase tracking-wider">Tested Stocks</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 3. Multi-Brand Alliances Section */}
      <section className="py-16 bg-[#F8FAF6] border-y border-emerald-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="text-xs font-bold uppercase tracking-wider text-emerald-800 mb-1">
              PORTFOLIO COLLABORATION
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Why We Distribute Multiple Companies' Products
            </h2>
            <p className="text-slate-600 text-sm mt-2">
              Every agricultural season presents unique pest mutations, weed pressures, and soil deficiencies. By partnering with multiple global innovators, Bukhari Agro offers farmers the exact right chemical chemistry without proprietary bias.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {partnerBrands.slice(0, 6).map((brand, idx) => (
              <div 
                key={idx}
                className="bg-white rounded-2xl p-6 border border-emerald-100 shadow-xs hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="font-extrabold text-base text-slate-900">
                    {brand.name}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    {brand.country}
                  </span>
                </div>
                <div className="text-xs font-semibold text-emerald-700 mb-2">
                  {brand.tier}
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {brand.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. DEDICATED TEAM SECTION (Strictly Backend-Managed as Instructed!) */}
      {/* 
        User instruction: 
        "about us men team ka section b ho jin ki images change ki ja sken lekin yad rhy jo b change hoga wo backend pr ho front end pr changing ka koi option na ho"
        -> Strictly displaying data served from /api/team with NO client-side editing/upload buttons.
      */}
      {team.length > 0 && (
        <section className="py-16 sm:py-24 bg-white" id="team-section">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-800 mb-2">
                  <Users className="w-3.5 h-3.5 text-emerald-600" />
                  <span>LEADERSHIP & TECHNICAL SPECIALISTS</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                  Meet the Experts Behind <span className="text-[#16A34A]">Bukhari Agro</span>
                </h2>
                <p className="text-slate-600 text-sm sm:text-base mt-1.5 max-w-2xl">
                  Our seasoned agronomists, plant pathologists, and supply chain directors provide frontline support to growers throughout the crop cycle.
                </p>
              </div>

              {/* Backend-Managed Assurance Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200 text-slate-600 text-xs font-medium self-start sm:self-auto">
                <Server className="w-3.5 h-3.5 text-emerald-700" />
                <span>Backend Verified Profiles</span>
              </div>
            </div>

            {/* Team Members Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {team.map((member) => (
                <div
                  key={member.id}
                  className="bg-[#FBFDF9] rounded-2xl overflow-hidden border border-emerald-100/90 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1"
                  id={`team-card-${member.id}`}
                >
                  <div>
                    {/* Member Photo */}
                    <div className="relative w-full aspect-square overflow-hidden bg-emerald-950">
                      <img
                        src={member.imageUrl}
                        alt={member.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover object-top transform group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                      
                      {/* Department Tag Overlay */}
                      <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs text-emerald-900 text-[10px] font-extrabold px-2.5 py-1 rounded-full shadow-xs uppercase tracking-wider">
                        {member.department}
                      </div>
                    </div>

                    {/* Member Info */}
                    <div className="p-5 space-y-2">
                      <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-800 transition-colors">
                        {member.name}
                      </h3>
                      
                      <div className="text-xs font-semibold text-[#16A34A]">
                        {member.role}
                      </div>

                      <div className="text-[11px] text-slate-500 font-medium">
                        {member.qualification}
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed pt-2 border-t border-emerald-50">
                        {member.bio}
                      </p>
                    </div>
                  </div>

                  {/* Member Specialty Footer */}
                  <div className="px-5 pb-5 pt-2">
                    <div className="bg-emerald-50/90 rounded-xl p-2.5 text-[11px] text-emerald-900 border border-emerald-100">
                      <span className="font-bold block text-emerald-950">Specialization:</span>
                      <span className="line-clamp-2">{member.specialty}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </section>
      )}

      {/* 5. Bottom Navigation CTA */}
      <section className="py-12 bg-emerald-950 text-white text-center">
        <div className="max-w-4xl mx-auto px-4 space-y-4">
          <h3 className="text-2xl sm:text-3xl font-bold">
            Ready to Protect and Maximize Your Harvest?
          </h3>
          <p className="text-emerald-200 text-sm max-w-xl mx-auto">
            Browse our complete multi-brand product catalog or reach out directly to our agronomists for field consultations.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={onNavigateToProducts}
              className="inline-flex items-center gap-2 bg-[#16A34A] hover:bg-[#15803D] text-white font-bold px-6 py-3 rounded-full text-sm shadow-md transition-colors"
            >
              <span>Explore Products</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onNavigateToContact}
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-bold px-6 py-3 rounded-full text-sm border border-white/20 transition-colors"
            >
              <span>Contact Us</span>
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
