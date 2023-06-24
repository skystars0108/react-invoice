import React from'react';
import {BrowserRouter , Routes, Route} from 'react-router-dom';

import Home from './pages/Home';
import Invoice from './pages/Invoice';
import Token from './pages/Token';
import PageNotFound from './pages/PageNotFound';

import './App.css';

function App() {
  return (
    <BrowserRouter >
      <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/invoice' element={<Invoice/>} />
          <Route path="/token" element={<Token />}  />

          <Route path='*' element={<PageNotFound />} />
        </Routes>
    </BrowserRouter >
  );
}

export default App;
