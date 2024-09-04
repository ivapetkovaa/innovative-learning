import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Aboutpage from "./components/pages/About/About";
import Homepage from "./components/pages/Home/Home";

import Layout from "./components/pages/Layout/Layout";
import UserActions from "./components/pages/UserActions/UserActions";
import CodeEditor from "./components/pages/Courses/CodeEditor/CodeEditor";
import CoursesMain from "./components/pages/CoursesMain/CoursesMain";
import CourseDetails from "./components/pages/CourseDetails/CourseDetails";
import Quiz from "./components/pages/Quiz/Quiz";
import Error from "./components/pages/Error/Error";
import Protected from "./components/pages/ProtectedRoute/ProtectedRouteCustomers";
import ProtectedForUsers from "./components/pages/ProtectedRoute/ProtectedRouteUsers";
import Profile from "./components/pages/Profile/Profile";
import Dashboard from "./components/pages/Dashboard/Dashboard";
import { fetchData } from "./redux/fetchData/fetchData";
import Lecturers from "./components/pages/Lecturers/Lecturers";

function App() {
  fetchData();

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Homepage />} />
          <Route path="lecturers" element={<Lecturers />} />
          <Route path="about" element={<Aboutpage />} />
          <Route path="courses" element={<CoursesMain />} />
          <Route path="/courses/:courseId" element={<CourseDetails />}></Route>
          <Route element={<ProtectedForUsers />}>
            <Route path="/sign-up" element={<UserActions toggle={true} />} />
            <Route path="/log-in" element={<UserActions toggle={false} />} />
          </Route>
          <Route element={<Protected />}>
            <Route path="editor/:taskID" element={<CodeEditor />} />
            <Route
              path="/courses/:courseId/:resourceId/quiz"
              element={<Quiz />}
            />
            <Route path="/profile/:userId" element={<Profile />} />
            <Route path="/:id/dashboard" element={<Dashboard />} />
          </Route>
        </Route>
        <Route path="/error" element={<Error />} />
      </Routes>
    </Router>
  );
}

export default App;
