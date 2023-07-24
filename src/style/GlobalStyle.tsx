import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  /* Add your global styles here */
  body {
    margin: 0;
    padding: 0;
    font-family: 'Arial', sans-serif;
    background-color: #121213;
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