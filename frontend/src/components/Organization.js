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
    console.log('send a join request', id);
  };

  joinOrLeaveOrganization = (joinOrLeave, orgId)=>{
    if (joinOrLeave === 'join' || joinOrLeave === 'leave'){
      let method = joinOrLeave === 'join' ? 'POST': 'DELETE';
      return fetch(`/api/organizations/${orgId}/join`,{
        method,
        credentials: 'include',
      })
      .then(resp=>resp.json())
      .then((success)=>{
        let member = joinOrLeave === 'join' ? success : !success;
        this.props.updateOrganization({member, id: orgId});
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
    return (
      <tr>
        <td>{title}</td>
        <td>{description}</td>
        <td>
          {member?(
            <button className="btn btn-secondary col-sm-12" onClick={this.leaveOrganization}>Leave</button>
          ):publicOrg?(
            <button className="btn btn-secondary col-sm-12" onClick={this.joinOrganization}>Join</button>
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
