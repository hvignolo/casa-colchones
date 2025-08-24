import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Search, ArrowLeft, Bed } from 'lucide-react';

const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-red-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* Icon */}
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-primary rounded-full mb-4">
            <Bed className="w-12 h-12 text-white" />
          </div>
          <div className="text-6xl font-bold text-gray-300 mb-2">404</div>
        </div>

        {/* Content */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Página no encontrada
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            Lo sentimos, la página que buscas no existe o ha sido movida.
          </p>
          <p className="text-sm text-gray-500">
            Puede que el enlace esté roto o que hayas escrito mal la dirección.
          </p>
        </div>

        {/* Actions */}
        <div className="space-y-4">
          <Link
            to="/"
            className="inline-flex items-center justify-center w-full bg-gradient-primary text-white px-6 py-3 rounded-full font-semibold hover:shadow-lg transition-all duration-300"
          >
            <Home className="w-5 h-5 mr-2" />
            Volver al Inicio
          </Link>
          
          <Link
            to="/products"
            className="inline-flex items-center justify-center w-full bg-white text-primary border-2 border-primary px-6 py-3 rounded-full font-semibold hover:bg-primary hover:text-white transition-all duration-300"
          >
            <Search className="w-5 h-5 mr-2" />
            Ver Productos
          </Link>
          
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center w-full bg-gray-100 text-gray-700 px-6 py-3 rounded-full font-medium hover:bg-gray-200 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Volver Atrás
          </button>
        </div>

        {/* Help */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500 mb-2">
            ¿Necesitas ayuda?
          </p>
          <div className="flex justify-center space-x-4 text-sm">
            <Link to="/" className="text-primary hover:underline">
              Contacto
            </Link>
            <span className="text-gray-300">•</span>
            <Link to="/" className="text-primary hover:underline">
              Soporte
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;