import example from "@/utils/example.json"
import { create } from 'zustand'

interface Event {
  title: string;
  day: string;
  startHour: string;
  endHour: string;
}

interface Routine {
  routine: Event[]
}
const useStore = create<Routine>((set) => ({
  routine: example
}))

export default useStore