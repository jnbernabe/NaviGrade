import React, { Suspense, lazy } from "react";
import { Route, Routes } from "react-router-dom";
import { Container, Spinner } from "react-bootstrap";
import Navbar from "./components/Navbar";
import AuthenticationPage from "./components/AuthenticationPage";
import Logout from "./components/Logout";
import { useAuth } from "./contexts/AuthContext";
import "./styles.css";
import Footer from "./components/Footer";

// Lazy load pages
const Home = lazy(() => import("./pages/Home/Home"));
const CalendarContainer = lazy(() => import("./pages/Calendar/CalendarContainer"));
const Courses = lazy(() => import("./pages/Courses/Courses"));
const Assignments = lazy(() => import("./pages/Assignments/Assignments"));
const Login = lazy(() => import("./pages/Login/Login"));
const MyGrades = lazy(() => import("./pages/Grades/MyGrades"));
const Grades = lazy(() => import("./pages/Grades/Grades"));
const EditGrade = lazy(() => import("./pages/Grades/EditGrade"));
const Dashboard = lazy(() => import("./pages/Dashboard/Dashboard"));
const CompletedAssignments = lazy(() => import("./pages/Assignments/CompletedAssignments"));

const LoadingFallback = () => (
  <div className="d-flex justify-content-center align-items-center" style={{ height: "50vh" }}>
    <Spinner animation="border" variant="primary" />
  </div>
);

function App() {
  const { user } = useAuth();

  return (
    <div className="app-wrapper">
      <Navbar />
      <Container className="main-content">
        <Routes>
          {user ? (
            <>
              <Route path="/courses" element={<Suspense fallback={<LoadingFallback />}><Courses /></Suspense>} />
              <Route path="/assignments" element={<Suspense fallback={<LoadingFallback />}><Assignments /></Suspense>} />
              <Route path="/login" element={<Suspense fallback={<LoadingFallback />}><Login /></Suspense>} />

              <Route path="/mygrades" element={<Suspense fallback={<LoadingFallback />}><MyGrades /></Suspense>} />
              <Route path="/grades" element={<Suspense fallback={<LoadingFallback />}><Grades /></Suspense>} />

              <Route
                path="/calendar"
                element={
                  <Suspense fallback={<LoadingFallback />}>
                    <CalendarContainer />
                    <div
                      style={{ width: "100%", height: "600px", margin: "50px" }}
                    />
                  </Suspense>
                }
              />
              <Route path="/editgrade/:id" element={<Suspense fallback={<LoadingFallback />}><EditGrade /></Suspense>} />
              <Route path="/dashboard" element={<Suspense fallback={<LoadingFallback />}><Dashboard /></Suspense>} />
              <Route
                path="/completed-assignments"
                element={<Suspense fallback={<LoadingFallback />}><CompletedAssignments /></Suspense>}
              />
            </>
          ) : (
            <Route path="authentication/*" element={<AuthenticationPage />} />
          )}

          {/* Make Home the default page */}
          <Route path="/" element={<Suspense fallback={<LoadingFallback />}><Home /></Suspense>} />
          <Route path="/logout" element={<Logout />} />

          {/* Duplicate routes removed for cleanliness as they are unreachable if !user condition matches or handled above */}
        </Routes>
      </Container>
      <Footer />
    </div>
  );
}

export default App;
