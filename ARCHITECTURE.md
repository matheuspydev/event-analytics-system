# Arquitetura do Analytics Platform

## Visão Geral

O Analytics Platform é uma aplicação full-stack moderna construída com Node.js/TypeScript no backend e React no frontend. A arquitetura foi projetada para ser escalável, manutenível e performática.

## Diagrama de Arquitetura

```
┌─────────────────────────────────────────────────────────────┐
│                        FRONTEND                             │
│  React + TypeScript + Tailwind + Recharts + Socket.io      │
└───────────────────┬─────────────────────────────────────────┘
                    │
                    │ HTTP/REST + WebSocket
                    ▼
┌─────────────────────────────────────────────────────────────┐
│                     API GATEWAY (Express)                   │
│  • Rate Limiting                                            │
│  • CORS                                                     │
│  • Authentication (API Keys)                                │
│  • Validation (Joi)                                         │
└───────────────────┬─────────────────────────────────────────┘
                    │
       ┌────────────┼────────────┐
       │            │            │
       ▼            ▼            ▼
┌───────────┐ ┌──────────┐ ┌──────────┐
│Controllers│ │WebSocket │ │  Routes  │
└─────┬─────┘ └────┬─────┘ └────┬─────┘
      │            │            │
      └────────────┼────────────┘
                   │
                   ▼
         ┌─────────────────┐
         │    Services     │
         │  (Business      │
         │   Logic)        │
         └────────┬────────┘
                  │
       ┌──────────┼──────────┐
       │          │          │
       ▼          ▼          ▼
┌──────────┐ ┌────────┐ ┌────────┐
│Repository│ │  Jobs  │ │ Queue  │
│  Layer   │ │        │ │Manager │
└─────┬────┘ └───┬────┘ └───┬────┘
      │          │          │
      │          │          │
      ▼          ▼          ▼
┌──────────┐ ┌─────────┐ ┌──────┐
│PostgreSQL│ │  Redis  │ │ Bull │
│(Database)│ │ (Cache) │ │(Queue)│
└──────────┘ └─────────┘ └──────┘
```

## Componentes Principais

### Backend

#### 1. **API Layer** (Express.js)
- **Controllers**: Recebem requisições HTTP e retornam respostas
- **Routes**: Definem os endpoints da API
- **Middlewares**: Autenticação, validação, rate limiting, error handling

#### 2. **Business Logic Layer**
- **Services**: Contêm a lógica de negócio
- **Validators**: Schemas Joi para validação de dados
- **Types**: Definições TypeScript para type safety

#### 3. **Data Access Layer**
- **Repositories**: Abstração para acesso ao banco de dados
- **Models**: Representação dos dados em memória

#### 4. **Queue System** (Bull + Redis)
- **Event Processor**: Processa eventos assincronamente
- **Metric Aggregator**: Calcula e agrega métricas
- **Workers**: Executam jobs da fila

#### 5. **Real-time Layer** (Socket.io)
- Notificações em tempo real para o frontend
- Pub/Sub pattern para eventos e métricas

### Frontend

#### 1. **UI Layer**
- **Components**: Componentes React reutilizáveis
- **Pages**: Páginas principais da aplicação
- **Layout**: Estrutura comum (header, footer, nav)

#### 2. **State Management** (Zustand)
- Store global para estado da aplicação
- Gerenciamento de projeto selecionado e API key

#### 3. **Data Layer**
- **Services**: API clients (axios)
- **Hooks**: Custom hooks para lógica reutilizável
- **Socket Service**: Gerenciamento de WebSocket

## Fluxo de Dados

### 1. Ingestão de Eventos

```
Client → API → Validation → Queue → Worker → Database
                                 ↓
                            Aggregation
                                 ↓
                          Metric Update
                                 ↓
                          WebSocket Push
                                 ↓
                           Frontend
```

### 2. Consulta de Métricas

```
Frontend → API → Service → Repository → Database
                             ↓
                          Cache (Redis)
                             ↓
                          Response
```

## Padrões de Design Utilizados

### 1. **Repository Pattern**
Abstrai o acesso a dados, facilitando testes e mudanças no banco.

```typescript
class ProjectRepository {
  async findById(id: string): Promise<ProjectModel> {
    // Database access logic
  }
}
```

### 2. **Service Layer Pattern**
Separa a lógica de negócio dos controllers.

```typescript
class ProjectService {
  constructor(private repo: ProjectRepository) {}
  
  async createProject(data: CreateProjectDTO): Promise<Project> {
    // Business logic here
    return this.repo.create(data);
  }
}
```

### 3. **Dependency Injection**
Facilita testes e desacoplamento.

```typescript
const repo = new ProjectRepository(pool);
const service = new ProjectService(repo);
const controller = new ProjectController(service);
```

### 4. **Factory Pattern**
Criação de objetos complexos.

```typescript
class ProjectModel {
  static fromDatabase(row: any): ProjectModel {
    return new ProjectModel({...});
  }
}
```

### 5. **Observer Pattern** (WebSocket)
Notificações em tempo real para múltiplos clientes.

```typescript
io.to(`project:${projectId}`).emit('new:event', data);
```

## Escalabilidade

### Horizontal Scaling

1. **API Server**: Stateless, pode escalar horizontalmente
2. **Workers**: Múltiplas instâncias processando a fila
3. **Database**: Read replicas para consultas
4. **Redis**: Cluster mode para alta disponibilidade

### Vertical Scaling

1. **Connection Pooling**: PostgreSQL com pool de 20 conexões
2. **Caching**: Redis para queries frequentes
3. **Indexação**: Índices estratégicos no banco

### Performance Optimizations

1. **Batch Processing**: Eventos podem ser enviados em lote
2. **Async Processing**: Filas para processamento assíncrono
3. **Pre-aggregation**: Métricas pré-calculadas
4. **Compression**: Gzip para responses

## Segurança

### 1. **Autenticação**
- API Keys com hash seguro
- Rate limiting por chave

### 2. **Validação**
- Joi schemas para todos os inputs
- Sanitização de dados

### 3. **Headers de Segurança** (Helmet)
- XSS Protection
- Content Security Policy
- HSTS

### 4. **CORS**
- Configuração restrita de origens
- Credentials support

## Monitoramento e Observabilidade

### 1. **Logging** (Winston)
- Structured logs
- Multiple transports (console, file)
- Log levels configuráveis

### 2. **Error Tracking**
- Centralized error handling
- Stack traces preservadas
- Operational vs Programming errors

### 3. **Health Checks**
- `/api/health` endpoint
- Database connection tests

## Testes

### 1. **Unit Tests** (Jest)
- Services
- Repositories
- Utilities

### 2. **Integration Tests**
- API endpoints
- Database operations

### 3. **Coverage**
- Mínimo de 70% para serviços críticos

## CI/CD

### 1. **GitHub Actions** (configuração sugerida)
```yaml
- Lint
- Type check
- Tests
- Build
- Docker image
- Deploy
```

### 2. **Docker**
- Multi-stage builds
- Otimização de camadas
- Docker Compose para desenvolvimento

## Melhorias Futuras

1. **Caching Layer**: Redis para métricas calculadas
2. **Message Queue**: Kafka para maior throughput
3. **Time-series Database**: InfluxDB ou TimescaleDB
4. **CDN**: Para assets estáticos
5. **Load Balancer**: NGINX ou AWS ALB
6. **Monitoring**: Prometheus + Grafana
7. **APM**: New Relic ou Datadog
8. **Auto-scaling**: Kubernetes com HPA

## Tecnologias e Versões

- **Node.js**: 20.x LTS
- **TypeScript**: 5.3.x
- **Express**: 4.18.x
- **PostgreSQL**: 16.x
- **Redis**: 7.x
- **React**: 18.2.x
- **Docker**: 24.x

## Links Úteis

- [API Documentation](./API_USAGE.md)
- [README](./README.md)
- [Backend Code](./backend/src)
- [Frontend Code](./frontend/src)
