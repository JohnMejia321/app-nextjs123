import { useState, useEffect } from 'react';
import Link from 'next/link';
import { authClient } from '@/lib/auth/client';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  TrendingUp,
  Users,
  BarChart3,
  FileText,
  LogOut,
  Github,
} from 'lucide-react';

const Home = () => {
  const [session, setSession] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
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
        }
      }
    };
    checkSession().then(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center'>
        <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500'></div>
      </div>
    );
  }

  const handleSignIn = async () => {
    await authClient.signIn.social({ provider: 'github' });
  };

  const handleSignOut = async () => {
    await authClient.signOut();
    setSession(null);
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50'>
      <header className='bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg p-4'>
        <div className='container mx-auto flex justify-between items-center'>
          <div className='flex items-center space-x-3'>
            <TrendingUp className='h-8 w-8 text-white' />
            <h1 className='text-2xl font-bold text-white'>
              Sistema de Gestión Financiera
            </h1>
          </div>
          {session && (
            <div className='flex items-center space-x-4'>
              <div className='flex items-center space-x-2 text-white'>
                <span className='font-medium'>Hola, {session.user.name}</span>
              </div>
              <button
                onClick={handleSignOut}
                className='flex items-center space-x-2 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-all duration-200 backdrop-blur-sm'
              >
                <LogOut className='h-4 w-4' />
                <span>Cerrar Sesión</span>
              </button>
            </div>
          )}
        </div>
      </header>
      <main className='container mx-auto p-4'>
        {session ? (
          <div className='grid grid-cols-4 gap-6'>
            <Link href='/movements'>
              <Card className='h-full hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer border-l-4 border-l-green-500 bg-gradient-to-br from-green-50 to-white'>
                <CardHeader className='pb-3'>
                  <div className='flex items-center space-x-3'>
                    <div className='p-2 bg-green-100 rounded-lg'>
                      <TrendingUp className='h-6 w-6 text-green-600' />
                    </div>
                    <div>
                      <CardTitle className='text-lg'>
                        Gestión de Ingresos y Gastos
                      </CardTitle>
                      <CardDescription>
                        Ver y agregar movimientos
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className='flex-1'>
                  <p className='text-sm text-gray-600'>
                    Accede a la lista completa de ingresos y egresos, agrega
                    nuevos movimientos y mantén un registro detallado de tus
                    finanzas.
                  </p>
                </CardContent>
              </Card>
            </Link>
            {user?.role === 'ADMIN' && (
              <>
                <Link href='/users'>
                  <Card className='h-full hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer border-l-4 border-l-blue-500 bg-gradient-to-br from-blue-50 to-white'>
                    <CardHeader className='pb-3'>
                      <div className='flex items-center space-x-3'>
                        <div className='p-2 bg-blue-100 rounded-lg'>
                          <Users className='h-6 w-6 text-blue-600' />
                        </div>
                        <div>
                          <CardTitle className='text-lg'>
                            Gestión de Usuarios
                          </CardTitle>
                          <CardDescription>
                            Administrar usuarios
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className='flex-1'>
                      <p className='text-sm text-gray-600'>
                        Gestiona los usuarios registrados, edita sus roles y
                        mantén el control de acceso al sistema.
                      </p>
                    </CardContent>
                  </Card>
                </Link>
                <Link href='/reports'>
                  <Card className='h-full hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer border-l-4 border-l-purple-500 bg-gradient-to-br from-purple-50 to-white'>
                    <CardHeader className='pb-3'>
                      <div className='flex items-center space-x-3'>
                        <div className='p-2 bg-purple-100 rounded-lg'>
                          <BarChart3 className='h-6 w-6 text-purple-600' />
                        </div>
                        <div>
                          <CardTitle className='text-lg'>Reportes</CardTitle>
                          <CardDescription>
                            Ver reportes y descargar datos
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className='flex-1'>
                      <p className='text-sm text-gray-600'>
                        Visualiza gráficos de movimientos financieros, consulta
                        el saldo actual y descarga reportes en formato CSV.
                      </p>
                    </CardContent>
                  </Card>
                </Link>
                <Link href='/docs'>
                  <Card className='h-full hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer border-l-4 border-l-orange-500 bg-gradient-to-br from-orange-50 to-white'>
                    <CardHeader className='pb-3'>
                      <div className='flex items-center space-x-3'>
                        <div className='p-2 bg-orange-100 rounded-lg'>
                          <FileText className='h-6 w-6 text-orange-600' />
                        </div>
                        <div>
                          <CardTitle className='text-lg'>
                            Documentación API
                          </CardTitle>
                          <CardDescription>
                            Documentación completa
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className='flex-1'>
                      <p className='text-sm text-gray-600'>
                        Accede a la documentación interactiva de todos los
                        endpoints de la API con ejemplos y parámetros.
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              </>
            )}
          </div>
        ) : (
          <div className='min-h-[60vh] flex items-center justify-center'>
            <Card className='max-w-md mx-auto shadow-2xl border-0 bg-gradient-to-br from-white to-gray-50'>
              <CardHeader className='text-center pb-6'>
                <div className='mx-auto mb-4 p-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full w-fit'>
                  <TrendingUp className='h-8 w-8 text-white' />
                </div>
                <CardTitle className='text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'>
                  Bienvenido
                </CardTitle>
                <CardDescription className='text-lg'>
                  Sistema de Gestión Financiera
                </CardDescription>
              </CardHeader>
              <CardContent className='text-center px-8'>
                <p className='text-sm text-gray-600 mb-8 leading-relaxed'>
                  Inicia sesión con tu cuenta de GitHub para acceder a todas las
                  funcionalidades de gestión financiera.
                </p>
                <button
                  onClick={handleSignIn}
                  className='w-full flex items-center justify-center space-x-3 bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-900 hover:to-black text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg'
                >
                  <Github className='h-5 w-5' />
                  <span>Iniciar Sesión con GitHub</span>
                </button>
                <p className='text-xs text-gray-500 mt-4'>
                  Autenticación segura y gratuita
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
};

export default Home;
