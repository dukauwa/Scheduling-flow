import React, { useState, useCallback, useEffect } from 'react';
import { useHashRouter } from './router';
import { DEFAULT_CONFIG, GENERATION_HISTORY, MOCK_APP } from './mockData';
import DashboardShell from './components/DashboardShell';
import ScoringSchedulesHub from './pages/ScoringSchedulesHub';
import GenerateFlow from './pages/GenerateFlow';
import SlotPrioritiesPage from './pages/SlotPrioritiesPage';
import ScheduleDetailPage from './pages/ScheduleDetailPage';
import ScheduleViewPage from './pages/ScheduleViewPage';
import AppBuilderFlow from './pages/AppBuilderFlow';
import AppBuilderHome from './pages/AppBuilderHome';

export default function App() {
  const { route, navigate } = useHashRouter();
  const [slotRules, setSlotRules] = useState([
    { id: 0, day: "Monday 20 Jan", location: "", timeFrom: "09:00", timeTo: "", priority: 1 },
    { id: 1, day: "", location: "Booth A1", timeFrom: "", timeTo: "", priority: 2 },
    { id: 2, day: "", location: "Booth A2", timeFrom: "", timeTo: "", priority: 3 },
    { id: 3, day: "", location: "Table 2", timeFrom: "", timeTo: "", priority: 4 },
    { id: 4, day: "", location: "Public Lounge", timeFrom: "", timeTo: "", priority: 5 },
  ]);
  const [generationConfig, setGenerationConfig] = useState(DEFAULT_CONFIG);
  const [generations, setGenerations] = useState(GENERATION_HISTORY);
  const [lastGeneration, setLastGeneration] = useState(null);
  const [generationStatus, setGenerationStatus] = useState(null);
  const [currentGeneration, setCurrentGeneration] = useState(null);

  // Single build object (null = no build yet)
  const [build, setBuild] = useState(null);
  const appData = MOCK_APP;

  const handleBuildUpdated = useCallback((updatedBuild) => {
    setBuild(updatedBuild);
  }, []);

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

    setTimeout(() => {
      const completedEntry = { ...entry, status: 'complete', timeTaken: '~10s' };
      setGenerations(prev => [completedEntry, ...prev]);
      setCurrentGeneration(completedEntry);
      setGenerationStatus('complete');
      setLastGeneration(completedEntry);
    }, 10000);
  }, [generationConfig]);

  const path = route.path;

  // Redirect root to meeting schedules page
  useEffect(() => {
    if (path === '/') {
      navigate('#/schedules/view');
    }
  }, [path, navigate]);

  if (path === '/') return null;

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

  // App Builder flow (full-page, no shell)
  if (path.startsWith('/app-builder')) {
    return <AppBuilderFlow navigate={navigate} currentPath={path} build={build} appData={appData} onBuildUpdated={handleBuildUpdated} />;
  }

  // Schedule view page
  if (path === '/schedules/view') {
    return <ScheduleViewPage navigate={navigate} />;
  }

  // Individual schedule detail (full page, no shell)
  if (path.startsWith('/schedule/')) {
    return <ScheduleDetailPage navigate={navigate} />;
  }

  // Shell-wrapped routes
  const renderContent = () => {
    if (path === '/slot-priorities') {
      return (
        <SlotPrioritiesPage
          rules={slotRules}
          onRulesChange={setSlotRules}
        />
      );
    }
    if (path === '/schedules') {
      return (
        <ScoringSchedulesHub
          navigate={navigate}
          activeTab="generations"
          generations={generations}
          lastGeneration={lastGeneration}
          onDismissBanner={() => setLastGeneration(null)}
          generationStatus={generationStatus}
          currentGeneration={currentGeneration}
        />
      );
    }
    if (path === '/app-settings') {
      return <AppBuilderHome navigate={navigate} build={build} appData={appData} />;
    }
    return null;
  };

  return (
    <DashboardShell navigate={navigate} currentPath={path}>
      {renderContent()}
    </DashboardShell>
  );
}
