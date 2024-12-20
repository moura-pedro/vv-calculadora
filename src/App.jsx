import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage/HomePage';
import MultiStepForm from './components/MultiStepForm/MultiStepForm';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/form/:id" element={<MultiStepForm />} />
            </Routes>
        </Router>
    );
}

export default App;