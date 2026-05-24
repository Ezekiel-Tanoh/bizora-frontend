"use client"

import { usePathname, useRouter } from "next/navigation"
import { useState } from "react"

const navItems = [
  { href: "/dashboard", icon: "📊", label: "Dashboard" },
  { href: "/dashboard/produits", icon: "📦", label: "Produits" },
  { href: "/dashboard/commandes", icon: "🛒", label: "Commandes" },
  { href: "/dashboard/clients", icon: "👥", label: "Clients" },
  { href: "/dashboard/stock", icon: "🏪", label: "Stock" },
  { href: "/dashboard/factures", icon: "🧾", label: "Factures" },
  { href: "/dashboard/ia", icon: "🤖", label: "IA Assistant" },
  { href: "/dashboard/parametres", icon: "⚙️", label: "Paramètres" },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = () => {
    localStorage.removeItem("bizora_token")
    localStorage.removeItem("bizora_user")
    router.push("/login")
  }

  const NavLinks = ({ onClickLink }: { onClickLink?: () => void }) => (
    <>
      {navItems.map((item) => {
        const active = pathname === item.href
        return (
          <a
            key={item.href}
            href={item.href}
            onClick={onClickLink}
            style={{
              display: "flex", alignItems: "center", gap: "10px",
              padding: "9px 12px", borderRadius: "10px",
              fontSize: "14px", textDecoration: "none",
              fontWeight: active ? "500" : "400",
              background: active ? "rgba(139,92,246,0.15)" : "transparent",
              color: active ? "#a78bfa" : "rgba(255,255,255,0.5)",
              borderLeft: active ? "2px solid #8b5cf6" : "2px solid transparent",
              transition: "all 0.15s"
            }}
            onMouseEnter={e => {
              if (!active) {
                e.currentTarget.style.background = "rgba(255,255,255,0.04)"
                e.currentTarget.style.color = "rgba(255,255,255,0.8)"
              }
            }}
            onMouseLeave={e => {
              if (!active) {
                e.currentTarget.style.background = "transparent"
                e.currentTarget.style.color = "rgba(255,255,255,0.5)"
              }
            }}
          >
            <span style={{ fontSize: "16px" }}>{item.icon}</span>
            {item.label}
          </a>
        )
      })}
    </>
  )

  return (
    <>
      {/* CSS responsive injecté globalement */}
      <style>{`
        .sidebar-desktop { display: flex !important; }
        .topbar-mobile { display: none !important; }
        .bottomnav-mobile { display: none !important; }
        .main-content { margin-left: 0; }

        @media (max-width: 768px) {
          .sidebar-desktop { display: none !important; }
          .topbar-mobile { display: flex !important; }
          .bottomnav-mobile { display: flex !important; }
          .main-content { padding: 1rem !important; padding-bottom: 80px !important; }
        }
      `}</style>

      <div style={{
        display: "flex", minHeight: "100vh",
        background: "#0a0a0f", fontFamily: "'Inter', sans-serif", color: "#fff"
      }}>

        {/* ===== SIDEBAR DESKTOP ===== */}
        <aside className="sidebar-desktop" style={{
          width: "240px", flexShrink: 0,
          background: "rgba(255,255,255,0.02)",
          borderRight: "1px solid rgba(255,255,255,0.06)",
          flexDirection: "column",
          padding: "1.5rem 1rem",
          position: "sticky", top: 0, height: "100vh"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "2rem", padding: "0 0.5rem" }}>
            <div style={{
              width: "32px", height: "32px", borderRadius: "8px",
              background: "linear-gradient(135deg, #8b5cf6, #6d28d9)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontWeight: "bold", fontSize: "16px",
              boxShadow: "0 0 16px rgba(139,92,246,0.4)"
            }}>B</div>
            <span style={{ fontSize: "18px", fontWeight: "600" }}>Bizora</span>
          </div>

          <nav style={{ display: "flex", flexDirection: "column", gap: "4px", flex: 1 }}>
            <NavLinks />
          </nav>

          <div style={{
            background: "rgba(139,92,246,0.08)",
            border: "1px solid rgba(139,92,246,0.2)",
            borderRadius: "12px", padding: "1rem", marginBottom: "1rem"
          }}>
            <p style={{ fontSize: "12px", fontWeight: "600", color: "#a78bfa", margin: "0 0 4px" }}>✨ Plan Gratuit</p>
            <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.35)", margin: "0 0 10px" }}>
              Passez au Pro pour débloquer l'IA avancée
            </p>
            <button
  onClick={() => router.push("/pricing")}
  style={{
    width: "100%", padding: "7px", borderRadius: "8px", border: "none",
    background: "linear-gradient(135deg, #8b5cf6, #6d28d9)",
    color: "#fff", fontSize: "12px", fontWeight: "600", cursor: "pointer",
    boxShadow: "0 0 12px rgba(139,92,246,0.3)"
  }}
>
  Passer au Pro →
</button>
          </div>

          <button onClick={handleLogout} style={{
            display: "flex", alignItems: "center", gap: "8px",
            padding: "9px 12px", borderRadius: "10px", border: "none",
            background: "transparent", color: "rgba(255,255,255,0.3)",
            fontSize: "13px", cursor: "pointer", width: "100%", transition: "all 0.15s"
          }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(239,68,68,0.08)"; e.currentTarget.style.color = "#f87171" }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "rgba(255,255,255,0.3)" }}
          >
            🚪 Se déconnecter
          </button>
        </aside>

        {/* ===== TOPBAR MOBILE ===== */}
        <div className="topbar-mobile" style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
          background: "rgba(10,10,15,0.95)", backdropFilter: "blur(12px)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          padding: "0 1rem", height: "56px",
          alignItems: "center", justifyContent: "space-between"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div style={{
              width: "28px", height: "28px", borderRadius: "7px",
              background: "linear-gradient(135deg, #8b5cf6, #6d28d9)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontWeight: "bold", fontSize: "14px",
              boxShadow: "0 0 12px rgba(139,92,246,0.4)"
            }}>B</div>
            <span style={{ fontSize: "16px", fontWeight: "600" }}>Bizora</span>
          </div>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            style={{
              background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "8px", padding: "6px 10px", color: "#fff",
              fontSize: "18px", cursor: "pointer"
            }}
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>

        {/* ===== MENU MOBILE OVERLAY ===== */}
        {menuOpen && (
          <div style={{
            position: "fixed", inset: 0, zIndex: 99,
            background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)"
          }}
            onClick={() => setMenuOpen(false)}
          >
            <div style={{
              position: "absolute", top: "56px", left: 0, right: 0,
              background: "#13131f",
              borderBottom: "1px solid rgba(139,92,246,0.2)",
              padding: "1rem",
            }}
              onClick={e => e.stopPropagation()}
            >
              <nav style={{ display: "flex", flexDirection: "column", gap: "4px", marginBottom: "1rem" }}>
                <NavLinks onClickLink={() => setMenuOpen(false)} />
              </nav>
              <button onClick={handleLogout} style={{
                width: "100%", padding: "10px", borderRadius: "10px", border: "none",
                background: "rgba(239,68,68,0.08)", color: "#f87171",
                fontSize: "13px", cursor: "pointer"
              }}>
                🚪 Se déconnecter
              </button>
            </div>
          </div>
        )}

        {/* ===== BOTTOM NAV MOBILE ===== */}
        <div className="bottomnav-mobile" style={{
          position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 100,
          background: "rgba(10,10,15,0.97)", backdropFilter: "blur(12px)",
          borderTop: "1px solid rgba(255,255,255,0.06)",
          padding: "0.5rem 0",
          justifyContent: "space-around", alignItems: "center"
        }}>
          {navItems.slice(0, 5).map((item) => {
            const active = pathname === item.href
            return (
              <a
                key={item.href}
                href={item.href}
                style={{
                  display: "flex", flexDirection: "column", alignItems: "center",
                  gap: "2px", textDecoration: "none", padding: "4px 8px",
                  borderRadius: "8px",
                  color: active ? "#a78bfa" : "rgba(255,255,255,0.35)",
                  transition: "all 0.15s"
                }}
              >
                <span style={{ fontSize: "20px" }}>{item.icon}</span>
                <span style={{ fontSize: "9px", fontWeight: active ? "600" : "400" }}>
                  {item.label}
                </span>
              </a>
            )
          })}
        </div>

        {/* ===== MAIN CONTENT ===== */}
        <main className="main-content" style={{
          flex: 1, padding: "2rem",
          background: "#0a0a0f",
          minHeight: "100vh", overflowY: "auto"
        }}>
          <div style={{
            position: "fixed", top: "10%", right: "10%",
            width: "400px", height: "300px",
            background: "radial-gradient(ellipse, rgba(139,92,246,0.06) 0%, transparent 70%)",
            pointerEvents: "none", zIndex: 0
          }} />

          {/* Espace topbar mobile */}
          <div className="topbar-mobile" style={{ height: "56px", display: "none" }} />

          <div style={{ position: "relative", zIndex: 1 }}>
            {children}
          </div>
        </main>

      </div>
    </>
  )
}