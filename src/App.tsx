import "./App.css";
import { ConfigProvider, theme } from "antd";
import { Layout } from "./pages/Layout";
import { SignUp } from "./pages/SignUp";
import { SignIn } from "./pages/SignIn";
import { Credentials } from "./pages/Credentials";
import { Credential } from "./pages/Credential";
import { Teams } from "./pages/Teams";
import { Team } from "./pages/Team";
import { Profile } from "./pages/Profile";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useAuthListener } from "./services/Authentication";
import { HomeLogin } from "./pages/HomeSignIn";
import { HomeAuthenticated } from "./pages/HomeAuthenticated";
import { PageNotFound } from "./pages/PageNotFound";

function App() {
  const { authenticated, checkingAuthentication, userUID, teamUID } =
    useAuthListener();

  const ProtectedRoute = ({ children }: any) => {
    return authenticated ? children : <Navigate to={"/signin"} />;
  };

  const SkipIfAuthenticatedRoute = ({ children }: any) => {
    return authenticated ? <Navigate to={"/credentials"} /> : children;
  };

  return (
    <ConfigProvider
      // for future updates: https://ant.design/docs/react/customize-theme#seedtoken
      // colors: https://ant.design/docs/react/customize-theme#seedtoken
      theme={{
        algorithm: theme.darkAlgorithm,
        token: {
          colorLink: "#854eca",
        },
      }}
    >
      {!!!checkingAuthentication && (
        <Router>
          <Layout authenticated={authenticated}>
            <Routes>
              <Route
                path="/"
                element={
                  authenticated ? (
                    <HomeAuthenticated userUID={userUID} />
                  ) : (
                    <HomeLogin />
                  )
                }
              />
              <Route
                path="/signup"
                element={
                  <SkipIfAuthenticatedRoute>
                    <SignUp />
                  </SkipIfAuthenticatedRoute>
                }
              />
              <Route
                path="/signin"
                element={
                  <SkipIfAuthenticatedRoute>
                    <SignIn />
                  </SkipIfAuthenticatedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile userUID={userUID} />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/credentials"
                element={
                  <ProtectedRoute>
                    <Credentials userUID={userUID} teamUID={teamUID} />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/credential/:id"
                element={
                  <ProtectedRoute>
                    <Credential userUID={userUID} teamUID={teamUID} />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/teams"
                element={
                  <ProtectedRoute>
                    <Teams userUID={userUID} />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/team/:id"
                element={
                  <ProtectedRoute>
                    <Team teamUID={teamUID} />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<PageNotFound />} />
            </Routes>
          </Layout>
        </Router>
      )}
    </ConfigProvider>
  );
}

export default App;
