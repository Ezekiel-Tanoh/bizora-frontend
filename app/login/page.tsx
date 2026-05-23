"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import api from "@/lib/api"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleLogin = async () => {
    setLoading(true)
    setError("")
    try {
      const response = await api.post("/auth/login", { email, password })
      localStorage.setItem("bizora_token", response.data.token)
      localStorage.setItem("bizora_user", JSON.stringify(response.data.user))
      router.push("/dashboard")
    } catch (err: any) {
      setError(err.response?.data?.message || "Email ou mot de passe incorrect")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main style={{
      background: "#0a0a0f", minHeight: "100vh",
      fontFamily: "'Inter', sans-serif", color: "#fff",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      position: "relative", overflow: "hidden"
    }}>

      {/* Glow background */}
      <div style={{
        position: "absolute", top: "30%", left: "50%", transform: "translateX(-50%)",
        width: "600px", height: "400px",
        background: "radial-gradient(ellipse, rgba(139,92,246,0.12) 0%, transparent 70%)",
        pointerEvents: "none"
      }} />

      {/* Logo */}
      <div
        onClick={() => router.push("/")}
        style={{
          display: "flex", alignItems: "center", gap: "10px",
          marginBottom: "2.5rem", cursor: "pointer"
        }}>
        <div style={{
          width: "36px", height: "36px", borderRadius: "10px",
          background: "linear-gradient(135deg, #8b5cf6, #6d28d9)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontWeight: "bold", fontSize: "18px",
          boxShadow: "0 0 20px rgba(139,92,246,0.4)"
        }}>B</div>
        <span style={{ fontSize: "20px", fontWeight: "600" }}>Bizora</span>
      </div>

      {/* Card */}
      <div style={{
        width: "100%", maxWidth: "400px",
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(139,92,246,0.2)",
        borderRadius: "20px", padding: "2.5rem",
        boxShadow: "0 0 40px rgba(139,92,246,0.08)"
      }}>

        <h1 style={{ fontSize: "1.5rem", fontWeight: "700", marginBottom: "0.5rem", textAlign: "center" }}>
          Bon retour 👋
        </h1>
        <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.4)", textAlign: "center", marginBottom: "2rem" }}>
          Connectez-vous à votre espace Bizora
        </p>

        {error && (
          <div style={{
            background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)",
            borderRadius: "10px", padding: "10px 14px", marginBottom: "1.5rem"
          }}>
            <p style={{ fontSize: "13px", color: "#f87171", margin: 0 }}>{error}</p>
          </div>
        )}

        {/* Email */}
        <div style={{ marginBottom: "1rem" }}>
          <label style={{ fontSize: "13px", color: "rgba(255,255,255,0.5)", display: "block", marginBottom: "6px" }}>
            Email
          </label>
          <input
            type="email"
            placeholder="vous@exemple.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width: "100%", padding: "10px 14px", borderRadius: "10px",
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "#fff", fontSize: "14px", outline: "none",
              boxSizing: "border-box", transition: "border 0.2s"
            }}
            onFocus={e => (e.currentTarget.style.borderColor = "rgba(139,92,246,0.6)")}
            onBlur={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")}
          />
        </div>

        {/* Password */}
        <div style={{ marginBottom: "1.5rem" }}>
          <label style={{ fontSize: "13px", color: "rgba(255,255,255,0.5)", display: "block", marginBottom: "6px" }}>
            Mot de passe
          </label>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: "100%", padding: "10px 14px", borderRadius: "10px",
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "#fff", fontSize: "14px", outline: "none",
              boxSizing: "border-box", transition: "border 0.2s"
            }}
            onFocus={e => (e.currentTarget.style.borderColor = "rgba(139,92,246,0.6)")}
            onBlur={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")}
          />
        </div>

        {/* Bouton */}
        <button
          onClick={handleLogin}
          disabled={loading}
          style={{
            width: "100%", padding: "12px", borderRadius: "10px", border: "none",
            background: loading ? "rgba(139,92,246,0.5)" : "linear-gradient(135deg, #8b5cf6, #6d28d9)",
            color: "#fff", cursor: loading ? "not-allowed" : "pointer",
            fontSize: "15px", fontWeight: "600",
            boxShadow: "0 0 25px rgba(139,92,246,0.4)",
            transition: "all 0.2s"
          }}
          onMouseEnter={e => { if (!loading) e.currentTarget.style.transform = "translateY(-2px)" }}
          onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)" }}
        >
          {loading ? "Connexion en cours..." : "Se connecter →"}
        </button>

        {/* Inscription */}
        <div style={{
          borderTop: "1px solid rgba(255,255,255,0.07)",
          marginTop: "1.5rem", paddingTop: "1.5rem", textAlign: "center"
        }}>
          <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)" }}>
            Pas encore de compte ?{" "}
            <span
              onClick={() => router.push("/inscription")}
              style={{ color: "#a78bfa", cursor: "pointer", fontWeight: "500" }}
            >
              S'inscrire gratuitement
            </span>
          </p>
        </div>

      </div>
    </main>
  )
}