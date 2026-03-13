import React, { useState, useRef, useEffect } from 'react';

const QuestionIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
);

export default function Tooltip({ text }) {
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState('below'); // 'below' | 'above'
  const triggerRef = useRef(null);
  const tooltipRef = useRef(null);

  useEffect(() => {
    if (visible && triggerRef.current && tooltipRef.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const tooltipRect = tooltipRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - triggerRect.bottom;
      if (spaceBelow < tooltipRect.height + 8) {
        setPosition('above');
      } else {
        setPosition('below');
      }
    }
  }, [visible]);

  return (
    <span className="relative inline-flex items-center ml-1.5">
      <button
        ref={triggerRef}
        type="button"
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
        onFocus={() => setVisible(true)}
        onBlur={() => setVisible(false)}
        className="text-zinc-400 hover:text-[#522DA6] transition-colors"
        aria-label="More info"
      >
        <QuestionIcon />
      </button>
      {visible && (
        <div
          ref={tooltipRef}
          className={`absolute z-50 left-1/2 -translate-x-1/2 w-64 ${
            position === 'below' ? 'top-full mt-2' : 'bottom-full mb-2'
          }`}
        >
          <div className="bg-white rounded border border-zinc-200 shadow-lg border-l-2 border-l-[#522DA6] px-3 py-2">
            <p className="text-xs text-zinc-700 leading-relaxed whitespace-pre-line">{text}</p>
          </div>
        </div>
      )}
    </span>
  );
}
