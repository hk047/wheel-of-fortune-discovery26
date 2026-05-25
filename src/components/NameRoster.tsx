import type { PersonAssignment } from '../types';
import { orderRosterForDisplay } from '../utils/rosterOrder';

type NameRosterProps = {
  assignments: PersonAssignment[];
  disabled: boolean;
  spunNames: Set<string>;
  onChooseName: (name: string) => void;
  onDragBegin: (name: string) => void;
};

export function NameRoster({ assignments, disabled, spunNames, onChooseName, onDragBegin }: NameRosterProps) {
  const displayAssignments = orderRosterForDisplay(assignments);

  return (
    <section className="name-roster" aria-label="Participant names">
      <span>Participants</span>
      <div className="name-tags">
        {displayAssignments.length ? (
          displayAssignments.map((assignment, index) => (
            <button
              key={`${assignment.normalizedName}-${assignment.city}-${index}`}
              type="button"
              className={`name-tag ${spunNames.has(assignment.normalizedName) ? 'name-tag-spun' : ''}`}
              draggable={!disabled}
              disabled={disabled}
              onClick={() => onChooseName(assignment.name)}
              onPointerDown={() => {
                if (!disabled) {
                  onDragBegin(assignment.name);
                }
              }}
              onDragStart={(event) => {
                onDragBegin(assignment.name);
                event.dataTransfer.effectAllowed = 'move';
                event.dataTransfer.setData('text/plain', assignment.name);
                event.dataTransfer.setData('application/x-city-wheel-name', assignment.name);
              }}
            >
              {assignment.name}
            </button>
          ))
        ) : (
          <b>Import CSV to show names</b>
        )}
      </div>
    </section>
  );
}
