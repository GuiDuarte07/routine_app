import { styled } from "styled-components"

export const InputText = styled.input`
  background-color: black;
  width: 100%;
  height: 40px;
  border-radius: 6px;
  box-shadow: 4px 2px 3px 0px rgba(97, 96, 96, 0.8);
  padding-left: 8px;
  font-size: 1rem;
`

export const FormContainer = styled.form`
  width: 90%;
  margin: 10px 0 10px 10px;
  display: flex;
  flex-direction: column;
  gap: 8px;

  > label {
    font-weight: bold;/* 
    margin-bottom: 4px; */
  }
`

export const PrimaryButton = styled.button`
  background-color: rgb(39,187,229);
  padding: 16px 24px;
  color: white;
  font-weight: bold;
  border-radius: 4px;
`

export const SecundaryButton = styled.button`
  color: rgb(229, 59, 39);
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: start;
  padding-bottom: 1px;
  border-bottom: 1px solid rgb(229, 59, 39);
  gap: 6px;
`