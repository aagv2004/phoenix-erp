import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Mail,
  Lock,
  User as UserIcon,
  Shield,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { registerTestUser } from "../api/auth";
import { getErrorMessage } from "../utils/errorHandling";

const registerSchema = z.object({
  full_name: z.string().min(1, { message: "El nombre es obligatorio" }),
  email: z
    .string()
    .min(1, { message: "El correo es obligatorio" })
    .email({ message: "Debe ser un correo válido" }),
  password: z
    .string()
    .min(6, { message: "La contraseña debe tener al menos 6 caracteres" }),
  role: z.enum(["superadmin", "director", "gerente", "empleado"] as const),
  company_id: z.string().optional(),
  branch_id: z.string().optional(),
});

type RegisterFormValues = z.input<typeof registerSchema>;

export default function RegisterTestPage() {
  const [apiError, setApiError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: "empleado",
      company_id: "",
      branch_id: "",
    },
  });

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      setApiError(null);
      setSuccessMessage(null);

      await registerTestUser(data);
      setSuccessMessage("Usuario de prueba creado correctamente");
      reset({ ...data, password: "", role: data.role });
    } catch (error) {
      const message = getErrorMessage(error);
      setApiError(message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-xl p-8 border-t-4 border-blue-500">
        {/* Encabezado */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-blue-100 text-blue-600 mb-4 shadow-inner">
            <UserIcon size={40} />
          </div>
          <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">
            Registro rápido de prueba
          </h2>
          <p className="text-gray-500 mt-2 text-sm">
            Esta pantalla es temporal y sólo para crear usuarios de prueba.
          </p>
        </div>

        {apiError && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-3 rounded-r-lg text-sm mb-4 font-medium">
            ⚠️ {apiError}
          </div>
        )}

        {successMessage && (
          <div className="bg-green-50 border-l-4 border-green-500 text-green-700 p-3 rounded-r-lg text-sm mb-4 font-medium flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4" />
            {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Nombre completo */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Nombre completo
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <UserIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                {...register("full_name")}
                className={`block w-full pl-10 pr-3 py-2.5 border ${
                  errors.full_name
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-blue-500"
                } rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:border-transparent transition-all`}
                placeholder="Juan Pérez"
              />
            </div>
            {errors.full_name && (
              <p className="mt-1.5 text-xs font-medium text-red-500">
                {errors.full_name.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Correo electrónico
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
                    : "border-gray-300 focus:ring-blue-500"
                } rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:border-transparent transition-all`}
                placeholder="usuario@phoenix.cl"
              />
            </div>
            {errors.email && (
              <p className="mt-1.5 text-xs font-medium text-red-500">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
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
                    : "border-gray-300 focus:ring-blue-500"
                } rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:border-transparent transition-all`}
                placeholder="Mínimo 6 caracteres"
              />
            </div>
            {errors.password && (
              <p className="mt-1.5 text-xs font-medium text-red-500">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Rol */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Rol (para pruebas)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Shield className="h-5 w-5 text-gray-400" />
              </div>
              <select
                {...register("role")}
                className={`block w-full pl-10 pr-3 py-2.5 border ${
                  errors.role
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-blue-500"
                } rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:border-transparent transition-all bg-white`}
              >
                <option value="superadmin">SUPERADMIN</option>
                <option value="director">DIRECTOR</option>
                <option value="gerente">GERENTE</option>
                <option value="empleado">EMPLEADO</option>
              </select>
            </div>
            {errors.role && (
              <p className="mt-1.5 text-xs font-medium text-red-500">
                {errors.role.message}
              </p>
            )}
          </div>

          {/* Empresa (opcional, por ID) */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              ID de Empresa (opcional)
            </label>
            <input
              type="text"
              {...register("company_id")}
              className="block w-full px-3 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
              placeholder="UUID de la empresa (company_id)"
            />
            <p className="mt-1 text-[11px] text-gray-400">
              Copia el UUID de la empresa desde la tabla de empresas o la base
              de datos.
            </p>
          </div>

          {/* Sucursal (opcional, por ID) */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              ID de Sucursal (opcional)
            </label>
            <input
              type="text"
              {...register("branch_id")}
              className="block w-full px-3 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
              placeholder="UUID de la sucursal (branch_id)"
            />
            <p className="mt-1 text-[11px] text-gray-400">
              También puedes dejarlo vacío si sólo quieres asociar la empresa.
            </p>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-md text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed mt-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
                Creando usuario...
              </>
            ) : (
              "Crear usuario de prueba"
            )}
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-gray-100 text-xs text-gray-400 text-center">
          Esta ruta y endpoint son temporales y deben
          <br />
          eliminarse o deshabilitarse en producción.
        </div>
      </div>
    </div>
  );
}
