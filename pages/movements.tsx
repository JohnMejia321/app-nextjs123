import { useState, useEffect } from 'react';
import { authClient } from '@/lib/auth/client';
import Link from 'next/link';

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
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow p-4">
        <div className="container mx-auto flex justify-between">
          <h1 className="text-xl font-bold">Gestión de Ingresos y Gastos</h1>
          <Link href="/" className="text-blue-500">Volver al Inicio</Link>
        </div>
      </header>
      <main className="container mx-auto p-4">
        {user?.role === 'ADMIN' && (
          <button onClick={() => setShowForm(!showForm)} className="bg-green-500 text-white px-4 py-2 rounded mb-4">
            Nuevo Movimiento
          </button>
        )}
        {showForm && (
          <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow mb-4">
            <input
              type="text"
              placeholder="Concepto"
              value={form.concept}
              onChange={(e) => setForm({ ...form, concept: e.target.value })}
              className="border p-2 w-full mb-2"
              required
            />
            <input
              type="number"
              placeholder="Monto"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
              className="border p-2 w-full mb-2"
              required
            />
            <select
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
              className="border p-2 w-full mb-2"
              required
            >
              <option value="INCOME">Ingreso</option>
              <option value="EXPENSE">Egreso</option>
            </select>
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              className="border p-2 w-full mb-2"
              required
            />
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Guardar</button>
          </form>
        )}
        <table className="w-full bg-white shadow rounded">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2">Concepto</th>
              <th className="p-2">Tipo</th>
              <th className="p-2">Monto</th>
              <th className="p-2">Fecha</th>
              <th className="p-2">Usuario</th>
            </tr>
          </thead>
          <tbody>
            {movements.map((m) => (
              <tr key={m.id} className="border-t">
                <td className="p-2">{m.concept}</td>
                <td className="p-2">{m.type === 'INCOME' ? 'Ingreso' : 'Egreso'}</td>
                <td className="p-2">{m.amount}</td>
                <td className="p-2">{new Date(m.date).toLocaleDateString()}</td>
                <td className="p-2">{m.user.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </div>
  );
};

export default Movements;