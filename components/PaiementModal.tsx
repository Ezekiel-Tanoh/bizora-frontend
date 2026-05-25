"use client"

import { useState } from "react"
import api from "@/lib/api"

interface Props {
  isOpen: boolean
  onClose: () => void
  montant?: number
  description?: string
  clientNom?: string
  clientTelephone?: string
  orderId?: string           // ← nouveau
  onPaymentSuccess?: () => void  // ← nouveau
}

const methodes = [
  {
    id: "orange",
    nom: "Orange Money",
    color: "#ff6600",
    bg: "#ff660018",
    logo: (
      <div style={{
        width: "42px", height: "42px", borderRadius: "10px",
        background: "#ff6600",
        display: "flex", alignItems: "center", justifyContent: "center",
        flexShrink: 0, fontWeight: "900", fontSize: "13px", color: "#fff",
      }}>OM</div>
    )
  },
  {
    id: "wave",
    nom: "WAVE",
    color: "#1da9f5",
    bg: "#1da9f518",
    logo: (
      <div style={{
        width: "42px", height: "42px", borderRadius: "10px",
        background: "linear-gradient(135deg, #1da9f5, #0084d4)",
        display: "flex", alignItems: "center", justifyContent: "center",
        flexShrink: 0, fontWeight: "900", fontSize: "12px", color: "#fff",  // ← 13px→12px
        letterSpacing: "-0.5px"  // ← serré pour tenir
      }}>WAVE</div>
    )
  },
  {
    id: "mtn",
    nom: "MTN Money",
    color: "#ffcc00",
    bg: "#ffcc0018",
    logo: (
      <div style={{
        width: "42px", height: "42px", borderRadius: "10px",
        background: "#ffcc00",
        display: "flex", alignItems: "center", justifyContent: "center",
        flexShrink: 0, fontWeight: "900", fontSize: "11px", color: "#000",
      }}>MTN</div>
    )
  },
  {
    id: "moov",
    nom: "Moov Money",
    color: "#0066cc",
    bg: "#0066cc18",
    logo: (
      <div style={{
        width: "42px", height: "42px", borderRadius: "10px",
        background: "linear-gradient(135deg, #0066cc, #004499)",
        display: "flex", alignItems: "center", justifyContent: "center",
        flexShrink: 0, fontWeight: "900", fontSize: "11px", color: "#fff",
      }}>MOOV</div>
    )
  },
]

export default function PaiementModal({
  isOpen,
  onClose,
  montant = 0,
  description = "Paiement Bizora",
  clientNom = "",
  clientTelephone = "",
  orderId,           // ← nouveau
  onPaymentSuccess,  // ← nouveau
}: Props) {
  const [methode, setMethode] = useState("")
  const [telephone, setTelephone] = useState(clientTelephone)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")
  const [paymentUrl, setPaymentUrl] = useState("")

  const handlePayer = async () => {
    if (!methode) { setError("Choisissez un moyen de paiement"); return }
    if (!telephone || telephone.length < 8) { setError("Entrez un numéro valide"); return }
    setLoading(true)
    setError("")

    try {
      const response = await api.post("/payments/create", {
        montant,
        description,
        clientNom: clientNom || "Client Bizora",
        clientTelephone: telephone,
        returnUrl: `${window.location.origin}/dashboard/commandes?payment=success`,
        cancelUrl: `${window.location.origin}/dashboard/commandes?payment=cancel`,
      })

      if (response.data.success) {
        setPaymentUrl(response.data.paymentUrl)
        window.open(response.data.paymentUrl, "_blank")

        // ← Mise à jour du statut de la commande si on a un orderId
        if (orderId) {
          try {
            await api.put(`/orders/${orderId}/status`, { status: "confirmed" })
            onPaymentSuccess?.()  // rafraîchit la liste dans la page parent
          } catch (statusErr) {
            console.error("Erreur mise à jour statut commande :", statusErr)
            // On affiche quand même le succès du paiement
          }
        }

        setSuccess(true)
      } else {
        setError("Erreur lors de la création du paiement")
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Erreur de connexion")
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setMethode(""); setTelephone(""); setSuccess(false); setError(""); setPaymentUrl("")
    onClose()
  }

  const selectedMethode = methodes.find(m => m.id === methode)

  if (!isOpen) return null

  // ... (reste du JSX identique à l'original)
}