import ReactDOM from "react-dom/client";
import {App} from "./App";
import { withProviders } from "./providers";
import "./styles/index.css";
import "./styles/app.css";

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);

root.render(withProviders(<App />));
