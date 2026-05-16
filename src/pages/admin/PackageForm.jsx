import React from 'react';
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

  const handleSave = async () => {
    try {
      if (id) {
        await packageService.update(id, formData);
        showToast('Package updated successfully', 'success');
      } else {
        await packageService.create(formData);
        showToast('Package created successfully', 'success');
        localStorage.removeItem('packageFormDraft');
      }
      navigate('/admin/packages');
    } catch (e) {
      showToast('Error saving package', 'error');
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <PageHeader title={id ? "Edit Package" : "Create New Package"} />
      
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-6">
        <div className="flex items-center justify-between mb-8">
          {[1, 2, 3, 4, 5, 6].map(s => (
            <div key={s} className="flex flex-col items-center flex-1 relative">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm relative z-10 transition-colors ${step === s ? 'bg-blue-600 text-white ring-4 ring-blue-100' : step > s ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-500'}`}>
                {s}
              </div>
              {s < 6 && <div className={`absolute top-4 left-1/2 w-full h-0.5 -z-0 ${step > s ? 'bg-green-500' : 'bg-gray-100'}`}></div>}
            </div>
          ))}
        </div>

        {step === 1 && (
          <div className="space-y-5 animate-fade-in-up">
            <h3 className="text-xl font-bold text-gray-900 border-b pb-2">Basic Info</h3>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Package Name</label>
              <input className="w-full border border-gray-200 p-2.5 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" value={formData.name} onChange={e => updateField('name', e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Destination</label>
                <input className="w-full border border-gray-200 p-2.5 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" value={formData.destination} onChange={e => updateField('destination', e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Type</label>
                <select className="w-full border border-gray-200 p-2.5 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" value={formData.type} onChange={e => updateField('type', e.target.value)}>
                  <option>Adventure</option>
                  <option>Leisure</option>
                  <option>Pilgrimage</option>
                  <option>Honeymoon</option>
                  <option>Family</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Description</label>
              <textarea rows={4} className="w-full border border-gray-200 p-2.5 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 resize-none" value={formData.description} onChange={e => updateField('description', e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Price (₹)</label>
                <input type="number" className="w-full border border-gray-200 p-2.5 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" value={formData.price} onChange={e => updateField('price', e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Duration (Days)</label>
                <input type="number" className="w-full border border-gray-200 p-2.5 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" value={formData.duration_days} onChange={e => updateField('duration_days', e.target.value)} />
              </div>
            </div>
          </div>
        )}

        {step > 1 && step < 6 && (
           <div className="py-32 text-center text-gray-500 border-2 border-dashed border-gray-200 rounded-xl animate-fade-in-up">
              <h4 className="font-bold text-xl text-gray-400 mb-2">Step {step} Module</h4>
              <p>This module handles images, itinerary, and advanced settings.</p>
           </div>
        )}

        {step === 6 && (
          <div className="space-y-6 animate-fade-in-up">
            <h3 className="text-xl font-bold text-gray-900 border-b pb-2">Review & Submit</h3>
            <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
              <h4 className="font-bold text-blue-900 text-lg mb-2">{formData.name || 'Unnamed Package'}</h4>
              <p className="text-blue-700 mb-4">{formData.destination || 'No destination'} • {formData.duration_days} Days</p>
              <div className="text-3xl font-black text-blue-600 mb-6">₹{formData.price || 0}</div>
              <button onClick={handleSave} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold shadow-md shadow-blue-600/20 transition-all active:scale-95">
                Save Package
              </button>
            </div>
          </div>
        )}

        <div className="flex justify-between mt-8 pt-6 border-t border-gray-100">
          <button onClick={prevStep} disabled={step === 1} className="px-6 py-2 border border-gray-200 text-gray-600 font-bold rounded-lg disabled:opacity-50 hover:bg-gray-50 transition-colors">Back</button>
          {step < 6 && <button onClick={nextStep} className="px-6 py-2 bg-gray-900 text-white font-bold rounded-lg hover:bg-black transition-colors shadow-sm">Next Step</button>}
        </div>
      </div>
    </div>
  );
};

export default PackageForm;
