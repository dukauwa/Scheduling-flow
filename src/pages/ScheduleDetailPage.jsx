import React, { useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { toast } from 'sonner';

ModuleRegistry.registerModules([AllCommunityModule]);

// ── Icons ──
const ArrowLeft = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#522DA6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M7.83 13.17L2.67 8m0 0l5.16-5.17M2.67 8h10.5" /></svg>;
const X = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;
const CheckCircle = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>;
const ChevronDown = () => <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>;
const RefreshIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#522DA6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>;
const EditIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#522DA6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>;
const TrashIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>;
const GridIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>;
const ListIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>;

// ── Mock Data ──
const PARTICIPANT = { id: 'p1', name: 'Emma Johnson', company: 'Acme Corp', role: 'Buyer' };

const SCHEDULE_DATA = [
  { id: 1, date: '22 Mar', time: '09:00 - 09:30', type: 'Meeting', attendees: 'Sarah Connor, John Smith', location: 'Room A', score: null },
  { id: 2, date: '22 Mar', time: '11:00 - 11:30', type: '1:1', attendees: 'Michael Brown, Rachel Adams', location: 'Room B', score: null },
  { id: 3, date: '22 Mar', time: '10:00 - 10:30', type: 'MustMeet', attendees: 'Laura Lee, Brian Stevens', location: 'Hall 2', score: 90 },
  { id: 4, date: '22 Mar', time: '13:00 - 13:30', type: 'MustMeet', attendees: 'Anna White, David Green', location: 'Hall 1', score: 88 },
  { id: 5, date: '22 Mar', time: '15:00 - 15:30', type: '1:1', attendees: 'Chris Johnson, Lisa Ray', location: 'Conference Room', score: null },
  { id: 6, date: '23 Mar', time: '09:30 - 10:00', type: 'MustMeet', attendees: 'Kevin Lee, Susan Park', location: 'Room A', score: 78 },
  { id: 7, date: '23 Mar', time: '10:30 - 11:00', type: '1:1', attendees: 'Julia Kim, Alex Chen', location: 'Hall 4', score: null },
  { id: 8, date: '23 Mar', time: '11:30 - 12:00', type: '1:1', attendees: 'Tom Wilson, Emma Lewis', location: 'Room C', score: null },
  { id: 9, date: '23 Mar', time: '14:30 - 15:00', type: 'MustMeet', attendees: 'Mark Young, Clara Scott', location: 'Room D', score: 82 },
  { id: 10, date: '23 Mar', time: '13:30 - 14:00', type: '1:1', attendees: 'Henry King, Nancy Bell', location: 'Hall 5', score: null },
  { id: 11, date: '24 Mar', time: '09:00 - 09:30', type: 'MustMeet', attendees: 'Olivia Green, Noah Brown', location: 'Hall 1', score: 96 },
  { id: 12, date: '24 Mar', time: '10:00 - 10:30', type: '1:1', attendees: 'Sophia Lopez, Wei Zhang', location: 'Room B', score: null },
  { id: 13, date: '24 Mar', time: '11:00 - 11:30', type: 'MustMeet', attendees: 'Aisha Khan, Kenji Tanaka', location: 'Hall 2', score: 95 },
  { id: 14, date: '24 Mar', time: '13:00 - 13:30', type: 'Meeting', attendees: 'Marcus Bell, Fatima Ali', location: 'Conference Room', score: null },
  { id: 15, date: '24 Mar', time: '14:00 - 14:30', type: 'MustMeet', attendees: 'Priya Sharma, David Lee', location: 'Room A', score: 99 },
  { id: 16, date: '24 Mar', time: '15:00 - 15:30', type: '1:1', attendees: 'Emily White, Carlos Garcia', location: 'Hall 3', score: null },
  { id: 17, date: '25 Mar', time: '09:00 - 09:30', type: 'MustMeet', attendees: 'Ingrid Van, Rajesh Singh', location: 'Hall 4', score: 91 },
  { id: 18, date: '25 Mar', time: '10:30 - 11:00', type: 'Meeting', attendees: 'James Wilson, Amara Osei', location: 'Room C', score: null },
  { id: 19, date: '25 Mar', time: '13:00 - 13:30', type: 'MustMeet', attendees: 'Lily Chen, Samir Patel', location: 'Hall 1', score: 97 },
  { id: 20, date: '25 Mar', time: '14:30 - 15:00', type: '1:1', attendees: 'Ben Carter, Kira Johnson', location: 'Room D', score: null },
];

const LOCATIONS = ['Room A', 'Room B', 'Room C', 'Room D', 'Hall 1', 'Hall 2', 'Hall 3', 'Hall 4', 'Hall 5', 'Conference Room'];
const TIMESLOTS = ['09:00 - 10:00', '10:00 - 11:00', '11:00 - 12:00', '12:00 - 13:00', '13:00 - 14:00', '14:00 - 15:00', '15:00 - 16:00'];

// ── Shared Components ──
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

function MultiSelect({ label, options, selected, onChange, placeholder }) {
  const [open, setOpen] = useState(false);
  const toggle = (opt) => {
    if (selected.includes(opt)) onChange(selected.filter(s => s !== opt));
    else onChange([...selected, opt]);
  };
  return (
    <div className="relative">
      <label className="block text-sm font-medium text-zinc-900 mb-1.5">{label}</label>
      <button type="button" onClick={() => setOpen(!open)} className="w-full flex items-center justify-between px-3 py-2.5 border border-zinc-200 rounded-lg text-sm text-left hover:border-zinc-300">
        <span className={selected.length ? 'text-zinc-900' : 'text-zinc-400'}>{selected.length ? `${selected.length} selected` : placeholder || 'All (default)'}</span>
        <ChevronDown />
      </button>
      {open && (
        <div className="absolute z-20 mt-1 w-full bg-white border border-zinc-200 rounded-lg shadow-lg py-1 max-h-48 overflow-y-auto">
          {options.map(opt => (
            <label key={opt} className="flex items-center gap-2 px-3 py-2 hover:bg-zinc-50 cursor-pointer text-sm">
              <input type="checkbox" checked={selected.includes(opt)} onChange={() => toggle(opt)} className="rounded border-zinc-300 text-[#522DA6]" />
              {opt}
            </label>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Individual Generate Modal (Sidebar) ──
function IndividualGenerateModal({ participant, onClose }) {
  const [clearSchedule, setClearSchedule] = useState(true);
  const [includeSession, setIncludeSession] = useState(true);
  const [includeMeeting, setIncludeMeeting] = useState(false);
  const [locations, setLocations] = useState([]);
  const [timeSlots, setTimeSlots] = useState([]);
  const [generating, setGenerating] = useState(false);

  const handleGenerate = () => {
    setGenerating(true);
    toast.info(`Generating schedule for ${participant.name}...`);
    setTimeout(() => {
      setGenerating(false);
      toast.success(`Schedule generated for ${participant.name}! 6 meetings created.`);
      onClose();
    }, 2500);
  };

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/30 z-40" onClick={onClose} />

      {/* Sidebar */}
      <div className="fixed right-0 top-0 bottom-0 w-[440px] bg-white z-50 shadow-2xl flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-zinc-200 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-zinc-900">Generate Schedule</h2>
            <p className="text-sm text-zinc-500">{participant.name} — {participant.company}</p>
          </div>
          <button onClick={onClose} className="text-zinc-400 hover:text-zinc-600"><X /></button>
        </div>

        {/* Validation Banner */}
        <div className="px-6 py-3 bg-emerald-50 border-b border-emerald-100 flex items-center gap-2">
          <CheckCircle />
          <span className="text-sm text-emerald-700 font-medium">Validation passed for this participant</span>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
          {/* Clear schedule */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-zinc-900">How to treat existing schedule?</label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="radio" checked={clearSchedule} onChange={() => setClearSchedule(true)} className="text-[#522DA6]" />
              <span className="text-sm text-zinc-700">Clear and regenerate</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="radio" checked={!clearSchedule} onChange={() => setClearSchedule(false)} className="text-[#522DA6]" />
              <span className="text-sm text-zinc-700">Only fill available slots</span>
            </label>
          </div>

          {/* Toggles */}
          <Toggle checked={includeSession} onChange={setIncludeSession} label="Include session attendance" description="Create meetings in time slots occupied by sessions." />
          <Toggle checked={includeMeeting} onChange={setIncludeMeeting} label="Include meeting attendance" description="Create meetings in time slots occupied by regular meetings." />

          {/* Multi-selects */}
          <MultiSelect label="Restrict to locations" options={LOCATIONS} selected={locations} onChange={setLocations} placeholder="All locations" />
          <MultiSelect label="Restrict to time slots" options={TIMESLOTS} selected={timeSlots} onChange={setTimeSlots} placeholder="All time slots" />
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-zinc-200 flex items-center justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-zinc-600 hover:text-zinc-900">Cancel</button>
          <button
            onClick={handleGenerate}
            disabled={generating}
            className="px-6 py-2.5 bg-[#522DA6] text-white rounded-lg text-sm font-medium hover:bg-[#422389] disabled:opacity-50"
          >
            {generating ? 'Generating...' : 'Generate Schedule'}
          </button>
        </div>
      </div>
    </>
  );
}

// ── Action Cell Renderer ──
function ActionCellRenderer({ data }) {
  const isMustMeet = data.type === 'MustMeet';
  return (
    <div className="flex items-center gap-1.5 h-full">
      {isMustMeet && (
        <button className="p-1.5 rounded hover:bg-zinc-100" title="Regenerate">
          <RefreshIcon />
        </button>
      )}
      <button className="p-1.5 rounded hover:bg-zinc-100" title="Edit">
        <EditIcon />
      </button>
      <button className="p-1.5 rounded hover:bg-zinc-100" title="Delete">
        <TrashIcon />
      </button>
    </div>
  );
}

// ── Schedule Detail Page ──
export default function ScheduleDetailPage({ navigate }) {
  const [showGenerateModal, setShowGenerateModal] = useState(false);

  const mustMeetCount = SCHEDULE_DATA.filter(d => d.type === 'MustMeet').length;
  const avgScore = Math.round(
    SCHEDULE_DATA.filter(d => d.score !== null).reduce((sum, d) => sum + d.score, 0) /
    SCHEDULE_DATA.filter(d => d.score !== null).length
  );

  const columnDefs = [
    {
      headerCheckboxSelection: true,
      checkboxSelection: true,
      width: 50,
      sortable: false,
      filter: false,
      resizable: false,
    },
    { field: 'date', headerName: 'Date', width: 120, filter: true, floatingFilter: true },
    { field: 'time', headerName: 'Time', width: 140, filter: true, floatingFilter: true },
    { field: 'type', headerName: 'Type', width: 120, filter: true, floatingFilter: true },
    { field: 'attendees', headerName: 'Attendees', flex: 1, filter: true, floatingFilter: true },
    { field: 'location', headerName: 'Location', width: 180, filter: true, floatingFilter: true },
    {
      field: 'score',
      headerName: 'Score',
      width: 100,
      filter: true,
      floatingFilter: true,
      valueFormatter: p => p.value != null ? p.value : '-',
    },
    {
      headerName: 'Action',
      width: 140,
      sortable: false,
      filter: true,
      floatingFilter: true,
      cellRenderer: ActionCellRenderer,
    },
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header Bar */}
      <div className="border-b border-zinc-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <img src="/grip-logo.png" alt="Grip" className="h-8" />
          <span className="text-base font-semibold text-zinc-900">{PARTICIPANT.name} schedule</span>
        </div>
        <button
          onClick={() => navigate('#/schedules/view')}
          className="flex items-center gap-2 px-5 py-2 border border-[#522DA6] rounded text-sm font-bold text-[#522DA6] hover:bg-[#522DA6]/5"
        >
          <ArrowLeft />
          Go back
        </button>
      </div>

      {/* Page Content */}
      <div className="flex-1 px-6 py-6 space-y-5">
        {/* Title row */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-xl font-bold text-zinc-900">{PARTICIPANT.name} schedule</h1>
            <button className="text-sm text-[#522DA6] hover:underline mt-0.5">View details</button>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowGenerateModal(true)}
              className="px-4 py-2 border border-[#522DA6] rounded-lg text-sm font-semibold text-[#522DA6] hover:bg-[#522DA6]/5"
            >
              Generate Schedule
            </button>
            <button className="flex items-center gap-1.5 px-4 py-2 border border-rose-300 rounded-lg text-sm font-semibold text-rose-600 hover:bg-rose-50">
              Cancel meetings
              <ChevronDown />
            </button>
            <button className="flex items-center gap-1.5 px-4 py-2 bg-[#522DA6] text-white rounded-lg text-sm font-semibold hover:bg-[#422389]">
              Create meeting
              <ChevronDown />
            </button>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="flex border border-zinc-200 rounded-lg divide-x divide-zinc-200">
          <div className="flex-1 px-6 py-4 flex items-center justify-between">
            <span className="text-sm text-zinc-500">Meetings</span>
            <span className="text-xl font-bold text-zinc-900">{SCHEDULE_DATA.length}</span>
          </div>
          <div className="flex-1 px-6 py-4 flex items-center justify-between">
            <span className="text-sm text-zinc-500">MustMeet meetings</span>
            <span className="text-xl font-bold text-zinc-900">{mustMeetCount}</span>
          </div>
          <div className="flex-1 px-6 py-4 flex items-center justify-between">
            <span className="text-sm text-zinc-500">Avg. Score</span>
            <span className="text-xl font-bold text-zinc-900">{avgScore}%</span>
          </div>
          <div className="flex-1 px-6 py-4 flex items-center justify-between">
            <span className="text-sm text-zinc-500">Meeting limit</span>
            <span className="text-xl font-bold text-zinc-900">5</span>
          </div>
        </div>

        {/* View Toggle */}
        <div className="flex items-center justify-end gap-2">
          <span className="text-sm text-zinc-400">Switch view</span>
          <button className="p-1.5 border border-zinc-200 rounded-lg bg-zinc-50 text-zinc-600">
            <GridIcon />
          </button>
          <button className="p-1.5 border border-zinc-200 rounded-lg text-zinc-400 hover:text-zinc-600 hover:bg-zinc-50">
            <ListIcon />
          </button>
        </div>

        {/* AG Grid Table */}
        <div className="ag-theme-quartz" style={{ height: 520 }}>
          <AgGridReact
            rowData={SCHEDULE_DATA}
            columnDefs={columnDefs}
            defaultColDef={{ sortable: true, resizable: true }}
            rowSelection="multiple"
            animateRows
            pagination
            paginationPageSize={10}
          />
        </div>
      </div>

      {/* Individual Generate Modal */}
      {showGenerateModal && (
        <IndividualGenerateModal
          participant={PARTICIPANT}
          onClose={() => setShowGenerateModal(false)}
        />
      )}
    </div>
  );
}
