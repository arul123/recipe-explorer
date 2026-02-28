import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MealSummary } from '../../models/meal.model';

@Component({
  selector: 'app-meal-card',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './meal-card.component.html',
  styleUrl: './meal-card.component.scss',
})
export class MealCardComponent {
  @Input({ required: true }) meal!: MealSummary;
}
