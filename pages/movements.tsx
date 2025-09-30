import { useState, useEffect } from 'react';
import { authClient } from '@/lib/auth/client';
import Link from 'next/link';
import { ArrowLeft, Plus, TrendingUp, TrendingDown } from 'lucide-react';

interface Movement {
  id: string;
  concept: string;
  amount: number;
  type: string;
  date: string;
  user: { name: string; email: string };
}

const Movements = () => {
  const [session, setSession] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [movements, setMovements] = useState<Movement[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ concept: '', amount: '', type: 'INCOME', date: '' });

  useEffect(() => {
    const checkSession = async () => {
      const s = await authClient.getSession();
      setSession(s.data);
      if (s.data) {
        const res = await fetch('/api/me');
        if (res.ok) {
          const u = await res.json();
          setUser(u);
        }
        fetchMovements();
      }
    };
    checkSession();
  }, []);

  const fetchMovements = async () => {
    const res = await fetch('/api/movements');
    if (res.ok) {
      const data = await res.json();
      setMovements(data);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/movements', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      setForm({ concept: '', amount: '', type: 'INCOME', date: '' });
      setShowForm(false);
      fetchMovements();
    }
  };

  if (!session) return <p>Cargando...</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      <header className="bg-gradient-to-r from-green-600 to-blue-600 shadow-lg p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <TrendingUp className="h-8 w-8 text-white" />
            <h1 className="text-2xl font-bold text-white">Gestión de Ingresos y Gastos</h1>
          </div>
          <Link href="/" className="flex items-center space-x-2 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-all duration-200 backdrop-blur-sm">
            <ArrowLeft className="h-4 w-4" />
            <span>Volver al Inicio</span>
          </Link>
        </div>
      </header>
      <main className="container mx-auto p-4">
        {user?.role === 'ADMIN' && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center space-x-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-3 rounded-xl mb-6 transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            <Plus className="h-5 w-5" />
            <span>Nuevo Movimiento</span>
          </button>
        )}
        {showForm && (
          <div className="bg-white p-6 rounded-xl shadow-xl mb-6 border border-gray-200">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Agregar Nuevo Movimiento</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Concepto</label>
                  <input
                    type="text"
                    placeholder="Descripción del movimiento"
                    value={form.concept}
                    onChange={(e) => setForm({ ...form, concept: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                  <select
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  >
                    <option value="INCOME">Ingreso</option>
                    <option value="EXPENSE">Egreso</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Monto</label>
                  <input
                    type="number"
                    placeholder="0.00"
                    value={form.amount}
                    onChange={(e) => setForm({ ...form, amount: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
                  <input
                    type="date"
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  Guardar Movimiento
                </button>
              </div>
            </form>
          </div>
        )}
        <div className="bg-white shadow-xl rounded-xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
              <tr>
                <th className="p-4 text-left font-semibold text-gray-700">Concepto</th>
                <th className="p-4 text-left font-semibold text-gray-700">Tipo</th>
                <th className="p-4 text-left font-semibold text-gray-700">Monto</th>
                <th className="p-4 text-left font-semibold text-gray-700">Fecha</th>
                <th className="p-4 text-left font-semibold text-gray-700">Usuario</th>
              </tr>
            </thead>
            <tbody>
              {movements.map((m) => (
                <tr key={m.id} className="border-t border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="p-4">{m.concept}</td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      m.type === 'INCOME'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {m.type === 'INCOME' ? (
                        <TrendingUp className="w-3 h-3 mr-1" />
                      ) : (
                        <TrendingDown className="w-3 h-3 mr-1" />
                      )}
                      {m.type === 'INCOME' ? 'Ingreso' : 'Egreso'}
                    </span>
                  </td>
                  <td className={`p-4 font-semibold ${
                    m.type === 'INCOME' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    ${m.amount}
                  </td>
                  <td className="p-4 text-gray-600">{new Date(m.date).toLocaleDateString()}</td>
                  <td className="p-4 text-gray-600">{m.user.name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default Movements;