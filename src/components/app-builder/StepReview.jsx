import React, { useState } from 'react';
import { toast } from 'sonner';
import { useAppBuilder } from './AppBuilderContext';
import BuildStatusPanel from './BuildStatusPanel';

const AppleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
);

const AndroidIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M17.6 9.48l1.84-3.18c.16-.31.04-.69-.27-.86-.31-.16-.69-.04-.86.27l-1.86 3.22c-1.35-.6-2.85-.95-4.45-.95s-3.1.35-4.45.95L5.69 5.71c-.16-.31-.54-.43-.86-.27-.31.16-.43.55-.27.86L6.4 9.48C3.3 11.25 1.28 14.44 1 18h22c-.28-3.56-2.3-6.75-5.4-8.52zM7 15.25a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5zm10 0a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5z"/></svg>
);

const EditIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
);

const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
);

const AlertIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
);

const DownloadIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
);

function ReviewField({ label, value, locked }) {
  return (
    <div className="flex items-start justify-between py-2">
      <span className="text-sm text-zinc-500">{label}</span>
      <span className="text-sm font-medium text-zinc-900 text-right flex items-center gap-1.5">
        {value || <span className="text-zinc-300">Not set</span>}
        {locked && (
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-400"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
        )}
      </span>
    </div>
  );
}

function ReviewSection({ title, onEdit, children }) {
  return (
    <div className="border border-zinc-200 rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-5 py-3 bg-zinc-50 border-b border-zinc-200">
        <h3 className="text-sm font-semibold text-zinc-700">{title}</h3>
        {onEdit && (
          <button onClick={onEdit} className="flex items-center gap-1.5 text-xs font-medium text-[#522DA6] hover:underline">
            <EditIcon /> Edit
          </button>
        )}
      </div>
      <div className="px-5 py-2 divide-y divide-zinc-100">
        {children}
      </div>
    </div>
  );
}

function FileStatus({ label, file }) {
  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-sm text-zinc-500">{label}</span>
      {file ? (
        <span className="text-sm font-medium text-green-700 flex items-center gap-1.5">
          <CheckIcon /> {file.name || file}
        </span>
      ) : (
        <span className="text-sm text-zinc-300">Not uploaded</span>
      )}
    </div>
  );
}

export default function StepReview({ onBack, onGoToStep, onBuildUpdated, navigate }) {
  const { state, dispatch } = useAppBuilder();
  const [buildTriggered, setBuildTriggered] = useState(false);
  const [androidWarning, setAndroidWarning] = useState(false);
  const [iosAttempts, setIosAttempts] = useState(0);

  const createBuildObject = (platformOverrides = {}) => {
    return {
      versionNumber: state.versionNumber,
      iosVersion: state.iosVersion,
      androidVersion: state.androidVersion,
      iosBuildStatus: state.iosBuildStatus,
      androidBuildStatus: state.androidBuildStatus,
      iosBuildDuration: state.iosBuildDuration,
      androidBuildDuration: state.androidBuildDuration,
      iosPublished: state.iosPublished,
      androidPublished: state.androidPublished,
      iosCreatedAt: state.iosCreatedAt,
      androidCreatedAt: state.androidCreatedAt,
      appleStoreConnectId: state.appleStoreConnectId,
      config: {
        appName: state.appName,
        bundleId: state.bundleId,
        packageId: state.packageId,
        appleTeamId: state.appleTeamId,
        appleAuthKeyId: state.appleAuthKeyId,
        appleIssuerId: state.appleIssuerId,
        appleKeyName: state.appleKeyName,
        firebaseAppId: state.firebaseAppId,
        firebaseTestersEmail: state.firebaseTestersEmail,
        iosDeployEnabled: state.iosDeployEnabled,
        androidDeployEnabled: state.androidDeployEnabled,
        gameCenterEnabled: state.gameCenterEnabled,
      },
      ...platformOverrides,
    };
  };

  const triggerBuild = (platform) => {
    setBuildTriggered(true);
    dispatch({ type: 'SET_PLATFORM_BUILD_STATUS', platform, status: 'building' });

    // Track iOS attempts — first attempt always fails with cert error
    const currentIosAttempts = platform === 'ios' ? iosAttempts + 1 : iosAttempts;
    if (platform === 'ios') setIosAttempts(currentIosAttempts);

    // Simulate build process
    setTimeout(() => {
      const success = platform === 'ios' ? currentIosAttempts > 1 : true;
      if (success) {
        const ascId = platform === 'ios' ? 'ASC-' + Math.floor(Math.random() * 900000 + 100000) : undefined;
        dispatch({
          type: 'SET_PLATFORM_BUILD_STATUS',
          platform,
          status: 'success',
          ...(ascId ? { appleStoreConnectId: ascId } : {}),
        });
        toast.success(`${platform === 'ios' ? 'iOS' : 'Android'} build completed successfully!`);

        // Update the build object in parent state
        if (onBuildUpdated) {
          // We need to read updated state after dispatch — use setTimeout to let React batch
          setTimeout(() => {
            const now = new Date();
            const createdAt = now.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) + ', ' + now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
            const overrides = {};
            if (platform === 'ios') {
              overrides.iosBuildStatus = 'success';
              overrides.iosCreatedAt = createdAt;
              if (ascId) overrides.appleStoreConnectId = ascId;
            } else {
              overrides.androidBuildStatus = 'success';
              overrides.androidCreatedAt = createdAt;
            }
            onBuildUpdated(createBuildObject(overrides));
          }, 50);
        }
      } else {
        dispatch({
          type: 'SET_PLATFORM_BUILD_STATUS',
          platform,
          status: 'failed',
        });
        dispatch({
          type: 'SET_BUILD_STATUS',
          status: 'failed',
          logs: `Build failed at step 3/5: Code signing error\n\nError: No matching provisioning profile found for bundle ID "${state.bundleId}".\n\nPlease ensure your certificates and provisioning profiles are valid.\nIf this issue persists, try clearing certificates and profiles.`,
        });
        toast.error(`${platform === 'ios' ? 'iOS' : 'Android'} build failed. Check logs for details.`);

        if (onBuildUpdated) {
          setTimeout(() => {
            const overrides = {};
            if (platform === 'ios') overrides.iosBuildStatus = 'failed';
            else overrides.androidBuildStatus = 'failed';
            onBuildUpdated(createBuildObject(overrides));
          }, 50);
        }
      }
    }, 5000);
  };

  const handleAndroidBuild = () => {
    if (!androidWarning) {
      setAndroidWarning(true);
      return;
    }
    setAndroidWarning(false);
    triggerBuild('android');
  };

  const handleClearCertificates = () => {
    toast.info('Certificates and profiles cleared. You can retry the build.');
    dispatch({ type: 'SET_PLATFORM_BUILD_STATUS', platform: 'ios', status: null });
    dispatch({ type: 'SET_BUILD_STATUS', status: null, logs: null });
    setBuildTriggered(false);
  };

  const handleDownloadApk = () => {
    toast.success('APK download started (demo)');
  };

  const iosBuilding = state.iosBuildStatus === 'building';
  const androidBuilding = state.androidBuildStatus === 'building';
  const testerCount = state.firebaseTestersEmail ? state.firebaseTestersEmail.split('\n').filter(e => e.trim()).length : 0;

  return (
    <>
      <div className="space-y-6 pb-24">
        <div>
          <h2 className="text-lg font-semibold text-zinc-900">
            {state.mode === 'edit' ? 'Review & Rebuild' : 'Review & Build'}
          </h2>
          <p className="text-sm text-zinc-500 mt-1">
            Review your configuration and trigger the build when ready.
          </p>
        </div>

        {/* Version Info */}
        <ReviewSection title="Version Info">
          <ReviewField label="Version Number" value={`v${state.versionNumber}`} />
          <ReviewField label="iOS Version" value={state.iosVersion} />
          <ReviewField label="Android Version" value={state.androidVersion} />
        </ReviewSection>

        {/* Config Summary */}
        <ReviewSection title="App Identity" onEdit={() => onGoToStep('config')}>
          <ReviewField label="App Name" value={state.appName} />
        </ReviewSection>

        <ReviewSection title="Deploy Settings" onEdit={() => onGoToStep('config')}>
          <ReviewField label="iOS Deploy" value={state.iosDeployEnabled ? 'Enabled' : 'Disabled'} />
          <ReviewField label="Android Deploy" value={state.androidDeployEnabled ? 'Enabled' : 'Disabled'} />
        </ReviewSection>

        {state.iosDeployEnabled && (
          <ReviewSection title="Apple Configuration" onEdit={() => onGoToStep('config')}>
            <ReviewField label="Bundle ID" value={state.bundleId} locked={state.lockedFields.includes('bundleId')} />
            <ReviewField label="Apple Team ID" value={state.appleTeamId} locked={state.lockedFields.includes('appleTeamId')} />
            <ReviewField label="Apple Key Name" value={state.appleKeyName} />
            <ReviewField label="Apple Auth Key ID" value={state.appleAuthKeyId} />
            <ReviewField label="Apple Issuer ID" value={state.appleIssuerId} />
            {state.appleStoreConnectId && (
              <ReviewField label="Apple App Store ID" value={state.appleStoreConnectId} locked />
            )}
          </ReviewSection>
        )}

        {state.androidDeployEnabled && (
          <ReviewSection title="Google & Firebase" onEdit={() => onGoToStep('config')}>
            <ReviewField label="Package ID" value={state.packageId} locked={state.lockedFields.includes('packageId')} />
            <ReviewField label="Firebase App ID" value={state.firebaseAppId} />
            <ReviewField label="Firebase Testers" value={testerCount > 0 ? `${testerCount} email${testerCount > 1 ? 's' : ''}` : null} />
          </ReviewSection>
        )}

        <ReviewSection title="File Uploads" onEdit={() => onGoToStep('uploads')}>
          <FileStatus label="App Icon" file={state.appIcon} />
          <FileStatus label="Adaptive Icon" file={state.adaptiveIcon} />
          {state.iosDeployEnabled && (
            <>
              <FileStatus label="P8 API Key" file={state.appleApiKeyFile} />
              <FileStatus label="P8 APN Key" file={state.appleApnKeyFile} />
            </>
          )}
        </ReviewSection>

        {/* Build Action Cards */}
        <div className="grid grid-cols-2 gap-4">
          {/* iOS Build Card */}
          <div className={`border rounded-xl p-5 ${state.iosDeployEnabled ? 'border-zinc-200' : 'border-zinc-100 bg-zinc-50 opacity-60'}`}>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-zinc-100 rounded-lg"><AppleIcon /></div>
              <div>
                <h3 className="text-sm font-semibold text-zinc-900">iOS Build</h3>
                <p className="text-xs text-zinc-500">Push to TestFlight</p>
              </div>
            </div>
            {state.iosDeployEnabled ? (
              <>
                <BuildStatusPanel
                  platform="ios"
                  status={state.iosBuildStatus}
                  logs={state.buildLogs}
                  onClearCertificates={handleClearCertificates}
                  duration={state.iosBuildDuration}
                />
                {!state.iosBuildStatus && (
                  <button
                    onClick={() => triggerBuild('ios')}
                    disabled={iosBuilding || androidBuilding}
                    className="w-full mt-3 px-4 py-2.5 bg-[#522DA6] text-white rounded-lg text-sm font-medium hover:bg-[#422389] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Build iOS v{state.iosVersion}
                  </button>
                )}
              </>
            ) : (
              <p className="text-xs text-zinc-400">iOS deployment is disabled</p>
            )}
          </div>

          {/* Android Build Card */}
          <div className={`border rounded-xl p-5 ${state.androidDeployEnabled ? 'border-zinc-200' : 'border-zinc-100 bg-zinc-50 opacity-60'}`}>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-zinc-100 rounded-lg text-green-600"><AndroidIcon /></div>
              <div>
                <h3 className="text-sm font-semibold text-zinc-900">Android Build</h3>
                <p className="text-xs text-zinc-500">Push to App Tester</p>
              </div>
            </div>
            {state.androidDeployEnabled ? (
              <>
                <BuildStatusPanel
                  platform="android"
                  status={state.androidBuildStatus}
                  logs={state.buildLogs}
                  duration={state.androidBuildDuration}
                />
                {/* Download APK button when build succeeds */}
                {state.androidBuildStatus === 'success' && (
                  <button
                    onClick={handleDownloadApk}
                    className="w-full mt-3 flex items-center justify-center gap-2 px-4 py-2 border border-zinc-300 rounded-lg text-sm font-medium text-zinc-700 hover:bg-zinc-50"
                  >
                    <DownloadIcon /> Download APK
                  </button>
                )}
                {androidWarning && !state.androidBuildStatus && (
                  <div className="mt-3 px-3 py-3 bg-amber-50 border border-amber-200 rounded-lg space-y-2">
                    <div className="flex items-start gap-2">
                      <AlertIcon />
                      <p className="text-xs text-amber-800">
                        Android initial setup may require manual configuration. Proceed with build?
                      </p>
                    </div>
                    <div className="flex gap-2 ml-6">
                      <button
                        onClick={handleAndroidBuild}
                        className="px-3 py-1.5 bg-[#522DA6] text-white rounded-lg text-xs font-medium hover:bg-[#422389]"
                      >
                        Continue
                      </button>
                      <button
                        onClick={() => setAndroidWarning(false)}
                        className="px-3 py-1.5 border border-zinc-300 rounded-lg text-xs font-medium text-zinc-700 hover:bg-zinc-50"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
                {!state.androidBuildStatus && !androidWarning && (
                  <button
                    onClick={handleAndroidBuild}
                    disabled={iosBuilding || androidBuilding}
                    className="w-full mt-3 px-4 py-2.5 bg-[#522DA6] text-white rounded-lg text-sm font-medium hover:bg-[#422389] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Build Android v{state.androidVersion}
                  </button>
                )}
              </>
            ) : (
              <p className="text-xs text-zinc-400">Android deployment is disabled</p>
            )}
          </div>
        </div>
      </div>

      {/* Fixed bottom bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-zinc-200 px-10 py-4 flex items-center justify-between z-30">
        <button
          onClick={onBack}
          disabled={iosBuilding || androidBuilding}
          className="px-4 py-2 border border-zinc-300 rounded-lg text-sm font-medium text-zinc-700 hover:bg-zinc-50 disabled:opacity-50"
        >
          Back
        </button>
        <div className="text-xs text-zinc-400">
          {buildTriggered && !iosBuilding && !androidBuilding && (
            <button
              onClick={() => navigate?.('#/')}
              className="px-4 py-2 bg-[#522DA6] text-white rounded-lg text-sm font-medium hover:bg-[#422389]"
            >
              Back to Home
            </button>
          )}
        </div>
      </div>
    </>
  );
}
