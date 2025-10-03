import { useState, useEffect } from 'react';
import { authClient } from '@/lib/auth/client';
import Link from 'next/link';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: string;
}

const Users = () => {
  const [session, setSession] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', role: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      const s = await authClient.getSession();
      setSession(s.data);
      if (s.data) {
        const res = await fetch('/api/me');
        if (res.ok) {
          const u = await res.json();
          setUser(u);
          if (u.role === 'ADMIN') fetchUsers();
        }
      }
    };
    checkSession().then(() => setLoading(false));
  }, []);

  const fetchUsers = async () => {
    const res = await fetch('/api/users');
    if (res.ok) {
      const data = await res.json();
      setUsers(data);
    }
  };

  const handleEdit = (user: User) => {
    setEditing(user.id);
    setForm({ name: user.name, role: user.role });
  };

  const handleSave = async () => {
    if (!editing) return;
    const res = await fetch(`/api/users/${editing}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      setEditing(null);
      fetchUsers();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!session || !user || user.role !== 'ADMIN') return <p>No autorizado</p>;

  return (
    <div className='min-h-screen bg-gray-100'>
      <header className='bg-white shadow p-4'>
        <div className='container mx-auto flex justify-between'>
          <h1 className='text-xl font-bold'>Gestión de Usuarios</h1>
          <Link href='/' className='text-blue-500'>
            Volver al Inicio
          </Link>
        </div>
      </header>
      <main className='container mx-auto p-4'>
        <table className='w-full bg-white shadow rounded'>
          <thead>
            <tr className='bg-gray-200'>
              <th className='p-2'>Nombre</th>
              <th className='p-2'>Correo</th>
              <th className='p-2'>Teléfono</th>
              <th className='p-2'>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className='border-t'>
                <td className='p-2'>
                  {editing === u.id ? (
                    <input
                      value={form.name}
                      onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                      }
                      className='border p-1'
                    />
                  ) : (
                    u.name
                  )}
                </td>
                <td className='p-2'>{u.email}</td>
                <td className='p-2'>{u.phone || '-'}</td>
                <td className='p-2'>
                  {editing === u.id ? (
                    <div>
                      <select
                        value={form.role}
                        onChange={(e) =>
                          setForm({ ...form, role: e.target.value })
                        }
                        className='border p-1 mr-2'
                      >
                        <option value='USER'>USER</option>
                        <option value='ADMIN'>ADMIN</option>
                      </select>
                      <button
                        onClick={handleSave}
                        className='bg-blue-500 text-white px-2 py-1 rounded mr-2'
                      >
                        Guardar
                      </button>
                      <button
                        onClick={() => setEditing(null)}
                        className='bg-gray-500 text-white px-2 py-1 rounded'
                      >
                        Cancelar
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleEdit(u)}
                      className='bg-yellow-500 text-white px-2 py-1 rounded'
                    >
                      Editar
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </div>
  );
};

export default Users;
