export default function Stock() {
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Stock</h1>
          <p className="text-sm text-gray-500 mt-1">Gérez votre inventaire</p>
        </div>
        <button className="bg-violet-500 hover:bg-violet-600 text-white text-sm rounded-lg px-4 py-2 transition-colors">
          + Ajouter un mouvement
        </button>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <p className="text-xs text-gray-500 mb-1">Total articles</p>
          <p className="text-2xl font-semibold text-gray-900">0</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <p className="text-xs text-gray-500 mb-1">En stock</p>
          <p className="text-2xl font-semibold text-green-500">0</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <p className="text-xs text-gray-500 mb-1">Stock faible</p>
          <p className="text-2xl font-semibold text-orange-400">0</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <p className="text-xs text-gray-500 mb-1">Rupture</p>
          <p className="text-2xl font-semibold text-red-400">0</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-6">

        <div className="bg-orange-50 rounded-xl border border-orange-100 p-5">
          <h2 className="text-sm font-semibold text-orange-700 mb-3">⚠️ Alertes stock faible</h2>
          <div className="text-center py-6">
            <p className="text-orange-400 text-sm">Aucune alerte pour l'instant</p>
            <p className="text-orange-300 text-xs mt-1">Les produits en stock faible apparaîtront ici</p>
          </div>
        </div>

        <div className="bg-red-50 rounded-xl border border-red-100 p-5">
          <h2 className="text-sm font-semibold text-red-700 mb-3">🚨 Ruptures de stock</h2>
          <div className="text-center py-6">
            <p className="text-red-400 text-sm">Aucune rupture pour l'instant</p>
            <p className="text-red-300 text-xs mt-1">Les produits en rupture apparaîtront ici</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100">

        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <input
            type="text"
            placeholder="🔍 Rechercher un produit..."
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-violet-400 w-64"
          />
          <select className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none text-gray-600">
            <option>Tous les statuts</option>
            <option>En stock</option>
            <option>Stock faible</option>
            <option>Rupture</option>
          </select>
        </div>

        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left text-xs text-gray-500 font-medium p-4">Produit</th>
              <th className="text-left text-xs text-gray-500 font-medium p-4">Catégorie</th>
              <th className="text-left text-xs text-gray-500 font-medium p-4">Stock actuel</th>
              <th className="text-left text-xs text-gray-500 font-medium p-4">Stock minimum</th>
              <th className="text-left text-xs text-gray-500 font-medium p-4">Statut</th>
              <th className="text-left text-xs text-gray-500 font-medium p-4">Dernière mise à jour</th>
              <th className="text-left text-xs text-gray-500 font-medium p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={7} className="text-center py-16">
                <p className="text-gray-400 text-sm">Aucun article en stock pour l'instant</p>
                <p className="text-gray-300 text-xs mt-1">Ajoutez des produits pour gérer votre stock</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}