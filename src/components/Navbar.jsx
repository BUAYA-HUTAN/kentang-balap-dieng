import { BarChart3, Store } from "lucide-react";

export default function Navbar({ activeTab, setActiveTab }) {
  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-stone-200 sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Custom Brand Identity */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center shadow-sm ring-1 ring-amber-600/20 shrink-0">
            {/* Custom SVG Emblem: Kentang & Puncak Dieng */}
            <svg
              viewBox="0 0 36 36"
              fill="none"
              className="w-6 h-6"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4 25L12.5 14L18.5 21L23.5 15.5L32 25H4Z"
                fill="#FEF3C7"
                fillOpacity="0.35"
              />
              <ellipse
                cx="18.5"
                cy="19.5"
                rx="10.5"
                ry="7.5"
                transform="rotate(-16 18.5 19.5)"
                fill="#FDE68A"
              />
              <circle cx="14.5" cy="17.5" r="1.2" fill="#92400E" />
              <circle cx="21.5" cy="20.5" r="1.1" fill="#92400E" />
              <circle cx="17.5" cy="22.5" r="0.9" fill="#92400E" />
            </svg>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-stone-900 text-base sm:text-lg tracking-tight leading-none">
                Kentang Balap Dieng
              </span>
              <span className="hidden md:inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/80">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Sistem Aktif
              </span>
            </div>
            <p className="text-xs text-stone-500 mt-1 hidden sm:block">
              Manajemen Gudang Ukuran & Rekap Penjualan
            </p>
          </div>
        </div>

        {/* Navigation Switcher */}
        <nav className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl border border-stone-200/70">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
              activeTab === "dashboard"
                ? "bg-white text-stone-900 shadow-sm ring-1 ring-stone-200/80"
                : "text-stone-600 hover:text-stone-900"
            }`}
          >
            <BarChart3
              className={`w-4 h-4 ${
                activeTab === "dashboard" ? "text-amber-600" : "text-stone-400"
              }`}
            />
            <span>Laporan</span>
          </button>

          <button
            onClick={() => setActiveTab("input")}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
              activeTab === "input"
                ? "bg-white text-stone-900 shadow-sm ring-1 ring-stone-200/80"
                : "text-stone-600 hover:text-stone-900"
            }`}
          >
            <Store
              className={`w-4 h-4 ${
                activeTab === "input" ? "text-emerald-600" : "text-stone-400"
              }`}
            />
            <span>Kasir & Stok</span>
          </button>
        </nav>
      </div>
    </header>
  );
}