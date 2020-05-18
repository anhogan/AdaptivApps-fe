import React, { useState } from 'react';
import Announcements from '../Messages/Announcements';

import { useMutation } from 'react-apollo'
import { DELETE_NOTIFICATION } from '../../queries/Notifications'

// Style Imports
import Tooltip from '@material-ui/core/Tooltip';
import BookmarksIcon from '@material-ui/icons/Bookmarks';
import Drawer from '@material-ui/core/Drawer';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import Collapse from '@material-ui/core/Collapse';
import Alert from '@material-ui/lab/Alert';
import Badge from '@material-ui/core/Badge';
import {
  makeStyles
} from "@material-ui/core";

const useStyles = makeStyles(() => ({
  root: {   
    margin: ".5rem auto",
    height: '2.5vh',
    display: 'flex',
    whiteSpace: "nowrap",
    overflow: 'hidden'
  },
  chatRoomIcon: {
    color: "#2962FF",
    fontSize: "3rem",
    margin: "0 5%"
  },
  chatRoomButton: {
    fontSize: "1.6rem",
    border: "none",
    '&:hover': {
      cursor: "pointer",
      color: "#2962FF",
    }, 
    '&:focus': {
      outline: "none"
    }
  },
  closeModal: {
    fontSize: "3rem",
    marginTop: '1%',
    border: "none",
    '&:hover': {
      cursor: "pointer",
      color: "#2962FF"
    }, 
    '&:focus': {
      outline: "none"
    }
  },
  roomTitle: {
    fontSize: '2rem',
    color: '#2962FF'
  },
  titleDiv: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '1% 2% 0 2%',
    borderBottom: '1px solid grey'
  },
  modal: {
    position: 'fixed',
    top: '20%',
    left: '20%',
    fontSize: "-webkit-xxx-large",
  },
  alertDiv: {
    width: '100%',
    margin: '0'
  }
}));

export default function AnnouncementRoom({ user, setAnnouncementOpen, notifications }) {
    console.log(notifications)
    const [deleteNotifications] = useMutation(DELETE_NOTIFICATION)
    const classes = useStyles();

    const [messageToggle, setMessageToggle] = useState(false);
    const [updateChat, setUpdateChat] = useState(false);
    const [deleteChat, setDeleteChat] = useState(false);

    // Set timeout for automated alerts
    setTimeout(function () {
      if (updateChat) {
        setUpdateChat(false);
      } else if (deleteChat) {
        setDeleteChat(false);
      }
    }, 3000);

    const handleClick = e => {
      e.preventDefault();
      messageToggle ? setMessageToggle(false) : setMessageToggle(true)
      notifications.map(item => {
        item.map(item => {
          deleteNotifications({
            variables: {
              id: item.notification[0].id
            }
          })
        })
      })
    };

    const closeDrawer = e => {
      e.preventDefault();
      messageToggle ? setMessageToggle(false) : setMessageToggle(true)
    };

    return (
      <>
        <div className={classes.root}>
          {notifications[0].length > 0 ?
          <Badge badgeContent={notifications.length} 
          variant='dot'
          color='error' 
          overlap='circle'>
          <BookmarksIcon 
            className={classes.chatRoomIcon}/>
            </Badge> :
            <BookmarksIcon 
            className={classes.chatRoomIcon}/>}           
          <Tooltip title="Click to expand messages">
            <button 
              className={classes.chatRoomButton} 
              onClick={handleClick} aria-label="Open all announcements">Announcements</button>
          </Tooltip>
        </div>
        <Drawer
          anchor = "right"
          open = {messageToggle}
          onClose={handleClick}
          variant = "temporary"
          PaperProps = {{ style: { width: "66%" } }}>
          <div className={classes.alertDiv}>
            <Collapse in={updateChat}>
              <Alert
                severity="success"
                color="info"
                action={
                  <IconButton
                    aria-label="close"
                    size="small"
                    onClick={() => {
                      setUpdateChat(false);
                    }}>
                    <CloseIcon fontSize="large" />
                  </IconButton>
                }>
                Successfully updated
              </Alert>
            </Collapse>
            <Collapse in={deleteChat}>
              <Alert
                severity="success"
                color="info"
                action={
                  <IconButton
                    aria-label="close"
                    size="small"
                    onClick={() => {
                      setDeleteChat(false);
                    }}>
                    <CloseIcon fontSize="large" />
                  </IconButton>
                }>
                Successfully deleted
              </Alert>
            </Collapse>  
          </div>  
          <div className={classes.titleDiv}>
            <h1 className={classes.roomTitle}>ACS Announcements</h1>
            <CloseIcon className={classes.closeModal} onClick={closeDrawer} aria-label="Close Announcements"/>
          </div>
          <Announcements user={user} setUpdateChat={setUpdateChat} setDeleteChat={setDeleteChat} />
        </Drawer>
      </>
    )
};