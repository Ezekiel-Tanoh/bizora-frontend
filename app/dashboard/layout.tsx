"use client"

import { usePathname } from "next/navigation"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  const isActive = (path: string) => pathname === path

  return (
    <div className="flex min-h-screen bg-gray-50">

      <aside className="w-64 bg-white border-r border-gray-100 p-6 flex flex-col">
        <div className="flex items-center gap-2 mb-10">
          <div className="w-8 h-8 rounded-lg bg-violet-500 flex items-center justify-center">
            <span className="text-white font-bold">B</span>
          </div>
          <span className="text-xl font-semibold text-gray-900">Bizora</span>
        </div>

        <nav className="flex flex-col gap-1">
          <a href="/dashboard" className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm ${isActive("/dashboard") ? "bg-violet-50 text-violet-600 font-medium" : "text-gray-600 hover:bg-gray-50"}`}>
            📊 Dashboard
          </a>
          <a href="/dashboard/produits" className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm ${isActive("/dashboard/produits") ? "bg-violet-50 text-violet-600 font-medium" : "text-gray-600 hover:bg-gray-50"}`}>
            📦 Produits
          </a>
          <a href="/dashboard/commandes" className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm ${isActive("/dashboard/commandes") ? "bg-violet-50 text-violet-600 font-medium" : "text-gray-600 hover:bg-gray-50"}`}>
            🛒 Commandes
          </a>
          <a href="/dashboard/clients" className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm ${isActive("/dashboard/clients") ? "bg-violet-50 text-violet-600 font-medium" : "text-gray-600 hover:bg-gray-50"}`}>
            👥 Clients
          </a>
          <a href="/dashboard/stock" className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm ${isActive("/dashboard/stock") ? "bg-violet-50 text-violet-600 font-medium" : "text-gray-600 hover:bg-gray-50"}`}>
            🏪 Stock
          </a>
          <a href="/dashboard/factures" className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm ${isActive("/dashboard/factures") ? "bg-violet-50 text-violet-600 font-medium" : "text-gray-600 hover:bg-gray-50"}`}>
            🧾 Factures
          </a>
          <a href="/dashboard/ia" className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm ${isActive("/dashboard/ia") ? "bg-violet-50 text-violet-600 font-medium" : "text-gray-600 hover:bg-gray-50"}`}>
            🤖 IA Assistant
          </a>
          <a href="/dashboard/parametres" className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm ${isActive("/dashboard/parametres") ? "bg-violet-50 text-violet-600 font-medium" : "text-gray-600 hover:bg-gray-50"}`}>
            ⚙️ Paramètres
          </a>
        </nav>

        <div className="mt-auto bg-violet-50 rounded-xl p-4">
          <p className="text-xs font-medium text-violet-700">Plan Gratuit</p>
          <p className="text-xs text-violet-500 mt-1">Passez au Pro pour débloquer l'IA</p>
          <button className="mt-3 w-full bg-violet-500 hover:bg-violet-600 text-white text-xs rounded-lg py-2 transition-colors">
            Passer au Pro
          </button>
        </div>
      </aside>

      <main className="flex-1 p-8">
        {children}
      </main>

    </div>
  )
}