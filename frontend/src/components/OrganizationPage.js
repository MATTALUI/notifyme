import React from 'react';
import Moment from 'react-moment';
import MemberCollapse from './MemberCollapse.js';
import NewMessageForm from './NewMessageForm.js';
import GroupSettings from './GroupSettings.js';
export default class OrganizationPage extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      id: null,
      title: null,
      description: null,
      public: null,
      member: null,
      admin: null,
      visible: null,
      admins: [],
      members: [],
      messages: []
    };
  }

  componentWillMount=() => {
    let orgId = this.props.match.params.orgId;
    return fetch(`/api/organizations/${orgId}`, {credentials: 'include'})
    .then(res=>res.json())
    .then((org)=>{
      return fetch(`/api/organizations/${orgId}/admins`, {credentials: 'include'})
      .then(res=>res.json())
      .then((admins)=>{
        return fetch(`/api/organizations/${orgId}/members`,{credentials:'include'})
        .then(res=>res.json())
        .then((members)=>{
          return fetch(`/api/organizations/${orgId}/messages`, {credentials: 'include'})
          .then(res=>res.json())
          .then((messages)=>{
            members = members.filter((user)=>{
              let admin = admins.find(admin=>admin.id===user.id);
              return admin === undefined
            });
            this.setState({...org, members, admins, messages});
          });
        });
      });
    });
  }

  handleNewMessage=(newMessage)=>{
    let messages = this.state.messages.slice()
    messages.unshift(newMessage);
    this.setState({messages})
  }

  toggleVisible=()=>{
    this.updateOrganization({visible: !this.state.visible});
  }

  togglePublic=()=>{
    this.updateOrganization({public: !this.state.public});
  }

  updateOrganization=(updates)=>{
    return fetch(`/api/organizations/${this.state.id}`,{
      method: 'PATCH',
      credentials: 'include',
      body: JSON.stringify(updates),
      headers: {
        'Content-type': 'application/json'
      }
    })
    .then(res=>res.json())
    .then((updatedOrganization)=>{
      this.setState(updatedOrganization);
    });
  }
  render(){
    return(
      <div>
        <h1 className="center-text">{this.state.title}</h1>
        <p className="center-text">{this.state.description}</p>
        <br/>
        <div className="row">
          <MemberCollapse title="Admins" data={this.state.admins}/>
          <MemberCollapse title="Members" data={this.state.members}/>

          <div className="col-sm-10 offset-sm-1">
            <div className="card">

              <div className="card-header">
                <h5 className="center-text clickable" data-toggle="collapse"
                data-target="#Messages-collapse">
                  Messages
                </h5>
              </div>

              <div id="Messages-collapse" className="collapse show">
                <br/>

                {this.state.admin && (
                  <NewMessageForm organizationId={this.state.id} organizationTitle={this.state.title} handleNewMessage={this.handleNewMessage}/>
                )}

                <div className="card-body">
                  {this.state.messages.map(message=>(
                    <div className="card mb-3">
                      <div className="card-header">
                        <h5 className="mb-0">
                          {message.anonymous? this.state.title :`${message.admin.firstName} ${message.admin.lastName}`}
                        </h5>
                      </div>
                      <div  className="card-body">
                        <p className="mb-0">
                          {message.body}
                        </p>
                      </div>
                      <div className="card-footer text-muted">
                        <Moment fromNow>{message.created_at}</Moment>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>

          {this.state.admin && (
            <GroupSettings
            groupId={this.state.id}
            publicGroup={this.state.public} togglePublic={this.togglePublic}
            visibleGroup={this.state.visible}
            toggleVisible={this.toggleVisible}
            />
          )}
        </div>
      </div>
    )
  }
}
