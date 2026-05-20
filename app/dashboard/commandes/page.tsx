export default function Commandes() {
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Commandes</h1>
          <p className="text-sm text-gray-500 mt-1">Gérez toutes vos commandes</p>
        </div>
        <button className="bg-violet-500 hover:bg-violet-600 text-white text-sm rounded-lg px-4 py-2 transition-colors">
          + Nouvelle commande
        </button>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <p className="text-xs text-gray-500 mb-1">Total commandes</p>
          <p className="text-2xl font-semibold text-gray-900">0</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <p className="text-xs text-gray-500 mb-1">En attente</p>
          <p className="text-2xl font-semibold text-orange-400">0</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <p className="text-xs text-gray-500 mb-1">Livrées</p>
          <p className="text-2xl font-semibold text-green-500">0</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <p className="text-xs text-gray-500 mb-1">Annulées</p>
          <p className="text-2xl font-semibold text-red-400">0</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100">

        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <input
            type="text"
            placeholder="🔍 Rechercher une commande..."
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-violet-400 w-64"
          />
          <select className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none text-gray-600">
            <option>Tous les statuts</option>
            <option>En attente</option>
            <option>Confirmé</option>
            <option>Expédié</option>
            <option>Livré</option>
            <option>Annulé</option>
          </select>
        </div>

        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left text-xs text-gray-500 font-medium p-4">N° Commande</th>
              <th className="text-left text-xs text-gray-500 font-medium p-4">Client</th>
              <th className="text-left text-xs text-gray-500 font-medium p-4">Produits</th>
              <th className="text-left text-xs text-gray-500 font-medium p-4">Total</th>
              <th className="text-left text-xs text-gray-500 font-medium p-4">Statut</th>
              <th className="text-left text-xs text-gray-500 font-medium p-4">Date</th>
              <th className="text-left text-xs text-gray-500 font-medium p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={7} className="text-center py-16">
                <p className="text-gray-400 text-sm">Aucune commande pour l'instant</p>
                <p className="text-gray-300 text-xs mt-1">Vos commandes apparaîtront ici</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}