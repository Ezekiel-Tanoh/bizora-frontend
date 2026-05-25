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
    nom: "Wave",
    color: "#1da9f5",
    bg: "#1da9f518",
    logo: (
      <div style={{
        width: "42px", height: "42px", borderRadius: "10px",
        background: "linear-gradient(135deg, #1da9f5, #0084d4)",
        display: "flex", alignItems: "center", justifyContent: "center",
        flexShrink: 0, fontWeight: "900", fontSize: "16px", color: "#fff"
      }}>〜</div>
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
  clientTelephone = ""
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

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 50,
      background: "rgba(0,0,0,0.75)", backdropFilter: "blur(6px)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "1rem"
    }}>
      <div style={{
        background: "#13131f",
        border: "1px solid rgba(139,92,246,0.2)",
        borderRadius: "20px", padding: "2rem",
        width: "100%", maxWidth: "440px",
        boxShadow: "0 0 60px rgba(139,92,246,0.12)",
        fontFamily: "'Inter', sans-serif", color: "#fff"
      }}>

        {success ? (
          <div style={{ textAlign: "center", padding: "1rem 0" }}>
            <div style={{
              width: "64px", height: "64px", borderRadius: "50%",
              background: "rgba(52,211,153,0.1)",
              border: "1px solid rgba(52,211,153,0.3)",
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 1.5rem", fontSize: "2rem"
            }}>✅</div>

            <h2 style={{ fontSize: "1.2rem", fontWeight: "700", marginBottom: "0.5rem" }}>
              Page de paiement ouverte !
            </h2>
            <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)", marginBottom: "1.5rem" }}>
              Complétez le paiement sur la page PayDunya qui vient de s'ouvrir.
            </p>

            <div style={{
              background: "rgba(139,92,246,0.08)",
              border: "1px solid rgba(139,92,246,0.2)",
              borderRadius: "12px", padding: "1rem",
              marginBottom: "1.5rem",
            }}>
              <p style={{ fontSize: "1.2rem", fontWeight: "700", color: "#a78bfa", margin: "0 0 4px" }}>
                {montant.toLocaleString()} FCFA
              </p>
              <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.35)", margin: 0 }}>
                via {selectedMethode?.nom}
              </p>
            </div>

            {paymentUrl && (
              <a
                href={paymentUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "block", marginBottom: "1rem",
                  padding: "10px", borderRadius: "10px",
                  background: "rgba(139,92,246,0.1)",
                  border: "1px solid rgba(139,92,246,0.2)",
                  color: "#a78bfa", fontSize: "13px", textDecoration: "none"
                }}
              >
                🔗 Ouvrir à nouveau la page de paiement
              </a>
            )}

            <button onClick={handleClose} style={{
              width: "100%", padding: "12px", borderRadius: "10px", border: "none",
              background: "linear-gradient(135deg, #8b5cf6, #6d28d9)",
              color: "#fff", fontSize: "14px", fontWeight: "600", cursor: "pointer",
              boxShadow: "0 0 20px rgba(139,92,246,0.3)"
            }}>
              Fermer
            </button>
          </div>

        ) : (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
              <h2 style={{ fontSize: "1.1rem", fontWeight: "700", margin: 0 }}>
                Paiement Mobile Money
              </h2>
              <button onClick={handleClose} style={{
                background: "rgba(255,255,255,0.05)", border: "none",
                color: "rgba(255,255,255,0.5)", width: "32px", height: "32px",
                borderRadius: "8px", cursor: "pointer", fontSize: "16px"
              }}>✕</button>
            </div>

            {montant > 0 && (
              <div style={{
                background: "rgba(139,92,246,0.08)",
                border: "1px solid rgba(139,92,246,0.2)",
                borderRadius: "12px", padding: "1rem", marginBottom: "1.5rem"
              }}>
                <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", margin: "0 0 4px" }}>
                  Montant à payer
                </p>
                <p style={{ fontSize: "1.6rem", fontWeight: "700", color: "#a78bfa", margin: 0 }}>
                  {montant.toLocaleString()} FCFA
                </p>
              </div>
            )}

            {error && (
              <div style={{
                background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)",
                borderRadius: "10px", padding: "10px 14px", marginBottom: "1rem"
              }}>
                <p style={{ fontSize: "13px", color: "#f87171", margin: 0 }}>{error}</p>
              </div>
            )}

            <div style={{ marginBottom: "1.25rem" }}>
              <label style={{ fontSize: "13px", color: "rgba(255,255,255,0.5)", display: "block", marginBottom: "10px" }}>
                Choisir le moyen de paiement
              </label>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                {methodes.map((m) => {
                  const selected = methode === m.id
                  return (
                    <button
                      key={m.id}
                      onClick={() => setMethode(m.id)}
                      style={{
                        display: "flex", alignItems: "center", gap: "12px",
                        padding: "14px", borderRadius: "14px", cursor: "pointer",
                        border: selected ? `1.5px solid ${m.color}` : "1px solid rgba(255,255,255,0.08)",
                        background: selected ? m.bg : "rgba(255,255,255,0.02)",
                        transition: "all 0.2s", textAlign: "left"
                      }}
                      onMouseEnter={e => { if (!selected) e.currentTarget.style.background = "rgba(255,255,255,0.05)" }}
                      onMouseLeave={e => { if (!selected) e.currentTarget.style.background = "rgba(255,255,255,0.02)" }}
                    >
                      {m.logo}
                      <div>
                        <p style={{
                          fontSize: "13px", fontWeight: "600", margin: "0 0 2px",
                          color: selected ? "#fff" : "rgba(255,255,255,0.7)"
                        }}>
                          {m.nom}
                        </p>
                        {selected && (
                          <p style={{ fontSize: "11px", color: m.color, margin: 0 }}>✓ Sélectionné</p>
                        )}
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            <div style={{ marginBottom: "1.5rem" }}>
              <label style={{ fontSize: "13px", color: "rgba(255,255,255,0.5)", display: "block", marginBottom: "6px" }}>
                Numéro de téléphone
              </label>
              <input
                type="tel"
                placeholder="Ex: 07 00 00 00 00"
                value={telephone}
                onChange={(e) => setTelephone(e.target.value)}
                style={{
                  width: "100%", padding: "10px 14px", borderRadius: "10px",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: "#fff", fontSize: "14px", outline: "none",
                  boxSizing: "border-box", transition: "border 0.2s"
                }}
                onFocus={e => (e.currentTarget.style.borderColor = "rgba(139,92,246,0.6)")}
                onBlur={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")}
              />
              <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.25)", marginTop: "6px" }}>
                Le client recevra une notification sur ce numéro
              </p>
            </div>

            <div style={{ display: "flex", gap: "10px" }}>
              <button onClick={handleClose} style={{
                flex: 1, padding: "11px", borderRadius: "10px",
                border: "1px solid rgba(255,255,255,0.1)",
                background: "transparent", color: "rgba(255,255,255,0.5)",
                fontSize: "14px", cursor: "pointer", transition: "all 0.2s"
              }}
                onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.05)")}
                onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
              >
                Annuler
              </button>
              <button
                onClick={handlePayer}
                disabled={loading}
                style={{
                  flex: 1, padding: "11px", borderRadius: "10px", border: "none",
                  background: loading ? "rgba(139,92,246,0.5)" : "linear-gradient(135deg, #8b5cf6, #6d28d9)",
                  color: "#fff", fontSize: "14px", fontWeight: "600",
                  cursor: loading ? "not-allowed" : "pointer",
                  boxShadow: "0 0 20px rgba(139,92,246,0.3)", transition: "all 0.2s"
                }}
                onMouseEnter={e => { if (!loading) e.currentTarget.style.transform = "translateY(-1px)" }}
                onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)" }}
              >
                {loading ? "⏳ Traitement..." : "💳 Payer maintenant"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}