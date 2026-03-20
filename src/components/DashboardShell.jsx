import React, { useState } from 'react';

const Icons = {
  Grid: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>,
  Settings: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
  Users: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  BarChart: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
  List: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>,
  Network: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="16" y="16" width="6" height="6" rx="1"/><rect x="2" y="16" width="6" height="6" rx="1"/><rect x="9" y="2" width="6" height="6" rx="1"/><line x1="5" y1="16" x2="5" y2="11"/><line x1="5" y1="11" x2="12" y2="11"/><line x1="12" y1="11" x2="12" y2="8"/><line x1="19" y1="16" x2="19" y2="11"/><line x1="19" y1="11" x2="12" y2="11"/></svg>,
  Target: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>,
  TrendingUp: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>,
  ChevronDown: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>,
  ExternalLink: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>,
  Help: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
  User: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  LifeBuoy: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="4"/><line x1="4.93" y1="4.93" x2="9.17" y2="9.17"/><line x1="14.83" y1="14.83" x2="19.07" y2="19.07"/><line x1="14.83" y1="9.17" x2="19.07" y2="4.93"/><line x1="4.93" y1="19.07" x2="9.17" y2="14.83"/></svg>,
  Sliders: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/><line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/><line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/><line x1="1" y1="14" x2="7" y2="14"/><line x1="9" y1="8" x2="15" y2="8"/><line x1="17" y1="16" x2="23" y2="16"/></svg>,
};

const PROTO_TIP = 'Not available on this prototype';

function NavItem({ icon: Icon, label, isActive, hasSubmenu, onClick }) {
  return (
    <a
      href="#"
      onClick={e => { e.preventDefault(); onClick?.(); }}
      title={onClick ? undefined : PROTO_TIP}
      className={`flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors relative ${isActive ? 'text-[#522DA6] bg-[#522DA6]/5' : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50'}`}
    >
      {isActive && <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#522DA6] rounded-r-sm" />}
      <Icon />
      <span className="flex-1">{label}</span>
      {hasSubmenu && <Icons.ChevronDown />}
    </a>
  );
}

function SubNavItem({ label, isActive, onClick }) {
  return (
    <a
      href="#"
      onClick={e => { e.preventDefault(); onClick?.(); }}
      title={onClick ? undefined : PROTO_TIP}
      className={`block px-4 py-2 pl-12 text-xs font-medium transition-colors ${isActive ? 'text-[#522DA6] bg-[#522DA6]/5' : 'text-zinc-500 hover:text-zinc-900'}`}
    >
      {label}
    </a>
  );
}

export default function DashboardShell({ children, navigate, currentPath }) {
  const isAppSettingsActive = currentPath === '/' || currentPath === '/app-settings';
  const isMustMeetActive = currentPath === '/schedules' || currentPath?.startsWith('/slot-priorities');
  const isScoring = currentPath === '/schedules';
  const isSlotPriorities = currentPath?.startsWith('/slot-priorities');
  const isNetworkingActive = currentPath?.startsWith('/schedules/view');
  const isNetworkingSchedules = currentPath?.startsWith('/schedules/view');

  return (
    <div className="min-h-screen bg-white flex">
      {/* Sidebar */}
      <div className="w-64 border-r border-zinc-200 bg-white flex flex-col fixed inset-y-0 left-0 z-40">
        <div className="p-4 border-b border-zinc-100 space-y-3">
          <div className="flex items-center gap-2 px-1">
            <img src="/grip-logo-sidebar.png" alt="Grip" className="h-8" />
          </div>
          <button title={PROTO_TIP} className="w-full flex items-center justify-between px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-lg text-sm font-medium text-zinc-900 hover:bg-zinc-100">
            <span>Grip Expo</span>
            <Icons.ChevronDown />
          </button>
          <button title={PROTO_TIP} className="w-full flex items-center justify-between px-3 py-2 bg-white border border-zinc-200 rounded-lg text-sm font-medium text-zinc-700 hover:bg-zinc-50">
            <span>Test Event</span>
            <Icons.ChevronDown />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-2 space-y-0.5">
          <NavItem icon={Icons.Grid} label="Event Home" />
          <NavItem icon={Icons.Settings} label="Event Settings" hasSubmenu />

          {/* MustMeet section - expanded */}
          <div>
            <NavItem icon={Icons.Users} label="MustMeet" isActive={isMustMeetActive} hasSubmenu />
            <div className="py-1">
              <SubNavItem label="Settings & Preferences" />
              <SubNavItem
                label="Scoring & Schedules"
                isActive={isScoring}
                onClick={() => navigate?.('#/schedules')}
              />
              <SubNavItem
                label="Slot Priorities"
                isActive={isSlotPriorities}
                onClick={() => navigate?.('#/slot-priorities')}
              />
            </div>
          </div>

          <NavItem icon={Icons.BarChart} label="Data" hasSubmenu />
          <NavItem icon={Icons.List} label="Custom Fields" hasSubmenu />

          {/* Networking section - expanded */}
          <div>
            <NavItem icon={Icons.Network} label="Networking" isActive={isNetworkingActive} hasSubmenu />
            <div className="py-1">
              <SubNavItem label="Meeting list" />
              <SubNavItem label="Meeting Locations" />
              <SubNavItem label="Meeting Feedback" />
              <SubNavItem label="Meeting Analytics" />
              <SubNavItem
                label="Schedules"
                isActive={isNetworkingSchedules}
                onClick={() => navigate?.('#/schedules/view')}
              />
            </div>
          </div>

          <NavItem icon={Icons.Target} label="Engage" hasSubmenu />
          <NavItem icon={Icons.Users} label="Grip Teams" />
          <NavItem icon={Icons.TrendingUp} label="Insights" />
          {/* App Settings section - expanded */}
          <div>
            <NavItem icon={Icons.Settings} label="App Settings" isActive={isAppSettingsActive} hasSubmenu onClick={() => navigate?.('#/app-settings')} />
            <div className="py-1">
              <SubNavItem
                label="App Builder"
                isActive={isAppSettingsActive}
                onClick={() => navigate?.('#/app-settings')}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-64 min-h-screen flex flex-col">
        <header className="h-16 border-b border-zinc-200 bg-white sticky top-0 z-30 px-6 flex items-center justify-end gap-6">
          <button title={PROTO_TIP} className="flex items-center gap-2 text-sm font-medium text-zinc-600 hover:text-zinc-900">
            <Icons.ExternalLink />
            View Event
          </button>
          <button title={PROTO_TIP} className="text-zinc-400 hover:text-zinc-600">
            <Icons.LifeBuoy />
          </button>
          <button title={PROTO_TIP} className="flex items-center gap-2 text-sm font-medium text-zinc-600 hover:text-zinc-900">
            <Icons.User />
            <Icons.ChevronDown />
          </button>
        </header>

        <main className="flex-1 bg-white relative overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
