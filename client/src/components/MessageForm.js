import React, { Component } from 'react';
import { StripeProvider } from 'react-stripe-elements';
import axios from 'axios';

import Checkout from './stripe/Elements';
import './message-form.css';
export default class MessageFeed extends Component {
  // Constructor not needed in React 16
  state = { // eslint-disable-line
    recipient: '',
    message: '',
    token: '',
    validPhone: false,
    clearFields: false
  };

  setStripeToken = token => {
    this.setState({ token });
  };

  loadingStatus = (status, message) => {
    const { updateParentState } = this.props;
    switch (status) {
      case 'loading':
        updateParentState('loadMessage', {
          message: [],
          loading: true,
          confirmed: false,
          error: false,
        });
        break;
      case 'error':
        updateParentState('loadMessage', {
          message,
          loading: false,
          confirmed: false,
          error: true,
        });
        setTimeout(() => {
          updateParentState('loadMessage', {
            message,
            loading: false,
            confirmed: false,
            error: false,
          });
        }, 2000);
        break;
      case 'confirmed':
        updateParentState('loadMessage', {
          message: [],
          loading: false,
          confirmed: true,
          error: false,
        });
        setTimeout(() => {
          updateParentState('loadMessage', {
            message: [],
            loading: false,
            confirmed: false,
            error: false,
          });
        }, 2000);
        break;
      case 'errorNoOverlay':
        updateParentState('loadMessage', {
          message,
          loading: false,
          confirmed: false,
          error: false,
        });
        break;
      default:
        updateParentState('loadMessage', {
          message: [],
          loading: false,
          confirmed: false,
          error: false,
        });
    }
  };

  validatePhone = recipient => {
    this.setState({ validPhone: true });
  };

  sendForm = () => {
    const { message, recipient, token, validPhone } = this.state;
    this.loadingStatus('loading');

    this.validatePhone(recipient);

    if (
      message !== '' &&
      recipient !== '' &&
      // validPhone &&
      token !== undefined
    ) {
      this.loadingStatus('loading');
      return axios
        .post(apiURI + send, {
          message,
          recipient,
          token: token.id,
        })
        .then(res => {
          this.loadingStatus('confirmed');
          this.setState({
            recipient: '',
            message: '',
            token: '',
            clearFields: true
          });

        })
        .catch(error => {
          if(error.message) {
            this.loadingStatus('error', [error.message]);
          } else {
            this.loadingStatus('error', ['An error occured. Please check your internet connection and try again.']);
          }
        });
    } else {
      if (message === '' && recipient === '') {
        this.loadingStatus('error', [
          'Please enter a valid phone number.',
          'Please enter a message.',
        ]);
      } else if (message === '') {
        this.loadingStatus('error', ['Please enter a message.']);
      } else if (recipient === '') {
        this.loadingStatus('error', ['Please enter a valid phone number.']);
      }
    }
  };

  // Handles changes for all inputs
  handleInput = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  render() {
    return (
      <div className ="message-col">
        <p>Enter phone number to send SMS to: </p>
        <form>
        <h6> To:</h6>
        <input type = "TEL"
          className = "number-form form-control" 
            name="recipient"
            onChange={this.handleInput}
            value={this.state.recipient}
            placeholder="number"
        <h6> Message </h6>
        <input 
          name="message" 
          className="message-form form-control"
          onChange={this.handleInput} 
          value={this.state.message}
          placeholder="text"
        />
        <p>Don't forget your country code, e.g., +1 in the US.</p>
          <StripeProvider apiKey="pk_test_N3kloqdrQMet0yDqnXGzsxR0">
            <Checkout
              loadingStatus={this.loadingStatus}
              setToken={this.setStripeToken}
              loadingState={this.props.loadingState.loadingMessage}
              sendForm={this.sendForm}
              clearFields={this.state.clearFields}
            />
          </StripeProvider>
        </form>
      </div>
    );
  }
}
