import { DragEvent, useState } from 'react';
import { formatHubName } from '../utils/nameDisplay';

type NameDropTargetProps = {
  selectedName: string;
  draggingName: string;
  disabled: boolean;
  error: string;
  onNameDropped: (name: string) => void;
};

export function NameDropTarget({
  selectedName,
  draggingName,
  disabled,
  error,
  onNameDropped,
}: NameDropTargetProps) {
  const [dragActive, setDragActive] = useState(false);
  const displayName = formatHubName(selectedName);

  const acceptDrop = (event: DragEvent<HTMLElement>) => {
    event.preventDefault();
    setDragActive(false);

    const droppedName =
      event.dataTransfer.getData('application/x-city-wheel-name') || event.dataTransfer.getData('text/plain');
    if (droppedName.trim()) {
      onNameDropped(droppedName);
    }
  };

  return (
    <section className="drop-spin-panel" aria-label="Spin controls">
      <div
        className={`wheel-drop-target ${dragActive || draggingName ? 'wheel-drop-target-active' : ''}`}
        onPointerUp={() => {
          if (!disabled && draggingName) {
            onNameDropped(draggingName);
          }
        }}
        onDragEnter={(event) => {
          event.preventDefault();
          if (!disabled) setDragActive(true);
        }}
        onDragOver={(event) => {
          event.preventDefault();
          event.dataTransfer.dropEffect = disabled ? 'none' : 'move';
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={(event) => {
          if (!disabled) {
            acceptDrop(event);
          }
        }}
      >
        <span className={`hub-name hub-name-${displayName.size}`}>
          {displayName.lines.map((line) => (
            <b key={line}>{line}</b>
          ))}
        </span>
        <small>{selectedName ? 'Drop next' : 'Name here'}</small>
      </div>
      {error && <p className="form-error">{error}</p>}
    </section>
  );
}
