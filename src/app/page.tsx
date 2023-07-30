'use client'
import { RoutineTable } from "@/components/RoutineTable"
import "@/utils/routine"
import { PlusButton } from "./style"
import PlusIcon from "../../public/icons/plus-svgrepo-com.svg"
import Image from "next/image"
import { useState } from "react"
import { CreateEvent } from "@/components/EventDialog/CreateEvent"
import { useRoutine } from "@/lib/context/routines"
import { EditEventModal } from "@/components/EventDialog/EditEvent"

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const activeEditEvent = useRoutine(state => state.activeEditEvent)
  const changeEditEventDialog = useRoutine(state => state.changeEditEventDialog)

  const openModal = () => {
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
  }
  return (
      <>
      {isModalOpen && <CreateEvent isOpen={isModalOpen} onClose={closeModal}/>}
      {activeEditEvent && <EditEventModal idEvent={activeEditEvent} isOpen={true} onClose={() => changeEditEventDialog(undefined)} />}
      <main style={{margin: "100px 0", display: "flex", alignItems: "center", justifyContent: "center", height: "100%"}}>
          <RoutineTable width={1100} heigth={1200}/>
          <PlusButton onClick={() => openModal()}><Image src={PlusIcon} alt="Novo Evento" width={30} height={30} /></PlusButton>
      </main>
      </>
  )
}
