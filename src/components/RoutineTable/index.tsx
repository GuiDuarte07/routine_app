'use client'
import { useRoutine } from "@/lib/context/routines"
import { eventToHourArray } from "@/utils/routine"
import { ColHeaderData, RowHeaderData, TableColDataContainer, TableColHeader, TableContainer, TableDataContainer, TableEventDataCell, TableRowHeader } from "./style"
import { translateWeakDays, weakDays } from "@/utils/weakDays"

interface IRoutineTable {
  width: number
  heigth: number
}


const getRandomColor = (): string => {
  const color1 = getRandomHexColor();
  const color2 = getRandomHexColor();
  return `linear-gradient(135deg, ${color1}, ${color2})`;
};

const getRandomHexColor = (): string => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

export const RoutineTable = ({heigth, width}: IRoutineTable) => {
  const routines = useRoutine((state) => state.routine)
  const daysOnTable = useRoutine((state) => state.daysOnTable)
  const arrayOfHours = eventToHourArray(routines)

  const widthOfColHeader = width * 0.10
  const heightOfRowHeader = heigth * 0.06

  const widthOfEachCell = (width - widthOfColHeader) / daysOnTable
  const heightOfHalfHour = ((heigth - heightOfRowHeader) / (arrayOfHours[arrayOfHours.length - 1] - arrayOfHours[0] + (arrayOfHours[arrayOfHours.length - 1] === arrayOfHours[arrayOfHours.length - 2] ? 1 : 0))) / 2

  return (
    <TableContainer width={width} heigth={heigth}>
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
                  style={{background: "red"}}
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






