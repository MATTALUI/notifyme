import React from 'react';
import { Link } from 'react-router-dom';

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

          <form className="form-inline">
            <input className="form-control mr-sm-2" type="search" placeholder="Search Organizations"/>
          </form>

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
              {user.admin && (
                <Link className="dropdown-item" to="/messages/new">Post Message</Link>
              )}

              <Link className="dropdown-item" to={user.firstName ? `/${user.firstName.toLowerCase()}/messages`:""}>My Messages</Link>

              <Link to="/organizations" className="dropdown-item">Organizations</Link>

              <Link className="dropdown-item" to={user.firstName ? `/${user.firstName.toLowerCase()}/organizations`:""}>My Organizations</Link>

              {user.admin && (
                <Link className="dropdown-item" to={user.firstName ? `/${user.firstName.toLowerCase()}/organizations/manage`:""}>Manage Organizations</Link>
              )}

              <a className="dropdown-item" onClick={this.logout}>Log Out</a>

              <a style={{color: 'red'}} className="dropdown-item">Delete Account</a>

            </div>
          </li>


        </ul>
      </nav>
    );
  }
}
