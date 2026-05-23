"use client"

import { useState, useEffect } from "react"
import api from "@/lib/api"
import NouveauClientModal from "@/components/NouveauClientModal"

const cardStyle = {
  background: "rgba(255,255,255,0.03)",
  border: "1px solid rgba(255,255,255,0.07)",
  borderRadius: "16px",
  padding: "1.25rem",
}

export default function Clients() {
  const [clients, setClients] = useState<any[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")

  const fetchClients = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("bizora_user") || "{}")
      const response = await api.get(`/customers/${user.storeId}`)
      setClients(response.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchClients() }, [])

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer ce client ?")) return
    try {
      await api.delete(`/customers/${id}`)
      fetchClients()
    } catch (err) {
      console.error(err)
    }
  }

  const filtered = clients.filter(c =>
    c.name?.toLowerCase().includes(search.toLowerCase()) ||
    c.phone?.includes(search)
  )

  return (
    <div style={{ color: "#fff", fontFamily: "'Inter', sans-serif" }}>

      <NouveauClientModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchClients}
      />

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <div>
          <h1 style={{ fontSize: "1.5rem", fontWeight: "700", margin: 0 }}>Clients</h1>
          <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.4)", margin: "4px 0 0" }}>
            Gérez votre base de clients
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          style={{
            padding: "10px 20px", borderRadius: "10px", border: "none",
            background: "linear-gradient(135deg, #8b5cf6, #6d28d9)",
            color: "#fff", fontSize: "14px", fontWeight: "600",
            cursor: "pointer", boxShadow: "0 0 20px rgba(139,92,246,0.3)"
          }}
        >
          + Ajouter un client
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem", marginBottom: "1.5rem" }}>
        {[
          { label: "Total clients", value: clients.length, color: "#fff", icon: "👥" },
          { label: "Nouveaux ce mois", value: clients.filter(c => new Date(c.createdAt).getMonth() === new Date().getMonth()).length, color: "#a78bfa", icon: "🆕" },
          { label: "Clients fidèles", value: 0, color: "#34d399", icon: "⭐" },
          { label: "Panier moyen", value: "0 FCFA", color: "#fbbf24", icon: "🛒" },
        ].map((kpi, i) => (
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
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", margin: "0 0 8px" }}>{kpi.label}</p>
              <span style={{ fontSize: "18px" }}>{kpi.icon}</span>
            </div>
            <p style={{ fontSize: "1.8rem", fontWeight: "700", color: kpi.color, margin: 0 }}>{kpi.value}</p>
          </div>
        ))}
      </div>

      <div style={{ ...cardStyle, padding: 0, overflow: "hidden" }}>
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "1rem 1.25rem", borderBottom: "1px solid rgba(255,255,255,0.06)"
        }}>
          <input
            type="text"
            placeholder="🔍 Rechercher un client..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "10px", padding: "8px 14px",
              color: "#fff", fontSize: "13px", outline: "none", width: "240px"
            }}
          />
        </div>

        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              {["Client", "Téléphone", "Email", "Depuis", "Actions"].map(h => (
                <th key={h} style={{
                  textAlign: "left", fontSize: "11px",
                  color: "rgba(255,255,255,0.3)", fontWeight: "500",
                  padding: "10px 16px", textTransform: "uppercase", letterSpacing: "0.05em"
                }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} style={{ textAlign: "center", padding: "4rem", color: "rgba(255,255,255,0.3)" }}>
                  Chargement...
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ textAlign: "center", padding: "4rem" }}>
                  <p style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>📭</p>
                  <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.3)" }}>Aucun client pour l'instant</p>
                </td>
              </tr>
            ) : (
              filtered.map((client) => (
                <tr key={client.id}
                  style={{ borderBottom: "1px solid rgba(255,255,255,0.04)", transition: "background 0.15s" }}
                  onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.02)")}
                  onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                >
                  <td style={{ padding: "12px 16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <div style={{
                        width: "32px", height: "32px", borderRadius: "50%",
                        background: "rgba(139,92,246,0.2)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: "14px", fontWeight: "600", color: "#a78bfa"
                      }}>
                        {client.name?.charAt(0).toUpperCase()}
                      </div>
                      <p style={{ fontSize: "14px", fontWeight: "500", margin: 0 }}>{client.name}</p>
                    </div>
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.6)", margin: 0 }}>{client.phone}</p>
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)", margin: 0 }}>{client.email || "—"}</p>
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.3)", margin: 0 }}>
                      {new Date(client.createdAt).toLocaleDateString("fr-FR")}
                    </p>
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <div style={{ display: "flex", gap: "12px" }}>
                      <button style={{ fontSize: "12px", color: "#a78bfa", background: "none", border: "none", cursor: "pointer", padding: 0 }}>
                        Modifier
                      </button>
                      <button
                        onClick={() => handleDelete(client.id)}
                        style={{ fontSize: "12px", color: "#f87171", background: "none", border: "none", cursor: "pointer", padding: 0 }}
                      >
                        Supprimer
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}