import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Home from "./Pages/Home/Home"
import Navbar from "./components/layout/Navbar"

function AppContent () {
    return(
        <div>
            <Navbar />
            <main>
                <Routes>
                    <Route path="/" element={<Home/>}/>
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