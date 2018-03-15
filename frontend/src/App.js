import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Navbar from './components/Navbar.js';
import MyPage from './components/MyPage.js';
import FourOhFour from './components/FourOhFour.js';

class App extends Component {
  constructor(props){
    super(props);
    this.state ={
      user: {}
    };
  }

  componentWillMount = ()=>{
    fetch('/api/users/me',{credentials: 'include'})
    .then(resp=>resp.json())
    .then((user)=>{
      this.setState({user});
    })
  }

  updateUser = (user)=>{
    this.setState({user: user});
  }

  render() {
    return (
      <Router>
        <div>
          <Navbar user={this.state.user}/>
          <Switch>
            <Route exact path="/" render={props=><MyPage user={this.state.user} updateUser={this.updateUser}/>} />
            <Route render={props => <FourOhFour user={this.state.user}/>} />
          </Switch>
        </div>
      </Router>
    );
  }
}

export default App;
