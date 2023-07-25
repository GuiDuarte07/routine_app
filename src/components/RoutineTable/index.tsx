'use client'
import { useRoutine } from "@/lib/context/routines"
import { generateHourArray, filterRepeatedNumbers, parseHourMinute } from "@/utils/routine"
import { ColHeaderData, RowHeaderData, TableColDataContainer, TableColHeader, TableContainer, TableDataContainer, TableDivisionLine, TableEventDataCell, TableRowHeader } from "./style"
import { translateToPortugueseWeekDays, arrayWeekDays } from "@/utils/weakDays"
import { getRandomColor } from "@/utils/color"
import { useCallback, useEffect, useMemo } from "react"

interface IRoutineTable {
  width: number
  heigth: number
}

export const RoutineTable = ({heigth, width}: IRoutineTable) => {
  const routines = useRoutine((state) => state.routine)
  const daysOnTable = useRoutine((state) => state.daysOnTable)
  const arrayOfHours = useMemo(() => generateHourArray(routines), [routines])

  const widthOfColHeader = width * 0.10
  const heightOfRowHeader = heigth * 0.06

  const widthOfEachCell = (width - widthOfColHeader) / daysOnTable
  const heightOfHalfHour = (
    (heigth - heightOfRowHeader) /
    (
      arrayOfHours.length
      /* parseHourMinute(arrayOfHours[arrayOfHours.length - 1]).hour*2 - parseHourMinute(arrayOfHours[0]).hour*2 + ((parseHourMinute(arrayOfHours[arrayOfHours.length - 1]).minute === 30 ? 1 : 0))
      + ((parseHourMinute(arrayOfHours[0]).minute === 30 ? 1 : 0)) */
    )
  )

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
        {arrayOfHours.map((hour, i) => {
          return (
            <>
              <TableDivisionLine
                key={hour + "_00" + "line"}
                top={heightOfHalfHour * (i)}
                width={width - widthOfColHeader}
              />
            </>
          );
        })}
        {arrayWeekDays.map((dayTag, i) =>
          <TableColDataContainer key={dayTag+i} width={widthOfEachCell}>
            {/* Eventos */}
            {routines?.filter(({day})=> day === dayTag).map(({id, title, endHour, startHour}) => {
              const {hour: startH, minute: startM} = parseHourMinute(startHour)
              const {hour: endH, minute: endM} = parseHourMinute(endHour)
              const {hour: firstArrayH, minute: firstArrayM} = parseHourMinute(arrayOfHours[0])
              let qntOfHalfHour = (endH - startH) * 2
              
              if(startM === 30) qntOfHalfHour -= 1
              if(endM === 30) qntOfHalfHour += 1

              let heightOfEvent = qntOfHalfHour * heightOfHalfHour

              let heightTopStartEvent = (startH - firstArrayH) * 2

              if(firstArrayM === 0 && startM === 30) {
                heightTopStartEvent++
              }

              if(firstArrayM === 30 && startM === 0) {
                heightTopStartEvent--
              }
              
              let topStart = heightTopStartEvent * heightOfHalfHour

              return (
                <TableEventDataCell
                  key={id}
                  height={heightOfEvent}
                  top={topStart}
                  style={{backgroundColor: getRandomColor()}}
                >
                  <div>
                    <h3>{`${title}`}</h3>
                    <p>{`${startHour} - ${endHour}`}</p>
                  </div>
                </TableEventDataCell>
              )
            })}
          </TableColDataContainer>
        )}
      </TableDataContainer>
    </TableContainer>
  )
}