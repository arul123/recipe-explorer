import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, map, catchError, shareReplay } from 'rxjs';
import {
  MealApiResponse,
  MealSummary,
  MealDetail,
  RawMeal,
  Ingredient,
  CategoryApiResponse,
} from '../models/meal.model';

const BASE_URL = 'https://www.themealdb.com/api/json/v1/1';

@Injectable({ providedIn: 'root' })
export class MealService {
  /** Cache categories since they rarely change */
  private categories$: Observable<string[]> | null = null;

  constructor(private readonly http: HttpClient) {}

  /**
   * Search meals by name.
   * Returns an empty array when no results are found.
   */
  searchByName(query: string): Observable<MealSummary[]> {
    if (!query.trim()) {
      return of([]);
    }
    return this.http.get<MealApiResponse>(`${BASE_URL}/search.php?s=${encodeURIComponent(query)}`).pipe(
      map((res) => (res.meals ?? []).map(this.toSummary)),
      catchError(() => of([]))
    );
  }

  /**
   * Filter meals by category.
   */
  filterByCategory(category: string): Observable<MealSummary[]> {
    if (!category) {
      return of([]);
    }
    return this.http
      .get<MealApiResponse>(`${BASE_URL}/filter.php?c=${encodeURIComponent(category)}`)
      .pipe(
        map((res) => (res.meals ?? []).map(this.toSummary)),
        catchError(() => of([]))
      );
  }

  /**
   * Get full meal detail by ID.
   */
  getMealById(id: string): Observable<MealDetail | null> {
    return this.http.get<MealApiResponse>(`${BASE_URL}/lookup.php?i=${id}`).pipe(
      map((res) => {
        const raw = res.meals?.[0];
        return raw ? this.toDetail(raw) : null;
      }),
      catchError(() => of(null))
    );
  }

  /**
   * Get a random meal — great for the landing page.
   */
  getRandomMeal(): Observable<MealDetail | null> {
    return this.http.get<MealApiResponse>(`${BASE_URL}/random.php`).pipe(
      map((res) => {
        const raw = res.meals?.[0];
        return raw ? this.toDetail(raw) : null;
      }),
      catchError(() => of(null))
    );
  }

  /**
   * Get the list of meal categories (cached with shareReplay).
   */
  getCategories(): Observable<string[]> {
    if (!this.categories$) {
      this.categories$ = this.http
        .get<CategoryApiResponse>(`${BASE_URL}/list.php?c=list`)
        .pipe(
          map((res) => res.meals.map((c) => c.strCategory)),
          shareReplay({ bufferSize: 1, refCount: true }),
          catchError(() => of([]))
        );
    }
    return this.categories$;
  }

  // ── Mapping helpers ──────────────────────────────────────────

  private toSummary = (raw: RawMeal): MealSummary => ({
    idMeal: raw.idMeal,
    strMeal: raw.strMeal,
    strMealThumb: raw.strMealThumb,
    strCategory: raw.strCategory,
    strArea: raw.strArea,
  });

  private toDetail = (raw: RawMeal): MealDetail => ({
    ...this.toSummary(raw),
    strInstructions: raw.strInstructions,
    strCategory: raw.strCategory,
    strArea: raw.strArea,
    strYoutube: raw.strYoutube,
    strSource: raw.strSource,
    strTags: raw.strTags,
    ingredients: this.extractIngredients(raw),
  });

  /**
   * TheMealDB stores ingredients as strIngredient1..20 and strMeasure1..20.
   * Extract non-empty pairs into a clean array.
   */
  private extractIngredients(raw: RawMeal): Ingredient[] {
    const ingredients: Ingredient[] = [];
    for (let i = 1; i <= 20; i++) {
      const name = raw[`strIngredient${i}`]?.trim();
      const measure = raw[`strMeasure${i}`]?.trim() ?? '';
      if (name) {
        ingredients.push({ name, measure });
      }
    }
    return ingredients;
  }
}
