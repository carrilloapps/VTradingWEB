# AI Coding Assistant Instructions

Welcome to the `vtradingweb` codebase! This document provides essential guidelines and conventions to help AI coding assistants contribute effectively to this project.

## Project Overview

This is a **Next.js** project bootstrapped with `create-next-app`. The application is structured as a multi-page app with the following key directories:

- **`app/`**: Contains the main application pages and their respective components. Each subdirectory represents a route (e.g., `app/contacto/page.tsx` for the `/contacto` route).
  - Shared styles are located in `app/globals.css`.
  - The main layout is defined in `app/layout.tsx`.
- **`components/`**: Reusable UI components such as `Navbar`, `Footer`, and `MarketTicker`.
- **`context/`**: Context providers for global state management, such as `ThemeContext.tsx`.
- **`lib/`**: Utility functions and integrations, including `firebase.ts` for Firebase configuration and `vtrading-api.ts` for API interactions.
- **`public/`**: Static assets like images and other files.

## Key Workflows

### Development
To start the development server, use one of the following commands:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

The app will be available at [http://localhost:3000](http://localhost:3000). Changes to files in the `app/` directory will trigger hot-reloading.

### Building for Production
To build the project for production, run:

```bash
npm run build
```

The output will be located in the `.next/` directory.

### Linting and Formatting
This project uses ESLint for linting and PostCSS for styling. To run linting:

```bash
npm run lint
```

### Firebase Integration
The project integrates with Firebase for backend services. The configuration is managed in `lib/firebase.ts`. Ensure you have the correct Firebase credentials and configuration in `firebase.json`.

### TypeScript
This project uses TypeScript for type safety. Type definitions are located in `lib/vtrading-types.ts`.

## Project-Specific Conventions

1. **File Structure**: Follow the existing folder and file naming conventions:
   - Use `kebab-case` for directories.
   - Use `PascalCase` for React components.
   - Use `camelCase` for variables and functions.

2. **Component Organization**: Place reusable components in the `components/` directory. Page-specific components should reside within their respective `app/` subdirectories.

3. **API Integration**: Use the `lib/vtrading-api.ts` file for all API interactions. Avoid hardcoding API calls directly in components.

4. **Styling**: Use `globals.css` for global styles and scoped CSS modules for component-specific styles.

5. **State Management**: Use React Context for global state management. Refer to `context/ThemeContext.tsx` for an example.

## External Dependencies

- **Next.js**: Framework for server-side rendering and static site generation.
- **Firebase**: Backend services for authentication, database, and storage.
- **PostCSS**: For CSS transformations.

## Testing
- Add unit tests for all components and utility functions.
- Place test files next to the code they test, using the `.test.tsx` or `.test.ts` naming convention.
- Use Jest and React Testing Library for testing.

## Deployment
The project is designed to be deployed on [Vercel](https://vercel.com). Follow the [Next.js deployment guide](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Key Files and Directories

- `app/`: Main application pages and layouts.
- `components/`: Reusable UI components.
- `context/`: Global state management.
- `lib/`: Utility functions and external integrations.
- `public/`: Static assets.
- `firebase.json`: Firebase configuration.
- `tsconfig.json`: TypeScript configuration.
- `eslint.config.mjs`: ESLint configuration.
- `postcss.config.mjs`: PostCSS configuration.

## Notes for AI Agents
- Always follow the existing file and folder naming conventions.
- Use the `lib/` directory for utility functions and external integrations.
- Ensure all new components are strongly typed and include comprehensive tests.
- Avoid introducing new dependencies without prior approval.
- Document any new features or changes in the `README.md` file.

For any questions or clarifications, refer to the `README.md` or consult the project maintainers.