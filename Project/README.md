# Project Management Application

A modern Angular-based project management application built with TypeScript, Angular Material, and standalone components. This application enables teams to collaborate on projects, manage tasks, and communicate through comments.

## Overview

This project is a comprehensive team and project management system that allows users to:
- Authenticate and manage user accounts
- Create and manage teams
- Organize projects within teams
- Create and track tasks
- Add comments and collaborate on tasks
- Responsive Material Design interface

## Features

- **User Authentication**: Secure login and registration with JWT tokens
- **Team Management**: Create teams and manage team members
- **Project Tracking**: Organize projects by team with detailed project information
- **Task Management**: Create, update, and track project tasks
- **Collaboration**: Add comments to tasks for team communication
- **Responsive Design**: Material Design components for modern UX
- **Route Protection**: Authentication guard for secure routes
- **HTTP Interceptor**: Automatic JWT token management

## Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── header/              # Navigation and user menu
│   │   ├── login/               # User login page
│   │   ├── register/            # User registration page
│   │   ├── teams/               # Teams listing and management
│   │   ├── team-card/           # Individual team display
│   │   ├── team-projects/       # Projects within a team
│   │   ├── project-task/        # Individual task component
│   │   ├── commets/             # Comments section
│   │   └── error404/            # 404 error page
│   ├── services/
│   │   ├── authService/         # Authentication logic
│   │   ├── teamsService/        # Team management API
│   │   ├── projectsService/     # Project management API
│   │   ├── taskService/         # Task management API
│   │   └── commentService/      # Comment management API
│   ├── guard/
│   │   └── authguard/           # Route authentication guard
│   ├── interceptors/
│   │   └── auth-interceptor/    # HTTP auth token interceptor
│   ├── models/                  # TypeScript interfaces
│   │   ├── auth.model.ts
│   │   ├── teams.model.ts
│   │   ├── projects.model.ts
│   │   ├── task.model.ts
│   │   └── comment.model.ts
│   ├── app.routes.ts            # Application routing
│   ├── app.config.ts            # App configuration
│   └── app.ts                   # Root component
└── environments/                # Environment-specific configs
```

## Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Configure the API endpoint in `src/environments/environment.ts`

## Development

Start the development server:

```bash
npm start
```

The application will be available at `http://localhost:4200/` and will automatically reload on changes.

## Testing

Run unit tests:

```bash
npm test
```

Tests use Karma and Jasmine for testing Angular components and services.

## Building

Build the project for production:

```bash
npm run build
```

Build artifacts will be stored in the `dist/` directory.

## Technologies

- **Angular 18+** - Modern web framework with standalone components
- **TypeScript** - Type-safe JavaScript
- **Angular Material** - Material Design components
- **RxJS** - Reactive programming
- **Signals** - Reactive state management
- **Reactive Forms** - Form handling

## Architecture

### Components
- Built as **standalone components** (no NgModules required)
- Implement **OnPush change detection** for performance
- Use **Signals** for reactive state
- Follow single responsibility principle

### Services
- Singleton services with `providedIn: 'root'`
- Use `inject()` function for dependency injection
- RESTful API integration

### State Management
- Angular Signals for local component state
- `computed()` for derived state
- Services for shared state

### Authentication
- JWT-based token management
- HTTP interceptor for automatic token inclusion
- Route guard for protected pages
- Persistent user session

## Development Guidelines

Follow these practices when contributing:

- Use **strict TypeScript** configuration
- Avoid the `any` type; use `unknown` when necessary
- Use **standalone components** exclusively
- Implement **OnPush change detection**
- Use **Signals** over RxJS when possible for state
- Apply **Reactive Forms** for user input
- Avoid `@HostBinding`/`@HostListener` - use `host` object instead
- Use `class` and `style` bindings instead of `ngClass`/`ngStyle`
- Use native control flow (`@if`, `@for`, `@switch`)

## Routes

- `/` - Home page (redirects based on auth)
- `/login` - Login page
- `/register` - Registration page
- `/teams` - Teams management (protected)
- `/teams/:id/projects` - Team projects (protected)
- `/projects/:id/tasks` - Project tasks (protected)
- `**` - 404 error page

## API Integration

Services communicate with a backend API. Ensure the backend is running and the API endpoint is correctly configured in the environment files.

## Contributing

Adhere to the coding standards defined in `copilot-instructions.md` for consistency across the project.

## Additional Resources

- [Angular Documentation](https://angular.dev)
- [Angular Material](https://material.angular.io)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
