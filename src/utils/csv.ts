import type { CsvParseResult, PersonAssignment } from '../types';

const normalizeName = (name: string) => name.trim().toLowerCase();

export function normalizeLookupName(name: string): string {
  return normalizeName(name);
}

export function parseAssignmentsCsv(csvText: string): CsvParseResult {
  const rows = parseCsvRows(csvText);
  const dataRows = hasHeader(rows) ? rows.slice(1) : rows;
  const assignments: PersonAssignment[] = [];
  const skippedRows: number[] = [];
  const duplicateNames: string[] = [];
  const seen = new Set<string>();

  dataRows.forEach((row, index) => {
    const displayRowNumber = index + (hasHeader(rows) ? 2 : 1);
    const name = (row[0] ?? '').trim();
    const city = (row[1] ?? '').trim();

    if (!name || !city) {
      skippedRows.push(displayRowNumber);
      return;
    }

    const normalizedName = normalizeName(name);
    if (seen.has(normalizedName)) {
      duplicateNames.push(name);
    }

    seen.add(normalizedName);
    assignments.push({ name, normalizedName, city });
  });

  const warnings: string[] = [];
  if (skippedRows.length > 0) {
    warnings.push(`Skipped ${skippedRows.length} row(s) with missing name or city.`);
  }
  if (duplicateNames.length > 0) {
    warnings.push(`Duplicate name(s) found: ${duplicateNames.join(', ')}. The latest row wins for lookup.`);
  }

  return { assignments, duplicateNames, skippedRows, warnings };
}

export function findAssignment(assignments: PersonAssignment[], name: string): PersonAssignment | undefined {
  const normalized = normalizeName(name);
  for (let index = assignments.length - 1; index >= 0; index -= 1) {
    if (assignments[index].normalizedName === normalized) {
      return assignments[index];
    }
  }
  return undefined;
}

function hasHeader(rows: string[][]): boolean {
  const [firstRow] = rows;
  return Boolean(
    firstRow &&
      firstRow[0]?.trim().toLowerCase() === 'name' &&
      firstRow[1]?.trim().toLowerCase() === 'city',
  );
}

function parseCsvRows(csvText: string): string[][] {
  const rows: string[][] = [];
  let currentField = '';
  let currentRow: string[] = [];
  let inQuotes = false;

  for (let index = 0; index < csvText.length; index += 1) {
    const char = csvText[index];
    const next = csvText[index + 1];

    if (char === '"' && inQuotes && next === '"') {
      currentField += '"';
      index += 1;
      continue;
    }

    if (char === '"') {
      inQuotes = !inQuotes;
      continue;
    }

    if (char === ',' && !inQuotes) {
      currentRow.push(currentField);
      currentField = '';
      continue;
    }

    if ((char === '\n' || char === '\r') && !inQuotes) {
      if (char === '\r' && next === '\n') {
        index += 1;
      }
      currentRow.push(currentField);
      pushRow(rows, currentRow);
      currentRow = [];
      currentField = '';
      continue;
    }

    currentField += char;
  }

  currentRow.push(currentField);
  pushRow(rows, currentRow);
  return rows;
}

function pushRow(rows: string[][], row: string[]): void {
  if (row.some((field) => field.trim().length > 0)) {
    rows.push(row);
  }
}
