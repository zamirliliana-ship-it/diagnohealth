import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Landing from "./Pages/Home/Landing"
import IncioS from "./Pages/Home/InicioS"
import Registro from "./Pages/Home/Registro"

function AppContent () {
    return(
        <div>
            <main>
                <Routes>
                    <Route path="/" element={<Landing/>}/>
                    <Route path="/inicioS" element={<IncioS/>}/>
                    <Route path="/registro" element={<Registro/>}/>
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