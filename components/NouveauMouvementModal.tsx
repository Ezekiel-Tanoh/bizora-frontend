"use client"

import { useState, useEffect } from "react"
import api from "@/lib/api"

interface Props {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export default function NouveauMouvementModal({ isOpen, onClose, onSuccess }: Props) {
  const [produits, setProduits] = useState<any[]>([])
  const [productId, setProductId] = useState("")
  const [type, setType] = useState("entree")
  const [quantite, setQuantite] = useState("")
  const [raison, setRaison] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchProduits = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("bizora_user") || "{}")
        const response = await api.get(`/products/${user.storeId}`)
        setProduits(response.data)
      } catch (err) {
        console.error(err)
      }
    }
    if (isOpen) fetchProduits()
  }, [isOpen])

  const handleSubmit = async () => {
    if (!productId || !quantite) {
      setError("Produit et quantité sont obligatoires")
      return
    }
    setLoading(true)
    setError("")
    try {
      const produit = produits.find(p => p.id === productId)
      const newStock = type === "entree"
        ? produit.stock + parseInt(quantite)
        : produit.stock - parseInt(quantite)

      if (newStock < 0) {
        setError("Stock insuffisant pour cette sortie")
        setLoading(false)
        return
      }

      await api.put(`/products/${productId}`, { stock: newStock })
      onSuccess()
      onClose()
      setProductId("")
      setQuantite("")
      setRaison("")
      setType("entree")
    } catch (err) {
      setError("Erreur lors du mouvement de stock")
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
        width: "100%", maxWidth: "440px",
        boxShadow: "0 0 40px rgba(139,92,246,0.1)",
        fontFamily: "'Inter', sans-serif", color: "#fff"
      }}>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
          <h2 style={{ fontSize: "1.1rem", fontWeight: "700", margin: 0 }}>Ajouter un mouvement</h2>
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

          {/* Type mouvement */}
          <div>
            <label style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", display: "block", marginBottom: "8px" }}>
              Type de mouvement
            </label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
              <button
                onClick={() => setType("entree")}
                style={{
                  padding: "10px", borderRadius: "10px",
                  fontSize: "13px", fontWeight: "500", cursor: "pointer",
                  background: type === "entree" ? "rgba(52,211,153,0.15)" : "rgba(255,255,255,0.05)",
                  color: type === "entree" ? "#34d399" : "rgba(255,255,255,0.4)",
                  border: type === "entree" ? "1px solid rgba(52,211,153,0.3)" : "1px solid rgba(255,255,255,0.1)" as any,
                  transition: "all 0.2s"
                }}
              >
                ↑ Entrée stock
              </button>
              <button
                onClick={() => setType("sortie")}
                style={{
                  padding: "10px", borderRadius: "10px",
                  fontSize: "13px", fontWeight: "500", cursor: "pointer",
                  background: type === "sortie" ? "rgba(239,68,68,0.15)" : "rgba(255,255,255,0.05)",
                  color: type === "sortie" ? "#f87171" : "rgba(255,255,255,0.4)",
                  border: type === "sortie" ? "1px solid rgba(239,68,68,0.3)" : "1px solid rgba(255,255,255,0.1)" as any,
                  transition: "all 0.2s"
                }}
              >
                ↓ Sortie stock
              </button>
            </div>
          </div>

          {/* Produit */}
          <div>
            <label style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", display: "block", marginBottom: "6px" }}>
              Produit <span style={{ color: "#a78bfa" }}>*</span>
            </label>
            <select
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
              style={{ ...inputStyle, cursor: "pointer" }}
              onFocus={e => (e.currentTarget.style.borderColor = "rgba(139,92,246,0.6)")}
              onBlur={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")}
            >
              <option value="" style={{ background: "#1a1a2e" }}>Choisir un produit</option>
              {produits.map((p) => (
                <option key={p.id} value={p.id} style={{ background: "#1a1a2e" }}>
                  {p.name} (Stock actuel: {p.stock})
                </option>
              ))}
            </select>
          </div>

          {/* Quantité */}
          <div>
            <label style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", display: "block", marginBottom: "6px" }}>
              Quantité <span style={{ color: "#a78bfa" }}>*</span>
            </label>
            <input
              type="number"
              placeholder="Ex: 10"
              value={quantite}
              onChange={(e) => setQuantite(e.target.value)}
              style={inputStyle}
              onFocus={e => (e.currentTarget.style.borderColor = "rgba(139,92,246,0.6)")}
              onBlur={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")}
            />
          </div>

          {/* Raison */}
          <div>
            <label style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", display: "block", marginBottom: "6px" }}>
              Raison
            </label>
            <select
              value={raison}
              onChange={(e) => setRaison(e.target.value)}
              style={{ ...inputStyle, cursor: "pointer" }}
              onFocus={e => (e.currentTarget.style.borderColor = "rgba(139,92,246,0.6)")}
              onBlur={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")}
            >
              <option value="" style={{ background: "#1a1a2e" }}>Choisir une raison</option>
              {type === "entree" ? (
                <>
                  <option value="Achat fournisseur" style={{ background: "#1a1a2e" }}>Achat fournisseur</option>
                  <option value="Retour client" style={{ background: "#1a1a2e" }}>Retour client</option>
                  <option value="Correction inventaire" style={{ background: "#1a1a2e" }}>Correction inventaire</option>
                </>
              ) : (
                <>
                  <option value="Vente" style={{ background: "#1a1a2e" }}>Vente</option>
                  <option value="Perte" style={{ background: "#1a1a2e" }}>Perte</option>
                  <option value="Correction inventaire" style={{ background: "#1a1a2e" }}>Correction inventaire</option>
                </>
              )}
            </select>
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
              flex: 1, padding: "10px", borderRadius: "10px",
              background: loading
                ? "rgba(139,92,246,0.4)"
                : type === "entree"
                  ? "rgba(52,211,153,0.2)"
                  : "rgba(239,68,68,0.2)",
              color: type === "entree" ? "#34d399" : "#f87171",
              border: type === "entree"
                ? "1px solid rgba(52,211,153,0.3)"
                : "1px solid rgba(239,68,68,0.3)" as any,
              fontSize: "14px", fontWeight: "600",
              cursor: loading ? "not-allowed" : "pointer",
              transition: "all 0.2s"
            }}
          >
            {loading ? "Traitement..." : type === "entree" ? "↑ Ajouter au stock" : "↓ Retirer du stock"}
          </button>
        </div>

      </div>
    </div>
  )
}