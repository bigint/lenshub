import { WEBSOCKET_WORKER_URL } from '@hey/data/constants';
import { type FC, memo } from 'react';
import useWebSocket from 'react-use-websocket';
import { useLeafwatchPersistStore } from 'src/store/useLeafwatchPersistStore';
import { useLeafwatchStore } from 'src/store/useLeafwatchStore';
import { useEffectOnce, useInterval, useUpdateEffect } from 'usehooks-ts';
import { v4 as uuid } from 'uuid';

const LeafwatchProvider: FC = () => {
  const viewerId = useLeafwatchPersistStore((state) => state.viewerId);
  const setViewerId = useLeafwatchPersistStore((state) => state.setViewerId);
  const viewedPublication = useLeafwatchStore(
    (state) => state.viewedPublication
  );

  const { sendJsonMessage, readyState } = useWebSocket(WEBSOCKET_WORKER_URL);

  useEffectOnce(() => {
    sendJsonMessage({ type: 'connection_init' });
    if (!viewerId) {
      setViewerId(uuid());
    }
  });

  useInterval(() => {
    sendJsonMessage({ type: 'connection_init' });
  }, 10000);

  useUpdateEffect(() => {
    if (readyState === 1 && viewedPublication) {
      sendJsonMessage({
        id: '1',
        type: 'start',
        payload: JSON.stringify({
          viewer_id: viewerId,
          publication_id: viewedPublication
        })
      });
    }
  }, [readyState, viewedPublication]);

  return null;
};

export default memo(LeafwatchProvider);
