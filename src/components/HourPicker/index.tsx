
import { ChangeEvent } from "react"
import { SelectHour } from "./style"

interface IHourPicker {
  selectedHour: string
  setSelectedHour: React.Dispatch<React.SetStateAction<string>>
  selectedMinute: string
  setSelectedMinute: React.Dispatch<React.SetStateAction<string>>
}

const HourPicker = ({ selectedHour, setSelectedHour, selectedMinute, setSelectedMinute }: IHourPicker) => {
  const handleHourChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedHour(e.target.value)
  }

  const handleMinuteChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedMinute(e.target.value)
  }

  // Generate time options for hours with half and full hour intervals
  const hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'))
  const minutes = ['00', '30']

  return (
    <div>
      <SelectHour value={selectedHour} onChange={(e) => handleHourChange(e)}>
        {hours.map((hour) => (
          <option key={hour} value={hour}>
            {hour}
          </option>
        ))}
      </SelectHour>
      :
      <SelectHour value={selectedMinute} onChange={handleMinuteChange}>
        {minutes.map((minute) => (
          <option key={minute} value={minute}>
            {minute}
          </option>
        ))}
      </SelectHour>
    </div>
  )
}

export default HourPicker