import Home from "./Home"
import  {AboutPage} from "./About"
import "bootstrap/dist/css/bootstrap.min.css";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

export default function App() {
    return (
      <BrowserRouter>
        <Routes>
        <Route index element={<Home />} />
          <Route path="/About" element={<AboutPage />}>

          </Route>
        </Routes>
      </BrowserRouter>
    );
  }
  
  const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(<App />);
export {
    Home,
  AboutPage
}

