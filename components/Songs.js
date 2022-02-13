import { ClockIcon } from '@heroicons/react/outline'
import { useCallback, useEffect, useRef } from 'react'
import { useRecoilState } from 'recoil'
import { playlistState } from '../atoms/playlistAtom'
import useSpotify from '../hooks/useSpotify'
import Song from './Song'

function Songs() {
  const [playlist, setPlaylist] = useRecoilState(playlistState)
  const spotifyApi = useSpotify()
  const loader = useRef(null)

  const loadMore = useCallback(async (entries) => {
    const entry = entries.pop()
    if (entry.intersectionRatio > 0) {
      if (playlist.tracks.next) {
        const trackInfo = await fetch(playlist.tracks.next, {
          headers: {
            Authorization: `Bearer ${spotifyApi.getAccessToken()}`,
          },
        })
        const res = await trackInfo.json()
        const tracks = playlist.tracks.items.concat(res.items)
        setPlaylist({ ...playlist, tracks: { items: tracks, next: res.next } })
      }
    }
  })

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.25,
    }
    const observer = new IntersectionObserver(loadMore, options)

    if (loader && loader.current) {
      observer.observe(loader.current)
    }

    return () => observer.unobserve(loader.current)
  }, [loader, loadMore])

  return (
    <div className="flex flex-col space-y-2 bg-[#121212] pb-28">
      <div className="sticky top-0 grid grid-cols-2 border-b-2 border-[#282828] bg-[#181818] py-3 px-5 text-gray-500">
        <div className="flex items-center space-x-4">
          <p>#</p>
          <div className="w-10">TITLE</div>
          <p className="w-36 lg:w-64"></p>
        </div>
        <div className="ml-auto flex items-center justify-between md:ml-0">
          <p className="hidden w-40 md:inline">ALBUM</p>
          <ClockIcon className="h-5 w-5" />
        </div>
      </div>
      {playlist?.tracks.items.map((track, i) => (
        <Song key={i} track={track} order={i} />
      ))}
      <div
        style={
          playlist?.tracks ? {} : { position: 'absolute', bottom: '9999999px' }
        }
        ref={loader}
      ></div>
    </div>
  )
}

export default Songs
