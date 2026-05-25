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
      logo: (
        <div style={{
          width: "30px",
          height: "30px",
          borderRadius: "8px",
          background: "#ff6600",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#fff",
          fontSize: "11px",
          fontWeight: "900"
        }}>
          OM
        </div>
      )
    },
    {
      id: "wave",
      nom: "WAVE",
      color: "#1da9f5",
      logo: (
        <div style={{
          width: "30px",
          height: "30px",
          borderRadius: "8px",
          background: "linear-gradient(135deg, #1da9f5, #0084d4)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#fff",
          fontSize: "9px",
          fontWeight: "900",
          letterSpacing: "-0.5px"
        }}>
          WAVE
        </div>
      )
    },
    {
      id: "mtn",
      nom: "MTN Money",
      color: "#ffcc00",
      logo: (
        <div style={{
          width: "30px",
          height: "30px",
          borderRadius: "8px",
          background: "#ffcc00",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#000",
          fontSize: "10px",
          fontWeight: "900"
        }}>
          MTN
        </div>
      )
    },
    {
      id: "moov",
      nom: "Moov Money",
      color: "#0066cc",
      logo: (
        <div style={{
          width: "30px",
          height: "30px",
          borderRadius: "8px",
          background: "linear-gradient(135deg, #0066cc, #004499)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#fff",
          fontSize: "9px",
          fontWeight: "900"
        }}>
          MOOV
        </div>
      )
    },
  ]

  const planSelectionne = plans.find(p => p.id === planChoisi)

  const montant = planSelectionne
    ? (annuel ? planSelectionne.prix_annuel : planSelectionne.prix_mensuel)
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
      <main style={{
        background: "#0a0a0f",
        minHeight: "100vh",
        padding: "3rem 1.5rem",
        color: "#fff"
      }}>

        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <h1 style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>
            Choisissez votre plan
          </h1>

          <button
            onClick={() => setAnnuel(!annuel)}
            style={{
              padding: "10px 20px",
              borderRadius: "100px",
              border: "none",
              background: "#8b5cf6",
              color: "#fff",
              cursor: "pointer"
            }}
          >
            {annuel ? "Mode Annuel" : "Mode Mensuel"}
          </button>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))",
          gap: "1.5rem",
          maxWidth: "1100px",
          margin: "0 auto"
        }}>
          {plans.map(plan => {
            const prix = annuel
              ? plan.prix_annuel
              : plan.prix_mensuel

            return (
              <div
                key={plan.id}
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "20px",
                  padding: "2rem"
                }}
              >
                <h2>{plan.nom}</h2>

                <div style={{
                  fontSize: "2rem",
                  fontWeight: "700",
                  marginBottom: "1rem"
                }}>
                  {prix === 0
                    ? "Gratuit"
                    : `${prix.toLocaleString()} FCFA`}
                </div>

                <div style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                  marginBottom: "2rem"
                }}>
                  {plan.features.map((f, i) => (
                    <div key={i}>
                      {f.inclus ? "✓" : "✗"} {f.texte}
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => {
                    if (plan.id === "gratuit") {
                      router.push("/inscription")
                      return
                    }

                    setPlanChoisi(plan.id)
                    setShowPaiement(true)
                  }}
                  style={{
                    width: "100%",
                    padding: "12px",
                    borderRadius: "12px",
                    border: "none",
                    background: "#8b5cf6",
                    color: "#fff",
                    cursor: "pointer"
                  }}
                >
                  {plan.id === "gratuit"
                    ? "Commencer"
                    : `Choisir ${plan.nom}`}
                </button>
              </div>
            )
          })}
        </div>

        {showPaiement && planSelectionne && (
          <div style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.8)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1rem",
            zIndex: 100
          }}>
            <div style={{
              width: "100%",
              maxWidth: "450px",
              background: "#13131f",
              borderRadius: "20px",
              padding: "2rem"
            }}>

              {success ? (
                <div style={{ textAlign: "center" }}>
                  <h2>Paiement initié ✅</h2>

                  <button
                    onClick={() => {
                      setShowPaiement(false)
                      router.push("/dashboard")
                    }}
                    style={{
                      width: "100%",
                      padding: "12px",
                      border: "none",
                      borderRadius: "10px",
                      background: "#8b5cf6",
                      color: "#fff",
                      marginTop: "1rem",
                      cursor: "pointer"
                    }}
                  >
                    Aller au dashboard
                  </button>
                </div>
              ) : (
                <>
                  <h2 style={{ marginBottom: "1rem" }}>
                    Paiement {planSelectionne.nom}
                  </h2>

                  <p style={{
                    color: "#a78bfa",
                    fontSize: "1.5rem",
                    fontWeight: "700"
                  }}>
                    {montant.toLocaleString()} FCFA
                  </p>

                  {error && (
                    <div style={{
                      marginTop: "1rem",
                      color: "#f87171"
                    }}>
                      {error}
                    </div>
                  )}

                  <div style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "10px",
                    marginTop: "1.5rem"
                  }}>
                    {methodes.map(m => (
                      <button
                        key={m.id}
                        onClick={() => setMethode(m.id)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                          padding: "12px",
                          borderRadius: "12px",
                          cursor: "pointer",
                          border: methode === m.id
                            ? `1px solid ${m.color}`
                            : "1px solid rgba(255,255,255,0.1)",
                          background: "rgba(255,255,255,0.03)"
                        }}
                      >
                        <div style={{
                          width: "36px",
                          height: "36px",
                          borderRadius: "8px",
                          background: "#fff",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center"
                        }}>
                          {m.logo}
                        </div>

                        <span style={{
                          fontSize: "12px",
                          color: "#fff"
                        }}>
                          {m.nom}
                        </span>
                      </button>
                    ))}
                  </div>

                  <input
                    type="tel"
                    placeholder="Votre numéro"
                    value={telephone}
                    onChange={(e) => setTelephone(e.target.value)}
                    style={{
                      width: "100%",
                      marginTop: "1.5rem",
                      padding: "12px",
                      borderRadius: "10px",
                      border: "1px solid rgba(255,255,255,0.1)",
                      background: "rgba(255,255,255,0.05)",
                      color: "#fff",
                      boxSizing: "border-box"
                    }}
                  />

                  <div style={{
                    display: "flex",
                    gap: "10px",
                    marginTop: "1.5rem"
                  }}>
                    <button
                      onClick={() => setShowPaiement(false)}
                      style={{
                        flex: 1,
                        padding: "12px",
                        borderRadius: "10px",
                        border: "1px solid rgba(255,255,255,0.1)",
                        background: "transparent",
                        color: "#fff",
                        cursor: "pointer"
                      }}
                    >
                      Annuler
                    </button>

                    <button
                      onClick={handlePayer}
                      disabled={loading}
                      style={{
                        flex: 1,
                        padding: "12px",
                        borderRadius: "10px",
                        border: "none",
                        background: "#8b5cf6",
                        color: "#fff",
                        cursor: "pointer"
                      }}
                    >
                      {loading
                        ? "Traitement..."
                        : "Payer maintenant"}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </main>
    </>
  )
}