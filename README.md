# Recipe Explorer

A modern Angular application for discovering and exploring recipes from around the world, powered by [TheMealDB API](https://www.themealdb.com/api.php).

Built with **Angular 19**, standalone components, RxJS-driven state, and lazy-loaded routes.

## Features

- **Search recipes** by name with debounced input (350 ms)
- **Filter by category** (Beef, Chicken, Seafood, Dessert, etc.)
- **Meal detail page** with ingredients, instructions, and embedded YouTube video
- **Loading, empty, and error states** handled throughout
- **Responsive layout** that works on mobile and desktop
- **Lazy-loaded routes** for optimal bundle splitting

## Architecture Highlights

| Concern | Approach |
|---|---|
| Component style | Standalone components (no NgModules) |
| Data flow | `MealService` to RxJS streams to `async` pipe in templates |
| Search | `Subject` to `debounceTime` / `distinctUntilChanged` to `switchMap` |
| Category cache | `shareReplay({ bufferSize: 1, refCount: true })` |
| Teardown | `takeUntil(destroy$)` pattern; Subject completed in `ngOnDestroy` |
| Routing | Lazy `loadComponent()` with route params piped via `switchMap` |
| Error handling | `catchError` in every service call; UI error states |

## Prerequisites

- **Node.js** 18.19+ or 20.11+ (recommended: 20.x LTS)
- **npm** 9+

## Getting Started

```bash
# Clone the repo
git clone <your-repo-url>
cd recipe-explorer

# Install dependencies
npm install

# Start the dev server
ng serve
```

Open [http://localhost:4200](http://localhost:4200) in your browser.

## Running Tests

```bash
ng test
```

## Project Structure

```
src/app/
  components/
    meal-card/          # Presentational card component
    meal-detail/        # Detail page (route: /meal/:id)
    search/             # Search + filter page (route: /)
  models/
    meal.model.ts       # TypeScript interfaces
  services/
    meal.service.ts     # HTTP + RxJS data layer
  app.config.ts         # Application providers
  app.routes.ts         # Lazy-loaded route definitions
  app.ts                # Root shell component
```

## API

This app uses the free [TheMealDB API](https://www.themealdb.com/api.php) -- no API key required.

## License

MIT
