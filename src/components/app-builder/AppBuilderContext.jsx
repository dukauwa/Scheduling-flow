import React, { createContext, useContext, useReducer, useCallback } from 'react';

const INITIAL_STATE = {
  mode: 'new-version', // 'new-version' | 'edit'
  currentStep: 'config', // 'config' | 'uploads' | 'review'

  // Version info
  versionNumber: null,
  iosVersion: '',
  androidVersion: '',

  // Step 1: Configuration
  appName: '',
  bundleId: '',
  packageId: '',
  appleTeamId: '',
  appleAuthKeyId: '',
  appleIssuerId: '',
  firebaseAppId: '',
  firebaseTestersEmail: '',
  iosDeployEnabled: true,
  androidDeployEnabled: true,

  // Game Center (from API)
  gameCenterEnabled: true,
  gameCenterWarningShown: false,

  // Step 2: File uploads
  appIcon: null,
  adaptiveIcon: null,
  appleApiKeyFile: null,
  appleApnKeyFile: null,

  // Post-creation (read-only)
  appleStoreConnectId: null,

  // Build status
  buildStatus: null, // null | 'building' | 'success' | 'failed'
  buildLogs: null,
  iosBuildStatus: null,
  androidBuildStatus: null,

  // Build duration (ms)
  iosBuildStartTime: null,
  androidBuildStartTime: null,
  iosBuildDuration: null,
  androidBuildDuration: null,

  // Published status
  iosPublished: false,
  androidPublished: false,

  // Created dates (per platform)
  iosCreatedAt: null,
  androidCreatedAt: null,

  // Field locks
  lockedFields: [],

  // Validation
  errors: {},
  step1Saved: false,
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_FIELD': {
      if (state.lockedFields.includes(action.field)) return state;
      return { ...state, [action.field]: action.value, errors: { ...state.errors, [action.field]: undefined } };
    }
    case 'LOCK_FIELDS':
      return { ...state, lockedFields: [...new Set([...state.lockedFields, ...action.fields])] };
    case 'SET_STEP':
      return { ...state, currentStep: action.step };
    case 'SET_MODE':
      return { ...state, mode: action.mode };
    case 'SET_BUILD_DATA':
      return { ...state, ...action.data };
    case 'SET_BUILD_STATUS':
      return { ...state, buildStatus: action.status, buildLogs: action.logs || state.buildLogs };
    case 'SET_PLATFORM_BUILD_STATUS': {
      const platformKey = action.platform === 'ios' ? 'iosBuildStatus' : 'androidBuildStatus';
      const updates = { [platformKey]: action.status };
      if (action.appleStoreConnectId) updates.appleStoreConnectId = action.appleStoreConnectId;
      // Track build start time
      if (action.status === 'building') {
        updates[action.platform === 'ios' ? 'iosBuildStartTime' : 'androidBuildStartTime'] = Date.now();
      }
      // Calculate duration on completion
      if (action.status === 'success' || action.status === 'failed') {
        const startKey = action.platform === 'ios' ? 'iosBuildStartTime' : 'androidBuildStartTime';
        const durationKey = action.platform === 'ios' ? 'iosBuildDuration' : 'androidBuildDuration';
        const createdKey = action.platform === 'ios' ? 'iosCreatedAt' : 'androidCreatedAt';
        if (state[startKey]) {
          updates[durationKey] = Date.now() - state[startKey];
        }
        if (action.status === 'success') {
          updates[createdKey] = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) + ', ' + new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
        }
      }
      return { ...state, ...updates };
    }
    case 'SET_ERRORS':
      return { ...state, errors: action.errors };
    case 'MARK_STEP1_SAVED':
      return { ...state, step1Saved: true };
    case 'SET_GAME_CENTER_WARNING':
      return { ...state, gameCenterWarningShown: action.shown };
    case 'RESET':
      return { ...INITIAL_STATE };
    default:
      return state;
  }
}

const AppBuilderContext = createContext(null);

export function AppBuilderProvider({ children, initialData }) {
  const [state, dispatch] = useReducer(reducer, initialData ? { ...INITIAL_STATE, ...initialData } : INITIAL_STATE);

  const setField = useCallback((field, value) => {
    dispatch({ type: 'SET_FIELD', field, value });
  }, []);

  const lockFields = useCallback((fields) => {
    dispatch({ type: 'LOCK_FIELDS', fields });
  }, []);

  const setStep = useCallback((step) => {
    dispatch({ type: 'SET_STEP', step });
  }, []);

  const value = { state, dispatch, setField, lockFields, setStep };

  return (
    <AppBuilderContext.Provider value={value}>
      {children}
    </AppBuilderContext.Provider>
  );
}

export function useAppBuilder() {
  const ctx = useContext(AppBuilderContext);
  if (!ctx) throw new Error('useAppBuilder must be used within AppBuilderProvider');
  return ctx;
}
