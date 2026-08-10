import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Landing from "./Pages/Home/Landing"
import IncioS from "./Pages/Home/InicioS"
import Registro from "./Pages/Home/Registro"
import Chatbot from "./Pages/Home/Chatbot"
import CrisisAlert from "./Pages/Home/CrisisAlert";
import CerrarSesion from "./Pages/Home/CerrarSesion";


function AppContent() {
    return (
        <div>
            <main>
                <Routes>
                    <Route path="/" element={<Landing />} />
                    <Route path="/inicioS" element={<IncioS />} />
                    <Route path="/registro" element={<Registro />} />
                    <Route path="/chatbot" element={<Chatbot />} />
                    <Route path="/crisisAlert" element={<CrisisAlert />} />
                    <Route path="/CerrarSesion" element={<CerrarSesion />} />
                </Routes>
            </main>
        </div>
    )
}

const App = () => {
    return (
        <Router>
            <AppContent />
        </Router>
    )
}

export default App