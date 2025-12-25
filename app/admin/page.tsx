// app/admin/page.tsx

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useUserStore from "../../lib/state";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Aceternity UI Komponente importieren
import { Tabs } from "../../components/ui/tabs";

// Deine eigenen Editor-Komponenten importieren
import LinkEditor from "../../components/admin/LinkEditor";
import HeaderEditor from "../../components/admin/HeaderEditor";
import WelcomeEditor from "../../components/admin/WelcomeEditor";

// Definition der Tabs mit neuem Design
const adminTabs = [
  {
    title: "Links",
    value: "links",
    content: (
      <div className="p-8 bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 shadow-2xl">
        <h2 className="text-3xl font-bold mb-2 text-white">Links verwalten</h2>
        <p className="text-slate-400 mb-8">Hier kannst du die Links auf der Hauptseite bearbeiten, hinzufügen oder löschen.</p>
        <LinkEditor />
      </div>
    ),
  },
  {
    title: "Header",
    value: "header",
    content: (
      <div className="p-8 bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 shadow-2xl">
        <h2 className="text-3xl font-bold mb-2 text-white">Header verwalten</h2>
        <p className="text-slate-400 mb-8">Passe den Haupttitel der Seite an.</p>
        <HeaderEditor />
      </div>
    ),
  },
  {
    title: "Welcome",
    value: "welcome",
    content: (
      <div className="p-8 bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 shadow-2xl">
        <h2 className="text-3xl font-bold mb-2 text-white">Welcome Message verwalten</h2>
        <p className="text-slate-400 mb-8">Bearbeite die Begrüßungsnachricht unter dem Header.</p>
        <WelcomeEditor />
      </div>
    ),
  },
];

const AdminPage: React.FC = () => {
  const router = useRouter();
  const token = useUserStore((state) => state.token);
  const logout = useUserStore((state) => state.logout);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted && !token) {
      router.push("/login");
    }
  }, [token, router, isMounted]);

  if (!isMounted) {
    return null;
  }

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <div className="bg-slate-950 text-white min-h-screen flex flex-col">
      <ToastContainer position="bottom-right" theme="dark" />

      {/* Header-Bereich */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm">
        <div className="container mx-auto p-6 flex justify-between items-center">
          <h1 className="text-4xl font-bold text-indigo-400">Admin Panel</h1>
          <div className="flex gap-4">
            <button
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition-all duration-200"
              onClick={() => window.open('/', '_blank')}
            >
              Zur Homepage
            </button>
            <button
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </div>
      </header>

            {/* Haupt-Inhaltsbereich */}
      <main className="flex-grow container mx-auto p-6">
        <Tabs
          tabs={adminTabs}
          containerClassName="mb-8"
          activeTabClassName="bg-indigo-600 text-white shadow-lg"
          // HIER IST DIE ÄNDERUNG: Die ! vor den Farben
          tabClassName="px-6 py-3 font-semibold !text-slate-400 hover:!text-white"
        />
      </main>
    </div>
  );
};

export default AdminPage;