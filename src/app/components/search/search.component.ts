import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Subject, Observable, BehaviorSubject, combineLatest, of, EMPTY } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  switchMap,
  startWith,
  tap,
  catchError,
  takeUntil,
} from 'rxjs/operators';
import { MealService } from '../../services/meal.service';
import { MealSummary } from '../../models/meal.model';
import { MealCardComponent } from '../meal-card/meal-card.component';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, FormsModule, MealCardComponent],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss',
})
export class SearchComponent implements OnInit, OnDestroy {
  /** Emits every time the user types in the search box */
  private readonly searchSubject = new Subject<string>();

  /** Selected category filter */
  private readonly categorySubject = new BehaviorSubject<string>('');

  /** Completes on destroy to tear down all subscriptions */
  private readonly destroy$ = new Subject<void>();

  searchTerm = '';
  selectedCategory = '';
  categories$!: Observable<string[]>;
  meals$!: Observable<MealSummary[]>;
  loading = false;
  errorMessage = '';

  constructor(private readonly mealService: MealService) {}

  ngOnInit(): void {
    this.categories$ = this.mealService.getCategories();

    // Combine search text (debounced) and category filter into a single stream
    this.meals$ = combineLatest([
      this.searchSubject.pipe(
        startWith(''),
        debounceTime(350),
        distinctUntilChanged()
      ),
      this.categorySubject.pipe(distinctUntilChanged()),
    ]).pipe(
      tap(() => {
        this.loading = true;
        this.errorMessage = '';
      }),
      switchMap(([term, category]) => {
        // Text search takes priority; if empty, filter by category
        if (term.trim()) {
          return this.mealService.searchByName(term);
        }
        if (category) {
          return this.mealService.filterByCategory(category);
        }
        // Default: return empty — user should search or pick a category
        return of([]);
      }),
      tap(() => (this.loading = false)),
      catchError((err) => {
        this.loading = false;
        this.errorMessage = 'Something went wrong. Please try again.';
        return of([]);
      }),
      takeUntil(this.destroy$)
    );
  }

  onSearchChange(term: string): void {
    this.searchSubject.next(term);
  }

  onCategoryChange(category: string): void {
    // When selecting a category, clear the search term
    if (category) {
      this.searchTerm = '';
      this.searchSubject.next('');
    }
    this.categorySubject.next(category);
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedCategory = '';
    this.searchSubject.next('');
    this.categorySubject.next('');
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
