'use client'
import { useRoutine } from "@/lib/context/routines"
import { generateHourArray, filterRepeatedNumbers, parseHourMinute } from "@/utils/routine"
import { ColHeaderData, RowHeaderData, TableColDataContainer, TableColHeader, TableContainer, TableDataContainer, TableDivisionLine, TableEventDataCell, TableRowHeader } from "./style"
import { translateWeakDays, weakDays } from "@/utils/weakDays"

interface IRoutineTable {
  width: number
  heigth: number
}

export const RoutineTable = ({heigth, width}: IRoutineTable) => {
  const routines = useRoutine((state) => state.routine)
  const daysOnTable = useRoutine((state) => state.daysOnTable)
  const arrayOfHours = generateHourArray(routines)
  /* const arrayOfNumber = filterRepeatedNumbers(arrayOfHours) */

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

  console.log(arrayOfHours.length)
  console.log(heightOfHalfHour, heightOfHalfHour * arrayOfHours.length)

  return (
    <TableContainer width={width} heigth={heigth}>
      {arrayOfHours.map((hour, i) => {
        console.log(arrayOfHours.length)
        return (
          <>
            <TableDivisionLine
              key={hour + "_00" + "line"}
              left={widthOfColHeader}
              top={heightOfRowHeader + heightOfHalfHour * (i)}
              width={width - widthOfColHeader}
            />
          </>
        );
      })}
      <TableRowHeader 
        heigth={heightOfRowHeader} 
        left={widthOfColHeader} 
        width={width - widthOfColHeader}
        >
        {weakDays.map(day => <RowHeaderData key={day} width={widthOfEachCell}>{translateWeakDays[day]}</RowHeaderData>)}
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
              {hour} - {arrayOfHours[i+1]}
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
        {weakDays.map((dayTag, i) =>
          <TableColDataContainer key={dayTag+i} width={widthOfEachCell}>
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
                >
                  {`${id}: ${title}`}
                    <br/>
                  {`${startHour} - ${endHour}`}
                </TableEventDataCell>
              )
            })}
          </TableColDataContainer>
        )}
      </TableDataContainer>
    </TableContainer>
  )
}






/* if (arrayOfHours[i] !== arrayOfHours[i+1] && arrayOfHours[i] !== arrayOfHours[i-1]) {
  return (
    <>
      <TableDivisionLine
        key={hour+"true"+"line"}
        id={hour+"true"+"line"}
        left={widthOfColHeader} 
        top={heightOfRowHeader + heightOfHalfHour*(i)} 
        width={width - widthOfColHeader}
      />
        <TableDivisionLine
        key={hour+"true"+"_00"+"line"}
        id={hour+"true"+"_30"+"line"}
        left={widthOfColHeader} 
        top={heightOfRowHeader + heightOfHalfHour*(i+1)} 
        width={width- widthOfColHeader}
      />
    </>
    
  )
} else if (arrayOfHours[i+1] === arrayOfHours[i]) {
  let top = heightOfRowHeader + heightOfHalfHour*(i)
  return (
    <>
      <TableDivisionLine
      key={hour+"line"}
      id={hour+"_00"+"line"}
      left={0} 
      top={top} 
      width={width}
      />
      <TableDivisionLine
        key={hour+"_30"+"line"}
        id={hour+"_30"+"line"}
        left={0} 
        top={heightOfRowHeader + heightOfHalfHour*(i+1)} 
        width={width}
      />
    </>
  )
} */