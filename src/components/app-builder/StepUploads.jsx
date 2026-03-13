import React from 'react';
import { useAppBuilder } from './AppBuilderContext';
import FileUploadField from './FileUploadField';

export default function StepUploads({ onNext, onBack }) {
  const { state, setField } = useAppBuilder();
  const isView = state.mode === 'view';

  return (
    <>
      <div className="space-y-8 pb-24">
        <div>
          <h2 className="text-lg font-semibold text-zinc-900">
            {isView ? `Version ${state.versionNumber} — File Uploads` : 'File Uploads'}
          </h2>
          <p className="text-sm text-zinc-500 mt-1">
            {isView
              ? 'Viewing the file uploads for this version.'
              : 'Upload the required files for your app build.'}
          </p>
        </div>

        {/* App Icons */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-wide">App Icons</h3>
          <div className="grid grid-cols-2 gap-4">
            <FileUploadField
              label="App Icon"
              accept=".png,.jpg,.jpeg"
              file={state.appIcon}
              onChange={file => !isView && setField('appIcon', file)}
              helperText="1024x1024 PNG recommended. Also used as splash icon."
              previewable
              tooltip="PNG, 1024 x 1024 px"
            />
            <FileUploadField
              label="Adaptive Icon"
              accept=".png,.jpg,.jpeg"
              file={state.adaptiveIcon}
              onChange={file => !isView && setField('adaptiveIcon', file)}
              helperText="1024x1024 PNG recommended. Used for Android adaptive icon."
              previewable
              showCropPreview
              tooltip="1024 x 1024 px. Place your logo/icon in the center 66% (safe zone ~676x676px). Leave the outer edges empty — they get clipped. Use a transparent background. Android requires adaptive icons for proper circular display."
            />
          </div>
        </div>

        {/* Apple .p8 Keys */}
        {state.iosDeployEnabled && (
          <>
            <hr className="border-zinc-200" />
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-wide">Apple Certificates</h3>
              <div className="grid grid-cols-2 gap-4">
                <FileUploadField
                  label="P8 API Key (.p8)"
                  accept=".p8"
                  file={state.appleApiKeyFile}
                  onChange={file => !isView && setField('appleApiKeyFile', file)}
                  helperText={`Upload to: ${state.appleTeamId}/p8_api_key.p8`}
                  tooltip="Source from App Store Connect"
                />
                <FileUploadField
                  label="P8 APN Key (.p8)"
                  accept=".p8"
                  file={state.appleApnKeyFile}
                  onChange={file => !isView && setField('appleApnKeyFile', file)}
                  helperText={`Upload to: ${state.appleTeamId}/p8_apn_key.p8`}
                  tooltip="Source from App Store Connect"
                />
              </div>
            </div>
          </>
        )}
      </div>

      {/* Fixed bottom bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-zinc-200 px-10 py-4 flex items-center justify-between z-30">
        <button
          onClick={onBack}
          className="px-4 py-2 border border-zinc-300 rounded-lg text-sm font-medium text-zinc-700 hover:bg-zinc-50"
        >
          Back
        </button>
        <button
          onClick={onNext}
          className="px-6 py-2.5 bg-[#522DA6] text-white rounded-lg text-sm font-medium hover:bg-[#422389]"
        >
          Continue to Review
        </button>
      </div>
    </>
  );
}
