"use client";

import { useState, useEffect } from 'react';
import { DIRECTUS_URL, MODELS } from "../../lib/config";
import { LinkData } from "../../types/directus";
import { toast } from 'react-toastify';
import useUserStore from "../../lib/state";
import { Reorder } from 'framer-motion';
import { GripVertical, Pencil, Trash2, Check, X, Plus } from 'lucide-react';

const LinkTable = () => {
  const token = useUserStore((state) => state.token);
  const [links, setLinks] = useState<LinkData[]>([]);
  const [loading, setLoading] = useState(true);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<{ title: string; url: string } | null>(null);

  useEffect(() => {
    const fetchLinks = async () => {
      const headers: HeadersInit = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      try {
        const response = await fetch(`${DIRECTUS_URL}/items/${MODELS.LINKS}?sort=sort`, { headers });
        if (!response.ok) throw new Error("Fehler beim Laden");
        const data = await response.json();
        setLinks(data.data);
      } catch (error) {
        toast.error("Fehler beim Laden der Links.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchLinks();
  }, [token]);

  const getHeaders = () => {
    const h: HeadersInit = { 'Content-Type': 'application/json' };
    if (token) h['Authorization'] = `Bearer ${token}`;
    return h;
  };

  const handleReorder = async (newLinks: LinkData[]) => {
    setLinks(newLinks);

    const updatePromises = newLinks.map((link, index) => {
      return fetch(`${DIRECTUS_URL}/items/${MODELS.LINKS}/${link.id}`, {
        method: 'PATCH',
        headers: getHeaders(),
        body: JSON.stringify({ sort: index }),
      });
    });

    try {
      await Promise.all(updatePromises);
    } catch (error) {
      toast.error("Fehler beim Speichern der Reihenfolge");
      console.error(error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Bist du sicher, dass du diesen Link löschen möchtest?")) return;
    try {
      await fetch(`${DIRECTUS_URL}/items/${MODELS.LINKS}/${id}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });
      setLinks(links.filter(link => link.id !== id));
      toast.success("Link gelöscht!");
    } catch (error) {
      toast.error("Fehler beim Löschen.");
    }
  };

  const handleEditClick = (link: LinkData) => {
    setEditingId(link.id);
    setEditForm({ title: link.title, url: link.url });
  };

  const handleSaveClick = async () => {
    if (!editForm || editingId === null) return;
    try {
      const response = await fetch(`${DIRECTUS_URL}/items/${MODELS.LINKS}/${editingId}`, {
        method: 'PATCH',
        headers: getHeaders(),
        body: JSON.stringify(editForm),
      });
      if (!response.ok) throw new Error("Fehler");
      
      setLinks(links.map(link => link.id === editingId ? { ...link, ...editForm } : link));
      toast.success("Link aktualisiert!");
      setEditingId(null);
      setEditForm(null);
    } catch (error) {
      toast.error("Fehler beim Speichern.");
    }
  };

  const handleCancelClick = () => {
    setEditingId(null);
    setEditForm(null);
  };

  const handleAddClick = async () => {
    const newLinkData = {
      title: "Neuer Link",
      url: "https://",
      sort: links.length
    };

    try {
      const response = await fetch(`${DIRECTUS_URL}/items/${MODELS.LINKS}`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(newLinkData),
      });
      const result = await response.json();
      const createdLink = result.data;
      
      setLinks([...links, createdLink]);
      setEditingId(createdLink.id);
      setEditForm({ title: createdLink.title, url: createdLink.url });
      toast.success("Link erstellt - Bitte bearbeiten");
    } catch (error) {
      toast.error("Fehler beim Erstellen");
    }
  };

  if (loading) return <div className="p-4 text-slate-400 text-center">Lade Links...</div>;

  return (
    <div className="space-y-6 w-full">
      
      {/* Header mit Add Button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="w-1 h-6 bg-indigo-500 rounded-full"></span>
            Links verwalten
          </h3>
          <p className="text-sm text-slate-400 mt-1">Ziehe die Links um die Reihenfolge zu ändern.</p>
        </div>
        <button
          onClick={handleAddClick}
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg transition-all shadow-lg shadow-indigo-500/20 flex items-center gap-2 active:scale-95"
        >
          <Plus size={18} />
          <span>Neuer Link</span>
        </button>
      </div>

      {/* DRAG & DROP LISTE */}
      <div className="bg-slate-900/50 rounded-xl border border-slate-800 p-2 shadow-2xl">
        <Reorder.Group 
          axis="y" 
          values={links} 
          onReorder={handleReorder}
          layoutScroll={true} // WICHTIG: Ermöglicht Scrollen bei langen Listen während des Drags
        >
          {links.map((link) => (
            <Reorder.Item 
              key={link.id} 
              value={link} 
              id={`link-${link.id}`}
              drag={!editingId} 
              className="group mb-2 last:mb-0"
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <div className={`
                flex items-center gap-4 p-4 rounded-lg border transition-all duration-200 select-none
                ${editingId === link.id 
                  ? "bg-indigo-900/40 border-indigo-500 shadow-lg shadow-indigo-500/10 ring-1 ring-indigo-500/50" 
                  : "bg-slate-800 border-slate-700/50 hover:bg-slate-700 hover:border-slate-600"}
              `}>
                {/* Drag Handle (Grip) */}
                {!editingId && (
                  <div className="cursor-grab active:cursor-grabbing text-slate-500 hover:text-white transition-colors p-1 rounded hover:bg-slate-700">
                    <GripVertical size={20} />
                  </div>
                )}

                {/* Sort Number (Nur Anzeige, wird durch Drag geändert) */}
                {!editingId && (
                  <div className="w-6 text-center font-mono text-slate-500 text-sm font-bold select-none">
                    {link.sort + 1}
                  </div>
                )}

                {/* Content Area */}
                <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-3">
                  {editingId === link.id ? (
                    <>
                      <div className="md:col-span-4">
                        <label className="block text-[10px] uppercase text-indigo-400 font-bold mb-1">Titel</label>
                        <input 
                          autoFocus
                          value={editForm?.title || ''} 
                          onChange={(e) => setEditForm({...editForm!, title: e.target.value})}
                          className="w-full bg-slate-950 border border-indigo-500/50 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-slate-600"
                          placeholder="Titel eingeben..."
                        />
                      </div>
                      <div className="md:col-span-8">
                        <label className="block text-[10px] uppercase text-indigo-400 font-bold mb-1">URL</label>
                        <input 
                          value={editForm?.url || ''} 
                          onChange={(e) => setEditForm({...editForm!, url: e.target.value})}
                          className="w-full bg-slate-950 border border-indigo-500/50 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-slate-600 font-mono text-sm"
                          placeholder="https://..."
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="md:col-span-4 font-medium text-white truncate">
                        {link.title}
                      </div>
                      <div className="md:col-span-8 text-slate-400 truncate font-mono text-sm">
                        {link.url}
                      </div>
                    </>
                  )}
                </div>

                {/* Actions / Buttons */}
                <div className="flex items-center gap-2 ml-2">
                  {editingId === link.id ? (
                    <>
                      <button 
                        onClick={handleSaveClick} 
                        className="p-2 bg-green-600/20 text-green-400 hover:bg-green-600 hover:text-white rounded-full transition-all"
                        title="Speichern"
                      >
                        <Check size={18} />
                      </button>
                      <button 
                        onClick={handleCancelClick} 
                        className="p-2 bg-slate-700/50 text-slate-300 hover:bg-slate-700 hover:text-white rounded-full transition-all"
                        title="Abbrechen"
                      >
                        <X size={18} />
                      </button>
                    </>
                  ) : (
                    <>
                      <button 
                        onClick={() => handleEditClick(link)} 
                        className="p-2 bg-indigo-600/20 text-indigo-400 hover:bg-indigo-600 hover:text-white rounded-full opacity-0 group-hover:opacity-100 focus:opacity-100 transition-all transform scale-90 hover:scale-100"
                        title="Editieren"
                      >
                        <Pencil size={16} />
                      </button>
                      <button 
                        onClick={() => handleDelete(link.id)} 
                        className="p-2 bg-red-600/20 text-red-400 hover:bg-red-600 hover:text-white rounded-full opacity-0 group-hover:opacity-100 focus:opacity-100 transition-all transform scale-90 hover:scale-100"
                        title="Löschen"
                      >
                        <Trash2 size={16} />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </Reorder.Item>
          ))}
        </Reorder.Group>
        
        {links.length === 0 && (
          <div className="text-center py-12 border-2 border-dashed border-slate-800 rounded-xl bg-slate-900/30">
            <p className="text-slate-500 italic">Noch keine Links vorhanden.</p>
            <button onClick={handleAddClick} className="mt-2 text-indigo-400 hover:text-indigo-300 text-sm font-semibold">
              Jetzt den ersten erstellen?
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LinkTable;