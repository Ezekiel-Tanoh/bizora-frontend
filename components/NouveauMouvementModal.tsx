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

      await api.put(`/products/${productId}`, {
        stock: newStock,
      })

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

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md">

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Ajouter un mouvement</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-100 rounded-lg px-3 py-2 mb-4">
            <p className="text-xs text-red-500">{error}</p>
          </div>
        )}

        <div className="flex flex-col gap-4">

          <div>
            <label className="block text-sm text-gray-600 mb-1">Type de mouvement</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setType("entree")}
                className={`py-2 rounded-lg text-sm font-medium transition-colors ${
                  type === "entree"
                    ? "bg-green-500 text-white"
                    : "border border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}
              >
                ↑ Entrée stock
              </button>
              <button
                onClick={() => setType("sortie")}
                className={`py-2 rounded-lg text-sm font-medium transition-colors ${
                  type === "sortie"
                    ? "bg-red-500 text-white"
                    : "border border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}
              >
                ↓ Sortie stock
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Produit *</label>
            <select
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-violet-400 text-gray-600"
            >
              <option value="">Choisir un produit</option>
              {produits.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} (Stock actuel: {p.stock})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Quantité *</label>
            <input
              type="number"
              placeholder="Ex: 10"
              value={quantite}
              onChange={(e) => setQuantite(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-violet-400"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Raison</label>
            <select
              value={raison}
              onChange={(e) => setRaison(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-violet-400 text-gray-600"
            >
              <option value="">Choisir une raison</option>
              {type === "entree" ? (
                <>
                  <option value="Achat fournisseur">Achat fournisseur</option>
                  <option value="Retour client">Retour client</option>
                  <option value="Correction inventaire">Correction inventaire</option>
                </>
              ) : (
                <>
                  <option value="Vente">Vente</option>
                  <option value="Perte">Perte</option>
                  <option value="Correction inventaire">Correction inventaire</option>
                </>
              )}
            </select>
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
            className={`flex-1 text-white rounded-lg py-2 text-sm transition-colors disabled:opacity-50 ${
              type === "entree" ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600"
            }`}
          >
            {loading ? "Traitement..." : type === "entree" ? "↑ Ajouter au stock" : "↓ Retirer du stock"}
          </button>
        </div>

      </div>
    </div>
  )
}