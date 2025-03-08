import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";
import { useContext, useEffect } from "react";
import { publicRoutes, authRoutes } from "./routes";
import DefaultLayout from "./layouts/MainLayout";
import { AuthProvider, AuthContext } from "./context/AuthLocket";
import { ThemeProvider } from "./context/ThemeContext"; // 🟢 Import ThemeProvider
import Loading from "./components/Loading";
import ToastProvider from "./components/Toast";

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <AppContent />
        </Router>
        <ToastProvider />
      </AuthProvider>
    </ThemeProvider>
  );
}

function AppContent() {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();

  // Cập nhật title khi thay đổi route
  useEffect(() => {
    const allRoutes = [...publicRoutes, ...authRoutes];
    const currentRoute = allRoutes.find((route) => route.path === location.pathname);
    document.title = currentRoute ? currentRoute.title : "Ứng dụng của bạn";
  }, [location.pathname]);

  // Nếu đang kiểm tra xác thực, hiển thị loading
  if (loading) return <Loading />;

  return (
    <Routes>
      {user
        ? // Nếu đã đăng nhập, render authRoutes
          authRoutes.map(({ path, component: Component }, index) => (
            <Route
              key={index}
              path={path}
              element={
                <DefaultLayout>
                  <Component />
                </DefaultLayout>
              }
            />
          ))
        : // Nếu chưa đăng nhập, render publicRoutes
          publicRoutes.map(({ path, component: Component }, index) => (
            <Route
              key={index}
              path={path}
              element={
                <DefaultLayout>
                  <Component />
                </DefaultLayout>
              }
            />
          ))}

      {/* Điều hướng: Nếu chưa đăng nhập mà vào authRoutes -> chuyển hướng login */}
      {!user &&
        authRoutes.map(({ path }, index) => (
          <Route key={index} path={path} element={<Navigate to="/login" />} />
        ))}

      {/* Điều hướng: Nếu đã đăng nhập mà vào publicRoutes -> chuyển hướng home */}
      {user &&
        publicRoutes.map(({ path }, index) => (
          <Route key={index} path={path} element={<Navigate to="/home" />} />
        ))}
    </Routes>
  );
}

export default App;
