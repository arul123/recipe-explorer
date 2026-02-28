import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { of } from 'rxjs';
import { MealDetailComponent } from './meal-detail.component';

describe('MealDetailComponent', () => {
  let component: MealDetailComponent;
  let fixture: ComponentFixture<MealDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MealDetailComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of(convertToParamMap({ id: '52772' })),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MealDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should generate a correct YouTube embed URL', () => {
    const result = component.getYoutubeEmbedUrl('https://www.youtube.com/watch?v=4aZr5hZXP_s');
    // The result is a SafeResourceUrl, so we check it's truthy
    expect(result).toBeTruthy();
  });

  it('should return null for invalid YouTube URLs', () => {
    const result = component.getYoutubeEmbedUrl('not-a-url');
    expect(result).toBeNull();
  });
});
