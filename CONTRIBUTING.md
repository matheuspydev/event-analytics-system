# Contribuindo para o Analytics Platform

Obrigado por considerar contribuir para este projeto! Este documento fornece diretrizes para contribuições.

## Como Contribuir

1. **Fork o repositório**
2. **Clone seu fork**
   ```bash
   git clone https://github.com/seu-usuario/analytics-platform.git
   cd analytics-platform
   ```

3. **Crie uma branch para sua feature**
   ```bash
   git checkout -b feature/minha-feature
   ```

4. **Faça suas alterações**

5. **Commit suas mudanças**
   ```bash
   git commit -m "feat: adiciona nova feature"
   ```

6. **Push para seu fork**
   ```bash
   git push origin feature/minha-feature
   ```

7. **Abra um Pull Request**

## Padrões de Código

### Backend (TypeScript)

- Use TypeScript strict mode
- Siga o ESLint configurado
- Mantenha funções pequenas e focadas
- Documente código complexo
- Use nomes descritivos

### Frontend (React)

- Componentes funcionais com hooks
- TypeScript para props e state
- CSS com Tailwind
- Mantenha componentes pequenos

### Commits

Use Conventional Commits:
- `feat:` Nova feature
- `fix:` Correção de bug
- `docs:` Documentação
- `refactor:` Refatoração
- `test:` Testes
- `chore:` Tarefas gerais

## Testes

- Adicione testes para novas features
- Mantenha coverage mínimo de 70%
- Execute testes antes de enviar PR

```bash
# Backend
cd backend
npm test

# Frontend
cd frontend
npm test
```

## Code Review

- Seja respeitoso
- Aceite feedback construtivo
- Discuta soluções alternativas

## Issues

- Use templates quando disponíveis
- Forneça informações detalhadas
- Inclua steps to reproduce para bugs
- Anexe screenshots quando relevante

## Dúvidas?

Abra uma issue com a tag `question`.

## Licença

Ao contribuir, você concorda que suas contribuições serão licenciadas sob a mesma licença do projeto (MIT).
