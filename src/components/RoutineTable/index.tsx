'use client'
import { useRoutine } from '@/lib/context/routines'
import {
  extractHoursFromEvents,
  generateHourArray,
  transformEventsToArray,
} from '@/utils/routine'
import { translateToPortugueseWeekDays, arrayWeekDays } from '@/utils/weakDays'
import { useMemo, useState, useRef, useEffect } from 'react'
import { BiEdit, BiMove, BiCheck } from 'react-icons/bi'
import { AiOutlineDelete } from 'react-icons/ai'
import { MdDragIndicator } from 'react-icons/md'
import { calculeEventDimensions } from '@/utils/createTable'
import { useMoveByArrow } from '@/hooks/RoutineTable/moveByArrow'

interface IDimension {
  width: number | null;
  height: number | null;
}

export const RoutineTable = () => {
  const [render, setRender] = useState(false)

  const routines = useRoutine((state) => state.routine)
  const daysOnTable = useRoutine((state) => state.daysOnTable)
  const deleteOccurrence = useRoutine((state) => state.deleteOccurrence)
  const changeEditEventDialog = useRoutine(
    (state) => state.changeEditEventDialog,
  )

  const containerRef = useRef<HTMLDivElement>(null) // Referência ao elemento HTML
  const [dimensions, setDimensions] = useState<IDimension>({
    width: null,
    height: null,
  })

  console.log(dimensions)

  useEffect(() => {
    console.log(containerRef.current)

    if (containerRef.current) {
      const { width, height } = containerRef.current.getBoundingClientRect()
      setDimensions({ width, height })
      setRender(true)
    }
  }, [containerRef, render])

  const arrayOfHours = useMemo(
    () => generateHourArray(extractHoursFromEvents(routines)),
    [routines],
  )

  const widthOfColHeader = dimensions.width ? dimensions.width * 0.1 : 0
  const heightOfRowHeader = dimensions.height ? dimensions.height * 0.06 : 0

  const widthOfEachCell = dimensions.width
    ? (dimensions.width - widthOfColHeader) / daysOnTable
    : 0
  const heightOfHalfHour = dimensions.height
    ? (dimensions.height - heightOfRowHeader) / arrayOfHours.length
    : 0

  const [mouseHoverId, setMouseHoverId] = useState<undefined | string>(
    undefined,
  )
  const mouseOutTimer = useRef<NodeJS.Timeout>()

  function addOptionsOnMouseIn(id: string) {
    if (mouseOutTimer.current) {
      clearTimeout(mouseOutTimer.current)
      mouseOutTimer.current = undefined
    }

    setMouseHoverId(id)
  }

  function removeOptionsOnMouseOut() {
    mouseOutTimer.current = setTimeout(() => setMouseHoverId(undefined), 500)
  }

  const eventDataCellContainerRef = useRef<HTMLElement>(null)

  const {
    moveByArrowDataCellId,
    confirmMoveByArrowPress,
    startMoveByArrowOccurrence,
  } = useMoveByArrow()

  return render ? (
    <div ref={containerRef} className="w-full h-full relative z-1 box-content pb-5">
      <div
        className="top-0 absolute flex z-[1]"
        style={{
          left: widthOfColHeader,
          height: heightOfRowHeader,
          width: (dimensions.width ?? 0) - widthOfColHeader,
        }}
      >
        {arrayWeekDays.slice(0, daysOnTable).map((day) => (
          <div
            className="h-full font-bold flex justify-center items-center"
            style={{ width: widthOfEachCell }}
            key={`w-${day}`}
            id={`w-${day}`}
          >
            <span className='text-gray-700 font-semibold text-base'>{translateToPortugueseWeekDays[day]}</span>
          </div>
        ))}
      </div>


      {/* Coluna dos horários */}
      <div
        className="absolute"
        style={{
          height: (dimensions.height ?? 0) - heightOfRowHeader,
          top: heightOfRowHeader,
          width: widthOfColHeader,
        }}
      >
        {arrayOfHours.map((hour, i) => {
          if (!arrayOfHours[i + 1]) return null
          return (
            <div
              key={`c-${hour}`}
              style={{ height: heightOfHalfHour }}
              className="font-bold flex justify-center items-start border-box relative text-base leading-none align-top mx-1"
            >
              <p className="absolute" style={{ top: '-0.5rem', left: 0 }}>
                {hour}{/*  - {arrayOfHours[i + 1]} */}
              </p>
            </div>
          )
        })}
      </div>

      <div
        className="absolute flex"
        style={{
          height: (dimensions.height ?? 0) - heightOfRowHeader,
          width: (dimensions.width ?? 0) - widthOfColHeader,
          top: heightOfRowHeader,
          left: widthOfColHeader,
        }}
      >
        {/* Linhas */}
        {arrayOfHours.map((hour, i) => {
          /* routines?.flatMap(({ occurrence }) => {
            occurrence
          }) */
          return (
            <div
              key={`l-${hour}`}
              className="absolute left-4 border-gray-400 border-t border-dashed"
              style={{
                width: `calc(${(dimensions.width ?? 0) - widthOfColHeader}px - 2rem)`,
                top: `calc(${heightOfHalfHour * i}px - 1px)`,
                height: '1px',
              }}
            ></div>
          )
        })}

        {/* LISTA DE EVENTOS */}
        {arrayWeekDays.slice(0, daysOnTable).map((dayTag) => (
          <div
            className="relative h-full"
            style={{ width: widthOfEachCell }}
            key={`cc-${dayTag}`}
            id={`cc-${dayTag}`}
          >
            {/* Eventos */}
            {transformEventsToArray(routines)
              .filter(({ day }) => day === dayTag)
              .map(({ eventId, id, title, endHour, startHour, color }) => {
                const { heightOfEvent, topStart } = calculeEventDimensions({
                  startHour,
                  endHour,
                  heightOfHalfHour,
                  firstOfhours: arrayOfHours[0],
                })
                return (
                  <section
                    {...(moveByArrowDataCellId === id && {
                      ref: eventDataCellContainerRef,
                    })}
                    key={id}
                    id={id}
                    className="absolute w-[95%] left-[5%] p-1 shadow-[3px_3px_0px_0px_rgba(97,96,96,0.8)]"
                    style={{
                      height: `calc(${heightOfEvent}px + 1px)`,
                      top: `calc(${topStart}px - 1px)`,
                      backgroundColor: color,
                    }}
                    {...(!moveByArrowDataCellId && {
                      onMouseEnter: () => addOptionsOnMouseIn(id),
                      onMouseLeave: removeOptionsOnMouseOut,
                    })}
                  >
                    <div className="w-full h-full flex items-start justify-start text-white cursor-pointer font-medium overflow-hidden text-ellipsis">
                      <div>
                        <h3>{`${title}`}</h3>
                        <p>{`${startHour} - ${endHour}`}</p>
                      </div>
                    </div>
                    {mouseHoverId === id &&
                      moveByArrowDataCellId === undefined && (
                        <div className="flex flex-col items-center justify-start absolute top-0 right-0 mr-[-32px] min-h-[50px] w-[30px] bg-[#0088ff] z-[9999]">
                          <button
                            onClick={() => changeEditEventDialog(eventId)}
                            type="button"
                            className="flex items-center justify-center py-2 w-full hover:bg-blue-600"
                          >
                            <BiEdit aria-label="Editar" />
                          </button>
                          <button
                            onClick={() => id}
                            type="button"
                            className="flex items-center justify-center py-2 w-full hover:bg-blue-600"
                          >
                            <MdDragIndicator />
                          </button>
                          <button
                            onClick={() => startMoveByArrowOccurrence(id)}
                            type="button"
                            className="flex items-center justify-center py-2 w-full hover:bg-blue-600"
                          >
                            <BiMove />
                          </button>
                          <button
                            onClick={() => deleteOccurrence(id)}
                            type="button"
                            className="flex items-center justify-center py-2 w-full hover:bg-blue-600"
                          >
                            <AiOutlineDelete />
                          </button>
                        </div>
                      )}

                    {mouseHoverId === id && moveByArrowDataCellId === id && (
                      <div className="flex flex-col items-center justify-start bg-green-700 absolute top-0 right-[-45px] w-[40px] z-[99999]">
                        <button
                          onClick={() => confirmMoveByArrowPress()}
                          type="button"
                          className="flex items-center justify-center w-full py-2 hover:bg-green-800"
                        >
                          <BiCheck size={'24px'} />
                        </button>
                      </div>
                    )}
                  </section>
                )
              })}
          </div>
        ))}
      </div>
    </div>
  ) : <div ref={containerRef} className="h-full w-full">loading...</div>
}

/* const draggedOccurrence = routines.flatMap((routine) => routine.occurrence).find((occurrence) => occurrence.id === moveByArrowDataCellId)
      if (!draggedOccurrence) return

      const onMouseDragEnd: DragEventFunction = (top, left, avaliableDimension) => {
        console.log("finalizou!")
      }

      const elementsAvailable = getAvailableSpaces({
        daysOnTable, 
        dayWidth: widthOfEachCell, 
        draggedOccurrence,
        startDayHour: arrayOfHours[0],
        endDayHour: arrayOfHours[arrayOfHours.length - 1],
        heightOfHalfHour,
        routines
      })
      startDragMove(
        eventDataCellContainerRef.current as HTMLElement,
        draggedOccurrence,
        elementsAvailable,
        onMouseDragEnd,
        true
      )*/
