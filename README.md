# Analytics API Platform 📊

Uma plataforma profissional de analytics que captura eventos via API, processa dados em tempo real e apresenta métricas em um dashboard interativo.

## ✨ Características

- **Backend Escalável**: Node.js + TypeScript com arquitetura limpa
- **Processamento Assíncrono**: Filas Redis com Bull para alta performance
- **Tempo Real**: WebSocket para atualizações instantâneas
- **Dashboard Interativo**: React com visualizações de dados profissionais
- **API RESTful**: Documentada e com rate limiting
- **Containerizado**: Docker Compose para desenvolvimento fácil

## 🏗️ Arquitetura

```
Cliente → API REST → Redis Queue → Event Processor
                ↓                         ↓
           WebSocket ← Cache/DB ← Agregações
```

**Principais Componentes:**
- **API REST**: Recebe eventos e expõe métricas
- **Event Processor**: Processa eventos assincronamente
- **Aggregation Engine**: Calcula métricas (contadores, médias, percentis)
- **WebSocket Server**: Push de dados em tempo real
- **Dashboard**: Visualização interativa de métricas

## 🚀 Tecnologias

### Backend
- Node.js + TypeScript
- Express.js
- PostgreSQL
- Redis + Bull
- Socket.io
- Jest

### Frontend
- React + TypeScript
- Recharts
- TailwindCSS
- Vite

### DevOps
- Docker + Docker Compose
- ESLint + Prettier
- GitHub Actions (CI/CD)

## 📋 Pré-requisitos

- Node.js 20+
- Docker e Docker Compose
- Git

## 🔧 Instalação e Uso

### Desenvolvimento Local

1. **Clone o repositório**
```bash
git clone <seu-repo>
cd analytics-platform
```

2. **Configure as variáveis de ambiente**
```bash
# Backend
cp backend/env.template backend/.env
# Edite backend/.env com suas configurações
```

3. **Inicie com Docker Compose**
```bash
docker-compose up -d
```

4. **Ou rode localmente**
```bash
# Backend
cd backend
npm install
npm run dev

# Frontend (em outro terminal)
cd frontend
npm install
npm run dev
```

### Acessar a Aplicação

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000
- **API Docs**: http://localhost:3000/api-docs

## 📚 Estrutura do Projeto

```
analytics-platform/
├── backend/
│   ├── src/
│   │   ├── config/          # Configurações (DB, Redis, etc)
│   │   ├── controllers/     # Controllers da API
│   │   ├── services/        # Lógica de negócio
│   │   ├── repositories/    # Camada de dados
│   │   ├── models/          # Modelos/Entities
│   │   ├── jobs/            # Processadores de fila
│   │   ├── middlewares/     # Middlewares Express
│   │   ├── routes/          # Definição de rotas
│   │   ├── validators/      # Schemas de validação
│   │   └── utils/           # Utilitários
│   └── tests/               # Testes unitários e integração
├── frontend/
│   └── src/
│       ├── components/      # Componentes React
│       ├── pages/           # Páginas
│       ├── services/        # Clients da API
│       ├── hooks/           # Custom React Hooks
│       └── utils/           # Utilitários
└── docker-compose.yml
```

## 🔌 API Endpoints

### Projetos
- `POST /api/projects` - Criar projeto
- `GET /api/projects` - Listar projetos
- `GET /api/projects/:id` - Obter projeto
- `PUT /api/projects/:id` - Atualizar projeto
- `DELETE /api/projects/:id` - Deletar projeto

### Eventos
- `POST /api/events` - Enviar evento
- `POST /api/events/batch` - Enviar múltiplos eventos
- `GET /api/events` - Listar eventos

### Métricas
- `GET /api/metrics/:projectId` - Obter métricas do projeto
- `GET /api/metrics/:projectId/summary` - Resumo de métricas
- `GET /api/metrics/:projectId/timeseries` - Série temporal

### API Keys
- `POST /api/keys` - Criar API key
- `GET /api/keys` - Listar API keys
- `DELETE /api/keys/:id` - Revogar API key

## 📊 Exemplo de Uso

### Enviar um Evento

```bash
curl -X POST http://localhost:3000/api/events \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your-api-key" \
  -d '{
    "projectId": "123",
    "eventType": "page_view",
    "data": {
      "url": "/home",
      "userId": "user123"
    }
  }'
```

### Consultar Métricas

```bash
curl http://localhost:3000/api/metrics/123?period=1h \
  -H "X-API-Key: your-api-key"
```

## 🧪 Testes

```bash
# Backend
cd backend
npm test                 # Rodar todos os testes
npm run test:watch       # Modo watch
npm run test:coverage    # Com cobertura
```

## 🏆 Diferenciais Técnicos

### Arquitetura Limpa
- Separação clara de responsabilidades (Controllers → Services → Repositories)
- Dependency Injection para testabilidade
- Design patterns: Repository, Factory, Strategy

### Performance
- Filas assíncronas para processamento em background
- Cache em Redis para queries frequentes
- Agregações pré-computadas
- Conexão pool otimizada

### Observabilidade
- Logs estruturados com Winston
- Métricas de performance
- Health checks

### Segurança
- Rate limiting por API key
- Validação de schemas com Joi
- Helmet para headers de segurança
- CORS configurável

## 🔮 Próximas Features

- [ ] Machine Learning para detecção de anomalias
- [ ] Exportação de dados (CSV, JSON)
- [ ] Alertas avançados com múltiplos canais
- [ ] Integração com Slack/Discord
- [ ] Dashboard customizável
- [ ] Multi-tenancy

## 📝 Licença

MIT

## 👤 Autor

Matheus Faria
---

**⭐ Se este projeto foi útil, considere dar uma estrela!**
