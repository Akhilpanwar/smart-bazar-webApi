# SmartBazar backend (microservices)

Single repo layout for the **API gateway** and domain services. The React app talks to **one origin** (the gateway) for both catalog and auth.

## Layout

```text
smart-bazar-backend/
├── package.json                 # npm workspaces + `npm run dev` (all services)
├── gateway/                     # @smartbazar/api-gateway — port 8080
│   └── src/
│       ├── app.ts               # CORS + proxy rules
│       └── server.ts
└── services/
    ├── auth-service/            # @smartbazar/auth-service — port 4001
    │   └── src/
    └── product-service/         # @smartbazar/product-service — port 4000
        └── src/
```

## Traffic

| Browser path        | Proxied to        | Upstream path (unchanged)   |
|--------------------|-------------------|-----------------------------|
| `/api/*`           | product service   | `http://127.0.0.1:4000/api/*` |
| `/auth/*`          | auth service      | `http://127.0.0.1:4001/auth/*` |
| `/social-auth/*`   | auth service      | `http://127.0.0.1:4001/social-auth/*` |

## Quick start

1. **MongoDB** running locally (or set `MONGO_URI` in each service `.env`).
2. Copy env files:

   ```bash
   cp gateway/.env.example gateway/.env
   cp services/auth-service/.env.example services/auth-service/.env
   cp services/product-service/.env.example services/product-service/.env
   ```

   Set `JWT_SECRET` and `MONGO_URI` in auth + product.

3. From **`smart-bazar-backend/`**:

   ```bash
   npm install
   npm run dev
   ```

   This starts gateway **8080**, auth **4001**, product **4000** together.

4. Frontend defaults (`smart-bazar-client`): `VITE_API_URL=http://localhost:8080/api`, `VITE_AUTH_URL=http://localhost:8080`.

## Scripts

| Command              | Description                                      |
|----------------------|--------------------------------------------------|
| `npm run dev`        | Gateway + auth + product (concurrently)          |
| `npm run build`      | Build all three packages                         |
| `npm run dev:gateway`| Gateway only (still proxy to 4000/4001)          |
| `npm run dev:auth`   | Auth only                                        |
| `npm run dev:product`| Product only                                     |

## Health

`GET http://localhost:8080/health` — gateway status and configured upstream URLs.
