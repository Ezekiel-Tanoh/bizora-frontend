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
  const [search, setSearch] = useState("")
  const [filtre, setFiltre] = useState("Tous")

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

  const filtered = produits.filter(p => {
    const matchSearch = p.name?.toLowerCase().includes(search.toLowerCase())
    const matchFiltre =
      filtre === "Tous" ? true :
      filtre === "En stock" ? p.stock > 5 :
      filtre === "Stock faible" ? p.stock > 0 && p.stock <= 5 :
      filtre === "Rupture" ? p.stock === 0 : true
    return matchSearch && matchFiltre
  })

  const valeurTotaleStock = produits.reduce((sum, p) => sum + (p.price * p.stock), 0)

  return (
    <>
      <style>{`
        .stock-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
        .stock-kpi { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; margin-bottom: 1.5rem; }
        .stock-alertes { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.5rem; }
        .stock-table { display: block; }
        .stock-cards { display: none; }
        @media (max-width: 768px) {
          .stock-header { flex-direction: column; align-items: flex-start; gap: 1rem; }
          .stock-header button { width: 100%; }
          .stock-kpi { grid-template-columns: repeat(2, 1fr); }
          .stock-alertes { grid-template-columns: 1fr; }
          .stock-table { display: none; }
          .stock-cards { display: flex; flex-direction: column; gap: 0.75rem; padding: 1rem; }
        }
      `}</style>

      <div style={{ color: "#fff", fontFamily: "'Inter', sans-serif" }}>

        <NouveauMouvementModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSuccess={fetchProduits} />

        <div className="stock-header">
          <div>
            <h1 style={{ fontSize: "1.5rem", fontWeight: "700", margin: 0 }}>Stock</h1>
            <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.4)", margin: "4px 0 0" }}>
              Gérez votre inventaire en temps réel
            </p>
          </div>
          <button onClick={() => setIsModalOpen(true)} style={{
            padding: "10px 20px", borderRadius: "10px", border: "none",
            background: "linear-gradient(135deg, #8b5cf6, #6d28d9)",
            color: "#fff", fontSize: "14px", fontWeight: "600",
            cursor: "pointer", boxShadow: "0 0 20px rgba(139,92,246,0.3)"
          }}>
            + Mouvement de stock
          </button>
        </div>

        <div className="stock-kpi">
          {[
            { label: "Total articles", value: produits.length, color: "#fff", icon: "📦" },
            { label: "Valeur du stock", value: `${valeurTotaleStock.toLocaleString()} FCFA`, color: "#a78bfa", icon: "💰" },
            { label: "Stock faible", value: produits.filter(p => p.stock > 0 && p.stock <= 5).length, color: "#fbbf24", icon: "⚠️" },
            { label: "Rupture", value: produits.filter(p => p.stock === 0).length, color: "#f87171", icon: "❌" },
          ].map((kpi, i) => (
            <div key={i} style={{ ...cardStyle, transition: "all 0.2s" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(139,92,246,0.3)"; e.currentTarget.style.background = "rgba(139,92,246,0.06)" }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"; e.currentTarget.style.background = "rgba(255,255,255,0.03)" }}
            >
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", margin: "0 0 8px" }}>{kpi.label}</p>
                <span style={{ fontSize: "18px" }}>{kpi.icon}</span>
              </div>
              <p style={{ fontSize: "1.4rem", fontWeight: "700", color: kpi.color, margin: 0 }}>{kpi.value}</p>
            </div>
          ))}
        </div>

        {/* Alertes */}
        <div className="stock-alertes">
          <div style={{ ...cardStyle, borderColor: "rgba(251,191,36,0.2)", background: "rgba(251,191,36,0.04)" }}>
            <h2 style={{ fontSize: "14px", fontWeight: "600", color: "#fbbf24", margin: "0 0 1rem" }}>
              ⚠️ Stock faible — À reapprovisionner
            </h2>
            {produits.filter(p => p.stock > 0 && p.stock <= 5).length === 0 ? (
              <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.3)", textAlign: "center", padding: "1rem 0" }}>
                ✅ Aucun produit en stock faible
              </p>
            ) : (
              produits.filter(p => p.stock > 0 && p.stock <= 5).map(p => (
                <div key={p.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid rgba(251,191,36,0.1)" }}>
                  <div>
                    <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.7)", margin: "0 0 2px" }}>{p.name}</p>
                    <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)", margin: 0 }}>{p.category || "Général"}</p>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <span style={{ fontSize: "12px", padding: "2px 8px", borderRadius: "100px", background: "rgba(251,191,36,0.1)", color: "#fbbf24" }}>
                      {p.stock} restants
                    </span>
                    <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)", margin: "4px 0 0" }}>
                      {p.price?.toLocaleString()} FCFA/u
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>

          <div style={{ ...cardStyle, borderColor: "rgba(239,68,68,0.2)", background: "rgba(239,68,68,0.04)" }}>
            <h2 style={{ fontSize: "14px", fontWeight: "600", color: "#f87171", margin: "0 0 1rem" }}>
              🚨 Ruptures de stock
            </h2>
            {produits.filter(p => p.stock === 0).length === 0 ? (
              <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.3)", textAlign: "center", padding: "1rem 0" }}>
                ✅ Aucune rupture de stock
              </p>
            ) : (
              produits.filter(p => p.stock === 0).map(p => (
                <div key={p.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid rgba(239,68,68,0.1)" }}>
                  <div>
                    <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.7)", margin: "0 0 2px" }}>{p.name}</p>
                    <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)", margin: 0 }}>{p.category || "Général"}</p>
                  </div>
                  <button
                    onClick={() => setIsModalOpen(true)}
                    style={{
                      fontSize: "11px", padding: "4px 10px", borderRadius: "8px",
                      background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)",
                      color: "#f87171", cursor: "pointer"
                    }}
                  >
                    + Réapprovisionner
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Tableau complet */}
        <div style={{ ...cardStyle, padding: 0, overflow: "hidden" }}>

          <div style={{ display: "flex", gap: "1rem", padding: "1rem 1.25rem", borderBottom: "1px solid rgba(255,255,255,0.06)", flexWrap: "wrap" }}>
            <input
              type="text"
              placeholder="🔍 Rechercher un produit..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", padding: "8px 14px", color: "#fff", fontSize: "13px", outline: "none", flex: 1, minWidth: "200px" }}
            />
            <div style={{ display: "flex", gap: "6px" }}>
              {["Tous", "En stock", "Stock faible", "Rupture"].map(f => (
                <button
                  key={f}
                  onClick={() => setFiltre(f)}
                  style={{
                    padding: "6px 12px", borderRadius: "8px", borderBlockColor: "rgba(255,255,255,0.1)",
                    fontSize: "12px", cursor: "pointer", transition: "all 0.2s",
                    background: filtre === f ? "rgba(139,92,246,0.2)" : "rgba(255,255,255,0.05)",
                    color: filtre === f ? "#a78bfa" : "rgba(255,255,255,0.4)",
                    border: filtre === f ? "1px solid rgba(139,92,246,0.3)" : "1px solid transparent" as any
                  }}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* TABLE DESKTOP */}
          <div className="stock-table">
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                  {["Produit", "Catégorie", "Stock actuel", "Valeur stock", "Statut", "Action"].map(h => (
                    <th key={h} style={{ textAlign: "left", fontSize: "11px", color: "rgba(255,255,255,0.3)", fontWeight: "500", padding: "10px 16px", textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={6} style={{ textAlign: "center", padding: "4rem", color: "rgba(255,255,255,0.3)" }}>Chargement...</td></tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ textAlign: "center", padding: "4rem" }}>
                      <p style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>📭</p>
                      <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.3)" }}>Aucun article trouvé</p>
                    </td>
                  </tr>
                ) : (
                  filtered.map((produit) => (
                    <tr key={produit.id}
                      style={{ borderBottom: "1px solid rgba(255,255,255,0.04)", transition: "background 0.15s" }}
                      onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.02)")}
                      onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                    >
                      <td style={{ padding: "12px 16px" }}>
                        <p style={{ fontSize: "14px", fontWeight: "500", margin: "0 0 2px" }}>{produit.name}</p>
                        <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.3)", margin: 0 }}>{produit.price?.toLocaleString()} FCFA/unité</p>
                      </td>
                      <td style={{ padding: "12px 16px" }}>
                        <span style={{ fontSize: "12px", padding: "3px 10px", borderRadius: "100px", background: "rgba(139,92,246,0.15)", color: "#a78bfa", border: "1px solid rgba(139,92,246,0.2)" }}>
                          {produit.category || "Général"}
                        </span>
                      </td>
                      <td style={{ padding: "12px 16px" }}>
                        <p style={{ fontSize: "18px", fontWeight: "700", margin: 0, color: produit.stock === 0 ? "#f87171" : produit.stock <= 5 ? "#fbbf24" : "#34d399" }}>
                          {produit.stock}
                        </p>
                      </td>
                      <td style={{ padding: "12px 16px" }}>
                        <p style={{ fontSize: "13px", fontWeight: "600", color: "#a78bfa", margin: 0 }}>
                          {(produit.price * produit.stock).toLocaleString()} FCFA
                        </p>
                      </td>
                      <td style={{ padding: "12px 16px" }}>
                        {produit.stock === 0 ? (
                          <span style={{ fontSize: "12px", padding: "3px 10px", borderRadius: "100px", background: "rgba(239,68,68,0.1)", color: "#f87171", border: "1px solid rgba(239,68,68,0.2)" }}>🚨 Rupture</span>
                        ) : produit.stock <= 5 ? (
                          <span style={{ fontSize: "12px", padding: "3px 10px", borderRadius: "100px", background: "rgba(251,191,36,0.1)", color: "#fbbf24", border: "1px solid rgba(251,191,36,0.2)" }}>⚠️ Faible</span>
                        ) : (
                          <span style={{ fontSize: "12px", padding: "3px 10px", borderRadius: "100px", background: "rgba(52,211,153,0.1)", color: "#34d399", border: "1px solid rgba(52,211,153,0.2)" }}>✅ En stock</span>
                        )}
                      </td>
                      <td style={{ padding: "12px 16px" }}>
                        <button
                          onClick={() => setIsModalOpen(true)}
                          style={{
                            fontSize: "12px", padding: "5px 12px", borderRadius: "8px",
                            background: "rgba(139,92,246,0.1)", border: "1px solid rgba(139,92,246,0.2)",
                            color: "#a78bfa", cursor: "pointer"
                          }}
                        >
                          Ajuster
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* CARDS MOBILE */}
          <div className="stock-cards">
            {loading ? (
              <p style={{ textAlign: "center", color: "rgba(255,255,255,0.3)", padding: "2rem 0" }}>Chargement...</p>
            ) : filtered.length === 0 ? (
              <div style={{ textAlign: "center", padding: "2rem 0" }}>
                <p style={{ fontSize: "2rem" }}>📭</p>
                <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.3)" }}>Aucun article</p>
              </div>
            ) : (
              filtered.map((produit) => (
                <div key={produit.id} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "12px", padding: "1rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                    <div>
                      <p style={{ fontSize: "14px", fontWeight: "600", margin: "0 0 2px" }}>{produit.name}</p>
                      <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", margin: 0 }}>{produit.category || "Général"}</p>
                    </div>
                    {produit.stock === 0 ? (
                      <span style={{ fontSize: "11px", padding: "2px 8px", borderRadius: "100px", background: "rgba(239,68,68,0.1)", color: "#f87171" }}>🚨 Rupture</span>
                    ) : produit.stock <= 5 ? (
                      <span style={{ fontSize: "11px", padding: "2px 8px", borderRadius: "100px", background: "rgba(251,191,36,0.1)", color: "#fbbf24" }}>⚠️ Faible</span>
                    ) : (
                      <span style={{ fontSize: "11px", padding: "2px 8px", borderRadius: "100px", background: "rgba(52,211,153,0.1)", color: "#34d399" }}>✅ En stock</span>
                    )}
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <p style={{ fontSize: "20px", fontWeight: "700", margin: "0 0 2px", color: produit.stock === 0 ? "#f87171" : produit.stock <= 5 ? "#fbbf24" : "#34d399" }}>
                        {produit.stock} unités
                      </p>
                      <p style={{ fontSize: "12px", color: "#a78bfa", margin: 0 }}>
                        Valeur: {(produit.price * produit.stock).toLocaleString()} FCFA
                      </p>
                    </div>
                    <button
                      onClick={() => setIsModalOpen(true)}
                      style={{ fontSize: "12px", padding: "6px 14px", borderRadius: "8px", background: "rgba(139,92,246,0.15)", border: "1px solid rgba(139,92,246,0.2)", color: "#a78bfa", cursor: "pointer" }}
                    >
                      Ajuster
                    </button>
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