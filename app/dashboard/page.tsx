"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts"
import api from "@/lib/api"

const ventesData = [
  { mois: "Jan", ventes: 0, clients: 0 },
  { mois: "Fév", ventes: 0, clients: 0 },
  { mois: "Mar", ventes: 0, clients: 0 },
  { mois: "Avr", ventes: 0, clients: 0 },
  { mois: "Mai", ventes: 0, clients: 0 },
  { mois: "Juin", ventes: 0, clients: 0 },
  { mois: "Juil", ventes: 0, clients: 0 },
  { mois: "Août", ventes: 0, clients: 0 },
  { mois: "Sep", ventes: 0, clients: 0 },
  { mois: "Oct", ventes: 0, clients: 0 },
  { mois: "Nov", ventes: 0, clients: 0 },
  { mois: "Déc", ventes: 0, clients: 0 },
]

export default function Dashboard() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [stats, setStats] = useState({
    products: 0,
    orders: 0,
    customers: 0,
    revenue: 0,
  })
  const [recentOrders, setRecentOrders] = useState<any[]>([])
  const [aiMessage, setAiMessage] = useState("")
  const [aiResponse, setAiResponse] = useState("")
  const [aiLoading, setAiLoading] = useState(false)

  useEffect(() => {
    const userData = localStorage.getItem("bizora_user")
    if (!userData) {
      router.push("/")
      return
    }
    setUser(JSON.parse(userData))
  }, [])

  const handleAiChat = async () => {
    if (!aiMessage) return
    setAiLoading(true)
    try {
      const response = await api.post("/ai/chat", { message: aiMessage })
      setAiResponse(response.data.response)
    } catch (err) {
      setAiResponse("Erreur lors de la connexion à l'IA")
    } finally {
      setAiLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("bizora_token")
    localStorage.removeItem("bizora_user")
    router.push("/")
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Bienvenue {user?.name} 👋</p>
        </div>
        <div className="flex gap-2">
          <button className="bg-violet-500 hover:bg-violet-600 text-white text-sm rounded-lg px-4 py-2 transition-colors">
            + Nouveau produit
          </button>
          <button
            onClick={handleLogout}
            className="border border-gray-200 hover:bg-gray-50 text-gray-600 text-sm rounded-lg px-4 py-2 transition-colors"
          >
            Déconnexion
          </button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <p className="text-xs text-gray-500 mb-1">Chiffre d'affaires</p>
          <p className="text-2xl font-semibold text-gray-900">{stats.revenue} FCFA</p>
          <p className="text-xs text-green-500 mt-1">↑ Ce mois</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <p className="text-xs text-gray-500 mb-1">Commandes</p>
          <p className="text-2xl font-semibold text-gray-900">{stats.orders}</p>
          <p className="text-xs text-gray-400 mt-1">Ce mois</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <p className="text-xs text-gray-500 mb-1">Clients</p>
          <p className="text-2xl font-semibold text-gray-900">{stats.customers}</p>
          <p className="text-xs text-gray-400 mt-1">Total</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <p className="text-xs text-gray-500 mb-1">Produits</p>
          <p className="text-2xl font-semibold text-gray-900">{stats.products}</p>
          <p className="text-xs text-orange-400 mt-1">⚠ Stock faible</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-sm font-semibold text-gray-900">📈 Progression des ventes</h2>
            <select className="border border-gray-200 rounded-lg px-2 py-1 text-xs outline-none text-gray-600">
               <option>Cette semaine</option>
              <option> Ce mois</option>
              <option>3 derniers mois</option>
              <option>Cette année</option>
            </select>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={ventesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="mois" tick={{ fontSize: 11, fill: "#9ca3af" }} />
              <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} />
              <Tooltip contentStyle={{ backgroundColor: "white", border: "1px solid #f0f0f0", borderRadius: "8px", fontSize: "12px" }} />
              <Line type="monotone" dataKey="ventes" stroke="#7c3aed" strokeWidth={2} dot={{ fill: "#7c3aed", r: 3 }} activeDot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-sm font-semibold text-gray-900">👥 Progression des clients</h2>
            <select className="border border-gray-200 rounded-lg px-2 py-1 text-xs outline-none text-gray-600">
               <option>Cette semaine</option>
              <option> Ce mois</option>
              <option>3 derniers mois</option>
              <option>Cette année</option>
            </select>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={ventesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="mois" tick={{ fontSize: 11, fill: "#9ca3af" }} />
              <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} />
              <Tooltip contentStyle={{ backgroundColor: "white", border: "1px solid #f0f0f0", borderRadius: "8px", fontSize: "12px" }} />
              <Bar dataKey="clients" fill="#7c3aed" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">Commandes récentes</h2>
          <div className="text-center py-8">
            <p className="text-gray-400 text-sm">Aucune commande pour l'instant</p>
            <p className="text-gray-300 text-xs mt-1">Vos commandes apparaîtront ici</p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">🤖 Assistant IA Bizora</h2>
          {aiResponse && (
            <div className="bg-violet-50 rounded-lg p-4 mb-4">
              <p className="text-sm text-violet-700">{aiResponse}</p>
            </div>
          )}
          {!aiResponse && (
            <div className="bg-violet-50 rounded-lg p-4 mb-4">
              <p className="text-sm text-violet-700">
                Bonjour ! Je suis votre assistant IA. Je peux vous aider à analyser vos ventes, générer des descriptions produits et bien plus encore.
              </p>
            </div>
          )}
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Posez une question à l'IA..."
              value={aiMessage}
              onChange={(e) => setAiMessage(e.target.value)}
              className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-violet-400"
            />
            <button
              onClick={handleAiChat}
              disabled={aiLoading}
              className="bg-violet-500 hover:bg-violet-600 text-white rounded-lg px-4 py-2 text-sm transition-colors disabled:opacity-50"
            >
              {aiLoading ? "..." : "Envoyer"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}