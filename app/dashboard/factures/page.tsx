"use client"

import { useState } from "react"
import NouvelleFactureModal from "@/components/NouvelleFactureModal"

export default function Factures() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <div>
      <NouvelleFactureModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => {}}
      />

      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Factures</h1>
          <p className="text-sm text-gray-500 mt-1">Gérez vos factures et devis</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-violet-500 hover:bg-violet-600 text-white text-sm rounded-lg px-4 py-2 transition-colors"
        >
          + Nouvelle facture
        </button>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <p className="text-xs text-gray-500 mb-1">Total factures</p>
          <p className="text-2xl font-semibold text-gray-900">0</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <p className="text-xs text-gray-500 mb-1">Payées</p>
          <p className="text-2xl font-semibold text-green-500">0</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <p className="text-xs text-gray-500 mb-1">En attente</p>
          <p className="text-2xl font-semibold text-orange-400">0</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <p className="text-xs text-gray-500 mb-1">Montant total</p>
          <p className="text-2xl font-semibold text-violet-500">0 FCFA</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-8 text-center">
        <p className="text-4xl mb-4">🧾</p>
        <p className="text-gray-400 text-sm">Créez votre première facture</p>
        <p className="text-gray-300 text-xs mt-1 mb-4">Les factures sont générées en PDF automatiquement</p>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-violet-500 hover:bg-violet-600 text-white text-sm rounded-lg px-6 py-2 transition-colors"
        >
          + Nouvelle facture
        </button>
      </div>
    </div>
  )
}