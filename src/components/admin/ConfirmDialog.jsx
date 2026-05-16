import React from 'react';
import Modal from '../Modal';

const ConfirmDialog = ({ isOpen, onClose, title, message, confirmLabel = 'Confirm', cancelLabel = 'Cancel', onConfirm, isDestructive = false }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="space-y-6">
        <p className="text-gray-600 text-lg">{message}</p>
        <div className="flex justify-end gap-3 pt-4">
          <button 
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-bold hover:bg-gray-50 transition-colors"
          >
            {cancelLabel}
          </button>
          <button 
            onClick={() => { onConfirm(); onClose(); }}
            className={`px-5 py-2.5 rounded-xl font-bold text-white transition-colors shadow-sm ${isDestructive ? 'bg-red-600 hover:bg-red-700 shadow-red-600/20' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-600/20'}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;
