"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import api from "@/lib/api"
import { getPlan } from "@/lib/plan"

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

const methodes = [
  {
    id: "orange", nom: "Orange Money", color: "#ff6600", bg: "#ff660018",
    logo: (
      <div style={{ width: "36px", height: "36px", borderRadius: "8px", background: "#ff6600", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "900", fontSize: "11px", color: "#fff" }}>OM</div>
    )
  },
  {
    id: "wave", nom: "Wave", color: "#1da9f5", bg: "#1da9f518",
    logo: (
      <div style={{ width: "36px", height: "36px", borderRadius: "8px", background: "linear-gradient(135deg, #1da9f5, #0084d4)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "900", fontSize: "16px", color: "#fff" }}>〜</div>
    )
  },
  {
    id: "mtn", nom: "MTN Money", color: "#ffcc00", bg: "#ffcc0018",
    logo: (
      <div style={{ width: "36px", height: "36px", borderRadius: "8px", background: "#ffcc00", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "900", fontSize: "10px", color: "#000" }}>MTN</div>
    )
  },
  {
    id: "moov", nom: "Moov Money", color: "#0066cc", bg: "#0066cc18",
    logo: (
      <div style={{ width: "36px", height: "36px", borderRadius: "8px", background: "linear-gradient(135deg, #0066cc, #004499)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "900", fontSize: "10px", color: "#fff" }}>MOOV</div>
    )
  },
]

export default function Pricing() {
  const router = useRouter()
  const [annuel, setAnnuel] = useState(false)
  const [planChoisi, setPlanChoisi] = useState<string | null>(null)
  const [planActuel, setPlanActuel] = useState<string>("gratuit")
  const [showPaiement, setShowPaiement] = useState(false)
  const [methode, setMethode] = useState("")
  const [telephone, setTelephone] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [paymentUrl, setPaymentUrl] = useState("")
  const [error, setError] = useState("")

  useEffect(() => {
    setPlanActuel(getPlan())
    const user = JSON.parse(localStorage.getItem("bizora_user") || "{}")
    if (user.telephone) setTelephone(user.telephone)
  }, [])

  const planSelectionne = plans.find(p => p.id === planChoisi)
  const montant = planSelectionne ? (annuel ? planSelectionne.prix_annuel : planSelectionne.prix_mensuel) : 0

  const handlePayer = async () => {
    if (!methode) { setError("Choisissez un moyen de paiement"); return }
    if (!telephone || telephone.length < 8) { setError("Entrez un numéro valide"); return }
    setLoading(true)
    setError("")

    try {
      const user = JSON.parse(localStorage.getItem("bizora_user") || "{}")

      const response = await api.post("/payments/create", {
        montant,
        description: `Abonnement Bizora ${planSelectionne?.nom} - ${annuel ? "Annuel" : "Mensuel"}`,
        clientNom: user.name || "Client Bizora",
        clientEmail: user.email || "",
        clientTelephone: telephone,
        returnUrl: `${window.location.origin}/dashboard/abonnements?payment=success&plan=${planChoisi}`,
        cancelUrl: `${window.location.origin}/dashboard/abonnements?payment=cancel`,
      })

      if (response.data.success) {
        setPaymentUrl(response.data.paymentUrl)
        window.open(response.data.paymentUrl, "_blank")
        setSuccess(true)
      } else {
        setError(response.data.message || "Erreur lors du paiement")
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Erreur de connexion au serveur")
    } finally {
      setLoading(false)
    }
  }

  const handleSuccessClose = () => {
    const user = JSON.parse(localStorage.getItem("bizora_user") || "{}")
    user.plan = planChoisi
    localStorage.setItem("bizora_user", JSON.stringify(user))
    setShowPaiement(false)
    setSuccess(false)
    setMethode("")
    setTelephone("")
    setPaymentUrl("")
    router.push("/dashboard")
  }

  return (
    <>
      <style>{`
        .pricing-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; max-width: 1100px; margin: 0 auto; }
        @media (max-width: 768px) { .pricing-grid { grid-template-columns: 1fr; } }
      `}</style>

      <div style={{ color: "#fff", fontFamily: "'Inter', sans-serif" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <h1 style={{ fontSize: "1.8rem", fontWeight: "700", margin: "0 0 0.5rem" }}>
            Choisissez votre plan
          </h1>
          <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.4)", margin: "0 0 2rem" }}>
            Commencez gratuitement, évoluez selon vos besoins
          </p>

          {/* Toggle mensuel/annuel */}
          <div style={{ display: "inline-flex", alignItems: "center", gap: "12px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "100px", padding: "6px 16px" }}>
            <span style={{ fontSize: "14px", color: annuel ? "rgba(255,255,255,0.4)" : "#fff", fontWeight: annuel ? "400" : "600" }}>Mensuel</span>
            <div
              onClick={() => setAnnuel(!annuel)}
              style={{ width: "44px", height: "24px", borderRadius: "100px", cursor: "pointer", background: annuel ? "linear-gradient(135deg, #8b5cf6, #6d28d9)" : "rgba(255,255,255,0.15)", position: "relative", transition: "all 0.2s", boxShadow: annuel ? "0 0 12px rgba(139,92,246,0.4)" : "none" }}
            >
              <div style={{ width: "18px", height: "18px", borderRadius: "50%", background: "#fff", position: "absolute", top: "3px", left: annuel ? "23px" : "3px", transition: "all 0.2s" }} />
            </div>
            <span style={{ fontSize: "14px", color: annuel ? "#fff" : "rgba(255,255,255,0.4)", fontWeight: annuel ? "600" : "400" }}>
              Annuel
              <span style={{ marginLeft: "6px", fontSize: "11px", padding: "2px 8px", borderRadius: "100px", background: "rgba(52,211,153,0.15)", color: "#34d399", border: "1px solid rgba(52,211,153,0.3)" }}>-17%</span>
            </span>
          </div>
        </div>

        {/* Plans */}
        <div className="pricing-grid" style={{ marginBottom: "4rem" }}>
          {plans.map((plan) => {
            const estPro = plan.id === "pro"
            const estBusiness = plan.id === "business"
            const estActuel = plan.id === planActuel
            const prix = annuel ? plan.prix_annuel : plan.prix_mensuel

            return (
              <div key={plan.id} style={{
                background: estPro ? "rgba(139,92,246,0.08)" : estBusiness ? "rgba(245,158,11,0.05)" : "rgba(255,255,255,0.02)",
                border: `1px solid ${estActuel ? "rgba(52,211,153,0.4)" : estPro ? "rgba(139,92,246,0.4)" : estBusiness ? "rgba(245,158,11,0.3)" : "rgba(255,255,255,0.08)"}`,
                borderRadius: "20px", padding: "2rem", position: "relative",
                boxShadow: estActuel ? "0 0 30px rgba(52,211,153,0.1)" : plan.glow,
                transition: "transform 0.2s"
              }}
                onMouseEnter={e => (e.currentTarget.style.transform = "translateY(-4px)")}
                onMouseLeave={e => (e.currentTarget.style.transform = "translateY(0)")}
              >
                {/* Badge populaire */}
                {plan.badge && !estActuel && (
                  <div style={{
                    position: "absolute", top: "-14px", left: "50%", transform: "translateX(-50%)",
                    background: estPro ? "linear-gradient(135deg, #8b5cf6, #6d28d9)" : "linear-gradient(135deg, #f59e0b, #d97706)",
                    padding: "4px 16px", borderRadius: "100px",
                    fontSize: "12px", fontWeight: "600", whiteSpace: "nowrap",
                    boxShadow: plan.glow
                  }}>
                    {plan.badge}
                  </div>
                )}

                {/* Badge plan actuel */}
                {estActuel && (
                  <div style={{
                    position: "absolute", top: "-14px", left: "50%", transform: "translateX(-50%)",
                    background: "linear-gradient(135deg, #34d399, #059669)",
                    padding: "4px 16px", borderRadius: "100px",
                    fontSize: "12px", fontWeight: "600", whiteSpace: "nowrap",
                    boxShadow: "0 0 16px rgba(52,211,153,0.4)"
                  }}>
                    ✓ Plan actuel
                  </div>
                )}

                <h2 style={{ fontSize: "1.2rem", fontWeight: "700", margin: "0 0 0.5rem", color: estPro ? "#a78bfa" : estBusiness ? "#f59e0b" : "#fff" }}>
                  {plan.nom}
                </h2>

                <div style={{ marginBottom: "1.5rem" }}>
                  <span style={{ fontSize: "2.5rem", fontWeight: "800", color: "#fff" }}>
                    {prix === 0 ? "Gratuit" : prix.toLocaleString()}
                  </span>
                  {prix > 0 && (
                    <span style={{ fontSize: "14px", color: "rgba(255,255,255,0.4)", marginLeft: "4px" }}>
                      FCFA/{annuel ? "an" : "mois"}
                    </span>
                  )}
                  {annuel && prix > 0 && (
                    <div style={{ fontSize: "12px", color: "#34d399", marginTop: "4px" }}>
                      ≈ {Math.round(prix / 12).toLocaleString()} FCFA/mois
                    </div>
                  )}
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "2rem" }}>
                  {plan.features.map((f, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <span style={{ fontSize: "14px", color: f.inclus ? "#34d399" : "rgba(255,255,255,0.2)", flexShrink: 0 }}>
                        {f.inclus ? "✓" : "✗"}
                      </span>
                      <span style={{ fontSize: "13px", color: f.inclus ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.25)", textDecoration: f.inclus ? "none" : "line-through" }}>
                        {f.texte}
                      </span>
                    </div>
                  ))}
                </div>

                <button
                  disabled={estActuel}
                  onClick={() => {
                    if (plan.id === "gratuit") return
                    if (estActuel) return
                    setPlanChoisi(plan.id)
                    setShowPaiement(true)
                  }}
                  style={{
                    width: "100%", padding: "12px", borderRadius: "12px", borderBlock: "none",
                    background: estActuel
                      ? "rgba(52,211,153,0.1)"
                      : estPro
                        ? "linear-gradient(135deg, #8b5cf6, #6d28d9)"
                        : estBusiness
                          ? "linear-gradient(135deg, #f59e0b, #d97706)"
                          : "rgba(255,255,255,0.08)",
                    color: estActuel ? "#34d399" : "#fff",
                    fontSize: "14px", fontWeight: "600",
                    cursor: estActuel ? "not-allowed" : "pointer",
                    border: estActuel ? "1px solid rgba(52,211,153,0.3)" : "none" as any,
                    boxShadow: estActuel ? "none" : estPro ? "0 0 20px rgba(139,92,246,0.4)" : estBusiness ? "0 0 20px rgba(245,158,11,0.3)" : "none",
                    transition: "all 0.2s"
                  }}
                >
                  {estActuel ? "✓ Plan actuel" : plan.id === "gratuit" ? "Plan de base" : `Passer au ${plan.nom} →`}
                </button>
              </div>
            )
          })}
        </div>

        {/* FAQ */}
        <div style={{ maxWidth: "700px", margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontSize: "1.3rem", fontWeight: "700", marginBottom: "0.5rem" }}>Des questions ?</h2>
          <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.4)", marginBottom: "1.5rem" }}>
            Contactez-nous sur WhatsApp ou par email
          </p>
          <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
            <a href="https://wa.me/2250700000000" style={{ padding: "10px 20px", borderRadius: "10px", background: "rgba(37,211,102,0.1)", border: "1px solid rgba(37,211,102,0.3)", color: "#25d366", fontSize: "14px", textDecoration: "none" }}>
              💬 WhatsApp
            </a>
            <a href="mailto:support@bizora.app" style={{ padding: "10px 20px", borderRadius: "10px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.6)", fontSize: "14px", textDecoration: "none" }}>
              📧 Email
            </a>
          </div>
        </div>

      </div>

      {/* Modal paiement PayDunya */}
      {showPaiement && planSelectionne && (
        <div style={{ position: "fixed", inset: 0, zIndex: 50, background: "rgba(0,0,0,0.8)", backdropFilter: "blur(6px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}>
          <div style={{ background: "#13131f", border: "1px solid rgba(139,92,246,0.2)", borderRadius: "20px", padding: "2rem", width: "100%", maxWidth: "440px", boxShadow: "0 0 60px rgba(139,92,246,0.12)", fontFamily: "'Inter', sans-serif", color: "#fff" }}>

            {success ? (
              <div style={{ textAlign: "center", padding: "1rem 0" }}>
                <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: "rgba(52,211,153,0.1)", border: "1px solid rgba(52,211,153,0.3)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem", fontSize: "2rem" }}>✅</div>
                <h2 style={{ fontSize: "1.2rem", fontWeight: "700", marginBottom: "0.5rem" }}>
                  Page de paiement ouverte !
                </h2>
                <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)", marginBottom: "1rem" }}>
                  Complétez le paiement sur la page PayDunya. Votre plan <strong style={{ color: "#a78bfa" }}>{planSelectionne.nom}</strong> sera activé après confirmation.
                </p>
                <div style={{ background: "rgba(139,92,246,0.08)", border: "1px solid rgba(139,92,246,0.2)", borderRadius: "12px", padding: "1rem", marginBottom: "1.5rem" }}>
                  <p style={{ fontSize: "1.4rem", fontWeight: "700", color: "#a78bfa", margin: "0 0 4px" }}>
                    {montant.toLocaleString()} FCFA
                  </p>
                  <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.35)", margin: 0 }}>
                    Plan {planSelectionne.nom} — {annuel ? "Annuel" : "Mensuel"}
                  </p>
                </div>
                {paymentUrl && (
                  <a href={paymentUrl} target="_blank" rel="noopener noreferrer" style={{ display: "block", marginBottom: "1rem", padding: "10px", borderRadius: "10px", background: "rgba(139,92,246,0.1)", border: "1px solid rgba(139,92,246,0.2)", color: "#a78bfa", fontSize: "13px", textDecoration: "none" }}>
                    🔗 Rouvrir la page de paiement
                  </a>
                )}
                <button onClick={handleSuccessClose} style={{ width: "100%", padding: "12px", borderRadius: "10px", border: "none", background: "linear-gradient(135deg, #8b5cf6, #6d28d9)", color: "#fff", fontSize: "14px", fontWeight: "600", cursor: "pointer", boxShadow: "0 0 20px rgba(139,92,246,0.3)" }}>
                  Aller au dashboard →
                </button>
              </div>
            ) : (
              <>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                  <h2 style={{ fontSize: "1.1rem", fontWeight: "700", margin: 0 }}>
                    Abonnement {planSelectionne.nom}
                  </h2>
                  <button onClick={() => { setShowPaiement(false); setMethode(""); setError("") }} style={{ background: "rgba(255,255,255,0.05)", border: "none", color: "rgba(255,255,255,0.5)", width: "32px", height: "32px", borderRadius: "8px", cursor: "pointer", fontSize: "16px" }}>✕</button>
                </div>

                <div style={{ background: planSelectionne.id === "pro" ? "rgba(139,92,246,0.08)" : "rgba(245,158,11,0.08)", border: `1px solid ${planSelectionne.id === "pro" ? "rgba(139,92,246,0.2)" : "rgba(245,158,11,0.2)"}`, borderRadius: "12px", padding: "1rem", marginBottom: "1.5rem" }}>
                  <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", margin: "0 0 4px" }}>Montant à payer</p>
                  <p style={{ fontSize: "1.6rem", fontWeight: "700", color: planSelectionne.id === "pro" ? "#a78bfa" : "#f59e0b", margin: "0 0 4px" }}>
                    {montant.toLocaleString()} FCFA
                  </p>
                  <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.35)", margin: 0 }}>
                    Plan {planSelectionne.nom} — {annuel ? "Annuel" : "Mensuel"}
                  </p>
                </div>

                {error && (
                  <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: "10px", padding: "10px 14px", marginBottom: "1rem" }}>
                    <p style={{ fontSize: "13px", color: "#f87171", margin: 0 }}>{error}</p>
                  </div>
                )}

                <label style={{ fontSize: "13px", color: "rgba(255,255,255,0.5)", display: "block", marginBottom: "10px" }}>
                  Choisir le moyen de paiement
                </label>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "1.25rem" }}>
                  {methodes.map(m => (
                    <button
                      key={m.id}
                      onClick={() => setMethode(m.id)}
                      style={{
                        display: "flex", alignItems: "center", gap: "10px",
                        padding: "12px", borderRadius: "12px", cursor: "pointer",
                        border: methode === m.id ? `1.5px solid ${m.color}` : "1px solid rgba(255,255,255,0.08)",
                        background: methode === m.id ? m.bg : "rgba(255,255,255,0.02)",
                        transition: "all 0.2s"
                      }}
                    >
                      {m.logo}
                      <div>
                        <span style={{ fontSize: "12px", fontWeight: "500", color: methode === m.id ? "#fff" : "rgba(255,255,255,0.6)" }}>{m.nom}</span>
                        {methode === m.id && <p style={{ fontSize: "10px", color: m.color, margin: "2px 0 0" }}>✓ Sélectionné</p>}
                      </div>
                    </button>
                  ))}
                </div>

                <div style={{ marginBottom: "1.5rem" }}>
                  <label style={{ fontSize: "13px", color: "rgba(255,255,255,0.5)", display: "block", marginBottom: "6px" }}>
                    Numéro de téléphone
                  </label>
                  <input
                    type="tel"
                    placeholder="Ex: 07 00 00 00 00"
                    value={telephone}
                    onChange={e => setTelephone(e.target.value)}
                    style={{ width: "100%", padding: "10px 14px", borderRadius: "10px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", fontSize: "14px", outline: "none", boxSizing: "border-box" }}
                    onFocus={e => (e.currentTarget.style.borderColor = "rgba(139,92,246,0.6)")}
                    onBlur={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")}
                  />
                  <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.25)", marginTop: "6px" }}>
                    Vous recevrez une notification de paiement sur ce numéro
                  </p>
                </div>

                <div style={{ display: "flex", gap: "10px" }}>
                  <button
                    onClick={() => { setShowPaiement(false); setMethode(""); setError("") }}
                    style={{ flex: 1, padding: "11px", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.1)", background: "transparent", color: "rgba(255,255,255,0.5)", fontSize: "14px", cursor: "pointer" }}
                  >
                    Annuler
                  </button>
                  <button
                    onClick={handlePayer}
                    disabled={loading}
                    style={{ flex: 1, padding: "11px", borderRadius: "10px", border: "none", background: loading ? "rgba(139,92,246,0.5)" : "linear-gradient(135deg, #8b5cf6, #6d28d9)", color: "#fff", fontSize: "14px", fontWeight: "600", cursor: loading ? "not-allowed" : "pointer", boxShadow: "0 0 20px rgba(139,92,246,0.3)" }}
                  >
                    {loading ? "⏳ Traitement..." : `💳 Payer ${montant.toLocaleString()} FCFA`}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}