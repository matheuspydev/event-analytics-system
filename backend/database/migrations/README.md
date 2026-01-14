# Database Migrations

Este diretório contém as migrations SQL para o banco de dados PostgreSQL.

## Como aplicar migrations

### Via psql (linha de comando)

```bash
# Conectar ao banco
psql -U postgres -d analytics_platform

# Executar migration
\i database/migrations/001_initial_schema.sql
```

### Via Docker

```bash
# Copiar migration para o container
docker cp database/migrations/001_initial_schema.sql analytics_postgres:/tmp/

# Executar no container
docker exec -it analytics_postgres psql -U postgres -d analytics_platform -f /tmp/001_initial_schema.sql
```

### Automaticamente no startup (Recomendado)

Adicione ao docker-compose.yml:

```yaml
services:
  postgres:
    volumes:
      - ./backend/database/migrations:/docker-entrypoint-initdb.d
```

## Ordem das Migrations

1. `001_initial_schema.sql` - Schema inicial com todas as tabelas
2. (Adicione novas migrations aqui)

## Naming Convention

- `XXX_description.sql` onde XXX é um número sequencial
- Use snake_case para nomes de colunas e tabelas
- Sempre adicione índices para foreign keys e colunas frequentemente consultadas
