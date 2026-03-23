import React, { useState } from 'react';
import { useAppBuilder } from './AppBuilderContext';
import LockableField from './LockableField';
import PlatformToggle from './PlatformToggle';
import Tooltip from './Tooltip';

const AlertIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
);

export default function StepConfig({ onNext, onCancel }) {
  const { state, setField, lockFields, dispatch } = useAppBuilder();
  const [gameCenterBlocked, setGameCenterBlocked] = useState(false);

  const validate = () => {
    const errors = {};
    if (!state.appName.trim()) errors.appName = 'App name is required';
    if (state.iosDeployEnabled) {
      if (!state.bundleId.trim()) errors.bundleId = 'Bundle ID is required for iOS';
      if (!state.appleTeamId.trim()) errors.appleTeamId = 'Apple Team ID is required (needed for file uploads)';
      if (!state.appleAuthKeyId.trim()) errors.appleAuthKeyId = 'Apple Auth Key ID is required';
      if (!state.appleIssuerId.trim()) errors.appleIssuerId = 'Apple Issuer ID is required';
    }
    if (state.androidDeployEnabled) {
      if (!state.packageId.trim()) errors.packageId = 'Package ID is required for Android';
      if (!state.firebaseAppId.trim()) errors.firebaseAppId = 'Firebase App ID is required';
    }
    return errors;
  };

  const handleSaveAndContinue = () => {
    // Game Center check
    if (state.iosDeployEnabled && state.gameCenterEnabled) {
      setGameCenterBlocked(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    setGameCenterBlocked(false);

    const errors = validate();
    if (Object.keys(errors).length > 0) {
      dispatch({ type: 'SET_ERRORS', errors });
      return;
    }
    if (state.iosDeployEnabled) {
      lockFields(['appleTeamId']);
    }
    lockFields(['bundleId', 'packageId']);
    dispatch({ type: 'MARK_STEP1_SAVED' });
    onNext();
  };

  return (
    <>
      <div className="space-y-8 pb-24">
        <div>
          <h2 className="text-lg font-semibold text-zinc-900">
            {state.mode === 'edit' ? 'Edit Configuration' : 'App Configuration'}
          </h2>
          <p className="text-sm text-zinc-500 mt-1">
            {state.mode === 'edit'
              ? 'Update the configuration for your app build. Identity fields are locked.'
              : 'Enter the basic configuration for your app build. Fields marked with * are required.'}
          </p>
        </div>

        {/* Game Center blocking warning */}
        {gameCenterBlocked && (
          <div className="flex items-start gap-3 px-4 py-3 bg-rose-50 border border-rose-200 rounded-xl">
            <span className="mt-0.5"><AlertIcon /></span>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-rose-800">Game Center is enabled</p>
                <div className="relative group">
                  <button
                    onClick={() => { setField('gameCenterEnabled', false); setGameCenterBlocked(false); }}
                    className="text-xs font-medium text-rose-600 hover:text-rose-800 underline underline-offset-2"
                  >
                    Disable (demo)
                  </button>
                  <div className="absolute bottom-full right-0 mb-1.5 px-2.5 py-1.5 bg-white border border-zinc-200 rounded-md shadow-md text-[11px] text-zinc-600 whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity">
                    Not part of actual flow
                  </div>
                </div>
              </div>
              <p className="text-xs text-rose-700 mt-0.5">
                iOS deployment cannot proceed while Game Center is active for this app. Please disable Game Center externally before continuing.
              </p>
            </div>
          </div>
        )}

        {/* Section 1: App Identity + Version */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-wide">App Identity</h3>
          <LockableField
            label="App Name"
            value={state.appName}
            onChange={v => setField('appName', v)}
            locked={state.lockedFields.includes('appName')}
            placeholder="e.g. Grip Expo"
            error={state.errors.appName}
            required
            tooltip="Max 12 characters including spaces. This is the name displayed underneath the app icon on a user's device Home screen."
          />
          <div className="grid grid-cols-2 gap-4">
            <LockableField
              label="iOS Version"
              value={state.iosVersion}
              onChange={() => {}}
              locked
              placeholder="e.g. 1.2.0"
              tooltip="Auto-assigned. Patch version increments automatically with each new version."
            />
            <LockableField
              label="Android Version"
              value={state.androidVersion}
              onChange={() => {}}
              locked
              placeholder="e.g. 1.2.0"
              tooltip="Auto-assigned. Patch version increments automatically with each new version."
            />
          </div>
        </div>

        <hr className="border-zinc-200" />

        {/* Section 2: Platform Deployment */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-wide">Platform Deployment</h3>
          <div className="space-y-4">
            <PlatformToggle
              platform="ios"
              checked={state.iosDeployEnabled}
              onChange={v => { setField('iosDeployEnabled', v); setGameCenterBlocked(false); }}
            />
            <PlatformToggle
              platform="android"
              checked={state.androidDeployEnabled}
              onChange={v => setField('androidDeployEnabled', v)}
            />
          </div>
        </div>

        {/* Section 3: Apple Configuration */}
        {state.iosDeployEnabled && (
          <>
            <hr className="border-zinc-200" />
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-wide">Apple Configuration</h3>
              <div className="grid grid-cols-2 gap-4">
                <LockableField
                  label="Bundle ID (iOS)"
                  value={state.bundleId}
                  onChange={v => setField('bundleId', v)}
                  locked={state.lockedFields.includes('bundleId')}
                  placeholder="e.g. com.grip.expo2026"
                  helperText={state.lockedFields.includes('bundleId') ? 'Locked — app identity field' : 'Cannot be changed after creation'}
                  error={state.errors.bundleId}
                  required
                  tooltip="Create the ID for the app in this format (e.g. com.xxx.app)"
                />
                <LockableField
                  label="Apple Team ID"
                  value={state.appleTeamId}
                  onChange={v => setField('appleTeamId', v)}
                  locked={state.lockedFields.includes('appleTeamId')}
                  placeholder="e.g. ABC123DEF"
                  helperText={state.lockedFields.includes('appleTeamId') ? 'Locked — determines S3 upload folder' : 'Will be locked after save (determines S3 folder)'}
                  error={state.errors.appleTeamId}
                  required
                  tooltip="Source in Apple Developer Portal"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <LockableField
                  label="Apple Auth Key ID"
                  value={state.appleAuthKeyId}
                  onChange={v => setField('appleAuthKeyId', v)}
                  placeholder="e.g. ABCDEF1234"
                  error={state.errors.appleAuthKeyId}
                  required
                  tooltip="Source from App Store Connect"
                />
              </div>
              <LockableField
                label="Apple Issuer ID"
                value={state.appleIssuerId}
                onChange={v => setField('appleIssuerId', v)}
                placeholder="e.g. 57246542-96fe-1a63-e053-5b8c7c11a4d1"
                error={state.errors.appleIssuerId}
                required
                tooltip="Source from App Store Connect"
              />
              {/* Apple App Store ID — always shown as read-only if present */}
              {state.appleStoreConnectId && (
                <LockableField
                  label="Apple App Store ID"
                  value={state.appleStoreConnectId}
                  locked
                  helperText="Generated after build creation (read-only)"
                  tooltip="Generated once this Step is saved. This field is required for branch."
                />
              )}
            </div>
          </>
        )}

        {/* Section 4: Google & Firebase */}
        {state.androidDeployEnabled && (
          <>
            <hr className="border-zinc-200" />
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-wide">Google & Firebase Configuration</h3>
              <div className="grid grid-cols-2 gap-4">
                <LockableField
                  label="Package ID (Android)"
                  value={state.packageId}
                  onChange={v => setField('packageId', v)}
                  locked={state.lockedFields.includes('packageId')}
                  placeholder="e.g. com.grip.expo2026"
                  helperText={state.lockedFields.includes('packageId') ? 'Locked — app identity field' : 'Cannot be changed after creation'}
                  error={state.errors.packageId}
                  required
                  tooltip="Source in Google Play Console once App created"
                />
                <LockableField
                  label="Firebase App ID"
                  value={state.firebaseAppId}
                  onChange={v => setField('firebaseAppId', v)}
                  placeholder="e.g. 1:1234567890:android:abc123"
                  error={state.errors.firebaseAppId}
                  required
                  tooltip="Sourced from Firebase Project"
                />
              </div>
              {/* Firebase Email Testers */}
              <div>
                <label className="flex items-center text-sm font-medium text-zinc-900 mb-1.5">
                  Firebase Email Testers
                  <Tooltip text="Insert multiple emails — for product and engineering testing only" />
                </label>
                <textarea
                  value={state.firebaseTestersEmail}
                  onChange={e => setField('firebaseTestersEmail', e.target.value)}
                  placeholder="Enter one email per line&#10;e.g. ilia@grip.events&#10;david@grip.events"
                  rows={4}
                  className="w-full px-3 py-2.5 border border-zinc-200 rounded-lg text-sm focus:outline-none resize-y focus:ring-2 focus:ring-[#522DA6]/20 focus:border-[#522DA6]"
                />
                <p className="text-xs text-zinc-400 mt-1">One email per line. These testers will receive builds via Firebase App Tester.</p>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Fixed bottom bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-zinc-200 px-10 py-4 flex items-center justify-between z-30">
        <button
          onClick={onCancel}
          className="px-4 py-2 border border-zinc-300 rounded-lg text-sm font-medium text-zinc-700 hover:bg-zinc-50"
        >
          Cancel
        </button>
        <button
          onClick={handleSaveAndContinue}
          className="px-6 py-2.5 bg-[#522DA6] text-white rounded-lg text-sm font-medium hover:bg-[#422389]"
        >
          Save & Continue
        </button>
      </div>
    </>
  );
}
