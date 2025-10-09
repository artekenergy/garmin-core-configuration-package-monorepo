# Export Workflow Update - Two-Stage Export Process

**Date:** October 7, 2025
**Status:** ✅ Complete

## Overview

Redesigned the export workflow to implement a two-stage process: compile/validate first, then allow separate downloads of the deployment package and schema.json. Also added schema upload functionality to the Hardware Configuration page for easy restoration of saved configurations.

## Changes Made

### 1. Export Page Redesign

#### New Two-Stage Process

**Stage 1: Compile Configuration**

- Single "Compile Package" button validates and compiles the configuration
- Performs validation check before compilation
- Shows compilation status (compiling, success, or error)
- Displays success message with icon statistics when complete
- Button becomes disabled and shows checkmark after successful compilation

**Stage 2: Download Files**

- Appears only after successful compilation
- Two separate download options:
  1. **Deployment Package** - Complete ZIP with HMI UI, configuration, and assets
  2. **Schema JSON** - Backup file that can be re-uploaded to restore settings

#### Updated State Management

```typescript
const [isCompiling, setIsCompiling] = useState(false);
const [isDownloading, setIsDownloading] = useState(false);
const [compiledPackage, setCompiledPackage] = useState<{
  deploymentZip: Blob;
  schemaJson: string;
  stats: {
    totalIcons: number;
    libraryIcons: number;
    customIcons: number;
  };
} | null>(null);
const [compilationError, setCompilationError] = useState<string | null>(null);
```

#### New Functions

**`handleCompilePackage()`**

- Validates schema (blocks if validation errors exist)
- Compiles complete deployment package
- Stores compiled package in state for download
- Shows compilation errors if they occur
- Updates UI to show success state

**`handleDownloadDeploymentPackage()`**

- Downloads the compiled deployment ZIP file
- Names file: `{project-name}-deployment.zip`

**`handleDownloadSchemaJSON()`**

- Downloads just the schema.json file
- Names file: `{project-name}-schema.json`
- Used for backup and restoration purposes

#### Updated UI Components

**Success Box**

```tsx
{
  compiledPackage && (
    <div className={styles.successBox}>
      <div className={styles.successIcon}>✅</div>
      <div>
        <strong>Compilation Successful!</strong>
        <p>
          Your configuration has been compiled and validated. Package includes
          {compiledPackage.stats.totalIcons} icons...
        </p>
      </div>
    </div>
  );
}
```

**Download Cards**

```tsx
<div className={styles.downloadOptions}>
  <div className={styles.downloadCard}>
    <div className={styles.downloadIcon}>📦</div>
    <h4>Deployment Package</h4>
    <p>Complete ZIP file with HMI UI, configuration, icons...</p>
    <button onClick={handleDownloadDeploymentPackage}>📥 Download Deployment Package</button>
  </div>

  <div className={styles.downloadCard}>
    <div className={styles.downloadIcon}>📄</div>
    <h4>Schema JSON</h4>
    <p>Backup of your configuration that can be re-uploaded...</p>
    <button onClick={handleDownloadSchemaJSON}>📥 Download schema.json</button>
  </div>
</div>
```

#### Updated Deployment Instructions

Changed from 4 steps to 4 new steps:

1. **Compile Configuration** - Click compile button to validate and create package
2. **Download Files** - Download deployment package and optionally schema.json
3. **Deploy to Garmin Device** - Extract ZIP to device
4. **Launch Application** - Restart HMI application

### 2. Hardware Configuration Page Updates

Added schema upload functionality to allow users to restore saved configurations.

#### New Upload Handler

```typescript
const handleSchemaUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
  const file = event.target.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const content = e.target?.result as string;
      const uploadedSchema = JSON.parse(content);

      // Basic validation
      if (!uploadedSchema.schemaVersion || !uploadedSchema.metadata) {
        throw new Error('Invalid schema file: missing required fields');
      }

      // Update the schema
      updateSchema(uploadedSchema);
      alert(`✅ Schema loaded successfully!`);
    } catch (error) {
      setUploadError(`Failed to load schema: ${error.message}`);
    }
  };

  reader.readAsText(file);
};
```

#### New UI Elements

**Upload Button in Header**

```tsx
<label className={styles.uploadButton}>
  📤 Upload Schema
  <input
    type="file"
    accept=".json,application/json"
    onChange={handleSchemaUpload}
    style={{ display: 'none' }}
  />
</label>
```

**Error Display**

```tsx
{
  uploadError && <div className={styles.uploadError}>⚠️ {uploadError}</div>;
}
```

### 3. CSS Additions

#### ExportPage.module.css

Added new styles for the two-stage workflow:

```css
.sectionDescription {
  color: var(--color-text-secondary);
  margin-bottom: 1.5rem;
  font-size: 0.9375rem;
}

.successBox {
  margin-top: 1.5rem;
  padding: 1.5rem;
  background: #f0fdf4;
  border: 2px solid var(--color-success);
  border-radius: 8px;
  display: flex;
  gap: 1rem;
  align-items: flex-start;
}

.successIcon {
  font-size: 2rem;
  flex-shrink: 0;
}

.downloadOptions {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.downloadCard {
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 1.5rem;
  background: var(--color-background);
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.downloadIcon {
  font-size: 2.5rem;
  text-align: center;
}
```

#### HardwareConfigPage.module.css

Added styles for upload functionality:

```css
.headerActions {
  display: flex;
  gap: 0.75rem;
  align-items: center;
}

.uploadButton {
  padding: 0.75rem 1.5rem;
  background: var(--color-primary);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 2px 8px rgba(37, 99, 235, 0.3);
}

.uploadButton:hover {
  background: var(--color-primary-dark);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.4);
}

.uploadError {
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: #fff1f0;
  border: 1px solid var(--color-danger);
  color: var(--color-danger);
  border-radius: 8px;
  font-weight: 500;
}
```

## User Workflow

### Exporting Configuration

1. **Configure** - User configures their system in various pages
2. **Navigate to Export** - Go to Export page
3. **Compile** - Click "Compile Package" button
   - System validates configuration
   - Shows any validation errors (must fix before continuing)
   - Compiles deployment package
   - Shows success message with statistics
4. **Download** - Two download options appear:
   - **Deployment Package** - Upload to Garmin device
   - **Schema JSON** - Save as backup

### Restoring Configuration

1. **Navigate to Hardware Configuration** - First page in workflow
2. **Upload Schema** - Click "📤 Upload Schema" button
3. **Select File** - Choose previously downloaded schema.json
4. **Confirmation** - Shows success message with project name/version
5. **Continue** - All settings restored, can modify and re-export

## Benefits

### Two-Stage Export Process

1. **Clear Separation of Concerns**
   - Compilation/validation separate from download
   - User can verify compilation success before downloading
   - Can download multiple times without recompiling

2. **Better Error Handling**
   - Validation errors shown before compilation
   - Compilation errors shown separately from validation
   - User can fix issues without losing work

3. **Flexible Downloads**
   - Download deployment package for device
   - Download schema.json for backup
   - Can download schema without deployment package

4. **Improved UX**
   - Clear progress indication (Step 1, Step 2)
   - Visual feedback with success box
   - Icons and descriptions for each download option

### Schema Upload Feature

1. **Easy Restoration**
   - Restore entire configuration from backup
   - Quick setup for similar projects
   - Share configurations between team members

2. **Version Control**
   - Save schema.json in version control
   - Track configuration changes over time
   - Roll back to previous configurations

3. **Backup Strategy**
   - Keep backups of working configurations
   - Test changes without losing original
   - Disaster recovery option

## Files Modified

### Core Files

- `packages/web-configurator/src/pages/ExportPage.tsx`
- `packages/web-configurator/src/pages/ExportPage.module.css`
- `packages/web-configurator/src/pages/HardwareConfigPage.tsx`
- `packages/web-configurator/src/pages/HardwareConfigPage.module.css`

### Documentation

- `docs/EXPORT_WORKFLOW_UPDATE.md` (this file)

## Testing Checklist

- [x] Compile button validates schema before proceeding
- [x] Validation errors block compilation
- [x] Compilation success shows statistics
- [x] Deployment package downloads correctly
- [x] Schema JSON downloads correctly
- [x] Schema upload accepts .json files
- [x] Schema upload validates basic structure
- [x] Schema upload updates entire configuration
- [x] Upload error messages display properly
- [x] Can compile multiple times without issues
- [x] Can download multiple times without recompiling
- [x] All CSS styles apply correctly
- [x] No TypeScript compilation errors

## Future Enhancements

Potential improvements for future iterations:

1. **Schema Versioning**
   - Detect schema version mismatches
   - Offer migration tools for old schemas
   - Show version compatibility warnings

2. **Partial Configuration Import**
   - Import only specific subsystems
   - Merge configurations from multiple files
   - Selective restore of settings

3. **Configuration Templates**
   - Pre-built templates for common setups
   - Share community configurations
   - Template marketplace

4. **Deployment History**
   - Track previous deployments
   - Compare configuration versions
   - Quick rollback to previous version

5. **Direct Device Upload**
   - Upload directly to connected Garmin device
   - Skip manual file extraction
   - Progress indication during upload

## Conclusion

The new two-stage export workflow provides a clearer, more reliable process for creating and deploying configurations. Combined with the schema upload feature, users now have a complete backup and restore solution. The separation of compilation and download improves error handling and gives users more control over the export process.
