import { IEvent, IHourEvent } from "@/types/Events"

export function parseHourMinute(time: string): { hour: number; minute: number } {
  const [hourStr, minuteStr] = time.split(":")
  return { hour: parseInt(hourStr), minute: parseInt(minuteStr) }
}

export function formatHourMinute(hour: number | string, minute: number | string): string {
  const hourStr = hour.toString().padStart(2, "0")
  const minuteStr = minute.toString().padStart(2, "0")
  return `${hourStr}:${minuteStr}`
}

//Se retornar > 0 significa que o primeiro é maior que o segundo, < 0 o contrário
function compareTimes(time1: string, time2: string): number {
  const { hour: hour1, minute: minute1 } = parseHourMinute(time1)
  const { hour: hour2, minute: minute2 } = parseHourMinute(time2)

  if (hour1 === hour2) {
    return minute1 - minute2
  }

  return hour1 - hour2
}

function findBiggestHour(hour1: string, hour2: string): string {
  return compareTimes(hour1, hour2) > 0 ? hour1 : hour2
}

export function generateHourArray(hoursArray: { startHour: string; endHour: string }[]): string[] {
  if (hoursArray.length === 0) {
    throw new Error("The array must not be empty.")
  }

  const result: string[] = []
  let minHour: string = hoursArray[0].startHour
  let maxHour: string = hoursArray[0].endHour
  
  for (const hour of hoursArray) {
    minHour = findBiggestHour(hour.startHour, minHour) === minHour ? hour.startHour : minHour
    maxHour = findBiggestHour(hour.endHour, maxHour)
  }

  let currentHour = minHour

  while (result[result.length - 1] !== maxHour) {
    result.push(currentHour)

    const { hour, minute } = parseHourMinute(currentHour)
    // Increment by half an hour
    if (minute < 30) {
      currentHour = formatHourMinute(hour, minute + 30)
    } else {
      currentHour = formatHourMinute(hour + 1, 0)
    }
  }

  return result
}

export function extractHoursFromEvents(events: IEvent[]): { startHour: string, endHour: string }[] {
  const result: { startHour: string, endHour: string }[] = []

  for (const event of events) {
    for (const occurrence of event.occurrence) {
      result.push({
        startHour: occurrence.startHour,
        endHour: occurrence.endHour,
      })
    }
  }

  return result
}

export function transformEventsToArray(events: IEvent[]): { id: string, title: string, color: string, startHour: string, day: string, endHour: string }[] {
  return events.flatMap((event) =>
    event.occurrence.map((occurrence) => ({
      id: occurrence.id,
      title: event.title,
      color: event.color,
      startHour: occurrence.startHour,
      day: occurrence.day,
      endHour: occurrence.endHour,
    }))
  )
}

export function hasTimeConflict(event: IEvent, events: IEvent[]): boolean {
  console.log(event)
  for (const occurrence of event.occurrence) {
    const startTimeEvent = new Date(`1970-01-01T${occurrence.startHour}`)
    const endTimeEvent = new Date(`1970-01-01T${occurrence.endHour}`)

    for (const otherEvent of events) {
      if (otherEvent !== event && otherEvent.occurrence.some((o) => o.day === occurrence.day)) {
        for (const otherOccurrence of otherEvent.occurrence) {
          const startTimeOther = new Date(`1970-01-01T${otherOccurrence.startHour}`)
          const endTimeOther = new Date(`1970-01-01T${otherOccurrence.endHour}`)

          if (
            (startTimeEvent < endTimeOther && startTimeOther < endTimeEvent) ||
            (startTimeOther < endTimeEvent && startTimeEvent < endTimeOther)
          ) {
            return true // Conflito encontrado
          }     
        }
      }
    }
  }

  return false // Nenhum conflito encontrado
}

export function hasOccurrenceConflict(newHour: IHourEvent, hours: IHourEvent[]): boolean {
  const startTimeNew = new Date(`1970-01-01T${newHour.startHour}`)
  const endTimeNew = new Date(`1970-01-01T${newHour.endHour}`)

  for (const hour of hours) {
    if (hour.day === newHour.day) {
      const startTimeExisting = new Date(`1970-01-01T${hour.startHour}`)
      const endTimeExisting = new Date(`1970-01-01T${hour.endHour}`)

      if (
        (startTimeNew <= endTimeExisting && startTimeExisting <= endTimeNew) ||
        (startTimeExisting <= endTimeNew && startTimeNew <= endTimeExisting)
      ) {
        return true
      }
    }
  }

  return false
}






