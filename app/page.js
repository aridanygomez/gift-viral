'use client';
import { useState } from 'react';

export default function Home() {
  const [formData, setFormData] = useState({
    age: '',
    relation: '',
    interests: '',
    budget: '',
    language: 'es' 
  });
  const [gifts, setGifts] = useState([]);
  const [loading, setLoading] = useState(false);

  // Función para crear enlaces de Amazon
  const getAmazonLink = (term, lang) => {
    const cleanTerm = encodeURIComponent(term);
    if (lang === 'es') {
      // TU TAG DE ESPAÑA
      return `https://www.amazon.es/s?k=${cleanTerm}&tag=aridany91-21`; 
    } else {
      // TU TAG DE USA/GLOBAL
      return `https://www.amazon.com/s?k=${cleanTerm}&tag=TU_TAG_US-20`;
    }
  };

  // Función corregida para manejar el envío y los errores
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setGifts([]);
    
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      // Verificamos si el servidor dio error
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Error desconocido del servidor');
      }

      const data = await res.json();
      
      if (data.gifts) {
        setGifts(data.gifts);
      } else {
        throw new Error('La IA no devolvió la lista de regalos');
      }

    } catch (error) {
      console.error(error);
      alert('⚠️ ERROR: ' + error.message);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 font-sans text-gray-900">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        
        {/* Cabecera */}
        <div className="bg-red-600 p-6 text-center">
          <h1 className="text-3xl font-bold text-white">🎁 Gift Finder AI</h1>
          <p className="text-red-100 text-sm mt-1">Encuentra el regalo perfecto en segundos</p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          <div>
            <label className="block text-sm font-medium mb-1">Idioma / Language</label>
            <select 
              className="w-full p-3 border rounded-lg bg-gray-50"
              value={formData.language}
              onChange={(e) => setFormData({...formData, language: e.target.value})}
            >
              <option value="es">🇪🇸 Español</option>
              <option value="en">🇺🇸 English</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Edad</label>
              <input 
                type="number" 
                className="w-full p-3 border rounded-lg"
                placeholder="Ej: 28"
                required
                onChange={(e) => setFormData({...formData, age: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Presupuesto</label>
              <input 
                type="number" 
                className="w-full p-3 border rounded-lg"
                placeholder="Ej: 50"
                required
                onChange={(e) => setFormData({...formData, budget: e.target.value})}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">¿Para quién es?</label>
            <input 
              type="text" 
              className="w-full p-3 border rounded-lg"
              placeholder="Ej: Mi novia, mi padre..."
              required
              onChange={(e) => setFormData({...formData, relation: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">¿Qué le gusta? (Intereses)</label>
            <textarea 
              className="w-full p-3 border rounded-lg"
              placeholder="Ej: Yoga, cocinar, Star Wars..."
              rows="2"
              required
              onChange={(e) => setFormData({...formData, interests: e.target.value})}
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 text-white font-bold py-4 rounded-xl hover:bg-red-700 transition transform active:scale-95 disabled:opacity-50"
          >
            {loading ? '✨ Pensando ideas...' : '🔍 Buscar Regalos'}
          </button>
        </form>

        {/* Resultados */}
        {gifts.length > 0 && (
          <div className="bg-gray-100 p-6 border-t space-y-4">
            <h2 className="font-bold text-xl text-center mb-4">💡 Recomendaciones:</h2>
            {gifts.map((gift, i) => (
              <div key={i} className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
                <h3 className="font-bold text-lg text-red-600">{gift.name}</h3>
                <p className="text-gray-600 text-sm mt-1 mb-3">{gift.reason}</p>
                <a 
                  href={getAmazonLink(gift.search_term, formData.language)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full text-center bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-2 rounded-lg transition"
                >
                  Ver precio en Amazon 🛒
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}