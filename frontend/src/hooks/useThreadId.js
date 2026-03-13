import { v4 as uuidv4 } from 'uuid'
import { useCallback } from 'react'

export function useThreadId() {
  const generate = useCallback(() => uuidv4(), [])
  return { generate }
}
