"use client";

import { useState, useEffect } from "react";
import {
  fetchHeaderMessages,
  addHeaderMessage,
  updateHeaderMessage,
  deleteHeaderMessage,
} from "../../lib/utils";
import HeaderForm from "./HeaderForm"; // Stelle sicher, dass der Import korrekt ist
import { HeaderMessageData } from "../../types/directus";
import Spinner from "./Spinner"; // Stelle sicher, dass der Import korrekt ist
import { toast } from "react-toastify";

const HeaderTable: React.FC = () => {
  const [headers, setHeaders] = useState<HeaderMessageData[]>([]);
  const [editingHeader, setEditingHeader] = useState<HeaderMessageData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function getHeaders() {
      setLoading(true);
      try {
        const data = await fetchHeaderMessages();
        setHeaders(data || []);
      } catch (error) {
        toast.error("Error fetching header messages.");
        console.error("Error fetching headers:", error);
      } finally {
        setLoading(false);
      }
    }
    getHeaders();
  }, []);

  const handleEdit = (header: HeaderMessageData) => {
    setEditingHeader(header);
  };

  const handleDelete = async (id: number) => {
    setLoading(true);
    try {
      await deleteHeaderMessage(id);
      setHeaders(headers.filter(header => header.id !== id));
      toast.success("Header successfully deleted!");
    } catch (error) {
      toast.error("Error deleting header message.");
      console.error("Error deleting header:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = async (header: HeaderMessageData) => {
    setLoading(true);
    try {
      if (editingHeader) {
        // Update existing header
        const updatedHeader = await updateHeaderMessage(editingHeader.id!, header);
        setHeaders(headers.map((h) => (h.id === updatedHeader.id ? updatedHeader : h)));
        setEditingHeader(null);
        toast.success("Header successfully updated!");
      } else if (headers.length === 0) {
        // Add new header if none exists
        const newHeader = await addHeaderMessage(header);
        setHeaders([newHeader]);
        toast.success("Header successfully added!");
      } else {
        // Show error if a header already exists
        toast.error("Only one header is allowed.");
      }
    } catch (error) {
      toast.error("Error saving header message.");
      console.error("Error saving header:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setEditingHeader(null);
  };

  return (
    <div>
      {loading && <Spinner />}
      <HeaderForm
        editingHeader={editingHeader}
        onFormSubmit={handleFormSubmit}
        onCancel={handleCancel}
      />
      <div className="overflow-x-auto mt-4">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="px-4 py-2">Header</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {headers.length > 0 ? (
              headers.map((header) => (
                <tr key={header.id}>
                  <td className="border px-4 py-2">{header.header}</td> {/* Änderung hier */}
                  <td className="border px-4 py-2">
                    <button
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                      onClick={() => handleEdit(header)}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded ml-2"
                      onClick={() => handleDelete(header.id!)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={2} className="border px-4 py-2 text-center">
                  No headers available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HeaderTable;
