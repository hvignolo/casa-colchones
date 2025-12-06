import React, { useState } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { Menu, X, Bed, Phone, User, Mail, MapPin, Clock } from 'lucide-react';

const PublicLayout: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleAdminClick = () => {
    navigate('/admin');
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <Bed className="w-8 h-8 text-primary" />
              <span className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                La Casa de los Colchones
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6 lg:space-x-8">
              <Link
                to="/"
                className="text-gray-700 hover:text-primary transition-colors font-medium text-sm lg:text-base"
              >
                Inicio
              </Link>
              <Link
                to="/products"
                className="text-gray-700 hover:text-primary transition-colors font-medium text-sm lg:text-base"
              >
                Productos
              </Link>
              <a
                href="https://wa.me/5491123456789"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-1 text-gray-700 hover:text-primary transition-colors font-medium text-sm lg:text-base"
              >
                <Phone className="w-4 h-4" />
                <span>Contacto</span>
              </a>
            </nav>

            {/* Admin Button & Mobile Menu Button */}
            <div className="flex items-center space-x-4">
              <button
                onClick={handleAdminClick}
                className="hidden sm:flex items-center space-x-1 bg-gradient-primary text-white px-4 py-2 rounded-full hover:shadow-lg transition-all font-medium"
              >
                <User className="w-4 h-4" />
                <span>Login</span>
              </button>

              {/* Mobile menu button */}
              <button
                onClick={toggleMobileMenu}
                className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMobileMenuOpen && (
            <div className="md:hidden border-t border-gray-200 py-4">
              <div className="flex flex-col space-y-4">
                <Link
                  to="/"
                  className="text-gray-700 hover:text-primary transition-colors font-medium px-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Inicio
                </Link>
                <Link
                  to="/products"
                  className="text-gray-700 hover:text-primary transition-colors font-medium px-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Productos
                </Link>
                <a
                  href="https://wa.me/5491123456789"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center space-x-1 text-gray-700 hover:text-primary transition-colors font-medium px-2 text-left"
                >
                  <Phone className="w-4 h-4" />
                  <span>Contacto</span>
                </a>
                <button
                  onClick={() => {
                    handleAdminClick();
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center space-x-1 bg-gradient-primary text-white px-4 py-2 rounded-full font-medium mx-2 justify-center"
                >
                  <User className="w-4 h-4" />
                  <span>Login</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Bed className="w-6 h-6 text-primary" />
                <span className="text-xl font-bold">La Casa de los Colchones</span>
              </div>
              <p className="text-gray-400 text-sm">
                Tu tienda de confianza para el mejor descanso.
                Colchones de calidad premium para toda la familia.
              </p>
            </div>

            {/* Quick Links */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Enlaces Rápidos</h3>
              <div className="space-y-2">
                <Link to="/" className="block text-gray-400 hover:text-white transition-colors text-sm">
                  Inicio
                </Link>
                <Link to="/products" className="block text-gray-400 hover:text-white transition-colors text-sm">
                  Productos
                </Link>
                <a
                  href="https://wa.me/5491123456789"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Contacto WhatsApp
                </a>
              </div>
            </div>

            {/* Contact Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Contacto</h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-gray-400 text-sm">
                  <Phone className="w-4 h-4" />
                  <span>+54 11 1234-5678</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-400 text-sm">
                  <Mail className="w-4 h-4" />
                  <span>info@casacolchones.com</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-400 text-sm">
                  <MapPin className="w-4 h-4" />
                  <span>Buenos Aires, Argentina</span>
                </div>
              </div>
            </div>

            {/* Business Hours */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Horarios</h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-gray-400 text-sm">
                  <Clock className="w-4 h-4" />
                  <div>
                    <div>Lun - Vie: 9:00 - 18:00</div>
                    <div>Sáb: 9:00 - 14:00</div>
                    <div>Dom: Cerrado</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-400 text-sm">
              © 2025 La Casa de los Colchones. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>


    </div>
  );
};

export default PublicLayout;