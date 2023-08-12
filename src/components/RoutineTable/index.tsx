'use client'
import { useRoutine } from "@/lib/context/routines"
import { extractHoursFromEvents, generateHourArray, transformEventsToArray } from "@/utils/routine"
import { ColHeaderData, RowHeaderData, TableColDataContainer, TableColHeader, TableContainer, TableDataContainer, TableDivisionLine, TableEventDataCell, TableEventDataCellContainer, TableEventMoreOptions, TableRowHeader } from "./style"
import { translateToPortugueseWeekDays, arrayWeekDays } from "@/utils/weakDays"
import { useMemo, useState, useRef, useEffect, KeyboardEvent, useCallback } from "react"

import {BiEdit, BiMove, BiCheck} from "react-icons/bi"
import {AiOutlineDelete} from "react-icons/ai"
import {MdDragIndicator} from "react-icons/md"
import { DragEventFunction, startDragMove } from "@/utils/DragEvent"
import { calculeEventDimensions } from "@/utils/createTable"
import { calculateHeightBetweenHours, dayOfWeekBasedOnLeft, getAvailableSpaces } from "@/utils/eventSize"
import { EnumAbbreviationDays, IEventOccurrence } from "@/types/Events"
import { useMoveByArrow } from "@/hooks/RoutineTable/moveByArrow"

interface IRoutineTable {
  width: number
  heigth: number
}

export const RoutineTable = ({heigth, width}: IRoutineTable) => {
  const routines = useRoutine((state) => state.routine)
  const daysOnTable = useRoutine((state) => state.daysOnTable)
  const deleteOccurrence = useRoutine((state) => state.deleteOccurrence)
  const changeEditEventDialog = useRoutine((state) => state.changeEditEventDialog)

  const arrayOfHours = useMemo(() => generateHourArray(extractHoursFromEvents(routines)), [routines])

  const widthOfColHeader = width * 0.10
  const heightOfRowHeader = heigth * 0.06

  const widthOfEachCell = (width - widthOfColHeader) / daysOnTable
  const heightOfHalfHour = (heigth - heightOfRowHeader) / arrayOfHours.length

  const [mouseHoverId, setMouseHoverId] = useState<undefined | string>(undefined)
  const mouseOutTimer = useRef<NodeJS.Timeout>()

  function addOptionsOnMouseIn(id: string) {
    if (mouseOutTimer.current) {
      clearTimeout(mouseOutTimer.current)
      mouseOutTimer.current = undefined
    }

    setMouseHoverId(id)
  }

  function removeOptionsOnMouseOut() {
    mouseOutTimer.current = setTimeout(() => setMouseHoverId(undefined), 500)
  }

  const eventDataCellContainerRef = useRef<HTMLElement>(null)

  const { moveByArrowDataCellId, confirmMoveByArrowPress, startMoveByArrowOccurrence } = useMoveByArrow()
  

  return (
    <TableContainer width={width} heigth={heigth}>
      <TableRowHeader 
        heigth={heightOfRowHeader} 
        left={widthOfColHeader} 
        width={width - widthOfColHeader}
        >
        {
          arrayWeekDays.map(day => 
            <RowHeaderData key={day} width={widthOfEachCell}>
              {translateToPortugueseWeekDays[day]}
            </RowHeaderData>
          )
        }
      </TableRowHeader>
      <TableColHeader
        heigth={heigth - heightOfRowHeader} 
        top={heightOfRowHeader} 
        width={widthOfColHeader} 
      >
        {arrayOfHours.map((hour, i) => {
          if (!arrayOfHours[i+1]) return null
          return (
            <ColHeaderData key={hour} height={heightOfHalfHour}>
              <p>{hour} - {arrayOfHours[i+1]}</p>
            </ColHeaderData>
          )
        })}
      </TableColHeader>

      <TableDataContainer
        heigth={heigth - heightOfRowHeader} 
        width={width-widthOfColHeader} 
        top={heightOfRowHeader} 
        left={widthOfColHeader} 
      >
        {/* Linhas */}
        {arrayOfHours.map((hour, i) => {routines?.flatMap(({occurrence}) => {occurrence})
          return (
            <>
              <TableDivisionLine
                key={hour + "_00" + i}
                top={heightOfHalfHour * (i)}
                width={width - widthOfColHeader}
              />
            </>
          )
        })}
        {arrayWeekDays.map((dayTag, i) =>
          <TableColDataContainer id={dayTag} key={dayTag+i} width={widthOfEachCell}>
            {/* Eventos */}
            {transformEventsToArray(routines).filter(({day})=> day === dayTag).map(({eventId, id, title, endHour, startHour, color}) => {
              
              const {heightOfEvent, topStart} = calculeEventDimensions({startHour, endHour, heightOfHalfHour, firstOfhours: arrayOfHours[0]})
              
              return (
                <TableEventDataCellContainer
                  {...(moveByArrowDataCellId === id && {ref:eventDataCellContainerRef})}
                  key={id+eventId+dayTag}
                  id={id}
                  height={heightOfEvent}
                  top={topStart}
                  style={{backgroundColor: color}}
                  {...(!moveByArrowDataCellId && {onMouseEnter:() => addOptionsOnMouseIn(id),      onMouseLeave:removeOptionsOnMouseOut})}
                >
                  <TableEventDataCell>
                    <div>
                      <h3>{`${title}`}</h3>
                      <p>{`${startHour} - ${endHour}`}</p>
                      <p>{id}</p>
                    </div>
                  </TableEventDataCell>
                  {mouseHoverId === id && moveByArrowDataCellId === undefined &&
                    <TableEventMoreOptions className="flex flex-col items-center justify-start">
                        <button onClick={() => changeEditEventDialog(eventId)} type="button" className="flex items-center justify-center py-2 w-full hover:bg-blue-600">
                          <BiEdit aria-label="Editar"/>
                        </button>
                        <button onClick={() => (id)} type="button" className="flex items-center justify-center py-2 w-full hover:bg-blue-600">
                          <MdDragIndicator/>
                        </button>
                        <button onClick={() => startMoveByArrowOccurrence(id)} type="button" className="flex items-center justify-center py-2 w-full hover:bg-blue-600">
                          <BiMove/>
                        </button>
                        <button onClick={() => deleteOccurrence(id)} type="button" className="flex items-center justify-center py-2 w-full hover:bg-blue-600">
                          <AiOutlineDelete/>
                        </button>
                    </TableEventMoreOptions>
                  }

                  {mouseHoverId === id && moveByArrowDataCellId === id &&
                    <div className="flex flex-col items-center justify-start bg-green-700 absolute top-0 right-[-45px] w-[40px] z-[99999]">
                      <button onClick={() => confirmMoveByArrowPress()} type="button" className="flex items-center justify-center w-full py-2 hover:bg-green-800">
                          <BiCheck size={"24px"}/>
                      </button>
                    </div>
                  }
                </TableEventDataCellContainer>
              )
            })}
          </TableColDataContainer>
        )}
      </TableDataContainer>
    </TableContainer>
  )
}

/* const draggedOccurrence = routines.flatMap((routine) => routine.occurrence).find((occurrence) => occurrence.id === moveByArrowDataCellId)
      if (!draggedOccurrence) return

      const onMouseDragEnd: DragEventFunction = (top, left, avaliableDimension) => {
        console.log("finalizou!")
      }

      const elementsAvailable = getAvailableSpaces({
        daysOnTable, 
        dayWidth: widthOfEachCell, 
        draggedOccurrence,
        startDayHour: arrayOfHours[0],
        endDayHour: arrayOfHours[arrayOfHours.length - 1],
        heightOfHalfHour,
        routines
      })
      startDragMove(
        eventDataCellContainerRef.current as HTMLElement,
        draggedOccurrence,
        elementsAvailable,
        onMouseDragEnd,
        true
      )*/