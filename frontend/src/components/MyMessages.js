import React from 'react';
import Moment from 'react-moment';
export default class MyMessages extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      messages: []
    };
  }

  // componentWillReceiveProps = (props)=>{
  //   console.log(props);
  // }

  componentWillMount(){
    return fetch(`/api/users/me/messages`,{
      credentials: 'include'
    })
    .then(res=>res.json())
    .then((messages)=>{
      this.setState({messages});
    });
  }
  render(){
    return (
      <div>
        <h1 className="center-text">{`${this.props.user.firstName}'s Messages`}</h1>

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

              <div className="card-body">
                {this.state.messages.map(message=>(
                  <div className="card mb-3">
                    <div className="card-header">
                      <h5 className="mb-0">
                        <a href={`/organizations/${message.organization.id}`} className="text-info">
                          {message.organization.title}
                        </a>
                      </h5>
                    </div>
                    <div  className="card-body">
                      <p className="mb-0">
                        {message.body}
                      </p>
                    </div>
                    <div className="card-footer text-muted">
                      <Moment fromNow>{message.created_at}</Moment>
                      {!message.anonymous && ` from ${message.admin.firstName} ${message.admin.lastName}`}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>


      </div>
    )
  }
}
