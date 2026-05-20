export default function Factures() {
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Factures</h1>
          <p className="text-sm text-gray-500 mt-1">Gérez vos factures et devis</p>
        </div>
        <button className="bg-violet-500 hover:bg-violet-600 text-white text-sm rounded-lg px-4 py-2 transition-colors">
          + Nouvelle facture
        </button>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <p className="text-xs text-gray-500 mb-1">Total factures</p>
          <p className="text-2xl font-semibold text-gray-900">0</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <p className="text-xs text-gray-500 mb-1">Payées</p>
          <p className="text-2xl font-semibold text-green-500">0</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <p className="text-xs text-gray-500 mb-1">En attente</p>
          <p className="text-2xl font-semibold text-orange-400">0</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <p className="text-xs text-gray-500 mb-1">Montant total</p>
          <p className="text-2xl font-semibold text-violet-500">0 FCFA</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100">

        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <input
            type="text"
            placeholder="🔍 Rechercher une facture..."
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-violet-400 w-64"
          />
          <div className="flex gap-2">
            <select className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none text-gray-600">
              <option>Tous les statuts</option>
              <option>Payée</option>
              <option>En attente</option>
              <option>Annulée</option>
            </select>
            <button className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 transition-colors">
              📥 Exporter
            </button>
          </div>
        </div>

        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left text-xs text-gray-500 font-medium p-4">N° Facture</th>
              <th className="text-left text-xs text-gray-500 font-medium p-4">Client</th>
              <th className="text-left text-xs text-gray-500 font-medium p-4">Date</th>
              <th className="text-left text-xs text-gray-500 font-medium p-4">Montant</th>
              <th className="text-left text-xs text-gray-500 font-medium p-4">Statut</th>
              <th className="text-left text-xs text-gray-500 font-medium p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={6} className="text-center py-16">
                <p className="text-gray-400 text-sm">Aucune facture pour l'instant</p>
                <p className="text-gray-300 text-xs mt-1">Vos factures apparaîtront ici</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}