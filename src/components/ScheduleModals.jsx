import React, { useState, useMemo, useEffect } from 'react';

// Feather Icons as inline SVG components
export const Icons = {
    X: () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
    ),
    Calendar: () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
        </svg>
    ),
    Clock: () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
        </svg>
    ),
    MapPin: () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
            <circle cx="12" cy="10" r="3"></circle>
        </svg>
    ),
    Users: () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
        </svg>
    ),
    Search: () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
    ),
    UserPlus: () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
            <circle cx="8.5" cy="7" r="4"></circle>
            <line x1="20" y1="8" x2="20" y2="14"></line>
            <line x1="23" y1="11" x2="17" y2="11"></line>
        </svg>
    ),
    Trash2: () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
        </svg>
    ),
    Heart: () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
        </svg>
    ),
    Check: () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
    ),
    PlusCircle: () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="16"></line>
            <line x1="8" y1="12" x2="16" y2="12"></line>
        </svg>
    ),
    Edit: () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
        </svg>
    ),
    Swap: () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="23 4 23 10 17 10"></polyline>
            <polyline points="1 20 1 14 7 14"></polyline>
            <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
        </svg>
    ),
    Trash: () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
        </svg>
    ),
    Star: () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
        </svg>
    ),
    AlertTriangle: () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
            <line x1="12" y1="9" x2="12" y2="13"></line>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
        </svg>
    ),
};

function ScoreChip({ score }) {
    const tone =
        score >= 90
            ? "bg-emerald-50 text-emerald-800 ring-emerald-200"
            : score >= 75
                ? "bg-amber-50 text-amber-800 ring-amber-200"
                : "bg-rose-50 text-rose-800 ring-rose-200";
    return (
        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ring-1 ${tone}`}>
            {score}%
        </span>
    );
}

function SidebarModal({ title, children, footer, onClose, width = "max-w-5xl" }) {
    return (
        <div className="fixed inset-0 z-50 flex justify-end">
            <div className="fixed inset-0 bg-black/20 backdrop-blur-[1px] transition-opacity" onClick={onClose} />
            <div className={`relative z-50 h-full w-full ${width} bg-white shadow-2xl animate-in slide-in-from-right duration-300 flex flex-col`}>
                <div className="flex items-center justify-between border-b border-zinc-100 px-6 py-4 bg-zinc-50/50 shrink-0">
                    <h3 className="text-lg font-bold text-zinc-900">{title}</h3>
                    <button onClick={onClose} className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 transition-colors">
                        <Icons.X />
                    </button>
                </div>
                <div className="flex-1 overflow-y-auto px-6 py-5">
                    {children}
                </div>
                {footer && (
                    <div className="shrink-0 border-t border-zinc-100 bg-white px-6 py-4">
                        {footer}
                    </div>
                )}
            </div>
        </div>
    );
}

// ── FormDivider ──
function FormDivider({ label }) {
    return (
        <div className="relative my-5">
            <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-zinc-200" />
            </div>
            {label && (
                <div className="relative flex justify-center">
                    <span className="bg-white px-3 text-xs font-medium text-zinc-400 uppercase tracking-wide">{label}</span>
                </div>
            )}
        </div>
    );
}

// ── MeetingScoreSummary ──
function MeetingScoreSummary({ score, customFieldMatch, mutualPreference, metBefore, preferenceNotes }) {
    return (
        <div className="p-4 rounded-xl bg-violet-50/50 border border-violet-100">
            <div className="flex items-center gap-2 text-sm font-semibold text-zinc-700 mb-3">
                <Icons.Star />
                <span>MustMeet Details</span>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex justify-between p-2 bg-white rounded-lg border border-zinc-100">
                    <span className="text-zinc-500">Match Score</span>
                    <span className="font-semibold text-violet-600">{score ?? 85}%</span>
                </div>
                <div className="flex justify-between p-2 bg-white rounded-lg border border-zinc-100">
                    <span className="text-zinc-500">Custom Field Match</span>
                    <span className="font-medium text-zinc-700">{customFieldMatch ? 'Yes' : 'No'}</span>
                </div>
                <div className="flex justify-between p-2 bg-white rounded-lg border border-zinc-100">
                    <span className="text-zinc-500">Mutual Preference</span>
                    <span className="font-medium text-zinc-700">{mutualPreference ? 'Yes' : 'No'}</span>
                </div>
                <div className="flex justify-between p-2 bg-white rounded-lg border border-zinc-100">
                    <span className="text-zinc-500">Met Before</span>
                    <span className="font-medium text-zinc-700">{metBefore ? 'Yes' : ''}</span>
                </div>
            </div>
            {preferenceNotes && (
                <div className="mt-3 p-2 bg-white rounded-lg border border-zinc-100">
                    <span className="text-xs text-zinc-500 block mb-1">Preference Summary</span>
                    <span className="text-sm text-zinc-700">{preferenceNotes}</span>
                </div>
            )}
        </div>
    );
}

// ── RecipientsList ──
function RecipientsList({ attendees, allParticipants, attendeeStatuses, onAdd, onRemove, onStatusChange, isMustMeet, searchTerm, onSearchChange, showAcceptAll, onAcceptAll }) {
    const currentAttendees = allParticipants.filter(p => attendees.includes(p.id));
    const availableToAdd = allParticipants.filter(p =>
        !attendees.includes(p.id) &&
        p.name.toLowerCase().includes((searchTerm || '').toLowerCase())
    );

    const statusColors = {
        Accepted: 'bg-white text-emerald-600 border-zinc-200',
        Pending: 'bg-white text-zinc-600 border-zinc-200',
        Declined: 'bg-white text-rose-600 border-zinc-200'
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 text-sm font-semibold text-zinc-700">
                    <Icons.Users />
                    <span>Attendees ({currentAttendees.length})</span>
                </div>
                {showAcceptAll && !isMustMeet && (
                    <button
                        onClick={onAcceptAll}
                        className="text-xs font-medium text-violet-600 hover:text-violet-800 hover:underline"
                    >
                        Accept for all
                    </button>
                )}
            </div>

            {/* Search Input */}
            <div className="relative mb-3">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">
                    <Icons.Search />
                </div>
                <input
                    className="w-full pl-10 pr-3 py-3 bg-white border border-zinc-200 rounded-xl text-sm focus:ring-2 focus:ring-[#522DA6]/20 outline-none"
                    value={searchTerm || ''}
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder="Search to add participant..."
                />
                {searchTerm && availableToAdd.length > 0 && (
                    <div className="absolute z-10 mt-1 w-full bg-white border border-zinc-200 rounded-xl shadow-lg max-h-48 overflow-y-auto">
                        {availableToAdd.slice(0, 5).map(p => (
                            <button
                                key={p.id}
                                onClick={() => onAdd(p.id)}
                                className="w-full flex items-center gap-3 p-3 text-left hover:bg-violet-50 transition-colors"
                            >
                                <div className="h-7 w-7 rounded-full bg-zinc-100 flex items-center justify-center text-xs font-bold text-zinc-600">
                                    {p.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                                </div>
                                <div>
                                    <div className="text-sm font-medium text-zinc-900">{p.name}</div>
                                    <div className="text-xs text-zinc-500">{p.role}</div>
                                </div>
                                <div className="ml-auto text-violet-600">
                                    <Icons.UserPlus />
                                </div>
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Attendee List */}
            <div className="space-y-2 max-h-60 overflow-y-auto">
                {currentAttendees.map(p => {
                    const status = attendeeStatuses[p.id] || 'Pending';
                    return (
                        <div key={p.id} className="flex items-center justify-between p-3 bg-zinc-50 border border-zinc-200 rounded-xl">
                            <div className="flex items-center gap-3">
                                <div className="h-8 w-8 rounded-full bg-violet-100 flex items-center justify-center text-xs font-bold text-violet-700">
                                    {p.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                                </div>
                                <div>
                                    <div className="text-sm font-medium text-zinc-900">{p.name}</div>
                                    <div className="text-xs text-zinc-500">{p.role}</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <select
                                    value={status}
                                    onChange={(e) => onStatusChange(p.id, e.target.value)}
                                    disabled={isMustMeet}
                                    className={`text-xs font-medium px-2 py-1 rounded-lg border appearance-none pr-6 ${statusColors[status]} ${isMustMeet ? 'cursor-not-allowed opacity-75' : 'cursor-pointer'}`}
                                    style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E\")", backgroundRepeat: 'no-repeat', backgroundPosition: 'right 4px center' }}
                                >
                                    <option value="Pending">Pending</option>
                                    <option value="Accepted">Accepted</option>
                                    <option value="Declined">Declined</option>
                                </select>
                                <button
                                    onClick={() => onRemove(p.id)}
                                    className="flex items-center gap-1 text-xs text-rose-600 hover:text-rose-800 font-medium px-2 py-1 rounded-lg hover:bg-rose-50 transition-colors"
                                >
                                    <Icons.Trash2 />
                                </button>
                            </div>
                        </div>
                    );
                })}
                {currentAttendees.length === 0 && (
                    <div className="p-4 text-center text-zinc-400 text-sm border border-dashed border-zinc-200 rounded-xl">
                        No attendees assigned.
                    </div>
                )}
            </div>
        </div>
    );
}

// ── CandidatePickerPanel ──
export function CandidatePickerPanel({ title, subtitle, candidates, onSelect, onClose, showExclusivityWarning }) {
    return (
        <SidebarModal title={title || "Select Candidate"} onClose={onClose}>
            {subtitle && (
                <div className="mb-4 text-sm text-zinc-500">{subtitle}</div>
            )}

            <div className="overflow-x-auto rounded-xl border border-zinc-200 bg-white">
                <table className="w-full text-left text-sm min-w-[700px]">
                    <thead className="bg-zinc-50 text-xs font-semibold text-zinc-500 uppercase border-b border-zinc-100">
                        <tr>
                            <th className="px-4 py-3">Company</th>
                            <th className="px-4 py-3">Contact Name</th>
                            <th className="px-4 py-3">Group(s)</th>
                            <th className="px-4 py-3 text-center">Scheduled</th>
                            <th className="px-4 py-3 text-center">Meeting Min</th>
                            <th className="px-4 py-3 text-center">Meeting Limit</th>
                            <th className="px-4 py-3 text-center">Score</th>
                            <th className="px-4 py-3 text-center">Met Before</th>
                            <th className="px-4 py-3"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100">
                        {candidates.map((c) => (
                            <tr key={c.id} className="hover:bg-zinc-50 group">
                                <td className="px-4 py-3 font-medium text-zinc-900">
                                    <div className="flex items-center gap-1.5">
                                        {c.companyName}
                                        {c.exclusivityWarning && (
                                            <span className="text-amber-500" title="Exclusivity conflict">
                                                <Icons.AlertTriangle />
                                            </span>
                                        )}
                                    </div>
                                </td>
                                <td className="px-4 py-3">
                                    {c.contactNames ? (
                                        <div>
                                            {c.contactNames.map((name, i) => (
                                                <div key={i} className={i > 0 ? "text-zinc-500 text-xs mt-0.5" : "font-medium text-zinc-900"}>{name}</div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="font-medium text-zinc-900">{c.name}</div>
                                    )}
                                    <div className="text-xs text-zinc-500">{c.role}</div>
                                </td>
                                <td className="px-4 py-3 text-zinc-600">{c.group || "Suppliers"}</td>
                                <td className="px-4 py-3 text-center font-medium text-zinc-700">{c.scheduled ?? "-"}</td>
                                <td className="px-4 py-3 text-center font-medium text-zinc-700">{c.meetingMin ?? "0"}</td>
                                <td className="px-4 py-3 text-center text-zinc-600">{c.meetingLimit ?? "15"}</td>
                                <td className="px-4 py-3 text-center">
                                    <ScoreChip score={c.matchScore} />
                                </td>
                                <td className="px-4 py-3 text-center text-sm font-medium text-zinc-600">
                                    {c.metBefore ? "Yes" : ""}
                                </td>
                                <td className="px-4 py-3 text-right">
                                    <button
                                        onClick={() => onSelect(c)}
                                        className="rounded-lg bg-[#522DA6] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#402285] transition-colors shadow-sm opacity-0 group-hover:opacity-100"
                                    >
                                        Select
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {candidates.length === 0 && (
                    <div className="p-8 text-center text-zinc-500 text-sm">
                        No available candidates found.
                    </div>
                )}
            </div>

            {showExclusivityWarning && (
                <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-700 flex items-start gap-2">
                    <span className="mt-0.5 flex-shrink-0"><Icons.AlertTriangle /></span>
                    <span>Candidates marked with a warning icon have exclusivity conflicts with existing meetings.</span>
                </div>
            )}
        </SidebarModal>
    );
}

// ── SwapAttendeeModal (refactored to use CandidatePickerPanel) ──
export function SwapAttendeeModal({ event, candidates, onClose, onConfirm }) {
    return (
        <CandidatePickerPanel
            title="Select a New Attendee"
            subtitle={
                <div className="flex items-center gap-3 text-sm text-zinc-600 bg-zinc-50 rounded-xl p-3 border border-zinc-100">
                    <Icons.Calendar />
                    <span><strong className="text-zinc-900">{event.date}</strong>, {event.start} - {event.end}</span>
                </div>
            }
            candidates={candidates}
            onSelect={onConfirm}
            onClose={onClose}
            showExclusivityWarning={false}
        />
    );
}

// ── EditModal (refactored to use RecipientsList and MeetingScoreSummary) ──
export function EditModal({ event, allParticipants, onClose, onSave }) {
    const timeSlots = [];
    for (let h = 8; h < 18; h++) {
        timeSlots.push(`${String(h).padStart(2, '0')}:00 - ${String(h).padStart(2, '0')}:30`);
        timeSlots.push(`${String(h).padStart(2, '0')}:30 - ${String(h + 1).padStart(2, '0')}:00`);
    }

    const getSlotFromEvent = (e) => {
        if (e.start && e.end) {
            return `${e.start} - ${e.end}`;
        }
        return timeSlots[0];
    };

    const [selectedSlot, setSelectedSlot] = useState(getSlotFromEvent(event));
    const [location, setLocation] = useState(event.venue || "");
    const [attendeeIds, setAttendeeIds] = useState(event.participantIds || []);
    const [searchTerm, setSearchTerm] = useState("");

    const isMustMeet = event.exclusive || event.meetingType === 'mustMeet';

    const [attendeeStatuses, setAttendeeStatuses] = useState(() => {
        const initial = {};
        (event.participantIds || []).forEach(id => {
            initial[id] = event.participantStatuses?.[id] || 'Pending';
        });
        return initial;
    });

    const handleRemove = (pId) => {
        setAttendeeIds(prev => prev.filter(id => id !== pId));
        setAttendeeStatuses(prev => {
            const copy = { ...prev };
            delete copy[pId];
            return copy;
        });
    };

    const handleAdd = (pId) => {
        setAttendeeIds(prev => [...prev, pId]);
        setAttendeeStatuses(prev => ({ ...prev, [pId]: 'Pending' }));
        setSearchTerm("");
    };

    const handleStatusChange = (pId, newStatus) => {
        if (isMustMeet) return;
        setAttendeeStatuses(prev => ({ ...prev, [pId]: newStatus }));
    };

    const handleAcceptAll = () => {
        const allAccepted = {};
        attendeeIds.forEach(id => {
            allAccepted[id] = 'Accepted';
        });
        setAttendeeStatuses(allAccepted);
    };

    const hasPendingAttendees = Object.values(attendeeStatuses).some(status => status === 'Pending');

    const handleSave = () => {
        const [start, end] = selectedSlot.split(' - ');
        onSave({ ...event, start, end, venue: location, participantIds: attendeeIds, participantStatuses: attendeeStatuses });
    };

    const footerContent = (
        <div className="flex gap-3">
            <button
                onClick={onClose}
                className="flex-1 py-2.5 bg-white border border-zinc-200 text-zinc-700 rounded-xl font-medium hover:bg-zinc-50 transition-colors"
            >
                Cancel
            </button>
            <button
                onClick={handleSave}
                className="flex-1 py-2.5 bg-[#522DA6] text-white rounded-xl font-medium hover:bg-[#402285] transition-colors"
            >
                Save Changes
            </button>
        </div>
    );

    return (
        <SidebarModal title="Edit Meeting Details" onClose={onClose} footer={footerContent} width="max-w-lg">
            <div className="space-y-6">
                {/* Meeting Type Badge */}
                <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold ${isMustMeet ? 'bg-violet-100 text-violet-700' : 'bg-zinc-100 text-zinc-700'}`}>
                        {isMustMeet ? 'MustMeet' : '1:1 Meeting'}
                    </span>
                    <span className="text-xs text-zinc-400">Meeting Type (cannot be changed)</span>
                </div>

                {/* Time Slot Section */}
                <div className="p-4 rounded-xl bg-violet-50/50 border border-violet-100">
                    <div className="flex items-center gap-2 text-sm font-semibold text-zinc-700 mb-3">
                        <Icons.Clock />
                        <span>Meeting Time Slot</span>
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-zinc-500 mb-1">Select 30-minute slot</label>
                        <select
                            className="w-full p-2.5 bg-white border border-zinc-200 rounded-lg text-sm focus:ring-2 focus:ring-[#522DA6]/20 outline-none cursor-pointer"
                            value={selectedSlot}
                            onChange={(e) => setSelectedSlot(e.target.value)}
                        >
                            {timeSlots.map(slot => (
                                <option key={slot} value={slot}>{slot}</option>
                            ))}
                        </select>
                    </div>
                    <div className="mt-2 text-xs text-zinc-500">Date: {event.date}</div>
                </div>

                {/* Location */}
                <div>
                    <div className="flex items-center gap-2 text-sm font-semibold text-zinc-700 mb-2">
                        <Icons.MapPin />
                        <span>Location</span>
                    </div>
                    <select
                        className="w-full p-3 bg-white border border-zinc-200 rounded-xl text-sm focus:ring-2 focus:ring-[#522DA6]/20 outline-none appearance-none cursor-pointer"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                    >
                        <option value="">Select a location...</option>
                        <option value="Hall 1">Hall 1</option>
                        <option value="Hall 2">Hall 2</option>
                        <option value="Meeting Room A">Meeting Room A</option>
                        <option value="Meeting Room B">Meeting Room B</option>
                        <option value="VIP Lounge">VIP Lounge</option>
                        <option value="Conference Room">Conference Room</option>
                        <option value="Outdoor Terrace">Outdoor Terrace</option>
                    </select>
                </div>

                {/* Attendees - using RecipientsList */}
                <RecipientsList
                    attendees={attendeeIds}
                    allParticipants={allParticipants}
                    attendeeStatuses={attendeeStatuses}
                    onAdd={handleAdd}
                    onRemove={handleRemove}
                    onStatusChange={handleStatusChange}
                    isMustMeet={isMustMeet}
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                    showAcceptAll={hasPendingAttendees}
                    onAcceptAll={handleAcceptAll}
                />

                {/* MM Details Section - using MeetingScoreSummary */}
                {isMustMeet && (
                    <MeetingScoreSummary
                        score={event.score}
                        customFieldMatch={event.customFieldMatch}
                        mutualPreference={event.mutualPreference}
                        metBefore={event.metBefore}
                        preferenceNotes={event.preferenceNotes}
                    />
                )}
            </div>
        </SidebarModal>
    );
}

// ── MeetingTypeModal ──
export function MeetingTypeModal({ onClose, onSelect }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="w-full max-w-md bg-white p-6 rounded-2xl shadow-xl transform transition-all scale-100">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-zinc-900">Create Meeting</h3>
                    <button onClick={onClose} className="p-2 text-zinc-400 hover:bg-zinc-100 rounded-full transition-colors">
                        <Icons.X />
                    </button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <button
                        onClick={() => onSelect('oneToOne')}
                        className="flex flex-col items-center gap-3 p-6 rounded-xl border border-zinc-200 hover:border-violet-500 hover:bg-violet-50 transition-all group text-center"
                    >
                        <div className="w-12 h-12 rounded-full bg-violet-100 text-violet-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Icons.Users />
                        </div>
                        <div>
                            <div className="font-bold text-zinc-900">1:1 Meeting</div>
                            <div className="text-xs text-zinc-500 mt-1">Schedule a standard meeting</div>
                        </div>
                    </button>

                    <button
                        onClick={() => onSelect('mustMeet')}
                        className="flex flex-col items-center gap-3 p-6 rounded-xl border border-zinc-200 hover:border-violet-500 hover:bg-violet-50 transition-all group text-center"
                    >
                        <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Icons.Heart />
                        </div>
                        <div>
                            <div className="font-bold text-zinc-900">MustMeet</div>
                            <div className="text-xs text-zinc-500 mt-1">Auto-schedule priority meeting</div>
                        </div>
                    </button>
                </div>
            </div>
        </div>
    );
}

// ── MeetingBookerSidebar ──
export function MeetingBookerSidebar({
    flowType,
    prefilledDate,
    prefilledTime,
    organizerType,
    organizerId,
    organizerEvents,
    allParticipants,
    allSharers,
    entityType,
    onClose,
    onSave,
}) {
    const [meetingType] = useState(flowType.startsWith('mustmeet') ? 'mustMeet' : 'oneToOne');
    const [startTime, setStartTime] = useState(prefilledTime || '');
    const [location, setLocation] = useState('');
    const [selectedDate, setSelectedDate] = useState(prefilledDate || '2025-03-21');
    const [mustMeetRecipient, setMustMeetRecipient] = useState(null);
    const [attendeeIds, setAttendeeIds] = useState([]);
    const [attendeeStatuses, setAttendeeStatuses] = useState({});
    const [personalMessage, setPersonalMessage] = useState('');
    const [autoAccept, setAutoAccept] = useState(flowType.startsWith('mustmeet'));
    const [searchTerm, setSearchTerm] = useState('');
    const [showCandidatePanel, setShowCandidatePanel] = useState(false);
    const [showTimeDropdown, setShowTimeDropdown] = useState(false);

    const availableLocations = [
        { id: "Hall 1", name: "Hall 1", capacity: 50 },
        { id: "Hall 2", name: "Hall 2", capacity: 50 },
        { id: "Meeting Room A", name: "Meeting Room A", capacity: 8 },
        { id: "Meeting Room B", name: "Meeting Room B", capacity: 8 },
        { id: "VIP Lounge", name: "VIP Lounge", capacity: 20 },
        { id: "Conference Room", name: "Conference Room", capacity: 15 },
        { id: "Outdoor Terrace", name: "Outdoor Terrace", capacity: 30 },
    ];

    // Generate 30-min time slots from 08:00-18:00
    const allTimeSlots = useMemo(() => {
        const slots = [];
        for (let h = 8; h < 18; h++) {
            slots.push(`${String(h).padStart(2, '0')}:00 - ${String(h).padStart(2, '0')}:30`);
            slots.push(`${String(h).padStart(2, '0')}:30 - ${String(h + 1).padStart(2, '0')}:00`);
        }
        return slots;
    }, []);

    // Organizer logic
    const sharer = organizerType === 'sharer' ? allSharers.find(s => s.id === organizerId) : null;

    const possibleOrganizers = useMemo(() => {
        if (organizerType === 'participant') return [allParticipants.find(p => p.id === organizerId)].filter(Boolean);
        if (organizerType === 'sharer') return (sharer?.memberIds || []).map(mid => allParticipants.find(p => p.id === mid)).filter(Boolean);
        if (organizerType === 'company') return allParticipants.filter(p => p.companyId === organizerId);
        return [];
    }, [organizerType, organizerId, sharer, allParticipants]);

    const [selectedOrganizerId] = useState(() => {
        if (possibleOrganizers.length > 0) return possibleOrganizers[0].id;
        return "";
    });

    const isMustMeet = meetingType === 'mustMeet';
    const isSlotFlow = flowType === 'mustmeet-slot' || flowType === 'regular-slot';
    const showAboveDivider = flowType !== 'regular-button';

    // Classify time slots for Flow 1 (regular-button)
    const classifiedTimeSlots = useMemo(() => {
        if (flowType !== 'regular-button') return { recommended: allTimeSlots, other: [] };

        const allParticipantIds = [selectedOrganizerId, ...attendeeIds];

        if (!organizerEvents || attendeeIds.length === 0) {
            return { recommended: allTimeSlots, other: [] };
        }

        const recommended = [];
        const other = [];

        allTimeSlots.forEach(slot => {
            const [slotStart, slotEnd] = slot.split(' - ');

            // Check each participant for conflicts on the selected date
            const conflicts = [];
            allParticipantIds.forEach(pid => {
                const participant = allParticipants.find(p => p.id === pid);
                const hasConflict = organizerEvents.some(e =>
                    e.date === selectedDate &&
                    e.kind === "meeting" &&
                    (e.participantIds || []).includes(pid) &&
                    slotStart < e.end && slotEnd > e.start
                );
                if (hasConflict && participant) {
                    conflicts.push(participant.name);
                }
            });

            if (conflicts.length === 0) {
                recommended.push({ slot, conflicts: [] });
            } else {
                other.push({ slot, conflicts });
            }
        });

        return { recommended, other };
    }, [flowType, organizerEvents, selectedDate, attendeeIds, selectedOrganizerId, allTimeSlots, allParticipants]);

    // MustMeet candidates
    const candidates = useMemo(() => {
        return allParticipants.slice(0, 8).map(p => ({
            id: p.id,
            companyName: allParticipants.find(pp => pp.companyId === p.companyId)?.companyName || 'Company',
            name: p.name,
            role: p.role,
            group: "Suppliers",
            matchScore: Math.floor(Math.random() * 30) + 70,
        })).sort((a, b) => b.matchScore - a.matchScore);
    }, [allParticipants]);

    const handleAdd = (pId) => {
        setAttendeeIds(prev => [...prev, pId]);
        setAttendeeStatuses(prev => ({ ...prev, [pId]: 'Pending' }));
        setSearchTerm("");
    };

    const handleRemove = (pId) => {
        setAttendeeIds(prev => prev.filter(id => id !== pId));
        setAttendeeStatuses(prev => {
            const copy = { ...prev };
            delete copy[pId];
            return copy;
        });
    };

    const handleStatusChange = (pId, newStatus) => {
        setAttendeeStatuses(prev => ({ ...prev, [pId]: newStatus }));
    };

    const handleAcceptAll = () => {
        const allAccepted = {};
        attendeeIds.forEach(id => {
            allAccepted[id] = 'Accepted';
        });
        setAttendeeStatuses(allAccepted);
    };

    const hasPendingAttendees = Object.values(attendeeStatuses).some(status => status === 'Pending');

    const handleSelectMustMeetRecipient = (candidate) => {
        setMustMeetRecipient(candidate);
        // Add them as an attendee too
        if (!attendeeIds.includes(candidate.id)) {
            setAttendeeIds(prev => [...prev, candidate.id]);
            setAttendeeStatuses(prev => ({ ...prev, [candidate.id]: 'Accepted' }));
        }
        setShowCandidatePanel(false);
    };

    const handleSave = () => {
        let start = '';
        let end = '';

        if (startTime && startTime.includes(' - ')) {
            [start, end] = startTime.split(' - ');
        } else if (startTime) {
            // If only start time provided, calculate end (30 min later)
            start = startTime;
            const [h, m] = start.split(':').map(Number);
            const endMin = m + 30;
            end = `${String(endMin >= 60 ? h + 1 : h).padStart(2, '0')}:${String(endMin % 60).padStart(2, '0')}`;
        }

        const allIds = [selectedOrganizerId, ...attendeeIds].filter(Boolean);

        onSave({
            kind: "meeting",
            meetingType: meetingType,
            date: selectedDate,
            start: start,
            end: end,
            venue: location || "Meeting Pods",
            venueGroup: "Pods",
            participantIds: allIds,
            participantStatuses: autoAccept
                ? Object.fromEntries(allIds.map(id => [id, 'Accepted']))
                : { [selectedOrganizerId]: 'Accepted', ...attendeeStatuses },
            personalMessage: personalMessage,
            score: mustMeetRecipient?.matchScore || 85,
            exclusive: isMustMeet,
            metBefore: false,
        });
    };

    const sidebarTitle = isMustMeet ? 'Create MustMeet Meeting' : 'Create Meeting';

    const footerContent = (
        <div className="flex gap-3">
            <button
                onClick={onClose}
                className="flex-1 py-2.5 bg-white border border-zinc-200 text-zinc-700 rounded-xl font-medium hover:bg-zinc-50 transition-colors"
            >
                Cancel
            </button>
            <button
                onClick={handleSave}
                disabled={attendeeIds.length === 0}
                className="flex-1 py-2.5 bg-[#522DA6] text-white rounded-xl font-medium hover:bg-[#402285] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {flowType === 'regular-button' ? 'Send' : 'Create Meeting'}
            </button>
        </div>
    );

    return (
        <>
            <SidebarModal title={sidebarTitle} onClose={onClose} footer={footerContent} width="max-w-lg">
                <div className="space-y-4">
                    {/* Sharer view info chip */}
                    {organizerType === 'sharer' && sharer && (
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-violet-50 border border-violet-100 rounded-lg text-xs text-violet-700 font-medium">
                            <Icons.Users />
                            <span>Sharer: {sharer.id} ({possibleOrganizers.map(p => p.name).join(', ')})</span>
                        </div>
                    )}

                    {/* ═══ ABOVE DIVIDER — Time-led section ═══ */}
                    {showAboveDivider && (
                        <>
                            <div className="p-4 rounded-xl bg-violet-50/50 border border-violet-100 space-y-3">
                                {/* Start Time */}
                                <div>
                                    <div className="flex items-center gap-2 text-sm font-semibold text-zinc-700 mb-2">
                                        <Icons.Clock />
                                        <span>Start Time</span>
                                    </div>
                                    <select
                                        className="w-full p-2.5 bg-white border border-zinc-200 rounded-lg text-sm focus:ring-2 focus:ring-[#522DA6]/20 outline-none cursor-pointer"
                                        value={startTime}
                                        onChange={(e) => setStartTime(e.target.value)}
                                    >
                                        <option value="">Select a time slot...</option>
                                        {allTimeSlots.map(slot => (
                                            <option key={slot} value={slot}>{slot}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Location */}
                                <div>
                                    <div className="flex items-center gap-2 text-sm font-semibold text-zinc-700 mb-2">
                                        <Icons.MapPin />
                                        <span>Location</span>
                                    </div>
                                    <select
                                        className="w-full p-2.5 bg-white border border-zinc-200 rounded-lg text-sm focus:ring-2 focus:ring-[#522DA6]/20 outline-none appearance-none cursor-pointer"
                                        value={location}
                                        onChange={(e) => setLocation(e.target.value)}
                                    >
                                        <option value="">Select a location...</option>
                                        {availableLocations.map(loc => (
                                            <option key={loc.id} value={loc.id}>{loc.name} (Cap: {loc.capacity})</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Meeting Time / Duration info for slot flows */}
                                {isSlotFlow && (
                                    <div className="flex items-center gap-2 text-xs text-zinc-500">
                                        <Icons.Calendar />
                                        <span>Date: {selectedDate} | Duration: 30 minutes</span>
                                    </div>
                                )}
                            </div>

                            <FormDivider />
                        </>
                    )}

                    {/* ═══ BELOW DIVIDER — Participant section ═══ */}

                    {/* ── FLOW 1: regular-button (participant-led) ── */}
                    {flowType === 'regular-button' && (
                        <>
                            {/* Invitees */}
                            <RecipientsList
                                attendees={attendeeIds}
                                allParticipants={allParticipants.filter(p => p.id !== selectedOrganizerId)}
                                attendeeStatuses={attendeeStatuses}
                                onAdd={handleAdd}
                                onRemove={handleRemove}
                                onStatusChange={handleStatusChange}
                                isMustMeet={false}
                                searchTerm={searchTerm}
                                onSearchChange={setSearchTerm}
                                showAcceptAll={hasPendingAttendees}
                                onAcceptAll={handleAcceptAll}
                            />

                            <FormDivider />

                            {/* Personal Message */}
                            <div>
                                <label className="block text-xs font-medium text-zinc-500 mb-1">Personal Message</label>
                                <textarea
                                    className="w-full p-3 bg-white border border-zinc-200 rounded-xl text-sm focus:ring-2 focus:ring-[#522DA6]/20 outline-none resize-none"
                                    rows={3}
                                    value={personalMessage}
                                    onChange={(e) => setPersonalMessage(e.target.value)}
                                    placeholder="Why would you like to meet? Adding a personal message increases acceptance rates by 30%"
                                />
                            </div>

                            {/* Location */}
                            <div>
                                <div className="flex items-center gap-2 text-sm font-semibold text-zinc-700 mb-2">
                                    <Icons.MapPin />
                                    <span>Location</span>
                                </div>
                                <select
                                    className="w-full p-3 bg-white border border-zinc-200 rounded-xl text-sm focus:ring-2 focus:ring-[#522DA6]/20 outline-none appearance-none cursor-pointer"
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                >
                                    <option value="">Select a location...</option>
                                    {availableLocations.map(loc => (
                                        <option key={loc.id} value={loc.id}>{loc.name} (Cap: {loc.capacity})</option>
                                    ))}
                                </select>
                            </div>

                            {/* Date Picker */}
                            <div>
                                <div className="flex items-center gap-2 text-sm font-semibold text-zinc-700 mb-2">
                                    <Icons.Calendar />
                                    <span>Date</span>
                                </div>
                                <input
                                    type="date"
                                    className="w-full p-2.5 bg-white border border-zinc-200 rounded-lg text-sm font-medium text-zinc-900 focus:ring-2 focus:ring-[#522DA6]/20 outline-none"
                                    value={selectedDate}
                                    onChange={(e) => setSelectedDate(e.target.value)}
                                />
                            </div>

                            {/* Time Picker with Recommended / Other sections */}
                            <div>
                                <div className="flex items-center gap-2 text-sm font-semibold text-zinc-700 mb-2">
                                    <Icons.Clock />
                                    <span>Time</span>
                                </div>
                                <div className="relative">
                                    <button
                                        onClick={() => setShowTimeDropdown(!showTimeDropdown)}
                                        className="w-full p-2.5 bg-white border border-zinc-200 rounded-lg text-sm text-left focus:ring-2 focus:ring-[#522DA6]/20 outline-none cursor-pointer flex items-center justify-between"
                                    >
                                        <span className={startTime ? 'text-zinc-900 font-medium' : 'text-zinc-400'}>
                                            {startTime || 'Select a time...'}
                                        </span>
                                        <svg className={`w-4 h-4 text-zinc-400 transition-transform ${showTimeDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>

                                    {showTimeDropdown && (
                                        <div className="absolute z-20 mt-1 w-full bg-white border border-zinc-200 rounded-xl shadow-lg max-h-64 overflow-y-auto">
                                            {/* Recommended times */}
                                            {classifiedTimeSlots.recommended && classifiedTimeSlots.recommended.length > 0 && (
                                                <>
                                                    <div className="px-3 py-2 bg-emerald-50 border-b border-zinc-100 text-xs font-semibold text-emerald-700 uppercase tracking-wide flex items-center gap-1.5">
                                                        <Icons.Star />
                                                        Recommended times
                                                    </div>
                                                    {classifiedTimeSlots.recommended.map(item => {
                                                        const slotValue = typeof item === 'string' ? item : item.slot;
                                                        return (
                                                            <button
                                                                key={slotValue}
                                                                onClick={() => { setStartTime(slotValue); setShowTimeDropdown(false); }}
                                                                className={`w-full px-3 py-2.5 text-left text-sm hover:bg-violet-50 transition-colors flex items-center justify-between ${startTime === slotValue ? 'bg-violet-50 text-violet-700 font-medium' : 'text-zinc-700'}`}
                                                            >
                                                                <span>{slotValue}</span>
                                                                <span className="text-xs text-emerald-600 flex items-center gap-1">
                                                                    <Icons.Check />
                                                                    All invitees are available
                                                                </span>
                                                            </button>
                                                        );
                                                    })}
                                                </>
                                            )}

                                            {/* Other times */}
                                            {classifiedTimeSlots.other && classifiedTimeSlots.other.length > 0 && (
                                                <>
                                                    <div className="px-3 py-2 bg-zinc-50 border-b border-t border-zinc-100 text-xs font-semibold text-zinc-500 uppercase tracking-wide">
                                                        Other times
                                                    </div>
                                                    {classifiedTimeSlots.other.map(item => (
                                                        <button
                                                            key={item.slot}
                                                            onClick={() => { setStartTime(item.slot); setShowTimeDropdown(false); }}
                                                            className={`w-full px-3 py-2.5 text-left text-sm hover:bg-violet-50 transition-colors flex items-center justify-between ${startTime === item.slot ? 'bg-violet-50 text-violet-700 font-medium' : 'text-zinc-700'}`}
                                                        >
                                                            <span>{item.slot}</span>
                                                            <span className="text-xs text-amber-600">
                                                                {item.conflicts[0]} has a pending meeting
                                                            </span>
                                                        </button>
                                                    ))}
                                                </>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Meeting limit note */}
                            <div className="text-xs text-zinc-500 px-1">
                                12 meeting requests left until you reach your meeting limit.
                            </div>

                            {/* Auto-accept toggle */}
                            <label className="flex items-center gap-3 p-3 bg-zinc-50 border border-zinc-200 rounded-xl cursor-pointer hover:bg-zinc-100 transition-colors">
                                <input
                                    type="checkbox"
                                    checked={autoAccept}
                                    onChange={(e) => setAutoAccept(e.target.checked)}
                                    className="w-4 h-4 rounded border-zinc-300 text-[#522DA6] focus:ring-[#522DA6]/20"
                                />
                                <div>
                                    <div className="text-sm font-medium text-zinc-900">Automatically accept meeting</div>
                                    <div className="text-xs text-zinc-500">Accept this meeting on behalf of all attendees</div>
                                </div>
                            </label>

                            {/* Warning banner */}
                            <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl text-sm text-blue-700 flex items-start gap-2">
                                <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                </svg>
                                <span>As the organizer, you can book meetings that your attendees may not be able to book themselves.</span>
                            </div>
                        </>
                    )}

                    {/* ── FLOW 2 & 3: mustmeet-button / mustmeet-slot ── */}
                    {(flowType === 'mustmeet-button' || flowType === 'mustmeet-slot') && (
                        <>
                            {/* MustMeet Recipient Selection */}
                            {!mustMeetRecipient ? (
                                <button
                                    onClick={() => setShowCandidatePanel(true)}
                                    className="w-full p-4 border-2 border-dashed border-violet-200 rounded-xl text-sm font-medium text-violet-700 hover:bg-violet-50 hover:border-violet-300 transition-colors flex items-center justify-center gap-2"
                                >
                                    <Icons.Heart />
                                    Choose MustMeet Recipient
                                </button>
                            ) : (
                                <>
                                    {/* Selected recipient display */}
                                    <div className="p-3 bg-violet-50 border border-violet-200 rounded-xl flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="h-9 w-9 rounded-full bg-violet-200 flex items-center justify-center text-xs font-bold text-violet-800">
                                                {mustMeetRecipient.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                                            </div>
                                            <div>
                                                <div className="text-sm font-semibold text-zinc-900">{mustMeetRecipient.name}</div>
                                                <div className="text-xs text-zinc-500">{mustMeetRecipient.companyName} | {mustMeetRecipient.role}</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <ScoreChip score={mustMeetRecipient.matchScore} />
                                            <button
                                                onClick={() => setShowCandidatePanel(true)}
                                                className="text-xs text-violet-600 hover:text-violet-800 font-medium hover:underline"
                                            >
                                                Change
                                            </button>
                                        </div>
                                    </div>

                                    {/* Score summary */}
                                    <MeetingScoreSummary
                                        score={mustMeetRecipient.matchScore}
                                        customFieldMatch={false}
                                        mutualPreference={mustMeetRecipient.matchScore > 85}
                                        metBefore={false}
                                    />
                                </>
                            )}

                            {/* Additional participants */}
                            <RecipientsList
                                attendees={attendeeIds.filter(id => id !== mustMeetRecipient?.id)}
                                allParticipants={allParticipants.filter(p => p.id !== selectedOrganizerId && p.id !== mustMeetRecipient?.id)}
                                attendeeStatuses={attendeeStatuses}
                                onAdd={handleAdd}
                                onRemove={handleRemove}
                                onStatusChange={handleStatusChange}
                                isMustMeet={true}
                                searchTerm={searchTerm}
                                onSearchChange={setSearchTerm}
                                showAcceptAll={false}
                                onAcceptAll={handleAcceptAll}
                            />

                            {/* Personal Message */}
                            <div>
                                <label className="block text-xs font-medium text-zinc-500 mb-1">Personal Message (Optional)</label>
                                <textarea
                                    className="w-full p-3 bg-white border border-zinc-200 rounded-xl text-sm focus:ring-2 focus:ring-[#522DA6]/20 outline-none resize-none"
                                    rows={3}
                                    value={personalMessage}
                                    onChange={(e) => setPersonalMessage(e.target.value)}
                                    placeholder="Add a personal message to include with the meeting invitation..."
                                />
                            </div>

                            {/* Auto-accept toggle */}
                            <label className="flex items-center gap-3 p-3 bg-zinc-50 border border-zinc-200 rounded-xl cursor-pointer hover:bg-zinc-100 transition-colors">
                                <input
                                    type="checkbox"
                                    checked={autoAccept}
                                    onChange={(e) => setAutoAccept(e.target.checked)}
                                    className="w-4 h-4 rounded border-zinc-300 text-[#522DA6] focus:ring-[#522DA6]/20"
                                />
                                <div>
                                    <div className="text-sm font-medium text-zinc-900">Automatically accept meeting</div>
                                    <div className="text-xs text-zinc-500">Accept this meeting on behalf of all attendees</div>
                                </div>
                            </label>

                            {/* MustMeet info note */}
                            <div className="p-3 bg-amber-50 border border-amber-100 rounded-xl text-xs text-amber-700 flex items-start gap-2">
                                <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                </svg>
                                <span>Notifications aren't sent to participants when MustMeet meetings are created.</span>
                            </div>
                        </>
                    )}

                    {/* ── FLOW 4: regular-slot ── */}
                    {flowType === 'regular-slot' && (
                        <>
                            {/* Recipients */}
                            <RecipientsList
                                attendees={attendeeIds}
                                allParticipants={allParticipants.filter(p => p.id !== selectedOrganizerId)}
                                attendeeStatuses={attendeeStatuses}
                                onAdd={handleAdd}
                                onRemove={handleRemove}
                                onStatusChange={handleStatusChange}
                                isMustMeet={false}
                                searchTerm={searchTerm}
                                onSearchChange={setSearchTerm}
                                showAcceptAll={hasPendingAttendees}
                                onAcceptAll={handleAcceptAll}
                            />

                            {/* Personal Message */}
                            <div>
                                <label className="block text-xs font-medium text-zinc-500 mb-1">Personal Message (Optional)</label>
                                <textarea
                                    className="w-full p-3 bg-white border border-zinc-200 rounded-xl text-sm focus:ring-2 focus:ring-[#522DA6]/20 outline-none resize-none"
                                    rows={3}
                                    value={personalMessage}
                                    onChange={(e) => setPersonalMessage(e.target.value)}
                                    placeholder="Add a personal message to include with the meeting invitation..."
                                />
                            </div>

                            {/* Auto-accept toggle */}
                            <label className="flex items-center gap-3 p-3 bg-zinc-50 border border-zinc-200 rounded-xl cursor-pointer hover:bg-zinc-100 transition-colors">
                                <input
                                    type="checkbox"
                                    checked={autoAccept}
                                    onChange={(e) => setAutoAccept(e.target.checked)}
                                    className="w-4 h-4 rounded border-zinc-300 text-[#522DA6] focus:ring-[#522DA6]/20"
                                />
                                <div>
                                    <div className="text-sm font-medium text-zinc-900">Automatically accept meeting</div>
                                    <div className="text-xs text-zinc-500">Accept this meeting on behalf of all attendees</div>
                                </div>
                            </label>

                            {/* Warning banner */}
                            <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl text-sm text-blue-700 flex items-start gap-2">
                                <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                </svg>
                                <span>As the organizer, you can book meetings that your attendees may not be able to book themselves.</span>
                            </div>
                        </>
                    )}
                </div>
            </SidebarModal>

            {/* CandidatePickerPanel overlay for MustMeet flows */}
            {showCandidatePanel && (
                <CandidatePickerPanel
                    title="Choose MustMeet Recipient"
                    subtitle={startTime ? `Available at ${startTime}, ${selectedDate}` : `Select a recipient for your MustMeet meeting`}
                    candidates={candidates}
                    onSelect={handleSelectMustMeetRecipient}
                    onClose={() => setShowCandidatePanel(false)}
                    showExclusivityWarning={candidates.some(c => c.exclusivityWarning)}
                />
            )}
        </>
    );
}
