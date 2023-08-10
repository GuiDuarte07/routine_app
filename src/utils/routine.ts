import { IEvent, IEventOccurrence, IHourEvent, IHourEventTranslated } from "@/types/Events"

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

export function transformEventsToArray(events: IEvent[]): {eventId: number, id: string, title: string, color: string, startHour: string, day: string, endHour: string }[] {
  return events.flatMap((event) =>
    event.occurrence.map((occurrence) => ({
      eventId: event.id,
      id: occurrence.id,
      title: event.title,
      color: event.color,
      startHour: occurrence.startHour,
      day: occurrence.day,
      endHour: occurrence.endHour,
    }))
  )
}

export function EditEventHasTimeConflict(event: IEvent, events: IEvent[]): boolean {
  for (const occurrence of event.occurrence) {
    const startTimeEvent = new Date(`1970-01-01T${occurrence.startHour}`)
    const endTimeEvent = new Date(`1970-01-01T${occurrence.endHour}`)

    for (const otherEvent of events) {
      if (event.id === otherEvent.id) break

      if (otherEvent !== event && otherEvent.occurrence.some((o) => o.day === occurrence.day)) {
        for (const otherOccurrence of otherEvent.occurrence) {
          const startTimeOther = new Date(`1970-01-01T${otherOccurrence.startHour}`)
          const endTimeOther = new Date(`1970-01-01T${otherOccurrence.endHour}`)

          if (
            (startTimeEvent < endTimeOther && startTimeOther < endTimeEvent) ||
            (startTimeOther < endTimeEvent && startTimeEvent < endTimeOther)
          ) {
            console.log(startTimeEvent, endTimeEvent, startTimeOther, endTimeOther)
            console.log(startTimeEvent < endTimeOther, startTimeOther < endTimeEvent)
            console.log(startTimeOther < endTimeEvent, startTimeEvent < endTimeOther)
            console.log(otherOccurrence, occurrence)
            return true // Conflito encontrado
          }     
        }
      }
    }
  }

  return false // Nenhum conflito encontrado
}

export function newEventHasTimeConflict(event: IEvent, events: IEvent[]): boolean {
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
            console.log(startTimeEvent, endTimeEvent, startTimeOther, endTimeOther)
            console.log(startTimeEvent < endTimeOther, startTimeOther < endTimeEvent)
            console.log(startTimeOther < endTimeEvent, startTimeEvent < endTimeOther)
            console.log(otherOccurrence, occurrence)
            return true // Conflito encontrado
          }     
        }
      }
    }
  }

  return false // Nenhum conflito encontrado
}

export function hasOccurrenceConflict(newHour: IHourEvent | IHourEventTranslated, hours: IHourEvent[] | IEventOccurrence[]): boolean {
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

// Função para somar ou remover minutes de um horário
export function performTimeOperation(hour: string, minute: number, operation: "+" | "-", cancelOperationOnAfterMidNight: boolean): string {
  const { hour: parsedHour, minute: parsedMinute } = parseHourMinute(hour)
  let resultHour = parsedHour
  let resultMinute = parsedMinute

  if (operation === "+") {
    const totalMinutes = parsedHour * 60 + parsedMinute + minute
    if (cancelOperationOnAfterMidNight && totalMinutes >= 1440) {
      return hour
    }
    resultHour = Math.floor(totalMinutes / 60) % 24
    resultMinute = totalMinutes % 60
  } else if (operation === "-") {
    let totalMinutes = parsedHour * 60 + parsedMinute - minute
    if (totalMinutes < 0) {
      totalMinutes = 24 * 60 + totalMinutes
      if (cancelOperationOnAfterMidNight) {
        return hour
      }
    }
    resultHour = Math.floor(totalMinutes / 60) % 24
    resultMinute = totalMinutes % 60
  }

  return formatHourMinute(resultHour, resultMinute)
}

export function routineHasOccurrenceConflict(events: IEvent[]): boolean {
  for (let i = 0; i < events.length; i++) {
    for (let j = i + 1; j < events.length; j++) {
      for (const occurrenceI of events[i].occurrence) {
        for (const occurrenceJ of events[j].occurrence) {
          if (occurrenceI.day === occurrenceJ.day) {
            const startTimeI = new Date(`1970-01-01T${occurrenceI.startHour}`)
            const endTimeI = new Date(`1970-01-01T${occurrenceI.endHour}`)
            const startTimeJ = new Date(`1970-01-01T${occurrenceJ.startHour}`)
            const endTimeJ = new Date(`1970-01-01T${occurrenceJ.endHour}`)

            if ((startTimeI < endTimeJ && startTimeJ < endTimeI) || (startTimeJ < endTimeI && startTimeI < endTimeJ)) {
              return true // Conflito encontrado
            }
          }
        }
      }
    }
  }
  return false // Nenhum conflito encontrado
}

export function findConflictWithOccurrence(occurrenceId: string, events: IEvent[]): string | undefined {
  const eventWithOccurrence = events.find(event => event.occurrence.some(occurrence => occurrence.id === occurrenceId))

  if (!eventWithOccurrence) {
    return undefined // Ocorrência não encontrada em nenhum evento
  }

  const occurrenceToCheck = eventWithOccurrence.occurrence.find(occurrence => occurrence.id === occurrenceId)

  if (!occurrenceToCheck) {
    return undefined // Ocorrência não encontrada
  }

  const startDateTime = new Date(`1970-01-01T${occurrenceToCheck.startHour}`)
  const endDateTime = new Date(`1970-01-01T${occurrenceToCheck.endHour}`)

  for (const event of events) {
    for (const occurrence of event.occurrence) {
      if (occurrence.id !== occurrenceId && occurrence.day === occurrenceToCheck.day) {
        const occurrenceStartDateTime = new Date(`1970-01-01T${occurrence.startHour}`)
        const occurrenceEndDateTime = new Date(`1970-01-01T${occurrence.endHour}`)

        if ((startDateTime < occurrenceEndDateTime && occurrenceStartDateTime < endDateTime) ||
            (occurrenceStartDateTime < endDateTime && startDateTime < occurrenceEndDateTime)) {
          return occurrence.id
        }
      }
    }
  }
  return undefined // Nenhuma ocorrência em conflito encontrada
}

export function resolveTimeConflict(
  occurrenceId: string,
  events: IEvent[],
  direction: "past" | "future",
  passInMinutes: number
): { resolved: boolean, events: IEvent[] } {
  const updatedEvents = [...events]

  //Resgatando o evento da ocorrência que irá ser alterada
  const eventToUpdateIndex = updatedEvents.findIndex(event => event.occurrence.some(occurrence => occurrence.id === occurrenceId))
  if (eventToUpdateIndex === -1) {
    return { resolved: false, events: updatedEvents }
  }

  // Resgatando o evento em si que será alterado
  const eventToUpdate = updatedEvents[eventToUpdateIndex]
  const occurrenceUpdateIndex = eventToUpdate.occurrence.findIndex(occurrence => occurrence.id === occurrenceId)
  if (occurrenceUpdateIndex === -1) {
    return { resolved: false, events: updatedEvents }
  }
  const occurrenceToResolve = eventToUpdate.occurrence[occurrenceUpdateIndex]

  const startDateTime = new Date(`1970-01-01T${occurrenceToResolve.startHour}`)
  const endDateTime = new Date(`1970-01-01T${occurrenceToResolve.endHour}`)

  const endDateToCompare = new Date(`1970-01-01T${occurrenceToResolve.endHour}`)

  let resolved = false

  // Attempt to resolve conflict based on direction
  while (!resolved) {
    if (direction === "past") {
      startDateTime.setMinutes(startDateTime.getMinutes() - passInMinutes)
      endDateTime.setMinutes(endDateTime.getMinutes() - passInMinutes)
    } else if (direction === "future") {
      startDateTime.setMinutes(startDateTime.getMinutes() + passInMinutes)
      endDateTime.setMinutes(endDateTime.getMinutes() + passInMinutes)
    }

    if (endDateTime.getDay() !== endDateToCompare.getDay()) {
      return { resolved: false, events }
    }

    // Checando se ainda há conflito
    const hasConflict = updatedEvents.some(event => {
      return event.occurrence.some(occurrence => {
        if (occurrence.id !== occurrenceId && occurrence.day === occurrenceToResolve.day) {
          const occurrenceStartDateTime = new Date(`1970-01-01T${occurrence.startHour}`)
          const occurrenceEndDateTime = new Date(`1970-01-01T${occurrence.endHour}`)

          console.log(occurrence.id)
          console.log(startDateTime.toTimeString().substring(0, 5), endDateTime.toTimeString().substring(0, 5))
          console.log(occurrenceStartDateTime.toTimeString().substring(0, 5), occurrenceEndDateTime.toTimeString().substring(0, 5))

          if ((startDateTime < occurrenceEndDateTime && occurrenceStartDateTime < endDateTime) ||
              (occurrenceStartDateTime < endDateTime && startDateTime < occurrenceEndDateTime)) {
            return true
          }
        }
        return false
      })
    })

    if (!hasConflict) {
      // .substring(0, 5) irá retornar apenas a hora e minuto to .toTimeString()
      occurrenceToResolve.startHour = startDateTime.toTimeString().substring(0, 5)
      occurrenceToResolve.endHour = endDateTime.toTimeString().substring(0, 5)
      resolved = true
    }
  }

  return { resolved, events: updatedEvents }
}
