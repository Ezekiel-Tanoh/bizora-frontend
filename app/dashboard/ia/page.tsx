"use client"

import { useState } from "react"
import api from "@/lib/api"

const cardStyle = {
  background: "rgba(255,255,255,0.03)",
  border: "1px solid rgba(255,255,255,0.07)",
  borderRadius: "16px",
  padding: "1.25rem",
}

export default function IAAssistant() {
  const [messages, setMessages] = useState<{ role: string, content: string }[]>([
    { role: "ia", content: "Bonjour ! Je suis votre assistant IA Bizora. Je peux vous aider à analyser vos ventes, générer des descriptions produits, créer du contenu marketing et bien plus encore. Comment puis-je vous aider ?" }
  ])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSend = async () => {
    if (!input.trim()) return
    const userMsg = input
    setInput("")
    setMessages(prev => [...prev, { role: "user", content: userMsg }])
    setLoading(true)
    try {
      const response = await api.post("/ai/chat", { message: userMsg })
      setMessages(prev => [...prev, { role: "ia", content: response.data.response }])
    } catch {
      setMessages(prev => [...prev, { role: "ia", content: "Erreur lors de la connexion à l'IA. Réessayez." }])
    } finally {
      setLoading(false)
    }
  }

  const suggestions = [
    "Quel produit se vend le plus ?",
    "Que dois-je restockers ?",
    "Génère une promotion",
    "Analyse mes clients",
  ]

  const outils = [
    { icon: "📝", title: "Description produit", desc: "Génère une description professionnelle" },
    { icon: "📊", title: "Analyse des ventes", desc: "Insights intelligents sur vos performances" },
    { icon: "📱", title: "Post marketing", desc: "Posts Facebook et WhatsApp automatiques" },
    { icon: "📦", title: "Recommandations stock", desc: "Savoir quoi restockers et quand" },
    { icon: "👥", title: "Analyse clients", desc: "Découvrez vos meilleurs clients" },
    { icon: "💰", title: "Prédictions ventes", desc: "Anticipez vos revenus futurs" },
  ]

  return (
    <div style={{ color: "#fff", fontFamily: "'Inter', sans-serif" }}>

      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "1.5rem", fontWeight: "700", margin: 0 }}>🤖 IA Assistant</h1>
        <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.4)", margin: "4px 0 0" }}>
          Votre assistant business intelligent
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem", marginBottom: "1.5rem" }}>
        {outils.map((outil, i) => (
          <div key={i} style={{ ...cardStyle, cursor: "pointer", transition: "all 0.2s" }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = "rgba(139,92,246,0.3)"
              e.currentTarget.style.background = "rgba(139,92,246,0.06)"
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"
              e.currentTarget.style.background = "rgba(255,255,255,0.03)"
            }}
          >
            <div style={{
              width: "36px", height: "36px", borderRadius: "10px",
              background: "rgba(139,92,246,0.15)", border: "1px solid rgba(139,92,246,0.2)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "18px", marginBottom: "10px"
            }}>{outil.icon}</div>
            <p style={{ fontSize: "13px", fontWeight: "600", margin: "0 0 4px" }}>{outil.title}</p>
            <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", margin: 0 }}>{outil.desc}</p>
          </div>
        ))}
      </div>

      <div style={cardStyle}>
        <h2 style={{ fontSize: "14px", fontWeight: "600", margin: "0 0 1rem" }}>💬 Chat avec l'IA</h2>

        <div style={{
          background: "rgba(0,0,0,0.2)", borderRadius: "12px",
          padding: "1rem", height: "320px", overflowY: "auto",
          display: "flex", flexDirection: "column", gap: "12px",
          marginBottom: "1rem"
        }}>
          {messages.map((msg, i) => (
            <div key={i} style={{
              display: "flex", gap: "10px",
              justifyContent: msg.role === "user" ? "flex-end" : "flex-start"
            }}>
              {msg.role === "ia" && (
                <div style={{
                  width: "28px", height: "28px", borderRadius: "8px",
                  background: "linear-gradient(135deg, #8b5cf6, #6d28d9)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "12px", fontWeight: "bold", flexShrink: 0
                }}>IA</div>
              )}
              <div style={{
                maxWidth: "75%", padding: "10px 14px", borderRadius: "12px",
                fontSize: "13px", lineHeight: "1.6",
                background: msg.role === "user"
                  ? "rgba(139,92,246,0.2)"
                  : "rgba(255,255,255,0.05)",
                border: msg.role === "user"
                  ? "1px solid rgba(139,92,246,0.3)"
                  : "1px solid rgba(255,255,255,0.07)",
                color: msg.role === "user" ? "#c4b5fd" : "rgba(255,255,255,0.8)"
              }}>
                {msg.content}
              </div>
            </div>
          ))}
          {loading && (
            <div style={{ display: "flex", gap: "10px" }}>
              <div style={{
                width: "28px", height: "28px", borderRadius: "8px",
                background: "linear-gradient(135deg, #8b5cf6, #6d28d9)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "12px", fontWeight: "bold"
              }}>IA</div>
              <div style={{
                padding: "10px 14px", borderRadius: "12px",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.07)",
                color: "rgba(255,255,255,0.4)", fontSize: "13px"
              }}>
                En train de réfléchir...
              </div>
            </div>
          )}
        </div>

        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "1rem" }}>
          {suggestions.map((s, i) => (
            <button key={i}
              onClick={() => setInput(s)}
              style={{
                fontSize: "12px", padding: "5px 12px", borderRadius: "100px", border: "none",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)" as any,
                color: "rgba(255,255,255,0.5)", cursor: "pointer", transition: "all 0.15s"
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = "rgba(139,92,246,0.1)"
                e.currentTarget.style.color = "#a78bfa"
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = "rgba(255,255,255,0.05)"
                e.currentTarget.style.color = "rgba(255,255,255,0.5)"
              }}
            >{s}</button>
          ))}
        </div>

        <div style={{ display: "flex", gap: "8px" }}>
          <input
            type="text"
            placeholder="Posez une question à l'IA..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleSend()}
            style={{
              flex: 1, padding: "10px 14px", borderRadius: "10px",
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "#fff", fontSize: "13px", outline: "none"
            }}
            onFocus={e => (e.currentTarget.style.borderColor = "rgba(139,92,246,0.6)")}
            onBlur={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")}
          />
          <button
            onClick={handleSend}
            disabled={loading}
            style={{
              padding: "10px 20px", borderRadius: "10px", border: "none",
              background: loading ? "rgba(139,92,246,0.4)" : "linear-gradient(135deg, #8b5cf6, #6d28d9)",
              color: "#fff", fontSize: "14px", fontWeight: "600",
              cursor: loading ? "not-allowed" : "pointer",
              boxShadow: "0 0 12px rgba(139,92,246,0.3)"
            }}
          >
            {loading ? "..." : "→"}
          </button>
        </div>
      </div>
    </div>
  )
}