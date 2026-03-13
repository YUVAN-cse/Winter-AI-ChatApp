import { useEffect, useRef } from 'react'

export function useAutoScroll(deps) {
  const ref = useRef(null)

  useEffect(() => {
    if (ref.current) {
      ref.current.scrollTo({ top: ref.current.scrollHeight, behavior: 'smooth' })
    }
  }, deps)

  return ref
}
