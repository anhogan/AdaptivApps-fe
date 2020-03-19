import React from 'react';
import { Link } from "@reach/router"
import { useMutation } from 'react-apollo';
import { REGISTER_EVENT } from './queries/joinEvent';
import { useAuth0 } from '../../config/react-auth0-spa';

import { Flex, Container, Button, Modal, useModal, Text } from 'adaptiv-ui';
import NavLink from '../../routes/DashRouter/SideNav/NavLink';
import PropTypes from 'prop-types';

export default function EventCard({ event }) {
  const [updateEvent] = useMutation(REGISTER_EVENT);

  const { user } = useAuth0();

  const registerEvent = async () => {
    await updateEvent({
      variables: { id: event.id, email: user.email },
    });
  };

  const [isActive, toggle] = useModal();
  console.log('image url', event);
  return (
    
    <Flex col>
      <Container bg_src={event.imgUrl} h="10vh" w="20rem"></Container>
      <small>
        {event.startDate} - {event.endDate}
      </small>
      <h6>
        <b>{event.title}</b>
      </h6>
      <p>{event.location}</p>
      <Button primary onClick={toggle} w="20rem">
        Add to my schedule
      </Button>
      <Button primary onClick={toggle} w="20rem">
        Testing
      </Button>
      <Modal isActive={isActive}>
        <Flex w="40rem" h="40rem" drape>
          <small>
            {event.startDate} - {event.endDate}
          </small>
          <h6>
            <b>{event.title}</b>
          </h6>
          <p>{event.location}</p>
          <Text>
            Join us in June 2020 for the 6th annual Angel City Games, presented
            by The Hartford, the largest Paralympic-style adaptive sports event
            in the Western US! We’ve added more sports to the schedule this year
            and anticipate hosting our largest event ever - Don’t miss it!
          </Text>
          <Text> Add to "My Events?"</Text>
          <Button
            primary="true"
            autoFocus
            
            onClick={
              (() =>
                console.log('clicked', registerEvent, event.id, user.email),
              registerEvent)
            }
          >
            <Link to={`${event?.id}`}>Join Event!</Link>
          </Button>
          <Button
            secondary
            onClick={toggle}
          >
            Close
          </Button>
        </Flex>
      </Modal>
    </Flex>
  );
}

EventCard.propTypes = {
  event: PropTypes.object,
};
