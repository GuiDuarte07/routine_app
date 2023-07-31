'use client'
import { useRoutine } from "@/lib/context/routines"
import { extractHoursFromEvents, generateHourArray, parseHourMinute, transformEventsToArray } from "@/utils/routine"
import { ColHeaderData, RowHeaderData, TableColDataContainer, TableColHeader, TableContainer, TableDataContainer, TableDivisionLine, TableEventDataCell, TableEventDataCellContainer, TableEventMoreOptions, TableRowHeader } from "./style"
import { translateToPortugueseWeekDays, arrayWeekDays } from "@/utils/weakDays"
import { useMemo, useState, useRef } from "react"

import {BiEdit, BiMove} from "react-icons/bi"
import {AiOutlineDelete} from "react-icons/ai"

interface IRoutineTable {
  width: number
  heigth: number
}

export const RoutineTable = ({heigth, width}: IRoutineTable) => {
  const routines = useRoutine((state) => state.routine)
  const daysOnTable = useRoutine((state) => state.daysOnTable)
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

  return (
    <TableContainer width={width} heigth={heigth}>
      <TableRowHeader 
        heigth={heightOfRowHeader} 
        left={widthOfColHeader} 
        width={width - widthOfColHeader}
        >
        {arrayWeekDays.map(day => <RowHeaderData key={day} width={widthOfEachCell}>{translateToPortugueseWeekDays[day]}</RowHeaderData>)}
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
                key={hour + "_00" + "line"}
                top={heightOfHalfHour * (i)}
                width={width - widthOfColHeader}
              />
            </>
          )
        })}
        {arrayWeekDays.map((dayTag, i) =>
          <TableColDataContainer key={dayTag+i} width={widthOfEachCell}>
            {/* Eventos */}
            {transformEventsToArray(routines).filter(({day})=> day === dayTag).map(({eventId, id, title, endHour, startHour, color}) => {
              const {hour: startH, minute: startM} = parseHourMinute(startHour)
              const {hour: endH, minute: endM} = parseHourMinute(endHour)
              const {hour: firstArrayH, minute: firstArrayM} = parseHourMinute(arrayOfHours[0])
              let qntOfHalfHour = (endH - startH) * 2
              
              if(startM === 30) qntOfHalfHour -= 1
              if(endM === 30) qntOfHalfHour += 1

              const heightOfEvent = qntOfHalfHour * heightOfHalfHour

              let heightTopStartEvent = (startH - firstArrayH) * 2

              if(firstArrayM === 0 && startM === 30) {
                heightTopStartEvent++
              }

              if(firstArrayM === 30 && startM === 0) {
                heightTopStartEvent--
              }
              
              const topStart = heightTopStartEvent * heightOfHalfHour

              return (
                <TableEventDataCellContainer
                  key={id}
                  height={heightOfEvent}
                  top={topStart}
                  style={{backgroundColor: color}}
                  onClick={() => changeEditEventDialog(eventId)}
                  onMouseEnter={() => addOptionsOnMouseIn(id)}
                  onMouseLeave={removeOptionsOnMouseOut}
                >
                  <TableEventDataCell>
                    <div>
                      <h3>{`${title}`}</h3>
                      <p>{`${startHour} - ${endHour}`}</p>
                    </div>
                  </TableEventDataCell>
                  {mouseHoverId === id && 
                    <TableEventMoreOptions className="flex flex-col items-center justify-start">
                        <button type="button" className="flex items-center justify-center py-2 w-full hover:bg-blue-600">
                          <BiEdit/>
                        </button>
                        <button type="button" className="flex items-center justify-center py-2 w-full hover:bg-blue-600">
                          <BiMove/>
                        </button>
                        <button type="button" className="flex items-center justify-center py-2 w-full hover:bg-blue-600">
                          <AiOutlineDelete/>
                        </button>
                    </TableEventMoreOptions>
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