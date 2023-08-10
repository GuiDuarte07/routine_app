import { IEventOccurrence } from "@/types/Events"
import { AvailableSpaces, dayOfWeekBasedOnLeft, isInsideAvailableSpace } from "./eventSize"
import { parseHourMinute } from "./routine"

export type DragEventFunction = (top: number, left: number, avaliableDimension: AvailableSpaces | undefined) => void

export function startDragMove(element: HTMLElement, draggedOccurrence: IEventOccurrence,  availableSpaces: AvailableSpaces[], onDragEnd: DragEventFunction, executeDragMove: boolean) {
  element.ondragstart = function () {
    return false
  }

  element.onmousedown = function (event) {
    //provisorio 
    const div = document.createElement("div")
    div.style.position = "fixed"
    div.style.width = "200px"
    div.style.height = "50px"
    div.style.top = "10px"
    div.style.left = "10px"
    div.style.zIndex= "323213212132"
    document.body.append(div)

    const containerElement = element.parentElement?.parentElement as HTMLElement

    const containerX = containerElement.getBoundingClientRect().x
    const containerY = containerElement.getBoundingClientRect().y
    const containerWidth = containerElement.getBoundingClientRect().width
    const containerHeight = containerElement.getBoundingClientRect().height

    const elementWidth = element.getBoundingClientRect().width
    const elementHeight = element.getBoundingClientRect().height


    //Como o width é relativo no elemento de evento, guardei a informação do tamanho dele e quando dei append no elemento container, redefini o tamanho para que possa ter o mesmo que antes.
    const width = element.offsetWidth
    const height = element.offsetHeight
    containerElement.append(element)
    element.style.width = width+'px'

    //Função que move o top e left baseado na posição do mouse retirando a poção de tamanho onde começa o elemento container
    function moveAt(pageX: number, pageY: number) {
      let topMove = pageY
      if (topMove < 0) topMove = 0
      if (topMove > (containerHeight - elementHeight)) {
        topMove = containerHeight - elementHeight
      }
      let leftMove = pageX
      if (leftMove < 0) leftMove = 0
      if (leftMove > (containerWidth - elementWidth)) {
        leftMove = containerWidth - elementWidth
      }
      element.style.top = topMove + 'px'
      element.style.left = leftMove + 'px'
    }
    
    //Definindo a posição inicial do elemento (irá ficar na ponta do mouse)
    moveAt(event.pageX - containerX, event.pageY - containerY)

    let insideAvailableArea = isInsideAvailableSpace(event.pageX, event.pageY, availableSpaces)

    function previewElementCreate(availableSpaces: AvailableSpaces[]) {
      const previewElement = document.createElement("div")
      previewElement.className = "absolute w-full bg-slate-300 z-[9999]"
      previewElement.style.width = width + "px"
      previewElement.style.height = height + "px"
      previewElement.style.zIndex = "99999"

      const {hour: startH, minute: startM} = parseHourMinute(draggedOccurrence.startHour)
      const {hour: endH, minute: endM} = parseHourMinute(draggedOccurrence.endHour)
      const heightOfHalfHour = height / ((endH - startH) * 2 + (endM - startM) / 30)

      return function movePreviewElement(xpos: number, ypos: number) {
        if (containerElement.contains(previewElement)) {
          containerElement.removeChild(previewElement)
        }
        previewElement.style.top = ypos + "px"
        previewElement.style.left = Math.floor(xpos / heightOfHalfHour)*heightOfHalfHour + "px"
        //tava trabalhando aqui
        /* console.log(Math.floor(xpos))
        console.log(Math.floor(xpos / heightOfHalfHour)) */
        containerElement.append(previewElement)
      }
    }

    const movePreviewElement = previewElementCreate(availableSpaces)

    function onMouseMove(event: MouseEvent) {
      const { pageX, pageY } = event
      const [xpos, ypos] = [pageX - containerX, pageY - containerY]

      div.innerHTML = `${xpos}, ${ypos}`

      moveAt(xpos, ypos)
      insideAvailableArea = isInsideAvailableSpace(xpos, ypos, availableSpaces)
      if (executeDragMove) {
        movePreviewElement(xpos, ypos)
      }
    }

    // ativando a função de mousemove no document
    document.addEventListener('mousemove', onMouseMove)

    // removendo a função de mousemove no mouseup e lógica de finalização
    element.onmouseup = function(event) {
      const { pageX, pageY } = event
      const [xpos, ypos] = [pageX - containerX, pageY - containerY]
      insideAvailableArea = isInsideAvailableSpace(xpos, ypos, availableSpaces)
      document.removeEventListener('mousemove', onMouseMove)
      element.onmouseup = null
      onDragEnd(xpos, ypos, insideAvailableArea)
    }
  }
}