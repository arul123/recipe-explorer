/** Represents a meal summary returned from search results */
export interface MealSummary {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
  strCategory?: string;
  strArea?: string;
}

/** Represents a full meal detail from the lookup endpoint */
export interface MealDetail extends MealSummary {
  strInstructions: string;
  strCategory: string;
  strArea: string;
  strYoutube?: string;
  strSource?: string;
  strTags?: string;
  ingredients: Ingredient[];
}

/** A single ingredient + measure pair */
export interface Ingredient {
  name: string;
  measure: string;
}

/** Raw API response shape for search and lookup */
export interface MealApiResponse {
  meals: RawMeal[] | null;
}

/**
 * The raw meal object from TheMealDB API.
 * Ingredients/measures are stored as strIngredient1..20 and strMeasure1..20.
 */
export interface RawMeal {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
  strCategory: string;
  strArea: string;
  strInstructions: string;
  strYoutube?: string;
  strSource?: string;
  strTags?: string;
  [key: string]: string | undefined;
}

/** Category returned from the categories endpoint */
export interface Category {
  strCategory: string;
}

export interface CategoryApiResponse {
  meals: Category[];
}
