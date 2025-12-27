"use client";

import { useState, useEffect } from 'react';
import { DIRECTUS_URL, MODELS } from "../../lib/config";
import { WelcomeMessageData } from "../../types/directus";
import { toast } from 'react-toastify';
import useUserStore from "../../lib/state";
import { Pencil, Trash2, Check, X, Plus } from 'lucide-react';

const WelcomeTable = () => {
  const token = useUserStore((state) => state.token);
  const [messages, setMessages] = useState<WelcomeMessageData[]>([]);
  const [loading, setLoading] = useState(true);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editValue, setEditValue] = useState("");

  const [isAdding, setIsAdding] = useState(false);
  const [newValue, setNewValue] = useState("");

  useEffect(() => {
    const fetchMessages = async () => {
      const headers: HeadersInit = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      try {
        const response = await fetch(`${DIRECTUS_URL}/items/${MODELS.WELCOME}`, { headers });
        const data = await response.json();
        setMessages(data.data || []);
      } catch (error) {
        toast.error("Fehler beim Laden.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
  }, [token]);

  const getHeaders = () => {
    const h: HeadersInit = { 'Content-Type': 'application/json' };
    if (token) h['Authorization'] = `Bearer ${token}`;
    return h;
  };

  const handleSave = async (id: number) => {
    try {
      const response = await fetch(`${DIRECTUS_URL}/items/${MODELS.WELCOME}/${id}`, {
        method: 'PATCH',
        headers: getHeaders(),
        body: JSON.stringify({ message: editValue }),
      });
      if (!response.ok) throw new Error("Fehler");
      
      setMessages(messages.map(m => m.id === id ? { ...m, message: editValue } : m));
      toast.success("Nachricht aktualisiert!");
      setEditingId(null);
    } catch (error) {
      toast.error("Speichern fehlgeschlagen.");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Nachricht löschen?")) return;
    try {
      await fetch(`${DIRECTUS_URL}/items/${MODELS.WELCOME}/${id}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });
      setMessages(messages.filter(m => m.id !== id));
      toast.success("Gelöscht!");
    } catch (error) {
      toast.error("Löschen fehlgeschlagen.");
    }
  };

  const handleAdd = async () => {
    if (!newValue.trim()) return;
    try {
      const response = await fetch(`${DIRECTUS_URL}/items/${MODELS.WELCOME}`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ message: newValue }),
      });
      const res = await response.json();
      setMessages([...messages, res.data]);
      toast.success("Nachricht erstellt!");
      setIsAdding(false);
      setNewValue("");
    } catch (error) {
      toast.error("Erstellen fehlgeschlagen.");
    }
  };

  if (loading) return <div className="text-slate-400">Lade...</div>;

  return (
    <div className="space-y-4">
      {/* Add Message Form */}
      {isAdding && (
        <div className="p-4 bg-slate-800 border border-indigo-500/30 rounded-xl flex gap-2 flex-col animate-in fade-in">
           <textarea 
            autoFocus
            className="w-full h-24 bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500"
            placeholder="Deine Willkommensnachricht..."
            value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
          />
          <div className="flex justify-end gap-2">
            <button onClick={handleAdd} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-bold">Save</button>
            <button onClick={() => setIsAdding(false)} className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg">Cancel</button>
          </div>
        </div>
      )}

      <div className="overflow-hidden shadow-xl rounded-xl border border-slate-700">
        <table className="w-full text-sm text-left text-slate-300">
          <thead className="text-xs uppercase bg-slate-800 text-slate-400">
            <tr>
              <th className="px-6 py-4">Nachricht</th>
              <th className="px-6 py-4 text-right">Aktionen</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/50 bg-slate-900/20">
            {messages.map((msg) => (
              <tr key={msg.id} className="group hover:bg-slate-800/50 transition-colors">
                <td className="px-6 py-4">
                  {editingId === msg.id ? (
                    <textarea 
                      rows={3}
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      className="w-full bg-slate-900 border border-indigo-500 rounded px-3 py-1 text-white focus:outline-none"
                    />
                  ) : (
                    <span className="text-slate-200">{msg.message}</span>
                  )}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    {editingId === msg.id ? (
                      <>
                        <button
                          onClick={() => handleSave(msg.id)}
                          className="p-2 bg-green-600/20 text-green-400 hover:bg-green-600 hover:text-white rounded-full transition-all"
                          title="Speichern"
                        >
                          <Check size={18} />
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="p-2 bg-slate-700/50 text-slate-300 hover:bg-slate-700 hover:text-white rounded-full transition-all"
                          title="Abbrechen"
                        >
                          <X size={18} />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => { setEditingId(msg.id); setEditValue(msg.message); }}
                          className="p-2 bg-indigo-600/20 text-indigo-400 hover:bg-indigo-600 hover:text-white rounded-full opacity-0 group-hover:opacity-100 focus:opacity-100 transition-all transform scale-90 hover:scale-100"
                          title="Editieren"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(msg.id)}
                          className="p-2 bg-red-600/20 text-red-400 hover:bg-red-600 hover:text-white rounded-full opacity-0 group-hover:opacity-100 focus:opacity-100 transition-all transform scale-90 hover:scale-100"
                          title="Löschen"
                        >
                          <Trash2 size={16} />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {messages.length === 0 && !isAdding && (
              <tr>
                <td colSpan={2} className="px-6 py-8 text-center text-slate-500">
                  Keine Nachricht vorhanden. <button onClick={() => setIsAdding(true)} className="text-indigo-400 underline ml-2">Jetzt erstellen?</button>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default WelcomeTable;