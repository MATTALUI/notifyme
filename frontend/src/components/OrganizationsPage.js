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
    fetch(url,{credentials: 'include'})
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
                    <th colspan="4">PUBLIC ORGANIZATIONS</th>
                  </tr>
                </thead>
              )}
              <tbody>
                {this.state.pub.map((org, index)=>(<Organization key={index} {...org}/>))}
              </tbody>
              {this.state.priv.length > 0 && (
                <thead className="thead-light">
                  <tr>
                    <th colspan="4">PRIVATE ORGANIZATIONS</th>
                  </tr>
                </thead>
              )}
              <tbody>
                {this.state.priv.map((org, index)=>(<Organization key={index} {...org}/>))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
}
