import Form from  './components/Form';
import Navbar from './components/Navbar';
import { BrowserRouter, Routes, Route} from "react-router-dom";
import About from './routes/About';
import { useState, useLayoutEffect } from 'react';


function App() {
  const [ pocketLoggedIn, setPocketLoggedIn ] = useState(false);

  const firstLoad = () => {
    console.log('firstload()');
    fetch('/api', {
      method: 'GET',
      credentials: 'include',
      mode: 'cors'
    })
    .then(response => response.json())
    .then(data => {
      console.log(data);
      console.log('Pocket logged in: ', data.pocketLoggedIn);
      if (data.pocketLoggedIn) setPocketLoggedIn(true);
      else if (!data.pocketLoggedIn) setPocketLoggedIn(false);
    })
    .catch(err => console.log(err));
  }
  
  firstLoad();


  return (
    
    <div className="App">
      <Navbar />
      <h1>Sammelband</h1>

      <Routes>
        <Route path="/" element={ <Form pocketLoggedIn={ pocketLoggedIn } setPocketLoggedIn={ setPocketLoggedIn }/>} />
        <Route path="/about" element={ <About />}/>
      </Routes>
  
      
    </div>
 
  );
}

export default App;
