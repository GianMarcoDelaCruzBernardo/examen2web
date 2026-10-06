# Farmacia App (bd_Farmacia)

FullStack con Node.js, Express, Sequelize, JWT y plantillas EJS.

## Ejecutar en local
```bash
npm install
npm start        # http://localhost:3000
```
Usa SQLite local (`bd_Farmacia.sqlite`) y siembra datos de ejemplo al iniciar.

## Usuarios de prueba
| Rol           | Correo                    | Clave      |
|---------------|---------------------------|------------|
| administrador | admin@farmacia.com        | Admin123   |
| moderador     | moderador@farmacia.com    | Mod12345   |
| usuario       | usuario@farmacia.com      | User12345  |

## Despliegue en Render
1. Sube el proyecto a GitHub.
2. En Render: New + > Blueprint > elige el repositorio (usa `render.yaml`).
3. Render crea la base PostgreSQL `bd_farmacia` y el servicio web.
4. Comparte el link `https://farmacia-app-xxxx.onrender.com`.

## API (JWT)
- `POST /api/auth/login`  { email, password } -> { token }
- `GET/POST/PUT/DELETE /api/categorias` y `/api/medicamentos` con `Authorization: Bearer <token>`
