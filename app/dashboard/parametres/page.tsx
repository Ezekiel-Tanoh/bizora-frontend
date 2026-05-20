export default function Parametres() {
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Paramètres</h1>
          <p className="text-sm text-gray-500 mt-1">Gérez votre boutique et votre compte</p>
        </div>
        <button className="bg-violet-500 hover:bg-violet-600 text-white text-sm rounded-lg px-4 py-2 transition-colors">
          Sauvegarder
        </button>
      </div>

      <div className="grid grid-cols-3 gap-6">

        <div className="col-span-2 flex flex-col gap-6">

          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <h2 className="text-sm font-semibold text-gray-900 mb-4">🏪 Informations boutique</h2>
            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Nom de la boutique</label>
                <input
                  type="text"
                  placeholder="Ex: Boutique Mode Abidjan"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-violet-400"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Description</label>
                <textarea
                  placeholder="Décrivez votre boutique..."
                  rows={3}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-violet-400 resize-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Téléphone</label>
                  <input
                    type="text"
                    placeholder="+225 07 00 00 00 00"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-violet-400"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Ville</label>
                  <input
                    type="text"
                    placeholder="Ex: Abidjan"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-violet-400"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">WhatsApp Business</label>
                <input
                  type="text"
                  placeholder="+225 07 00 00 00 00"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-violet-400"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <h2 className="text-sm font-semibold text-gray-900 mb-4">👤 Informations personnelles</h2>
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Prénom</label>
                  <input
                    type="text"
                    placeholder="Votre prénom"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-violet-400"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Nom</label>
                  <input
                    type="text"
                    placeholder="Votre nom"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-violet-400"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Email</label>
                <input
                  type="email"
                  placeholder="votre@email.com"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-violet-400"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Nouveau mot de passe</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-violet-400"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <h2 className="text-sm font-semibold text-gray-900 mb-4">💰 Devise et taxes</h2>
            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Devise</label>
                <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none text-gray-600">
                  <option>FCFA - Franc CFA</option>
                  <option>USD - Dollar américain</option>
                  <option>EUR - Euro</option>
                  <option>GHS - Cedi ghanéen</option>
                  <option>NGN - Naira nigérian</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Taux de taxe (%)</label>
                <input
                  type="number"
                  placeholder="Ex: 18"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-violet-400"
                />
              </div>
            </div>
          </div>

        </div>

        <div className="flex flex-col gap-6">

          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <h2 className="text-sm font-semibold text-gray-900 mb-4">🖼️ Logo boutique</h2>
            <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center">
              <div className="w-16 h-16 bg-violet-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                <span className="text-white font-bold text-2xl">B</span>
              </div>
              <p className="text-xs text-gray-500 mb-3">PNG, JPG jusqu'à 2MB</p>
              <button className="text-xs bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-lg px-4 py-2 transition-colors">
                Changer le logo
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <h2 className="text-sm font-semibold text-gray-900 mb-4">📦 Mon abonnement</h2>
            <div className="bg-violet-50 rounded-lg p-4 mb-4">
              <p className="text-sm font-semibold text-violet-700">Plan Gratuit</p>
              <p className="text-xs text-violet-500 mt-1">20 produits maximum</p>
            </div>
            <button className="w-full bg-violet-500 hover:bg-violet-600 text-white text-sm rounded-lg py-2 transition-colors">
              Passer au Pro
            </button>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <h2 className="text-sm font-semibold text-gray-900 mb-4">🔔 Notifications</h2>
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">Nouvelles commandes</p>
                <div className="w-10 h-5 bg-violet-500 rounded-full cursor-pointer"></div>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">Stock faible</p>
                <div className="w-10 h-5 bg-violet-500 rounded-full cursor-pointer"></div>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">Nouveaux clients</p>
                <div className="w-10 h-5 bg-gray-200 rounded-full cursor-pointer"></div>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">Rapports hebdomadaires</p>
                <div className="w-10 h-5 bg-gray-200 rounded-full cursor-pointer"></div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}