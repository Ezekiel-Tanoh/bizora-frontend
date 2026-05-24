"use client"

import { useState, useEffect } from "react"
import api from "@/lib/api"
import { getPlan, limites } from "@/lib/plan"
import PlanBanner from "@/components/PlanBanner"

const cardStyle = {
  background: "rgba(255,255,255,0.03)",
  border: "1px solid rgba(255,255,255,0.07)",
  borderRadius: "16px",
  padding: "1.25rem",
}

export default function IAAssistant() {
  const [plan, setPlan] = useState<"gratuit" | "pro" | "business">("gratuit")
  const [messages, setMessages] = useState<{ role: string, content: string }[]>([
    { role: "ia", content: "Bonjour ! Je suis votre assistant IA Bizora. Je peux vous aider à analyser vos ventes, générer des descriptions produits, créer du contenu marketing et bien plus encore. Comment puis-je vous aider ?" }
  ])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setPlan(getPlan())
  }, [])

  const handleSend = async () => {
    if (!input.trim()) return
    if (!limites[plan].ia) return
    const userMsg = input
    setInput("")
    setMessages(prev => [...prev, { role: "user", content: userMsg }])
    setLoading(true)
    try {
      const response = await api.post("/ai/chat", { message: userMsg })
      setMessages(prev => [...prev, { role: "ia", content: response.data.response }])
    } catch {
      setMessages(prev => [...prev, { role: "ia", content: "Erreur lors de la connexion à l'IA." }])
    } finally {
      setLoading(false)
    }
  }

  const suggestions = ["Quel produit se vend le plus ?", "Que dois-je restockers ?", "Génère une promotion", "Analyse mes clients"]

  const outils = [
    { icon: "📝", title: "Description produit", desc: "Génère une description professionnelle", pro: true },
    { icon: "📊", title: "Analyse des ventes", desc: "Insights intelligents sur vos performances", pro: true },
    { icon: "📱", title: "Post marketing", desc: "Posts Facebook et WhatsApp automatiques", pro: true },
    { icon: "📦", title: "Recommandations stock", desc: "Savoir quoi restockers et quand", pro: true },
    { icon: "👥", title: "Analyse clients", desc: "Découvrez vos meilleurs clients", pro: true },
    { icon: "💰", title: "Prédictions ventes", desc: "Anticipez vos revenus futurs", pro: true },
  ]

  return (
    <>
      <style>{`
        .ia-outils { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; margin-bottom: 1.5rem; }
        .ia-suggestions { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 1rem; }
        @media (max-width: 768px) {
          .ia-outils { grid-template-columns: repeat(2, 1fr); }
        }
      `}</style>

      <div style={{ color: "#fff", fontFamily: "'Inter', sans-serif" }}>

        <div style={{ marginBottom: "2rem" }}>
          <h1 style={{ fontSize: "1.5rem", fontWeight: "700", margin: 0 }}>🤖 IA Assistant</h1>
          <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.4)", margin: "4px 0 0" }}>
            Votre assistant business intelligent
          </p>
          {/* Badge plan actuel */}
          <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", marginTop: "8px", padding: "4px 12px", borderRadius: "100px", background: plan === "gratuit" ? "rgba(255,255,255,0.05)" : plan === "pro" ? "rgba(139,92,246,0.15)" : "rgba(245,158,11,0.15)", border: plan === "gratuit" ? "1px solid rgba(255,255,255,0.1)" : plan === "pro" ? "1px solid rgba(139,92,246,0.3)" : "1px solid rgba(245,158,11,0.3)" }}>
            <span style={{ fontSize: "12px" }}>{plan === "gratuit" ? "🆓" : plan === "pro" ? "⭐" : "👑"}</span>
            <span style={{ fontSize: "12px", fontWeight: "600", color: plan === "gratuit" ? "rgba(255,255,255,0.5)" : plan === "pro" ? "#a78bfa" : "#f59e0b" }}>
              Plan {plan.charAt(0).toUpperCase() + plan.slice(1)}
            </span>
          </div>
        </div>

        {/* Outils IA */}
        <div className="ia-outils">
          {outils.map((outil, i) => (
            <div key={i} style={{
              ...cardStyle, cursor: "pointer", transition: "all 0.2s",
              opacity: !limites[plan].ia ? 0.5 : 1,
              position: "relative"
            }}
              onMouseEnter={e => {
                if (limites[plan].ia) {
                  e.currentTarget.style.borderColor = "rgba(139,92,246,0.3)"
                  e.currentTarget.style.background = "rgba(139,92,246,0.06)"
                }
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"
                e.currentTarget.style.background = "rgba(255,255,255,0.03)"
              }}
            >
              {/* Lock si plan gratuit */}
              {!limites[plan].ia && (
                <div style={{
                  position: "absolute", top: "8px", right: "8px",
                  fontSize: "12px", background: "rgba(139,92,246,0.2)",
                  border: "1px solid rgba(139,92,246,0.3)",
                  borderRadius: "6px", padding: "2px 6px", color: "#a78bfa"
                }}>🔒 Pro</div>
              )}
              <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "rgba(139,92,246,0.15)", border: "1px solid rgba(139,92,246,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", marginBottom: "10px" }}>
                {outil.icon}
              </div>
              <p style={{ fontSize: "13px", fontWeight: "600", margin: "0 0 4px" }}>{outil.title}</p>
              <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", margin: 0 }}>{outil.desc}</p>
            </div>
          ))}
        </div>

        {/* Chat IA */}
        <div style={{ ...cardStyle, position: "relative" }}>

          {/* Banner de blocage si plan gratuit */}
          {!limites[plan].ia && (
            <PlanBanner feature="L'IA complète avec chat et analyses" plan="pro" />
          )}

          <h2 style={{ fontSize: "14px", fontWeight: "600", margin: "0 0 1rem" }}>💬 Chat avec l'IA</h2>

          <div style={{ background: "rgba(0,0,0,0.2)", borderRadius: "12px", padding: "1rem", height: "320px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "12px", marginBottom: "1rem" }}>
            {messages.map((msg, i) => (
              <div key={i} style={{ display: "flex", gap: "10px", justifyContent: msg.role === "user" ? "flex-end" : "flex-start" }}>
                {msg.role === "ia" && (
                  <div style={{ width: "28px", height: "28px", borderRadius: "8px", background: "linear-gradient(135deg, #8b5cf6, #6d28d9)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: "bold", flexShrink: 0 }}>IA</div>
                )}
                <div style={{
                  maxWidth: "75%", padding: "10px 14px", borderRadius: "12px", fontSize: "13px", lineHeight: "1.6",
                  background: msg.role === "user" ? "rgba(139,92,246,0.2)" : "rgba(255,255,255,0.05)",
                  border: msg.role === "user" ? "1px solid rgba(139,92,246,0.3)" : "1px solid rgba(255,255,255,0.07)",
                  color: msg.role === "user" ? "#c4b5fd" : "rgba(255,255,255,0.8)"
                }}>
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ display: "flex", gap: "10px" }}>
                <div style={{ width: "28px", height: "28px", borderRadius: "8px", background: "linear-gradient(135deg, #8b5cf6, #6d28d9)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: "bold" }}>IA</div>
                <div style={{ padding: "10px 14px", borderRadius: "12px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.4)", fontSize: "13px" }}>
                  En train de réfléchir...
                </div>
              </div>
            )}
          </div>

          <div className="ia-suggestions">
            {suggestions.map((s, i) => (
              <button key={i} onClick={() => setInput(s)} style={{
                fontSize: "12px", padding: "5px 12px", borderRadius: "100px",
                background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
                color: "rgba(255,255,255,0.5)", cursor: "pointer", transition: "all 0.15s"
              }}
                onMouseEnter={e => { e.currentTarget.style.background = "rgba(139,92,246,0.1)"; e.currentTarget.style.color = "#a78bfa" }}
                onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.color = "rgba(255,255,255,0.5)" }}
              >{s}</button>
            ))}
          </div>

          <div style={{ display: "flex", gap: "8px" }}>
            <input
              type="text"
              placeholder={limites[plan].ia ? "Posez une question à l'IA..." : "🔒 Disponible en plan Pro"}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSend()}
              disabled={!limites[plan].ia}
              style={{
                flex: 1, padding: "10px 14px", borderRadius: "10px",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "#fff", fontSize: "13px", outline: "none",
                opacity: limites[plan].ia ? 1 : 0.5,
                cursor: limites[plan].ia ? "text" : "not-allowed"
              }}
              onFocus={e => { if (limites[plan].ia) e.currentTarget.style.borderColor = "rgba(139,92,246,0.6)" }}
              onBlur={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")}
            />
            <button
              onClick={handleSend}
              disabled={loading || !limites[plan].ia}
              style={{
                padding: "10px 20px", borderRadius: "10px", border: "none",
                background: !limites[plan].ia ? "rgba(255,255,255,0.05)" : loading ? "rgba(139,92,246,0.4)" : "linear-gradient(135deg, #8b5cf6, #6d28d9)",
                color: "#fff", fontSize: "14px", fontWeight: "600",
                cursor: loading || !limites[plan].ia ? "not-allowed" : "pointer",
                boxShadow: limites[plan].ia ? "0 0 12px rgba(139,92,246,0.3)" : "none"
              }}
            >
              {loading ? "..." : "→"}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}