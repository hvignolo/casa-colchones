import React, { useState } from 'react';
import { Bed, Lock, UserPlus } from 'lucide-react';
import { LoginMode, User } from './types';

interface LoginFormProps {
  onLogin: (username: string, password: string, businessName: string) => Promise<boolean>;
  onShowToast: (message: string) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin, onShowToast }) => {
  const [loginMode, setLoginMode] = useState<LoginMode>("login");
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    businessName: "",
  });
  const [loginError, setLoginError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setIsLoading(true);

    // Validaciones
    if (!formData.username.trim()) {
      setLoginError("El usuario es requerido");
      setIsLoading(false);
      return;
    }

    if (!formData.password.trim()) {
      setLoginError("La contraseña es requerida");
      setIsLoading(false);
      return;
    }

    if (loginMode === "register" && !formData.businessName.trim()) {
      setLoginError("El nombre del negocio es requerido");
      setIsLoading(false);
      return;
    }

    // Validaciones específicas para registro
    if (loginMode === "register") {
      if (formData.username.length < 3) {
        setLoginError("El usuario debe tener al menos 3 caracteres");
        setIsLoading(false);
        return;
      }

      if (formData.password.length < 4) {
        setLoginError("La contraseña debe tener al menos 4 caracteres");
        setIsLoading(false);
        return;
      }

      if (formData.businessName.length < 3) {
        setLoginError(
          "El nombre del negocio debe tener al menos 3 caracteres"
        );
        setIsLoading(false);
        return;
      }
    }

    // Simular delay de autenticación
    setTimeout(async () => {
      try {
        const success = await onLogin(
          formData.username,
          formData.password,
          formData.businessName
        );
        
        if (!success) {
          setLoginError(
            loginMode === "login"
              ? "Usuario o contraseña incorrectos"
              : "El usuario ya existe, intenta con otro nombre"
          );
        }
      } catch (error) {
        console.error('Error during login:', error);
        setLoginError("Error durante el proceso de autenticación");
      }
      setIsLoading(false);
    }, 800);
  };

  const toggleLoginMode = () => {
    setLoginMode(loginMode === "login" ? "register" : "login");
    setLoginError("");
    setFormData({ username: "", password: "", businessName: "" });
  };

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData({ ...formData, [field]: value });
    if (loginError) setLoginError("");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')",
        }}
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-40" />

      {/* Login Card */}
      <div className="relative z-10 bg-white bg-opacity-95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 w-full max-w-md border border-white border-opacity-20">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Bed className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Casa de Colchones
          </h1>
          <p className="text-gray-600">
            {loginMode === "login"
              ? "Inicia sesión en tu cuenta"
              : "Crea tu cuenta de negocio"}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Error Message */}
          {loginError && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-red-500 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-red-700 font-medium text-sm">
                  {loginError}
                </span>
              </div>
            </div>
          )}

          {/* Username Field */}
          <div>
            <label htmlFor="login-username" className="block text-sm font-medium text-gray-700 mb-2">
              Usuario
            </label>
            <input
              type="text"
              id="login-username"
              name="username"
              value={formData.username}
              onChange={(e) => handleInputChange("username", e.target.value)}
              className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white bg-opacity-90 ${
                loginError ? "border-red-300" : "border-gray-300"
              }`}
              placeholder="Ingresa tu usuario"
              required
              disabled={isLoading}
              autoComplete="username"
            />
          </div>

          {/* Password Field */}
          <div>
            <label htmlFor="login-password" className="block text-sm font-medium text-gray-700 mb-2">
              Contraseña
            </label>
            <input
              type="password"
              id="login-password"
              name="password"
              value={formData.password}
              onChange={(e) => handleInputChange("password", e.target.value)}
              className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white bg-opacity-90 ${
                loginError ? "border-red-300" : "border-gray-300"
              }`}
              placeholder="Ingresa tu contraseña"
              required
              disabled={isLoading}
              autoComplete={loginMode === "register" ? "new-password" : "current-password"}
            />
          </div>

          {/* Business Name Field (only for register) */}
          {loginMode === "register" && (
            <div>
              <label htmlFor="login-business-name" className="block text-sm font-medium text-gray-700 mb-2">
                Nombre del Negocio
              </label>
              <input
                type="text"
                id="login-business-name"
                name="businessName"
                value={formData.businessName}
                onChange={(e) => handleInputChange("businessName", e.target.value)}
                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white bg-opacity-90 ${
                  loginError ? "border-red-300" : "border-gray-300"
                }`}
                placeholder="Ej: Casa de Colchones Miranda"
                required
                disabled={isLoading}
                autoComplete="organization"
              />
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 px-4 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2 ${
              isLoading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            } text-white`}
          >
            {isLoading ? (
              <>
                <svg
                  className="w-5 h-5 animate-spin"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  ></path>
                </svg>
                Procesando...
              </>
            ) : loginMode === "login" ? (
              <>
                <Lock className="w-5 h-5" />
                Iniciar Sesión
              </>
            ) : (
              <>
                <UserPlus className="w-5 h-5" />
                Crear Cuenta
              </>
            )}
          </button>
        </form>

        {/* Toggle Mode Button */}
        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={toggleLoginMode}
            className="text-blue-700 hover:text-blue-800 font-medium bg-white bg-opacity-80 px-4 py-2 rounded-lg transition-colors"
            disabled={isLoading}
          >
            {loginMode === "login"
              ? "¿No tienes cuenta? Regístrate aquí"
              : "¿Ya tienes cuenta? Inicia sesión"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;