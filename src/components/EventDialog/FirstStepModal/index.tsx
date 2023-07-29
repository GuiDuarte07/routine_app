import React, { Dispatch, SetStateAction } from 'react'
import { InputText, PrimaryButton } from '../CreateEvent/style'

interface IFirstStepForm {
  title: string
  setTitle: Dispatch<SetStateAction<string>>
  errorMessage: string
  color: string
  setColor: Dispatch<SetStateAction<string>>
  nextStep: () => void
}

function FirstStepForm({title, setTitle, errorMessage, color, setColor, nextStep}: IFirstStepForm) {
  return (
    <> 
      <label htmlFor="eventName">
        Nome do evento
      </label>
      <InputText value={title} onChange={(e) => setTitle(e.target.value)} id="eventName" />
      <label htmlFor="colorName">
        Cor do evento
      </label>
      <input type="color" value={color} onChange={(e) => setColor(e.target.value)}/>

      {errorMessage && <p className="text-red-500 font-bold text-sm my-2">{errorMessage}</p>}

      <PrimaryButton type="button" onClick={nextStep}>Próximo</PrimaryButton>
    </>
  )
}

export default FirstStepForm