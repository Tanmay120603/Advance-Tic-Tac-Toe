import { createSlice } from "@reduxjs/toolkit";

const initialState={gameMode:"",boardSize:null}

const gameOptionSlice=createSlice({name:"gameOption",initialState,reducers:{
    setGameMode(state,{payload}){
        state.gameMode=payload
    },
    setBoardSize(state,{payload}){
        state.boardSize=+payload
    }
}})

export const {setGameMode,setBoardSize}=gameOptionSlice.actions

const gameOptionReducer=gameOptionSlice.reducer

export default gameOptionReducer