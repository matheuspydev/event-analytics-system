# API Usage Guide

Este guia mostra como usar a API do Analytics Platform para enviar eventos e consultar métricas.

## Autenticação

Todas as requisições (exceto as de projetos) requerem uma API Key no header:

```bash
X-API-Key: ak_your_api_key_here
```

## Endpoints

### 1. Criar um Projeto

```bash
curl -X POST http://localhost:3000/api/projects \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Meu Projeto",
    "description": "Projeto de teste"
  }'
```

### 2. Criar API Key

```bash
curl -X POST http://localhost:3000/api/keys \
  -H "Content-Type: application/json" \
  -d '{
    "projectId": "your-project-id",
    "name": "Production API Key"
  }'
```

**⚠️ Importante**: Guarde a API Key retornada, ela não será exibida novamente!

### 3. Enviar um Evento

```bash
curl -X POST http://localhost:3000/api/events \
  -H "Content-Type: application/json" \
  -H "X-API-Key: ak_your_api_key_here" \
  -d '{
    "projectId": "your-project-id",
    "eventType": "page_view",
    "data": {
      "page": "/home",
      "userId": "user123",
      "sessionId": "session456"
    }
  }'
```

### 4. Enviar Múltiplos Eventos (Batch)

```bash
curl -X POST http://localhost:3000/api/events/batch \
  -H "Content-Type: application/json" \
  -H "X-API-Key: ak_your_api_key_here" \
  -d '{
    "events": [
      {
        "projectId": "your-project-id",
        "eventType": "button_click",
        "data": {"button": "login"}
      },
      {
        "projectId": "your-project-id",
        "eventType": "page_view",
        "data": {"page": "/dashboard"}
      }
    ]
  }'
```

### 5. Consultar Métricas

#### Resumo de Métricas (últimas 24h)

```bash
curl "http://localhost:3000/api/metrics/your-project-id/summary?timeWindow=1h&hours=24" \
  -H "X-API-Key: ak_your_api_key_here"
```

#### Série Temporal

```bash
curl "http://localhost:3000/api/metrics/your-project-id/timeseries?metricType=page_view&timeWindow=1h&startDate=2026-01-01T00:00:00Z&endDate=2026-01-14T23:59:59Z" \
  -H "X-API-Key: ak_your_api_key_here"
```

### 6. Listar Eventos

```bash
curl "http://localhost:3000/api/events?projectId=your-project-id&limit=10" \
  -H "X-API-Key: ak_your_api_key_here"
```

## Exemplos de Integração

### Node.js / JavaScript

```javascript
const axios = require('axios');

const API_URL = 'http://localhost:3000/api';
const API_KEY = 'ak_your_api_key_here';

async function trackEvent(eventType, data) {
  try {
    const response = await axios.post(
      `${API_URL}/events`,
      {
        projectId: 'your-project-id',
        eventType,
        data,
      },
      {
        headers: {
          'X-API-Key': API_KEY,
          'Content-Type': 'application/json',
        },
      }
    );
    
    console.log('Event tracked:', response.data);
  } catch (error) {
    console.error('Failed to track event:', error.response?.data || error.message);
  }
}

// Uso
trackEvent('purchase', {
  productId: 'prod-123',
  amount: 99.90,
  currency: 'BRL',
});
```

### Python

```python
import requests

API_URL = 'http://localhost:3000/api'
API_KEY = 'ak_your_api_key_here'

def track_event(event_type, data):
    try:
        response = requests.post(
            f'{API_URL}/events',
            json={
                'projectId': 'your-project-id',
                'eventType': event_type,
                'data': data
            },
            headers={
                'X-API-Key': API_KEY,
                'Content-Type': 'application/json'
            }
        )
        response.raise_for_status()
        print('Event tracked:', response.json())
    except requests.exceptions.RequestException as e:
        print('Failed to track event:', str(e))

# Uso
track_event('user_signup', {
    'userId': 'user789',
    'email': 'user@example.com',
    'plan': 'premium'
})
```

### cURL Script

```bash
#!/bin/bash

API_URL="http://localhost:3000/api"
API_KEY="ak_your_api_key_here"
PROJECT_ID="your-project-id"

# Função para enviar evento
track_event() {
  EVENT_TYPE=$1
  DATA=$2
  
  curl -X POST "${API_URL}/events" \
    -H "Content-Type: application/json" \
    -H "X-API-Key: ${API_KEY}" \
    -d "{
      \"projectId\": \"${PROJECT_ID}\",
      \"eventType\": \"${EVENT_TYPE}\",
      \"data\": ${DATA}
    }"
}

# Uso
track_event "api_call" '{"endpoint": "/users", "method": "GET", "status": 200}'
```

## Rate Limiting

- **Eventos**: 1000 eventos por minuto por API Key
- **API Geral**: 100 requisições por minuto por IP

## Tipos de Eventos Recomendados

- `page_view` - Visualização de página
- `button_click` - Clique em botão
- `form_submit` - Envio de formulário
- `api_call` - Chamada de API
- `error` - Erro na aplicação
- `user_signup` - Cadastro de usuário
- `purchase` - Compra realizada

## WebSocket (Tempo Real)

Para receber eventos em tempo real:

```javascript
import { io } from 'socket.io-client';

const socket = io('http://localhost:3000');

socket.on('connect', () => {
  console.log('Connected');
  socket.emit('subscribe:project', 'your-project-id');
});

socket.on('new:event', (event) => {
  console.log('New event:', event);
});

socket.on('update:metric', (metric) => {
  console.log('Metric updated:', metric);
});
```

## Estrutura de Resposta

### Sucesso

```json
{
  "status": "success",
  "data": { ... }
}
```

### Erro

```json
{
  "status": "error",
  "message": "Error message here"
}
```

## Health Check

```bash
curl http://localhost:3000/api/health
```

Retorna:
```json
{
  "status": "success",
  "message": "Analytics Platform API is running",
  "timestamp": "2026-01-14T..."
}
```

## Suporte

Para dúvidas ou problemas, consulte a documentação completa no README.md
