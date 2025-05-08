import { useEffect, useState } from 'react';

const drinkCategories = {
  "Fruit Juice": [
    "Guava Juice",
    "Jamun Juice",
    "Strawberry Juice",
    "Orange Juice",
    "Guava Chili Juice",
    "Pomegranate Juice",
    "Pineapple Juice",
    "Antioxidant Juice",
  ],
  "Milk Shakes": [
    "Chikoo Milk Shake",
    "Strawberry",
    "Mango",
    "Custard Apple",
  ],
  "Fruit Mastani": [
    "Mango",
    "Chikoo",
    "Strawberry",
    "Custard Apple",
  ],
  "Dry Fruit Mastani": [
    "Mango",
    "Chikoo",
    "Strawberry",
    "Custard Apple",
  ],
  "Ice Cream": [
    "Guava Chili",
    "Strawberry Ice Cream",
    "Grapes",
    "Mango",
    "Jamun",
    "Dry Fruit",
    "Dark Chocolate",
    "Light Chocolate",
    "Chikoo",
    "Orange",
  ],
  "Snacks": [
    "Corn Chat",
    "Creamy Corn Chat",
  ],
  "Aamras": [
    "Aamras",
  ],
};

function getRandomSuggestions(categories, count = 3) {
  const allItems = Object.entries(categories).flatMap(([category, items]) =>
    items.map((item) => ({ item, category }))
  );

  const shuffled = [...allItems].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

export default function MustTrySuggestions() {
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    setSuggestions(getRandomSuggestions(drinkCategories));
  }, []);

  return (
    <div className="max-w-md mx-auto mt-10 px-6 py-6 bg-gradient-to-br from-orange-100 to-lime-100 rounded-xl shadow-md animate-fade-in text-center">
      <h2 className="text-2xl font-bold text-amber-800 mb-4">🍹 You Must Try!</h2>
      <ul className="space-y-2 text-lg text-orange-800">
        {suggestions.map(({ item, category }, index) => (
          <li key={index} className="bg-white/60 rounded-lg px-4 py-2 shadow-sm hover:shadow-md transition">
            <span className="font-semibold">{item}</span>
            <div className="text-sm text-amber-600">({category})</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
