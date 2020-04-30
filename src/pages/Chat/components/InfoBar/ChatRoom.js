import React, {useState} from 'react';
import Messages from '../Messages/Messages';
import PeopleAltIcon from '@material-ui/icons/PeopleAlt';
import {
  makeStyles
} from "@material-ui/core";

const useStyles = makeStyles(() => ({
  chatRoomDiv: {
    textDecoration: "none",
    height: "5rem",
    display: "flex",
    alignContent: "flex-start",
    alignItems: "center",
    margin: ".5rem auto",
    textAlign: "left",
    "& p": {
      fontSize: "1.6rem",
    }
  },
  chatRoomIcon: {
    color: "#2962FF",
    fontSize: "2.5rem",
  },
  chatRoomButton: {
    fontSize: "2rem",
    border: "none",
    '&:hover': {
      cursor: "pointer"
    }, 
    '&:focus': {
      border: "none"
    }
  }
}))

export default function ChatRoom({chatRoom, user}) {
    const classes = useStyles();
    const [messageToggle, setMessageToggle] = useState(false);

    const participants = chatRoom.participants.map((participant, id) => (participant.email !== user.email && `${participant.firstName} ${participant.lastName}`))

    const handleClick = e => {
        e.preventDefault();
        messageToggle ? setMessageToggle(false) : setMessageToggle(true)
    }

    return (
      <>
        <div className={classes.chatRoomDiv}>
          <PeopleAltIcon className={classes.chatRoomIcon} />
          <button className={classes.chatRoomButton} onClick={handleClick}>{participants}</button>
        </div>
        {messageToggle ? (
        <div className='chats-open'>
          <Messages chatRoom={chatRoom} />
        </div>
      ) : (
        <div className='chats-close'>
          Choose a message to display
        </div> )}
      </>
    )
}
