import React, { useEffect, useState } from "react";
import { useQuery } from "react-apollo";
import { GET_CHAT_ROOMS, CHAT_ROOM_SUBSCRIPTION } from '../../queries/ChatRooms';
import RecipientModal from './Modal';
import ChatRoom from './ChatRoom';
import SearchChatRooms from './SearchChatRooms';

//Auth0 imports
import config from "../../../../config/auth_config";

// Style Imports
import CreateIcon from '@material-ui/icons/Create';
import LanguageIcon from '@material-ui/icons/Language';
import SearchIcon from '@material-ui/icons/Search';
import InputAdornment from '@material-ui/core/InputAdornment';
import Divider from '@material-ui/core/Divider';
import {
  makeStyles,
  Box,
  TextField
} from "@material-ui/core";
import CircularProgress from "@material-ui/core/CircularProgress";
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    flexDirection: 'column',
    whiteSpace: "nowrap",
    overflow: 'hidden'
  },
  header: {
    fontSize: '2.5rem',
    color: 'grey',
    fontFamily: 'Arial',
    marginBottom: '10%'
  },
  messageIcons: {
    maxWidth: '95%',
    display: 'flex',
    margin: '10% 0',
    alignItems: 'center'
  },
  icons: {
    fontSize: '2.75rem',
    color: 'grey',
    cursor: "pointer",
    marginRight: '10%'    
  },
  span: {
    fontSize: '1.75rem',
    color: 'grey',
    cursor: 'pointer'
  },
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: "-webkit-xxx-large",
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  button: {
    marginTop: '3%'
  },
  chatroom: {
    margin: '5% 0'
  },
  divider: {
    marginTop:'5%'
  }
}));

function InfoBar({ user }) {
    const classes = useStyles();
    const { loading, error, data, refetch, subscribeToMore } = useQuery(GET_CHAT_ROOMS, { variables: { email: user.email } });
    const [open, setOpen] = useState(false);

    // refetches CHAT_ROOMS without refreshing page
    useEffect(() => {
        refetch();
    }, [refetch]);

    const _subscribeToNewChatRoom = subscribeToMore => {
      subscribeToMore({
        document: CHAT_ROOM_SUBSCRIPTION,
        updateQuery: (prev, {subscriptionData }) => {
          if (!subscriptionData.data) return prev
          const chatRoom = subscriptionData.data.chatRoom
          const exists = prev.profile.chatRooms.find(({ id }) => id === chatRoom.id);
          if (exists) return prev;
          return Object.assign({}, prev, {
            profile: {
              chatRooms: [chatRoom, ...prev.profile.chatRooms],
              __typename: prev.profile.__typename
            }
          })
        }
      })
    };

    if (loading) return <CircularProgress className={classes.loadingSpinner} />;
    if (error) return `Error! ${error.message}`;

    _subscribeToNewChatRoom(subscribeToMore)

    const newAnnouncementClick = e => {
      e.preventDefault();
      console.log('New announcement clicked')
    };

    const handleOpen = () => {
      setOpen(true);
    };
    
    const handleClose = () => {
      setOpen(false);
    };

    return (
      <div className={classes.root}>
        <h1 className={classes.header}>Messages</h1>
        <div className={classes.messageIcons}>
          <CreateIcon className={classes.icons} onClick={handleOpen} /><span className={classes.span} onClick={handleOpen}>New Message</span>
        </div>
        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          className={classes.modal}
          open={open}
          onClose={handleClose}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}>
            <RecipientModal user={user}/>
        </Modal> 
        {user && user[config.roleUrl].includes("Admin") ? 
        (
          <>
            <div className={classes.messageIcons}>
              <LanguageIcon className={classes.icons} onClick={newAnnouncementClick}/><span className={classes.span} onClick={newAnnouncementClick}>New Announcement</span> 
            </div>
          </>
        ) : null}
        <div>
          {data && data?.profile.chatRooms?.map((chatRoom, id) => (
          <div className={classes.chatroom}>
            <ChatRoom chatRoom={chatRoom} key={id} user={user}/>
            <Divider variant="inset" className={classes.divider}/>
          </div>
          ))}
        </div>
        <SearchChatRooms user={user} />
      </div>
    )
}
export default InfoBar;