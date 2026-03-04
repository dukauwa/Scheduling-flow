import React, { useState, useEffect } from 'react';
import { STATUS_PHASES } from '../mockData';

// ── Icons ──
const ArrowLeft = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
);

const Spinner = () => (
  <svg className="animate-spin" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#522DA6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
);

const BigSpinner = () => (
  <svg className="animate-spin" xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#522DA6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
);

const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
);

const BigCheck = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
);

const DotIcon = () => (
  <div className="w-5 h-5 flex items-center justify-center">
    <div className="w-2.5 h-2.5 rounded-full bg-zinc-200" />
  </div>
);

function formatTime() {
  const now = new Date();
  return now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

export default function GenerationStatusPage({ navigate, config, onComplete }) {
  const [currentPhaseIdx, setCurrentPhaseIdx] = useState(0);
  const [timestamps, setTimestamps] = useState({});
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (currentPhaseIdx >= STATUS_PHASES.length) return;

    const phase = STATUS_PHASES[currentPhaseIdx];

    // Record start time for current phase
    setTimestamps(prev => ({ ...prev, [`${phase.id}_start`]: formatTime() }));

    if (phase.duration === 0) {
      // This is the "complete" phase
      setTimestamps(prev => ({ ...prev, [`${phase.id}_end`]: formatTime() }));
      setIsComplete(true);

      // Add generation entry
      onComplete?.({
        id: `#${String(Math.floor(Math.random() * 90000) + 10000)}`,
        includedTypes: 'MustMeet',
        scope: config?.locations?.length ? config.locations.join(', ') : 'All Slots',
        itemsGenerated: 312,
        avgMatchScore: 94,
        generatedBy: 'David Ukauwa',
        timeCreated: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) + ', ' + formatTime().slice(0, 5),
      });
      return;
    }

    const timer = setTimeout(() => {
      setTimestamps(prev => ({ ...prev, [`${phase.id}_end`]: formatTime() }));
      setCurrentPhaseIdx(i => i + 1);
    }, phase.duration);

    return () => clearTimeout(timer);
  }, [currentPhaseIdx]);

  return (
    <div className="min-h-screen bg-zinc-50">
      {/* Header */}
      <div className="h-1 bg-[#522DA6]" />
      <div className="border-b border-zinc-200 bg-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('#/schedules')} className="text-zinc-400 hover:text-zinc-600">
            <ArrowLeft />
          </button>
          <div>
            <h1 className="text-lg font-semibold text-zinc-900">Generate Schedules</h1>
            <span className="text-xs text-zinc-400">Validation {'>'} Setup {'>'} Review & Confirm</span>
          </div>
        </div>
        <img src="/grip-logo.png" alt="Grip" className="h-8" />
      </div>

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center py-16 px-6">
        {!isComplete ? (
          <>
            <BigSpinner />
            <h2 className="text-xl font-semibold text-zinc-900 mt-6">Generating schedules has started...</h2>
            <p className="text-sm text-zinc-500 mt-2 text-center max-w-md">
              This may take a few minutes depending on the number of participants. You'll be notified once generation is complete.
            </p>
          </>
        ) : (
          <>
            <BigCheck />
            <h2 className="text-xl font-semibold text-zinc-900 mt-6">Schedule generation complete!</h2>
            <p className="text-sm text-zinc-500 mt-2 text-center max-w-md">
              Your MustMeet meetings have been generated successfully.
            </p>
          </>
        )}

        {/* Status Log */}
        <div className="mt-10 w-full max-w-lg">
          <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-5 space-y-0">
            {STATUS_PHASES.map((phase, idx) => {
              const isActive = idx === currentPhaseIdx && !isComplete;
              const isDone = idx < currentPhaseIdx || (isComplete && idx <= currentPhaseIdx);
              const isPending = idx > currentPhaseIdx;

              return (
                <div key={phase.id} className={`flex items-center gap-3 py-2.5 ${idx > 0 ? 'border-t border-zinc-100' : ''}`}>
                  <div className="shrink-0">
                    {isDone ? <CheckIcon /> : isActive ? <Spinner /> : <DotIcon />}
                  </div>
                  <span className={`flex-1 text-sm ${isDone ? 'text-zinc-900 font-medium' : isActive ? 'text-[#522DA6] font-medium' : 'text-zinc-400'}`}>
                    {phase.label}
                  </span>
                  {isDone && timestamps[`${phase.id}_end`] && (
                    <span className="text-xs text-zinc-400 font-mono">{timestamps[`${phase.id}_end`]}</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Summary Stats (only when complete) */}
        {isComplete && (
          <div className="mt-8 flex items-center gap-8 text-sm">
            <div className="text-center">
              <div className="text-2xl font-bold text-zinc-900">312</div>
              <div className="text-zinc-500">events generated</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-zinc-900">94%</div>
              <div className="text-zinc-500">avg match score</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-zinc-900">~10s</div>
              <div className="text-zinc-500">generation time</div>
            </div>
          </div>
        )}

        {/* CTAs */}
        <div className="mt-8 flex flex-col items-center gap-3">
          {isComplete ? (
            <>
              <button
                onClick={() => navigate('#/schedules')}
                className="px-8 py-3 bg-[#522DA6] text-white rounded-lg text-sm font-semibold hover:bg-[#422389]"
              >
                View Schedules
              </button>
              <button
                onClick={() => navigate('#/schedules')}
                className="text-sm font-medium text-zinc-500 hover:text-zinc-700"
              >
                Back to Scoring & Schedules
              </button>
            </>
          ) : (
            <button
              onClick={() => navigate('#/schedules')}
              className="px-6 py-2.5 bg-[#522DA6] text-white rounded-lg text-sm font-medium hover:bg-[#422389]"
            >
              Go to Scoring & Schedules
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
