
type ObjectOfSubdividedHours = {
  subdividedHours: number[];
  firtHour: number;
  lastHour: number;
}
//Format of startHour and endHour = 14:30
export function objectOfSubdividedHours(hourArrays: {startHour: string, endHour: string}[]): ObjectOfSubdividedHours {
  const subdividedHours: number[] = []
  let firtHour: number = Infinity
  let lastHour: number = -Infinity
  let haveMidnight: boolean = false

  hourArrays.forEach(({startHour, endHour}) => {
    const [startH, startMin] = startHour.split(":")
    const [endH, endMin] = endHour.split(":")

    if (startH === "00" || endH === "00") {
      haveMidnight = true
    }

    if (firtHour === undefined) {
      firtHour = Number(startH)
    } else if (firtHour > Number(startH)) {
      firtHour = Number(startH)
    }

    if (lastHour === undefined) {
      lastHour = Number(endH)
    } else if (lastHour < Number(endH)) {
      lastHour = Number(endH)
    }

    if (startMin === "30") {
      if (!subdividedHours.find(hour => hour === Number(startH))) {
        subdividedHours.push(Number(startH))
      }
    }
    if (endMin === "30") {
      if (!subdividedHours.find(hour => hour === Number(endH))) {
        subdividedHours.push(Number(endH))
      }
    }
  })

  lastHour += 1

  if (haveMidnight || lastHour === 24) {
    lastHour = 0
  }

  subdividedHours.sort((a, b) => a - b)

  return {subdividedHours, firtHour, lastHour}
}

import example from "@/utils/example.json"
console.log(objectOfSubdividedHours(example.map(event => ({endHour: event.endHour, startHour: event.startHour}))))