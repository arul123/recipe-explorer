import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Observable, switchMap, tap } from 'rxjs';
import { MealService } from '../../services/meal.service';
import { MealDetail } from '../../models/meal.model';

@Component({
  selector: 'app-meal-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './meal-detail.component.html',
  styleUrl: './meal-detail.component.scss',
})
export class MealDetailComponent implements OnInit {
  meal$!: Observable<MealDetail | null>;
  loading = true;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly mealService: MealService,
    private readonly sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    // Reactively switch to the correct meal whenever the route param changes
    this.meal$ = this.route.paramMap.pipe(
      tap(() => (this.loading = true)),
      switchMap((params) => {
        const id = params.get('id')!;
        return this.mealService.getMealById(id);
      }),
      tap(() => (this.loading = false))
    );
  }

  /**
   * Build a safe YouTube embed URL from the standard watch URL.
   */
  getYoutubeEmbedUrl(url: string): SafeResourceUrl | null {
    const videoId = url.split('v=')[1]?.split('&')[0];
    if (!videoId) return null;
    return this.sanitizer.bypassSecurityTrustResourceUrl(
      `https://www.youtube.com/embed/${videoId}`
    );
  }
}
