import React from 'react';

const Loader = () => (
  <svg className="animate-spin" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#522DA6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/><line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"/><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"/></svg>
);

const CheckCircle = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
);

const XCircle = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
);

export default function BuildStatusPanel({ platform, status, logs, onClearCertificates }) {
  if (!status) return null;

  const isIos = platform === 'ios';
  const label = isIos ? 'iOS' : 'Android';

  return (
    <div className={`border rounded-xl p-4 ${
      status === 'building' ? 'border-[#522DA6]/30 bg-[#522DA6]/5' :
      status === 'success' ? 'border-green-200 bg-green-50' :
      'border-rose-200 bg-rose-50'
    }`}>
      <div className="flex items-center gap-3">
        {status === 'building' && <Loader />}
        {status === 'success' && <CheckCircle />}
        {status === 'failed' && <XCircle />}
        <div>
          <p className={`text-sm font-semibold ${
            status === 'building' ? 'text-[#522DA6]' :
            status === 'success' ? 'text-green-700' :
            'text-rose-700'
          }`}>
            {status === 'building' && `${label} Build in Progress...`}
            {status === 'success' && `${label} Build Successful`}
            {status === 'failed' && `${label} Build Failed`}
          </p>
          <p className="text-xs text-zinc-500 mt-0.5">
            {status === 'building' && 'This may take several minutes'}
            {status === 'success' && (isIos ? 'Pushed to TestFlight' : 'Pushed to App Tester')}
            {status === 'failed' && 'Check the logs below for details'}
          </p>
        </div>
      </div>

      {status === 'failed' && logs && (
        <div className="mt-3 space-y-2">
          <pre className="text-xs text-rose-800 bg-rose-100 rounded-lg p-3 overflow-x-auto max-h-40 whitespace-pre-wrap font-mono">
            {logs}
          </pre>
          {isIos && onClearCertificates && (
            <button
              onClick={onClearCertificates}
              className="px-3 py-1.5 border border-rose-300 rounded-lg text-xs font-medium text-rose-700 hover:bg-rose-100 transition-colors"
            >
              Clear Certificates & Profiles
            </button>
          )}
        </div>
      )}
    </div>
  );
}
