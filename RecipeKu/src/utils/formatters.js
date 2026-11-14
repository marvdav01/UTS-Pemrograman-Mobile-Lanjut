// src/utils/formatters.js

/**
 * Menghitung dan memformat total waktu memasak (persiapan + memasak)
 */
export const formatTotalTime = (prepTimeMinutes = 0, cookTimeMinutes = 0) => {
  const total = Number(prepTimeMinutes || 0) + Number(cookTimeMinutes || 0);
  if (total <= 0) return 'Waktu tidak tersedia';
  if (total < 60) return `${total} menit`;
  const hours = Math.floor(total / 60);
  const mins = total % 60;
  return mins > 0 ? `${hours} jam ${mins} mnt` : `${hours} jam`;
};

/**
 * Menerjemahkan tingkat kesulitan dari bahasa Inggris ke bahasa Indonesia
 */
export const formatDifficulty = (difficulty) => {
  if (!difficulty) return 'Mudah';
  const map = {
    Easy: 'Mudah',
    Medium: 'Sedang',
    Hard: 'Sulit',
  };
  return map[difficulty] || difficulty;
};

/**
 * Menghasilkan deskripsi ringkas informatif berdasarkan metadata resep DummyJSON
 */
export const buildRecipeDescription = (recipe) => {
  if (!recipe) return '';
  if (recipe.description) return recipe.description;

  const cuisine = recipe.cuisine || 'Internasional';
  const mealTypes = Array.isArray(recipe.mealType) && recipe.mealType.length > 0
    ? recipe.mealType.join(', ')
    : 'Hidangan Utama';
  const difficulty = formatDifficulty(recipe.difficulty);
  const totalTime = formatTotalTime(recipe.prepTimeMinutes, recipe.cookTimeMinutes);

  return `Hidangan khas ${cuisine} (${mealTypes}) dengan tingkat kesulitan ${difficulty.toLowerCase()}. Membutuhkan waktu total sekitar ${totalTime} untuk menghasilkan ${recipe.servings || 1} porsi sajian bergizi (${recipe.caloriesPerServing || '-'} kkal/porsi).`;
};
