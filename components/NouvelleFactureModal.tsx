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
      newItems[index] = {
        ...newItems[index],
        productId: value,
        prix: produit ? produit.price : 0,
      }
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
          .title { font-size: 24px; font-weight: bold; color: #333; margin-bottom: 20px; }
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
            <p style="color: #6b7280; font-size: 14px;">Le commerce intelligent</p>
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
          <p>Facture générée par Bizora — Le commerce intelligent</p>
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

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-lg max-h-screen overflow-y-auto">

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Nouvelle facture</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-100 rounded-lg px-3 py-2 mb-4">
            <p className="text-xs text-red-500">{error}</p>
          </div>
        )}

        <div className="flex flex-col gap-4">

          <div>
            <label className="block text-sm text-gray-600 mb-1">Client *</label>
            <select
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-violet-400 text-gray-600"
            >
              <option value="">Choisir un client</option>
              {clients.map((c) => (
                <option key={c.id} value={c.id}>{c.name} - {c.phone}</option>
              ))}
            </select>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm text-gray-600">Produits *</label>
              <button
                onClick={handleAddItem}
                className="text-xs text-violet-500 hover:text-violet-600"
              >
                + Ajouter un produit
              </button>
            </div>

            {items.map((item, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <select
                  value={item.productId}
                  onChange={(e) => handleItemChange(index, "productId", e.target.value)}
                  className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-violet-400 text-gray-600"
                >
                  <option value="">Choisir un produit</option>
                  {produits.map((p) => (
                    <option key={p.id} value={p.id}>{p.name} - {p.price.toLocaleString()} FCFA</option>
                  ))}
                </select>
                <input
                  type="number"
                  min="1"
                  value={item.quantite}
                  onChange={(e) => handleItemChange(index, "quantite", parseInt(e.target.value))}
                  className="w-16 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-violet-400"
                />
                {items.length > 1 && (
                  <button
                    onClick={() => handleRemoveItem(index)}
                    className="text-red-400 hover:text-red-500 text-sm"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Taxes (%)</label>
            <input
              type="number"
              min="0"
              max="100"
              placeholder="Ex: 18"
              value={taxes}
              onChange={(e) => setTaxes(parseFloat(e.target.value) || 0)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-violet-400"
            />
          </div>

          <div className="bg-violet-50 rounded-xl p-4">
            <div className="flex justify-between items-center mb-2">
              <p className="text-sm text-violet-600">Sous-total</p>
              <p className="text-sm text-violet-600">{sousTotal.toLocaleString()} FCFA</p>
            </div>
            {taxes > 0 && (
              <div className="flex justify-between items-center mb-2">
                <p className="text-sm text-violet-600">Taxes ({taxes}%)</p>
                <p className="text-sm text-violet-600">{montantTaxes.toLocaleString()} FCFA</p>
              </div>
            )}
            <div className="flex justify-between items-center border-t border-violet-200 pt-2">
              <p className="text-sm font-semibold text-violet-700">Total</p>
              <p className="text-lg font-semibold text-violet-700">{total.toLocaleString()} FCFA</p>
            </div>
          </div>

        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 border border-gray-200 text-gray-600 rounded-lg py-2 text-sm hover:bg-gray-50 transition-colors"
          >
            Annuler
          </button>
          <button
            onClick={handlePrint}
            disabled={!clientId || items.some(i => !i.productId)}
            className="flex-1 border border-violet-200 text-violet-600 rounded-lg py-2 text-sm hover:bg-violet-50 transition-colors disabled:opacity-50"
          >
            🖨️ Imprimer
          </button>
        </div>

      </div>
    </div>
  )
}