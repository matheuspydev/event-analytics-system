# 🚀 Quick Start Guide

Guia rápido para colocar o Analytics Platform funcionando em minutos!

## Pré-requisitos

- Docker e Docker Compose instalados
- Node.js 20+ (para desenvolvimento local)
- Git

## Opção 1: Docker Compose (Recomendado) 🐳

### 1. Clone o repositório

```bash
git clone <seu-repositorio>
cd analytics-platform
```

### 2. Configure as variáveis de ambiente

```bash
# Backend
cp backend/env.template backend/.env
# Edite backend/.env se necessário
```

### 3. Inicie os containers

```bash
docker-compose up -d
```

Aguarde alguns segundos para os serviços iniciarem.

### 4. Acesse a aplicação

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000
- **API Health**: http://localhost:3000/api/health

### 5. Crie seu primeiro projeto

1. Acesse http://localhost:5173
2. Clique em "Novo Projeto"
3. Preencha nome e descrição
4. Clique em "Criar"

### 6. Gere uma API Key

1. Clique no projeto criado
2. Vá para "Settings"
3. Clique em "Nova API Key"
4. **IMPORTANTE**: Copie a chave, ela não será exibida novamente!

### 7. Envie seu primeiro evento

```bash
curl -X POST http://localhost:3000/api/events \
  -H "Content-Type: application/json" \
  -H "X-API-Key: SUA_API_KEY_AQUI" \
  -d '{
    "projectId": "SEU_PROJECT_ID",
    "eventType": "test_event",
    "data": {
      "message": "Hello Analytics Platform!"
    }
  }'
```

### 8. Visualize no Dashboard

Volte para http://localhost:5173/dashboard e veja seu evento aparecer em tempo real! 🎉

## Opção 2: Desenvolvimento Local 💻

### 1. Configure o banco de dados

```bash
# PostgreSQL
docker run -d --name analytics_postgres \
  -e POSTGRES_DB=analytics_platform \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres_password \
  -p 5432:5432 \
  postgres:16-alpine

# Redis
docker run -d --name analytics_redis \
  -p 6379:6379 \
  redis:7-alpine
```

### 2. Execute as migrations

```bash
docker cp backend/database/migrations/001_initial_schema.sql analytics_postgres:/tmp/
docker exec -it analytics_postgres psql -U postgres -d analytics_platform -f /tmp/001_initial_schema.sql
```

### 3. Backend

```bash
cd backend
npm install
cp env.template .env
# Edite .env se necessário
npm run dev
```

O backend estará rodando em http://localhost:3000

### 4. Frontend (em outro terminal)

```bash
cd frontend
npm install
npm run dev
```

O frontend estará rodando em http://localhost:5173

## Comandos Úteis

### Docker

```bash
# Ver logs
docker-compose logs -f

# Reiniciar serviços
docker-compose restart

# Parar tudo
docker-compose down

# Parar e remover volumes
docker-compose down -v

# Reconstruir imagens
docker-compose up -d --build
```

### Backend

```bash
cd backend

# Desenvolvimento
npm run dev

# Build
npm run build

# Produção
npm start

# Testes
npm test

# Lint
npm run lint
npm run lint:fix
```

### Frontend

```bash
cd frontend

# Desenvolvimento
npm run dev

# Build
npm run build

# Preview
npm run preview
```

## Testando a API

### 1. Health Check

```bash
curl http://localhost:3000/api/health
```

### 2. Criar Projeto

```bash
curl -X POST http://localhost:3000/api/projects \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Meu Projeto",
    "description": "Teste"
  }'
```

### 3. Criar API Key

```bash
curl -X POST http://localhost:3000/api/keys \
  -H "Content-Type: application/json" \
  -d '{
    "projectId": "PROJECT_ID_AQUI",
    "name": "Test Key"
  }'
```

### 4. Enviar Eventos

```bash
# Evento único
curl -X POST http://localhost:3000/api/events \
  -H "Content-Type: application/json" \
  -H "X-API-Key: SUA_KEY" \
  -d '{
    "projectId": "PROJECT_ID",
    "eventType": "page_view",
    "data": {"page": "/home"}
  }'

# Batch de eventos
curl -X POST http://localhost:3000/api/events/batch \
  -H "Content-Type: application/json" \
  -H "X-API-Key: SUA_KEY" \
  -d '{
    "events": [
      {"projectId": "ID", "eventType": "click", "data": {"button": "login"}},
      {"projectId": "ID", "eventType": "view", "data": {"page": "/dashboard"}}
    ]
  }'
```

### 5. Consultar Métricas

```bash
curl "http://localhost:3000/api/metrics/PROJECT_ID/summary?timeWindow=1h" \
  -H "X-API-Key: SUA_KEY"
```

## Troubleshooting

### Porta já em uso

```bash
# Verificar o que está usando a porta 3000
lsof -i :3000

# Ou 5173
lsof -i :5173

# Matar processo
kill -9 <PID>
```

### Banco não conecta

```bash
# Verificar se o PostgreSQL está rodando
docker ps | grep postgres

# Ver logs
docker logs analytics_postgres

# Reiniciar
docker restart analytics_postgres
```

### Redis não conecta

```bash
# Verificar
docker ps | grep redis

# Reiniciar
docker restart analytics_redis
```

### Frontend não carrega

1. Limpe cache do navegador
2. Verifique console do navegador (F12)
3. Verifique se backend está rodando
4. Tente http://localhost:5173 em modo anônimo

### Erro de TypeScript

```bash
# Backend
cd backend
rm -rf node_modules dist
npm install
npm run build

# Frontend
cd frontend
rm -rf node_modules dist
npm install
npm run build
```

## Próximos Passos

1. Leia a [Documentação de API](./API_USAGE.md)
2. Entenda a [Arquitetura](./ARCHITECTURE.md)
3. Veja [exemplos de integração](./API_USAGE.md#exemplos-de-integração)
4. Explore o código no `/backend/src` e `/frontend/src`
5. Contribua! Veja [CONTRIBUTING.md](./CONTRIBUTING.md)

## Recursos

- 📖 [README completo](./README.md)
- 🏗️ [Arquitetura](./ARCHITECTURE.md)
- 📡 [Guia de API](./API_USAGE.md)
- 🤝 [Contribuir](./CONTRIBUTING.md)

## Suporte

Problemas? Abra uma issue no GitHub!

---

**Divirta-se construindo com Analytics Platform! 🚀**
