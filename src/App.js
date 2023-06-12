import React from'react';
import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';

import PrivateRoute from './utility/PrivateRoute';
import Home from './pages/Home';
import Invoice from './pages/Invoice';
import Token from './pages/Token';
import Test from './pages/Test';

import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/invoice' element={<Invoice />} />
          <Route path="/token" element={PrivateRoute(Token)}  />
          <Route path="*" element={<Navigate to ="/" />}/>

          <Route path='/test' element={<Test />} />
        </Routes>
    </BrowserRouter>
  );
}

export default App;
