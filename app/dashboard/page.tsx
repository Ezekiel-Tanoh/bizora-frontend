"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, BarChart, Bar
} from "recharts"
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

const cardStyle = {
  background: "rgba(255,255,255,0.03)",
  border: "1px solid rgba(255,255,255,0.07)",
  borderRadius: "16px",
  padding: "1.25rem",
}

export default function Dashboard() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [stats, setStats] = useState({ products: 0, orders: 0, customers: 0, revenue: 0 })
  const [aiMessage, setAiMessage] = useState("")
  const [aiResponse, setAiResponse] = useState("")
  const [aiLoading, setAiLoading] = useState(false)

  useEffect(() => {
    const userData = localStorage.getItem("bizora_user")
    if (!userData) { router.push("/login"); return }
    setUser(JSON.parse(userData))
  }, [])

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

  const kpis = [
    { label: "Chiffre d'affaires", value: `${stats.revenue} FCFA`, sub: "↑ Ce mois", subColor: "#34d399", icon: "💰" },
    { label: "Commandes", value: stats.orders, sub: "Ce mois", subColor: "rgba(255,255,255,0.3)", icon: "🛒" },
    { label: "Clients", value: stats.customers, sub: "Total", subColor: "rgba(255,255,255,0.3)", icon: "👥" },
    { label: "Produits", value: stats.products, sub: "⚠ Stock faible", subColor: "#fbbf24", icon: "📦" },
  ]

  return (
    <>
      <style>{`
        .dash-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }
        .kpi-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1rem;
          margin-bottom: 1.5rem;
        }
        .chart-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }
        .bottom-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }
        @media (max-width: 768px) {
          .dash-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
          }
          .dash-header button {
            width: 100%;
          }
          .kpi-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .chart-grid {
            grid-template-columns: 1fr;
          }
          .bottom-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div style={{ color: "#fff", fontFamily: "'Inter', sans-serif" }}>

        {/* Header */}
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

        {/* KPIs */}
        <div className="kpi-grid">
          {kpis.map((kpi, i) => (
            <div key={i} style={{ ...cardStyle, transition: "all 0.2s" }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = "rgba(139,92,246,0.3)"
                e.currentTarget.style.background = "rgba(139,92,246,0.06)"
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"
                e.currentTarget.style.background = "rgba(255,255,255,0.03)"
              }}
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

        {/* Graphiques */}
        <div className="chart-grid">

          {/* Ventes */}
          <div style={cardStyle}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
              <h2 style={{ fontSize: "14px", fontWeight: "600", margin: 0 }}>📈 Progression des ventes</h2>
              <select style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "8px", padding: "4px 8px",
                fontSize: "12px", color: "rgba(255,255,255,0.6)", outline: "none"
              }}>
                <option style={{ background: "#1a1a2e" }}>Cette semaine</option>
                <option style={{ background: "#1a1a2e" }}>Ce mois</option>
                <option style={{ background: "#1a1a2e" }}>3 derniers mois</option>
                <option style={{ background: "#1a1a2e" }}>Cette année</option>
              </select>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={ventesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="mois" tick={{ fontSize: 11, fill: "rgba(255,255,255,0.3)" }} />
                <YAxis tick={{ fontSize: 11, fill: "rgba(255,255,255,0.3)" }} />
                <Tooltip contentStyle={{ backgroundColor: "#13131f", border: "1px solid rgba(139,92,246,0.3)", borderRadius: "8px", fontSize: "12px", color: "#fff" }} />
                <Line type="monotone" dataKey="ventes" stroke="#8b5cf6" strokeWidth={2} dot={{ fill: "#8b5cf6", r: 3 }} activeDot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Clients */}
          <div style={cardStyle}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
              <h2 style={{ fontSize: "14px", fontWeight: "600", margin: 0 }}>👥 Progression des clients</h2>
              <select style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "8px", padding: "4px 8px",
                fontSize: "12px", color: "rgba(255,255,255,0.6)", outline: "none"
              }}>
                <option style={{ background: "#1a1a2e" }}>Cette semaine</option>
                <option style={{ background: "#1a1a2e" }}>Ce mois</option>
                <option style={{ background: "#1a1a2e" }}>3 derniers mois</option>
                <option style={{ background: "#1a1a2e" }}>Cette année</option>
              </select>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={ventesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="mois" tick={{ fontSize: 11, fill: "rgba(255,255,255,0.3)" }} />
                <YAxis tick={{ fontSize: 11, fill: "rgba(255,255,255,0.3)" }} />
                <Tooltip contentStyle={{ backgroundColor: "#13131f", border: "1px solid rgba(139,92,246,0.3)", borderRadius: "8px", fontSize: "12px", color: "#fff" }} />
                <Bar dataKey="clients" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

        </div>

        {/* Commandes + IA */}
        <div className="bottom-grid">

          {/* Commandes récentes */}
          <div style={cardStyle}>
            <h2 style={{ fontSize: "14px", fontWeight: "600", margin: "0 0 1rem" }}>🛒 Commandes récentes</h2>
            <div style={{ textAlign: "center", padding: "2rem 0" }}>
              <p style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>📭</p>
              <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.3)" }}>Aucune commande pour l'instant</p>
              <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.2)", marginTop: "4px" }}>Vos commandes apparaîtront ici</p>
            </div>
          </div>

          {/* IA Assistant */}
          <div style={cardStyle}>
            <h2 style={{ fontSize: "14px", fontWeight: "600", margin: "0 0 1rem" }}>🤖 Assistant IA Bizora</h2>
            <div style={{
              background: "rgba(139,92,246,0.08)",
              border: "1px solid rgba(139,92,246,0.2)",
              borderRadius: "10px", padding: "1rem", marginBottom: "1rem",
              minHeight: "80px"
            }}>
              <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.7)", margin: 0, lineHeight: "1.6" }}>
                {aiResponse || "Bonjour ! Je suis votre assistant IA. Je peux vous aider à analyser vos ventes, générer des descriptions produits et bien plus encore."}
              </p>
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
              <input
                type="text"
                placeholder="Posez une question à l'IA..."
                value={aiMessage}
                onChange={(e) => setAiMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAiChat()}
                style={{
                  flex: 1, padding: "9px 12px", borderRadius: "10px",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: "#fff", fontSize: "13px", outline: "none"
                }}
                onFocus={e => (e.currentTarget.style.borderColor = "rgba(139,92,246,0.6)")}
                onBlur={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")}
              />
              <button
                onClick={handleAiChat}
                disabled={aiLoading}
                style={{
                  padding: "9px 16px", borderRadius: "10px", border: "none",
                  background: aiLoading ? "rgba(139,92,246,0.4)" : "linear-gradient(135deg, #8b5cf6, #6d28d9)",
                  color: "#fff", fontSize: "13px", fontWeight: "600",
                  cursor: aiLoading ? "not-allowed" : "pointer",
                  boxShadow: "0 0 12px rgba(139,92,246,0.3)"
                }}
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