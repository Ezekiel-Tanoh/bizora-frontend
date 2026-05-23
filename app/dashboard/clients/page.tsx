"use client"

import { useState, useEffect } from "react"
import api from "@/lib/api"
import NouveauClientModal from "@/components/NouveauClientModal"

export default function Clients() {
  const [clients, setClients] = useState<any[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  const fetchClients = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("bizora_user") || "{}")
      const response = await api.get(`/customers/${user.storeId}`)
      setClients(response.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchClients()
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer ce client ?")) return
    try {
      await api.delete(`/customers/${id}`)
      fetchClients()
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div>
      <NouveauClientModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchClients}
      />

      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Clients</h1>
          <p className="text-sm text-gray-500 mt-1">Gérez votre base de clients</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-violet-500 hover:bg-violet-600 text-white text-sm rounded-lg px-4 py-2 transition-colors"
        >
          + Ajouter un client
        </button>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <p className="text-xs text-gray-500 mb-1">Total clients</p>
          <p className="text-2xl font-semibold text-gray-900">{clients.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <p className="text-xs text-gray-500 mb-1">Nouveaux ce mois</p>
          <p className="text-2xl font-semibold text-violet-500">
            {clients.filter(c => new Date(c.createdAt).getMonth() === new Date().getMonth()).length}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <p className="text-xs text-gray-500 mb-1">Clients fidèles</p>
          <p className="text-2xl font-semibold text-green-500">0</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <p className="text-xs text-gray-500 mb-1">Panier moyen</p>
          <p className="text-2xl font-semibold text-gray-900">0 FCFA</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100">
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <input
            type="text"
            placeholder="🔍 Rechercher un client..."
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-violet-400 w-64"
          />
          <select className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none text-gray-600">
            <option>Tous les clients</option>
            <option>Nouveaux clients</option>
            <option>Clients fidèles</option>
          </select>
        </div>

        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left text-xs text-gray-500 font-medium p-4">Client</th>
              <th className="text-left text-xs text-gray-500 font-medium p-4">Téléphone</th>
              <th className="text-left text-xs text-gray-500 font-medium p-4">Email</th>
              <th className="text-left text-xs text-gray-500 font-medium p-4">Depuis</th>
              <th className="text-left text-xs text-gray-500 font-medium p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="text-center py-16">
                  <p className="text-gray-400 text-sm">Chargement...</p>
                </td>
              </tr>
            ) : clients.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-16">
                  <p className="text-gray-400 text-sm">Aucun client pour l'instant</p>
                  <p className="text-gray-300 text-xs mt-1">Cliquez sur "Ajouter un client" pour commencer</p>
                </td>
              </tr>
            ) : (
              clients.map((client) => (
                <tr key={client.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-violet-100 rounded-full flex items-center justify-center">
                        <span className="text-violet-600 text-xs font-medium">
                          {client.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <p className="text-sm font-medium text-gray-900">{client.name}</p>
                    </div>
                  </td>
                  <td className="p-4">
                    <p className="text-sm text-gray-600">{client.phone}</p>
                  </td>
                  <td className="p-4">
                    <p className="text-sm text-gray-600">{client.email || "-"}</p>
                  </td>
                  <td className="p-4">
                    <p className="text-sm text-gray-400">
                      {new Date(client.createdAt).toLocaleDateString("fr-FR")}
                    </p>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <button className="text-xs text-violet-500 hover:text-violet-600">Modifier</button>
                      <button
                        onClick={() => handleDelete(client.id)}
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