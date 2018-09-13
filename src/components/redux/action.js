export const OBJECTS_CANVAS_CHANGE = "OBJECTS_CANVAS_CHANGE";
export const SET_FREEHAND_DRAWING = "SET_FREEHAND_DRAWING";
export const OBJECTS_SET_CANVAS = "OBJECTS_SET_CANVAS";

export function changeObject(data) {
  return function(dispatch) {
    return dispatch({
      type: OBJECTS_CANVAS_CHANGE,
      payload: data
    });
  };
}
export function setFreeHandDrawing(value) {
  return {
    type: SET_FREEHAND_DRAWING,
    payload: value
  };
}
export function saveCanvas() {
  return (dispatch, getState) => {
    const {
      canvasObjectState: { canvasObject }
    } = getState();
    if (canvasObject) {
      localStorage.setItem("canvasData", JSON.stringify(canvasObject));
    }
  };
}

export function setCanvas(data) {
  return function(dispatch) {
    return dispatch({
      type: OBJECTS_SET_CANVAS,
      payload: data
    });
  };
}
