import { Event } from "@/lib/context/routines";

export function parseHourMinute(time: string): { hour: number; minute: number } {
  const [hourStr, minuteStr] = time.split(":");
  return { hour: parseInt(hourStr), minute: parseInt(minuteStr) };
}

function formatHourMinute(hour: number, minute: number): string {
  const hourStr = hour.toString().padStart(2, "0");
  const minuteStr = minute.toString().padStart(2, "0");
  return `${hourStr}:${minuteStr}`;
}

function compareTimes(time1: string, time2: string): number {
  const { hour: hour1, minute: minute1 } = parseHourMinute(time1);
  const { hour: hour2, minute: minute2 } = parseHourMinute(time2);

  if (hour1 === hour2) {
    return minute1 - minute2;
  }

  return hour1 - hour2;
}

function findBiggestHour(hour1: string, hour2: string): string {
  return compareTimes(hour1, hour2) > 0 ? hour1 : hour2;
}

export function generateHourArray(hoursArray: { startHour: string; endHour: string }[]): string[] {
  if (hoursArray.length === 0) {
    throw new Error("The array must not be empty.");
  }

  const result: string[] = [];
  let minHour: string = hoursArray[0].startHour;
  let maxHour: string = hoursArray[0].endHour;
  
  for (let hour of hoursArray) {
    minHour = findBiggestHour(hour.startHour, minHour) === minHour ? hour.startHour : minHour
    maxHour = findBiggestHour(hour.endHour, maxHour)
  }

  let currentHour = minHour;

  while (result[result.length - 1] !== maxHour) {
    result.push(currentHour);

    const { hour, minute } = parseHourMinute(currentHour);
    // Increment by half an hour
    if (minute < 30) {
      currentHour = formatHourMinute(hour, minute + 30);
    } else {
      currentHour = formatHourMinute(hour + 1, 0);
    }
  }

  console.log(result)

  return result;
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