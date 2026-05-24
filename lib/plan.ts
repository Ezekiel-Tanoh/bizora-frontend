export type Plan = "gratuit" | "pro" | "business"

export function getPlan(): Plan {
  if (typeof window === "undefined") return "gratuit"
  const user = localStorage.getItem("bizora_user")
  if (!user) return "gratuit"
  const parsed = JSON.parse(user)
  return parsed.plan || "gratuit"
}

export const limites = {
  gratuit: {
    produits: 20,
    clients: 50,
    factures: 10,
    ia: false,
    analytics: false,
    multiBoutiques: false,
  },
  pro: {
    produits: Infinity,
    clients: Infinity,
    factures: Infinity,
    ia: true,
    analytics: true,
    multiBoutiques: false,
  },
  business: {
    produits: Infinity,
    clients: Infinity,
    factures: Infinity,
    ia: true,
    analytics: true,
    multiBoutiques: true,
  },
}