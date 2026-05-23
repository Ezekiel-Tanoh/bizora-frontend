"use client"

import { useState } from "react"
import api from "@/lib/api"

interface Props {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export default function NouveauClientModal({ isOpen, onClose, onSuccess }: Props) {
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async () => {
    if (!name || !phone) {
      setError("Nom et téléphone sont obligatoires")
      return
    }
    setLoading(true)
    setError("")
    try {
      const user = JSON.parse(localStorage.getItem("bizora_user") || "{}")
      await api.post("/customers", {
        storeId: user.storeId,
        name,
        phone,
        email,
      })
      onSuccess()
      onClose()
      setName("")
      setPhone("")
      setEmail("")
    } catch (err) {
      setError("Erreur lors de la création du client")
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md">

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Nouveau client</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-100 rounded-lg px-3 py-2 mb-4">
            <p className="text-xs text-red-500">{error}</p>
          </div>
        )}

        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Nom complet *</label>
            <input
              type="text"
              placeholder="Ex: Kouassi Jean"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-violet-400"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Téléphone *</label>
            <input
              type="text"
              placeholder="Ex: +225 07 00 00 00 00"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-violet-400"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Email</label>
            <input
              type="email"
              placeholder="client@exemple.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-violet-400"
            />
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
            {loading ? "Création..." : "Ajouter le client"}
          </button>
        </div>

      </div>
    </div>
  )
}