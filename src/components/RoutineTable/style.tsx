import styled from 'styled-components'


interface ISize {
  width: number
  heigth: number
}

interface ITop {
  top: number
}

interface ILeft {
  left: number
}

export const TableContainer = styled.div<ISize>`
  width: ${(props) => props.width}px;
  height: ${(props) => props.heigth}px;
  position: relative;
  /* background-color: grey; */
  border: 1px solid ${props => props.theme.text};
  z-index: 1;
  box-sizing: content-box;
  padding-bottom: 20px;
`

export const TableRowHeader = styled.div<ISize & ILeft>`
  position: absolute;
  width: ${(props) => props.width}px;
  height: ${(props) => props.heigth}px;
  left: ${(props) => props.left}px;
  top: 0;
  /* background-color: rgba(241, 0, 0, 0.911); */
  display: flex;
  z-index: -1;
  /* border: 1px solid black; */
`

export const RowHeaderData = styled.div<{width: number}>`
  width: ${(props) => props.width}px;
  height: 100%;
  font-weight: bold;
  display: flex;
  justify-content: center;
  align-items: center;
  color: ${props => props.theme.text};
  /* border: 1px solid black; */
`

export const TableColHeader = styled.div<ISize & ITop>`
  position: absolute;
  width: ${(props) => props.width}px;
  height: ${(props) => props.heigth}px;
  top: ${(props) => props.top}px;
  /* background-color: rgba(0, 241, 129, 0.76); */
  /* border-right: 1px solid black; */
`

export const ColHeaderData = styled.div<{height: number}>`
  height: ${(props) => props.height}px;
  width: 100%;
  font-weight: bold;
  display: flex;
  justify-content: center;
  align-items: start;
  /* border-bottom: 1px dashed black; */
  box-sizing: border-box;
  color: ${props => props.theme.text};
  font-size: 1rem;
  line-height: 1;
  vertical-align: top;
  position: relative;
  margin: 0 4px;

  & > p {
    position: absolute;
    top: calc(-1rem /2);
    left: 0;
  }
`

export const TableDataContainer = styled.div<ISize & ITop & ILeft>`
  position: relative;
  width: ${(props) => props.width}px;
  height: ${(props) => props.heigth}px;
  top: ${(props) => props.top}px;
  left: ${(props) => props.left}px;
  /* background-color: rgba(241, 237, 0, 0.3); */
  display: flex;
`

export const TableColDataContainer = styled.div<{width: number}>`
  position: relative;
  width: ${(props) => props.width}px;
  height: 100%;
  /* background-color: rgba(76, 73, 238, 0.589); */
 /*  border: 1px solid black; */
`

export const TableEventDataCell = styled.div<{height: number} & ITop>`
  width: 95%;
  height: calc(${(props) => props.height}px + 1px);
  top: calc(${(props) => props.top}px - 1px);
  left: calc(100% - 95%);
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 3px 3px 0px 0px rgba(97, 96, 96, 0.8);
  color: ${props => props.theme.text};
  color: white;
  cursor: pointer;
  font-weight: 500;
`

export const TableDivisionLine = styled.div<{width: number, top: number}>`
  position: absolute;
  width: calc(100% - 2rem);
  top: calc(${(props) => props.top}px - 1px);
  left: 1rem;
  height: 1px;
  border-top: 1px dashed ${props => props.theme.text};
`