export enum UserRole {
  SUPERADMIN = 'superadmin', // Dueño del software, puede hacer TODO
  DIRECTOR = 'director', // Dueño de empresa, ve todas sus sucursales
  GERENTE = 'gerente', // Gerente de sucursal, ve solo su sucursal
  EMPLEADO = 'empleado', // Operativo ve solo su sucursal y tiene funciones limitadas.
}
