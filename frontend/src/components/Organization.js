import React from 'react';
import { Link } from 'react-router-dom';

export default class Organization extends React.Component{
  leaveOrganization = ()=>{
    let orgId = this.props.id;
    this.joinOrLeaveOrganization('leave',orgId);
  };

  joinOrganization = ()=>{
    let orgId = this.props.id;
    this.joinOrLeaveOrganization('join',orgId);
  };

  sendJoinRequest = ()=>{
    let id = this.props.id;
    fetch('/api/requests',{
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify({organizationId: id}),
      headers: {'Content-type': 'application/json'}
    })
    .then(res=>res.json())
    .then((request)=>{
      this.props.updateOrganization({id, requestSent: true });
    });
  };

  joinOrLeaveOrganization = (joinOrLeave, orgId)=>{
    if (joinOrLeave === 'join' || joinOrLeave === 'leave'){
      let method = joinOrLeave === 'join' ? 'POST': 'DELETE';
      return fetch(`/api/organizations/${orgId}/members`,{
        method,
        credentials: 'include',
      })
      .then(resp=>resp.json())
      .then((success)=>{
        let member = joinOrLeave === 'join' ? success : !success;
        this.props.updateOrganization({member, id: orgId, admin: false});
      });
    }else{
      console.log('invalid input');
    }
  };

  render(){
    const id = this.props.id;
    const title = this.props.title;
    const description = this.props.description;
    const publicOrg = this.props.public;
    const member = this.props.member;
    const admin = this.props.admin;
    const requestSent = this.props.requestSent
    return (
      <tr className={admin ? "table-warning" : null}>
        <td >{title}</td>
        <td>{description}</td>
        <td>
          {member?(
            <button className="btn btn-secondary col-sm-12" onClick={this.leaveOrganization}>Leave</button>
          ):publicOrg?(
            <button className="btn btn-secondary col-sm-12" onClick={this.joinOrganization}>Join</button>
          ):requestSent?(
            <button className="btn btn-secondary -col-sm-12" disabled>Request Sent</button>
          ):(
            <button className="btn btn-secondary col-sm-12" onClick={this.sendJoinRequest}>Request</button>
          )}
          &nbsp;
        </td>
        <td>
          {(member || publicOrg) && (<Link to={`/organizations/${id}`}>
            <button className="btn btn-info btn-small">
              <i className="fa fa-toggle-right" style={{fontWeight: '2em'}}></i>
            </button>
          </Link>)}
        </td>
      </tr>
    );
  }
}
