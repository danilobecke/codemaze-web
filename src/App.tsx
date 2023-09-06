import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";

import Landing from './components/Landing/Landing';
import NotFound from "./components/NotFound/NotFound";

import './App.css';

function App() {
  return (
    <div className="App">
      <header>
        <Router>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="*" element={<NotFound />}></Route>
          </Routes>
        </Router>
      </header>
    </div>
  );
}

export default App;
