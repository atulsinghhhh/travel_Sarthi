import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePackageForm } from '../../hooks/usePackageForm';
import PageHeader from '../../components/admin/PageHeader';
import { packageService } from '../../services/package.service';
import { useToast } from '../../context/ToastContext';

const PackageForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { step, formData, updateField, nextStep, prevStep } = usePackageForm();

  useEffect(() => {
    if (id) {
      loadPackage();
    }
  }, [id]);

  const loadPackage = async () => {
    try {
      const { data } = await packageService.getById(id);
      updateField('name', data.title || '');
      updateField('destination', data.destination || '');
      updateField('type', data.type || 'Adventure');
      updateField('description', data.description || '');
      updateField('price', data.budget || data.price || 0);
      updateField('duration_days', data.duration || data.duration_days || 1);
      updateField('image', data.image || '');
    } catch (e) {
      showToast('Failed to load package details', 'error');
    }
  };

  const handleSave = async () => {
    try {
      const payload = {
        title: formData.name || formData.title || 'Curated Tour Package',
        description: formData.description || 'Amazing travel experience with guided tours.',
        destination: formData.destination || 'Goa',
        duration: Number(formData.duration_days || formData.duration || 3),
        budget: Number(formData.price || formData.budget || 15000),
        type: formData.type || 'Leisure',
        image: formData.image || formData.images?.[0] || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800'
      };

      if (id) {
        await packageService.update(id, payload);
        showToast('Package updated successfully', 'success');
      } else {
        await packageService.create(payload);
        showToast('Package created successfully', 'success');
        localStorage.removeItem('packageFormDraft');
      }
      navigate('/admin/packages');
    } catch (e) {
      showToast(e.response?.data?.message || 'Error saving package', 'error');
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <PageHeader title={id ? "Edit Package" : "Create New Package"} />
      
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 mb-6">
        <div className="flex items-center justify-between mb-10">
          {[1, 2, 3].map(s => (
            <div key={s} className="flex flex-col items-center flex-1 relative">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm relative z-10 transition-all ${step === s ? 'bg-[#FF385C] text-white ring-4 ring-[#FF385C]/20 shadow-md' : step > s ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-500'}`}>
                {s}
              </div>
              {s < 3 && <div className={`absolute top-5 left-1/2 w-full h-0.5 -z-0 ${step > s ? 'bg-green-500' : 'bg-gray-100'}`}></div>}
            </div>
          ))}
        </div>

        {step === 1 && (
          <div className="space-y-6 animate-fade-in-up">
            <h3 className="text-xl font-bold text-gray-900 border-b pb-3">Step 1: Basic Info</h3>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Package Title</label>
              <input 
                className="w-full bg-gray-50 border border-gray-200 p-3.5 rounded-xl outline-none focus:ring-2 focus:ring-[#FF385C]/20 focus:border-[#FF385C] text-sm transition-all" 
                placeholder="e.g. 5 Days Exotic Maldives Luxury Escape"
                value={formData.name || ''} 
                onChange={e => updateField('name', e.target.value)} 
              />
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Destination</label>
                <input 
                  className="w-full bg-gray-50 border border-gray-200 p-3.5 rounded-xl outline-none focus:ring-2 focus:ring-[#FF385C]/20 focus:border-[#FF385C] text-sm transition-all" 
                  placeholder="e.g. Maldives"
                  value={formData.destination || ''} 
                  onChange={e => updateField('destination', e.target.value)} 
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Category Type</label>
                <select 
                  className="w-full bg-gray-50 border border-gray-200 p-3.5 rounded-xl outline-none focus:ring-2 focus:ring-[#FF385C]/20 focus:border-[#FF385C] text-sm transition-all cursor-pointer" 
                  value={formData.type || 'Leisure'} 
                  onChange={e => updateField('type', e.target.value)}
                >
                  <option value="Adventure">Adventure</option>
                  <option value="Leisure">Leisure</option>
                  <option value="Pilgrimage">Pilgrimage</option>
                  <option value="Honeymoon">Honeymoon</option>
                  <option value="Family">Family</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Detailed Description</label>
              <textarea 
                rows={5} 
                className="w-full bg-gray-50 border border-gray-200 p-3.5 rounded-xl outline-none focus:ring-2 focus:ring-[#FF385C]/20 focus:border-[#FF385C] text-sm transition-all resize-none" 
                placeholder="Describe the wonderful sights, stays, and experiences..."
                value={formData.description || ''} 
                onChange={e => updateField('description', e.target.value)} 
              />
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Price / Budget (₹)</label>
                <input 
                  type="number" 
                  className="w-full bg-gray-50 border border-gray-200 p-3.5 rounded-xl outline-none focus:ring-2 focus:ring-[#FF385C]/20 focus:border-[#FF385C] text-sm transition-all" 
                  value={formData.price || 0} 
                  onChange={e => updateField('price', e.target.value)} 
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Duration (Days)</label>
                <input 
                  type="number" 
                  className="w-full bg-gray-50 border border-gray-200 p-3.5 rounded-xl outline-none focus:ring-2 focus:ring-[#FF385C]/20 focus:border-[#FF385C] text-sm transition-all" 
                  value={formData.duration_days || 1} 
                  onChange={e => updateField('duration_days', e.target.value)} 
                />
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
           <div className="space-y-6 animate-fade-in-up">
              <h3 className="text-xl font-bold text-gray-900 border-b pb-3">Step 2: Media & Images</h3>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Main Image URL</label>
                <input 
                  type="url"
                  className="w-full bg-gray-50 border border-gray-200 p-3.5 rounded-xl outline-none focus:ring-2 focus:ring-[#FF385C]/20 focus:border-[#FF385C] text-sm transition-all" 
                  placeholder="https://images.unsplash.com/..."
                  value={formData.image || ''} 
                  onChange={e => updateField('image', e.target.value)} 
                />
                <p className="text-xs text-gray-500 mt-2">Paste any high-quality Unsplash or direct image URL.</p>
              </div>
              {formData.image && (
                <div className="h-64 rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
                  <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
           </div>
        )}

        {step === 3 && (
          <div className="space-y-6 animate-fade-in-up">
            <h3 className="text-xl font-bold text-gray-900 border-b pb-3">Step 3: Review & Publish</h3>
            <div className="bg-[#FF385C]/5 p-8 rounded-3xl border border-[#FF385C]/10 shadow-sm">
              <h4 className="font-bold text-gray-900 text-2xl mb-2">{formData.name || 'Unnamed Tour Package'}</h4>
              <p className="text-gray-600 font-medium mb-6">{formData.destination || 'No destination'} • {formData.duration_days} Days</p>
              <div className="text-4xl font-black text-[#FF385C] mb-8">₹{Number(formData.price || 0).toLocaleString('en-IN')}</div>
              <button 
                onClick={handleSave} 
                className="w-full bg-[#FF385C] hover:bg-[#D70466] text-white py-4 rounded-xl font-bold shadow-lg text-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0"
              >
                Publish Tour Package
              </button>
            </div>
          </div>
        )}

        <div className="flex justify-between mt-10 pt-6 border-t border-gray-100">
          <button 
            onClick={prevStep} 
            disabled={step === 1} 
            className="px-6 py-3 border border-gray-200 text-gray-700 font-semibold rounded-xl disabled:opacity-40 hover:bg-gray-50 transition-colors text-sm"
          >
            Back
          </button>
          {step < 3 && (
            <button 
              onClick={nextStep} 
              className="px-8 py-3 bg-gray-900 text-white font-semibold rounded-xl hover:bg-black transition-colors shadow-md text-sm"
            >
              Next Step
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PackageForm;
