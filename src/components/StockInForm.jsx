import { useState } from "react";
import { PackagePlus, CheckCircle2, AlertCircle } from "lucide-react";
import { addStockIn } from "../services/inventoryService";

export default function StockInForm({ products }) {
  const [productId, setProductId] = useState("kecil");
  const [qty, setQty] = useState("");
  const [buyPrice, setBuyPrice] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState({ type: "", message: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFeedback({ type: "", message: "" });
    setLoading(true);

    try {
      await addStockIn({
        productId,
        qty: Number(qty),
        buyPrice: Number(buyPrice) || 0,
        note,
      });
      const prodName = products.find((p) => p.id === productId)?.name || "Kentang";
      setFeedback({
        type: "success",
        message: `Berhasil menambah ${qty} kemasan ke stok ${prodName}!`,
      });
      setQty("");
      setBuyPrice("");
      setNote("");
    } catch (err) {
      setFeedback({ type: "error", message: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <div className="flex items-center gap-2.5 mb-5">
        <div className="p-2 bg-amber-100 text-amber-700 rounded-lg">
          <PackagePlus className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-800">Input Stok Masuk</h2>
          <p className="text-xs text-slate-500">Catat barang datang/kulakan dari supplier</p>
        </div>
      </div>

      {feedback.message && (
        <div
          className={`mb-4 p-3 rounded-lg text-sm flex items-center gap-2 ${
            feedback.type === "success"
              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
              : "bg-red-50 text-red-700 border border-red-200"
          }`}
        >
          {feedback.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Ukuran Kentang
          </label>
          <select
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
            className="w-full px-3.5 py-2 border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            {products.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name} ({item.unit}) — Stok saat ini: {item.stock}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Jumlah Masuk (Kemasan)
            </label>
            <input
              type="number"
              min="1"
              required
              placeholder="Contoh: 25"
              value={qty}
              onChange={(e) => setQty(e.target.value)}
              className="w-full px-3.5 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Total Modal Beli (Opsional)
            </label>
            <input
              type="number"
              min="0"
              placeholder="Contoh: 200000"
              value={buyPrice}
              onChange={(e) => setBuyPrice(e.target.value)}
              className="w-full px-3.5 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Catatan Supplier (Opsional)
          </label>
          <input
            type="text"
            placeholder="Contoh: Kiriman pagi dari Dieng"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full px-3.5 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 px-4 bg-amber-600 hover:bg-amber-700 disabled:bg-slate-400 text-white font-semibold rounded-lg transition"
        >
          {loading ? "Menyimpan Stok..." : "Tambah ke Stok Gudang"}
        </button>
      </form>
    </div>
  );
}