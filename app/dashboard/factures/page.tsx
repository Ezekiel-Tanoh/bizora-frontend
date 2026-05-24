"use client"

import { useState } from "react"
import NouvelleFactureModal from "@/components/NouvelleFactureModal"

const cardStyle = {
  background: "rgba(255,255,255,0.03)",
  border: "1px solid rgba(255,255,255,0.07)",
  borderRadius: "16px",
  padding: "1.25rem",
}

export default function Factures() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <style>{`
        .fact-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
        .fact-kpi { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; margin-bottom: 1.5rem; }
        @media (max-width: 768px) {
          .fact-header { flex-direction: column; align-items: flex-start; gap: 1rem; }
          .fact-header button { width: 100%; }
          .fact-kpi { grid-template-columns: repeat(2, 1fr); }
        }
      `}</style>

      <div style={{ color: "#fff", fontFamily: "'Inter', sans-serif" }}>

        <NouvelleFactureModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSuccess={() => {}} />

        <div className="fact-header">
          <div>
            <h1 style={{ fontSize: "1.5rem", fontWeight: "700", margin: 0 }}>Factures</h1>
            <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.4)", margin: "4px 0 0" }}>Gérez vos factures et devis</p>
          </div>
          <button onClick={() => setIsModalOpen(true)} style={{
            padding: "10px 20px", borderRadius: "10px", border: "none",
            background: "linear-gradient(135deg, #8b5cf6, #6d28d9)",
            color: "#fff", fontSize: "14px", fontWeight: "600",
            cursor: "pointer", boxShadow: "0 0 20px rgba(139,92,246,0.3)"
          }}>
            + Nouvelle facture
          </button>
        </div>

        <div className="fact-kpi">
          {[
            { label: "Total factures", value: 0, color: "#fff", icon: "🧾" },
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

        <div style={{ ...cardStyle, textAlign: "center", padding: "4rem 2rem" }}>
          <p style={{ fontSize: "3rem", marginBottom: "1rem" }}>🧾</p>
          <p style={{ fontSize: "16px", fontWeight: "600", color: "rgba(255,255,255,0.7)", margin: "0 0 8px" }}>
            Créez votre première facture
          </p>
          <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.3)", margin: "0 0 1.5rem" }}>
            Les factures sont générées et imprimables automatiquement
          </p>
          <button onClick={() => setIsModalOpen(true)} style={{
            padding: "10px 24px", borderRadius: "10px", border: "none",
            background: "linear-gradient(135deg, #8b5cf6, #6d28d9)",
            color: "#fff", fontSize: "14px", fontWeight: "600",
            cursor: "pointer", boxShadow: "0 0 20px rgba(139,92,246,0.3)"
          }}>
            + Nouvelle facture
          </button>
        </div>
      </div>
    </>
  )
}