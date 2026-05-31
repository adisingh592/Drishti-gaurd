import { createBrowserRouter } from "react-router";
import { RootLayout } from "./layouts/RootLayout";
import { LandingPage } from "./pages/LandingPage";
import { DashboardPage } from "./pages/DashboardPage";
import { LiveDetectionPage } from "./pages/LiveDetectionPage";
import { UploadAnalyzePage } from "./pages/UploadAnalyzePage";
import { IncidentReportsPage } from "./pages/IncidentReportsPage";
import { CrowdIntelligencePage } from "./pages/CrowdIntelligencePage";
import { TrafficSurveillancePage } from "./pages/TrafficSurveillancePage";
import { ThreatAnalyticsPage } from "./pages/ThreatAnalyticsPage";
import { CameraManagementPage } from "./pages/CameraManagementPage";
import { AlertCenterPage } from "./pages/AlertCenterPage";
import { SmartCityPage } from "./pages/SmartCityPage";
import { SecurityMapPage } from "./pages/SecurityMapPage";
import { LoginPage } from "./pages/auth/LoginPage";
import { SignupPage } from "./pages/auth/SignupPage";
import { OTPPage } from "./pages/auth/OTPPage";
import { ForgotPasswordPage } from "./pages/auth/ForgotPasswordPage";
import { SettingsPage } from "./pages/SettingsPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "/auth",
    children: [
      { path: "login", element: <LoginPage /> },
      { path: "signup", element: <SignupPage /> },
      { path: "otp", element: <OTPPage /> },
      { path: "forgot-password", element: <ForgotPasswordPage /> },
    ],
  },
  {
    path: "/app",
    element: <RootLayout />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: "live-detection", element: <LiveDetectionPage /> },
      { path: "upload", element: <UploadAnalyzePage /> },
      { path: "incidents", element: <IncidentReportsPage /> },
      { path: "crowd", element: <CrowdIntelligencePage /> },
      { path: "traffic", element: <TrafficSurveillancePage /> },
      { path: "analytics", element: <ThreatAnalyticsPage /> },
      { path: "cameras", element: <CameraManagementPage /> },
      { path: "alerts", element: <AlertCenterPage /> },
      { path: "city", element: <SmartCityPage /> },
      { path: "map", element: <SecurityMapPage /> },
      { path: "settings", element: <SettingsPage /> },
    ],
  },
]);
