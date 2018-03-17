import React from 'react';
import { Link } from 'react-router-dom';

export default class Organization extends React.Component{
  leaveOrganization = ()=>{
    let id = this.props.id;
    console.log('leave Organization', id);
  };

  joinOrganization = ()=>{
    let id = this.props.id;
    console.log('join organization', id);
  };

  sendJoinRequest = ()=>{
    let id = this.props.id;
    console.log('send a join request', id);
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
