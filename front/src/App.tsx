import { Routes, Route } from "react-router-dom";
import Home from "./components/mainPage/Home";
import NavBar from "./components/navbar-footer/NavBar";
import './App.css';

import Profile from "./components/profile/Profile";
import ProductForm from "./components/forms/ProductForm";
import MyShop from "./components/shopPage/MyShop";
import { withAuthenticationRequired } from "@auth0/auth0-react";
import Loading from "./components/utils/Loading";
import TailWindNavBar from "./components/navbar-footer/NavBar";


const ProtectedShop = withAuthenticationRequired(MyShop, {
  onRedirecting: () => <Loading />,
}); 
const ProtectedProfile = withAuthenticationRequired(Profile, {
  onRedirecting: () => <Loading />,
});
const ProtectedProductForm = withAuthenticationRequired(ProductForm, {
  onRedirecting: () => <Loading />,
});

const App = () => {
  return (
    <div id="app" className="d-flex flex-column h-100">
      <TailWindNavBar />
      <div className="container flex-grow-1">
        <div className="mt-5">
          <Routes>
            <Route path="/" element={<Home />} />
            
             {/* Secure Route */}
             <Route path="/myshop" element={<ProtectedShop />} />
             <Route path="/profile" element={<ProtectedProfile />} />
             <Route path="/productForm" element={<ProtectedProductForm />} />
             
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default App;
