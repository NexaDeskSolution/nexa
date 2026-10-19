# NexaDesk — Base Frontend

Protótipo inicial da interface do NexaDesk, baseado na ERS enviada. O projeto utiliza HTML, CSS, JavaScript, Python, Flask e `uv`. A logo fornecida foi adicionada aos arquivos estáticos e a identidade visual utiliza azul, azul-escuro e verde-água.

## O que já está preparado

- Tela de entrada demonstrativa.
- Layout responsivo com navegação lateral.
- Dashboard visual com indicadores, gráfico e chamados recentes.
- Telas-base para usuários, clientes, equipamentos, chamados, técnicos, estoque, fornecedores, orçamentos, financeiro e histórico.
- Pesquisa e filtros de demonstração.
- Formulários e tabelas com dados fictícios para apoiar o desenvolvimento do frontend.
- Estrutura de pastas simples para integrar futuramente com uma API REST.

## Executar com uv

Abra o terminal na pasta raiz `NexaDesk-Frontend`:

```bash
uv sync
uv run python backend/app.py
```

Acesse `http://127.0.0.1:5000`.

Se preferir ativar um ambiente virtual manualmente:

```bash
uv venv
uv pip install flask
uv run python backend/app.py
```

## Importante

Esta entrega é uma **base visual de frontend**, não o sistema completo. Os dados apresentados são fictícios e ficam no JavaScript do navegador. O formulário de entrada é apenas demonstrativo: não implementa autenticação, sessão segura, permissões reais ou proteção de rotas. Os formulários não gravam no PostgreSQL e as rotas da API da ERS ainda precisam ser desenvolvidas e integradas via `fetch`.

Quando a API estiver pronta, substitua os dados demonstrativos em `frontend/static/js/app.js` pelas chamadas `fetch` para as rotas definidas na ERS. A autorização e as regras de negócio devem ser validadas no backend, nunca apenas pela interface.
