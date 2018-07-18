import React, { Component } from 'react';
import Message from './Message';
import io from 'socket.io-client';

const apiURI = 'http://localhost:3030/';
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

  componentDidMount() {
    socket.on('message-feed', (data) => {
      console.log(data)
      if (data !== undefined && data !== null) {
      const json = JSON.parse(data);
        const { messages } = json;
        this.setState({ messages, loaded: 'show' });
      }
    });
    socket.on('socket-error', (data) => {
      console.error(data);
    })
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
