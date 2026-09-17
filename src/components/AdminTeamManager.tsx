import React, { useState } from 'react';
import { 
  Users, 
  Plus, 
  Edit, 
  Trash2, 
  Upload, 
  X, 
  Check, 
  Search, 
  GraduationCap, 
  Briefcase, 
  Award, 
  Image as ImageIcon 
} from 'lucide-react';
import { TeamMember } from '../types';
import { saveTeamMemberToDb, deleteTeamMemberFromDb, uploadMediaToSupabase } from '../services/supabaseService';

interface AdminTeamManagerProps {
  teamMembers: TeamMember[];
  onTeamUpdated: (newTeam: TeamMember[]) => void;
  showToast: (msg: string, isErr?: boolean) => void;
}

export const AdminTeamManager: React.FC<AdminTeamManagerProps> = ({
  teamMembers,
  onTeamUpdated,
  showToast
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Partial<TeamMember> | null>(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const filteredMembers = teamMembers.filter(m => 
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (m.qualification && m.qualification.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleOpenAddModal = () => {
    setEditingMember({
      name: '',
      role: '',
      department: 'Agronomy & Advisory',
      qualification: '',
      experience: '',
      bio: '',
      specialty: '',
      imageUrl: '/images/team-agronomist.jpg',
      email: 'bukhariagropvtltd@gmail.com'
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (member: TeamMember) => {
    setEditingMember({ ...member });
    setIsModalOpen(true);
  };

  // Photo uploader with fallback to Express backend
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingPhoto(true);

    // 1. Try Supabase storage
    const res = await uploadMediaToSupabase(file, 'bukhari-media');
    if (res.success && res.publicUrl) {
      setEditingMember(prev => prev ? ({ ...prev, imageUrl: res.publicUrl }) : null);
      showToast('Photo uploaded to Supabase Storage!');
      setUploadingPhoto(false);
      return;
    }

    // 2. Directly save to server media storage via /api/upload-image
    try {
      const base64Data = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      const serverRes = await fetch('/api/upload-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          base64Data,
          filename: file.name,
          prefix: 'team'
        })
      });

      if (serverRes.ok) {
        const json = await serverRes.json();
        const uploadedUrl = json.url || json.file?.url;
        if (json.success && uploadedUrl) {
          setEditingMember(prev => prev ? ({ ...prev, imageUrl: uploadedUrl }) : null);
          showToast('Photo uploaded and permanently saved to server!');
          setUploadingPhoto(false);
          return;
        }
      }
    } catch (err) {
      console.warn('Backend image upload fallback error:', err);
    }

    // 3. Fallback to local FileReader Data URL
    const reader = new FileReader();
    reader.onload = () => {
      setEditingMember(prev => prev ? ({ ...prev, imageUrl: reader.result as string }) : null);
      showToast('Photo loaded (local preview)');
      setUploadingPhoto(false);
    };
    reader.readAsDataURL(file);
  };

  const handleSaveMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMember?.name || !editingMember?.role) {
      showToast('Name and Role/Title are required', true);
      return;
    }

    setIsSaving(true);
    const isEditing = Boolean(editingMember.id);
    const res = await saveTeamMemberToDb(editingMember, editingMember.id);
    setIsSaving(false);

    if (res.success) {
      showToast(isEditing ? 'Team member updated successfully!' : 'Team member added successfully!');
      
      let updatedList: TeamMember[];
      if (isEditing) {
        updatedList = teamMembers.map(m => m.id === editingMember.id ? { ...m, ...editingMember } as TeamMember : m);
      } else {
        const newRecord: TeamMember = res.data || {
          id: editingMember.id || `team-${Date.now()}`,
          name: editingMember.name || 'Team Member',
          role: editingMember.role || 'Agronomist',
          department: editingMember.department || 'Agronomy',
          qualification: editingMember.qualification || '',
          experience: editingMember.experience || '',
          bio: editingMember.bio || '',
          imageUrl: editingMember.imageUrl || '/images/team-agronomist.jpg',
          specialty: editingMember.specialty || '',
          email: editingMember.email || 'bukhariagropvtltd@gmail.com'
        };
        updatedList = [...teamMembers, newRecord];
      }

      onTeamUpdated(updatedList);
      setIsModalOpen(false);
      setEditingMember(null);
    } else {
      showToast(res.error || 'Failed to save team member', true);
    }
  };

  const handleDeleteMember = async (member: TeamMember) => {
    if (!window.confirm(`Are you sure you want to remove "${member.name}" from the About Us team?`)) {
      return;
    }

    const res = await deleteTeamMemberFromDb(member.id);
    if (res.success) {
      showToast(`Removed ${member.name} from team`);
      const updatedList = teamMembers.filter(m => m.id !== member.id);
      onTeamUpdated(updatedList);
    } else {
      showToast(res.error || 'Failed to delete team member', true);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6">
      
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-[#2271b1]" />
            <span>About Us — Agronomists & Leadership Team</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage executive leadership, senior agronomists, qualifications, and profile photos displayed on the About Us page.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search team..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-emerald-500 w-48 sm:w-60"
            />
          </div>

          <button
            type="button"
            onClick={handleOpenAddModal}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#2271b1] hover:bg-[#135e96] text-white text-xs font-bold rounded-lg shadow-xs transition-colors cursor-pointer shrink-0"
            id="admin-add-team-member-btn"
          >
            <Plus className="w-4 h-4" />
            <span>Add Member</span>
          </button>
        </div>
      </div>

      {/* Team Members Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filteredMembers.map((member) => (
          <div 
            key={member.id}
            className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden flex flex-col justify-between hover:border-emerald-200 transition-all"
          >
            <div className="p-4 space-y-3">
              <div className="flex items-start gap-3">
                <img
                  src={member.imageUrl || '/images/team-agronomist.jpg'}
                  alt={member.name}
                  referrerPolicy="no-referrer"
                  className="w-16 h-16 rounded-xl object-cover border border-slate-200 bg-slate-50 shrink-0"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/images/team-agronomist.jpg';
                  }}
                />
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-bold text-slate-900 truncate">{member.name}</h3>
                  <p className="text-xs font-semibold text-emerald-700">{member.role}</p>
                  <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                    {member.department}
                  </span>
                </div>
              </div>

              {/* Badges / Details */}
              <div className="space-y-1 text-[11px] text-slate-600 pt-2 border-t border-slate-100">
                {member.qualification && (
                  <div className="flex items-center gap-1.5 truncate">
                    <GraduationCap className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{member.qualification}</span>
                  </div>
                )}
                {member.experience && (
                  <div className="flex items-center gap-1.5 truncate">
                    <Briefcase className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{member.experience}</span>
                  </div>
                )}
                {member.specialty && (
                  <div className="flex items-center gap-1.5 truncate">
                    <Award className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span className="truncate text-emerald-800 font-medium">{member.specialty}</span>
                  </div>
                )}
              </div>

              {member.bio && (
                <p className="text-xs text-slate-500 line-clamp-2 italic">
                  "{member.bio}"
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[10px] text-slate-400">ID: {member.id}</span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => handleOpenEditModal(member)}
                  className="p-1.5 text-slate-600 hover:text-[#2271b1] hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                  title="Edit details and photo"
                  id={`edit-team-${member.id}`}
                >
                  <Edit className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteMember(member)}
                  className="p-1.5 text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                  title="Delete member"
                  id={`delete-team-${member.id}`}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredMembers.length === 0 && (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center space-y-3">
          <Users className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-sm font-bold text-slate-700">
            {teamMembers.length === 0 ? 'No Team Members Configured' : 'No team members match your search'}
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            {teamMembers.length === 0 
              ? 'All previous team members have been removed. The team section on the About Us page is now hidden and will only show when you add new team members.'
              : 'Try adjusting your search or add a new team member.'}
          </p>
          {teamMembers.length === 0 && (
            <button
              type="button"
              onClick={handleOpenAddModal}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#2271b1] hover:bg-[#135e96] text-white text-xs font-bold rounded-lg shadow-xs transition-colors cursor-pointer mt-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add Your First Team Member</span>
            </button>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: ADD / EDIT TEAM MEMBER */}
      {/* ========================================================= */}
      {isModalOpen && editingMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
            
            {/* Modal Header */}
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Users className="w-4 h-4 text-[#2271b1]" />
                <span>{editingMember.id ? `Edit Member: ${editingMember.name}` : 'Add New Team Member'}</span>
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveMember} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
              
              {/* Photo Upload & Preview */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-center gap-4">
                <img
                  src={editingMember.imageUrl || '/images/team-agronomist.jpg'}
                  alt="Profile Preview"
                  className="w-20 h-20 rounded-xl object-cover border-2 border-emerald-500 shadow-xs bg-white shrink-0"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/images/team-agronomist.jpg';
                  }}
                />
                <div className="flex-1 w-full space-y-2">
                  <label className="block font-bold text-slate-700">
                    Profile Photo (Supabase Storage / Server)
                  </label>
                  <div className="flex items-center gap-2">
                    <label className="cursor-pointer px-3 py-1.5 bg-[#2271b1] hover:bg-[#135e96] text-white font-bold rounded-lg shrink-0 flex items-center gap-1.5 transition-colors">
                      <Upload className="w-3.5 h-3.5" />
                      <span>{uploadingPhoto ? 'Uploading...' : 'Upload New Photo'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                  <input
                    type="text"
                    value={editingMember.imageUrl || ''}
                    onChange={(e) => setEditingMember({ ...editingMember, imageUrl: e.target.value })}
                    placeholder="Or enter direct image URL (https://...)"
                    className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg font-mono text-[11px] focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Name & Role */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={editingMember.name || ''}
                    onChange={(e) => setEditingMember({ ...editingMember, name: e.target.value })}
                    placeholder="e.g. Dr. Tariq Mahmood"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-semibold focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Role / Designation *</label>
                  <input
                    type="text"
                    required
                    value={editingMember.role || ''}
                    onChange={(e) => setEditingMember({ ...editingMember, role: e.target.value })}
                    placeholder="e.g. Chief Agronomist & Technical Director"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-semibold focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Department & Qualifications */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Department</label>
                  <input
                    type="text"
                    value={editingMember.department || ''}
                    onChange={(e) => setEditingMember({ ...editingMember, department: e.target.value })}
                    placeholder="e.g. Research & Agronomic Advisory"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Qualification / Degrees</label>
                  <input
                    type="text"
                    value={editingMember.qualification || ''}
                    onChange={(e) => setEditingMember({ ...editingMember, qualification: e.target.value })}
                    placeholder="e.g. Ph.D. in Plant Pathology, UAF"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Experience & Specialty */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Experience</label>
                  <input
                    type="text"
                    value={editingMember.experience || ''}
                    onChange={(e) => setEditingMember({ ...editingMember, experience: e.target.value })}
                    placeholder="e.g. 15+ Years in Field Diagnostics"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Specialty / Expertise</label>
                  <input
                    type="text"
                    value={editingMember.specialty || ''}
                    onChange={(e) => setEditingMember({ ...editingMember, specialty: e.target.value })}
                    placeholder="e.g. Crop Diagnostics, Tank-Mix Chemistry"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Bio Narrative */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Biography / Agronomic Background</label>
                <textarea
                  rows={3}
                  value={editingMember.bio || ''}
                  onChange={(e) => setEditingMember({ ...editingMember, bio: e.target.value })}
                  placeholder="Detail the agronomist's research, farmer impact, or field expertise..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Contact Email */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Official Email Address</label>
                <input
                  type="email"
                  value={editingMember.email || ''}
                  onChange={(e) => setEditingMember({ ...editingMember, email: e.target.value })}
                  placeholder="e.g. bukhariagropvtltd@gmail.com"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Modal Actions */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-4 py-2 bg-[#2271b1] hover:bg-[#135e96] text-white font-bold rounded-lg shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
                  id="admin-save-team-member-submit"
                >
                  <Check className="w-4 h-4" />
                  <span>{isSaving ? 'Saving to Database...' : 'Save Team Member'}</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
