"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"

const PAYS = [
  { code: "XOF-CI", pays: "Côte d'Ivoire", devise: "Franc CFA (XOF)", flag: "https://flagcdn.com/w40/ci.png" },
  { code: "XOF-BJ", pays: "Bénin", devise: "Franc CFA (XOF)", flag: "https://flagcdn.com/w40/bj.png" },
  { code: "XOF-BF", pays: "Burkina Faso", devise: "Franc CFA (XOF)", flag: "https://flagcdn.com/w40/bf.png" },
  { code: "XOF-ML", pays: "Mali", devise: "Franc CFA (XOF)", flag: "https://flagcdn.com/w40/ml.png" },
  { code: "XOF-NE", pays: "Niger", devise: "Franc CFA (XOF)", flag: "https://flagcdn.com/w40/ne.png" },
  { code: "XOF-SN", pays: "Sénégal", devise: "Franc CFA (XOF)", flag: "https://flagcdn.com/w40/sn.png" },
  { code: "XOF-TG", pays: "Togo", devise: "Franc CFA (XOF)", flag: "https://flagcdn.com/w40/tg.png" },
  { code: "GHS", pays: "Ghana", devise: "Cedi ghanéen (GHS)", flag: "https://flagcdn.com/w40/gh.png" },
  { code: "NGN", pays: "Nigeria", devise: "Naira (NGN)", flag: "https://flagcdn.com/w40/ng.png" },
  { code: "GNF", pays: "Guinée", devise: "Franc guinéen (GNF)", flag: "https://flagcdn.com/w40/gn.png" },
  { code: "GMD", pays: "Gambie", devise: "Dalasi (GMD)", flag: "https://flagcdn.com/w40/gm.png" },
]

const cardStyle = {
  background: "rgba(255,255,255,0.03)",
  border: "1px solid rgba(255,255,255,0.07)",
  borderRadius: "16px",
  padding: "1.5rem",
}

const inputStyle = {
  width: "100%", padding: "10px 14px", borderRadius: "10px",
  background: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(255,255,255,0.1)",
  color: "#fff", fontSize: "13px", outline: "none",
  boxSizing: "border-box" as any, transition: "border 0.2s"
}

export default function Parametres() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [nomBoutique, setNomBoutique] = useState("")
  const [description, setDescription] = useState("")
  const [telephone, setTelephone] = useState("")
  const [ville, setVille] = useState("")
  const [pays, setPays] = useState(PAYS[0])
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [search, setSearch] = useState("")
  const [notifications, setNotifications] = useState({
    commandes: true, stock: true, clients: false, rapports: false
  })
  const [saved, setSaved] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const filtered = PAYS.filter(p =>
    p.pays.toLowerCase().includes(search.toLowerCase()) ||
    p.devise.toLowerCase().includes(search.toLowerCase())
  )

  useEffect(() => {
    const userData = localStorage.getItem("bizora_user")
    if (userData) setUser(JSON.parse(userData))
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [])

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div style={{ color: "#fff", fontFamily: "'Inter', sans-serif" }}>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <div>
          <h1 style={{ fontSize: "1.5rem", fontWeight: "700", margin: 0 }}>Paramètres</h1>
          <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.4)", margin: "4px 0 0" }}>
            Gérez votre boutique et votre compte
          </p>
        </div>
        <button
          onClick={handleSave}
          style={{
            padding: "10px 20px", borderRadius: "10px", border: "none",
            background: saved ? "rgba(52,211,153,0.2)" : "linear-gradient(135deg, #8b5cf6, #6d28d9)",
            color: saved ? "#34d399" : "#fff",
            fontSize: "14px", fontWeight: "600", cursor: "pointer",
            boxShadow: saved ? "0 0 20px rgba(52,211,153,0.2)" : "0 0 20px rgba(139,92,246,0.3)",
            border: saved ? "1px solid rgba(52,211,153,0.3)" : "none" as any,
            transition: "all 0.3s"
          }}
        >
          {saved ? "✓ Sauvegardé !" : "Sauvegarder"}
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "1.5rem" }}>

        {/* Colonne gauche */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>

          {/* Boutique */}
          <div style={cardStyle}>
            <h2 style={{ fontSize: "14px", fontWeight: "600", margin: "0 0 1.25rem", color: "rgba(255,255,255,0.8)" }}>
              🏪 Informations boutique
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <label style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", display: "block", marginBottom: "6px" }}>
                  Nom de la boutique
                </label>
                <input
                  type="text"
                  placeholder="Ex: Boutique Mode Abidjan"
                  value={nomBoutique}
                  onChange={e => setNomBoutique(e.target.value)}
                  style={inputStyle}
                  onFocus={e => (e.currentTarget.style.borderColor = "rgba(139,92,246,0.6)")}
                  onBlur={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")}
                />
              </div>
              <div>
                <label style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", display: "block", marginBottom: "6px" }}>
                  Description
                </label>
                <textarea
                  placeholder="Décrivez votre boutique..."
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  rows={3}
                  style={{ ...inputStyle, resize: "none" }}
                  onFocus={e => (e.currentTarget.style.borderColor = "rgba(139,92,246,0.6)")}
                  onBlur={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")}
                />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", display: "block", marginBottom: "6px" }}>
                    Téléphone
                  </label>
                  <input
                    type="text"
                    placeholder="+225 07 00 00 00 00"
                    value={telephone}
                    onChange={e => setTelephone(e.target.value)}
                    style={inputStyle}
                    onFocus={e => (e.currentTarget.style.borderColor = "rgba(139,92,246,0.6)")}
                    onBlur={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")}
                  />
                </div>
                <div>
                  <label style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", display: "block", marginBottom: "6px" }}>
                    Ville
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Abidjan"
                    value={ville}
                    onChange={e => setVille(e.target.value)}
                    style={inputStyle}
                    onFocus={e => (e.currentTarget.style.borderColor = "rgba(139,92,246,0.6)")}
                    onBlur={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")}
                  />
                </div>
              </div>

              {/* Sélecteur pays */}
              <div style={{ position: "relative" }} ref={dropdownRef}>
                <label style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", display: "block", marginBottom: "6px" }}>
                  Pays & Devise
                </label>
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
                    <img src={pays.flag} alt={pays.pays} style={{ width: "24px", height: "16px", borderRadius: "3px", objectFit: "cover" }} />
                    <span style={{ fontSize: "13px" }}>{pays.pays}</span>
                    <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.35)" }}>{pays.devise}</span>
                  </div>
                  <span style={{
                    color: "rgba(255,255,255,0.4)", fontSize: "12px",
                    transform: dropdownOpen ? "rotate(180deg)" : "rotate(0deg)",
                    transition: "transform 0.2s"
                  }}>▼</span>
                </div>

                {dropdownOpen && (
                  <div style={{
                    position: "absolute", top: "calc(100% + 6px)", left: 0, right: 0, zIndex: 50,
                    background: "#13131f",
                    border: "1px solid rgba(139,92,246,0.3)",
                    borderRadius: "12px", overflow: "hidden",
                    boxShadow: "0 8px 32px rgba(0,0,0,0.5)"
                  }}>
                    <div style={{ padding: "10px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                      <input
                        type="text"
                        placeholder="🔍 Rechercher un pays..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        autoFocus
                        style={{ ...inputStyle, padding: "8px 12px", fontSize: "12px" }}
                      />
                    </div>
                    <div style={{ maxHeight: "200px", overflowY: "auto" }}>
                      {filtered.map(p => (
                        <div
                          key={p.code}
                          onClick={() => { setPays(p); setDropdownOpen(false); setSearch("") }}
                          style={{
                            display: "flex", alignItems: "center", gap: "12px",
                            padding: "10px 14px", cursor: "pointer",
                            background: pays.code === p.code ? "rgba(139,92,246,0.15)" : "transparent",
                            transition: "background 0.15s"
                          }}
                          onMouseEnter={e => { if (pays.code !== p.code) e.currentTarget.style.background = "rgba(255,255,255,0.05)" }}
                          onMouseLeave={e => { if (pays.code !== p.code) e.currentTarget.style.background = "transparent" }}
                        >
                          <img src={p.flag} alt={p.pays} style={{ width: "24px", height: "16px", borderRadius: "3px", objectFit: "cover" }} />
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: "13px", fontWeight: "500" }}>{p.pays}</div>
                            <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.35)" }}>{p.devise}</div>
                          </div>
                          {pays.code === p.code && <span style={{ color: "#a78bfa", fontSize: "14px" }}>✓</span>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Compte */}
          <div style={cardStyle}>
            <h2 style={{ fontSize: "14px", fontWeight: "600", margin: "0 0 1.25rem", color: "rgba(255,255,255,0.8)" }}>
              👤 Informations personnelles
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", display: "block", marginBottom: "6px" }}>Prénom</label>
                  <input type="text" defaultValue={user?.name?.split(" ")[0]} style={inputStyle}
                    onFocus={e => (e.currentTarget.style.borderColor = "rgba(139,92,246,0.6)")}
                    onBlur={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")}
                  />
                </div>
                <div>
                  <label style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", display: "block", marginBottom: "6px" }}>Nom</label>
                  <input type="text" defaultValue={user?.name?.split(" ")[1]} style={inputStyle}
                    onFocus={e => (e.currentTarget.style.borderColor = "rgba(139,92,246,0.6)")}
                    onBlur={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")}
                  />
                </div>
              </div>
              <div>
                <label style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", display: "block", marginBottom: "6px" }}>Email</label>
                <input type="email" defaultValue={user?.email} style={inputStyle}
                  onFocus={e => (e.currentTarget.style.borderColor = "rgba(139,92,246,0.6)")}
                  onBlur={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")}
                />
              </div>
              <div>
                <label style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", display: "block", marginBottom: "6px" }}>
                  Nouveau mot de passe
                </label>
                <input type="password" placeholder="••••••••" style={inputStyle}
                  onFocus={e => (e.currentTarget.style.borderColor = "rgba(139,92,246,0.6)")}
                  onBlur={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")}
                />
              </div>
            </div>
          </div>

          {/* Zone danger */}
          <div style={{ ...cardStyle, borderColor: "rgba(239,68,68,0.2)", background: "rgba(239,68,68,0.03)" }}>
            <h2 style={{ fontSize: "14px", fontWeight: "600", margin: "0 0 1rem", color: "#f87171" }}>
              ⚠️ Zone dangereuse
            </h2>
            <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)", margin: "0 0 1rem" }}>
              Ces actions sont irréversibles. Procédez avec prudence.
            </p>
            <button style={{
              padding: "9px 18px", borderRadius: "10px",
              background: "rgba(239,68,68,0.1)",
              border: "1px solid rgba(239,68,68,0.3)",
              color: "#f87171", fontSize: "13px", fontWeight: "500", cursor: "pointer"
            }}>
              Supprimer mon compte
            </button>
          </div>
        </div>

        {/* Colonne droite */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>

          {/* Logo */}
          <div style={cardStyle}>
            <h2 style={{ fontSize: "14px", fontWeight: "600", margin: "0 0 1.25rem", color: "rgba(255,255,255,0.8)" }}>
              🖼️ Logo boutique
            </h2>
            <div style={{
              border: "2px dashed rgba(255,255,255,0.1)", borderRadius: "12px",
              padding: "2rem", textAlign: "center"
            }}>
              <div style={{
                width: "64px", height: "64px", borderRadius: "14px",
                background: "linear-gradient(135deg, #8b5cf6, #6d28d9)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "26px", fontWeight: "bold", margin: "0 auto 1rem",
                boxShadow: "0 0 24px rgba(139,92,246,0.4)"
              }}>B</div>
              <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.3)", margin: "0 0 1rem" }}>
                PNG, JPG jusqu'à 2MB
              </p>
              <button style={{
                fontSize: "12px", padding: "7px 16px", borderRadius: "8px",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "rgba(255,255,255,0.6)", cursor: "pointer"
              }}>
                Changer le logo
              </button>
            </div>
          </div>

          {/* Abonnement */}
          <div style={cardStyle}>
            <h2 style={{ fontSize: "14px", fontWeight: "600", margin: "0 0 1.25rem", color: "rgba(255,255,255,0.8)" }}>
              📦 Mon abonnement
            </h2>
            <div style={{
              background: "rgba(139,92,246,0.08)",
              border: "1px solid rgba(139,92,246,0.2)",
              borderRadius: "10px", padding: "1rem", marginBottom: "1rem"
            }}>
              <p style={{ fontSize: "13px", fontWeight: "600", color: "#a78bfa", margin: "0 0 4px" }}>✨ Plan Gratuit</p>
              <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.35)", margin: 0 }}>20 produits maximum</p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "1rem" }}>
              {["IA complète", "Produits illimités", "Analytics avancés", "Support prioritaire"].map((f, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ color: "#8b5cf6", fontSize: "12px" }}>→</span>
                  <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)" }}>{f}</span>
                </div>
              ))}
            </div>
            <button style={{
              width: "100%", padding: "10px", borderRadius: "10px", border: "none",
              background: "linear-gradient(135deg, #8b5cf6, #6d28d9)",
              color: "#fff", fontSize: "13px", fontWeight: "600", cursor: "pointer",
              boxShadow: "0 0 12px rgba(139,92,246,0.3)"
            }}>
              Passer au Pro →
            </button>
          </div>

          {/* Notifications */}
          <div style={cardStyle}>
            <h2 style={{ fontSize: "14px", fontWeight: "600", margin: "0 0 1.25rem", color: "rgba(255,255,255,0.8)" }}>
              🔔 Notifications
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              {[
                { key: "commandes", label: "Nouvelles commandes" },
                { key: "stock", label: "Stock faible" },
                { key: "clients", label: "Nouveaux clients" },
                { key: "rapports", label: "Rapports hebdomadaires" },
              ].map((notif) => (
                <div key={notif.key} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.6)", margin: 0 }}>{notif.label}</p>
                  <div
                    onClick={() => setNotifications(prev => ({ ...prev, [notif.key]: !prev[notif.key as keyof typeof prev] }))}
                    style={{
                      width: "36px", height: "20px", borderRadius: "100px", cursor: "pointer",
                      background: notifications[notif.key as keyof typeof notifications]
                        ? "linear-gradient(135deg, #8b5cf6, #6d28d9)"
                        : "rgba(255,255,255,0.1)",
                      position: "relative", transition: "all 0.2s",
                      boxShadow: notifications[notif.key as keyof typeof notifications] ? "0 0 8px rgba(139,92,246,0.4)" : "none"
                    }}
                  >
                    <div style={{
                      width: "14px", height: "14px", borderRadius: "50%",
                      background: "#fff", position: "absolute",
                      top: "3px",
                      left: notifications[notif.key as keyof typeof notifications] ? "19px" : "3px",
                      transition: "all 0.2s"
                    }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}