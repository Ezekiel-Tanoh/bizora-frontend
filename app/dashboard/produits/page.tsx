export default function Produits() {
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Produits</h1>
          <p className="text-sm text-gray-500 mt-1">Gérez votre catalogue de produits</p>
        </div>
        <button className="bg-violet-500 hover:bg-violet-600 text-white text-sm rounded-lg px-4 py-2 transition-colors">
          + Ajouter un produit
        </button>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <p className="text-xs text-gray-500 mb-1">Total produits</p>
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
          <p className="text-xs text-gray-500 mb-1">Rupture de stock</p>
          <p className="text-2xl font-semibold text-red-400">0</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100">
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <input
            type="text"
            placeholder=" Rechercher un produit..."
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-violet-400 w-64"
          />
          <select className="border border-gray-200 rounded-lg px-2 py-3 text-sm outline-none text-gray-600">
            <option>Toutes les catégories</option>
            <option>Mode</option>
            <option>Alimentation</option>
            <option>Électronique</option>
            <option>Beauté</option>
             <option>technologie</option>
              <option>Beauté</option>
          </select>
        </div>

        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left text-xs text-gray-500 font-medium p-4">Produit</th>
              <th className="text-left text-xs text-gray-500 font-medium p-4">Catégorie</th>
              <th className="text-left text-xs text-gray-500 font-medium p-4">Prix</th>
              <th className="text-left text-xs text-gray-500 font-medium p-4">Stock</th>
              <th className="text-left text-xs text-gray-500 font-medium p-4">Statut</th>
              <th className="text-left text-xs text-gray-500 font-medium p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={6} className="text-center py-16">
                <p className="text-gray-400 text-sm">Aucun produit pour l'instant</p>
                <p className="text-gray-300 text-xs mt-1">Cliquez sur "Ajouter un produit" pour commencer</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}