import { useState, useEffect } from "react";
import { Download, ArrowUpRight, ArrowDownLeft } from "lucide-react";
import {
  subscribeProducts,
  subscribeTransactions,
  subscribeStockIns,
  filterTransactionsByPeriod,
  groupTransactionsForChart,
  exportTransactionsToCSV,
} from "../services/reportService";
import { formatRupiah, formatDateTime } from "../utils/formatters";
import SummaryCards from "../components/SummaryCards";
import SalesChart from "../components/SalesChart";

const PERIOD_OPTIONS = [
  { id: "daily", label: "Hari Ini" },
  { id: "weekly", label: "Minggu Ini" },
  { id: "monthly", label: "Bulan Ini" },
  { id: "yearly", label: "Tahun Ini" },
];

export default function DashboardPage() {
  const [products, setProducts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [stockIns, setStockIns] = useState([]);
  const [period, setPeriod] = useState("monthly");
  const [historyTab, setHistoryTab] = useState("sales");

  useEffect(() => {
    const unsubProducts = subscribeProducts(setProducts);
    const unsubTx = subscribeTransactions(setTransactions);
    const unsubStock = subscribeStockIns(setStockIns);

    return () => {
      unsubProducts();
      unsubTx();
      unsubStock();
    };
  }, []);

  const activePeriodLabel =
    PERIOD_OPTIONS.find((p) => p.id === period)?.label || "Bulan Ini";
  const filteredTransactions = filterTransactionsByPeriod(transactions, period);
  const chartData = groupTransactionsForChart(filteredTransactions, period);

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      {/* Header Filter Periode & Export */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-slate-800">
            Dashboard Laporan Penjualan
          </h1>
          <p className="text-sm text-slate-500">
            Pantau omzet, pergerakan stok, dan performa penjualan kentang
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Pilihan Filter Waktu */}
          <div className="flex items-center bg-slate-100 p-1 rounded-lg">
            {PERIOD_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                onClick={() => setPeriod(opt.id)}
                className={`px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-md transition ${
                  period === opt.id
                    ? "bg-amber-600 text-white shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* Tombol Export CSV */}
          <button
            onClick={() =>
              exportTransactionsToCSV(filteredTransactions, activePeriodLabel)
            }
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-semibold bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-lg transition"
          >
            <Download className="w-4 h-4" />
            Export Excel
          </button>
        </div>
      </div>

      {/* 4 Kartu KPI Utama */}
      <SummaryCards
        filteredTransactions={filteredTransactions}
        products={products}
        periodLabel={activePeriodLabel}
      />

      {/* Grafik & Perbandingan Ukuran */}
      <SalesChart
        chartData={chartData}
        filteredTransactions={filteredTransactions}
        products={products}
      />

      {/* Tabel Riwayat Transaksi Penjualan & Stok Masuk */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setHistoryTab("sales")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold transition ${
                historyTab === "sales"
                  ? "bg-emerald-100 text-emerald-800"
                  : "text-slate-500 hover:bg-slate-100"
              }`}
            >
              <ArrowUpRight className="w-4 h-4" />
              Riwayat Penjualan ({filteredTransactions.length})
            </button>

            <button
              onClick={() => setHistoryTab("stock_in")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold transition ${
                historyTab === "stock_in"
                  ? "bg-amber-100 text-amber-800"
                  : "text-slate-500 hover:bg-slate-100"
              }`}
            >
              <ArrowDownLeft className="w-4 h-4" />
              Riwayat Stok Masuk ({stockIns.length})
            </button>
          </div>
          <span className="text-xs text-slate-400">Menampilkan 15 catatan terbaru</span>
        </div>

        <div className="overflow-x-auto">
          {historyTab === "sales" ? (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-xs uppercase border-b border-slate-200">
                  <th className="py-3 px-6">Waktu Transaksi</th>
                  <th className="py-3 px-6">Varian Kentang</th>
                  <th className="py-3 px-6">Jumlah</th>
                  <th className="py-3 px-6">Harga Satuan</th>
                  <th className="py-3 px-6 text-right">Total Bayar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredTransactions.slice(0, 15).map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-50">
                    <td className="py-3 px-6 text-slate-600">
                      {formatDateTime(tx.dateObj)}
                    </td>
                    <td className="py-3 px-6 font-semibold text-slate-800">
                      {tx.productName}
                    </td>
                    <td className="py-3 px-6 text-slate-700">{tx.qty} kemasan</td>
                    <td className="py-3 px-6 text-slate-600">
                      {formatRupiah(tx.pricePerUnit)}
                    </td>
                    <td className="py-3 px-6 text-right font-bold text-emerald-600">
                      {formatRupiah(tx.totalAmount)}
                    </td>
                  </tr>
                ))}
                {filteredTransactions.length === 0 && (
                  <tr>
                    <td colSpan="5" className="py-8 text-center text-slate-400">
                      Belum ada transaksi penjualan pada periode {activePeriodLabel}.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-xs uppercase border-b border-slate-200">
                  <th className="py-3 px-6">Waktu Masuk</th>
                  <th className="py-3 px-6">Varian Kentang</th>
                  <th className="py-3 px-6">Stok Ditambah</th>
                  <th className="py-3 px-6">Modal Kulakan</th>
                  <th className="py-3 px-6">Catatan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {stockIns.slice(0, 15).map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50">
                    <td className="py-3 px-6 text-slate-600">
                      {formatDateTime(item.dateObj)}
                    </td>
                    <td className="py-3 px-6 font-semibold text-slate-800">
                      {item.productName}
                    </td>
                    <td className="py-3 px-6 font-bold text-amber-600">
                      +{item.qty} kemasan
                    </td>
                    <td className="py-3 px-6 text-slate-600">
                      {item.buyPrice > 0 ? formatRupiah(item.buyPrice) : "-"}
                    </td>
                    <td className="py-3 px-6 text-slate-500">{item.note || "-"}</td>
                  </tr>
                ))}
                {stockIns.length === 0 && (
                  <tr>
                    <td colSpan="5" className="py-8 text-center text-slate-400">
                      Belum ada riwayat stok masuk.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}