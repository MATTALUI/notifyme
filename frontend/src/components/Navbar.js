import React from 'react';
import { Link } from 'react-router-dom';

export default class Navbar extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      requests: []
    };
  }

  componentWillReceiveProps=(newProps)=>{
    if(!newProps.user.admin){
      return;
    }
    return fetch('/api/requests',{credentials: 'include'})
    .then(res=>res.json())
    .then((requests)=>{
      this.setState({requests});
    });
  }

  logout=(event)=>{
    event.preventDefault();
    fetch('/api/users/logout', {credentials: 'include', method: 'DELETE'})
    .then(()=>{ window.location = "/"; })
  }

  acceptRequest =(request)=>{
    return fetch('/api/requests',{
      method: 'PATCH',
      credentials: 'include',
      body: JSON.stringify({
        organizationId: request.organization.id,
        requesterId: request.user.id
      }),
      headers: {
        'Content-type': 'application/json'
      }
    })
    .then(res=>res.json())
    .then((acceptance)=>{
      this.setState({requests: this.state.requests.filter(req=>req.id!==request.id)});
    });
  }

  declineRequest = (request)=>{
    return fetch(`/api/requests`,{
      method: 'DELETE',
      credentials: 'include',
      body:JSON.stringify({
        organizationId: request.organization.id,
        requesterId: request.user.id
      }),
      headers: {'Content-type' : 'application/json'}
    })
    .then(res=>res.json())
    .then((deleted)=>{
      this.setState({requests: this.state.requests.filter(req=>req.id!==request.id)});
    });
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
                {this.state.requests.length > 0 && (
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
                      <p>
                        <b>{`${request.user.firstName} ${request.user.lastName} wants to join ${request.organization.title}.`}</b>
                      </p>
                      <div className="request-controls">
                        <button className="btn btn-sm btn-info pull-right" onClick={()=>{this.acceptRequest(request)}}>Accept</button>
                        <button className="btn btn-sm btn-info pull-right" onClick={()=>{this.declineRequest(request)}}>Decline</button>
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

              {false && user.admin && (
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
