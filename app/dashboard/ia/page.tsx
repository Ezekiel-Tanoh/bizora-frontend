export default function IAAssistant() {
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">🤖 IA Assistant</h1>
          <p className="text-sm text-gray-500 mt-1">Votre assistant business intelligent</p>
        </div>
        <div className="bg-violet-50 rounded-lg px-4 py-2">
          <p className="text-xs text-violet-600 font-medium">Plan Pro requis pour l'IA complète</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-gray-100 p-5 cursor-pointer hover:border-violet-200 transition-colors">
          <div className="w-10 h-10 bg-violet-50 rounded-lg flex items-center justify-center mb-3">
            <span className="text-xl">📝</span>
          </div>
          <h3 className="text-sm font-semibold text-gray-900 mb-1">Générer description produit</h3>
          <p className="text-xs text-gray-500">L'IA génère une description professionnelle pour vos produits</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-5 cursor-pointer hover:border-violet-200 transition-colors">
          <div className="w-10 h-10 bg-violet-50 rounded-lg flex items-center justify-center mb-3">
            <span className="text-xl">📊</span>
          </div>
          <h3 className="text-sm font-semibold text-gray-900 mb-1">Analyser mes ventes</h3>
          <p className="text-xs text-gray-500">Obtenez des insights intelligents sur vos performances</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-5 cursor-pointer hover:border-violet-200 transition-colors">
          <div className="w-10 h-10 bg-violet-50 rounded-lg flex items-center justify-center mb-3">
            <span className="text-xl">📱</span>
          </div>
          <h3 className="text-sm font-semibold text-gray-900 mb-1">Créer post marketing</h3>
          <p className="text-xs text-gray-500">Générez des posts Facebook et WhatsApp automatiquement</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-5 cursor-pointer hover:border-violet-200 transition-colors">
          <div className="w-10 h-10 bg-violet-50 rounded-lg flex items-center justify-center mb-3">
            <span className="text-xl">📦</span>
          </div>
          <h3 className="text-sm font-semibold text-gray-900 mb-1">Recommandations stock</h3>
          <p className="text-xs text-gray-500">L'IA vous dit quoi restockers et quand</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-5 cursor-pointer hover:border-violet-200 transition-colors">
          <div className="w-10 h-10 bg-violet-50 rounded-lg flex items-center justify-center mb-3">
            <span className="text-xl">👥</span>
          </div>
          <h3 className="text-sm font-semibold text-gray-900 mb-1">Analyser mes clients</h3>
          <p className="text-xs text-gray-500">Découvrez vos meilleurs clients et leurs habitudes</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-5 cursor-pointer hover:border-violet-200 transition-colors">
          <div className="w-10 h-10 bg-violet-50 rounded-lg flex items-center justify-center mb-3">
            <span className="text-xl">💰</span>
          </div>
          <h3 className="text-sm font-semibold text-gray-900 mb-1">Prédictions ventes</h3>
          <p className="text-xs text-gray-500">Anticipez vos revenus des prochains mois</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <h2 className="text-sm font-semibold text-gray-900 mb-4">💬 Chat avec l'IA</h2>

        <div className="bg-gray-50 rounded-xl p-4 h-72 mb-4 overflow-y-auto flex flex-col gap-3">

          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-lg bg-violet-500 flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xs font-bold">IA</span>
            </div>
            <div className="bg-white rounded-xl rounded-tl-none border border-gray-100 p-3 max-w-md">
              <p className="text-sm text-gray-700">
                Bonjour ! Je suis votre assistant IA Bizora. Je peux vous aider à :
              </p>
              <ul className="text-sm text-gray-600 mt-2 space-y-1">
                <li>• Analyser vos ventes et performances</li>
                <li>• Générer des descriptions de produits</li>
                <li>• Créer du contenu marketing</li>
                <li>• Recommander des actions business</li>
              </ul>
              <p className="text-sm text-gray-700 mt-2">Comment puis-je vous aider aujourd'hui ?</p>
            </div>
          </div>

        </div>

        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Ex: Quel produit se vend le plus ? Génère une promotion..."
            className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-violet-400"
          />
          <button className="bg-violet-500 hover:bg-violet-600 text-white rounded-lg px-6 py-2 text-sm transition-colors">
            Envoyer
          </button>
        </div>

        <div className="flex gap-2 mt-3">
          <button className="text-xs bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-lg px-3 py-1.5 transition-colors">
            Quel produit se vend le plus ?
          </button>
          <button className="text-xs bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-lg px-3 py-1.5 transition-colors">
            Que dois-je restockers ?
          </button>
          <button className="text-xs bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-lg px-3 py-1.5 transition-colors">
            Génère une promotion
          </button>
        </div>
      </div>
    </div>
  );
}