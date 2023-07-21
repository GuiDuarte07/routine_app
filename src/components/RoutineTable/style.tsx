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
  background-color: grey;
`

export const TableRowHeader = styled.div<ISize & ILeft>`
  position: absolute;
  width: ${(props) => props.width}px;
  height: ${(props) => props.heigth}px;
  left: ${(props) => props.left}px;
  top: 0;
  background-color: rgba(241, 0, 0, 0.3);
  display: flex;
  border: 1px solid black;
`

export const RowHeaderData = styled.div<{width: number}>`
  width: ${(props) => props.width}px;
  height: 100%;
  color: white;
  font-weight: bold;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid black;
`

export const TableColHeader = styled.div<ISize & ITop>`
  position: absolute;
  width: ${(props) => props.width}px;
  height: ${(props) => props.heigth}px;
  top: ${(props) => props.top}px;
  background-color: rgba(0, 241, 129, 0.3);
  border: 1px solid black;
`

export const ColHeaderData = styled.div<{height: number}>`
  height: ${(props) => props.height}px;
  width: 100%;
  font-weight: bold;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid black;
`

export const TableDataContainer = styled.div<ISize & ITop & ILeft>`
  position: relative;
  width: ${(props) => props.width}px;
  height: ${(props) => props.heigth}px;
  top: ${(props) => props.top}px;
  left: ${(props) => props.left}px;
  background-color: rgba(241, 237, 0, 0.3);
`