import { motion } from 'framer-motion';

type RevealCardProps = {
  name: string;
  city: string;
  onReset: () => void;
};

export function RevealCard({ name, city, onReset }: RevealCardProps) {
  return (
    <motion.div
      className="reveal-card"
      initial={{ opacity: 0, x: '-50%', y: 34, scale: 0.92 }}
      animate={{ opacity: 1, x: '-50%', y: 0, scale: 1 }}
      exit={{ opacity: 0, x: '-50%', y: 20, scale: 0.96 }}
      transition={{ type: 'spring', stiffness: 170, damping: 16 }}
    >
      <span className="reveal-kicker">Group reveal</span>
      <h2>
        <span>{name}</span> is in <em>Group</em> <strong>{city}</strong>
      </h2>
      <button type="button" className="reset-reveal" onClick={onReset}>
        Reset reveal
      </button>
    </motion.div>
  );
}
