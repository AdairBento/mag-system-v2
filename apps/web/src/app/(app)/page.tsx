export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-gray-600 mt-2">Bem-vindo ao Sistema MAG de Gestão de Locação</p>
      </div>

      {/* Placeholder para métricas e widgets */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-lg border p-6">
            <div className="text-sm font-medium text-gray-600">Métrica {i}</div>
            <div className="text-2xl font-bold mt-2">-</div>
          </div>
        ))}
      </div>
    </div>
  );
}
