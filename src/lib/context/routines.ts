import { EnumAbbreviationDays, IEvent, IEventOccurrence } from "@/types/Events"
import { ErrorRoutine } from "@/utils/error"
import example from "@/utils/example.json"
import { findConflictWithOccurrence, formatHourMinute, newEventHasTimeConflict, parseHourMinute, performTimeOperation, resolveTimeConflict, routineHasOccurrenceConflict } from "@/utils/routine"
import { arrayWeekDays } from "@/utils/weakDays"
import { create } from 'zustand'

interface RoutineStates {
  routine: IEvent[]
  daysOnTable: number
  activeEditEvent: number | undefined
}

interface RoutineActions {
  addNewEvent: (event: IEvent) => void
  deleteEvent: (id: number) => void
  editEvent: (event: IEvent) => void
  changeEditEventDialog: (option: number | undefined) => void
  deleteOccurrence: (occId: string) => void
  moveEventByKey: (arrowCode: string, shift: boolean, occurrenceId: string) => void
}


export const useRoutine = create<RoutineStates & RoutineActions>((set, get) => ({
  routine: example as IEvent[], // Assuming example is an initial array of events
  daysOnTable: 7,
  activeEditEvent: undefined,
  addNewEvent: (event) => {
    if (newEventHasTimeConflict(event, get().routine)) {
      throw ErrorRoutine("CONFLICT", "Este horário já está ocupado por outro evento")
    }
    set((state) => ({
      routine: [...state.routine, event], // Add the new event to the routine array
    }))
  },
  deleteEvent: (id) =>
    set((state) => ({
      routine: state.routine.filter((event) => event.id !== id), // Filter out the event with the given id
    })),
  editEvent: (event) =>
    set((state) => ({
      routine: state.routine.map((existingEvent) =>
        existingEvent.id === event.id ? event : existingEvent // Replace the existing event with the edited event
      ),
    })),
  changeEditEventDialog(option) {
    set(() => ({activeEditEvent: option}))
  },
  deleteOccurrence: (occId) => {
    set((state) => {
      const updatedRoutine = state.routine.map((event) => {
        // Procura o evento com a ocorrência a deletar
        if (event.occurrence.some((occurrence) => occurrence.id === occId)) {
          // Remove a ocorrência que possui o occId
          return {
            ...event,
            occurrence: event.occurrence.filter((occurrence) => occurrence.id !== occId),
          }
        }
        return event // Se a ocorrência não for achada, o evento é retornado por inteiro
      })

      return { routine: updatedRoutine }
    })
  },
  moveEventByKey: (arrowCode, shift, occurrenceId) => {
    set((state) => {
      let routine = structuredClone(state.routine)
      const newEvent = routine.find(event => event.occurrence.find(occ => occ.id === occurrenceId))
      if (!newEvent) throw ErrorRoutine("NOTFOUND", "Id dessa ocorrência não foi encontrado")
      const occurence = newEvent?.occurrence.find(occ => occ.id === occurrenceId)
      if (!occurence) throw ErrorRoutine("NOTFOUND", "Id dessa ocorrência não foi encontrado")
      
      //Função para mover um evento 30 ou 60 minutos pra cima ou pra baixo
      const moveOccurrenceByMinutes = (minutes: 30 | 60, operation: "+" | "-") => {        
        const startHour = performTimeOperation(occurence.startHour, minutes, operation, true)
        const endHour = performTimeOperation(occurence.endHour, minutes, operation, true)

        if (endHour !== occurence.endHour && startHour !== occurence.startHour) {
          occurence.startHour = startHour
          occurence.endHour = endHour
        }
      }

      //Função para mover um evento de dia
      const moveToNextWeekDay = (procediment: 'prev' | 'next') => {
        const actWeekDay = occurence.day
        const dayPosition = arrayWeekDays.findIndex((day) => day === actWeekDay)

        if (procediment === 'next') {
          if (dayPosition < 6) {
            occurence.day = arrayWeekDays[dayPosition+1]
          }
        } else {
          if (dayPosition > 0) {
            occurence.day = arrayWeekDays[dayPosition-1]
          }
        }
      }

      let direction: "future" | "past"
      switch (arrowCode) {
        case 'ArrowDown':
          direction = "future"
          shift ? moveOccurrenceByMinutes(60, '+') : moveOccurrenceByMinutes(30, '+')
          break
        case 'ArrowUp':
            direction = "past"
            shift ? moveOccurrenceByMinutes(60, '-') : moveOccurrenceByMinutes(30, '-')
          break
        case 'ArrowLeft': 
          direction = "future"
          moveToNextWeekDay('prev')
          break
        case 'ArrowRight':
          direction = "future"
          moveToNextWeekDay("next")
          break
        default:
          return { state }
      }

      const conflitedOccId = findConflictWithOccurrence(occurence.id, routine)
      if (conflitedOccId) {
        const {resolved, events} = resolveTimeConflict(occurence.id, routine, direction, shift ? 60 : 30)
        if (resolved) {
          routine = events
          console.log(occurence.startHour, occurence.endHour)
        } else {
          return { state }
        }
      }

      return {
        routine: routine
      }
    })
  }
}))