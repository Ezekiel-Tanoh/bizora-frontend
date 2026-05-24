"use client"

import { useState, useEffect } from "react"
import { getPlan, limites } from "@/lib/plan"
import PlanBanner from "@/components/PlanBanner"
import NouvelleFactureModal from "@/components/NouvelleFactureModal"

const cardStyle = {
  background: "rgba(255,255,255,0.03)",
  border: "1px solid rgba(255,255,255,0.07)",
  borderRadius: "16px",
  padding: "1.25rem",
}

export default function Factures() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [plan, setPlan] = useState<"gratuit" | "pro" | "business">("gratuit")
  const [nbFactures, setNbFactures] = useState(0)

  useEffect(() => {
    setPlan(getPlan())
  }, [])

  return (
    <>
      <style>{`
        .fact-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
        .fact-kpi { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; margin-bottom: 1.5rem; }
        .fact-analytics { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; }
        @media (max-width: 768px) {
          .fact-header { flex-direction: column; align-items: flex-start; gap: 1rem; }
          .fact-header button { width: 100%; }
          .fact-kpi { grid-template-columns: repeat(2, 1fr); }
          .fact-analytics { grid-template-columns: 1fr; }
        }
      `}</style>

      <div style={{ color: "#fff", fontFamily: "'Inter', sans-serif" }}>

        <NouvelleFactureModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSuccess={() => setNbFactures(prev => prev + 1)}
        />

        <div className="fact-header">
          <div>
            <h1 style={{ fontSize: "1.5rem", fontWeight: "700", margin: 0 }}>Factures</h1>
            <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.4)", margin: "4px 0 0" }}>Gérez vos factures et devis</p>
          </div>
          <button
            onClick={() => {
              if (plan === "gratuit" && nbFactures >= limites.gratuit.factures) {
                alert(`Limite de ${limites.gratuit.factures} factures/mois atteinte. Passez au plan Pro !`)
                return
              }
              setIsModalOpen(true)
            }}
            style={{
              padding: "10px 20px", borderRadius: "10px", border: "none",
              background: "linear-gradient(135deg, #8b5cf6, #6d28d9)",
              color: "#fff", fontSize: "14px", fontWeight: "600",
              cursor: "pointer", boxShadow: "0 0 20px rgba(139,92,246,0.3)"
            }}
          >
            + Nouvelle facture {plan === "gratuit" ? `(${nbFactures}/${limites.gratuit.factures})` : ""}
          </button>
        </div>

        <div className="fact-kpi">
          {[
            { label: "Total factures", value: nbFactures, color: "#fff", icon: "🧾" },
            { label: "Payées", value: 0, color: "#34d399", icon: "✅" },
            { label: "En attente", value: 0, color: "#fbbf24", icon: "⏳" },
            { label: "Montant total", value: "0 FCFA", color: "#a78bfa", icon: "💰" },
          ].map((kpi, i) => (
            <div key={i} style={{ ...cardStyle, transition: "all 0.2s" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(139,92,246,0.3)"; e.currentTarget.style.background = "rgba(139,92,246,0.06)" }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"; e.currentTarget.style.background = "rgba(255,255,255,0.03)" }}
            >
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", margin: "0 0 8px" }}>{kpi.label}</p>
                <span style={{ fontSize: "18px" }}>{kpi.icon}</span>
              </div>
              <p style={{ fontSize: "1.8rem", fontWeight: "700", color: kpi.color, margin: 0 }}>{kpi.value}</p>
            </div>
          ))}
        </div>

        {/* Analytics factures - bloqué plan gratuit */}
        <div style={{ ...cardStyle, position: "relative", marginBottom: "1.5rem" }}>
          {!limites[plan].analytics && (
            <PlanBanner feature="Les analytics avancés des factures" plan="pro" />
          )}
          <h2 style={{ fontSize: "14px", fontWeight: "600", margin: "0 0 1rem", color: "rgba(255,255,255,0.8)" }}>
            📊 Analytics factures
          </h2>
          <div className="fact-analytics">
            {[
              { label: "Revenus ce mois", value: "—", icon: "💰" },
              { label: "Factures payées", value: "—", icon: "✅" },
              { label: "Taux de paiement", value: "—", icon: "📈" },
            ].map((item, i) => (
              <div key={i} style={{ background: "rgba(255,255,255,0.02)", borderRadius: "10px", padding: "1rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                  <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", margin: 0 }}>{item.label}</p>
                  <span style={{ fontSize: "16px" }}>{item.icon}</span>
                </div>
                <p style={{ fontSize: "1.4rem", fontWeight: "700", color: "#a78bfa", margin: 0 }}>{item.value}</p>
              </div>
            ))}
          </div>
        </div>

        <div style={{ ...cardStyle, textAlign: "center", padding: "4rem 2rem" }}>
          <p style={{ fontSize: "3rem", marginBottom: "1rem" }}>🧾</p>
          <p style={{ fontSize: "16px", fontWeight: "600", color: "rgba(255,255,255,0.7)", margin: "0 0 8px" }}>
            Créez votre première facture
          </p>
          <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.3)", margin: "0 0 1.5rem" }}>
            Les factures sont générées et imprimables automatiquement
          </p>
          <button
            onClick={() => {
              if (plan === "gratuit" && nbFactures >= limites.gratuit.factures) {
                alert(`Limite de ${limites.gratuit.factures} factures/mois atteinte. Passez au plan Pro !`)
                return
              }
              setIsModalOpen(true)
            }}
            style={{
              padding: "10px 24px", borderRadius: "10px", border: "none",
              background: "linear-gradient(135deg, #8b5cf6, #6d28d9)",
              color: "#fff", fontSize: "14px", fontWeight: "600",
              cursor: "pointer", boxShadow: "0 0 20px rgba(139,92,246,0.3)"
            }}
          >
            + Nouvelle facture
          </button>
        </div>
      </div>
    </>
  )
}