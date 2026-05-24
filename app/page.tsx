"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function LandingPage() {
  const router = useRouter()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <main style={{ background: "#0a0a0f", minHeight: "100vh", fontFamily: "'Inter', sans-serif", color: "#fff", overflowX: "hidden" }}>

      {/* NAVBAR */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        padding: "1rem 2rem",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        background: scrolled ? "rgba(10,10,15,0.95)" : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(139,92,246,0.15)" : "none",
        transition: "all 0.3s ease"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{
            width: "36px", height: "36px", borderRadius: "10px",
            background: "linear-gradient(135deg, #8b5cf6, #6d28d9)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontWeight: "bold", fontSize: "18px"
          }}>B</div>
          <span style={{ fontSize: "20px", fontWeight: "600" }}>Bizora</span>
        </div>
        <div style={{ display: "flex", gap: "12px" }}>
          <button onClick={() => router.push("/login")} style={{
            padding: "8px 20px", borderRadius: "8px", border: "1px solid rgba(139,92,246,0.4)",
            background: "transparent", color: "#a78bfa", cursor: "pointer", fontSize: "14px",
            transition: "all 0.2s"
          }}
            onMouseEnter={e => (e.currentTarget.style.background = "rgba(139,92,246,0.1)")}
            onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
          >
            Se connecter
          </button>
          <button onClick={() => router.push("/inscription")} style={{
            padding: "8px 20px", borderRadius: "8px", border: "none",
            background: "linear-gradient(135deg, #8b5cf6, #6d28d9)",
            color: "#fff", cursor: "pointer", fontSize: "14px", fontWeight: "500",
            boxShadow: "0 0 20px rgba(139,92,246,0.4)",
            transition: "all 0.2s"
          }}
            onMouseEnter={e => (e.currentTarget.style.boxShadow = "0 0 30px rgba(139,92,246,0.7)")}
            onMouseLeave={e => (e.currentTarget.style.boxShadow = "0 0 20px rgba(139,92,246,0.4)")}
          >
            S'inscrire
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section style={{
        minHeight: "100vh", display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", textAlign: "center",
        padding: "8rem 2rem 4rem", position: "relative"
      }}>
        {/* Glow background */}
        <div style={{
          position: "absolute", top: "20%", left: "50%", transform: "translateX(-50%)",
          width: "600px", height: "400px",
          background: "radial-gradient(ellipse, rgba(139,92,246,0.15) 0%, transparent 70%)",
          pointerEvents: "none"
        }} />

        <div style={{
          display: "inline-flex", alignItems: "center", gap: "8px",
          background: "rgba(139,92,246,0.1)", border: "1px solid rgba(139,92,246,0.3)",
          borderRadius: "100px", padding: "6px 16px", marginBottom: "2rem",
          fontSize: "13px", color: "#a78bfa"
        }}>
          <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#8b5cf6", display: "inline-block" }} />
          Gestion d'entreprise nouvelle génération
        </div>

        <h1 style={{
          fontSize: "clamp(2.5rem, 6vw, 4.5rem)", fontWeight: "700", lineHeight: "1.1",
          marginBottom: "1.5rem", maxWidth: "800px"
        }}>
          Vendez plus intelligent {" "}
          <span style={{
            background: "linear-gradient(135deg, #8b5cf6, #a78bfa, #c4b5fd)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent"
          }}>
            avec Bizora
          </span>
        </h1>

        <p style={{
          fontSize: "1.1rem", color: "rgba(255,255,255,0.55)", maxWidth: "520px",
          lineHeight: "1.7", marginBottom: "2.5rem"
        }}>
          Factures, stock, clients, commandes et IA intégrée — tout ce dont vous avez besoin pour faire grandir votre entreprise en Afrique.
        </p>

        <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", justifyContent: "center" }}>
          <button onClick={() => router.push("/inscription")} style={{
            padding: "14px 32px", borderRadius: "10px", border: "none",
            background: "linear-gradient(135deg, #8b5cf6, #6d28d9)",
            color: "#fff", cursor: "pointer", fontSize: "16px", fontWeight: "600",
            boxShadow: "0 0 30px rgba(139,92,246,0.5)",
            transition: "all 0.2s"
          }}
            onMouseEnter={e => (e.currentTarget.style.transform = "translateY(-2px)")}
            onMouseLeave={e => (e.currentTarget.style.transform = "translateY(0)")}
          >
            Commencer gratuitement →
          </button>
          <button onClick={() => router.push("/login")} style={{
            padding: "14px 32px", borderRadius: "10px",
            border: "1px solid rgba(255,255,255,0.1)",
            background: "rgba(255,255,255,0.05)",
            color: "#fff", cursor: "pointer", fontSize: "16px",
            transition: "all 0.2s"
          }}
            onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.08)")}
            onMouseLeave={e => (e.currentTarget.style.background = "rgba(255,255,255,0.05)")}
          >
            Se connecter
          </button>
        </div>

        {/* Stats */}
        <div style={{
          display: "flex", gap: "3rem", marginTop: "5rem",
          flexWrap: "wrap", justifyContent: "center"
        }}>
          {[
            { value: "500+", label: "Entreprises actives" },
            { value: "98%", label: "Satisfaction client" },
            { value: "3 pays", label: "Côte d'Ivoire · Sénégal · Mali" },
          ].map((stat, i) => (
            <div key={i} style={{ textAlign: "center" }}>
              <div style={{ fontSize: "2rem", fontWeight: "700", color: "#a78bfa" }}>{stat.value}</div>
              <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)", marginTop: "4px" }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section style={{ padding: "6rem 2rem", maxWidth: "1100px", margin: "0 auto" }}>
        <h2 style={{ textAlign: "center", fontSize: "2rem", fontWeight: "700", marginBottom: "1rem" }}>
          Tout ce qu'il vous faut
        </h2>
        <p style={{ textAlign: "center", color: "rgba(255,255,255,0.45)", marginBottom: "3rem" }}>
          Une plateforme complète pour les entrepreneurs africains
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem" }}>
          {[
            { icon: "📦", title: "Gestion des produits", desc: "Créez et gérez votre catalogue avec génération IA automatique." },
            { icon: "📋", title: "Commandes & Clients", desc: "Suivez vos commandes et fidélisez vos clients en temps réel." },
            { icon: "🧾", title: "Factures PDF", desc: "Générez des factures professionnelles en un clic." },
            { icon: "📊", title: "Stock intelligent", desc: "Suivez vos entrées/sorties et recevez des alertes automatiques." },
            { icon: "🤖", title: "IA intégrée", desc: "Assistant IA pour analyser vos données et suggérer des actions." },
            { icon: "💳", title: "Mobile Money", desc: "Orange Money, Wave, MTN — paiements locaux intégrés." },
          ].map((f, i) => (
            <div key={i} style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: "16px", padding: "1.5rem",
              transition: "all 0.3s",
              cursor: "default"
            }}
              onMouseEnter={e => {
                e.currentTarget.style.background = "rgba(139,92,246,0.08)"
                e.currentTarget.style.borderColor = "rgba(139,92,246,0.3)"
                e.currentTarget.style.transform = "translateY(-4px)"
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = "rgba(255,255,255,0.03)"
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"
                e.currentTarget.style.transform = "translateY(0)"
              }}
            >
              <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>{f.icon}</div>
              <h3 style={{ fontSize: "1rem", fontWeight: "600", marginBottom: "0.5rem" }}>{f.title}</h3>
              <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.45)", lineHeight: "1.6" }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA FINAL */}
      <section style={{
        padding: "6rem 2rem", textAlign: "center", position: "relative"
      }}>
        <div style={{
          position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)",
          width: "500px", height: "300px",
          background: "radial-gradient(ellipse, rgba(139,92,246,0.12) 0%, transparent 70%)",
          pointerEvents: "none"
        }} />
        <h2 style={{ fontSize: "2.2rem", fontWeight: "700", marginBottom: "1rem" }}>
          Prêt à transformer votre business ?
        </h2>
        <p style={{ color: "rgba(255,255,255,0.45)", marginBottom: "2rem" }}>
          Rejoignez des centaines d'entrepreneurs qui font confiance à Bizora.
        </p>
        <button onClick={() => router.push("/inscription")} style={{
          padding: "16px 40px", borderRadius: "12px", border: "none",
          background: "linear-gradient(135deg, #8b5cf6, #6d28d9)",
          color: "#fff", cursor: "pointer", fontSize: "17px", fontWeight: "600",
          boxShadow: "0 0 40px rgba(139,92,246,0.5)",
          transition: "all 0.2s"
        }}
          onMouseEnter={e => (e.currentTarget.style.transform = "translateY(-3px)")}
          onMouseLeave={e => (e.currentTarget.style.transform = "translateY(0)")}
        >
          Créer mon compte gratuitement →
        </button>
      </section>

      {/* FOOTER */}
      <footer style={{
        borderTop: "1px solid rgba(255,255,255,0.07)",
        padding: "2rem", textAlign: "center",
        color: "rgba(255,255,255,0.3)", fontSize: "13px"
      }}>
        © 2025 Bizora · devellopeur independant 
      </footer>

    </main>
  )
}