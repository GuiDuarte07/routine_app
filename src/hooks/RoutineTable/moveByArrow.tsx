import { useRoutine } from "@/lib/context/routines"
import { useCallback, useEffect, useState } from "react"

export const useMoveByArrow = () => {
  const moveEventByKey = useRoutine(state => state.moveEventByKey)
  const [moveByArrowDataCellId, setMoveByArrowDataCellId] = useState<string | undefined>(undefined)

  function startMoveByArrowOccurrence(id: string) {
    setMoveByArrowDataCellId(id)
  }

  const handleMoveByArrowPress = useCallback((event: globalThis.KeyboardEvent) => {
    if (!moveByArrowDataCellId) return
    event.preventDefault()
    moveEventByKey(event.code, event.shiftKey, moveByArrowDataCellId)
  }, [moveByArrowDataCellId, moveEventByKey])

  function confirmMoveByArrowPress() {
    setMoveByArrowDataCellId(undefined)
  }

  
  useEffect(() => {
    if (moveByArrowDataCellId) {
      document.onkeydown = handleMoveByArrowPress
    } else {
      document.onkeydown = null
    }
  }, [moveByArrowDataCellId, handleMoveByArrowPress])

  return {
    moveByArrowDataCellId,
    startMoveByArrowOccurrence,
    confirmMoveByArrowPress
  }
}