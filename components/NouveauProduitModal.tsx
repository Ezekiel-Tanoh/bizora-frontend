"use client"

import { useState } from "react"
import api from "@/lib/api"

interface Props {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export default function NouveauProduitModal({ isOpen, onClose, onSuccess }: Props) {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState("")
  const [stock, setStock] = useState("")
  const [category, setCategory] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [aiLoading, setAiLoading] = useState(false)

  const handleGenerateDescription = async () => {
    if (!name) return
    setAiLoading(true)
    try {
      const response = await api.post("/ai/generate-description", {
        productName: name,
        category: category || "Général",
      })
      setDescription(response.data.description)
    } catch (err) {
      setError("Erreur IA")
    } finally {
      setAiLoading(false)
    }
  }

  const handleSubmit = async () => {
    if (!name || !price || !stock) {
      setError("Nom, prix et stock sont obligatoires")
      return
    }
    setLoading(true)
    setError("")
    try {
      const user = JSON.parse(localStorage.getItem("bizora_user") || "{}")
      await api.post("/products", {
        storeId: user.storeId,
        name, description,
        price: parseFloat(price),
        stock: parseInt(stock),
        category,
      })
      onSuccess()
      onClose()
      setName(""); setDescription(""); setPrice(""); setStock(""); setCategory("")
    } catch (err) {
      setError("Erreur lors de la création du produit")
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = {
    width: "100%", padding: "10px 14px", borderRadius: "10px",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.1)",
    color: "#fff", fontSize: "13px", outline: "none",
    boxSizing: "border-box" as any, transition: "border 0.2s"
  }

  if (!isOpen) return null

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 50,
      background: "rgba(0,0,0,0.7)",
      display: "flex", alignItems: "center", justifyContent: "center",
      backdropFilter: "blur(4px)"
    }}>
      <div style={{
        background: "#13131f",
        border: "1px solid rgba(139,92,246,0.2)",
        borderRadius: "20px", padding: "2rem",
        width: "100%", maxWidth: "460px",
        maxHeight: "90vh", overflowY: "auto",
        boxShadow: "0 0 40px rgba(139,92,246,0.1)",
        fontFamily: "'Inter', sans-serif", color: "#fff"
      }}>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
          <h2 style={{ fontSize: "1.1rem", fontWeight: "700", margin: 0 }}>Nouveau produit</h2>
          <button
            onClick={onClose}
            style={{
              background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "8px", width: "32px", height: "32px",
              color: "rgba(255,255,255,0.5)", fontSize: "16px", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center"
            }}
          >✕</button>
        </div>

        {error && (
          <div style={{
            background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)",
            borderRadius: "10px", padding: "10px 14px", marginBottom: "1.25rem"
          }}>
            <p style={{ fontSize: "13px", color: "#f87171", margin: 0 }}>{error}</p>
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>

          {/* Nom */}
          <div>
            <label style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", display: "block", marginBottom: "6px" }}>
              Nom du produit <span style={{ color: "#a78bfa" }}>*</span>
            </label>
            <input
              type="text" placeholder="Ex: Robe en wax" value={name}
              onChange={(e) => setName(e.target.value)} style={inputStyle}
              onFocus={e => (e.currentTarget.style.borderColor = "rgba(139,92,246,0.6)")}
              onBlur={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")}
            />
          </div>

          {/* Catégorie */}
          <div>
            <label style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", display: "block", marginBottom: "6px" }}>
              Catégorie
            </label>
            <select
              value={category} onChange={(e) => setCategory(e.target.value)}
              style={{ ...inputStyle, cursor: "pointer" }}
              onFocus={e => (e.currentTarget.style.borderColor = "rgba(139,92,246,0.6)")}
              onBlur={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")}
            >
              <option value="" style={{ background: "#1a1a2e" }}>Choisir une catégorie</option>
              {["Mode", "Alimentation", "Électronique", "Beauté", "Maison", "Autre"].map(c => (
                <option key={c} value={c} style={{ background: "#1a1a2e" }}>{c}</option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
              <label style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)" }}>Description</label>
              <button
                onClick={handleGenerateDescription}
                disabled={aiLoading || !name}
                style={{
                  fontSize: "12px", color: aiLoading || !name ? "rgba(255,255,255,0.2)" : "#a78bfa",
                  background: "none", border: "none", cursor: aiLoading || !name ? "not-allowed" : "pointer",
                  padding: 0
                }}
              >
                {aiLoading ? "Génération..." : "🤖 Générer avec IA"}
              </button>
            </div>
            <textarea
              placeholder="Description du produit..." value={description}
              onChange={(e) => setDescription(e.target.value)} rows={3}
              style={{ ...inputStyle, resize: "none" }}
              onFocus={e => (e.currentTarget.style.borderColor = "rgba(139,92,246,0.6)")}
              onBlur={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")}
            />
          </div>

          {/* Prix + Stock */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div>
              <label style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", display: "block", marginBottom: "6px" }}>
                Prix (FCFA) <span style={{ color: "#a78bfa" }}>*</span>
              </label>
              <input
                type="number" placeholder="Ex: 15000" value={price}
                onChange={(e) => setPrice(e.target.value)} style={inputStyle}
                onFocus={e => (e.currentTarget.style.borderColor = "rgba(139,92,246,0.6)")}
                onBlur={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")}
              />
            </div>
            <div>
              <label style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", display: "block", marginBottom: "6px" }}>
                Stock <span style={{ color: "#a78bfa" }}>*</span>
              </label>
              <input
                type="number" placeholder="Ex: 10" value={stock}
                onChange={(e) => setStock(e.target.value)} style={inputStyle}
                onFocus={e => (e.currentTarget.style.borderColor = "rgba(139,92,246,0.6)")}
                onBlur={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")}
              />
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: "10px", marginTop: "1.5rem" }}>
          <button
            onClick={onClose}
            style={{
              flex: 1, padding: "10px", borderRadius: "10px",
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "rgba(255,255,255,0.6)", fontSize: "14px", cursor: "pointer"
            }}
          >
            Annuler
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{
              flex: 1, padding: "10px", borderRadius: "10px", border: "none",
              background: loading ? "rgba(139,92,246,0.5)" : "linear-gradient(135deg, #8b5cf6, #6d28d9)",
              color: "#fff", fontSize: "14px", fontWeight: "600",
              cursor: loading ? "not-allowed" : "pointer",
              boxShadow: "0 0 12px rgba(139,92,246,0.3)"
            }}
          >
            {loading ? "Création..." : "Créer le produit"}
          </button>
        </div>

      </div>
    </div>
  )
}