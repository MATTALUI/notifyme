import React from 'react';
export default class NewMessageForm extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      body: "",
      anonymous: false
    };
  }

  updateBody = ()=>{
    this.setState({body: this.refs.messageBody.value});
  }
  
  toggleAnonymous = ()=>{
    this.setState({anonymous: !this.state.anonymous});
  }

  sendNewMessage = (event)=>{
    event.preventDefault();
    let body = Object.assign({},this.state);
    body.id = this.props.organizationId;
    console.log(body);
  }

  render(){
    return (
      <div className="col-sm-12">
        <form className=" form form-group">
          <textarea rows="5" className="form-control mb-1" placeholder={`New Message for ${this.props.organizationTitle}`} value={this.state.body} onChange={this.updateBody} ref="messageBody"></textarea>
          <div className="row">
          </div>
          <button className="btn btn-info col-sm-12" onClick={this.sendNewMessage}>Send Message</button>
        </form>
      </div>
    )
  }
}
