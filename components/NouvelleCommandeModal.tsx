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

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-lg max-h-screen overflow-y-auto">

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Nouvelle commande</h2>
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

          <div className="bg-violet-50 rounded-xl p-4">
            <div className="flex justify-between items-center">
              <p className="text-sm font-medium text-violet-700">Total commande</p>
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
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 bg-violet-500 hover:bg-violet-600 text-white rounded-lg py-2 text-sm transition-colors disabled:opacity-50"
          >
            {loading ? "Création..." : "Créer la commande"}
          </button>
        </div>

      </div>
    </div>
  )
}