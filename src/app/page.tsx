"use client"

import { Button } from "@/components/ui/button"

import { Calendar, Settings, PlusCircle, User, LogOut } from "lucide-react"
import { RoutineTable } from "@/components/RoutineTable"
import { AddEventForm } from "@/components/AddEventForm"

export default function WeekPlanner() {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md">
        <div className="p-4">
          <h1 className="text-2xl font-bold mb-4">Weekly Planning</h1>
          <nav className="space-y-2">
            <Button variant="ghost" className="w-full justify-start">
              <Calendar className="mr-2 h-4 w-4" />
              Calendário
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <Settings className="mr-2 h-4 w-4" />
              Configurações
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <User className="mr-2 h-4 w-4" />
              Perfil
            </Button>
          </nav>
        </div>
        <div className="absolute bottom-4 left-4">
          <Button variant="ghost" className="text-red-500">
            <LogOut className="mr-2 h-4 w-4" />
            Sair
          </Button>
        </div>
      </aside>

      {/* Conteúdo Principal */}
      <main className="flex-1 p-8">
        <h2 className="text-3xl font-bold mb-6">Planejamento Semanal</h2>

        {/* Formulário para adicionar compromisso */}
        <AddEventForm></AddEventForm>

        {/* Calendário Semanal */}
        <div className="bg-white p-4 rounded-lg shadow overflow-x-auto w-full h-full">
          <RoutineTable></RoutineTable>
        </div>
      </main>
    </div>
  )
}