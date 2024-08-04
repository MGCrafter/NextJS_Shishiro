import React, { useState, useEffect } from 'react';
import { HeaderMessageData } from '../../types/directus';

interface HeaderFormProps {
  editingHeader: HeaderMessageData | null;
  onFormSubmit: (header: HeaderMessageData) => void;
  onCancel: () => void;
}

const HeaderForm: React.FC<HeaderFormProps> = ({ editingHeader, onFormSubmit, onCancel }) => {
  const [headerText, setHeaderText] = useState('');

  useEffect(() => {
    if (editingHeader) {
      setHeaderText(editingHeader.header); // Änderung hier
    } else {
      setHeaderText('');
    }
  }, [editingHeader]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFormSubmit({ header: headerText }); // Änderung hier
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <input
        type="text"
        value={headerText}
        onChange={(e) => setHeaderText(e.target.value)}
        className="border border-gray-300 rounded py-2 px-4 w-full"
        placeholder="Enter header text"
        required
      />
      <div className="mt-4">
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          {editingHeader ? 'Update Header' : 'Add Header'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded ml-2"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default HeaderForm;
