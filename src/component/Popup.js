import React from 'react';

class PopupPanel extends React.Component {
  render() {
    return (
      <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable show">
        <div></div>
        {this.props.children}
      </div>
    );
  }
}

export default PopupPanel;