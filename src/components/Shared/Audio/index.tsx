import type { LensterPublication } from '@generated/lenstertypes';
import type { Attribute } from '@generated/types';
import { PauseIcon, PlayIcon } from '@heroicons/react/solid';
import getAttributeFromTrait from '@lib/getAttributeFromTrait';
import getThumbnailUrl from '@lib/getThumbnailUrl';
import type { APITypes } from 'plyr-react';
import type { ChangeEvent, FC } from 'react';
import { useState } from 'react';
import { useRef } from 'react';
import React from 'react';
import { usePublicationStore } from 'src/store/publication';
import { object, string } from 'zod';

import CoverImage from './CoverImage';
import Player from './Player';

interface Props {
  src: string;
  isNew?: boolean;
  publication?: LensterPublication;
  txn: any;
}

export const AudioPublicationSchema = object({
  title: string().trim().min(1, { message: 'Invalid audio title' }),
  author: string().trim().min(1, { message: 'Invalid author name' }),
  cover: string().trim().min(1, { message: 'Invalid cover image' })
});

const Audio: FC<Props> = ({ src, isNew = false, publication, txn }) => {
  const [playing, setPlaying] = useState(false);
  const audioPublication = usePublicationStore((state) => state.audioPublication);
  const setAudioPublication = usePublicationStore((state) => state.setAudioPublication);
  const playerRef = useRef<APITypes>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const handlePlayPause = () => {
    if (!playerRef.current) {
      return;
    }
    if (playerRef.current?.plyr.paused && !playing) {
      setPlaying(true);
      return playerRef.current?.plyr.play();
    }
    playerRef.current?.plyr.pause();
    setPlaying(false);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setAudioPublication({ ...audioPublication, [e.target.name]: e.target.value });
  };

  return (
    <div className="border w-full overflow-hidden border-gray-200 dark:border-gray-800 rounded-xl">
      <div className="flex flex-1 space-x-2 bg-[#845EEE] text-white">
        <CoverImage
          isNew={isNew && !txn}
          cover={isNew ? (txn ? txn.cover : audioPublication.cover) : getThumbnailUrl(publication)}
          setCover={(url, mimeType) =>
            setAudioPublication({ ...audioPublication, cover: url, coverMimeType: mimeType })
          }
          imageRef={imageRef}
        />
        <div className="flex py-1 px-3 flex-col justify-between w-full">
          <div className="flex justify-between mt-6">
            <div className="flex items-center space-x-2.5 w-full">
              <button type="button" onClick={handlePlayPause}>
                {playing && !playerRef.current?.plyr.paused ? (
                  <PauseIcon className="w-[50px] h-[50px] text-gray-100 hover:text-white" />
                ) : (
                  <PlayIcon className="w-[50px] h-[50px] text-gray-100 hover:text-white" />
                )}
              </button>
              <div className="w-full pr-3">
                {isNew && !txn ? (
                  <div className="flex flex-col w-full">
                    <input
                      className="border-none w-full text-lg leading-5 text-[#FFFFFF] bg-transparent outline-none placeholder-white"
                      placeholder="Add title..."
                      name="title"
                      value={audioPublication.title}
                      autoComplete="off"
                      onChange={handleChange}
                    />
                    <input
                      className="border-none w-full text-[#FFFFFF]/70 placeholder-[#FFFFFF]/70 bg-transparent outline-none"
                      placeholder="Add author..."
                      name="author"
                      value={audioPublication.author}
                      onChange={handleChange}
                      autoComplete="off"
                    />
                  </div>
                ) : (
                  <>
                    <h5 className="text-lg leading-5 text-[#FFFFFF] truncate">
                      {publication?.metadata.name ?? txn.title}
                    </h5>
                    <h6 className="text-[#FFFFFF]/70 leading-5">
                      {txn?.author ??
                        getAttributeFromTrait(publication?.metadata.attributes as Attribute[], 'author') ??
                        publication?.profile.name}
                    </h6>
                  </>
                )}
              </div>
            </div>
          </div>
          <Player src={src} playerRef={playerRef} />
        </div>
      </div>
    </div>
  );
};

export default Audio;
