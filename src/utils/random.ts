/**
 * Returns a random element from the provided array
 */
export const getRandomElement = <T>(array: T[]): T => {
  const randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
};

/**
 * Returns a specified number of unique random elements from the provided array
 */
export const getRandomElements = <T>(array: T[], count: number): T[] => {
  if (count >= array.length) return [...array];
  
  const result: T[] = [];
  const copyArray = [...array];
  
  for (let i = 0; i < count; i++) {
    const randomIndex = Math.floor(Math.random() * copyArray.length);
    result.push(copyArray[randomIndex]);
    copyArray.splice(randomIndex, 1);
  }
  
  return result;
};