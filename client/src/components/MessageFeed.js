import React, { Component } from 'react';
import Message from './Message';
import io from 'socket.io-client';

const apiURI = 'https://anonymous-texts.herokuapp.com/';
const socket = io(apiURI);

type State = {
  messages: Array<mixed>,
};
export default class MessageFeed extends Component<State> {
  state = {
    // eslint-disable-line no-named-as-default
    messages: [],
    loaded: 'hide',
  };
  // Borrowed from MDN article: https://mzl.la/2qWFipj
  b64DecodeUnicode(str) {
    return decodeURIComponent(Array.prototype.map.call(atob(str), function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
    }).join(''))
  }
 
  componentDidMount() {
    socket.on('message-feed', (data) => {
      const decoded = this.b64DecodeUnicode(data) + ']}';
      
      if (data !== undefined && data !== null) {
      const json = JSON.parse(decoded);
        const { messages } = json;
        this.setState({ messages, loaded: 'show' });
      }
    });
    socket.on('socket-error', (data) => {
      console.error(data);
    });
  }

  render() {
    return (
      <div className="col-container">
        <h2 className="text-center">Recent Activity</h2>
        <div className={`message-feed ${this.state.loaded}`}>
          {this.state.messages.map(message => {
            const { body, sid } = message;
            return (
              <Message
                loaded={this.state.loaded}
                body={body}
                key={sid}
              />
            );
          })}
        </div>
      </div>
    );
  }
}
