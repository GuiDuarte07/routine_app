import { EnumAbbreviationDays, IEvent, IEventOccurrence } from "@/types/Events"
import { arrayWeekDays } from "./weakDays"
import { parseHourMinute } from "./routine"

/* export type BlockedSpaces = {
  top: number
  left: number
  width: number
  height: number
}

function getDayLeftOffset(day: EnumAbbreviationDays, dayWidth: number): number {
  return arrayWeekDays.findIndex((weekday) => weekday === day) * dayWidth
}

interface ICalculateBlockedSpace {
  occurrence: IEventOccurrence,
  dayWidth: number,
  heightOfHalfHour: number,
  firstOfhours: string
}

function calculateBlockedSpace({
  dayWidth,
  firstOfhours,
  heightOfHalfHour,
  occurrence
}: ICalculateBlockedSpace): BlockedSpaces {
  const { startHour, endHour, day } = occurrence
  // o elemento tem width: 95%;
  const width = dayWidth
  const left = getDayLeftOffset(day, dayWidth)

  const {heightOfEvent: height, topStart: top} = calculeEventDimensions({startHour, endHour, heightOfHalfHour, firstOfhours})

  return { top, left, width, height }
}



export function getBlockedSpace(routines: IEvent[], dayWidth: number, heightOfHalfHour: number, firstOfhours: string): BlockedSpaces[] {
  const blockedSpaces: BlockedSpaces[] = []

  for (const routine of routines) {
    for (const occurrence of routine.occurrence) {
      const blockedSpace = calculateBlockedSpace({occurrence, dayWidth, firstOfhours, heightOfHalfHour})
      blockedSpaces.push(blockedSpace)
    }
  }

  return blockedSpaces
} */

export interface AvailableSpaces {
  top: number;
  left: number;
  width: number;
  height: number;
}

function getDayLeftOffset(day: EnumAbbreviationDays, dayWidth: number): number {
  return arrayWeekDays.findIndex((weekday) => weekday === day) * dayWidth
}

export function calculateHeightBetweenHours(startHour: string, endHour: string, heightOfHalfHour: number) {
  const {hour: startH, minute: startM} = parseHourMinute(startHour)
  const {hour: endH, minute: endM} = parseHourMinute(endHour)
  return ((endH - startH) * 2 + (endM - startM) / 30) * heightOfHalfHour
}

interface IGetAvailableSpaces {
  routines: IEvent[],
  dayWidth: number,
  heightOfHalfHour: number,
  draggedOccurrence: IEventOccurrence,
  daysOnTable: number,
  startDayHour: string,
  endDayHour: string
}

export function getAvailableSpaces(
  { dayWidth, daysOnTable, draggedOccurrence, endDayHour, heightOfHalfHour, routines, startDayHour }
  : IGetAvailableSpaces
): AvailableSpaces[] {
  
  const availableSpaces: AvailableSpaces[] = []
  const { startHour: draggedStartHour, endHour: draggedEndHour } = draggedOccurrence

  const draggedHeight = calculateHeightBetweenHours(draggedStartHour, draggedEndHour,heightOfHalfHour)

  const sortedOccurrences: IEventOccurrence[] = routines.flatMap((routine) => routine.occurrence).sort((a, b) => {
    const aStart = parseHourMinute(a.startHour)
    const bStart = parseHourMinute(b.startHour)
    return aStart.hour * 60 + aStart.minute - (bStart.hour * 60 + bStart.minute)
  }).filter(({id}) => id !== draggedOccurrence.id)

  for (const weekday of arrayWeekDays.slice(0, daysOnTable)) {
    const weekdayOccurrences = sortedOccurrences.filter(({day}) => day === weekday)
    if (weekdayOccurrences.length === 0) {
      availableSpaces.push({ 
        top: 0, 
        left: getDayLeftOffset(weekday, dayWidth), 
        width: dayWidth, 
        height: calculateHeightBetweenHours(startDayHour, endDayHour, heightOfHalfHour) 
      })
      continue
    }

    weekdayOccurrences.forEach(({startHour,endHour}, i) => {
      if (i === 0) {
        const avaliableHeight = calculateHeightBetweenHours(startDayHour, startHour, heightOfHalfHour)

        if (avaliableHeight >= draggedHeight) {
          availableSpaces.push({ 
            top: 0,
            left: getDayLeftOffset(weekday, dayWidth), 
            width: dayWidth,
            height: avaliableHeight
          })
        }
      } else {
        const avaliableHeight = calculateHeightBetweenHours(weekdayOccurrences[i-1].endHour, startHour, heightOfHalfHour)
        
        if (avaliableHeight >= draggedHeight) {
          availableSpaces.push({ 
            top: calculateHeightBetweenHours(startDayHour, weekdayOccurrences[i-1].endHour, heightOfHalfHour),
            left: getDayLeftOffset(weekday, dayWidth), 
            width: dayWidth,
            height: avaliableHeight
          })
        }
      }

      if (!weekdayOccurrences[i+1]) {
        const avaliableHeight = calculateHeightBetweenHours(endHour, endDayHour, heightOfHalfHour)

        if (avaliableHeight >= draggedHeight) {
          availableSpaces.push({ 
            top: calculateHeightBetweenHours(startDayHour, endHour, heightOfHalfHour),
            left: getDayLeftOffset(weekday, dayWidth), 
            width: dayWidth,
            height: avaliableHeight
          })
        }
      } 
    })
  } 

  return availableSpaces
}

export function isInsideAvailableSpace(x: number, y: number, availableSpaces: AvailableSpaces[]): AvailableSpaces | undefined {
  for (const space of availableSpaces) {
    const { top, left, width, height } = space
    if (x >= left && x <= left + width && y >= top && y <= top + height) {
      return space
    }
  }
  return undefined
}

export function dayOfWeekBasedOnLeft(left: number, dayWidth: number): EnumAbbreviationDays {
  const dayIndex = Math.floor(left / dayWidth)

  const day = arrayWeekDays[dayIndex]

  return day
}
