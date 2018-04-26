import React from 'react';
export default class GroupSettings extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      newAdmin: null
    };
  }

  updateNewAdmin=()=>{
    this.setState({newAdmin: this.refs.newAdmin.value});
  }

  addAdmin = ()=>{
    return fetch(`/api/organizations/${this.props.groupId}/admins`, {
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify({email: this.state.newAdmin}),
      headers: {
        'Content-type': 'application/json'
      }
    })
    .then(res=>res.json())
    .then((newAdmin)=>{
      if(newAdmin.error){
        alert(newAdmin.error);
      }else{
        alert(`${this.state.newAdmin} was added as an admin.`);
        this.setState({newAdmin: ''});
      }
    });
  }

  render(){
    const collapseId = `group-settings-collapse`;
    return(
      <div className="col-sm-10 offset-sm-1">
        <div className="card">

          <div className="card-header">
            <h5 className="center-text clickable" data-toggle="collapse" data-target={`#${collapseId}`}>
              Group Settings
            </h5>
          </div>

          <div id={collapseId} className="collapse">
            <div className="card-body">

              <div className="row">
                <input onChange={this.updateNewAdmin} ref="newAdmin" value={this.state.newAdmin} type="text" className="col-sm-8 form-control center-text" placeholder="email"/>
                <button className="btn btn-info col-sm-2 offset-sm-2" onClick={this.addAdmin}>Add Admin</button>
              </div>

              <div className="row">
                <div className="offset-sm-4 col-sm-4 form-check">
                  <input className="form-check-input" type="checkbox" checked={this.props.publicGroup} onClick={this.props.togglePublic}/>
                  <label className="form-check-label">Public Group</label>
                </div>
              </div>

              <div className="row">
                <div className="offset-sm-4 col-sm-4 form-check">
                  <input className="form-check-input" type="checkbox" checked={this.props.visibleGroup} onClick={this.props.toggleVisible}/>
                  <label className="form-check-label">Visible Group</label>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    )
  }
}
