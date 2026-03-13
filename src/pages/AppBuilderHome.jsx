import React from 'react';

const PlusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
);

const PhoneIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#a1a1aa" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>
);

const EyeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
);

const RevertIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></svg>
);

const STATUS_STYLES = {
  success: 'bg-green-100 text-green-700',
  failed: 'bg-rose-100 text-rose-700',
  draft: 'bg-zinc-100 text-zinc-600',
  building: 'bg-[#522DA6]/10 text-[#522DA6]',
};

function StatusBadge({ status }) {
  const label = (status || 'none').charAt(0).toUpperCase() + (status || 'none').slice(1);
  return (
    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_STYLES[status] || STATUS_STYLES.draft}`}>
      {label}
    </span>
  );
}

function MetadataChip({ label, value }) {
  return (
    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-100 rounded-lg">
      <span className="text-xs text-zinc-500">{label}</span>
      <span className="text-xs font-mono font-medium text-zinc-700">{value}</span>
    </div>
  );
}

export default function AppBuilderHome({ navigate, versions = [], appData = {} }) {
  const hasApp = versions.length > 0;

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900">App Builder</h1>
          <p className="text-sm text-zinc-500 mt-1">Manage your native app builds for iOS and Android</p>
        </div>
        {hasApp && (
          <button
            onClick={() => navigate?.('#/app-builder/new')}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#522DA6] text-white rounded-lg text-sm font-medium hover:bg-[#422389]"
          >
            <PlusIcon />
            New Version
          </button>
        )}
      </div>

      {!hasApp ? (
        /* Empty state */
        <div className="flex flex-col items-center justify-center py-24 border border-zinc-200 rounded-xl bg-zinc-50/50">
          <PhoneIcon />
          <h2 className="text-base font-semibold text-zinc-900 mt-4">No versions yet</h2>
          <p className="text-sm text-zinc-500 mt-1 max-w-sm text-center">
            Create your first app version to push to TestFlight and App Tester for internal testing.
          </p>
          <button
            onClick={() => navigate?.('#/app-builder/new')}
            className="mt-4 px-4 py-2.5 bg-[#522DA6] text-white rounded-lg text-sm font-medium hover:bg-[#422389]"
          >
            Create first version
          </button>
        </div>
      ) : (
        <>
          {/* App Identity Card */}
          <div className="border border-zinc-200 rounded-xl p-5 mb-6 bg-white">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-lg font-semibold text-zinc-900">{appData.appName}</h2>
                <div className="flex flex-wrap items-center gap-2 mt-3">
                  <MetadataChip label="Bundle ID" value={appData.bundleId} />
                  <MetadataChip label="Package ID" value={appData.packageId} />
                  <MetadataChip label="Apple Team ID" value={appData.appleTeamId} />
                  {appData.appleStoreConnectId && (
                    <MetadataChip label="App Store ID" value={appData.appleStoreConnectId} />
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Version History Table */}
          <div className="border border-zinc-200 rounded-xl overflow-hidden">
            <div className="px-5 py-3 bg-zinc-50 border-b border-zinc-200">
              <h3 className="text-sm font-semibold text-zinc-700">Version History</h3>
            </div>
            <table className="w-full">
              <thead>
                <tr className="border-b border-zinc-200">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wide">Version</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wide">iOS Version</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wide">Android Version</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wide">iOS Status</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wide">Android Status</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wide">Created</th>
                  <th className="text-right px-5 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {versions.map((v, idx) => {
                  const isCurrent = idx === 0;
                  return (
                    <tr key={v.versionNumber} className="hover:bg-zinc-50 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-zinc-900">v{v.versionNumber}</span>
                          {isCurrent && (
                            <span className="px-1.5 py-0.5 bg-[#522DA6]/10 text-[#522DA6] rounded text-[10px] font-semibold uppercase">Current</span>
                          )}
                          {v.revertedFrom && (
                            <span className="px-1.5 py-0.5 bg-amber-100 text-amber-700 rounded text-[10px] font-medium">from v{v.revertedFrom}</span>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-sm font-mono text-zinc-600">{v.iosVersion}</span>
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-sm font-mono text-zinc-600">{v.androidVersion}</span>
                      </td>
                      <td className="px-5 py-4">
                        <StatusBadge status={v.iosBuildStatus} />
                      </td>
                      <td className="px-5 py-4">
                        <StatusBadge status={v.androidBuildStatus} />
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-sm text-zinc-500">{v.createdAt}</span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => navigate?.(`#/app-builder/version/${v.versionNumber}`)}
                            className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg transition-colors"
                          >
                            <EyeIcon /> View
                          </button>
                          {!isCurrent && (
                            <button
                              onClick={() => navigate?.(`#/app-builder/revert/${v.versionNumber}`)}
                              className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-[#522DA6] hover:bg-[#522DA6]/10 rounded-lg transition-colors"
                            >
                              <RevertIcon /> Revert
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
