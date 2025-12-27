"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Tabs } from "../../components/ui/tabs";

// Components
import LinkEditor from "../../components/admin/LinkEditor";
import HeaderEditor from "../../components/admin/HeaderEditor";
import WelcomeEditor from "../../components/admin/WelcomeEditor";

// Store & Config
import useUserStore from "../../lib/state";
import { adminTabs } from "./adminConfig";

const AdminPage = () => {
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

  if (!isMounted) return null;

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <div className="flex flex-col bg-slate-950 text-white">

      {/* Header - Sticky oben */}
      <header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-900/95 backdrop-blur-md shadow-sm">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
            Admin Panel
          </h1>
          <div className="flex gap-3">
            <button
              onClick={() => window.open('/', '_blank')}
              className="px-4 py-2 text-sm font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
            >
              Zur Homepage
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-500/20 rounded-lg transition-all"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-6 py-8">
        <Tabs
          tabs={adminTabs}
          activeTabClassName="bg-indigo-600 text-white shadow-lg shadow-indigo-500/25"
          tabClassName="px-6 py-3 text-sm font-medium text-slate-400 hover:text-white transition-colors"
          contentClassName="mt-6"
        />
      </main>
    </div>
  );
};

export default AdminPage;