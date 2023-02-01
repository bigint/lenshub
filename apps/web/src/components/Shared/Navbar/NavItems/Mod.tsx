import { ShieldCheckIcon } from '@heroicons/react/outline';
import { Trans } from '@lingui/macro';
import clsx from 'clsx';
import type { FC } from 'react';
import React from 'react';

interface Props {
  className?: string;
}

const Mod: FC<Props> = ({ className = '' }) => {
  return (
    <div
      className={clsx(
        'flex w-full items-center space-x-1.5 text-sm text-gray-700 dark:text-gray-200',
        className
      )}
    >
      <ShieldCheckIcon className="h-4 w-4" />
      <div>
        <Trans>Moderation</Trans>
      </div>
    </div>
  );
};

export default Mod;
