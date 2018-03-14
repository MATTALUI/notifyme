import React from 'react';
import { Link } from 'react-router-dom';

export default class MyPage extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      user: {
        firstName: "Cool",
        lastName: "Cat",
        email: "",
        phoneNumber: null
      }
    }
  }
  componentWillMount = ()=>{
    fetch('/api/users/me', {credentials: 'include'})
    .then(res=>res.json())
    .then((me)=>{
      this.setState({user: me});
    });
  }

  updateEmail = ()=>{
    let copy = Object.assign({},this.state.user);
    copy.email = this.refs.email.value;
    this.setState({user: copy});
  };

  updatePhoneNumber = ()=>{
    let copy = Object.assign({},this.state.user);
    copy.phoneNumber = this.refs.phone.value;
    console.log(copy);
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

  saveChanges = (event)=>{
    event.preventDefault();
    if(this.props.user.email !== this.state.user.email){
      prompt('you changed your email, better confirm your email');
    }
    console.log('props:');
    console.log(this.props);
    console.log('changes');
    console.log(this.state);
  }

  render(){
    const user = this.state.user;
    return (
      <div>
        <h1 className="center-text">{`${user.firstName} ${user.lastName}`}</h1>
        <div className="row">


          <div className = "col-sm-5 offset-sm-2">
            <form>
              <div className = "form-group col-sm-12">
                <input className="form-control center-text" value={user.email} placeholder="Email" onChange={this.updateEmail} ref="email"/>
              </div>
              <div className = "form-group col-sm-12">
                <input type="number" className="form-control center-text" value={user.phoneNumber} placeholder="Phone Number" onChange={this.updatePhoneNumber} ref="phone"/>
              </div>
              <div className = "form-group col-sm-12">
                <button type="button" className="btn-outline-light form-control disabled" disabled>Connect to Facebook</button>
              </div>
              <div className = "form-group col-sm-12">
                <Link to="/changepassword">
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
      </div>
    )
  }
}
