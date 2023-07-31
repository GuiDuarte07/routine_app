import { useEffect } from 'react'
import { MdClear } from "react-icons/md"
import { ModalContent, ModalHeader, ModalWrapper } from './style'

interface IModal {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  title: string
}

export const Modal = ({ isOpen, onClose, children, title }: IModal) => {
  useEffect(() => {
    const escEvent = (e: KeyboardEvent) => {
      if (e.key === "Escape")
        onClose()
    }
    window.addEventListener("keydown", escEvent)
  
    return () => {
      window.removeEventListener("keydown", escEvent)
    }
  }, [onClose])

  if (!isOpen) return null

  return (
    <ModalWrapper>
      <ModalContent>
        <ModalHeader>
          <h4>{title}</h4>
          <button onClick={() => onClose()}>
            <MdClear color='white' size={28}/>
          </button>
        </ModalHeader>
        {children}
      </ModalContent>
    </ModalWrapper>
  )
}

export default Modal