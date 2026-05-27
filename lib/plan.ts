export type Plan = "gratuit" | "business"

export function getPlan(): Plan {
  if (typeof window === "undefined") return "gratuit"
  const user = localStorage.getItem("bizora_user")
  if (!user) return "gratuit"
  const parsed = JSON.parse(user)
  return parsed.plan || "gratuit"
}

export const limites = {
  gratuit: {
    ia: true,
    produits: Infinity,
    clients: Infinity,
    factures: Infinity,
    analytics: true,
    multiBoutiques: false,
    exports: true,
    branding: false,
    whatsapp: false,
    rapportsAuto: false,
    predictionsIA: false,
  },
  business: {
    ia: true,
    produits: Infinity,
    clients: Infinity,
    factures: Infinity,
    analytics: true,
    multiBoutiques: true,
    exports: true,
    branding: true,
    whatsapp: true,
    rapportsAuto: true,
    predictionsIA: true,
  },
}

export const prixPlans = {
  gratuit: { mensuel: 0, annuel: 0, label: "Gratuit" },
  business: { mensuel: 15000, annuel: 150000, label: "Business" },
}