@AGENTS.md

# Drop

## Convenções

- Respostas e UI em português (PT-BR)
- Dark-first: tema escuro é o padrão
- Cores via tokens Tailwind semânticos (`bg-primary`, `text-accent`), nunca hex hardcoded
- Validação com Zod v4 (`zod/v4`)
- Auth.js v5 (beta) com variáveis `AUTH_*` (não NEXTAUTH_*)
- Middleware leve: checa cookie direto, nunca importa Auth.js (limite 1MB Edge)
- Stripe SDK v20+: `current_period_end` vem via `invoice.period_end`
- Prisma ^6 (não v7)
- Preços em centavos (int) no banco

## Comandos

- `npm run dev` — dev server
- `npm run tokens` — gera CSS a partir de `design-system/tokens.ts`
- `npm run db:push` — aplica schema ao banco
- `npm run db:studio` — abre Prisma Studio

## Planos

- FREE: 1 drop ativo, 100 waitlist, 5% fee
- TRIAL (14 dias): tudo ilimitado
- PRO (R$69/mês): drops ilimitados, 0% fee, analytics

## Estrutura de rotas

- `(public)` — rotas públicas (landing, login, página pública de drop)
- `(auth)` — rotas protegidas (dashboard, settings)
- `api/` — route handlers
