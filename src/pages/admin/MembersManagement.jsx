import React, { useState, useEffect } from 'react';
import {
  PlusIcon, MagnifyingGlassIcon, DocumentArrowDownIcon, DocumentArrowUpIcon,
  PencilIcon, EyeIcon, XMarkIcon, FunnelIcon, CheckIcon, EllipsisVerticalIcon,
  StarIcon, PhoneIcon, ChevronDownIcon, KeyIcon
} from '@heroicons/react/24/outline';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import toast from 'react-hot-toast';
import api from '../../services/api';

const MembersManagement = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const response = await api.get('/member'); 
      const membersArray = response.data.data?.members || response.data.members || response.data || [];
      setMembers(Array.isArray(membersArray) ? membersArray : []);
    } catch (error) {
      toast.error('Failed to load members');
      console.error('API Error:', error.response?.data || error);
      setMembers([]); 
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const handleAddMember = async (memberData) => {
    try {
      await api.post('/admin/members', {
        firstName: memberData.firstName,
        lastName: memberData.lastName || '',
        memberId: memberData.memberId.toUpperCase(),
        role: 'member',
        membershipTier: memberData.membershipTier,
        isActive: true
      });
      toast.success(`${memberData.firstName.toLowerCase()}@${memberData.memberId.toLowerCase()}`);
      setShowAddModal(false);
      fetchMembers();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create member');
    }
  };

  const handleImportMembers = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    try {
      await api.post('https://srs-backend-7ch1.onrender.com/api/member/import-members', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success('Members imported successfully!');
      setShowImportModal(false);
      fetchMembers();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Import failed');
    }
  };

  const handleDownloadTemplate = async () => {
    try {
      const response = await api.get('/members/template', { responseType: 'blob' });
      const blob = new Blob([response.data]);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'members-template.xlsx';
      a.click();
      URL.revokeObjectURL(url);
      toast.success('Template downloaded');
    } catch (error) {
      toast.error('Download failed');
    }
  };

  const filteredMembers = Array.isArray(members) 
    ? members.filter(member =>
        member && (
          `${member.firstName || ''} ${member.lastName || ''}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (member.memberId || '').toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    : [];

  return (
    <div className="min-h-screen">
      {}
      <div className="bg-white/95 backdrop-blur-xl border-b border-slate-200/50 shadow-sm">
        <div className="">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 via-teal-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg">
                <StarIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-black bg-gradient-to-r from-gray-900 to-slate-800 bg-clip-text text-transparent leading-tight">Members</h1>
                <p className="text-sm text-slate-500 font-semibold mt-1">Manage your members ({members.length})</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button 
                onClick={handleDownloadTemplate}
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold bg-black text-white rounded-xl hover:bg-gray-800 transition-all shadow-sm whitespace-nowrap"
                title="Download Excel template"
              >
                <DocumentArrowDownIcon className="w-3.5 h-3.5" />
                Template
              </button>
              <button 
                onClick={() => setShowImportModal(true)}
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold bg-black text-white rounded-xl hover:bg-gray-800 transition-all shadow-lg whitespace-nowrap"
                title="Import from Excel"
              >
                <DocumentArrowUpIcon className="w-3.5 h-3.5" />
                Import
              </button>
              <button 
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold bg-black text-white rounded-xl hover:bg-gray-800 transition-all shadow-xl whitespace-nowrap"
                title="Add single member"
              >
                <PlusIcon className="w-3.5 h-3.5" />
                Add
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-6">
          <div className="relative flex-1 max-w-md">
            <MagnifyingGlassIcon className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name or ID..."
              className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl bg-white/70 focus:ring-1 focus:ring-black focus:border-transparent transition-all shadow-sm"
            />
          </div>
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-1 px-2.5 py-2 text-xs font-semibold bg-black text-white rounded-xl hover:bg-gray-900 transition-all h-9 flex-shrink-0 select-none"
          >
            <FunnelIcon className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Filters</span>
            <ChevronDownIcon className={`w-3 h-3 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {showFilters && (
          <div className="bg-white/90 border border-slate-200 rounded-2xl p-2 mb-6 flex flex-wrap gap-1.5 shadow-md">
            <button className="px-3 py-1.5 text-xs font-semibold bg-black text-white rounded-lg hover:bg-gray-900 transition-all whitespace-nowrap">All</button>
            <button className="px-3 py-1.5 text-xs font-semibold bg-gradient-to-r from-yellow-400 to-yellow-500 text-white rounded-lg shadow-sm whitespace-nowrap">Gold</button>
            <button className="px-3 py-1.5 text-xs font-semibold bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg shadow-sm whitespace-nowrap">Premium</button>
            <button className="px-3 py-1.5 text-xs font-semibold bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-lg shadow-sm whitespace-nowrap">Elite</button>
          </div>
        )}

        {}
        {!loading && filteredMembers.length > 0 && (
          <div className="hidden md:block rounded-xl border border-slate-200 bg-white/80 backdrop-blur-sm shadow-lg">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-white/90">
                  <th className="px-4 py-3 text-left font-black text-gray-900 sticky left-0 bg-white/90 z-10 rounded-l-xl">Member</th>
                  <th className="px-3 py-3 text-left font-black text-gray-900">ID</th>
                  <th className="px-3 py-3 text-left font-black text-gray-900">Phone</th>
                  <th className="px-3 py-3 text-left font-black text-gray-900">Tier</th>
                  <th className="px-3 py-3 text-left font-black text-gray-900">Points</th>
                  <th className="px-3 py-3 text-left font-black text-gray-900">Status</th>
                  <th className="px-3 py-3 text-center font-black text-gray-900 rounded-r-xl w-[90px]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredMembers.map(member => (
                  <MemberTableRow 
                    key={member._id} 
                    member={member} 
                    onView={() => { 
                      setSelectedMember(member); 
                      setShowViewModal(true); 
                    }} 
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}

        {loading && (
          <div className="flex items-center justify-center py-16 text-sm text-gray-500">
            <LoadingSpinner size="small" />
            <span className="ml-3">Loading members...</span>
          </div>
        )}

        {}
        {!loading && filteredMembers.length === 0 && (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <StarIcon className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-lg font-black text-gray-900 mb-2">No members</h3>
            <p className="text-sm text-gray-500 mb-6">Add your first member using the button above</p>
            <button 
              onClick={() => setShowAddModal(true)}
              className="px-6 py-2.5 text-xs font-bold bg-black text-white rounded-xl hover:bg-gray-900 transition-all"
            >
              Add First Member
            </button>
          </div>
        )}

        {}
        {!loading && filteredMembers.length > 0 && (
          <div className="md:hidden space-y-4">
            {filteredMembers.map(member => (
              <MemberCard 
                key={member._id} 
                member={member} 
                onView={() => { 
                  setSelectedMember(member); 
                  setShowViewModal(true); 
                }} 
              />
            ))}
          </div>
        )}
      </div>

      {}
      {showAddModal && <AddMemberModal onClose={() => setShowAddModal(false)} onSubmit={handleAddMember} />}
      {showImportModal && <ImportModal onClose={() => setShowImportModal(false)} onImport={handleImportMembers} />}
      {showViewModal && selectedMember && <ViewMemberModal member={selectedMember} onClose={() => setShowViewModal(false)} />}
    </div>
  );
};

const MemberCard = ({ member, onView }) => {
  const getTierClass = tier => {
    const colors = { 
      Gold: 'from-yellow-400 to-yellow-500', 
      Premium: 'from-purple-500 to-purple-600', 
      Elite: 'from-gray-600 to-gray-700' 
    };
    return colors[tier] || 'from-blue-400 to-blue-500';
  };

  return (
    <div 
      className="group bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl p-4 hover:border-black/20 hover:bg-white transition-all cursor-pointer shadow-sm"
      onClick={onView}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div className={`w-10 h-10 bg-gradient-to-r ${getTierClass(member.membershipTier)} rounded-xl flex items-center justify-center`}>
            <StarIcon className="w-4 h-4 text-white" />
          </div>
          <div className="min-w-0">
            <div className="font-bold text-sm leading-tight text-gray-900 truncate">{member.firstName}</div>
            <div className="text-xs text-gray-500 font-medium truncate max-w-[120px]">{member.memberId}</div>
          </div>
        </div>
        <EllipsisVerticalIcon className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
      </div>
      
      <div className="grid grid-cols-2 gap-2 text-xs mb-3">
        <div className="flex items-center gap-1 text-gray-600">
          <PhoneIcon className="w-3 h-3" />
          <span className="truncate">{member.phone}</span>
        </div>
        <div className="text-right font-bold text-emerald-600 text-sm">
          {member.loyaltyPoints || 0}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span className={`px-2 py-1 text-xs font-bold rounded-full ${
          member.membershipTier === 'Gold' ? 'bg-yellow-100 text-yellow-800' :
          member.membershipTier === 'Premium' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
        }`}>
          {member.membershipTier?.slice(0,3) || 'G'}
        </span>
        <span className={`px-2 py-1 text-xs font-bold rounded-full ml-auto ${
          member.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
        }`}>
          {member.isActive ? 'A' : 'I'}
        </span>
      </div>
    </div>
  );
};

const MemberTableRow = ({ member, onView }) => (
  <tr className="hover:bg-gray-50/50 group transition-all cursor-pointer" onClick={onView}>
    <td className="px-4 py-3 rounded-l-xl">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
          <StarIcon className="w-3.5 h-3.5 text-white" />
        </div>
        <div className="min-w-0">
          <div className="font-bold text-sm leading-tight text-gray-900 truncate max-w-[140px]">{member.firstName}</div>
          <div className="text-xs text-gray-500 truncate max-w-[140px]">{member.email}</div>
        </div>
      </div>
    </td>
    <td className="px-3 py-3">
      <span className="text-xs font-bold text-indigo-600 bg-indigo-100 px-2 py-0.5 rounded">{member.memberId}</span>
    </td>
    <td className="px-3 py-3">
      <div className="flex items-center gap-1">
        <PhoneIcon className="w-3 h-3 text-gray-400" />
        <span className="text-xs font-medium text-gray-900 truncate">{member.phone}</span>
      </div>
    </td>
    <td className="px-3 py-3">
      <span className={`px-2 py-0.5 text-xs font-bold rounded-full ${
        member.membershipTier === 'Gold' ? 'bg-yellow-100 text-yellow-800' :
        member.membershipTier === 'Premium' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
      }`}>
        {member.membershipTier?.slice(0,3)}
      </span>
    </td>
    <td className="px-3 py-3">
      <span className="font-bold text-emerald-600 text-sm">{member.loyaltyPoints || 0}</span>
    </td>
    <td className="px-3 py-3">
      <span className={`px-2 py-0.5 text-xs font-bold rounded-full ${
        member.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
      }`}>
        {member.isActive ? 'Active' : 'Inactive'}
      </span>
    </td>
    <td className="px-3 py-3 text-center rounded-r-xl">
      <button
        onClick={(e) => { e.stopPropagation(); onView(); }}
        title="View Details"
        className="inline-flex items-center justify-center w-8 h-8 bg-black text-white rounded-md hover:bg-gray-900 transition"
      >
        <EyeIcon className="w-4 h-4" />
      </button>
    </td>
  </tr>
);

const AddMemberModal = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({ firstName: '', lastName: '', memberId: '', membershipTier: 'Gold' });
  const [loading, setLoading] = useState(false);

  const password = formData.firstName && formData.memberId 
    ? `${formData.firstName.toLowerCase()}@${formData.memberId.toLowerCase()}` 
    : '';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.firstName || !formData.memberId) return;
    setLoading(true);
    try {
      await onSubmit(formData);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-[340px] max-h-[85vh] overflow-hidden border border-gray-200 shadow-lg">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-base font-black text-gray-900">Add Member</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg">
            <XMarkIcon className="w-4 h-4 text-gray-500" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4 space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">Name *</label>
              <input value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})}
                className="w-full px-2.5 py-2 text-xs border border-gray-200 rounded-lg focus:ring-1 focus:ring-black h-9" required />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">Last</label>
              <input value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})}
                className="w-full px-2.5 py-2 text-xs border border-gray-200 rounded-lg focus:ring-1 focus:ring-black h-9" />
            </div>
          </div>
          
          <div>
            <label className="text-xs font-bold text-gray-700 block mb-1">ID *</label>
            <input value={formData.memberId} onChange={e => setFormData({...formData, memberId: e.target.value.toUpperCase()})}
              className="w-full px-2.5 py-2 text-xs font-mono border border-gray-200 rounded-lg focus:ring-1 focus:ring-indigo-400 h-9" required />
          </div>

          <div>
            <label className="text-xs font-bold text-gray-700 block mb-1">Tier</label>
            <select value={formData.membershipTier} onChange={e => setFormData({...formData, membershipTier: e.target.value})}
              className="w-full px-2.5 py-2 text-xs border border-gray-200 rounded-lg focus:ring-1 focus:ring-purple-400 h-9">
              <option>Gold</option><option>Premium</option><option>Elite</option>
            </select>
          </div>

          {password && (
            <div className="bg-gradient-to-r from-indigo-50/80 p-2.5 rounded-xl border border-indigo-200">
              <div className="flex items-center gap-1.5 mb-1 text-xs">
                <KeyIcon className="w-3 h-3 text-indigo-600" />
                <span className="font-bold text-indigo-800">Password</span>
              </div>
              <div className="font-mono text-indigo-900 font-bold text-xs bg-white px-2.5 py-1.5 rounded-lg border border-indigo-200 truncate">
                {password}
              </div>
            </div>
          )}
          <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
            <button onClick={onClose} type="button"
              className="px-3 py-1.5 text-xs font-bold text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all h-9">
              Cancel
            </button>
            <button type="submit"
              disabled={!formData.firstName || !formData.memberId || loading}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-white bg-black rounded-lg hover:bg-gray-900 disabled:opacity-50 transition-all h-9"
            >
              {loading ? <LoadingSpinner size="tiny" /> : <PlusIcon className="w-3.5 h-3.5" />}
              Add
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const ImportModal = ({ onClose, onImport }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = React.useRef(null);

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && (selectedFile.name.endsWith('.xlsx') || selectedFile.name.endsWith('.xls'))) {
      setFile(selectedFile);
    } else {
      toast.error('Please select a valid Excel file (.xlsx or .xls)');
      e.target.value = '';
    }
  };

  const handleImport = async () => {
    if (!file) {
      toast.error('Please select a file first');
      return;
    }
    setLoading(true);
    try {
      await onImport(file);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-[360px] max-h-[85vh] overflow-hidden border border-gray-200 shadow-lg">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-base font-black text-gray-900">Import Members</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg">
            <XMarkIcon className="w-4 h-4" />
          </button>
        </div>
        
        <div className="p-4">
          <label 
            htmlFor="import-file" 
            className={`block border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-gray-500 hover:bg-gray-50 cursor-pointer mb-4 transition-all h-28 flex flex-col items-center justify-center text-xs ${
              file ? 'border-black bg-black/5' : ''
            }`}
          >
            <DocumentArrowUpIcon className={`w-8 h-8 mb-2 ${file ? 'text-black' : 'text-gray-400'}`} />
            {!file 
              ? <>
                  <div className="font-bold text-black mb-1">Click or drag file</div>
                  <div className="text-gray-500">.xlsx, .xls only</div>
                </>
              : <div className="font-bold truncate max-w-[280px] text-black">{file.name}</div>
            }
            <input 
              id="import-file" 
              type="file" 
              accept=".xlsx,.xls" 
              onChange={handleFileSelect} 
              className="hidden" 
              ref={fileInputRef}
            />
          </label>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-xs mb-4">
            <div className="font-bold text-blue-900 mb-1 flex items-center gap-1">
              <KeyIcon className="w-3.5 h-3.5" />
              Format: A=Name, B=ID, C=Last Name, D=Tier(optional)
            </div>
          </div>
        </div>

        <div className="px-4 py-3 border-t border-gray-100 flex gap-2 bg-gray-50/50">
          <button onClick={onClose}
            className="flex-1 h-9 px-3 text-xs font-bold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            disabled={loading}
          >
            Cancel
          </button>
          <button 
            onClick={handleImport} 
            disabled={!file || loading}
            className="flex-1 h-9 px-3 text-xs font-bold text-white bg-black rounded-lg hover:bg-gray-900 disabled:opacity-50 transition-all flex items-center justify-center gap-1"
          >
            {loading ? <LoadingSpinner size="tiny" /> : <DocumentArrowUpIcon className="w-3.5 h-3.5" />}
            Import
          </button>
        </div>
      </div>
    </div>
  );
};

const ViewMemberModal = ({ member, onClose }) => (
  <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
    <div className="bg-white rounded-2xl w-full max-w-[340px] max-h-[85vh] overflow-hidden border border-gray-200 shadow-lg">
      <div className="p-4 border-b border-gray-100 flex items-center justify-between">
        <h3 className="text-base font-black text-gray-900">Member Details</h3>
        <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg">
          <XMarkIcon className="w-4 h-4" />
        </button>
      </div>
      
      <div className="p-4 space-y-3 text-xs">
        <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-blue-500 rounded-xl flex items-center justify-center">
            <StarIcon className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="font-black text-sm leading-tight">{member.firstName} {member.lastName}</div>
            <div className="text-indigo-600 font-bold bg-indigo-100 px-2 py-0.5 rounded text-xs">{member.memberId}</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="p-2.5 bg-gray-50 rounded-xl space-y-1">
            <span className="text-gray-500 block">Phone</span>
            <span className="font-bold text-gray-900">{member.phone}</span>
          </div>
          <div className="p-2.5 bg-gray-50 rounded-xl space-y-1">
            <span className="text-gray-500 block">Points</span>
            <span className="text-lg font-black text-emerald-600">{member.loyaltyPoints || 0}</span>
          </div>
          <div className="p-2.5 bg-gray-50 rounded-xl space-y-1">
            <span className="text-gray-500 block">Tier</span>
            <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
              member.membershipTier === 'Gold' ? 'bg-yellow-100 text-yellow-800' : 'bg-purple-100 text-purple-800'
            }`}>
              {member.membershipTier}
            </span>
          </div>
          <div className="p-2.5 bg-gray-50 rounded-xl space-y-1">
            <span className="text-gray-500 block">Status</span>
            <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
              member.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
            }`}>
              {member.isActive ? 'Active' : 'Inactive'}
            </span>
          </div>
        </div>
      </div>

      <div className="px-4 py-3 border-t border-gray-100">
        <button onClick={onClose}
          className="w-full h-10 px-4 text-xs font-bold text-gray-700 border border-gray-300 rounded-xl hover:bg-gray-50 transition-all"
        >Close</button>
      </div>
    </div>
  </div>
);

export default MembersManagement;
