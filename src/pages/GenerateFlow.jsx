import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { VALIDATION_RESULTS, DEFAULT_CONFIG, PROFILE_OPTIONS, GROUP_OPTIONS, LOCATION_OPTIONS } from '../mockData';

// ── Icons ──
const ArrowLeft = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
);
const CheckCircle = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
);
const AlertTriangle = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
);
const XCircle = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
);

const Loader = () => (
  <svg className="animate-spin" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#522DA6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/><line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"/><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"/></svg>
);
const Sliders = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/><line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/><line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/></svg>
);

// ── Step Indicator ──
function StepIndicator({ steps, current }) {
  return (
    <div className="flex items-center gap-2 text-sm text-zinc-500">
      {steps.map((s, i) => (
        <React.Fragment key={s.id}>
          <span className={`font-medium ${s.id === current ? 'text-[#522DA6]' : i < steps.findIndex(x => x.id === current) ? 'text-zinc-900' : ''}`}>
            {s.label}
          </span>
          {i < steps.length - 1 && <span className="text-zinc-300">{'>'}</span>}
        </React.Fragment>
      ))}
    </div>
  );
}

// ── Toggle Component ──
function Toggle({ checked, onChange, label, description }) {
  return (
    <label className="flex items-start gap-3 cursor-pointer">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 shrink-0 rounded-full border-2 border-transparent transition-colors ${checked ? 'bg-[#522DA6]' : 'bg-zinc-200'}`}
      >
        <span className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform ${checked ? 'translate-x-5' : 'translate-x-0'}`} />
      </button>
      <div>
        <div className="text-sm font-medium text-zinc-900">{label}</div>
        {description && <div className="text-xs text-zinc-500 mt-0.5">{description}</div>}
      </div>
    </label>
  );
}

// ── Multi-Select ──
function MultiSelect({ label, options, selected, onChange, placeholder }) {
  const [open, setOpen] = useState(false);
  const toggle = (opt) => {
    if (selected.includes(opt)) onChange(selected.filter(s => s !== opt));
    else onChange([...selected, opt]);
  };

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-zinc-900 mb-1.5">{label}</label>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-3 py-2.5 border border-zinc-200 rounded-lg text-sm text-left hover:border-zinc-300 focus:outline-none focus:ring-2 focus:ring-[#522DA6]/20"
      >
        <span className={selected.length ? 'text-zinc-900' : 'text-zinc-400'}>
          {selected.length ? `${selected.length} selected` : placeholder || 'All (default)'}
        </span>
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
      </button>
      {open && (
        <div className="absolute z-20 mt-1 w-full bg-white border border-zinc-200 rounded-lg shadow-lg py-1 max-h-48 overflow-y-auto">
          {options.map(opt => (
            <label key={opt} className="flex items-center gap-2 px-3 py-2 hover:bg-zinc-50 cursor-pointer text-sm">
              <input
                type="checkbox"
                checked={selected.includes(opt)}
                onChange={() => toggle(opt)}
                className="rounded border-zinc-300 text-[#522DA6] focus:ring-[#522DA6]"
              />
              {opt}
            </label>
          ))}
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════
// STEP 1: Validation
// ══════════════════════════════════════════
const ChevronDown = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
);
const ExternalLinkIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
);
const ShieldCheck = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg>
);

function ValidationStep({ onNext }) {
  const [status, setStatus] = useState('loading'); // loading | done
  const [dismissed, setDismissed] = useState([]);
  const [errorsOpen, setErrorsOpen] = useState(true);
  const [warningsOpen, setWarningsOpen] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setStatus('done'), 1500);
    return () => clearTimeout(timer);
  }, []);

  const errors = VALIDATION_RESULTS.errors.filter(e => !dismissed.includes(e.id));
  const warnings = VALIDATION_RESULTS.warnings.filter(w => !dismissed.includes(w.id));
  const hasErrors = errors.length > 0;
  const hasWarnings = warnings.length > 0;
  const isClean = !hasErrors && !hasWarnings;
  const canContinue = status === 'done' && !hasErrors;

  // Auto-skip to next step when no issues
  useEffect(() => {
    if (status === 'done' && isClean) {
      onNext();
    }
  }, [status, isClean]);

  return (
    <>
      <div className="space-y-6 pb-24">
        <div>
          <h2 className="text-lg font-semibold text-zinc-900">Data validation</h2>
          <p className="text-sm text-zinc-500 mt-1">
            Checking your event data for issues that could affect schedule generation.
          </p>
        </div>

        {/* Loading state */}
        {status === 'loading' && (
          <div className="flex flex-col items-center justify-center py-20 border border-zinc-200 rounded-xl bg-zinc-50/50">
            <Loader />
            <p className="text-sm font-medium text-zinc-600 mt-4">Validating event data...</p>
            <p className="text-xs text-zinc-400 mt-1">This may take a moment.</p>
          </div>
        )}

        {/* Clean state */}
        {status === 'done' && isClean && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <ShieldCheck />
            <p className="text-base font-semibold text-zinc-900 mt-4">All clear</p>
            <p className="text-sm text-zinc-500 mt-1 max-w-sm">
              No issues found with your event data. You're ready to configure and generate schedules.
            </p>
          </div>
        )}

        {/* Errors accordion */}
        {status === 'done' && errors.length > 0 && (
          <div className="border border-zinc-200 rounded-xl overflow-hidden">
            <button
              onClick={() => setErrorsOpen(!errorsOpen)}
              className="w-full flex items-center justify-between px-5 py-4 hover:bg-zinc-50 transition-colors"
            >
              <span className="flex items-center gap-2.5 text-sm font-semibold text-zinc-900">
                <XCircle /> {errors.length} Error{errors.length > 1 ? 's' : ''} (must be fixed)
              </span>
              <span className={`text-zinc-400 transition-transform ${errorsOpen ? '' : '-rotate-90'}`}>
                <ChevronDown />
              </span>
            </button>
            {errorsOpen && (
              <div className="border-t border-zinc-200">
                {errors.map(err => (
                  <div key={err.id} className="flex items-start justify-between border-l-[3px] border-l-rose-500 px-5 py-4">
                    <div className="flex-1">
                      <p className="text-sm text-zinc-800">{err.message}</p>
                      {err.hint && (
                        <button title="Not available on this prototype" className="flex items-center gap-1.5 text-sm font-medium text-rose-600 hover:text-rose-700 mt-2">
                          {err.hint} <ExternalLinkIcon />
                        </button>
                      )}
                    </div>
                    <button onClick={() => setDismissed(d => [...d, err.id])} className="text-xs text-zinc-400 hover:text-zinc-600 shrink-0 ml-4">Dismiss</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Warnings accordion */}
        {status === 'done' && warnings.length > 0 && (
          <div className="border border-zinc-200 rounded-xl overflow-hidden">
            <button
              onClick={() => setWarningsOpen(!warningsOpen)}
              className="w-full flex items-center justify-between px-5 py-4 hover:bg-zinc-50 transition-colors"
            >
              <span className="flex items-center gap-2.5 text-sm font-semibold text-zinc-900">
                <AlertTriangle /> {warnings.length} Warning{warnings.length > 1 ? 's' : ''}
              </span>
              <span className={`text-zinc-400 transition-transform ${warningsOpen ? '' : '-rotate-90'}`}>
                <ChevronDown />
              </span>
            </button>
            {warningsOpen && (
              <div className="border-t border-zinc-200">
                {warnings.map(w => (
                  <div key={w.id} className="flex items-start justify-between border-l-[3px] border-l-amber-500 px-5 py-4">
                    <div className="flex-1">
                      <p className="text-sm text-zinc-800">{w.message}</p>
                      {w.hint && (
                        <button title="Not available on this prototype" className="flex items-center gap-1.5 text-sm font-medium text-amber-600 hover:text-amber-700 mt-2">
                          {w.hint} <ExternalLinkIcon />
                        </button>
                      )}
                    </div>
                    <button onClick={() => setDismissed(d => [...d, w.id])} className="text-xs text-zinc-400 hover:text-zinc-600 shrink-0 ml-4">Dismiss</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Fixed bottom bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-zinc-200 px-10 py-4 flex items-center justify-end gap-3 z-30">
        {status === 'done' && (
          <button
            onClick={() => { setStatus('loading'); setDismissed([]); }}
            className="px-4 py-2 border border-[#522DA6] rounded-lg text-sm font-medium text-[#522DA6] hover:bg-[#522DA6]/5"
          >
            Re-validate
          </button>
        )}
        <button
          onClick={onNext}
          disabled={!canContinue}
          className={`px-6 py-2.5 rounded-lg text-sm font-medium ${
            canContinue
              ? 'bg-[#522DA6] text-white hover:bg-[#422389]'
              : 'bg-zinc-100 text-zinc-400 cursor-not-allowed'
          }`}
        >
          {status === 'loading' ? 'Validating...' : hasErrors ? 'Fix errors to continue' : 'Continue'}
        </button>
      </div>
    </>
  );
}

// ══════════════════════════════════════════
// STEP 2: Configuration
// ══════════════════════════════════════════
function ConfigurationStep({ config, setConfig, onGenerate, onBack, onSlotPriorities, slotRuleCount }) {
  const update = (key, value) => setConfig(prev => ({ ...prev, [key]: value }));

  return (
    <>
    <div className="space-y-8 pb-24">
      <div>
        <h2 className="text-lg font-semibold text-zinc-900">Configure schedule generation</h2>
        <p className="text-sm text-zinc-500 mt-1">
          Choose what to include, how they should be prioritized, and how the scheduler should treat existing schedules.
        </p>
      </div>

      {/* ── Section 1: Scheduling behaviour ── */}
      <div className="space-y-6">
        <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-wide">Scheduling behaviour</h3>

        {/* Clear Schedule */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-zinc-900">How should this run treat existing schedules?</label>
          <div className="space-y-2">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                name="clearSchedule"
                checked={config.clearSchedule}
                onChange={() => update('clearSchedule', true)}
                className="text-[#522DA6] focus:ring-[#522DA6]"
              />
              <span className="text-sm text-zinc-700">Replace existing schedules for selected activities</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                name="clearSchedule"
                checked={!config.clearSchedule}
                onChange={() => update('clearSchedule', false)}
                className="text-[#522DA6] focus:ring-[#522DA6]"
              />
              <span className="text-sm text-zinc-700">Only use currently available slots</span>
            </label>
          </div>
        </div>

        {/* Schedule Balancing */}
        <div>
          <label className="block text-sm font-medium text-zinc-900 mb-1.5">Schedule balancing</label>
          <select
            value={config.balancing}
            onChange={e => update('balancing', e.target.value)}
            className="w-full px-3 py-2.5 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#522DA6]/20 focus:border-[#522DA6]"
          >
            <option value="quality">Prioritize quality above balanced schedules</option>
            <option value="balanced">Prioritize balanced schedules over quality</option>
          </select>
          <p className="text-xs text-zinc-400 mt-1">Controls whether the algorithm favors the best match quality or even distribution of meetings.</p>
        </div>

        <Toggle
          checked={config.sharersShareMeetings}
          onChange={v => update('sharersShareMeetings', v)}
          label="Sharers share meetings"
          description="Whether sharers should be given the same meetings or treated individually."
        />
      </div>

      <hr className="border-zinc-200" />

      {/* ── Section 2: Attendance rules ── */}
      <div className="space-y-6">
        <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-wide">Attendance rules</h3>
        <Toggle
          checked={config.includeSessionAttendance}
          onChange={v => update('includeSessionAttendance', v)}
          label="Include session attendance"
          description="Create meetings in time slots occupied by sessions the user is attending."
        />
        <Toggle
          checked={config.includeMeetingAttendance}
          onChange={v => update('includeMeetingAttendance', v)}
          label="Include meeting attendance"
          description="Create meetings in time slots occupied by regular meetings."
        />
      </div>

      <hr className="border-zinc-200" />

      {/* ── Section 3: Scope ── */}
      <div className="space-y-6">
        <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-wide">Scope</h3>
        <div className="grid grid-cols-2 gap-4">
        <MultiSelect
          label="Generate for profiles"
          options={PROFILE_OPTIONS}
          selected={config.profiles}
          onChange={v => update('profiles', v)}
          placeholder="All profiles (default)"
        />
        <MultiSelect
          label="Generate for groups"
          options={GROUP_OPTIONS}
          selected={config.groups}
          onChange={v => update('groups', v)}
          placeholder="All groups (default)"
        />
        <MultiSelect
          label="Restrict to locations"
          options={LOCATION_OPTIONS}
          selected={config.locations}
          onChange={v => update('locations', v)}
          placeholder="All locations (default)"
        />
        {/* Date/Time Range */}
        <div>
          <label className="block text-sm font-medium text-zinc-900 mb-1.5">Restrict to start date</label>
          <input type="date" value={config.dateRangeStart} onChange={e => update('dateRangeStart', e.target.value)} className="w-full px-3 py-2.5 border border-zinc-200 rounded-lg text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-[#522DA6]/20 focus:border-[#522DA6]" />
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-900 mb-1.5">Restrict to end date</label>
          <input type="date" value={config.dateRangeEnd} onChange={e => update('dateRangeEnd', e.target.value)} className="w-full px-3 py-2.5 border border-zinc-200 rounded-lg text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-[#522DA6]/20 focus:border-[#522DA6]" />
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-900 mb-1.5">Restrict to start time</label>
          <input type="time" value={config.timeRangeStart} onChange={e => update('timeRangeStart', e.target.value)} className="w-full px-3 py-2.5 border border-zinc-200 rounded-lg text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-[#522DA6]/20 focus:border-[#522DA6]" />
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-900 mb-1.5">Restrict to end time</label>
          <input type="time" value={config.timeRangeEnd} onChange={e => update('timeRangeEnd', e.target.value)} className="w-full px-3 py-2.5 border border-zinc-200 rounded-lg text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-[#522DA6]/20 focus:border-[#522DA6]" />
        </div>
        </div>
      </div>

      <hr className="border-zinc-200" />

      {/* ── Section 4: Slot Priorities ── */}
      <div className="border border-zinc-200 rounded-xl p-5 bg-zinc-50/50">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-[#522DA6]/10 rounded-lg text-[#522DA6]">
            <Sliders />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-zinc-900">Slot Priorities</h3>
            <p className="text-xs text-zinc-500 mt-0.5">
              Configure which time slots and locations should be prioritized during generation.
              {slotRuleCount > 0 && <span className="text-[#522DA6] font-medium"> {slotRuleCount} rule{slotRuleCount > 1 ? 's' : ''} configured.</span>}
            </p>
            <button
              onClick={onSlotPriorities}
              className="mt-2 text-xs font-medium text-[#522DA6] hover:underline"
            >
              Review slot priority settings →
            </button>
          </div>
        </div>
      </div>

    </div>

      {/* Fixed bottom bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-zinc-200 px-10 py-4 flex items-center justify-end z-30">
        <button
          onClick={onGenerate}
          className="px-6 py-2.5 bg-[#522DA6] text-white rounded-lg text-sm font-medium hover:bg-[#422389]"
        >
          Generate Schedules
        </button>
      </div>
    </>
  );
}

// ══════════════════════════════════════════
// FLOW CONTAINER
// ══════════════════════════════════════════
const STEPS = [
  { id: 'validation', label: 'Validation' },
  { id: 'config', label: 'Setup' },
];

export default function GenerateFlow({ navigate, config, setConfig, slotRules, setSlotRules, currentStep, onStartGeneration }) {
  const [step, setStep] = useState('validation');

  const goBack = () => navigate('#/schedules');

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="h-1 bg-[#522DA6]" />
      <div className="sticky top-0 z-40 border-b border-zinc-200 bg-white px-10 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <img src="/Image (Grip).png" alt="Grip" className="h-7" />
          <div>
            <h1 className="text-lg font-semibold text-zinc-900">Generate Schedules</h1>
            <StepIndicator steps={STEPS} current={step} />
          </div>
        </div>
        <button onClick={goBack} className="flex items-center gap-2 px-4 py-2 border border-zinc-300 rounded-lg text-sm font-medium text-zinc-700 hover:bg-zinc-50">
          <ArrowLeft /> Go back
        </button>
      </div>

      {/* Step Content */}
      <div className="py-8 px-10">
        {step === 'validation' && (
          <ValidationStep
            onNext={() => setStep('config')}
            onBack={goBack}
          />
        )}
        {step === 'config' && (
          <ConfigurationStep
            config={config}
            setConfig={setConfig}
            onGenerate={() => {
              onStartGeneration?.();
              toast.info('Schedule generation has started. You will be notified when complete.');
              navigate('#/schedules');
            }}
            onBack={() => setStep('validation')}
            onSlotPriorities={() => navigate('#/slot-priorities')}
            slotRuleCount={slotRules.length}
          />
        )}
      </div>
    </div>
  );
}
