import { styled } from "styled-components"
import Modal from "../Modal"
import HourPicker from "../HourPicker";
import WeekdayPicker from "../DayPicker";
import { FormContainer, InputText, PrimaryButton } from "./style";
import { useState } from "react";
import { useRoutine } from "@/lib/context/routines";
import { EnumDiasDaSemanas, translateToAbbreviationWeekDays } from "@/utils/weakDays";

interface ICreateEvent {
  isOpen: boolean
  onClose: () => void
}

export const CreateEvent = ({isOpen, onClose}: ICreateEvent) => {
  const [title, setTitle] = useState("")
  const [startHour, setStartHour] = useState("10")
  const [startMinute, setStartMinue] = useState("00")
  const [endHour, setEndHour] = useState("10")
  const [endMinute, setEndMinute] = useState("30")
  const [weekDay, setWeekDay] = useState<EnumDiasDaSemanas>(EnumDiasDaSemanas.SEGUNDA)

  const newEvent = useRoutine(state => state.addNewEvent)

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault() 
    
    try {
      newEvent({
        id: Math.ceil(Math.random()*10000),
        day: translateToAbbreviationWeekDays[weekDay],
        startHour: `${startHour}:${startMinute}`,
        endHour: `${endHour}:${endMinute}`,
        title
      })
    } catch(error: any) {
      console.error(error.cause, error.message)
    }
    
  }

  return (
    <Modal title="Criar novo evento" isOpen={isOpen} onClose={onClose}>
      <FormContainer onSubmit={onSubmit}>
        <label htmlFor="eventName">
          Nome do evento
        </label>
        <InputText value={title} onChange={(e) => setTitle(e.target.value)} id="eventName"/>

        <label htmlFor="startHour">
          Horário de início
        </label>
        <HourPicker selectedHour={startHour} selectedMinute={startMinute} setSelectedHour={setStartHour} setSelectedMinute={setStartMinue}/>

        <label htmlFor="endHour">
          Horário de fim
        </label>
        <HourPicker selectedHour={endHour} selectedMinute={endMinute} setSelectedHour={setEndHour} setSelectedMinute={setEndMinute}/>
        
        <label>
          Dia da semana
        </label>
        <WeekdayPicker selectWeekday={weekDay} setSelectWeekday={setWeekDay}/>

        <div style={{display: "flex", justifyContent: "end"}}>
          <PrimaryButton type="submit">Criar</PrimaryButton>
        </div>
      </FormContainer>
    </Modal>
  )
}
