import React, { useState } from 'react'
import { SelectHour } from '../HourPicker/style'
import { EnumDiasDaSemanas, arrayDiasDaSemana } from '@/utils/weakDays'

interface IWeekdayPicker {
  selectWeekday: string
  setSelectWeekday: React.Dispatch<React.SetStateAction<EnumDiasDaSemanas>>
}
const WeekdayPicker = ({selectWeekday, setSelectWeekday}:IWeekdayPicker) => {
  const handleDayChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectWeekday(e.target.value as EnumDiasDaSemanas)
  }

  return (
    <div>
      <SelectHour value={selectWeekday} onChange={handleDayChange}>
        {arrayDiasDaSemana.map((day) => (
          <option key={day} value={day}>
            {day}
          </option>
        ))}
      </SelectHour>
    </div>
  )
}

export default WeekdayPicker