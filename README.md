# Valence Performance Management Platform

Valence is a high-performance, industrial-grade performance management and goal-setting engine designed for enterprise operations. It combines a premium Liquid Glass aesthetic with rigorous business logic to streamline performance tracking and auditing.

## Core Features

- **Goal Sheet Builder**: Dynamic interface for employees to set up to 8 performance goals with strict weightage enforcement (exactly 100%).
- **Manager Approval Workflow**: Integrated control plane for managers to audit, adjust, and lock subordinate performance targets.
- **Quarterly Check-ins**: Automated scheduling (AtomQuest cycle) for tracking actual achievements across four quarters.
- **Enterprise Analytics**: Comprehensive dashboard featuring departmental status distribution and achievement trends using Recharts.
- **Audit Logging**: Immutable record of all state changes, including manager approvals and goal modifications.
- **Automated Governance**: Escalation logic to identify and alert on stale performance goals exceeding SLA windows.

## Technical Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js with Role-Based Access Control (RBAC)
- **UI System**: Tailwind CSS with "Liquid Glass" design system
- **Animations**: Framer Motion
- **Data Visualization**: Recharts
- **Testing**: Vitest

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- Azure AD / Microsoft Entra ID credentials (for SSO)

### Installation

1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables in `.env`:
   - `DATABASE_URL`
   - `NEXTAUTH_SECRET`
   - `AZURE_AD_CLIENT_ID`
   - `AZURE_AD_CLIENT_SECRET`
   - `AZURE_AD_TENANT_ID`
4. Initialize the database:
   ```bash
   npx prisma db push
   npx prisma db seed
   ```
5. Run the development server:
   ```bash
   npm run dev
   ```

## Governance and Escalation

To run the SLA escalation check manually:
```bash
npm run escalate
```

## Analytics and Reports

The platform provides a built-in CSV export for governance reporting, accessible through the Admin Analytics dashboard.
