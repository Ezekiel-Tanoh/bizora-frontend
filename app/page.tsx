"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import api from "@/lib/api"

export default function Home() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleLogin = async () => {
    setLoading(true)
    setError("")
    try {
      const response = await api.post("/auth/login", { email, password })
      localStorage.setItem("bizora_token", response.data.token)
      localStorage.setItem("bizora_user", JSON.stringify(response.data.user))
      router.push("/dashboard")
    } catch (err: any) {
      setError(err.response?.data?.message || "Email ou mot de passe incorrect")
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
          <p className="text-sm text-gray-500">Connectez-vous à votre espace</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-100 rounded-lg px-3 py-2 mb-4">
            <p className="text-xs text-red-500">{error}</p>
          </div>
        )}

        <div className="space-y-4">
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
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-violet-500 hover:bg-violet-600 text-white rounded-lg py-2.5 text-sm font-medium transition-colors disabled:opacity-50"
          >
            {loading ? "Connexion..." : "Se connecter"}
          </button>
          <div className="text-center">
            <a href="/inscription" className="text-xs text-violet-500">Mot de passe oublié ?</a>
          </div>
        </div>

        <div className="border-t border-gray-100 mt-6 pt-6 text-center">
          <p className="text-xs text-gray-500">
            Pas encore de compte ?{" "}
            <a href="/inscription" className="text-violet-500 font-medium">S'inscrire</a>
          </p>
        </div>

      </div>
    </main>
  )
}