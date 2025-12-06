import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Truck, CreditCard, Bed, Award } from 'lucide-react';
import { defaultProducts } from '../defaultProducts';
import ProductCard from '../components/public/ProductCard';

const HomePage: React.FC = () => {
  // Get featured products (first 6 products)
  const featuredProducts = defaultProducts.slice(0, 6);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-orange-50 via-pink-50 to-red-50 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-primary opacity-5"></div>
        <div className="relative mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-12 sm:py-16 lg:py-24 xl:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Hero Content */}
            <div className="text-center lg:text-left">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight">
                <span className="block">El mejor</span>
                <span className="bg-gradient-primary bg-clip-text text-transparent">
                  descanso
                </span>
                <span className="block">para vos</span>
              </h1>
              <p className="text-lg sm:text-xl text-gray-600 mb-6 sm:mb-8 max-w-lg mx-auto lg:mx-0">
                Descubrí nuestra colección premium de colchones, sommiers y accesorios.
                Calidad garantizada para el descanso que te merecés.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start">
                <Link
                  to="/products"
                  className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 bg-gradient-primary text-white font-semibold rounded-full hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 text-sm sm:text-base"
                >
                  Ver Catálogo
                  <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
                </Link>
                <Link
                  to="/products"
                  className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 bg-white text-primary border-2 border-primary font-semibold rounded-full hover:bg-primary hover:text-white transition-all duration-300 text-sm sm:text-base"
                >
                  Ver Ofertas
                  <CreditCard className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
                </Link>
              </div>
            </div>

            {/* Hero Image */}
            <div className="relative">
              <div className="relative z-10 bg-white rounded-3xl shadow-2xl p-8 transform rotate-3 hover:rotate-0 transition-transform duration-500">
                <img
                  src="https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=600&h=400&fit=crop"
                  alt="Colchón premium"
                  className="w-full h-64 object-cover rounded-2xl"
                />
                <div className="absolute -top-4 -right-4 bg-gradient-primary text-white px-4 py-2 rounded-full font-bold text-sm">
                  ¡Nuevo!
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-secondary rounded-3xl transform -rotate-6 opacity-20"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-white">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              ¿Por qué elegir La Casa de los Colchones?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Más de 10 años brindando el mejor descanso con productos de calidad premium
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {[
              {
                icon: Shield,
                title: "Garantía Extendida",
                description: "Hasta 5 años de garantía en todos nuestros productos"
              },
              {
                icon: Truck,
                title: "Envío Gratis",
                description: "Entrega gratuita en CABA y GBA"
              },
              {
                icon: CreditCard,
                title: "Financiación",
                description: "Hasta 12 cuotas sin interés con todas las tarjetas"
              },
              {
                icon: Award,
                title: "Calidad Premium",
                description: "Productos certificados con los mejores materiales"
              }
            ].map((benefit, index) => (
              <div key={index} className="text-center group">
                <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-gradient-primary rounded-2xl mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300">
                  <benefit.icon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                  {benefit.title}
                </h3>
                <p className="text-sm sm:text-base text-gray-600">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-gray-50">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Productos Destacados
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Descubrí nuestra selección de colchones más populares
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                variant="featured"
              />
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/products"
              className="inline-flex items-center px-8 py-4 bg-white text-primary border-2 border-primary font-semibold rounded-full hover:bg-primary hover:text-white transition-all duration-300"
            >
              Ver Todos los Productos
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-primary">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 text-center">
          <Bed className="w-16 h-16 text-white mx-auto mb-6" />
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            ¿Necesitás ayuda para elegir?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Nuestros expertos te ayudan a encontrar el colchón perfecto para tu descanso
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="inline-flex items-center justify-center px-8 py-4 bg-white text-primary font-semibold rounded-full hover:shadow-lg transition-all duration-300">
              Contactar Asesor
            </button>
            <Link
              to="/products"
              className="inline-flex items-center justify-center px-8 py-4 bg-transparent text-white border-2 border-white font-semibold rounded-full hover:bg-white hover:text-primary transition-all duration-300"
            >
              Ver Productos
              <CreditCard className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>


    </div>
  );
};

export default HomePage;