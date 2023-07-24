import { styled } from "styled-components"

export const ModalWrapper = styled.div`
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

export const ModalContent = styled.div`
  min-width: 480px;
  background-color: ${props => props.theme.body};
  border-radius: 5px;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.3);
  z-index: 999;
`

export const ModalHeader = styled.header`
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