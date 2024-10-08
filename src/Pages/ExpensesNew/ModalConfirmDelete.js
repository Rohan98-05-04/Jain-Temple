import React from 'react';

const ModalConfirmDelete = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 max-w-sm">
        <h2 className="text-lg font-bold mb-4">Confirm Delete</h2>
        <p>Are you sure you want to delete this record?</p>
        <div className="mt-4 flex justify-end">
          <button className="bg-gray-300 text-black py-2 px-4 rounded-md mr-2" onClick={onClose}>Cancel</button>
          <button className="bg-red-600 text-white py-2 px-4 rounded-md" onClick={onConfirm}>Delete</button>
        </div>
      </div>
    </div>
  );
};

export default ModalConfirmDelete;
