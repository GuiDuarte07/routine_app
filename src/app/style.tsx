import { keyframes, styled } from "styled-components"

const rotateAnimation = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(90deg);
  }
`

export const PlusButton = styled.button`
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: #007bff;
  color: white;
  font-size: 24px;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);

  &:hover {
    animation: ${rotateAnimation} 0.2s both;
  }
`

export const PlusIcon = styled.span`
  position: relative;
  top: -2px;
`