import React, { useCallback, useEffect, useState } from 'react'
import { VolumeUpIcon as VolumeDownIcon } from '@heroicons/react/outline'
import { debounce } from 'lodash'
import Slider from '@mui/material/Slider'
import useSpotify from '../hooks/useSpotify'

export default function Volume() {
  const spotifyApi = useSpotify()
  const [volume, setVolume] = useState(75)
  const [hovered, setHovered] = useState(false)

  useEffect(() => {
    if (volume > 0 && volume < 100) {
      debouncedAdjustVolume(volume)
    }
  }, [volume])

  const debouncedAdjustVolume = useCallback(
    debounce((volume) => {
      spotifyApi.setVolume(volume).catch((err) => {})
    }, 100),
    []
  )

  return (
    <div className="flex items-center justify-end space-x-3 pr-5">
      <VolumeDownIcon
        onClick={() => (volume <= 1 ? setVolume(75) : setVolume(1))}
        className="button mute-button"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      />
      <Slider
        className="range w-14 md:w-20"
        style={hovered ? { color: '#1db954' } : {}}
        type="range"
        size="small"
        value={volume}
        min={0}
        max={100}
        onChange={(e) => setVolume(Number(e.target.value))}
      ></Slider>
    </div>
  )
}
