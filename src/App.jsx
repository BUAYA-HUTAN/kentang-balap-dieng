import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import DashboardPage from "./pages/DashboardPage";
import InputDataPage from "./pages/InputDataPage";
import { initInitialProducts } from "./services/inventoryService";

export default function App() {
  const [activeTab, setActiveTab] = useState("dashboard");

  useEffect(() => {
    // Pastikan data master 3 ukuran kentang selalu tersedia saat aplikasi dibuka
    initInitialProducts();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-1">
        {activeTab === "dashboard" ? <DashboardPage /> : <InputDataPage />}
      </main>

      <footer className="bg-white border-t border-slate-200 py-4 text-center text-xs text-slate-400">
        Kentang Balap Dieng — Sistem Informasi Stok & Laporan Penjualan (Versi Demo)
      </footer>
    </div>
  );
}