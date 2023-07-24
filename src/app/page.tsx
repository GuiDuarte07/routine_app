'use client'
import { RoutineTable } from "@/components/RoutineTable"
import "@/utils/routine"
import { PlusButton } from "./style"
import PlusIcon from "../../public/icons/plus-svgrepo-com.svg"
import Image from "next/image"
import { useState } from "react"
import Modal from "@/components/RoutineTable/Modal"
import { CreateEvent } from "@/components/CreateEvent"

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };
  return (
      <>
      <CreateEvent isOpen={isModalOpen} onClose={closeModal}/>
      <main style={{margin: "100px 0", display: "flex", alignItems: "center", justifyContent: "center", height: "100%"}}>
          <RoutineTable width={1100} heigth={1200}/>
          <PlusButton onClick={() => openModal()}><Image src={PlusIcon} alt="Novo Evento" width={30} height={30} /></PlusButton>
      </main>
      </>
  )
}
