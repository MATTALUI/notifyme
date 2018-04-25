import React from 'react';
export default class MemberCollapse extends React.Component{
  render(){
    const collapseId = `${this.props.title}-collapse`;
    return(
      <div className="col-sm-10 offset-sm-1">
        <div className="card">

          <div className="card-header">
            <h5 className="center-text clickable" data-toggle="collapse" data-target={`#${collapseId}`}>
              {this.props.title}
            </h5>
          </div>

          <div id={collapseId} className="collapse">
            <div className="card-body">
              <ul className="list-group">
                {this.props.data.map(user=>(
                  <li className="list-group-item">{`${user.firstName} ${user.lastName}`}</li>
                ))}
              </ul>
            </div>
          </div>

        </div>
      </div>
    )
  }
}
