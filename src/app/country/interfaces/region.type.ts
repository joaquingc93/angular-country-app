// Array con los valores reales (fuente de verdad única)
export const REGIONS = [
  'Africa',
  'Americas',
  'Asia',
  'Europe',
  'Oceania',
  'Antarctic',
] as const;

// Type derivado del array (sin duplicación)
export type Region = (typeof REGIONS)[number];
