import { useState, useEffect } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { Settings, Database, Package } from "lucide-react";
import { db } from "../config/firebase";
import { initInitialProducts } from "../services/inventoryService";
import { seedDemoTransactions } from "../utils/seeder";
import SalesForm from "../components/SalesForm";
import StockInForm from "../components/StockInForm";
import PriceModal from "../components/PriceModal";

export default function InputDataPage() {
  const [products, setProducts] = useState([]);
  const [isPriceModalOpen, setIsPriceModalOpen] = useState(false);
  const [seeding, setSeeding] = useState(false);

  useEffect(() => {
    // Pastikan 3 varian kentang awal tersedia di Firestore
    initInitialProducts();

    // Listener real-time stok & harga produk
    const unsubscribe = onSnapshot(collection(db, "products"), (snapshot) => {
      const order = { kecil: 1, sedang: 2, besar: 3 };
      const list = snapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .sort((a, b) => (order[a.id] || 99) - (order[b.id] || 99));
      setProducts(list);
    });

    return () => unsubscribe();
  }, []);

  const handleSeedData = async () => {
    const confirmSeed = window.confirm(
      "Tambahkan 60 data transaksi simulasi (Harian s/d Tahunan) untuk keperluan demo?"
    );
    if (!confirmSeed) return;

    setSeeding(true);
    try {
      await seedDemoTransactions(60);
      alert("Berhasil! 60 transaksi simulasi telah ditambahkan ke database.");
    } catch (err) {
      alert("Gagal generate data demo: " + err.message);
    } finally {
      setSeeding(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      {/* Header & Tombol Kontrol Demo */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-slate-800">
            Operasional Stok & Kasir Warung
          </h1>
          <p className="text-sm text-slate-500">
            Input barang masuk, catat penjualan, dan sesuaikan harga demo
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleSeedData}
            disabled={seeding}
            className="flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition"
          >
            <Database className="w-4 h-4 text-indigo-600" />
            {seeding ? "Mengisi Data..." : "Isi Data Dummy Demo"}
          </button>

          <button
            onClick={() => setIsPriceModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 text-sm font-semibold bg-amber-100 hover:bg-amber-200 text-amber-800 rounded-lg transition"
          >
            <Settings className="w-4 h-4" />
            Atur Harga Kentang
          </button>
        </div>
      </div>

      {/* Ringkasan Stok & Harga Aktif */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {products.map((item) => (
          <div
            key={item.id}
            className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between"
          >
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-600">
                Kemasan {item.unit}
              </span>
              <h3 className="text-lg font-bold text-slate-800 mt-0.5">{item.name}</h3>
              <p className="text-sm font-semibold text-emerald-600 mt-1">
                Rp {item.price?.toLocaleString("id-ID")} / kemasan
              </p>
            </div>
            <div className="text-right">
              <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-medium">
                <Package className="w-3.5 h-3.5" />
                Stok
              </div>
              <div className="text-2xl font-extrabold text-slate-900 mt-1">
                {item.stock}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Dua Kolom Form Utama: Kasir Penjualan & Stok Masuk */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SalesForm products={products} />
        <StockInForm products={products} />
      </div>

      {/* Modal Ubah Harga */}
      <PriceModal
        isOpen={isPriceModalOpen}
        onClose={() => setIsPriceModalOpen(false)}
        products={products}
      />
    </div>
  );
}