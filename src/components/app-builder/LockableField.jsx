import React from 'react';
import Tooltip from './Tooltip';

const LockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
);

export default function LockableField({ label, value, onChange, locked, placeholder, type = 'text', helperText, error, required, tooltip }) {
  const isLocked = !!locked;

  return (
    <div>
      <label className="flex items-center text-sm font-medium text-zinc-900 mb-1.5">
        {label}
        {required && <span className="text-rose-500 ml-0.5">*</span>}
        {tooltip && <Tooltip text={tooltip} />}
      </label>
      <div className="relative">
        <input
          type={type}
          value={value || ''}
          onChange={e => !isLocked && onChange?.(e.target.value)}
          placeholder={placeholder}
          readOnly={isLocked}
          className={`w-full px-3 py-2.5 border rounded-lg text-sm focus:outline-none transition-colors ${
            isLocked
              ? 'bg-zinc-50 border-zinc-200 text-zinc-500 cursor-not-allowed'
              : error
                ? 'border-rose-300 focus:ring-2 focus:ring-rose-200 focus:border-rose-400'
                : 'border-zinc-200 focus:ring-2 focus:ring-[#522DA6]/20 focus:border-[#522DA6]'
          } ${isLocked ? 'pr-8' : ''}`}
        />
        {isLocked && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400">
            <LockIcon />
          </span>
        )}
      </div>
      {error && <p className="text-xs text-rose-600 mt-1">{error}</p>}
      {helperText && !error && <p className="text-xs text-zinc-400 mt-1">{helperText}</p>}
    </div>
  );
}
