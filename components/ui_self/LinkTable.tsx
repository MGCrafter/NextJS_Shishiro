// components/LinkTable.tsx
import { useState, useEffect } from "react";
import { fetchLinks, addLink, updateLink, deleteLink } from "../../lib/utils";
import LinkForm from "./LinkForm";
import { LinkData } from "../../types/directus";
import Spinner from "./spinner";
import { toast } from "react-toastify";

const LinkTable: React.FC = () => {
  const [links, setLinks] = useState<LinkData[]>([]);
  const [editingLink, setEditingLink] = useState<LinkData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function getLinks() {
      setLoading(true);
      try {
        const data = await fetchLinks();
        setLinks(data || []);
      } catch (error) {
        toast.error("Fehler beim Abrufen der Links.");
        console.error("Error fetching links:", error);
      } finally {
        setLoading(false);
      }
    }
    getLinks();
  }, []);

  const handleEdit = (link: LinkData) => {
    setEditingLink(link);
  };

  const handleDelete = async (id: number) => {
    setLoading(true);
    try {
      await deleteLink(id);
      setLinks(links.filter((link) => link.id !== id));
      toast.success("Link erfolgreich gelöscht!");
    } catch (error) {
      toast.error("Fehler beim Löschen des Links.");
      console.error("Error deleting link:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = async (link: LinkData) => {
    setLoading(true);
    try {
      if (editingLink) {
        const updatedLink = await updateLink(editingLink.id!, link);
        setLinks(links.map((l) => (l.id === updatedLink.id ? updatedLink : l)));
        setEditingLink(null);
        toast.success("Link erfolgreich aktualisiert!");
      } else {
        const newLink = await addLink(link);
        setLinks([...links, newLink]);
        toast.success("Link erfolgreich hinzugefügt!");
      }
    } catch (error) {
      toast.error("Fehler beim Speichern des Links.");
      console.error("Error saving link:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setEditingLink(null);
  };

  return (
    <div>
      {loading && <Spinner />}
      <LinkForm
        editingLink={editingLink}
        onFormSubmit={handleFormSubmit}
        onCancel={handleCancel}
      />
      <div className="overflow-x-auto mt-4">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="w-1/3 px-4 py-2">URL</th>
              <th className="w-1/3 px-4 py-2">Title</th>
              <th className="w-1/3 px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {links.map((link) => (
              <tr key={link.url}>
                <td className="border px-4 py-2">{link.url}</td>
                <td className="border px-4 py-2">{link.title}</td>
                <td className="border px-4 py-2">
                  <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    onClick={() => handleEdit(link)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded ml-2"
                    onClick={() => handleDelete(link.id!)}
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

export default LinkTable;
