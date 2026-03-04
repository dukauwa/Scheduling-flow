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

export function SwapAttendeeModal({ event, candidates, onClose, onConfirm }) {
    return (
        <SidebarModal title="Select a New Attendee" onClose={onClose}>
            <div className="mb-4 flex items-center gap-3 text-sm text-zinc-600 bg-zinc-50 rounded-xl p-3 border border-zinc-100">
                <Icons.Calendar />
                <span><strong className="text-zinc-900">{event.date}</strong>, {event.start} - {event.end}</span>
            </div>

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
                                <td className="px-4 py-3 font-medium text-zinc-900">{c.companyName}</td>
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
                                        onClick={() => onConfirm(c)}
                                        className="rounded-lg border border-violet-200 bg-violet-50 px-3 py-1.5 text-xs font-semibold text-violet-700 hover:bg-violet-100 transition-colors opacity-0 group-hover:opacity-100"
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
                        No available candidates found for this time slot.
                    </div>
                )}
            </div>
        </SidebarModal>
    );
}

export function EditModal({ event, allParticipants, onClose, onSave }) {
    // Generate 30-min time slots from 08:00 to 18:00
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

    // Detect if this is a MustMeet meeting
    const isMustMeet = event.exclusive || event.meetingType === 'mustMeet';

    // Attendee status tracking - default to existing or 'Pending'
    const [attendeeStatuses, setAttendeeStatuses] = useState(() => {
        const initial = {};
        (event.participantIds || []).forEach(id => {
            initial[id] = event.participantStatuses?.[id] || 'Pending';
        });
        return initial;
    });

    const currentAttendees = allParticipants.filter(p => attendeeIds.includes(p.id));
    const availableToAdd = allParticipants.filter(p =>
        !attendeeIds.includes(p.id) &&
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
        if (isMustMeet) return; // Statuses are locked for MustMeet
        setAttendeeStatuses(prev => ({ ...prev, [pId]: newStatus }));
    };

    // Accept for all handler
    const handleAcceptAll = () => {
        const allAccepted = {};
        attendeeIds.forEach(id => {
            allAccepted[id] = 'Accepted';
        });
        setAttendeeStatuses(allAccepted);
    };

    // Check if any attendee is pending
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

                {/* Attendees */}
                <div>
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2 text-sm font-semibold text-zinc-700">
                            <Icons.Users />
                            <span>Attendees ({currentAttendees.length})</span>
                        </div>
                        {/* Accept for all button - only for Regular meetings with pending attendees */}
                        {!isMustMeet && hasPendingAttendees && (
                            <button
                                onClick={handleAcceptAll}
                                className="text-xs font-medium text-violet-600 hover:text-violet-800 hover:underline"
                            >
                                Accept for all
                            </button>
                        )}
                    </div>

                    {/* Search Input - ON TOP */}
                    <div className="relative mb-3">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">
                            <Icons.Search />
                        </div>
                        <input
                            className="w-full pl-10 pr-3 py-3 bg-white border border-zinc-200 rounded-xl text-sm focus:ring-2 focus:ring-[#522DA6]/20 outline-none"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search to add participant..."
                        />
                        {searchTerm && availableToAdd.length > 0 && (
                            <div className="absolute z-10 mt-1 w-full bg-white border border-zinc-200 rounded-xl shadow-lg max-h-48 overflow-y-auto">
                                {availableToAdd.slice(0, 5).map(p => (
                                    <button
                                        key={p.id}
                                        onClick={() => handleAdd(p.id)}
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
                            const statusColors = {
                                Accepted: 'bg-white text-emerald-600 border-zinc-200',
                                Pending: 'bg-white text-zinc-600 border-zinc-200',
                                Declined: 'bg-white text-rose-600 border-zinc-200'
                            };
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
                                        {/* Status Dropdown - disabled for MustMeet */}
                                        <select
                                            value={status}
                                            onChange={(e) => handleStatusChange(p.id, e.target.value)}
                                            disabled={isMustMeet}
                                            className={`text-xs font-medium px-2 py-1 rounded-lg border appearance-none pr-6 ${statusColors[status]} ${isMustMeet ? 'cursor-not-allowed opacity-75' : 'cursor-pointer'}`}
                                            style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E\")", backgroundRepeat: 'no-repeat', backgroundPosition: 'right 4px center' }}
                                        >
                                            <option value="Pending">Pending</option>
                                            <option value="Accepted">Accepted</option>
                                            <option value="Declined">Declined</option>
                                        </select>
                                        <button
                                            onClick={() => handleRemove(p.id)}
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

                {/* MM Details Section - Only for MustMeet meetings */}
                {isMustMeet && (
                    <div className="p-4 rounded-xl bg-violet-50/50 border border-violet-100">
                        <div className="flex items-center gap-2 text-sm font-semibold text-zinc-700 mb-3">
                            <Icons.Star />
                            <span>MustMeet Details</span>
                        </div>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                            <div className="flex justify-between p-2 bg-white rounded-lg border border-zinc-100">
                                <span className="text-zinc-500">Match Score</span>
                                <span className="font-semibold text-violet-600">{event.score ?? 85}%</span>
                            </div>
                            <div className="flex justify-between p-2 bg-white rounded-lg border border-zinc-100">
                                <span className="text-zinc-500">Custom Field Match</span>
                                <span className="font-medium text-zinc-700">{event.customFieldMatch ? 'Yes' : 'No'}</span>
                            </div>
                            <div className="flex justify-between p-2 bg-white rounded-lg border border-zinc-100">
                                <span className="text-zinc-500">Mutual Preference</span>
                                <span className="font-medium text-zinc-700">{event.mutualPreference ? 'Yes' : 'No'}</span>
                            </div>
                            <div className="flex justify-between p-2 bg-white rounded-lg border border-zinc-100">
                                <span className="text-zinc-500">Met Before</span>
                                <span className="font-medium text-zinc-700">{event.metBefore ? 'Yes' : ''}</span>
                            </div>
                        </div>
                        {event.preferenceNotes && (
                            <div className="mt-3 p-2 bg-white rounded-lg border border-zinc-100">
                                <span className="text-xs text-zinc-500 block mb-1">Preference Summary</span>
                                <span className="text-sm text-zinc-700">{event.preferenceNotes}</span>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </SidebarModal>
    );
}

export function CreateMeetingModal({ date, time, organizerType, organizerId, organizerEvents, allParticipants, allSharers, onClose, onSave, fixedType }) {
    // Step-based flow: 1 = Participants, 2 = Location, 3 = Date/Time
    const [step, setStep] = useState(1);

    // State
    const [type, setType] = useState(fixedType || "oneToOne");
    const [attendeeIds, setAttendeeIds] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [location, setLocation] = useState("");
    const [selectedDate, setSelectedDate] = useState(date || "2025-03-21");
    const [selectedSlot, setSelectedSlot] = useState("");

    // New fields for enhanced create flow
    const [personalMessage, setPersonalMessage] = useState("");
    const [autoAccept, setAutoAccept] = useState(false); // OFF by default for Regular, will be ON for MustMeet
    const [attendeeStatuses, setAttendeeStatuses] = useState({}); // Track status per attendee during creation

    // Generate 30-min time slots
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
    const company = organizerType === 'company' ? { id: organizerId, name: allParticipants.find(p => p.companyId === organizerId)?.companyName || "Company" } : null;

    const possibleOrganizers = useMemo(() => {
        if (organizerType === 'participant') return [allParticipants.find(p => p.id === organizerId)].filter(Boolean);
        if (organizerType === 'sharer') return (sharer?.memberIds || []).map(mid => allParticipants.find(p => p.id === mid)).filter(Boolean);
        if (organizerType === 'company') return allParticipants.filter(p => p.companyId === organizerId);
        return [];
    }, [organizerType, organizerId, sharer, allParticipants]);

    const [selectedOrganizerId, setSelectedOrganizerId] = useState(() => {
        if (possibleOrganizers.length > 0) return possibleOrganizers[0].id;
        return "";
    });

    // Available participants to add (excluding organizer)
    const currentAttendees = allParticipants.filter(p => attendeeIds.includes(p.id));
    const availableToAdd = allParticipants.filter(p =>
        !attendeeIds.includes(p.id) &&
        p.id !== selectedOrganizerId &&
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Available locations (could be filtered based on participant preferences in future)
    const availableLocations = [
        { id: "Hall 1", name: "Hall 1", capacity: 50 },
        { id: "Hall 2", name: "Hall 2", capacity: 50 },
        { id: "Meeting Room A", name: "Meeting Room A", capacity: 8 },
        { id: "Meeting Room B", name: "Meeting Room B", capacity: 8 },
        { id: "VIP Lounge", name: "VIP Lounge", capacity: 20 },
        { id: "Conference Room", name: "Conference Room", capacity: 15 },
        { id: "Outdoor Terrace", name: "Outdoor Terrace", capacity: 30 },
    ];

    // Available time slots (excluding busy slots for ALL participants)
    const availableTimeSlots = useMemo(() => {
        if (!organizerEvents || attendeeIds.length === 0) return allTimeSlots;

        // Get all participant IDs including organizer
        const allParticipantIds = [selectedOrganizerId, ...attendeeIds];

        // Find busy slots for this date
        const busySlots = organizerEvents
            .filter(e => e.date === selectedDate && e.kind === "meeting")
            .filter(e => (e.participantIds || []).some(pid => allParticipantIds.includes(pid)))
            .map(e => ({ start: e.start, end: e.end }));

        return allTimeSlots.filter(slot => {
            const [start, end] = slot.split(' - ');
            return !busySlots.some(b => start < b.end && end > b.start);
        });
    }, [organizerEvents, selectedDate, attendeeIds, selectedOrganizerId, allTimeSlots]);

    // Set initial slot when slots change
    useEffect(() => {
        if (availableTimeSlots.length > 0 && !selectedSlot) {
            setSelectedSlot(availableTimeSlots[0]);
        }
    }, [availableTimeSlots]);

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
        setAttendeeStatuses(prev => ({ ...prev, [pId]: newStatus }));
    };

    const handleSave = () => {
        const [start, end] = selectedSlot.split(' - ');
        onSave({
            kind: "meeting",
            meetingType: type,
            date: selectedDate,
            start: start,
            end: end,
            venue: location || "Meeting Pods",
            venueGroup: "Pods",
            participantIds: [selectedOrganizerId, ...attendeeIds],
            participantStatuses: autoAccept
                ? Object.fromEntries([selectedOrganizerId, ...attendeeIds].map(id => [id, 'Accepted']))
                : { [selectedOrganizerId]: 'Accepted', ...attendeeStatuses },
            personalMessage: personalMessage,
            score: 85,
            exclusive: type === "mustMeet",
            metBefore: false,
        });
    };

    // Navigation
    const canGoToStep2 = attendeeIds.length > 0;
    const canGoToStep3 = location !== "";
    const canSubmit = canGoToStep2 && canGoToStep3 && selectedSlot !== "";

    const footerContent = (
        <div className="flex gap-3">
            {step > 1 ? (
                <button
                    onClick={() => setStep(step - 1)}
                    className="flex-1 py-2.5 bg-white border border-zinc-200 text-zinc-700 rounded-xl font-medium hover:bg-zinc-50 transition-colors"
                >
                    ← Back
                </button>
            ) : (
                <button
                    onClick={onClose}
                    className="flex-1 py-2.5 bg-white border border-zinc-200 text-zinc-700 rounded-xl font-medium hover:bg-zinc-50 transition-colors"
                >
                    Cancel
                </button>
            )}
            {step < 3 ? (
                <button
                    onClick={() => setStep(step + 1)}
                    disabled={(step === 1 && !canGoToStep2) || (step === 2 && !canGoToStep3)}
                    className="flex-1 py-2.5 bg-[#522DA6] text-white rounded-xl font-medium hover:bg-[#402285] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Continue →
                </button>
            ) : (
                <button
                    onClick={handleSave}
                    disabled={!canSubmit}
                    className="flex-1 py-2.5 bg-[#522DA6] text-white rounded-xl font-medium hover:bg-[#402285] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Create Meeting
                </button>
            )}
        </div>
    );

    return (
        <SidebarModal title="Create New Meeting" onClose={onClose} footer={footerContent} width="max-w-lg">
            {/* Step Indicator */}
            <div className="relative flex justify-between items-center mb-8 px-4">
                {/* Connecting Line */}
                <div className="absolute top-4 left-0 w-full h-0.5 bg-zinc-100 -z-10" />

                {/* Steps */}
                {[
                    { num: 1, label: "Participants" },
                    { num: 2, label: "Location" },
                    { num: 3, label: "Date & Time" }
                ].map((s) => (
                    <div key={s.num} className="flex flex-col items-center gap-2 bg-white px-2">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${s.num < step ? 'bg-emerald-500 text-white shadow-sm' :
                            s.num === step ? 'bg-[#522DA6] text-white shadow-md ring-4 ring-[#522DA6]/10' :
                                'bg-white border-2 border-zinc-200 text-zinc-400'
                            }`}>
                            {s.num < step ? '✓' : s.num}
                        </div>
                        <span className={`text-xs font-medium transition-colors ${s.num <= step ? 'text-[#522DA6]' : 'text-zinc-400'
                            }`}>
                            {s.label}
                        </span>
                    </div>
                ))}
            </div>

            {/* Meeting Type (always visible) */}
            {!fixedType && (
                <div className="mb-6">
                    <label className="block text-xs font-medium text-zinc-500 mb-2">Meeting Type</label>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setType("oneToOne")}
                            className={`flex-1 py-2 border rounded-lg text-sm font-medium transition-colors ${type === "oneToOne" ? "border-violet-200 bg-violet-100 text-violet-700" : "border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50"}`}
                        >
                            1:1 Meeting
                        </button>
                        <button
                            onClick={() => setType("mustMeet")}
                            className={`flex-1 py-2 border rounded-lg text-sm font-medium transition-colors ${type === "mustMeet" ? "border-violet-200 bg-violet-100 text-violet-700" : "border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50"}`}
                        >
                            MustMeet
                        </button>
                    </div>
                </div>
            )}

            {/* Step 1: Participants */}
            {step === 1 && (
                <div className="space-y-4">
                    {/* Organizer Permissions Note */}
                    <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl text-sm text-blue-700 flex items-start gap-2">
                        <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                        <span>As the organizer, you can book meetings that your attendees may not be able to book themselves.</span>
                    </div>

                    {/* Organizer Selection (If Company or Sharer view) */}
                    {(organizerType === 'sharer' || organizerType === 'company') && (
                        <div>
                            <div className="flex items-center gap-2 text-sm font-semibold text-zinc-700 mb-2">
                                <Icons.Users />
                                <span>Organizer (From {organizerType === 'sharer' ? sharer?.id : company?.name})</span>
                            </div>
                            <select
                                className="w-full p-3 bg-white border border-zinc-200 rounded-xl text-sm focus:ring-2 focus:ring-[#522DA6]/20 outline-none"
                                value={selectedOrganizerId}
                                onChange={(e) => setSelectedOrganizerId(e.target.value)}
                            >
                                {possibleOrganizers.map(m => (
                                    <option key={m.id} value={m.id}>{m.name} ({m.role})</option>
                                ))}
                            </select>
                        </div>
                    )}

                    <div>
                        <div className="flex items-center gap-2 text-sm font-semibold text-zinc-700 mb-3">
                            <Icons.UserPlus />
                            <span>Add Invitees ({currentAttendees.length})</span>
                        </div>

                        {/* Search Input */}
                        <div className="relative mb-3">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">
                                <Icons.Search />
                            </div>
                            <input
                                className="w-full pl-10 pr-3 py-3 bg-white border border-zinc-200 rounded-xl text-sm focus:ring-2 focus:ring-[#522DA6]/20 outline-none"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search to add invitee..."
                            />
                            {searchTerm && availableToAdd.length > 0 && (
                                <div className="absolute z-10 mt-1 w-full bg-white border border-zinc-200 rounded-xl shadow-lg max-h-48 overflow-y-auto">
                                    {availableToAdd.slice(0, 5).map(p => (
                                        <button
                                            key={p.id}
                                            onClick={() => handleAdd(p.id)}
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
                                const statusColors = {
                                    Accepted: 'bg-white text-emerald-600 border-zinc-200',
                                    Pending: 'bg-white text-zinc-600 border-zinc-200',
                                    Declined: 'bg-white text-rose-600 border-zinc-200'
                                };
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
                                            {/* Status Dropdown */}
                                            <select
                                                value={status}
                                                onChange={(e) => handleStatusChange(p.id, e.target.value)}
                                                className={`text-xs font-medium px-2 py-1 rounded-lg border cursor-pointer appearance-none pr-6 ${statusColors[status]}`}
                                                style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E\")", backgroundRepeat: 'no-repeat', backgroundPosition: 'right 4px center' }}
                                            >
                                                <option value="Pending">Pending</option>
                                                <option value="Accepted">Accepted</option>
                                                <option value="Declined">Declined</option>
                                            </select>
                                            <button
                                                onClick={() => handleRemove(p.id)}
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
                                    Search and add at least one invitee to continue
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Step 2: Location */}
            {step === 2 && (
                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-sm font-semibold text-zinc-700 mb-3">
                        <Icons.MapPin />
                        <span>Select Location</span>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        {availableLocations.map(loc => (
                            <button
                                key={loc.id}
                                onClick={() => setLocation(loc.id)}
                                className={`p-4 border rounded-xl text-left transition-all ${location === loc.id
                                    ? 'border-[#522DA6] bg-violet-50 ring-2 ring-[#522DA6]/20'
                                    : 'border-zinc-200 bg-white hover:border-zinc-300 hover:bg-zinc-50'
                                    }`}
                            >
                                <div className="font-medium text-zinc-900">{loc.name}</div>
                                <div className="text-xs text-zinc-500">Capacity: {loc.capacity}</div>
                            </button>
                        ))}
                    </div>

                    {/* Selected participants summary */}
                    <div className="mt-4 p-3 bg-zinc-50 rounded-xl">
                        <div className="text-xs font-medium text-zinc-500 mb-2">Meeting with:</div>
                        <div className="flex flex-wrap gap-2">
                            {currentAttendees.map(p => (
                                <span key={p.id} className="inline-flex items-center gap-1.5 px-2 py-1 bg-white border border-zinc-200 rounded-lg text-xs">
                                    <span className="w-4 h-4 rounded-full bg-[#522DA6] text-white text-[8px] font-bold flex items-center justify-center">
                                        {p.name.split(" ").map(n => n[0]).join("").slice(0, 1)}
                                    </span>
                                    {p.name.split(" ")[0]}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Step 3: Date & Time */}
            {step === 3 && (
                <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-violet-50/50 border border-violet-100">
                        <div className="flex items-center gap-2 text-sm font-semibold text-zinc-700 mb-3">
                            <Icons.Calendar />
                            <span>Select Date & Time</span>
                        </div>

                        <div className="mb-3">
                            <label className="block text-xs font-medium text-zinc-500 mb-1">Date</label>
                            <input
                                type="date"
                                className="w-full p-2.5 bg-white border border-zinc-200 rounded-lg text-sm font-medium text-zinc-900 focus:ring-2 focus:ring-[#522DA6]/20 outline-none"
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-zinc-500 mb-1">
                                Available Time Slots ({availableTimeSlots.length})
                            </label>
                            {availableTimeSlots.length > 0 ? (
                                <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                                    {availableTimeSlots.map(slot => (
                                        <button
                                            key={slot}
                                            onClick={() => setSelectedSlot(slot)}
                                            className={`py-2 px-3 border rounded-lg text-sm font-medium transition-all ${selectedSlot === slot
                                                ? 'border-[#522DA6] bg-[#522DA6] text-white'
                                                : 'border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300'
                                                }`}
                                        >
                                            {slot}
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-4 text-center text-amber-600 text-sm bg-amber-50 border border-amber-200 rounded-xl">
                                    No available slots for this date. All participants are busy. Try a different date.
                                </div>
                            )}
                        </div>
                    </div>

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

                    {/* Auto-Accept Toggle */}
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

                    {/* Summary */}
                    <div className="p-3 bg-zinc-50 rounded-xl">
                        <div className="text-xs font-medium text-zinc-500 mb-2">Meeting Summary:</div>
                        <div className="space-y-1 text-sm">
                            <div className="flex justify-between">
                                <span className="text-zinc-500">Location:</span>
                                <span className="font-medium text-zinc-900">{location}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-zinc-500">Participants:</span>
                                <span className="font-medium text-zinc-900">{currentAttendees.length + 1} people</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-zinc-500">Type:</span>
                                <span className="font-medium text-zinc-900">{type === "mustMeet" ? "MustMeet" : "1:1"}</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </SidebarModal>
    );
}

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


export function MustMeetModal({ candidates, organizerEvents, onClose, onConfirm }) {
    const [step, setStep] = useState(1);
    const [date, setDate] = useState("2025-03-21");
    const [selectedCandidate, setSelectedCandidate] = useState(null); // Track selected candidate for Step 3

    // New fields for enhanced MustMeet flow
    const [personalMessage, setPersonalMessage] = useState("");
    const [autoAccept, setAutoAccept] = useState(true); // ON by default for MustMeet

    // Generate 30-min time slots from 08:00 to 18:00
    const allTimeSlots = [];
    for (let h = 8; h < 18; h++) {
        allTimeSlots.push(`${String(h).padStart(2, '0')}:00 - ${String(h).padStart(2, '0')}:30`);
        allTimeSlots.push(`${String(h).padStart(2, '0')}:30 - ${String(h + 1).padStart(2, '0')}:00`);
    }

    // Filter time slots based on organizer availability
    const timeSlots = useMemo(() => {
        if (!organizerEvents) return allTimeSlots;
        const busySlots = organizerEvents
            .filter(e => e.date === date)
            .map(e => ({ start: e.start, end: e.end }));

        return allTimeSlots.filter(slot => {
            const [start, end] = slot.split(' - ');
            return !busySlots.some(b => start < b.end && end > b.start);
        });
    }, [organizerEvents, date]);

    const [timeSlot, setTimeSlot] = useState(timeSlots[0] || "09:00 - 09:30");

    // Update time slot if current selection disappears
    useEffect(() => {
        if (timeSlots.length > 0 && !timeSlots.includes(timeSlot)) {
            setTimeSlot(timeSlots[0]);
        }
    }, [timeSlots, timeSlot]);

    const handleContinue = () => {
        setStep(2);
    };

    const handleBack = () => {
        if (step === 3) {
            setStep(2);
            setSelectedCandidate(null);
        } else {
            setStep(1);
        }
    };

    const handleSelectCandidate = (candidate) => {
        setSelectedCandidate(candidate);
        setStep(3);
    };

    const handleConfirm = () => {
        onConfirm({ ...selectedCandidate, date, time: timeSlot, personalMessage, autoAccept });
    };

    return (
        <SidebarModal
            title={step === 1 ? "Schedule MustMeet: Select Time" : step === 2 ? "Select MustMeet Candidate" : "Confirm Meeting"}
            onClose={onClose}
            width={step === 2 ? "max-w-6xl" : "max-w-lg"}
            footer={step === 1 ? (
                <div className="flex gap-3">
                    <button onClick={onClose} className="flex-1 py-2.5 bg-white border border-zinc-200 text-zinc-700 rounded-xl font-medium hover:bg-zinc-50 transition-colors">Cancel</button>
                    <button
                        onClick={handleContinue}
                        disabled={timeSlots.length === 0}
                        className={`flex-1 py-2.5 rounded-xl font-medium transition-colors ${timeSlots.length === 0 ? "bg-zinc-200 text-zinc-400 cursor-not-allowed" : "bg-[#522DA6] text-white hover:bg-[#402285]"}`}
                    >
                        Continue
                    </button>
                </div>
            ) : null}
        >
            {step === 1 ? (
                <div className="space-y-6">
                    <div className="p-4 rounded-xl bg-violet-50/50 border border-violet-100">
                        <div className="flex items-center gap-2 text-sm font-semibold text-zinc-700 mb-3">
                            <Icons.Clock />
                            <span>Select Date & Time</span>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-medium text-zinc-500 mb-1">Date</label>
                                <input
                                    type="date"
                                    className="w-full p-2.5 bg-white border border-zinc-200 rounded-lg text-sm font-medium text-zinc-900 focus:ring-2 focus:ring-[#522DA6]/20 outline-none"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-zinc-500 mb-1">Time Slot</label>
                                <select
                                    className={`w-full p-2.5 bg-white border border-zinc-200 rounded-lg text-sm focus:ring-2 focus:ring-[#522DA6]/20 outline-none cursor-pointer ${timeSlots.length === 0 ? "text-zinc-400 bg-zinc-50" : ""}`}
                                    value={timeSlot || ""}
                                    onChange={(e) => setTimeSlot(e.target.value)}
                                    disabled={timeSlots.length === 0}
                                >
                                    {timeSlots.length === 0 ? (
                                        <option>No available slots</option>
                                    ) : (
                                        timeSlots.map(slot => (
                                            <option key={slot} value={slot}>{slot}</option>
                                        ))
                                    )}
                                </select>
                            </div>
                        </div>
                    </div>
                    {timeSlots.length === 0 && (
                        <div className="text-sm text-red-600 font-medium">
                            No available time slots on this day. Please select a different date.
                        </div>
                    )}
                    <div className="text-sm text-zinc-500">
                        Select a time slot first. We will then show you the best available candidates matching that time.
                    </div>
                </div>
            ) : step === 2 ? (
                <>
                    <div className="mb-4 flex items-center justify-between">
                        <div className="text-sm text-zinc-500">
                            Showing candidates available at <strong className="text-zinc-900">{timeSlot}, {date}</strong>
                        </div>
                        <button onClick={handleBack} className="text-sm text-[#522DA6] font-medium hover:underline">
                            ← Change Time
                        </button>
                    </div>

                    <div className="overflow-x-auto rounded-xl border border-zinc-200 bg-white">
                        <table className="w-full text-left text-sm min-w-[900px]">
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
                                        <td className="px-4 py-3 font-medium text-zinc-900">{c.companyName}</td>
                                        <td className="px-4 py-3">
                                            <div className="font-medium text-zinc-900">{c.name}</div>
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
                                                onClick={() => handleSelectCandidate(c)}
                                                className="rounded-lg bg-[#522DA6] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#402285] transition-colors shadow-sm"
                                            >
                                                Select
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {candidates.length === 0 && (
                            <div className="p-8 text-center text-zinc-400 text-sm">
                                No active MustMeet candidates found.
                            </div>
                        )}
                    </div>
                </>
            ) : (
                /* Step 3: Confirm Meeting */
                <div className="space-y-6">
                    {/* Meeting Summary */}
                    <div className="p-4 rounded-xl bg-violet-50/50 border border-violet-100">
                        <div className="flex items-center gap-2 text-sm font-semibold text-zinc-700 mb-3">
                            <Icons.Star />
                            <span>Meeting Summary</span>
                        </div>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-zinc-500">Candidate</span>
                                <span className="font-medium text-zinc-900">{selectedCandidate?.name}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-zinc-500">Company</span>
                                <span className="text-zinc-700">{selectedCandidate?.companyName}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-zinc-500">Date & Time</span>
                                <span className="text-zinc-700">{date}, {timeSlot}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-zinc-500">Match Score</span>
                                <ScoreChip score={selectedCandidate?.matchScore} />
                            </div>
                        </div>
                    </div>

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

                    {/* Auto-Accept Toggle */}
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

                    {/* Footer Buttons */}
                    <div className="flex gap-3 pt-4 border-t border-zinc-100">
                        <button
                            onClick={handleBack}
                            className="flex-1 py-2.5 bg-white border border-zinc-200 text-zinc-700 rounded-xl font-medium hover:bg-zinc-50 transition-colors"
                        >
                            ← Back
                        </button>
                        <button
                            onClick={handleConfirm}
                            className="flex-1 py-2.5 bg-[#522DA6] text-white rounded-xl font-medium hover:bg-[#402285] transition-colors"
                        >
                            Confirm Meeting
                        </button>
                    </div>
                </div>
            )}
        </SidebarModal>
    );
}
