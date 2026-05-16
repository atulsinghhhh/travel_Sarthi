import { useState, useEffect } from 'react';

export const usePackageForm = (initialData = null) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState(initialData || {
    name: '', destination: '', type: 'Adventure', duration_days: 1, description: '',
    price: 0, discount_price: '', max_group_size: 1, is_active: true, is_featured: false,
    images: [],
    itinerary: [],
    included: [], excluded: [],
    available_dates: []
  });

  useEffect(() => {
    const saved = localStorage.getItem('packageFormDraft');
    if (saved && !initialData) {
      setFormData(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    if (!initialData) {
      const timer = setTimeout(() => {
        localStorage.setItem('packageFormDraft', JSON.stringify(formData));
      }, 30000);
      return () => clearTimeout(timer);
    }
  }, [formData]);

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => setStep(prev => Math.min(prev + 1, 6));
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  return { step, formData, updateField, nextStep, prevStep, setStep };
};
