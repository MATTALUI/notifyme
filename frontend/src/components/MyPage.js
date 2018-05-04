import React from 'react';
import { Link } from 'react-router-dom';
import ReactModal from 'react-modal';
import {toast} from 'react-toastify';


export default class MyPage extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      user: {
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: null
      },
      loading: false,
      emailAvailable: null,
      modal: false,
      modalLoading: false,
      confirmedPassword: null
    };
  }
  componentWillMount = ()=>{
    fetch('/api/users/me', {credentials: 'include'})
    .then(res=>res.json())
    .then((me)=>{
      this.setState({user: me, loading: false});
    });
  }

  updateEmail = ()=>{
    let newEmail = this.refs.email.value;
    if(!validateEmail(newEmail)){
      let copy = Object.assign({},this.state.user);
      copy.email = newEmail;
      return this.setState({user: copy, emailAvailable: false});
    }
    fetch('/api/users/available-email',{
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify({email: newEmail}),
      headers: {
        'Content-Type': 'Application/json'
      }
    })
    .then(resp=>resp.json())
    .then((available)=>{
      let copy = Object.assign({},this.state.user);
      copy.email = newEmail;
      if (newEmail === this.props.user.email){
        available = null;
      }
      this.setState({user: copy, emailAvailable: available});
    });
  };

  updatePhoneNumber = ()=>{
    let copy = Object.assign({},this.state.user);
    copy.phoneNumber = this.refs.phone.value;
    this.setState({user: copy});
  };

  updatePhonePreference = ()=>{
    let copy = Object.assign({},this.state.user);
    copy.phonePreference = !copy.phonePreference;
    this.setState({user: copy});
  };

  updateEmailPreference = ()=>{
    let copy = Object.assign({},this.state.user);
    copy.emailPreference = !copy.emailPreference;
    this.setState({user: copy});
  };

  updateConfirmPassword = ()=>{
    this.setState({confirmedPassword: this.refs.confirmPassword.value})
  }

  saveChanges = (event)=>{
    event.preventDefault();
    if(this.props.user.email !== this.state.user.email){
      if(this.state.emailAvailable === false){
        return alert('Email Invalid-profile can\'t be saved.');
      }
      //at this point changes will be confirmed through modal handlers
      this.setState({modal: true});
    }else{
      fetch('/api/users',{
        method: 'PATCH',
        credentials: 'include',
        body: JSON.stringify(this.state.user),
        headers: {
          'Content-type': 'application/json'
        }
      })
      .then(resp=>resp.json())
      .then((update)=>{
        toast.info('Saved.',{
          position: toast.POSITION.BOTTOM_LEFT,
          className: 'bg-info'
        });
        this.props.updateUser(update);
      });
    }
  }

  confirmSave = (event)=>{
    event.preventDefault();
    this.setState({modalLoading: true},()=>{
      fetch('/api/users/password-check',{
        method: 'POST',
        credentials: 'include',
        body: JSON.stringify({password: this.state.confirmedPassword}),
        headers: {
          'Content-type': 'application/json'
        }
      })
      .then(resp=>resp.json())
      .then((match)=>{
        if(match){
          fetch('/api/users',{
            method: 'PATCH',
            credentials: 'include',
            body: JSON.stringify(this.state.user),
            headers: {
              'Content-type': 'application/json'
            }
          })
          .then(resp=>resp.json())
          .then((update)=>{
            setTimeout(()=>{
              this.setState({modal: false, modalLoading: false, confirmedPassword: null, emailAvailable: null}, ()=>{this.props.updateUser(update);});
            },1500);
          });
        }else{
          alert('invalid password');
          this.setState({modal: false, modalLoading: false, confirmedPassword: null});
        }
      });
    });
  }

  render(){
    const user = this.state.user;
    if (this.state.loading){return (<div></div>)}
    let emailState;
    switch (this.state.emailAvailable){
      case true:
        emailState = 'is-valid';
        break;
      case false:
        emailState = 'is-invalid'
        break;
      default:
        emailState = null;
    }

    return (
      <div>
        <h1 className="center-text">{`${user.firstName} ${user.lastName}`}</h1>
        <div className="row">


          <div className = "col-sm-5 offset-sm-2">
            <form>
              <div className = "form-group col-sm-12">
                <input className={`form-control center-text ${emailState}`} value={user.email} placeholder="Email" onChange={this.updateEmail} ref="email"/>
              </div>
              <div className = "form-group col-sm-12">
                <input type="number" className="form-control center-text" value={user.phoneNumber} placeholder="Phone Number" onChange={this.updatePhoneNumber} ref="phone"/>
              </div>
              <div className = "form-group col-sm-12">
                <button type="button" className="btn-outline-light form-control disabled" disabled>Connect to Facebook</button>
              </div>
              <div className = "form-group col-sm-12">
                <Link to={`/${user.firstName.toLowerCase()}/password`}>
                  <button type="button" className="btn btn-secondary center-text form-control">Change Password</button>
                </Link>
              </div>
              <div className = "form-group col-sm-12">
                <button className="btn btn-info col-sm-4 offset-sm-8" onClick={this.saveChanges}>Save Changes</button>
              </div>
            </form>
          </div>


          <div className="col-sm-5">
            <form>
              <div className="form-group col-sm-12 preference-check">
                <input type="checkbox" className = "form-check-input" checked={user.emailPreference} onChange={this.updateEmailPreference}/>
                <label className="form-check-label">
                  Send Me Emails
                </label>
              </div>

              <div className="form-group col-sm-12 preference-check">
                <input type="checkbox" className = "form-check-input" checked={user.phonePreference} onChange={this.updatePhonePreference}/>
                <label className="form-check-label">
                  Send Me Texts
                </label>
              </div>

              <div className="form-group col-sm-12 preference-check">
                <input type="checkbox" className = "form-check-input disabled" disabled/>
                <label className="form-check-label">
                  <strike>Post to my Facebook</strike>
                </label>
              </div>
            </form>
          </div>
        </div>







        <ReactModal isOpen={this.state.modal}>
        {this.state.modalLoading ?
          (
            <div>
              <div className="center-loading" style={{marginTop: '20%'}}>
                <img src="/loading.gif"/>
              </div>
            </div>
          )
          :
          (
          <div>
            <h3 className="center-text" style={{marginTop: '20%'}}>To change your email address, please confirm your password.</h3>
            <br/>
            <div className ="row">
              <div className="form-group col-sm-6 offset-sm-3">
                <input type="password" className="form-control center-text" ref="confirmPassword" onChange={this.updateConfirmPassword}/>
                <br/>
                <button className="btn btn-info" onClick={this.confirmSave}>Save Changes</button>
              </div>
            </div>
          </div>
          )
        }
        </ReactModal>
      </div>
    )
  }
}
function validateEmail(email) {
  let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email.toLowerCase());
}
