import "./styles/App.css";

import {Navbar} from "../widgets/navbar";

import {Outlet} from "react-router-dom";


export const App = () => {
    return (
        <div id="app" className="d-flex flex-column h-100">
            <Navbar/>
            <div className="flex-grow-1 w-full px-0">
                <div className="justify-center items-center">
                    <Outlet/>
                </div>
            </div>
        </div>
    );
};
