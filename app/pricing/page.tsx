"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

const plans = [
  {
    id: "gratuit",
    nom: "Gratuit",
    prix_mensuel: 0,
    prix_annuel: 0,
    couleur: "rgba(255,255,255,0.1)",
    glow: "none",
    badge: null,
    features: [
      { texte: "20 produits maximum", inclus: true },
      { texte: "50 clients maximum", inclus: true },
      { texte: "10 factures/mois", inclus: true },
      { texte: "IA basique", inclus: true },
      { texte: "Gestion des commandes", inclus: true },
      { texte: "Gestion du stock", inclus: true },
      { texte: "Produits illimités", inclus: false },
      { texte: "IA complète", inclus: false },
      { texte: "Support email", inclus: false },
      { texte: "Multi-boutiques", inclus: false },
    ]
  },
  {
    id: "pro",
    nom: "Pro",
    prix_mensuel: 5000,
    prix_annuel: 50000,
    couleur: "#8b5cf6",
    glow: "0 0 40px rgba(139,92,246,0.3)",
    badge: "⭐ Populaire",
    features: [
      { texte: "Produits illimités", inclus: true },
      { texte: "Clients illimités", inclus: true },
      { texte: "Factures illimitées", inclus: true },
      { texte: "IA complète", inclus: true },
      { texte: "Gestion des commandes", inclus: true },
      { texte: "Gestion du stock", inclus: true },
      { texte: "Support email", inclus: true },
      { texte: "Analytics avancés", inclus: true },
      { texte: "Export PDF", inclus: true },
      { texte: "Multi-boutiques", inclus: false },
    ]
  },
  {
    id: "business",
    nom: "Business",
    prix_mensuel: 15000,
    prix_annuel: 150000,
    couleur: "#f59e0b",
    glow: "0 0 40px rgba(245,158,11,0.2)",
    badge: "👑 Premium",
    features: [
      { texte: "Produits illimités", inclus: true },
      { texte: "Clients illimités", inclus: true },
      { texte: "Factures illimitées", inclus: true },
      { texte: "IA avancée + prédictions", inclus: true },
      { texte: "Gestion des commandes", inclus: true },
      { texte: "Gestion du stock", inclus: true },
      { texte: "Support prioritaire 24/7", inclus: true },
      { texte: "Analytics avancés", inclus: true },
      { texte: "Export PDF", inclus: true },
      { texte: "Multi-boutiques (5 max)", inclus: true },
    ]
  }
]

export default function Pricing() {
  const router = useRouter()

  const [annuel, setAnnuel] = useState(false)
  const [planChoisi, setPlanChoisi] = useState<string | null>(null)
  const [showPaiement, setShowPaiement] = useState(false)
  const [methode, setMethode] = useState("")
  const [telephone, setTelephone] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  const methodes = [
    {
      id: "orange",
      nom: "Orange Money",
      color: "#ff6600",
      bg: "#ff660018",
      logo: (
        <div
          style={{
            width: "42px",
            height: "42px",
            borderRadius: "10px",
            background: "#ff6600",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            fontWeight: "900",
            fontSize: "13px",
            color: "#fff",
          }}
        >
          OM
        </div>
      )
    },

    {
      id: "wave",
      nom: "WAVE",
      color: "#1da9f5",
      bg: "#1da9f518",
      logo: (
        <div
          style={{
            width: "42px",
            height: "42px",
            borderRadius: "10px",
            background: "linear-gradient(135deg, #1da9f5, #0084d4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            fontWeight: "900",
            fontSize: "12px",
            color: "#fff",
            letterSpacing: "-0.5px"
          }}
        >
          WAVE
        </div>
      )
    },

    {
      id: "mtn",
      nom: "MTN Money",
      color: "#ffcc00",
      bg: "#ffcc0018",
      logo: (
        <div
          style={{
            width: "42px",
            height: "42px",
            borderRadius: "10px",
            background: "#ffcc00",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            fontWeight: "900",
            fontSize: "11px",
            color: "#000",
          }}
        >
          MTN
        </div>
      )
    },

    {
      id: "moov",
      nom: "Moov Money",
      color: "#0066cc",
      bg: "#0066cc18",
      logo: (
        <div
          style={{
            width: "42px",
            height: "42px",
            borderRadius: "10px",
            background: "linear-gradient(135deg, #0066cc, #004499)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            fontWeight: "900",
            fontSize: "11px",
            color: "#fff",
          }}
        >
          MOOV
        </div>
      )
    },
  ]

  const planSelectionne = plans.find(p => p.id === planChoisi)

  const montant = planSelectionne
    ? annuel
      ? planSelectionne.prix_annuel
      : planSelectionne.prix_mensuel
    : 0

  const handlePayer = async () => {
    if (!methode) {
      setError("Choisissez un moyen de paiement")
      return
    }

    if (!telephone || telephone.length < 8) {
      setError("Entrez un numéro valide")
      return
    }

    setLoading(true)
    setError("")

    await new Promise(r => setTimeout(r, 2000))

    setLoading(false)
    setSuccess(true)
  }

  return (
    <>
      {/* TON JSX CONTINUE ICI */}
    </>
  )
}