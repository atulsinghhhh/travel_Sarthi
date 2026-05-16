import { useState } from 'react';
import api from '../services/api';
import { useToast } from '../context/ToastContext';

export const useFavorite = (packageId, initialFavorited = false) => {
  const [isFavorited, setIsFavorited] = useState(initialFavorited);
  const { showToast } = useToast();

  const toggleFavorite = async () => {
    // Optimistic UI update
    const previousState = isFavorited;
    setIsFavorited(!previousState);

    try {
      await api.post('/favorites', { package_id: packageId });
      showToast(previousState ? 'Removed from favorites' : 'Added to favorites', 'success');
    } catch (error) {
      // Revert on error
      setIsFavorited(previousState);
      showToast('Failed to update favorites', 'error');
    }
  };

  return { isFavorited, toggleFavorite };
};
