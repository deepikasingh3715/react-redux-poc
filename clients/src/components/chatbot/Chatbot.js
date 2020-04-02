import React, { Component } from 'react';
import axios from 'axios';
import Message from './Message';
import MessageUser from './MessageUser';

import Cookies from 'universal-cookie';
import { v4 as uuid } from 'uuid';

const cookies = new Cookies();

class Chatbot extends Component {

    messagesEnd;
    constructor(props) {
        super(props);

             // This binding is necessary to make `this` work in the callback
             this._handleInputKeyPress = this._handleInputKeyPress.bind(this);
             this.df_text_query = this.df_text_query.bind(this);
             this.df_event_query = this.df_event_query.bind(this);


        this.state = {
            messages: []
        };

        // if (cookies.get('userID') === undefined) {
        //     cookies.set('userID', uuid(), { path: '/' });
        // }


    }

    async df_text_query (queryText) {
        let says = {
            speaks: 'user',
            msg: {
                text : {
                    text: queryText
                }
            }
        }
        
       //this.setState({ messages: [...this.state.messages, says]});
        
        const res = await axios.post('http://localhost:5000/api/df_text_query',  {text: queryText});
       // const res = await axios.post('/api/df_text_query',{ text:queryText, userID: cookies.get('userID')});
        
        for (let msg of res.data) {
           let says = {
                speaks: 'bot',
                msg: msg.text.text
            }
                              
            this.setState({ messages: [...this.state.messages, says]});
        }     
    };



    async df_event_query(eventName) {
           let res = await axios.post('http://localhost:5000/api/df_event_query',{eventName})
             .then(response => {
            //  return this.handleResponse(response.data.fulfillmentMessages[0].text);
             let res = response.data.fulfillmentMessages[0].text.text; 
            for (let msg of res) {
                let says = {
                    speaks: 'bot',
                    msg: res
                }
    
                this.setState({ messages: [...this.state.messages, says]});            
        }
            
        })
        .catch(error => {
            console.log(error)
        })

        

    }
   
   

    componentDidMount() {
     this.df_event_query('Welcome');     
    }

    componentDidUpdate(){
        this.messagesEnd.scrollIntoView({ behavior: "smooth" }); 
    }

   
    renderMessages(returnedMessages) {
        if (returnedMessages) {
         return returnedMessages.map((message, i) => {                       
                    return <Message key={i} speaks={message.speaks} text={message.msg}/>;          
            })
        } else {
             return null;
        }
    }

    _handleInputKeyPress(e) {
        if (e.key === 'Enter') {
            this.df_text_query(e.target.value);
            e.target.value = '';
        
        }
    }


    render() {
        return (
            <div style={{height: 400, width: 400, float: 'right'}}>
                <div id="chatbot" style={{height: '100%', width: '100%', overflow: 'auto'}}>
                    <h2>Chatbot</h2>
                    {this.renderMessages(this.state.messages)}
                    {/* <input type="text"/> */}
                     <div ref={(el) => { this.messagesEnd = el; }}
                         style={{ float:"left", clear: "both" }}>
                    </div> 
                    <input type="text" onKeyPress={this._handleInputKeyPress}  />
                </div>
            </div>
        );
    }
}

export default Chatbot;
