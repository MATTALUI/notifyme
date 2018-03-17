import React from 'react';
export default class OrganizationPage extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      title: null,
      description: null,
      public: null,
      member: null,
      visible: null
    }
  }
  render(){
    return(
      <div>
        <h1>{this.state.title}</h1>
      </div>
    )
  }
}
