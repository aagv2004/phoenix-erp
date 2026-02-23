import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { LogIn, Mail, Lock, Loader2 } from "lucide-react";
import { loginRequest } from "../api/auth";
import { useAuthStore } from "../store/authStore";
import { getErrorMessage } from "../utils/errorHandling";

const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: "El correo es obligatorio" })
    .email({ message: "Debe ser un correo válido" }),
  password: z.string().min(1, { message: "La contraseña es obligatoria" }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const navigate = useNavigate();
  const setLogin = useAuthStore((state) => state.setLogin);
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      setApiError(null);

      const response = await loginRequest({
        email: data.email,
        password: data.password,
      });

      setLogin(response.access_token, response.user);
      navigate("/");
    } catch (error) {
      const message = getErrorMessage(error);
      setApiError(message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-xl p-8 border-t-4 border-orange-500">
        {/* Encabezado con Identidad Phoenix */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-orange-100 text-orange-600 mb-4 shadow-inner">
            <LogIn size={40} />
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Phoenix ERP <span className="text-orange-500">🦅</span>
          </h2>
          <p className="text-gray-500 mt-2 font-medium">
            Gestión de inventario multi-sucursal
          </p>
        </div>

        {/* Mensaje de error de la API (Manteniendo el rojo de alerta) */}
        {apiError && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-3 rounded-r-lg text-sm mb-6 font-medium animate-pulse">
            ⚠️ {apiError}
          </div>
        )}

        {/* El Formulario */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Input Email */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Correo Electrónico
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="email"
                {...register("email")}
                className={`block w-full pl-10 pr-3 py-2.5 border ${
                  errors.email
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-orange-500"
                } rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:border-transparent transition-all`}
                placeholder="admin@phoenix.com"
              />
            </div>
            {errors.email && (
              <p className="mt-1.5 text-xs font-medium text-red-500">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Input Password */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Contraseña
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="password"
                {...register("password")}
                className={`block w-full pl-10 pr-3 py-2.5 border ${
                  errors.password
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-orange-500"
                } rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:border-transparent transition-all`}
                placeholder="••••••••"
              />
            </div>
            {errors.password && (
              <p className="mt-1.5 text-xs font-medium text-red-500">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Botón Submit - Ahora en Orange-600 para hacer juego con el Dashboard */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-md text-sm font-bold text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed mt-4"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
                Verificando credenciales...
              </>
            ) : (
              "Ingresar al Sistema"
            )}
          </button>
        </form>

        {/* Footer del login */}
        <div className="mt-8 pt-6 border-t border-gray-100 text-center">
          <p className="text-xs text-gray-400">
            &copy; 2026 Phoenix ERP System v1.0
          </p>
        </div>
      </div>
    </div>
  );
}
