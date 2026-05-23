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
        name,
        description,
        price: parseFloat(price),
        stock: parseInt(stock),
        category,
      })
      onSuccess()
      onClose()
      setName("")
      setDescription("")
      setPrice("")
      setStock("")
      setCategory("")
    } catch (err) {
      setError("Erreur lors de la création du produit")
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md">

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Nouveau produit</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-100 rounded-lg px-3 py-2 mb-4">
            <p className="text-xs text-red-500">{error}</p>
          </div>
        )}

        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Nom du produit *</label>
            <input
              type="text"
              placeholder="Ex: Robe en wax"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-violet-400"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Catégorie</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-violet-400 text-gray-600"
            >
              <option value="">Choisir une catégorie</option>
              <option value="Mode">Mode</option>
              <option value="Alimentation">Alimentation</option>
              <option value="Électronique">Électronique</option>
              <option value="Beauté">Beauté</option>
              <option value="Maison">Maison</option>
              <option value="Autre">Autre</option>
            </select>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm text-gray-600">Description</label>
              <button
                onClick={handleGenerateDescription}
                disabled={aiLoading || !name}
                className="text-xs text-violet-500 hover:text-violet-600 disabled:opacity-50"
              >
                {aiLoading ? "Génération..." : "🤖 Générer avec IA"}
              </button>
            </div>
            <textarea
              placeholder="Description du produit..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-violet-400 resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Prix (FCFA) *</label>
              <input
                type="number"
                placeholder="Ex: 15000"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-violet-400"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Stock *</label>
              <input
                type="number"
                placeholder="Ex: 10"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-violet-400"
              />
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
            {loading ? "Création..." : "Créer le produit"}
          </button>
        </div>

      </div>
    </div>
  )
}