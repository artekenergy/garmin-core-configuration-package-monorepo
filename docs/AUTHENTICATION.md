# Authentication System

## Overview

The web configurator is protected with a simple authentication system to ensure only authorized installers can access the configuration tools.

## Credentials

**Username**: `GarminInstaller`  
**Password**: `Powering 2025!`

> ⚠️ **Security Note**: These credentials are for basic access control. For production use with sensitive data, consider implementing a more robust authentication system (e.g., AWS Cognito, Auth0, or similar).

## How It Works

### 1. Login Page

- Users are presented with a login form on first visit
- Username and password are validated against hardcoded credentials
- On successful login, authentication status is stored in `sessionStorage`

### 2. Session Management

- Authentication persists across page refreshes (within same browser session)
- Session ends when:
  - User clicks "Logout" button
  - Browser tab/window is closed
  - Browser is closed

### 3. Protected Routes

- All configurator pages require authentication
- Unauthenticated users are automatically redirected to login page
- No configuration data is accessible without valid credentials

## User Experience

### Login Flow

1. Navigate to the configurator URL
2. See login page with Garmin logo
3. Enter credentials:
   - Username: `GarminInstaller`
   - Password: `Powering 2025!`
4. Click "Sign In"
5. Access all configurator features

### Logout Flow

1. Click "🚪 Logout" button in header (top-right)
2. Immediately redirected to login page
3. Session cleared

## Implementation Details

### Files Created

1. **`src/context/AuthContext.tsx`**
   - React Context for authentication state
   - `AuthProvider` component wraps the entire app
   - `useAuth()` hook for accessing auth state
   - `login()` function validates credentials
   - `logout()` function clears session

2. **`src/pages/LoginPage.tsx`**
   - Login form UI
   - Username/password inputs
   - Show/hide password toggle
   - Error message display
   - Accessible form with proper ARIA labels

3. **`src/pages/LoginPage.module.css`**
   - Styled login card with gradient background
   - Responsive design
   - Smooth animations
   - Form validation styles

### Integration

**App.tsx** structure:

```tsx
<AuthProvider>
  <ProtectedRoutes>
    {isAuthenticated ? (
      <SchemaProvider>
        <Layout>
          <Routes>...</Routes>
        </Layout>
      </SchemaProvider>
    ) : (
      <LoginPage />
    )}
  </ProtectedRoutes>
</AuthProvider>
```

**Layout.tsx** additions:

- Import `useAuth` hook
- Add logout button to header
- Button triggers `logout()` function

## Security Considerations

### Current Implementation

- ✅ Basic access control
- ✅ Session management
- ✅ Credentials not visible in UI
- ✅ Password input type with show/hide toggle
- ⚠️ Credentials hardcoded in source

### For Production Enhancement

Consider these improvements for production:

1. **Environment Variables**

   ```typescript
   const VALID_USERNAME = import.meta.env.VITE_AUTH_USERNAME;
   const VALID_PASSWORD = import.meta.env.VITE_AUTH_PASSWORD;
   ```

2. **Backend Authentication**
   - Move authentication to backend API
   - Use JWT tokens
   - Implement proper password hashing
   - Add rate limiting

3. **AWS Amplify + Cognito**

   ```bash
   amplify add auth
   ```

   - User pools
   - MFA support
   - Password recovery
   - Social login providers

4. **Auth0 / Okta Integration**
   - Enterprise SSO
   - User management
   - Advanced security features
   - Audit logs

## Testing

### Manual Testing

**Valid Login**:

```
Username: GarminInstaller
Password: Powering 2025!
Expected: Redirected to /hardware page
```

**Invalid Login**:

```
Username: WrongUser
Password: WrongPass
Expected: Error message "Invalid username or password"
```

**Session Persistence**:

```
1. Login successfully
2. Navigate to different pages
3. Refresh browser
Expected: Still authenticated
```

**Logout**:

```
1. Login successfully
2. Click "Logout" button
3. Try to navigate back
Expected: Redirected to login page
```

## Troubleshooting

### Issue: Stuck on Login Page

**Solution**: Clear browser sessionStorage

```javascript
// In browser console:
sessionStorage.clear();
location.reload();
```

### Issue: Logout Button Not Visible

**Solution**: Check that Layout.tsx imports and uses `useAuth`

### Issue: Can't Remember Password

**Solution**: Password is case-sensitive: `Powering 2025!`

- Capital P
- Space before 2025
- Exclamation mark at end

## Maintenance

### Changing Credentials

Edit `src/context/AuthContext.tsx`:

```typescript
const VALID_USERNAME = 'NewUsername';
const VALID_PASSWORD = 'NewPassword123!';
```

Then rebuild and redeploy:

```bash
cd packages/web-configurator
pnpm build
```

### Adding Multiple Users

Current implementation supports single user. To add multiple users:

1. Change to array of users:

```typescript
const VALID_USERS = [
  { username: 'GarminInstaller', password: 'Powering 2025!' },
  { username: 'Installer2', password: 'AnotherPass!' },
];
```

2. Update login validation:

```typescript
const login = (username: string, password: string): boolean => {
  const user = VALID_USERS.find((u) => u.username === username && u.password === password);
  return !!user;
};
```

## AWS Amplify Deployment

Authentication works seamlessly with Amplify deployment:

1. Credentials are bundled in the build
2. No environment variable changes needed
3. Session management works via browser storage
4. No additional AWS configuration required

### Optional: Environment Variables in Amplify

To use environment variables instead of hardcoded credentials:

1. **Update AuthContext.tsx**:

```typescript
const VALID_USERNAME = import.meta.env.VITE_AUTH_USERNAME || 'GarminInstaller';
const VALID_PASSWORD = import.meta.env.VITE_AUTH_PASSWORD || 'Powering 2025!';
```

2. **In Amplify Console**:
   - Go to App settings → Environment variables
   - Add:
     - `VITE_AUTH_USERNAME` = `GarminInstaller`
     - `VITE_AUTH_PASSWORD` = `Powering 2025!`

3. **Redeploy**

## Summary

- ✅ Simple authentication system implemented
- ✅ Login page with Garmin branding
- ✅ Session management via sessionStorage
- ✅ Logout functionality in header
- ✅ All routes protected
- ✅ Ready for deployment
- ⚠️ Consider upgrading to enterprise auth for production

**Access the configurator**: Log in with `GarminInstaller` / `Powering 2025!`
