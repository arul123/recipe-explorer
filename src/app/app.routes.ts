import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/search/search.component').then((m) => m.SearchComponent),
  },
  {
    path: 'meal/:id',
    loadComponent: () =>
      import('./components/meal-detail/meal-detail.component').then(
        (m) => m.MealDetailComponent
      ),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
