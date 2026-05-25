import { AnimatePresence, motion } from 'framer-motion';
import { Maximize, Settings, Shuffle, Volume2, VolumeX } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Confetti } from './components/Confetti';
import { CsvImporter } from './components/CsvImporter';
import { NameDropTarget } from './components/NameDropTarget';
import { NameRoster } from './components/NameRoster';
import { RevealCard } from './components/RevealCard';
import { Wheel } from './components/Wheel';
import { useWheelSpin } from './hooks/useWheelSpin';
import type { PersonAssignment } from './types';
import { unlockAudio, setAudioMuted } from './utils/audio';
import { findAssignment } from './utils/csv';
import { clearAssignments, loadAssignments, saveAssignments } from './utils/storage';
import { buildCitySlices } from './utils/wheelMath';

type Reveal = {
  name: string;
  city: string;
};

const TEST_CITIES = ['Paris', 'Tokyo', 'New York', 'Barcelona', 'Cape Town', 'Seoul', 'Lisbon'];

function App() {
  const [assignments, setAssignments] = useState<PersonAssignment[]>(() => loadAssignments());
  const [warnings, setWarnings] = useState<string[]>([]);
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [reveal, setReveal] = useState<Reveal | null>(null);
  const [muted, setMuted] = useState(false);
  const [dataOpen, setDataOpen] = useState(() => loadAssignments().length === 0);
  const [draggingName, setDraggingName] = useState('');
  const [spunNames, setSpunNames] = useState<Set<string>>(() => new Set());
  const currentSpinNameRef = useRef('Guest');

  const slices = useMemo(
    () => buildCitySlices(assignments.length ? assignments.map((assignment) => assignment.city) : TEST_CITIES),
    [assignments],
  );
  const handleFinished = useCallback(
    (city: string) => {
      setReveal({ name: currentSpinNameRef.current || 'Guest', city });
    },
    [],
  );

  const { rotation, spinState, clickerTick, spinToCity, resetRevealState } = useWheelSpin(slices, handleFinished);
  const isSpinning = spinState === 'spinning';

  useEffect(() => {
    const primeAudio = () => {
      void unlockAudio();
      window.removeEventListener('pointerdown', primeAudio);
      window.removeEventListener('keydown', primeAudio);
    };

    window.addEventListener('pointerdown', primeAudio);
    window.addEventListener('keydown', primeAudio);
    return () => {
      window.removeEventListener('pointerdown', primeAudio);
      window.removeEventListener('keydown', primeAudio);
    };
  }, []);

  useEffect(() => {
    if (!draggingName) return;

    const clearDraggingName = () => {
      setDraggingName('');
    };

    window.addEventListener('pointerup', clearDraggingName);
    window.addEventListener('pointercancel', clearDraggingName);
    return () => {
      window.removeEventListener('pointerup', clearDraggingName);
      window.removeEventListener('pointercancel', clearDraggingName);
    };
  }, [draggingName]);

  const handleImported = (nextAssignments: PersonAssignment[], nextWarnings: string[]) => {
    setAssignments(nextAssignments);
    saveAssignments(nextAssignments);
    setWarnings(nextWarnings);
    setError('');
    setReveal(null);
    setDraggingName('');
    setSpunNames(new Set());
    setDataOpen(false);
  };

  const handleClear = () => {
    setAssignments([]);
    clearAssignments();
    setWarnings([]);
    setError('');
    setReveal(null);
    setSpunNames(new Set());
    setDataOpen(true);
  };

  const spinName = async (personName: string) => {
    await unlockAudio();
    setReveal(null);
    setError('');

    if (!assignments.length) {
      setError('Import a CSV first, then drag a participant into the wheel.');
      setDataOpen(true);
      return;
    }

    const assignment = findAssignment(assignments, personName);
    if (!assignment) {
      setError('No city found for this name. Check the spelling or import an updated CSV.');
      return;
    }

    currentSpinNameRef.current = assignment.name;
    setName(assignment.name);
    await spinToCity(assignment.city);
    setSpunNames((previous) => new Set(previous).add(assignment.normalizedName));
  };

  const testSpin = async () => {
    await unlockAudio();
    setReveal(null);
    setError('');
    const cities = slices.map((slice) => slice.city);
    const city = cities[Math.floor(Math.random() * cities.length)] ?? 'Paris';
    currentSpinNameRef.current = 'Test spin';
    setName('Test spin');
    await spinToCity(city);
  };

  const toggleMute = () => {
    const nextMuted = !muted;
    setMuted(nextMuted);
    setAudioMuted(nextMuted);
  };

  const toggleFullscreen = () => {
    if (document.fullscreenElement) {
      void document.exitFullscreen();
    } else {
      void document.documentElement.requestFullscreen();
    }
  };

  return (
    <main className={`app-shell ${isSpinning ? 'is-spinning' : ''}`}>
      <div className="stage-lights" />
      <Confetti active={Boolean(reveal)} />

      <header className="top-bar">
        <div>
          <p className="eyebrow">Discovery Group Draw</p>
          <h1>Wheel of Facilitators</h1>
        </div>
        <div className="top-actions">
          <button
            type="button"
            className="utility-button"
            onClick={() => setDataOpen((open) => !open)}
            aria-label="Settings"
            title="Settings"
          >
            <Settings size={15} />
          </button>
          <button type="button" className="icon-button" onClick={toggleMute} aria-label={muted ? 'Unmute' : 'Mute'}>
            {muted ? <VolumeX size={22} /> : <Volume2 size={22} />}
          </button>
          <button type="button" className="icon-button" onClick={toggleFullscreen} aria-label="Fullscreen">
            <Maximize size={22} />
          </button>
        </div>
      </header>

      <AnimatePresence>
        {dataOpen && (
          <motion.div
            className="data-drawer"
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.22 }}
          >
            <CsvImporter assignments={assignments} warnings={warnings} onImported={handleImported} onClear={handleClear} />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="show-layout">
        <section className="main-stage">
          <motion.div
            className="wheel-glow"
            animate={{ opacity: isSpinning ? 1 : 0.72, scale: isSpinning ? 1.04 : 1 }}
            transition={{ duration: 0.4 }}
          >
            <Wheel slices={slices} rotation={rotation} spinState={spinState} clickerTick={clickerTick} />

            <NameDropTarget
              selectedName={name}
              draggingName={draggingName}
              disabled={isSpinning}
              error={error}
              onNameDropped={(droppedName) => void spinName(droppedName)}
            />
          </motion.div>
        </section>

        <aside className="side-board">
          <NameRoster
            assignments={assignments}
            disabled={isSpinning}
            spunNames={spunNames}
            onChooseName={(chosenName) => void spinName(chosenName)}
            onDragBegin={setDraggingName}
          />

          <section className="city-board">
            <span>Cities on Wheel</span>
            <div>
              {assignments.length ? slices.map((slice) => <b key={slice.city}>{slice.city}</b>) : <b>Sample test cities</b>}
            </div>
          </section>

          <button className="test-button side-test-button" type="button" disabled={isSpinning} onClick={() => void testSpin()}>
            <Shuffle size={18} />
            Test
          </button>
        </aside>
      </div>

      <AnimatePresence>
        {reveal && (
          <RevealCard
            name={reveal.name}
            city={reveal.city}
            onReset={() => {
              setReveal(null);
              resetRevealState();
            }}
          />
        )}
      </AnimatePresence>
    </main>
  );
}

export default App;
