import React from 'react';

export default class Navbar extends React.Component{
  logout=(event)=>{
    event.preventDefault();
    fetch('/api/users/logout',{credentials: 'include', method: 'DELETE'})
    .then(()=>{ window.location = "/"; })
  }

  render(){
    return (
      <nav>
        <ul className="nav justify-content-end">
          <li className="nav-item">
            <a className="nav-link disabled" href="" onClick={this.logout}>Log Out</a>
          </li>
          <li className="nav-item">
            <a className="nav-link disabled" href="/about.html">About</a>
          </li>
        </ul>
      </nav>
    );
  }
}
