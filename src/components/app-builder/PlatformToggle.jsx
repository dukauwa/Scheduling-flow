import React from 'react';

export default function PlatformToggle({ platform, checked, onChange, disabled }) {
  const isIos = platform === 'ios';

  return (
    <label className="flex items-start gap-3 cursor-pointer">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => !disabled && onChange(!checked)}
        className={`relative inline-flex h-6 w-11 shrink-0 rounded-full border-2 border-transparent transition-colors ${
          disabled
            ? 'bg-zinc-100 cursor-not-allowed'
            : checked
              ? 'bg-[#522DA6]'
              : 'bg-zinc-200'
        }`}
      >
        <span className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform ${checked && !disabled ? 'translate-x-5' : 'translate-x-0'}`} />
      </button>
      <div>
        <div className={`text-sm font-medium ${disabled ? 'text-zinc-400' : 'text-zinc-900'}`}>
          {isIos ? 'iOS Deploy' : 'Android Deploy'}
        </div>
        <div className="text-xs text-zinc-500 mt-0.5">
          {isIos ? 'Push to TestFlight for internal testers' : 'Push to App Tester for internal testers'}
        </div>
      </div>
    </label>
  );
}
