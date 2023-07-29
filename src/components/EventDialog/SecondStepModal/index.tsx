import WeekdayPicker from '@/components/DayPicker'
import HourPicker from '@/components/HourPicker'
import { EnumAbbreviationDays, IEventOccurrence } from '@/types/Events'
import React, { Dispatch, SetStateAction } from 'react'
import { PrimaryButton, SecundaryButton } from '../CreateEvent/style'
import { MdOutlineKeyboardBackspace } from 'react-icons/md'
import { TiDelete } from 'react-icons/ti'

interface ISecondStepModal {
  color: string
  title: string
  startHour: string
  setStartHour: Dispatch<SetStateAction<string>>
  startMinute: string
  setStartMinute: Dispatch<SetStateAction<string>>
  endHour: string
  setEndHour: Dispatch<SetStateAction<string>>
  endMinute: string
  setEndMinute: Dispatch<SetStateAction<string>>
  weekDay: EnumAbbreviationDays
  setWeekDay: Dispatch<SetStateAction<EnumAbbreviationDays>>
  newHour: () => void
  hours: IEventOccurrence[]
  setStep: Dispatch<SetStateAction<0 | 1>>
}

function SecondStepModal({color, title, startHour, startMinute, setStartHour, setStartMinute, endHour, endMinute, setEndHour, setEndMinute, hours, newHour, weekDay, setWeekDay, setStep}: ISecondStepModal) {
  return (
    <>
      <h3>Nome do evento: <span style={{ color: color }}>{title}</span></h3>
      <h4 className="ml-2">Insira horários para esse evento</h4>
      <div className="flex flex-col ml-1 bg-slate-900 p-2 rounded mb-2">
        <label htmlFor="startHour">
          Horário de início
        </label>
        <HourPicker selectedHour={startHour} selectedMinute={startMinute} setSelectedHour={setStartHour} setSelectedMinute={setStartMinute} />

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
          <button type="button" onClick={newHour} className="p-2 rounded text-white bg-slate-600 text-sm cursor-pointer">
            Confirmar
          </button>
        </div>
      </div>

      <div style={{ gridTemplateColumns: "10px 1fr" }} className="grid">
        {hours.length ? <div className="w-8 h-full border-l-2 border-y-2 border-black border-solid"></div> : <div></div>}
        <div className="py-1">
          {hours?.map(({ day, startHour, endHour }) =>
            <div className="ml-2 flex justify-between items-center py-1" key={day + startHour + endHour}>
              <p className="text-base">
                <span>{day}</span> : <span>{startHour}</span> - <span>{endHour}</span>
              </p>
              <button type="button" className="cursor-pointer "><TiDelete size={18} className="text-red-600 bg-white rounded" /></button>
            </div>
          )}
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <SecundaryButton type="button" onClick={() => setStep(0)}>
          <MdOutlineKeyboardBackspace size={16} /> Voltar
        </SecundaryButton>
        <PrimaryButton type="submit">Criar</PrimaryButton>
      </div>
    </>
  )
}

export default SecondStepModal