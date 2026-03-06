import React, { Fragment, useMemo, useState, useEffect, useCallback } from "react";
import { AgGridReact } from "ag-grid-react";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import { SwapAttendeeModal, EditModal, CreateMeetingModal, MeetingTypeModal, MustMeetModal, Icons } from "../components/ScheduleModals";
import DashboardShell from "../components/ScheduleViewShell";
import { toast } from "sonner";

ModuleRegistry.registerModules([AllCommunityModule]);

// Grip Scheduling prototype (self-contained React component)
// Notes
// - UI prototype focused on schedule inspection, grouping, and navigation.
// - Intentionally no editing (drag, swap, cancel), only interaction scaffolding.

function cx(...xs) {
    return xs.filter(Boolean).join(" ");
}

function uniq(arr) {
    return Array.from(new Set(arr));
}

function fmtDayLabel(dateStr) {
    const d = new Date(dateStr + "T00:00:00");
    return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function fmtDayLong(dateStr) {
    const d = new Date(dateStr + "T00:00:00");
    return d.toLocaleDateString(undefined, {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
    });
}

// Helper to find first available 30-min slot for two participants
function findFirstAvailableSlot(allEvents, pId1, pId2) {
    // Event days - extended to allow spillover into additional days
    const days = [
        "2025-03-21", "2025-03-22", "2025-03-23",
        "2025-03-24", "2025-03-25", "2025-03-26",
        "2025-03-27", "2025-03-28", "2025-03-29", "2025-03-30"
    ];
    // Slots 08:00 to 18:00
    const timeSlots = [];
    for (let h = 8; h < 18; h++) {
        timeSlots.push({ start: `${String(h).padStart(2, '0')}:00`, end: `${String(h).padStart(2, '0')}:30` });
        timeSlots.push({ start: `${String(h).padStart(2, '0')}:30`, end: `${String(h + 1).padStart(2, '0')}:00` });
    }

    // Filter events ensuring we handle null participants (safe check)
    const existing = allEvents.filter(e =>
        (e.participantIds || []).includes(pId1) || (e.participantIds || []).includes(pId2)
    );

    for (const date of days) {
        for (const slot of timeSlots) {
            // Check conflicts
            // Conflict if: same date AND (start < slotEnd) AND (end > slotStart)
            const conflict = existing.some(e =>
                e.date === date &&
                e.start < slot.end &&
                e.end > slot.start
            );

            if (!conflict) {
                return { date, start: slot.start, end: slot.end };
            }
        }
    }
    return null;
}

function initials(name) {
    return (name || "")
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((s) => s[0].toUpperCase())
        .join("");
}

// Minimum meetings target for warnings
const MIN_MEETINGS_TARGET = 3;

// Warning Icon Component
function WarningIcon({ tooltip }) {
    return (
        <span title={tooltip} className="inline-flex items-center text-amber-500 ml-1">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
            </svg>
        </span>
    );
}

// Tour Steps Configuration
const TOUR_STEPS = [
    {
        id: "welcome",
        title: "Welcome to Schedule Inspector",
        content: "This tool helps you analyse and inspect schedules across participants, sharers, and companies. Let's take a quick tour!",
        action: "next"
    },
    {
        id: "stats",
        title: "Quick Stats Overview",
        content: "View key metrics at a glance: total entities, groups, meetings, average scores, and target coverage.",
        action: "next"
    },
    {
        id: "filters",
        title: "Filter & Search",
        content: "Use the search bar and filters to narrow down results by name, venue group, or MustMeet meetings only.",
        action: "next"
    },
    {
        id: "table",
        title: "Schedule List & Warnings",
        content: "Browse all schedules here. Look for warning icons (⚠️) indicating entities below their minimum meeting targets.",
        action: "next"
    },
    {
        id: "click-row",
        title: "View Details",
        content: "Click on any row to open a detailed calendar view. Try clicking on a Participant row now!",
        action: "click"
    },
    {
        id: "detail-view",
        title: "Detail Calendar View",
        content: "Here you can see the full schedule with gaps, MustMeet meetings (purple), group activities (green), and 1-to-1 meetings (rose).",
        action: "next"
    },
    {
        id: "meeting-info",
        title: "Meeting Details",
        content: "Click any calendar block to see scores, reasons, exclusivity status, and 'Met Before' indicators.",
        action: "next"
    },
    {
        id: "complete",
        title: "Tour Complete!",
        content: "You're all set! Explore the schedules and use the filters to analyze meeting quality and coverage.",
        action: "finish"
    }
];

// Tour Overlay Component
function TourOverlay({ step, onNext, onSkip, isDetailPage }) {
    const currentStep = TOUR_STEPS[step];
    if (!currentStep) return null;

    // Auto-advance from click-row when navigating to detail
    useEffect(() => {
        if (currentStep.id === "click-row" && isDetailPage) {
            onNext();
        }
    }, [currentStep.id, isDetailPage, onNext]);

    return (
        <>
            {/* Backdrop */}
            <div className="fixed inset-0 bg-black/40 z-40" onClick={onSkip} />

            {/* Tooltip */}
            <div className="z-50 max-w-sm rounded-2xl bg-white p-5 shadow-2xl ring-1 ring-zinc-200 fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="flex items-center justify-between gap-3 mb-3">
                    <span className="text-xs font-medium text-#522DA6 bg-zinc-50 px-2 py-1 rounded-full">
                        Step {step + 1} of {TOUR_STEPS.length}
                    </span>
                    <button onClick={onSkip} className="text-zinc-400 hover:text-zinc-600 text-sm">
                        Skip tour
                    </button>
                </div>
                <div className="text-base font-semibold text-zinc-900 mb-2">{currentStep.title}</div>
                <div className="text-sm text-zinc-600 mb-4">{currentStep.content}</div>
                <div className="flex justify-end gap-2">
                    {currentStep.action === "click" ? (
                        <span className="text-xs text-amber-600 font-medium">👆 Click a row to continue</span>
                    ) : currentStep.action === "finish" ? (
                        <button
                            onClick={onSkip}
                            className="rounded-xl bg-#522DA6 px-4 py-2 text-sm font-medium text-white hover:bg-#402285"
                        >
                            Finish Tour
                        </button>
                    ) : (
                        <button
                            onClick={onNext}
                            className="rounded-xl bg-#522DA6 px-4 py-2 text-sm font-medium text-white hover:bg-#402285"
                        >
                            Next →
                        </button>
                    )}
                </div>
            </div>
        </>
    );
}

function ScoreChip({ score }) {
    const tone =
        score >= 90
            ? "bg-emerald-50 text-emerald-800 ring-emerald-200"
            : score >= 75
                ? "bg-amber-50 text-amber-800 ring-amber-200"
                : "bg-rose-50 text-rose-800 ring-rose-200";
    return (
        <span className={cx("inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ring-1", tone)}>
            {score}
        </span>
    );
}

function Pill({ children }) {
    return (
        <span className="inline-flex items-center rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-700 ring-1 ring-zinc-200">
            {children}
        </span>
    );
}

function Badge({ tone = "muted", children }) {
    const cls =
        tone === "mm"
            ? "bg-zinc-50 text-[#522DA6] ring-[#522DA6]/20"
            : tone === "meet"
                ? "bg-rose-50 text-rose-800 ring-rose-200"
                : tone === "group"
                    ? "bg-emerald-50 text-emerald-800 ring-emerald-200"
                    : "bg-zinc-100 text-zinc-700 ring-zinc-200";
    return (
        <span className={cx("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ring-1", cls)}>
            {children}
        </span>
    );
}

function SectionTitle({ title, desc, right }) {
    return (
        <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
                <div className="text-xl font-semibold text-zinc-900">{title}</div>
                {desc ? <div className="mt-1 text-sm text-zinc-600">{desc}</div> : null}
            </div>
            {right ? <div className="flex items-center gap-2">{right}</div> : null}
        </div>
    );
}

// ----------------------
// Realistic sample data
// ----------------------

// Mock API Response Data (matching the real API structure)
// These would come from the API in production
const MOCK_API_HEADERS = {
    company: {
        companies: 5,
        meetings: 24,
        average_score: 91,

        meetings_target: 30
    },
    sharer: {
        sharer_ids: 5,
        meetings: 24,
        average_score: 91,

        meetings_target: 30
    },
    participant: {
        participants: 21,
        meetings: 24,
        average_score: 91,

        meetings_target: 30
    }
};

const COMPANIES = [
    { id: "c1", name: "Google", category: "Tech" },
    { id: "c2", name: "Stripe", category: "Fintech" },
    { id: "c3", name: "Spotify", category: "Media" },
    { id: "c4", name: "Shopify", category: "Commerce" },
    { id: "c5", name: "Salesforce", category: "SaaS" },
];

const PARTICIPANTS = [
    // Google (c1) - 4 participants
    { id: "p1", participantId: "8177810", name: "Aisha Bello", companyId: "c1", role: "Buyer", status: "Accepted", headline: "VP of Procurement", type: "In Person Buyer Representative", email: "aisha.bello@google.com", phone: "+1 415 555 0101" },
    { id: "p2", participantId: "8177811", name: "Noah Green", companyId: "c1", role: "Buyer", status: "Accepted", headline: "Strategic Sourcing Manager", type: "In Person Buyer Representative", email: "noah.green@google.com", phone: "+1 415 555 0102" },
    { id: "p11", participantId: "8177820", name: "Rachel Kim", companyId: "c1", role: "Buyer", status: "Pending", headline: "Procurement Analyst", type: "In Person Buyer Representative", email: "rachel.kim@google.com", phone: "" },
    { id: "p12", participantId: "8177821", name: "Marcus Chen", companyId: "c1", role: "Buyer", status: "Accepted", headline: "Category Manager", type: "In Person Buyer Representative", email: "marcus.chen@google.com", phone: "+1 415 555 0104" },
    // Stripe (c2) - 4 participants
    { id: "p3", participantId: "8177812", name: "Olivia Wilson", companyId: "c2", role: "Exhibitor", status: "Declined", headline: "Solutions Consultant - Team Lead", type: "In Person Exhibitor Representative", email: "olivia.wilson@stripe.com", phone: "+1 628 555 0201" },
    { id: "p4", participantId: "8177813", name: "Jack Jennings", companyId: "c2", role: "Exhibitor", status: "Accepted", headline: "Account Executive", type: "In Person Exhibitor Representative", email: "jack.jennings@stripe.com", phone: "+1 628 555 0202" },
    { id: "p13", participantId: "8177822", name: "Emma Rodriguez", companyId: "c2", role: "Exhibitor", status: "Accepted", headline: "Sales Engineer", type: "In Person Exhibitor Representative", email: "emma.rodriguez@stripe.com", phone: "" },
    { id: "p14", participantId: "8177823", name: "Liam Foster", companyId: "c2", role: "Exhibitor", status: "Pending", headline: "Partner Manager", type: "Virtual Exhibitor Representative", email: "liam.foster@stripe.com", phone: "+1 628 555 0204" },
    // Spotify (c3) - 4 participants + 1
    { id: "p5", participantId: "8177814", name: "Guy Owen", companyId: "c3", role: "Sponsor", status: "Accepted", headline: "Head of Partnerships", type: "In Person Sponsor Representative", email: "guy.owen@spotify.com", phone: "+46 70 555 0301" },
    { id: "p6", participantId: "8177815", name: "Sarah Thompson", companyId: "c3", role: "Sponsor", status: "Accepted", headline: "Marketing Director", type: "In Person Sponsor Representative", email: "sarah.thompson@spotify.com", phone: "+46 70 555 0302" },
    { id: "p15", participantId: "8177824", name: "James Taylor", companyId: "c3", role: "Sponsor", status: "Pending", headline: "Brand Partnerships Manager", type: "In Person Sponsor Representative", email: "james.taylor@spotify.com", phone: "" },
    { id: "p16", participantId: "8177825", name: "Mia Johnson", companyId: "c3", role: "Sponsor", status: "Accepted", headline: "Events Coordinator", type: "Virtual Sponsor Representative", email: "mia.johnson@spotify.com", phone: "+46 70 555 0304" },
    // Shopify (c4) - 4 participants
    { id: "p7", participantId: "8177816", name: "Michael Brown", companyId: "c4", role: "Exhibitor", status: "Accepted", headline: "Senior Solutions Architect", type: "In Person Exhibitor Representative", email: "michael.brown@shopify.com", phone: "+1 613 555 0401" },
    { id: "p8", participantId: "8177817", name: "Emily Clark", companyId: "c4", role: "Exhibitor", status: "Accepted", headline: "Product Specialist", type: "In Person Exhibitor Representative", email: "emily.clark@shopify.com", phone: "+1 613 555 0402" },
    { id: "p17", participantId: "8177826", name: "David Lee", companyId: "c4", role: "Exhibitor", status: "Declined", headline: "Technical Account Manager", type: "Virtual Exhibitor Representative", email: "david.lee@shopify.com", phone: "" },
    { id: "p18", participantId: "8177827", name: "Sophie Martinez", companyId: "c4", role: "Exhibitor", status: "Accepted", headline: "Commerce Consultant", type: "In Person Exhibitor Representative", email: "sophie.martinez@shopify.com", phone: "+1 613 555 0404" },
    // Salesforce (c5) - 4 participants
    { id: "p9", participantId: "8177818", name: "Priya Patel", companyId: "c5", role: "Buyer", status: "Accepted", headline: "IT Director", type: "In Person Buyer Representative", email: "priya.patel@salesforce.com", phone: "+1 415 555 0501" },
    { id: "p10", participantId: "8177819", name: "Daniel Kim", companyId: "c5", role: "Buyer", status: "Pending", headline: "CRM Administrator", type: "In Person Buyer Representative", email: "daniel.kim@salesforce.com", phone: "+1 415 555 0502" },
    { id: "p19", participantId: "8177828", name: "Chris Anderson", companyId: "c5", role: "Buyer", status: "Accepted", headline: "Digital Transformation Lead", type: "In Person Buyer Representative", email: "chris.anderson@salesforce.com", phone: "+1 415 555 0503" },
    { id: "p20", participantId: "8177829", name: "Lisa Wang", companyId: "c5", role: "Buyer", status: "Accepted", headline: "Operations Manager", type: "Virtual Buyer Representative", email: "lisa.wang@salesforce.com", phone: "" },
    { id: "p21", participantId: "8177830", name: "Robert Fox", companyId: "c3", role: "Sponsor", status: "Accepted", headline: "Business Development Rep", type: "In Person Sponsor Representative", email: "robert.fox@spotify.com", phone: "+46 70 555 0305" },
];

const SHARERS = [
    { id: "HD67830", companyId: "c2", memberIds: ["p3", "p4"] }, // 2 members
    { id: "HD67831", companyId: "c3", memberIds: ["p5", "p6", "p15", "p16", "p21"] }, // 5 members
    { id: "HD67832", companyId: "c1", memberIds: ["p1", "p2", "p11", "p12"] }, // 4 members
    { id: "HD67833", companyId: "c4", memberIds: ["p7", "p8", "p17"] }, // 3 members
    { id: "HD67834", companyId: "c5", memberIds: ["p9", "p10", "p19", "p20"] }, // 4 members
];

const EVENTS = [
    // Day 1: March 21
    { id: "m1", kind: "meeting", meetingType: "mustMeet", date: "2025-03-21", start: "09:00", end: "09:30", venue: "Hall 1", venueGroup: "Main Halls", companyIds: ["c1", "c2"], sharerId: "HD67832", participantIds: ["p1", "p3"], score: 97, reason: "Strong match across priorities.", exclusive: false, metBefore: false },
    { id: "m2", kind: "meeting", meetingType: "oneToOne", date: "2025-03-21", start: "09:30", end: "10:00", venue: "Hall 2", venueGroup: "Main Halls", companyIds: ["c1", "c2"], sharerId: "HD67832", participantIds: ["p1", "p4"], score: 86, reason: "Good overlap.", exclusive: false, metBefore: true },
    { id: "m3", kind: "meeting", meetingType: "mustMeet", date: "2025-03-21", start: "10:30", end: "11:00", venue: "Meeting Pods", venueGroup: "Pods", companyIds: ["c1", "c3"], sharerId: "HD67832", participantIds: ["p2", "p6"], score: 93, reason: "MustMeet allocation.", exclusive: true, metBefore: false },
    { id: "m11", kind: "meeting", meetingType: "oneToOne", date: "2025-03-21", start: "11:00", end: "11:30", venue: "VIP Lounge", venueGroup: "VIP", companyIds: ["c1", "c4"], sharerId: "HD67832", participantIds: ["p11", "p7"], score: 88, reason: "Good fit.", exclusive: false, metBefore: false },
    { id: "m12", kind: "meeting", meetingType: "mustMeet", date: "2025-03-21", start: "13:00", end: "13:30", venue: "Hall 1", venueGroup: "Main Halls", companyIds: ["c1", "c5"], sharerId: "HD67832", participantIds: ["p12", "p9"], score: 94, reason: "High priority.", exclusive: false, metBefore: false },
    { id: "m13", kind: "meeting", meetingType: "oneToOne", date: "2025-03-21", start: "14:00", end: "14:30", venue: "Hall 3", venueGroup: "Main Halls", companyIds: ["c2", "c3"], sharerId: "HD67830", participantIds: ["p13", "p15"], score: 85, reason: "Decent match.", exclusive: false, metBefore: true },
    { id: "m14", kind: "meeting", meetingType: "mustMeet", date: "2025-03-21", start: "15:00", end: "15:30", venue: "Conference Room", venueGroup: "Conference", companyIds: ["c2", "c4"], sharerId: "HD67830", participantIds: ["p14", "p17"], score: 91, reason: "Strong alignment.", exclusive: false, metBefore: false },

    // Day 2: March 22
    { id: "m4", kind: "meeting", meetingType: "mustMeet", date: "2025-03-22", start: "08:30", end: "09:00", venue: "Hall 4", venueGroup: "Main Halls", companyIds: ["c5", "c2"], sharerId: "HD67831", participantIds: ["p10", "p3"], score: 92, reason: "Buyer goals align.", exclusive: false, metBefore: false },
    { id: "m5", kind: "meeting", meetingType: "oneToOne", date: "2025-03-22", start: "09:00", end: "09:30", venue: "VIP Lounge", venueGroup: "VIP", companyIds: ["c5", "c2"], sharerId: "HD67831", participantIds: ["p9", "p4"], score: 89, reason: "Good fit.", exclusive: false, metBefore: true },
    { id: "m15", kind: "meeting", meetingType: "mustMeet", date: "2025-03-22", start: "10:00", end: "10:30", venue: "Hall 1", venueGroup: "Main Halls", companyIds: ["c3", "c4"], sharerId: "HD67831", participantIds: ["p5", "p8"], score: 95, reason: "Excellent match.", exclusive: false, metBefore: false },
    { id: "m16", kind: "meeting", meetingType: "oneToOne", date: "2025-03-22", start: "11:00", end: "11:30", venue: "Meeting Pods", venueGroup: "Pods", companyIds: ["c3", "c5"], sharerId: "HD67831", participantIds: ["p16", "p19"], score: 87, reason: "Good alignment.", exclusive: false, metBefore: false },
    { id: "m17", kind: "meeting", meetingType: "mustMeet", date: "2025-03-22", start: "13:00", end: "13:30", venue: "Hall 2", venueGroup: "Main Halls", companyIds: ["c1", "c2"], sharerId: "HD67832", participantIds: ["p1", "p13"], score: 93, reason: "Strong priority.", exclusive: true, metBefore: false },
    { id: "m18", kind: "meeting", meetingType: "oneToOne", date: "2025-03-22", start: "14:00", end: "14:30", venue: "Conference Room", venueGroup: "Conference", companyIds: ["c4", "c5"], sharerId: "HD67833", participantIds: ["p18", "p20"], score: 84, reason: "Decent fit.", exclusive: false, metBefore: true },
    { id: "m19", kind: "meeting", meetingType: "mustMeet", date: "2025-03-22", start: "15:00", end: "15:30", venue: "Hall 3", venueGroup: "Main Halls", companyIds: ["c1", "c3"], sharerId: "HD67832", participantIds: ["p11", "p6"], score: 90, reason: "Good match.", exclusive: false, metBefore: false },

    // Day 3: March 23
    { id: "m6", kind: "meeting", meetingType: "oneToOne", date: "2025-03-23", start: "09:00", end: "09:30", venue: "Hall 1", venueGroup: "Main Halls", companyIds: ["c1", "c3"], sharerId: "HD67832", participantIds: ["p2", "p5"], score: 90, reason: "Good alignment.", exclusive: false, metBefore: false },
    { id: "m7", kind: "meeting", meetingType: "mustMeet", date: "2025-03-23", start: "09:00", end: "09:30", venue: "Hall 2", venueGroup: "Main Halls", companyIds: ["c1", "c3"], sharerId: "HD67832", participantIds: ["p1", "p6"], score: 95, reason: "MustMeet high priority.", exclusive: false, metBefore: false },
    { id: "m8", kind: "meeting", meetingType: "oneToOne", date: "2025-03-23", start: "09:00", end: "09:30", venue: "Meeting Pods", venueGroup: "Pods", companyIds: ["c4"], sharerId: "HD67833", participantIds: ["p7", "p8"], score: 87, reason: "Decent fit.", exclusive: false, metBefore: false },
    { id: "m9", kind: "meeting", meetingType: "oneToOne", date: "2025-03-23", start: "09:30", end: "10:00", venue: "Hall 4", venueGroup: "Main Halls", companyIds: ["c5", "c2"], sharerId: "HD67831", participantIds: ["p9", "p3"], score: 91, reason: "Good alignment.", exclusive: false, metBefore: false },
    { id: "m10", kind: "meeting", meetingType: "mustMeet", date: "2025-03-23", start: "09:30", end: "10:00", venue: "Hall 3", venueGroup: "Main Halls", companyIds: ["c5", "c2"], sharerId: "HD67831", participantIds: ["p10", "p4"], score: 96, reason: "MustMeet best match.", exclusive: true, metBefore: false },
    { id: "m20", kind: "meeting", meetingType: "mustMeet", date: "2025-03-23", start: "10:30", end: "11:00", venue: "VIP Lounge", venueGroup: "VIP", companyIds: ["c2", "c4"], sharerId: "HD67830", participantIds: ["p3", "p17"], score: 94, reason: "Excellent fit.", exclusive: false, metBefore: false },
    { id: "m21", kind: "meeting", meetingType: "oneToOne", date: "2025-03-23", start: "11:00", end: "11:30", venue: "Hall 1", venueGroup: "Main Halls", companyIds: ["c3", "c5"], sharerId: "HD67831", participantIds: ["p15", "p20"], score: 88, reason: "Good match.", exclusive: false, metBefore: true },
    { id: "m22", kind: "meeting", meetingType: "mustMeet", date: "2025-03-23", start: "13:00", end: "13:30", venue: "Conference Room", venueGroup: "Conference", companyIds: ["c1", "c4"], sharerId: "HD67832", participantIds: ["p12", "p18"], score: 92, reason: "Strong alignment.", exclusive: false, metBefore: false },
    { id: "m23", kind: "meeting", meetingType: "oneToOne", date: "2025-03-23", start: "14:00", end: "14:30", venue: "Hall 2", venueGroup: "Main Halls", companyIds: ["c2", "c5"], sharerId: "HD67830", participantIds: ["p14", "p19"], score: 86, cpfCommon: 8, reason: "Decent fit.", exclusive: false, metBefore: false },
    { id: "m24", kind: "meeting", meetingType: "mustMeet", date: "2025-03-23", start: "15:00", end: "15:30", venue: "Meeting Pods", venueGroup: "Pods", companyIds: ["c3", "c4"], sharerId: "HD67831", participantIds: ["p16", "p7"], score: 89, cpfCommon: 9, reason: "Good priority.", exclusive: false, metBefore: false },
];

// ----------------------
// Indexing and helpers
// ----------------------

function buildIndexes() {
    const cById = Object.fromEntries(COMPANIES.map((c) => [c.id, c]));
    const pById = Object.fromEntries(PARTICIPANTS.map((p) => [p.id, p]));
    const sharerById = Object.fromEntries(SHARERS.map((s) => [s.id, s]));
    return { cById, pById, sharerById };
}

function eventsFor(events, entityType, entityId) {
    if (entityType === "participant") return events.filter((e) => (e.participantIds || []).includes(entityId));
    if (entityType === "company") return events.filter((e) => (e.companyIds || []).includes(entityId));
    if (entityType === "sharer") return events.filter((e) => e.sharerId === entityId);
    return [];
}

function computeGaps(events) {
    const byDay = {};
    events.forEach((e) => {
        byDay[e.date] = byDay[e.date] || [];
        byDay[e.date].push(e);
    });
    let gaps = 0;
    Object.values(byDay).forEach((list) => {
        const sorted = list.slice().sort((a, b) => a.start.localeCompare(b.start));
        for (let i = 0; i < sorted.length - 1; i++) {
            if (sorted[i].end !== sorted[i + 1].start) gaps += 1;
        }
    });
    return gaps;
}

function aggregateForCompany(events, companyId) {
    const evs = eventsFor(events, "company", companyId);
    const meetings = evs.filter((e) => e.kind === "meeting");
    const venues = uniq(meetings.map(m => m.venue).filter(Boolean));
    const avgScore = meetings.length
        ? Math.round(meetings.reduce((a, m) => a + (m.score || 0), 0) / meetings.length)
        : null;
    const coverage = meetings.length ? Math.min(100, 75 + meetings.length * 3) : 0;
    return {
        companyId, meetings, venues,
        mustMeetCount: meetings.filter((m) => m.meetingType === "mustMeet").length,
        oneToOneCount: meetings.filter((m) => m.meetingType === "oneToOne").length,
        avgScore, gaps: computeGaps(evs), coverage,
        belowTarget: meetings.length < MIN_MEETINGS_TARGET,
    };
}

function aggregateForSharer(events, sharerId) {
    const { pById, cById, sharerById } = buildIndexes();
    const s = sharerById[sharerId];
    const evs = eventsFor(events, "sharer", sharerId);
    const meetings = evs.filter((e) => e.kind === "meeting");
    const venues = uniq(meetings.map(m => m.venue).filter(Boolean));
    const memberNames = (s?.memberIds || []).map((id) => pById[id]?.name).filter(Boolean);
    const companyName = s ? cById[s.companyId]?.name : "";

    // Get roles from members to determine if Buyer or Supplier
    const memberRoles = (s?.memberIds || []).map((id) => pById[id]?.role).filter(Boolean);
    const role = memberRoles.includes("Buyer") ? "Buyer" : memberRoles.includes("Exhibitor") ? "Supplier" : memberRoles.includes("Sponsor") ? "Sponsor" : "Supplier";

    const avgScore = meetings.length
        ? Math.round(meetings.reduce((a, m) => a + (m.score || 0), 0) / meetings.length)
        : null;
    return {
        sharerId, companyName, memberNames, venues, role,
        members: memberNames.length,
        mustMeetCount: meetings.filter((m) => m.meetingType === "mustMeet").length,
        oneToOneCount: meetings.filter((m) => m.meetingType === "oneToOne").length,
        metBeforeCount: meetings.filter((m) => m.metBefore).length,
        avgScore,
        belowTarget: meetings.length < MIN_MEETINGS_TARGET,
    };
}

function aggregateForParticipant(events, participantId) {
    const { pById, cById } = buildIndexes();
    const evs = eventsFor(events, "participant", participantId);
    const meetings = evs.filter((e) => e.kind === "meeting");
    const venues = uniq(meetings.map(m => m.venue).filter(Boolean));
    const avgScore = meetings.length
        ? Math.round(meetings.reduce((a, m) => a + (m.score || 0), 0) / meetings.length)
        : null;
    const coverage = meetings.length ? Math.min(100, 70 + meetings.length * 4) : 0;
    const p = pById[participantId];
    return {
        participantId,
        name: p?.name || "Participant",
        companyName: p ? cById[p.companyId]?.name : "",
        role: p?.role || "",
        meetings, venues,
        mustMeetCount: meetings.filter((m) => m.meetingType === "mustMeet").length,
        oneToOneCount: meetings.filter((m) => m.meetingType === "oneToOne").length,
        avgScore, gaps: computeGaps(evs), coverage,
        belowTarget: meetings.length < MIN_MEETINGS_TARGET,
    };
}

function Segmented({ value, onChange, options }) {
    return (
        <div className="inline-flex rounded-xl bg-zinc-100 p-1">
            {options.map((o) => (
                <button
                    key={o.value}
                    type="button"
                    onClick={() => onChange(o.value)}
                    className={cx(
                        "rounded-lg px-3 py-1.5 text-sm font-medium transition",
                        o.value === value ? "bg-white shadow-sm ring-1 ring-zinc-200" : "text-zinc-600 hover:text-zinc-900"
                    )}
                >
                    {o.label}
                </button>
            ))}
        </div>
    );
}

function Stat({ label, value, sub, className }) {
    return (
        <div className={cx("min-w-[160px] rounded-lg border border-zinc-200 bg-white p-4", className)}>
            <div className="text-xs font-medium text-zinc-500">{label}</div>
            <div className="mt-1 text-2xl font-semibold text-zinc-900">{value}</div>
            {sub ? <div className="mt-1 text-xs text-zinc-500">{sub}</div> : null}
        </div>
    );
}

function CalendarBlock({ e, onSelect }) {
    const tone = e.kind === "activityGroup" ? "group" : e.meetingType === "mustMeet" ? "mm" : "meet";
    const border =
        tone === "group"
            ? "border-emerald-300 bg-emerald-50"
            : tone === "mm"
                ? "border-[#522DA6]/40 bg-zinc-50"
                : "border-rose-300 bg-rose-50";

    return (
        <button
            type="button"
            onClick={() => onSelect(e.id)}
            className={cx("w-full rounded-xl border p-2 text-left hover:brightness-[0.99]", border)}
        >
            <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                    <div className="truncate text-sm font-semibold text-zinc-900">
                        {e.kind === "activityGroup" ? e.groupName : "Meeting"}
                    </div>
                    <div className="mt-0.5 truncate text-xs text-zinc-700">
                        {e.kind === "activityGroup"
                            ? `Group · ${e.activityType}`
                            : e.meetingType === "mustMeet"
                                ? "MustMeet meeting"
                                : "1 to 1 meeting"}
                    </div>
                    <div className="mt-0.5 truncate text-xs text-zinc-600">
                        {e.start} to {e.end} · {e.venue}
                    </div>
                </div>
            </div>
            <div className="mt-2 flex items-center justify-between">
                {e.kind === "meeting" ? (
                    <div className="flex items-center gap-2">
                        <ScoreChip score={e.score} />
                        {e.exclusive ? <Badge>🔒 Exclusive</Badge> : null}
                        {e.metBefore ? <Badge>🤝 Met before</Badge> : null}
                    </div>
                ) : (
                    <div className="flex items-center gap-2">
                        <Badge tone="group">Group</Badge>
                        <span className="text-xs text-zinc-600">
                            {(e.companyIds || []).length > 1 ? "Multi-company" : "Single-company"}
                        </span>
                    </div>
                )}
                {e.kind === "meeting" && e.meetingType === "mustMeet" ? <Badge tone="mm">MustMeet</Badge> : null}
            </div>
        </button>
    );
}

function StatusBadge({ status }) {
    const tones = {
        Accepted: "bg-emerald-100 text-emerald-700",
        Pending: "bg-amber-100 text-amber-700",
        Declined: "bg-rose-100 text-rose-700"
    };
    return (
        <span className={cx("rounded-md px-2 py-0.5 text-[10px] font-medium", tones[status] || tones.Pending)}>
            {status}
        </span>
    );
}



// Mock CPF data for demonstration


function MatchScoreDropdown({ score, reason, participants }) {
    const [isExpanded, setIsExpanded] = useState(false);



    return (
        <div className="mt-2 rounded-xl bg-zinc-50 overflow-hidden">
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full p-4 flex items-center justify-between hover:bg-zinc-100 transition-colors"
            >
                <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-zinc-900">Match Score</span>
                    <span className={`text-xs transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}>
                        ▼
                    </span>
                </div>
                <ScoreChip score={score} />
            </button>

            {/* Collapsed summary */}
            {!isExpanded && (
                <div className="px-4 pb-4 -mt-2">
                    <div className="text-xs text-zinc-600 leading-relaxed">
                        {reason}
                    </div>
                </div>
            )}

            {/* Expanded CPF details */}
            {isExpanded && (
                <div className="px-4 pb-4 border-t border-zinc-200/50 animate-in slide-in-from-top-2 duration-200">
                    <div className="mb-3">
                        <div className="text-xs text-zinc-600 leading-relaxed mb-3">
                            {reason}
                        </div>
                    </div>
                </div>
            )}

            {participants && participants.length > 1 && (
                <div className="pt-2 border-t border-zinc-200/50">
                    <div className="text-xs text-zinc-500">
                        <span className="font-medium">{participants.map(p => p.name.split(' ')[0]).join(' & ')}</span>
                        {' '}share these profile attributes
                    </div>
                </div>
            )}
        </div>
    )
}


function DetailSidePanel({ entityType, entityId, selectedEventId, onAction, events, noTopRounded }) {
    const { pById, cById } = buildIndexes();
    const evs = eventsFor(events, entityType, entityId);
    const e = evs.find((x) => x.id === selectedEventId) || null;

    if (!e) {
        return (
            <div className={cx(
                "bg-white p-6 shadow-sm border border-zinc-200 h-full flex items-center justify-center text-center",
                noTopRounded ? "rounded-b-2xl rounded-t-none border-t-0" : "rounded-2xl"
            )}>
                <div>
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100 text-zinc-400">
                        <Icons.Calendar />
                    </div>
                    <div className="mt-3 text-sm font-medium text-zinc-900">No meeting selected</div>
                    <div className="mt-1 text-sm text-zinc-500">Select a meeting from the calendar to view details.</div>
                </div>
            </div>
        );
    }

    const people = (e.participantIds || []).map((id) => pById[id]).filter(Boolean);

    // Auto-generate status for demo
    const statusMap = {
        p1: 'Accepted', p2: 'Pending', p3: 'Declined', p4: 'Accepted',
        p5: 'Pending', p6: 'Accepted', p7: 'Accepted', p8: 'Pending'
    };

    return (
        <div className={cx(
            "flex flex-col gap-4 bg-white p-5 shadow-sm border border-zinc-200 h-full",
            noTopRounded ? "rounded-b-2xl rounded-t-none border-t-0" : "rounded-2xl"
        )}>
            {/* Header */}
            <div className="flex items-start justify-between gap-3">
                <div>
                    <h3 className="text-lg font-semibold text-zinc-900">
                        {e.kind === "activityGroup" ? e.groupName : (e.meetingType === "mustMeet" ? "MustMeet Meeting" : "1:1 Meeting")}
                    </h3>
                    <div className="mt-1 flex flex-col gap-1 text-sm text-zinc-500">
                        <div className="flex items-center gap-3">
                            <span className="flex items-center gap-1.5"><Icons.Clock /> {e.start} - {e.end}</span>
                            <span>•</span>
                            <span className="flex items-center gap-1.5"><Icons.MapPin /> {e.venue}</span>
                        </div>
                    </div>
                </div>
                {e.meetingType === "mustMeet" && <Badge tone="mm">MustMeet</Badge>}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 border-b border-zinc-100 pb-4">
                <button onClick={() => onAction && onAction('edit', e)} className="flex-1 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 transition flex items-center justify-center gap-2">
                    <Icons.Edit /> Edit
                </button>
                {/* Replace button - only for MustMeet meetings */}
                {(e.exclusive || e.meetingType === "mustMeet") && (
                    <button onClick={() => onAction && onAction('swap', e)} className="flex-1 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 transition flex items-center justify-center gap-2">
                        <Icons.Swap /> Replace
                    </button>
                )}
                <button onClick={() => onAction && onAction('delete', e)} className="flex-none rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-100 transition p-2">
                    <Icons.Trash />
                </button>
            </div>

            {/* Attendees */}
            <div>
                <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">Attendees</div>
                <div className="space-y-3">
                    {people.map(p => (
                        <div key={p.id} className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#522DA6]/10 text-xs font-bold text-#402285">
                                    {p.name.charAt(0)}
                                </div>
                                <div>
                                    <div className="text-sm font-medium text-zinc-900">{p.name}</div>
                                    <div className="text-xs text-zinc-500">{cById[p.companyId]?.name}</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <StatusBadge status={statusMap[p.id] || 'Pending'} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Logic/Score - Expandable (MustMeet only) */}
            {e.kind === "meeting" && e.meetingType === "mustMeet" && (
                <MatchScoreDropdown
                    score={e.score}
                    reason={e.reason}

                    participants={people}
                />
            )}
        </div>
    );
}

/* Time Stream Calendar Implementation */

const TIME_START = 8; // 08:00
const TIME_END = 18; // 18:00
const HOUR_HEIGHT = 60; // px
const GAP_MIN_MINUTES = 15;

function timeToMin(timeStr) {
    const [h, m] = timeStr.split(":").map(Number);
    return h * 60 + m;
}

function minToTime(min) {
    const h = Math.floor(min / 60);
    const m = min % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

function getLayout(events) {
    // Sort by start time
    const sorted = [...events].sort((a, b) => timeToMin(a.start) - timeToMin(b.start));

    // Calculate gaps
    const blocks = [];
    let currentMin = TIME_START * 60;
    const endMin = TIME_END * 60;

    // We process events to find gaps, but rendering overlaps is complex.
    // Simplifying: Render events as absolute blocks. Gaps as background clickable areas?
    // Better: Explicit gap blocks between events.
    // Caveat: Overlapping events make gaps ambiguous.
    // For this prototype, we assume we want to see Gaps where *nothing* is scheduled (User Availability).
    // So we merge overlapping events for gap calculation.

    // 1. Merge intervals for gap detection
    const intervals = [];
    sorted.forEach(e => {
        const start = timeToMin(e.start);
        const end = timeToMin(e.end);
        if (intervals.length && start < intervals[intervals.length - 1].end) {
            intervals[intervals.length - 1].end = Math.max(intervals[intervals.length - 1].end, end);
        } else {
            intervals.push({ start, end });
        }
    });

    // 2. Generate Gap blocks
    for (const inv of intervals) {
        if (inv.start > currentMin) {
            blocks.push({ type: 'gap', start: currentMin, end: inv.start });
        }
        currentMin = Math.max(currentMin, inv.end);
    }
    if (currentMin < endMin) {
        blocks.push({ type: 'gap', start: currentMin, end: endMin });
    }

    return { blocks };
}

// List View for meetings
function MeetingListView({ events, pById, onSelectEvent, selectedEventId, selectedIds = [], onToggleSelect, onSelectAll }) {
    const meetings = events.filter(e => e.kind === "meeting");
    const sorted = [...meetings].sort((a, b) => {
        if (a.date !== b.date) return a.date.localeCompare(b.date);
        return a.start.localeCompare(b.start);
    });

    const allSelected = sorted.length > 0 && sorted.every(e => selectedIds.includes(e.id));
    const indeterminate = sorted.some(e => selectedIds.includes(e.id)) && !allSelected;

    if (sorted.length === 0) {
        return (
            <div className="rounded-2xl border border-zinc-200 bg-white p-8 text-center text-zinc-500">
                No meetings found for the selected filters.
            </div>
        );
    }

    return (
        <div className="rounded-t-2xl border border-zinc-200 bg-white overflow-hidden shadow-sm">
            <table className="w-full text-left text-sm">
                <thead className="bg-zinc-50 text-xs font-semibold text-zinc-500 uppercase border-b border-zinc-100">
                    <tr>
                        <th className="px-4 py-3 w-10">
                            <input
                                type="checkbox"
                                className="rounded border-zinc-300 text-#522DA6 focus:ring-zinc-500 cursor-pointer"
                                checked={allSelected}
                                ref={input => { if (input) input.indeterminate = indeterminate; }}
                                onChange={(e) => onSelectAll(sorted.map(s => s.id), e.target.checked)}
                            />
                        </th>
                        <th className="px-4 py-3">Date</th>
                        <th className="px-4 py-3">Time</th>
                        <th className="px-4 py-3">Type</th>
                        <th className="px-4 py-3">Attendees</th>
                        <th className="px-4 py-3">Location</th>
                        <th className="px-4 py-3 text-center">Score</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                    {sorted.map(e => {
                        const attendeeNames = (e.participantIds || [])
                            .map(pid => pById[pid]?.name)
                            .filter(Boolean)
                            .join(", ");
                        const isSelected = selectedEventId === e.id;
                        const isChecked = selectedIds.includes(e.id);
                        const isMustMeet = e.meetingType === "mustMeet";

                        return (
                            <tr
                                key={e.id}
                                onClick={() => onSelectEvent(e.id)}
                                className={cx(
                                    "cursor-pointer transition-colors",
                                    isSelected ? "bg-zinc-50" : "hover:bg-zinc-50"
                                )}
                            >
                                <td className="px-4 py-3" onClick={(ev) => ev.stopPropagation()}>
                                    <input
                                        type="checkbox"
                                        className="rounded border-zinc-300 text-#522DA6 focus:ring-zinc-500 cursor-pointer"
                                        checked={isChecked}
                                        onChange={() => onToggleSelect(e.id)}
                                    />
                                </td>
                                <td className="px-4 py-3 font-medium text-zinc-900">{fmtDayLabel(e.date)}</td>
                                <td className="px-4 py-3 text-zinc-600">{e.start} - {e.end}</td>
                                <td className="px-4 py-3">
                                    <span className={cx(
                                        "inline-flex px-2 py-0.5 rounded-full text-xs font-medium",
                                        isMustMeet ? "bg-[#522DA6]/10 text-[#522DA6]" : "bg-zinc-100 text-zinc-700"
                                    )}>
                                        {isMustMeet ? "MustMeet" : "1:1"}
                                    </span>
                                </td>
                                <td className="px-4 py-3 text-zinc-700 max-w-[200px] truncate">{attendeeNames || "-"}</td>
                                <td className="px-4 py-3 text-zinc-600">{e.venue || "-"}</td>
                                <td className="px-4 py-3 text-center">
                                    {e.score ? <ScoreChip score={e.score} /> : "-"}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}


function TimeStreamCalendar({ events, days, selectedEventId, onSelectEvent, onCreateEvent, noTopRounded }) {
    const byDay = {};
    days.forEach(d => byDay[d] = events.filter(e => e.date === d));

    const calendarHeight = (TIME_END - TIME_START) * HOUR_HEIGHT;

    return (
        <div className={cx(
            "border border-zinc-200 bg-white overflow-hidden shadow-sm",
            noTopRounded ? "rounded-br-2xl rounded-bl-none rounded-t-none border-t-0" : "rounded-2xl"
        )}>
            {/* Header row with day columns */}
            <div className="grid border-b border-zinc-200 bg-zinc-50" style={{ gridTemplateColumns: '60px repeat(3, 1fr)' }}>
                <div className="border-r border-zinc-200 px-2 py-3 text-xs font-medium text-zinc-400 uppercase">Time</div>
                {days.map(d => (
                    <div key={d} className="px-4 py-3 text-sm font-semibold text-zinc-700 border-r border-zinc-200 last:border-r-0 text-center">
                        {fmtDayLong(d)}
                    </div>
                ))}
            </div>

            {/* Calendar body */}
            <div className="relative overflow-y-auto" style={{ height: calendarHeight + 40 }}>
                <div className="grid" style={{ gridTemplateColumns: '60px repeat(3, 1fr)', height: calendarHeight }}>
                    {/* Time labels column */}
                    <div className="relative border-r border-zinc-200">
                        {Array.from({ length: TIME_END - TIME_START }).map((_, i) => (
                            <Fragment key={i}>
                                <div
                                    className="absolute w-full text-[10px] text-zinc-400 text-right pr-2 -translate-y-1/2"
                                    style={{ top: i * HOUR_HEIGHT }}
                                >
                                    {String(TIME_START + i).padStart(2, '0')}:00
                                </div>
                                <div
                                    className="absolute w-full text-[10px] text-zinc-300 text-right pr-2 -translate-y-1/2"
                                    style={{ top: (i + 0.5) * HOUR_HEIGHT }}
                                >
                                    {String(TIME_START + i).padStart(2, '0')}:30
                                </div>
                            </Fragment>
                        ))}
                        <div
                            className="absolute w-full text-[10px] text-zinc-400 text-right pr-2 -translate-y-1/2"
                            style={{ top: (TIME_END - TIME_START) * HOUR_HEIGHT }}
                        >
                            {String(TIME_END).padStart(2, '0')}:00
                        </div>
                    </div>

                    {/* Day columns */}
                    {days.map((d, dayIndex) => {
                        const dayEvents = byDay[d];
                        const { blocks: gaps } = getLayout(dayEvents);
                        const isLast = dayIndex === days.length - 1;

                        return (
                            <div
                                key={d}
                                className={`relative ${!isLast ? 'border-r border-zinc-200' : ''}`}
                            >
                                {/* Horizontal grid lines - 30 min intervals */}
                                {Array.from({ length: (TIME_END - TIME_START) * 2 }).map((_, i) => (
                                    <div
                                        key={i}
                                        className={`absolute w-full border-t ${i % 2 === 0 ? 'border-zinc-100' : 'border-zinc-50 border-dashed'}`}
                                        style={{ top: i * (HOUR_HEIGHT / 2) }}
                                    />
                                ))}

                                {/* 30-min Interaction Slots */}
                                {Array.from({ length: (TIME_END - TIME_START) * 2 }).map((_, i) => {
                                    const slotStart = TIME_START * 60 + (i * 30);
                                    // Check if this slot overlaps with any event (simple check)
                                    const hasEvent = dayEvents.some(e => {
                                        const eStart = timeToMin(e.start);
                                        const eEnd = timeToMin(e.end);
                                        return slotStart >= eStart && slotStart < eEnd;
                                    });

                                    if (hasEvent) return null;

                                    return (
                                        <button
                                            key={`slot-${i}`}
                                            onClick={() => onCreateEvent(d, minToTime(slotStart))}
                                            className="absolute inset-x-1 z-0 flex items-center justify-center rounded border border-transparent hover:border-dashed hover:border-[#522DA6]/40 hover:bg-zinc-50 text-xs font-medium text-#522DA6 opacity-0 hover:opacity-100 transition-all"
                                            style={{ top: i * (HOUR_HEIGHT / 2), height: HOUR_HEIGHT / 2 }}
                                        >
                                            +
                                        </button>
                                    );
                                })}

                                {/* Events */}
                                {dayEvents.map(e => {
                                    const startMin = timeToMin(e.start);
                                    const endMin = timeToMin(e.end);
                                    const top = ((startMin / 60) - TIME_START) * HOUR_HEIGHT;
                                    const height = ((endMin - startMin) / 60) * HOUR_HEIGHT;
                                    const isMustMeet = e.meetingType === "mustMeet";
                                    const isSelected = e.id === selectedEventId;

                                    const isCompact = height < 45;

                                    // Get participant data for avatars
                                    const { pById } = buildIndexes();
                                    const participants = (e.participantIds || []).map(id => pById[id]).filter(Boolean);
                                    const maxAvatars = 2;
                                    const visibleParticipants = participants.slice(0, maxAvatars);
                                    const overflow = participants.length - maxAvatars;

                                    return (
                                        <button
                                            key={e.id}
                                            onClick={(ev) => { ev.stopPropagation(); onSelectEvent(e.id); }}
                                            className={cx(
                                                "absolute inset-x-1 z-10 rounded-lg border px-2 py-1 text-left transition-shadow shadow-sm hover:shadow-md hover:z-20 overflow-hidden",
                                                isMustMeet ? "bg-amber-50 border-amber-200 text-amber-900" : "bg-white border-zinc-200 text-zinc-900",
                                                isSelected && "ring-2 ring-[#522DA6] ring-offset-1",
                                                isCompact ? "flex items-center justify-between gap-1" : "flex flex-col justify-between"
                                            )}
                                            style={{ top: top + 1, height: height - 2 }}
                                        >
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-1">
                                                    <div className="font-semibold truncate leading-tight text-[10px]">
                                                        {isMustMeet ? "Must meet" : "Meeting"}
                                                    </div>
                                                </div>
                                                {!isCompact && (
                                                    <div className="font-medium truncate leading-tight mt-0.5 text-[10px] opacity-80">
                                                        {e.start} - {e.end}
                                                    </div>
                                                )}
                                            </div>

                                            {participants.length > 0 && (
                                                <div className={cx("flex -space-x-1 flex-shrink-0", !isCompact && "mt-1 self-start")}>
                                                    {visibleParticipants.map((p) => (
                                                        <div
                                                            key={p.id}
                                                            className="w-5 h-5 rounded-full bg-[#522DA6] text-white text-[8px] font-bold flex items-center justify-center ring-1 ring-white"
                                                            title={p.name}
                                                        >
                                                            {initials(p.name)}
                                                        </div>
                                                    ))}
                                                    {overflow > 0 && (
                                                        <div className="w-5 h-5 rounded-full bg-zinc-300 text-zinc-700 text-[8px] font-bold flex items-center justify-center ring-1 ring-white">
                                                            +{overflow}
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

/* AG Grid Renderers & Components */

const NameRenderer = (params) => {
    const { name, minTarget } = params.data;
    // Context check for warning visibility
    const showWarning = params.context.onlyMustMeet && params.data.belowTarget;
    // Check if this row is expandable - company AND sharer views have expand
    const isExpandable = params.data.type === 'sharer' || params.data.type === 'company';
    const isExpanded = params.context.expandedId === params.data.id;

    // Tooltip text for below target warning
    const tooltipText = showWarning ? `Below target: ${params.data.meetingsCount}/${minTarget || MIN_MEETINGS_TARGET} meetings` : null;

    return (
        <div
            className="flex flex-col justify-center h-full group cursor-pointer"
            title={tooltipText}
            style={{ '--tooltip-delay': '0ms' }}
        >
            <div className="flex items-center gap-2">
                {/* Expand caret for expandable rows */}
                {isExpandable && (
                    <span className={`text-zinc-400 text-xs transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`}>
                        ▸
                    </span>
                )}
                <span className={cx(
                    "font-medium",
                    showWarning ? "text-amber-700" : "text-zinc-900"
                )}>
                    {params.value}
                </span>
                {showWarning && (
                    <span className="inline-flex items-center text-amber-500">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                            <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                        </svg>
                    </span>
                )}
            </div>

            {params.data.subText ? <div className="text-xs text-zinc-500 mt-0.5">{params.data.subText}</div> : null}
        </div>
    );
};

const ActionRenderer = (params) => {
    return (
        <div className="flex items-center h-full">
            <button
                onClick={(e) => {
                    e.stopPropagation(); // Prevent row expand
                    params.context.onOpenDetail(params.data.type, params.data.id);
                }}
                className="text-primary hover:underline text-xs font-medium px-3 py-1 bg-zinc-50 text-#402285 rounded-md border border-[#522DA6]/10 hover:bg-[#522DA6]/10 transition-colors"
                style={{ lineHeight: '1.2' }}
            >
                View Schedule
            </button>
        </div>
    );
};

// Re-using the sub-table concept but defined here for the renderer
const ParticipantSubTableRenderer = ({ participants, onOpenDetail, onlyMustMeet }) => {
    if (!participants || participants.length === 0) return <div className="p-4 text-zinc-500">No participants found.</div>;

    return (
        <div className="bg-zinc-50/30 p-6 border-t border-zinc-100 w-full" onClick={(e) => e.stopPropagation()}>
            <div className="max-w-[1240px] bg-white rounded-2xl border border-zinc-200 shadow-md overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="px-6 py-4 border-b border-zinc-100 bg-zinc-50/50 flex items-center justify-between">
                    <div className="text-sm font-bold text-zinc-900">Participants ({participants.length})</div>
                    <div className="text-xs text-zinc-500 font-medium">Click a row to view full schedule</div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider border-b border-zinc-100 bg-white">
                            <tr>
                                <th className="px-6 py-3">Name</th>
                                <th className="px-6 py-3">Role</th>
                                <th className="px-6 py-3">Group</th>
                                <th className="px-6 py-3">MustMeet</th>
                                <th className="px-6 py-3">Freeflow</th>
                                <th className="px-6 py-3">Total</th>
                                <th className="px-6 py-3">Met Before</th>
                                {onlyMustMeet && <th className="px-6 py-3">Avg Score</th>}
                                {onlyMustMeet && <th className="px-6 py-3">Min</th>}
                                {onlyMustMeet && <th className="px-6 py-3">Max</th>}
                                <th className="px-6 py-3 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-50">
                            {participants.map(p => (
                                <tr
                                    key={p.id}
                                    className="hover:bg-zinc-50/30 transition-colors cursor-pointer group"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onOpenDetail("participant", p.id);
                                    }}
                                >
                                    <td className="px-6 py-3.5">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-[#522DA6]/60 opacity-0 group-hover:opacity-100 transition-opacity" />
                                            <span className="font-semibold text-zinc-900">{p.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-3.5 text-zinc-600 font-medium">{p.role}</td>
                                    <td className="px-6 py-3.5">
                                        {p.groupName ? <Pill>{p.groupName}</Pill> : "-"}
                                    </td>
                                    <td className="px-6 py-3.5">
                                        {p.mustMeetCount ? <Badge tone="mm">{p.mustMeetCount}</Badge> : "-"}
                                    </td>
                                    <td className="px-6 py-3.5">
                                        {p.oneToOneCount ? <Badge tone="meet">{p.oneToOneCount}</Badge> : "-"}
                                    </td>
                                    <td className="px-6 py-3.5">
                                        <span className={cx("font-bold tabular-nums", onlyMustMeet && p.belowTarget ? "text-amber-600" : "text-zinc-900")}>
                                            {p.meetingsCount}
                                        </span>
                                    </td>
                                    <td className="px-6 py-3.5 text-zinc-600">{p.metBeforeCount || 0}</td>

                                    {onlyMustMeet && (
                                        <>
                                            <td className="px-6 py-3.5">
                                                {p.avgScore ? <ScoreChip score={p.avgScore} /> : "-"}
                                            </td>
                                            <td className="px-6 py-3.5 text-zinc-500">10</td>
                                            <td className="px-6 py-3.5 text-zinc-500">20</td>
                                        </>
                                    )}

                                    <td className="px-6 py-3.5 text-right">
                                        <button
                                            onClick={(e) => { e.stopPropagation(); onOpenDetail("participant", p.id); }}
                                            className="inline-flex items-center gap-1 text-#522DA6 hover:text-#402285 text-xs font-bold uppercase tracking-wider"
                                        >
                                            Open <span className="text-base leading-none">→</span>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

const FullWidthRenderer = (params) => {
    return <ParticipantSubTableRenderer
        participants={params.data.participants}
        onOpenDetail={params.context.onOpenDetail}
        onlyMustMeet={params.context.onlyMustMeet} // Pass context val
    />;
};

const ScheduleGrid = (props) => {
    const { gridData, columnDefs, context } = props;

    // Callbacks must be stable
    const isFullWidthRow = useCallback((params) => params.rowNode.data.fullWidth, []);
    const fullWidthCellRenderer = useMemo(() => FullWidthRenderer, []);

    const defaultColDef = useMemo(() => ({
        sortable: true,
        filter: true,
        resizable: true,
        flex: 1,
        cellClass: "flex items-center" // vertical center content
    }), []);

    const getRowHeight = useCallback((params) => {
        if (params.data.fullWidth) {
            // Detail / Expanded view
            const count = params.data.participants ? params.data.participants.length : 0;
            return 150 + (count * 52);
        }

        // For regular rows with "Members" list (Sharer/Company views)
        if (params.data.participants && params.data.participants.length > 0) {
            // Displayed items: max 4 + potential "+X more" label
            const displayCount = Math.min(params.data.participants.length, 4);
            const hasMore = params.data.participants.length > 4;
            const lines = displayCount + (hasMore ? 1 : 0);

            // Base height 60 covers ~2 lines comfortably.
            // If more lines, add 20px per line.
            // 1 line: 60
            // 2 lines: 60
            // 3 lines: 80
            // 4 lines: 100
            // 5 lines: 120
            if (lines > 2) {
                return 60 + ((lines - 2) * 22);
            }
        }
        return 60; // Standard row height
    }, []);

    return (
        <div className="ag-theme-quartz w-full" id="tour-table">
            <AgGridReact
                domLayout="autoHeight"
                rowData={gridData}
                columnDefs={columnDefs}
                defaultColDef={defaultColDef}
                isFullWidthRow={isFullWidthRow}
                fullWidthCellRenderer={fullWidthCellRenderer}
                getRowHeight={getRowHeight}
                context={context}
                suppressCellFocus={true}
                rowSelection="single"
                onRowClicked={props.onRowClicked}
                animateRows={true}
                pagination={true}
                paginationPageSize={10}
                paginationPageSizeSelector={[10, 20, 50]}
            />
        </div>
    );
};

function MainSchedules({ onOpenDetail, tourActive, tourStep, events, onlyMustMeet, setOnlyMustMeet, hubNavigate }) {
    const { cById, pById } = buildIndexes();

    const [view, setView] = useState("participant");
    const [search, setSearch] = useState("");
    // Removed locationFilter - no longer used

    // Keep expanded state for full width row injection
    const [expandedCompany, setExpandedCompany] = useState(null);
    const [expandedSharer, setExpandedSharer] = useState(null);

    // Removed venueGroups - no longer used

    const filterEventSet = useCallback((evs) => {
        let out = evs;
        // Only filter by MustMeet Focus (removed location filter)
        if (onlyMustMeet) out = out.filter((e) => e.kind === "meeting" && e.meetingType === "mustMeet");
        return out;
    }, [onlyMustMeet]);

    const participantRows = useMemo(() => {
        const rows = PARTICIPANTS.map((p) => {
            const evsFiltered = filterEventSet(eventsFor(events, "participant", p.id));
            const meetings = evsFiltered.filter((e) => e.kind === "meeting");
            const groups = evsFiltered.filter((e) => e.kind === "activityGroup");

            // Find sharer for this participant (if any)
            const sharer = Object.values(SHARERS).find(s => (s.memberIds || []).includes(p.id));

            return {
                id: p.id,
                type: 'participant',
                name: p.name,
                companyName: cById[p.companyId]?.name || "",
                role: p.role,
                sharerId: sharer ? sharer.id : null,
                groupName: p.role === "Buyer" ? "Buyers" : p.role === "Exhibitor" ? "Suppliers" : "Sponsors", // Mock group name
                mustMeetCount: meetings.filter((m) => m.meetingType === "mustMeet").length,
                oneToOneCount: meetings.filter((m) => m.meetingType === "oneToOne").length,
                avgScore: meetings.length ? Math.round(meetings.reduce((a, m) => a + (m.score || 0), 0) / meetings.length) : null,
                metBeforeCount: meetings.filter((m) => m.metBefore).length,
                meetingsCount: meetings.length,
                groupsCount: groups.length,

                // Mock goals/target data
                minMeetings: 10,
                maxMeetings: 20,
                target: 15,
                belowTarget: meetings.length < MIN_MEETINGS_TARGET,
            };
        });
        const q = search.trim().toLowerCase();
        return q ? rows.filter((r) => r.name.toLowerCase().includes(q) || r.companyName.toLowerCase().includes(q)) : rows;
    }, [search, onlyMustMeet, cById, filterEventSet, events]); // Removed locationFilter/venueGroups

    const companyRows = useMemo(() => {
        const rows = COMPANIES.map((c) => {
            const evsFiltered = filterEventSet(eventsFor(events, "company", c.id));
            const meetings = evsFiltered.filter((e) => e.kind === "meeting");
            const groups = evsFiltered.filter((e) => e.kind === "activityGroup");

            // Find participants for this company
            const companyParticipants = PARTICIPANTS.filter(p => p.companyId === c.id);

            return {
                id: c.id,
                type: 'company',
                name: c.name,
                category: c.category,
                participantCount: companyParticipants.length,
                groupName: c.id === "c1" || c.id === "c5" ? "Buyers" : "Suppliers", // Mock group

                mustMeetCount: meetings.filter((m) => m.meetingType === "mustMeet").length,
                oneToOneCount: meetings.filter((m) => m.meetingType === "oneToOne").length,
                meetingsCount: meetings.length,
                metBeforeCount: meetings.filter((m) => m.metBefore).length,
                avgScore: meetings.length ? Math.round(meetings.reduce((a, m) => a + (m.score || 0), 0) / meetings.length) : null,

                belowTarget: meetings.length < MIN_MEETINGS_TARGET,

                // Nesting participants for detail view
                participants: companyParticipants.map(p => {
                    const pEvs = filterEventSet(eventsFor(events, "participant", p.id));
                    const pMeetings = pEvs.filter((e) => e.kind === "meeting");
                    return {
                        ...p,
                        companyName: c.name,
                        groupName: p.role === "Buyer" ? "Buyers" : "Suppliers",
                        mustMeetCount: pMeetings.filter((m) => m.meetingType === "mustMeet").length,
                        oneToOneCount: pMeetings.filter((m) => m.meetingType === "oneToOne").length,
                        meetingsCount: pMeetings.length,
                        metBeforeCount: pMeetings.filter((m) => m.metBefore).length,
                        belowTarget: pMeetings.length < MIN_MEETINGS_TARGET,
                        avgScore: pMeetings.length ? Math.round(pMeetings.reduce((a, m) => a + (m.score || 0), 0) / pMeetings.length) : null,
                    };
                }),
                minTarget: MIN_MEETINGS_TARGET
            };
        });
        const q = search.trim().toLowerCase();
        return q ? rows.filter((r) => r.name.toLowerCase().includes(q)) : rows;
    }, [search, onlyMustMeet, filterEventSet, events]); // Removed locationFilter

    const sharerRows = useMemo(() => {
        const rows = SHARERS.map((s) => {
            const a = aggregateForSharer(events, s.id);
            const evsFiltered = filterEventSet(eventsFor(events, "sharer", s.id));
            const meetings = evsFiltered.filter((e) => e.kind === "meeting");

            return {
                id: s.id,
                type: 'sharer',
                sharerId: s.id,
                name: s.id, // For NameRenderer
                companyName: a.companyName,
                memberNames: a.memberNames,
                role: a.role,
                memberCount: (s.memberIds || []).length,
                groupName: a.role === "Buyer" ? "Buyers" : "Suppliers", // Mock group

                mustMeetCount: meetings.filter((m) => m.meetingType === "mustMeet").length,
                oneToOneCount: meetings.filter((m) => m.meetingType === "oneToOne").length,
                meetingsCount: meetings.length,
                metBeforeCount: meetings.filter((m) => m.metBefore).length,
                avgScore: meetings.length ? Math.round(meetings.reduce((a, m) => a + (m.score || 0), 0) / meetings.length) : null,

                belowTarget: meetings.length < MIN_MEETINGS_TARGET,

                participants: (s.memberIds || []).map(id => pById[id]).map(p => {
                    // ... logic for nested participants ...
                    if (!p) return null;
                    const pEvs = filterEventSet(eventsFor(events, "participant", p.id));
                    const pMeetings = pEvs.filter((e) => e.kind === "meeting");
                    return {
                        ...p,
                        companyName: cById[p.companyId]?.name || "",
                        groupName: p.role === "Buyer" ? "Buyers" : "Suppliers",
                        mustMeetCount: pMeetings.filter((m) => m.meetingType === "mustMeet").length,
                        oneToOneCount: pMeetings.filter((m) => m.meetingType === "oneToOne").length,
                        meetingsCount: pMeetings.length,
                        metBeforeCount: pMeetings.filter((m) => m.metBefore).length,
                        belowTarget: pMeetings.length < MIN_MEETINGS_TARGET,
                        avgScore: pMeetings.length ? Math.round(pMeetings.reduce((a, m) => a + (m.score || 0), 0) / pMeetings.length) : null,
                    };
                }).filter(Boolean),
            };
        });
        const q = search.trim().toLowerCase();
        return q ? rows.filter((r) => r.sharerId.toLowerCase().includes(q) || (r.companyName || "").toLowerCase().includes(q)) : rows;
    }, [search, onlyMustMeet, pById, cById, filterEventSet, events]);

    // Grid Data Flattening for Expansion
    const gridData = useMemo(() => {
        let sourceRows = [];
        if (view === "company") sourceRows = companyRows;
        else if (view === "sharer") sourceRows = sharerRows;
        else sourceRows = participantRows;

        const out = [];
        sourceRows.forEach(r => {
            out.push(r);
            if (view === "company" && expandedCompany === r.id) {
                out.push({ fullWidth: true, participants: r.participants, id: r.id + "_detail", type: 'detail_row' });
            }
            if (view === "sharer" && expandedSharer === r.id) {
                out.push({ fullWidth: true, participants: r.participants, id: r.id + "_detail", type: 'detail_row' });
            }
        });
        return out;
    }, [view, companyRows, sharerRows, participantRows, expandedCompany, expandedSharer]);

    const columnDefs = useMemo(() => {
        if (view === "company") {
            // Company view columns matching API: company_name, exhibitor_id, size, groups, mustmeet_count, freeflow_count, total_meetings, met_before_count, average_score
            const baseCols = [
                { field: "name", headerName: "Company", cellRenderer: NameRenderer, flex: 2, minWidth: 180 },
                { field: "participantCount", headerName: "Size", width: 80, cellRenderer: (p) => <span className="text-zinc-600">{p.value}</span> },
                {
                    field: "groupName", headerName: "Group", width: 100,
                    cellRenderer: (p) => p.value ? <Pill>{p.value}</Pill> : "-"
                },
                { field: "mustMeetCount", headerName: "MustMeet", width: 100, cellRenderer: (p) => p.value ? <Badge tone="mm">{p.value}</Badge> : "-" },
                { field: "oneToOneCount", headerName: "Freeflow", width: 100, cellRenderer: (p) => p.value ? <Badge tone="meet">{p.value}</Badge> : "-" },
                { field: "meetingsCount", headerName: "Total", width: 80, cellRenderer: (p) => <span className="font-medium">{p.value}</span> },
                { field: "metBeforeCount", headerName: "Met Before", width: 100, cellRenderer: (p) => <span className="text-zinc-600">{p.value || 0}</span> }
            ];

            // MustMeet Focus only columns
            if (onlyMustMeet) {
                baseCols.push(
                    { field: "avgScore", headerName: "Avg Score", width: 100, cellRenderer: (p) => p.value ? <ScoreChip score={p.value} /> : "-" }
                );
            }

            baseCols.push({
                headerName: "Action",
                cellRenderer: ActionRenderer,
                width: 140,
                sortable: false, filter: false, flex: 0, suppressMenu: true
            });
            return baseCols;

        } else if (view === "sharer") {
            // Sharer view columns matching API: sharer_id, size, groups, mustmeet_count, freeflow_count, total_meetings, met_before_count, average_score
            const baseCols = [
                {
                    field: "id", headerName: "Sharer ID", minWidth: 120,
                    cellRenderer: (p) => (
                        <div className="flex items-center gap-2">
                            {/* Expand caret */}
                            <span className={`text-zinc-400 text-xs cursor-pointer transition-transform duration-200 ${p.node.expanded ? 'rotate-90' : ''}`}>
                                ▸
                            </span>
                            <span className="font-mono text-xs text-zinc-600">{p.value}</span>
                        </div>
                    )
                },
                { field: "memberCount", headerName: "Size", width: 80, cellRenderer: (p) => <span className="text-zinc-600">{p.value}</span> },
                {
                    field: "groupName", headerName: "Group", width: 100,
                    cellRenderer: (p) => p.value ? <Pill>{p.value}</Pill> : "-"
                },
                { field: "mustMeetCount", headerName: "MustMeet", width: 100, cellRenderer: (p) => p.value ? <Badge tone="mm">{p.value}</Badge> : "-" },
                { field: "oneToOneCount", headerName: "Freeflow", width: 100, cellRenderer: (p) => p.value ? <Badge tone="meet">{p.value}</Badge> : "-" },
                { field: "meetingsCount", headerName: "Total", width: 80, cellRenderer: (p) => <span className="font-medium">{p.value}</span> },
                { field: "metBeforeCount", headerName: "Met Before", width: 100, cellRenderer: (p) => <span className="text-zinc-600">{p.value || 0}</span> }
            ];

            // MustMeet Focus only columns
            if (onlyMustMeet) {
                baseCols.push(
                    { field: "avgScore", headerName: "Avg Score", width: 100, cellRenderer: (p) => p.value ? <ScoreChip score={p.value} /> : "-" }
                );
            }

            baseCols.push({
                headerName: "Action",
                cellRenderer: ActionRenderer,
                width: 140,
                sortable: false, filter: false, flex: 0, suppressMenu: true
            });
            return baseCols;

        } else {
            // Participant view columns matching API: name, type, company, sharer_id, groups, mustmeet_count, freeflow_count, total_meetings, met_before_count  
            // + Conditional: average_score, minimum_meetings, maximum_meetings, target
            const baseCols = [
                { field: "name", headerName: "Name", cellRenderer: NameRenderer, flex: 2, minWidth: 200 },
                { field: "role", headerName: "Type", width: 100, cellRenderer: (p) => <span className="text-zinc-600 text-xs">{p.value}</span> },
                { field: "companyName", headerName: "Company", flex: 1.5 },
                {
                    field: "groupName", headerName: "Group", width: 100,
                    cellRenderer: (p) => p.value ? <Pill>{p.value}</Pill> : "-"
                },
                { field: "mustMeetCount", headerName: "MustMeet", width: 100, cellRenderer: (p) => p.value ? <Badge tone="mm">{p.value}</Badge> : "-" },
                { field: "oneToOneCount", headerName: "Freeflow", width: 100, cellRenderer: (p) => p.value ? <Badge tone="meet">{p.value}</Badge> : "-" },
                {
                    field: "meetingsCount", headerName: "Total", width: 80,
                    cellRenderer: (p) => <span className={cx("font-medium", p.data.belowTarget ? "text-amber-600" : "text-zinc-900")}>{p.value}</span>
                },
                { field: "metBeforeCount", headerName: "Met Before", width: 100, cellRenderer: (p) => <span className="text-zinc-600">{p.value || 0}</span> }
            ];

            // MustMeet Focus only columns
            if (onlyMustMeet) {
                // Insert Sharer ID after Company if focused
                baseCols.splice(3, 0, { field: "sharerId", headerName: "Sharer ID", width: 120, cellRenderer: (p) => <span className="font-mono text-xs">{p.value || "-"}</span> });

                baseCols.push(
                    { field: "avgScore", headerName: "Avg Score", width: 100, cellRenderer: (p) => p.value ? <ScoreChip score={p.value} /> : "-" },
                    { field: "minMeetings", headerName: "Min", width: 70, cellRenderer: (p) => <span className="text-zinc-500">{p.value}</span> },
                    { field: "maxMeetings", headerName: "Max", width: 70, cellRenderer: (p) => <span className="text-zinc-500">{p.value}</span> }
                );
            }

            baseCols.push({
                headerName: "Action",
                cellRenderer: ActionRenderer,
                width: 140,
                sortable: false, filter: false, flex: 0, suppressMenu: true
            });

            return baseCols;
        }
    }, [view, onlyMustMeet]);

    // Top Stats Logic - uses API headers structure
    const topStats = useMemo(() => {
        const evs = filterEventSet(events);
        const meetings = evs.filter((e) => e.kind === "meeting");
        const avgScore = meetings.length ? Math.round(meetings.reduce((a, m) => a + (m.score || 0), 0) / meetings.length) : 0;


        let belowTargetCount = 0;
        let entitiesCount = 0;

        if (view === "company") {
            entitiesCount = companyRows.length;
            belowTargetCount = companyRows.filter(r => r.belowTarget).length;
        } else if (view === "sharer") {
            entitiesCount = sharerRows.length;
            belowTargetCount = sharerRows.filter(r => r.belowTarget).length;
        } else {
            entitiesCount = participantRows.length;
            belowTargetCount = participantRows.filter(r => r.belowTarget).length;
        }

        // Structure matches API headers
        return {
            entities: entitiesCount,
            meetings: meetings.length,
            avgScore,

            belowTargetCount,
            meetingsTarget: MOCK_API_HEADERS[view]?.meetings_target || 30
        };
    }, [view, participantRows, companyRows, sharerRows, onlyMustMeet, events, filterEventSet]);

    const onRowClicked = useCallback((params) => {
        if (params.data.fullWidth) return;

        if (view === "company") {
            setExpandedCompany(curr => curr === params.data.id ? null : params.data.id);
        } else if (view === "sharer") {
            setExpandedSharer(curr => curr === params.data.id ? null : params.data.id);
        } else {
            onOpenDetail("participant", params.data.id);
        }
    }, [view, onOpenDetail]);

    // Context includes expandedId for NameRenderer to show expand state
    const expandedId = view === "company" ? expandedCompany : view === "sharer" ? expandedSharer : null;
    const context = useMemo(() => ({ onOpenDetail, onlyMustMeet, expandedId }), [onOpenDetail, onlyMustMeet, expandedId]);

    // Auto-expand first row on initial load for company/sharer views
    useEffect(() => {
        if (view === "company" && companyRows.length > 0 && expandedCompany === null) {
            setExpandedCompany(companyRows[0].id);
        } else if (view === "sharer" && sharerRows.length > 0 && expandedSharer === null) {
            setExpandedSharer(sharerRows[0].id);
        }
    }, [view, companyRows, sharerRows]);

    return (
        <div className="p-6 space-y-6">
            {hubNavigate && (
                <button
                    onClick={() => hubNavigate('#/schedules')}
                    className="flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-900 transition-colors"
                >
                    <span>←</span>
                    <span>Back to Scoring & Schedules</span>
                </button>
            )}
            <SectionTitle
                title="Meeting schedules"
                desc="Inspect and analyse schedules across participants, sharers, and companies. Use the calendar view for gap and quality analysis."
                right={
                    <Segmented
                        value={view}
                        onChange={(v) => {
                            setView(v);
                            setExpandedCompany(null);
                            setExpandedSharer(null);
                        }}
                        options={[
                            { value: "participant", label: "Participant" },
                            { value: "sharer", label: "Sharer" },
                            { value: "company", label: "Company" },
                        ]}
                    />
                }
            />

            <div id="tour-stats" className="flex flex-wrap gap-3">
                <Stat
                    label={view === "company" ? "Companies" : view === "sharer" ? "Sharers" : "Participants"}
                    value={topStats.entities}
                    sub="In this view"
                    className="flex-1 min-w-[180px]"
                />
                <Stat label="Meetings" value={topStats.meetings} sub="Total scheduled" className="flex-1 min-w-[180px]" />
                {onlyMustMeet && (
                    <Stat label="Avg. Score" value={topStats.avgScore ? topStats.avgScore + "%" : "-"} sub="Match quality" className="flex-1 min-w-[180px]" />
                )}

                {onlyMustMeet && (
                    <Stat
                        label="Below Target"
                        value={topStats.belowTargetCount}
                        sub={`< ${MIN_MEETINGS_TARGET} meetings`}
                        className="flex-1 min-w-[180px]"
                    />
                )}
            </div>

            <div id="tour-filters">
                <div className="flex flex-wrap items-center gap-3 mb-4">
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search by name, company..."
                        className="h-10 w-full max-w-[320px] rounded-lg border border-zinc-200 bg-white px-3 text-sm text-zinc-900 outline-none placeholder:text-zinc-400 focus:border-[#522DA6]/40 focus:ring-2 focus:ring-[#522DA6]/20 transition-all"
                    />
                    {/* MustMeet Focus Toggle - replaces old location dropdown and MustMeet only toggle */}
                    <label className={`flex items-center gap-2 text-sm px-4 h-10 rounded-lg border cursor-pointer transition-all ${onlyMustMeet ? 'bg-[#522DA6] text-white border-[#522DA6]' : 'bg-white text-zinc-700 border-zinc-200 hover:bg-zinc-50'}`}>
                        <input type="checkbox" checked={onlyMustMeet} onChange={(e) => setOnlyMustMeet(e.target.checked)} className="sr-only" />
                        <span className={`w-4 h-4 rounded flex items-center justify-center ${onlyMustMeet ? 'bg-white/20' : 'bg-zinc-100'}`}>
                            {onlyMustMeet && <span className="text-white text-xs">✓</span>}
                        </span>
                        MustMeet Focus
                    </label>
                </div>

                <div className="bg-white rounded-lg border border-zinc-200 overflow-hidden">
                    <ScheduleGrid
                        gridData={gridData}
                        columnDefs={columnDefs}
                        context={context}
                        onRowClicked={onRowClicked}
                    />
                </div>
            </div>
        </div>
    );
}
// MultiSelect Dropdown Component
function MultiSelectDropdown({ options, selectedIds, onToggle, onSelectAll, label }) {
    const [isOpen, setIsOpen] = useState(false);

    // Close on click outside (simplified for prototype)
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (isOpen && !e.target.closest('.multiselect-container')) {
                setIsOpen(false);
            }
        };
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, [isOpen]);

    const count = selectedIds ? selectedIds.length : options.length;
    const isAll = !selectedIds;

    return (
        <div className="relative multiselect-container">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-3 py-2 bg-white border border-zinc-200 rounded-lg text-sm font-medium text-zinc-700 hover:bg-zinc-50 shadow-sm"
            >
                <span>{label}: {isAll ? "All" : `${count} selected`}</span>
                <span className="text-zinc-400 text-xs text-[10px]">▼</span>
            </button>

            {isOpen && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-white border border-zinc-200 rounded-xl shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                    <div className="p-2 border-b border-zinc-100">
                        <button
                            onClick={onSelectAll}
                            className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium hover:bg-zinc-50 flex items-center justify-between ${isAll ? "text-#402285 bg-zinc-50" : "text-zinc-900"}`}
                        >
                            <span>All Participants</span>
                            {isAll && <span className="text-#522DA6">✓</span>}
                        </button>
                    </div>
                    <div className="max-h-64 overflow-y-auto p-2 space-y-0.5">
                        {options.map(opt => {
                            const isSelected = selectedIds ? selectedIds.includes(opt.id) : true;
                            return (
                                <button
                                    key={opt.id}
                                    onClick={() => onToggle(opt.id)}
                                    className={`w-full text-left px-3 py-2 rounded-lg text-sm hover:bg-zinc-50 flex items-center justify-between ${isSelected ? "text-#402285 font-medium" : "text-zinc-600"}`}
                                >
                                    <div className="flex items-center gap-2">
                                        <div className={`w-4 h-4 rounded border flex items-center justify-center ${isSelected ? "bg-#522DA6 border-#522DA6" : "border-zinc-300"}`}>
                                            {isSelected && <span className="text-white text-[10px]">✓</span>}
                                        </div>
                                        <span>{opt.name}</span>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}

function DetailPage({ entityType, entityId, onBack, events, onEventAction, setEvents, onlyMustMeet }) {
    const { pById, cById, sharerById } = buildIndexes();

    const [viewMode, setViewMode] = useState(() => {
        try {
            const saved = localStorage.getItem("grip-prototype-state");
            if (saved) {
                const parsed = JSON.parse(saved);
                if (parsed?.viewMode) return parsed.viewMode;
            }
        } catch (e) { }
        return "calendar";
    });
    const [selectedEventId, setSelectedEventId] = useState(null);
    const [activeModal, setActiveModal] = useState(null);
    const [actionsOpen, setActionsOpen] = useState(false); // Fix: Add missing state
    const [detailsOpen, setDetailsOpen] = useState(false);
    const [showGenerateModal, setShowGenerateModal] = useState(false);
    const [expandedMemberId, setExpandedMemberId] = useState(null);
    const [dateWindowStart, setDateWindowStart] = useState(() => {
        try {
            const saved = localStorage.getItem("grip-prototype-state");
            if (saved) {
                const parsed = JSON.parse(saved);
                if (parsed?.dateWindowStart) return parsed.dateWindowStart;
            }
        } catch (e) { }
        return "2025-03-21";
    });
    const [selectedParticipantIds, setSelectedParticipantIds] = useState(null); // null = all

    // Additional filters
    const [locationFilter, setLocationFilter] = useState(""); // "" = all
    const [typeFilter, setTypeFilter] = useState(""); // "" = all, "mustMeet", "oneToOne"
    const [scoreFilter, setScoreFilter] = useState(""); // "" = all, "high" (90+), "medium" (75-89), "low" (<75)

    // Get all events for this entity
    const allEvs = useMemo(() => eventsFor(events, entityType, entityId), [entityType, entityId, events]);

    // Get participants for this entity (for filtering)
    const entityParticipants = useMemo(() => {
        if (entityType === "company") {
            return PARTICIPANTS.filter(p => p.companyId === entityId);
        } else if (entityType === "sharer") {
            const s = sharerById[entityId];
            return s?.memberIds.map(id => pById[id]).filter(Boolean) || [];
        }
        return [];
    }, [entityType, entityId, sharerById, pById]);

    // Filter events by selected participants
    const evs = useMemo(() => {
        if (!selectedParticipantIds || selectedParticipantIds.length === 0 || entityType === "participant") {
            return allEvs;
        }
        return allEvs.filter(e =>
            e.participantIds.some(pid => selectedParticipantIds.includes(pid))
        );
    }, [allEvs, selectedParticipantIds, entityType]);

    // Date window (3 days)
    const days = useMemo(() => {
        const start = new Date(dateWindowStart + "T00:00:00");
        return [0, 1, 2].map(offset => {
            const d = new Date(start);
            d.setDate(d.getDate() + offset);
            return d.toISOString().split("T")[0];
        });
    }, [dateWindowStart]);

    const navigateDays = (direction) => {
        const start = new Date(dateWindowStart + "T00:00:00");
        start.setDate(start.getDate() + (direction * 3));
        setDateWindowStart(start.toISOString().split("T")[0]);
    };

    // Get unique locations for filter dropdown
    const uniqueLocations = useMemo(() => {
        const locs = new Set(allEvs.map(e => e.venue).filter(Boolean));
        return Array.from(locs).sort();
    }, [allEvs]);

    // Filter events by date window AND additional filters
    const filteredEvs = useMemo(() => {
        return evs.filter(e => {
            // Date filter
            if (!days.includes(e.date)) return false;

            // Venue filter
            if (locationFilter && e.venue !== locationFilter) return false;

            // Type filter
            if (typeFilter === "mustMeet" && e.meetingType !== "mustMeet") return false;
            if (typeFilter === "oneToOne" && e.meetingType !== "oneToOne") return false;

            // Score filter
            if (scoreFilter === "high" && (e.score || 0) < 90) return false;
            if (scoreFilter === "medium" && ((e.score || 0) < 75 || (e.score || 0) >= 90)) return false;
            if (scoreFilter === "low" && (e.score || 0) >= 75) return false;

            return true;
        });
    }, [evs, days, locationFilter, typeFilter, scoreFilter]);

    const meetings = evs.filter((e) => e.kind === "meeting");
    const groups = evs.filter((e) => e.kind === "activityGroup");

    const avgScore = meetings.length ? Math.round(meetings.reduce((a, m) => a + (m.score || 0), 0) / meetings.length) : 0;

    const coverage = Math.min(100, 80 + Math.round((meetings.length + groups.length) * 2));
    const belowTarget = meetings.length < MIN_MEETINGS_TARGET;

    // Determine title and subtitle based on entity type
    let title = "Schedule";
    let subtitle = "View all groups and meetings.";
    if (entityType === "participant") {
        const p = pById[entityId];
        title = `${p?.name || "Participant"} Schedule`;
        subtitle = `View all meetings for this participant.`;
    } else if (entityType === "company") {
        const c = cById[entityId];
        title = `${c?.name || "Company"} Schedule`;
        subtitle = `View all meetings across ${c?.name || "this company"}'s participants.`;
    } else if (entityType === "sharer") {
        const s = sharerById[entityId];
        const c = cById[s?.companyId];
        title = `Sharer ${entityId} Schedule`;
        subtitle = `View all meetings for ${c?.name || "sharer"} members.`;
    }

    // State Persistence
    useEffect(() => {
        const persistedState = {
            entityType,
            entityId,
            viewMode,
            dateWindowStart
        };
        localStorage.setItem("grip-prototype-state", JSON.stringify(persistedState));
    }, [entityType, entityId, viewMode, dateWindowStart]);

    // Restore state on mount (handled in parent or initial state - adding logic here for completeness/check)
    // For this prototype, we'll assume the parent component handles the restoration to launch this page, but we can sync locally too.

    // Bulk Selection State
    const [selectedEventIds, setSelectedEventIds] = useState([]);

    // Reset selection when filters change or view changes
    useEffect(() => {
        setSelectedEventIds([]);
    }, [days, locationFilter, typeFilter, scoreFilter, viewMode]);

    const handleToggleSelect = (id) => {
        setSelectedEventIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    };

    const handleSelectAll = (ids, checked) => {
        setSelectedEventIds(checked ? ids : []);
    };

    const handleBulkDelete = () => {
        console.log("handleBulkDelete triggered", selectedEventIds);
        // Use custom modal instead of native confirm()
        setActiveModal({
            type: 'confirm_custom',
            title: `Delete ${selectedEventIds.length} meetings?`,
            message: 'This action cannot be undone.',
            onConfirm: () => {
                console.log("handleBulkDelete confirmed");
                onEventAction('bulkDelete', selectedEventIds);
                setSelectedEventIds([]);
                toast.success(`Deleted ${selectedEventIds.length} meetings`);
            }
        });
    };

    const toggleParticipant = (pId) => {
        setSelectedParticipantIds(prev => {
            if (!prev) {
                // First toggle: select only this one
                return [pId];
            }
            if (prev.includes(pId)) {
                const next = prev.filter(id => id !== pId);
                return next.length === 0 ? null : next;
            }
            return [...prev, pId];
        });
    };

    const selectAllParticipants = () => setSelectedParticipantIds(null);

    return (
        <div className="min-h-screen bg-zinc-50 pb-20">
            {/* Fixed Detail Header */}
            <div className="fixed top-0 left-0 right-0 z-40">
                <div className="h-1 bg-[#522DA6]" />
                <div className="h-16 bg-white border-b border-zinc-200 flex items-center justify-between px-6">
                    <div className="flex items-center gap-4">
                        <button
                            type="button"
                            onClick={onBack}
                            className="rounded-lg p-2 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 transition-colors"
                        >
                            <span className="text-xl">←</span>
                        </button>
                        <h1 className="text-lg font-semibold text-zinc-900">{title}</h1>
                    </div>
                    <div className="flex items-center gap-4">
                        <img src="/grip-logo.png" alt="Grip" className="h-6" />
                    </div>
                </div>
            </div>

            <div className="pt-24 mx-auto max-w-[1400px] px-6">
                {/* Below Target Warning Banner */}
                {belowTarget && (
                    <div className="mb-4 flex items-center gap-2 px-3 py-2 bg-amber-50 border border-amber-200 rounded-lg text-amber-700 text-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-amber-500 flex-shrink-0">
                            <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                        </svg>
                        <span className="font-medium">Below Target</span>
                        <span className="text-amber-600/70">·</span>
                        <span className="text-amber-600">{meetings.length} of {MIN_MEETINGS_TARGET} minimum meetings scheduled</span>
                    </div>
                )}

                <SectionTitle
                    title={title}
                    desc={subtitle}
                    right={
                        <div className="flex items-center gap-3">
                            {selectedEventIds.length > 0 && (
                                <div className="flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-200">
                                    <span className="text-sm text-zinc-500 font-medium">{selectedEventIds.length} selected</span>
                                    <button
                                        onClick={handleBulkDelete}
                                        className="flex items-center gap-1.5 px-3 py-2 bg-rose-50 text-rose-700 border border-rose-200 rounded-lg text-sm font-medium hover:bg-rose-100 transition-colors"
                                    >
                                        <Icons.Trash2 />
                                        Delete
                                    </button>
                                </div>
                            )}

                            {/* Generate Schedule Button */}
                            <button
                                onClick={() => setShowGenerateModal(true)}
                                className="flex items-center gap-2 px-3 py-2 bg-white border border-zinc-200 text-zinc-700 rounded-lg text-sm font-medium hover:bg-zinc-50 transition-colors"
                            >
                                Generate Schedule
                            </button>

                            {/* Cancel Meetings Dropdown */}
                            <div className="relative">
                                <button
                                    onClick={() => setActionsOpen(!actionsOpen)}
                                    className={`flex items-center gap-2 px-3 py-2 bg-white border border-zinc-200 text-rose-600 rounded-lg text-sm font-medium hover:bg-rose-50 transition-colors shadow-sm border-rose-100 ${actionsOpen ? "bg-rose-50" : ""}`}
                                >
                                    Cancel Meetings
                                    <span className="text-xs opacity-50">▼</span>
                                </button>
                                {actionsOpen && (
                                    <>
                                        <div className="fixed inset-0 z-30" onClick={() => setActionsOpen(false)} />
                                        <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-zinc-200 rounded-xl shadow-lg p-1 animate-in fade-in zoom-in-95 duration-75 z-40">
                                            <button
                                                onClick={() => {
                                                    console.log("Cancel MustMeet clicked");
                                                    setActionsOpen(false);
                                                    setActiveModal({
                                                        type: 'confirm_custom',
                                                        title: 'Cancel MustMeet Meetings?',
                                                        message: 'This will cancel all MustMeet meetings for this entity.',
                                                        onConfirm: () => {
                                                            console.log("Cancel MustMeet confirmed");
                                                            setEvents(prev => {
                                                                console.log("setEvents prev length:", prev.length);
                                                                const next = prev.filter(e => {
                                                                    if (e.meetingType !== "mustMeet") return true;
                                                                    if (entityType === "participant") return !e.participantIds?.includes(entityId);
                                                                    if (entityType === "company") return !e.companyIds?.includes(entityId);
                                                                    if (entityType === "sharer") return e.sharerId !== entityId;
                                                                    return true;
                                                                });
                                                                console.log("setEvents next length:", next.length);
                                                                return next;
                                                            });
                                                            toast.success("Cancelled MustMeet meetings");
                                                        }
                                                    });
                                                }}
                                                className="w-full text-left px-3 py-2 text-sm text-rose-600 hover:bg-rose-50 rounded-lg"
                                            >
                                                Cancel MustMeet
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setActionsOpen(false);
                                                    setActiveModal({
                                                        type: 'confirm_custom',
                                                        title: 'Cancel ALL Meetings?',
                                                        message: 'This will cancel all meetings for this entity. This action cannot be undone.',
                                                        onConfirm: () => {
                                                            setEvents(prev => prev.filter(e => {
                                                                if (e.kind !== "meeting") return true;
                                                                if (entityType === "participant") return !e.participantIds?.includes(entityId);
                                                                if (entityType === "company") return !e.companyIds?.includes(entityId);
                                                                if (entityType === "sharer") return e.sharerId !== entityId;
                                                                return true;
                                                            }));
                                                            toast.success("Cancelled all meetings");
                                                        }
                                                    });
                                                }}
                                                className="w-full text-left px-3 py-2 text-sm text-rose-600 hover:bg-rose-50 rounded-lg"
                                            >
                                                Cancel All
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>


                            <div className="h-6 w-px bg-zinc-200 mx-2" />

                            <button
                                onClick={() => setActiveModal({ type: 'create_type_select' })}
                                className="flex items-center gap-2 px-4 py-2 bg-[#522DA6] text-white rounded-lg text-sm font-medium hover:bg-[#422389]"
                            >
                                <Icons.PlusCircle />
                                Create Meeting
                            </button>
                        </div>
                    }
                />

                {/* Participant Details Dropdown */}
                {entityType === "participant" && (() => {
                    const p = pById[entityId];
                    const c = cById[p?.companyId];
                    const sharer = Object.values(SHARERS).find(s => (s.memberIds || []).includes(entityId));
                    const isExclusive = evs.some(e => e.exclusive);
                    const statusTones = {
                        Accepted: "bg-emerald-100 text-emerald-700",
                        Pending: "bg-amber-100 text-amber-700",
                        Declined: "bg-rose-100 text-rose-700",
                    };
                    return (
                        <div className="mt-4">
                            <button
                                onClick={() => setDetailsOpen(!detailsOpen)}
                                className={cx(
                                    "w-full flex items-center justify-between px-4 py-2.5 bg-white border border-zinc-200 text-sm hover:bg-zinc-50 transition-colors",
                                    detailsOpen ? "rounded-t-xl border-b-0" : "rounded-xl"
                                )}
                            >
                                <span className="font-medium text-zinc-900">Participant Details</span>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={`w-4 h-4 text-zinc-400 transition-transform duration-200 ${detailsOpen ? 'rotate-180' : ''}`}>
                                    <path fillRule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06z" clipRule="evenodd" />
                                </svg>
                            </button>
                            {detailsOpen && (
                                <div className="px-4 py-4 bg-white border border-zinc-200 rounded-b-xl animate-in fade-in slide-in-from-top-1 duration-150">
                                    {/* Profile header row */}
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#522DA6] text-sm font-bold text-white">
                                                {initials(p?.name || "")}
                                            </div>
                                            <div>
                                                <div className="text-sm font-semibold text-zinc-900">{p?.name}</div>
                                                <div className="text-xs text-zinc-500">{p?.headline || p?.role}</div>
                                            </div>
                                        </div>
                                        <a
                                            href="https://example.com/profile"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1 text-sm font-medium text-[#522DA6] hover:text-[#402285] transition-colors"
                                        >
                                            View profile
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5">
                                                <path fillRule="evenodd" d="M4.22 11.78a.75.75 0 0 1 0-1.06L9.44 5.5H5.75a.75.75 0 0 1 0-1.5h5.5a.75.75 0 0 1 .75.75v5.5a.75.75 0 0 1-1.5 0V6.56l-5.22 5.22a.75.75 0 0 1-1.06 0z" clipRule="evenodd" />
                                            </svg>
                                        </a>
                                    </div>

                                    {/* Metadata fields */}
                                    <div className="mt-4 grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
                                        <div className="flex justify-between py-1.5 border-b border-zinc-100">
                                            <span className="font-medium text-zinc-500">ID</span>
                                            <span className="text-zinc-900 font-mono text-xs">{p?.participantId}</span>
                                        </div>
                                        <div className="flex justify-between py-1.5 border-b border-zinc-100">
                                            <span className="font-medium text-zinc-500">Status</span>
                                            <span className={cx("rounded-md px-2 py-0.5 text-[10px] font-medium", statusTones[p?.status] || statusTones.Pending)}>
                                                {p?.status || "Pending"}
                                            </span>
                                        </div>
                                        <div className="flex justify-between py-1.5 border-b border-zinc-100">
                                            <span className="font-medium text-zinc-500">Headline</span>
                                            <span className="text-zinc-900 text-right">{p?.headline || "—"}</span>
                                        </div>
                                        <div className="flex justify-between py-1.5 border-b border-zinc-100">
                                            <span className="font-medium text-zinc-500">Company</span>
                                            <span className="text-zinc-900">{c?.name || "—"}</span>
                                        </div>
                                        <div className="flex justify-between py-1.5 border-b border-zinc-100">
                                            <span className="font-medium text-zinc-500">Type</span>
                                            <span className="text-zinc-900 text-right">{p?.type || "—"}</span>
                                        </div>
                                        <div className="flex justify-between py-1.5 border-b border-zinc-100">
                                            <span className="font-medium text-zinc-500">Role</span>
                                            <span className="text-zinc-900">{p?.role || "—"}</span>
                                        </div>
                                        <div className="flex justify-between py-1.5 border-b border-zinc-100">
                                            <span className="font-medium text-zinc-500">Email</span>
                                            <span className="text-zinc-900 text-right">{p?.email || "—"}</span>
                                        </div>
                                        <div className="flex justify-between py-1.5 border-b border-zinc-100">
                                            <span className="font-medium text-zinc-500">Phone</span>
                                            <span className="text-zinc-900">{p?.phone || "—"}</span>
                                        </div>
                                        {sharer && (
                                            <div className="flex justify-between py-1.5 border-b border-zinc-100">
                                                <span className="font-medium text-zinc-500">Sharer</span>
                                                <span className="text-zinc-900 font-mono text-xs">{sharer.id}</span>
                                            </div>
                                        )}
                                        {isExclusive && (
                                            <div className="flex justify-between py-1.5 border-b border-zinc-100">
                                                <span className="font-medium text-zinc-500">Exclusive</span>
                                                <span className="inline-flex items-center gap-1 text-amber-700 font-medium">Yes</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Stats */}
                                    <div className="mt-4 flex flex-wrap gap-3">
                                        <Stat label="Meetings" value={meetings.length} sub={belowTarget ? `Below ${MIN_MEETINGS_TARGET}` : "Across event"} className="flex-1 min-w-[180px]" />
                                        <Stat label="Avg. score" value={avgScore ? avgScore + "%" : "-"} sub="Match quality" className="flex-1 min-w-[180px]" />
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })()}

                {/* Company Details Dropdown */}
                {entityType === "company" && (() => {
                    const c = cById[entityId];
                    return (
                        <div className="mt-4">
                            <button
                                onClick={() => setDetailsOpen(!detailsOpen)}
                                className={cx(
                                    "w-full flex items-center justify-between px-4 py-2.5 bg-white border border-zinc-200 text-sm hover:bg-zinc-50 transition-colors",
                                    detailsOpen ? "rounded-t-xl border-b-0" : "rounded-xl"
                                )}
                            >
                                <span className="font-medium text-zinc-900">Company Details</span>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={`w-4 h-4 text-zinc-400 transition-transform duration-200 ${detailsOpen ? 'rotate-180' : ''}`}>
                                    <path fillRule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06z" clipRule="evenodd" />
                                </svg>
                            </button>
                            {detailsOpen && (
                                <div className="px-4 py-4 bg-white border border-zinc-200 rounded-b-xl animate-in fade-in slide-in-from-top-1 duration-150">
                                    {/* Company info */}
                                    <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
                                        <div className="flex justify-between py-1.5 border-b border-zinc-100">
                                            <span className="font-medium text-zinc-500">Company</span>
                                            <span className="text-zinc-900">{c?.name || "—"}</span>
                                        </div>
                                        <div className="flex justify-between py-1.5 border-b border-zinc-100">
                                            <span className="font-medium text-zinc-500">Category</span>
                                            <span className="text-zinc-900">{c?.category || "—"}</span>
                                        </div>
                                        <div className="flex justify-between py-1.5 border-b border-zinc-100">
                                            <span className="font-medium text-zinc-500">Team Size</span>
                                            <span className="text-zinc-900">{entityParticipants.length}</span>
                                        </div>
                                    </div>

                                    {/* Team Members */}
                                    {entityParticipants.length > 0 && (
                                        <div className="mt-4">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Team Members</span>
                                                <span className="text-xs text-zinc-400">({entityParticipants.length})</span>
                                            </div>
                                            <div className="flex flex-col gap-1">
                                                {entityParticipants.map(p => {
                                                    const isExclusive = evs.some(e => e.exclusive && (e.participantIds || []).includes(p.id));
                                                    const pMeetings = evs.filter(e => e.kind === "meeting" && (e.participantIds || []).includes(p.id));
                                                    const sharer = Object.values(SHARERS).find(s => (s.memberIds || []).includes(p.id));
                                                    const isExpanded = expandedMemberId === p.id;
                                                    const statusTones = { Accepted: "bg-emerald-100 text-emerald-700", Pending: "bg-amber-100 text-amber-700", Declined: "bg-rose-100 text-rose-700" };
                                                    return (
                                                        <div key={p.id} className={cx("rounded-lg border transition-colors", isExclusive ? "border-amber-200 bg-amber-50/50" : "border-zinc-100 bg-zinc-50/50")}>
                                                            <button
                                                                onClick={() => setExpandedMemberId(isExpanded ? null : p.id)}
                                                                className="w-full flex items-center justify-between px-2.5 py-2 text-xs hover:bg-zinc-100/50 rounded-lg transition-colors"
                                                            >
                                                                <div className="flex items-center gap-2">
                                                                    <div className="w-6 h-6 rounded-full bg-[#522DA6] text-white text-[9px] font-bold flex items-center justify-center flex-shrink-0">
                                                                        {initials(p.name)}
                                                                    </div>
                                                                    <span className="text-zinc-900 font-medium">{p.name}</span>
                                                                    <span className="text-zinc-400">{p.role}</span>
                                                                    <span className="text-zinc-300">·</span>
                                                                    <span className="text-zinc-500">{pMeetings.length} meetings</span>
                                                                    {isExclusive && <span className="text-amber-600">🔒</span>}
                                                                </div>
                                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={`w-3.5 h-3.5 text-zinc-400 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}>
                                                                    <path fillRule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06z" clipRule="evenodd" />
                                                                </svg>
                                                            </button>
                                                            {isExpanded && (
                                                                <div className="px-3 pb-3 pt-1 border-t border-zinc-100 animate-in fade-in slide-in-from-top-1 duration-150">
                                                                    <div className="flex items-center justify-between mb-2">
                                                                        <div className="flex items-center gap-2">
                                                                            <div className="w-8 h-8 rounded-full bg-[#522DA6] text-white text-xs font-bold flex items-center justify-center">
                                                                                {initials(p.name)}
                                                                            </div>
                                                                            <div>
                                                                                <div className="text-sm font-semibold text-zinc-900">{p.name}</div>
                                                                                <div className="text-xs text-zinc-500">{p.headline || p.role}</div>
                                                                            </div>
                                                                        </div>
                                                                        <a href="https://example.com/profile" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs font-medium text-[#522DA6] hover:text-[#402285] transition-colors">
                                                                            View profile
                                                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-3 h-3">
                                                                                <path fillRule="evenodd" d="M4.22 11.78a.75.75 0 0 1 0-1.06L9.44 5.5H5.75a.75.75 0 0 1 0-1.5h5.5a.75.75 0 0 1 .75.75v5.5a.75.75 0 0 1-1.5 0V6.56l-5.22 5.22a.75.75 0 0 1-1.06 0z" clipRule="evenodd" />
                                                                            </svg>
                                                                        </a>
                                                                    </div>
                                                                    <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-xs">
                                                                        <div className="flex justify-between py-1 border-b border-zinc-100">
                                                                            <span className="text-zinc-500">ID</span>
                                                                            <span className="text-zinc-900 font-mono">{p.participantId}</span>
                                                                        </div>
                                                                        <div className="flex justify-between py-1 border-b border-zinc-100">
                                                                            <span className="text-zinc-500">Status</span>
                                                                            <span className={cx("rounded-md px-1.5 py-0.5 text-[10px] font-medium", statusTones[p.status] || statusTones.Pending)}>{p.status || "Pending"}</span>
                                                                        </div>
                                                                        <div className="flex justify-between py-1 border-b border-zinc-100">
                                                                            <span className="text-zinc-500">Headline</span>
                                                                            <span className="text-zinc-900 text-right">{p.headline || "—"}</span>
                                                                        </div>
                                                                        <div className="flex justify-between py-1 border-b border-zinc-100">
                                                                            <span className="text-zinc-500">Company</span>
                                                                            <span className="text-zinc-900">{c?.name || "—"}</span>
                                                                        </div>
                                                                        <div className="flex justify-between py-1 border-b border-zinc-100">
                                                                            <span className="text-zinc-500">Type</span>
                                                                            <span className="text-zinc-900 text-right">{p.type || "—"}</span>
                                                                        </div>
                                                                        <div className="flex justify-between py-1 border-b border-zinc-100">
                                                                            <span className="text-zinc-500">Email</span>
                                                                            <span className="text-zinc-900 text-right">{p.email || "—"}</span>
                                                                        </div>
                                                                        <div className="flex justify-between py-1 border-b border-zinc-100">
                                                                            <span className="text-zinc-500">Phone</span>
                                                                            <span className="text-zinc-900">{p.phone || "—"}</span>
                                                                        </div>
                                                                        {sharer && (
                                                                            <div className="flex justify-between py-1 border-b border-zinc-100">
                                                                                <span className="text-zinc-500">Sharer</span>
                                                                                <span className="text-zinc-900 font-mono">{sharer.id}</span>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}

                                    {/* Stats */}
                                    <div className="mt-4 flex flex-wrap gap-3">
                                        <Stat label="Meetings" value={meetings.length} sub={belowTarget ? `Below ${MIN_MEETINGS_TARGET}` : "Across event"} className="flex-1 min-w-[180px]" />
                                        <Stat label="Avg. score" value={avgScore ? avgScore + "%" : "-"} sub="Match quality" className="flex-1 min-w-[180px]" />
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })()}

                {/* Sharer Details Dropdown */}
                {entityType === "sharer" && (() => {
                    const s = sharerById[entityId];
                    const c = cById[s?.companyId];
                    return (
                        <div className="mt-4">
                            <button
                                onClick={() => setDetailsOpen(!detailsOpen)}
                                className={cx(
                                    "w-full flex items-center justify-between px-4 py-2.5 bg-white border border-zinc-200 text-sm hover:bg-zinc-50 transition-colors",
                                    detailsOpen ? "rounded-t-xl border-b-0" : "rounded-xl"
                                )}
                            >
                                <span className="font-medium text-zinc-900">Sharer Details</span>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={`w-4 h-4 text-zinc-400 transition-transform duration-200 ${detailsOpen ? 'rotate-180' : ''}`}>
                                    <path fillRule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06z" clipRule="evenodd" />
                                </svg>
                            </button>
                            {detailsOpen && (
                                <div className="px-4 py-4 bg-white border border-zinc-200 rounded-b-xl animate-in fade-in slide-in-from-top-1 duration-150">
                                    {/* Sharer info */}
                                    <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
                                        <div className="flex justify-between py-1.5 border-b border-zinc-100">
                                            <span className="font-medium text-zinc-500">Sharer ID</span>
                                            <span className="text-zinc-900 font-mono text-xs">{entityId}</span>
                                        </div>
                                        <div className="flex justify-between py-1.5 border-b border-zinc-100">
                                            <span className="font-medium text-zinc-500">Company</span>
                                            <span className="text-zinc-900">{c?.name || "—"}</span>
                                        </div>
                                        <div className="flex justify-between py-1.5 border-b border-zinc-100">
                                            <span className="font-medium text-zinc-500">Members</span>
                                            <span className="text-zinc-900">{entityParticipants.length}</span>
                                        </div>
                                    </div>

                                    {/* Sharer Members */}
                                    {entityParticipants.length > 0 && (
                                        <div className="mt-4">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Sharer Members</span>
                                                <span className="text-xs text-zinc-400">({entityParticipants.length})</span>
                                            </div>
                                            <div className="flex flex-col gap-1">
                                                {entityParticipants.map(p => {
                                                    const isExclusive = evs.some(e => e.exclusive && (e.participantIds || []).includes(p.id));
                                                    const pMeetings = evs.filter(e => e.kind === "meeting" && (e.participantIds || []).includes(p.id));
                                                    const company = cById[p.companyId];
                                                    const isExpanded = expandedMemberId === p.id;
                                                    const statusTones = { Accepted: "bg-emerald-100 text-emerald-700", Pending: "bg-amber-100 text-amber-700", Declined: "bg-rose-100 text-rose-700" };
                                                    return (
                                                        <div key={p.id} className={cx("rounded-lg border transition-colors", isExclusive ? "border-amber-200 bg-amber-50/50" : "border-zinc-100 bg-zinc-50/50")}>
                                                            <button
                                                                onClick={() => setExpandedMemberId(isExpanded ? null : p.id)}
                                                                className="w-full flex items-center justify-between px-2.5 py-2 text-xs hover:bg-zinc-100/50 rounded-lg transition-colors"
                                                            >
                                                                <div className="flex items-center gap-2">
                                                                    <div className="w-6 h-6 rounded-full bg-[#522DA6] text-white text-[9px] font-bold flex items-center justify-center flex-shrink-0">
                                                                        {initials(p.name)}
                                                                    </div>
                                                                    <span className="text-zinc-900 font-medium">{p.name}</span>
                                                                    <span className="text-zinc-400">{p.role}</span>
                                                                    <span className="text-zinc-300">·</span>
                                                                    <span className="text-zinc-500">{pMeetings.length} meetings</span>
                                                                    {isExclusive && <span className="text-amber-600">🔒</span>}
                                                                </div>
                                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={`w-3.5 h-3.5 text-zinc-400 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}>
                                                                    <path fillRule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06z" clipRule="evenodd" />
                                                                </svg>
                                                            </button>
                                                            {isExpanded && (
                                                                <div className="px-3 pb-3 pt-1 border-t border-zinc-100 animate-in fade-in slide-in-from-top-1 duration-150">
                                                                    <div className="flex items-center justify-between mb-2">
                                                                        <div className="flex items-center gap-2">
                                                                            <div className="w-8 h-8 rounded-full bg-[#522DA6] text-white text-xs font-bold flex items-center justify-center">
                                                                                {initials(p.name)}
                                                                            </div>
                                                                            <div>
                                                                                <div className="text-sm font-semibold text-zinc-900">{p.name}</div>
                                                                                <div className="text-xs text-zinc-500">{p.headline || p.role}</div>
                                                                            </div>
                                                                        </div>
                                                                        <a href="https://example.com/profile" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs font-medium text-[#522DA6] hover:text-[#402285] transition-colors">
                                                                            View profile
                                                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-3 h-3">
                                                                                <path fillRule="evenodd" d="M4.22 11.78a.75.75 0 0 1 0-1.06L9.44 5.5H5.75a.75.75 0 0 1 0-1.5h5.5a.75.75 0 0 1 .75.75v5.5a.75.75 0 0 1-1.5 0V6.56l-5.22 5.22a.75.75 0 0 1-1.06 0z" clipRule="evenodd" />
                                                                            </svg>
                                                                        </a>
                                                                    </div>
                                                                    <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-xs">
                                                                        <div className="flex justify-between py-1 border-b border-zinc-100">
                                                                            <span className="text-zinc-500">ID</span>
                                                                            <span className="text-zinc-900 font-mono">{p.participantId}</span>
                                                                        </div>
                                                                        <div className="flex justify-between py-1 border-b border-zinc-100">
                                                                            <span className="text-zinc-500">Status</span>
                                                                            <span className={cx("rounded-md px-1.5 py-0.5 text-[10px] font-medium", statusTones[p.status] || statusTones.Pending)}>{p.status || "Pending"}</span>
                                                                        </div>
                                                                        <div className="flex justify-between py-1 border-b border-zinc-100">
                                                                            <span className="text-zinc-500">Headline</span>
                                                                            <span className="text-zinc-900 text-right">{p.headline || "—"}</span>
                                                                        </div>
                                                                        <div className="flex justify-between py-1 border-b border-zinc-100">
                                                                            <span className="text-zinc-500">Company</span>
                                                                            <span className="text-zinc-900">{company?.name || "—"}</span>
                                                                        </div>
                                                                        <div className="flex justify-between py-1 border-b border-zinc-100">
                                                                            <span className="text-zinc-500">Type</span>
                                                                            <span className="text-zinc-900 text-right">{p.type || "—"}</span>
                                                                        </div>
                                                                        <div className="flex justify-between py-1 border-b border-zinc-100">
                                                                            <span className="text-zinc-500">Email</span>
                                                                            <span className="text-zinc-900 text-right">{p.email || "—"}</span>
                                                                        </div>
                                                                        <div className="flex justify-between py-1 border-b border-zinc-100">
                                                                            <span className="text-zinc-500">Phone</span>
                                                                            <span className="text-zinc-900">{p.phone || "—"}</span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}

                                    {/* Stats */}
                                    <div className="mt-4 flex flex-wrap gap-3">
                                        <Stat label="Meetings" value={meetings.length} sub={belowTarget ? `Below ${MIN_MEETINGS_TARGET}` : "Across event"} className="flex-1 min-w-[180px]" />
                                        <Stat label="Avg. score" value={avgScore ? avgScore + "%" : "-"} sub="Match quality" className="flex-1 min-w-[180px]" />
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })()}



                {/* Controls: Layout Refactor */}
                < div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-b border-zinc-100 pb-4" >
                    {/* Left: View Toggle & Date Nav */}
                    < div className="flex items-center gap-4" >
                        {/* View Toggle */}
                        < div className="flex rounded-xl border border-zinc-200 bg-zinc-50 p-1" >
                            <button
                                onClick={() => setViewMode("calendar")}
                                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${viewMode === "calendar" ? "bg-white shadow-sm text-zinc-900" : "text-zinc-500 hover:text-zinc-700"}`}
                            >
                                Calendar
                            </button>
                            <button
                                onClick={() => setViewMode("list")}
                                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${viewMode === "list" ? "bg-white shadow-sm text-zinc-900" : "text-zinc-500 hover:text-zinc-700"}`}
                            >
                                List
                            </button>
                        </div >

                        <div className="h-6 w-px bg-zinc-200" />

                        {/* Date Navigation */}
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => navigateDays(-1)}
                                className="rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-600 hover:bg-zinc-50"
                            >
                                ← Prev
                            </button>
                            <div className="text-sm font-semibold text-zinc-900 min-w-[120px] text-center">
                                {fmtDayLabel(days[0])} - {fmtDayLabel(days[2])}
                            </div>
                            <button
                                onClick={() => navigateDays(1)}
                                className="rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-600 hover:bg-zinc-50"
                            >
                                Next →
                            </button>
                        </div>
                    </div >

                    {/* Right: Filters */}
                    < div className="flex items-center gap-3" >
                        {/* Location Filter */}
                        < select
                            value={locationFilter}
                            onChange={(e) => setLocationFilter(e.target.value)}
                            className="px-3 py-2 bg-white border border-zinc-200 rounded-lg text-sm font-medium text-zinc-700 hover:bg-zinc-50 shadow-sm cursor-pointer"
                        >
                            <option value="">All Locations</option>
                            {
                                uniqueLocations.map(v => (
                                    <option key={v} value={v}>{v}</option>
                                ))
                            }
                        </select >

                        {/* Type Filter */}
                        < select
                            value={typeFilter}
                            onChange={(e) => setTypeFilter(e.target.value)}
                            className="px-3 py-2 bg-white border border-zinc-200 rounded-lg text-sm font-medium text-zinc-700 hover:bg-zinc-50 shadow-sm cursor-pointer"
                        >
                            <option value="">All Types</option>
                            <option value="mustMeet">MustMeet</option>
                            <option value="oneToOne">1:1</option>
                        </select >

                        {/* Score Filter */}
                        < select
                            value={scoreFilter}
                            onChange={(e) => setScoreFilter(e.target.value)}
                            className="px-3 py-2 bg-white border border-zinc-200 rounded-lg text-sm font-medium text-zinc-700 hover:bg-zinc-50 shadow-sm cursor-pointer"
                        >
                            <option value="">All Scores</option>
                            <option value="high">High (90+)</option>
                            <option value="medium">Medium (75-89)</option>
                            <option value="low">Low (&lt;75)</option>
                        </select >


                    </div >
                </div >

                {/* Viewing Context Bar - positioned above calendar */}
                {(entityType === "sharer" || entityType === "company") && (
                    <div className="mt-6 flex items-center justify-between bg-white border border-zinc-200 rounded-t-xl px-4 py-2.5">
                        <span className="text-sm text-zinc-500">
                            On this page you can manage meetings on behalf of your {entityType === 'sharer' ? 'sharers' : 'team members'}.
                        </span>
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-zinc-500">Currently viewing as:</span>
                            <select
                                value={selectedParticipantIds?.[0] || "all"}
                                onChange={(e) => {
                                    if (e.target.value === "all") {
                                        selectAllParticipants();
                                    } else {
                                        setSelectedParticipantIds([e.target.value]);
                                    }
                                }}
                                className="px-3 py-1.5 bg-white border border-zinc-200 rounded-lg text-sm font-semibold text-[#522DA6] cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#522DA6]/20"
                            >
                                <option value="all">All {entityType === 'sharer' ? 'Sharers' : 'Team Members'}</option>
                                {entityParticipants.map(p => (
                                    <option key={p.id} value={p.id}>{p.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                )}

                <div className={cx("grid grid-cols-1 gap-0 lg:grid-cols-3", (entityType === "sharer" || entityType === "company") ? "" : "mt-6")}>
                    <div className="lg:col-span-2">
                        {viewMode === "calendar" ? (
                            <TimeStreamCalendar
                                events={filteredEvs}
                                days={days}
                                selectedEventId={selectedEventId}
                                onSelectEvent={setSelectedEventId}
                                onCreateEvent={(date, time) => setActiveModal({ type: 'create_type_select', data: { date, time } })}
                                noTopRounded={(entityType === "sharer" || entityType === "company")}
                            />
                        ) : (
                            <MeetingListView
                                events={filteredEvs}
                                pById={pById}
                                onSelectEvent={setSelectedEventId}
                                selectedEventId={selectedEventId}
                                selectedIds={selectedEventIds}
                                onToggleSelect={handleToggleSelect}
                                onSelectAll={handleSelectAll}
                            />
                        )}
                    </div>
                    <div>
                        <DetailSidePanel
                            entityType={entityType}
                            entityId={entityId}
                            selectedEventId={selectedEventId}
                            noTopRounded={(entityType === "sharer" || entityType === "company")}
                            onAction={(action, event) => {
                                if (action === 'swap') {
                                    // Generate candidates - include participants and sharers
                                    const participantCandidates = PARTICIPANTS
                                        .filter(p => !event.participantIds.includes(p.id))
                                        .map(p => ({
                                            id: p.id,
                                            companyName: cById[p.companyId]?.name,
                                            name: p.name,
                                            role: p.role,
                                            group: "Suppliers",
                                            scheduled: Math.floor(Math.random() * 5),
                                            availability: Math.floor(Math.random() * 10) + 10,
                                            targets: `${Math.floor(Math.random() * 5)} - ${Math.floor(Math.random() * 10) + 5}`,
                                            matchScore: Math.floor(Math.random() * 40) + 60,
                                            metBefore: Math.random() > 0.7,
                                        }));

                                    // Add sharers (showing dual contact names)
                                    const sharerCandidates = SHARERS
                                        .filter(s => s.id !== event.sharerId)
                                        .map(s => {
                                            const members = s.memberIds.map(mid => pById[mid]?.name).filter(Boolean);
                                            return {
                                                id: s.id,
                                                companyName: cById[s.companyId]?.name,
                                                contactNames: members,
                                                name: members[0] || "Unknown",
                                                role: pById[s.memberIds[0]]?.role === "Buyer" ? "Buyer" : "Supplier",
                                                group: pById[s.memberIds[0]]?.role === "Buyer" ? "Buyers" : "Suppliers",
                                                scheduled: Math.floor(Math.random() * 5),
                                                availability: Math.floor(Math.random() * 10) + 10,
                                                targets: "-",
                                                matchScore: Math.floor(Math.random() * 40) + 60,
                                                metBefore: Math.random() > 0.5,
                                            };
                                        });

                                    const candidates = [...participantCandidates, ...sharerCandidates];
                                    setActiveModal({ type: action, data: event, candidates });
                                } else {
                                    setActiveModal({ type: action, data: event });
                                }
                            }}
                            events={events}
                        />
                    </div>
                </div>

                {/* Sidebar Modals */}
                {
                    activeModal?.type === 'swap' && (
                        <SwapAttendeeModal
                            event={activeModal.data}
                            candidates={activeModal.candidates || []}
                            onClose={() => setActiveModal(null)}
                            onConfirm={(candidate) => {
                                onEventAction('swap', {
                                    event: activeModal.data,
                                    newParticipantId: candidate.id
                                });
                                setActiveModal(null);
                            }}
                        />
                    )
                }
                {
                    activeModal?.type === 'edit' && (
                        <EditModal
                            event={activeModal.data}
                            allParticipants={PARTICIPANTS}
                            onClose={() => setActiveModal(null)}
                            onSave={(updatedEvent) => {
                                onEventAction('edit', updatedEvent);
                                setActiveModal(null);
                            }}
                        />
                    )
                }
                {
                    activeModal?.type === 'create' && (
                        <CreateMeetingModal
                            date={activeModal.data.date}
                            time={activeModal.data.time}
                            fixedType={activeModal.fixedType}
                            organizerType={entityType}
                            organizerId={entityId}
                            organizerEvents={allEvs}
                            allParticipants={PARTICIPANTS}
                            allSharers={SHARERS}
                            onClose={() => setActiveModal(null)}
                            onSave={(newEvent) => {
                                onEventAction('create', {
                                    ...newEvent,
                                    // Ensure proper linking based on current view/context if possible, 
                                    // or rely on modal filling participant info.
                                    // For now, modal output should suffice for structure
                                });
                                setActiveModal(null);
                            }}
                        />
                    )
                }
                {
                    activeModal?.type === 'delete' && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                            <div className="w-full max-w-sm bg-white p-6 rounded-2xl shadow-xl">
                                <h3 className="text-lg font-bold mb-2">Delete Meeting?</h3>
                                <p className="text-sm text-zinc-500 mb-4">This action cannot be undone.</p>
                                <div className="flex gap-3">
                                    <button onClick={() => setActiveModal(null)} className="flex-1 py-2 bg-zinc-100 rounded-lg font-medium">Cancel</button>
                                    <button onClick={() => {
                                        onEventAction('delete', activeModal.data.id);
                                        setActiveModal(null);
                                    }} className="flex-1 py-2 bg-red-600 text-white rounded-lg font-medium">Delete</button>
                                </div>
                            </div>
                        </div>
                    )
                }
                {
                    activeModal?.type === 'confirm_custom' && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                            <div className="w-full max-w-sm bg-white p-6 rounded-2xl shadow-xl animate-in fade-in zoom-in-95 duration-150">
                                <h3 className="text-lg font-bold mb-2">{activeModal.title}</h3>
                                <p className="text-sm text-zinc-500 mb-4">{activeModal.message || 'Are you sure?'}</p>
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setActiveModal(null)}
                                        className="flex-1 py-2 bg-zinc-100 rounded-lg font-medium hover:bg-zinc-200 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={() => {
                                            activeModal.onConfirm?.();
                                            setActiveModal(null);
                                        }}
                                        className="flex-1 py-2 bg-rose-600 text-white rounded-lg font-medium hover:bg-rose-700 transition-colors"
                                    >
                                        Confirm
                                    </button>
                                </div>
                            </div>
                        </div>
                    )
                }
                {
                    activeModal?.type === 'create_type_select' && (
                        <MeetingTypeModal
                            onClose={() => setActiveModal(null)}
                            onSelect={(type) => {
                                if (type === 'oneToOne') {
                                    // Pass through the date/time from the initial click (activeModal.data)
                                    setActiveModal({
                                        type: 'create',
                                        data: activeModal.data || { date: days[0], time: "09:00" },
                                        fixedType: "oneToOne"
                                    });
                                } else {
                                    // Generate MustMeet Candidates
                                    const candidates = PARTICIPANTS.slice(0, 8).map(p => ({
                                        id: p.id,
                                        companyName: cById[p.companyId]?.name,
                                        name: p.name,
                                        role: p.role,
                                        group: "Suppliers",
                                        matchScore: Math.floor(Math.random() * 30) + 70, // 70-100
                                    })).sort((a, b) => b.matchScore - a.matchScore);

                                    // Pass date/time here too if we want MustMeet to respect the slot
                                    setActiveModal({
                                        type: 'create_mustmeet_select',
                                        candidates,
                                        data: activeModal.data // forward date/time
                                    });
                                }
                            }}
                        />
                    )
                }
                {
                    activeModal?.type === 'create_mustmeet_select' && (
                        <MustMeetModal
                            candidates={activeModal.candidates}
                            organizerEvents={allEvs}
                            onClose={() => setActiveModal(null)}
                            onConfirm={(candidate) => {
                                // 1. Try to use the selected slot
                                const [selStart, selEnd] = candidate.time.split(' - ');
                                const candidateEvents = eventsFor(events, "participant", candidate.id);

                                const isBusy = candidateEvents.some(e =>
                                    e.date === candidate.date &&
                                    e.start < selEnd &&
                                    e.end > selStart
                                );

                                let finalSlot = { date: candidate.date, start: selStart, end: selEnd };

                                if (isBusy) {
                                    // 2. Conflict: Find next available gap
                                    const gap = findFirstAvailableSlot(events, entityId, candidate.id);
                                    if (!gap) {
                                        toast.error("No available slots found for both participants.");
                                        return;
                                    }
                                    finalSlot = gap;
                                    toast.info(`Selected time unavailable. Moved to ${gap.date} ${gap.start}.`);
                                }

                                onEventAction('create', {
                                    kind: "meeting",
                                    meetingType: "mustMeet",
                                    date: finalSlot.date,
                                    start: finalSlot.start,
                                    end: finalSlot.end,
                                    venue: "Meeting Pods",
                                    venueGroup: "Pods",
                                    participantIds: [entityId, candidate.id], // Organizer + Selected
                                    score: candidate.matchScore,
                                    exclusive: true,
                                    metBefore: false,
                                });
                                setActiveModal(null);
                            }}
                        />
                    )
                }
            </div>

            {/* Individual Generate Schedule Modal */}
            {showGenerateModal && (
                <IndividualGenerateModal
                    title={title}
                    entityType={entityType}
                    entityId={entityId}
                    events={events}
                    setEvents={setEvents}
                    onlyMustMeet={onlyMustMeet}
                    onClose={() => setShowGenerateModal(false)}
                    pById={pById}
                    cById={cById}
                    sharerById={sharerById}
                />
            )}
        </div>
    );
}

// ── Individual Generate Modal (Side Panel) ──
function IndividualGenerateModal({ title, entityType, entityId, events, setEvents, onlyMustMeet, onClose, pById, cById, sharerById }) {
    const [step, setStep] = useState('validation'); // 'validation' | 'setup'
    // Validation state
    const [validationStatus, setValidationStatus] = useState('running'); // 'running' | 'done'
    const [validationErrors, setValidationErrors] = useState([]);
    const [validationWarnings, setValidationWarnings] = useState([]);
    const [dismissedIds, setDismissedIds] = useState([]);
    const [errorsOpen, setErrorsOpen] = useState(true);
    const [warningsOpen, setWarningsOpen] = useState(true);
    // Setup state
    const [includeSession, setIncludeSession] = useState(true);
    const [selectedLocations, setSelectedLocations] = useState([]);
    const [dateRangeStart, setDateRangeStart] = useState('');
    const [dateRangeEnd, setDateRangeEnd] = useState('');
    const [timeRangeStart, setTimeRangeStart] = useState('09:00');
    const [timeRangeEnd, setTimeRangeEnd] = useState('17:00');

    const LOCATION_OPTIONS = ['Room A', 'Room B', 'Room C', 'Room D', 'Hall 1', 'Hall 2', 'Hall 3', 'Hall 4', 'Meeting Pods', 'VIP Lounge', 'Conference Room'];

    const MODAL_STEPS = [
        { id: 'validation', label: 'Validation' },
        { id: 'setup', label: 'Setup' },
    ];

    // Auto-run validation on mount
    useEffect(() => {
        setValidationStatus('running');
        const timer = setTimeout(() => {
            // Simulated validation results for individual generation
            const roll = Math.random();
            if (roll > 0.7) {
                setValidationErrors([]);
                setValidationWarnings([
                    { id: 'w1', message: 'Profile has limited availability — only 4 open slots remaining', hint: 'Check availability in the Profile list.' },
                    { id: 'w2', message: 'No meeting preferences set for this profile. Matches may be lower quality.', hint: 'Review preferences in the Profile list.' },
                ]);
            } else if (roll > 0.4) {
                setValidationErrors([]);
                setValidationWarnings([]);
            } else {
                setValidationErrors([
                    { id: 'e1', message: 'Profile is missing a required exhibitor_id. Please add one before generating.', hint: 'Go to the Profile list to update this profile.' },
                ]);
                setValidationWarnings([
                    { id: 'w1', message: 'Profile has limited availability — only 4 open slots remaining', hint: 'Check availability in the Profile list.' },
                ]);
            }
            setValidationStatus('done');
        }, 1200);
        return () => clearTimeout(timer);
    }, [entityId]);

    // Determine subtitle
    let subtitle = '';
    if (entityType === 'participant') {
        const p = pById[entityId];
        subtitle = p ? `${p.name} — ${cById[p.companyId]?.name || ''}` : '';
    } else if (entityType === 'company') {
        const c = cById[entityId];
        subtitle = c?.name || '';
    } else if (entityType === 'sharer') {
        const s = sharerById[entityId];
        subtitle = s ? `Sharer ${entityId}` : '';
    }

    const errors = validationErrors.filter(e => !dismissedIds.includes(e.id));
    const warnings = validationWarnings.filter(w => !dismissedIds.includes(w.id));
    const hasErrors = errors.length > 0;
    const isClean = !hasErrors && warnings.length === 0;
    const canContinueValidation = validationStatus === 'done' && !hasErrors;

    // Auto-skip to setup when no issues
    useEffect(() => {
        if (validationStatus === 'done' && isClean) {
            setStep('setup');
        }
    }, [validationStatus, isClean]);

    const handleGenerate = () => {
        // Get participant IDs for this entity
        let entityParticipantIds = [];
        if (entityType === 'participant') {
            entityParticipantIds = [entityId];
        } else if (entityType === 'company') {
            entityParticipantIds = PARTICIPANTS.filter(p => p.companyId === entityId).map(p => p.id);
        } else if (entityType === 'sharer') {
            const sharer = sharerById[entityId];
            entityParticipantIds = sharer?.memberIds || [];
        }

        const possiblePeers = PARTICIPANTS.filter(p => !entityParticipantIds.includes(p.id));
        const newEvents = [];

        for (let dayOffset = 0; dayOffset < 3; dayOffset++) {
            entityParticipantIds.forEach((participantId, pIdx) => {
                for (let i = 0; i < 3; i++) {
                    const peer = possiblePeers[Math.floor(Math.random() * possiblePeers.length)] || PARTICIPANTS[0];
                    const combinedEvents = [...events, ...newEvents];
                    const slot = findFirstAvailableSlot(combinedEvents, participantId, peer.id);
                    if (slot) {
                        newEvents.push({
                            id: `gen_${Date.now()}_${dayOffset}_${pIdx}_${i}`,
                            kind: 'meeting',
                            meetingType: onlyMustMeet ? 'mustMeet' : Math.random() > 0.5 ? 'mustMeet' : 'oneToOne',
                            date: slot.date,
                            start: slot.start,
                            end: slot.end,
                            venue: 'Meeting Pods',
                            venueGroup: 'Pods',
                            participantIds: [participantId, peer.id],
                            companyIds: entityType === 'company' ? [entityId] : [],
                            sharerId: entityType === 'sharer' ? entityId : null,
                            score: Math.floor(Math.random() * 20) + 80,
                            exclusive: false,
                            metBefore: false,
                        });
                    }
                }
            });
        }

        setEvents(prev => [...prev, ...newEvents]);
        onClose();
        toast.info('Meetings will appear shortly \u2014 refresh the page to see an updated schedule');
    };


    return (
        <>
            {/* Backdrop */}
            <div className="fixed inset-0 bg-black/30 z-[60]" onClick={onClose} />

            {/* Sidebar Panel */}
            <div className="fixed right-0 top-0 bottom-0 w-[440px] bg-white z-[70] shadow-2xl flex flex-col">
                {/* Header */}
                <div className="px-6 py-4 border-b border-zinc-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-lg font-semibold text-zinc-900">Generate Schedule</h2>
                            {subtitle && <p className="text-sm text-zinc-500">{subtitle}</p>}
                        </div>
                        <button onClick={onClose} className="text-zinc-400 hover:text-zinc-600">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                        </button>
                    </div>
                    {/* Step indicator */}
                    <div className="flex items-center gap-1.5 mt-2 text-xs text-zinc-400">
                        {MODAL_STEPS.map((s, i) => (
                            <React.Fragment key={s.id}>
                                <span className={`font-medium ${s.id === step ? 'text-[#522DA6]' : MODAL_STEPS.findIndex(x => x.id === step) > i ? 'text-zinc-700' : ''}`}>
                                    {s.label}
                                </span>
                                {i < MODAL_STEPS.length - 1 && <span className="text-zinc-300">{'>'}</span>}
                            </React.Fragment>
                        ))}
                    </div>
                </div>

                {/* Step 1: Validation */}
                {step === 'validation' && (
                    <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
                        <div>
                            <h3 className="text-sm font-semibold text-zinc-900">Data validation</h3>
                            <p className="text-xs text-zinc-500 mt-0.5">Checking data for issues that could affect schedule generation.</p>
                        </div>

                        {/* Loading */}
                        {validationStatus === 'running' && (
                            <div className="flex flex-col items-center justify-center py-12 border border-zinc-200 rounded-xl bg-zinc-50/50">
                                <svg className="animate-spin" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#522DA6" strokeWidth="2"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
                                <p className="text-sm font-medium text-zinc-600 mt-3">Validating data...</p>
                            </div>
                        )}

                        {/* All clear */}
                        {validationStatus === 'done' && isClean && (
                            <div className="flex flex-col items-center justify-center py-10 text-center">
                                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg>
                                <p className="text-sm font-semibold text-zinc-900 mt-3">All clear</p>
                                <p className="text-xs text-zinc-500 mt-1">No issues found. Ready to configure.</p>
                            </div>
                        )}

                        {/* Errors accordion */}
                        {validationStatus === 'done' && errors.length > 0 && (
                            <div className="border border-rose-200 rounded-xl overflow-hidden">
                                <button onClick={() => setErrorsOpen(!errorsOpen)} className="w-full flex items-center justify-between px-4 py-3 bg-rose-50 hover:bg-rose-100/80 transition-colors">
                                    <span className="flex items-center gap-2 text-xs font-semibold text-rose-700">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
                                        {errors.length} Error{errors.length > 1 ? 's' : ''} — must be fixed
                                    </span>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`text-rose-400 transition-transform ${errorsOpen ? 'rotate-90' : ''}`}><polyline points="9 18 15 12 9 6"/></svg>
                                </button>
                                {errorsOpen && (
                                    <div className="divide-y divide-rose-100">
                                        {errors.map(err => (
                                            <div key={err.id} className="flex items-start gap-2 px-4 py-3 bg-white">
                                                <div className="flex-1">
                                                    <p className="text-xs text-rose-900">{err.message}</p>
                                                    {err.hint && <p className="text-xs text-rose-600 mt-1">{err.hint}</p>}
                                                </div>
                                                <button onClick={() => setDismissedIds(d => [...d, err.id])} className="text-xs text-rose-400 hover:text-rose-600 shrink-0">Dismiss</button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Warnings accordion */}
                        {validationStatus === 'done' && warnings.length > 0 && (
                            <div className="border border-amber-200 rounded-xl overflow-hidden">
                                <button onClick={() => setWarningsOpen(!warningsOpen)} className="w-full flex items-center justify-between px-4 py-3 bg-amber-50 hover:bg-amber-100/80 transition-colors">
                                    <span className="flex items-center gap-2 text-xs font-semibold text-amber-700">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                                        {warnings.length} Warning{warnings.length > 1 ? 's' : ''}
                                    </span>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`text-amber-400 transition-transform ${warningsOpen ? 'rotate-90' : ''}`}><polyline points="9 18 15 12 9 6"/></svg>
                                </button>
                                {warningsOpen && (
                                    <div className="divide-y divide-amber-100">
                                        {warnings.map(w => (
                                            <div key={w.id} className="flex items-start gap-2 px-4 py-3 bg-white">
                                                <div className="flex-1">
                                                    <p className="text-xs text-amber-900">{w.message}</p>
                                                    {w.hint && <p className="text-xs text-amber-600 mt-1">{w.hint}</p>}
                                                </div>
                                                <button onClick={() => setDismissedIds(d => [...d, w.id])} className="text-xs text-amber-400 hover:text-amber-600 shrink-0">Dismiss</button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {/* Step 2: Setup */}
                {step === 'setup' && (
                    <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
                        <div>
                            <h3 className="text-sm font-semibold text-zinc-900">Configure generation</h3>
                            <p className="text-xs text-zinc-500 mt-0.5">Choose how the schedule should be generated for this {entityType}.</p>
                        </div>

                        {/* Toggles */}
                        <ModalToggle checked={includeSession} onChange={setIncludeSession} label="Include session attendance" description="Create meetings in time slots occupied by sessions." />

                        {/* Multi-selects */}
                        <ModalMultiSelect label="Restrict to locations" options={LOCATION_OPTIONS} selected={selectedLocations} onChange={setSelectedLocations} placeholder="All locations" />

                        {/* Date/Time Range */}
                        <div className="space-y-3">
                            <label className="block text-sm font-medium text-zinc-900">Restrict to date/time range</label>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs text-zinc-500 mb-1">Start date</label>
                                    <input type="date" value={dateRangeStart} onChange={e => setDateRangeStart(e.target.value)} className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-[#522DA6]/20 focus:border-[#522DA6]" />
                                </div>
                                <div>
                                    <label className="block text-xs text-zinc-500 mb-1">End date</label>
                                    <input type="date" value={dateRangeEnd} onChange={e => setDateRangeEnd(e.target.value)} className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-[#522DA6]/20 focus:border-[#522DA6]" />
                                </div>
                                <div>
                                    <label className="block text-xs text-zinc-500 mb-1">Start time</label>
                                    <input type="time" value={timeRangeStart} onChange={e => setTimeRangeStart(e.target.value)} className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-[#522DA6]/20 focus:border-[#522DA6]" />
                                </div>
                                <div>
                                    <label className="block text-xs text-zinc-500 mb-1">End time</label>
                                    <input type="time" value={timeRangeEnd} onChange={e => setTimeRangeEnd(e.target.value)} className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-[#522DA6]/20 focus:border-[#522DA6]" />
                                </div>
                            </div>
                        </div>
                    </div>
                )}


                {/* Footer */}
                <div className="px-6 py-4 border-t border-zinc-200 flex items-center justify-between">
                    <button
                        onClick={() => {
                            if (step === 'validation') onClose();
                            else if (step === 'setup') setStep('validation');
                        }}
                        className="px-4 py-2 text-sm font-medium text-zinc-600 hover:text-zinc-900"
                    >
                        {step === 'validation' ? 'Cancel' : 'Back'}
                    </button>
                    <div className="flex items-center gap-2">
                        {step === 'validation' && validationStatus === 'done' && (
                            <button
                                onClick={() => { setValidationStatus('running'); setDismissedIds([]); setValidationErrors([]); setValidationWarnings([]); setTimeout(() => {
                                    const roll = Math.random();
                                    if (roll > 0.7) { setValidationErrors([]); setValidationWarnings([{ id: 'w1', message: 'Profile has limited availability — only 4 open slots remaining', hint: 'Check availability in the Profile list.' }]); }
                                    else { setValidationErrors([]); setValidationWarnings([]); }
                                    setValidationStatus('done');
                                }, 1200); }}
                                className="px-3 py-2 border border-zinc-200 rounded-lg text-xs font-medium text-zinc-700 hover:bg-zinc-50"
                            >
                                Re-validate
                            </button>
                        )}
                        {step === 'validation' && (
                            <button
                                onClick={() => setStep('setup')}
                                disabled={!canContinueValidation}
                                className={`px-5 py-2 rounded-lg text-sm font-medium ${canContinueValidation ? 'bg-[#522DA6] text-white hover:bg-[#422389]' : 'bg-zinc-100 text-zinc-400 cursor-not-allowed'}`}
                            >
                                {validationStatus === 'running' ? 'Validating...' : hasErrors ? 'Fix errors to continue' : 'Continue'}
                            </button>
                        )}
                        {step === 'setup' && (
                            <button onClick={handleGenerate} className="px-5 py-2 bg-[#522DA6] text-white rounded-lg text-sm font-medium hover:bg-[#422389]">
                                Generate Schedule
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

// ── Modal helper components ──
function ModalToggle({ checked, onChange, label, description }) {
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

function ModalMultiSelect({ label, options, selected, onChange, placeholder }) {
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
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
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

export default function ScheduleViewPage({ navigate: hubNavigate }) {
    const [events, setEvents] = useState(EVENTS);

    // Initialize state from localStorage if available
    const [route, setRoute] = useState({ page: "main" });
    const [tourActive, setTourActive] = useState(false);
    const [tourStep, setTourStep] = useState(0);
    const [onlyMustMeet, setOnlyMustMeet] = useState(true); // Pre-ticked MustMeet Focus

    const handleEventAction = useCallback((action, payload) => {
        console.log("handleEventAction received:", action, payload);
        if (action === "swap") {
            const { event, newParticipantId } = payload;
            setEvents(prev => prev.map(e => e.id === event.id ? {
                ...e,
                // Simple Replace: Remove first 'other' participant and add new one
                // In a real app we'd know exactly which participant slot to swap
                participantIds: [newParticipantId, ...e.participantIds.slice(1)]
            } : e));
            toast.success("Meeting attendees swapped successfully");
        } else if (action === "edit") {
            setEvents(prev => prev.map(e => e.id === payload.id ? { ...e, ...payload } : e));
            toast.success("Meeting updated successfully");
        } else if (action === "create") {
            setEvents(prev => [...prev, { ...payload, id: `m${Date.now()}`, kind: "meeting" }]);
            toast.success("Meeting created successfully");
        } else if (action === "delete") {
            setEvents(prev => prev.filter(e => e.id !== payload));
            toast.success("Meeting deleted successfully");
        } else if (action === "bulkDelete") {
            // Payload is array of IDs
            setEvents(prev => prev.filter(e => !payload.includes(e.id)));
            toast.success(`Deleted ${payload.length} meetings successfully`);
        }
    }, []);

    useEffect(() => {
        const handlePopState = (e) => {
            if (route.page === "detail") {
                setRoute({ page: "main" });
            }
        };
        window.addEventListener("popstate", handlePopState);
        return () => window.removeEventListener("popstate", handlePopState);
    }, [route.page]);

    const openDetail = useCallback((entityType, entityId) => {
        window.history.pushState({ detail: true }, "");
        setRoute({ page: "detail", entityType, entityId });
        // Auto-advance tour if on click-row step
        if (tourActive && TOUR_STEPS[tourStep]?.action === "click") {
            setTourStep((s) => s + 1);
        }
    }, [tourActive, tourStep]);

    const handleTourNext = useCallback(() => {
        if (tourStep < TOUR_STEPS.length - 1) {
            setTourStep((s) => s + 1);
        } else {
            setTourActive(false);
            setTourStep(0);
        }
    }, [tourStep]);

    const handleTourSkip = useCallback(() => {
        setTourActive(false);
        setTourStep(0);
    }, []);

    const startTour = () => {
        setRoute({ page: "main" });
        setTourStep(0);
        setTourActive(true);
    };

    const isDetailPage = route.page === "detail";

    return (
        <div className="min-h-screen bg-zinc-50">


            {/* Tour Overlay */}
            {tourActive ? (
                <TourOverlay
                    step={tourStep}
                    onNext={handleTourNext}
                    onSkip={handleTourSkip}
                    isDetailPage={isDetailPage}
                />
            ) : null}

            {/* Main Content */}
            {
                isDetailPage ? (
                    <DetailPage
                        entityType={route.entityType}
                        entityId={route.entityId}
                        onBack={() => window.history.back()}
                        events={events}
                        setEvents={setEvents} // Pass setter for Generate Schedule
                        onlyMustMeet={onlyMustMeet}
                        onEventAction={handleEventAction}
                    />
                ) : (
                    <DashboardShell navigate={hubNavigate}>
                        <MainSchedules
                            onOpenDetail={openDetail}
                            tourActive={tourActive}
                            tourStep={tourStep}
                            events={events}
                            onlyMustMeet={onlyMustMeet}
                            setOnlyMustMeet={setOnlyMustMeet}
                            hubNavigate={hubNavigate}
                        />
                    </DashboardShell>
                )
            }
        </div >
    );
}
