// components/EventsList.tsx

import React, { useEffect, useState } from 'react';
import { fetchAptosEvents, AptosEvent } from '../utils/aptosEvents';

const EventsList: React.FC = () => {
  const [events, setEvents] = useState<AptosEvent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const ACCOUNT_ADDRESS =
    '0x2ca06af25d467a75ee04a28ad0e49e5065e6722a1b833ffbd39a04646a36b37f';
  const MODULE_ADDRESS =
    '0xcaf438fc7f38cb9f8b5fe423c0a5875b3bbb30b30cf83b0194d4f17d856eb345';
  const MODULE_NAME = 'prompt_marketplace';
  const EVENT_NAME = 'CreatePromptCollectionEvent';

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const fetchedEvents = await fetchAptosEvents({
          accountAddress: ACCOUNT_ADDRESS,
          moduleAddress: MODULE_ADDRESS,
          moduleName: MODULE_NAME,
          eventName: EVENT_NAME,
          limit: 100,
        });
        setEvents(fetchedEvents);
      } catch (err) {
        console.error(err);
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) {
    return <div>Loading events...</div>;
  }

  if (error) {
    return <div>Error fetching events: {error}</div>;
  }

  return (
    <div className="text-white">
      <h2>Create Prompt Collection Events</h2>
      {events.length === 0 ? (
        <p>No events found.</p>
      ) : (
        <ul>
          {events.map((event, index) => (
            <li key={index}>
              <strong>Version:</strong> {event.version} <br />
              <strong>Sequence Number:</strong> {event.sequence_number} <br />
              <strong>Type:</strong> {event.type} <br />
              <strong>Data:</strong>{' '}
              <pre>{JSON.stringify(event.data, null, 2)}</pre>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default EventsList;
