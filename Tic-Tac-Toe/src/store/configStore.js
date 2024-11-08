import {configureStore} from "@reduxjs/toolkit"
import gameOptionReducer from "./gameOptionSlice"

export const store=configureStore({reducer:{
    gameOptionReducer
}})
