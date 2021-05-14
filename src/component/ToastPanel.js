import React from 'react';
import PubSub from 'pubsub-js';
import overall from '../overall';
import genUid from '../utils/uid';
import Toast from './Toast';

class ToastPanel extends React.Component {
  constructor(props) {
    super(props);

    this.addToast = this.addToast.bind(this);
    this.handleHidden = this.handleHidden.bind(this);

    this.toasts = [];
  }

  __subToken = 0;

  componentDidMount() {
    this.__subToken = PubSub.subscribe(overall.topics.toast, (msg, data) => {
      this.addToast(data.head, data.body, data.fine);
    });
  }

  componentWillUnmount() {
    PubSub.unsubscribe(this.__subToken);
  }

  addToast(head, body, fine=true) {
    this.toasts.push({
      head: head,
      body: body,
      fine: fine,
      key: genUid()
    });
    this.forceUpdate();
  }

  handleHidden(key) {
    let i = this.toasts.map(x => x.key).indexOf(key);
    if (i >= 0) {
      this.toasts.splice(i, 1);
    }
  }

  render() {
    let t = [];
    for (let x of this.toasts) {
      t.push(
        <Toast head={x.head} body={x.body} key={x.key} uid={x.key} fine={x.fine}
          onHidden={this.handleHidden} />
      );
    }

    return (
      <div className="position-fixed top-0 end-0">
        {t}
      </div>
    )
  }
}

export default ToastPanel;
