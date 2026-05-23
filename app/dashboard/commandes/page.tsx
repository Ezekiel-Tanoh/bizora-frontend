"use client"

import { useState, useEffect } from "react"
import api from "@/lib/api"
import NouvelleCommandeModal from "@/components/NouvelleCommandeModal"
import PaiementModal from "@/components/PaiementModal"

export default function Commandes() {
  const [commandes, setCommandes] = useState<any[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isPaiementOpen, setIsPaiementOpen] = useState(false)
  const [montantPaiement, setMontantPaiement] = useState(0)
  const [loading, setLoading] = useState(true)

  const fetchCommandes = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("bizora_user") || "{}")
      const response = await api.get(`/orders/${user.storeId}`)
      setCommandes(response.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCommandes()
  }, [])

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      await api.put(`/orders/${id}/status`, { status })
      fetchCommandes()
    } catch (err) {
      console.error(err)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-orange-50 text-orange-500"
      case "confirmed": return "bg-blue-50 text-blue-500"
      case "shipped": return "bg-violet-50 text-violet-500"
      case "delivered": return "bg-green-50 text-green-500"
      case "cancelled": return "bg-red-50 text-red-500"
      default: return "bg-gray-50 text-gray-500"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "pending": return "En attente"
      case "confirmed": return "Confirmé"
      case "shipped": return "Expédié"
      case "delivered": return "Livré"
      case "cancelled": return "Annulé"
      default: return status
    }
  }

  return (
    <div>
      <NouvelleCommandeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchCommandes}
      />

      <PaiementModal
        isOpen={isPaiementOpen}
        onClose={() => setIsPaiementOpen(false)}
        montant={montantPaiement}
      />

      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Commandes</h1>
          <p className="text-sm text-gray-500 mt-1">Gérez toutes vos commandes</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-violet-500 hover:bg-violet-600 text-white text-sm rounded-lg px-4 py-2 transition-colors"
        >
          + Nouvelle commande
        </button>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <p className="text-xs text-gray-500 mb-1">Total commandes</p>
          <p className="text-2xl font-semibold text-gray-900">{commandes.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <p className="text-xs text-gray-500 mb-1">En attente</p>
          <p className="text-2xl font-semibold text-orange-400">
            {commandes.filter(c => c.status === "pending").length}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <p className="text-xs text-gray-500 mb-1">Livrées</p>
          <p className="text-2xl font-semibold text-green-500">
            {commandes.filter(c => c.status === "delivered").length}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <p className="text-xs text-gray-500 mb-1">Chiffre d'affaires</p>
          <p className="text-2xl font-semibold text-violet-500">
            {commandes.reduce((sum, c) => sum + c.total, 0).toLocaleString()} FCFA
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100">
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <input
            type="text"
            placeholder="🔍 Rechercher une commande..."
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-violet-400 w-64"
          />
          <select className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none text-gray-600">
            <option>Tous les statuts</option>
            <option>En attente</option>
            <option>Confirmé</option>
            <option>Expédié</option>
            <option>Livré</option>
            <option>Annulé</option>
          </select>
        </div>

        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left text-xs text-gray-500 font-medium p-4">Client</th>
              <th className="text-left text-xs text-gray-500 font-medium p-4">Produits</th>
              <th className="text-left text-xs text-gray-500 font-medium p-4">Total</th>
              <th className="text-left text-xs text-gray-500 font-medium p-4">Statut</th>
              <th className="text-left text-xs text-gray-500 font-medium p-4">Date</th>
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
            ) : commandes.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-16">
                  <p className="text-gray-400 text-sm">Aucune commande pour l'instant</p>
                  <p className="text-gray-300 text-xs mt-1">Cliquez sur "Nouvelle commande" pour commencer</p>
                </td>
              </tr>
            ) : (
              commandes.map((commande) => (
                <tr key={commande.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="p-4">
                    <p className="text-sm font-medium text-gray-900">{commande.customer?.name}</p>
                    <p className="text-xs text-gray-400">{commande.customer?.phone}</p>
                  </td>
                  <td className="p-4">
                    <p className="text-sm text-gray-600">{commande.items?.length} article(s)</p>
                  </td>
                  <td className="p-4">
                    <p className="text-sm font-medium text-gray-900">{commande.total.toLocaleString()} FCFA</p>
                  </td>
                  <td className="p-4">
                    <span className={`text-xs rounded-full px-2 py-1 ${getStatusColor(commande.status)}`}>
                      {getStatusLabel(commande.status)}
                    </span>
                  </td>
                  <td className="p-4">
                    <p className="text-xs text-gray-400">
                      {new Date(commande.createdAt).toLocaleDateString("fr-FR")}
                    </p>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <select
                        value={commande.status}
                        onChange={(e) => handleUpdateStatus(commande.id, e.target.value)}
                        className="border border-gray-200 rounded-lg px-2 py-1 text-xs outline-none text-gray-600"
                      >
                        <option value="pending">En attente</option>
                        <option value="confirmed">Confirmé</option>
                        <option value="shipped">Expédié</option>
                        <option value="delivered">Livré</option>
                        <option value="cancelled">Annulé</option>
                      </select>
                      <button
                        onClick={() => {
                          setMontantPaiement(commande.total)
                          setIsPaiementOpen(true)
                        }}
                        className="text-xs bg-violet-50 text-violet-600 hover:bg-violet-100 rounded-lg px-2 py-1 transition-colors"
                      >
                        💳 Payer
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