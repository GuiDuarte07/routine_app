import Modal from "../../Modal"
import { FormContainer } from "./style"
import { useState } from "react"
import { useRoutine } from "@/lib/context/routines"
import { formatHourMinute, hasOccurrenceConflict, hasTimeConflict } from "@/utils/routine"
import { EnumDiasDaSemanas, ErrorTypesRoutine, IHourEvent } from "@/types/Events"
import { translateToAbbreviationWeekDays } from "@/utils/weakDays"
import FirstStepForm from "../FirstStepModal"
import SecondStepModal from "../SecondStepModal"

interface ICreateEvent {
  isOpen: boolean
  onClose: () => void
}

export const CreateEvent = ({ isOpen, onClose }: ICreateEvent) => {
  const [step, setStep] = useState<0 | 1>(0)

  const [title, setTitle] = useState("")
  const [color, setColor] = useState("#FFFFFF")

  const [startHour, setStartHour] = useState("10")
  const [startMinute, setStartMinute] = useState("00")
  const [endHour, setEndHour] = useState("10")
  const [endMinute, setEndMinute] = useState("30")
  const [weekDay, setWeekDay] = useState<EnumDiasDaSemanas>(EnumDiasDaSemanas.SEGUNDA)

  const routines = useRoutine(state => state.routine)

  const [hours, setHours] = useState<IHourEvent[]>([])

  const [errorMessage, setErrorMessage] = useState("")

  const newEvent = useRoutine(state => state.addNewEvent)

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
    const newOccurrence = {day: weekDay, startHour: formatHourMinute(startHour, startMinute), endHour: formatHourMinute(endHour, endMinute)}

    if (hasOccurrenceConflict(newOccurrence, hours)) {
      setErrorMessage("Este horário conflita com os demais já inseridos")
      return
    }

    const newEventOccurrences = hours.map(({startHour, endHour, day}, i) => ({startHour, endHour, day: translateToAbbreviationWeekDays[day], id: i.toString()}))

    newEventOccurrences.push({day: translateToAbbreviationWeekDays[weekDay], startHour: formatHourMinute(startHour, startMinute), endHour: formatHourMinute(endHour, endMinute), id: newEventOccurrences.length.toString()})

    const hasConflict = hasTimeConflict({title, color, id: 0, occurrence: newEventOccurrences}, routines)

    if (hasConflict) {
      setErrorMessage("Esse horário e dia conflita com horários da sua rotina")
      return
    }
    setHours(prev => ([...prev, newOccurrence]))
  }

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const eventOccurrences = hours.map(({startHour, endHour, day}, i) => ({startHour, endHour, day: translateToAbbreviationWeekDays[day], id: i.toString()}))
    try {
      newEvent({
        id: Math.ceil(Math.random() * 10000),
        title,
        color,
        occurrence: eventOccurrences
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
    <Modal title="Criar novo evento" isOpen={isOpen} onClose={onClose}>
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
          />
        }
      </FormContainer>
    </Modal>
  )
}
