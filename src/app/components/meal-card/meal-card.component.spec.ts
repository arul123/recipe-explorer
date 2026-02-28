import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MealCardComponent } from './meal-card.component';
import { provideRouter } from '@angular/router';
import { MealSummary } from '../../models/meal.model';

describe('MealCardComponent', () => {
  let component: MealCardComponent;
  let fixture: ComponentFixture<MealCardComponent>;

  const mockMeal: MealSummary = {
    idMeal: '52772',
    strMeal: 'Teriyaki Chicken Casserole',
    strMealThumb: 'https://www.themealdb.com/images/media/meals/wvpsxx1468256321.jpg',
    strCategory: 'Chicken',
    strArea: 'Japanese',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MealCardComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(MealCardComponent);
    component = fixture.componentInstance;
    component.meal = mockMeal;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the meal name', () => {
    const el: HTMLElement = fixture.nativeElement;
    expect(el.textContent).toContain('Teriyaki Chicken Casserole');
  });

  it('should display the category badge', () => {
    const el: HTMLElement = fixture.nativeElement;
    expect(el.textContent).toContain('Chicken');
  });

  it('should link to the meal detail page', () => {
    const link: HTMLAnchorElement = fixture.nativeElement.querySelector('a');
    expect(link.getAttribute('href')).toBe('/meal/52772');
  });
});
