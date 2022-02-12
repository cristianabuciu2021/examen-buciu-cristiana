import { combineReducers } from 'redux'
import astronaut from './astronaut-reducer'
import spacecraft from './spacecraft-reducer'

export default combineReducers({
    astronaut,
    spacecraft
})
