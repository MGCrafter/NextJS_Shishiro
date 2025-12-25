"use client";

import { useState, useEffect } from 'react';
import { DIRECTUS_URL, MODELS } from "../../lib/config";
import { HeaderMessageData } from "../../types/directus";
import { toast } from 'react-toastify';

const HeaderTable = () => {
  const [headers, setHeaders] = useState<HeaderMessageData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHeaders = async () => {
      try {
        const response = await fetch(`${DIRECTUS_URL}/items/${MODELS.HEADER}`);
        const data = await response.json();
        setHeaders(data.data);
      } catch (error) {
        toast.error("Fehler beim Laden des Headers.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchHeaders();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Bist du sicher? Dies ist der Haupttitel der Seite.")) return;

    try {
      const response = await fetch(`${DIRECTUS_URL}/items/${MODELS.HEADER}/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error("Fehler beim Löschen");
      
      setHeaders(headers.filter(header => header.id !== id));
      toast.success("Header erfolgreich gelöscht!");
    } catch (error) {
      toast.error("Fehler beim Löschen des Headers.");
      console.error(error);
    }
  };

  if (loading) return <div>Lade Daten...</div>;

  return (
    <div className="overflow-x-auto shadow-xl rounded-lg border border-slate-700">
      <table className="w-full text-sm text-left text-slate-300">
        <thead className="text-xs uppercase bg-slate-700 text-slate-300">
          <tr>
            <th scope="col" className="px-6 py-3">Header Text</th>
            <th scope="col" className="px-6 py-3 text-right">Aktionen</th>
          </tr>
        </thead>
        <tbody>
          {headers.map((header) => (
            <tr key={header.id} className="border-b bg-slate-800/50 border-slate-700 hover:bg-slate-700">
              <td className="px-6 py-4 font-medium text-slate-200">{header.header}</td>
              <td className="px-6 py-4 text-right space-x-4">
                <a href={`/admin/header/edit/${header.id}`} className="font-medium text-indigo-400 hover:underline">Editieren</a>
                <button onClick={() => handleDelete(header.id)} className="font-medium text-red-400 hover:underline">Löschen</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default HeaderTable;