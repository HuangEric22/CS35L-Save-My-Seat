import { BrowserRouter, Routes, Route} from 'react-router-dom';
import Home from './pages/Home';
import Bar from './components/Bar';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Bar />
        <div className="pages">
          <Routes>
            <Route path="/" element={<Home />} />
            {/* <Route path="/about" element={<About />} />
            <Route path="/dashboard" element={<Dashboard />} /> */}
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
