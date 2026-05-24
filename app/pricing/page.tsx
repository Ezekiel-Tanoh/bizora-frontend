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
    { id: "orange", nom: "Orange Money", color: "#f97316", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/16/Orange_logo.svg/240px-Orange_logo.svg.png" },
    { id: "wave", nom: "Wave", color: "#1da9f5", logo: "https://play-lh.googleusercontent.com/MEo8fxOMJGMmMSPMkrOTiVC9aYNiQhWaWKlLLB4RCnYMxFIaHHLrXQiRWVxwINMD_Q=w240-h480-rw" },
    { id: "mtn", nom: "MTN Money", color: "#ffcc00", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/New-mtn-logo.jpg/240px-New-mtn-logo.jpg" },
    { id: "moov", nom: "Moov Money", color: "#0066cc", logo: "https://play-lh.googleusercontent.com/cHkSFkCxcOElHBSqIYpGu0HqZXimrXMfbkBNzpLLVhGBRH6g8iFWXfNUumPJ9SXuLA=w240-h480-rw" },
  ]

  const planSelectionne = plans.find(p => p.id === planChoisi)
  const montant = planSelectionne ? (annuel ? planSelectionne.prix_annuel : planSelectionne.prix_mensuel) : 0

  const handlePayer = async () => {
    if (!methode) { setError("Choisissez un moyen de paiement"); return }
    if (!telephone || telephone.length < 8) { setError("Entrez un numéro valide"); return }
    setLoading(true)
    setError("")
    await new Promise(r => setTimeout(r, 2000))
    setLoading(false)
    setSuccess(true)
  }

  return (
    <>
      <style>{`
        .pricing-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
          max-width: 1100px;
          margin: 0 auto;
        }
        @media (max-width: 768px) {
          .pricing-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <main style={{
        background: "#0a0a0f", minHeight: "100vh",
        fontFamily: "'Inter', sans-serif", color: "#fff",
        padding: "3rem 1.5rem"
      }}>

        {/* Glow */}
        <div style={{
          position: "fixed", top: "20%", left: "50%", transform: "translateX(-50%)",
          width: "600px", height: "400px",
          background: "radial-gradient(ellipse, rgba(139,92,246,0.1) 0%, transparent 70%)",
          pointerEvents: "none"
        }} />

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <div onClick={() => router.push("/")} style={{ display: "inline-flex", alignItems: "center", gap: "8px", marginBottom: "2rem", cursor: "pointer" }}>
            <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "linear-gradient(135deg, #8b5cf6, #6d28d9)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", boxShadow: "0 0 16px rgba(139,92,246,0.4)" }}>B</div>
            <span style={{ fontSize: "18px", fontWeight: "600" }}>Bizora</span>
          </div>

          <h1 style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: "700", margin: "0 0 1rem" }}>
            Choisissez votre plan
          </h1>
          <p style={{ fontSize: "16px", color: "rgba(255,255,255,0.4)", margin: "0 0 2rem" }}>
            Commencez gratuitement, évoluez selon vos besoins
          </p>

          {/* Toggle mensuel/annuel */}
          <div style={{ display: "inline-flex", alignItems: "center", gap: "12px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "100px", padding: "6px 16px" }}>
            <span style={{ fontSize: "14px", color: annuel ? "rgba(255,255,255,0.4)" : "#fff", fontWeight: annuel ? "400" : "600" }}>Mensuel</span>
            <div
              onClick={() => setAnnuel(!annuel)}
              style={{
                width: "44px", height: "24px", borderRadius: "100px", cursor: "pointer",
                background: annuel ? "linear-gradient(135deg, #8b5cf6, #6d28d9)" : "rgba(255,255,255,0.15)",
                position: "relative", transition: "all 0.2s",
                boxShadow: annuel ? "0 0 12px rgba(139,92,246,0.4)" : "none"
              }}
            >
              <div style={{ width: "18px", height: "18px", borderRadius: "50%", background: "#fff", position: "absolute", top: "3px", left: annuel ? "23px" : "3px", transition: "all 0.2s" }} />
            </div>
            <span style={{ fontSize: "14px", color: annuel ? "#fff" : "rgba(255,255,255,0.4)", fontWeight: annuel ? "600" : "400" }}>
              Annuel
              <span style={{ marginLeft: "6px", fontSize: "11px", padding: "2px 8px", borderRadius: "100px", background: "rgba(52,211,153,0.15)", color: "#34d399", border: "1px solid rgba(52,211,153,0.3)" }}>
                -17%
              </span>
            </span>
          </div>
        </div>

        {/* Plans */}
        <div className="pricing-grid" style={{ marginBottom: "4rem" }}>
          {plans.map((plan) => {
            const estPro = plan.id === "pro"
            const estBusiness = plan.id === "business"
            const prix = annuel ? plan.prix_annuel : plan.prix_mensuel

            return (
              <div key={plan.id} style={{
                background: estPro ? "rgba(139,92,246,0.08)" : estBusiness ? "rgba(245,158,11,0.05)" : "rgba(255,255,255,0.02)",
                border: `1px solid ${estPro ? "rgba(139,92,246,0.4)" : estBusiness ? "rgba(245,158,11,0.3)" : "rgba(255,255,255,0.08)"}`,
                borderRadius: "20px", padding: "2rem",
                position: "relative",
                boxShadow: plan.glow,
                transition: "transform 0.2s"
              }}
                onMouseEnter={e => (e.currentTarget.style.transform = "translateY(-4px)")}
                onMouseLeave={e => (e.currentTarget.style.transform = "translateY(0)")}
              >
                {/* Badge */}
                {plan.badge && (
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

                {/* Nom */}
                <h2 style={{ fontSize: "1.2rem", fontWeight: "700", margin: "0 0 0.5rem", color: estPro ? "#a78bfa" : estBusiness ? "#f59e0b" : "#fff" }}>
                  {plan.nom}
                </h2>

                {/* Prix */}
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

                {/* Features */}
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

                {/* Bouton */}
                <button
                  onClick={() => {
                    if (plan.id === "gratuit") { router.push("/inscription"); return }
                    setPlanChoisi(plan.id)
                    setShowPaiement(true)
                  }}
                  style={{
                    width: "100%", padding: "12px", borderRadius: "12px", border: "none",
                    background: estPro
                      ? "linear-gradient(135deg, #8b5cf6, #6d28d9)"
                      : estBusiness
                        ? "linear-gradient(135deg, #f59e0b, #d97706)"
                        : "rgba(255,255,255,0.08)",
                    color: "#fff", fontSize: "14px", fontWeight: "600",
                    cursor: "pointer",
                    boxShadow: estPro ? "0 0 20px rgba(139,92,246,0.4)" : estBusiness ? "0 0 20px rgba(245,158,11,0.3)" : "none",
                    transition: "all 0.2s"
                  }}
                >
                  {plan.id === "gratuit" ? "Commencer gratuitement" : `Choisir ${plan.nom} →`}
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

        {/* Modal paiement */}
        {showPaiement && planSelectionne && (
          <div style={{ position: "fixed", inset: 0, zIndex: 50, background: "rgba(0,0,0,0.8)", backdropFilter: "blur(6px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}>
            <div style={{ background: "#13131f", border: "1px solid rgba(139,92,246,0.2)", borderRadius: "20px", padding: "2rem", width: "100%", maxWidth: "440px", boxShadow: "0 0 60px rgba(139,92,246,0.12)" }}>

              {success ? (
                <div style={{ textAlign: "center", padding: "1rem 0" }}>
                  <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: "rgba(52,211,153,0.1)", border: "1px solid rgba(52,211,153,0.3)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem", fontSize: "2rem" }}>✅</div>
                  <h2 style={{ fontSize: "1.2rem", fontWeight: "700", marginBottom: "0.5rem" }}>Paiement initié !</h2>
                  <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)", marginBottom: "1.5rem" }}>
                    Confirmez le paiement sur votre téléphone. Votre plan <strong style={{ color: "#a78bfa" }}>{planSelectionne.nom}</strong> sera activé automatiquement.
                  </p>
                  <button onClick={() => { setShowPaiement(false); setSuccess(false); setMethode(""); setTelephone(""); router.push("/dashboard") }} style={{ width: "100%", padding: "12px", borderRadius: "10px", border: "none", background: "linear-gradient(135deg, #8b5cf6, #6d28d9)", color: "#fff", fontSize: "14px", fontWeight: "600", cursor: "pointer" }}>
                    Aller au dashboard →
                  </button>
                </div>
              ) : (
                <>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                    <h2 style={{ fontSize: "1.1rem", fontWeight: "700", margin: 0 }}>Abonnement {planSelectionne.nom}</h2>
                    <button onClick={() => { setShowPaiement(false); setMethode(""); setError("") }} style={{ background: "rgba(255,255,255,0.05)", border: "none", color: "rgba(255,255,255,0.5)", width: "32px", height: "32px", borderRadius: "8px", cursor: "pointer", fontSize: "16px" }}>✕</button>
                  </div>

                  <div style={{ background: "rgba(139,92,246,0.08)", border: "1px solid rgba(139,92,246,0.2)", borderRadius: "12px", padding: "1rem", marginBottom: "1.5rem" }}>
                    <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", margin: "0 0 4px" }}>Montant à payer</p>
                    <p style={{ fontSize: "1.6rem", fontWeight: "700", color: "#a78bfa", margin: "0 0 4px" }}>{montant.toLocaleString()} FCFA</p>
                    <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.35)", margin: 0 }}>Abonnement {annuel ? "annuel" : "mensuel"} — Plan {planSelectionne.nom}</p>
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
                      <button key={m.id} onClick={() => setMethode(m.id)} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "12px", borderRadius: "12px", cursor: "pointer", border: methode === m.id ? `1.5px solid ${m.color}` : "1px solid rgba(255,255,255,0.08)", background: methode === m.id ? `${m.color}18` : "rgba(255,255,255,0.02)", transition: "all 0.2s" }}>
                        <div style={{ width: "36px", height: "36px", borderRadius: "8px", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, overflow: "hidden" }}>
                          <img src={m.logo} alt={m.nom} style={{ width: "30px", height: "30px", objectFit: "contain" }} />
                        </div>
                        <span style={{ fontSize: "12px", fontWeight: "500", color: methode === m.id ? "#fff" : "rgba(255,255,255,0.6)" }}>{m.nom}</span>
                      </button>
                    ))}
                  </div>

                  <div style={{ marginBottom: "1.5rem" }}>
                    <label style={{ fontSize: "13px", color: "rgba(255,255,255,0.5)", display: "block", marginBottom: "6px" }}>Numéro de téléphone</label>
                    <input type="tel" placeholder="Ex: 07 00 00 00 00" value={telephone} onChange={e => setTelephone(e.target.value)}
                      style={{ width: "100%", padding: "10px 14px", borderRadius: "10px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", fontSize: "14px", outline: "none", boxSizing: "border-box" }}
                      onFocus={e => (e.currentTarget.style.borderColor = "rgba(139,92,246,0.6)")}
                      onBlur={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")}
                    />
                  </div>

                  <div style={{ display: "flex", gap: "10px" }}>
                    <button onClick={() => { setShowPaiement(false); setMethode(""); setError("") }} style={{ flex: 1, padding: "11px", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.1)", background: "transparent", color: "rgba(255,255,255,0.5)", fontSize: "14px", cursor: "pointer" }}>
                      Annuler
                    </button>
                    <button onClick={handlePayer} disabled={loading} style={{ flex: 1, padding: "11px", borderRadius: "10px", border: "none", background: loading ? "rgba(139,92,246,0.5)" : "linear-gradient(135deg, #8b5cf6, #6d28d9)", color: "#fff", fontSize: "14px", fontWeight: "600", cursor: loading ? "not-allowed" : "pointer", boxShadow: "0 0 20px rgba(139,92,246,0.3)" }}>
                      {loading ? "⏳ Traitement..." : "Payer maintenant"}
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