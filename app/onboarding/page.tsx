"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import api from "@/lib/api"

const PAYS = [
  { code: "XOF-CI", pays: "Côte d'Ivoire", devise: "Franc CFA (XOF)", flag: "https://flagcdn.com/w40/ci.png" },
  { code: "XOF-BJ", pays: "Bénin", devise: "Franc CFA (XOF)", flag: "https://flagcdn.com/w40/bj.png" },
  { code: "XOF-BF", pays: "Burkina Faso", devise: "Franc CFA (XOF)", flag: "https://flagcdn.com/w40/bf.png" },
  { code: "XOF-GW", pays: "Guinée-Bissau", devise: "Franc CFA (XOF)", flag: "https://flagcdn.com/w40/gw.png" },
  { code: "XOF-ML", pays: "Mali", devise: "Franc CFA (XOF)", flag: "https://flagcdn.com/w40/ml.png" },
  { code: "XOF-NE", pays: "Niger", devise: "Franc CFA (XOF)", flag: "https://flagcdn.com/w40/ne.png" },
  { code: "XOF-SN", pays: "Sénégal", devise: "Franc CFA (XOF)", flag: "https://flagcdn.com/w40/sn.png" },
  { code: "XOF-TG", pays: "Togo", devise: "Franc CFA (XOF)", flag: "https://flagcdn.com/w40/tg.png" },
  { code: "CVE", pays: "Cap-Vert", devise: "Escudo cap-verdien (CVE)", flag: "https://flagcdn.com/w40/cv.png" },
  { code: "GMD", pays: "Gambie", devise: "Dalasi (GMD)", flag: "https://flagcdn.com/w40/gm.png" },
  { code: "GHS", pays: "Ghana", devise: "Cedi ghanéen (GHS)", flag: "https://flagcdn.com/w40/gh.png" },
  { code: "GNF", pays: "Guinée", devise: "Franc guinéen (GNF)", flag: "https://flagcdn.com/w40/gn.png" },
  { code: "LRD", pays: "Liberia", devise: "Dollar libérien (LRD)", flag: "https://flagcdn.com/w40/lr.png" },
  { code: "NGN", pays: "Nigeria", devise: "Naira (NGN)", flag: "https://flagcdn.com/w40/ng.png" },
  { code: "SLE", pays: "Sierra Leone", devise: "Leone (SLE)", flag: "https://flagcdn.com/w40/sl.png" },
]

export default function Onboarding() {
  const router = useRouter()
  const [nomBoutique, setNomBoutique] = useState("")
  const [description, setDescription] = useState("")
  const [telephone, setTelephone] = useState("")
  const [ville, setVille] = useState("")
  const [devise, setDevise] = useState(PAYS[0])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [search, setSearch] = useState("")
  const dropdownRef = useRef<HTMLDivElement>(null)

  const filtered = PAYS.filter(p =>
    p.pays.toLowerCase().includes(search.toLowerCase()) ||
    p.devise.toLowerCase().includes(search.toLowerCase())
  )

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [])

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
        devise: devise.code
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

        {/* Sélecteur pays custom */}
        <div style={{ marginBottom: "2rem", position: "relative" }} ref={dropdownRef}>
          <label style={{ fontSize: "13px", color: "rgba(255,255,255,0.5)", display: "block", marginBottom: "6px" }}>
            Pays & Devise
          </label>

          {/* Bouton trigger */}
          <div
            onClick={() => setDropdownOpen(!dropdownOpen)}
            style={{
              ...inputStyle,
              display: "flex", alignItems: "center", justifyContent: "space-between",
              cursor: "pointer",
              borderColor: dropdownOpen ? "rgba(139,92,246,0.6)" : "rgba(255,255,255,0.1)"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <img
                src={devise.flag}
                alt={devise.pays}
                style={{ width: "24px", height: "16px", borderRadius: "3px", objectFit: "cover" }}
              />
              <span style={{ fontSize: "14px" }}>{devise.pays}</span>
              <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.35)" }}>{devise.devise}</span>
            </div>
            <span style={{
              color: "rgba(255,255,255,0.4)", fontSize: "12px",
              transform: dropdownOpen ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.2s"
            }}>▼</span>
          </div>

          {/* Dropdown */}
          {dropdownOpen && (
            <div style={{
              position: "absolute", top: "calc(100% + 6px)", left: 0, right: 0, zIndex: 50,
              background: "#13131f",
              border: "1px solid rgba(139,92,246,0.3)",
              borderRadius: "12px",
              overflow: "hidden",
              boxShadow: "0 8px 32px rgba(0,0,0,0.5)"
            }}>
              {/* Search */}
              <div style={{ padding: "10px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                <input
                  type="text"
                  placeholder="🔍 Rechercher un pays..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  autoFocus
                  style={{
                    ...inputStyle,
                    padding: "8px 12px",
                    fontSize: "13px",
                    background: "rgba(255,255,255,0.05)"
                  }}
                />
              </div>

              {/* Liste */}
              <div style={{ maxHeight: "220px", overflowY: "auto" }}>
                {filtered.length === 0 ? (
                  <div style={{ padding: "16px", textAlign: "center", color: "rgba(255,255,255,0.3)", fontSize: "13px" }}>
                    Aucun pays trouvé
                  </div>
                ) : (
                  filtered.map((p) => (
                    <div
                      key={p.code}
                      onClick={() => {
                        setDevise(p)
                        setDropdownOpen(false)
                        setSearch("")
                      }}
                      style={{
                        display: "flex", alignItems: "center", gap: "12px",
                        padding: "10px 14px", cursor: "pointer",
                        background: devise.code === p.code ? "rgba(139,92,246,0.15)" : "transparent",
                        transition: "background 0.15s"
                      }}
                      onMouseEnter={e => {
                        if (devise.code !== p.code)
                          e.currentTarget.style.background = "rgba(255,255,255,0.05)"
                      }}
                      onMouseLeave={e => {
                        if (devise.code !== p.code)
                          e.currentTarget.style.background = "transparent"
                      }}
                    >
                      <img
                        src={p.flag}
                        alt={p.pays}
                        style={{ width: "28px", height: "18px", borderRadius: "3px", objectFit: "cover", flexShrink: 0 }}
                      />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: "14px", fontWeight: "500" }}>{p.pays}</div>
                        <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.35)" }}>{p.devise}</div>
                      </div>
                      {devise.code === p.code && (
                        <span style={{ color: "#a78bfa", fontSize: "14px" }}>✓</span>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
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