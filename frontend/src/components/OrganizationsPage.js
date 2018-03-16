import React from 'react';
import Organization from './Organization.js';

export default class OrganizationsPage extends React.Component{
  constructor(props){
    super(props);
    this.state={
      organizations: [],
      pub: [],
      priv: []
    };
  }
  componentWillMount(){
    fetch('/api/organizations',{credentials: 'include'})
    .then(resp=>resp.json())
    .then((orgs)=>{
      orgs = orgs.sort((x,y)=>{
        //sort public organizations first
        return (x.public === y.public)? 0 : x.public? -1 : 1;
      });
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
      console.log(orgs);
      this.setState({organizations: orgs, pub, priv});
    });
  }
  render(){
    return (
      <div>
        <h1 className="center-text">Organizations</h1>
        <div className="row">
          <div className="col-sm-10 offset-sm-1">
            <table className="table">
              <thead className="thead-light">
                <tr>
                  <th colspan="4">PUBLIC ORGANIZATIONS</th>
                </tr>
              </thead>
              <tbody>
                {this.state.pub.map((org, index)=>(<Organization key={index} {...org}/>))}
              </tbody>
              <thead className="thead-light">
                <tr>
                  <th colspan="4">PRIVATE ORGANIZATIONS</th>
                </tr>
              </thead>
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
