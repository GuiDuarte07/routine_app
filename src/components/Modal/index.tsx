import React from 'react'
import styled from 'styled-components'
import { MdClear } from "react-icons/md";

const ModalWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5); /* Semi-transparent black background */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
`

const ModalContent = styled.div`
  min-width: 480px;
  background-color: white;
  border-radius: 5px;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.3);
  z-index: 999;
`

const ModalHeader = styled.header`
  height: 64px;
  width: 100%;
  background-color: rgb(39,187,229);
  font-weight: bold;
  font-size: 1.3em;
  text-align: start;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 12px;
  color: white;
`

interface IModal {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  title: string
}

export const Modal = ({ isOpen, onClose, children, title }: IModal) => {
  if (!isOpen) return null;

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
  );
};

export default Modal;