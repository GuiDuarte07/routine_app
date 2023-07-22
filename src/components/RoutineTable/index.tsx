'use client'
import { useRoutine } from "@/lib/context/routines"
import { eventToHourArray, filterRepeatedNumbers } from "@/utils/routine"
import { ColHeaderData, RowHeaderData, TableColDataContainer, TableColHeader, TableContainer, TableDataContainer, TableDivisionLine, TableEventDataCell, TableRowHeader } from "./style"
import { translateWeakDays, weakDays } from "@/utils/weakDays"

interface IRoutineTable {
  width: number
  heigth: number
}

export const RoutineTable = ({heigth, width}: IRoutineTable) => {
  const routines = useRoutine((state) => state.routine)
  const daysOnTable = useRoutine((state) => state.daysOnTable)
  const arrayOfHours = eventToHourArray(routines)
  const arrayOfNumber = filterRepeatedNumbers(arrayOfHours)

  const widthOfColHeader = width * 0.10
  const heightOfRowHeader = heigth * 0.06

  const widthOfEachCell = (width - widthOfColHeader) / daysOnTable
  const heightOfHalfHour = ((heigth - heightOfRowHeader) / (arrayOfHours[arrayOfHours.length - 1] - arrayOfHours[0] + (arrayOfHours[arrayOfHours.length - 1] === arrayOfHours[arrayOfHours.length - 2] ? 1 : 0))) / 2

  return (
    <TableContainer width={width} heigth={heigth}>
      {arrayOfNumber.map((hour, i) => {
        return (
          <>
            <TableDivisionLine
              key={hour + "_00" + "line"}
              left={widthOfColHeader}
              top={heightOfRowHeader + heightOfHalfHour * (i * 2 + 1)}
              width={width - widthOfColHeader}
            />
            <TableDivisionLine
              key={hour + "_30" + "line"}
              left={widthOfColHeader}
              top={heightOfRowHeader + heightOfHalfHour * (i * 2 + 2)}
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
          let height = heightOfHalfHour;

          function hourAnnotation() {
            let leftSideHour = hour + ":"
            let rightSideHour = ""

            if(arrayOfHours[i+1] === hour) {
              leftSideHour += "00"
              rightSideHour = hour + ":" + "30"
            } else if (arrayOfHours[i-1] === hour) {
              leftSideHour += "30"
              rightSideHour = arrayOfHours[i+1] + ":" + "00"
              if (arrayOfHours[i+1] === undefined) {
                if (arrayOfHours[i-1] === hour) {
                  rightSideHour = (hour + 1 === 24 ? 0 : hour + 1) + ":" + "00"  
                } else {
                  rightSideHour = hour + ":" + "30"
                }
              }
            } else {
              leftSideHour += "00"
              rightSideHour = arrayOfHours[i+1] + ":" + "00"
            }

            return leftSideHour + " - " + rightSideHour
           }

          if (arrayOfHours[i+1] !== hour && arrayOfHours[i-1] !== hour) {
            height = heightOfHalfHour*2
          }

          const hourText = hourAnnotation()
          return (
            <ColHeaderData key={hourText} height={height}>
              {hourText}
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
              const [startH, startM] = startHour.split(":").map(x => parseInt(x))
              const [endH, endM] = endHour.split(":").map(x => parseInt(x))
              let qntOfHalfHour = (endH - startH) * 2
              
              if(startM === 30) qntOfHalfHour -= 1
              if(endM === 30) qntOfHalfHour += 1

              let heightOfEvent = qntOfHalfHour * heightOfHalfHour

              let heightTopStartEvent = (startH - arrayOfHours[0]) * 2
              if (startM === 30) heightTopStartEvent += 1

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