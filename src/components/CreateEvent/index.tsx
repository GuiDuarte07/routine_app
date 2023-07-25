import { styled } from "styled-components"
import Modal from "../Modal"
import HourPicker from "../HourPicker"
import WeekdayPicker from "../DayPicker"
import { FormContainer, InputText, PrimaryButton, SecundaryButton } from "./style"
import { useState } from "react"
import { useRoutine } from "@/lib/context/routines"
import { MdOutlineKeyboardBackspace } from "react-icons/md"
import { TiDelete } from "react-icons/ti"
import { formatHourMinute } from "@/utils/routine"
import { EnumDiasDaSemanas, IHourEvent } from "@/types/Events"

interface ICreateEvent {
  isOpen: boolean
  onClose: () => void
}

export const CreateEvent = ({ isOpen, onClose }: ICreateEvent) => {
  const [step, setStep] = useState<0 | 1>(1)

  const [title, setTitle] = useState("")
  const [color, setColor] = useState("#FFFFFF")

  const [startHour, setStartHour] = useState("10")
  const [startMinute, setStartMinue] = useState("00")
  const [endHour, setEndHour] = useState("10")
  const [endMinute, setEndMinute] = useState("30")
  const [weekDay, setWeekDay] = useState<EnumDiasDaSemanas>(EnumDiasDaSemanas.SEGUNDA)

  const [hours, setHours] = useState<IHourEvent[]>([])

  const newEvent = useRoutine(state => state.addNewEvent)

  function newHour() {

    setHours(prev => ([...prev, {day: weekDay, startHour: formatHourMinute(startHour, startMinute), endHour: formatHourMinute(endHour, endMinute)}]))
  }

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    /* NEED TO REBUILD */
    /* try {
      newEvent({
        id: Math.ceil(Math.random() * 10000),
        day: translateToAbbreviationWeekDays[weekDay],
        startHour: `${startHour}:${startMinute}`,
        endHour: `${endHour}:${endMinute}`,
        title
      })
    } catch (error: any) {
      console.error(error.cause, error.message)
    } */

  }

  return (
    <Modal title="Criar novo evento" isOpen={isOpen} onClose={onClose}>
      <FormContainer onSubmit={onSubmit}>
        {step === 0 && <> 
          <label htmlFor="eventName">
            Nome do evento
          </label>
          <InputText value={title} onChange={(e) => setTitle(e.target.value)} id="eventName" />
          <label htmlFor="colorName">
            Cor do evento
          </label>
          <input type="color" value={color} onChange={(e) => setColor(e.target.value)}/>
          <PrimaryButton onClick={() => setStep(1)}>Próximo</PrimaryButton>
        </>
        }

        {step === 1 && <>
            <h3>Nome do evento: <span style={{color: color}}>{title}</span></h3>
            <h4 className="ml-2">Insira horários para esse evento</h4>
            <div className="flex flex-col ml-1 bg-slate-900 p-2 rounded mb-2">
              <label htmlFor="startHour">
                Horário de início
              </label>
              <HourPicker selectedHour={startHour} selectedMinute={startMinute} setSelectedHour={setStartHour} setSelectedMinute={setStartMinue} />

              <label htmlFor="endHour">
                Horário de fim
              </label>
              <HourPicker selectedHour={endHour} selectedMinute={endMinute} setSelectedHour={setEndHour} setSelectedMinute={setEndMinute} />

              <div className="flex w-full py-2 justify-between items-end">
                <div>
                  <label htmlFor="weekDay">
                  Dia da semana
                </label>
                <WeekdayPicker selectWeekday={weekDay} setSelectWeekday={setWeekDay} />
                </div>
                <button className="p-2 rounded text-white bg-slate-600 text-sm cursor-pointer">
                  Confirmar
                </button>
              </div>
            </div>

            <div style={{gridTemplateColumns: "10px 1fr"}} className="grid">
              {hours.length ? <div className="w-8 h-full border-l-2 border-y-2 border-black border-solid"></div> : <div></div>}
              <div className="py-1">
                {hours?.map(({day, startHour, endHour}) => 
                  <div className="ml-2 flex justify-between items-center py-1" key={day+startHour+endHour}>
                    <p className="text-base">
                    <span>{day}</span> : <span>{startHour}</span> - <span>{endHour}</span>
                    </p>
                    <button type="button" className="cursor-pointer "><TiDelete size={18} className="text-red-600 bg-white rounded"/></button>
                  </div>
                )}
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <SecundaryButton type="button" onClick={() => setStep(0)}>
                <MdOutlineKeyboardBackspace size={16} /> Voltar
                </SecundaryButton>
              <PrimaryButton type="submit" onClick={newHour}>Criar</PrimaryButton>
            </div>
          </>
        }
      </FormContainer>
    </Modal>
  )
}
