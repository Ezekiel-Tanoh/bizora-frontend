"use client"

import { useState, useEffect } from "react"
import api from "@/lib/api"
import NouveauMouvementModal from "@/components/NouveauMouvementModal"

const cardStyle = {
  background: "rgba(255,255,255,0.03)",
  border: "1px solid rgba(255,255,255,0.07)",
  borderRadius: "16px",
  padding: "1.25rem",
}

export default function Stock() {
  const [produits, setProduits] = useState<any[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  const fetchProduits = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("bizora_user") || "{}")
      const response = await api.get(`/products/${user.storeId}`)
      setProduits(response.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchProduits() }, [])

  return (
    <div style={{ color: "#fff", fontFamily: "'Inter', sans-serif" }}>

      <NouveauMouvementModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchProduits}
      />

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <div>
          <h1 style={{ fontSize: "1.5rem", fontWeight: "700", margin: 0 }}>Stock</h1>
          <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.4)", margin: "4px 0 0" }}>
            Gérez votre inventaire
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
          + Ajouter un mouvement
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem", marginBottom: "1.5rem" }}>
        {[
          { label: "Total articles", value: produits.length, color: "#fff", icon: "📦" },
          { label: "En stock", value: produits.filter(p => p.stock > 5).length, color: "#34d399", icon: "✅" },
          { label: "Stock faible", value: produits.filter(p => p.stock > 0 && p.stock <= 5).length, color: "#fbbf24", icon: "⚠️" },
          { label: "Rupture", value: produits.filter(p => p.stock === 0).length, color: "#f87171", icon: "❌" },
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

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.5rem" }}>
        <div style={{ ...cardStyle, borderColor: "rgba(251,191,36,0.2)", background: "rgba(251,191,36,0.04)" }}>
          <h2 style={{ fontSize: "14px", fontWeight: "600", color: "#fbbf24", margin: "0 0 1rem" }}>⚠️ Stock faible</h2>
          {produits.filter(p => p.stock > 0 && p.stock <= 5).length === 0 ? (
            <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.3)", textAlign: "center", padding: "1rem 0" }}>Aucune alerte</p>
          ) : (
            produits.filter(p => p.stock > 0 && p.stock <= 5).map(p => (
              <div key={p.id} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid rgba(251,191,36,0.1)" }}>
                <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.7)", margin: 0 }}>{p.name}</p>
                <span style={{ fontSize: "12px", padding: "2px 8px", borderRadius: "100px", background: "rgba(251,191,36,0.1)", color: "#fbbf24" }}>
                  {p.stock} restants
                </span>
              </div>
            ))
          )}
        </div>

        <div style={{ ...cardStyle, borderColor: "rgba(239,68,68,0.2)", background: "rgba(239,68,68,0.04)" }}>
          <h2 style={{ fontSize: "14px", fontWeight: "600", color: "#f87171", margin: "0 0 1rem" }}>🚨 Ruptures</h2>
          {produits.filter(p => p.stock === 0).length === 0 ? (
            <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.3)", textAlign: "center", padding: "1rem 0" }}>Aucune rupture</p>
          ) : (
            produits.filter(p => p.stock === 0).map(p => (
              <div key={p.id} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid rgba(239,68,68,0.1)" }}>
                <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.7)", margin: 0 }}>{p.name}</p>
                <span style={{ fontSize: "12px", padding: "2px 8px", borderRadius: "100px", background: "rgba(239,68,68,0.1)", color: "#f87171" }}>
                  Rupture
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      <div style={{ ...cardStyle, padding: 0, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              {["Produit", "Catégorie", "Stock actuel", "Statut", "Prix"].map(h => (
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
            ) : produits.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ textAlign: "center", padding: "4rem" }}>
                  <p style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>📭</p>
                  <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.3)" }}>Aucun article en stock</p>
                </td>
              </tr>
            ) : (
              produits.map((produit) => (
                <tr key={produit.id}
                  style={{ borderBottom: "1px solid rgba(255,255,255,0.04)", transition: "background 0.15s" }}
                  onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.02)")}
                  onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                >
                  <td style={{ padding: "12px 16px" }}>
                    <p style={{ fontSize: "14px", fontWeight: "500", margin: 0 }}>{produit.name}</p>
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <span style={{ fontSize: "12px", padding: "3px 10px", borderRadius: "100px", background: "rgba(139,92,246,0.15)", color: "#a78bfa", border: "1px solid rgba(139,92,246,0.2)" }}>
                      {produit.category || "Général"}
                    </span>
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <p style={{ fontSize: "14px", fontWeight: "600", margin: 0 }}>{produit.stock}</p>
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    {produit.stock === 0 ? (
                      <span style={{ fontSize: "12px", padding: "3px 10px", borderRadius: "100px", background: "rgba(239,68,68,0.1)", color: "#f87171", border: "1px solid rgba(239,68,68,0.2)" }}>Rupture</span>
                    ) : produit.stock <= 5 ? (
                      <span style={{ fontSize: "12px", padding: "3px 10px", borderRadius: "100px", background: "rgba(251,191,36,0.1)", color: "#fbbf24", border: "1px solid rgba(251,191,36,0.2)" }}>Stock faible</span>
                    ) : (
                      <span style={{ fontSize: "12px", padding: "3px 10px", borderRadius: "100px", background: "rgba(52,211,153,0.1)", color: "#34d399", border: "1px solid rgba(52,211,153,0.2)" }}>En stock</span>
                    )}
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <p style={{ fontSize: "14px", color: "#a78bfa", fontWeight: "600", margin: 0 }}>{produit.price?.toLocaleString()} FCFA</p>
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