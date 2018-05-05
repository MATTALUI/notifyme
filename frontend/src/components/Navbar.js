import React from 'react';
import { Link } from 'react-router-dom';

export default class Navbar extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      requests: []
    };
  }

  // componentWillMount = ()=>{
  //   if(this.props.user.admin){
  //     console.log('you\'re an admin');
  //   }
  // }
  componentWillReceiveProps=(newProps)=>{
    if(!newProps.user.admin){
      return;
    }
    return fetch('/api/requests',{credentials: 'include'})
    .then(res=>res.json())
    .then((requests)=>{
      console.log(requests);
      this.setState({requests});
    });
  }

  logout=(event)=>{
    event.preventDefault();
    fetch('/api/users/logout', {credentials: 'include', method: 'DELETE'})
    .then(()=>{ window.location = "/"; })
  }

  render(){
    const user = this.props.user;
    return (
      <nav>
        <ul className="nav justify-content-end">

          <form className="form-inline" action="/organizations">
            <input className="form-control mr-sm-2" url="/organizations" type="search" name="search" placeholder="Search Organizations"/>
          </form>

          <li className="nav-item">
            <a className="nav-link disabled" href="/">{user.firstName}</a>
          </li>
          <li className="nav-item">

          </li>

          {user.admin && (
            <li className="nav-item dropdown">
              <a id="navbar-action" className="nav-link"  data-toggle="dropdown">
                <i className="fa fa-gavel" style={{fontWeight: '2em'}}></i>
                {this.state.requests.length && (
                  <span className="request-notification">{this.state.requests.length}</span>
                )}
              </a>
              {(this.state.requests.length === 0) ? (
                <div className="dropdown-menu dropdown-menu-right">
                  <div className="dropdown-item">No Requests</div>
                </div>)
                :
                (
                  <div className="dropdown-menu dropdown-menu-right">
                  {this.state.requests.map(request=>(
                    <div className="dropdown-item">
                      <p><b>{`${request.user.firstName} ${request.user.lastName} wants to join ${request.organization.title}.`}</b></p>
                      <div className="row">
                        <button className="btn btn-info col-xs-6 pull-right">Accept</button>
                        <button className="btn btn-info col-xs-6 pull-right">Decline</button>
                      </div>
                    </div>
                  ))}
                  </div>
                )
              }

            </li>
          )}


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
