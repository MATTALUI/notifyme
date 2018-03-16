import React from 'react';
import { Link } from 'react-router-dom';

export default class Organization extends React.Component{
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
          <button className="btn btn-secondary col-sm-12">Leave</button>
        ):publicOrg?(
          <button className="btn btn-secondary col-sm-12">Join</button>
        ):(
          <button className="btn btn-secondary col-sm-12">Request</button>
        )}
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
