import { useState } from "react";
import { ShoppingCart, CheckCircle2, AlertCircle } from "lucide-react";
import { createSaleTransaction } from "../services/inventoryService";

export default function SalesForm({ products }) {
  const [selectedId, setSelectedId] = useState("kecil");
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState({ type: "", message: "" });

  const selectedProduct = products.find((p) => p.id === selectedId);
  const estimatedTotal = selectedProduct ? selectedProduct.price * Number(qty || 0) : 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFeedback({ type: "", message: "" });
    setLoading(true);

    try {
      await createSaleTransaction({ productId: selectedId, qty: Number(qty) });
      setFeedback({
        type: "success",
        message: `Penjualan ${qty}x ${selectedProduct?.name} berhasil dicatat!`,
      });
      setQty(1);
    } catch (err) {
      setFeedback({ type: "error", message: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <div className="flex items-center gap-2.5 mb-5">
        <div className="p-2 bg-emerald-100 text-emerald-700 rounded-lg">
          <ShoppingCart className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-800">Input Penjualan (Kasir)</h2>
          <p className="text-xs text-slate-500">Stok akan berkurang otomatis setelah disimpan</p>
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
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Pilih Ukuran Kentang
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {products.map((item) => (
              <button
                type="button"
                key={item.id}
                onClick={() => setSelectedId(item.id)}
                className={`p-3 rounded-lg border text-left transition ${
                  selectedId === item.id
                    ? "border-emerald-600 bg-emerald-50 ring-1 ring-emerald-600"
                    : "border-slate-200 hover:bg-slate-50"
                }`}
              >
                <div className="font-semibold text-sm text-slate-800">{item.name}</div>
                <div className="text-xs text-slate-500">Kemasan {item.unit}</div>
                <div className="mt-1.5 text-sm font-bold text-emerald-700">
                  Rp {item.price.toLocaleString("id-ID")}
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  Sisa stok: {item.stock}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Jumlah Beli (Kemasan)
          </label>
          <input
            type="number"
            min="1"
            required
            value={qty}
            onChange={(e) => setQty(e.target.value)}
            className="w-full px-3.5 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
          <span className="text-sm text-slate-600">Total Bayar:</span>
          <span className="text-xl font-bold text-slate-900">
            Rp {estimatedTotal.toLocaleString("id-ID")}
          </span>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-400 text-white font-semibold rounded-lg transition"
        >
          {loading ? "Menyimpan Transaksi..." : "Simpan Transaksi Penjualan"}
        </button>
      </form>
    </div>
  );
}