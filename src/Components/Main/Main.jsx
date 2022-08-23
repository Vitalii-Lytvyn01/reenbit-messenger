import React from "react";
import './Main.scss';
import Chat from '../Chat/Chat';
import getMessage from '../../API/Messages';
import jsonString from '../../API/InitialValues.js';
import initialChats from '../../API/InitalChats.js';


if(window.localStorage.getItem("APP_STATE") === null) {
  const data = JSON.stringify(initialChats);
  window.localStorage.setItem("APP_STATE", data);
}


export default class MainPage extends React.Component {
  state = {
    chats: [],
    searchQuery: '',
    selectedChat: '',
  }

  filterChats() {
    if (this.state.chats === null) {
      return [];
    }

    let result = this.state.chats.filter(item => item.contact.name.toLowerCase().includes(this.state.searchQuery.toLowerCase()))
    return result.sort((a,b) => {
      let dateA = a.messages.length ? a.messages[a.messages.length-1].dateISO : 0;
      let dateB = b.messages.length ? b.messages[b.messages.length-1].dateISO : 0;

      return new Date(dateB) - new Date(dateA);
    });
  }

  getAPIMessage(name) {
    const response = getMessage();
    response.then(
      data => {
        return data.json()
      }
    ).then(
      dataJSON => {
        console.log(dataJSON);
        setTimeout(() => {
          this.createMessage(dataJSON.value,name,name);
        },5000);
      }
    ).catch(alert);
  }

  componentDidMount() {
    const data = window.localStorage.getItem("APP_STATE");
    this.setState({chats: JSON.parse(data)})
  }

  componentDidUpdate() {
    window.localStorage.setItem("APP_STATE", JSON.stringify(this.state.chats));
  }

  openChat(name) {
    this.setState({selectedChat: name});
  }

  createMessage(message, name, sender) {
    const d = new Date();
    const newMessage = {
      text: message,
      date: d.toLocaleDateString(),
      time: `${d.getHours()}:${d.getMinutes()}`,
      dateISO: d.toISOString(),
      sender,
    }

    let clonedChats = JSON.parse(JSON.stringify(this.state.chats));

    let chat = clonedChats.find(item => item.contact.name === name);
    chat.messages.push(newMessage);
    this.setState({chats: clonedChats});

    if(sender === 'me') {
      this.getAPIMessage(name);
    }
  }

  render() {
    return(
      <div className="main-page">
        <div className="container">
          <div className="contacts">
            <div className="contacts__info">
              <div className="user-info">
                <div className="user-info__image"></div>
                <div className="user-info__name">Test Username</div>
              </div>
              <input
                type="search"
                className="search-bar"
                value={this.state.searchQuery}
                onChange={(e) => this.setState({searchQuery: e.target.value})}
              />
            </div>

            <div className="title">Chats</div>
              <div className="contacts__list">
                {
                  this.filterChats().map(item => {
                    return <div
                        className="list-item"
                        onClick={() => this.openChat(item.contact.name)}
                      >
                      <div className="list-item__image" style={{backgroundImage: `url(${item.contact.photo})`}}></div>
                      <div className="list-item__info">
                        <div className="name">{item.contact.name}</div>
                        <div className="message">{item.messages.length ? item.messages[item.messages.length-1].text : "No messages"}</div>
                      </div>
                      <div className="list-item__date">{item.messages.length ? item.messages[item.messages.length-1].date : ""}</div>
                    </div>
                  })
                }
              </div>
          </div>
          <div className="chat">
            {
              !!this.state.selectedChat
              ? <Chat
                chatObj = {this.state.chats.find(item => item.contact.name === this.state.selectedChat)}
                createMessage={this.createMessage.bind(this)}
              />
              : ''
            }
          </div>
        </div>
      </div>
    )
  }
}