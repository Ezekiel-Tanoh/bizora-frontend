"use client"

import { useState } from "react"

interface Props {
  isOpen: boolean
  onClose: () => void
  montant?: number
}

export default function PaiementModal({ isOpen, onClose, montant = 0 }: Props) {
  const [methode, setMethode] = useState("")
  const [telephone, setTelephone] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  const methodes = [
    {
      id: "orange",
      nom: "Orange Money",
      couleur: "bg-orange-500",
      textColor: "text-orange-500",
      borderColor: "border-orange-500",
      bgLight: "bg-orange-50",
      emoji: "🟠",
      prefix: "+225 07",
    },
    {
      id: "wave",
      nom: "Wave",
      couleur: "bg-blue-500",
      textColor: "text-blue-500",
      borderColor: "border-blue-500",
      bgLight: "bg-blue-50",
      emoji: "🔵",
      prefix: "+225 01",
    },
    {
      id: "mtn",
      nom: "MTN Money",
      couleur: "bg-yellow-400",
      textColor: "text-yellow-600",
      borderColor: "border-yellow-400",
      bgLight: "bg-yellow-50",
      emoji: "🟡",
      prefix: "+225 05",
    },
    {
      id: "moov",
      nom: "Moov Money",
      couleur: "bg-blue-700",
      textColor: "text-blue-700",
      borderColor: "border-blue-700",
      bgLight: "bg-blue-50",
      emoji: "🔷",
      prefix: "+225 01",
    },
  ]

  const handlePayer = async () => {
    if (!methode) {
      setError("Choisissez un moyen de paiement")
      return
    }
    if (!telephone || telephone.length < 8) {
      setError("Entrez un numéro de téléphone valide")
      return
    }
    setLoading(true)
    setError("")

    await new Promise(resolve => setTimeout(resolve, 2000))

    setLoading(false)
    setSuccess(true)
  }

  const handleClose = () => {
    setMethode("")
    setTelephone("")
    setSuccess(false)
    setError("")
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md">

        {success ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">✅</span>
            </div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Paiement initié !</h2>
            <p className="text-sm text-gray-500 mb-2">
              Une demande de paiement a été envoyée au numéro
            </p>
            <p className="text-sm font-semibold text-gray-900 mb-4">{telephone}</p>
            <p className="text-xs text-gray-400 mb-6">
              Veuillez confirmer le paiement sur votre téléphone
            </p>
            <div className="bg-violet-50 rounded-xl p-4 mb-6">
              <p className="text-sm text-violet-700 font-medium">
                Montant : {montant.toLocaleString()} FCFA
              </p>
              <p className="text-xs text-violet-500 mt-1">
                via {methodes.find(m => m.id === methode)?.nom}
              </p>
            </div>
            <button
              onClick={handleClose}
              className="w-full bg-violet-500 hover:bg-violet-600 text-white rounded-lg py-2.5 text-sm font-medium transition-colors"
            >
              Fermer
            </button>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Paiement Mobile Money</h2>
              <button onClick={handleClose} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
            </div>

            {montant > 0 && (
              <div className="bg-violet-50 rounded-xl p-4 mb-6">
                <p className="text-xs text-violet-600 mb-1">Montant à payer</p>
                <p className="text-2xl font-semibold text-violet-700">{montant.toLocaleString()} FCFA</p>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-100 rounded-lg px-3 py-2 mb-4">
                <p className="text-xs text-red-500">{error}</p>
              </div>
            )}

            <div className="mb-4">
              <label className="block text-sm text-gray-600 mb-3">Choisir le moyen de paiement</label>
              <div className="grid grid-cols-2 gap-3">
                {methodes.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setMethode(m.id)}
                    className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all ${
                      methode === m.id
                        ? `${m.borderColor} ${m.bgLight}`
                        : "border-gray-100 hover:border-gray-200"
                    }`}
                  >
                    <span className="text-2xl">{m.emoji}</span>
                    <div className="text-left">
                      <p className={`text-xs font-semibold ${methode === m.id ? m.textColor : "text-gray-700"}`}>
                        {m.nom}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm text-gray-600 mb-1">Numéro de téléphone</label>
              <input
                type="tel"
                placeholder="Ex: 07 00 00 00 00"
                value={telephone}
                onChange={(e) => setTelephone(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-violet-400"
              />
              <p className="text-xs text-gray-400 mt-1">
                Le client recevra une notification sur ce numéro
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleClose}
                className="flex-1 border border-gray-200 text-gray-600 rounded-lg py-2 text-sm hover:bg-gray-50 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handlePayer}
                disabled={loading}
                className="flex-1 bg-violet-500 hover:bg-violet-600 text-white rounded-lg py-2 text-sm font-medium transition-colors disabled:opacity-50"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="animate-spin">⏳</span> Traitement...
                  </span>
                ) : (
                  "💳 Payer maintenant"
                )}
              </button>
            </div>
          </>
        )}

      </div>
    </div>
  )
}