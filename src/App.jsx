import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// NavBar
import NavBar from "./components/ui/NavBar";

// Leader Pages
import LeaderHome from "./pages/leaders/Home";

function AppWithRouter() {
  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={<LeaderHome />} />
      </Routes>
    </>
  );
}
export default function App() {
  return (
    <div>
      <Router>
        <AppWithRouter />
      </Router>
    </div>
  );
}
