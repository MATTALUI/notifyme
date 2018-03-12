import React, { Component } from 'react';
import Navbar from './components/Navbar.js';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Navbar/>
        <h1>Notify me</h1>
      </div>
    );
  }
}

export default App;
