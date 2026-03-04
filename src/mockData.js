// ── Scores (matches Scoring.png screenshot) ──
export const SCORES = [
  { profileOneId: '6536420', profileOneName: 'John Doe', profileTwoId: '6536420', profileTwoName: 'Ruth Jones', score: 97, reason: 'Buyer: MustMeet, Sponsor: MustMeet' },
  { profileOneId: '5553567', profileOneName: 'Jane Smith', profileTwoId: '5554960', profileTwoName: 'Omar Hassan', score: 98, reason: 'Buyer: meet, Sponsor: no preference, met previously' },
  { profileOneId: '5558760', profileOneName: 'Kira Johnson', profileTwoId: '5552348', profileTwoName: 'Ben Carter', score: 99, reason: 'Buyer: MustMeet, Supplier: meet, met previously' },
  { profileOneId: '5557682', profileOneName: 'Lily Chen', profileTwoId: '5554569', profileTwoName: 'Samir Patel', score: 97, reason: 'Buyer: no preference, Supplier: MustMeet, met previously' },
  { profileOneId: '5552349', profileOneName: 'Ingrid Van', profileTwoId: '5558765', profileTwoName: 'Rajesh Singh', score: 96, reason: 'Buyer: meet, Supplier: meet' },
  { profileOneId: '5552461', profileOneName: 'Priya Sharma', profileTwoId: '5557654', profileTwoName: 'David Lee', score: 99, reason: 'Buyer: MustMeet, Supplier: no preference' },
  { profileOneId: '5551237', profileOneName: 'Emily White', profileTwoId: '5554562', profileTwoName: 'Carlos Garcia', score: 94, reason: 'Buyer: meet, Supplier: meet' },
  { profileOneId: '5559876', profileOneName: 'Aisha Khan', profileTwoId: '5553457', profileTwoName: 'Kenji Tanaka', score: 95, reason: 'Buyer: no preference, Supplier: meet' },
  { profileOneId: '5558763', profileOneName: 'Olivia Green', profileTwoId: '5552346', profileTwoName: 'Noah Brown', score: 96, reason: 'Buyer: meet, Supplier: meet' },
  { profileOneId: '5554321', profileOneName: 'Marcus Bell', profileTwoId: '5558901', profileTwoName: 'Fatima Ali', score: 93, reason: 'Buyer: meet, Sponsor: meet' },
  { profileOneId: '5556789', profileOneName: 'Sofia Lopez', profileTwoId: '5551234', profileTwoName: 'Wei Zhang', score: 98, reason: 'Buyer: MustMeet, Supplier: MustMeet' },
  { profileOneId: '5553456', profileOneName: 'James Wilson', profileTwoId: '5557890', profileTwoName: 'Amara Osei', score: 91, reason: 'Buyer: meet, Supplier: no preference' },
];

export const SCORING_STATS = {
  avgScore: 97,
  generationTime: '31/01/2026, 16:57',
  modifiersUsed: 2,
};

// ── Schedule Generation History (matches Schedule generations.png) ──
export const GENERATION_HISTORY = [
  {
    id: '#01899',
    includedTypes: 'Boardrooms, MustMeet',
    scope: 'All Slots',
    itemsGenerated: 312,
    avgMatchScore: 94,
    generatedBy: 'Sarah Lee',
    timeCreated: '20 Oct 2025, 09:43',
  },
];

// ── Validation Results (mock data for automatic validation step) ──
export const VALIDATION_RESULTS = {
  errors: [
    {
      id: 'e1',
      type: 'error',
      message: 'There are groups in the system which are marked as being a venue & a buyer visit group. Groups cannot be marked as both.',
      fixLabel: 'Review groups',
      fixLink: '#',
    },
    {
      id: 'e2',
      type: 'error',
      message: 'Attendee "Marcus Bell" (Grip Id 5554321) has Exclusive Meetings enabled, but doesn\'t have an exhibitor_id. Please add an exhibitor_id for this user.',
      fixLabel: 'Edit attendee',
      fixLink: '#',
    },
  ],
  warnings: [
    {
      id: 'w1',
      type: 'warning',
      message: 'Attendees "Emily White", "James Wilson" have maximum meeting limits that are below their minimum meetings target. Please correct these limits and try again.',
      fixLabel: 'Review limits',
      fixLink: '#',
    },
    {
      id: 'w2',
      type: 'warning',
      message: '4 participants have no meeting preferences set. They will receive lower quality matches.',
      fixLabel: 'Review preferences',
      fixLink: '#',
    },
  ],
};

// ── Slot Priorities Data ──
export const SLOT_DAYS = [
  { label: 'Monday 20 Jan', short: 'Mon 20 Jan', date: '2028-01-20' },
  { label: 'Tuesday 21 Jan', short: 'Tue 21 Jan', date: '2028-01-21' },
  { label: 'Wednesday 22 Jan', short: 'Wed 22 Jan', date: '2028-01-22' },
];

export const SLOT_LOCATIONS = [
  'Booth A1', 'Booth A2', 'Booth B1',
  'Table 1', 'Table 2',
  'Meeting Room 1', 'Public Lounge',
];

// Generate time slots for all days/locations
export function generateSlots() {
  const slots = [];
  let id = 1;
  const times = [];
  for (let h = 9; h < 18; h++) {
    for (let m = 0; m < 60; m += 15) {
      const start = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
      const endM = m + 15;
      const endH = endM >= 60 ? h + 1 : h;
      const end = `${String(endH).padStart(2, '0')}:${String(endM % 60).padStart(2, '0')}`;
      times.push({ start, end });
    }
  }
  for (const day of SLOT_DAYS) {
    for (const loc of SLOT_LOCATIONS) {
      for (const t of times) {
        slots.push({
          id: id++,
          day: day.label,
          dayShort: day.short,
          startTime: t.start,
          endTime: t.end,
          location: loc,
          duration: 15,
        });
      }
    }
  }
  return slots;
}

// ── Generation Status Phases ──
export const STATUS_PHASES = [
  { id: 'validating', label: 'Validating event data...', duration: 1500 },
  { id: 'clearing', label: 'Clearing existing schedules...', duration: 1000 },
  { id: 'scoring', label: 'Calculating match scores...', duration: 2000 },
  { id: 'generating', label: 'Generating MustMeet meetings...', duration: 3000 },
  { id: 'optimizing', label: 'Optimizing schedule balance...', duration: 2000 },
  { id: 'complete', label: 'Generation complete!', duration: 0 },
];

// ── Config Defaults ──
export const DEFAULT_CONFIG = {
  clearSchedule: true,
  balancing: 'quality',
  sharersShareMeetings: false,
  includeSessionAttendance: true,
  includeMeetingAttendance: false,
  profiles: [],
  groups: [],
  locations: [],
  timeSlots: [],
};

export const PROFILE_OPTIONS = [
  'Buyers', 'Exhibitors', 'Sponsors', 'Speakers', 'VIP Guests',
];

export const GROUP_OPTIONS = [
  'Tech Companies', 'Finance Sector', 'Healthcare', 'Retail & Commerce', 'Media & Entertainment',
];

export const LOCATION_OPTIONS = [
  'Hall 1', 'Hall 2', 'Hall 3', 'Hall 4', 'VIP Lounge', 'Meeting Pods', 'Conference Room',
];

export const TIMESLOT_OPTIONS = [
  '09:00 - 10:00', '10:00 - 11:00', '11:00 - 12:00',
  '12:00 - 13:00', '13:00 - 14:00', '14:00 - 15:00',
  '15:00 - 16:00', '16:00 - 17:00', '17:00 - 18:00',
];
