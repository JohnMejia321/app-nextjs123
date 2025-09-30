import { useEffect, useState } from 'react';
const SwaggerUI = require('swagger-ui-react').default;
import 'swagger-ui-react/swagger-ui.css';

const Docs = () => {
  const [spec, setSpec] = useState<any>(null);

  useEffect(() => {
    const fetchSpec = async () => {
      const res = await fetch('/api/docs');
      if (res.ok) {
        const data = await res.json();
        setSpec(data);
      }
    };
    fetchSpec();
  }, []);

  if (!spec) return <div>Cargando documentación...</div>;

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow p-4">
        <div className="container mx-auto">
          <h1 className="text-xl font-bold">Documentación de la API</h1>
        </div>
      </header>
      <main className="container mx-auto p-4">
        <SwaggerUI spec={spec} />
      </main>
    </div>
  );
};

export default Docs;