"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import api from "@/lib/api"

export default function Inscription() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleRegister = async () => {
    setLoading(true)
    setError("")
    try {
      const response = await api.post("/auth/register", { name, email, password })
      localStorage.setItem("bizora_token", response.data.token)
      localStorage.setItem("bizora_user", JSON.stringify(response.data.user))
      router.push("/dashboard")
    } catch (err: any) {
      setError(err.response?.data?.message || "Une erreur est survenue")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl border border-gray-100 p-8 w-full max-w-sm">

        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-3">
            <div className="w-9 h-9 rounded-lg bg-violet-500 flex items-center justify-center">
              <span className="text-white font-bold text-lg">B</span>
            </div>
            <span className="text-2xl font-semibold text-gray-900">Bizora</span>
          </div>
          <p className="text-sm text-gray-500">Créez votre compte gratuitement</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-100 rounded-lg px-3 py-2 mb-4">
            <p className="text-xs text-red-500">{error}</p>
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Nom complet</label>
            <input
              type="text"
              placeholder="Votre nom"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-violet-400"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Email</label>
            <input
              type="email"
              placeholder="vous@exemple.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-violet-400"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Mot de passe</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-violet-400"
            />
          </div>
          <button
            onClick={handleRegister}
            disabled={loading}
            className="w-full bg-violet-500 hover:bg-violet-600 text-white rounded-lg py-2.5 text-sm font-medium transition-colors disabled:opacity-50"
          >
            {loading ? "Création..." : "Créer mon compte"}
          </button>
        </div>

        <div className="border-t border-gray-100 mt-6 pt-6 text-center">
          <p className="text-xs text-gray-500">
            Déjà un compte ?{" "}
            <a href="/" className="text-violet-500 font-medium">Se connecter</a>
          </p>
        </div>

      </div>
    </main>
  )
}