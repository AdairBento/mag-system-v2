export default function DashboardPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Total Veículos</h3>
          <p className="text-3xl font-bold mt-2">42</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Locações Ativas</h3>
          <p className="text-3xl font-bold mt-2">8</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Receita Mensal</h3>
          <p className="text-3xl font-bold mt-2">R$ 45.230</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Taxa Ocupação</h3>
          <p className="text-3xl font-bold mt-2">87%</p>
        </div>
      </div>
    </div>
  );
}
