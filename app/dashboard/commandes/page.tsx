"use client"

import { useState, useEffect } from "react"
import api from "@/lib/api"
import NouvelleCommandeModal from "@/components/NouvelleCommandeModal"


const cardStyle = {
  background: "rgba(255,255,255,0.03)",
  border: "1px solid rgba(255,255,255,0.07)",
  borderRadius: "16px",
  padding: "1.25rem",
}

export default function Commandes() {
  const [commandes, setCommandes] = useState<any[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const fetchCommandes = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("bizora_user") || "{}")
      const response = await api.get(`/orders/${user.storeId}`)
      setCommandes(response.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchCommandes() }, [])

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      await api.put(`/orders/${id}/status`, { status })
      fetchCommandes()
    } catch (err) {
      console.error(err)
    }
  }

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "pending": return { background: "rgba(251,191,36,0.1)", color: "#fbbf24", border: "1px solid rgba(251,191,36,0.2)" }
      case "confirmed": return { background: "rgba(59,130,246,0.1)", color: "#60a5fa", border: "1px solid rgba(59,130,246,0.2)" }
      case "shipped": return { background: "rgba(139,92,246,0.1)", color: "#a78bfa", border: "1px solid rgba(139,92,246,0.2)" }
      case "delivered": return { background: "rgba(52,211,153,0.1)", color: "#34d399", border: "1px solid rgba(52,211,153,0.2)" }
      case "cancelled": return { background: "rgba(239,68,68,0.1)", color: "#f87171", border: "1px solid rgba(239,68,68,0.2)" }
      default: return { background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.4)", border: "1px solid rgba(255,255,255,0.1)" }
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "pending": return "En attente"
      case "confirmed": return "Confirmé"
      case "shipped": return "Expédié"
      case "delivered": return "Livré"
      case "cancelled": return "Annulé"
      default: return status
    }
  }

  return (
    <>
      <style>{`
        .cmd-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
        .cmd-kpi { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; margin-bottom: 1.5rem; }
        .cmd-table { display: block; }
        .cmd-cards { display: none; }
        @media (max-width: 768px) {
          .cmd-header { flex-direction: column; align-items: flex-start; gap: 1rem; }
          .cmd-header button { width: 100%; }
          .cmd-kpi { grid-template-columns: repeat(2, 1fr); }
          .cmd-table { display: none; }
          .cmd-cards { display: flex; flex-direction: column; gap: 0.75rem; padding: 1rem; }
        }
      `}</style>

      <div style={{ color: "#fff", fontFamily: "'Inter', sans-serif" }}>

        <NouvelleCommandeModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSuccess={fetchCommandes} />
        <div className="cmd-header">
          <div>
            <h1 style={{ fontSize: "1.5rem", fontWeight: "700", margin: 0 }}>Commandes</h1>
            <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.4)", margin: "4px 0 0" }}>Gérez toutes vos commandes</p>
          </div>
          <button onClick={() => setIsModalOpen(true)} style={{
            padding: "10px 20px", borderRadius: "10px", border: "none",
            background: "linear-gradient(135deg, #8b5cf6, #6d28d9)",
            color: "#fff", fontSize: "14px", fontWeight: "600",
            cursor: "pointer", boxShadow: "0 0 20px rgba(139,92,246,0.3)"
          }}>
            + Nouvelle commande
          </button>
        </div>

        <div className="cmd-kpi">
          {[
            { label: "Total commandes", value: commandes.length, color: "#fff", icon: "🛒" },
            { label: "En attente", value: commandes.filter(c => c.status === "pending").length, color: "#fbbf24", icon: "⏳" },
            { label: "Livrées", value: commandes.filter(c => c.status === "delivered").length, color: "#34d399", icon: "✅" },
            { label: "Chiffre d'affaires", value: `${commandes.reduce((sum, c) => sum + c.total, 0).toLocaleString()} FCFA`, color: "#a78bfa", icon: "💰" },
          ].map((kpi, i) => (
            <div key={i} style={{ ...cardStyle, transition: "all 0.2s" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(139,92,246,0.3)"; e.currentTarget.style.background = "rgba(139,92,246,0.06)" }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"; e.currentTarget.style.background = "rgba(255,255,255,0.03)" }}
            >
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", margin: "0 0 8px" }}>{kpi.label}</p>
                <span style={{ fontSize: "18px" }}>{kpi.icon}</span>
              </div>
              <p style={{ fontSize: "1.8rem", fontWeight: "700", color: kpi.color, margin: 0 }}>{kpi.value}</p>
            </div>
          ))}
        </div>

        <div style={{ ...cardStyle, padding: 0, overflow: "hidden" }}>

          {/* TABLE DESKTOP */}
          <div className="cmd-table">
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                  {["Client", "Produits", "Total", "Statut", "Date", "Actions"].map(h => (
                    <th key={h} style={{ textAlign: "left", fontSize: "11px", color: "rgba(255,255,255,0.3)", fontWeight: "500", padding: "10px 16px", textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={6} style={{ textAlign: "center", padding: "4rem", color: "rgba(255,255,255,0.3)" }}>Chargement...</td></tr>
                ) : commandes.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ textAlign: "center", padding: "4rem" }}>
                      <p style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>📭</p>
                      <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.3)" }}>Aucune commande pour l'instant</p>
                    </td>
                  </tr>
                ) : (
                  commandes.map((commande) => (
                    <tr key={commande.id}
                      style={{ borderBottom: "1px solid rgba(255,255,255,0.04)", transition: "background 0.15s" }}
                      onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.02)")}
                      onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                    >
                      <td style={{ padding: "12px 16px" }}>
                        <p style={{ fontSize: "14px", fontWeight: "500", margin: "0 0 2px" }}>{commande.customer?.name}</p>
                        <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.3)", margin: 0 }}>{commande.customer?.phone}</p>
                      </td>
                      <td style={{ padding: "12px 16px" }}>
                        <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.6)", margin: 0 }}>{commande.items?.length} article(s)</p>
                      </td>
                      <td style={{ padding: "12px 16px" }}>
                        <p style={{ fontSize: "14px", fontWeight: "600", color: "#a78bfa", margin: 0 }}>{commande.total?.toLocaleString()} FCFA</p>
                      </td>
                      <td style={{ padding: "12px 16px" }}>
                        <span style={{ fontSize: "12px", padding: "3px 10px", borderRadius: "100px", ...getStatusStyle(commande.status) }}>
                          {getStatusLabel(commande.status)}
                        </span>
                      </td>
                      <td style={{ padding: "12px 16px" }}>
                        <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.3)", margin: 0 }}>
                          {new Date(commande.createdAt).toLocaleDateString("fr-FR")}
                        </p>
                      </td>
                      <td style={{ padding: "12px 16px" }}>
                        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                          <select
                            value={commande.status}
                            onChange={(e) => handleUpdateStatus(commande.id, e.target.value)}
                            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", padding: "4px 8px", color: "rgba(255,255,255,0.6)", fontSize: "12px", outline: "none" }}
                          >
                            <option style={{ background: "#1a1a2e" }} value="pending">En attente</option>
                            <option style={{ background: "#1a1a2e" }} value="confirmed">Confirmé</option>
                            <option style={{ background: "#1a1a2e" }} value="shipped">Expédié</option>
                            <option style={{ background: "#1a1a2e" }} value="delivered">Livré</option>
                            <option style={{ background: "#1a1a2e" }} value="cancelled">Annulé</option>
                          </select>
                          <td style={{ padding: "12px 16px" }}>
                           <select
                             value={commande.status}
                              onChange={(e) => handleUpdateStatus(commande.id, e.target.value)}
                             style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", padding: "4px 8px", color: "rgba(255,255,255,0.6)", fontSize: "12px", outline: "none" }}
                              >
                             <option style={{ background: "#1a1a2e" }} value="pending">En attente</option>
                             <option style={{ background: "#1a1a2e" }} value="confirmed">Confirmé</option>
                             <option style={{ background: "#1a1a2e" }} value="shipped">Expédié</option>
                             <option style={{ background: "#1a1a2e" }} value="delivered">Livré</option>
                             <option style={{ background: "#1a1a2e" }} value="cancelled">Annulé</option>
                           </select>
                           </td>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* CARDS MOBILE */}
          <div className="cmd-cards">
            {loading ? (
              <p style={{ textAlign: "center", color: "rgba(255,255,255,0.3)", padding: "2rem 0" }}>Chargement...</p>
            ) : commandes.length === 0 ? (
              <div style={{ textAlign: "center", padding: "2rem 0" }}>
                <p style={{ fontSize: "2rem" }}>📭</p>
                <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.3)" }}>Aucune commande</p>
              </div>
            ) : (
              commandes.map((commande) => (
                <div key={commande.id} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "12px", padding: "1rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                    <div>
                      <p style={{ fontSize: "14px", fontWeight: "600", margin: "0 0 2px" }}>{commande.customer?.name}</p>
                      <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.3)", margin: 0 }}>{commande.customer?.phone}</p>
                    </div>
                    <span style={{ fontSize: "11px", padding: "2px 8px", borderRadius: "100px", ...getStatusStyle(commande.status) }}>
                      {getStatusLabel(commande.status)}
                    </span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <p style={{ fontSize: "14px", fontWeight: "600", color: "#a78bfa", margin: 0 }}>{commande.total?.toLocaleString()} FCFA</p>
                    <div style={{ display: "flex", gap: "6px" }}>
                      <select
                        value={commande.status}
                        onChange={(e) => handleUpdateStatus(commande.id, e.target.value)}
                        style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", padding: "4px 6px", color: "rgba(255,255,255,0.6)", fontSize: "11px", outline: "none" }}
                      >
                        <option style={{ background: "#1a1a2e" }} value="pending">En attente</option>
                        <option style={{ background: "#1a1a2e" }} value="confirmed">Confirmé</option>
                        <option style={{ background: "#1a1a2e" }} value="shipped">Expédié</option>
                        <option style={{ background: "#1a1a2e" }} value="delivered">Livré</option>
                        <option style={{ background: "#1a1a2e" }} value="cancelled">Annulé</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  )
}