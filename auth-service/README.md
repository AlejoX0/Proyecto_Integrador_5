# Auth Service 🔐
Microservicio de autenticación y usuarios para el Proyecto Integrador.

## Funcionalidades
- Registro de usuarios
- Login con JWT
- Validación de roles
- Sincronización con microservicio de brigadas (PostgreSQL)
- Control de sesiones en MongoDB

## Endpoints
| Método | Ruta | Descripción |
|--------|------|--------------|
| POST | `/api/auth/register` | Registrar nuevo usuario |
| POST | `/api/auth/login` | Iniciar sesión |
