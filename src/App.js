
import './App.css';
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Signup from './components/Signup';
import Login from './components/Login';
import Home from './components/Home';

function App() {
  return (
    <BrowserRouter> 
    <Routes> 
        <Route exact path="/" element={<Login/>}></Route>  
       <Route exact path="/signup" element={<Signup/>}></Route>
       <Route exact path="/home" element={<Home/>}></Route>  
    </Routes>    
 </BrowserRouter>
  );
}

export default App;
