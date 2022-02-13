import { useSession } from 'next-auth/react'
import React, { useEffect } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import { currentTrackIdState, isPlayingState } from '../atoms/songAtom'
import { playlistState } from '../atoms/playlistAtom'
import useSongInfo from '../hooks/useSongInfo'
import useSpotify from '../hooks/useSpotify'
import {
  RewindIcon,
  SwitchHorizontalIcon,
  RefreshIcon as ReplayIcon,
  PlayIcon,
  PauseIcon,
  FastForwardIcon,
} from '@heroicons/react/solid'
import Volume from './Volume'

function Player() {
  const spotifyApi = useSpotify()
  const { data: session, status } = useSession()

  const [currentTrackId, setCurrentTrackId] =
    useRecoilState(currentTrackIdState)

  const playlist = useRecoilValue(playlistState)
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState)

  const songInfo = useSongInfo()

  const fetchCurrentSong = () => {
    if (!songInfo) {
      spotifyApi.getMyCurrentPlayingTrack().then((data) => {
        console.log('Now Playing: ', data.body?.item)
        setCurrentTrackId(data.body?.item.id)

        spotifyApi.getMyCurrentPlaybackState().then((data) => {
          setIsPlaying(data.body?.is_playing)
        })
      })
    }
  }

  const fetchNextSong = (isForward = true) => {
    if (currentTrackId) {
      const playlistTrackIds = playlist.tracks.items.map((x) => x.track.id)
      const trackIndex = playlistTrackIds.findIndex(
        (playlistTrackId) => playlistTrackId === currentTrackId
      )
      const nextIndex = isForward ? 1 : -1;
      const nextTrack = playlist.tracks.items[trackIndex + nextIndex]
      if (nextTrack) {
        setCurrentTrackId(nextTrack.track.id)
        setIsPlaying(true)
        spotifyApi.play({
          uris: [nextTrack.track.uri],
        })
      }
    }
  }

  const handlePlayPause = () => {
    spotifyApi.getMyCurrentPlaybackState().then((data) => {
      if (data.body.is_playing) {
        spotifyApi.pause()
        setIsPlaying(false)
      } else {
        spotifyApi.play()
        setIsPlaying(true)
      }
    })
  }

  useEffect(() => {
    if (spotifyApi.getAccessToken() && !currentTrackId) {
      fetchCurrentSong()
    }
  }, [currentTrackId, spotifyApi, session])

  return (
    <div className="grid h-24 grid-cols-3 border-2 border-[#181818] border-t-[#282828] bg-[#181818] px-2 text-xs text-white md:px-8 md:text-base">
      {/* Left */}
      <div className="flex items-center space-x-4">
        <img
          className="hidden h-10 w-10 md:inline"
          src={songInfo?.album.images?.[0]?.url}
        />
        <div>
          <h3>{songInfo?.name}</h3>
          <p>{songInfo?.artists?.[0]?.name}</p>
        </div>
      </div>

      {/* Center */}
      <div className="flex items-center justify-evenly">
        <SwitchHorizontalIcon className="button" />
        <RewindIcon
          className="button"
          onClick={() => fetchNextSong(false)}
        />

        {isPlaying ? (
          <PauseIcon onClick={handlePlayPause} className="button h-10 w-10" />
        ) : (
          <PlayIcon onClick={handlePlayPause} className="button h-10 w-10" />
        )}

        <FastForwardIcon className="button" onClick={() => fetchNextSong()} />
        <ReplayIcon className="button" />
      </div>

      <Volume />
    </div>
  )
}

export default Player
