# EcoPet - Backend

API REST en Node.js + Express para la app de gestión de consumo de agua y luz
con mascota virtual. Base de datos: MySQL.

## Estructura

```
src/
  app.js              -> configuración de Express (middlewares, rutas)
  server.js            -> arranque del servidor + chequeo de conexión a MySQL
  config/db.js         -> pool de conexiones MySQL
  db/schema.sql         -> script para crear la base de datos y tablas
  models/               -> acceso a datos (una query por función)
  services/consumo.service.js -> lógica de negocio: compara consumo,
                          decide estado de la mascota y dispara alerta de fuga
  controllers/           -> reciben la petición HTTP y llaman al modelo/servicio
  routes/                -> define los endpoints de cada recurso
```

## Requisitos

- Node.js 18+
- MySQL 8+ corriendo localmente (u otro servidor accesible)

## Instalación

```bash
npm install
cp .env.example .env
# edita .env con tus credenciales de MySQL
```

Crear la base de datos y las tablas:

```bash
mysql -u root -p < src/db/schema.sql
```

## Ejecutar

```bash
npm run dev     # con nodemon (recarga automática)
npm start       # modo normal
```

El servidor verifica la conexión a MySQL al arrancar; si falla, muestra el
error y se detiene (revisa las credenciales en `.env`).

## Endpoints disponibles

### Usuarios
| Método | Ruta | Descripción |
|---|---|---|
| POST | `/api/usuarios` | Crea un usuario (nombre, email, password, tipoVivienda, areaM2, habitaciones, banos, habitantes) |
| GET | `/api/usuarios` | Lista usuarios |
| GET | `/api/usuarios/:id` | Obtiene un usuario |
| PUT | `/api/usuarios/:id/estandar` | Define el estándar de consumo (tipoServicio, valorEstandar, unidad) |

### Registros de consumo
| Método | Ruta | Descripción |
|---|---|---|
| POST | `/api/registros` | Registra un consumo (usuarioId, tipoServicio, valor, periodo `YYYY-MM-DD`). Dispara el cálculo de estado de mascota y la alerta de fuga si aplica. |
| GET | `/api/registros?usuarioId=1&tipoServicio=agua` | Lista el histórico de un usuario por servicio |

### Mascota
| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/mascota?usuarioId=1&tipoServicio=agua` | Estado actual de la mascota (`feliz`, `neutral`, `decaido`) |

### Salud
| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/health` | Verifica que el servicio está arriba |

## Lógica de negocio actual (`src/services/consumo.service.js`)

1. Al registrar un consumo, se compara contra el registro anterior del mismo
   servicio:
   - Si bajó o se mantuvo → mascota **feliz**.
   - Si subió y supera el estándar del usuario → mascota **decaído**.
   - Si subió pero no supera el estándar → mascota **neutral**.
2. Si el consumo supera el estándar, la respuesta incluye `excedeEstandar: true`
   (con eso el frontend dispara el cuestionario de hábitos).
3. Si el aumento respecto al registro anterior es ≥ 60%, se genera una fila en
   `alertas` como aviso preventivo de posible fuga.

## Pendiente para siguientes iteraciones

- Autenticación real (JWT) — ahora mismo el password solo se hashea con SHA-256.
- Endpoints de cuestionario de hábitos y guardado de la recomendación.
- Validaciones más robustas de entrada (por ejemplo con `zod` o `joi`).
