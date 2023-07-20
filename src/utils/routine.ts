//Format of startHour and endHour = 14:30
export function arrayOfSubdividedHours(hourArrays: {startHour: string, endHour: string}[]): number[] {
  const subdividedHours: number[] = []

  hourArrays.forEach(({startHour, endHour}) => {
    const [startH, startMin] = startHour.split(":")
    const [endH, endMin] = endHour.split(":")

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

  subdividedHours.sort((a, b) => a - b)

  return subdividedHours
}