"use client"

import { useState, useEffect } from "react"
import api from "@/lib/api"
import NouveauMouvementModal from "@/components/NouveauMouvementModal"

export default function Stock() {
  const [produits, setProduits] = useState<any[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [loading, setLoading] = useState(true)

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

  useEffect(() => {
    fetchProduits()
  }, [])

  return (
    <div>
      <NouveauMouvementModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchProduits}
      />

      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Stock</h1>
          <p className="text-sm text-gray-500 mt-1">Gérez votre inventaire</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-violet-500 hover:bg-violet-600 text-white text-sm rounded-lg px-4 py-2 transition-colors"
        >
          + Ajouter un mouvement
        </button>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <p className="text-xs text-gray-500 mb-1">Total articles</p>
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
          <p className="text-xs text-gray-500 mb-1">Rupture</p>
          <p className="text-2xl font-semibold text-red-400">
            {produits.filter(p => p.stock === 0).length}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-6">
        <div className="bg-orange-50 rounded-xl border border-orange-100 p-5">
          <h2 className="text-sm font-semibold text-orange-700 mb-3">⚠️ Stock faible</h2>
          {produits.filter(p => p.stock > 0 && p.stock <= 5).length === 0 ? (
            <p className="text-orange-400 text-sm text-center py-4">Aucune alerte</p>
          ) : (
            produits.filter(p => p.stock > 0 && p.stock <= 5).map(p => (
              <div key={p.id} className="flex justify-between items-center py-2 border-b border-orange-100">
                <p className="text-sm text-orange-700">{p.name}</p>
                <span className="text-xs bg-orange-100 text-orange-600 rounded-full px-2 py-1">{p.stock} restants</span>
              </div>
            ))
          )}
        </div>

        <div className="bg-red-50 rounded-xl border border-red-100 p-5">
          <h2 className="text-sm font-semibold text-red-700 mb-3">🚨 Ruptures de stock</h2>
          {produits.filter(p => p.stock === 0).length === 0 ? (
            <p className="text-red-400 text-sm text-center py-4">Aucune rupture</p>
          ) : (
            produits.filter(p => p.stock === 0).map(p => (
              <div key={p.id} className="flex justify-between items-center py-2 border-b border-red-100">
                <p className="text-sm text-red-700">{p.name}</p>
                <span className="text-xs bg-red-100 text-red-600 rounded-full px-2 py-1">Rupture</span>
              </div>
            ))
          )}
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
            <option>Tous les statuts</option>
            <option>En stock</option>
            <option>Stock faible</option>
            <option>Rupture</option>
          </select>
        </div>

        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left text-xs text-gray-500 font-medium p-4">Produit</th>
              <th className="text-left text-xs text-gray-500 font-medium p-4">Catégorie</th>
              <th className="text-left text-xs text-gray-500 font-medium p-4">Stock actuel</th>
              <th className="text-left text-xs text-gray-500 font-medium p-4">Statut</th>
              <th className="text-left text-xs text-gray-500 font-medium p-4">Prix</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="text-center py-16">
                  <p className="text-gray-400 text-sm">Chargement...</p>
                </td>
              </tr>
            ) : produits.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-16">
                  <p className="text-gray-400 text-sm">Aucun article en stock</p>
                  <p className="text-gray-300 text-xs mt-1">Ajoutez des produits pour gérer votre stock</p>
                </td>
              </tr>
            ) : (
              produits.map((produit) => (
                <tr key={produit.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="p-4">
                    <p className="text-sm font-medium text-gray-900">{produit.name}</p>
                  </td>
                  <td className="p-4">
                    <span className="text-xs bg-violet-50 text-violet-600 rounded-full px-2 py-1">
                      {produit.category || "Général"}
                    </span>
                  </td>
                  <td className="p-4">
                    <p className="text-sm font-semibold text-gray-900">{produit.stock}</p>
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
                    <p className="text-sm text-gray-600">{produit.price.toLocaleString()} FCFA</p>
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