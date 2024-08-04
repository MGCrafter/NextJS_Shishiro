// components/ui_self/WelcomeForm.tsx
import { useState, useEffect } from 'react';
import { WelcomeMessageData } from '../../types/directus';

interface WelcomeFormProps {
  editingMessage: WelcomeMessageData | null;
  onFormSubmit: (message: WelcomeMessageData) => void;
  onCancel: () => void;
}

const WelcomeForm: React.FC<WelcomeFormProps> = ({ editingMessage, onFormSubmit, onCancel }) => {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (editingMessage) {
      setMessage(editingMessage.message);
    } else {
      setMessage('');
    }
  }, [editingMessage]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (message.trim()) {
      setError('');
      onFormSubmit({ message });
    } else {
      setError('Bitte geben Sie eine Nachricht ein.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <div className="mb-2">
        <label className="block text-gray-700">Message</label>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="border border-gray-300 rounded py-2 px-4 w-full"
          required
        />
        {error && <p className="text-red-500">{error}</p>}
      </div>
      <button
        type="submit"
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        {editingMessage ? 'Update' : 'Add'}
      </button>
      <button
        type="button"
        onClick={onCancel}
        className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded ml-2"
      >
        Cancel
      </button>
    </form>
  );
};

export default WelcomeForm;
