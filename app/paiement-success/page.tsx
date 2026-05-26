"use client"

import { Suspense, useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"

function PaiementSuccessContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const plan = searchParams.get("plan")
  const [countdown, setCountdown] = useState(10)

  useEffect(() => {
    if (plan) {
      const user = JSON.parse(localStorage.getItem("bizora_user") || "{}")
      user.plan = plan
      localStorage.setItem("bizora_user", JSON.stringify(user))
    }

    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer)
          router.push("/dashboard")
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const planNom = plan === "pro" ? "Pro" : plan === "business" ? "Business" : "Gratuit"
  const planColor = plan === "pro" ? "#a78bfa" : plan === "business" ? "#f59e0b" : "#34d399"
  const planEmoji = plan === "pro" ? "⭐" : plan === "business" ? "👑" : "✅"

  return (
    <main style={{
      background: "#0a0a0f", minHeight: "100vh",
      fontFamily: "'Inter', sans-serif", color: "#fff",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "2rem", position: "relative", overflow: "hidden"
    }}>

      {/* Glow */}
      <div style={{
        position: "fixed", top: "30%", left: "50%", transform: "translateX(-50%)",
        width: "600px", height: "400px",
        background: `radial-gradient(ellipse, ${plan === "business" ? "rgba(245,158,11,0.1)" : "rgba(139,92,246,0.12)"} 0%, transparent 70%)`,
        pointerEvents: "none"
      }} />

      <div style={{
        width: "100%", maxWidth: "500px", textAlign: "center",
        position: "relative", zIndex: 1
      }}>

        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", marginBottom: "3rem" }}>
          <div style={{
            width: "36px", height: "36px", borderRadius: "10px",
            background: "linear-gradient(135deg, #8b5cf6, #6d28d9)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontWeight: "bold", fontSize: "18px",
            boxShadow: "0 0 20px rgba(139,92,246,0.4)"
          }}>B</div>
          <span style={{ fontSize: "20px", fontWeight: "600" }}>Bizora</span>
        </div>

        {/* Icône succès animée */}
        <div style={{
          width: "100px", height: "100px", borderRadius: "50%",
          background: "rgba(52,211,153,0.1)",
          border: "2px solid rgba(52,211,153,0.4)",
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 2rem",
          fontSize: "3rem",
          boxShadow: "0 0 40px rgba(52,211,153,0.2)",
          animation: "pulse 2s infinite"
        }}>
          ✅
        </div>

        <style>{`
          @keyframes pulse {
            0% { box-shadow: 0 0 40px rgba(52,211,153,0.2); }
            50% { box-shadow: 0 0 60px rgba(52,211,153,0.4); }
            100% { box-shadow: 0 0 40px rgba(52,211,153,0.2); }
          }
        `}</style>

        <h1 style={{ fontSize: "2rem", fontWeight: "800", margin: "0 0 1rem", color: "#fff" }}>
          Paiement confirmé ! 🎉
        </h1>

        <p style={{ fontSize: "16px", color: "rgba(255,255,255,0.5)", margin: "0 0 2rem", lineHeight: "1.6" }}>
          Merci pour votre confiance ! Votre abonnement a été activé avec succès.
        </p>

        {/* Plan activé */}
        <div style={{
          background: plan === "business" ? "rgba(245,158,11,0.08)" : "rgba(139,92,246,0.08)",
          border: `1px solid ${plan === "business" ? "rgba(245,158,11,0.3)" : "rgba(139,92,246,0.3)"}`,
          borderRadius: "16px", padding: "1.5rem", marginBottom: "2rem"
        }}>
          <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.4)", margin: "0 0 8px" }}>
            Plan activé
          </p>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
            <span style={{ fontSize: "28px" }}>{planEmoji}</span>
            <span style={{ fontSize: "1.8rem", fontWeight: "800", color: planColor }}>
              {planNom}
            </span>
          </div>
          <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.35)", margin: "8px 0 0" }}>
            Toutes les fonctionnalités sont maintenant disponibles
          </p>
        </div>

        {/* Ce qui est débloqué */}
        <div style={{
          background: "rgba(255,255,255,0.02)",
          border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: "16px", padding: "1.5rem", marginBottom: "2rem",
          textAlign: "left"
        }}>
          <p style={{ fontSize: "13px", fontWeight: "600", color: "rgba(255,255,255,0.6)", margin: "0 0 1rem" }}>
            ✨ Ce qui vient d'être débloqué :
          </p>
          {plan === "pro" && (
            <>
              {["Produits illimités", "IA complète", "Clients illimités", "Factures illimitées", "Analytics avancés", "Support email"].map((f, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "5px 0" }}>
                  <span style={{ color: "#34d399", fontSize: "13px" }}>✓</span>
                  <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.7)" }}>{f}</span>
                </div>
              ))}
            </>
          )}
          {plan === "business" && (
            <>
              {["Tout du plan Pro", "Multi-boutiques (5 max)", "IA avancée + prédictions", "Support prioritaire 24/7", "Automatisations avancées"].map((f, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "5px 0" }}>
                  <span style={{ color: "#34d399", fontSize: "13px" }}>✓</span>
                  <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.7)" }}>{f}</span>
                </div>
              ))}
            </>
          )}
        </div>

        {/* Bouton dashboard */}
        <button
          onClick={() => router.push("/dashboard")}
          style={{
            width: "100%", padding: "14px", borderRadius: "12px", border: "none",
            background: plan === "business"
              ? "linear-gradient(135deg, #f59e0b, #d97706)"
              : "linear-gradient(135deg, #8b5cf6, #6d28d9)",
            color: "#fff", fontSize: "15px", fontWeight: "700",
            cursor: "pointer",
            boxShadow: plan === "business"
              ? "0 0 25px rgba(245,158,11,0.4)"
              : "0 0 25px rgba(139,92,246,0.4)",
            marginBottom: "1rem"
          }}
          onMouseEnter={e => (e.currentTarget.style.transform = "translateY(-2px)")}
          onMouseLeave={e => (e.currentTarget.style.transform = "translateY(0)")}
        >
          Accéder au dashboard →
        </button>

        <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.25)" }}>
          Redirection automatique dans {countdown} secondes...
        </p>

      </div>
    </main>
  )
}

export default function PaiementSuccess() {
  return (
    <Suspense fallback={
      <div style={{
        background: "#0a0a0f", minHeight: "100vh",
        display: "flex", alignItems: "center", justifyContent: "center"
      }}>
        <div style={{ color: "rgba(255,255,255,0.3)", fontSize: "14px" }}>Chargement...</div>
      </div>
    }>
      <PaiementSuccessContent />
    </Suspense>
  )
}