# Valence Performance Management

Valence is a precision-engineered, full-stack performance management engine designed for industrial-scale operations. Built with a focus on high-fidelity user experience and immutable data integrity, it streamlines the goal-setting, auditing, and achievement tracking workflows for complex business units.

## Technical Architecture

The platform is built on a modern, type-safe stack designed for reliability and speed:

- **Frontend**: Next.js 14 (App Router) with React 18.
- **Styling**: Tailwind CSS utilizing a custom "Liquid Glass" design system for a premium, industrial aesthetic.
- **State & Logic**: Framer Motion for micro-animations and React Hook Form for validated data entry.
- **Backend**: Next.js Edge-ready API routes with Prisma ORM.
- **Database**: PostgreSQL with strict schema enforcement and audit logging.
- **Authentication**: NextAuth.js providing multi-provider SSO (Azure AD, Google) and Passwordless Magic Links.
- **Analytics**: High-performance data visualization powered by Recharts.

## Project Structure

```text
valence/
├── prisma/                  # Database schema and migration tracking
│   ├── schema.prisma        # Source of truth for domain models
│   └── seed.ts              # Production-grade data seeding
├── scripts/                 # Governance and automation scripts
│   └── escalate.ts          # SLA breach detection and alerting
├── src/
│   ├── app/                 # Next.js App Router (Routes and Layouts)
│   │   ├── api/             # Backend API nodes
│   │   ├── dashboard/       # Protected application routes
│   │   └── login/           # Authentication gateway
│   ├── components/          # Reusable UI architecture
│   │   ├── admin/           # Administrative intelligence nodes
│   │   ├── dashboard/       # Core layout components
│   │   ├── goals/           # Functional goal-setting blocks
│   │   └── ui/              # "Liquid Glass" component library
│   ├── lib/                 # Core engine and shared utilities
│   │   ├── auth.ts          # Authentication orchestration
│   │   ├── db.ts            # Database singleton
│   │   └── engine.ts        # Mathematical achievement engine
│   └── middleware.ts        # Edge-optimized RBAC enforcement
└── package.json             # Environment orchestration
```

## Implementation Workflow

### 1. Goal Orchestration
Employees define their annual thrust areas and targets. The system enforces a strict 100% weightage rule and a maximum of 8 strategic goals per sheet to ensure focus and alignment.

### 2. Immutable Auditing
Manager L1 reviews are backed by a transaction-safe approval engine. Any adjustment to weightages or targets is captured in an immutable audit log, creating a transparent history of performance definitions.

### 3. Achievement Tracking
Quarterly check-ins are restricted to specific windows (AtomQuest cycle). The achievement engine calculates live performance metrics based on UOM types (MIN, MAX, Timeline, Zero-based).

### 4. Intelligence & Governance
Administrators access a high-fidelity analytics dashboard for plant-wide visibility. Automated scripts run periodically to escalate stale goal sheets that breach the 10-day approval SLA.

## Getting Started

### Local Development

1. **Environment Config**: Duplicate `.env.example` to `.env` and populate your provider credentials and database connection string.
2. **Install Dependencies**:

```bash
npm install
```

3. **Database Sync**:

```bash
npx prisma db push
npx prisma generate
npx prisma db seed
```

4. **Launch**:

```bash
npm run dev
```

### Operational Scripts

Execute governance checks:

```bash
npm run escalate
```

Run unit tests for the mathematical engine:

```bash
npm run test
```

## Governance and Reporting

Valence includes a built-in compliance export tool. Administrators can generate a full CSV report of the plant's performance status directly from the Analytics dashboard, ensuring audit readiness at all times.

---

## Valence Chemical Simulation & Trillion-Compound Synthon Engine (`engine/`)

Valence includes an open-source, agent-native chemical process simulation and combinatorial chemical graph engine located in `/engine`:

### Key Capabilities

- **Trillion-Compound Virtual Synthon Space:** Generates and addresses over 1.12 trillion synthesizable molecules deterministically on-the-fly in `< 5 MB` of code without storing terabytes of static data.
- **Aspen-Grade Process Simulation:** Solves rigorous mass and adiabatic energy balances for industrial flowsheets (Mixers, Splitters, Flash Drums, Heat Exchangers) with zero residuals.
- **Deterministic & Zero-Hallucination:** Evaluates molecular properties ($T_c, P_c, \omega$, boiling point, heat capacity polynomials) using verified NIST, DIPPR, and group-contribution models.
- **Agent-Ready:** Plain-text declarative schemas and automatic Markdown/JSON stream reporting.

### Quickstart (Simulation Engine)

```bash
cd engine
uv run test_engine.py
```

---

## Licensing, Student Grant & Commercial Terms

This project is governed by the **Valence Source License 1.0** ([`LICENSE`](file:///d:/Engineering%20Software/Valence/LICENSE)):

- **Students, Educators & Academic Researchers:** **100% Free** for personal, educational, and academic research purposes.
- **Mandatory Attribution:** Any fork, modification, or presentation must prominently credit:
  > *"Originally developed by Sourish Senapati (Valence Project - [https://github.com/SourishSenapati/Valence](https://github.com/SourishSenapati/Valence))"*
- **Commercial & Enterprise Use:** **Strictly Prohibited without a separate Commercial Agreement.** Any corporate, revenue-generating, or proprietary production use requires a commercial license agreement, consulting contract, or employment engagement directly with the author.

### Commercial Licensing & Employment Inquiries

For commercial licensing, enterprise deployment, custom unit operations, or consulting/hiring inquiries:

- **Author:** Sourish Senapati
- **Email:** [sourishsenapati791@gmail.com](mailto:sourishsenapati791@gmail.com)
- **GitHub:** [@SourishSenapati](https://github.com/SourishSenapati)


