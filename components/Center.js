import { ChevronDownIcon } from '@heroicons/react/outline'
import { signOut, useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { shuffle } from 'lodash'
import { playlistIdState, playlistState } from '../atoms/playlistAtom'
import { useRecoilState, useRecoilValue } from 'recoil'
import spotifyApi from '../lib/spotify'
import Songs from './Songs'

const colors = [
  'from-indigo-500',
  'from-blue-500',
  'from-green-500',
  'from-yellow-500',
  'from-pink-500',
  'from-purple-500',
]

export default function Center() {
  const { data: session } = useSession()
  const [color, setColor] = useState(null)
  const playlistId = useRecoilValue(playlistIdState)
  const [playlist, setPlaylist] = useRecoilState(playlistState)

  useEffect(() => {
    setColor(shuffle(colors).pop())
  }, [playlistId])

  useEffect(() => {
    spotifyApi
      .getPlaylist(playlistId)
      .then((data) => {
        setPlaylist(data.body)
      })
      .catch((err) => console.log('Error fetching playlist data', err))
  }, [spotifyApi, playlistId])

  return (
    <div className="h-screen flex-grow justify-between overflow-y-scroll scrollbar-hide">
      <section
        className={`flex h-64 justify-between bg-gradient-to-b ${color} to-[#181818] p-8 text-white`}
      >
        <div className="flex space-x-5">
          <img
            className="h-44 w-44 self-end shadow-2xl"
            src={playlist?.images?.[0]?.url}
            alt=""
          />
          <div className="flex flex-col self-end">
            <p>PLAYLIST</p>
            <h1 className="text-2xl font-bold md:text-3xl xl:text-5xl">
              {playlist?.name}
            </h1>
          </div>
        </div>

        <div className="flex-end relative">
          <div
            className="flex cursor-pointer items-center space-x-3 rounded-full bg-black p-1 pr-2 text-white opacity-90 hover:opacity-80"
            onClick={signOut}
          >
            <img
              className="h-8 w-8 rounded-full"
              src={session?.user?.image}
              alt=""
            />
            <h2 className="font-bold">{session?.user.name}</h2>
            <ChevronDownIcon className="h-5 w-5" />
          </div>
        </div>
      </section>
      <Songs />
    </div>
  )
}
