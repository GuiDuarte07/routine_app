import { IEvent } from "@/types/Events"
import { ErrorRoutine } from "@/utils/error"
import example from "@/utils/example.json"
import { newEventHasTimeConflict } from "@/utils/routine"
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
}


export const useRoutine = create<RoutineStates & RoutineActions>((set, get) => ({
  routine: example as IEvent[], // Assuming example is an initial array of events
  daysOnTable: 5,
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
}))