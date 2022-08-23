import React from "react";
import './Chat.scss';
import classNames from "classnames";


export default class Chat extends React.Component {

  state = {
    inputText: '',
  }

  handleKeyDown(e) {
    if (e.keyCode === 13) {
      this.handleSend()
    }
  }

  handleSend() {
    if(this.state.inputText === '') {
      return;
    }
    this.props.createMessage(this.state.inputText,this.props.chatObj.contact.name, 'me');
    this.setState({inputText: ''});
  }

  scrollToBottom() {
    this.messagesEnd.scrollIntoView({behavior: "smooth"});
  }

  componentDidMount() {
    this.scrollToBottom();
  }
  
  componentDidUpdate() {
    this.scrollToBottom();
  }


  render() {
    const {chatObj} = this.props;
    return(
      <div className="chat-section">
        <div className="chat-section__info">
          <div className="info__image" style={{backgroundImage: `url(${chatObj.contact.photo})`}}></div>
          <div className="info__name">{chatObj.contact.name}</div>
        </div>
        <div className="chat-section__messages">
          {chatObj.messages.map(item => {
            if (item.sender === 'me') {
              return <div className="own-message message">
                <div className="text">{item.text}</div> 
                <div className="date">{`${item.date}, ${item.time}`}</div> 
              </div>
            } else {
              return <div className="contact-message message">
                <div className="contact-message__image" style={{backgroundImage: `url(${chatObj.contact.photo})`}}></div>
                <div className="contact-message__info">
                  <div className="text">{item.text}</div>
                  <div className="date">{`${item.date}, ${item.time}`}</div>
                </div>
              </div>
            }
          })}
            <div style={{ float:"left", clear: "both" }}
                ref={(el) => { this.messagesEnd = el; }}>
            </div>
        </div>
        <div className="chat-section__text-input">
          <div className="input-container">
            <input
              type="text"
              className="text-input"
              placeholder="Type your message"
              value={this.state.inputText}
              onChange={(e) => this.setState({inputText: e.target.value})}
              onKeyDown={e => this.handleKeyDown(e)}
            />
            <div
              className="send-button"
              onClick={() => {this.handleSend()}}
            ></div>
          </div>
        </div>
      </div>
    )
  }
}