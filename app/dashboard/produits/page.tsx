"use client"

import { useState, useEffect } from "react"
import api from "@/lib/api"
import NouveauProduitModal from "@/components/NouveauProduitModal"

export default function Produits() {
  const [produits, setProduits] = useState<any[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  const fetchProduits = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("bizora_user") || "{}")
      const response = await api.get(`/products/${user.id}`)
      setProduits(response.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProduits()
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer ce produit ?")) return
    try {
      await api.delete(`/products/${id}`)
      fetchProduits()
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div>
      <NouveauProduitModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchProduits}
      />

      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Produits</h1>
          <p className="text-sm text-gray-500 mt-1">Gérez votre catalogue de produits</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-violet-500 hover:bg-violet-600 text-white text-sm rounded-lg px-4 py-2 transition-colors"
        >
          + Ajouter un produit
        </button>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <p className="text-xs text-gray-500 mb-1">Total produits</p>
          <p className="text-2xl font-semibold text-gray-900">{produits.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <p className="text-xs text-gray-500 mb-1">En stock</p>
          <p className="text-2xl font-semibold text-green-500">
            {produits.filter(p => p.stock > 5).length}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <p className="text-xs text-gray-500 mb-1">Stock faible</p>
          <p className="text-2xl font-semibold text-orange-400">
            {produits.filter(p => p.stock > 0 && p.stock <= 5).length}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <p className="text-xs text-gray-500 mb-1">Rupture de stock</p>
          <p className="text-2xl font-semibold text-red-400">
            {produits.filter(p => p.stock === 0).length}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100">
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <input
            type="text"
            placeholder="🔍 Rechercher un produit..."
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-violet-400 w-64"
          />
          <select className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none text-gray-600">
            <option>Toutes les catégories</option>
            <option>Mode</option>
            <option>Alimentation</option>
            <option>Électronique</option>
            <option>Beauté</option>
          </select>
        </div>

        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left text-xs text-gray-500 font-medium p-4">Produit</th>
              <th className="text-left text-xs text-gray-500 font-medium p-4">Catégorie</th>
              <th className="text-left text-xs text-gray-500 font-medium p-4">Prix</th>
              <th className="text-left text-xs text-gray-500 font-medium p-4">Stock</th>
              <th className="text-left text-xs text-gray-500 font-medium p-4">Statut</th>
              <th className="text-left text-xs text-gray-500 font-medium p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="text-center py-16">
                  <p className="text-gray-400 text-sm">Chargement...</p>
                </td>
              </tr>
            ) : produits.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-16">
                  <p className="text-gray-400 text-sm">Aucun produit pour l'instant</p>
                  <p className="text-gray-300 text-xs mt-1">Cliquez sur "Ajouter un produit" pour commencer</p>
                </td>
              </tr>
            ) : (
              produits.map((produit) => (
                <tr key={produit.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="p-4">
                    <p className="text-sm font-medium text-gray-900">{produit.name}</p>
                    <p className="text-xs text-gray-400">{produit.description?.slice(0, 40)}...</p>
                  </td>
                  <td className="p-4">
                    <span className="text-xs bg-violet-50 text-violet-600 rounded-full px-2 py-1">
                      {produit.category || "Général"}
                    </span>
                  </td>
                  <td className="p-4">
                    <p className="text-sm font-medium text-gray-900">{produit.price.toLocaleString()} FCFA</p>
                  </td>
                  <td className="p-4">
                    <p className="text-sm text-gray-900">{produit.stock}</p>
                  </td>
                  <td className="p-4">
                    {produit.stock === 0 ? (
                      <span className="text-xs bg-red-50 text-red-500 rounded-full px-2 py-1">Rupture</span>
                    ) : produit.stock <= 5 ? (
                      <span className="text-xs bg-orange-50 text-orange-500 rounded-full px-2 py-1">Stock faible</span>
                    ) : (
                      <span className="text-xs bg-green-50 text-green-500 rounded-full px-2 py-1">En stock</span>
                    )}
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <button className="text-xs text-violet-500 hover:text-violet-600">Modifier</button>
                      <button
                        onClick={() => handleDelete(produit.id)}
                        className="text-xs text-red-400 hover:text-red-500"
                      >
                        Supprimer
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}