import { ReactElement } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from "react-router-dom";

import Session from "./services/Session";
import Landing from './components/Landing/Landing';
import Groups from "./components/Groups/Groups";
import NotFound from "./components/NotFound/NotFound";

import './App.css';

const ProtectedRoute = (props: { children: ReactElement }) => {
  if (!Session.getCurrentUser()) {
    return <Navigate to="/" replace />;
  }
  return props.children;
};

function App() {
  return (
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
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </header>
    </div>
  );
}

export default App;
