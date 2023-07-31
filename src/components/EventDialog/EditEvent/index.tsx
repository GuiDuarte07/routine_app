import Modal from "../../Modal"
import { useState } from "react"
import { useRoutine } from "@/lib/context/routines"
import { EditEventHasTimeConflict, formatHourMinute, hasOccurrenceConflict } from "@/utils/routine"
import { EnumAbbreviationDays, ErrorTypesRoutine, IEventOccurrence } from "@/types/Events"
import FirstStepForm from "../FirstStepModal"
import SecondStepModal from "../SecondStepModal"
import { FormContainer } from "../CreateEvent/style"

interface IEditEventModal {
  isOpen: boolean
  onClose: () => void
  idEvent: number
}

export const EditEventModal = ({ isOpen, onClose, idEvent }: IEditEventModal) => {
  const routines = useRoutine(state => state.routine)
  const event = routines.find(({id}) => id === idEvent)

  if (!event) throw new Error()
  
  const [step, setStep] = useState<0 | 1>(0)

  const [title, setTitle] = useState(event.title)
  const [color, setColor] = useState(event.color)

  const [startHour, setStartHour] = useState("10")
  const [startMinute, setStartMinute] = useState("00")
  const [endHour, setEndHour] = useState("10")
  const [endMinute, setEndMinute] = useState("30")
  const [weekDay, setWeekDay] = useState<EnumAbbreviationDays>(EnumAbbreviationDays.SEGUNDA)

  const [hours, setHours] = useState<IEventOccurrence[]>(event.occurrence)

  const [errorMessage, setErrorMessage] = useState("")

  const editEvent = useRoutine(state => state.editEvent)

  function nextStep() {
    errorMessage && setErrorMessage("")
    if (title.length < 3) {
      setErrorMessage("O evento precisa ter um nome com pelo menos 3 digítos")
      return
    }
    setStep(1)
  }

  function newHour() {
    errorMessage && setErrorMessage("")

    const newEventOccurrences = structuredClone(hours)

    newEventOccurrences.push({day: weekDay, startHour: formatHourMinute(startHour, startMinute), endHour: formatHourMinute(endHour, endMinute), id: newEventOccurrences.length.toString()})

    const hasConflict = EditEventHasTimeConflict({title, color, id: event?.id as number, occurrence: newEventOccurrences}, routines)
    console.log(hasConflict)

    if (hasConflict) {
      setErrorMessage("Esse horário e dia conflita com horários da sua rotina")
      return
    }

    const newOccurrence = {day: weekDay, startHour: formatHourMinute(startHour, startMinute), endHour: formatHourMinute(endHour, endMinute), id: newEventOccurrences.length.toString()}

    if (hasOccurrenceConflict(newOccurrence, hours)) {
      setErrorMessage("Este horário conflita com os demais já inseridos")
      return
    }
    setHours(prev => ([...prev, newOccurrence]))
  }

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    try {
      editEvent({
        id: event?.id as number,
        title,
        color,
        occurrence: hours
      })

      onClose()
    } catch (error: any) {
      console.error(error.cause, error.message)
      if (error.cause === "CONFLIT" as ErrorTypesRoutine) {
        setErrorMessage("Este horário conflita com os demais já inseridos")
      }
    } 
  }

  return (
    <Modal title="Editar Evento" isOpen={isOpen} onClose={onClose}>
      <FormContainer onSubmit={onSubmit}>
        {step === 0 && 
          <FirstStepForm 
            title={title} 
            setTitle={setTitle}
            color={color}
            setColor={setColor}
            errorMessage={errorMessage}
            nextStep={nextStep}
          />
        }
        {step === 1 && 
          <SecondStepModal
            title={title}
            color={color}
            startHour={startHour}
            startMinute={startMinute}
            setStartHour={setStartHour}
            setStartMinute={setStartMinute}
            endHour={endHour}
            endMinute={endMinute}
            setEndHour={setEndHour}
            setEndMinute={setEndMinute}
            hours={hours}
            newHour={newHour}
            setStep={setStep}
            weekDay={weekDay}
            setWeekDay={setWeekDay}
            setHours={setHours}
          />
        }
      </FormContainer>
    </Modal>
  )
}
