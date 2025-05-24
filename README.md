# Next.js Boilerplate

A modern, feature-rich Next.js boilerplate project with TypeScript, Tailwind CSS, and a comprehensive component library. This project is designed to provide a solid foundation for building scalable and maintainable web applications.

## Features

- **Next.js 15** - Latest version with App Router
- **React 19** - Latest React version with improved performance
- **TypeScript** - Type safety with strict mode enabled
- **Tailwind CSS** - Utility-first CSS framework for rapid UI development
- **UI Component Library** - Comprehensive set of UI components built with [shadcn/ui](https://ui.shadcn.com/) (Radix UI + Tailwind CSS)
- **Data Fetching** - TanStack React Query for efficient data fetching and caching
- **Form Handling** - React Hook Form with Zod validation
- **State Management** - Zustand for simple and efficient state management
- **URL State Management** - nuqs for managing URL search parameters
- **Data Tables** - TanStack Table for powerful and flexible tables
- **Notifications** - Sonner for beautiful toast notifications
- **Code Quality Tools**:
  - Prettier for code formatting
  - ESLint with TypeScript and import sorting rules
  - Husky for Git hooks
  - lint-staged for pre-commit linting

## Project Structure

```
nextjs-boilerplate/
├── public/                # Static assets
├── src/
│   ├── actions/           # Server actions
│   ├── app/               # Next.js App Router pages
│   ├── components/        # Reusable UI components
│   │   ├── common/        # Common components
│   │   ├── tables/        # Table components
│   │   └── ui/            # UI primitives
│   ├── configs/           # Configuration files
│   ├── constants/         # Constants and enums
│   ├── data/              # Mock data and data utilities
│   ├── hooks/             # Custom React hooks
│   ├── nuqs/              # URL search params configuration
│   ├── providers/         # Context providers
│   ├── styles/            # Global styles
│   ├── types/             # TypeScript type definitions
│   └── utils/             # Utility functions
├── .eslintrc.js           # ESLint configuration
├── .prettierrc            # Prettier configuration
├── next.config.ts         # Next.js configuration
├── package.json           # Project dependencies
└── tsconfig.json          # TypeScript configuration
```

## Getting Started

### Prerequisites

- Node.js 22 or higher
- pnpm 10 or higher

### Installation

1. Clone the repository:

```bash
git clone https://github.com/your-username/nextjs-boilerplate.git
cd nextjs-boilerplate
```

2. Install dependencies:

```bash
pnpm install
```

3. Run the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Available Scripts

- `pnpm dev` - Run development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm lint:fix` - Fix ESLint issues
- `pnpm format` - Format code with Prettier

## Key Features

### Dashboard and Data Tables

The project includes a dashboard with data tables for displaying and managing products. The tables support:

- Sorting
- Filtering
- Pagination
- Row selection
- Custom actions

### Form Components

Comprehensive form components with validation using React Hook Form and Zod:

- Input fields
- Select dropdowns
- Checkboxes
- Date pickers
- Currency inputs

### API Integration

The project includes a structured approach to API integration:

- API routes in the `app/api` directory
- Axios for HTTP requests
- React Query for data fetching and caching

### Environment Configuration

Support for different environments:

- Development
- Staging
- Production
- Cross-env for Windows compatibility

## Deployment

The project can be deployed to various platforms:

- Vercel (recommended)
- Netlify
- AWS Amplify
- Self-hosted

## Learn More

To learn more about the technologies used in this project:

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TanStack React Query](https://tanstack.com/query/latest)
- [TanStack Table](https://tanstack.com/table/latest)
- [React Hook Form](https://react-hook-form.com/)
- [Zod](https://zod.dev/)
- [Zustand](https://zustand-demo.pmnd.rs/)
- [nuqs](https://nuqs.47ng.com/)
