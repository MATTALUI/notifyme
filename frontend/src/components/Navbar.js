import React from 'react';

export default class Navbar extends React.Component{
  logout=(event)=>{
    event.preventDefault();
    fetch('/api/users/logout',{credentials: 'include', method: 'DELETE'})
    .then(()=>{ window.location = "/"; })
  }
  componentDidMount(){

  }

  render(){
    const user = this.props.user;
    return (
      <nav>
        <ul className="nav justify-content-end">
          <li className="nav-item">
            <a className="nav-link disabled" href="/">{user.firstName}</a>
          </li>
          <li className="nav-item">

          </li>

          <li className="nav-item dropdown">
            <a id="navbar-action" className="nav-link dropdown-toggle"  data-toggle="dropdown" aria-haspopup="true">
              More
            </a>
            <div className="dropdown-menu dropdown-menu-right">
              <a className="dropdown-item" onClick={this.logout}>Log Out</a>
              <a className="dropdown-item" href="/about.html">About</a>
            </div>
          </li>


        </ul>
      </nav>
    );
  }
}
