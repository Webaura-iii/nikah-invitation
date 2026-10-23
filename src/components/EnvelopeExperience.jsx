import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import "./EnvelopeExperience.css";

function BotanicalRelief({ side }) {
  const flip = side === "right" ? "translate(420 0) scale(-1 1)" : "";
  return (
    <svg className="botanical" viewBox="0 0 420 760" preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <linearGradient id={`petal-${side}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fffefa" />
          <stop offset="55%" stopColor="#f6f0e6" />
          <stop offset="100%" stopColor="#ded2c0" />
        </linearGradient>
        <filter id={`relief-${side}`} x="-30%" y="-20%" width="160%" height="150%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="2" result="blur" />
          <feOffset dx="1.5" dy="2.5" result="offset" />
          <feComposite in="offset" in2="SourceAlpha" operator="in" result="shadow" />
          <feMerge><feMergeNode in="shadow" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      <g transform={flip} filter={`url(#relief-${side})`}>
        <g fill="none" stroke="#fffdf7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M210 735 C190 610 240 505 190 390 S170 190 240 48" />
          <path d="M207 680 C145 600 112 525 65 470 C118 490 155 530 207 590" />
          <path d="M210 615 C280 530 315 470 355 420 C300 440 250 490 210 545" />
          <path d="M195 490 C145 430 100 390 55 370 C100 365 155 410 202 450" />
          <path d="M220 410 C275 350 300 290 350 255 C300 260 250 315 220 360" />
          <path d="M210 330 C160 275 135 220 95 195 C135 205 180 250 210 290" />
          <path d="M230 250 C270 205 295 160 320 120 C280 145 250 190 230 220" />
          <path d="M210 730 C250 640 300 600 350 575 C310 620 275 670 245 730" />
          <path d="M200 735 C155 665 115 640 75 625 C120 665 150 700 170 735" />
        </g>
        <g fill={`url(#petal-${side})`} stroke="#d7cbb9" strokeWidth="1.2">
          <path d="M180 545 C110 525 90 475 95 445 C145 455 185 490 180 545Z" />
          <path d="M238 465 C250 410 300 385 330 390 C315 430 280 460 238 465Z" />
          <path d="M190 365 C130 335 120 295 130 270 C170 290 195 325 190 365Z" />
          <path d="M237 305 C245 255 280 230 305 232 C292 270 265 295 237 305Z" />
          <path d="M215 200 C180 165 185 130 200 110 C225 140 230 170 215 200Z" />
          <path d="M200 625 C150 600 140 565 150 545 C180 565 200 595 200 625Z" />
          <path d="M238 575 C270 535 305 525 325 535 C300 565 270 580 238 575Z" />
        </g>
        <g fill="#fffdf8" stroke="#d7cbb9" strokeWidth="1">
          {Array.from({ length: 10 }, (_, i) => {
            const x = i % 2 ? 155 + i * 5 : 265 - i * 3;
            const y = 100 + i * 54;
            return <ellipse key={i} cx={x} cy={y} rx="6" ry="12" transform={`rotate(${i % 2 ? -35 : 35} ${x} ${y})`} />;
          })}
        </g>
      </g>
    </svg>
  );
}

function Door({ side, phase, reduced }) {
  const right = side === "right";
  const isOpen = right
    ? ["opening-right", "opening-both", "opened"].includes(phase)
    : ["opening-both", "opened"].includes(phase);
  return (
    <motion.div
      className={`door door--${side}`}
      initial={false}
      animate={{ rotateY: isOpen ? (right ? 108 : -108) : 0 }}
      transition={{ duration: reduced ? 0.01 : 0.95, ease: [0.22, 0.75, 0.18, 1] }}
      style={{ transformOrigin: right ? "100% 50%" : "0% 50%" }}
    >
      <div className="door-face">
        <div className="door-border"><div className="door-inner-border" /></div>
        <BotanicalRelief side={side} />
        <div className="door-grain" />
      </div>
      <div className="door-back" />
    </motion.div>
  );
}

function SealEmblem() {
  return <svg viewBox="0 0 40 50" aria-hidden="true"><path d="M20 43V12 M20 25C7 24 7 14 7 14S18 13 20 25 M20 32C32 31 33 21 33 21S22 21 20 32 M20 18C13 15 15 7 20 4C25 9 26 15 20 18" fill="none" stroke="currentColor" strokeWidth="1.6" /></svg>;
}

function WaxSeal({ phase, onOpen }) {
  const releasing = phase === "releasing";
  return (
    <AnimatePresence>
      {phase !== "opened" && (
        <motion.button
          className={`wax-seal ${releasing ? "wax-seal--release" : ""}`}
          aria-label="Open wedding invitation"
          onClick={onOpen}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.25 }}
        >
          <span className="seal-half seal-half--left"><SealEmblem /></span>
          <span className="seal-half seal-half--right"><SealEmblem /></span>
        </motion.button>
      )}
    </AnimatePresence>
  );
}

export default function EnvelopeExperience({ onOpen = () => {} }) {
  const [phase, setPhase] = useState("closed");
  const reduced = useReducedMotion();
  const timers = useRef([]);

  useEffect(() => () => timers.current.forEach(window.clearTimeout), []);

  const open = () => {
    if (phase !== "closed") return;
    if (reduced) {
      setPhase("opened");
      onOpen();
      return;
    }
    setPhase("releasing");
    timers.current = [
      window.setTimeout(() => setPhase("opening-right"), 620),
      window.setTimeout(() => setPhase("opening-both"), 940),
      window.setTimeout(() => { setPhase("opened"); onOpen(); }, 1650),
    ];
  };

  return (
    <section className="opening-screen" aria-label="Wedding invitation envelope">
      <div className="opening-glow" />
      <div className="envelope-wrap">
        <div className="envelope-stage">
          <div className="envelope-base"><div className="base-border" /></div>
          <Door side="left" phase={phase} reduced={reduced} />
          <Door side="right" phase={phase} reduced={reduced} />
          <WaxSeal phase={phase} onOpen={open} />
        </div>
        <p className="open-hint" aria-live="polite">
          {phase === "closed" ? "Tap to open your invitation" : phase === "releasing" ? "A moment made for you" : "With love, always"}
        </p>
      </div>
    </section>
  );
}
