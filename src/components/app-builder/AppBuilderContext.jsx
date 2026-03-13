import React, { createContext, useContext, useReducer, useCallback } from 'react';

const INITIAL_STATE = {
  mode: 'new-version', // 'new-version' | 'view'
  currentStep: 'config', // 'config' | 'uploads' | 'review'

  // Version info
  versionNumber: null,
  iosVersion: '',
  androidVersion: '',
  revertedFrom: null,

  // Step 1: Configuration
  appName: '',
  bundleId: '',
  packageId: '',
  appleTeamId: '',
  appleAuthKeyId: '',
  appleIssuerId: '',
  appleKeyName: '',
  firebaseAppId: '',
  firebaseTestersEmail: '',
  iosDeployEnabled: true,
  androidDeployEnabled: true,

  // Game Center (from API)
  gameCenterEnabled: false,
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

  // Field locks
  lockedFields: [],

  // Validation
  errors: {},
  step1Saved: false,
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_FIELD': {
      // In view mode, reject all changes
      if (state.mode === 'view') return state;
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
    case 'SET_PLATFORM_BUILD_STATUS':
      return {
        ...state,
        [action.platform === 'ios' ? 'iosBuildStatus' : 'androidBuildStatus']: action.status,
        ...(action.appleStoreConnectId ? { appleStoreConnectId: action.appleStoreConnectId } : {}),
      };
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
