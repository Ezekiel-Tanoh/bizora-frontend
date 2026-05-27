"use client"

import { useRouter } from "next/navigation"

interface Props {
  feature: string
  plan?: "business"
}

export default function PlanBanner({ feature, plan = "business" }: Props) {
  const router = useRouter()

  return (
    <div style={{
      position: "absolute", inset: 0, zIndex: 10,
      background: "rgba(10,10,15,0.85)",
      backdropFilter: "blur(8px)",
      borderRadius: "16px",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      padding: "2rem", textAlign: "center"
    }}>
      <div style={{
        width: "56px", height: "56px", borderRadius: "16px",
        background: "rgba(245,158,11,0.2)",
        border: "1px solid rgba(245,158,11,0.4)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: "26px", marginBottom: "1rem"
      }}>
        👑
      </div>
      <p style={{ fontSize: "16px", fontWeight: "700", margin: "0 0 8px", color: "#fff" }}>
        Fonctionnalité Business
      </p>
      <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.5)", margin: "0 0 1.5rem", maxWidth: "280px", lineHeight: "1.6" }}>
        {feature} est disponible uniquement avec le plan Business.
      </p>
      <button
        onClick={() => router.push("/dashboard/abonnements")}
        style={{
          padding: "10px 24px", borderRadius: "10px", border: "none",
          background: "linear-gradient(135deg, #f59e0b, #d97706)",
          color: "#fff", fontSize: "14px", fontWeight: "600",
          cursor: "pointer", boxShadow: "0 0 20px rgba(245,158,11,0.4)"
        }}
      >
        Passer au Business →
      </button>
    </div>
  )
}