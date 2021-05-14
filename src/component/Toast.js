import React from 'react';

const bootstrap = require('bootstrap');

class Toast extends React.Component {
  // constructor(props) {
  //   super(props);
  // }

  componentDidMount() {
    let e = document.getElementById(`toast-${this.props.uid}`)
    e.addEventListener('hidden.bs.toast', () => this.props.onHidden(this.props.uid));

    let t = new bootstrap.Toast(e);
    t.show();
  }

  render() {
    return (
      <div className="toast-container">
        <div className="toast" role="alert" id={`toast-${this.props.uid}`}
          data-bs-autohide={this.props.fine === true ? "true" : "false"}>

          <div className="toast-header">
            <svg className="bd-placeholder-img rounded me-2" width="20" height="20" xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="xMidYMid slice" focusable="false">
              <rect width="100%" height="100%"
                fill={this.props.fine === true ? "#007aff" : "#dc3545"}>
              </rect>
            </svg>
            <strong className="me-auto">
              {this.props.head}
            </strong>
            <button type="button" className="btn-close" data-bs-dismiss="toast"></button>
          </div>

          <div className="toast-body">
            {this.props.body}
          </div>

        </div>
      </div>
    )
  }
}

export default Toast;
