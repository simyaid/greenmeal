export type DietType = 'vegetarian' | 'vegan' | 'gluten-free' | 'dairy-free';

export interface DietPreference {
  id: string;
  name: string;
  description: string;
  type: DietType;
}

export const DIET_PREFERENCES: DietPreference[] = [
  {
    id: '1',
    name: 'Vegetarian',
    description: 'No meat, but may include dairy and eggs',
    type: 'vegetarian'
  },
  {
    id: '2',
    name: 'Vegan',
    description: 'No animal products',
    type: 'vegan'
  },
  {
    id: '3',
    name: 'Gluten-Free',
    description: 'No gluten-containing ingredients',
    type: 'gluten-free'
  },
  {
    id: '4',
    name: 'Dairy-Free',
    description: 'No dairy products',
    type: 'dairy-free'
  }
]; 