import { ReactElement } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from "react-router-dom";

import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'

import Session from "./services/Session";
import Landing from './components/views/Landing/Landing';
import Groups from "./components/views/Groups/Groups";
import GroupDetails from "./components/views/GroupDetails/GroupDetails";
import StudentsList from "./components/views/StudentsList/StudentsList";
import TasksList from "./components/views/TasksList/TasksList";
import TaskDetails from "./components/views/TaskDetails/TaskDetails";
import TestsList from "./components/views/TestsList/TestsList";
import NewTask from "./components/views/NewTask/NewTask";
import NotFound from "./components/views/NotFound/NotFound";

import './App.css';

const ProtectedRoute = (props: { children: ReactElement }) => {
  if (!Session.getCurrentUser()) {
    return <Navigate to="/" replace />;
  }
  return props.children;
};

function App() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className="App">
        <header>
          <Router>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/groups" element={
                <ProtectedRoute>
                  <Groups />
                </ProtectedRoute>
              } />
              <Route path="/groups/:groupID" element={
                <ProtectedRoute>
                  <GroupDetails />
                </ProtectedRoute>
              } />
              <Route path="/groups/:groupID/students" element={
                <ProtectedRoute>
                  <StudentsList />
                </ProtectedRoute>
              } />
              <Route path="/groups/:groupID/tasks" element={
                <ProtectedRoute>
                  <TasksList />
                </ProtectedRoute>
              } />
              <Route path="/groups/:groupID/tasks/new" element={
                <ProtectedRoute>
                  <NewTask />
                </ProtectedRoute>
              } />
              <Route path="/tasks/:taskID" element={
                <ProtectedRoute>
                  <TaskDetails />
                </ProtectedRoute>
              } />
              <Route path="/tasks/:taskID/tests" element={
                <ProtectedRoute>
                  <TestsList />
                </ProtectedRoute>
              } />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Router>
        </header>
      </div>
    </LocalizationProvider>
  );
}

export default App;
