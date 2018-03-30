import React from 'react';
import jquery from 'jquery';
import { Redirect } from 'react-router-dom';
export default class PasswordChanger extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      password: '',
      newPassword: '',
      confirmPassword: '',
      redirect: false
    };
  }

  updatePassword = ()=>{
    this.setState({password: this.refs.password.value});
  }

  updateNewPassword = ()=>{
    this.setState({newPassword: this.refs.newPassword.value});
  }

  updateConfirmPassword = ()=>{
    this.setState({confirmPassword: this.refs.confirmPassword.value});
  }

  changePassword = (event)=>{
    event.preventDefault();
    if (this.state.newPassword !== this.state.confirmPassword){
      jquery('.confirmy').addClass('is-invalid');
      return;
    }else{
      jquery('.confirmy').removeClass('is-invalid');
    }
    return fetch('/api/users',{
      credentials: 'include',
      method: 'PATCH',
      body: JSON.stringify({
        password: this.state.password,
        newPassword: this.state.newPassword
      }),
      headers: {
        'Content-type': 'application/json'
      }
    })
    .then(res=>res.json())
    .then((confirmation)=>{
      if(!confirmation.error){
        this.setState({redirect: true});
      }
    });
  }

  render(){
    return (
      <div>
        <h3 className="center-text">Change your password</h3>
        <form className="col-sm-6 offset-sm-3">

          <div className="form-group">
            <input type="password" ref="password" onChange={this.updatePassword} className="col-sm-12 form-control" placeholder="Password"/>
          </div>

          <div className="form-group">
            <input type="password" ref="newPassword" onChange={this.updateNewPassword} className="col-sm-12 form-control confirmy" placeholder="New Password"/>
          </div>

          <div className="form-group">
            <input type="password" ref="confirmPassword" onChange={this.updateConfirmPassword} className="col-sm-12 form-control confirmy" placeholder="Confirm Password"/>
          </div>

          <div className="form-group">
            <button className="btn btn-info float-right" onClick={this.changePassword}>Change Password</button>
          </div>
        </form>
        {this.state.redirect && (<Redirect push to="/"/>)}
      </div>
    );
  }
}
