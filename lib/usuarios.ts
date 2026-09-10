// Usuarios de la app, mapeados a un correo interno fijo para Supabase Auth.
// El PIN que ingresan es la "contraseña" real de esa cuenta.
export const USUARIOS = [
  { nombre: "Margarita", email: "margarita@mariscos.local" },
  { nombre: "Luz", email: "luz@mariscos.local" },
  { nombre: "Arnoldo", email: "arnoldo@mariscos.local" },
] as const;
