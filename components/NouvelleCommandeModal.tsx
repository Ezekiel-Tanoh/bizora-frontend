"use client"

import { useState, useEffect } from "react"
import api from "@/lib/api"

interface Props {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export default function NouvelleCommandeModal({ isOpen, onClose, onSuccess }: Props) {
  const [clients, setClients] = useState<any[]>([])
  const [produits, setProduits] = useState<any[]>([])
  const [clientId, setClientId] = useState("")
  const [items, setItems] = useState([{ productId: "", quantite: 1, prix: 0 }])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("bizora_user") || "{}")
        const [clientsRes, produitsRes] = await Promise.all([
          api.get(`/customers/${user.storeId}`),
          api.get(`/products/${user.storeId}`),
        ])
        setClients(clientsRes.data)
        setProduits(produitsRes.data)
      } catch (err) {
        console.error(err)
      }
    }
    if (isOpen) fetchData()
  }, [isOpen])

  const handleAddItem = () => {
    setItems([...items, { productId: "", quantite: 1, prix: 0 }])
  }

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index))
  }

  const handleItemChange = (index: number, field: string, value: any) => {
    const newItems = [...items]
    if (field === "productId") {
      const produit = produits.find(p => p.id === value)
      newItems[index] = { ...newItems[index], productId: value, prix: produit ? produit.price : 0 }
    } else {
      newItems[index] = { ...newItems[index], [field]: value }
    }
    setItems(newItems)
  }

  const total = items.reduce((sum, item) => sum + item.prix * item.quantite, 0)

  const handleSubmit = async () => {
    if (!clientId || items.some(i => !i.productId)) {
      setError("Client et produits sont obligatoires")
      return
    }
    setLoading(true)
    setError("")
    try {
      const user = JSON.parse(localStorage.getItem("bizora_user") || "{}")
      await api.post("/orders", {
        storeId: user.storeId,
        customerId: clientId,
        total,
        items: items.map(i => ({
          productId: i.productId,
          quantity: i.quantite,
          price: i.prix,
        })),
      })
      onSuccess()
      onClose()
      setClientId("")
      setItems([{ productId: "", quantite: 1, prix: 0 }])
    } catch (err) {
      setError("Erreur lors de la création de la commande")
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
        width: "100%", maxWidth: "520px",
        maxHeight: "90vh", overflowY: "auto",
        boxShadow: "0 0 40px rgba(139,92,246,0.1)",
        fontFamily: "'Inter', sans-serif", color: "#fff"
      }}>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
          <h2 style={{ fontSize: "1.1rem", fontWeight: "700", margin: 0 }}>Nouvelle commande</h2>
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

          {/* Client */}
          <div>
            <label style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", display: "block", marginBottom: "6px" }}>
              Client <span style={{ color: "#a78bfa" }}>*</span>
            </label>
            <select
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
              style={{ ...inputStyle, cursor: "pointer" }}
              onFocus={e => (e.currentTarget.style.borderColor = "rgba(139,92,246,0.6)")}
              onBlur={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")}
            >
              <option value="" style={{ background: "#1a1a2e" }}>Choisir un client</option>
              {clients.map((c) => (
                <option key={c.id} value={c.id} style={{ background: "#1a1a2e" }}>
                  {c.name} - {c.phone}
                </option>
              ))}
            </select>
          </div>

          {/* Produits */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
              <label style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)" }}>
                Produits <span style={{ color: "#a78bfa" }}>*</span>
              </label>
              <button
                onClick={handleAddItem}
                style={{
                  fontSize: "12px", color: "#a78bfa", background: "none",
                  border: "none", cursor: "pointer", padding: 0
                }}
              >
                + Ajouter un produit
              </button>
            </div>

            {items.map((item, index) => (
              <div key={index} style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
                <select
                  value={item.productId}
                  onChange={(e) => handleItemChange(index, "productId", e.target.value)}
                  style={{ ...inputStyle, flex: 1, cursor: "pointer" }}
                  onFocus={e => (e.currentTarget.style.borderColor = "rgba(139,92,246,0.6)")}
                  onBlur={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")}
                >
                  <option value="" style={{ background: "#1a1a2e" }}>Choisir un produit</option>
                  {produits.map((p) => (
                    <option key={p.id} value={p.id} style={{ background: "#1a1a2e" }}>
                      {p.name} - {p.price.toLocaleString()} FCFA
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  min="1"
                  value={item.quantite}
                  onChange={(e) => handleItemChange(index, "quantite", parseInt(e.target.value))}
                  style={{ ...inputStyle, width: "70px" }}
                  onFocus={e => (e.currentTarget.style.borderColor = "rgba(139,92,246,0.6)")}
                  onBlur={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")}
                />
                {items.length > 1 && (
                  <button
                    onClick={() => handleRemoveItem(index)}
                    style={{
                      background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)",
                      borderRadius: "8px", color: "#f87171", cursor: "pointer",
                      padding: "0 10px", fontSize: "14px"
                    }}
                  >✕</button>
                )}
              </div>
            ))}
          </div>

          {/* Total */}
          <div style={{
            background: "rgba(139,92,246,0.08)",
            border: "1px solid rgba(139,92,246,0.2)",
            borderRadius: "12px", padding: "1rem"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <p style={{ fontSize: "13px", fontWeight: "500", color: "#a78bfa", margin: 0 }}>Total commande</p>
              <p style={{ fontSize: "1.2rem", fontWeight: "700", color: "#a78bfa", margin: 0 }}>
                {total.toLocaleString()} FCFA
              </p>
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
            {loading ? "Création..." : "Créer la commande"}
          </button>
        </div>

      </div>
    </div>
  )
}