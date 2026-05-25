"use client"

import { Suspense } from "react"
import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import api from "@/lib/api"

function ConfirmationContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [statut, setStatut] = useState<"loading" | "success" | "failed" | "cancel">("loading")
  const [montant, setMontant] = useState(0)

  useEffect(() => {
    const payment = searchParams.get("payment")
    const token = searchParams.get("token")

    if (payment === "cancel") {
      setStatut("cancel")
      return
    }

    if (token) {
      api.get(`/payments/verify/${token}`)
        .then((res) => {
          if (res.data.status === "completed") {
            setStatut("success")
            setMontant(res.data.montant)
          } else {
            setStatut("failed")
          }
        })
        .catch(() => setStatut("failed"))
    } else {
      setStatut("failed")
    }
  }, [searchParams])

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0d0d1a",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "'Inter', sans-serif",
      padding: "1rem"
    }}>
      <div style={{
        background: "#13131f",
        border: "1px solid rgba(139,92,246,0.2)",
        borderRadius: "20px",
        padding: "2.5rem",
        width: "100%",
        maxWidth: "420px",
        textAlign: "center",
        boxShadow: "0 0 60px rgba(139,92,246,0.12)",
        color: "#fff"
      }}>

        {statut === "loading" && (
          <>
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>⏳</div>
            <h2 style={{ fontSize: "1.2rem", fontWeight: "700" }}>
              Vérification du paiement...
            </h2>
          </>
        )}

        {statut === "success" && (
          <>
            <div style={{
              width: "72px", height: "72px", borderRadius: "50%",
              background: "rgba(52,211,153,0.1)",
              border: "1px solid rgba(52,211,153,0.3)",
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 1.5rem", fontSize: "2.5rem"
            }}>✅</div>
            <h2 style={{ fontSize: "1.3rem", fontWeight: "700", marginBottom: "0.5rem" }}>
              Paiement réussi !
            </h2>
            <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)", marginBottom: "1.5rem" }}>
              Votre paiement a été confirmé avec succès.
            </p>
            {montant > 0 && (
              <div style={{
                background: "rgba(52,211,153,0.08)",
                border: "1px solid rgba(52,211,153,0.2)",
                borderRadius: "12px", padding: "1rem", marginBottom: "1.5rem"
              }}>
                <p style={{ fontSize: "1.6rem", fontWeight: "700", color: "#34d399", margin: 0 }}>
                  {montant.toLocaleString()} FCFA
                </p>
              </div>
            )}
            <button onClick={() => router.push("/dashboard/commandes")} style={{
              width: "100%", padding: "12px", borderRadius: "10px", border: "none",
              background: "linear-gradient(135deg, #8b5cf6, #6d28d9)",
              color: "#fff", fontSize: "14px", fontWeight: "600", cursor: "pointer"
            }}>
              Voir mes commandes
            </button>
          </>
        )}

        {statut === "cancel" && (
          <>
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>❌</div>
            <h2 style={{ fontSize: "1.2rem", fontWeight: "700", marginBottom: "0.5rem" }}>
              Paiement annulé
            </h2>
            <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)", marginBottom: "1.5rem" }}>
              Vous avez annulé le paiement.
            </p>
            <button onClick={() => router.push("/dashboard/commandes")} style={{
              width: "100%", padding: "12px", borderRadius: "10px", border: "none",
              background: "linear-gradient(135deg, #8b5cf6, #6d28d9)",
              color: "#fff", fontSize: "14px", fontWeight: "600", cursor: "pointer"
            }}>
              Retour aux commandes
            </button>
          </>
        )}

        {statut === "failed" && (
          <>
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>⚠️</div>
            <h2 style={{ fontSize: "1.2rem", fontWeight: "700", marginBottom: "0.5rem" }}>
              Paiement échoué
            </h2>
            <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)", marginBottom: "1.5rem" }}>
              Une erreur est survenue lors du paiement.
            </p>
            <button onClick={() => router.push("/dashboard/commandes")} style={{
              width: "100%", padding: "12px", borderRadius: "10px", border: "none",
              background: "linear-gradient(135deg, #8b5cf6, #6d28d9)",
              color: "#fff", fontSize: "14px", fontWeight: "600", cursor: "pointer"
            }}>
              Retour aux commandes
            </button>
          </>
        )}

      </div>
    </div>
  )
}

export default function ConfirmationPage() {
  return (
    <Suspense fallback={<div style={{ color: "#fff", textAlign: "center", marginTop: "5rem" }}>Chargement...</div>}>
      <ConfirmationContent />
    </Suspense>
  )
}