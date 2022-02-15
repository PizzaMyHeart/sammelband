import Form from  './components/Form';
import Navbar from './components/Navbar';
import { BrowserRouter, Routes, Route} from "react-router-dom";
import About from './routes/About';


function App() {
  return (
    
    <div className="App">
      <Navbar />
      <h1>Sammelband</h1>

      <Routes>
        <Route path="/" element={ <Form />} />
        <Route path="/about" element={ <About />}/>
      </Routes>
  
      
    </div>
 
  );
}

export default App;
