import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { MealService } from './meal.service';
import { RawMeal } from '../models/meal.model';

describe('MealService', () => {
  let service: MealService;
  let httpMock: HttpTestingController;

  const mockRawMeal: RawMeal = {
    idMeal: '52772',
    strMeal: 'Teriyaki Chicken Casserole',
    strMealThumb: 'https://www.themealdb.com/images/media/meals/wvpsxx1468256321.jpg',
    strCategory: 'Chicken',
    strArea: 'Japanese',
    strInstructions: 'Preheat oven to 350.',
    strYoutube: 'https://www.youtube.com/watch?v=4aZr5hZXP_s',
    strIngredient1: 'soy sauce',
    strMeasure1: '3/4 cup',
    strIngredient2: 'water',
    strMeasure2: '1/2 cup',
    strIngredient3: '',
    strMeasure3: '',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(MealService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('searchByName', () => {
    it('should return mapped meal summaries', () => {
      service.searchByName('chicken').subscribe((meals) => {
        expect(meals.length).toBe(1);
        expect(meals[0].idMeal).toBe('52772');
        expect(meals[0].strMeal).toBe('Teriyaki Chicken Casserole');
      });

      const req = httpMock.expectOne((r) => r.url.includes('search.php?s=chicken'));
      expect(req.request.method).toBe('GET');
      req.flush({ meals: [mockRawMeal] });
    });

    it('should return empty array for empty query', () => {
      service.searchByName('').subscribe((meals) => {
        expect(meals).toEqual([]);
      });
      // No HTTP call should be made
      httpMock.expectNone((r) => r.url.includes('search.php'));
    });

    it('should return empty array when API returns null meals', () => {
      service.searchByName('xyz').subscribe((meals) => {
        expect(meals).toEqual([]);
      });

      const req = httpMock.expectOne((r) => r.url.includes('search.php?s=xyz'));
      req.flush({ meals: null });
    });

    it('should handle HTTP errors gracefully', () => {
      service.searchByName('error').subscribe((meals) => {
        expect(meals).toEqual([]);
      });

      const req = httpMock.expectOne((r) => r.url.includes('search.php?s=error'));
      req.error(new ProgressEvent('Network error'));
    });
  });

  describe('getMealById', () => {
    it('should return a full meal detail with extracted ingredients', () => {
      service.getMealById('52772').subscribe((meal) => {
        expect(meal).toBeTruthy();
        expect(meal!.strMeal).toBe('Teriyaki Chicken Casserole');
        expect(meal!.ingredients.length).toBe(2);
        expect(meal!.ingredients[0].name).toBe('soy sauce');
        expect(meal!.ingredients[0].measure).toBe('3/4 cup');
      });

      const req = httpMock.expectOne((r) => r.url.includes('lookup.php?i=52772'));
      req.flush({ meals: [mockRawMeal] });
    });

    it('should return null when meal is not found', () => {
      service.getMealById('99999').subscribe((meal) => {
        expect(meal).toBeNull();
      });

      const req = httpMock.expectOne((r) => r.url.includes('lookup.php?i=99999'));
      req.flush({ meals: null });
    });
  });

  describe('getCategories', () => {
    it('should return category names and cache the result', () => {
      service.getCategories().subscribe((categories) => {
        expect(categories).toEqual(['Beef', 'Chicken', 'Dessert']);
      });

      const req = httpMock.expectOne((r) => r.url.includes('list.php?c=list'));
      req.flush({
        meals: [
          { strCategory: 'Beef' },
          { strCategory: 'Chicken' },
          { strCategory: 'Dessert' },
        ],
      });

      // Second call should use cache (no new HTTP request)
      service.getCategories().subscribe((categories) => {
        expect(categories).toEqual(['Beef', 'Chicken', 'Dessert']);
      });
      httpMock.expectNone((r) => r.url.includes('list.php'));
    });
  });
});
