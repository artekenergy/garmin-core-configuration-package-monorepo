import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import HardwareConfigPage from './pages/HardwareConfigPage';
import PowerConfigPage from './pages/PowerConfigPage';
import HVACConfigPage from './pages/HVACConfigPage';
import PlumbingConfigPage from './pages/PlumbingConfigPage';
import AccessoriesConfigPage from './pages/AccessoriesConfigPage';
import ThemeConfigPage from './pages/ThemeConfigPage';
import EditorPage from './pages/EditorPage';
import PreviewPage from './pages/PreviewPage';
import ExportPage from './pages/ExportPage';
import LoginPage from './pages/LoginPage';
import { SchemaProvider } from './context/SchemaContext';
import { AuthProvider, useAuth } from './context/AuthContext';

function ProtectedRoutes() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return (
    <SchemaProvider>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/hardware" replace />} />
          <Route path="/hardware" element={<HardwareConfigPage />} />
          <Route path="/power" element={<PowerConfigPage />} />
          <Route path="/hvac" element={<HVACConfigPage />} />
          <Route path="/plumbing" element={<PlumbingConfigPage />} />
          <Route path="/accessories" element={<AccessoriesConfigPage />} />
          <Route path="/theme" element={<ThemeConfigPage />} />
          <Route path="/editor" element={<EditorPage />} />
          <Route path="/preview" element={<PreviewPage />} />
          <Route path="/export" element={<ExportPage />} />
        </Routes>
      </Layout>
    </SchemaProvider>
  );
}

function App() {
  return (
    <AuthProvider>
      <ProtectedRoutes />
    </AuthProvider>
  );
}

export default App;
