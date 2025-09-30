import { useState, useEffect } from 'react';
import { authClient } from '@/lib/auth/client';
import Link from 'next/link';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Reports = () => {
  const [session, setSession] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [balance, setBalance] = useState(0);
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    const checkSession = async () => {
      const s = await authClient.getSession();
      setSession(s.data);
      if (s.data) {
        const res = await fetch('/api/me');
        if (res.ok) {
          const u = await res.json();
          setUser(u);
          if (u.role === 'ADMIN') fetchReports();
        }
      }
    };
    checkSession();
  }, []);

  const fetchReports = async () => {
    const res = await fetch('/api/reports');
    if (res.ok) {
      const data = await res.json();
      setBalance(data.balance);
      setChartData(data.chart);
    }
  };

  const downloadCSV = () => {
    window.open('/api/reports?format=csv', '_blank');
  };

  if (!session || !user || user.role !== 'ADMIN') return <p>No autorizado</p>;

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow p-4">
        <div className="container mx-auto flex justify-between">
          <h1 className="text-xl font-bold">Reportes</h1>
          <Link href="/" className="text-blue-500">Volver al Inicio</Link>
        </div>
      </header>
      <main className="container mx-auto p-4">
        <div className="bg-white p-4 rounded shadow mb-4">
          <h2 className="text-lg font-semibold">Saldo Actual: ${balance.toFixed(2)}</h2>
        </div>
        <div className="bg-white p-4 rounded shadow mb-4">
          <h2 className="text-lg font-semibold mb-4">Comparativa Diaria de Ingresos y Egresos</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 60, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" angle={-45} textAnchor="end" height={80} />
              <YAxis />
              <Tooltip formatter={(value) => [`$${value}`, '']} />
              <Legend />
              <Bar dataKey="ingresos" fill="#82ca9d" />
              <Bar dataKey="egresos" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <button onClick={downloadCSV} className="bg-blue-500 text-white px-4 py-2 rounded">
          Descargar Reporte CSV
        </button>
      </main>
    </div>
  );
};

export default Reports;