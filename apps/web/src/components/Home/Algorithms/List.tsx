import { GlobeAmericasIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import { algorithms } from '@hey/data/algorithms';
import { HOME } from '@hey/data/tracking';
import { Toggle, Tooltip } from '@hey/ui';
import { Leafwatch } from '@lib/leafwatch';
import { useEnabledAlgorithmsStore } from '@persisted/useEnabledAlgorithmsStore';
import type { FC } from 'react';

const List: FC = () => {
  const enabledAlgorithms = useEnabledAlgorithmsStore(
    (state) => state.enabledAlgorithms
  );
  const enableAlgorithm = useEnabledAlgorithmsStore(
    (state) => state.enableAlgorithm
  );
  const disableAlgorithm = useEnabledAlgorithmsStore(
    (state) => state.disableAlgorithm
  );

  return (
    <div className="divide-y-[1px] dark:divide-gray-700">
      {algorithms.map((algorithm) => (
        <div
          key={algorithm.feedType}
          className="flex items-center justify-between p-5"
        >
          <div className="mr-5 space-y-2">
            <div className="flex items-center space-x-2">
              <img
                className="h-10 w-10 rounded-lg"
                src={algorithm.image}
                alt={algorithm.name}
              />
              <div>
                <div className="flex items-center space-x-1.5">
                  <b>{algorithm.name}</b>
                  <Tooltip
                    placement="top"
                    content={
                      algorithm.isPersonalized ? 'Personalized' : 'Global'
                    }
                  >
                    <div className="text-brand-500">
                      {algorithm.isPersonalized ? (
                        <UserCircleIcon className="h-4 w-4" />
                      ) : (
                        <GlobeAmericasIcon className="h-4 w-4" />
                      )}
                    </div>
                  </Tooltip>
                </div>
                <div className="text-sm">by {algorithm.by}</div>
              </div>
            </div>
            <div className="ld-text-gray-500 max-w-sm text-sm">
              {algorithm.description}
            </div>
          </div>
          <Toggle
            on={enabledAlgorithms.includes(algorithm.feedType)}
            setOn={() => {
              const enabled = enabledAlgorithms.includes(algorithm.feedType);
              if (!enabled) {
                enableAlgorithm(algorithm.feedType);
              } else {
                disableAlgorithm(algorithm.feedType);
              }
              Leafwatch.track(HOME.ALGORITHMS.TOGGLE_ALGORITHM, {
                algorithm: algorithm.feedType,
                enabled: !enabled
              });
            }}
          />
        </div>
      ))}
    </div>
  );
};

export default List;
