export function startDragMove(element: HTMLElement) {
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

    /* const shiftX = event.clientX - element.getBoundingClientRect().left - containerElement.getBoundingClientRect().left
    const shiftY = event.clientY - element.getBoundingClientRect().top - containerElement.getBoundingClientRect().top */

    //Como o width é relativo no elemento de evento, guardei a informação do tamanho dele e quando dei append no elemento container, redefini o tamanho para que possa ter o mesmo que antes.
    const width = element.offsetWidth
    containerElement.append(element)
    element.style.width = width+'px'

    //Função que move o top e left baseado na posição do mouse retirando a poção de tamanho onde começa o elemento container
    function moveAt(pageX: number, pageY: number) {
      let topMove = pageY - containerY
      if (topMove < 0) topMove = 0
      if (topMove > (containerHeight - elementHeight)) {
        topMove = containerHeight - elementHeight
      }
      let leftMove = pageX - containerX
      if (leftMove < 0) leftMove = 0
      if (leftMove > (containerWidth - elementWidth)) {
        leftMove = containerWidth - elementWidth
      }
      element.style.top = topMove + 'px'
      element.style.left = leftMove + 'px'
    }
    
    //Definindo a posição inicial do elemento (irá ficar na ponta do mouse)
    moveAt(event.pageX, event.pageY)

    function onMouseMove(event: MouseEvent) {
      div.innerHTML = `${event.pageX - containerX}, ${event.pageY - containerY}`
      const { pageX, pageY } = event
      moveAt(event.pageX, event.pageY)
      //Primeiro verificar se o mouse está dentro do container, depois mover
      /* if (pageX > containerX && pageY > containerY && pageX < (containerX + containerWidth - elementWidth) && pageY < (containerY + containerHeight - elementWidth)) {
       
      } */
    }

    // ativando a função de mousemove no document
    document.addEventListener('mousemove', onMouseMove)

    // removendo a função de mousemove no mouseup e lógica de finalização
    element.onmouseup = function() {
      document.removeEventListener('mousemove', onMouseMove)
      element.onmouseup = null
    }
  }
}