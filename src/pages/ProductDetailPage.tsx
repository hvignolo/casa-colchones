```
import React, { useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Star,
  Heart,
  Share2,
  Phone,
  Truck,
  Shield,
  CreditCard,
  Check,
  Search
} from 'lucide-react';
import { useProducts } from '../contexts/ProductContext';
import ProductCard from '../components/public/ProductCard';

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { products } = useProducts();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  // Find the product
  const product = useMemo(() => {
    return products.find(p => p.id === parseInt(id || '0'));
  }, [id, products]);

  // Get related products (same type, different products)
  const relatedProducts = useMemo(() => {
    if (!product) return [];
    return products
      .filter(p => p.tipo === product.tipo && p.id !== product.id)
      .slice(0, 4);
  }, [product, products]);

  const formatPrice = (price: number) => {
    return price.toLocaleString('es-AR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-orange-100 rounded-full mb-4">
              <Search className="w-10 h-10 text-orange-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Producto no encontrado
            </h1>
            <p className="text-gray-600 mb-6">
              El producto que buscas no existe o ha sido eliminado.
            </p>
            <p className="text-sm text-gray-500">
              Código de producto: {id}
            </p>
          </div>

          <div className="space-y-3">
            <Link
              to="/products"
              className="inline-flex items-center justify-center w-full bg-gradient-primary text-white px-6 py-3 rounded-full font-medium hover:shadow-lg transition-all"
            >
              <Search className="w-5 h-5 mr-2" />
              Ver Todos los Productos
            </Link>
            <Link
              to="/"
              className="inline-flex items-center justify-center w-full bg-white text-primary border-2 border-primary px-6 py-3 rounded-full font-medium hover:bg-primary hover:text-white transition-all"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Volver al Inicio
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Mock images array (in real app, product would have multiple images)
  const productImages = [
    product.image,
    product.image, // Duplicate for demo
    product.image,
  ];

  const handleContactClick = () => {
    // Aquí podrías abrir un modal de contacto o redirigir a WhatsApp
    window.open('https://wa.me/5491123456789?text=Hola, me interesa el producto: ' + product.nombre, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-4">
          <nav className="flex items-center space-x-2 text-sm">
            <Link to="/" className="text-gray-500 hover:text-primary">Inicio</Link>
            <span className="text-gray-400">/</span>
            <Link to="/products" className="text-gray-500 hover:text-primary">Productos</Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 font-medium">{product.nombre}</span>
          </nav>
        </div>
      </div>

      <div className="mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-primary mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Volver
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="aspect-square bg-white rounded-2xl shadow-card overflow-hidden">
              <img
                src={productImages[selectedImageIndex]}
                alt={product.nombre}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Thumbnail Images */}
            <div className="flex space-x-4">
              {productImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`w - 20 h - 20 rounded - xl overflow - hidden border - 2 transition - all ${
  selectedImageIndex === index
  ? 'border-primary shadow-md'
  : 'border-gray-200 hover:border-gray-300'
} `}
                >
                  <img
                    src={image}
                    alt={`${ product.nombre } ${ index + 1 } `}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Header */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="bg-gradient-primary text-white px-3 py-1 rounded-full text-sm font-medium">
                  {product.tipo}
                </span>
                <div className="flex items-center space-x-2">
                  <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
                    <Heart className="w-5 h-5 text-gray-600" />
                  </button>
                  <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
                    <Share2 className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              </div>

              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                {product.nombre}
              </h1>

              {/* Rating */}
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-current" />
                  ))}
                </div>
                <span className="text-gray-600 ml-2">(4.8) • 127 reseñas</span>
              </div>
            </div>

            {/* Pricing */}
            <div className="bg-white rounded-2xl shadow-card p-6">
              <div className="space-y-4">
                <div>
                  <div className="flex items-baseline space-x-2 mb-2">
                    <span className="text-3xl font-bold text-gray-900">
                      ${formatPrice(product.precioContado)}
                    </span>
                    <span className="text-lg text-gray-500">contado</span>
                  </div>
                  <div className="text-green-600 font-medium">
                    ¡Ahorrás ${formatPrice(product.precioTarjeta - product.precioContado)} pagando en efectivo!
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex items-baseline space-x-2 mb-2">
                    <span className="text-2xl font-bold text-primary">
                      ${formatPrice(product.precioTarjeta)}
                    </span>
                    <span className="text-gray-500">en cuotas</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    12 cuotas de ${formatPrice(product.precioTarjeta / 12)} sin interés
                  </div>
                </div>
              </div>
            </div>

            {/* Quantity and Actions */}
            <div className="bg-white rounded-2xl shadow-card p-6">
              <div className="space-y-4">
                {/* Quantity Selector */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cantidad
                  </label>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                    >
                      -
                    </button>
                    <span className="text-lg font-medium w-8 text-center">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <button
                    onClick={handleContactClick}
                    className="w-full bg-gradient-primary text-white py-4 rounded-full font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center"
                  >
                    <Phone className="w-5 h-5 mr-2" />
                    Consultar Precio
                  </button>

                  <button
                    onClick={handleContactClick}
                    className="w-full bg-white border-2 border-primary text-primary py-4 rounded-full font-semibold hover:bg-primary hover:text-white transition-all duration-300"
                  >
                    Consultar Disponibilidad
                  </button>
                </div>
              </div>
            </div>

            {/* Benefits */}
            <div className="bg-white rounded-2xl shadow-card p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Beneficios</h3>
              <div className="space-y-3">
                {[
                  { icon: Truck, text: "Envío gratis en CABA y GBA" },
                  { icon: Shield, text: "Garantía extendida de 5 años" },
                  { icon: CreditCard, text: "12 cuotas sin interés" },
                  { icon: Check, text: "Devolución gratuita en 30 días" }
                ].map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <benefit.icon className="w-5 h-5 text-primary" />
                    <span className="text-gray-700">{benefit.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-16">
          <div className="bg-white rounded-2xl shadow-card overflow-hidden">
            <div className="border-b border-gray-200">
              <nav className="flex">
                <button className="px-6 py-4 text-primary border-b-2 border-primary font-medium">
                  Descripción
                </button>
                <button className="px-6 py-4 text-gray-500 hover:text-gray-700 font-medium">
                  Especificaciones
                </button>
                <button className="px-6 py-4 text-gray-500 hover:text-gray-700 font-medium">
                  Reseñas
                </button>
              </nav>
            </div>

            <div className="p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    Descripción del Producto
                  </h3>
                  <p className="text-gray-700 leading-relaxed mb-6">
                    {product.detalles}
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    Este {product.tipo.toLowerCase()} de {product.subtipo.toLowerCase()} está diseñado
                    para brindar el máximo confort y durabilidad. Fabricado con materiales de primera
                    calidad y tecnología avanzada para garantizar un descanso reparador.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    Especificaciones Técnicas
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">Medidas:</span>
                      <span className="font-medium">{product.medidas}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">Tipo:</span>
                      <span className="font-medium">{product.subtipo}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">Marca:</span>
                      <span className="font-medium">{product.marca}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">Código:</span>
                      <span className="font-medium">{product.codigo}</span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="text-gray-600">Garantía:</span>
                      <span className="font-medium">5 años</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Productos Relacionados
              </h2>
              <p className="text-lg text-gray-600">
                Otros productos que podrían interesarte
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard
                  key={relatedProduct.id}
                  product={relatedProduct}
                  variant="catalog"
                />
              ))}
            </div>
          </div>
        )}
      </div>


    </div>
  );
};

export default ProductDetailPage;