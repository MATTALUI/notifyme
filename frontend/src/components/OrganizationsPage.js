import React from 'react';
import Organization from './Organization.js';

export default class OrganizationsPage extends React.Component{
  constructor(props){
    super(props);
    this.state={
      pub: [],
      priv: []
    };
  }
  componentWillMount(){
    this.fetchOrganizations();
  }

  componentWillReceiveProps = (newProps)=>{
    if (newProps.myOrganizations !== this.props.myOrganizations){
      this.setState({pub: [], priv: []},()=>{
        this.fetchOrganizations();
      });
    }
  };

  fetchOrganizations = ()=>{
    let url = this.props.myOrganizations  ? '/api/organizations/my-memberships' : '/api/organizations';
    return fetch(url,{credentials: 'include'})
    .then(resp=>resp.json())
    .then((orgs)=>{
      let pub = [];
      let priv = [];
      orgs.forEach((org)=>{
        if(!org.visible){
          return;
        }else if(org.public){
          pub.push(org);
        }else{
          priv.push(org);
        }
      });
      this.setState({pub, priv});
    });
  }

  updateOrganization = (update) =>{
    if(!update.id){
      console.error('updating an organization requires an id');
      return;
    }
    let orgId = update.id;
    let updated = 'public';
    let copy = this.state.pub.slice();
    let org = copy.find(org => org.id === orgId);
    if(org === undefined){
      updated = 'private'
      copy = this.state.priv.slice();
      org = copy.find(org => org.id === orgId)
    }
    for(let key in update){
      org[key] = update[key];
    }
    if(updated==='public'){
      this.setState({pub: copy});
    }else{
      this.setState({priv: copy});
    }

  }

  render(){
    return (
      <div>
        <h1 className="center-text">{this.props.myOrganizations ? 'My Organizations':'Organizations'}</h1>
        <div className="row">
          <div className="col-sm-10 offset-sm-1">
            <table className="table">
              {this.state.pub.length > 0 && (
                <thead className="thead-light">
                  <tr>
                    <th colspan="2">PUBLIC ORGANIZATIONS</th>
                    <th><button className="btn btn-large btn-default col-sm-12" style={{visibility: 'hidden'}} disabled>RequestSent</button></th>
                    <th></th>
                  </tr>
                </thead>
              )}
              <tbody>
                {this.state.pub.map((org, index)=>(<Organization key={index} {...org} updateOrganization={this.updateOrganization}/>))}
              </tbody>
              {this.state.priv.length > 0 && (
                <thead className="thead-light">
                  <tr>
                    <th colspan="4">PRIVATE ORGANIZATIONS</th>
                  </tr>
                </thead>
              )}
              <tbody>
                {this.state.priv.map((org, index)=>(<Organization key={index} {...org} updateOrganization={this.updateOrganization}/>))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
}
