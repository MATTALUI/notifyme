import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import {ToastContainer, toast} from 'react-toastify';
import Navbar from './components/Navbar.js';
import MyPage from './components/MyPage.js';
import MyMessages from './components/MyMessages.js';
import OrganizationsPage from './components/OrganizationsPage.js';
import OrganizationPage from './components/OrganizationPage.js';
import PasswordChanger from './components/PasswordChanger.js';
import FourOhFour from './components/FourOhFour.js';
import './styles/App.css';
import 'react-toastify/dist/ReactToastify.css';

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
            <Route exact path="/" render={props=><MyPage user={this.state.user} updateUser={this.updateUser} {...props}/>} />
            <Route exact path="/organizations" render={props=><OrganizationsPage user={this.state.user} {...props}/>} />
            <Route exact path="/organizations/:orgId" render={props=><OrganizationPage user={this.state.user} {...props}/>} />
            <Route exact path="/:name/organizations" render={props=><OrganizationsPage user={this.state.user} {...props} myOrganizations={true}/>} />
            <Route exact path="/:name/messages" render={props=><MyMessages user={this.state.user}  {...props}/>} />
            <Route exact path="/:name/password" render={props=><PasswordChanger user={this.state.user} {...props}/>} />
            <Route render={props => <FourOhFour user={this.state.user} {...props}/>} />
          </Switch>
          <ToastContainer autoClose={2000}/>
        </div>
      </Router>
    );
  }
}

export default App;
