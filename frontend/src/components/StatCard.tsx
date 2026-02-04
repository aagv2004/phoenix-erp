import type { ReactNode } from "react";

interface Props {
  title: string;
  value: string | number; // Puede ser número (5) o texto ("...")
  icon: ReactNode;
  colorClass: string; // Clase para el color de fondo del icono (bg-orange-500, etc.)
}

export default function StatCard({ title, value, icon, colorClass }: Props) {
  return (
    <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200 transition-all hover:shadow-md">
      <div className="p-5">
        <div className="flex items-center">
          <div
            className={`flex-shrink-0 rounded-md p-3 ${colorClass} text-white shadow-sm`}
          >
            {icon}
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">
                {title}
              </dt>
              <dd>
                <div className="text-xl font-bold text-gray-900 mt-1">
                  {value}
                </div>
              </dd>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
