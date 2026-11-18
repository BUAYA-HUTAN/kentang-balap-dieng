import { Wallet, ShoppingBag, Receipt, Warehouse } from "lucide-react";
import { formatRupiah } from "../utils/formatters";

export default function SummaryCards({ filteredTransactions, products, periodLabel }) {
  const totalOmzet = filteredTransactions.reduce(
    (sum, item) => sum + (Number(item.totalAmount) || 0),
    0
  );
  const totalQtySold = filteredTransactions.reduce(
    (sum, item) => sum + (Number(item.qty) || 0),
    0
  );
  const totalTxCount = filteredTransactions.length;
  const totalCurrentStock = products.reduce(
    (sum, item) => sum + (Number(item.stock) || 0),
    0
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Kartu 1: Total Omzet */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Omzet ({periodLabel})
          </span>
          <div className="p-2 bg-emerald-100 text-emerald-700 rounded-lg">
            <Wallet className="w-4 h-4" />
          </div>
        </div>
        <div className="text-2xl font-extrabold text-slate-900 mt-3">
          {formatRupiah(totalOmzet)}
        </div>
        <p className="text-xs text-slate-500 mt-1">Total pendapatan kotor periode ini</p>
      </div>

      {/* Kartu 2: Kentang Terjual */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Terjual ({periodLabel})
          </span>
          <div className="p-2 bg-amber-100 text-amber-700 rounded-lg">
            <ShoppingBag className="w-4 h-4" />
          </div>
        </div>
        <div className="text-2xl font-extrabold text-slate-900 mt-3">
          {totalQtySold} <span className="text-sm font-medium text-slate-500">kemasan</span>
        </div>
        <p className="text-xs text-slate-500 mt-1">Akumulasi ukuran kecil, sedang & besar</p>
      </div>

      {/* Kartu 3: Total Transaksi */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Transaksi ({periodLabel})
          </span>
          <div className="p-2 bg-indigo-100 text-indigo-700 rounded-lg">
            <Receipt className="w-4 h-4" />
          </div>
        </div>
        <div className="text-2xl font-extrabold text-slate-900 mt-3">
          {totalTxCount} <span className="text-sm font-medium text-slate-500">kali</span>
        </div>
        <p className="text-xs text-slate-500 mt-1">Nota penjualan tercatat</p>
      </div>

      {/* Kartu 4: Total Stok Gudang */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Sisa Stok Aktif
          </span>
          <div className="p-2 bg-sky-100 text-sky-700 rounded-lg">
            <Warehouse className="w-4 h-4" />
          </div>
        </div>
        <div className="text-2xl font-extrabold text-slate-900 mt-3">
          {totalCurrentStock} <span className="text-sm font-medium text-slate-500">kemasan</span>
        </div>
        <div className="flex items-center gap-2 text-[11px] text-slate-600 mt-1">
          {products.map((p) => (
            <span key={p.id} className="bg-slate-100 px-1.5 py-0.5 rounded">
              {p.id.charAt(0).toUpperCase() + p.id.slice(1)}: <b>{p.stock}</b>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}