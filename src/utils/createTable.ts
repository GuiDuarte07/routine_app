import { parseHourMinute } from "./routine"

interface ICalculeEventDimensions {
  startHour: string, 
  endHour: string, 
  firstOfhours: string, 
  heightOfHalfHour: number
}

interface ReturnCalculeEventDimensions {
  topStart: number
  heightOfEvent: number
}

export function calculeEventDimensions({startHour, endHour, firstOfhours, heightOfHalfHour}: ICalculeEventDimensions): ReturnCalculeEventDimensions {
  const {hour: startH, minute: startM} = parseHourMinute(startHour)
  const {hour: endH, minute: endM} = parseHourMinute(endHour)
  const {hour: firstArrayH, minute: firstArrayM} = parseHourMinute(firstOfhours)
  let qntOfHalfHour = (endH - startH) * 2
  
  if(startM === 30) qntOfHalfHour -= 1
  if(endM === 30) qntOfHalfHour += 1

  const heightOfEvent = qntOfHalfHour * heightOfHalfHour

  let heightTopStartEvent = (startH - firstArrayH) * 2

  if(firstArrayM === 0 && startM === 30) {
    heightTopStartEvent++
  }

  if(firstArrayM === 30 && startM === 0) {
    heightTopStartEvent--
  }
  
  const topStart = heightTopStartEvent * heightOfHalfHour

  return {topStart, heightOfEvent}
}