import { React, CSSProperties, ReactNode } from 'shim-react'

const { useEffect, useState } = React

interface LazyloadImageProps {
  src: string
  placeholder: ReactNode
  className?: string
  style?: CSSProperties
  alt?: string
  width?: string
  height?: string
}

export function LazyloadImage(props: LazyloadImageProps) {
  const { src, placeholder, className, style, alt, width, height } = props

  const [loadStatus, setLoadStatus] = useState<boolean>(false)

  const image = new Image(0, 0)

  image.src = src

  useEffect(() => {
    image.onload = () => {
      setLoadStatus(true)
    }
  })

  return (
    <>
      {(loadStatus && (
        <img
          src={src}
          width={width}
          height={height}
          className={className}
          style={style}
          alt={alt}
        />
      )) ||
        placeholder}
    </>
  )
}
