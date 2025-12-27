"use client";

import { useState, useEffect } from 'react';
import { DIRECTUS_URL, MODELS } from "../../lib/config";
import { BackgroundVideoData } from "../../types/directus";
import { toast } from 'react-toastify';
import useUserStore from "../../lib/state";
import { Pencil, Trash2, Check, X, Plus } from 'lucide-react';

const VideoTable = () => {
  const token = useUserStore((state) => state.token);
  const [videos, setVideos] = useState<BackgroundVideoData[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editValue, setEditValue] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [newValue, setNewValue] = useState("");

  useEffect(() => {
    const fetchVideos = async () => {
      const headers: HeadersInit = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      try {
        const response = await fetch(`${DIRECTUS_URL}/items/${MODELS.BACKGROUND_VIDEO}`, { headers });
        const data = await response.json();
        setVideos(data.data || []);
      } catch (error) {
        toast.error("Fehler beim Laden.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchVideos();
  }, [token]);

  const getHeaders = () => {
    const h: HeadersInit = { 'Content-Type': 'application/json' };
    if (token) h['Authorization'] = `Bearer ${token}`;
    return h;
  };

  const handleSave = async (id: number) => {
    try {
      const response = await fetch(`${DIRECTUS_URL}/items/${MODELS.BACKGROUND_VIDEO}/${id}`, {
        method: 'PATCH',
        headers: getHeaders(),
        body: JSON.stringify({ video_url: editValue }),
      });
      if (!response.ok) throw new Error("Fehler");

      setVideos(videos.map(v => v.id === id ? { ...v, video_url: editValue } : v));
      toast.success("Video URL aktualisiert!");
      setEditingId(null);
    } catch (error) {
      toast.error("Speichern fehlgeschlagen.");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Video URL wirklich löschen?")) return;
    try {
      await fetch(`${DIRECTUS_URL}/items/${MODELS.BACKGROUND_VIDEO}/${id}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });
      setVideos(videos.filter(v => v.id !== id));
      toast.success("Gelöscht!");
    } catch (error) {
      toast.error("Löschen fehlgeschlagen.");
    }
  };

  const handleSetActive = async (id: number) => {
    try {
      await Promise.all(
        videos.map(v =>
          fetch(`${DIRECTUS_URL}/items/${MODELS.BACKGROUND_VIDEO}/${v.id}`, {
            method: 'PATCH',
            headers: getHeaders(),
            body: JSON.stringify({ is_active: false }),
          })
        )
      );

      await fetch(`${DIRECTUS_URL}/items/${MODELS.BACKGROUND_VIDEO}/${id}`, {
        method: 'PATCH',
        headers: getHeaders(),
        body: JSON.stringify({ is_active: true }),
      });

      setVideos(videos.map(v => ({ ...v, is_active: v.id === id })));
      toast.success("Als aktiv gesetzt!");
    } catch (error) {
      toast.error("Fehler beim Aktivieren.");
    }
  };

  const handleAdd = async () => {
    if (!newValue.trim()) return;
    try {
      const response = await fetch(`${DIRECTUS_URL}/items/${MODELS.BACKGROUND_VIDEO}`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ video_url: newValue }),
      });
      const res = await response.json();
      setVideos([...videos, res.data]);
      toast.success("Video URL erstellt!");
      setIsAdding(false);
      setNewValue("");
    } catch (error) {
      toast.error("Erstellen fehlgeschlagen.");
    }
  };

  if (loading) return <div className="text-slate-400">Lade...</div>;

  return (
    <div className="space-y-4">
      <div className="p-4 bg-indigo-900/20 border border-indigo-500/30 rounded-xl">
        <p className="text-sm text-indigo-300">
          <strong>Tipp:</strong> Du kannst entweder eine vollständige URL eingeben (z.B. https://example.com/video.mp4)
          oder einen Pfad relativ zum public-Ordner (z.B. /website.mp4).
          <br />
          <strong>Unterstützte Formate:</strong> MP4, WebM (Video) und GIF (animierte Bilder)
        </p>
      </div>

      {isAdding && (
        <div className="p-4 bg-slate-800 border border-indigo-500/30 rounded-xl flex gap-2 items-center animate-in fade-in">
          <input
            autoFocus
            className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500 font-mono text-sm"
            placeholder="/website.mp4, /animation.gif oder https://..."
            value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
          />
          <button onClick={handleAdd} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-bold">Save</button>
          <button onClick={() => setIsAdding(false)} className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg">Cancel</button>
        </div>
      )}

      <div className="overflow-hidden shadow-xl rounded-xl border border-slate-700">
        <table className="w-full text-sm text-left text-slate-300">
          <thead className="text-xs uppercase bg-slate-800 text-slate-400">
            <tr>
              <th className="px-6 py-4">Video URL / Pfad</th>
              <th className="px-6 py-4 text-right">Aktionen</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/50 bg-slate-900/20">
            {videos.map((v) => (
              <tr key={v.id} className="group hover:bg-slate-800/50 transition-colors">
                <td className="px-6 py-4">
                  {editingId === v.id ? (
                    <input
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      className="w-full bg-slate-900 border border-indigo-500 rounded px-3 py-2 text-white focus:outline-none font-mono text-sm"
                      placeholder="/website.mp4, /animation.gif oder https://..."
                    />
                  ) : (
                    <div className="flex flex-col gap-1">
                      <span className="font-mono text-sm text-white">{v.video_url}</span>
                      {v.is_active && (
                        <span className="text-xs text-green-400 flex items-center gap-1">
                          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                          Aktiv (wird auf der Homepage angezeigt)
                        </span>
                      )}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    {editingId === v.id ? (
                      <>
                        <button
                          onClick={() => handleSave(v.id)}
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
                        {!v.is_active && (
                          <button
                            onClick={() => handleSetActive(v.id)}
                            className="px-3 py-1.5 bg-green-600/20 text-green-400 hover:bg-green-600 hover:text-white rounded-lg text-xs font-semibold opacity-0 group-hover:opacity-100 focus:opacity-100 transition-all"
                            title="Als aktiv setzen"
                          >
                            Aktivieren
                          </button>
                        )}
                        <button
                          onClick={() => { setEditingId(v.id); setEditValue(v.video_url); }}
                          className="p-2 bg-indigo-600/20 text-indigo-400 hover:bg-indigo-600 hover:text-white rounded-full opacity-0 group-hover:opacity-100 focus:opacity-100 transition-all transform scale-90 hover:scale-100"
                          title="Editieren"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(v.id)}
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
            {videos.length === 0 && !isAdding && (
              <tr>
                <td colSpan={2} className="px-6 py-8 text-center text-slate-500">
                  Kein Background Video gesetzt. <button onClick={() => setIsAdding(true)} className="text-indigo-400 underline ml-2">Jetzt erstellen?</button>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {videos.length > 0 && !isAdding && (
        <button
          onClick={() => setIsAdding(true)}
          className="w-full px-4 py-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-indigo-500/50 text-slate-300 hover:text-white rounded-lg transition-all flex items-center justify-center gap-2"
        >
          <Plus size={18} />
          <span>Weitere Video URL hinzufügen</span>
        </button>
      )}
    </div>
  );
};

export default VideoTable;
