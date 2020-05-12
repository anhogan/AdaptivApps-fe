// React imports
import React, { useState } from "react";

// Speech Recognition Import
import { useSpeechRecognition } from "react-speech-kit";

// Query Imports
import { SEND_CHAT } from '../../queries/Chats'
import { useMutation } from 'react-apollo'


//Emoji Picker Import
import 'emoji-mart/css/emoji-mart.css'
import { Picker } from 'emoji-mart'

//Styling Imports
import InputAdornment from '@material-ui/core/InputAdornment';
import SendIcon from '@material-ui/icons/Send';
import MoodIcon from '@material-ui/icons/Mood';
import MicNoneIcon from '@material-ui/icons/MicNone';
import Modal from '@material-ui/core/Modal';
import {
    makeStyles,
    TextField
  } from "@material-ui/core";

const useStyles = makeStyles(() => ({
    inputDiv: {
        width: '95%',
        margin: 'auto',
        display: 'flex',
        alignItems: 'center'
    },
    iconDiv: {
        width: '15%',
        display: 'flex',
        justifyContent: 'space-evenly'
    },
    messageBox: {
        width: "80%",
        marginLeft: '3%'
    },
    icons: {
        color: '#808080',
        fontSize: '3.5rem',
        '&:hover': {
            cursor: "pointer",
          }, 
    },
    sendMessageIcon: {
        color: '#2962FF',
        fontSize: '3rem',
        '&:hover': {
            cursor: "pointer",
          }, 
    },
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        fontSize: "-webkit-xxx-large",
    }
}));


const Input = ({ chatRoom, user }) => {
    const classes = useStyles();
    const [toggleEmoji, setToggleEmoji] = useState(false);

    //Setting state for speech recognition
    const [textValue, setTextValue] = useState("");
    const { listen, listening, stop } = useSpeechRecognition({
        onResult: result => {
          setTextValue(result);
        }
      });
    
    const [sendChat] = useMutation(SEND_CHAT);
    const [message, setMessage] = useState('');
    

    const emojiOpen = () => {
        setToggleEmoji(true)
    };

    const emojiClose = () => {
        setToggleEmoji(false)
    };
   
    const newMessage = async () => {
        await sendChat({
            variables: {
              id: chatRoom.id,
              email: user.email,
              message: message.message 
            }
        })
        setMessage({ message: ''})
    };


   const handleChange = e => {
        setMessage({
            message: e.target.value
        })
    };

    const onEmojiClick = (e) => {
        setMessage({
            message: message.message ? message.message + e.native : e.native
        });
    };

    return(
        <div>
            <div className={classes.inputDiv}>
                <div className={classes.iconDiv}>
                    <MicNoneIcon className={classes.icons} onMouseDown={listen} onMouseUp={stop}/>
                    {listening && <div>Go ahead I'm listening</div>}
                </div>
                <TextField
                    className={classes.messageBox}
                    multiline={true}
                    rowsMax='4'
                    value={message.message}
                    value={textValue}
                    variant="outlined"
                    type="text"
                    name="newChat"
                    placeholder="Type a message..."
                    onChange={handleChange}
                    onChange={event => setTextValue(event.target.value)}
                    InputProps={{
                        endAdornment: <InputAdornment position="end">
                        <SendIcon
                        className={classes.sendMessageIcon} 
                        onClick={newMessage} />
                    </InputAdornment>
                    }}
                    />
                <div className={classes.iconDiv}>
                    <MoodIcon className={classes.icons} onClick={emojiOpen}/>
                    <Modal
                        className={classes.modal}
                        open={toggleEmoji}
                        onClose={emojiClose}>
                        {toggleEmoji ? <Picker onClick={onEmojiClick}/> : null}
                    </Modal>
                </div>
            </div>
        </div>
    )
}

export default Input;