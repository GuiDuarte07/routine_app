import { createGlobalStyle } from 'styled-components'

export const lightTheme = {
  body: '#FFF',
  text: '#363537',
  toggleBorder: '#FFF',
  background: '#363537',
}

export const darkTheme = {
  body: '#363537',
  text: '#FAFAFA',
  toggleBorder: '#6B8096',
  background: '#999',
}


const GlobalStyles = createGlobalStyle`
  /* Add your global styles here */
  body {
    background: ${({ theme }) => theme.body};
    color: ${({ theme }) => theme.text};
    font-family: Tahoma, Helvetica, Arial, Roboto, sans-serif;
    transition: all 0.50s linear;
    margin: 0;
    padding: 0;
    /* font-family: 'Arial', sans-serif;
    background-color: #121213; */
    /* Add other global styles as needed */
  }

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  
  button,
  input {
  border: 0;
  padding: 0;
  background-color: inherit;
  cursor: pointer;
  outline: none;
}

  /* Add more global styles if necessary */
`;

export default GlobalStyles;