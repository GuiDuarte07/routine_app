'use client'
import { useRoutine } from "@/lib/context/routines"
import { eventToHourArray } from "@/utils/routine"
import { ColHeaderData, RowHeaderData, TableColHeader, TableContainer, TableDataContainer, TableRowHeader } from "./style"
import { weakDays } from "@/utils/weakDays"

interface IRoutineTable {
  width: number
  heigth: number
}

export const RoutineTable = ({heigth, width}: IRoutineTable) => {
  const routines = useRoutine((state) => state.routine)
  const daysOnTable = useRoutine((state) => state.daysOnTable)
  const arrayOfHours = eventToHourArray(routines)

  const widthOfColHeader = width * 0.10
  const heightOfRowHeader = heigth * 0.06

  const widthOfEachCell = (width - widthOfColHeader) / daysOnTable
  const heightOfHalfHour = ((heigth - heightOfRowHeader) / (arrayOfHours[arrayOfHours.length - 1] - arrayOfHours[0] + (arrayOfHours[arrayOfHours.length - 1] === arrayOfHours[arrayOfHours.length - 2] ? 1 : 0))) / 2
  const daysOfWeak: string[] = []

  for(const key in weakDays as { [key: string]: string }) {
    daysOfWeak.push(weakDays[key])
  }

  return (
    <TableContainer width={width} heigth={heigth}>
      <TableRowHeader heigth={heightOfRowHeader} left={widthOfColHeader} width={width - widthOfColHeader}>
        {daysOfWeak.map(day => <RowHeaderData width={widthOfEachCell}>{day}</RowHeaderData>)}
      </TableRowHeader>
      <TableColHeader heigth={heigth - heightOfRowHeader} top={heightOfRowHeader} width={widthOfColHeader} >
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
          return (
            <ColHeaderData height={height}>
              {hourAnnotation()}
            </ColHeaderData>
          )
        })}
      </TableColHeader>

      <TableDataContainer heigth={heigth - heightOfRowHeader} width={width-widthOfColHeader} top={heightOfRowHeader} left={widthOfColHeader} ></TableDataContainer>
    </TableContainer>
  )
}






