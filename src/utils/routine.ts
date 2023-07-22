
import { Event } from "@/lib/context/routines"

//Format of startHour and endHour = 14:30
//Retorna um array com as horas que terá a tabela (a repitição de uma hora significa que ele será dividido em meia hora + meia hora)
export function eventToHourArray(hourArrays: {startHour: string, endHour: string}[]): number[] {
  const subdividedHours: number[] = []
  let firtHour: number = 24
  let lastHour: number = 0

  hourArrays.forEach(({startHour, endHour}) => {
    const [startH, startMin] = startHour.split(":").map(value => Number(value))
    const [endH, endMin] = endHour.split(":").map(value => Number(value))

    if (firtHour > startH) firtHour = startH
    if (lastHour < endH) lastHour = endH

    if (startMin === 30) {
      if (!subdividedHours.find(hour => hour === startH)) {
        subdividedHours.push(startH)
      }
    }
    if (endMin === 30) {
      if (!subdividedHours.find(hour => hour === endH)) {
        subdividedHours.push(endH)
      }
    }
  })

  const defaultHours: number[] = []

  for (let i = firtHour; i < lastHour; i++) {
   defaultHours.push(i) 
  }

  const allArray = [...subdividedHours, ...defaultHours]
  allArray.sort((a, b) => a - b)

  if (allArray[allArray.length-1] === lastHour) allArray.push(lastHour)

  return allArray
}

//retorna true se o novo evento conflita com os demais
export function hasTimeConflict(event: Event, events: Event[]): boolean {
  const startTimeEvent = new Date(`1970-01-01T${event.startHour}`)
  const endTimeEvent = new Date(`1970-01-01T${event.endHour}`)

  for (const otherEvent of events) {
    if (otherEvent !== event && otherEvent.day === event.day) {
      const startTimeOther = new Date(`1970-01-01T${otherEvent.startHour}`)
      const endTimeOther = new Date(`1970-01-01T${otherEvent.endHour}`)

      if (
        (startTimeEvent <= endTimeOther && startTimeOther <= endTimeEvent) ||
        (startTimeOther <= endTimeEvent && startTimeEvent <= endTimeOther)
      ) {
        return true
      }
    }
  }

  return false 
}

export function filterRepeatedNumbers(array: number[]): number[] {
  // Create a new Set to store unique numbers
  const uniqueNumbers = new Set();

  // Create a new array to store the filtered numbers
  const filteredArray = [];

  for (const number of array) {
    // Check if the number is already in the Set
    if (!uniqueNumbers.has(number)) {
      // If it's not in the Set, add it to both the Set and the filteredArray
      uniqueNumbers.add(number);
      filteredArray.push(number);
    }
  }

  return filteredArray;
}