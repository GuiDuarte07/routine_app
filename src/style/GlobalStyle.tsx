import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  /* Add your global styles here */
  body {
    margin: 0;
    padding: 0;
    font-family: 'Arial', sans-serif;
    /* Add other global styles as needed */
  }

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  /* Add more global styles if necessary */
`;

export default GlobalStyles;