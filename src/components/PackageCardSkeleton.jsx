import React from 'react';
import SkeletonCard from './SkeletonCard';

const PackageCardSkeleton = () => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-full">
      <SkeletonCard className="h-48 w-full rounded-none" />
      <div className="p-5 flex-grow flex flex-col gap-3">
        <div className="flex justify-between">
          <SkeletonCard className="h-5 w-20" />
          <SkeletonCard className="h-5 w-16" />
        </div>
        <SkeletonCard className="h-7 w-3/4" />
        <SkeletonCard className="h-4 w-1/2" />
        <div className="mt-auto pt-4 border-t border-gray-100 flex justify-between items-center">
          <SkeletonCard className="h-6 w-24" />
          <SkeletonCard className="h-8 w-24 rounded-lg" />
        </div>
      </div>
    </div>
  );
};

export default PackageCardSkeleton;
