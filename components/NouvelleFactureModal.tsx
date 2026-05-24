"use client"

import { useState, useEffect } from "react"
import api from "@/lib/api"

interface Props {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export default function NouvelleFactureModal({ isOpen, onClose, onSuccess }: Props) {
  const [clients, setClients] = useState<any[]>([])
  const [produits, setProduits] = useState<any[]>([])
  const [clientId, setClientId] = useState("")
  const [items, setItems] = useState([{ productId: "", quantite: 1, prix: 0 }])
  const [taxes, setTaxes] = useState(0)
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

  const sousTotal = items.reduce((sum, item) => sum + item.prix * item.quantite, 0)
  const montantTaxes = (sousTotal * taxes) / 100
  const total = sousTotal + montantTaxes

  const handlePrint = () => {
    const client = clients.find(c => c.id === clientId)
    const user = JSON.parse(localStorage.getItem("bizora_user") || "{}")
    const date = new Date().toLocaleDateString("fr-FR")
    const numeroFacture = `FAC-${Date.now()}`

    const factureHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Facture ${numeroFacture}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 40px; color: #333; }
          .header { display: flex; justify-content: space-between; margin-bottom: 40px; }
          .logo { font-size: 28px; font-weight: bold; color: #7c3aed; }
          .info { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px; }
          .info-box { background: #f9fafb; padding: 15px; border-radius: 8px; }
          .info-box h3 { font-size: 12px; color: #9ca3af; margin-bottom: 8px; text-transform: uppercase; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
          th { background: #f3f4f6; padding: 10px; text-align: left; font-size: 12px; color: #6b7280; }
          td { padding: 12px 10px; border-bottom: 1px solid #f3f4f6; font-size: 14px; }
          .total-section { margin-left: auto; width: 300px; }
          .total-row { display: flex; justify-content: space-between; padding: 8px 0; font-size: 14px; }
          .total-final { display: flex; justify-content: space-between; padding: 12px 0; font-size: 18px; font-weight: bold; color: #7c3aed; border-top: 2px solid #7c3aed; }
          .footer { margin-top: 40px; text-align: center; color: #9ca3af; font-size: 12px; }
          .badge { background: #ede9fe; color: #7c3aed; padding: 4px 12px; border-radius: 20px; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <div class="logo">Bizora</div>
            <p style="color: #6b7280; font-size: 14px;">Vendez plus intelligemment</p>
          </div>
          <div style="text-align: right;">
            <div class="badge">Facture</div>
            <p style="font-size: 14px; margin-top: 8px;"><strong>${numeroFacture}</strong></p>
            <p style="color: #6b7280; font-size: 13px;">Date: ${date}</p>
          </div>
        </div>
        <div class="info">
          <div class="info-box">
            <h3>De</h3>
            <p><strong>${user.name}</strong></p>
            <p style="color: #6b7280; font-size: 13px;">${user.email}</p>
          </div>
          <div class="info-box">
            <h3>Pour</h3>
            <p><strong>${client?.name || "Client"}</strong></p>
            <p style="color: #6b7280; font-size: 13px;">${client?.phone || ""}</p>
            <p style="color: #6b7280; font-size: 13px;">${client?.email || ""}</p>
          </div>
        </div>
        <table>
          <thead>
            <tr>
              <th>Produit</th>
              <th>Prix unitaire</th>
              <th>Quantité</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            ${items.map(item => {
              const produit = produits.find(p => p.id === item.productId)
              return `
                <tr>
                  <td>${produit?.name || "-"}</td>
                  <td>${item.prix.toLocaleString()} FCFA</td>
                  <td>${item.quantite}</td>
                  <td>${(item.prix * item.quantite).toLocaleString()} FCFA</td>
                </tr>
              `
            }).join("")}
          </tbody>
        </table>
        <div class="total-section">
          <div class="total-row">
            <span style="color: #6b7280;">Sous-total</span>
            <span>${sousTotal.toLocaleString()} FCFA</span>
          </div>
          ${taxes > 0 ? `
          <div class="total-row">
            <span style="color: #6b7280;">Taxes (${taxes}%)</span>
            <span>${montantTaxes.toLocaleString()} FCFA</span>
          </div>
          ` : ""}
          <div class="total-final">
            <span>Total</span>
            <span>${total.toLocaleString()} FCFA</span>
          </div>
        </div>
        <div class="footer">
          <p>Merci pour votre confiance ! 💜</p>
          <p>Facture générée par Bizora — Vendez plus intelligemment</p>
        </div>
      </body>
      </html>
    `

    const printWindow = window.open("", "_blank")
    if (printWindow) {
      printWindow.document.write(factureHTML)
      printWindow.document.close()
      printWindow.print()
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
          <h2 style={{ fontSize: "1.1rem", fontWeight: "700", margin: 0 }}>Nouvelle facture</h2>
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
                style={{ fontSize: "12px", color: "#a78bfa", background: "none", border: "none", cursor: "pointer", padding: 0 }}
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
                  type="number" min="1" value={item.quantite}
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

          {/* Taxes */}
          <div>
            <label style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", display: "block", marginBottom: "6px" }}>
              Taxes (%)
            </label>
            <input
              type="number" min="0" max="100" placeholder="Ex: 18"
              value={taxes}
              onChange={(e) => setTaxes(parseFloat(e.target.value) || 0)}
              style={inputStyle}
              onFocus={e => (e.currentTarget.style.borderColor = "rgba(139,92,246,0.6)")}
              onBlur={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")}
            />
          </div>

          {/* Totaux */}
          <div style={{
            background: "rgba(139,92,246,0.08)",
            border: "1px solid rgba(139,92,246,0.2)",
            borderRadius: "12px", padding: "1rem"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
              <p style={{ fontSize: "13px", color: "#a78bfa", margin: 0 }}>Sous-total</p>
              <p style={{ fontSize: "13px", color: "#a78bfa", margin: 0 }}>{sousTotal.toLocaleString()} FCFA</p>
            </div>
            {taxes > 0 && (
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                <p style={{ fontSize: "13px", color: "#a78bfa", margin: 0 }}>Taxes ({taxes}%)</p>
                <p style={{ fontSize: "13px", color: "#a78bfa", margin: 0 }}>{montantTaxes.toLocaleString()} FCFA</p>
              </div>
            )}
            <div style={{
              display: "flex", justifyContent: "space-between",
              borderTop: "1px solid rgba(139,92,246,0.2)", paddingTop: "8px"
            }}>
              <p style={{ fontSize: "14px", fontWeight: "600", color: "#a78bfa", margin: 0 }}>Total</p>
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
            onClick={handlePrint}
            disabled={!clientId || items.some(i => !i.productId)}
            style={{
              flex: 1, padding: "10px", borderRadius: "10px", border: "none",
              background: (!clientId || items.some(i => !i.productId))
                ? "rgba(139,92,246,0.2)"
                : "linear-gradient(135deg, #8b5cf6, #6d28d9)",
              color: "#fff", fontSize: "14px", fontWeight: "600",
              cursor: (!clientId || items.some(i => !i.productId)) ? "not-allowed" : "pointer",
              opacity: (!clientId || items.some(i => !i.productId)) ? 0.5 : 1,
              boxShadow: "0 0 12px rgba(139,92,246,0.3)"
            }}
          >
            🖨️ Imprimer la facture
          </button>
        </div>

      </div>
    </div>
  )
}