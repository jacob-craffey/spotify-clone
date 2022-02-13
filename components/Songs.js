import { ClockIcon } from '@heroicons/react/outline'
import { useRecoilValue } from 'recoil'
import { playlistState } from '../atoms/playlistAtom'
import Song from './Song'

function Songs() {
  const playlist = useRecoilValue(playlistState)

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
          <ClockIcon className='w-5 h-5' />
        </div>
      </div>
      {playlist?.tracks.items.map((track, i) => (
        <Song key={track.track.id} track={track} order={i} />
      ))}
    </div>
  )
}

export default Songs
