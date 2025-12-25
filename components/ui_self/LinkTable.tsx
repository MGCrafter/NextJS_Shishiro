"use client";

import { useState, useEffect } from 'react';
import { DIRECTUS_URL, MODELS } from "@/lib/config";
import { LinkData } from "@/types/directus";
import { toast } from 'react-toastify';

const LinkTable = () => {
  const [links, setLinks] = useState<LinkData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLinks = async () => {
      try {
        const response = await fetch(`${DIRECTUS_URL}/items/${MODELS.LINKS}`);
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
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Bist du sicher, dass du diesen Link löschen möchtest?")) return;

    try {
      const response = await fetch(`${DIRECTUS_URL}/items/${MODELS.LINKS}/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error("Fehler beim Löschen");
      
      setLinks(links.filter(link => link.id !== id));
      toast.success("Link erfolgreich gelöscht!");
    } catch (error) {
      toast.error("Fehler beim Löschen des Links.");
      console.error(error);
    }
  };

  if (loading) return <div>Lade Daten...</div>;

  return (
    <div className="overflow-x-auto shadow-xl rounded-lg border border-slate-700">
      <table className="w-full text-sm text-left text-slate-300">
        <thead className="text-xs uppercase bg-slate-700 text-slate-300">
          <tr>
            <th scope="col" className="px-6 py-3">Titel</th>
            <th scope="col" className="px-6 py-3">URL</th>
            <th scope="col" className="px-6 py-3 text-right">Aktionen</th>
          </tr>
        </thead>
        <tbody>
          {links.map((link) => (
            <tr key={link.id} className="border-b bg-slate-800/50 border-slate-700 hover:bg-slate-700">
              <td className="px-6 py-4 font-medium text-slate-200 whitespace-nowrap">{link.title}</td>
              <td className="px-6 py-4 text-slate-400">{link.url}</td>
              <td className="px-6 py-4 text-right space-x-4">
                <a href={`/admin/links/edit/${link.id}`} className="font-medium text-indigo-400 hover:underline">Editieren</a>
                <button onClick={() => handleDelete(link.id)} className="font-medium text-red-400 hover:underline">Löschen</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LinkTable;