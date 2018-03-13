import React from 'react';

export default class MyPage extends React.Component{
  render(){
    const user = this.props.user;
    return (
      <h1 className="center-text">{`${user.firstName} ${user.lastName}`}</h1>
    )
  }
}
