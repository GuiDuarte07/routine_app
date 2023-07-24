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

export const arrayWeekDays = [
  EnumAbbreviationDays.SEGUNDA,
  EnumAbbreviationDays.TERÇA,
  EnumAbbreviationDays.QUARTA,
  EnumAbbreviationDays.QUINTA,
  EnumAbbreviationDays.SEXTA,
  EnumAbbreviationDays.SABADO,
  EnumAbbreviationDays.DOMINGO,
]

export const arrayDiasDaSemana = [
  EnumDiasDaSemanas.SEGUNDA,
  EnumDiasDaSemanas.TERÇA,
  EnumDiasDaSemanas.QUARTA,
  EnumDiasDaSemanas.QUINTA,
  EnumDiasDaSemanas.SEXTA,
  EnumDiasDaSemanas.SABADO,
  EnumDiasDaSemanas.DOMINGO,
]

export const translateToPortugueseWeekDays = {
  [EnumAbbreviationDays.SEGUNDA]: EnumDiasDaSemanas.SEGUNDA,
  [EnumAbbreviationDays.TERÇA]: EnumDiasDaSemanas.TERÇA,
  [EnumAbbreviationDays.QUARTA]: EnumDiasDaSemanas.QUARTA,
  [EnumAbbreviationDays.QUINTA]: EnumDiasDaSemanas.QUINTA,
  [EnumAbbreviationDays.SEXTA]: EnumDiasDaSemanas.SEXTA,
  [EnumAbbreviationDays.SABADO]: EnumDiasDaSemanas.SABADO,
  [EnumAbbreviationDays.DOMINGO]: EnumDiasDaSemanas.DOMINGO,
}

export const translateToAbbreviationWeekDays = {
  [EnumDiasDaSemanas.SEGUNDA]: EnumAbbreviationDays.SEGUNDA,
  [EnumDiasDaSemanas.TERÇA]: EnumAbbreviationDays.TERÇA,
  [EnumDiasDaSemanas.QUARTA]: EnumAbbreviationDays.QUARTA,
  [EnumDiasDaSemanas.QUINTA]: EnumAbbreviationDays.QUINTA,
  [EnumDiasDaSemanas.SEXTA]: EnumAbbreviationDays.SEXTA,
  [EnumDiasDaSemanas.SABADO]: EnumAbbreviationDays.SABADO,
  [EnumDiasDaSemanas.DOMINGO]: EnumAbbreviationDays.DOMINGO,
}