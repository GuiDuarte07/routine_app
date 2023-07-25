export enum EnumDiasDaSemanas {
  SEGUNDA = "Segunda-Feira",
  TERÇA = "Terça-Feira",
  QUARTA = "Quarta-Feira",
  QUINTA = "Quinta-Feira",
  SEXTA = "Sexta-Feira",
  SABADO = "Sabádo",
  DOMINGO = "Domingo",
}

export enum EnumAbbreviationDays {
  SEGUNDA = "mon",
  TERÇA = "tues",
  QUARTA = "wed",
  QUINTA = "thurs",
  SEXTA = "fri",
  SABADO = "sat",
  DOMINGO = "sun",
}

export interface IHourEvent {
  startHour: string
  endHour: string
  day: EnumDiasDaSemanas
}

export interface IEventOccurrence {
  id: string
  day: string
  startHour: string
  endHour: string
}

export interface IEvent {
  id: number
  title: string
  color: string
  occurrence: IEventOccurrence[]
}