"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import {
  ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend
} from "recharts"
import api from "@/lib/api"

const cardStyle = {
  background: "rgba(255,255,255,0.03)",
  border: "1px solid rgba(255,255,255,0.07)",
  borderRadius: "16px",
  padding: "1.25rem",
}

const periodes = ["7 jours", "30 jours", "3 mois", "6 mois", "1 an"]

export default function Dashboard() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [periode, setPeriode] = useState("30 jours")
  const [produits, setProduits] = useState<any[]>([])
  const [commandes, setCommandes] = useState<any[]>([])
  const [clients, setClients] = useState<any[]>([])
  const [chartData, setChartData] = useState<any[]>([])
  const [aiMessage, setAiMessage] = useState("")
  const [aiResponse, setAiResponse] = useState("")
  const [aiLoading, setAiLoading] = useState(false)

  useEffect(() => {
    const userData = localStorage.getItem("bizora_user")
    if (!userData) { router.push("/login"); return }
    const u = JSON.parse(userData)
    setUser(u)
    fetchData(u.storeId)
  }, [])

  useEffect(() => {
    if (commandes.length > 0 || clients.length > 0) {
      buildChartData()
    }
  }, [periode, commandes, clients])

  const fetchData = async (storeId: string) => {
    try {
      const [produitsRes, commandesRes, clientsRes] = await Promise.all([
        api.get(`/products/${storeId}`),
        api.get(`/orders/${storeId}`),
        api.get(`/customers/${storeId}`),
      ])
      setProduits(produitsRes.data)
      setCommandes(commandesRes.data)
      setClients(clientsRes.data)
    } catch (err) {
      console.error(err)
    }
  }

  const buildChartData = () => {
    const now = new Date()
    let jours = 30
    let format = "dd/MM"
    let groupBy = "day"

    if (periode === "7 jours") { jours = 7; groupBy = "day" }
    else if (periode === "30 jours") { jours = 30; groupBy = "day" }
    else if (periode === "3 mois") { jours = 90; groupBy = "week" }
    else if (periode === "6 mois") { jours = 180; groupBy = "month" }
    else if (periode === "1 an") { jours = 365; groupBy = "month" }

    const debut = new Date(now.getTime() - jours * 24 * 60 * 60 * 1000)

    if (groupBy === "day") {
      const data: any[] = []
      for (let i = jours - 1; i >= 0; i--) {
        const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000)
        const label = `${date.getDate()}/${date.getMonth() + 1}`
        const dayStart = new Date(date.setHours(0, 0, 0, 0))
        const dayEnd = new Date(date.setHours(23, 59, 59, 999))

        const ventesJour = commandes
          .filter(c => new Date(c.createdAt) >= dayStart && new Date(c.createdAt) <= dayEnd)
          .reduce((sum, c) => sum + c.total, 0)

        const clientsJour = clients
          .filter(c => new Date(c.createdAt) >= dayStart && new Date(c.createdAt) <= dayEnd)
          .length

        data.push({ label, ventes: ventesJour, clients: clientsJour })
      }
      setChartData(data)
    } else if (groupBy === "week") {
      const data: any[] = []
      const nbSemaines = Math.ceil(jours / 7)
      for (let i = nbSemaines - 1; i >= 0; i--) {
        const weekEnd = new Date(now.getTime() - i * 7 * 24 * 60 * 60 * 1000)
        const weekStart = new Date(weekEnd.getTime() - 7 * 24 * 60 * 60 * 1000)
        const label = `S${nbSemaines - i}`

        const ventesWeek = commandes
          .filter(c => new Date(c.createdAt) >= weekStart && new Date(c.createdAt) <= weekEnd)
          .reduce((sum, c) => sum + c.total, 0)

        const clientsWeek = clients
          .filter(c => new Date(c.createdAt) >= weekStart && new Date(c.createdAt) <= weekEnd)
          .length

        data.push({ label, ventes: ventesWeek, clients: clientsWeek })
      }
      setChartData(data)
    } else {
      const data: any[] = []
      for (let i = 11; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
        const monthStart = new Date(date.getFullYear(), date.getMonth(), 1)
        const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0)
        const mois = ["Jan", "Fév", "Mar", "Avr", "Mai", "Jun", "Jul", "Aoû", "Sep", "Oct", "Nov", "Déc"]
        const label = mois[date.getMonth()]

        const ventesMois = commandes
          .filter(c => new Date(c.createdAt) >= monthStart && new Date(c.createdAt) <= monthEnd)
          .reduce((sum, c) => sum + c.total, 0)

        const clientsMois = clients
          .filter(c => new Date(c.createdAt) >= monthStart && new Date(c.createdAt) <= monthEnd)
          .length

        data.push({ label, ventes: ventesMois, clients: clientsMois })
      }
      setChartData(data)
    }
  }

  const handleAiChat = async () => {
    if (!aiMessage) return
    setAiLoading(true)
    try {
      const response = await api.post("/ai/chat", { message: aiMessage })
      setAiResponse(response.data.response)
    } catch {
      setAiResponse("Erreur lors de la connexion à l'IA")
    } finally {
      setAiLoading(false)
    }
  }

  const revenue = commandes.reduce((sum, c) => sum + c.total, 0)

  const kpis = [
    { label: "Chiffre d'affaires", value: `${revenue.toLocaleString()} FCFA`, sub: "↑ Total", subColor: "#34d399", icon: "💰" },
    { label: "Commandes", value: commandes.length, sub: "Total", subColor: "rgba(255,255,255,0.3)", icon: "🛒" },
    { label: "Clients", value: clients.length, sub: "Total", subColor: "rgba(255,255,255,0.3)", icon: "👥" },
    { label: "Produits", value: produits.length, sub: produits.filter(p => p.stock <= 5).length > 0 ? `⚠ ${produits.filter(p => p.stock <= 5).length} stock faible` : "Tout en stock", subColor: produits.filter(p => p.stock <= 5).length > 0 ? "#fbbf24" : "#34d399", icon: "📦" },
  ]

  return (
    <>
      <style>{`
        .dash-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
        .kpi-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; margin-bottom: 1.5rem; }
        .bottom-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
        @media (max-width: 768px) {
          .dash-header { flex-direction: column; align-items: flex-start; gap: 1rem; }
          .dash-header button { width: 100%; }
          .kpi-grid { grid-template-columns: repeat(2, 1fr); }
          .bottom-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <div style={{ color: "#fff", fontFamily: "'Inter', sans-serif" }}>

        <div className="dash-header">
          <div>
            <h1 style={{ fontSize: "1.5rem", fontWeight: "700", margin: 0 }}>Dashboard</h1>
            <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.4)", margin: "4px 0 0" }}>
              Bienvenue {user?.name} 👋
            </p>
          </div>
          <button
            onClick={() => router.push("/dashboard/produits")}
            style={{
              padding: "10px 20px", borderRadius: "10px", border: "none",
              background: "linear-gradient(135deg, #8b5cf6, #6d28d9)",
              color: "#fff", fontSize: "14px", fontWeight: "600",
              cursor: "pointer", boxShadow: "0 0 20px rgba(139,92,246,0.3)"
            }}
          >
            + Nouveau produit
          </button>
        </div>

        <div className="kpi-grid">
          {kpis.map((kpi, i) => (
            <div key={i} style={{ ...cardStyle, transition: "all 0.2s" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(139,92,246,0.3)"; e.currentTarget.style.background = "rgba(139,92,246,0.06)" }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"; e.currentTarget.style.background = "rgba(255,255,255,0.03)" }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", margin: "0 0 8px" }}>{kpi.label}</p>
                <span style={{ fontSize: "20px" }}>{kpi.icon}</span>
              </div>
              <p style={{ fontSize: "1.6rem", fontWeight: "700", margin: "0 0 6px", color: "#fff" }}>{kpi.value}</p>
              <p style={{ fontSize: "12px", color: kpi.subColor, margin: 0 }}>{kpi.sub}</p>
            </div>
          ))}
        </div>

        {/* Graphique unifié */}
        <div style={{ ...cardStyle, marginBottom: "1.5rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem", flexWrap: "wrap", gap: "1rem" }}>
            <h2 style={{ fontSize: "14px", fontWeight: "600", margin: 0 }}>📈 Progression en temps réel</h2>
            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
              {periodes.map(p => (
                <button
                  key={p}
                  onClick={() => setPeriode(p)}
                  style={{
                    padding: "5px 12px", borderRadius: "100px", border: "none",
                    fontSize: "12px", cursor: "pointer", transition: "all 0.2s",
                    background: periode === p ? "linear-gradient(135deg, #8b5cf6, #6d28d9)" : "rgba(255,255,255,0.05)",
                    color: periode === p ? "#fff" : "rgba(255,255,255,0.5)",
                    fontWeight: periode === p ? "600" : "400",
                    boxShadow: periode === p ? "0 0 12px rgba(139,92,246,0.3)" : "none"
                  }}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <ComposedChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="label" tick={{ fontSize: 11, fill: "rgba(255,255,255,0.3)" }} />
              <YAxis yAxisId="left" tick={{ fontSize: 11, fill: "rgba(255,255,255,0.3)" }} />
              <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11, fill: "rgba(255,255,255,0.3)" }} />
              <Tooltip contentStyle={{ backgroundColor: "#13131f", border: "1px solid rgba(139,92,246,0.3)", borderRadius: "8px", fontSize: "12px", color: "#fff" }} />
              <Legend wrapperStyle={{ fontSize: "12px", color: "rgba(255,255,255,0.5)" }} />
              <Bar yAxisId="left" dataKey="ventes" name="Ventes (FCFA)" fill="#8b5cf6" radius={[4, 4, 0, 0]} opacity={0.8} />
              <Line yAxisId="right" type="monotone" dataKey="clients" name="Nouveaux clients" stroke="#34d399" strokeWidth={2} dot={{ fill: "#34d399", r: 3 }} activeDot={{ r: 5 }} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        <div className="bottom-grid">
          <div style={cardStyle}>
            <h2 style={{ fontSize: "14px", fontWeight: "600", margin: "0 0 1rem" }}>🛒 Commandes récentes</h2>
            {commandes.length === 0 ? (
              <div style={{ textAlign: "center", padding: "2rem 0" }}>
                <p style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>📭</p>
                <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.3)" }}>Aucune commande</p>
              </div>
            ) : (
              commandes.slice(0, 5).map(c => (
                <div key={c.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                  <div>
                    <p style={{ fontSize: "13px", fontWeight: "500", margin: "0 0 2px" }}>{c.customer?.name}</p>
                    <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)", margin: 0 }}>{new Date(c.createdAt).toLocaleDateString("fr-FR")}</p>
                  </div>
                  <p style={{ fontSize: "13px", fontWeight: "600", color: "#a78bfa", margin: 0 }}>{c.total?.toLocaleString()} FCFA</p>
                </div>
              ))
            )}
          </div>

          <div style={cardStyle}>
            <h2 style={{ fontSize: "14px", fontWeight: "600", margin: "0 0 1rem" }}>🤖 Assistant IA Bizora</h2>
            <div style={{ background: "rgba(139,92,246,0.08)", border: "1px solid rgba(139,92,246,0.2)", borderRadius: "10px", padding: "1rem", marginBottom: "1rem", minHeight: "80px" }}>
              <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.7)", margin: 0, lineHeight: "1.6" }}>
                {aiResponse || "Bonjour ! Je suis votre assistant IA. Posez-moi une question sur vos ventes, clients ou produits."}
              </p>
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
              <input
                type="text"
                placeholder="Posez une question à l'IA..."
                value={aiMessage}
                onChange={(e) => setAiMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAiChat()}
                style={{ flex: 1, padding: "9px 12px", borderRadius: "10px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", fontSize: "13px", outline: "none" }}
                onFocus={e => (e.currentTarget.style.borderColor = "rgba(139,92,246,0.6)")}
                onBlur={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")}
              />
              <button
                onClick={handleAiChat}
                disabled={aiLoading}
                style={{ padding: "9px 16px", borderRadius: "10px", border: "none", background: aiLoading ? "rgba(139,92,246,0.4)" : "linear-gradient(135deg, #8b5cf6, #6d28d9)", color: "#fff", fontSize: "13px", fontWeight: "600", cursor: aiLoading ? "not-allowed" : "pointer", boxShadow: "0 0 12px rgba(139,92,246,0.3)" }}
              >
                {aiLoading ? "..." : "→"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}