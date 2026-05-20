export default function Clients() {
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Clients</h1>
          <p className="text-sm text-gray-500 mt-1">Gérez votre base de clients</p>
        </div>
        <button className="bg-violet-500 hover:bg-violet-600 text-white text-sm rounded-lg px-4 py-2 transition-colors">
          + Ajouter un client
        </button>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <p className="text-xs text-gray-500 mb-1">Mes Clients</p>
          <p className="text-2xl font-semibold text-gray-900">0</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <p className="text-xs text-gray-500 mb-1">Nouveaux clients</p>
          <p className="text-2xl font-semibold text-violet-500">0</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <p className="text-xs text-gray-500 mb-1">Clients fidèles</p>
          <p className="text-2xl font-semibold text-green-500">0</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <p className="text-xs text-gray-500 mb-1">Panier </p>
          <p className="text-2xl font-semibold text-gray-900">0 FCFA</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100">

        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <input
            type="text"
            placeholder="🔍 Rechercher un client..."
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-violet-400 w-64"
          />
          <select className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none text-gray-600">
            <option>Tous les clients</option>
            <option>Clients fidèles</option>
            <option>Nouveaux clients</option>
            <option>Clients inactifs</option>
          </select>
        </div>

        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left text-xs text-gray-500 font-medium p-4">Client</th>
              <th className="text-left text-xs text-gray-500 font-medium p-4">Téléphone</th>
              <th className="text-left text-xs text-gray-500 font-medium p-4">Email</th>
              <th className="text-left text-xs text-gray-500 font-medium p-4">Commandes</th>
              <th className="text-left text-xs text-gray-500 font-medium p-4">Total dépensé</th>
              <th className="text-left text-xs text-gray-500 font-medium p-4">Depuis</th>
              <th className="text-left text-xs text-gray-500 font-medium p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={7} className="text-center py-16">
                <p className="text-gray-400 text-sm">Aucun client pour l'instant</p>
                <p className="text-gray-300 text-xs mt-1">Vos clients apparaîtront ici</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}