import example from "@/utils/example.json"
import { create } from 'zustand'

export interface Event {
  id: number;
  title: string;
  day: string;
  startHour: string;
  endHour: string;
}

interface RoutineStates {
  routine: Event[]
}

interface RoutineActions {
  addNewEvent: (event: Event) => void
  deleteEvent: (id: number) => void
  editEvent: (event: Event) => void
}


const useStore = create<RoutineStates & RoutineActions>((set) => ({
  routine: example, // Assuming example is an initial array of events
  addNewEvent: (event) =>
    set((state) => ({
      routine: [...state.routine, event], // Add the new event to the routine array
    })),
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

export default useStore