# Design Document

## Overview

This design transforms the existing Casa Colchones admin application into a dual-purpose system with a public e-commerce interface and private admin dashboard. The public interface will replicate the fashion e-commerce template design with #ff5e3a primary color, orange/pink gradients, rounded product cards, and modern responsive layout. The admin functionality remains completely intact and accessible through authentication.

## Architecture

### Routing Structure
```
/ (Public)
├── / → Landing Page (Hero + Featured Products)
├── /products → Product Catalog (Grid + Filters)  
├── /product/:id → Product Detail + Payment Calculator
└── /admin → Admin Dashboard (Login Required)
    ├── /admin/login → Login Form (if not authenticated)
    └── /admin/dashboard → Current Admin Interface
```

### Authentication Flow
- **Public Routes**: Accessible to all users without authentication
- **Admin Routes**: Protected by authentication context, redirect to login if not authenticated
- **Login State**: Managed by React Context API for global state management

### Technology Stack
- **Frontend**: React 19.1.0 + TypeScript 4.9.5
- **Routing**: React Router DOM (to be installed)
- **Styling**: TailwindCSS 3.3.0 with fashion template color scheme
- **Icons**: Lucide React 0.525.0
- **State Management**: React Context + existing localStorage/offline storage
- **PWA**: Maintain existing service worker functionality

## Components and Interfaces

### New Public Components

#### 1. PublicLayout
```typescript
interface PublicLayoutProps {
  children: React.ReactNode;
}
```
- **Header**: Logo, navigation menu, "Admin" button
- **Footer**: Store information, contact details
- **Responsive**: Mobile-first design with hamburger menu

#### 2. HomePage
```typescript
interface HomePageProps {}
```
- **Hero Section**: Large title "Colchones" (adapting fashion template)
- **Featured Products**: Grid of 6-8 highlighted products
- **Benefits Section**: Quality, comfort, financing options
- **CTA Buttons**: "Ver Catálogo", "Calcular Cuotas"

#### 3. ProductCard
```typescript
interface ProductCardProps {
  product: Product;
  onClick: (product: Product) => void;
  variant?: 'featured' | 'catalog';
}
```
- **Design**: Rounded corners, hover effects, shadows (fashion template style)
- **Content**: Product image, name, price, "Ver Detalles" button
- **Responsive**: Grid layout adapts to screen size

#### 4. ProductsPage
```typescript
interface ProductsPageProps {}
```
- **Filter Sidebar**: Categories, price range, brand filters
- **Product Grid**: Responsive grid using ProductCard components
- **Search**: Integration with existing search functionality
- **Pagination**: For large product catalogs

#### 5. ProductDetailPage
```typescript
interface ProductDetailPageProps {
  productId: string;
}
```
- **Product Gallery**: Large images with thumbnails
- **Product Info**: Name, description, specifications, pricing
- **Contact Actions**: WhatsApp and phone contact buttons for price inquiries
- **Related Products**: Suggestions based on category

### Modified Existing Components

#### 6. App Component Refactor
- Remove direct rendering of admin interface
- Add routing configuration
- Wrap with AuthProvider context

#### 7. AuthContext
```typescript
interface AuthContextType {
  user: User | null;
  login: (username: string, password: string, businessName: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}
```

### Reused Components
- **PaymentCalculatorModal**: Restricted to admin panel only (authentication required)
- **ProductImage**: Existing image handling component
- **ConnectionIndicator**: Show offline status on public pages
- **Toast notifications**: Reuse existing toast system

## Data Models

### Existing Models (Unchanged)
```typescript
interface Product {
  id: number;
  codigo: string;
  nombre: string;
  medidas: string;
  tipo: string;
  subtipo: string;
  precioContado: number;
  precioTarjeta: number;
  detalles: string;
  image: string;
  marca: string;
}

interface StoreData {
  name: string;
  location: string;
  phone: string;
  email: string;
  hours: string;
}

interface User {
  username: string;
  password: string;
  businessName: string;
  registeredAt: string;
}
```

### New Route Types
```typescript
type PublicRoute = '/' | '/products' | `/product/${string}`;
type AdminRoute = '/admin' | '/admin/login' | '/admin/dashboard';
type AppRoute = PublicRoute | AdminRoute;
```

## Design System

### Color Palette (Fashion Template Adaptation)
```css
:root {
  --primary: #ff5e3a;
  --primary-light: #ff7a56;
  --primary-dark: #e5441f;
  --gradient-start: #ff5e3a;
  --gradient-end: #ff8a80;
  --secondary: #f8f9fa;
  --text-primary: #2d3748;
  --text-secondary: #718096;
  --background: #ffffff;
  --surface: #f7fafc;
}
```

### Typography Scale
- **Hero Title**: text-5xl md:text-6xl font-bold
- **Section Headers**: text-3xl md:text-4xl font-semibold  
- **Product Names**: text-lg font-medium
- **Body Text**: text-base
- **Captions**: text-sm text-gray-600

### Component Styling Patterns

#### Product Cards
```css
.product-card {
  @apply bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300;
  @apply border border-gray-100 overflow-hidden;
}

.product-card:hover {
  @apply transform -translate-y-1 shadow-xl;
}
```

#### Buttons
```css
.btn-primary {
  @apply bg-gradient-to-r from-orange-500 to-pink-500;
  @apply text-white font-medium px-6 py-3 rounded-full;
  @apply hover:from-orange-600 hover:to-pink-600 transition-all;
}

.btn-secondary {
  @apply bg-white text-orange-500 border-2 border-orange-500;
  @apply font-medium px-6 py-3 rounded-full;
  @apply hover:bg-orange-50 transition-all;
}
```

### Responsive Breakpoints
- **Mobile**: < 768px (1 column grid)
- **Tablet**: 768px - 1024px (2-3 column grid)
- **Desktop**: > 1024px (4+ column grid)

## Error Handling

### Route Protection
```typescript
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) return <LoadingSpinner />;
  if (!isAuthenticated) return <Navigate to="/admin/login" replace />;
  
  return <>{children}</>;
};
```

### Error Boundaries
- **Public Pages**: Graceful fallback with "Something went wrong" message
- **Admin Pages**: Maintain existing error handling
- **Network Errors**: Show offline indicator and cached data

### 404 Handling
- **Public 404**: Styled page with navigation back to home
- **Admin 404**: Redirect to admin dashboard

## Testing Strategy

### Unit Tests
- **Components**: Test rendering and user interactions
- **Hooks**: Test authentication context and routing logic
- **Utils**: Test existing utility functions remain functional

### Integration Tests
- **Routing**: Test navigation between public and admin areas
- **Authentication**: Test login/logout flows
- **Data Flow**: Test product data display on public pages

### E2E Tests
- **Public User Journey**: Landing → Products → Product Detail → Calculator
- **Admin User Journey**: Login → Dashboard → Product Management
- **Responsive**: Test mobile and desktop layouts

### Accessibility Testing
- **Keyboard Navigation**: All interactive elements accessible
- **Screen Readers**: Proper ARIA labels and semantic HTML
- **Color Contrast**: Meet WCAG 2.1 AA standards

## Performance Considerations

### Code Splitting
```typescript
const HomePage = lazy(() => import('./pages/HomePage'));
const ProductsPage = lazy(() => import('./pages/ProductsPage'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
```

### Image Optimization
- **Product Images**: Lazy loading with placeholder
- **Hero Images**: Optimized WebP format with fallbacks
- **Responsive Images**: Different sizes for different breakpoints

### Caching Strategy
- **Static Assets**: Browser caching for CSS/JS
- **Product Data**: Maintain existing offline storage
- **API Responses**: Cache product listings for faster navigation

### Bundle Size
- **Tree Shaking**: Remove unused TailwindCSS classes
- **Lazy Loading**: Route-based code splitting
- **Dependencies**: Audit and minimize bundle size impact

## Migration Strategy

### Phase 1: Setup Infrastructure
1. Install React Router DOM
2. Create AuthContext and routing structure
3. Update TailwindCSS configuration with fashion colors
4. Create PublicLayout component

### Phase 2: Public Pages
1. Implement HomePage with hero section
2. Create ProductCard component with fashion styling
3. Build ProductsPage with filtering
4. Develop ProductDetailPage with calculator integration

### Phase 3: Integration
1. Integrate existing admin functionality
2. Test authentication flows
3. Ensure PWA functionality remains intact
4. Performance optimization and testing

### Rollback Plan
- **Git Branching**: Feature branch with ability to revert
- **Environment Variables**: Toggle between old/new interface
- **Data Backup**: Ensure no data loss during migration