import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { SearchComponent } from './search.component';

describe('SearchComponent', () => {
  let component: SearchComponent;
  let fixture: ComponentFixture<SearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchComponent],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(SearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with empty search term', () => {
    expect(component.searchTerm).toBe('');
  });

  it('should initialize with empty selected category', () => {
    expect(component.selectedCategory).toBe('');
  });

  it('should clear filters when clearFilters is called', () => {
    component.searchTerm = 'chicken';
    component.selectedCategory = 'Beef';
    component.clearFilters();
    expect(component.searchTerm).toBe('');
    expect(component.selectedCategory).toBe('');
  });

  it('should clear search term when category changes', () => {
    component.searchTerm = 'pasta';
    component.onCategoryChange('Seafood');
    expect(component.searchTerm).toBe('');
  });
});
