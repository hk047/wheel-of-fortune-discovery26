import { ChangeEvent, DragEvent, useRef, useState } from 'react';
import { Download, FileUp, RotateCcw, Sparkles } from 'lucide-react';
import type { PersonAssignment } from '../types';
import { parseAssignmentsCsv } from '../utils/csv';

type CsvImporterProps = {
  assignments: PersonAssignment[];
  warnings: string[];
  onImported: (assignments: PersonAssignment[], warnings: string[]) => void;
  onClear: () => void;
};

export const SAMPLE_CSV = `name,city
Alice,Paris
Bob,Tokyo
Charlie,Paris
Dina,New York
Elliot,Barcelona
Fatima,Cape Town
George,Rio de Janeiro
Hana,Seoul
Isaac,Reykjavik
Jules,Vancouver
Kai,Singapore
Lena,Lisbon
Maya,Marrakesh`;

export function CsvImporter({ assignments, warnings, onImported, onClear }: CsvImporterProps) {
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const importText = (text: string) => {
    const result = parseAssignmentsCsv(text);
    onImported(result.assignments, result.warnings);
  };

  const handleFile = async (file?: File) => {
    if (!file) return;
    importText(await file.text());
  };

  const downloadSample = () => {
    const blob = new Blob([SAMPLE_CSV], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'sample-city-assignments.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <aside className="control-panel">
      <div className="panel-heading">
        <span>Show Data</span>
        <strong>{assignments.length} names</strong>
      </div>

      <button
        className={`drop-zone ${dragging ? 'drop-zone-active' : ''}`}
        type="button"
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(event: DragEvent<HTMLButtonElement>) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          void handleFile(event.dataTransfer.files[0]);
        }}
      >
        <FileUp size={21} />
        <span>Import CSV</span>
        <small>Click or drop file</small>
      </button>

      <input
        ref={fileInputRef}
        className="hidden"
        type="file"
        accept=".csv,text/csv"
        onChange={(event: ChangeEvent<HTMLInputElement>) => void handleFile(event.target.files?.[0])}
      />

      <div className="sample-box">
        <code>name,city</code>
        <code>Alice,Paris</code>
        <code>Bob,Tokyo</code>
      </div>

      <div className="panel-actions">
        <button type="button" className="mini-button" onClick={() => importText(SAMPLE_CSV)}>
          <Sparkles size={16} />
          Sample
        </button>
        <button type="button" className="mini-button" onClick={downloadSample}>
          <Download size={16} />
          CSV
        </button>
        <button type="button" className="mini-button" onClick={onClear}>
          <RotateCcw size={16} />
          Clear
        </button>
      </div>

      {warnings.length > 0 && (
        <div className="warning-list" role="status">
          {warnings.map((warning) => (
            <p key={warning}>{warning}</p>
          ))}
        </div>
      )}
    </aside>
  );
}
