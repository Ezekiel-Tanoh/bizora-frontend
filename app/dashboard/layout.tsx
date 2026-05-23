"use client"

import { usePathname, useRouter } from "next/navigation"

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

  const handleLogout = () => {
    localStorage.removeItem("bizora_token")
    localStorage.removeItem("bizora_user")
    router.push("/login")
  }

  return (
    <div style={{
      display: "flex", minHeight: "100vh",
      background: "#0a0a0f", fontFamily: "'Inter', sans-serif", color: "#fff"
    }}>

      {/* SIDEBAR */}
      <aside style={{
        width: "240px", flexShrink: 0,
        background: "rgba(255,255,255,0.02)",
        borderRight: "1px solid rgba(255,255,255,0.06)",
        display: "flex", flexDirection: "column",
        padding: "1.5rem 1rem",
        position: "sticky", top: 0, height: "100vh"
      }}>

        {/* Logo */}
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

        {/* Nav */}
        <nav style={{ display: "flex", flexDirection: "column", gap: "4px", flex: 1 }}>
          {navItems.map((item) => {
            const active = pathname === item.href
            return (
              <a
                key={item.href}
                href={item.href}
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
        </nav>

        {/* Plan gratuit */}
        <div style={{
          background: "rgba(139,92,246,0.08)",
          border: "1px solid rgba(139,92,246,0.2)",
          borderRadius: "12px", padding: "1rem", marginBottom: "1rem"
        }}>
          <p style={{ fontSize: "12px", fontWeight: "600", color: "#a78bfa", margin: "0 0 4px" }}>
            ✨ Plan Gratuit
          </p>
          <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.35)", margin: "0 0 10px" }}>
            Passez au Pro pour débloquer l'IA avancée
          </p>
          <button style={{
            width: "100%", padding: "7px", borderRadius: "8px", border: "none",
            background: "linear-gradient(135deg, #8b5cf6, #6d28d9)",
            color: "#fff", fontSize: "12px", fontWeight: "600", cursor: "pointer",
            boxShadow: "0 0 12px rgba(139,92,246,0.3)"
          }}>
            Passer au Pro →
          </button>
        </div>

        {/* Déconnexion */}
        <button
          onClick={handleLogout}
          style={{
            display: "flex", alignItems: "center", gap: "8px",
            padding: "9px 12px", borderRadius: "10px", border: "none",
            background: "transparent", color: "rgba(255,255,255,0.3)",
            fontSize: "13px", cursor: "pointer", width: "100%",
            transition: "all 0.15s"
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = "rgba(239,68,68,0.08)"
            e.currentTarget.style.color = "#f87171"
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = "transparent"
            e.currentTarget.style.color = "rgba(255,255,255,0.3)"
          }}
        >
          🚪 Se déconnecter
        </button>

      </aside>

      {/* MAIN */}
      <main style={{
        flex: 1, padding: "2rem",
        background: "#0a0a0f",
        minHeight: "100vh", overflowY: "auto"
      }}>

        {/* Glow subtil en arrière plan */}
        <div style={{
          position: "fixed", top: "10%", right: "10%",
          width: "400px", height: "300px",
          background: "radial-gradient(ellipse, rgba(139,92,246,0.06) 0%, transparent 70%)",
          pointerEvents: "none", zIndex: 0
        }} />

        <div style={{ position: "relative", zIndex: 1 }}>
          {children}
        </div>

      </main>

    </div>
  )
}