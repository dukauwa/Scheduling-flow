import React, { useState, useCallback } from 'react';
import { useHashRouter } from './router';
import { DEFAULT_CONFIG, GENERATION_HISTORY } from './mockData';
import DashboardShell from './components/DashboardShell';
import ScoringSchedulesHub from './pages/ScoringSchedulesHub';
import GenerateFlow from './pages/GenerateFlow';
import SlotPrioritiesPage from './pages/SlotPrioritiesPage';
import ScheduleDetailPage from './pages/ScheduleDetailPage';
import ScheduleViewPage from './pages/ScheduleViewPage';

export default function App() {
  const { route, navigate } = useHashRouter();
  const [slotRules, setSlotRules] = useState([
    { id: 0, type: "day_time", day: "Monday 20 Jan", time: "09:00", priority: 1 },
    { id: 1, type: "location", location: "Booth A1", day: "All days", timeFrom: "", timeTo: "", priority: 2 },
    { id: 2, type: "location", location: "Booth A2", day: "All days", timeFrom: "", timeTo: "", priority: 3 },
    { id: 3, type: "location", location: "Table 2", day: "All days", timeFrom: "", timeTo: "", priority: 4 },
    { id: 4, type: "location", location: "Public Lounge", day: "All days", timeFrom: "", timeTo: "", priority: 5 },
  ]);
  const [generationConfig, setGenerationConfig] = useState(DEFAULT_CONFIG);
  const [generations, setGenerations] = useState(GENERATION_HISTORY);
  const [lastGeneration, setLastGeneration] = useState(null);
  const [generationStatus, setGenerationStatus] = useState(null); // null | 'running' | 'complete' | 'failed'
  const [currentGeneration, setCurrentGeneration] = useState(null);

  const startGeneration = useCallback(() => {
    const entry = {
      id: `#${String(Math.floor(Math.random() * 90000) + 10000)}`,
      includedTypes: 'MustMeet',
      scope: generationConfig.locations?.length ? generationConfig.locations.join(', ') : 'All Slots',
      itemsGenerated: 312,
      avgMatchScore: 94,
      generatedBy: 'Sarah Lee',
      timeCreated: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) + ', ' + new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
      status: 'running',
    };
    setCurrentGeneration(entry);
    setGenerationStatus('running');

    // Simulate completion after ~10s
    setTimeout(() => {
      const completedEntry = { ...entry, status: 'complete', timeTaken: '~10s' };
      setGenerations(prev => [completedEntry, ...prev]);
      setCurrentGeneration(completedEntry);
      setGenerationStatus('complete');
      setLastGeneration(completedEntry);
    }, 10000);
  }, [generationConfig]);

  const path = route.path;

  // Full-page routes (no sidebar shell)
  if (path.startsWith('/generate')) {
    return (
      <GenerateFlow
        navigate={navigate}
        config={generationConfig}
        setConfig={setGenerationConfig}
        slotRules={slotRules}
        setSlotRules={setSlotRules}
        currentStep={path}
        onStartGeneration={startGeneration}
      />
    );
  }

  // Schedule view page (full grip-scheduling-prototype with MustMeet pre-ticked)
  if (path === '/schedules/view') {
    return <ScheduleViewPage navigate={navigate} />;
  }

  // Individual schedule detail (full page, no shell)
  if (path.startsWith('/schedule/')) {
    return <ScheduleDetailPage navigate={navigate} />;
  }

  // Shell-wrapped routes
  return (
    <DashboardShell navigate={navigate} currentPath={path}>
      {path === '/slot-priorities' ? (
        <SlotPrioritiesPage
          rules={slotRules}
          onRulesChange={setSlotRules}
        />
      ) : (
        <ScoringSchedulesHub
          navigate={navigate}
          activeTab={path === '/schedules' ? 'generations' : 'scores'}
          generations={generations}
          lastGeneration={lastGeneration}
          onDismissBanner={() => setLastGeneration(null)}
          generationStatus={generationStatus}
          currentGeneration={currentGeneration}
        />
      )}
    </DashboardShell>
  );
}
