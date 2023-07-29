import { IEvent } from "@/types/Events"
import { ErrorRoutine } from "@/utils/error"
import example from "@/utils/example.json"
import { hasTimeConflict } from "@/utils/routine"
import { create } from 'zustand'

interface RoutineStates {
  routine: IEvent[]
  daysOnTable: number
}

interface RoutineActions {
  addNewEvent: (event: IEvent) => void
  deleteEvent: (id: number) => void
  editEvent: (event: IEvent) => void
}


export const useRoutine = create<RoutineStates & RoutineActions>((set, get) => ({
  routine: example as IEvent[], // Assuming example is an initial array of events
  daysOnTable: 5,
  addNewEvent: (event) => {
    if (hasTimeConflict(event, get().routine)) {
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
}))