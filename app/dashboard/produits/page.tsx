"use client"

import { useState, useEffect } from "react"
import api from "@/lib/api"
import NouveauProduitModal from "@/components/NouveauProduitModal"

const cardStyle = {
  background: "rgba(255,255,255,0.03)",
  border: "1px solid rgba(255,255,255,0.07)",
  borderRadius: "16px",
  padding: "1.25rem",
}

export default function Produits() {
  const [produits, setProduits] = useState<any[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [categorie, setCategorie] = useState("Toutes")

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

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer ce produit ?")) return
    try {
      await api.delete(`/products/${id}`)
      fetchProduits()
    } catch (err) {
      console.error(err)
    }
  }

  const filtered = produits.filter(p => {
    const matchSearch = p.name?.toLowerCase().includes(search.toLowerCase())
    const matchCat = categorie === "Toutes" || p.category === categorie
    return matchSearch && matchCat
  })

  const inputStyle = {
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "10px", padding: "8px 14px",
    color: "#fff", fontSize: "13px", outline: "none",
  }

  return (
    <>
      <style>{`
        .produits-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }
        .produits-kpi {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1rem;
          margin-bottom: 1.5rem;
        }
        .produits-filtres {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem 1.25rem;
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }
        .produits-table { display: block; }
        .produits-cards { display: none; }
        @media (max-width: 768px) {
          .produits-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
          }
          .produits-header button { width: 100%; }
          .produits-kpi { grid-template-columns: repeat(2, 1fr); }
          .produits-filtres {
            flex-direction: column;
            gap: 0.75rem;
            align-items: stretch;
          }
          .produits-filtres input,
          .produits-filtres select { width: 100%; }
          .produits-table { display: none; }
          .produits-cards { display: flex; flex-direction: column; gap: 0.75rem; padding: 1rem; }
        }
      `}</style>

      <div style={{ color: "#fff", fontFamily: "'Inter', sans-serif" }}>

        <NouveauProduitModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSuccess={fetchProduits}
        />

        <div className="produits-header">
          <div>
            <h1 style={{ fontSize: "1.5rem", fontWeight: "700", margin: 0 }}>Produits</h1>
            <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.4)", margin: "4px 0 0" }}>
              Gérez votre catalogue de produits
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
            + Ajouter un produit
          </button>
        </div>

        <div className="produits-kpi">
          {[
            { label: "Total produits", value: produits.length, color: "#fff", icon: "📦" },
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

        <div style={{ ...cardStyle, padding: 0, overflow: "hidden" }}>

          <div className="produits-filtres">
            <input
              type="text"
              placeholder="🔍 Rechercher un produit..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "10px", padding: "8px 14px",
                color: "#fff", fontSize: "13px", outline: "none", width: "240px"
              }}
            />
            <select
              value={categorie}
              onChange={e => setCategorie(e.target.value)}
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "10px", padding: "8px 14px",
                color: "rgba(255,255,255,0.6)", fontSize: "13px", outline: "none"
              }}
            >
              {["Toutes", "Mode", "Alimentation", "Électronique", "Beauté"].map(c => (
                <option key={c} style={{ background: "#1a1a2e" }}>{c}</option>
              ))}
            </select>
          </div>

          {/* TABLE DESKTOP */}
          <div className="produits-table">
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                  {["Produit", "Catégorie", "Prix", "Stock", "Statut", "Actions"].map(h => (
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
                  <tr><td colSpan={6} style={{ textAlign: "center", padding: "4rem", color: "rgba(255,255,255,0.3)" }}>Chargement...</td></tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ textAlign: "center", padding: "4rem" }}>
                      <p style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>📭</p>
                      <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.3)" }}>Aucun produit pour l'instant</p>
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
                        <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.3)", margin: 0 }}>
                          {produit.description?.slice(0, 40)}...
                        </p>
                      </td>
                      <td style={{ padding: "12px 16px" }}>
                        <span style={{
                          fontSize: "12px", padding: "3px 10px", borderRadius: "100px",
                          background: "rgba(139,92,246,0.15)", color: "#a78bfa",
                          border: "1px solid rgba(139,92,246,0.2)"
                        }}>
                          {produit.category || "Général"}
                        </span>
                      </td>
                      <td style={{ padding: "12px 16px" }}>
                        <p style={{ fontSize: "14px", fontWeight: "600", margin: 0, color: "#a78bfa" }}>
                          {produit.price?.toLocaleString()} FCFA
                        </p>
                      </td>
                      <td style={{ padding: "12px 16px" }}>
                        <p style={{ fontSize: "14px", margin: 0 }}>{produit.stock}</p>
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
                        <div style={{ display: "flex", gap: "12px" }}>
                          <button style={{ fontSize: "12px", color: "#a78bfa", background: "none", border: "none", cursor: "pointer", padding: 0 }}>Modifier</button>
                          <button onClick={() => handleDelete(produit.id)} style={{ fontSize: "12px", color: "#f87171", background: "none", border: "none", cursor: "pointer", padding: 0 }}>Supprimer</button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* CARDS MOBILE */}
          <div className="produits-cards">
            {loading ? (
              <p style={{ textAlign: "center", color: "rgba(255,255,255,0.3)", padding: "2rem 0" }}>Chargement...</p>
            ) : filtered.length === 0 ? (
              <div style={{ textAlign: "center", padding: "2rem 0" }}>
                <p style={{ fontSize: "2rem" }}>📭</p>
                <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.3)" }}>Aucun produit</p>
              </div>
            ) : (
              filtered.map((produit) => (
                <div key={produit.id} style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.07)",
                  borderRadius: "12px", padding: "1rem"
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                    <p style={{ fontSize: "14px", fontWeight: "600", margin: 0 }}>{produit.name}</p>
                    {produit.stock === 0 ? (
                      <span style={{ fontSize: "11px", padding: "2px 8px", borderRadius: "100px", background: "rgba(239,68,68,0.1)", color: "#f87171" }}>Rupture</span>
                    ) : produit.stock <= 5 ? (
                      <span style={{ fontSize: "11px", padding: "2px 8px", borderRadius: "100px", background: "rgba(251,191,36,0.1)", color: "#fbbf24" }}>Stock faible</span>
                    ) : (
                      <span style={{ fontSize: "11px", padding: "2px 8px", borderRadius: "100px", background: "rgba(52,211,153,0.1)", color: "#34d399" }}>En stock</span>
                    )}
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <p style={{ fontSize: "13px", color: "#a78bfa", fontWeight: "600", margin: "0 0 2px" }}>{produit.price?.toLocaleString()} FCFA</p>
                      <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.3)", margin: 0 }}>Stock: {produit.stock}</p>
                    </div>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button style={{ fontSize: "12px", color: "#a78bfa", background: "none", border: "none", cursor: "pointer" }}>Modifier</button>
                      <button onClick={() => handleDelete(produit.id)} style={{ fontSize: "12px", color: "#f87171", background: "none", border: "none", cursor: "pointer" }}>Supprimer</button>
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