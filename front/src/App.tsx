import { Routes, Route } from "react-router-dom";
import Home from "./views/Home";
import Profile from "./views/Profile";
import NavBar from "./components/NavBar";

const App = () => {
  return (
    <div id="app" className="d-flex flex-column h-100">
      <NavBar />
      <div className="container flex-grow-1">
        <div className="mt-5">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default App;
