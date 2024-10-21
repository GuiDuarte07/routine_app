import { useState } from 'react'
import { PlusCircle, Trash } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from '../ui/button'
import { EnumAbbreviationDays, IEventOccurrenceRequest } from '@/types/Events'
import { cn } from '@/lib/utils'


const diasSemana = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta"]
const horarios = Array.from({ length: 12 }, (_, i) => `${i + 8}:00`)
const cores: { name: string; color: string }[] = [
  { name: "red", color: "bg-red-500" },
  { name: "blue", color: "bg-blue-500" },
  { name: "green", color: "bg-green-500" },
  { name: "yellow", color: "bg-yellow-500" },
  { name: "purple", color: "bg-purple-500" },
  { name: "pink", color: "bg-pink-500" },
  { name: "orange", color: "bg-orange-500" },
  { name: "cyan", color: "bg-cyan-500" },
]


export function AddEventForm() {
  const [occurrenceList, setOccurrenceList] = useState<IEventOccurrenceRequest[]>([{}])

  const handleAddHorario = () => {
    setOccurrenceList([...occurrenceList, {}])
  }

  const handleDeleteOccurrence = (index: number) => {
    const novaLista = occurrenceList.filter((_, i) => i !== index)
    setOccurrenceList(novaLista)
  }

  const handleOccurrenceChange = (index: number, field: 'day' | 'startHour' | 'endHour', value: string | EnumAbbreviationDays) => {
    const novaLista = [...occurrenceList]
    novaLista[index][field] = value as EnumAbbreviationDays
    setOccurrenceList(novaLista)
  }

  return (
    <form className="mb-6 bg-white p-4 rounded-lg shadow">
      <div className="flex items-center gap-4">
        <div className="w-4/12">
          <Label htmlFor="cor">Cor</Label>
          <Select name="cor">
            <SelectTrigger>
              <SelectValue placeholder="Escolha uma cor" />
            </SelectTrigger>
            <SelectContent>
              {cores.map((cor) => (
                <SelectItem key={cor.color} value={cor.name}>
                  <div className="flex items-center">
                    <div className={cn('w-4 h-4 rounded-full  mr-2', cor.color)}></div>
                    {cor.name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="w-8/12">
          <Label htmlFor="descricao">Descrição</Label>
          <Input name="descricao" placeholder="Digite a descrição do compromisso" />
        </div>
      </div>

      {/* Adicionar novos horários */}
      <div className="shadow-lg ml-3 px-2 py-2 rounded-md mt-1">
        {occurrenceList.map((occurrence, index) => (
          <div key={index} className="mt-4 flex gap-4 items-center">
            <div className="w-4/12">
              <Label htmlFor={`dia-${index}`}>Dia</Label>
              <Select
                name={`dia-${index}`}
                value={occurrence.day}
                onValueChange={(value) => handleOccurrenceChange(index, 'day', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o dia" />
                </SelectTrigger>
                <SelectContent>
                  {diasSemana.map((dia) => (
                    <SelectItem key={dia} value={dia}>
                      {dia}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="w-3/12">
              <Label htmlFor={`inicio-${index}`}>Horário Início</Label>
              <Select
                name={`inicio-${index}`}
                value={occurrence.startHour}
                onValueChange={(value) => handleOccurrenceChange(index, 'startHour', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o horário" />
                </SelectTrigger>
                <SelectContent>
                  {horarios.map((hora) => (
                    <SelectItem key={hora} value={hora}>
                      {hora}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="w-3/12">
              <Label htmlFor={`fim-${index}`}>Horário Fim</Label>
              <Select
                name={`fim-${index}`}
                value={occurrence.endHour}
                onValueChange={(value) => handleOccurrenceChange(index, 'endHour', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o horário" />
                </SelectTrigger>
                <SelectContent>
                  {horarios.map((hora) => (
                    <SelectItem key={hora} value={hora}>
                      {hora}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              type="button"
              className="text-white"
              onClick={() => handleDeleteOccurrence(index)}
            >
              <Trash className="h-5 w-5" />
            </Button>
          </div>
        ))}
      </div>

      <div className="w-full flex items-center gap-6">
        <Button type="button" onClick={handleAddHorario} className="mt-4">
          <PlusCircle className="mr-2 h-4 w-4" />
          Adicionar Horário
        </Button>

        <Button type="submit" className="mt-4">
          <PlusCircle className="mr-2 h-4 w-4" />
          Adicionar Compromisso
        </Button>
      </div>
    </form>
  )
}
