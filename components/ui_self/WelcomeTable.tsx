// components/ui_self/WelcomeTable.tsx
"use client";

import { useState, useEffect } from 'react';
import {
  fetchWelcomeMessages,
  addWelcomeMessage,
  updateWelcomeMessage,
  deleteWelcomeMessage,
} from '../../lib/utils';
import WelcomeForm from './WelcomeForm';
import { WelcomeMessageData } from '../../types/directus';
import Spinner from './spinner';
import { toast } from 'react-toastify';

const WelcomeTable: React.FC = () => {
  const [messages, setMessages] = useState<WelcomeMessageData[]>([]);
  const [editingMessage, setEditingMessage] = useState<WelcomeMessageData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function getMessages() {
      setLoading(true);
      try {
        const data = await fetchWelcomeMessages();
        setMessages(data || []);
      } catch (error) {
        toast.error('Fehler beim Abrufen der Nachrichten.');
        console.error('Error fetching messages:', error);
      } finally {
        setLoading(false);
      }
    }
    getMessages();
  }, []);

  const handleEdit = (message: WelcomeMessageData) => {
    setEditingMessage(message);
  };

  const handleDelete = async (id: number) => {
    setLoading(true);
    try {
      await deleteWelcomeMessage(id);
      setMessages([]);
      toast.success('Nachricht erfolgreich gelöscht!');
    } catch (error) {
      toast.error('Fehler beim Löschen der Nachricht.');
      console.error('Error deleting message:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = async (message: WelcomeMessageData) => {
    setLoading(true);
    try {
      if (editingMessage) {
        // Update existing message
        const updatedMessage = await updateWelcomeMessage(editingMessage.id!, message);
        setMessages(messages.map((m) => (m.id === updatedMessage.id ? updatedMessage : m)));
        setEditingMessage(null);
        toast.success('Nachricht erfolgreich aktualisiert!');
      } else if (messages.length === 0) {
        // Add new message if no existing messages
        const newMessage = await addWelcomeMessage(message);
        setMessages([newMessage]);
        toast.success('Nachricht erfolgreich hinzugefügt!');
      } else {
        // Show error if there is already a message
        toast.error('Es ist bereits eine Nachricht vorhanden. Nur eine Nachricht ist erlaubt.');
      }
    } catch (error) {
      toast.error('Fehler beim Speichern der Nachricht.');
      console.error('Error saving message:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setEditingMessage(null);
  };

  return (
    <div>
      {loading && <Spinner />}
      <WelcomeForm editingMessage={editingMessage} onFormSubmit={handleFormSubmit} onCancel={handleCancel} />
      <div className="overflow-x-auto mt-4">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="px-4 py-2">Message</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {messages.map((message) => (
              <tr key={message.id}>
                <td className="border px-4 py-2">{message.message}</td>
                <td className="border px-4 py-2">
                  <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    onClick={() => handleEdit(message)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded ml-2"
                    onClick={() => handleDelete(message.id!)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default WelcomeTable;
