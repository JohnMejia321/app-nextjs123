import { useState, useEffect } from 'react';
import Link from 'next/link';
import { authClient } from '@/lib/auth/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const Home = () => {
  const [session, setSession] = useState<any>(null);
  const [user, setUser] = useState<any>(null);

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
      }
    };
    checkSession();
  }, []);

  const handleSignIn = async () => {
    await authClient.signIn.social({ provider: 'github' });
  };

  const handleSignOut = async () => {
    await authClient.signOut();
    setSession(null);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">Sistema de Gestión Financiera</h1>
          {session && (
            <div className="flex items-center space-x-4">
              <span>Hola, {session.user.name}</span>
              <button onClick={handleSignOut} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition-colors">
                Cerrar Sesión
              </button>
            </div>
          )}
        </div>
      </header>
      <main className="container mx-auto p-4">
        {session ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link href="/movements">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <CardTitle>Gestión de Ingresos y Gastos</CardTitle>
                  <CardDescription>Ver y agregar movimientos financieros.</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">Accede a la lista completa de ingresos y egresos, agrega nuevos movimientos y mantén un registro detallado de tus finanzas.</p>
                </CardContent>
              </Card>
            </Link>
            {user?.role === 'ADMIN' && (
              <>
                <Link href="/users">
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardHeader>
                      <CardTitle>Gestión de Usuarios</CardTitle>
                      <CardDescription>Administrar usuarios del sistema.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600">Gestiona los usuarios registrados, edita sus roles y mantén el control de acceso al sistema.</p>
                    </CardContent>
                  </Card>
                </Link>
                <Link href="/reports">
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardHeader>
                      <CardTitle>Reportes</CardTitle>
                      <CardDescription>Ver reportes y descargar datos.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600">Visualiza gráficos de movimientos financieros, consulta el saldo actual y descarga reportes en formato CSV.</p>
                    </CardContent>
                  </Card>
                </Link>
              </>
            )}
          </div>
        ) : (
          <Card className="max-w-md mx-auto">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Bienvenido al Sistema de Gestión Financiera</CardTitle>
              <CardDescription>Inicia sesión para acceder a tus finanzas</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-sm text-gray-600 mb-6">Utiliza tu cuenta de GitHub para autenticarte de forma segura.</p>
              <button
                onClick={handleSignIn}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                Iniciar Sesión con GitHub
              </button>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default Home;
