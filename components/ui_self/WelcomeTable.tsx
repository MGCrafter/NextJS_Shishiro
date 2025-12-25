"use client";

import { useState, useEffect } from 'react';
import { DIRECTUS_URL, MODELS } from "@/lib/config";
import { WelcomeMessageData } from "@/types/directus";
import { toast } from 'react-toastify';

const WelcomeTable = () => {
  const [messages, setMessages] = useState<WelcomeMessageData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch(`${DIRECTUS_URL}/items/${MODELS.WELCOME}`);
        const data = await response.json();
        setMessages(data.data);
      } catch (error) {
        toast.error("Fehler beim Laden der Welcome-Message.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Bist du sicher, dass du diese Nachricht löschen möchtest?")) return;

    try {
      const response = await fetch(`${DIRECTUS_URL}/items/${MODELS.WELCOME}/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error("Fehler beim Löschen");
      
      setMessages(messages.filter(msg => msg.id !== id));
      toast.success("Nachricht erfolgreich gelöscht!");
    } catch (error) {
      toast.error("Fehler beim Löschen der Nachricht.");
      console.error(error);
    }
  };

  if (loading) return <div>Lade Daten...</div>;

  return (
    <div className="overflow-x-auto shadow-xl rounded-lg border border-slate-700">
      <table className="w-full text-sm text-left text-slate-300">
        <thead className="text-xs uppercase bg-slate-700 text-slate-300">
          <tr>
            <th scope="col" className="px-6 py-3">Nachricht</th>
            <th scope="col" className="px-6 py-3 text-right">Aktionen</th>
          </tr>
        </thead>
        <tbody>
          {messages.map((msg) => (
            <tr key={msg.id} className="border-b bg-slate-800/50 border-slate-700 hover:bg-slate-700">
              <td className="px-6 py-4 text-slate-200">{msg.message}</td>
              <td className="px-6 py-4 text-right space-x-4">
                <a href={`/admin/welcome/edit/${msg.id}`} className="font-medium text-indigo-400 hover:underline">Editieren</a>
                <button onClick={() => handleDelete(msg.id)} className="font-medium text-red-400 hover:underline">Löschen</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default WelcomeTable;