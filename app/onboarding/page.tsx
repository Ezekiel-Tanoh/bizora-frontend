"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import api from "@/lib/api"

export default function Onboarding() {
  const router = useRouter()
  const [nomBoutique, setNomBoutique] = useState("")
  const [description, setDescription] = useState("")
  const [telephone, setTelephone] = useState("")
  const [ville, setVille] = useState("")
  const [devise, setDevise] = useState("XOF")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async () => {
    if (!nomBoutique.trim()) {
      setError("Le nom de la boutique est obligatoire")
      return
    }
    setLoading(true)
    setError("")
    try {
      const token = localStorage.getItem("bizora_token")
      await api.post("/boutique/create", {
        nom: nomBoutique,
        description,
        telephone,
        ville,
        devise
      }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      router.push("/dashboard")
    } catch (err: any) {
      setError(err.response?.data?.message || "Une erreur est survenue")
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = {
    width: "100%", padding: "10px 14px", borderRadius: "10px",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.1)",
    color: "#fff", fontSize: "14px", outline: "none",
    boxSizing: "border-box" as const, transition: "border 0.2s"
  }

  const optionStyle = { background: "#1a1a2e" }

  return (
    <main style={{
      background: "#0a0a0f", minHeight: "100vh",
      fontFamily: "'Inter', sans-serif", color: "#fff",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      position: "relative", overflow: "hidden",
      padding: "2rem"
    }}>

      {/* Glow */}
      <div style={{
        position: "absolute", top: "30%", left: "50%", transform: "translateX(-50%)",
        width: "600px", height: "400px",
        background: "radial-gradient(ellipse, rgba(139,92,246,0.12) 0%, transparent 70%)",
        pointerEvents: "none"
      }} />

      {/* Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "2rem" }}>
        <div style={{
          width: "36px", height: "36px", borderRadius: "10px",
          background: "linear-gradient(135deg, #8b5cf6, #6d28d9)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontWeight: "bold", fontSize: "18px",
          boxShadow: "0 0 20px rgba(139,92,246,0.4)"
        }}>B</div>
        <span style={{ fontSize: "20px", fontWeight: "600" }}>Bizora</span>
      </div>

      {/* Etapes */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "2rem" }}>
        {["Inscription", "Votre boutique", "Dashboard"].map((step, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div style={{
              width: "28px", height: "28px", borderRadius: "50%",
              background: i === 1 ? "linear-gradient(135deg, #8b5cf6, #6d28d9)" : i < 1 ? "rgba(139,92,246,0.4)" : "rgba(255,255,255,0.1)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "12px", fontWeight: "600",
              boxShadow: i === 1 ? "0 0 12px rgba(139,92,246,0.5)" : "none"
            }}>
              {i < 1 ? "✓" : i + 1}
            </div>
            <span style={{
              fontSize: "12px",
              color: i === 1 ? "#a78bfa" : "rgba(255,255,255,0.3)",
              fontWeight: i === 1 ? "600" : "400"
            }}>{step}</span>
            {i < 2 && <span style={{ color: "rgba(255,255,255,0.2)", fontSize: "12px" }}>→</span>}
          </div>
        ))}
      </div>

      {/* Card */}
      <div style={{
        width: "100%", maxWidth: "480px",
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(139,92,246,0.2)",
        borderRadius: "20px", padding: "2.5rem",
        boxShadow: "0 0 40px rgba(139,92,246,0.08)"
      }}>

        <h1 style={{ fontSize: "1.5rem", fontWeight: "700", marginBottom: "0.5rem", textAlign: "center" }}>
          Créez votre boutique 🏪
        </h1>
        <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.4)", textAlign: "center", marginBottom: "2rem" }}>
          Ces informations apparaîtront sur vos factures
        </p>

        {error && (
          <div style={{
            background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)",
            borderRadius: "10px", padding: "10px 14px", marginBottom: "1.5rem"
          }}>
            <p style={{ fontSize: "13px", color: "#f87171", margin: 0 }}>{error}</p>
          </div>
        )}

        {/* Nom boutique */}
        <div style={{ marginBottom: "1rem" }}>
          <label style={{ fontSize: "13px", color: "rgba(255,255,255,0.5)", display: "block", marginBottom: "6px" }}>
            Nom de la boutique <span style={{ color: "#a78bfa" }}>*</span>
          </label>
          <input
            type="text"
            placeholder="Ex: Boutique Mode Abidjan"
            value={nomBoutique}
            onChange={(e) => setNomBoutique(e.target.value)}
            style={inputStyle}
            onFocus={e => (e.currentTarget.style.borderColor = "rgba(139,92,246,0.6)")}
            onBlur={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")}
          />
        </div>

        {/* Description */}
        <div style={{ marginBottom: "1rem" }}>
          <label style={{ fontSize: "13px", color: "rgba(255,255,255,0.5)", display: "block", marginBottom: "6px" }}>
            Description <span style={{ color: "rgba(255,255,255,0.2)", fontSize: "11px" }}>(optionnel)</span>
          </label>
          <textarea
            placeholder="Décrivez votre boutique..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            style={{ ...inputStyle, resize: "none" }}
            onFocus={e => (e.currentTarget.style.borderColor = "rgba(139,92,246,0.6)")}
            onBlur={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")}
          />
        </div>

        {/* Téléphone + Ville */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
          <div>
            <label style={{ fontSize: "13px", color: "rgba(255,255,255,0.5)", display: "block", marginBottom: "6px" }}>
              Téléphone
            </label>
            <input
              type="text"
              placeholder="+225 07 00 00 00"
              value={telephone}
              onChange={(e) => setTelephone(e.target.value)}
              style={inputStyle}
              onFocus={e => (e.currentTarget.style.borderColor = "rgba(139,92,246,0.6)")}
              onBlur={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")}
            />
          </div>
          <div>
            <label style={{ fontSize: "13px", color: "rgba(255,255,255,0.5)", display: "block", marginBottom: "6px" }}>
              Ville
            </label>
            <input
              type="text"
              placeholder="Ex: Abidjan"
              value={ville}
              onChange={(e) => setVille(e.target.value)}
              style={inputStyle}
              onFocus={e => (e.currentTarget.style.borderColor = "rgba(139,92,246,0.6)")}
              onBlur={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")}
            />
          </div>
        </div>

        {/* Devise */}
        <div style={{ marginBottom: "2rem" }}>
          <label style={{ fontSize: "13px", color: "rgba(255,255,255,0.5)", display: "block", marginBottom: "6px" }}>
            Pays & Devise
          </label>
          <select
            value={devise}
            onChange={(e) => setDevise(e.target.value)}
            style={{ ...inputStyle, cursor: "pointer" }}
            onFocus={e => (e.currentTarget.style.borderColor = "rgba(139,92,246,0.6)")}
            onBlur={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")}
          >
            <option style={optionStyle} value="XOF-CI">🇨🇮 Côte d'Ivoire — Franc CFA (XOF)</option>
            <option style={optionStyle} value="XOF-BJ">🇧🇯 Bénin — Franc CFA (XOF)</option>
            <option style={optionStyle} value="XOF-BF">🇧🇫 Burkina Faso — Franc CFA (XOF)</option>
            <option style={optionStyle} value="XOF-GW">🇬🇼 Guinée-Bissau — Franc CFA (XOF)</option>
            <option style={optionStyle} value="XOF-ML">🇲🇱 Mali — Franc CFA (XOF)</option>
            <option style={optionStyle} value="XOF-NE">🇳🇪 Niger — Franc CFA (XOF)</option>
            <option style={optionStyle} value="XOF-SN">🇸🇳 Sénégal — Franc CFA (XOF)</option>
            <option style={optionStyle} value="XOF-TG">🇹🇬 Togo — Franc CFA (XOF)</option>
            <option style={optionStyle} value="CVE">🇨🇻 Cap-Vert — Escudo cap-verdien (CVE)</option>
            <option style={optionStyle} value="GMD">🇬🇲 Gambie — Dalasi (GMD)</option>
            <option style={optionStyle} value="GHS">🇬🇭 Ghana — Cedi ghanéen (GHS)</option>
            <option style={optionStyle} value="GNF">🇬🇳 Guinée — Franc guinéen (GNF)</option>
            <option style={optionStyle} value="LRD">🇱🇷 Liberia — Dollar libérien (LRD)</option>
            <option style={optionStyle} value="NGN">🇳🇬 Nigeria — Naira (NGN)</option>
            <option style={optionStyle} value="SLE">🇸🇱 Sierra Leone — Leone (SLE)</option>
          </select>
        </div>

        {/* Bouton */}
        <button
          onClick={handleSubmit}
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
          {loading ? "Création en cours..." : "Lancer mon dashboard →"}
        </button>

        {/* Passer */}
        <div style={{ textAlign: "center", marginTop: "1rem" }}>
          <span
            onClick={() => router.push("/dashboard")}
            style={{ fontSize: "13px", color: "rgba(255,255,255,0.25)", cursor: "pointer" }}
          >
            Passer cette étape →
          </span>
        </div>

      </div>
    </main>
  )
}