"use client"

import { useRouter } from "next/navigation"

interface Props {
  feature: string
  plan: "pro" | "business"
}

export default function PlanBanner({ feature, plan }: Props) {
  const router = useRouter()

  const couleur = plan === "pro" ? "#8b5cf6" : "#f59e0b"
  const label = plan === "pro" ? "Pro" : "Business"
  const emoji = plan === "pro" ? "⭐" : "👑"

  return (
    <div style={{
      position: "absolute", inset: 0, zIndex: 10,
      background: "rgba(10,10,15,0.85)",
      backdropFilter: "blur(4px)",
      borderRadius: "16px",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      textAlign: "center", padding: "2rem"
    }}>
      <div style={{
        width: "56px", height: "56px", borderRadius: "14px",
        background: `${couleur}20`,
        border: `1px solid ${couleur}40`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: "24px", marginBottom: "1rem"
      }}>
        {emoji}
      </div>
      <h3 style={{ fontSize: "16px", fontWeight: "700", margin: "0 0 8px", color: "#fff" }}>
        Fonctionnalité {label}
      </h3>
      <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.45)", margin: "0 0 1.5rem", maxWidth: "260px", lineHeight: "1.6" }}>
        {feature} est disponible à partir du plan <strong style={{ color: couleur }}>{label}</strong>.
      </p>
      <button
        onClick={() => router.push("/pricing")}
        style={{
          padding: "10px 24px", borderRadius: "10px", border: "none",
          background: plan === "pro"
            ? "linear-gradient(135deg, #8b5cf6, #6d28d9)"
            : "linear-gradient(135deg, #f59e0b, #d97706)",
          color: "#fff", fontSize: "14px", fontWeight: "600",
          cursor: "pointer",
          boxShadow: `0 0 20px ${couleur}40`
        }}
      >
        Passer au {label} →
      </button>
    </div>
  )
}