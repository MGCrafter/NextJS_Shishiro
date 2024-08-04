"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useUserStore from "../../../lib/state";
import HeaderTable from "../../../components/ui_self/HeaderTable";
import DropdownMenu from "../../../components/ui_self/dropdown";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const HeaderMessagesPage: React.FC = () => {
  const router = useRouter();
  const token = useUserStore((state) => state.token);
  const logout = useUserStore((state) => state.logout);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!token) {
      router.push("/login");
    }
  }, [token, router]);

  if (!isMounted) {
    return null; // Render nothing on the server
  }

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const goToHomepage = () => {
    window.open("/", "_blank");
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Header Messages</h1>
      <DropdownMenu />
      <button
        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mb-6 mr-3"
        onClick={handleLogout}
      >
        Logout
      </button>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={goToHomepage}
      >
        Zur Homepage
      </button>
      <div>
        <HeaderTable />
      </div>
      <ToastContainer />
    </div>
  );
};

export default HeaderMessagesPage;
