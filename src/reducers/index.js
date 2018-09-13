// Set up your root reducer here...
import { combineReducers } from "redux";
import canvasObjectReducer from "../components/redux/reducer";

const rootReducer = combineReducers({
  canvasObjectState: canvasObjectReducer
});

export default rootReducer;
