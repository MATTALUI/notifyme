import React from 'react';
import {toast} from 'react-toastify';
export default class PostMessage extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      organizations: []
    };
  }

  componentWillMount=()=>{
    fetch('/api/organizations/my-memberships',{credentials: 'include'})
    .then(res=>res.json())
    .then((organizations)=>{
      console.log(organizations);
      let orgs = organizations.filter(org=>org.admin);
      this.setState({organizations: orgs});
    });
  }

  postMessage = (event)=>{
    event.preventDefault();
    let organizationId = this.refs.group.value;
    fetch(`/api/organizations/${organizationId}/messages`,{
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify({
        organizationId: organizationId,
        body: this.refs.message.value,
        anonymous: this.refs.anonymous.checked
      }),
      headers: {
        'Content-type': 'application/json'
      }
    })
    .then(res=>res.json())
    .then((post)=>{
      this.refs.message.value = "";
      let org = this.state.organizations.find((org)=>(org.id == organizationId));
      toast.info(`Message sent to ${org.title}.`,{
        position: toast.POSITION.BOTTOM_LEFT,
        className: 'bg-info'
      });
    });
  }

  render(){
    return (
      <div>
        <h1 className="center-text">New Message</h1>
        <div className="container">
          <div className="row">
            <form className="col-sm-12">
              <div className="form-group col-sm-4 form-inline">
                <label>Group</label>
                <select onChange={this.updateGroup} ref="group" className="form-control">
                  {this.state.organizations.map((org)=>(
                    <option value={org.id}>{org.title}</option>
                  ))}
                </select>

                <div className="form-check">
                  <input className="form-check-input" ref="anonymous" type="checkbox"/>
                  <label className="form-check-label">Anonymous</label>
                </div>

              </div>

              <div className="form-group col-sm-12">
                <label>Message</label>
                <textarea className="form-control" rows="15" ref="message"/>
              </div>
              <button className="col-sm-2 offset-sm-10 btn btn-large btn-info" onClick={this.postMessage}>Post</button>
            </form>
          </div>
        </div>
      </div>
    )
  }
}
