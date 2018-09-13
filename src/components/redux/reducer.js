import {
    OBJECTS_CANVAS_CHANGE,
    SET_FREEHAND_DRAWING,
    OBJECTS_SET_CANVAS
  } from "./action";
  Object.assign = Object.assign || require("object-assign");
  
  const initialState = {
    canvasObject: null
  };
  
  export default function(state = initialState, action) {
    switch (action.type) {
      case OBJECTS_CANVAS_CHANGE:
        return Object.assign({}, state, {
          canvasObject: action.payload.canvasObject,
          // selectedObject: action.payload.selectedObject
        });
      case OBJECTS_SET_CANVAS:
        return Object.assign({}, state, {
          canvasObject: action.payload,
        });
      case SET_FREEHAND_DRAWING:
        let canvasObject = { ...state.canvasObject };
        canvasObject.isDrawingMode = action.payload;
        return {
          ...state,
          canvasObject
        };
      default:
        return state;
    }
  }
  