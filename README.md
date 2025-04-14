<a href="">
  <img alt="FinControl" src="public/_static/og.jpg">
  <h1 align="center">FinControl - Sistema de Controle Financeiro</h1>
</a>

<p align="center">
  Sistema completo de controle financeiro com dashboards intuitivos e análises avançadas
</p>

<p align="center">
  <a href="https://twitter.com/dreeilima">
    <img src="https://img.shields.io/twitter/follow/dreeilima?style=flat&label=dreeilima&logo=twitter&color=0bf&logoColor=fff" alt="dreeilima X follower count" />
  </a>
</p>

<p align="center">
  <a href="#introduction"><strong>Introdução</strong></a> ·
  <a href="#installation"><strong>Instalação</strong></a> ·
  <a href="#tech-stack--features"><strong>Tech Stack + Features</strong></a> ·
  <a href="#author"><strong>Author</strong></a> ·
  <a href="#credits"><strong>Credits</strong></a>
</p>
<br/>

## Introduction

FinControl é uma aplicação completa para gerenciamento de finanças pessoais e empresariais, construída com tecnologias modernas como Next.js 14, Prisma, Neon, Auth.js v5, Resend, React Email, Shadcn/ui e Stripe.

Com interfaces intuitivas e dashboards informativos, o FinControl permite que você:

- Gerencie receitas e despesas com facilidade
- Visualize métricas financeiras em tempo real
- Acompanhe seu orçamento com alertas inteligentes
- Analise padrões de gastos e tendências
- Obtenha previsões financeiras baseadas em seus dados

Para administradores, o sistema oferece métricas de negócio avançadas como MRR (Monthly Recurring Revenue), análise de retenção de usuários e muito mais.

> [!TIP]
> Adicione capturas de tela do sistema na pasta `public/_static/screenshots/` para ilustrar as funcionalidades no README.

## Installation

    Clone & create this repo locally with the following command:

```bash
npx create-next-app my-saas-project --example "https://github.com/dreeilima/fincontrol"
```

Or, deploy with Vercel:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fdreeilima%2Ffincontrol)

### Steps

1. Install dependencies using pnpm:

```sh
pnpm install
```

2. Copy `.env.example` to `.env.local` and update the variables.

```sh
cp .env.example .env.local
```

3. Start the development server:

```sh
pnpm run dev
```

> [!NOTE]
> I use [npm-check-updates](https://www.npmjs.com/package/npm-check-updates) package for update this project.
>
> Use this command for update your project: `ncu -i --format group`

## Roadmap

- [ ] Upgrade eslint to v9
- [ ] Add resend for success subscriptions
- [ ] Implementar APIs para novas funcionalidades de métricas
- [ ] Adicionar personalização de dashboards para usuários
- [ ] Melhorar experiência mobile para gráficos e relatórios
- [ ] Expandir métricas administrativas (cohorts, CAC, LTV)
- [ ] Implementar sistema de metas financeiras personalizáveis

## Tech Stack + Features

### Novas Funcionalidades

#### Para Usuários

- **Progresso de Orçamento**: Visualização clara do quanto já foi gasto do orçamento mensal
- **Alertas Inteligentes**: Notificações visuais quando os gastos se aproximam do limite
- **Análise de Fluxo de Caixa**: Gráfico de evolução do saldo ao longo do tempo
- **Padrões de Gastos**: Identificação de tendências por categoria nos últimos meses
- **Previsão Financeira**: Projeção de receitas e despesas para os próximos meses

#### Para Administradores

- **Métricas de MRR**: Acompanhamento detalhado da receita recorrente mensal
- **Análise de Retenção**: Gráfico de retenção e churn de usuários
- **Dashboard de Receita**: Visualização de métricas como ARPU e LTV
- **Monitoramento de Usuários**: Tabela dos usuários mais ativos e suas transações

https://github.com/dreeilima/fincontrol/

### Frameworks

- [Next.js](https://nextjs.org/) – React framework for building performant apps with the best developer experience
- [Auth.js](https://authjs.dev/) – Handle user authentication with ease with providers like Google, Twitter, GitHub, etc.
- [Prisma](https://www.prisma.io/) – Typescript-first ORM for Node.js
- [React Email](https://react.email/) – Versatile email framework for efficient and flexible email development

### Platforms

- [Vercel](https://vercel.com/) – Easily preview & deploy changes with git
- [Resend](https://resend.com/) – A powerful email framework for streamlined email development
- [Neon](https://neon.tech/) – Serverless Postgres with autoscaling, branching, bottomless storage and generous free tier.

### UI

- [Tailwind CSS](https://tailwindcss.com/) – Utility-first CSS framework for rapid UI development
- [Shadcn/ui](https://ui.shadcn.com/) – Re-usable components built using Radix UI and Tailwind CSS
- [Framer Motion](https://framer.com/motion) – Motion library for React to animate components with ease
- [Lucide](https://lucide.dev/) – Beautifully simple, pixel-perfect icons
- [Recharts](https://recharts.org/) – Composable charting library for data visualization
- [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) – Optimize custom fonts and remove external network requests for improved performance
- [`ImageResponse`](https://nextjs.org/docs/app/api-reference/functions/image-response) – Generate dynamic Open Graph images at the edge

### Hooks and Utilities

- `useIntersectionObserver` – React hook to observe when an element enters or leaves the viewport
- `useLocalStorage` – Persist data in the browser's local storage
- `useScroll` – React hook to observe scroll position ([example](https://github.com/dreeilima/fincontrol/blob/main/components/layout/navbar.tsx#L12))
- `nFormatter` – Format numbers with suffixes like `1.2k` or `1.2M`
- `capitalize` – Capitalize the first letter of a string
- `truncate` – Truncate a string to a specified length
- [`use-debounce`](https://www.npmjs.com/package/use-debounce) – Debounce a function call / state update

### Code Quality

- [TypeScript](https://www.typescriptlang.org/) – Static type checker for end-to-end typesafety
- [Prettier](https://prettier.io/) – Opinionated code formatter for consistent code style
- [ESLint](https://eslint.org/) – Pluggable linter for Next.js and TypeScript

### Funcionalidades Principais

- **Dashboard Intuitivo**: Visualização clara de métricas financeiras com comparativos mensais
- **Orçamento Inteligente**: Acompanhamento de orçamento com alertas visuais e previsões
- **Análises Avançadas**: Gráficos de fluxo de caixa, padrões de gastos e tendências
- **Previsões Financeiras**: Projeções baseadas em histórico de transações
- **Métricas de Negócio**: MRR, retenção de usuários, análise de crescimento (para administradores)
- **Relatórios Personalizáveis**: Visualizações detalhadas por período e categoria

### Miscellaneous

- [Vercel Analytics](https://vercel.com/analytics) – Track unique visitors, pageviews, and more in a privacy-friendly way

## Author

Created by [@dreeilima](https://twitter.com/dreeilima) in 2025, released under the [MIT license](https://github.com/dreeilima/fincontrol/blob/main/LICENSE.md).

## Credits

This project was inspired by shadcn's [Taxonomy](https://github.com/shadcn-ui/taxonomy), Steven Tey’s [Precedent](https://github.com/steven-tey/precedent), and Antonio Erdeljac's [Next 13 AI SaaS](https://github.com/AntonioErdeljac/next13-ai-saas).

- Shadcn ([@shadcn](https://twitter.com/shadcn))
- Steven Tey ([@steventey](https://twitter.com/steventey))
- Antonio Erdeljac ([@YTCodeAntonio](https://twitter.com/AntonioErdeljac))
