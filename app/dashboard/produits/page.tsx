"use client"

import { useState } from "react"

export default function Produits() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div>
      <button
        onClick={() => {
          console.log("Bouton cliqué !")
          setIsOpen(true)
        }}
        className="bg-violet-500 text-white px-4 py-2 rounded-lg"
      >
        + Ajouter un produit
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4">Nouveau produit</h2>
            <button
              onClick={() => setIsOpen(false)}
              className="bg-red-500 text-white px-4 py-2 rounded-lg"
            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </div>
  )
}