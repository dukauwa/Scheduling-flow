import React from 'react';
import { AgGridReact } from 'ag-grid-react';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { SCORES, SCORING_STATS } from '../mockData';

ModuleRegistry.registerModules([AllCommunityModule]);

// ── Icons ──
const InfoIconDark = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
);

const InfoIconTeal = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="#2DA67D" stroke="#2DA67D" strokeWidth="0"><circle cx="12" cy="12" r="10" fill="#2DA67D"/><text x="12" y="16" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold" fontFamily="sans-serif">i</text></svg>
);


const EyeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
);

// ── Scores Tab ──
function ScoresTab() {
  const columnDefs = [
    { field: 'profileOneId', headerName: 'Profile One ID', width: 150, filter: true, floatingFilter: true },
    { field: 'profileOneName', headerName: 'Profile Name', flex: 1, filter: true, floatingFilter: true },
    { field: 'profileTwoId', headerName: 'Profile Two ID', width: 150, filter: true, floatingFilter: true },
    { field: 'profileTwoName', headerName: 'Profile Name', flex: 1, filter: true, floatingFilter: true },
    { field: 'score', headerName: 'Score', width: 100, filter: true, floatingFilter: true },
    { field: 'reason', headerName: 'Score Reason', flex: 1.5, filter: true, floatingFilter: true },
  ];

  return (
    <div className="space-y-4">
      {/* Stats bar + buttons row */}
      <div className="flex items-center justify-between gap-4">
        {/* Stats card */}
        <div className="flex border border-zinc-200 rounded-lg divide-x divide-zinc-200">
          <div className="px-5 py-3">
            <div className="text-xs text-zinc-500 mb-1">Potential avg score</div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-bold text-zinc-900">{SCORING_STATS.avgScore}</span>
              <InfoIconTeal />
            </div>
          </div>
          <div className="px-5 py-3">
            <div className="text-xs text-zinc-500 mb-1">Time of generation</div>
            <div className="text-sm font-bold text-zinc-900">{SCORING_STATS.generationTime}</div>
          </div>
          <div className="px-5 py-3">
            <div className="text-xs text-zinc-500 mb-1">Modifiers used</div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-bold text-zinc-900">{SCORING_STATS.modifiersUsed} modifiers selected</span>
              <InfoIconTeal />
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-zinc-300 rounded-lg text-sm font-medium text-zinc-900 hover:bg-zinc-50">
            Export as CSV
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#522DA6] text-white rounded-lg text-sm font-medium hover:bg-[#422389]">
            Generate new scores
          </button>
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-zinc-500">
        A list of the scores between all participants based on the settings chosen. Higher scores mean greater chance of a meeting.
      </p>

      {/* AG Grid Table */}
      <div className="ag-theme-quartz" style={{ height: 520 }}>
        <AgGridReact
          rowData={SCORES}
          columnDefs={columnDefs}
          defaultColDef={{ sortable: true, resizable: true }}
          animateRows
          pagination
          paginationPageSize={10}
        />
      </div>
    </div>
  );
}

// ── Schedule Generations Tab ──
function ScheduleGenerationsTab({ navigate, generationStatus, currentGeneration }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-zinc-900">Schedule Generations</h3>
          <p className="text-sm text-zinc-500 mt-0.5">Track and manage schedule generation runs.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('#/schedules/view')}
            className="flex items-center gap-2 px-4 py-2 border border-zinc-300 rounded-lg text-sm font-medium text-zinc-900 hover:bg-zinc-50"
          >
            <EyeIcon />
            View schedules
          </button>
          <button
            onClick={() => navigate('#/generate')}
            className="px-4 py-2 bg-[#522DA6] text-white rounded-lg text-sm font-medium hover:bg-[#422389]"
          >
            Generate schedules
          </button>
        </div>
      </div>

      {/* Last Generation Card */}
      <div className="border border-zinc-200 rounded-lg bg-white overflow-hidden">
        <div className="px-5 py-4 border-b border-zinc-100">
          <h4 className="text-sm font-semibold text-zinc-900">Last generation run</h4>
        </div>

        {/* Running */}
        {generationStatus === 'running' && currentGeneration && (
          <div className="px-5 py-6">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse" />
              <span className="text-sm font-medium text-blue-600">Running...</span>
            </div>
            <p className="text-sm text-zinc-500 mb-4">Schedule generation is in progress. This may take a few minutes.</p>
            <button
              onClick={() => {}}
              className="px-4 py-2 border border-zinc-200 rounded-lg text-sm font-medium text-zinc-700 hover:bg-zinc-50"
            >
              Check status
            </button>
          </div>
        )}

        {/* Complete */}
        {generationStatus === 'complete' && currentGeneration && (
          <div className="px-5 py-6">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span className="text-sm font-medium text-emerald-600">Complete</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-5">
              <div>
                <div className="text-xs text-zinc-500 mb-0.5">Meetings generated</div>
                <div className="text-sm font-semibold text-zinc-900">{currentGeneration.itemsGenerated}</div>
              </div>
              <div>
                <div className="text-xs text-zinc-500 mb-0.5">Date</div>
                <div className="text-sm font-semibold text-zinc-900">{currentGeneration.timeCreated}</div>
              </div>
              <div>
                <div className="text-xs text-zinc-500 mb-0.5">Time taken</div>
                <div className="text-sm font-semibold text-zinc-900">{currentGeneration.timeTaken || '~10s'}</div>
              </div>
              <div>
                <div className="text-xs text-zinc-500 mb-0.5">Generated by</div>
                <div className="text-sm font-semibold text-zinc-900">{currentGeneration.generatedBy}</div>
              </div>
            </div>
            <button
              onClick={() => navigate('#/schedules/view')}
              className="px-4 py-2 bg-[#522DA6] text-white rounded-lg text-sm font-medium hover:bg-[#422389]"
            >
              View Schedules
            </button>
          </div>
        )}

        {/* Failed */}
        {generationStatus === 'failed' && (
          <div className="px-5 py-6">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              <span className="text-sm font-medium text-rose-600">Failed</span>
            </div>
            <p className="text-sm text-rose-700">Schedule generation failed. Please check your settings and try again.</p>
          </div>
        )}

        {/* No runs yet */}
        {!generationStatus && (
          <div className="px-5 py-8 text-center">
            <p className="text-sm text-zinc-400">No generation runs yet. Click "Generate schedules" to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Hub Page ──
export default function ScoringSchedulesHub({ navigate, activeTab, generations, lastGeneration, onDismissBanner, generationStatus, currentGeneration }) {
  const handleTabClick = (tab) => {
    if (tab === 'scores') navigate('#/');
    else navigate('#/schedules');
  };

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-semibold text-zinc-900">Scoring & Schedules</h1>
          <span className="text-zinc-900 cursor-pointer"><InfoIconDark /></span>
        </div>
        <p className="text-sm text-zinc-500 mt-1">
          On this page, you can generate meeting scores between attendees based on preferences and profile data.
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-zinc-200">
        <div className="flex gap-0">
          <button
            onClick={() => handleTabClick('scores')}
            className={`px-4 py-3 text-[15px] font-medium border-b-2 transition-colors ${
              activeTab === 'scores'
                ? 'border-[#522DA6] text-[#522DA6]'
                : 'border-transparent text-zinc-500 hover:text-zinc-700 hover:border-zinc-300'
            }`}
          >
            Scores
          </button>
          <button
            onClick={() => handleTabClick('generations')}
            className={`px-4 py-3 text-[15px] font-medium border-b-2 transition-colors ${
              activeTab === 'generations'
                ? 'border-[#522DA6] text-[#522DA6]'
                : 'border-transparent text-zinc-500 hover:text-zinc-700 hover:border-zinc-300'
            }`}
          >
            Schedule generations
          </button>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'scores' ? (
        <ScoresTab />
      ) : (
        <ScheduleGenerationsTab navigate={navigate} generationStatus={generationStatus} currentGeneration={currentGeneration} />
      )}
    </div>
  );
}
