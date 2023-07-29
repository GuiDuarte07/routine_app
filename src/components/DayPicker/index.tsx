import { SelectHour } from '../HourPicker/style'
import { arrayDiasDaSemana, translateToAbbreviationWeekDays } from '@/utils/weakDays'
import { EnumAbbreviationDays, EnumDiasDaSemanas } from '@/types/Events'

interface IWeekdayPicker {
  selectWeekday: string
  setSelectWeekday: React.Dispatch<React.SetStateAction<EnumAbbreviationDays>>
}
const WeekdayPicker = ({selectWeekday, setSelectWeekday}:IWeekdayPicker) => {
  const handleDayChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectWeekday(translateToAbbreviationWeekDays[(e.target.value as EnumDiasDaSemanas)])
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