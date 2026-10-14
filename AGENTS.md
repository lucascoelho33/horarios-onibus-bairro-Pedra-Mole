# AGENTS.md – Regras Arquiteturais para o MVP de Horários de Ônibus

## 1. ESTILO ARQUITETURAL REST (Roy Fielding, 2000)
- Utilize URIs com substantivos no plural (/api/v1/horarios).
- POST /api/v1/horarios DEVE retornar HTTP 201 Created com header Location.
- GET /api/v1/horarios DEVE retornar HTTP 200 OK.
- GET /api/v1/horarios/:id DEVE retornar HTTP 200 OK ou 404 Not Found.
- PUT /api/v1/horarios/:id DEVE retornar HTTP 200 OK.
- DELETE /api/v1/horarios/:id DEVE retornar HTTP 204 No Content sem corpo.
- Payloads inválidos DEVEM retornar HTTP 400 Bad Request.
- NUNCA utilize GET para operações de mutação.

## 2. PERSISTÊNCIA EM NUVEM (Supabase)
- Toda comunicação com o banco ocorre via @supabase/supabase-js.
- Credenciais DEVEM ser lidas de .env (SUPABASE_URL e SUPABASE_ANON_KEY).

## 3. ARQUITETURA EM 4 CAMADAS
- config -> repositories -> controllers -> routes -> server.