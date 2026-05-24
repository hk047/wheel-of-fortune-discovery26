export type PersonAssignment = {
  name: string;
  normalizedName: string;
  city: string;
};

export type CitySlice = {
  city: string;
  index: number;
  startAngle: number;
  endAngle: number;
  color: string;
};

export type CsvParseResult = {
  assignments: PersonAssignment[];
  duplicateNames: string[];
  skippedRows: number[];
  warnings: string[];
};

export type SpinState = 'idle' | 'spinning' | 'finished';

export type SpinPlan = {
  targetCity: string;
  fromRotation: number;
  toRotation: number;
  durationMs: number;
  fullRotations: number;
  landingOffset: number;
};
