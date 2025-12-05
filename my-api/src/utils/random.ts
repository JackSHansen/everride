// Return a random integer between min and max inclusive
export const randomInt = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

// Return a price string with 2 decimals suitable for Prisma Decimal(10,2)
export const randomPriceString = (min: number, max: number) =>
  (Math.random() * (max - min) + min).toFixed(2);

// Return a random car year within a range
export const randomYear = (minYear = 1995, maxYear = new Date().getFullYear()) =>
  randomInt(minYear, maxYear);

// Pick a random item from an array
export const pickRandom = <T>(arr: T[]) => arr[randomInt(0, arr.length - 1)];
