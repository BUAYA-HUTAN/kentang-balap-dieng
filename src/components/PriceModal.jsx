import { useState, useEffect } from "react";
import { X, Tag, Save } from "lucide-react";
import { updateProductPrice } from "../services/inventoryService";

export default function PriceModal({ isOpen, onClose, products }) {
  const [prices, setPrices] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (products.length > 0) {
      const mapped = {};
      products.forEach((p) => {
        mapped[p.id] = p.price;
      });
      setPrices(mapped);
    }
  }, [products, isOpen]);

  if (!isOpen) return null;

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      for (const productId of Object.keys(prices)) {
        await updateProductPrice(productId, prices[productId]);
      }
      onClose();
    } catch (err) {
      alert("Gagal memperbarui harga: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <Tag className="w-5 h-5 text-amber-600" />
            <h3 className="font-bold text-slate-800">Atur Harga Demo Kentang</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="p-6 space-y-4">
          <p className="text-xs text-slate-500">
            Ubah harga jual per kemasan di bawah ini untuk simulasi langsung saat presentasi ke klien.
          </p>

          {products.map((item) => (
            <div key={item.id}>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                {item.name} ({item.unit})
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-2 text-slate-400 text-sm">Rp</span>
                <input
                  type="number"
                  min="0"
                  required
                  value={prices[item.id] ?? ""}
                  onChange={(e) =>
                    setPrices({ ...prices, [item.id]: e.target.value })
                  }
                  className="w-full pl-10 pr-3.5 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>
          ))}

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold bg-amber-600 hover:bg-amber-700 text-white rounded-lg"
            >
              <Save className="w-4 h-4" />
              {saving ? "Menyimpan..." : "Simpan Perubahan Harga"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}