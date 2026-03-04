import React, { useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { toast } from 'sonner';
import { SCORES, SCORING_STATS } from '../mockData';

ModuleRegistry.registerModules([AllCommunityModule]);

// ── Icons ──
const InfoIconDark = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
);

const InfoIconTeal = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="#2DA67D" stroke="#2DA67D" strokeWidth="0"><circle cx="12" cy="12" r="10" fill="#2DA67D"/><text x="12" y="16" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold" fontFamily="sans-serif">i</text></svg>
);

const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
);

const ChevronDown = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
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
function ScheduleGenerationsTab({ navigate, generations, lastGeneration, onDismissBanner }) {
  // Show toast when a new generation completes
  useEffect(() => {
    if (lastGeneration) {
      toast.success(
        <div className="flex items-center justify-between gap-4 w-full">
          <span className="text-sm font-medium">
            Generation complete — {lastGeneration.itemsGenerated} meetings created
          </span>
          <button
            onClick={() => { navigate('#/schedules/view'); toast.dismiss(); }}
            className="px-3 py-1 bg-[#522DA6] text-white rounded text-xs font-medium hover:bg-[#422389] whitespace-nowrap"
          >
            View schedules
          </button>
        </div>,
        { duration: 8000, onDismiss: onDismissBanner, onAutoClose: onDismissBanner }
      );
    }
  }, [lastGeneration]);
  const columnDefs = [
    { field: 'id', headerName: 'Generation ID', width: 150, filter: true },
    { field: 'includedTypes', headerName: 'Included Types', flex: 1, filter: true },
    { field: 'scope', headerName: 'Scope', width: 130, filter: true },
    {
      field: 'itemsGenerated',
      headerName: 'Items Generated',
      width: 180,
      filter: true,
      valueFormatter: p => `${p.value} calendar events`,
    },
    {
      field: 'avgMatchScore',
      headerName: 'Avg. Match Score',
      width: 160,
      filter: true,
      valueFormatter: p => `${p.value}%`,
    },
    { field: 'generatedBy', headerName: 'Generated By', flex: 1, filter: true },
    { field: 'timeCreated', headerName: 'Time Created', flex: 1, filter: true },
  ];

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-400">
              <SearchIcon />
            </span>
            <input
              type="text"
              placeholder="Search"
              className="pl-8 pr-3 py-2 border border-zinc-200 rounded-lg text-sm w-64 focus:outline-none focus:ring-2 focus:ring-[#522DA6]/20 focus:border-[#522DA6]"
            />
          </div>
          <button className="flex items-center gap-1 px-3 py-2 border border-zinc-200 rounded-lg text-sm font-medium text-zinc-900 hover:bg-zinc-50">
            Actions
            <ChevronDown />
          </button>
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
            className="flex items-center gap-2 px-4 py-2 bg-[#522DA6] text-white rounded-lg text-sm font-medium hover:bg-[#422389]"
          >
            Generate schedules
          </button>
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-zinc-500">
        A list of all schedule generation runs for this event. Review generation settings, results, and performance metrics for each run.
      </p>

      {/* AG Grid Table */}
      <div className="ag-theme-quartz" style={{ height: 320 }}>
        <AgGridReact
          rowData={generations}
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

// ── Hub Page ──
export default function ScoringSchedulesHub({ navigate, activeTab, generations, lastGeneration, onDismissBanner }) {
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
        <ScheduleGenerationsTab navigate={navigate} generations={generations} lastGeneration={lastGeneration} onDismissBanner={onDismissBanner} />
      )}
    </div>
  );
}
