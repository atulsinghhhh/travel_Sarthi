import { useState, useEffect, useCallback } from 'react';
import { packageService } from '../services/package.service';

export const usePackages = () => {
  const [data, setData] = useState({ data: [], meta: null });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    budget_min: '',
    budget_max: 200000,
    duration: '',
    type: '',
    destination: '',
    sort: ''
  });
  const [page, setPage] = useState(1);

  const fetchPackages = useCallback(async (resetData = false) => {
    setLoading(true);
    setError(null);
    try {
      const activeFilters = Object.fromEntries(
        Object.entries(filters).filter(([_, v]) => v !== '' && v !== null)
      );
      const res = await packageService.getAll({ ...activeFilters, page });
      
      setData(prev => ({
        data: resetData ? res.data.data : [...prev.data, ...res.data.data],
        meta: {
          total: res.data.total,
          current_page: res.data.current_page,
          last_page: res.data.last_page
        }
      }));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch packages');
    } finally {
      setLoading(false);
    }
  }, [filters, page]);

  useEffect(() => {
    setPage(1);
    fetchPackages(true);
  }, [filters]);

  useEffect(() => {
    if (page > 1) {
      fetchPackages(false);
    }
  }, [page]);

  const loadMore = () => {
    if (data.meta && page < data.meta.last_page) {
      setPage(prev => prev + 1);
    }
  };

  const updateFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const removeFilter = (key) => {
    setFilters(prev => ({ ...prev, [key]: '' }));
  };

  return { data: data.data, meta: data.meta, loading, error, filters, updateFilter, removeFilter, loadMore, fetchPackages };
};
