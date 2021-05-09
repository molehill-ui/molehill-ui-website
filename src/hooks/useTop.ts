import { useState, useEffect } from 'react'
import { useRect } from '@reach/rect'

export function useTop(ref) {
  let [top, setTop] = useState<number>()
  let rect = useRect(ref)
  let rectTop = rect ? rect.top : undefined
  useEffect(() => {
    if (typeof rectTop === 'undefined') return
    let newTop = rectTop + window.pageYOffset
    if (newTop !== top) {
      setTop(newTop)
    }
  }, [rectTop, top])
  return top
}
