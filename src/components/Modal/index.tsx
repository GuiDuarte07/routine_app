import React from 'react'
import styled from 'styled-components'
import { MdClear } from "react-icons/md";
import { ModalContent, ModalHeader, ModalWrapper } from './style';

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