// File Imports
import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import "react-input-range/lib/css/index.css";
import InputRange from "react-input-range";
import { CanvasContainer } from "./FabricCanvas";
// import ShowCase from "../../../showcase_fabric/showcase";
import { getColorHexOrImage } from "../utils/getColorHex";
import { changeObject } from "./redux/action";
import Col from 'react-bootstrap/lib/Col';
import Tabs from 'react-bootstrap/lib/Tabs';
import Tab from 'react-bootstrap/lib/Tab';
import Button from 'react-bootstrap/lib/Button';
import DropdownButton from 'react-bootstrap/lib/DropdownButton';
import MenuItem from 'react-bootstrap/lib/MenuItem';
import Modal from 'react-bootstrap/lib/Modal';
import lodashFind from 'lodash/find';
import { arrayMove} from 'react-sortable-hoc';
import {SortableItem,SortableList} from './sortableList'
import { ChromePicker } from "react-color";
// import './App.css';
var FontAwesome = require("react-fontawesome");
// var Radium = require("radium");

let canvasScale = 1;
const SCALE_FACTOR = 1.06;
var gfabricInstance = null;
const styles = {
  swatch: {
    padding: "0px",
    marginTop: "0px",
    background: "#fff",
    borderRadius: "5px",
    boxShadow: "0px 0px 10px lightgrey",
    display: "inline-block",
    cursor: "pointer"
  },
  popover: {
    position: "absolute",
    zIndex: "2"
  },
  cover: {
    position: "fixed",
    top: "0px",
    right: "0px",
    bottom: "0px",
    left: "0px"
  }
};

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function mobileCheck() {
  var check = false;
  (function(a) {
    if (
      /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(
        a
      ) ||
      /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
        a.substr(0, 4)
      )
    )
      check = true;
  })(navigator.userAgent || navigator.vendor || window.opera);
  return check;
}

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activeProperty: null,
      newObj: null,
      bgColor: "#ffffff",
      selectedObject: false,
      height: 0,
      ready: false,
      hexOrImage: {},
      objectList: [],
      activeObjectIndex: -1,
      rectDimensions: { height: 0, width: 0 },
      shadowColor: "#aaaaaa",
      shadowOffsetX: 1,
      shadowOffsetY: 1,
      blurRadius: 1,
      borderWidth: 0,
      borderStyle: "none",
      borderColor: "#aaaaaa",
      gradientStartColor: "#ff0000",
      gradientStopColor: "#ffff00",
      gradientType: "solid",
      dimension:{},
      items: ['Item 1', 'Item 2', 'Item 3', 'Item 4', 'Item 5', 'Item 6'],
    };
    this.addBox = this.addBox.bind(this);
    this.addBoxWithBorderNoBac = this.addBoxWithBorderNoBac.bind(this);
    this.addBoxWithBorderAndBac = this.addBoxWithBorderAndBac.bind(this);
    this.addBoxRound = this.addBoxRound.bind(this);
    this.addBoxRoundWithBorderNoBac = this.addBoxRoundWithBorderNoBac.bind(
      this
    );
    this.addBoxRoundWithBorderAndBac = this.addBoxRoundWithBorderAndBac.bind(
      this
    );
    this.addCircle = this.addCircle.bind(this);
    this.addTriangleBorder = this.addTriangleBorder.bind(this);
    this.addTriangleBac = this.addTriangleBac.bind(this);
    this.addTriangleFull = this.addTriangleFull.bind(this);
    this.addHalfArcSolid = this.addHalfArcSolid.bind(this);
    this.addHalfArcDashed = this.addHalfArcDashed.bind(this);
    this.addHalfArcDesign = this.addHalfArcDesign.bind(this);
    this.addHalfArcSolidThick = this.addHalfArcSolidThick.bind(this);
    this.addHalfArcDashedThick = this.addHalfArcDashedThick.bind(this);
    this.addHalfArcDesignThick = this.addHalfArcDesignThick.bind(this);
    this.addHalfArcSolidFull = this.addHalfArcSolidFull.bind(this);
    this.addHalfArcDashedFull = this.addHalfArcDashedFull.bind(this);
    this.addHalfArcDesignFull = this.addHalfArcDesignFull.bind(this);
    this.addStarBac = this.addStarBac.bind(this);
    this.addStarBorder = this.addStarBorder.bind(this);
    this.addStarFull = this.addStarFull.bind(this);
    this.addTextThreeTemplate = this.addTextThreeTemplate.bind(this);
    this.addTextTwoTemplate = this.addTextTwoTemplate.bind(this);
    this.addTextSideTemplate = this.addTextSideTemplate.bind(this);
    this.onSyncWarning = this.onSyncWarning.bind(this);
    this.onSave = this.onSave.bind(this);
    this.getDimensions = this.getDimensions.bind(this);
    this.onHandleShowCaseChange = this.onHandleShowCaseChange.bind(this);
  }

  componentDidMount() {
    let height = document.getElementById("reference").offsetHeight;
    if (mobileCheck()) {
      height = document.getElementsByClassName("reference-class")[0]
        .offsetHeight;
    }
    this.setState({ height, ready: true },()=> this.getDimensions());
    // if(localStorage.getItem('canvasObject')){
    //   this.setState({objectList:JSON.parse(localStorage.getItem('canvasObject'))});
    // }
    if (this.props.canvasData) {
      this.setState({ objectList: this.props.canvasData });
    }
    let canvasContainerDiv=document.getElementsByClassName('full-canvas-container')
    // canvasContainerDiv[0].addEventListener('click',(e)=>{
    //   if(canvasContainerDiv[0]!==e.target){
    //     return
    //   }
    //   this.setState({activeObjectIndex:-1})
    // })
    // canvasContainerDiv[1].addEventListener('click',(e)=>{
    //   if(canvasContainerDiv[1]!==e.target){
    //     return
    //   }
    //   this.setState({activeObjectIndex:-1})
    // })
    // document.getElementById('canvas-next-btn').addEventListener('click',(e)=>{
    //   this.setState({activeObjectIndex:-1})
    // })
    // document.getElementById('canvas-save-btn').addEventListener('click',(e)=>{
    //   this.setState({activeObjectIndex:-1})
    // })
   
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.canvasData !== this.props.canvasData) {
      this.setState({ objectList: nextProps.canvasData });
    }
  }

  onSave(onlySave) {}

  saveToCanvas = () => {
    let link = document.createElement("a");
    link.href = this.fabricCanvas.toDataURL({ format: "png" });
    link.download = "image.png";
    link.click();
  };

  onSyncWarning() {}

  getRandomInt = getRandomInt;
  getRandomColor = () => {
    var getRandomInt = getRandomInt;
    function pad(str, length) {
      while (str.length < length) {
        str = "0" + str;
      }
      return str;
    }
    return (
      pad(getRandomInt(0, 255).toString(16), 2) +
      pad(getRandomInt(0, 255).toString(16), 2) +
      pad(getRandomInt(0, 255).toString(16), 2)
    );
  };
  setActiveObject = index => {
    if (index >= 0) {
      let enableFontStyle =
        this.state.objectList[index].type === "text" ? true : false;
      this.setState({ activeObjectIndex: index, enableFontStyle }, () => {
        if (this.state.objectList[index].style.boxShadow) {
          const [
            shadowOffsetX,
            shadowOffsetY,
            blurRadius,
            shadowColor
          ] = this.state.objectList[index].style.boxShadow.split(" ");
          this.setState({
            shadowOffsetX: shadowOffsetX.split("px")[0],
            shadowOffsetY: shadowOffsetY.split("px")[0],
            blurRadius: blurRadius.split("px")[0],
            shadowColor
          });
        }
        if (this.state.objectList[index].style.border) {
          const [borderWidth, borderStyle, borderColor] = this.state.objectList[
            index
          ].style.border.split(" ");
          this.setState({
            borderWidth: borderWidth.split("px")[0],
            borderStyle,
            borderColor
          });
        }
        if (
          this.state.objectList[index].style.background &&
          this.state.objectList[index].style.background.includes("gradient")
        ) {
          const [gradientType, str] = this.state.objectList[
            index
          ].style.background.split("-");
          const [gradientStartColor, gradientStopColor] = str
            .substring(str.indexOf("(") + 1, str.indexOf(")"))
            .split(",");
          this.setState({
            gradientType: gradientType.trim(),
            gradientStartColor: gradientStartColor.trim(),
            gradientStopColor: gradientStopColor.trim()
          });
        } else {
          this.setState({
            gradientType: "solid",
            gradientStartColor: "#ff0000",
            gradientStopColor: "#ffff00"
          });
        }
      });
    } else {
      this.setState({ activeObjectIndex: -1 });
    }
  };
  backgroundColorChange = newColor => {
    let objectList = Object.assign([], this.state.objectList);
    objectList[this.state.activeObjectIndex].style.backgroundColor =
      newColor.hex;
    this.setState({ objectList });
  };
  fontColorChange = fontColor => {
    let objectList = Object.assign([], this.state.objectList);
    objectList[this.state.activeObjectIndex].style.color = fontColor.hex;
    this.setState({ objectList });
  };
  cornerRadiusChange = cornerRadius => {
    let objectList = Object.assign([], this.state.objectList);
    objectList[this.state.activeObjectIndex].style.borderradius =
      cornerRadius.hex;
    this.setState({ objectList });
  };
  onStyleChange = (propertyName, value) => {
    let objectList = Object.assign([], this.state.objectList);
    if (objectList[this.state.activeObjectIndex].objectType === "composite") {
      let selectedObject = objectList[this.state.activeObjectIndex];
      for (var key in selectedObject) {
        if (
          typeof selectedObject[key] === "object" &&
          selectedObject[key].id === this.state.selectedContentDiv
        ) {
          selectedObject[key].style[propertyName] = value;
        }
      }
    } else {
      objectList[this.state.activeObjectIndex].style[propertyName] = value;
    }
    this.setState({ objectList, [propertyName]: value });
  };
  onViewChange = value => {
    if (this.state.isMobileCanvas !== value) {
      this.setState({ isMobileCanvas: value });
    }
  };
  setGradient = gradientType => {
    this.setState({ gradientType }, () => {
      this.onStyleChange(
        "background",
        `${gradientType}-gradient(${this.state.gradientStartColor},${
          this.state.gradientStopColor
        })`
      );
    });
  };
  addBox = () => {
    let objectList = Object.assign([], this.state.objectList);

    objectList.push({
      id: this.getRandomInt(1, 1000),
      type: "rect",
      position: { x: 50, y: 40, width: "150px", height: "150px" },
      style: { backgroundColor: "lightgrey" }
    });
    this.setState({ objectList });
  };
  addBoxWithBorderNoBac = () => {
    let objectList = Object.assign([], this.state.objectList);

    objectList.push({
      id: this.getRandomInt(1, 1000),
      type: "rect",
      position: { x: 50, y: 40, width: "150px", height: "150px" },
      style: { backgroundColor: "transparent", border: "5px solid grey" }
    });
    this.setState({ objectList });
  };
  addBoxWithBorderAndBac = () => {
    let objectList = Object.assign([], this.state.objectList);

    objectList.push({
      id: this.getRandomInt(1, 1000),
      type: "rect",
      position: { x: 50, y: 40 },
      style: { backgroundColor: "lightgrey", border: "5px solid grey" }
    });
    this.setState({ objectList });
  };
  addBoxRound = () => {
    let objectList = Object.assign([], this.state.objectList);

    objectList.push({
      id: this.getRandomInt(1, 1000),
      type: "rect",
      position: { x: 50, y: 40 },
      style: { backgroundColor: "lightgrey", borderRadius: "10px" }
    });
    this.setState({ objectList });
  };
  addBoxRoundWithBorderNoBac = () => {
    let objectList = Object.assign([], this.state.objectList);

    objectList.push({
      id: this.getRandomInt(1, 1000),
      type: "rect",
      position: { x: 50, y: 40 },
      style: {
        backgroundColor: "transparent",
        border: "5px solid grey",
        borderRadius: "10px"
      }
    });
    this.setState({ objectList });
  };
  addBoxRoundWithBorderAndBac = () => {
    let objectList = Object.assign([], this.state.objectList);

    objectList.push({
      id: this.getRandomInt(1, 1000),
      type: "rect",
      position: { x: 50, y: 40 },
      style: {
        backgroundColor: "lightgrey",
        border: "5px solid grey",
        borderRadius: "10px"
      }
    });
    this.setState({ objectList });
  };
  addCircle = () => {
    let objectList = Object.assign([], this.state.objectList);

    objectList.push({
      id: this.getRandomInt(1, 1000),
      type: "circle",
      position: { x: 100, y: 40 },
      style: {
        backgroundColor: "lightgrey",
        border: "0px solid grey",
        borderRadius: "50%"
      }
    });
    this.setState({ objectList });
  };
  addCircleWithBorderNoBac = () => {
    let objectList = Object.assign([], this.state.objectList);

    objectList.push({
      id: this.getRandomInt(1, 1000),
      type: "circle",
      position: { x: 100, y: 40 },
      style: {
        backgroundColor: "transparent",
        border: "5px solid grey",
        borderRadius: "50%"
      }
    });
    this.setState({ objectList });
  };
  addCircleWithBorderAndBac = () => {
    let objectList = Object.assign([], this.state.objectList);
    objectList.push({
      id: this.getRandomInt(1, 1000),
      type: "circle",
      position: { x: 100, y: 40 },
      style: {
        backgroundColor: "lightgrey",
        border: "5px solid grey",
        borderRadius: "50%"
      }
    });
    this.setState({ objectList });
  };
  addTriangleBorder = () => {
    let objectList = Object.assign([], this.state.objectList);
    objectList.push({
      id: this.getRandomInt(1, 1000),
      isSVG: true,
      type: "triangle",
      position: { x: 100, y: 40 },
      style: { fill: "transparent", stroke: "grey", strokeWidth: "5px" }
    });
    this.setState({ objectList });
  };
  addTriangleBac = () => {
    let objectList = Object.assign([], this.state.objectList);
    objectList.push({
      id: this.getRandomInt(1, 1000),
      isSVG: true,
      type: "triangle",
      position: { x: 100, y: 40 },
      style: { fill: "lightgrey", stroke: "transparent", strokeWidth: "5px" }
    });
    this.setState({ objectList });
  };
  addTriangleFull = () => {
    let objectList = Object.assign([], this.state.objectList);
    objectList.push({
      id: this.getRandomInt(1, 1000),
      type: "triangle",
      isSVG: true,
      position: { x: 100, y: 40 },
      style: { fill: "lightgrey", stroke: "grey", strokeWidth: "5px" }
    });
    this.setState({ objectList });
  };
  addStarFull = () => {
    let objectList = Object.assign([], this.state.objectList);

    objectList.push({
      id: this.getRandomInt(1, 1000),
      type: "star",
      position: { x: 100, y: 40 },
      style: { fill: "lightgrey", stroke: "grey", strokeWidth: "5px" }
    });
    this.setState({ objectList });
  };
  addStarBac = () => {
    let objectList = Object.assign([], this.state.objectList);

    objectList.push({
      id: this.getRandomInt(1, 1000),
      type: "star",
      position: { x: 100, y: 40 },
      style: { fill: "lightgrey", stroke: "transparent", strokeWidth: "5px" }
    });
    this.setState({ objectList });
  };
  addStarBorder = () => {
    let objectList = Object.assign([], this.state.objectList);

    objectList.push({
      id: this.getRandomInt(1, 1000),
      type: "star",
      position: { x: 100, y: 40 },
      style: { fill: "transparent", stroke: "grey", strokeWidth: "5px" }
    });
    this.setState({ objectList });
  };
  addHalfArcSolid = () => {
    let objectList = Object.assign([], this.state.objectList);

    objectList.push({
      id: this.getRandomInt(1, 1000),
      type: "halfArc",
      position: { x: 100, y: 40, height: 80, width: 200 },
      style: { fill: "transparent", stroke: "grey", strokeWidth: "2px" }
    });
    this.setState({ objectList });
  };
  addHalfArcDashed = () => {
    let objectList = Object.assign([], this.state.objectList);

    objectList.push({
      id: this.getRandomInt(1, 1000),
      type: "halfArc",
      position: { x: 100, y: 40, height: 80, width: 200 },
      style: {
        fill: "transparent",
        stroke: "grey",
        strokeWidth: "2px",
        strokeDasharray: "2px",
        strokeDashoffset: "0px"
      }
    });
    this.setState({ objectList });
  };
  addHalfArcDesign = () => {
    let objectList = Object.assign([], this.state.objectList);

    objectList.push({
      id: this.getRandomInt(1, 1000),
      type: "halfArc",
      position: { x: 100, y: 40, height: 80, width: 200 },
      style: {
        fill: "transparent",
        stroke: "grey",
        strokeWidth: "2px",
        strokeDasharray: "3px",
        strokeDashoffset: "5px"
      }
    });
    this.setState({ objectList });
  };

  addHalfArcSolidThick = () => {
    let objectList = Object.assign([], this.state.objectList);

    objectList.push({
      id: this.getRandomInt(1, 1000),
      type: "halfArc",
      position: { x: 100, y: 40, height: 80, width: 200 },
      style: {
        fill: "transparent",
        stroke: "grey",
        strokeWidth: "4px",
        strokeDasharray: "0px",
        strokeDashoffset: "0px"
      }
    });
    this.setState({ objectList });
  };
  addHalfArcDashedThick = () => {
    let objectList = Object.assign([], this.state.objectList);

    objectList.push({
      id: this.getRandomInt(1, 1000),
      type: "halfArc",
      position: { x: 100, y: 40, height: 80, width: 200 },
      style: {
        fill: "transparent",
        stroke: "grey",
        strokeWidth: "4px",
        strokeDasharray: "2px",
        strokeDashoffset: "0px"
      }
    });
    this.setState({ objectList });
  };
  addHalfArcDesignThick = () => {
    let objectList = Object.assign([], this.state.objectList);

    objectList.push({
      id: this.getRandomInt(1, 1000),
      type: "halfArc",
      position: { x: 100, y: 40, height: 80, width: 200 },
      style: {
        fill: "transparent",
        stroke: "grey",
        strokeWidth: "4px",
        strokeDasharray: "3px",
        strokeDashoffset: "5px"
      }
    });
    this.setState({ objectList });
  };
  addHalfArcSolidFull = () => {
    let objectList = Object.assign([], this.state.objectList);

    objectList.push({
      id: this.getRandomInt(1, 1000),
      type: "halfArc",
      position: { x: 100, y: 40, height: 80, width: 200 },
      style: {
        fill: "lightgrey",
        stroke: "grey",
        strokeWidth: "2px",
        strokeDasharray: "0px",
        strokeDashoffset: "0px"
      }
    });
    this.setState({ objectList });
  };
  addHalfArcDashedFull = () => {
    let objectList = Object.assign([], this.state.objectList);

    objectList.push({
      id: this.getRandomInt(1, 1000),
      type: "halfArc",
      position: { x: 100, y: 40, height: 80, width: 200 },
      style: {
        fill: "lightgrey",
        stroke: "grey",
        strokeWidth: "2px",
        strokeDasharray: "2px",
        strokeDashoffset: "0px"
      }
    });
    this.setState({ objectList });
  };
  addHalfArcDesignFull = () => {
    let objectList = Object.assign([], this.state.objectList);

    objectList.push({
      id: this.getRandomInt(1, 1000),
      type: "halfArc",
      position: { x: 100, y: 40, height: 80, width: 200 },
      style: {
        fill: "lightgrey",
        stroke: "grey",
        strokeWidth: "2px",
        strokeDasharray: "3px",
        strokeDashoffset: "5px"
      }
    });
    this.setState({ objectList });
  };
  onContentDivFocus = (id, e) => {
    this.setState({ selectedContentDiv: id, enableFontStyle: true });
  };
  addTextThreeTemplate = () => {
    let objectList = Object.assign([], this.state.objectList);
    objectList.push({
      id: this.getRandomInt(1, 1000),
      type: "textThreeTemplate",
      objectType: "composite",
      position: { x: 100, y: 40, height: 80, width: 300 },
      style: {},
      object1: {
        id: "sal123",
        style: {
          width: "100%",
          fontSize: "32px",
          fontWeight: "bold",
          fontFamily: "Times New Roman",
          minheight: "40px",
          background: "transparent"
        },
        type: "text",
        onFocus: this.onContentDivFocus,
        text: "Hey there!"
      },
      object2: {
        id: this.getRandomInt(1, 1000),
        style: {
          width: "100%",
          fontSize: "16px",
          fontWeight: "bold",
          fontFamily: "Monaco",
          minheight: "20px",
          background: "transparent"
        },
        type: "text",
        onFocus: this.onContentDivFocus,
        text: "How's it going?"
      },
      object3: {
        id: this.getRandomInt(1, 1000),
        style: {
          width: "100%",
          fontSize: "22px",
          fontWeight: "normal",
          fontFamily: "Monaco",
          minheight: "24px",
          background: "transparent"
        },
        onFocus: this.onContentDivFocus,
        type: "text",
        text: "I'm doing fine, how about yourself?"
      }
    });
    this.setState({ objectList });
  };
  addMeme = () => {
    var imageUrl = prompt("Please enter a image url:", "");
    if (imageUrl) {
      let objectList = Object.assign([], this.state.objectList);
      objectList.push({
        id: this.getRandomInt(1, 1000),
        type: "meme",
        position: { x: 100, y: 40, height: 90, width: 300 },
        style: {},
        object1: {
          style: {
            width: "100%",
            fontSize: "32px",
            fontWeight: "bold",
            fontFamily: "Times New Roman",
            minheight: "40px",
            background: "transparent",
            position: "absolute",
            top: 0,
            left: 0,
            zIndex: 0
          },
          // src: URL.createObjectURL(target.files[0])
          src: imageUrl
        },
        object2: {
          style: {
            width: "100%",
            fontSize: "16px",
            fontWeight: "bold",
            fontFamily: "Monaco",
            minheight: "20px",
            background: "transparent",
            position: "absolute",
            top: 0,
            left: 0,
            zIndex: 10
          },
          type: "text",
          text: "How's it going?"
        },
        object3: {
          style: {
            width: "100%",
            fontSize: "22px",
            fontWeight: "normal",
            fontFamily: "Monaco",
            minheight: "24px",
            background: "transparent",
            position: "absolute",
            bottom: 0,
            left: 0,
            zIndex: 10
          },
          type: "text",
          text: "I'm doing fine, how about yourself?"
        }
      });
      this.setState({ objectList });
    }
  };
  addTextTwoTemplate = () => {
    let objectList = Object.assign([], this.state.objectList);
    objectList.push({
      id: this.getRandomInt(1, 1000),
      type: "textTwoTemplate",
      position: { x: 100, y: 40, height: 60, width: 200 },
      style: {},
      object1: {
        id: this.getRandomInt(1, 1000),
        style: {
          fontSize: "32px",
          fontWeight: "bold",
          fontFamily: "Times New Roman",
          minheight: "40px",
          background: "transparent"
        },
        objectType: "composite",
        type: "text",
        text: "Hey there!"
      },
      object2: {
        id: this.getRandomInt(1, 1000),
        objectType: "composite",
        style: {
          fontSize: "16px",
          fontWeight: "bold",
          fontFamily: "Monaco",
          minheight: "20px",
          background: "transparent"
        },
        type: "text",

        text: "How's it going?"
      }
    });
    this.setState({ objectList });
  };
  addTextSideTemplate = () => {
    let objectList = Object.assign([], this.state.objectList);
    objectList.push({
      id: this.getRandomInt(1, 1000),
      type: "textSideTemplate",
      position: { x: 100, y: 40, height: 60, width: 200 },
      style: {},
      object1: {
        id: this.getRandomInt(1, 1000),
        objectType: "composite",
        style: {
          verticalAlign: "top",
          width: "40%",
          display: "inline-block",
          fontSize: "16px",
          fontWeight: "bold",
          fontFamily: "Times New Roman",
          minheight: "40px",
          background: "transparent"
        },
        type: "text",
        text: "Happy"
      },
      object2: {
        id: this.getRandomInt(1, 1000),
        objectType: "composite",
        style: {
          verticalAlign: "top",
          width: "60%",
          display: "inline-block",
          fontSize: "16px",
          fontWeight: "bold",
          fontFamily: "Monaco",
          minheight: "20px",
          background: "transparent"
        },
        type: "text",
        text: " Birthday"
      }
    });
    this.setState({ objectList });
  };
  addVideo = (channel) => {
    var videoUrl = prompt("Please enter a video url:", "");
    if (videoUrl) {
      let objectList = Object.assign([], this.state.objectList);
      objectList.push({
        position: { x: 90, y: 20 },
        style: {},
        id: this.getRandomInt(1, 1000),
        videoUrl,
        channel,
        type: "video"
      });
      this.setState({ objectList });
    }
  };

  addImagePreview1 = () => {
    var imageUrl = require("../assets/images/adam-whitlock.jpg");
    if (imageUrl) {
      let objectList = Object.assign([], this.state.objectList);
      objectList.push({
        position: { x: 90, y: 20,width:'500px' },
        style: {},
        id: this.getRandomInt(1, 1000),
        src: `${imageUrl}`,
        type: "img"
      });
      this.setState({ objectList });
    }
  };
  addImagePreview2 = () => {
    var imageUrl = require("../assets/images/dakota-corbin.jpg");
    if (imageUrl) {
      let objectList = Object.assign([], this.state.objectList);
      objectList.push({
        position: { x: 90, y: 20,width:'500px' },
        style: {},
        id: this.getRandomInt(1, 1000),
        src: `${imageUrl}`,
        type: "img"
      });
      this.setState({ objectList });
    }
  };
  addImagePreview3 = () => {
    var imageUrl = require("../assets/images/luca-upper.jpg");
    if (imageUrl) {
      let objectList = Object.assign([], this.state.objectList);
      objectList.push({
        position: { x: 90, y: 20,width:'500px' },
        style: {},
        id: this.getRandomInt(1, 1000),
        src: `${imageUrl}`,
        type: "img"
      });
      this.setState({ objectList });
    }
  };


  addGifPreview1 = () => {
    var imageUrl = require("../assets/images/blob.gif");
    if (imageUrl) {
      let objectList = Object.assign([], this.state.objectList);
      objectList.push({
        position: { x: 90, y: 20,width:'500px' },
        style: {},
        id: this.getRandomInt(1, 1000),
        src: `${imageUrl}`,
        type: "img"
      });
      this.setState({ objectList });
    }
  };
  addGifPreview2 = () => {
    var imageUrl = require("../assets/images/giphy36.gif");
    if (imageUrl) {
      let objectList = Object.assign([], this.state.objectList);
      objectList.push({
        position: { x: 90, y: 20,width:'500px' },
        style: {},
        id: this.getRandomInt(1, 1000),
        src: `${imageUrl}`,
        type: "img"
      });
      this.setState({ objectList });
    }
  };
  addGifPreview3 = () => {
    var imageUrl = require("../assets/images/source30.gif");
    if (imageUrl) {
      let objectList = Object.assign([], this.state.objectList);
      objectList.push({
        position: { x: 90, y: 20,width:'500px' },
        style: {},
        id: this.getRandomInt(1, 1000),
        src: `${imageUrl}`,
        type: "img"
      });
      this.setState({ objectList });
    }
  };




  addText = () => {
    var text =
      "Lorem ipsum dolor sit amet,\nconsectetur adipisicing elit,\nsed do eiusmod tempor incididunt\nut labore et dolore magna aliqua.\n" +
      "Ut enim ad minim veniam,\nquis nostrud exercitation ullamco\nlaboris nisi ut aliquip ex ea commodo consequat.";
    let objectList = Object.assign([], this.state.objectList);
    objectList.push({
      id: this.getRandomInt(1, 1000),
      type: "text",
      position: { x: 50, y: 40 },
      style: { color: "grey", background: "transparent" },
      text
    });
    this.setState({ objectList });
  };

  addIText = () => {
    var text =
      "Lorem ipsum dolor sit amet,\nconsectetur adipisicing elit,\nsed do eiusmod tempor incididunt\nut labore et dolore magna aliqua.\n" +
      "Ut enim ad minim veniam,\nquis nostrud exercitation ullamco\nlaboris nisi ut aliquip ex ea commodo consequat.";
    let objectList = Object.assign([], this.state.objectList);

    objectList.push({
      id: this.getRandomInt(1, 1000),
      type: "text",
      position: { x: 50, y: 40 },
      style: { color: "grey", background: "transparent" },
      text
    });
    this.setState({ objectList });
  };

  addHeading = () => {
    var text = "Add Heading";
    let objectList = Object.assign([], this.state.objectList);

    objectList.push({
      id: this.getRandomInt(1, 1000),
      type: "text",
      position: { x: 50, y: 40 },
      style: {
        color: "black",
        background: "transparent",
        fontSize: "42px",
        fontWeight: "bold",
        fontFamily: "Times New Roman"
      },
      text
    });
    this.setState({ objectList });
  };

  addSubHeading = () => {
    var text = "Add Subheading";
    let objectList = Object.assign([], this.state.objectList);

    objectList.push({
      id: this.getRandomInt(1, 1000),
      type: "text",
      position: { x: 50, y: 40 },
      style: {
        color: "black",
        background: "transparent",
        fontSize: "22px",
        fontWeight: "bold",
        fontFamily: "Helvetica Neue"
      },
      text
    });
    this.setState({ objectList });
  };
  onImageUpload = e => {
    let objectList = Object.assign([], this.state.objectList);
    objectList.push({
      id: this.getRandomInt(1, 1000),
      type: "img",
      position: { x: 10, y: 10 },
      style: {},
      src: URL.createObjectURL(e.target.files[0])
    });
    this.setState({ objectList });
  };
  addALine = () => {
    var text = "Add a Line";
    let objectList = Object.assign([], this.state.objectList);

    objectList.push({
      id: this.getRandomInt(1, 1000),
      type: "text",
      position: { x: 50, y: 40 },
      style: { color: "black", background: "transparent", fontSize: "17px" },
      text
    });
    this.setState({ objectList });
  };

  showModal = () => {
    return (
      <Modal
        show={this.state.showModal}
        bsSize="small"
        backdrop="false"
        onHide={() => {
          this.setState({ showModal: false });
        }}
        aria-labelledby="contained-modal-title-sm"
      >
        <Modal.Header closeButton="true">
          <Modal.Title id="contained-modal-title-sm">Object Style</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {this.state.modalObject === "background" && (
            <div>
              <h4>Background Color</h4>
              <ChromePicker
                color={this.state.backgroundColor || "#000000"}
                onChange={newColor => {
                  this.onStyleChange(
                    this.state.objectList[this.state.activeObjectIndex].isSVG
                      ? "fill"
                      : "backgroundColor",
                    newColor.hex
                  );
                }}
              />
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            onClick={() => {
              this.setState({ showModal: false });
            }}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    );
  };

  setActiveStyle = (styleName, value, object) => {
    let canvas = this.refs.fabricRef.props.newObj.canvas;
    object = object || canvas.getActiveObject();
    if (!object) return;

    if (object.setSelectionStyles && object.isEditing) {
      var style = {};
      style[styleName] = value;
      object.setSelectionStyles(style);
      object.setCoords();
    } else {
      object.set(styleName, value);
    }

    object.setCoords();
    canvas.renderAll();
    this.getActiveStyle(styleName);
  };
  shadowify = () => {
    let canvas = this.refs.fabricRef.props.newObj.canvas;
    var obj = canvas.getActiveObject();
    if (!obj) return;

    if (obj.shadow) {
      obj.shadow = null;
    } else {
      obj.setShadow({
        color: "rgba(0,0,0,0.3)",
        blur: 10,
        offsetX: 10,
        offsetY: 10
      });
    }
    canvas.renderAll();
  };

  updateObjectPosition=(index,position)=>{
    let objectList = Object.assign([], this.state.objectList);
    objectList[index].position=Object.assign({}, position);
    this.setState({objectList},()=>{
      let objectLists = Object.assign([], this.state.objectList);
      for (let i = 0; i < objectLists.length; i++) {
        if (objectLists[i].isDeleted) {
          objectLists.splice(i, 1);
          i = i - 1;
          continue;
        }
      }
    this.props.changeObject({ canvasObject: JSON.stringify(objectLists) });
    });
  }
  deleteObject = () => {
    let objectList = Object.assign([], this.state.objectList);
    objectList[this.state.activeObjectIndex]['isDeleted']=true;
    this.setState(
      {
        objectList
      },
      () => this.setActiveObject(-1)
    );
  };
  onSortEnd = ({oldIndex, newIndex}) => {
    let objectList = Object.assign([], this.state.objectList);
    this.setState({
      objectList:[]
    },()=>this.setState({objectList: arrayMove(objectList, oldIndex, newIndex)},()=>{
      this.setActiveObject(newIndex)
    }) );
  }
  copyObject=()=>{
    let copyObject = Object.assign([], this.state.objectList[this.state.activeObjectIndex]);
    let objectList = Object.assign([], this.state.objectList);
    copyObject.position.x=50;
    copyObject.position.y=40;
    objectList.push(copyObject)
    this.setState({objectList});
  }
  gradientify = () => {
    let canvas = this.refs.fabricRef.props.newObj.canvas;
    var obj = canvas.getActiveObject();
    if (!obj) return;

    obj.setGradient("fill", {
      x1: 0,
      y1: 0,
      x2: this.getRandomInt(0, 1) ? 0 : obj.width,
      y2: this.getRandomInt(0, 1) ? 0 : obj.height,
      colorStops: {
        0: "#" + this.getRandomColor(),
        1: "#" + this.getRandomColor()
      }
    });
    canvas.renderAll();
  };

  getSelectedStyle = () => {
    let objectList = Object.assign([], this.state.objectList);
    if (objectList[this.state.activeObjectIndex].objectType === "composite") {
      let selectedObject = objectList[this.state.activeObjectIndex];
      for (var key in selectedObject) {
        if (
          typeof selectedObject[key] === "object" &&
          selectedObject[key].id === this.state.selectedContentDiv
        ) {
          return selectedObject[key];
        }
      }
    } else return this.state.objectList[this.state.activeObjectIndex];
  };
  toggleBold = () => {
    this.onStyleChange(
      "fontWeight",
      this.getSelectedStyle().style.fontWeight === "bold" ? "" : "bold"
    );
  };
  toggleItalic = () => {
    this.onStyleChange(
      "fontStyle",
      this.getSelectedStyle().style.fontStyle === "italic" ? "" : "italic"
    );
  };
  isUnderline = () => {
    let textDecoration = this.getSelectedStyle().style.textDecoration || "";

    return textDecoration && textDecoration.indexOf("underline") > -1;
  };
  toggleUnderline = () => {
    let textDecoration = this.getSelectedStyle().style.textDecoration || "";
    var value = this.isUnderline()
      ? textDecoration.replace("underline", "")
      : textDecoration + " underline";

    this.onStyleChange("textDecoration", value);
  };
  isLinethrough = () => {
    let textDecoration = this.getSelectedStyle().style.textDecoration || "";

    return textDecoration && textDecoration.indexOf("line-through") > -1;
  };
  toggleLinethrough = () => {
    let textDecoration = this.getSelectedStyle().style.textDecoration || "";

    var value = this.isLinethrough()
      ? textDecoration.replace("line-through", "")
      : textDecoration + " line-through";

    this.onStyleChange("textDecoration", value);
  };
  isOverline = () => {
    let textDecoration = this.getSelectedStyle().style.textDecoration || "";
    return textDecoration && textDecoration.indexOf("overline") > -1;
  };
  toggleOverline = () => {
    let textDecoration = this.getSelectedStyle().style.textDecoration || "";
    var value = this.isOverline()
      ? textDecoration.replace("overline", "")
      : textDecoration + " overline";

    this.onStyleChange("textDecoration", value);
  };

  getDimensions() {
    var height = this.state.height * 0.8;
    var width = height * (16 / 9);
    let dimension=Object.assign({}, this.state.dimension)
    if (mobileCheck()) {
       dimension={height}
      this.setState({ dimension});
    }else{
      dimension={ height,width}
      this.setState({ dimension});
    }
    // return { width: width, height: height };
  }
  setDimension=(type,value)=> {
    let dimension=Object.assign({}, this.state.dimension)
    dimension[type] = value;
    this.setState({ dimension});
    // return { width: width, height: height };
  }
  onHandleShowCaseChange(data, images) {
    this.setState({ hexOrImage: getColorHexOrImage(data, "bodyBackground") });
  }

  setRectDimensions = dimensions => {
    this.setState({ rectDimensions: dimensions });
  };
 

  render() {
    // let canvas = this.refs.fabricRef.props.newObj.canvas;
    // let activeObjName = "";
    // if (canvas.getActiveObject()) {
    //   activeObjName = object['text'];
    // }
    return (
      <div>
        <div className="col-lg-12 hidden-xs" style={{ padding: "0px" }}>
          <Col
            md={3}
            style={{
              height: "100vh",
              padding: "0px",
              boxShadow: "0px 0px 10px lightgrey",
              zIndex: "100"
            }}
          >
            <Tabs
              className="fabricmenu"
              defaultActiveKey={1}
              justified
              id="main_tabs"
              style={{ marginLeft: "0px", width: "100%", overflowX: "auto" }}
            >
              <Tab
                eventKey={1}
                title={
                  <p className="hovertile" style={{ marginBottom: "0px" }}>
                    <img
                      className="hoverimage"
                      style={{ width: "30px" }}
                      src="data:image/png;base64,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"
                    />

                    {/*  <img
                    style={{ width: "20px" }}
                    src="data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTkuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iTGF5ZXJfMSIgeD0iMHB4IiB5PSIwcHgiIHZpZXdCb3g9IjAgMCA1MTIgNTEyIiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA1MTIgNTEyOyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSIgd2lkdGg9IjEyOHB4IiBoZWlnaHQ9IjEyOHB4Ij4KPGc+Cgk8Zz4KCQk8cGF0aCBkPSJNNTEyLDE5OC41MmMwLTc4LjQ3My02My44NDMtMTQyLjMxNi0xNDIuMzE2LTE0Mi4zMTZjLTQ0LjQ0OSwwLTg0LjE5OCwyMC40ODctMTEwLjMxNiw1Mi41MTFWODQuODM2ICAgIGMwLTguODM2LTcuMTY0LTE2LTE2LTE2SDE2Yy04LjgzNiwwLTE2LDcuMTY0LTE2LDE2djIyNy4zNjljMCw4LjgzNiw3LjE2NCwxNiwxNiwxNmgxMzQuMDE5TDkwLjIxLDQzMS43OTYgICAgYy02LjE1NiwxMC42NiwxLjU2NywyNCwxMy44NTYsMjRoMjc4LjYwMmMxMi4zMDgsMCwyMC4wMDItMTMuMzU0LDEzLjg1Ny0yNGwtNTQuMDI2LTkzLjU4MmM4LjkxOCwxLjczLDE4LjAyMSwyLjYyMiwyNy4xODQsMi42MjIgICAgQzQ0OC4xNTcsMzQwLjgzNiw1MTIsMjc2Ljk5NCw1MTIsMTk4LjUyeiBNMzIsMjk2LjIwNFYxMDAuODM2aDE5NS4zNjl2OTMuMzk2bC01OC44NzQsMTAxLjk3MkgzMnogTTM1NC45NTcsNDIzLjc5N0gxMzEuNzggICAgYzIuNTE3LTQuMzYxLDEwNi4yNjItMTg0LjA1MSwxMTEuNTg4LTE5My4yNzdDMjUwLjE3NSwyNDIuMzA5LDM1MC43OTcsNDE2LjU5MywzNTQuOTU3LDQyMy43OTd6IE0zMTguMTksMjk2LjEwNWwtNTguNzQ1LTEwMS43NCAgICBjMi4xOTQtNTguOTA5LDUwLjgwMy0xMDYuMTYxLDExMC4yMzktMTA2LjE2MUM0MzAuNTEyLDg4LjIwNCw0ODAsMTM3LjY5Miw0ODAsMTk4LjUycy00OS40ODgsMTEwLjMxNi0xMTAuMzE2LDExMC4zMTYgICAgQzM1MS42NywzMDguODM2LDMzMy45NTYsMzA0LjQ0NSwzMTguMTksMjk2LjEwNXoiIGZpbGw9IiMwMDAwMDAiLz4KCTwvZz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8L3N2Zz4K"
                  />*/}
                    <p
                      className="hovertitle"
                      style={{
                        marginBottom: "0px",
                        fontSize: "9px",
                        marginTop: "2px"
                      }}
                    >
                      SHAPES
                    </p>
                  </p>
                }
              >
                <div
                  style={{
                    padding: "10px",
                    background: "rgb(250,250,250)",
                    marginBottom: "10px"
                  }}
                >
                  <p
                    style={{
                      marginBottom: "0px",
                      fontSize: "22px",
                      color: "grey",
                      fontWeight: "bold"
                    }}
                  >
                    Shapes
                  </p>
                  <p
                    style={{
                      marginBottom: "0px",
                      fontSize: "12px",
                      color: "lightgrey",
                      fontWeight: "bold"
                    }}
                  >
                    click to add
                  </p>
                </div>
                <div
                  className="col-xs-4 aligncenter marginbottom30 "
                  style={{ padding: "0px" }}
                >
                  <button
                    type="button"
                    className="hovertile btn btn-sm"
                    style={{ backgroundColor: "transparent", padding: "0px" }}
                    onClick={this.addBoxRound}
                  >
                    <div
                      className="hoverimage"
                      style={{
                        width: "80px",
                        height: "80px",
                        borderRadius: "10px",
                        backgroundColor: "lightgrey",
                        border: "5px solid transparent",
                        marginLeft: "auto",
                        marginRight: "auto"
                      }}
                    />


                  </button>
                </div>
                <div
                  className="col-xs-4 aligncenter marginbottom30"
                  style={{ padding: "0px" }}
                >
                  <button
                    type="button"
                    className="btn btn-sm hovertile"
                    style={{ backgroundColor: "transparent", padding: "0px" }}
                    onClick={this.addBoxRoundWithBorderNoBac}
                  >
                    <div
                      className="hoverimage"
                      style={{
                        width: "80px",
                        height: "80px",
                        borderRadius: "10px",
                        backgroundColor: "transparent",
                        border: "5px solid lightgrey",
                        marginLeft: "auto",
                        marginRight: "auto"
                      }}
                    />

                  </button>
                </div>
                <div
                  className="col-xs-4 aligncenter marginbottom30 "
                  style={{ padding: "0px" }}
                >
                  <button
                    type="button"
                    className="btn btn-sm hovertile"
                    style={{ backgroundColor: "transparent", padding: "0px" }}
                    onClick={this.addBoxRoundWithBorderAndBac}
                  >
                    <div
                      className="hoverimage"
                      style={{
                        width: "80px",
                        height: "80px",
                        borderRadius: "10px",
                        backgroundColor: "grey",
                        border: "5px solid lightgrey",
                        marginLeft: "auto",
                        marginRight: "auto"
                      }}
                    />

                  </button>
                </div>
                <div
                  className="col-xs-4 aligncenter marginbottom30 "
                  style={{ padding: "0px" }}
                >
                  <button
                    type="button"
                    className="btn btn-sm hovertile"
                    style={{ backgroundColor: "transparent", padding: "0px" }}
                    onClick={this.addBox}
                  >
                    <div
                      className="hoverimage"
                      style={{
                        width: "80px",
                        height: "80px",
                        borderRadius: "0px",
                        backgroundColor: "lightgrey",
                        border: "5px solid transparent",
                        marginLeft: "auto",
                        marginRight: "auto"
                      }}
                    />

                  </button>
                </div>
                <div
                  className="col-xs-4 aligncenter marginbottom30 "
                  style={{ padding: "0px" }}
                >
                  <button
                    type="button"
                    className="btn btn-sm"
                    style={{ backgroundColor: "transparent", padding: "0px" }}
                    onClick={this.addBoxWithBorderNoBac}
                  >
                    <div
                      className="hoverimage"
                      style={{
                        width: "80px",
                        height: "80px",
                        borderRadius: "0px",
                        backgroundColor: "transparent",
                        border: "5px solid lightgrey",
                        marginLeft: "auto",
                        marginRight: "auto"
                      }}
                    />

                  </button>
                </div>
                <div
                  className="col-xs-4 aligncenter marginbottom30 "
                  style={{ padding: "0px" }}
                >
                  <button
                    type="button"
                    className="btn btn-sm hovertile"
                    style={{ backgroundColor: "transparent", padding: "0px" }}
                    onClick={this.addBoxWithBorderAndBac}
                  >
                    <div
                      className="hoverimage"
                      style={{
                        width: "80px",
                        height: "80px",
                        borderRadius: "0px",
                        backgroundColor: "lightgrey",
                        border: "5px solid grey",
                        marginLeft: "auto",
                        marginRight: "auto"
                      }}
                    />

                  </button>
                </div>

                <div
                  className="col-xs-4 aligncenter marginbottom30 "
                  style={{ padding: "0px" }}
                >
                  <button
                    type="button"
                    style={{ backgroundColor: "transparent", padding: "0px" }}
                    onClick={this.addCircle}
                    className="btn btn-sm hovertile"
                  >
                    <div
                      className="hoverimage"
                      style={{
                        width: "80px",
                        height: "80px",
                        borderRadius: "50%",
                        backgroundColor: "lightgrey",
                        border: "5px solid transparent",
                        marginLeft: "auto",
                        marginRight: "auto"
                      }}
                    />

                  </button>
                </div>
                <div
                  className="col-xs-4 aligncenter marginbottom30 "
                  style={{ padding: "0px" }}
                >
                  <button
                    type="button"
                    style={{ backgroundColor: "transparent", padding: "0px" }}
                    onClick={this.addCircleWithBorderNoBac}
                    className="btn btn-sm hovertile"
                  >
                    <div
                      className="hoverimage"
                      style={{
                        width: "80px",
                        height: "80px",
                        borderRadius: "50%",
                        backgroundColor: "transparent",
                        border: "5px solid lightgrey",
                        marginLeft: "auto",
                        marginRight: "auto"
                      }}
                    />

                  </button>
                </div>
                <div
                  className="col-xs-4 aligncenter marginbottom30 "
                  style={{ padding: "0px" }}
                >
                  <button
                    type="button"
                    style={{ backgroundColor: "transparent", padding: "0px" }}
                    onClick={this.addCircleWithBorderAndBac}
                    className="btn btn-sm"
                  >
                    <div
                      className="hoverimage"
                      style={{
                        width: "80px",
                        height: "80px",
                        borderRadius: "50%",
                        backgroundColor: "lightgrey",
                        border: "5px solid grey",
                        marginLeft: "auto",
                        marginRight: "auto"
                      }}
                    />
                  </button>
                </div>

                <div
                  className="col-xs-4 aligncenter marginbottom30 "
                  style={{ padding: "0px" }}
                >
                  <button
                    type="button"
                    style={{ backgroundColor: "transparent", padding: "0px" }}
                    onClick={this.addCircle}
                    className="btn btn-sm hovertile"
                  >
                    <div
                      className="hoverimage"
                      style={{
                        width: "80px",
                        height: "40px",
                        borderRadius: "50%",
                        backgroundColor: "lightgrey",
                        border: "5px solid transparent",
                        marginLeft: "auto",
                        marginRight: "auto"
                      }}
                    />

                  </button>
                </div>
                <div
                  className="col-xs-4 aligncenter marginbottom30 "
                  style={{ padding: "0px" }}
                >
                  <button
                    type="button"
                    style={{ backgroundColor: "transparent", padding: "0px" }}
                    onClick={this.addCircleWithBorderNoBac}
                    className="btn btn-sm hovertile"
                  >
                    <div
                      className="hoverimage"
                      style={{
                        width: "80px",
                        height: "40px",
                        borderRadius: "50%",
                        backgroundColor: "transparent",
                        border: "5px solid lightgrey",
                        marginLeft: "auto",
                        marginRight: "auto"
                      }}
                    />

                  </button>
                </div>
                <div
                  className="col-xs-4 aligncenter marginbottom30 "
                  style={{ padding: "0px" }}
                >
                  <button
                    type="button"
                    style={{ backgroundColor: "transparent", padding: "0px" }}
                    onClick={this.addCircleWithBorderAndBac}
                    className="btn btn-sm"
                  >
                    <div
                      className="hoverimage"
                      style={{
                        width: "80px",
                        height: "40px",
                        borderRadius: "50%",
                        backgroundColor: "lightgrey",
                        border: "5px solid grey",
                        marginLeft: "auto",
                        marginRight: "auto"
                      }}
                    />

                  </button>
                </div>

                <div
                  className="col-xs-4 aligncenter marginbottom30 "
                  style={{ padding: "0px" }}
                >
                  <button
                    type="button"
                    style={{ backgroundColor: "transparent", padding: "0px" }}
                    onClick={this.addTriangleBac}
                    className="btn btn-sm"
                  >
                    <div style={{ width: "80px", height: "80px" }}>
                      <svg viewBox="0 0 100 100">
                        <polygon
                          id="e1_polygon"
                          points="0 0, 0 100, 100 0"
                          fill="lightgrey"
                        />
                      </svg>
                    </div>
                  </button>
                </div>

                <div
                  className="col-xs-4 aligncenter marginbottom30 "
                  style={{ padding: "0px" }}
                >
                  <button
                    type="button"
                    style={{ backgroundColor: "transparent", padding: "0px" }}
                    onClick={this.addTriangleBorder}
                    className="btn btn-sm"
                  >
                    <div style={{ width: "80px", height: "80px" }}>
                      <svg viewBox="0 0 100 100">
                        <polygon
                          id="e1_polygon"
                          points="0 0, 0 100, 100 0"
                          stroke-width="5"
                          stroke="lightgrey"
                          fill="transparent"
                        />
                      </svg>
                    </div>
                  </button>
                </div>

                <div
                  className="col-xs-4 aligncenter marginbottom30 "
                  style={{ padding: "0px" }}
                >
                  <button
                    type="button"
                    style={{ backgroundColor: "transparent", padding: "0px" }}
                    onClick={this.addTriangleFull}
                    className="btn btn-sm"
                  >
                    <div style={{ width: "80px", height: "80px" }}>
                      <svg viewBox="0 0 100 100">
                        <polygon
                          id="e1_polygon"
                          points="0 0, 0 100, 100 0"
                          stroke-width="5"
                          stroke="grey"
                          fill="lightgrey"
                        />
                      </svg>
                    </div>
                  </button>
                </div>

                <div
                  className="col-xs-4 aligncenter marginbottom30 "
                  style={{ padding: "0px" }}
                >
                  <button
                    type="button"
                    className="btn btn-sm"
                    style={{ backgroundColor: "transparent", padding: "0px" }}
                    onClick={this.addStarBac}
                  >
                    <div style={{ width: "80px", height: "80px" }}>
                      <svg viewBox="0 0 100 100">
                        <path
                          stroke="transparent"
                          stroke-width="5"
                          d="M49 73.5L22.55 87.406l5.05-29.453-21.398-20.86 29.573-4.296L49 6l13.225 26.797 29.573 4.297-21.4 20.86 5.052 29.452z"
                          fill="lightgrey"
                          fill-rule="evenodd"
                        />
                      </svg>
                    </div>
                  </button>
                </div>

                <div
                  className="col-xs-4 aligncenter marginbottom30 "
                  style={{ padding: "0px" }}
                >
                  <button
                    type="button"
                    className="btn btn-sm"
                    style={{ backgroundColor: "transparent", padding: "0px" }}
                    onClick={this.addStarBorder}
                  >
                    <div style={{ width: "80px", height: "80px" }}>
                      <svg viewBox="0 0 100 100">
                        <path
                          stroke="lightgrey"
                          stroke-width="5"
                          d="M49 73.5L22.55 87.406l5.05-29.453-21.398-20.86 29.573-4.296L49 6l13.225 26.797 29.573 4.297-21.4 20.86 5.052 29.452z"
                          fill="transparent"
                          fill-rule="evenodd"
                        />
                      </svg>
                    </div>
                  </button>
                </div>

                <div
                  className="col-xs-4 aligncenter marginbottom30"
                  style={{ padding: "0px" }}
                >
                  <button
                    type="button"
                    className="btn btn-sm"
                    style={{ backgroundColor: "transparent", padding: "0px" }}
                    onClick={this.addStarFull}
                  >
                    <div style={{ width: "80px", height: "80px" }}>
                      <svg viewBox="0 0 100 100">
                        <path
                          stroke="lightgrey"
                          stroke-width="5"
                          d="M49 73.5L22.55 87.406l5.05-29.453-21.398-20.86 29.573-4.296L49 6l13.225 26.797 29.573 4.297-21.4 20.86 5.052 29.452z"
                          fill="grey"
                          fill-rule="evenodd"
                        />
                      </svg>
                    </div>
                  </button>
                </div>
              </Tab>
              <Tab
                eventKey={2}
                title={
                  <p className="hovertile" style={{ marginBottom: "0px" }}>
                    <img
                      className="hoverimage"
                      style={{ width: "30px" }}
                      src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAYAAACtWK6eAAAAAXNSR0IArs4c6QAAI21JREFUeAHtXQe4JUWVrrpvAoPEEVmJKiiuoiASBFRgGERZVCSNuAMjAwJKUowffoojEkTBT9k1A6KiIAquJAcMQwYHFnMg6YcgKzk445t5792u/f/TdfrV7RtfvO9dT31f33O66lTVOX+d01UdbrdzlgwBQ8AQMAQMAUPAEDAEDAFDwBAwBAwBQ8AQMAQMAUPAEDAEDAFDwBAwBAwBQ8AQMAQMAUPAEDAEDAFDwBAwBAwBQ8AQMAQMAUPAEDAEDAFDwBAwBAwBQ8AQMAQMAUPAEDAEDAFDwBAwBAwBQ8AQMAQMAUPAEDAEDAFDwBAwBAwBQ8AQMAQMAUPAEDAEDAFDwBAwBAwBQ8AQMAQMAUPAEDAEDAFDwBAwBAwBQ8AQMAQMAUPAEDAEDAFDwBAwBAwBQ8AQMAQMAUPAEDAEDAFDwBAwBAwBQ8AQMAQMAUPAEDAEDAFDwBAwBAwBQ8AQMAQMAUPAEDAEDAFDwBAwBAwBQ8AQMAQMAUPAEGiDgG9T3hPF4d4ffAmGvNM5mhuwRbNLuy6gzCOTVFIUqPgFfssDr46ZRv6FEIie0rsWhwcvnetW+YcQF3OGgyMGgMZKEQ8xOBgkkgqBn/qtFryhd1Eyy5ohUGlW0DP5q9zRLsvmuJDlM0NB6fzYZLYo8cxLN+fmh3suf1nPYGKGdIxATwdICJf2uWp4T42zp45fx6dBlPBZ5l0YPKljVE2wZxDo6QBxd2cHOJdtLjNFOltoYKR5Ka/lxWyDYMmyheGBq9bvmZE3QzpCoLcDJFTfK0urTBwccZLQ1PkbBQTLmZS6sKZbteKYPNN+/1UQ0LPRnrM33Hvxdm4wuyufPdRMnmuQJ2VSvll5LpX8/tW9bNYW3i+oJnnG9jACvTuDDA29Lz/684Qbs0EnM4bMJJSNJ+kcePKaQtjc3TNwkO4a7X0EejJAwn3f2hCO/XZ4d3RwOvkoNi7NWE+XaOSHsvf2vluYhYpATwaIW+3e7bIwu3bWgLPT0TmTqMNzdpA80JrZI8pJgIHX4Mpnll3CH7+zvQJotLcR6LkACeHOmQiCd9cGRwwAOeUAT5ryuePHINFgAZUAiTQNlurA+3vbLcw6RaDnAsT94XcLMCtslJ87RGfXGYCzBfliBomziZ6jpEGgckrTus4dFH7/jecriEZ7F4HeC5Ch6on5cikGRzo7SAAkMwL3042yKpPWK/NZNgtLuON71y3MMkVAr2/q/rSm4Tfn74LguLW5EQwAWVtFEeUVhnblacv+UbfmRpv7l/zH6jTX+N5CoLdmkKCzR4uT7HSGUF5nEcaH5OWk4IvydIbJNnQrH17YW+5g1pQR6JkACX86f2P48YFycq5WynkDdvScg46u5xIp32m5XgErzlmyE7Qro72JQM8EiFs9dCyCY2Z+1B/lDKLB0yxgdCZRGsKrwq++Oq83XcOsIgI9ESDh3mtmu6x6dO29jGQ5NOzQMBn55ZNu3deyTuVlJgl247CHY6knAsStfGAhfPp5xfJKl0AZg4GXcrm0igGjNA2GZgGigaKUbUm9OENJP9W3hF9++YU97CP/0qb1RoAM4VxAlkcYS6UcVnHoSCVQomM3W0JJXQYTgyqRlUDAPpO2me8wXiqYvWwWETx670evb05by8JdX9odDnp9YwNGehmXs4zWadxi41z/jJvjN/VbH7eicbnlTlcEpv8MIkfvuHziUkmWQKCybOIsQD7OBgXfYbm2RZry0o62Ie2v6/qzxdPVCUzv5ghM6wAJd/33CxAAby2WRHRiXSapU6eUjq2OnvIqk+bVBYEEQm3ASVtcerEsHB9CmPYzcnNX+dcsmdYB4rLB4zE79ImDquMrFQcvzSCpQ5PXYNJzDgd5yaPTx7pKJXgYCwyymEQWvNSvbuXu+sK+WmS0NxCYtgES7vzqmq7qjoxH79xxZSmlR3o6OVJ6Uq28LrkYJC4bkDYkeKRCsZsvzWIbNW2zD9ZNKPmqXfIlgr2UZkxbY6orF8FJ1xcfVyP0/FoXOrykS14u7UahdAYQeX82ShbB2TcVp5c8Or+mhPfguUvKpHzcRf29wvLPbe13ev/vc4Hp/SsHobDyFbDzhS74F8JuLGndejB8TeD6HJf5ma4SViOvH+WrUP4UwHkIVv/NVfwDbob7ld/upKenMwrTN0BCODH30AT+wlEb5CVZwyw8fZb/uhusDmEldYo4PAu1HQkW7JMycVIiHyengtfyXIaXfI8mO91SuPPsDdxQ3z4w8PXQfSc3tALBEfrq7C/wAcN/54v94CU/FjIfW/jF2fdDYDm4K12YdbXf+cRnpxMu6dBOG73D7We/AQN3XZ3CnB3SV4cqX7wpsVwj/MTv8uG9w11nv8Ctzv6MypV8FhktLHSOSr9bp4JLvu9/stzbVNwPt3/+35wbOAwzwH5w9F0x21YEw1EpS/uJXQySgo94+jCAfq52M8I5fscP3zKqLia50vQ8B8mw1mcw1JwX8LAe82SAOEjtNn8e8fav/uADIAi4kjzb1zZTXuXS8xDRR/qf456pTvnXA4Xl58wPt571fecGH0RQfBZYvg6Ywh8SDFKbU15lGtpPDHQDfsKTYsvcLND93aC7Odz22ZtxoJvyf10e7aGSftWVFG793IsxqPcAeF8+QA0fvdQsDjZ50kiKXf+4W+9Fm/itF+AkHRK3nXUAHOWyVLyYjXQG4mDrrMRK5aRlFazDd97pRd7PGyqLdHs/3H7WPNh5JiB5TWFrE7gKW0dqv8oL7gXgMF35osMMk/YXXZjxEb/r+/u7jU2j/qffDOJXn4CjEBCORymlxZGK+fGIVZPHIEnq+PBtDQ4BZuZ6V+Ik8xE54snAxnakTmxPeS0vUz3KZtmm7vY7DmwEeLfywh1nvTTc8unrXDX7OWx8TQ0WglMJn9RWxTPNK9uelqk8L46QJ015LeeMlVUxngM34sC3SbewadXvtAqQcPNZa2OaXpxP2wS/3UbHjoMkg6I8aGWGLK8UHL/DMYM4wF0o8jr4rCsDz3pJ3eEBRr72oTKRVqvv07a7SXHzshJuOf0D+DvAr6Arzt2a6JvaOh72d9KeYuuyHVxYvTzc8pktu4lVo76nVYA4X0VwZGuL0xbgJo6Z5qW8ODfkNM+72/zOH/xDHSDBnYcgCfmNv+hIvAlY1GcTbEeT8rFttl9s2c7hljN3VMlu0HDn6Ru5W868EUfvs6H3GoX9hY6pvuDlxmekardStVupGMT6TKV2dJ/BSL7ZAUVmFfbHLcMf3oauC8s/M6VehjFtAkQe4wjxqd0CcDpvi03GjoMUkwwY+erXNSulfteT78MSZNlwntYlxSYOFKk6jlI6jvKkwuPtjl1K4bbTX+1WuTtcqL62UEHtV8xEx8QeCjKvSMqTRjmlUjexuZH9DA5pD1SDphXNqlu41YMXFd1PAWbaBIi7+bR9caTBCTrAVrwJIHlNenQjlQ2DWlDyFAz/cGutcalWqafZ1/M6bIPiSikZ+bwAu3Qc5rFt8tyNVHh3sBzFpWDyfsJNZ2zlhqo3YX2/SZ39oiv1zBUsqNjBTNqjG3fJN5NvZz8rsq62R5zIkzbYpO/q/HDjqYfkFbv/O30CJMONQQG1BcAF+DogZYpBycLFftsPrWwK/Ubr/RCD+ETzAUQb6jHsr8ahOOg1+s10K4eOa9rXBBX413+UV/m+kOuSYlDWT3VVmXI595NNbMV+p/a3ldd+S9SFc+R8c4LwGUmz0yJAwm2fwtedeIIJIGscsg7Y3EF1ABvRGTjPaJH8S05c7Xz2zWFHZx/RSdIrMeTZvlLRKzpPKu/C0eHec2e36HJCivxun/goGj5HdGyEQ6O8Onxp9xjtJxZyjtEBXophCBu7bNUnJwSYETY6LQLEDfA7HzpQShNn1MEuD3C6Ts7Xwr/xrz3ljrYYhb7zJCgoyAEuEgeZKQ62lKX6sCiRJx/C89zDTy6UapP843f/xAeh6n/JeYBgAX2U5rrl+gq2aofSaAflvMc9Cn83LmD8DPw38R/KM8CfBXPOB70JjeAOeSKvdqZ5jfqjnIxZrJDKZ9kJ4YbTNtOmukWn/LNYYdmS9QA+HoWgU/L2Bwci3mhSXoGtQ7EsH1rOHlrd7/7xP4brT7kZfb1O8tJBVCGh1CPRp+Cjs6i+weO5MXdBTdVJ2vF7LDkRGM6CnscMY0gskag+bYtwYkeyhXo/hDpL8dDhRW7mOle0upGHexhz3OCz+wCvD6CJXXNMYgc6RtxVvtV4FRiGGc4P4Ath7gus2q1UQNMtBdr1G67/2IeA2WfayUm5DDg4tSrGlIy7x9OmM9bc2L/+ZDxx2j6FGz6+CP3mSy29MyzOhMabBkyLdiuVPf0epy5rITFhRXIFcNkpODiEIzroBEvMyqdd3xpf9Lt99LEO5GtEws9P2Q/9fA3bhjUFneyUx8/5m/y8T+3WSdWJkpnSSyz5CGfmcJJLT2+wyZEI+aSyKU8a5Yfp5Z0Gh4A9c/3vow08qo12uCzJl2jDtJE+rfL4ObguJe/x1PK8vqNw4MAl1IhLI8rl0iy3rZ936pLRBAfN83ue+iM3u++V6Cd+3atFf2Ud9HxOz1lCeG24/XQ8TNm9NKUDxC375X5wfPwHoYMAINjDwZDzadBUso6WVzoU+ZIi+470rQPZqv20L8rJRr3JM8DCW8JNS7bQ9ieber8kc3tsczgU+V4dnviEL56yPdbt8and/etOu3usuvnXLnnUrTGTd+1/W9hfjKGOZYKN4pWOofDViuv/5/5j1Wcs9ad2gDiPk3MAqUn5AmwUCE+a8joI0Tmdu9/tfvr1kBhh6svviRQBQl1im9Kv8qTYpCzSlM+DpOIG8BxZF5N8W9HPPhQn2peLGtSLS09XeZuff9qXZaYZJ/38rkueRNAdCkyqeZAQIzQuWJBy4zgp1TFLKIpctfpmkm6lKRsg4ecf2Rbg7CaA6hKH4MpVGFDyqROmvAxCUu7D+aMZfL/np36NBxiXN19icdjYT0yyDAOv+jJb83J+cbev7/t5S4bcOi84BPhdCeX+Af3f5Pc87RqqN97J73XGb2A/zkdiYkAwSWAkfJ6L/Iiljl+O3dZa3A06ZQME/0bDmj06eTMqAEKmcMjIqzyB9m7IzahcOHpw8Y9DHTBRBz9C0WL5CMgCcYIooHzhEGFdt+qJxaPXZXxqyoOZL9j4YFyu3cXveeYN49Nqk1b6KrjQEWeF9vjU4ifyYXNchcNzZN1JUzJAwo0nPw9e/47cMQkuHS86X0F5BCo5JPfTLa93jd/tjP8bNbyVNS5BkOGFcElfOuB1NNWRfIMtcydMhdcD8Yao3/Osif/v/LwzlgOHRxtiIfgpZjGIajBlGc5D3AAeMepOmpIBggfWjsZJbXz6lMAAKNmUJ2ViPlMsbzyjjOjkPG9v+BdLEr4t8WLpgw7Pvho5flqm+nCwRT4d/OqL3c8+vO9wD73NydI2hPuLWSQNAJouGEUMSsOZY4eyoaGtosSkkyl3oxBv0pjpnrj7PepjgogC1w4e3q9gkAzft3jY7f2asa+vPZ7+rYaj6nSR6/ZQjpRJgiShLBAHiAIsp25DGZ/yvYpVeimFsKTi7ps70z305Ew3Bwu4fmyzsa1Y8VQ+ntF+xYnG1/HELA54JDhYWoAUjvLkPQcBzPjvMiJE51KklCdlKpUXwKq8u1Cu3OTCo/71e51zR7j2JPzhyL9quM/YPVstuivpUxQUApAVfj4uQmw9KUucUVsNVfkUw+BKnCRnmyPQN8VY8NVIm+JG4gZodh1IrANM1sGFjOfA1Fnu2mf6nONLS2CjfphOqeqhY8R95ZWWDyiCnwRM1/5INeVmEAxE/hFOBbRwMkE05qrDkWrQsEh5UP7xaYY/P1YYD4KT9eyLeUPaf6NmW5Ql6rnBAd44nDKvB0IwrIXHRXbDTPl66LUN8HulW/V06VmoaBuu3NakGpNrdmrE0uGpLYh7DBTBKG2DeQjCLiWqM2VS+OkHdnQDg8uHl0hQTZ2KWirfTGsBGIU5/Znf5wt7jZdx4ScfWdcN9j8M3dYsjnzlxrl8Uh1YxnFWnUU2zcADgLPW3MzvdeYTUtSFn7D0pK2h78FQdD66x//U3cxC50b6qG2kjdKI7G/QQLP6zl/t9/l8V+6HTK0ZZHAwfxyj0Ykb8ZR3Q2Nw9B3R5QEjwHoOEty24ccn/LHGQ3nOzMsSpEwVyqM9UkmpAzNDvRt0iA+0onYz56C4limVPP6kSZ0r4AG/fs4gZ6alE82Haz/4HDc0sADLoqPwhyp+FRh2lewv9E/sV8WKMs1IqJYpZZGaW4jVZRQlxflaefz5FscuJUWmS90PdxuWfej5rr//rwAU3xmMqe6IEgczHQCVbUTb1i87AAdP8xo1ONY8bTvC7t1Dbs5zXyQ378badJv6cvHjsd/h4oD/GA4icclS0qeYPlo4cZt+WhePsD8dv0rlDr/PuTu1bntiSqfODNLffyyO5jNr/RMDJWMVB0z5uFvIRn+rG18NJKXEMOXbvWu3PJ7lMaAeKsMyHVBSJvaleXmG/CaH1U1d/+N8PdD3YsGEkHD1cW9wf//tuej332s66Lb9gh0xilqV8eSAMi+rrlWj9yTuTIkACdecMBuPlRwjQHH5kwJGMAiSppRXWV0ysZ7mqXwrqm0ppWwjXvNIZVBjo+X+NPiUSntaObad1peiwEu+ExIgctn1msfORaAeV2tY1F9VUyr6xrKU13LSVP9xsR9tavt17UVdgu/aEmtq3CjMMvxJH/8fEMcCWqSywdsLmvKxnNEgdRgVCd9pfZ6vUJZU+IRyHVz0rf0llKPKOko7qV/TZqwb8HqgK08Y9+WDHHSueuRS6HicrO1r+o52iM7Rjk70p62CN6jarbST+jU6FPbnbaVtl8fPZXMg1JU0NQIkDMUXMtAp0w2YyD4p8eEARdoKUG1DRDkQMTGfqShne8xjo0nbcXe476iTyCTyWk8p62k7Ka/lLBZeGLBRHxcvTsTssRI5Ea8OLkUHBw73wa5jf1PNftWnjkadBcuxojK6+l0PkHDl0Xhpsnt1Q/XLA1oHIJCTPFKimFDyPKopTY+WeoRip1KPDFJdf2wPbah8wTNP85Wy/8jLOg+89B9poyNs0Wc4OCx930bcHZc0+Ow50G+P6WN/E6uL8Sjdd2kiPhHZ3T8H4Zva6cTNUo0DR6FUvBHfKK9R+9q2UsqkfLkOfL04T2JZ0zVzUjHVJckWVvvixYmBf+I8wX2sLDLS/XDFUfvgZt8xRb1O+lc9WCnli0YiM1H2t+qTZcS5S6mLXWMsrj12M9e/+i9AAI8oMHE0qZKOqvKdqjnS+iOVp46tUrv2WpR7vG1+nU02wyVf/IFpdCksPXKuW1X5HaauOBu1w6+FPk1V8AiT8DeM04OgD2K4nsSNpBUIrBW4S8SvTeEdx3roj41k7lBw27cf3yb6eP+Y3++8DZuqNIEF3Z1B+lfjBNLhC0YEBknwwU/clXzNyyVqf+XoAieoOQJpZYiKf2C/WXzp0Unrl+XL7esl2+IyrvaRqpX0L0stNspDL5PyUaH0MmsIG7inH+Lrgc4X0dH8rPJH4/Hw4aVa2Z5ym53b/2s4/xV44ffNLhu6ze93Af5o1XkK//MuvJw6Q4C0sJ/N6VgrhCk+nXc3rpJdC5Bw60lz3N+f4YsE4D+KSARJTdRspZqvVOuSSiJD4ZghBzLwekDTIm2PYuw7ihe86sNA4LmDBoTycm4hHebdRba456HyRaRrhxRMeOmbfWievB5o9AHi8Hqk8bKfz7L5ykVQ7ot+/2/8Qk0cHeUBQm1Uiqw6+xMxdqSiVR0gZk5u6lqAIDgw7WZzCxBGY7cCqLRorMhAqylf2i0/ukJZzaM+OrMoTfPIl5PKFRQCehSkrPKkmlRW9sM24UdHzMMRepkWd0rDj47cDveSXp7LJ+2Pxn4f/uLcjCP82867vtP+W8rJBQpItLW/ZStdKexegLjqiWIxx1IPEMqn4zsSWNiOtsF6yjdtTwsilfrgx0sf1YGUqdSd9MO8tL/8uyLLRH4kP0PZwmEHjBW1be23rj0tiFT0CLe5St8bseYf0TKqrumajDBbdkvdNbRfxqCmcld3unKZN/zwnfNxdH5FvrQAapxqZZmRUPEmItpik6MvykkbbjyfZBlpnOaVNmpXlk6QJ5WjXuS1bdYh36huozztq1n/qc0F794crjpii5F7RbZNPQYjtv9Z1zdz/5GeY7TVlf8hSbFQrAqbiXPEVanKFLRtLxMi0J0ZRN7UTkCQIhGe4Mi6P82UkvxHjy7pEZclqXjK8xAlAxMrKC801tM22U75nKN8kq1tKy0fAhk8bEOCiO1hE5vYOJLUw09RX/OkNMriS7v9+A6KcyfF3M5IwAdo2HDa9sjtPx8zxyOddTgCqRA2G9atpGOqb9Pxj+M3gi7HS3TSZ5BwGY6OWfbm4qhOZ9WNVqnzioWKHqkCG2laJLIUiZmkspWOoCyWvvLmatoUzxKBWMg2wGq/UhTzmrUv4uhTU1t9EtvVbqHhCJyLrK3NdESD22js9rufdtTXCITC5YfhW+vZJo3Ho5n92oEMAHaUav7k0cmfQcLA8QCsSWAqEEoJRCM+yfOVd/uDL/rq5EFW31P4waLtcPnzrmFdo34yO4HXAyCzJa++jTxH7cJfWQdXLUYensBtn+S5qxVPzM3bbtVf0X7SqOYhK1QfTgrGh61mRxa4sKvO7E/6TvRLcieLbeKoE9N9uPTYtfDo8hE5YDA8P1rmNOUlKAhMmy24lW7WrO9OjLadt+oP+tYvIY3X23D2iHaRr5nFoi0yqyhfkte6pCN5PdCKf6yf98W+k03ai32Rb7f1je9TszjX3BKYHFnoVNanjJeUR0zqdO18PMZTclIDxLmnDwdg6w4DxjHjwMUkgIEX52rgYOmJM/lK+N64n1CqLiOlPnxFqqgN3FG+mT0i08x+vB7oB4fuK222+9li1hO4ghVyLNGeBkkZL+ohecS2Ib6vaNdVp+X4j/sMN7ga7zYOazcdTzbWyfhLsHTa8/jKTVqAyMvS5JvYBEUHqEy1jDTloxyyCqcTvvXXoigyaWmNtfGfDrwNXvRWJ0Xv4qyk3GiH0rLtaVmUr3b2EVC/w9cG0fbjdbiimVq82Dnzon5URhxUlELwVI+S/5DkUqP+lZXCI3+6AhcoXjMm+1O8Rq3N2CpOWoC47x3yJgzWVvkgJgOTDlDuPbAoDpiWFQNKJ2IZqMt+7xdcfNvYzB+/2v4tX/snHOJbdU5aczCg3dGG1Da1t0xDNj9c8vbOjurB5ecP0m60i30xqQ5sX/IivpxNmEcqW9jeXfKH06TOKH/CDw7B+djj+PhQlR/UGe5b+JHaH/VMbRqlXqOtNnkB4rL41G40WgYrAYAgyPQfaTp46jg1TuW+PlqjJ6xeX8DFgsS+dnxqTzP7Q7yh2k7pEB4YDr7omIJxDALhS3ineYWu2cnhkoMuDRcf8sJ2Xabl4dKDXx4uWXCBG6zeCT227QiHTuwXP0h7mlxer69MaK8A76V4DOKPGINSf3pJo5RdaMMBVRlmRt771a6vsrFf8H08STq1UvjugTdAo91yrcr6l3VV20gbJdT3lX43G68HOuBbLV8PBKd+F2YwHDS0T7anPGmjVO4/lcdTu97/GJB/xc2as9wf8O1H0xbCtYc9xz29cntXreyMj57yZX87FuNTDHPaXlpb+XL/mq801vfuMf+Oy3r4ad4hHAXrgoMg8OhGkEiZSoDJLkAiZeI0LTfissv9gsumXHDkSsKhXMgDRMYXP6QNUwf2Z/i76aoV7V8PtNasy9wzq78ErPBuK+2wRPUmJikT5RTjPEN+c4UDVhee36bf161a6RD4+MkecJXKLNSb6x5fuR7kIFMdtk/bKsYLzenzV7HlWtKB/aKjNlhbezL2JnyJhdljXRiySFDU9a+uTWmh5EVTlddyWXIBRNJ0ydWHTxJM1TSjchkc6LEafSVC4IxiX6SprWpLmke+sD8cK1eFVK4B9W/+7lOocK04PetKW0mf1CHFsGg7yjaST/NCFS9OCC/HifyL0fZcNBZ9B+1qkvaxQ5r2NWb70V6X0oQHCN7MfaS8tiUFuwCM4HIQ46a8lpepHBnDfW7BZdd3Ca+23WLZN4Cj5jdyuziwtC06ofJqV25PB/bjvbgP//qg9p3jxqLiLH2hb6VpX9p/maYy5Os2Nsf8vNncLvLN7Bsv+9lhd9KEBohcMqxWcee8EdjMI7BKI8gKdk1ZUh9/KBrN16ImFd7Qx5P1/L5EU9vVbqXt7G//EVD/nz/8Cez8NvoGiZgpbalHlC3LaN2ivZLD14xVOpZpe7J+frixD6R1WtivM9OkDmLe2YQGiPvu/74FA/Wi4ghTBlQGIIIuPJUiuDkpeM3wYQh3zi+k1FROfuFlf4Z+14ndYk+jwY92ExO1j3aLfMxSXmjYOXznbe1fD7Rm5SQsb5os8SKwGgh5u0n/pXKV65TWtQfbfHYaLvkua+gDIt+h/YSmC2liA4SfURMHiJYRaKamgAMsKSNtsFXDlVjC/D1vZIr/hkZ31sdq/xAulbdO/oAf4q56ZTE8czA/D4B8cU4ATOVoDMoDu/JFOfSTvBgoyms5x4S8jk2dg7Nd1C3K/TK3cPtPFhqPZfyLRiaXmbAACRft90ocOeYRr2HAInh5Zp5fA2iUVQzKgPopdOdcdWxGN93+KgT738bVfryJPVz8VjzW3jr5w664GuAeiCtUA4J9gXd0fD1AsRnFWHg6OFLh4KXxygvlt4aNzWo3OfW3uzXW2F8+Py39JcGjguyHfNEfd6MO7EB1U8q8SU4TFiCuOph/50OMJwgRRaUKUkrLgFF2uP6D7rAd8DK06ZHyF1KH8xL9oXiCQ2q38q3tJxYz8Xm6YztBwC+66koEyAHAHW9JKWEvuKbYwikLnMlHPeuolql8E+qyG9x6lb0x2z8jusqsU9JBdUppK/s7MXoCZCYkQMI3938uUF5YExQEW4HSKbtMCRbzFDTWIS8D5S+Qo9EEgDBhTfYhQDxuFKijjcn+iIVzx4Rlh3f01Vd/2NVXu76Ar2I5PPqRYNkQ3wblKqe0zoFLAZLb+kk3Z635fr8rav+yy/5Hbf+EjVDbhickQFzWj29P8H2qAEUHRkCmPhyIJkkGAGVyNGOgxAFgRl/fBU1qTdlsf+iPH8KNNnyLMDqfaDoa+xUL4lndwD3w94WdGu0PW3q3W3TNbsDyWMCIhynRlh6YqFfNAYn9sA9Q2ZQnxcakNN8b/vVuKW7i7uwXL12CmQN3D9PEurF+QdPyyLNPJu2/GP+Yn5dO6u+4B4jc0ArpC5MVbFICrTTlVSbNi4CyjnfX+UVX/nVSkRm3znCyrgM+WvtVl8KB2l/y1SqkvCzuD7/uy3gDGb8v+C7guVwcVpydmDfbdKx0fErUhWdR+ZuYpXb2h1+7j190zZ1pvwU/XvYXDU4e0717+JNno/XUAIFw/hu3xf9p9kZw7IIbm/jSlHu+HNzpEfHYhEDKefUS77FcdHhzo7sBUbfMuY2X+sUX4hynd5Oa3rsWmmUdIRAu2BsvVnAbIwDmur7qXJf59bGPpwLcCjxV8pSbUb3fbb3lX+S/Jx21aEKGgCFgCBgChoAhYAgYAoaAIWAIGAKGgCFgCBgChoAhYAgYAoaAIWAIGAKGgCFgCBgChoAhYAgYAoaAIWAIGAKGgCFgCBgChoAhYAgYAoaAIWAIGAKGgCFgCBgChoAhYAgYAoaAIWAIGAKGgCFgCBgChoAhYAgYAoaAIWAIGAKGgCFgCBgChoAhYAgYAoaAIWAIGAKGgCFgCBgChoAhYAgYAoaAIWAIGAKGgCFgCBgChoAhYAgYAoaAIWAIGAKGgCFgCBgChoAhYAgYAoaAIWAIGAKGgCFgCBgChoAhYAgYAoaAIWAIGAKGgCFgCBgChoAhYAgYAoaAIWAIGAKGgCFgCBgChoAhYAgYAoaAIWAIGAKGgCFgCBgChoAhYAgYAoaAIWAIGAKGgCFgCBgChoAhYAgYAoaAIWAIGAKGgCFgCBgChoAhYAgYAoaAIWAIGAKGgCFgCBgChoAh0C0E/h+Dj6KkHVJxAQAAAABJRU5ErkJggg=="
                    />
                    <p
                      className="hovertitle"
                      style={{
                        marginBottom: "0px",
                        fontSize: "9px",
                        marginTop: "2px"
                      }}
                    >
                      TEXT
                    </p>
                  </p>
                }
              >
                <div
                  style={{
                    padding: "10px",
                    background: "rgb(250,250,250)",
                    marginBottom: "10px"
                  }}
                >
                  <p
                    style={{
                      marginBottom: "0px",
                      fontSize: "22px",
                      color: "grey",
                      fontWeight: "bold"
                    }}
                  >
                    Text
                  </p>
                  <p
                    style={{
                      marginBottom: "0px",
                      fontSize: "12px",
                      color: "lightgrey",
                      fontWeight: "bold"
                    }}
                  >
                    click to add
                  </p>
                </div>
                <p>
                  <p className=" marginbottom10 ">
                    <button
                      className="btn btn-sm aligncenter"
                      onClick={this.addHeading}
                      style={{
                        backgroundColor: "transparent",
                        fontSize: "42px",
                        fontFamily: "Times New Roman",
                        fontWeight: "bold",
                        color: "black"
                      }}
                    >
                      Add Heading
                    </button>
                  </p>
                  <p className=" marginbottom10 ">
                    <button
                      className="btn btn-sm aligncenter"
                      onClick={this.addSubHeading}
                      style={{
                        backgroundColor: "transparent",
                        fontSize: "22px",
                        fontFamily: "Helvetica Neue",
                        fontWeight: "bold",
                        color: "black"
                      }}
                    >
                      Add Subheading
                    </button>
                  </p>

                  <p className=" marginbottom10 ">
                    <button
                      className="btn btn-sm aligncenter"
                      onClick={this.addALine}
                      style={{
                        backgroundColor: "transparent",
                        fontSize: "16px",
                        color: "black"
                      }}
                    >
                      Add a line
                    </button>
                  </p>

                  <p className=" marginbottom30 ">
                    <button
                      className="btn btn-sm"
                      onClick={this.addIText}
                      style={{
                        backgroundColor: "transparent",
                        font: "8px",
                        whiteSpace: "pre-wrap",
                        color: "grey",
                        textAlign: "left"
                      }}
                    >
                      Lorem ipsum dolor sit amet,nconsectetur adipisicing
                      elit,nsed do eiusmod tempor incididuntnut labore et dolore
                      magna aliqua. Ut enim ad minim veniam.
                    </button>
                  </p>
                  <p className=" marginbottom30 ">
                    <button
                      className="btn btn-sm "
                      onClick={this.addTextThreeTemplate}
                      style={{
                        backgroundColor: "transparent",
                        textAlign: "left",
                        whiteSpace: "pre-wrap",
                        fontSize: "42px",
                        fontFamily: "Times New Roman",
                        fontWeight: "bold",
                        color: "grey"
                      }}
                    >
                      <p
                        style={{
                          width: "100%",
                          fontSize: "32px",
                          marginBottom: 0,
                          fontWeight: "bold",
                          fontFamily: "Times New Roman",
                          minheight: "40px",
                          background: "transparent"
                        }}
                      >
                        Hey there!
                      </p>
                      <p
                        style={{
                          width: "100%",
                          fontSize: "16px",
                          fontWeight: "bold",
                          fontFamily: "Monaco",
                          minheight: "20px",
                          background: "transparent"
                        }}
                      >
                        How it going?
                      </p>
                      <p
                        style={{
                          width: "100%",
                          fontSize: "22px",
                          fontWeight: "normal",
                          fontFamily: "Monaco",
                          minheight: "24px",
                          background: "transparent"
                        }}
                      >
                        Im doing fine, how about yourself?
                      </p>
                    </button>
                  </p>
                  <p className="marginbottom30 ">
                    <button
                      className="btn btn-sm"
                      onClick={this.addTextTwoTemplate}
                      style={{
                        backgroundColor: "transparent",
                        textAlign: "left",
                        whiteSpace: "pre-wrap",
                        fontSize: "42px",
                        fontFamily: "Times New Roman",
                        fontWeight: "bold",
                        color: "grey"
                      }}
                    >
                      <p
                        style={{
                          width: "100%",
                          fontSize: "32px",
                          marginBottom: 0,
                          fontWeight: "bold",
                          fontFamily: "Times New Roman",
                          minheight: "40px",
                          background: "transparent"
                        }}
                      >
                        Hey there!
                      </p>
                      <p
                        style={{
                          width: "100%",
                          fontSize: "16px",
                          fontWeight: "bold",
                          fontFamily: "Monaco",
                          minheight: "20px",
                          background: "transparent"
                        }}
                      >
                        How it going?
                      </p>
                    </button>
                  </p>
                  <p className=" marginbottom30 ">
                    <button
                      className="btn btn-sm"
                      onClick={this.addTextSideTemplate}
                      style={{
                        width: "100%",
                        backgroundColor: "transparent",
                        textAlign: "left",
                        whiteSpace: "pre-wrap",
                        fontSize: "42px",
                        fontFamily: "Times New Roman",
                        fontWeight: "bold",
                        color: "grey"
                      }}
                    >
                      <p
                        style={{
                          display: "inline-block",
                          fontSize: "16px",
                          marginBottom: 0,
                          fontWeight: "bold",
                          fontFamily: "Times New Roman",
                          minheight: "40px",
                          background: "transparent"
                        }}
                      >
                        Happy
                      </p>
                      <p
                        style={{
                          display: "inline-block",
                          fontSize: "16px",
                          fontWeight: "bold",
                          fontFamily: "Monaco",
                          minheight: "20px",
                          background: "transparent"
                        }}
                      >
                        Birthday!!
                      </p>
                    </button>
                  </p>
                </p>
              </Tab>

              <Tab
                eventKey={3}
                title={
                  <p className="hovertile" style={{ marginBottom: "0px" }}>
                    <img
                      className="hoverimage"
                      style={{ width: "30px" }}
                      src="data:image/png;base64,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"
                    />
                    <p
                      className="hovertitle"
                      style={{
                        marginBottom: "0px",
                        fontSize: "9px",
                        marginTop: "2px"
                      }}
                    >
                      SKETCH
                    </p>
                  </p>
                }
              >
                <div
                  style={{
                    padding: "10px",
                    background: "rgb(250,250,250)",
                    marginBottom: "10px"
                  }}
                >
                  <p
                    style={{
                      marginBottom: "0px",
                      fontSize: "22px",
                      color: "grey",
                      fontWeight: "bold"
                    }}
                  >
                    Sketch
                  </p>
                  <p
                    style={{
                      marginBottom: "0px",
                      fontSize: "12px",
                      color: "lightgrey",
                      fontWeight: "bold"
                    }}
                  >
                    click to add
                  </p>
                </div>
                <div>
                  <div
                    className="col-xs-4 aligncenter marginbottom30 "
                    style={{ padding: "0px" }}
                  >
                    <button
                      type="button"
                      style={{ backgroundColor: "transparent", padding: "0px" }}
                      onClick={this.addHalfArcSolid}
                      className="btn btn-sm hovertile"
                    >
                      <div style={{ width: "80px", height: "20px" }}>
                        <svg viewBox="0 0 100 20">
                          <path
                            d="M10 0 C 0 0, 50 20, 100 0"
                            stroke="grey"
                            fill="transparent"
                            stroke-width="2px"
                            strokeDasharray="0"
                            stroke-dashoffset="0"
                          />
                        </svg>
                      </div>

                    </button>
                  </div>

                  <div
                    className="col-xs-4 aligncenter marginbottom30 "
                    style={{ padding: "0px" }}
                  >
                    <button
                      type="button"
                      style={{ backgroundColor: "transparent", padding: "0px" }}
                      onClick={this.addHalfArcDashed}
                      className="btn btn-sm hovertile"
                    >
                      <div style={{ width: "80px", height: "20px" }}>
                        <svg viewBox="0 0 100 20">
                          <path
                            d="M10 0 C 0 0, 50 20, 100 0"
                            stroke="grey"
                            fill="transparent"
                            stroke-width="2px"
                            strokeDasharray="2"
                            stroke-dashoffset="0"
                          />
                        </svg>
                      </div>

                    </button>
                  </div>

                  <div
                    className="col-xs-4 aligncenter marginbottom30 "
                    style={{ padding: "0px" }}
                  >
                    <button
                      type="button"
                      style={{ backgroundColor: "transparent", padding: "0px" }}
                      onClick={this.addHalfArcDesign}
                      className="btn btn-sm hovertile"
                    >
                      <div style={{ width: "80px", height: "20px" }}>
                        <svg viewBox="0 0 100 20">
                          <path
                            d="M10 0 C 0 0, 50 20, 100 0"
                            stroke="grey"
                            fill="transparent"
                            strokeDasharray="3"
                            stroke-dashoffset="5"
                          />
                        </svg>
                      </div>

                    </button>
                  </div>

                  <div
                    className="col-xs-4 aligncenter marginbottom30 "
                    style={{ padding: "0px" }}
                  >
                    <button
                      type="button"
                      style={{ backgroundColor: "transparent", padding: "0px" }}
                      onClick={this.addHalfArcSolidThick}
                      className="btn btn-sm hovertile"
                    >
                      <div style={{ width: "80px", height: "20px" }}>
                        <svg viewBox="0 0 100 20">
                          <path
                            d="M10 0 C 0 0, 50 20, 100 0"
                            stroke="grey"
                            fill="transparent"
                            strokeWidth="4px"
                            strokeDasharray="0"
                            stroke-dashoffset="0"
                          />
                        </svg>
                      </div>

                    </button>
                  </div>

                  <div
                    className="col-xs-4 aligncenter marginbottom30 "
                    style={{ padding: "0px" }}
                  >
                    <button
                      type="button"
                      style={{ backgroundColor: "transparent", padding: "0px" }}
                      onClick={this.addHalfArcDashedThick}
                      className="btn btn-sm hovertile"
                    >
                      <div style={{ width: "80px", height: "20px" }}>
                        <svg viewBox="0 0 100 20">
                          <path
                            d="M10 0 C 0 0, 50 20, 100 0"
                            stroke="grey"
                            fill="transparent"
                            stroke-width="4px"
                            strokeDasharray="2"
                            stroke-dashoffset="5"
                          />
                        </svg>
                      </div>

                    </button>
                  </div>

                  <div
                    className="col-xs-4 aligncenter marginbottom30 "
                    style={{ padding: "0px" }}
                  >
                    <button
                      type="button"
                      style={{ backgroundColor: "transparent", padding: "0px" }}
                      onClick={this.addHalfArcDesignThick}
                      className="btn btn-sm hovertile"
                    >
                      <div style={{ width: "80px", height: "20px" }}>
                        <svg viewBox="0 0 100 20">
                          <path
                            d="M10 0 C 0 0, 50 20, 100 0"
                            stroke="grey"
                            fill="transparent"
                            stroke-width="4px"
                            strokeDasharray="3"
                            stroke-dashoffset="5"
                          />
                        </svg>
                      </div>

                    </button>
                  </div>

                  <div
                    className="col-xs-4 aligncenter marginbottom30 "
                    style={{ padding: "0px" }}
                  >
                    <button
                      type="button"
                      style={{ backgroundColor: "transparent", padding: "0px" }}
                      onClick={this.addHalfArcSolidFull}
                      className="btn btn-sm hovertile"
                    >
                      <div style={{ width: "80px", height: "20px" }}>
                        <svg viewBox="0 0 100 20">
                          <path
                            d="M10 0 C 0 0, 50 20, 100 0"
                            stroke="grey"
                            fill="lightgrey"
                            strokeWidth="2px"
                            strokeDasharray="0"
                            stroke-dashoffset="0"
                          />
                        </svg>
                      </div>

                    </button>
                  </div>

                  <div
                    className="col-xs-4 aligncenter marginbottom30 "
                    style={{ padding: "0px" }}
                  >
                    <button
                      type="button"
                      style={{ backgroundColor: "transparent", padding: "0px" }}
                      onClick={this.addHalfArcDashedFull}
                      className="btn btn-sm hovertile"
                    >
                      <div style={{ width: "80px", height: "20px" }}>
                        <svg viewBox="0 0 100 20">
                          <path
                            d="M10 0 C 0 0, 50 20, 100 0"
                            stroke="grey"
                            fill="lightgrey"
                            stroke-width="2px"
                            strokeDasharray="2"
                            stroke-dashoffset="5"
                          />
                        </svg>
                      </div>

                    </button>
                  </div>

                  <div
                    className="col-xs-4 aligncenter marginbottom30 "
                    style={{ padding: "0px" }}
                  >
                    <button
                      type="button"
                      style={{ backgroundColor: "transparent", padding: "0px" }}
                      onClick={this.addHalfArcDesignFull}
                      className="btn btn-sm hovertile"
                    >
                      <div style={{ width: "80px", height: "20px" }}>
                        <svg viewBox="0 0 100 20">
                          <path
                            d="M10 0 C 0 0, 50 20, 100 0"
                            stroke="grey"
                            fill="lightgrey"
                            stroke-width="2px"
                            strokeDasharray="3"
                            stroke-dashoffset="5"
                          />
                        </svg>
                      </div>

                    </button>
                  </div>
                </div>
              </Tab>

              <Tab
                eventKey={4}
                title={
                  <p className="hovertile" style={{ marginBottom: "0px" }}>
                    <img
                      className="hoverimage"
                      style={{ width: "30px" }}
                      src="data:image/png;base64,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"
                    />
                    <p
                      className="hovertitle"
                      style={{
                        marginBottom: "0px",
                        fontSize: "9px",
                        marginTop: "2px"
                      }}
                    >
                      PICS
                    </p>
                  </p>
                }
              >
                <div
                  style={{
                    padding: "10px",
                    background: "rgb(250,250,250)",
                    marginBottom: "10px"
                  }}
                >
                  <p
                    style={{
                      marginBottom: "0px",
                      fontSize: "22px",
                      color: "grey",
                      fontWeight: "bold"
                    }}
                  >
                    Pics
                  </p>
                  <p
                    style={{
                      marginBottom: "0px",
                      fontSize: "12px",
                      color: "lightgrey",
                      fontWeight: "bold"
                    }}
                  >
                    click to upload or add
                  </p>
                </div>
                <div>
                  <div className="aligncenter marginbottom30">
                    <input
                      style={{
                        width: "165px",
                        marginLeft: "auto",
                        marginRight: "auto"
                      }}
                      className=" custom-file-input form-control-file"
                      accept="image/*"
                      type="file"
                      onChange={this.onImageUpload}
                      id="file"
                    />
                  </div>
                  <div>
                    <p
                      style={{
                        fontSize: "17px",
                        color: "grey",
                        fontWeight: "bold",
                        marginBottom: "10px",
                        padding: "10px"
                      }}
                    >
                      Your Pics
                    </p>
                    <div
                      className="aligncenter marginbottom30"
                      style={{ whiteSpace: "pre-wrap" }}
                    >
                      <p
                        className="aligncenter"
                        style={{
                          marginBottom: "10px",
                          color: "lightgrey",
                          fontSize: "12px",
                          padding: "30px",
                          marginTop: "10px",
                          fontWeight: "bold"
                        }}
                      >
                        Looks like you haven&#39;t added any pics.
                        <br /> <br />You can upload them by clicking above or
                        try one of our templates below.
                      </p>
                    </div>
                    <p
                      style={{
                        fontSize: "17px",
                        color: "grey",
                        fontWeight: "bold",
                        marginBottom: "10px",
                        padding: "10px"
                      }}
                    >
                      Templates
                    </p>
                    <div
                      className="col-xs-4 aligncenter marginbottom30 "
                      style={{ padding: "0px" }}
                    >
                      <button
                        type="button"
                        style={{ backgroundColor: "transparent", padding: "0px" }}
                        onClick={this.addImagePreview1}
                        className="btn btn-sm hovertile"
                      >
                        <div>
                          <img
                            style={{ width: "100%" }}
                            src={require("../assets/images/adam-whitlock.jpg")}
                          />
                        </div>

                      </button>
                    </div>

                    <div
                      className="col-xs-4 aligncenter marginbottom30 "
                      style={{ padding: "0px" }}
                    >
                      <button
                        type="button"
                        style={{ backgroundColor: "transparent", padding: "0px" }}
                        onClick={this.addImagePreview2}
                        className="btn btn-sm hovertile"
                      >
                        <div>
                          <img
                            style={{ width: "100%" }}
                            src={require("../assets/images/dakota-corbin.jpg")}
                          />
                        </div>

                      </button>
                    </div>

                    <div
                      className="col-xs-4 aligncenter marginbottom30 "
                      style={{ padding: "0px" }}
                    >
                      <button
                        type="button"
                        style={{ backgroundColor: "transparent", padding: "0px" }}
                        onClick={this.addImagePreview3}
                        className="btn btn-sm hovertile"
                      >
                        <div>
                          <img
                            style={{ width: "100%" }}
                            src={require("../assets/images/luca-upper.jpg")}
                          />
                        </div>

                      </button>
                    </div>
                  </div>
                </div>
              </Tab>
              <Tab
                eventKey={5}
                title={
                  <p className="hovertile" style={{ marginBottom: "0px" }}>
                    <img
                      className="hoverimage"
                      style={{ width: "30px" }}
                      src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAYAAACtWK6eAAAAAXNSR0IArs4c6QAAEj5JREFUeAHtnQuQHlWVx8/p75tJhiAQIEBQiA8oywdLeMxkEhMTYgQjRsvC4K7sRlZdsiFkguKilqVisQtbq2VlJkCM7xAtJUmpCxYPcRcWQmYm0RCyIuyuawJGkmBMNjGzmcnM18d/98zIZGbyPW7f/h6Zf1fNfN197zn33l/f0/fZ94rwIAESIAESIAESIAESIAESIAESIAESIAESIAESIAESIAESIAESIAESIAESIAESIAESIAESIAESIAESIAESIAESIAESIAESIAESIAESIAESIAESIAESIAESIAESIAESIAESIAESIAESIAESIAESIAESIAESIAESIAESIAESIAESIAESIAESIAESIAESIAESIAESIAESIAESIAESIAESIAESIAESIAESIAESIAESIAESIAESIAESIAESIAESIAESIAESIAESIAESIAESIAESIAESIAESIAESIAESIAESIAESIAESIAESIAESIAESIAESIAESIAESIAESIAESIAESIAESIAESIAESIIExSkBrOd32jemny2F9g2TCMyW0M8Xwp3KGmOA3usa56nikcb+I7RcL9uM+znEd/VrwvEw+f5teuz5X7RxsZdPrJJSrkKapiOubkM4XkN5nJMg+qS3tm6s9/rUav5oyELt7zskSds9CxniHWDgX0KciwyRLg+oh6Nkkok9IgL+zz9sCgzlaTQ/U2hr/Dulcgb+TRo2X6ioZf/YndfED/z+qe8KbA9znShhOAadJeLlMxDMIEqr1IK45PP3fIS478KJ4Tpe1/6cHpceoSJa5jlGVzoXd1TRdcjo/NgiVJmSSunRCGtSqR3D2Y8kGrXpTR+fg3Ur9WmvTKmSAvy8YvsrzMnHi5brop10F/RbpwdpmvEGsD4ZpV0KkvkixSnp7SCT4tN7cud1XJKrWQFCluEpy9jkk9G2+Elu6Hu3EG6pNxk9dr4u/1lu6fDIJWzGjUbS3s+hSUvWLunzzbclC7ZeGYb4fhrEWVxN86CufDrzg6oLLdGnHcz7CrDoDsbbmBWK5zyFTNPpIoCcdu9GW+Qwy3xpP+opSY62Nj4PD7KI893vqkobxF+riJ3eXIDPCq901Y4rk+rbDQE4Z4VgTN3SbLO+8VFUt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5DDs8GwQQ7Wr/recM+XbIpuH3uV5DRJIvQ0ylEm8SafWvw9v72eH3j/BzvdJNnM1qldHT7B0jcnklNVAIsK6fOOLUndSM05/eMIRV/mlaDCjf5A0YepUHQ1MexKF7BpuNGvihnNPuDZX2Q0keni69PHDsnzzB9Cz9Xn8pVjXSZRViheOModKq0yc2IwOif8pXjCPT1PXLelezKO1sJOZa7i7BvaRLxxGDfkobxtkCBjtX4Hvdmtr3oaGwnfReD9liHPtnKo+LFn7jC7dgnR4PFR/4/bqgFySIyM70KFR+mG2o3Sh6peoSAkyFIu2dDwgQWYayhW30eqhysp3HmLwcwPaGpehd26+d+OI06FuGS5ABk9yNGTcDEwThpskzinKVtxAorTpsvbnsWPpDJHgSlw+lWJ6E6rGNy6qaySTfQsMY6He1LE1ocLji79q3HNuMxCC/zi+0sIu/WNKDp0oGmwsrL32fFSFgQxi05s7H9Wbt8xEfX4ezOaJwfsV/1UsE6T6FclmL4BhXB8ZdNpx0r99vBsMvlBiOA9pS3siA4nDC+RTJYWr+is55/w1JcnUiGet5nhi7tUcCcNoBH4u6uNl/jZEX8bA4wbJyH2y9OqNlWiA2rqFGdn9wna0z95cxHNCta/uYl2+KVqTOPGBwdd/R7hXFKdIF6AG8JPi/NaWr6o2kEGUyCj1smfXdBgLShZ7J0oYbI4Tj6YPekn+G+1UJBplrs3oqv2hnHPeY9UwVcRaZ54vcvR7SG80GDr6oboXcf8IetAeHN1D6XetbdYkse5v4sW0II90lwTycezR8fU8fmraqSYMZDjheOr70UNXSM5mI2O8GgaDpYJsEs7PxAONzkfvnYsmTJochP+D8ButrrgNpQTaEfq0jJv6q2pdun+gJPk04rsQ8ce+I0hf1D1uUcM4eEKC+tR2WbK2psUwzo9gQ6JoBkTDwLPYDWadqHbe6q1be/hDrpLrmjSQfOyiWbmyatZp0tsLQ5FTpC57WOzoQZmUPRiP5OcTrgG36BsVCfZdIA31L5Zz75HYSPfuulCyur8cG9fUwKNgFEmABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEDgT0Vbny6I3pR4AAAAAElFTkSuQmCC"
                    />
                    <p
                      className="hovertitle"
                      style={{
                        marginBottom: "0px",
                        fontSize: "9px",
                        marginTop: "2px"
                      }}
                    >
                      GIFS
                    </p>
                  </p>
                }
              >
                <div
                  style={{
                    padding: "10px",
                    background: "rgb(250,250,250)",
                    marginBottom: "10px"
                  }}
                >
                  <p
                    style={{
                      marginBottom: "0px",
                      fontSize: "22px",
                      color: "grey",
                      fontWeight: "bold"
                    }}
                  >
                    Gifs
                  </p>
                  <p
                    style={{
                      marginBottom: "0px",
                      fontSize: "12px",
                      color: "lightgrey",
                      fontWeight: "bold"
                    }}
                  >
                    Click to upload or add
                  </p>
                </div>
                <p className=" marginbottom30 aligncenter ">
                  <button
                    className="btn btn-sm "
                    onClick={this.addMeme}
                    style={{
                      backgroundColor: "transparent",
                      fontSize: "17px",
                      fontWeight: "bold",
                      color: "white",
                      backgroundColor: "rgb(43, 147, 255)"
                    }}
                  >
                    + Upload a Gif
                  </button>
                </p>
                <div>
                <p style={{fontSize:'17px',color:'grey',fontWeight:'bold',marginBottom:'10px',padding:'10px'}}>Your Gifs</p>
                  <div className="aligncenter marginbottom30" style={{whiteSpace:'pre-wrap'}}>
                    <p className="aligncenter" style={{marginBottom:'10px',color:'lightgrey',fontSize:'12px',
                    padding:'30px',marginTop:'10px',fontWeight:'bold'}}>Looks like you haven&#39;t added any gifs.
                     <br/> <br/>You can upload them by clicking above or try one of our templates below.
                     </p>
                  </div>
                  <p
                    style={{
                      fontSize: "17px",
                      color: "grey",
                      fontWeight: "bold",
                      marginBottom: "10px",
                      padding: "10px"
                    }}
                  >
                    Templates
                  </p>
                  <div
                    className="col-xs-4 aligncenter marginbottom30 "
                    style={{ padding: "0px" }}
                  >
                    <button
                      type="button"
                      style={{ backgroundColor: "transparent", padding: "0px" }}
                      onClick={this.addGifPreview1}
                      className="btn btn-sm hovertile"
                    >
                      <div>
                        <img
                          style={{ width: "100%" }}
                          src={require("../assets/images/blob.gif")}
                        />
                      </div>

                    </button>
                  </div>

                  <div
                    className="col-xs-4 aligncenter marginbottom30 "
                    style={{ padding: "0px" }}
                  >
                    <button
                      type="button"
                      style={{ backgroundColor: "transparent", padding: "0px" }}
                      onClick={this.addGifPreview2}
                      className="btn btn-sm hovertile"
                    >
                      <div>
                        <img
                          style={{ width: "100%" }}
                          src={require("../assets/images/giphy36.gif")}
                        />
                      </div>

                    </button>
                  </div>

                  <div
                    className="col-xs-4 aligncenter marginbottom30 "
                    style={{ padding: "0px" }}
                  >
                    <button
                      type="button"
                      style={{ backgroundColor: "transparent", padding: "0px" }}
                      onClick={this.addGifPreview3}
                      className="btn btn-sm hovertile"
                    >
                      <div>
                        <img
                          style={{ width: "100%" }}
                          src={require("../assets/images/source30.gif")}
                        />
                      </div>

                    </button>
                  </div>
                </div>
              </Tab>

              <Tab
                eventKey={6}
                title={
                  <p className="hovertile" style={{ marginBottom: "0px" }}>
                    <img
                      className="hoverimage"
                      style={{ width: "30px" }}
                      src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAYAAACtWK6eAAAAAXNSR0IArs4c6QAACxpJREFUeAHt3WuMXGUZwPHnmdmWthSbkioVgSaYEBSVSOwuitKlliomGC+xfvOSqBi63a0mJl6+9Avxk0mvJk2saUwwETUhUUFByrYlvQYaKbGJxlBv2JZbtTQtZec8Pme2M8zuvu+ZMztnZnaX//nQPee9nvd35umc98w5MyIsCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAwJwV0E6NzH629ko5e+4WEbtOJFlc7SfRRFTOSVlPyTuuP6brfnmpnf7H+zh7m5gsE9HFojY+HtP/erv/knfecHw6fdiPP7pUxiofEKmsaGf/gnUTuSDSd1JG1j6tuikJlpmUiOUkkNrmNCxrVfP+7UiA2Nb+B8Rsvb9wl0R3ROVFUb1bh4/8KVomI8M2D9wtmjzsfSyKFlM97XkP6MiRbdEyDRm2deA6seQRb/P9DcmdWVU5Ljrvszp84G9ZHWCZpXM5L6dljpamFClNSWkzwTb3f0sS+35mcKR9mLxdEtljO+68vtUubVv/hzw4fpMZHNU+7BoP1K1e/jPN+rCdg8skSfZ2JTiq++ZBmIztyNovLLN0GvLS/9CaWDaUbmm18ADxU6iv5N8Du1oqr381f/nLJRMZ8hfyFbnrVeTLTctePL/ay9zYtFyxBT6S2RyWmTyTMrMtJxXOu1logJhtStu7KW/n1XJmn2ulvD30hbKX/3QrdXxucnPz8upzji4vKv+J9YhlTCaSnmEZqZErudAAkZ8+fqWf0izI1XOtkNmttu2Oa2ubTf+e/uft3sfSpuUa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"
                    />
                    <p
                      className="hovertitle"
                      style={{
                        marginBottom: "0px",
                        fontSize: "9px",
                        marginTop: "2px"
                      }}
                    >
                      MEME
                    </p>
                  </p>
                }
              >
                <div>
                  <div
                    style={{
                      padding: "10px",
                      background: "rgb(250,250,250)",
                      marginBottom: "10px"
                    }}
                  >
                    <p
                      style={{
                        marginBottom: "0px",
                        fontSize: "22px",
                        color: "grey",
                        fontWeight: "bold"
                      }}
                    >
                      Meme
                    </p>
                    <p
                      style={{
                        marginBottom: "0px",
                        fontSize: "12px",
                        color: "lightgrey",
                        fontWeight: "bold"
                      }}
                    >
                      Click to upload or add
                    </p>
                  </div>

                  <p className="aligncenter marginbottom30 ">
                    <button
                      className="btn btn-sm "
                      onClick={this.addMeme}
                      style={{
                        backgroundColor: "transparent",
                        fontSize: "17px",
                        fontWeight: "bold",
                        color: "white",
                        backgroundColor: "rgb(43, 147, 255)"
                      }}
                    >
                      + Create a Meme
                    </button>
                  </p>

                  <div>
                    <p
                      style={{
                        fontSize: "17px",
                        color: "grey",
                        fontWeight: "bold",
                        marginBottom: "10px",
                        padding: "10px"
                      }}
                    >
                      Your Meme&#39;s
                    </p>
                    <div
                      className="aligncenter marginbottom30"
                      style={{ whiteSpace: "pre-wrap" }}
                    >
                      <p
                        className="aligncenter"
                        style={{
                          marginBottom: "10px",
                          color: "lightgrey",
                          fontSize: "12px",
                          padding: "30px",
                          marginTop: "10px",
                          fontWeight: "bold"
                        }}
                      >
                        Looks like you haven&#39;t added any memes.
                        <br /> <br />You can upload them by clicking above or
                        try one of our templates below.
                      </p>
                    </div>
                    <p
                      style={{
                        fontSize: "17px",
                        color: "grey",
                        fontWeight: "bold",
                        marginBottom: "10px",
                        padding: "10px"
                      }}
                    >
                      Templates
                    </p>
                    <div className="aligncenter marginbottom30" />
                  </div>
                </div>
              </Tab>

              <Tab
                eventKey={7}
                title={
                  <p className="hovertile" style={{ marginBottom: "0px" }}>
                    <img
                      className="hoverimage"
                      style={{ width: "30px" }}
                      src="data:image/png;base64,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"
                    />
                    <p
                      className="hovertitle"
                      style={{
                        marginBottom: "0px",
                        fontSize: "9px",
                        marginTop: "2px"
                      }}
                    >
                      SHOWCASE
                    </p>
                  </p>
                }
              >
                <div>
                  {/* <ShowCase
                    tabName={"ShowCase"}
                    onHandleShowCaseChange={this.onHandleShowCaseChange}
                  /> */}
                </div>
              </Tab>

              <Tab
                eventKey={8}
                title={
                  <p className="hovertile" style={{ marginBottom: "0px" }}>
                    <img
                      className="hoverimage"
                      style={{ width: "30px" }}
                      src={require("../assets/images/Soundcloud-logo.jpg")}
                    />
                    <p
                      className="hovertitle"
                      style={{
                        marginBottom: "0px",
                        fontSize: "9px",
                        marginTop: "2px"
                      }}
                    >
                      SOUNDCLOUD
                    </p>
                  </p>
                }
              >
                <div
                  style={{
                    padding: "10px",
                    background: "rgb(250,250,250)",
                    marginBottom: "10px"
                  }}
                >
                  <p
                    style={{
                      marginBottom: "0px",
                      fontSize: "22px",
                      color: "grey",
                      fontWeight: "bold"
                    }}
                  >
                    Soundcloud
                  </p>
                  <p
                    style={{
                      marginBottom: "0px",
                      fontSize: "12px",
                      color: "lightgrey",
                      fontWeight: "bold"
                    }}
                  >
                    Click to upload or add
                  </p>
                </div>
                <p className="aligncenter marginbottom30 ">
                  <button
                    className="btn btn-sm "
                    onClick={()=>this.addVideo('soundcloud')}
                    style={{
                      backgroundColor: "transparent",
                      fontSize: "17px",
                      fontWeight: "bold",
                      color: "white",
                      backgroundColor: "rgb(43, 147, 255)"
                    }}
                  >
                    + Add a Soundcloud Track
                  </button>
                </p>
                <div>
                  <p
                    style={{
                      fontSize: "17px",
                      color: "grey",
                      fontWeight: "bold",
                      marginBottom: "10px",
                      padding: "10px"
                    }}
                  >
                    Your Tracks
                  </p>
                  <div
                    className="aligncenter marginbottom30"
                    style={{ whiteSpace: "pre-wrap" }}
                  >
                  {this.state.objectList.map((item,index)=>{
                    return (
                      item.channel==='soundcloud' && <p>{item.videoUrl}</p>
                    )
                  })}
                  {!lodashFind(this.state.objectList, { 'channel': 'soundcloud'}) &&

                    <p
                      className="aligncenter"
                      style={{
                        marginBottom: "10px",
                        color: "lightgrey",
                        fontSize: "12px",
                        padding: "30px",
                        marginTop: "10px",
                        fontWeight: "bold"
                      }}
                    >
                      Looks like you haven&#39;t added any soundcloud tracks.
                      <br /> <br />You can upload them by clicking above or try
                      one of our templates below.
                    </p>}
                  </div>
                </div>
              </Tab>
              <Tab
                eventKey={9}
                title={
                  <p className="hovertile" style={{ marginBottom: "0px" }}>
                    <img
                      className="hoverimage"
                      style={{ width: "30px" }}
                      src={require("../assets/images/Vimeo_Logo.png")}
                    />
                    <p
                      className="hovertitle"
                      style={{
                        marginBottom: "0px",
                        fontSize: "9px",
                        marginTop: "2px"
                      }}
                    >
                      VIMEO
                    </p>
                  </p>
                }
              >
                <div
                  style={{
                    padding: "10px",
                    background: "rgb(250,250,250)",
                    marginBottom: "10px"
                  }}
                >
                  <p
                    style={{
                      marginBottom: "0px",
                      fontSize: "22px",
                      color: "grey",
                      fontWeight: "bold"
                    }}
                  >
                    Vimeo
                  </p>
                  <p
                    style={{
                      marginBottom: "0px",
                      fontSize: "12px",
                      color: "lightgrey",
                      fontWeight: "bold"
                    }}
                  >
                    Click to upload or add
                  </p>
                </div>
                <p className="aligncenter marginbottom30 ">
                  <button
                    className="btn btn-sm "
                    onClick={()=>this.addVideo('vimeo')}
                    style={{
                      backgroundColor: "transparent",
                      fontSize: "17px",
                      fontWeight: "bold",
                      color: "white",
                      backgroundColor: "rgb(43, 147, 255)"
                    }}
                  >
                    + Add a Vimeo Video
                  </button>
                </p>
                <div>
                  <p
                    style={{
                      fontSize: "17px",
                      color: "grey",
                      fontWeight: "bold",
                      marginBottom: "10px",
                      padding: "10px"
                    }}
                  >
                    Your Videos
                  </p>
                  <div
                    className="aligncenter marginbottom30"
                    style={{ whiteSpace: "pre-wrap" }}
                  >
                  {this.state.objectList.map((item,index)=>{
                    return (
                      item.channel==='vimeo' && <p>{item.videoUrl}</p>
                    )
                  })}
                  {!lodashFind(this.state.objectList, { 'channel': 'vimeo'}) &&
                    <p
                      className="aligncenter"
                      style={{
                        marginBottom: "10px",
                        color: "lightgrey",
                        fontSize: "12px",
                        padding: "30px",
                        marginTop: "10px",
                        fontWeight: "bold"
                      }}
                    >
                      Looks like you haven&#39;t added any Vimeo videos.
                      <br /> <br />You can upload them by clicking above or try
                      one of our templates below.
                    </p>}
                  </div>
                </div>
              </Tab>
              <Tab
                eventKey={10}
                title={
                  <p className="hovertile" style={{ marginBottom: "0px" }}>
                    <img
                      className="hoverimage"
                      style={{ width: "30px" }}
                      src={require("../assets/images/youtube_logo.png")}
                    />
                    <p
                      className="hovertitle"
                      style={{
                        marginBottom: "0px",
                        fontSize: "9px",
                        marginTop: "2px"
                      }}
                    >
                      YOUTUBE
                    </p>
                  </p>
                }
              >
                <div
                  style={{
                    padding: "10px",
                    background: "rgb(250,250,250)",
                    marginBottom: "10px"
                  }}
                >
                  <p
                    style={{
                      marginBottom: "0px",
                      fontSize: "22px",
                      color: "grey",
                      fontWeight: "bold"
                    }}
                  >
                    Youtube
                  </p>
                  <p
                    style={{
                      marginBottom: "0px",
                      fontSize: "12px",
                      color: "lightgrey",
                      fontWeight: "bold"
                    }}
                  >
                    Click to upload or add
                  </p>
                </div>
                <p className="aligncenter marginbottom30 ">
                  <button
                    className="btn btn-sm "
                    onClick={()=>this.addVideo('youtube')}
                    style={{
                      backgroundColor: "transparent",
                      fontSize: "17px",
                      fontWeight: "bold",
                      color: "white",
                      backgroundColor: "rgb(43, 147, 255)"
                    }}
                  >
                    + Add a Youtube Video
                  </button>
                </p>
                <div>
                  <p
                    style={{
                      fontSize: "17px",
                      color: "grey",
                      fontWeight: "bold",
                      marginBottom: "10px",
                      padding: "10px"
                    }}
                  >
                    Your Videos
                  </p>
                  <div
                    className="aligncenter marginbottom30"
                    style={{ whiteSpace: "pre-wrap" }}
                  >
                  {this.state.objectList.map((item,index)=>{
                    return (
                      item.channel==='youtube' && <p>{item.videoUrl}</p>
                    )
                  })}
                   {!lodashFind(this.state.objectList, { 'channel': 'youtube'}) &&
                    <p
                      className="aligncenter"
                      style={{
                        marginBottom: "10px",
                        color: "lightgrey",
                        fontSize: "12px",
                        padding: "30px",
                        marginTop: "10px",
                        fontWeight: "bold"
                      }}
                    >
                      Looks like you haven&#39;t added any Youtube videos.
                      <br /> <br />You can upload them by clicking above or try
                      one of our templates below.
                    </p>}
                  </div>
                </div>
              </Tab>
            </Tabs>
          </Col>

          <Col
            md={9}
            id="reference"
            ref={divElement => (this.divElement = divElement)}
            style={{
              height: "90vh",
              marginTop: "10vh",
              background: "rgb(250,250,250)",
              padding: "0px",
              overflow: "hidden",
              borderTop: "1px solid rgb(250,250,250)",
              ...this.state.hexOrImage
            }}
          >
          <div className="widgetsize" style={{position:'absolute',
          bottom:'10px',
          left:'10px'}}>
          <DropdownButton
            noCaret
            style={{
              background: "transparent",
            }}
            className="noborder "
            title={
              <img style={{width:'35px'}} src='data:image/png;base64,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'/>
            }
          >

            <p style={{padding:'10px',paddingLeft:'15px',textTransform:'uppercase',fontSize:'10px',color:'grey',fontWeight:'bold'}}>Width</p>
            <p
              eventKey="1"
              style={{padding:' 3px 20px', marginTop: "15px", minHeight: "40px" }}
            >

              <InputRange
                maxValue={1200}
                minValue={400}
                value={parseInt(this.state.dimension.width) || 1}
                onChange={value => {
                  this.setDimension("width", value);
                }}
              />
            </p>




            <p style={{padding:'10px',paddingLeft:'15px',textTransform:'uppercase',fontSize:'10px',color:'grey',fontWeight:'bold'}}>Height</p>
            <p
              eventKey="1"
              style={{padding:' 3px 20px', marginTop: "15px", minHeight: "40px" }}
            >

              <InputRange
                maxValue={600}
                minValue={200}
                value={parseInt(this.state.dimension.height)  || 1}
                onChange={value => {
                  this.setDimension("height", value);
                }}
              />
            </p>


          </DropdownButton>
          </div>

            {this.state.activeObjectIndex > -1 && (
              <div
                style={{
                  width: "100%",
                  height: "7vh",
                  padding: "10px",
                  position: "absolute",
                  top: "0px",
                  left: "0px",
                  background: "rgb(255,255,255,0.7)",
                  zIndex: 10
                }}
              >
                <div style={{ position: "relative" }}>
                  <DropdownButton
                    noCaret
                    style={{
                      marginRight: "15px",
                      background: "transparent",
                      display: "none"
                    }}
                    className="noborder"
                    title={
                      <img
                        style={{ width: "17px", verticalAlign: "top" }}
                        src="data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTguMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4PSIwcHgiIHk9IjBweCIgdmlld0JveD0iMCAwIDYwIDYwIiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA2MCA2MDsiIHhtbDpzcGFjZT0icHJlc2VydmUiIHdpZHRoPSIxMjhweCIgaGVpZ2h0PSIxMjhweCI+CjxnPgoJPHBhdGggZD0iTTUzLjE0MywxOGgxLjA3MWMwLjU1MywwLDEtMC40NDcsMS0xcy0wLjQ0Ny0xLTEtMWgtMS4wNzFjLTAuNTUzLDAtMSwwLjQ0Ny0xLDFTNTIuNTksMTgsNTMuMTQzLDE4eiIgZmlsbD0iIzAwMDAwMCIvPgoJPHBhdGggZD0iTTQ3Ljc4NSwxOGgxLjA3MWMwLjU1MywwLDEtMC40NDcsMS0xcy0wLjQ0Ny0xLTEtMWgtMS4wNzFjLTAuNTUzLDAtMSwwLjQ0Ny0xLDFTNDcuMjMyLDE4LDQ3Ljc4NSwxOHoiIGZpbGw9IiMwMDAwMDAiLz4KCTxwYXRoIGQ9Ik01OC41LDE2Yy0wLjU1MywwLTEsMC40NDctMSwxYzAsMC40MDUsMC4yNDEsMC43NTUsMC41ODgsMC45MTJDNTguMjQ1LDE4LjI1OSw1OC41OTUsMTguNSw1OSwxOC41YzAuNTUzLDAsMS0wLjQ0NywxLTFWMTYgICBINTguNXoiIGZpbGw9IiMwMDAwMDAiLz4KCTxwYXRoIGQ9Ik01OSwyMC43MDVjLTAuNTUzLDAtMSwwLjQ0Ny0xLDF2MS4wNTJjMCwwLjU1MywwLjQ0NywxLDEsMXMxLTAuNDQ3LDEtMXYtMS4wNTJDNjAsMjEuMTUyLDU5LjU1MywyMC43MDUsNTksMjAuNzA1eiIgZmlsbD0iIzAwMDAwMCIvPgoJPHBhdGggZD0iTTU5LDMxLjIxOGMtMC41NTMsMC0xLDAuNDQ3LTEsMXYxLjA1MmMwLDAuNTUzLDAuNDQ3LDEsMSwxczEtMC40NDcsMS0xdi0xLjA1MkM2MCwzMS42NjUsNTkuNTUzLDMxLjIxOCw1OSwzMS4yMTh6IiBmaWxsPSIjMDAwMDAwIi8+Cgk8cGF0aCBkPSJNNTksMzYuNDc1Yy0wLjU1MywwLTEsMC40NDctMSwxdjEuMDUxYzAsMC41NTMsMC40NDcsMSwxLDFzMS0wLjQ0NywxLTF2LTEuMDUxQzYwLDM2LjkyMiw1OS41NTMsMzYuNDc1LDU5LDM2LjQ3NXoiIGZpbGw9IiMwMDAwMDAiLz4KCTxwYXRoIGQ9Ik01OSwyNS45NjJjLTAuNTUzLDAtMSwwLjQ0Ny0xLDF2MS4wNTFjMCwwLjU1MywwLjQ0NywxLDEsMXMxLTAuNDQ3LDEtMXYtMS4wNTFDNjAsMjYuNDA5LDU5LjU1MywyNS45NjIsNTksMjUuOTYyeiIgZmlsbD0iIzAwMDAwMCIvPgoJPHBhdGggZD0iTTU5LDQ2Ljk4N2MtMC41NTMsMC0xLDAuNDQ3LTEsMXYxLjA1MWMwLDAuNTUzLDAuNDQ3LDEsMSwxczEtMC40NDcsMS0xdi0xLjA1MUM2MCw0Ny40MzUsNTkuNTUzLDQ2Ljk4Nyw1OSw0Ni45ODd6IiBmaWxsPSIjMDAwMDAwIi8+Cgk8cGF0aCBkPSJNNTksNDEuNzNjLTAuNTUzLDAtMSwwLjQ0Ny0xLDF2MS4wNTJjMCwwLjU1MywwLjQ0NywxLDEsMXMxLTAuNDQ3LDEtMVY0Mi43M0M2MCw0Mi4xNzgsNTkuNTUzLDQxLjczLDU5LDQxLjczeiIgZmlsbD0iIzAwMDAwMCIvPgoJPHBhdGggZD0iTTU5LDUyLjI0M2MtMC41NTMsMC0xLDAuNDQ3LTEsMXYxLjA1MmMwLDAuNTUzLDAuNDQ3LDEsMSwxczEtMC40NDcsMS0xdi0xLjA1MkM2MCw1Mi42OSw1OS41NTMsNTIuMjQzLDU5LDUyLjI0M3oiIGZpbGw9IiMwMDAwMDAiLz4KCTxwYXRoIGQ9Ik01OSw1Ny41Yy0wLjQwNSwwLTAuNzU1LDAuMjQxLTAuOTEyLDAuNTg4QzU3Ljc0MSw1OC4yNDUsNTcuNSw1OC41OTUsNTcuNSw1OWMwLDAuNTUzLDAuNDQ3LDEsMSwxSDYwdi0xLjUgICBDNjAsNTcuOTQ3LDU5LjU1Myw1Ny41LDU5LDU3LjV6IiBmaWxsPSIjMDAwMDAwIi8+Cgk8cGF0aCBkPSJNMjguMDEzLDU4aC0xLjA1MWMtMC41NTMsMC0xLDAuNDQ3LTEsMXMwLjQ0NywxLDEsMWgxLjA1MWMwLjU1MywwLDEtMC40NDcsMS0xUzI4LjU2NSw1OCwyOC4wMTMsNTh6IiBmaWxsPSIjMDAwMDAwIi8+Cgk8cGF0aCBkPSJNMjIuNzU3LDU4aC0xLjA1MmMtMC41NTMsMC0xLDAuNDQ3LTEsMXMwLjQ0NywxLDEsMWgxLjA1MmMwLjU1MywwLDEtMC40NDcsMS0xUzIzLjMxLDU4LDIyLjc1Nyw1OHoiIGZpbGw9IiMwMDAwMDAiLz4KCTxwYXRoIGQ9Ik0zMy4yNyw1OGgtMS4wNTJjLTAuNTUzLDAtMSwwLjQ0Ny0xLDFzMC40NDcsMSwxLDFoMS4wNTJjMC41NTMsMCwxLTAuNDQ3LDEtMVMzMy44MjIsNTgsMzMuMjcsNTh6IiBmaWxsPSIjMDAwMDAwIi8+Cgk8cGF0aCBkPSJNNDkuMDM4LDU4aC0xLjA1MWMtMC41NTMsMC0xLDAuNDQ3LTEsMXMwLjQ0NywxLDEsMWgxLjA1MWMwLjU1MywwLDEtMC40NDcsMS0xUzQ5LjU5MSw1OCw0OS4wMzgsNTh6IiBmaWxsPSIjMDAwMDAwIi8+Cgk8cGF0aCBkPSJNNTQuMjk1LDU4aC0xLjA1MmMtMC41NTMsMC0xLDAuNDQ3LTEsMXMwLjQ0NywxLDEsMWgxLjA1MmMwLjU1MywwLDEtMC40NDcsMS0xUzU0Ljg0OCw1OCw1NC4yOTUsNTh6IiBmaWxsPSIjMDAwMDAwIi8+Cgk8cGF0aCBkPSJNNDMuNzgyLDU4SDQyLjczYy0wLjU1MywwLTEsMC40NDctMSwxczAuNDQ3LDEsMSwxaDEuMDUyYzAuNTUzLDAsMS0wLjQ0NywxLTFTNDQuMzM1LDU4LDQzLjc4Miw1OHoiIGZpbGw9IiMwMDAwMDAiLz4KCTxwYXRoIGQ9Ik0zOC41MjUsNThoLTEuMDUxYy0wLjU1MywwLTEsMC40NDctMSwxczAuNDQ3LDEsMSwxaDEuMDUxYzAuNTUzLDAsMS0wLjQ0NywxLTFTMzkuMDc4LDU4LDM4LjUyNSw1OHoiIGZpbGw9IiMwMDAwMDAiLz4KCTxwYXRoIGQ9Ik0xNy45MTIsNTguMDg4QzE3Ljc1NSw1Ny43NDEsMTcuNDA1LDU3LjUsMTcsNTcuNWMtMC41NTMsMC0xLDAuNDQ3LTEsMVY2MGgxLjVjMC41NTMsMCwxLTAuNDQ3LDEtMSAgIEMxOC41LDU4LjU5NSwxOC4yNTksNTguMjQ1LDE3LjkxMiw1OC4wODh6IiBmaWxsPSIjMDAwMDAwIi8+Cgk8cGF0aCBkPSJNMTcsNTIuMTQzYy0wLjU1MywwLTEsMC40NDctMSwxdjEuMDcxYzAsMC41NTMsMC40NDcsMSwxLDFzMS0wLjQ0NywxLTF2LTEuMDcxQzE4LDUyLjU5LDE3LjU1Myw1Mi4xNDMsMTcsNTIuMTQzeiIgZmlsbD0iIzAwMDAwMCIvPgoJPHBhdGggZD0iTTE4LDQ3Ljc4NWMwLTAuNTUzLTAuNDQ3LTEtMS0xcy0xLDAuNDQ3LTEsMXYxLjA3MWMwLDAuNTUzLDAuNDQ3LDEsMSwxczEtMC40NDcsMS0xVjQ3Ljc4NXoiIGZpbGw9IiMwMDAwMDAiLz4KCTxwYXRoIGQ9Ik0xNyw0NC41YzAuMzY2LDAsMC42NzMtMC4yMDYsMC44NDctMC41SDE4di0wLjVWNDNWMThoMjVoMC41SDQ0di0wLjE1M2MwLjI5NC0wLjE3NCwwLjUtMC40OCwwLjUtMC44NDcgICBzLTAuMjA2LTAuNjczLTAuNS0wLjg0N1YwSDB2NDRoMTYuMTUzQzE2LjMyNyw0NC4yOTQsMTYuNjM0LDQ0LjUsMTcsNDQuNXoiIGZpbGw9IiMwMDAwMDAiLz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8L3N2Zz4K"
                      />
                    }
                  >
                    <MenuItem eventKey="1">
                      <ChromePicker
                        color={this.state.backgroundColor || "#000000"}
                        onChange={newColor => {
                          this.onStyleChange(
                            this.state.objectList[this.state.activeObjectIndex]
                              .isSVG
                              ? "fill"
                              : "backgroundColor",
                            newColor.hex
                          );
                        }}
                      />
                    </MenuItem>
                  </DropdownButton>

                  <DropdownButton
                    noCaret
                    style={{ marginRight: "15px", background: "transparent" }}
                    className="noborder"
                    title={
                      <img
                        style={{ width: "20px" }}
                        src="data:image/png;base64,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"
                      />
                    }
                  >
                    <p style={{padding:'10px',paddingLeft:'15px',textTransform:'uppercase',fontSize:'10px',color:'grey',fontWeight:'bold'}}>Border Radius</p>
                    <p
                      eventKey="1"
                      style={{padding:' 3px 20px', marginTop: "15px", minHeight: "40px" }}
                    >

                      <InputRange
                        maxValue={20}
                        minValue={1}
                        value={this.state.borderRadius || 1}
                        onChange={value => {
                          this.onStyleChange("borderRadius", value);
                        }}
                      />
                    </p>
                  </DropdownButton>

                  {this.state.activeObjectIndex != -1 &&
                    this.state.enableFontStyle && (
                      <span>
                        <DropdownButton
                          noCaret
                          style={{
                            marginRight: "15px",
                            background: "transparent"
                          }}
                          className="noborder"
                          title={
                            <img
                              style={{ width: "20px" }}
                              src="data:image/png;base64,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"
                            />
                          }
                        >
                        <p style={{padding:'10px',paddingLeft:'15px',textTransform:'uppercase',fontSize:'10px',color:'grey',fontWeight:'bold'}}>Text Color</p>

                          <p eventKey="1" style={{padding:' 3px 20px',padding:'0px'}}>
                            <ChromePicker style={{boxShadow:'none'}}
                              color={this.state.fill || "#000000"}
                              onChange={fontColor => {
                                this.fontColorChange(fontColor);
                              }}
                            />
                          </p>
                        </DropdownButton>

                        <select
                          style={{
                            border: "none",
                            background: "transparent",
                            padding: "6px 12px",
                            marginRight: "10px"
                          }}
                          value={this.state.fontFamily}
                          onChange={event =>
                            this.onStyleChange(
                              "fontFamily",
                              event.target.value.toLowerCase()
                            )
                          }
                        >
                          <option value="arial">Arial</option>
                          <option value="helvetica" selected="">
                            Helvetica
                          </option>
                          <option value="myriad pro">Myriad Pro</option>
                          <option value="delicious">Delicious</option>
                          <option value="verdana">Verdana</option>
                          <option value="georgia">Georgia</option>
                          <option value="courier">Courier</option>
                          <option value="comic sans ms">Comic Sans MS</option>
                          <option value="impact">Impact</option>
                          <option value="monaco">Monaco</option>
                          <option value="optima">Optima</option>
                          <option value="hoefler text">Hoefler Text</option>
                          <option value="plaster">Plaster</option>
                          <option value="engagement">Engagement</option>
                        </select>

                        <DropdownButton
                          noCaret
                          style={{
                            marginRight: "15px",
                            background: "transparent"
                          }}
                          className="noborder"
                          title={
                            <img
                              style={{ width: "20px" }}
                              src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAYAAACtWK6eAAAAAXNSR0IArs4c6QAAHQ1JREFUeAHtXQv8VdO27q33S53k1jmp6HocUYcUSZRHiHLzK8np5pHrdUqFCHG93y4hREQ6dM8V4rpdN04qjxNdr7xuOZ2in15OhYjc71vtsc3/bO291v7vR3v9ffP3W3uMOeeYY4z5zTnWc661q1VTEgJCQAgIASEgBISAEBACQkAICAEhIASEgBAQAkJACAgBISAEhIAQEAJCQAgIASEgBISAEBACQkAICAEhIASEgBAQAkJACAgBISAEhIAQEAJCQAgIASEgBISAEBACQkAICAEhIASEgBAQAkJACAgBISAEhIAQEAJCQAgIASEgBISAEBACQkAICAEhIASEgBAQAkJACAgBISAEhIAQEAJCQAgIASEgBISAEBACQkAICAEhIASEgBAQAkJACAgBISAEhIAQEAJCQAgIASEgBISAEBACQkAICAEhIASEgBAQAkJACAgBISAEhIAQEAJCQAgIASEgBISAEBACQkAICAEhIASEgBAQAkJACAgBISAEhIAQEAJCQAgIASEgBISAEBACQkAICAEhIASEgBAQAoVBoHph1EhLEhH49NNPe//www+XVK9eff+ffvqpZTH6AN1bofdjbPOxXdmpU6eVxbBTLJ0KkGIhW+Z6P/roozEIiltK6SaC5asaNWoM2H333V8upd18bClA8kEvoW0//vjjvgiOF7GVfPwRJCtq1aq1T4cOHf6eBPhqJcHJUvo4a9asRt999107TJ5gg+022Bpiq4+tAcrrgW7Bthn8ZuwRv926deuGmjVrrkDZSlKULRs4cOBa5Msywd+RcKzkwUEwgFmbLVu2nAL2XubLPf2iA+TJJ5+sg3PwAzFIB2LgDsTerdvGjRvbgXIgg7EznjQs/fjjj0Ex9AQUg1+Nso8//vhfUbAI/F+w/c/gwYPfAN2mNExRacsOK625itaAQ9eKJeWbCx/18vU3b8+mT5/eAnvQYxEAx2OgjoLChgwG8IFu4y1AogyynbWhrPHW3qlfCf5pHF2mDxkyZEGU3mLW4/pjOfxrW0wb2XQDh0dxsf77bDLlUveLCJC5c+fWWrly5fHY258N4Ptgq2ED4EzgoCjLBA+tNz1Go/RRDjILESg3Dx06dBZ43uUpaUKAzEY/+5XU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"
                            />
                          }
                        >
                          <p style={{padding:'10px',paddingLeft:'15px',textTransform:'uppercase',fontSize:'10px',color:'grey',fontWeight:'bold'}}>Font Size</p>
                          <p
                            eventKey="1"
                            style={{padding:' 3px 20px', marginTop: "15px", minHeight: "40px",borderBottom:'1px solid rgb(250,250,250)' }}
                          >
                            <InputRange
                              maxValue={120}
                              minValue={1}
                              value={this.state.fontSize || 1}
                              onChange={value => {
                                this.onStyleChange(
                                  "fontSize",
                                  parseInt(value, 10)
                                );
                              }}
                            />
                          </p>
                          <p style={{padding:'10px',paddingLeft:'15px',textTransform:'uppercase',fontSize:'10px',color:'grey',fontWeight:'bold'}}>Line Height</p>

                          <p eventKey="2"
                            style={{padding:' 3px 20px', marginTop: "15px", minHeight: "40px",borderBottom:'1px solid rgb(250,250,250)' }}>
                            <InputRange
                              maxValue={3}
                              minValue={0}
                              value={this.state.lineHeight || 1.2}
                              onChange={value => {
                                this.onStyleChange(
                                  "lineHeight",
                                  parseInt(value, 0.1)
                                );
                              }}
                            />
                          </p>

                          <p style={{padding:'10px',paddingLeft:'15px',textTransform:'uppercase',fontSize:'10px',color:'grey',fontWeight:'bold'}}>Letter Spacing</p>

                          <p
                            eventKey="3"
                            style={{padding:' 3px 20px',  marginTop: "15px", minHeight: "40px" }}
                          >
                            <InputRange
                              maxValue={20}
                              minValue={1}
                              value={this.state.letterSpacing || 1}
                              onChange={value => {
                                this.onStyleChange("letterSpacing", value);
                              }}
                            />
                          </p>
                        </DropdownButton>



                        <DropdownButton
                          noCaret
                          style={{
                            marginRight: "15px",
                            background: "transparent"
                          }}
                          className="noborder"
                          title={
                            <img
                              style={{ width: "20px" }}
                              src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAYAAACtWK6eAAAAAXNSR0IArs4c6QAAHbxJREFUeAHtnQnUFcWVx2Xfd8FEMaDihoKDKCLiQkAmLrgGB9xADAoo4noUt5DMaFRk02hkFERcOEcFlRnB6GBUwIVFAY9BUD+RmEQTBWQRBIT5/zvvPsv6ut++NHz/Oqffra66VXXrV3Wrl9ev3x57KIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACOxWBKrtLr2ZMWNGi+3bt7fduXNnW/SJ8qfYGlSrVq0+9hsgXgfxrTt27NgMuQVp3NYg/jk35P+1evXqn5x33nkbka4gAgGBXdJBZs2a1Xj9+vVdv//++2PQiy7cMMFbYaLvAfmvjiXiTMsksBx0d0CugP5ixBfVqlXrJTgM9xWqKIHMZk8M4Dz99NP7bdu2rQ8mMLcTMYFrJSZ1YJ3FKTMJdBwrQ32LW3knfzniz9WoUeOxfv36rcykbunsPgRi7SBwioZbtmzpj0l7OZB3drE7EzhITjHBQ/PduhjPoD563gs4Dbv3wgsvnO+Xrwr7GI/m3333XXP0laeuDXEE31GnTp11WLjWUeJou3l34xBLB3n88ccPxoQfgQG4EAPRKBPo6RwkkzpcHb8+Nw82zYSjDL/44otXu+m7S/zJJ59shkl/NPrDU9dOkAdg2x9b5FhwgUHYim0t4u+j3DuIL6hdu/Y7559//pfM3BVDrBxk8uTJ+wLuKIAcAMA1UgFFfnLVpx4HyNLCylkeZSb6YXW4aWhvE/ZvveSSS8a76btifNGiRbXef//942D7qeBzCvp2GGTB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tzPyZ7bBr9KiTHKBUycxcKtxdHodea81bNjwBVyEJ++sRNWzu6TjDSHNcCOEt9XPRP+PRL9a5ti3r8CQN1Rexu3ll7GofJ5jPbtksVg6iE8Sd2tq4Vtbvub/COTxzldzDDzv4PD7FH4XsBGDuBGDuBbpn2D/I7zF/MOqNpjod2Q4/PDD9wW/zmDEl/k1A6dmkE1RoCHi/Au1jeBJjuuRXoH0lUhbsXz58r9HVqoMERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABESgEgf8HKlpIgBjJEpsAAAAASUVORK5CYII="
                            />
                          }
                        >
                        <div style={{padding:'10px'}}>
                          <p style={{padding:'10px',paddingLeft:'15px',textTransform:'uppercase',fontSize:'10px',color:'grey',fontWeight:'bold'}}>Letter Styling</p>
                          <Button
                            style={{
                              background: "transparent",
                              marginRight: "15px",
                              backgroundColor:
                                this.getSelectedStyle().style.fontWeight ===
                                "bold"
                                  ? "#ddd"
                                  : "#ffffff"
                            }}
                            onClick={this.toggleBold}
                            className="noborder"
                          >
                            <img
                              style={{ width: "20px" }}
                              src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAYAAACtWK6eAAAAAXNSR0IArs4c6QAAG+pJREFUeAHtXQvMbFdV3mf+++htKfIQCLWN8opgReQpoRFSlapNLEYiKBRieVRFikRCaXzEq8FCQi2UyyPWpPKwlAIaReQhEoQWaXhEAQukldaU1kAttNzCve3lnzmub5397dmz55w589/b/8Gcbycza+2911577e986+xz5sw/fwgqQkAICAEhIASEgBAQAkJACAgBISAEhIAQEAJCQAgIASEgBISAEBACQkAICAEhIASEgBAQAkJACAgBISAEhIAQEAJCQAgIASEgBISAEBACQkAICAEhIASEgBAQAkJACAgBISAEhIAQEAJCQAgIASEgBISAEBACQkAICAEhIASEgBAQAkJACAgBISAEhIAQEAJCQAgIASEgBISAEBACQkAICAEhIASEgBAQAkJACAgBISAEhIAQEAJCQAgIASEgBISAEBACQkAICAEhIASEgBAQAkJgKxCotmKSHTvH/npPOLL+raOLD9DV9iKE1CFR+vobq873Onzf+g6Hqj7ssq5Mt3pdHbL6N8OoviWEkb0gJ7eEevctYY+1768mnT7VsWEEeHQ3PHAlBiBB7jpyd+taKoOmNrJDeikSoKi2+thIYzkf54ZsK235N7LkqcNnLe5rwtrap0O9dk24sPpm23C1LYcAj/5y1qtm5Qlyd3uClGstE6IkaGm/U+pVuNF2nU/ZbvP28JpdH7OE78i4nRLwzopDCXLXXe0J0pcQZX95XMsEKu37+jfqbxn7UXWdmb011HvfHl5b3V4OUX0eASXIoUNNgpSXOCVW5SVPn305frPrG4rP7mfC5Iqwtuv14cK9/7XZof0g+1eCHI4JUhKsvMmeO+PblsAkAQOoQ6KU/ub6zYY+mwFFAzujP7fJ34otqfSfm0IvzJu5q7HJA2Hfvj+1m/uD5RDV7cJ08CCAyHihUHqFHwZB2sv7oqQdZT4WbWynRP8k+oN03ewonb3uBG+xxJi8D3r5ghltoEad88M39K753H6yFurJy8OhQ18Jrzr8VHhUmUVACVKDSJFMSRqxSLQuCXI6yUBM6OaDMvmhX9pE6cQu9L7xMz4ZcyY5d/KNA405YnH/prufbJzXxyeFevyxcP6dL6O5ZIOAEiQxgWQicdHBNuhGKi+Q9vKz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"
                            />
                          </Button>
                          <Button
                            style={{
                              background: "transparent",
                              marginRight: "15px",
                              backgroundColor:
                                this.getSelectedStyle().style.fontStyle ===
                                "italic"
                                  ? "#ddd"
                                  : "#ffffff"
                            }}
                            onClick={this.toggleItalic}
                            className="noborder"
                          >
                            <img
                              style={{ width: "20px" }}
                              src="data:image/png;base64,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"
                            />
                          </Button>
                          <Button
                            style={{
                              background: "transparent",
                              marginRight: "15px",
                              backgroundColor: this.isUnderline()
                                ? "#ddd"
                                : "#ffffff"
                            }}
                            onClick={this.toggleUnderline}
                            className="noborder"
                          >
                            <img
                              style={{ width: "20px" }}
                              src="data:image/png;base64,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AxteSptG+7qOeXH36TKN+pB89kVynvNFFMvsUgPn1AOQ13TYVpg/m1NP/AB/OTgMVI11eCu2qAlcdMfnZK2xye6kATlMIE0MC/kGu6qekeq98npFRpcDksp3KdWb5PKcJEJ4p+QP/7Yx7O0Uz5glnZVDhdlk74SVz6W/mTAkQ9xdtfnr0uKrPT14WtAzxZGjEKT6EcjP9QqkAkyPn1N9sceYZSvNzqufUxO4DSfAP1M8nFHc4h/bHzOnXypl1XlxReZ7hXleRqcPm50bns3c0qzMm2v/lZXRWRizavO1Mt36gdhSdzK4a+UXzcO6+MSLnhFHhgSU2aZDzoe2muoW2lMU8ivBqY+Zhz8lIwi3+RCgQOZDK2276ifny6Mdd0k0LsIPpobNmVJjGtoXxZ1mxTHXm21X7EuP4P5wAhTIcEaDW1y89XjT3X+7fCMtd5gEpx9B0sMUNYJY65DXtM+Gc/kRQdrgFLZ5cnzaXhf9neJ6s/MzImBuh0qAAjlUculxq360xnS735UoPrWuSgLYR3cT8oVq36nkUf07TbHsZk6p6itxOO9NV+twzjm5x15z+xFmz4EbZRS5UUaIkyIQaQ8frhG04bD66GRN7TuPyLc0G83D1/0xbc79QyNAgRwat8FHXfjwclP+a70pyhtkJnVO3TgdIdJT6KVAm7RO91GnqW6ufdF5VaruN1PFLSKMv9V1fF8oAhTIQpFsOs8Ft50tQlknd7zWSJOz/BplviNGfP59MuI8ZorOPeaE6R1mywb+semYz4LtUSALhnIOJ7pw8wmm+5o+9Ph+GRHkKd/iNEn171ZNY0CwqT2VvTSyntAv9/RPosqr6OyS0eJJc8zxu+SulPyYi9tiE6BAFpvwXM5/8Q+nzczSFaZ6fYU8nyW/IaleNUd29pmzz9hvNp4vP4flRgIkQAIkQAIkQAIkQAIkQAIkQAIkQAIkQAIkQAIkQAIkQAIkQAIkQAIkQAIkQAIkQAIkQAIkQAIkQAIkQAIkQAIkQAIkQAKeQKt/D7J79278/tQ7xEz+BM4888zWxB3/P0j+8UQLx0iAAhkjfH50/gQokPyvES0cIwEKZIzw+dH5E6BA8r9GtHCMBCiQMcLnR+dPgALJ/xrRwjESoEDGCJ8fTQIkQAIkQAIkQAIkQAIkQAIkQAIkQAIkQAIkQAIkQAIkQAIkQAIkQAIkQAIkQAIkQAIkQAIkQAIkQAIkQAIkQAIkQAIkQAIkQAIkQAIkQAIkQAIkQAIkQAIkQAIkQAIkQAIkQAIkQAIkQAIkQAIkQAIkQAIkQAIkQAIkQAIkQAIkQAIkQAIkQAIkQAIkQAIkQAIkQAIkQAIkQAIkQAIkQAIkQAIkQAIkQAIkQAIkQAIkQAIkQAIkQAIkQAIkQAIkQAIkQAIkQAIkMJTA/wEzRNV2GGb7YwAAAABJRU5ErkJggg=="
                            />
                          </Button>
                          <Button
                            style={{
                              background: "transparent",

                              backgroundColor: this.isLinethrough()
                                ? "#ddd"
                                : "#ffffff"
                            }}
                            onClick={this.toggleLinethrough}
                            className="noborder"
                          >
                            <img
                              style={{ width: "20px" }}
                              src="data:image/png;base64,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kglP+rMkHUNACMI4OI5FIx78F4Yq3/LmF2xnHEx+8BVXe5GYRCa/TI7l+EL7MtRdBs/yUSaVlAwPo+oix4G4Y3BgbPgYnm4DC+g0xxx02zyPkqa9lr2Qlk4YF6ssvyYCQhCNyIgHv+d+CaTUMzIuMwmSkMGGqYUCK3BmfLCIn1SvQb01MHD+UiMmxnYlWVH+EiTe4cBmWfsjfTSGe19PrT/b4/vkLWsz2R0H05Lzd+BYEgIQEIL4QTlt1kUwxrneVZnLmnuF9usPSqe94mvy6a7yGTjrS1s/6KCqYhUqf5+WTXozmYTkExUJCD4ENixZTf1HtEfOUEUMRQ7s6ViJsoFy4NhvrEkM2PMuycq1Lo4R9FBJx/xX5uowSY6n2gbdHKu0q0MfLuH4KLfwWQayzqFll/0dexJSICAEMcF5f8kKGjCccfmBKlJjeRifHtOb8n4DVZbMAmzMOug0x/50knK/R2Ajj9PPdfw6/Gmtz4z9MkhbWE/iWBNo+eTHTUnZT0TAu84kFhV4zrD7J8KY7se8pMi7CAdBoowYBUmRTCNgEiBB3Mxgg9d53CCd5jggxOm36sl2xtGyKxcHSEpWAAJJUA2QLMSsYbPOIIpg8R/+X4QNLReD9kg2JuRkjadlV7yQi6ext9ocv4xib7WirR53+eRnYFTfwLBmaWxoA5IoorixP62GPppEOuYT02mOM9n8dfzpTOpCxt8mTqsVurSA2nU4XMjBeGYXxINkitep947HcGsmxLGUHL8aOZ3mOJPA9XQdltfpTOtncoxGmW1UZF9Gy656ojFLUtkgIJP0TNF6f+m/acDoeVjdy3eABuNKjTf2UDmdwacqD6pvtscvw2Wp9MWX/5na03B69urXTJWynzkCDLeEbBH44ewu5FRfDmP9KUjSyn8VkJIxe7D2eCGe2N9Dy69+J9vTEvlEBIQgiZhknnPR3HLavGMURfFMgaLDUbE84cGdqY3nBXrirMoMl2DsxnkpljfLY/o/ATFwx610Nj1/5ZexLPkNAwEhSBgosg5eCVxVOUqtmXLwhJqiPWOqTYtO6QFQxSyPaWn81frsr5C3HMR4go4/4kn192uNQpIKCQEhSEhAJqg57e5BVB89HnOV43HV50WQ/ZHunOABMuWDZW0Eed5E/TewvURdD3wZK4QjCceVjFAREIKECmcaZSNn9KA91gDcDesLI++KuAPiDhg3dQSBykGAWuzvwZPuasTb8VBvE/I3kdX5I1oxaWca7VIsCAgCgoAgIAgIAoKAICAICAKCgCAgCAgCgoAgIAgIAoKAICAICAKCgCAgCAgCgoAgIAgIAoKAICAICAKCgCAgCAgCgoAgIAgIAoKAICAICAKCgCAgCAgCgoAgIAgIAoKAICAICAKCgCAgCAgCgoAgIAgIAoKAICAICAKCgCAgCAgCgoAgIAgIAoKAICAICAKCgCAgCAgCgoAgIAgIAoKAICAICAKCgCAgCAgCgoAgIAgIAoKAICAICAKCgCAgCAgCgoAgIAgIAoKAICAICAKCgCAgCAgCgoAgIAgIAoKAICAICAKCgCAgCAgCgoAgIAgIAoKAICAICAKCgCAgCAgCgoAgIAgIAoKAICAICAKCgCAgCAgCuYPAfwAS7OeLHqvmNQAAAABJRU5ErkJggg=="
                            />
                          </Button>
                          </div>
                        </DropdownButton>
                        <DropdownButton
                          noCaret
                          style={{
                            marginRight: "15px",
                            background: "transparent"
                          }}
                          className="noborder"
                          title={
                            <img
                              style={{ width: "20px" }}
                              src="data:image/png;base64,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"
                            />
                          }
                        >
                        <div style={{padding:'10px'}}>
                          <p style={{padding:'10px',paddingLeft:'15px',textTransform:'uppercase',fontSize:'10px',color:'grey',fontWeight:'bold'}}>Line Indent</p>
                          <Button
                            style={{
                              background: "transparent",
                              marginRight: "15px",
                              backgroundColor:
                                this.state.textAlign === "left"
                                  ? "white"
                                  : "#ffffff"
                            }}
                            onClick={() =>
                              this.onStyleChange("textAlign", "left")
                            }
                            className="noborder"
                          >
                            <img
                              style={{ width: "20px" }}
                              src="data:image/png;base64,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"
                            />
                          </Button>
                          <Button
                            style={{
                              background: "transparent",
                              marginRight: "15px",
                              backgroundColor:
                                this.state.textAlign === "center"
                                  ? "white"
                                  : "#ffffff"
                            }}
                            onClick={() =>
                              this.onStyleChange("textAlign", "center")
                            }
                            className="noborder"
                          >
                            <img
                              style={{ width: "20px" }}
                              src="data:image/png;base64,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"
                            />
                          </Button>
                          <Button
                            style={{
                              background: "transparent",
                              marginRight: "15px",
                              backgroundColor:
                                this.state.textAlign === "right"
                                  ? "white"
                                  : "#ffffff"
                            }}
                            onClick={() =>
                              this.onStyleChange("textAlign", "right")
                            }
                            className="noborder"
                          >
                            <img
                              style={{ width: "20px" }}
                              src="data:image/png;base64,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"
                            />
                          </Button>
                          <Button
                            style={{
                              background: "transparent",

                              backgroundColor:
                                this.state.textAlign === "justify"
                                  ? "white"
                                  : "#ffffff"
                            }}
                            onClick={() =>
                              this.onStyleChange("textAlign", "justify")
                            }
                            className="noborder"
                          >
                            <img
                              style={{ width: "20px" }}
                              src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAYAAACtWK6eAAAAAXNSR0IArs4c6QAABtdJREFUeAHt3dFt20gQBmDrnq+BdCAoXQQpw29JWee3lBGoiwjuIA3cuzMbUbAXMQISgkaz5EfgINOhzOU384vJwct9eLARIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQmAR2JF4FXl5eds/Pz1/j9Ut892P89+/rn/rqjgL/x7l/7Ha7p/1+/1+8vmSNRUAm6dPp9CHgv0U4PmXhO89ygajRMWr0eDgcfi5/9/J3/LP8Let7R7tzCMcYdW0fYFOtUj7cBST6YvprlTvHGBl5aCFpNcsYroCEcoC3f3PYBhLIqpmAnJui/YPcNpZASs0E5NwU/m/VWOFoo02pmYCM1xhGnCggIInYTjWegICMVzMjThQQkERspxpPQEDGq5kRJwoISCK2U40nICDj1cyIEwUEJBHbqcYTEJDxambEiQICkojtVOMJCMh4NTPiRAEBScR2qvEEBORcszal0zaWQErNBOTcFD/G6g2jDYGUmglISMcUzictN5ZAVs1S5vVWp4/Zae1pJt/bVM7qYzW+3x9ox3i6yecIyc2fbuIOEh3XoGN7jNejBqwt0Go01erm4WgS7iBv+iHgPRfrjUehL+/2XKxCBoZCgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQuAqnzQcy3uLB7XShwt/kgaQGxDvnClnD4uwKXGYWrWie93Tli+xav5ny/W3bfnCvQemjqpZQP95Q56dYhn1t+x80RaCFZ1TrpcUHWIZ9TecfMFsjqqZQ7SFx1yprWs3UduAaBlJ7KCkjKmtZrqLprmC2Q0lNZAZl91Q4kUElAQCpVw1jKCQhIuZIYUCUBAalUDWMpJyAg5UpiQJUEBKRSNYylnICAlCuJAVUSEJBK1TCWcgICUq4kBlRJQEAqVcNYygkISLmSGFAlAQGpVA1jKSeQFZCUNa3L6RrQLQVSeiorIClrWt+yGn52OYGUnkoJSEyRtA55uf4ae0BZPZUyrzdmf1mHfOx+LDX6CMe61kmPC4qMWIe8VJcNOpgWjqmX1rdO+nQn+RqvbY56mzKZMits0F4w7FeBuz0X63UIviJAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIEBhBIGXK7QgQbYwmdJWt1N0mTAnI1BOn0+lDTOe0lnvZjJwHdplyezgcfmYMNeWpJhkXcs052p1DOK4RzHtv1OrTVKuUD3cBidq2RekbfF6ZnekagVarVrNrfsbc9wpISAV4e4iEbSCBrJoJyLkpUhalH6j/RhhqSs0E5NwKHj80QiT6MabUTEB6dHsEOgEB6TjsEOgFBKT3sEegExCQjsMOgV5AQHoPewQ6AQHpOOwQ6AUEpPewR6ATEJCOww6BXkBAeg97BDoBAek47BDoBQSk97BHoBMQkI7DDoFeQEDOHimL0vf09q4USKmZgJyrlLIo/ZUN4e29QErNBCTQYwrnU29vr7pAVs1S5vVWx47ZabuYwvm9TeWsPlbj+/2Bdtzv958jJDdfK90dJDquQcf2GK9HDVhboNVoqtXNw9Ek3EHe9EPAtztJe4BDm6PepnSmzFp7MwRfvi9wt+divT8c3yVAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECDwh0Dq72L5Xac//H1jnsDdfhcrLSDWAJzXCY76u8Dlt3lXtUZhu3PEZoHMv9fen84QiF5a3xqF1gCcUXmHzBZoIVnVGoVxQdYAnF1+B84RyOqprBmFKevJzYF1zGoEUnoqKyBm5q2mL8tcSEpPZQWkjKqBEFgiICBLtBy7OQEB2VzJXfASAQFZouXYzQkIyOZK7oKXCAjIEi3Hbk5AQDZXche8REBAlmg5dnMCArK5krvgJQICskTLsZsTEJDNldwFLxEQkCVajt2cQFZAUtaT21z1tn3BKT2VFZCU9eS23S+bu/qUnkoJSEy3tQbg5vr3thec1VMpD22I2V/WALxtv2zqp0c41rVGYVxQZMQagJvq4htdbAvH1EvrW6NwupNYA/BGzbPiH3u352Kt2NSlESBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQILBX4BU/mkiAz7LwNAAAAAElFTkSuQmCC"
                            />
                          </Button>
                          </div>
                        </DropdownButton>
                      </span>
                    )}

                  <span>
                    <DropdownButton
                      noCaret
                      style={{ marginRight: "15px", background: "transparent" }}
                      className="noborder"
                      title={
                        <img
                          style={{ width: "20px" }}
                          src="data:image/png;base64,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sZjauLm/Piapl2DvjQV0CgtMksbCklQDgx/puEH8jPc+uqSP4zoYxlOfueGT7OC8HDfn5wW+PlriyRpB33IbxHPi9ythvyEW1zSLjoWGFA8d6bHQB/HBlKR4HhcdmTngsdNnfOySYbstbs5vcVvVR8vAlt4gnqL4Bvpz4+FJPQ+ml2H9f/QjPwsPXVKta+Ee8y797S6sWmnxOh5cxg4bCzw4JLFD/nDcf9RHSywho6p1gxQyFfcrV8ci437lQiBslkESbEk6L/tZ1GCyX3Y1cNlPv8B/9PLLL78Mf5XjZaBukAH5isU4Ffcr1wWkf78S8hTBfRGycGUfpYEfttCJ5XjZvI8OtiTj0fZ/Fy+v/nXJV23DM1A3yPAc9RH6Nw6vvfbae+Ip44/EwnxXLPAlX6mqxeqL3nWGAFPq45NUO1G+jXF5vLx6hH6V42WgbpDx8tVHL9yv8DzY97K45cz6KOHzpihtjhynNA48ZHC+Gi+v6qMlOXlj9OsGGSNZJehy7leIYwsZU192bZgu/BJydOCHemtskF/O/tofPQN1g4yeq4HIWLzcr3wkgPq8/R4n2KLtmwctdr86ECPzsZfkAvborl27zosnd18qYapttAzUDTJansZC6X7lwIEDNwZJHyE+7n5FwXzBD9osYIXxNowf/t+Lq4fmUNsJZKBukBNI3ihU/ROho0eP9j9vH4u8//6KFjcLHt0X/KC4jhu0seJjte+Lv17VR0sGJXMEX90gIyRppSDx8OQ18eUU+iuYnge7gM1BfO/7RsCfpePlox/y5bh66FtLjmZO7Y+XgbpBxsvXiqBjc0zFzf31IXl/ZfGfnGoALXTaoKsEGEnbHOreFl/7Wh8tUSZOsL1RiRMMVOnLy4DuVw4ePHhjfIx46P2KNota2gzHDRz+a2OD/OVxjmoYOwN1g4ydstUj2P2KHnP5njxS3hj56rLg/+zb3/7292du7S8vA3WDLC9vq876zne+szcentRVpX+/4gP6RvGrStj/Im7OfzRuzl9xfNWXn4G6QZafuzVhxgZYcr8Sm2APm0IT0GaJQ6+9PhE35v8q9Jk1mdgWGaRukA1U6H379p28f//+vxtTvj4eQrwwNoo+AHVf6L8Tm+OBDXQqdao1AzUDNQM1AzUDNQM1AzUDNQM1AzUDNQM1AzUDNQM1AzUDNQM1AzUDNQM1AzUDNQM1AzUDNQM1AzUDNQM1AzUDNQM1AzUDNQM1AzUDNQM1AzUDNQM1AzUDNQM1AzUDNQM1AzUDNQM1AzUDNQM1AzUDNQM1AzUDNQM1AzUDNQM1AzUDNQM1AzUDNQM1AzUDNQM1AzUDNQM1AzUDNQM1AzUDNQM1AzUDNQM1AzUDNQM1AzUDNQM1AzUDNQM1AzUDNQM1AzUDNQM1AzUDNQODMvD/AQOyMQwZR/M9AAAAAElFTkSuQmCC"
                        />
                      }
                    >

                      <p style={{padding:'10px',paddingLeft:'15px',textTransform:'uppercase',fontSize:'10px',color:'grey',fontWeight:'bold'}}>Background Color</p>
                      <div className="aligncenter">
                      <MenuItem style={{display:'inline-block',marginBottom:'10px',marginRight:'10px'}}
                        eventKey="1"
                        onClick={() => this.setGradient("solid")}
                      >
                        <img style={{width:'20px'}} src='data:image/png;base64,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'/>
                      </MenuItem>
                      <MenuItem style={{display:'inline-block',marginBottom:'10px',marginRight:'10px'}}
                        eventKey="2"
                        onClick={() => this.setGradient("linear")}
                      >
                      <img
                        style={{ width: "20px" }}
                        src="data:image/png;base64,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"
                      />
                      </MenuItem>
                      <MenuItem style={{display:'inline-block',marginBottom:'10px'}}
                        eventKey="3"
                        onClick={() => this.setGradient("radial")}
                      >
                        <img style={{width:'20px'}} src='data:image/png;base64,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'/>
                      </MenuItem>
                      </div>
                      {this.state.gradientType!=='solid' && (
                        <p>

                            <ChromePicker
                              color={this.state.gradientStartColor}
                              onChange={newColor => {
                                this.onStyleChange(
                                  "background",
                                  `${this.state.gradientType}-gradient(${
                                    newColor.hex
                                  },${this.state.gradientStopColor})`
                                );
                                this.setState({
                                  gradientStartColor: newColor.hex
                                });
                              }}
                            />



                            <ChromePicker
                              color={this.state.gradientStopColor}
                              onChange={newColor => {
                                this.onStyleChange(
                                  "background",
                                  `${this.state.gradientType}-gradient(${
                                    this.state.gradientStartColor
                                  },${newColor.hex})`
                                );
                                this.setState({
                                  gradientStopColor: newColor.hex
                                });
                              }}
                            />

                        </p>
                      )}

                      {this.state.gradientType==='solid' &&
                          <ChromePicker
                            color={this.state.backgroundColor || "#000000"}
                            onChange={newColor => {
                              this.onStyleChange(
                                this.state.objectList[
                                  this.state.activeObjectIndex
                                ].isSVG
                                  ? "fill"
                                  : "backgroundColor",
                                newColor.hex
                              );
                            }}
                          />
                        }


                    </DropdownButton>
                    <DropdownButton
                      noCaret
                      style={{ marginRight: "15px", background: "transparent" }}
                      className="noborder"
                      title={
                        <img
                          style={{ width: "20px" }}
                          src="data:image/png;base64,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"
                        />
                      }
                    >
                    <p style={{padding:'10px',paddingLeft:'15px',textTransform:'uppercase',fontSize:'10px',color:'grey',fontWeight:'bold'}}>Border Width</p>

                    <p
                      eventKey="1"
                      style={{padding:"3px 20px", marginTop: "15px", minHeight: "40px" ,borderBottom:'1px solid rgb(250,250,250)'}}
                    >
                        <InputRange
                          maxValue={20}
                          minValue={0}
                          value={
                            this.state.borderWidth
                              ? parseInt(this.state.borderWidth, 10)
                              : 0
                          }
                          onChange={value => {
                            this.onStyleChange(
                              "border",
                              `${value}px ${this.state.borderStyle} ${
                                this.state.borderColor
                              }`
                            );
                            this.setState({ borderWidth: value });
                          }}
                        />
                        </p>

                      <p style={{padding:'10px',paddingLeft:'15px',textTransform:'uppercase',fontSize:'10px',color:'grey',fontWeight:'bold'}}>Border Style</p>

                      <div style={{padding:'10px',borderBottom:'1px solid rgb(250,250,250)'}}>
                        <select
                          style={{
                            border: "none",
                            background: "rgb(250,250,250)",
                            padding: "6px 12px",
                            marginRight: "10px",
                            width:'100%'
                          }}
                          value={this.state.borderStyle}
                          onChange={event => {
                            this.onStyleChange(
                              "border",
                              `${
                                this.state.borderWidth
                              }px ${event.target.value.toLowerCase()} ${
                                this.state.borderColor
                              }`
                            );
                            this.setState({ borderStyle: event.target.value });
                          }}
                        >
                          <option value="none">none</option>
                          <option value="dotted">dotted</option>
                          <option value="dashed">dashed</option>
                          <option value="solid">solid</option>
                          <option value="double">double</option>
                          <option value="groove">groove</option>
                          <option value="ridge">ridge</option>
                          <option value="inset">inset</option>
                          <option value="outset">outset</option>
                        </select>
                        </div>

                      <p style={{padding:'10px',paddingLeft:'15px',textTransform:'uppercase',fontSize:'10px',color:'grey',fontWeight:'bold'}}>Border Color</p>


                        <ChromePicker
                          color={this.state.borderColor}
                          onChange={newColor => {
                            this.onStyleChange(
                              "border",
                              `${this.state.borderWidth}px ${
                                this.state.borderStyle
                              } ${newColor.hex}`
                            );
                            this.setState({ borderColor: newColor.hex });
                          }}
                        />

                    </DropdownButton>
                    <DropdownButton
                      noCaret
                      style={{ marginRight: "15px", background: "transparent" }}
                      className="noborder"
                      title={
                        <img
                          style={{ width: "20px" }}
                          src="data:image/png;base64,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"
                        />
                      }
                    >
                    <p style={{padding:'10px',paddingLeft:'15px',textTransform:'uppercase',fontSize:'10px',color:'grey',fontWeight:'bold'}}>Opacity</p>

                      <p
                        eventKey="1"
                        style={{ padding:"3px 20px",marginTop: "15px", minHeight: "40px" }}
                      >
                        <InputRange
                          maxValue={100}
                          minValue={1}
                          value={
                            this.state.opacity
                              ? parseInt(this.state.opacity * 100, 10)
                              : 1
                          }
                          onChange={value => {
                            this.onStyleChange(
                              "opacity",
                              parseInt(value, 10) / 100
                            );
                          }}
                        />
                      </p>
                    </DropdownButton>



                    <DropdownButton
                      noCaret
                      style={{ marginRight: "15px", background: "transparent" }}
                      className="noborder"
                      title={
                        <img
                          style={{ width: "20px" }}
                          src="data:image/png;base64,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"
                        />
                      }
                    >
                    <p style={{padding:'10px',paddingLeft:'15px',textTransform:'uppercase',fontSize:'10px',color:'grey',fontWeight:'bold'}}>Horizontal Shadow</p>

                      <p
                        eventKey="1"
                        style={{ padding:"3px 20px", marginTop: "15px", minHeight: "40px",borderBottom:'1px solid rgb(250,250,250)' }}
                      >
                        <InputRange
                          maxValue={50}
                          minValue={-50}
                          value={
                            this.state.shadowOffsetX
                              ? parseInt(this.state.shadowOffsetX, 10)
                              : 1
                          }
                          onChange={value => {
                            this.onStyleChange(
                              "boxShadow",
                              `${value}px ${this.state.shadowOffsetY}px ${this.state.blurRadius}px ${
                                this.state.shadowColor
                              }`
                            );
                            this.setState({ shadowOffsetX: value });
                          }}
                        />
                      </p>
                      <p style={{padding:'10px',paddingLeft:'15px',textTransform:'uppercase',fontSize:'10px',color:'grey',fontWeight:'bold'}}>Vertical Shadow</p>

                      <p
                        eventKey="2"
                        style={{padding:"3px 20px", marginTop: "15px", minHeight: "40px",borderBottom:'1px solid rgb(250,250,250)' }}
                      >
                        <InputRange
                          maxValue={50}
                          minValue={-50}
                          value={
                            this.state.shadowOffsetY
                              ? parseInt(this.state.shadowOffsetY, 10)
                              : 1
                          }
                          onChange={value => {
                            this.onStyleChange(
                              "boxShadow",
                              `${this.state.shadowOffsetX}px ${value}px ${this.state.blurRadius}px ${
                                this.state.shadowColor
                              }`
                            );
                            this.setState({ shadowOffsetY: value });
                          }}
                        />
                      </p>

                      <p style={{padding:'10px',paddingLeft:'15px',textTransform:'uppercase',fontSize:'10px',color:'grey',fontWeight:'bold'}}>Blur Radius</p>

                      <p
                        eventKey="3"
                        style={{padding:"3px 20px", marginTop: "15px", minHeight: "40px",borderBottom:'1px solid rgb(250,250,250)' }}
                      >
                        <InputRange
                          maxValue={50}
                          minValue={0}
                          value={
                            this.state.blurRadius
                              ? parseInt(this.state.blurRadius, 10)
                              : 1
                          }
                          onChange={value => {
                            this.onStyleChange(
                              "boxShadow",
                              `${this.state.shadowOffsetX}px ${this.state.shadowOffsetY}px ${value} ${
                                this.state.shadowColor
                              }`
                            );
                            this.setState({ blurRadius: value });
                          }}
                        />
                      </p>


                      <p style={{padding:'10px',paddingLeft:'15px',textTransform:'uppercase',fontSize:'10px',color:'grey',fontWeight:'bold'}}>Shadow Color</p>

                        <ChromePicker
                          color={this.state.shadowColor}
                          onChange={newColor => {
                            this.onStyleChange(
                              "boxShadow",
                              `${this.state.shadowOffsetX}px ${
                                this.state.shadowOffsetY
                              }px ${this.state.blurRadius}px ${newColor.hex}`
                            );
                            this.setState({ shadowColor: newColor.hex });
                          }}
                        />

                    </DropdownButton>
                  </span>
                  <div className="pull-right">
                  <DropdownButton
                  noCaret
                  style={{ marginRight: "15px", background: "transparent" }}
                  className="noborder"
                  title={
                    <img
                      style={{ width: "20px" }}
                      src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAYAAACtWK6eAAAAAXNSR0IArs4c6QAAERdJREFUeAHtnWuMFtUZx9ldlsty3QVhQURAwOLGYBW5BBtrvSTGmKakUYTUkEhqTZqmiQpK1axYKEXTJv2gVBsT1huYih9siDF+tAtWrEpsGpXbElzX1iIgsLAXtr+zLjBuYJmdOWfmnHn/bzLZ2fed88xzfmf+c64zz4AB+oiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACORMoCzn83tx+hdffHFkRUXFIpz5UVdX12T+DvfCMTnRm0BnWVnZ/9j+yQ+bFi9e/HHvA2z/X/ICefXVVxd0dnbWI4wxtuHKnjsCiOQUW0N5efmzd9xxR5urMw10ZTgEu5s2bZqPOP6AOCpD8Fc+niVAmZWzLWObxLcPnf3F7l65XXPhWKNZNenUqVPrJI5wyuxcnlJ+N3Gju+Vcv9n4riQFsnXr1sFUzesBqL6GjasoZxuI5AGayhUu3ChJgRw+fHgFMGe6ACqb2RNAIDUdHR11Ls5ccgLZvHnz7QD9sQuYspkfAcrU9EWsf0pKIC+99NIM+h3OOnTWS0cG+0PAyUhWyQiENupw+h1PcqcZ3B/qOjYYAntceFoyw7y0UesB6KQadlEwshmfAPMhLRMmTNgfP0X8I0uiBnnllVd+BpIfxseiI0MigEA23HDDDR0ufC68QBDH92lW/dIFPNnMnwDi+PDOO+/c6sqTQgtk48aNYxDH74DnZIzcVaHIbjwCiOMga+ge5u+peCn6f1Rh+yBm4ogRqzVsY/uPRSl8J9AjilWsw/qvS18LK5D29vb7gDjHJTzZzpXA03fdddcO1x4UsolFv+MHiGOZa3iynxuBd1jqvjGLsxdOIDStLgbc6izg6Ry5EGim2fwYN8CuLM5eqCYW4hjEfMfvATciC3g6R7YEEEU728olS5YcyerM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xn8C1ByN1BzP++qp16NY+/btmwDAJ3yFJ7/SEaBsFR8kKULgVba3tys+SFKAnqejfDvolK9kCbvX8UG8HRGiaaX4IJ5f5Gnc4+nDp5gM9D4+iJdNLMRxK/B/mqYAlNZfAtQebyKOv/rr4VnPvBMIM+XTAPibsy5qr2AE9vCAlRmyD+LjlUCam5uraJe6jg8SRMEU0UlufK00rVZccsklraHkzyuBHDt2zHV8kFDKpZB+cvN7YurUqftCypw3nXTWWS0GnMv4ICGVS+F8RRwmvuBboWXMi0dud+/efSVLnJ8DnjeCDa0gffaXptXHPFO+HJE4ecu7y7zn3sQiCMpoAGoRostSztE2ojjEfJZ3ixDjIsldIMR4qEcgzuKDxAWh45wQ6OKx2Ufq6uqcvlDOiec9RnMVCEO68xDHdS4zKNv5EaD2eI5O+fb8PEh/5lwFAsDl6bMgC54S2M4ykr946ltst3ITCDUH+ihzFh8kNgEdaJ0A5Wre8P4If529itS60+cxmJtAeEKwFpEMOY9f+jpQApSpGalaSdPK+pv780CSm0AI3ukkPkgeEHXOswR4LPqPzHckfY3sWUOe7OUmEN5c4SQ+iCdcS9WNtxDH5iJlPjeB9LRPrcYHKVLBhJYXmlb7eF/Zb0Pz+0L+5iYQ41hra+szgA12jPxCcEvodxNybcXEiROPFy3PuQrExAdhIqkeqCeLBraE8mP6kg/SZN5TxDznKhAD1ITU6ujoSBMfpIjlEkSeaCY30QK4j3VW24JwOIGTXixWNH4DuoJFi93xQQBfy1ex4oMkyLOSpCBA2bSaZjHb3xFGI/8HtwAxRfaVVAREQAREQAREQAREQAREQAREQAREQAREQAREQAREQAREQAREQAREQAREQAREQAREQAREQAREQAREQAREQAREQAREQAREQAREQAREQAREQAREQAREQAREQAREQAREQAREQAREQAREQAREQAREQAREQAREQAREQAREQAREQAREQAREQAREQAREQAREQAREQAREQAREQAREQAREQAREQAREQAREQAREQAREQAREQAREQAREQAREQAREQAREQAREQAREQAQcEfg/ThgqT57Cc8MAAAAASUVORK5CYII="
                    />
                  }
                >


                  <p>
                <Button
                  style={{
                    fontSize:'12px',
                    fontWeight:'bold',
                    color:'grey',
                    background: "transparent",
                    marginRight: "15px",
                    backgroundColor:
                      this.state.textAlign === "left"
                        ? "white"
                        : "#ffffff"
                  }}
                  onClick={() =>
                    this.onSortEnd({oldIndex:this.state.activeObjectIndex,newIndex:this.state.objectList.length-1})
                  }
                  className="noborder"
                >
                  Move to Front
                </Button>
                  </p>

                  <p>
                <Button
                  style={{
                    fontSize:'12px',
                    fontWeight:'bold',
                    color:'grey',
                    background: "transparent",
                    marginRight: "15px",
                    backgroundColor:
                      this.state.textAlign === "left"
                        ? "white"
                        : "#ffffff"
                  }}
                  onClick={() =>{
                      this.onSortEnd({oldIndex:this.state.activeObjectIndex,newIndex:this.state.activeObjectIndex+1})
                  }
                  }
                  className="noborder"
                >
                  Move Forwards
                </Button>
                  </p>

                  <p>
                <Button
                  style={{
                    fontSize:'12px',
                    fontWeight:'bold',
                    color:'grey',
                    background: "transparent",
                    marginRight: "15px",
                    backgroundColor:
                      this.state.textAlign === "left"
                        ? "white"
                        : "#ffffff"
                  }}
                  onClick={() =>{
                      this.onSortEnd({oldIndex:this.state.activeObjectIndex,newIndex:this.state.activeObjectIndex-1})
                  }
                  }
                  className="noborder"
                >
                  Move Backwards
                </Button>
                  </p>

                  <p>
                <Button
                  style={{
                    fontSize:'12px',
                    fontWeight:'bold',
                    color:'grey',
                    background: "transparent",
                    marginRight: "15px",
                    backgroundColor:
                      this.state.textAlign === "left"
                        ? "white"
                        : "#ffffff"
                  }}
                  onClick={() =>
                    this.onSortEnd({oldIndex:this.state.activeObjectIndex,newIndex:0})
                    
                  }
                  className="noborder"
                >
                  Move to Back
                </Button>
                  </p>

                    </DropdownButton>
                    <Button
                      style={{ marginRight: "15px", background: "transparent" }}
                      className="noborder"
                      onClick={this.copyObject}
                    >
                      <img
                        style={{ width: "20px" }}
                        src="data:image/png;base64,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"
                      />
                    </Button>
                    <Button
                      style={{ marginRight: "15px", background: "transparent" }}
                      className="noborder"
                      onClick={this.deleteObject}
                    >
                      <img
                        style={{ width: "20px" }}
                        src="data:image/png;base64,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"
                      />
                    </Button>
                  </div>
                </div>
              </div>
            )}
            <div
              id="full-canvas-container"
              className="full-canvas-container"
              style={{
                position: "absolute",
                marginTop: "auto",
                marginLeft: "auto",
                marginRight: "auto",
                marginBottom: "auto",
                boxShadow: "0px 0px 10px lightgrey",
                backgroundColor: "transparent",
                borderRadius: "5px",
                overflow: "hidden",
                transform: this.state.isMobileCanvas ? "scale(0.4,0.95)" : "",
                left: 0,
                right: 0,
                top: 0,
                bottom: 0,
                height:this.state.dimension.height,
                width:this.state.dimension.width,
                // ...this.getDimensions(),
                ...this.state.hexOrImage
              }}
            >
              {this.state.ready && (
                // <FabricCanvas
                //   ref="fabricRef"
                //   newObj={this.state.newObj}
                //   bgColor={this.state.bgColor}
                //   setRectDimensions={this.setRectDimensions}
                //   canvasData={this.props.canvasData}
                //   objectList={this.state.objectList}
                //   setActiveObject={this.setActiveObject}
                //   activeObjectIndex={this.state.activeObjectIndex}
                // />
                <CanvasContainer
                  ref="canvasContainer"
                  canvasData={this.props.canvasData}
                  changeObject={this.props.changeObject}
                  videoList={this.state.objectList}
                  setActiveObject={this.setActiveObject}
                  updateObjectPosition={this.updateObjectPosition}
                  activeObjectIndex={this.state.activeObjectIndex}
                />
              )}
            </div>



            <div
              style={{
                position: "absolute",
                bottom: "10px",
                marginRight: "auto",
                marginLeft: "auto",
                left: "0px",
                right: "0px",
                borderRadius: "5px",
                width: "70px"
              }}
            >
              <Button
                style={{ borderRight: "none", background: "transparent" }}
                className="noborder"
                onClick={() => this.onViewChange(false)}
              >
                <FontAwesome style={{ color: "grey" }} name={"desktop"} />
              </Button>
              <Button
                style={{ borderRight: "none", background: "transparent" }}
                className="noborder"
                onClick={() => this.onViewChange(true)}
              >
                <FontAwesome
                  style={{ color: "grey", fontSize: "17px" }}
                  name={"mobile"}
                />
              </Button>
            </div>

            <div
              style={{
                backgroundColor: "white",
                position: "absolute",
                bottom: "30px",
                right: "30px",
                paddingTop:'5px',
                paddingBottom:'5px',
                borderRadius: "5px",
                width: "200px",
                maxHeight: "300px",
                minHeight: "100px",
                overflowY: "auto",
                boxShadow: "0px 0px 10px lightgrey"
              }}
            >
              <div style={{ position: "realtive" }}>
              <SortableList items={this.state.objectList} activeObjectIndex={this.state.activeObjectIndex} lockToContainerEdges={true} lockAxis={'y'} onSortEnd={this.onSortEnd} onItemClick={(index)=>this.setActiveObject(index)}/>
              </div>
            </div>
          </Col>
        </div>

        <div className="col-lg-12 hidden-lg" style={{ padding: "0px" }}>
          <Col
            md={12}
            id="reference"
            className="reference-class"
            ref={divElement => (this.divElement = divElement)}
            style={{
              height: "70vh",
              background: "rgb(250,250,250)",
              padding: "0px",
              overflow: "hidden"
            }}
          >
            <div
              style={{
                width: "100%",
                height: "7vh",

                position: "absolute",
                bottom: "0px",
                left: "0px",
                background: "rgba(255,255,255,0.9)",
                zIndex: 10,
                width: "100%",
                overflow: "hidden",
                overflowX: "auto"
              }}
            >
              {this.state.activeObjectIndex > -1 && (
                <div style={{ position: "relative" }}>
                  <DropdownButton
                    noCaret
                    style={{
                      marginRight: "15px",
                      background: "transparent",
                      display: "none"
                    }}
                    className="noborder"
                    title={
                      <img
                        style={{ width: "17px", verticalAlign: "top" }}
                        src="data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTguMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4PSIwcHgiIHk9IjBweCIgdmlld0JveD0iMCAwIDYwIDYwIiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA2MCA2MDsiIHhtbDpzcGFjZT0icHJlc2VydmUiIHdpZHRoPSIxMjhweCIgaGVpZ2h0PSIxMjhweCI+CjxnPgoJPHBhdGggZD0iTTUzLjE0MywxOGgxLjA3MWMwLjU1MywwLDEtMC40NDcsMS0xcy0wLjQ0Ny0xLTEtMWgtMS4wNzFjLTAuNTUzLDAtMSwwLjQ0Ny0xLDFTNTIuNTksMTgsNTMuMTQzLDE4eiIgZmlsbD0iIzAwMDAwMCIvPgoJPHBhdGggZD0iTTQ3Ljc4NSwxOGgxLjA3MWMwLjU1MywwLDEtMC40NDcsMS0xcy0wLjQ0Ny0xLTEtMWgtMS4wNzFjLTAuNTUzLDAtMSwwLjQ0Ny0xLDFTNDcuMjMyLDE4LDQ3Ljc4NSwxOHoiIGZpbGw9IiMwMDAwMDAiLz4KCTxwYXRoIGQ9Ik01OC41LDE2Yy0wLjU1MywwLTEsMC40NDctMSwxYzAsMC40MDUsMC4yNDEsMC43NTUsMC41ODgsMC45MTJDNTguMjQ1LDE4LjI1OSw1OC41OTUsMTguNSw1OSwxOC41YzAuNTUzLDAsMS0wLjQ0NywxLTFWMTYgICBINTguNXoiIGZpbGw9IiMwMDAwMDAiLz4KCTxwYXRoIGQ9Ik01OSwyMC43MDVjLTAuNTUzLDAtMSwwLjQ0Ny0xLDF2MS4wNTJjMCwwLjU1MywwLjQ0NywxLDEsMXMxLTAuNDQ3LDEtMXYtMS4wNTJDNjAsMjEuMTUyLDU5LjU1MywyMC43MDUsNTksMjAuNzA1eiIgZmlsbD0iIzAwMDAwMCIvPgoJPHBhdGggZD0iTTU5LDMxLjIxOGMtMC41NTMsMC0xLDAuNDQ3LTEsMXYxLjA1MmMwLDAuNTUzLDAuNDQ3LDEsMSwxczEtMC40NDcsMS0xdi0xLjA1MkM2MCwzMS42NjUsNTkuNTUzLDMxLjIxOCw1OSwzMS4yMTh6IiBmaWxsPSIjMDAwMDAwIi8+Cgk8cGF0aCBkPSJNNTksMzYuNDc1Yy0wLjU1MywwLTEsMC40NDctMSwxdjEuMDUxYzAsMC41NTMsMC40NDcsMSwxLDFzMS0wLjQ0NywxLTF2LTEuMDUxQzYwLDM2LjkyMiw1OS41NTMsMzYuNDc1LDU5LDM2LjQ3NXoiIGZpbGw9IiMwMDAwMDAiLz4KCTxwYXRoIGQ9Ik01OSwyNS45NjJjLTAuNTUzLDAtMSwwLjQ0Ny0xLDF2MS4wNTFjMCwwLjU1MywwLjQ0NywxLDEsMXMxLTAuNDQ3LDEtMXYtMS4wNTFDNjAsMjYuNDA5LDU5LjU1MywyNS45NjIsNTksMjUuOTYyeiIgZmlsbD0iIzAwMDAwMCIvPgoJPHBhdGggZD0iTTU5LDQ2Ljk4N2MtMC41NTMsMC0xLDAuNDQ3LTEsMXYxLjA1MWMwLDAuNTUzLDAuNDQ3LDEsMSwxczEtMC40NDcsMS0xdi0xLjA1MUM2MCw0Ny40MzUsNTkuNTUzLDQ2Ljk4Nyw1OSw0Ni45ODd6IiBmaWxsPSIjMDAwMDAwIi8+Cgk8cGF0aCBkPSJNNTksNDEuNzNjLTAuNTUzLDAtMSwwLjQ0Ny0xLDF2MS4wNTJjMCwwLjU1MywwLjQ0NywxLDEsMXMxLTAuNDQ3LDEtMVY0Mi43M0M2MCw0Mi4xNzgsNTkuNTUzLDQxLjczLDU5LDQxLjczeiIgZmlsbD0iIzAwMDAwMCIvPgoJPHBhdGggZD0iTTU5LDUyLjI0M2MtMC41NTMsMC0xLDAuNDQ3LTEsMXYxLjA1MmMwLDAuNTUzLDAuNDQ3LDEsMSwxczEtMC40NDcsMS0xdi0xLjA1MkM2MCw1Mi42OSw1OS41NTMsNTIuMjQzLDU5LDUyLjI0M3oiIGZpbGw9IiMwMDAwMDAiLz4KCTxwYXRoIGQ9Ik01OSw1Ny41Yy0wLjQwNSwwLTAuNzU1LDAuMjQxLTAuOTEyLDAuNTg4QzU3Ljc0MSw1OC4yNDUsNTcuNSw1OC41OTUsNTcuNSw1OWMwLDAuNTUzLDAuNDQ3LDEsMSwxSDYwdi0xLjUgICBDNjAsNTcuOTQ3LDU5LjU1Myw1Ny41LDU5LDU3LjV6IiBmaWxsPSIjMDAwMDAwIi8+Cgk8cGF0aCBkPSJNMjguMDEzLDU4aC0xLjA1MWMtMC41NTMsMC0xLDAuNDQ3LTEsMXMwLjQ0NywxLDEsMWgxLjA1MWMwLjU1MywwLDEtMC40NDcsMS0xUzI4LjU2NSw1OCwyOC4wMTMsNTh6IiBmaWxsPSIjMDAwMDAwIi8+Cgk8cGF0aCBkPSJNMjIuNzU3LDU4aC0xLjA1MmMtMC41NTMsMC0xLDAuNDQ3LTEsMXMwLjQ0NywxLDEsMWgxLjA1MmMwLjU1MywwLDEtMC40NDcsMS0xUzIzLjMxLDU4LDIyLjc1Nyw1OHoiIGZpbGw9IiMwMDAwMDAiLz4KCTxwYXRoIGQ9Ik0zMy4yNyw1OGgtMS4wNTJjLTAuNTUzLDAtMSwwLjQ0Ny0xLDFzMC40NDcsMSwxLDFoMS4wNTJjMC41NTMsMCwxLTAuNDQ3LDEtMVMzMy44MjIsNTgsMzMuMjcsNTh6IiBmaWxsPSIjMDAwMDAwIi8+Cgk8cGF0aCBkPSJNNDkuMDM4LDU4aC0xLjA1MWMtMC41NTMsMC0xLDAuNDQ3LTEsMXMwLjQ0NywxLDEsMWgxLjA1MWMwLjU1MywwLDEtMC40NDcsMS0xUzQ5LjU5MSw1OCw0OS4wMzgsNTh6IiBmaWxsPSIjMDAwMDAwIi8+Cgk8cGF0aCBkPSJNNTQuMjk1LDU4aC0xLjA1MmMtMC41NTMsMC0xLDAuNDQ3LTEsMXMwLjQ0NywxLDEsMWgxLjA1MmMwLjU1MywwLDEtMC40NDcsMS0xUzU0Ljg0OCw1OCw1NC4yOTUsNTh6IiBmaWxsPSIjMDAwMDAwIi8+Cgk8cGF0aCBkPSJNNDMuNzgyLDU4SDQyLjczYy0wLjU1MywwLTEsMC40NDctMSwxczAuNDQ3LDEsMSwxaDEuMDUyYzAuNTUzLDAsMS0wLjQ0NywxLTFTNDQuMzM1LDU4LDQzLjc4Miw1OHoiIGZpbGw9IiMwMDAwMDAiLz4KCTxwYXRoIGQ9Ik0zOC41MjUsNThoLTEuMDUxYy0wLjU1MywwLTEsMC40NDctMSwxczAuNDQ3LDEsMSwxaDEuMDUxYzAuNTUzLDAsMS0wLjQ0NywxLTFTMzkuMDc4LDU4LDM4LjUyNSw1OHoiIGZpbGw9IiMwMDAwMDAiLz4KCTxwYXRoIGQ9Ik0xNy45MTIsNTguMDg4QzE3Ljc1NSw1Ny43NDEsMTcuNDA1LDU3LjUsMTcsNTcuNWMtMC41NTMsMC0xLDAuNDQ3LTEsMVY2MGgxLjVjMC41NTMsMCwxLTAuNDQ3LDEtMSAgIEMxOC41LDU4LjU5NSwxOC4yNTksNTguMjQ1LDE3LjkxMiw1OC4wODh6IiBmaWxsPSIjMDAwMDAwIi8+Cgk8cGF0aCBkPSJNMTcsNTIuMTQzYy0wLjU1MywwLTEsMC40NDctMSwxdjEuMDcxYzAsMC41NTMsMC40NDcsMSwxLDFzMS0wLjQ0NywxLTF2LTEuMDcxQzE4LDUyLjU5LDE3LjU1Myw1Mi4xNDMsMTcsNTIuMTQzeiIgZmlsbD0iIzAwMDAwMCIvPgoJPHBhdGggZD0iTTE4LDQ3Ljc4NWMwLTAuNTUzLTAuNDQ3LTEtMS0xcy0xLDAuNDQ3LTEsMXYxLjA3MWMwLDAuNTUzLDAuNDQ3LDEsMSwxczEtMC40NDcsMS0xVjQ3Ljc4NXoiIGZpbGw9IiMwMDAwMDAiLz4KCTxwYXRoIGQ9Ik0xNyw0NC41YzAuMzY2LDAsMC42NzMtMC4yMDYsMC44NDctMC41SDE4di0wLjVWNDNWMThoMjVoMC41SDQ0di0wLjE1M2MwLjI5NC0wLjE3NCwwLjUtMC40OCwwLjUtMC44NDcgICBzLTAuMjA2LTAuNjczLTAuNS0wLjg0N1YwSDB2NDRoMTYuMTUzQzE2LjMyNyw0NC4yOTQsMTYuNjM0LDQ0LjUsMTcsNDQuNXoiIGZpbGw9IiMwMDAwMDAiLz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8L3N2Zz4K"
                      />
                    }
                  >
                    <MenuItem eventKey="1">
                      <ChromePicker
                        color={this.state.backgroundColor || "#000000"}
                        onChange={newColor => {
                          this.onStyleChange(
                            this.state.objectList[this.state.activeObjectIndex]
                              .isSVG
                              ? "fill"
                              : "backgroundColor",
                            newColor.hex
                          );
                        }}
                      />
                    </MenuItem>
                  </DropdownButton>

                  <DropdownButton
                    noCaret
                    style={{ marginRight: "15px", background: "transparent" }}
                    className="noborder"
                    title={
                      <img
                        style={{ width: "20px" }}
                        src="data:image/png;base64,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"
                      />
                    }
                  >
                    <MenuItem
                      eventKey="1"
                      style={{ marginTop: "15px", minHeight: "40px" }}
                    >
                      <InputRange
                        maxValue={20}
                        minValue={1}
                        value={this.state.borderRadius || 1}
                        onChange={value => {
                          this.onStyleChange("borderRadius", value);
                        }}
                      />
                    </MenuItem>
                  </DropdownButton>

                  {this.state.activeObjectIndex != -1 &&
                    this.state.enableFontStyle && (
                      <span>
                        <DropdownButton
                          noCaret
                          style={{
                            marginRight: "15px",
                            background: "transparent"
                          }}
                          className="noborder"
                          title={
                            <img
                              style={{ width: "20px" }}
                              src="data:image/png;base64,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"
                            />
                          }
                        >
                          <MenuItem eventKey="1">
                            <ChromePicker
                              color={this.state.fill || "#000000"}
                              onChange={fontColor => {
                                this.fontColorChange(fontColor);
                              }}
                            />
                          </MenuItem>
                        </DropdownButton>

                        <select
                          style={{
                            border: "none",
                            background: "transparent",
                            padding: "6px 12px",
                            marginRight: "10px"
                          }}
                          value={this.state.fontFamily}
                          onChange={event =>
                            this.onStyleChange(
                              "fontFamily",
                              event.target.value.toLowerCase()
                            )
                          }
                        >
                          <option value="arial">Arial</option>
                          <option value="helvetica" selected="">
                            Helvetica
                          </option>
                          <option value="myriad pro">Myriad Pro</option>
                          <option value="delicious">Delicious</option>
                          <option value="verdana">Verdana</option>
                          <option value="georgia">Georgia</option>
                          <option value="courier">Courier</option>
                          <option value="comic sans ms">Comic Sans MS</option>
                          <option value="impact">Impact</option>
                          <option value="monaco">Monaco</option>
                          <option value="optima">Optima</option>
                          <option value="hoefler text">Hoefler Text</option>
                          <option value="plaster">Plaster</option>
                          <option value="engagement">Engagement</option>
                        </select>

                        <DropdownButton
                          noCaret
                          style={{
                            marginRight: "15px",
                            background: "transparent"
                          }}
                          className="noborder"
                          title={
                            <img
                              style={{ width: "20px" }}
                              src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAYAAACtWK6eAAAAAXNSR0IArs4c6QAAHQ1JREFUeAHtXQv8VdO27q33S53k1jmp6HocUYcUSZRHiHLzK8np5pHrdUqFCHG93y4hREQ6dM8V4rpdN04qjxNdr7xuOZ2in15OhYjc71vtsc3/bO291v7vR3v9ffP3W3uMOeeYY4z5zTnWc661q1VTEgJCQAgIASEgBISAEBACQkAICAEhIASEgBAQAkJACAgBISAEhIAQEAJCQAgIASEgBISAEBACQkAICAEhIASEgBAQAkJACAgBISAEhIAQEAJCQAgIASEgBISAEBACQkAICAEhIASEgBAQAkJACAgBISAEhIAQEAJCQAgIASEgBISAEBACQkAICAEhIASEgBAQAkJACAgBISAEhIAQEAJCQAgIASEgBISAEBACQkAICAEhIASEgBAQAkJACAgBISAEhIAQEAJCQAgIASEgBISAEBACQkAICAEhIASEgBAQAkJACAgBISAEhIAQEAJCQAgIASEgBISAEBACQkAICAEhIASEgBAQAkJACAgBISAEhIAQEAJCQAgIASEgBISAEBACQkAICAEhIASEgBAQAoVBoHph1EhLEhH49NNPe//www+XVK9eff+ffvqpZTH6AN1bofdjbPOxXdmpU6eVxbBTLJ0KkGIhW+Z6P/roozEIiltK6SaC5asaNWoM2H333V8upd18bClA8kEvoW0//vjjvgiOF7GVfPwRJCtq1aq1T4cOHf6eBPhqJcHJUvo4a9asRt999107TJ5gg+022Bpiq4+tAcrrgW7Bthn8ZuwRv926deuGmjVrrkDZSlKULRs4cOBa5Msywd+RcKzkwUEwgFmbLVu2nAL2XubLPf2iA+TJJ5+sg3PwAzFIB2LgDsTerdvGjRvbgXIgg7EznjQs/fjjj0Ex9AQUg1+Nso8//vhfUbAI/F+w/c/gwYPfAN2mNExRacsOK625itaAQ9eKJeWbCx/18vU3b8+mT5/eAnvQYxEAx2OgjoLChgwG8IFu4y1AogyynbWhrPHW3qlfCf5pHF2mDxkyZEGU3mLW4/pjOfxrW0wb2XQDh0dxsf77bDLlUveLCJC5c+fWWrly5fHY258N4Ptgq2ED4EzgoCjLBA+tNz1Go/RRDjILESg3Dx06dBZ43uUpaUKAzEY/+5XU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"
                            />
                          }
                        >
                          <MenuItem
                            eventKey="1"
                            style={{ marginTop: "15px", minHeight: "40px" }}
                          >
                            <InputRange
                              maxValue={120}
                              minValue={1}
                              value={this.state.fontSize || 1}
                              onChange={value => {
                                this.onStyleChange(
                                  "fontSize",
                                  parseInt(value, 10)
                                );
                              }}
                            />
                          </MenuItem>
                        </DropdownButton>
                        <DropdownButton
                          noCaret
                          style={{
                            marginRight: "15px",
                            background: "transparent"
                          }}
                          className="noborder"
                          title={
                            <img
                              style={{ width: "20px" }}
                              src="data:image/png;base64,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glQO29Ra7tChwzQc8cv2EC3ags3paQRECZLGvVZhn/v168eX+Sws1zC0RZvlsldNO0qQaqKdorEaGxt/BXcPl8Hlw3lbZTBVfRNKkOpjnooRccT/GKdGLb6opg3aSsWkA04qQQKgSHQSAbwl62EE+IFS8WBf2ii1fy30U4LUwl6oUR/69u27C0H+RKnusS9tlNq/FvopQWphL9SwD126dPlnBPqepC6yD/sm7Vdr+kqQWtsjNeZPr169PoNLs0pwa1a+bwlda6eLEqR29kXNeoKHaj8O55gocctn+T5x9WtWTwlSs7umdhzDHbh7EPAz4npEXfaJq1/LekqQWt47NeRb586dfwN34lxw78rr1pD3pbuiBCkdu0z17N279wFceD9UbNLUoW4xvbS0V+zW5rQAID/jI4BbRho3bty4CT36RPT6GDckDkSSlOMX+IghqivWClJdvFM9GgMf1xe/jJoE2+opOThPrSBRe1vyIAJYRdphFXkfjU2ewkasHoORIGW7C9iz3yqbWkFaBfb0DsoEQJ0WmMGD9ZYcnKNWkMCelqgwAlhFGrCKvAat71ETifH2wIEDR4CW/Z+IhT2pfKtWkMpjXHcjMBFwE+LVoLNQH8Pt7GPrMTnqbsdpQkJACAgBISAEhIAQEAJCQAgIASEgBISAEBACQkAICAEhIASEgBAQAkJACAgBISAEhIAQEAJCQAgIASEgBISAEBACQkAICAEhIASEgBAQAkJACAgBISAEhIAQEAJCQAgIASEgBISAEBACQkAICAEhIASEgBAQAkJACAgBISAEhIAQEAJCQAgIASEgBISAEBACQkAICAEhIASEgBAQAkJACAgBISAEhIAQEAJCQAgIASEgBISAEBACQkAICAEhIASEgBAQAkJACFQFgf8HRt/BlmHOBu4AAAAASUVORK5CYII="
                            />
                          }
                        >
                          <MenuItem
                            eventKey="1"
                            style={{ marginTop: "15px", minHeight: "40px" }}
                          >
                            <MenuItem eventKey="1">
                              <InputRange
                                maxValue={120}
                                minValue={1}
                                value={this.state.lineHeight || 1}
                                onChange={value => {
                                  this.onStyleChange(
                                    "lineHeight",
                                    parseInt(value, 10)
                                  );
                                }}
                              />
                            </MenuItem>
                          </MenuItem>
                        </DropdownButton>
                        <DropdownButton
                          noCaret
                          style={{
                            marginRight: "15px",
                            background: "transparent"
                          }}
                          className="noborder"
                          title={
                            <img
                              style={{ width: "20px" }}
                              src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAYAAACtWK6eAAAAAXNSR0IArs4c6QAAFkZJREFUeAHtnXuwVfV1x7lc7oXLy+AjhQYiUB43gZgRJGqtmkql4IOGSYTJpEIUATuIM9AoFQgXbXRCNdghAhUChjgDhcgf7QxOQWfAjsqoKGAxymNA9PKYpGkr8n72+z2cdfnd39n77H3OPefcc+/+/mb2WWv/fuv32J+91n6c/WrTRkkEREAEREAEREAEREAEREAEREAEREAEREAEREAEREAEREAEREAEREAEREAEREAEREAEREAEREAEREAEREAEREAEREAEREAEREAEREAEREAEREAEREAEREAEREAEREAEREAEREAEREAEREAEREAEREAEREAEREAEREAEREAEREAEREAEREAEREAEREAEREAEREAEREAEREAEREAEREAEREAEREAEREAEREAEREAEREAEREAEREAEREAEREAEREAEREAEREAEREAEREAEREAEREAEREAEREAEREAEREAEREAEREAEIghURJSruEAENm3a1O7IkSM90VxvZ+pWUVHREfMdL1682Al6W8iTmE61bdv2FPJPQD+C/HrM11+4cKF+3Lhx+zF/AWVKJSCgACkS5LVr1/Y7d+7cTWj+O5huhKN/G7I9ZKpHOHkb6pRxkmN7DPo21NuKelu6deu24a677joapw3Z5E4g3trJvd3E1eAeor6+/i+wpb8XW/rRcOB+jlM3BAPz4iQ/gKwtq2/l6O8M2nsd+euqq6tXjx079mSc9mUTj4ACJB6nUKtVq1bVYk8xBQ46HkZXmqE5MCVTmIOHlVs7JqPaox1s/hv9LKqpqVmEQPmD1ZXMn4ACJA92cMKKl19++Qfnz5+fCqe8PU4TUQESpw3Xxm/PLcOYjmF+bseOHRciUM67ZdJzI6AAyY1Xm5UrV96DQ6in4aDXZavqO7C/B/Dr5mrv1w+aR5/bcQg2AenDoHLlRRNQgEQzSlm89NJLw7DHeB4zt8SsUlAzP8D8gArrDPWOo2zCxIkT14XZKD+cgAIknE2q5NVXX21/8ODBeXC0x7DnqKSjBiXfYaMcuqnl/hj89txylF3E2J+YPHnyfDdfejSB4LUdXS8RFsuWLRsKx1+JaZC/wFEB0VR7v37UfJzxIFCmIkgWR7Wl8ssEFCCXWTTSXnzx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"
                            />
                          }
                        >
                          <MenuItem
                            eventKey="1"
                            style={{ marginTop: "15px", minHeight: "40px" }}
                          >
                            <InputRange
                              maxValue={20}
                              minValue={1}
                              value={this.state.letterSpacing || 1}
                              onChange={value => {
                                this.onStyleChange("letterSpacing", value);
                              }}
                            />
                          </MenuItem>
                        </DropdownButton>

                        <DropdownButton
                          noCaret
                          style={{
                            marginRight: "15px",
                            background: "transparent"
                          }}
                          className="noborder"
                          title={
                            <img
                              style={{ width: "20px" }}
                              src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAYAAACtWK6eAAAAAXNSR0IArs4c6QAAHbxJREFUeAHtnQnUFcWVx2Xfd8FEMaDihoKDKCLiQkAmLrgGB9xADAoo4noUt5DMaFRk02hkFERcOEcFlRnB6GBUwIVFAY9BUD+RmEQTBWQRBIT5/zvvPsv6ut++NHz/Oqffra66VXXrV3Wrl9ev3x57KIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACOxWBKrtLr2ZMWNGi+3bt7fduXNnW/SJ8qfYGlSrVq0+9hsgXgfxrTt27NgMuQVp3NYg/jk35P+1evXqn5x33nkbka4gAgGBXdJBZs2a1Xj9+vVdv//++2PQiy7cMMFbYaLvAfmvjiXiTMsksBx0d0CugP5ixBfVqlXrJTgM9xWqKIHMZk8M4Dz99NP7bdu2rQ8mMLcTMYFrJSZ1YJ3FKTMJdBwrQ32LW3knfzniz9WoUeOxfv36rcykbunsPgRi7SBwioZbtmzpj0l7OZB3drE7EzhITjHBQ/PduhjPoD563gs4Dbv3wgsvnO+Xrwr7GI/m3333XXP0laeuDXEE31GnTp11WLjWUeJou3l34xBLB3n88ccPxoQfgQG4EAPRKBPo6RwkkzpcHb8+Nw82zYSjDL/44otXu+m7S/zJJ59shkl/NPrDU9dOkAdg2x9b5FhwgUHYim0t4u+j3DuIL6hdu/Y7559//pfM3BVDrBxk8uTJ+wLuKIAcAMA1UgFFfnLVpx4HyNLCylkeZSb6YXW4aWhvE/ZvveSSS8a76btifNGiRbXef//942D7qeBzCvp2GGTB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tzPyZ7bBr9KiTHKBUycxcKtxdHodea81bNjwBVyEJ++sRNWzu6TjDSHNcCOEt9XPRP+PRL9a5ti3r8CQN1Rexu3ll7GofJ5jPbtksVg6iE8Sd2tq4Vtbvub/COTxzldzDDzv4PD7FH4XsBGDuBGDuBbpn2D/I7zF/MOqNpjod2Q4/PDD9wW/zmDEl/k1A6dmkE1RoCHi/Au1jeBJjuuRXoH0lUhbsXz58r9HVqoMERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABESgEgf8HKlpIgBjJEpsAAAAASUVORK5CYII="
                            />
                          }
                        >
                          <Button
                            style={{
                              background: "transparent",
                              marginRight: "15px",
                              backgroundColor:
                                this.getSelectedStyle().style.fontWeight ===
                                "bold"
                                  ? "#ddd"
                                  : "#ffffff"
                            }}
                            onClick={this.toggleBold}
                            className="noborder"
                          >
                            <img
                              style={{ width: "20px" }}
                              src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAYAAACtWK6eAAAAAXNSR0IArs4c6QAAG+pJREFUeAHtXQvMbFdV3mf+++htKfIQCLWN8opgReQpoRFSlapNLEYiKBRieVRFikRCaXzEq8FCQi2UyyPWpPKwlAIaReQhEoQWaXhEAQukldaU1kAttNzCve3lnzmub5397dmz55w589/b/8Gcbycza+2911577e986+xz5sw/fwgqQkAICAEhIASEgBAQAkJACAgBISAEhIAQEAJCQAgIASEgBISAEBACQkAICAEhIASEgBAQAkJACAgBISAEhIAQEAJCQAgIASEgBISAEBACQkAICAEhIASEgBAQAkJACAgBISAEhIAQEAJCQAgIASEgBISAEBACQkAICAEhIASEgBAQAkJACAgBISAEhIAQEAJCQAgIASEgBISAEBACQkAICAEhIASEgBAQAkJACAgBISAEhIAQEAJCQAgIASEgBISAEBACQkAICAEhIASEgBAQAkJgKxCotmKSHTvH/npPOLL+raOLD9DV9iKE1CFR+vobq873Onzf+g6Hqj7ssq5Mt3pdHbL6N8OoviWEkb0gJ7eEevctYY+1768mnT7VsWEEeHQ3PHAlBiBB7jpyd+taKoOmNrJDeikSoKi2+thIYzkf54ZsK235N7LkqcNnLe5rwtrap0O9dk24sPpm23C1LYcAj/5y1qtm5Qlyd3uClGstE6IkaGm/U+pVuNF2nU/ZbvP28JpdH7OE78i4nRLwzopDCXLXXe0J0pcQZX95XMsEKu37+jfqbxn7UXWdmb011HvfHl5b3V4OUX0eASXIoUNNgpSXOCVW5SVPn305frPrG4rP7mfC5Iqwtuv14cK9/7XZof0g+1eCHI4JUhKsvMmeO+PblsAkAQOoQ6KU/ub6zYY+mwFFAzujP7fJ34otqfSfm0IvzJu5q7HJA2Hfvj+1m/uD5RDV7cJ08CCAyHihUHqFHwZB2sv7oqQdZT4WbWynRP8k+oN03ewonb3uBG+xxJi8D3r5ghltoEad88M39K753H6yFurJy8OhQ18Jrzr8VHhUmUVACVKDSJFMSRqxSLQuCXI6yUBM6OaDMvmhX9pE6cQu9L7xMz4ZcyY5d/KNA405YnH/prufbJzXxyeFevyxcP6dL6O5ZIOAEiQxgWQicdHBNuhGKi+Q9vKzf5Suo5k2MOTY6I/J1JlwGMIxGE9fkLmOvpbCuSFdN1+UKWliLDOxRV/1ZJfNf0k4/+BFLd4H26QESYQ1YrkO2fYyjng7pL3yWwTXbQyl25lRkpGYngCF3jl/MT7ZoT3vi7GCwpiPxedCG+37JPyYzWTyinD+d15NN0OXSpDWs6sRxQulVUg+J30kZa7Dnja5Tpu8DfrMrhDJiTYS2u2z+WfO+tbuCRBlrnM9Hgv6GSv1YiztczmZ/JElyUs8zIG/KUESgYwJrkPmeiQYiOKkg2LFSRmlk5rkpn0kJImXk9jtI1Gpw442rpsfyhRj9O1xlP4Le46F9JeJJKHCPkr3Tx3SXuPJxeGVdzzOtEEXJQgJ6iSJpJvR0RZJRplIF9sT8VDvKHOEhF8QHjKOo2xzwb4u+77+vh0rxZKScK9dbr0nXFzvawtnKG1KkFayk+iURoc+gs8TLCZAJBzmcR/wSb+Ubf4TUafj8vHUfV6zRfG2Rk06+ydxfki8EANlKwbu72HhltvPix4HKZQgJIefgUEivkBQ6B0EL+3hh230uUg6mTfiH4Q1exbqkK7HeH2nyPTUTzv4aHm5j2jjY9L6Lwj7b78Ppx2aVIIsTSBQAwRqRNLZMEewnGwtuvuiM5M8m3ed4TeaUFwXZTlfGW/Zn9Y1uW+48/uDvWFXgiQiRLKSUHMynVEtN0x3QkWZk4vj8rZc7+qHTf6CHcflOm3yNvrMJb60izqkf4E3k/SRy0X+xvWzLZhBFiUISUUy5qRZpC8iFH1uRPbNX863Ufu+WBb7+6nwylsfMcQMUYIwCUoCzhGqZwehny6Zn8Xzs/vcPPHMXxK2jK/sL+fNdznoPg+lzVGOL/2Xca2Pzxpiguwa4qJn1uzEiC3gzcKSGXDcjLRH6ayH0QXhvnveutDdos7vjY8P6+Fe9kDifmFcPTRUk4cbpx9nT+ufZvJ+fs+Cb/D6vYs5avs2b4oFEzH2KIuqh8I2rxRvdXhs0TKIqhLEz7Q41v49kSjnq831fJ4AbfbGMDSj1PVdYf/9j+Ur5PnYzzRO7X1/PQp3fuPxljwvtnuLs433zXMKXwfiw30RShFf05i9Ixtog2bqkPNVW8+jm45hvesSi8ebxIL0lxEoyXhqzc/IvfZjer5nJX6U4S8f/NlwyUnnhupeJxtx35aSgjH5jDFm3zniWqD7mmIS5fbU2Y+1ug5prxAeack5uBOqEsSJ4AQgERpCzxGGiRMlrGiT6yRY42Vz31//Q98OB04+J4yqZ1kw9peRkcwz5O6KN1tzkwCL1z+Z7AmHbnvg5i5o53lXgiRCg1w4s4I4kWiUbQRyOxzQBfbo3opyycnvtTBe2JzpYzw+L/RYmMxcbyl9rT3rP/T9e9PdUKQShEc6T4JcT/0gj5WSWKyzz43wFu1TfZOVA6dcbrcRb5zGhyS3GLAWX08mZ5I7xpWvOdcZNnytrZ/I6lCkEiR9NQOEBqE6XmAE+roK+zi+y25T29deZ+7XWxMiTxLXsU7sMFhTXDMl15BLxD2eKEGAw6AKOIKXX2JE6Q3siNITwPScNLnuQ7ME4l/4oX2ryoGTbzbS/71P5/Gaxhh9fYiP64EV1hObqKcGdtDexq5N1jFqSEU7SCKQHXaSCgzILzPysy8JlLdBdz+UWaJsPZvsFxVjIlAy5lyyz+OO8XpbDLh1/bu+vfXL2d4ZB/ex3TzcOENayQnRtEzbvD8+J6jjcwKQzfU4nmOS3KYkGU1uCuMstjze9KwjBpmHvsz6R5NvpeUNRFGC+FnVjjbIwmdlOPjUUz6YgbfNsAqW7WXCge3dm9da3dzcU/TEO7c+i4htCI46l4EEGj9UO8jmHbgd6jmdOWN8i/if9/UuZ5MeFPbNO6lPnO6GC4y5li6JoeyDXlniHajaf6YV/StatIMwQXCAc0JQp5w7o5o929rIge9GbUeZrNvTdUyMtzxA6gvi4lo5PJchfBLVoRUlCLMCicIv/IEF1El0kocSNrmO+kxZQMQZu3u6Uj986jEPkDrl1Mq1vvWH6qpixCCq+hQLxOAuQtkwJhIAhGp5uW0c6z7spjxJ08fbcJNe2x35JPxmE0ce2xI6Vrto/bsq7SCREQMTIL8VkIO7hte9tcmNqM4I2OKr5txhvDP6mjHcwsrvfvVpFvDDmlCK9ZRhcK2Mf9H6q+rz4cAjvly6GEJdl1g8a/olOkgVDzu47m0dNPBnBmaQPzvITeknb9tM/bzr94Yjd7+h+ejZJvLYF6yH66ZcZF+NXr+Zoe9k3wNPEDspkuBICBTKcocoz7B+BrbLKJ6Bm9Hb937k7ottF3xMukziOij71kM7StqP7P8gTn78Pdu3sO2deeAJYuDzTF8mgBPF3kgYHCeebV3HPYYNZoKl7SY6rLfoY95z690hfOlNdrl3bhMsF4Qgs1LueGWCd60/hD8Pl1b4h6KDLEqQGdJn2QBCkURt1GAfJEppX23B5x+//aUnhPEX32CznzZ/SWVr8Rjjmubije0L1z/6YPirUy/19Q30TQmSdoCCAc4fe4s8KjeIpj3rR4PbcsAmfYq1/8bjwi0Hz7DJzgnr41/1uBA65+b0ZTxMBMpiuS3V28Lu0Qtb2gfVpARpmGUHHTsB2BV3BF6pUIJY+Rk5jYuM9OGwifypq1PCi774+Fg7OrEWTrDfx8UfKT3QPr491eRPhq9/5zSL84Tm3ieLd24Hs0DYhtnL+D1ea2e8+fore2JejZ4b3nLqNzB0yCXBM0gQ9l+7J3x9yX8DPQdQyTCSNSbMnP0GG0p3TE5IL6VBj//SvAw/Da+O2J/wPjP89U9/IDUNWNEOwoNfnmHZ3imZCFE64Uzv4m9JyJKw5TxlQnA3mLkkZAw2eBn/mfncAKx/5Dfjz1JyTA+GEoR/2ASC+YO/CE5J4A0T0PzkhKTeJef8R0MQF8WFvcVqa0IkOx8xtY3VGcG1QqKMwk1hUv1GuOyxn24a9A4ElCBkHIlHCXRyHfWNFIwl6bvGHat/+O3ywbkhUdri4dgqvD+E488Jl506uK+zN+B0vytBOhlWgBYfe+DPtpti7Jr5gyljop/tIyOpcwcoL5nohpJkTdIUjoENdD/rZ/7LfsyFNpTkp6mm2GbisV1jVP1JuOyJ74hWEgUCShAyieQigdLpPxIOwJF0CcSsgeMoMcx9RmPq7E8+FigztpyLEuMynbaUbW6nfbfbJdWF4ZQHvCnsf8hdbaZqaxBQgkxJ0xCazChvinm2TmdoIyfbfIxnhGk8g4O8pif/1GM/RDTx4bDL/VHnfNw9eM+AdrbBAX1Beika3J/9Tcfa6G/CcSe8zz7C/S4tJbsRUIIkAheEcnLzusoApB0lMM31dDaPDPUEMD3mQ9pNOCaapWFQvC12UI9VP4Qc63PH2NKnWjaR93NCN/JhFsP/2nON54S3PekTTYPel0UgR3PZMatjh+cgN9zR/BlpecbuWyXIyDFttuyDRJmzRzvYH/uLKobMlHL8nH+zpg8fSN8xwzyO+usW8zX2+rR9YvXJ8PYnf35mDlXmEIhHZ659GA15giSyRkL1IkA2EsKCkImt7C8dHqP9RhOknB7xVeFL9kHDpeG4Pe8Mlz7hO3MmavCjOFwYPEFub/8hgt4zthGcJG1DkH1+5jaDTfeHOeyV8hFK1rBo/qo6ZKbvDsft/TNLlJtsoEpEYAu+crrDscY1fNsLYafr+0ynLcjn/SAhXiiUUOPnwV32IKz7MOk6qtn45Cuzm7HnuNjvN++mQ+KFeSkZJ6X7QXy0s3/WU49fEA4f+nJ43lWvGOK/OTAwWosShLCQnJD+QuJEAjmxzJASY0p7khcy1+kvH+N6kUDwPfPi3DEe/91c+Ma4GBsl5vANI0ruIpT53J3xwLd9ObKeXBS+dtXnwvM/+SQ0DL0oQUhKMCFPACe6N6Ij9kXpdlnbMv3+lRYbA5nrPo+190mY+DzRlDrH5TFxTbl0eyRXnKu0d/fot9L8ZeLV4flXP6dpGO67EoRnVCeTkSeRijpky6sh0pQ5sGFbq330QYI2xs0YjqNsG98XH8fSY188c3PEXYnrn0x2h/H634azP/H7dDlEqQRJhAXBN/DKd4FcTz5Ap5g0rkY9EbMgJGxBzjR+A7FgTB5Drh+tPx9nv59aj98Qzv63v8AShliUIImwIOiCFwiDfhLOr++tDokX+ijdT08C0JfbRt+L9HL+cnxf/yLffX2T8R+G533sxUqQISJAwvfJkpDlJY8T9Bh2gA3PXySVz29t9FPGW/bTblk5DpeE537i0UOjiL5q4kSyw+5n/yjBArTzWQbq8wZZW1t/dYu13ooeLxv2b6Mq/FfZ6r4WzP0snuOnMcCjOfTY4dgKcgOFskvP+31AfOuPb1+oj1wZnveFJ4Z3PuZ7+dBV1pUgZBRO/iAJJIrrSJKmOmVezrA2PbZV9evCu864hKOPWf7Wx4+z+4z720+aWrKEkyx5H2ex4m/en2yx/YgvgyTHZNRT/D0RLLf+R4X1W19jnl7W421lupeFb2UWPLMQPEn/6s3tT9JnDFEB8cm6uc6sL0I6ql5+jyZI25Row+/xnv3Rp9hDwWdbxX6Xt/rhdtMyfq5lWQqk8XfbE/cfC287fRA/6KCbdCe+HXx+gsSPOUvpZOT20kZBEAgFkro3bO5bVdXh8jM+Fa74xZeF0X0eZjls/8izPjKNI8bTd0+y/Pr3hruP/MHmLmrneFeCgDhOHjsolH58SPIOgnkCYawlTdtrO37d/fInH7REOT/Uux5ta7lxJi6syZPAFzdd69GsfzL5nfCcq+zeaPWLEoRnfCdPRngc+xlCxd2DyVD27ySuXPkL14Vd9VMtpOumYRUJz3VTbmz9J4bxd1809b26mhIkET4mRyIMCIW2+AIH8h2GycPxpQxb9Nu8Xdy8/Mybw97dT7eg72p2krg+rsfjZRuSP+rLr/+XuqZepfZhJ8i12aEk+bsINJcA4FTcVeCmHJ+53jb1HU+/yeJ6c5PkFquvDTLGTdkWv683SyCvx7HNuNPCr//7vm1b2xZNPOwEcWJ0EMbPpG5gb0aU8uUkyQiEfrZB9697YPw2l7UTXmsfCdtzC6wBBTKLlcT3rpg40Et7jqOsx3vD6Fs/66Yr/KYE6doxchK5TmKBXC0v5xRsdli54vTbLHHtLwcRM04GLbHP9PGEEe1TQmBt5djw8ztstfd4OEoQQgqSoHQRiH1uFO3Y1kqw/GzMQdsk6/q/ndwku0sPfhrQ0ay/njxy6mA1NT1J98siO7j+3MyShM/NkC98lubHPiZQIpc1klToL7v5p7Y+drvfJl/zCLgmVBA714w69Y2t/wEYuspFCdJGchxxbze2sJ/fy+oiPsnHREnfWdkJ9LFfbMc9Ecifb2wp1hhjXl9m/XX1wJ2wus2MQQmSTv1tMGeMYaJQ9pg3bGwz2o62ySnTLW4j8/esvworv4PoHsQTxIiAHziADskfO6Dkp1OUHJNLTxwbC4nXZJufg+R5UE9Ont6gd9yEH836a/vnPvs/vtInWSUICQ2yk+ROfDDM2li8D03RrpSt4zl4G+W5n9ttl1dP9Ah4v4VKuZ7W+HvWb39uGPafvr6Nq9v0qVc6+/vRu3ZKlPIeAwRiGxxR5z1I2Z/u6ONd7jgjV38gm2dx2w3PMOcPmiZ7jKuMv299bf2hOrh5ge8MzwNPkOwg+NkVN+W8i6UeCZ+fcTmMbV5nQlDGcbTdLlmHl6bdoowhj/9o1h+CEqTEdPXqJDRW1qbHtvKMOwcEEgK2MTHsW+jbXn7t3eeF8fhprXGUO4Ib5TFTj7Jt/XVY+X+4ox0knUVBBJK8jVLWx7NsW3dKLhIrJkqr7RY0PvN9P2M/23PRdKZifR6mvTHclNypYTrUtZb1V8GuUVe7KEF4SeVnVDwriMQuz5ho9rZIiLK/5EkXz0q7zag/412/EtaPvMvi3TPrPg+KepRHs/4w+sKs/9WrKUF4TP1BmmUBv2SIhMBHnzFf0nV82nGsY+GOQsdbKM/6xxND9d0LLPAL7E9v7RNKkJ8L6InjaNY/qpUgPbD+4HdzB8FKEvlRAbEWEAzjeNaFeVmW5GU57KjqZ11xUghj+3v0g6+ykOPDu7gz+BqW9LqR9Yf6cNi1e+X/I652kC4CcffwB2gtBEMC0KalO1RrI/uV9HvuOdO1763CniMnhMPh3vbPbx5kcz/KdrBT7f83/5w9jrDnHPYriCmpLSDmNvOkjLEn/9PautY/Ch8K733Wyv8bNyUIz5q+GxibeA/SxzASj7Ik4Hj94vC5d1xcNh9T/XDb6PyJfRZMuR6sk21wQ1NK9i29/tGVbdGsWpsShAkCxjhZyBiQKNetzrMuWEAd0kvZgLFsiyYLBW3pcIPj58ytAW0pE6B6QxPFsdhX4Zv20z//1Dha7XclCJ9XzBGmOPC9/CX5cslB5qs8Q8/Nl4/j3GxjvUfm5tQpy6EMbdl8zO1Ho1fb5VXrflZO84NeV4KUZ1UeURCLpEAbiUaJPjx0J8FgM1dobB28X+E1fd/4cn7GsnC+LIC+8QyNEkNLnXPmfXX1P2HfvkuzmVZaVYLkCTJzqI0t9qOFU9ZQjwwlmShnxnZUclvqlG1D8j6P0+ZO8RbxFNU5d33j5we0r3+09nu2e9gP0w2jKEFmTpvlQc8YCoI5CdkGSVZCNd1t0NZS2OdERT/HRvui6mGxLZnHGNx9Hoc1+A5lA9IOFXXedHu49sZhuLRkm/tre6Ox9SHuteqN4QPnfLDNclXblCCJsM4WMKHjWBvh3BasZcls+dAwPVeBHX3C3nQ3z8bkc9F3iicOx1AU7mYuvcHeOAfqiC+75qMfSp8/s+/1B595Gf1HeMiDz89bhqArQUhS5zJJbIeeXIJEmXswWBh41cZ32fsOU36VBX6ZMIWc25GKfozjnIiPepof/VZJ/mFEH232aLN+mri/aFdVN9r2cWY4cOaSP/Rt41akKEHyM76TKTKs9ZIlJ3jU03hjBMlFcuTk9D57ow3nos1cAsXdgP4xjqSFf9jz6yGou5210R7GbEN/Wdg3Y89JzHi6/lvD3l1nhPefM4hfcy9hUoKQoFPmTjFKfWwiu7vqbG+RICKTgN0b8k/y5jFkOnx5AsU26pBtpbRvW3+obwhra78c3v8i+9mgYRYlSDruIJazKrZQjwwrz7jkJiVGlTpdoA+6n5VRQWHnAv80cXOr5DsGdci2/rZ4F/nz4DODqromVHvPCh98wf81EwzzXQlCVi93Rp1lyUxCRHLxJppcg0Rx/1aB9FJKNLKtsSirs/20jZJ+KWfmWMKfxwc7y6yqujhUP/rH4UPDu+eISCWhBPEzbcQjJxd4R5Kjmze8kChOqIzwvMHlk/l4C5F+hwrDFu4gNiHngH/OHadLY+HD+62Du4g3FAEX1Tl/XCslfNTh+jAKLwgffsnV7lJvQQmSE6QkROSiN9OOEo0zehzMMSR7V0Kl7YEDevz5fHEO1+O4PIbk0wzKBEODJ2/MOIxjjKG6zrovDE/5ictX/VdKMgSXUpUgJFgboZxwkVAlnDMEKztRNwI6h0nkvM303vkwjkaNu7ya9I7w0tdg4i1K+giXO1wT25fN86vDaS+9MuyvJuFfrKYyg4AShGfdyGNWI7sNLHbM4NZUmFwtXb1NdEuZ5kkN5iLXyyqTJ2ZIW8Lmw6nXwX7HqrraLqXeHD5y3t/ZLlKHjw7mn9b2HpbSQAlSkrBEqKsOwpGji2zYNyVo08Kxkd8eBts4Jpfsoz3vZ9I9iRmzLR8HvarwSdSHQzX653D8vT4S/uGcO9ykUmI4DgvelCDpJr1k4ALU2EXSo14Ob0ug3J46Zd942lFizhkdFc8e/AXVDaZ/xT6Q+s9Q7fpQOO28z/glFMaobAgBJQjhQqL4TWu8aOcNLG+yaUc5d0lj5PRLLifpVOdlWOmPfCbJOZb2IDvbMOeoOmQJcac148faDlqf6fbLhnW4w+4vrjeDr4S1yVfDvU++fu7btv+qnYKHTVIICAEhIASEgBAQAkJACAgBISAEhIAQEAJCQAgIASEgBISAEBACQkAICAEhIASEgBAQAkJACAgBISAEhIAQEAJCQAgIASEgBISAEBACQkAICAEhIASEgBAQAkJACAgBISAEhIAQEAJCQAgIASEgBISAEBACQkAICAEhIASEgBAQAkJACAgBISAEhIAQEAJCQAgIASEgBISAEBACQkAICAEhIASEgBAQAkJACAgBISAEhIAQEAJCQAgIASEgBISAEBACQkAICAEhIASEgBAQAkJACAgBISAEhIAQEAJCQAgIASEgBISAEBACQkAICAEhIASEgBAQAkJACAgBISAEhIAQEAJCQAgIASEgBISAEBACQkAICAEhIASEQI7A/wNReibDdP6KygAAAABJRU5ErkJggg=="
                            />
                          </Button>
                          <Button
                            style={{
                              background: "transparent",
                              marginRight: "15px",
                              backgroundColor:
                                this.getSelectedStyle().style.fontStyle ===
                                "italic"
                                  ? "#ddd"
                                  : "#ffffff"
                            }}
                            onClick={this.toggleItalic}
                            className="noborder"
                          >
                            <img
                              style={{ width: "20px" }}
                              src="data:image/png;base64,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"
                            />
                          </Button>
                          <Button
                            style={{
                              background: "transparent",
                              marginRight: "15px",
                              backgroundColor: this.isUnderline()
                                ? "#ddd"
                                : "#ffffff"
                            }}
                            onClick={this.toggleUnderline}
                            className="noborder"
                          >
                            <img
                              style={{ width: "20px" }}
                              src="data:image/png;base64,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AxteSptG+7qOeXH36TKN+pB89kVynvNFFMvsUgPn1AOQ13TYVpg/m1NP/AB/OTgMVI11eCu2qAlcdMfnZK2xye6kATlMIE0MC/kGu6qekeq98npFRpcDksp3KdWb5PKcJEJ4p+QP/7Yx7O0Uz5glnZVDhdlk74SVz6W/mTAkQ9xdtfnr0uKrPT14WtAzxZGjEKT6EcjP9QqkAkyPn1N9sceYZSvNzqufUxO4DSfAP1M8nFHc4h/bHzOnXypl1XlxReZ7hXleRqcPm50bns3c0qzMm2v/lZXRWRizavO1Mt36gdhSdzK4a+UXzcO6+MSLnhFHhgSU2aZDzoe2muoW2lMU8ivBqY+Zhz8lIwi3+RCgQOZDK2276ifny6Mdd0k0LsIPpobNmVJjGtoXxZ1mxTHXm21X7EuP4P5wAhTIcEaDW1y89XjT3X+7fCMtd5gEpx9B0sMUNYJY65DXtM+Gc/kRQdrgFLZ5cnzaXhf9neJ6s/MzImBuh0qAAjlUculxq360xnS735UoPrWuSgLYR3cT8oVq36nkUf07TbHsZk6p6itxOO9NV+twzjm5x15z+xFmz4EbZRS5UUaIkyIQaQ8frhG04bD66GRN7TuPyLc0G83D1/0xbc79QyNAgRwat8FHXfjwclP+a70pyhtkJnVO3TgdIdJT6KVAm7RO91GnqW6ufdF5VaruN1PFLSKMv9V1fF8oAhTIQpFsOs8Ft50tQlknd7zWSJOz/BplviNGfP59MuI8ZorOPeaE6R1mywb+semYz4LtUSALhnIOJ7pw8wmm+5o+9Ph+GRHkKd/iNEn171ZNY0CwqT2VvTSyntAv9/RPosqr6OyS0eJJc8zxu+SulPyYi9tiE6BAFpvwXM5/8Q+nzczSFaZ6fYU8nyW/IaleNUd29pmzz9hvNp4vP4flRgIkQAIkQAIkQAIkQAIkQAIkQAIkQAIkQAIkQAIkQAIkQAIkQAIkQAIkQAIkQAIkQAIkQAIkQAIkQAIkQAIkQAIkQAIkQAKeQKt/D7J79278/tQ7xEz+BM4888zWxB3/P0j+8UQLx0iAAhkjfH50/gQokPyvES0cIwEKZIzw+dH5E6BA8r9GtHCMBCiQMcLnR+dPgALJ/xrRwjESoEDGCJ8fTQIkQAIkQAIkQAIkQAIkQAIkQAIkQAIkQAIkQAIkQAIkQAIkQAIkQAIkQAIkQAIkQAIkQAIkQAIkQAIkQAIkQAIkQAIkQAIkQAIkQAIkQAIkQAIkQAIkQAIkQAIkQAIkQAIkQAIkQAIkQAIkQAIkQAIkQAIkQAIkQAIkQAIkQAIkQAIkQAIkQAIkQAIkQAIkQAIkQAIkQAIkQAIkQAIkQAIkQAIkQAIkQAIkQAIkQAIkQAIkQAIkQAIkQAIkQAIkQAIkQAIkQAIkMJTA/wEzRNV2GGb7YwAAAABJRU5ErkJggg=="
                            />
                          </Button>
                          <Button
                            style={{
                              background: "transparent",
                              marginRight: "15px",
                              backgroundColor: this.isLinethrough()
                                ? "#ddd"
                                : "#ffffff"
                            }}
                            onClick={this.toggleLinethrough}
                            className="noborder"
                          >
                            <img
                              style={{ width: "20px" }}
                              src="data:image/png;base64,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kglP+rMkHUNACMI4OI5FIx78F4Yq3/LmF2xnHEx+8BVXe5GYRCa/TI7l+EL7MtRdBs/yUSaVlAwPo+oix4G4Y3BgbPgYnm4DC+g0xxx02zyPkqa9lr2Qlk4YF6ssvyYCQhCNyIgHv+d+CaTUMzIuMwmSkMGGqYUCK3BmfLCIn1SvQb01MHD+UiMmxnYlWVH+EiTe4cBmWfsjfTSGe19PrT/b4/vkLWsz2R0H05Lzd+BYEgIQEIL4QTlt1kUwxrneVZnLmnuF9usPSqe94mvy6a7yGTjrS1s/6KCqYhUqf5+WTXozmYTkExUJCD4ENixZTf1HtEfOUEUMRQ7s6ViJsoFy4NhvrEkM2PMuycq1Lo4R9FBJx/xX5uowSY6n2gbdHKu0q0MfLuH4KLfwWQayzqFll/0dexJSICAEMcF5f8kKGjCccfmBKlJjeRifHtOb8n4DVZbMAmzMOug0x/50knK/R2Ajj9PPdfw6/Gmtz4z9MkhbWE/iWBNo+eTHTUnZT0TAu84kFhV4zrD7J8KY7se8pMi7CAdBoowYBUmRTCNgEiBB3Mxgg9d53CCd5jggxOm36sl2xtGyKxcHSEpWAAJJUA2QLMSsYbPOIIpg8R/+X4QNLReD9kg2JuRkjadlV7yQi6ext9ocv4xib7WirR53+eRnYFTfwLBmaWxoA5IoorixP62GPppEOuYT02mOM9n8dfzpTOpCxt8mTqsVurSA2nU4XMjBeGYXxINkitep947HcGsmxLGUHL8aOZ3mOJPA9XQdltfpTOtncoxGmW1UZF9Gy656ojFLUtkgIJP0TNF6f+m/acDoeVjdy3eABuNKjTf2UDmdwacqD6pvtscvw2Wp9MWX/5na03B69urXTJWynzkCDLeEbBH44ewu5FRfDmP9KUjSyn8VkJIxe7D2eCGe2N9Dy69+J9vTEvlEBIQgiZhknnPR3HLavGMURfFMgaLDUbE84cGdqY3nBXrirMoMl2DsxnkpljfLY/o/ATFwx610Nj1/5ZexLPkNAwEhSBgosg5eCVxVOUqtmXLwhJqiPWOqTYtO6QFQxSyPaWn81frsr5C3HMR4go4/4kn192uNQpIKCQEhSEhAJqg57e5BVB89HnOV43HV50WQ/ZHunOABMuWDZW0Eed5E/TewvURdD3wZK4QjCceVjFAREIKECmcaZSNn9KA91gDcDesLI++KuAPiDhg3dQSBykGAWuzvwZPuasTb8VBvE/I3kdX5I1oxaWca7VIsCAgCgoAgIAgIAoKAICAICAKCgCAgCAgCgoAgIAgIAoKAICAICAKCgCAgCAgCgoAgIAgIAoKAICAICAKCgCAgCAgCgoAgIAgIAoKAICAICAKCgCAgCAgCgoAgIAgIAoKAICAICAKCgCAgCAgCgoAgIAgIAoKAICAICAKCgCAgCAgCgoAgIAgIAoKAICAICAKCgCAgCAgCgoAgIAgIAoKAICAICAKCgCAgCAgCgoAgIAgIAoKAICAICAKCgCAgCAgCgoAgIAgIAoKAICAICAKCgCAgCAgCgoAgIAgIAoKAICAICAKCgCAgCAgCgoAgIAgIAoKAICAICAKCgCAgCAgCgoAgIAgIAoKAICAICAKCgCAgCAgCuYPAfwAS7OeLHqvmNQAAAABJRU5ErkJggg=="
                            />
                          </Button>
                        </DropdownButton>
                        <DropdownButton
                          noCaret
                          style={{
                            marginRight: "15px",
                            background: "transparent"
                          }}
                          className="noborder"
                          title={
                            <img
                              style={{ width: "20px" }}
                              src="data:image/png;base64,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"
                            />
                          }
                        >
                          <Button
                            style={{
                              background: "transparent",
                              marginRight: "15px",
                              backgroundColor:
                                this.state.textAlign === "left"
                                  ? "white"
                                  : "#ffffff"
                            }}
                            onClick={() =>
                              this.onStyleChange("textAlign", "left")
                            }
                            className="noborder"
                          >
                            <img
                              style={{ width: "20px" }}
                              src="data:image/png;base64,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"
                            />
                          </Button>
                          <Button
                            style={{
                              background: "transparent",
                              marginRight: "15px",
                              backgroundColor:
                                this.state.textAlign === "center"
                                  ? "white"
                                  : "#ffffff"
                            }}
                            onClick={() =>
                              this.onStyleChange("textAlign", "center")
                            }
                            className="noborder"
                          >
                            <img
                              style={{ width: "20px" }}
                              src="data:image/png;base64,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"
                            />
                          </Button>
                          <Button
                            style={{
                              background: "transparent",
                              marginRight: "15px",
                              backgroundColor:
                                this.state.textAlign === "right"
                                  ? "white"
                                  : "#ffffff"
                            }}
                            onClick={() =>
                              this.onStyleChange("textAlign", "right")
                            }
                            className="noborder"
                          >
                            <img
                              style={{ width: "20px" }}
                              src="data:image/png;base64,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"
                            />
                          </Button>
                          <Button
                            style={{
                              background: "transparent",

                              backgroundColor:
                                this.state.textAlign === "justify"
                                  ? "white"
                                  : "#ffffff"
                            }}
                            onClick={() =>
                              this.onStyleChange("textAlign", "justify")
                            }
                            className="noborder"
                          >
                            <img
                              style={{ width: "20px" }}
                              src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAYAAACtWK6eAAAAAXNSR0IArs4c6QAABtdJREFUeAHt3dFt20gQBmDrnq+BdCAoXQQpw29JWee3lBGoiwjuIA3cuzMbUbAXMQISgkaz5EfgINOhzOU384vJwct9eLARIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQmAR2JF4FXl5eds/Pz1/j9Ut892P89+/rn/rqjgL/x7l/7Ha7p/1+/1+8vmSNRUAm6dPp9CHgv0U4PmXhO89ygajRMWr0eDgcfi5/9/J3/LP8Let7R7tzCMcYdW0fYFOtUj7cBST6YvprlTvHGBl5aCFpNcsYroCEcoC3f3PYBhLIqpmAnJui/YPcNpZASs0E5NwU/m/VWOFoo02pmYCM1xhGnCggIInYTjWegICMVzMjThQQkERspxpPQEDGq5kRJwoISCK2U40nICDj1cyIEwUEJBHbqcYTEJDxambEiQICkojtVOMJCMh4NTPiRAEBScR2qvEEBORcszal0zaWQErNBOTcFD/G6g2jDYGUmglISMcUzictN5ZAVs1S5vVWp4/Zae1pJt/bVM7qYzW+3x9ox3i6yecIyc2fbuIOEh3XoGN7jNejBqwt0Go01erm4WgS7iBv+iHgPRfrjUehL+/2XKxCBoZCgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQuAqnzQcy3uLB7XShwt/kgaQGxDvnClnD4uwKXGYWrWie93Tli+xav5ny/W3bfnCvQemjqpZQP95Q56dYhn1t+x80RaCFZ1TrpcUHWIZ9TecfMFsjqqZQ7SFx1yprWs3UduAaBlJ7KCkjKmtZrqLprmC2Q0lNZAZl91Q4kUElAQCpVw1jKCQhIuZIYUCUBAalUDWMpJyAg5UpiQJUEBKRSNYylnICAlCuJAVUSEJBK1TCWcgICUq4kBlRJQEAqVcNYygkISLmSGFAlAQGpVA1jKSeQFZCUNa3L6RrQLQVSeiorIClrWt+yGn52OYGUnkoJSEyRtA55uf4ae0BZPZUyrzdmf1mHfOx+LDX6CMe61kmPC4qMWIe8VJcNOpgWjqmX1rdO+nQn+RqvbY56mzKZMits0F4w7FeBuz0X63UIviJAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIEBhBIGXK7QgQbYwmdJWt1N0mTAnI1BOn0+lDTOe0lnvZjJwHdplyezgcfmYMNeWpJhkXcs052p1DOK4RzHtv1OrTVKuUD3cBidq2RekbfF6ZnekagVarVrNrfsbc9wpISAV4e4iEbSCBrJoJyLkpUhalH6j/RhhqSs0E5NwKHj80QiT6MabUTEB6dHsEOgEB6TjsEOgFBKT3sEegExCQjsMOgV5AQHoPewQ6AQHpOOwQ6AUEpPewR6ATEJCOww6BXkBAeg97BDoBAek47BDoBQSk97BHoBMQkI7DDoFeQEDOHimL0vf09q4USKmZgJyrlLIo/ZUN4e29QErNBCTQYwrnU29vr7pAVs1S5vVWx47ZabuYwvm9TeWsPlbj+/2Bdtzv958jJDdfK90dJDquQcf2GK9HDVhboNVoqtXNw9Ek3EHe9EPAtztJe4BDm6PepnSmzFp7MwRfvi9wt+divT8c3yVAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECDwh0Dq72L5Xac//H1jnsDdfhcrLSDWAJzXCY76u8Dlt3lXtUZhu3PEZoHMv9fen84QiF5a3xqF1gCcUXmHzBZoIVnVGoVxQdYAnF1+B84RyOqprBmFKevJzYF1zGoEUnoqKyBm5q2mL8tcSEpPZQWkjKqBEFgiICBLtBy7OQEB2VzJXfASAQFZouXYzQkIyOZK7oKXCAjIEi3Hbk5AQDZXche8REBAlmg5dnMCArK5krvgJQICskTLsZsTEJDNldwFLxEQkCVajt2cQFZAUtaT21z1tn3BKT2VFZCU9eS23S+bu/qUnkoJSEy3tQbg5vr3thec1VMpD22I2V/WALxtv2zqp0c41rVGYVxQZMQagJvq4htdbAvH1EvrW6NwupNYA/BGzbPiH3u352Kt2NSlESBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQILBX4BU/mkiAz7LwNAAAAAElFTkSuQmCC"
                            />
                          </Button>
                        </DropdownButton>
                      </span>
                    )}

                  <span>
                    <Button
                      style={{ marginRight: "15px", background: "transparent" }}
                      className="noborder"
                      onClick={() => {
                        this.setState({
                          showModal: true,
                          modalObject: "background"
                        });
                      }}
                    >
                      <img
                        style={{ width: "20px" }}
                        src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAYAAACtWK6eAAAAAXNSR0IArs4c6QAAJxpJREFUeAHtnXuQZdV13s/pnicMbxDijYRACBjZ2HEldpyKIcJ2KRVHSLGjhyUhp2wwSZWScsWVVKUqj3/yh1Ilp5LIwY5jC4RtuSzFsS25IhvKcSJLOKjKEgiJh3gaGEDAMDAzzPTjZn13+td8vWaf++jpx+3uvatOr7XX+r6191lr7z739D33dtPUVjNQM1AzUDNQM1AzUDNQM1AzUDNQM1AzUDNQM1AzUDNQM1AzUDNQM1AzUDNQM1AzUDNQM1AzUDNQM1AzUDNQM1AzUDNQM1AzUDNQM1AzUDNQM1AzUDNQM1AzUDNQM1AzUDNQM1AzUDNQM1AzUDNQM1AzUDNQM1AzUDNQM1AzUDNQM1AzUDNQM1AzUDNQM1AzUDNQM1AzUDNQM1AzUDNQM1AzUDNQM1AzUDNQM1AzUDNQM1AzUDNQM1AzUDNQM1AzUDNQM1AzUDNQM1AzsHYZ6PV67dqNVkfaqBnYUovk5Zdf/onYGDe3bfvXQ54Zcn/IPw/5u6effvrnQr66UQtZ5706GdgSGyQ2wckvvfTSf4oN8LEBaTwU/s/Hccdpp512V8i5Adjq2iIZ2PQbJDbH7v3793855LVe0+g3sQn6JtdlCPvzIe7QccYZZ3xdttq2ZgY2/QaJl1X/ITbAL+RN0FVuxy3oD0xNTf3Gjh07fuukk076qy5etW/ODGzqDfLqq6+ec/To0cejdCfpasHiR6qkXbp8aviDPx/trtgsdy7cr7x2DFF/buYMbOoNElePj8ei/qVcQN8s2Tdi/1DgPh+bpd6vjJiwjQrb1BskbszvjSvA93MVyEXyjSKMmmxqznG971z6Y19w7gzM7WeeeeY3lrpqb6NnYNNukAMHDrx9Zmbm216g0kJnkwiH7rKLX4oV2PvjqvLphfuVp51b9Y2ZgamNOe3hs457j5u0iDnEYOFLl91l1vvO+JH52F1arGviJd0njhw58uSLL774pXiJ9+Hw7XFs1TdWBjblFSQWZRsvrx6LUlzC4qUsbBLJYc2xijMKRzETlvdXbo/3V+6OGPX9lWGJnyD/8FUyQZMddSrxm/u6ubm5uwfhffELlxb1ItVxvtnc3sUnpkndr3wm8HfU+5XFFE+0sik3SLy8+e+xKD9WyjwLG5/6araIi1cKeI4Xz/voso/Q7ov7ldvr/coImVpHyKbbILHQd8UG2RfytLxg2QTkW37ZvLkt8x0nPWM9vuvwsCEXYvTfX4lYt8e79r8Xsr6/QsImQG66DRL3Hu+Pl1e/tbD4FjfAOIuduuQNgL0kwTIOmwBZ4hRsB4PP82D1fqWQoLU2bboN8sILL3whkvjunEgWsNuxsajdh+4YFjsSDBIsfUlsJSl/KdaC7dlw3xlHvV9RotapbaoNokdL4k+sz8QC21bKZ2mR+gJ1vYuf7c5xnbEcL1tuznEd3ILtvuD23185+eSTn8FX5epn4PiKrf6YqzZC3Hv803h59UkNUFqMpYF9IXdxHJNjwCktbrCOwSaJXfogvvxqgdf9yp+E1FPG/yPkwWOe+nO1MrCpNki8vPpaJOr7tNjUWIC533faD+F8gZbw7i/FdX+Jb8MtmZfHcl14+tI9vvrR/H5Fn1+ZP2Ze3s+I3zYP/OpVTTP3A81c78oYPY7mrU3bnBaDnxr9U2IW00uit+3Cu63NfNP2Zpue3uPpHQnM4Zi8Nq8+NnDsaCXbbzVTzb3NO25+JOa79K8jSwJPTmfTbJDvfve7V8Zv128ptVpYhQXVt+EfVIIu/iAOPnGX08Yd088v9GeCz/3KfaOO3/vWp89q5g7e2My3PxYL+28H75xRuSeGa18J/teiUL/f7Nrxm+3lP/PCicVbPfbyqrl681l25Oeff/7fB/lflAKMu/hyjNXke2wteprbZfMNAaZDfiO4/fdXSvcrvd5t25v7598fEX+66TXXR4zi/VpH7FUwtzMR9IvNVPtr7TW3/MEqDHBCITfFBonF08YV5LG4glyihVVqvuBYbIMWpGLAcR0b4xBr2Jjyg0W6DT7x1UfPY3Xx3R6c+ej/SYTp3680j/7Ktubw/M3NfO/jYTtf8Seutc2fN83Ux9u9t9w7KXMrr6ZJmd2I84h7j+tiMdzNAkGOQs+LUJxh/BJn3LGGjUE8xlJfOm1k/uyhZtdr357ZefA7cZswtx3+xErdm/SaTzfTu/5le/XH9q33PDfF07yxWPTU7JJcqo8NuQQQHV98jne7OJnvfXTnlziy0eCoj44Eg8x29d2GjoTXzL3enPTyXzSn7fuD2CAPbd8Qm0OT738dU++mZv7w/b1vfuonFs9nnZQ3fiWt0wROdNhYGLviCvJcyPhLy7HGAvffuPJoEWFzfYG2uGFG4WeO+s4rxR/GkX8Qb1S+rha7X/l6M9XTy/uN3tpPNnvP+udt+1Pr8hT0ht8g+/bt+0Asgd9k4XctB/wsQGQXPtvH4eeNoljwc1z6cMAyP0lsYEtS/KmjLzUn7/9as+3oiyXIxrW17R/Hb45/2L7z1pfX+iQ2/EusWBgfzouPReXJlM0XXeY4Ft0xo/LFyeOXbIyBhFPClmzwJNt4G2J3bIxTn//S5tscOsFe74Y4yS/3vnnbxequZdvQVxA9WnLo0KHFR0u0kEZtLDqkeMvli8vmk+6N+Eh89BlzHL5zts0daPa89JVmekZvLWz21j4df5T+8faqn79/rc50Q19BDh48+KFYWNtYMEoav4lJYO6X7IP44JFgR4krTsaJryPbiZ9lxvn4Ow8/EVeNP94im6OfzQuaueZ/977xqe/PeVqt/obeILFYPtxP28LrdC0mFh8LyxcUNiRc+pKZ74mXH6zsGTuID89jOB+d8cDnPvyTDny92fPyPfrTLZCtIeM7lSPzd/W+8V9/cC1OePTXJGsxmzHGiDcG3zE7O/vAIIovOunjtnH4jmUctw0bHyw4bYRs68ftzcfG+Eqz8/Ut/qUpbXOgabb/rXbvz67qVy1t2CtIbI6PaMHwmxbZZcPOb2DwSPlzyz7n4svSY8jHgpd9FKwwjmOT9PnzM80pL/5Z3Rz9ZDSnNr3ZL/S+/Wur+lTAhtwgsYDaOD7IQlK+fCH5opRPLWOPWZf+dMxSzzE+cZElDDYwxJTEhhQWf9bB4O/NzzWnxpVjx1E9HFvbsQz0Lmxmjv7GamZj/NcdqzmbEWPHex/Xx8K5S3AtJBZRSWehdYUucYjbxXF75rsP3THYkMxP54CODyn7nv33NDsPPYFpRaTeYZnftqeZ235aHKc3c9MnxwPtu5v5qV1Nb2pHPPERvz/bqZhXiPmj8ST868303OFm2+z+Zjrec9n2+nPx19elTzCsyMTGDTLV/lx7zc//6ri0UfAbcoM899xzvx4PJt6UT5AFVtowwuIv8XyBOl/Y3B+XTwzGR3rcQePvOvhws+fAX+Zhx+rH9utvgpkdZ4c8o78pZredEut/9MezNG+fZztzIN6Y/H/N9iPr/rT6M83e6Uvb9uYVf3Rgw22QKNDu2CD7YoOc6gsNXauGQrreZSutMrAes4Trsp0IP485NXewOeOF/zX2X6t68Zt/dvuZjTbE7M5zmtkd58TnmZY+2c48c566zgs7vP5cZw83pz0XT6uv92MtU81N7TW3fpo5rpRcmrGVirqKcWJzvEebw4fwRcVvZfz0kY4FkyVY5JIFkcGFPjzkOHw4hD3p1QdG2hx6oaOXSUd3nNvM7Dy3vyn0EonzVdz827Bvs5eoGpPxu+aMHWy7bXczs/uCePn3uEzr1+bbX4jB6waJAvbf+/BCqSr0JUsNv3ylhYG/xHe841hMilnige3i+1yk5yb+jiP6cpNym5s+KTbEm/obQpuiN7VzcR55TObiUlE5B6T82DMWex+w8EO82diYO924Lnpvb+++23603Xvzl1Zy+A11BYmrx7lx9bhBCaCgpWTIR6Hxg8+SRQBO8kT5xGIsYiIZUzLPEy7YmXhptOPIvnh5NN3MxQ317LbT4uXS2c3R7Wc1vejnlsdkLOEYCxt9jwEfH1jnO76vp5dux/nXytCb/9kYautukCjeB2KDLHm0hNxT2NynwBQcPxIeUnY4rpf4joMPTv2Srphg0T1O5hw4/W8I1m+Ok0G/6xkH2QfaDx9L5oyjj4SaeW5nHsy1iTcvJ6K1zY/EvGNaK/eFEBvqfZD4Sp+PUJRhBVTBwEoK7xzXvbhud74w7pPuffkZR7o34mS8+s7JuseQDt/jwXFb5tGH7/0T4RNnqv9FJvTWUfZ6Zzf3/7e9KzmDDbNBnnnmmXdEMa8tFRlbScqmQwuBxeAJxJ9t6uOTVCvx+46FH+BcEqOLD1b+ku78hWGKuJXi6xxzLMYt+TS/qZlJ+jrh2R9hvishN8wGieJ8lAUk6YuVwpEQcPQlZXOec1wH61xsXfyMpe9x8/hgshRHWG8lm/ulw8lY9bMtc7OfWBmX7fSn517N0HXs965bycE3xAaJQugrBZc8WkJxlAzp9CVVcOwuu3TnCwNfem6MIzt65sPBT985XbpzpLN4kT5Wxg6K6XzmAx/pfPBuc9wb9t5kPW7fa97J+a2E3BAbJP56pd8KF6lo4zYVtcTzYrvf7YPGctw4fLDO93GyPffF11Gyexz0Lly2g5f0+I5j7sLIrv707KsjvU8jzpq0trlgJcfZEBskbs7731qionAMSgKYXFDZ1ZDEoC/J4sDmGGzIjB3EZ1y46jsfHek4uEh8GYsdnCQNnyR6F98xzscuKa7a9NE1/5g4UyrLXrOz9+BtZ5ed41snfoNEMXbHab2XU1NhKI4KNUrzggoPv8TNMdWHDw/p2JJN8eFLByNdzfnHLMf/dH72jsrPPPri5znhQ5bGEId5bZudsA2iic/0VuwqMvEbJP569Z4oxuKjJRRGkkIpJ+rT0JHYJWXjoO9SOi3z4SGFA4OE6z5s8JCOgY/E5wsYH5K4jpUPv2RXjuCWsM5zfubIN3FXEE1yfuVeZk38Bomb8/4HoyiOy1Jx5R+2qPDDh+N9H0e6++APwpR88JAlDDYwjCuJDSks/qwLowMekvglSSziO78Lv21mf8m1vra2t2JPvkz0oybxuY83xf3HuygcslQ4fMgShqqBUR9cly5/bvAlM19Y7IN4jiOej4VNOOxuI7b70IkNRlI++OiOdyw4t0nHDn96/tD6P8WbJ6n+1Mp9UH+iryBx9fiQHi1RYXSoMBQV6flxG3i4kqWW7cQYhw/H43tc6d7PuMzP+NwXHk4pbsbnvsYXv8T1uaHDZ0z4E/nySpObm5pl7icqJ32D9J/c5SQplPoUt2RzPEVlQTjPccSUH47ry+ETX1xiYnPpc/IxHeO6MHBkR0eOMp6wg87Jx0MnvqSO7fGdXBPZ2nbzb5Bnn332qrh6XJsLQFGx58VAEfHTR2a+cLLRhAMrm3TnOBZOlvA9FraMLfXBLocPx6XGIKaPJ1s+H3iZU+JPzU7SIyZ2Zr1W/+VqRdrEXkH0rSW+MDlbCoUvF5SCg4OHxD6MD15SHOJ6n7GJiYQLBz5+JLHAZ7lSfMXlfKWXxscmHFhkF39qdkL/ReL2uSc055VoE7lBolhRm/aDOkGKRAE56dx3u3zi0UrYkm0UPDykj5P5YGRHl+ScZHddfW9wZEMv8Z3jumNdHzZmaSz4ig9/ev6wDzcp+mxz5VlPrdRkJnKDPP3009fFy6uLVBSKxQnnfrareGpwu/DwkBkHn1jgsoSHlJ8FhA0J1/vSM164jIHb5RO+xHEbMdyGjgSDzHbv6/92Tlxr2ydW8l8lTOQGic2x+N4HC16FUHHoe6G8SNkuvA7Z3ed65jOGy3H4xHO+bHlM+kjmCR9JHHDY1XdO1sEh4Xs8OG4DnyV87LFB5tAnSD6yknOZuA3y1FNP7Y5ivZdiIHXSFNNt0ukjPUH4xYVf8meb+nAlT5SveD5+11wZF8kcMl99NY9T0p1/jDGc43EH8ePXzuRtkLZ3D+e5EnLiNkic1I1xBYn/yX188wUgL30tPG/Ysw27pC9W+O53rnT5nAdHPtfBZvsgvrCl5nGdX8JiE0dYbyVblz9j1deRW9ji9VXvuWxf//70n67kHCZug0Rxj/vWEgqOzAmQHZ8kBXVb5nh/HD4xxUd3vux5fNlocNRHz/wS1m3Oc7t0fOiai2xIHwtsyQaeOEjjfDFsfyX7xLS2ebG5+or/s5LzmagNom8tiZO7oVQcnbTsNApFP0v8ks4Dh5++ZBeuyw7X/aW44Fw6bhw+WOd3xZU948TXUbKX4nThIsYd8a2jDzpn3fVee3vbXreifzmYqA1y5MgRfWpwulQU2fxgoagoGZ/7YJxfKiY8cHkM9zvf7Sw+bOCIyVwkM1aYbIMPz+M6Fh3pOLhIfBmLHZwkDd+CfOWcc875w2a6/QL+CZAHm3bnJ1d6HhO1QSL5Sx4t4WQpjvoqqg41t/cNHT8ct1w+Y2oI1/OQPpZ86uvwceE7tmRzvnQw0tWcf8xy/M9BmEE+InVgfifmEt9kvT2+E7WNb7WegDbV/rN278+s2PsfnNHEbJAnnnjiqphU/1tLclG8L51DCwafS3RO0iVcyRJfWPjILv4o2C4usbPMeN8UwvpRGp94+Ern6BjGkw0sfrcRTzJwd/Tllf9In7f9z9LXtbVTn1itb3efmA0SCf4ohcmLwvteCPCyUVx0cI7BRjx8ksP4YHN8j+kY7Ej3MT4+pGOyTT7x/ACDdD5jYIMvLD7p+F33MeAhA/dEvLz6v8L327ad/ybkM8c66/BTm2PvLb+4WiNPxAaJ5Gse/UdLdKIqBoefuNuke/M+OElfDMK7L/OFxQ8287EjneM6fsncNIYa82PM0ljOBefSx3S+MDTZHZf5wjne/R5jAXNHxFoM3uoqMj0Vb+y2h8CujWxn4ru542XV6m0OncdEbJAnn3zyukj+hV2JpWC+ACh4F0d2MPCxuZReauKU+BkrnDfmOA4fDnF8vrLlPjh84/KFh5PnT8w8Brht27bd6T7p7dW33BU/3xVBX8q+Vem37cMx1g/Fvzv4pVWJb0EnYoPEG4P9m3OKYPNborpfuoos6XYngMHmWDglm+NZSHks+MKiEwuO+ujL4TMPcYmDzWXX+I5xnXliY57E6Ror7PecffbZ34bnsn3nLV9ptvd+KDbKn7l9RXVtwLb5xeb0s74nrhz3rmjsjmBvvLHQAVhtc3wpw0nx5919kfxTKJDGVJEonM8BOzb6kmrOcT3j1YeDT7LEcT/jyTYqv8QZNk5pzNJ4juvSGX8cPhzFRA/5T84777z/0jUO9vgXze+O/9n28fhK+r8TGZ3GvnzZ3hdx7mx2n/rL7eU/vaaf0lr3DfL444/rvY/FyzZFZAEhlVx0ZCnhg/iOp+jY6MPH3iXB46ffxXc/85ekuT/b1Hc/fNldV98bHNnQXcqe+fgzJ+yzgT0/NsjI/2+t//1UM713N/PzfzNm8NditLdE3DMUe2Br2ycD+/X4hyf3xv3N59qrf+6bA/Gr6JyEDfJHkfgfz+dIoZDyS6cNKuwwLDFcMo5L/Hks7JKOB4d0XJfufDDD+JkzDE9cZOZjL0nD/n5sjr9fwoxj6z3267uaI7PnxXdXnRcfHj+3/wUL81OH48/F8Q0QIWfnHmvfeevEfNnWGytunLNcIaweLTl06NDTEa7/7rmKMahZsRZ/87E4kGByHGKDy376w/jgumTm02f8Lh52cJqn2iC++xwvnp+n6/LRRuULH9ifjA3yu3C3ilzXm/TDhw9/KBK9ZHNQ6FIBss8Lr2KrZYzbHZ9xjJft4uuQ3X2uw2V8xnQ5Dp94zic2Pu8zF+bpGOnEAYdffedkHVzYX3nzm9/8h/S3klzXDRIF6n/nLgmnYOrnYsqWC01BwSKd77aMBwcGKTtNNh3iwscniT/b3DeID24YX34fXzFzw+ZSOn3nw+3yYV/gH3u0BNIWkuu2QeLRkqsj+d+rXOfCUZxch2ynL7437G6Tnu30R+ELq4O5IhUXPvGQ8tFKfPmICc4lccGBRTq2pGe+MG5zjmLiR8cf7330Hy2hv5Xkum0QfayWQiCVeHQVEt0lumNlw47s4peKm/ksImIhfUyPA58xR+WLB8fHIPYwm/td7+ILw5HPBT4S/9TU1NJHSwi+ReS6bJAowlRskMVHS3KuWTQUCb/sefHhczmID84XAraSFI4x3e/8kh/sMH72e1xilGQXrsvOHJFduGyPfnzG4o1HS0pz2cy2dfluXj1aEkm9UMWiIOhI2aXTwNHPPnhIcJJdNjDDxhJu2PhgfCzX4WOTpOFjHvRLGLcRy+O4zbGKSVzwGVsaf/v27YvvUcHbSnJdriD6hzhKMgUZlPBcVGEpbPb5gvCYjhMGnNsdn3XHDeM7ljiyMaZsroNBZr768DPPsfjcppjwpYORrpaxx6xv4AJ/Tzy5O1mfGmSSayTXfIPo0ZIozPs4P4okqQJKlmzgJfG7js35zkHHL8l4OQ6x4Lgcxs+xnIuPGPRdOj7PAx7SeRmLzzcFPMeiS5IPs23Zm3PqsOYbJN77uDEG38MEXFIYFYqDwjmuS3c+GGz0XbqPxSG/dJpjsOHHJzmMD1Yx4BMPm2PcJ919JX7GwIcnKR4HfpdxX7jYjZvzmcB+dtGwRZU1vweJQn1YRaJg5N370ksNe4nveHBuk469xMcHroTBhxQGnPjo8qNL5sZYXZwT4eexvM+4bmOejIkvsH90wQUXfJf+VpVregV57LHH3hwFeRfFKBVMvmxXP9u8sMOKB98X6zC+OGDgM2+XeV7MpYuPH5n5zHEcPhyPmePmvmM7+Fv+5ZVytKYbRH/ajUL1Hy2hYJI6WIyaVC6YbN4yx2M5LuvgZPcx3e4cMNjUB4sklkvHcy6cHzwkWPiyw5ENfRCfWJKZT3zi0HdZ4L8SV48t+WiJ50X6mm6QGO+4by3JhaPImhyFy7r6aqXF0MU/xnjjpc8gPliPhY2FSl/Sz8HnLB99ZIkvHM3HRHeOjwUnS8aCLz+2jO3ofzbGeb3Dt6XMa7ZBHnnkkWviCtJ/tMSLxY0hNhaA+nlhgEGqUuhIceAhqagw4NzmujhqwmU+dkl8HhOO/F2N8cfh57j0JTk0nnRvXefiONfhxg16fXm1kIw12yAx3pKbcwpDESkOdvWl+0ICiw2OS3GcBxabY0u68+WHn7HCdbXsy33xsHFOHgtfyYYP6Xx0fEgfTzY/J9eFi/7j8Vj7l33srayvyQaJokzFoUfb+62rcPhdOlZ29d2GjoRLH9llx8+VzBeZfPgznz6yhCvxwSPhId2ODYnPJT5JdBY9fSQ870tP+CXfWgJnq8o12SCPPvro9ZHgCyiML0KK47auYqwUn/gsDvW7xne745kLsZDZLr4O2d3nOlxJ2RnT5Th84jmf2PjoMzf1F/CfccxW19dkg8Rv5yU35744hul5YahggzgsCsdQ5OxjcYBF+hhuy3hwYJCM535x4Zf82eZcxe3igxvGl9/HZ67IBf49F1544UMea6vrq75B9GhJJHnxH+J0JZxCeRHBlmz4JLOfWI6Rnu30xfeG3W3Ss53+KHxhdTBXpOLCJx5SPlqJLx8xwbkkLjiwSMcuYOrNeUrKqm8QPVoSBdnDglBxdCwUZHE6XTZ4SHDOL9nAd+GynRjIUfhMXhx4kuLm+I5FR8JnzFH5jAWfeEjZc3Nb0mfig1Fb/tGSnK9V3yD55ZWKz0LIkyn1vYjy58VT4nh858MVx+05xonyPZ7G8XHx+fglv+NK/i6+24lRkhkXY3zx/PPP3/KPluRcreoG0aMlMWD/0RIKIomuwtNHZ4Jgch+87HDAukR3PlxJcXWogc0Sro9DDLjOB9+F6Yrvdh9LOuMQM4+X7c5nPnAYB7tjQ68vr0iMyVXdILOzsx+MK8i0jbdEzQVb4lzoDMLIxwIqcWUr8X1hOK8rlscQBhx2+h7LxwaHH3y2OwesMDrgyO46OGSO6fzMM+z+uDmvj5aQRJOrukGiAH9PRaEQWdo8FheBMI4r8TNPfXHAuo6txIGXJeM7B10+DmLTJ864fHg+Rra5L483CAsPDFzmuCD1rSVHHFv1YxlY7Q3yA14ILSg1pHT8WRdGh/wuhetqxCL+qDziZb7s2MC4dB9jyc/40h2jvhp+fJLD+GCd3w+28MP5bkcfwq8vr0hUkqu2QaIg2g0nazwVjwKqUH7IruYFpO825+OXLDWP737ssnlsx+BzLH63Zb730SU5vxwDDH6wkviwwUVmP5ycI/BZJv5jF198cX20JCdpob9qGySKpb8xPqtxVBAe5VBfhfSFIZs3Co4t92VnMTimpMsGnzFly3zZutpy+OIwBnzFZw5I+Uqti5+xmZ/jMnbGESfwn4mjPAlAW1iu2gZRTiPxf0puKZz6FA0fxUMK63hwSOejC+98sC7xZ47bHZ91cLJLZ0y3OwcMNvXBIonl0vHkIY/lfMfLDkd29C5+PLlbHy0hgQW5qhskxvuPccxp3FJBZc9NuHwI08VnARAHbuaU+LKNyic+C434JT5Ynws257sNPc+TPrLEh4sEK6nDOWm+X62PlpC1slzVDXLFFVfcEwX6t7lI6tNcx4b0YnqRncNLN2zCgUUqnutgZUdHdvGFVQN3rLe0L5/44HzMjMcnDjGdDz5LsF38jFc/x7V+vTkvJcxsx6pphpVWoxhTDz744G9H3J8kNsWVHNbACofuclw+eFskmJZIn5uwam5bAl7wgcvYYWOBB4fMY5T6ngt4yBLebDPxpXDnxRXkRbNVNWVgVa8gGisKOH/llVf+VMibovuwbCogDV0S3TFuy5xhOPeXuO7P4zCfkt15xOVKxiYaxoeHLI3TFQOOJDwkPriOwbcgv1g3R8pIoTv8V3iBtFxTFK2Nq8l1sYj0+Lue8D1VC4rioksOauCEQYejWOhdMeDAd9w4/GHjeHw/R9lHGWe5fM4vz8/HDN8/uPTSSz+nMWrrzsDgldjNO2FPPKe1a2ZmRk/66n+E3BABtxHUC6yiquVig0XCActiGJfPOPCJ73GxdY0p/4nyGQOZ50X8cc6PecVfrvZfcskl+gqm+u45Ce6Q67ZBfD7xhQ5v0nNbYdPn1r/Pi+4LgUXi3KwL4/zsL/UzZzl8xR13rsyF8xqFz1yRijEuPyi/8pa3vOVmxq+yOwMTsUF8eg899NA7ov/ReE3/gZAXsxCQYOnnxYEf6bi88FmQYF1mnvfBnSifOFnmcyqNw3ycCw8bPCT26enpH44rSH33nIQMkBO3QZhrFHXJ/UrYT/VCS1fLi6JvLPxgQYEfxAfrYeBh87lgQ64EX7EGzZGxJBnPJf48z8A8Fvcel4V84y8lgKs8LgOLr/uP86yzYaGAd8c07n7qqadujU8mvif0JfcrLAhNFV1SLS8MFhtSGDiuY+viC6vGONLBupSdRkz6kiU+fubovGzLfHHz+MKAM3791hISPYKc2CtI19x1vxL/X0RfIaTNci04FpMviGwD69IxLDD50ZEljmzOd0yXzvzkL8Xu4mEfh8/cxIUX731ccdFFF/X/3E7MKrszsOE2iJ8K9yux0PSdvxf5ggCHzSW+LMHIju5yEN456Bmf+8TG7n3p3tyHHZtL+UobbyHeV9/61rf+IPwqh2dgaRWG4ycSEQtiyf1K9Pvvr2iyLBbkKCewsJj60HF4xF4OPy9yYpXGBwtGEpuPLXvi/+PLLrvsU7LXNloGNsUG8VON+5XdC9+kopdg+jz8NhaNFota12LqOws/1oPfNce04BfPxc/LdeYetpmdO3fWR0sK9R1k2nQbxE920P2KcHmxObek50W70nziM3apj68kS3h+KQT+f77tbW/THzpqGyMDm3qDeB4efvjhq2Kx6H+z9+9X5PMFhS45aoPjsUbhw0PCL43rGPzYJNXyRsUvH3p859X7Lr300s/LVtvoGRh9NYwec6KRsZjauLm/Piapl2DvjQV0CgtMksbCklQDgx/puEH8jPc+uqSP4zoYxlOfueGT7OC8HDfn5wW+PlriyRpB33IbxHPi9ythvyEW1zSLjoWGFA8d6bHQB/HBlKR4HhcdmTngsdNnfOySYbstbs5vcVvVR8vAlt4gnqL4Bvpz4+FJPQ+ml2H9f/QjPwsPXVKta+Ee8y797S6sWmnxOh5cxg4bCzw4JLFD/nDcf9RHSywho6p1gxQyFfcrV8ci437lQiBslkESbEk6L/tZ1GCyX3Y1cNlPv8B/9PLLL78Mf5XjZaBukAH5isU4Ffcr1wWkf78S8hTBfRGycGUfpYEfttCJ5XjZvI8OtiTj0fZ/Fy+v/nXJV23DM1A3yPAc9RH6Nw6vvfbae+Ip44/EwnxXLPAlX6mqxeqL3nWGAFPq45NUO1G+jXF5vLx6hH6V42WgbpDx8tVHL9yv8DzY97K45cz6KOHzpihtjhynNA48ZHC+Gi+v6qMlOXlj9OsGGSNZJehy7leIYwsZU192bZgu/BJydOCHemtskF/O/tofPQN1g4yeq4HIWLzcr3wkgPq8/R4n2KLtmwctdr86ECPzsZfkAvborl27zosnd18qYapttAzUDTJansZC6X7lwIEDNwZJHyE+7n5FwXzBD9osYIXxNowf/t+Lq4fmUNsJZKBukBNI3ihU/ROho0eP9j9vH4u8//6KFjcLHt0X/KC4jhu0seJjte+Lv17VR0sGJXMEX90gIyRppSDx8OQ18eUU+iuYnge7gM1BfO/7RsCfpePlox/y5bh66FtLjmZO7Y+XgbpBxsvXiqBjc0zFzf31IXl/ZfGfnGoALXTaoKsEGEnbHOreFl/7Wh8tUSZOsL1RiRMMVOnLy4DuVw4ePHhjfIx46P2KNota2gzHDRz+a2OD/OVxjmoYOwN1g4ydstUj2P2KHnP5njxS3hj56rLg/+zb3/7292du7S8vA3WDLC9vq876zne+szcentRVpX+/4gP6RvGrStj/Im7OfzRuzl9xfNWXn4G6QZafuzVhxgZYcr8Sm2APm0IT0GaJQ6+9PhE35v8q9Jk1mdgWGaRukA1U6H379p28f//+vxtTvj4eQrwwNoo+AHVf6L8Tm+OBDXQqdao1AzUDNQM1AzUDNQM1AzUDNQM1AzUDNQM1AzUDNQM1AzUDNQM1AzUDNQM1AzUDNQM1AzUDNQM1AzUDNQM1AzUDNQM1AzUDNQM1AzUDNQM1AzUDNQM1AzUDNQM1AzUDNQM1AzUDNQM1AzUDNQM1AzUDNQM1AzUDNQM1AzUDNQM1AzUDNQM1AzUDNQM1AzUDNQM1AzUDNQM1AzUDNQM1AzUDNQM1AzUDNQM1AzUDNQM1AzUDNQM1AzUDNQM1AzUDNQM1AzUDNQM1AzUDNQODMvD/AQOyMQwZR/M9AAAAAElFTkSuQmCC"
                      />
                    </Button>
                    <Button
                      style={{ marginRight: "15px", background: "transparent" }}
                      className="noborder"
                      onClick={() => {
                        this.setState({
                          showModal: true,
                          modalObject: "border"
                        });
                      }}
                    >
                        <img
                          style={{ width: "20px" }}
                          src="data:image/png;base64,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"
                        />
                    </Button>
                    <DropdownButton
                      noCaret
                      style={{ marginRight: "15px", background: "transparent" }}
                      className="noborder"
                      title={
                        <img
                          style={{ width: "20px" }}
                          src="data:image/png;base64,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"
                        />
                      }
                    >
                      <MenuItem
                        eventKey="1"
                        style={{ marginTop: "15px", minHeight: "40px" }}
                      >
                        <InputRange
                          maxValue={100}
                          minValue={1}
                          value={
                            this.state.opacity
                              ? parseInt(this.state.opacity * 100, 10)
                              : 1
                          }
                          onChange={value => {
                            this.onStyleChange(
                              "opacity",
                              parseInt(value, 10) / 100
                            );
                          }}
                        />
                      </MenuItem>
                    </DropdownButton>

                    <DropdownButton
                      noCaret
                      style={{ marginRight: "15px", background: "transparent" }}
                      className="noborder"
                      title={
                        <img
                          style={{ width: "20px" }}
                          src="data:image/png;base64,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"
                        />
                      }
                    >
                      <MenuItem
                        eventKey="1"
                        onClick={() => this.setGradient("linear")}
                      >
                        Linear Gradient
                      </MenuItem>
                      <MenuItem
                        eventKey="2"
                        onClick={() => this.setGradient("radial")}
                      >
                        Radial Gradient
                      </MenuItem>
                      {this.state.gradientType && (
                        <p>
                          <MenuItem eventKey="1">
                            <ChromePicker
                              color={this.state.gradientStartColor}
                              onChange={newColor => {
                                this.onStyleChange(
                                  "background",
                                  `${this.state.gradientType}-gradient(${
                                    newColor.hex
                                  },${this.state.gradientStopColor})`
                                );
                                this.setState({
                                  gradientStartColor: newColor.hex
                                });
                              }}
                            />
                          </MenuItem>

                          <MenuItem eventKey="1">
                            <ChromePicker
                              color={this.state.gradientStopColor}
                              onChange={newColor => {
                                this.onStyleChange(
                                  "background",
                                  `${this.state.gradientType}-gradient(${
                                    this.state.gradientStartColor
                                  },${newColor.hex})`
                                );
                                this.setState({
                                  gradientStopColor: newColor.hex
                                });
                              }}
                            />
                          </MenuItem>
                        </p>
                      )}
                    </DropdownButton>

                    <DropdownButton
                      noCaret
                      style={{ marginRight: "15px", background: "transparent" }}
                      className="noborder"
                      title={
                        <img
                          style={{ width: "20px" }}
                          src="data:image/png;base64,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"
                        />
                      }
                    >
                      <MenuItem
                        eventKey="1"
                        style={{ marginTop: "15px", minHeight: "40px" }}
                      >
                        <InputRange
                          maxValue={50}
                          minValue={-50}
                          value={
                            this.state.shadowOffsetX
                              ? parseInt(this.state.shadowOffsetX, 10)
                              : 1
                          }
                          onChange={value => {
                            this.onStyleChange(
                              "boxShadow",
                              `${value}px ${this.state.shadowOffsetY}px 10px ${
                                this.state.shadowColor
                              }`
                            );
                            this.setState({ shadowOffsetX: value });
                          }}
                        />
                      </MenuItem>
                      <MenuItem
                        eventKey="2"
                        style={{ marginTop: "15px", minHeight: "40px" }}
                      >
                        <InputRange
                          maxValue={50}
                          minValue={-50}
                          value={
                            this.state.shadowOffsetY
                              ? parseInt(this.state.shadowOffsetY, 10)
                              : 1
                          }
                          onChange={value => {
                            this.onStyleChange(
                              "boxShadow",
                              `${this.state.shadowOffsetX}px ${value}px 10px ${
                                this.state.shadowColor
                              }`
                            );
                            this.setState({ shadowOffsetY: value });
                          }}
                        />
                      </MenuItem>
                      <MenuItem eventKey="1">
                        <ChromePicker
                          color={this.state.shadowColor}
                          onChange={newColor => {
                            this.onStyleChange(
                              "boxShadow",
                              `${this.state.shadowOffsetX}px ${
                                this.state.shadowOffsetY
                              }px 10px ${newColor.hex}`
                            );
                            this.setState({ shadowColor: newColor.hex });
                          }}
                        />
                      </MenuItem>
                    </DropdownButton>
                  </span>

                  <Button style={{ marginRight: "15px" }} className="noborder">
                    <img
                      style={{ width: "20px" }}
                      src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAYAAACtWK6eAAAAAXNSR0IArs4c6QAAERdJREFUeAHtnWuMFtUZx9ldlsty3QVhQURAwOLGYBW5BBtrvSTGmKakUYTUkEhqTZqmiQpK1axYKEXTJv2gVBsT1huYih9siDF+tAtWrEpsGpXbElzX1iIgsLAXtr+zLjBuYJmdOWfmnHn/bzLZ2fed88xzfmf+c64zz4AB+oiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACIiACORMoCzn83tx+hdffHFkRUXFIpz5UVdX12T+DvfCMTnRm0BnWVnZ/9j+yQ+bFi9e/HHvA2z/X/ICefXVVxd0dnbWI4wxtuHKnjsCiOQUW0N5efmzd9xxR5urMw10ZTgEu5s2bZqPOP6AOCpD8Fc+niVAmZWzLWObxLcPnf3F7l65XXPhWKNZNenUqVPrJI5wyuxcnlJ+N3Gju+Vcv9n4riQFsnXr1sFUzesBqL6GjasoZxuI5AGayhUu3ChJgRw+fHgFMGe6ACqb2RNAIDUdHR11Ls5ccgLZvHnz7QD9sQuYspkfAcrU9EWsf0pKIC+99NIM+h3OOnTWS0cG+0PAyUhWyQiENupw+h1PcqcZ3B/qOjYYAntceFoyw7y0UesB6KQadlEwshmfAPMhLRMmTNgfP0X8I0uiBnnllVd+BpIfxseiI0MigEA23HDDDR0ufC68QBDH92lW/dIFPNnMnwDi+PDOO+/c6sqTQgtk48aNYxDH74DnZIzcVaHIbjwCiOMga+ge5u+peCn6f1Rh+yBm4ogRqzVsY/uPRSl8J9AjilWsw/qvS18LK5D29vb7gDjHJTzZzpXA03fdddcO1x4UsolFv+MHiGOZa3iynxuBd1jqvjGLsxdOIDStLgbc6izg6Ry5EGim2fwYN8CuLM5eqCYW4hjEfMfvATciC3g6R7YEEEU728olS5YcyerM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xn8C1ByN1BzP++qp16NY+/btmwDAJ3yFJ7/SEaBsFR8kKULgVba3tys+SFKAnqejfDvolK9kCbvX8UG8HRGiaaX4IJ5f5Gnc4+nDp5gM9D4+iJdNLMRxK/B/mqYAlNZfAtQebyKOv/rr4VnPvBMIM+XTAPibsy5qr2AE9vCAlRmyD+LjlUCam5uraJe6jg8SRMEU0UlufK00rVZccsklraHkzyuBHDt2zHV8kFDKpZB+cvN7YurUqftCypw3nXTWWS0GnMv4ICGVS+F8RRwmvuBboWXMi0dud+/efSVLnJ8DnjeCDa0gffaXptXHPFO+HJE4ecu7y7zn3sQiCMpoAGoRostSztE2ojjEfJZ3ixDjIsldIMR4qEcgzuKDxAWh45wQ6OKx2Ufq6uqcvlDOiec9RnMVCEO68xDHdS4zKNv5EaD2eI5O+fb8PEh/5lwFAsDl6bMgC54S2M4ykr946ltst3ITCDUH+ihzFh8kNgEdaJ0A5Wre8P4If529itS60+cxmJtAeEKwFpEMOY9f+jpQApSpGalaSdPK+pv780CSm0AI3ukkPkgeEHXOswR4LPqPzHckfY3sWUOe7OUmEN5c4SQ+iCdcS9WNtxDH5iJlPjeB9LRPrcYHKVLBhJYXmlb7eF/Zb0Pz+0L+5iYQ41hra+szgA12jPxCcEvodxNybcXEiROPFy3PuQrExAdhIqkeqCeLBraE8mP6kg/SZN5TxDznKhAD1ITU6ujoSBMfpIjlEkSeaCY30QK4j3VW24JwOIGTXixWNH4DuoJFi93xQQBfy1ex4oMkyLOSpCBA2bSaZjHb3xFGI/8HtwAxRfaVVAREQAREQAREQAREQAREQAREQAREQAREQAREQAREQAREQAREQAREQAREQAREQAREQAREQAREQAREQAREQAREQAREQAREQAREQAREQAREQAREQAREQAREQAREQAREQAREQAREQAREQAREQAREQAREQAREQAREQAREQAREQAREQAREQAREQAREQAREQAREQAREQAREQAREQAREQAREQAREQAREQAREQAREQAREQAREQAREQAREQAREQAREQAREQAREQAQcEfg/ThgqT57Cc8MAAAAASUVORK5CYII="
                    />
                  </Button>
                  <Button
                    style={{ marginRight: "15px", background: "transparent" }}
                    className="noborder"
                  >
                    <img
                      style={{ width: "20px" }}
                      src="data:image/png;base64,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"
                    />
                  </Button>
                  <Button
                    style={{ marginRight: "15px", background: "transparent" }}
                    className="noborder"
                  >
                    <img
                      style={{ width: "20px" }}
                      src="data:image/png;base64,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"
                    />
                  </Button>
                </div>
              )}
            </div>
            <div
              id="full-canvas-container"
              className="full-canvas-container"
              style={{
                position: "absolute",
                marginTop: "auto",
                marginLeft: "auto",
                marginRight: "auto",
                marginBottom: "auto",
                border: "2px solid lightgrey",
                borderRadius: "5px",
                left: 0,
                right: 0,
                top: 0,
                bottom: 0,
                //...this.getDimensions(),

              }}
            >
              <div style={{ transform: mobileCheck() ? "scale(0.3,0.7)" : "" }}>
                {this.state.ready && (
                  // <FabricCanvas
                  //   ref="fabricRef"
                  //   newObj={this.state.newObj}
                  //   bgColor={this.state.bgColor}
                  //   setRectDimensions={this.setRectDimensions}
                  //   canvasData={this.props.canvasData}
                  //   objectList={this.state.objectList}
                  //   setActiveObject={this.setActiveObject}
                  //   activeObjectIndex={this.state.activeObjectIndex}
                  // />
                  <CanvasContainer
                    ref="canvasContainer"
                    canvasData={this.props.canvasData}
                    changeObject={this.props.changeObject}
                    updateObjectPosition={this.updateObjectPosition}
                    videoList={this.state.objectList}
                    setActiveObject={this.setActiveObject}
                    activeObjectIndex={this.state.activeObjectIndex}
                  />
                )}
              </div>
            </div>






          </Col>
          {this.state.showModal && (
            <Col
              md={12}
              style={{ height: "30vh", padding: "0px", overflow: "scroll" }}
            >
              <button
                className="btn"
                onClick={() => {
                  this.setState({ showModal: false });
                }}
              >
                close
              </button>
              {this.state.modalObject === "background" && (
                <ChromePicker
                  color={this.state.backgroundColor || "#000000"}
                  onChange={newColor => {
                    this.onStyleChange(
                      this.state.objectList[this.state.activeObjectIndex].isSVG
                        ? "fill"
                        : "backgroundColor",
                      newColor.hex
                    );
                  }}
                />
              )}
              {this.state.modalObject === "border" && (
                <span>
                  <MenuItem eventKey="1">
                    <InputRange
                      maxValue={20}
                      minValue={0}
                      value={
                        this.state.borderWidth
                          ? parseInt(this.state.borderWidth, 10)
                          : 0
                      }
                      onChange={value => {
                        this.onStyleChange(
                          "border",
                          `${value}px ${this.state.borderStyle} ${
                            this.state.borderColor
                          }`
                        );
                        this.setState({ borderWidth: value });
                      }}
                    />
                  </MenuItem>
                  <MenuItem eventKey="2">
                    <select
                      style={{
                        border: "none",
                        background: "transparent",
                        padding: "6px 12px",
                        marginRight: "10px"
                      }}
                      value={this.state.borderStyle}
                      onChange={event => {
                        this.onStyleChange(
                          "border",
                          `${
                            this.state.borderWidth
                          }px ${event.target.value.toLowerCase()} ${
                            this.state.borderColor
                          }`
                        );
                        this.setState({ borderStyle: event.target.value });
                      }}
                    >
                      <option value="none">none</option>
                      <option value="dotted">dotted</option>
                      <option value="dashed">dashed</option>
                      <option value="solid">solid</option>
                      <option value="double">double</option>
                      <option value="groove">groove</option>
                      <option value="ridge">ridge</option>
                      <option value="inset">inset</option>
                      <option value="outset">outset</option>
                    </select>
                  </MenuItem>

                  <MenuItem eventKey="3">
                    <ChromePicker
                      color={this.state.borderColor}
                      onChange={newColor => {
                        this.onStyleChange(
                          "border",
                          `${this.state.borderWidth}px ${
                            this.state.borderStyle
                          } ${newColor.hex}`
                        );
                        this.setState({ borderColor: newColor.hex });
                      }}
                    />
                  </MenuItem>
                </span>
              )}
            </Col>
          )}
          {!this.state.showModal && (
            <Col md={12} style={{ height: "30vh", padding: "0px" }}>
              <Tabs
                className="fabricmenumobile"
                defaultActiveKey={1}
                justified
                id="main_tabs"
                style={{ marginLeft: "0px", width: "100%", overflowX: "auto" }}
              >
                <Tab
                  eventKey={1}
                  title={
                    <p style={{ marginBottom: "0px" }}>
                      <img
                        className="hoverimage"
                        style={{ width: "30px" }}
                        src="data:image/png;base64,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"
                      />

                      <p
                        style={{
                          marginBottom: "0px",
                          fontSize: "9px",
                          marginTop: "2px",
                          color: "grey",
                          fontWeight: "bold"
                        }}
                      >
                        SHAPES
                      </p>
                    </p>
                  }
                >
                <div
                  className="col-xs-4 aligncenter marginbottom30 "
                  style={{ padding: "0px" }}
                >
                  <button
                    type="button"
                    className="hovertile btn btn-sm"
                    style={{ backgroundColor: "transparent", padding: "0px" }}
                    onClick={this.addBoxRound}
                  >
                    <div
                      className="hoverimage"
                      style={{
                        width: "80px",
                        height: "80px",
                        borderRadius: "10px",
                        backgroundColor: "lightgrey",
                        border: "5px solid transparent",
                        marginLeft: "auto",
                        marginRight: "auto"
                      }}
                    />


                  </button>
                </div>
                <div
                  className="col-xs-4 aligncenter marginbottom30"
                  style={{ padding: "0px" }}
                >
                  <button
                    type="button"
                    className="btn btn-sm hovertile"
                    style={{ backgroundColor: "transparent", padding: "0px" }}
                    onClick={this.addBoxRoundWithBorderNoBac}
                  >
                    <div
                      className="hoverimage"
                      style={{
                        width: "80px",
                        height: "80px",
                        borderRadius: "10px",
                        backgroundColor: "transparent",
                        border: "5px solid lightgrey",
                        marginLeft: "auto",
                        marginRight: "auto"
                      }}
                    />

                  </button>
                </div>
                <div
                  className="col-xs-4 aligncenter marginbottom30 "
                  style={{ padding: "0px" }}
                >
                  <button
                    type="button"
                    className="btn btn-sm hovertile"
                    style={{ backgroundColor: "transparent", padding: "0px" }}
                    onClick={this.addBoxRoundWithBorderAndBac}
                  >
                    <div
                      className="hoverimage"
                      style={{
                        width: "80px",
                        height: "80px",
                        borderRadius: "10px",
                        backgroundColor: "grey",
                        border: "5px solid lightgrey",
                        marginLeft: "auto",
                        marginRight: "auto"
                      }}
                    />

                  </button>
                </div>
                <div
                  className="col-xs-4 aligncenter marginbottom30 "
                  style={{ padding: "0px" }}
                >
                  <button
                    type="button"
                    className="btn btn-sm hovertile"
                    style={{ backgroundColor: "transparent", padding: "0px" }}
                    onClick={this.addBox}
                  >
                    <div
                      className="hoverimage"
                      style={{
                        width: "80px",
                        height: "80px",
                        borderRadius: "0px",
                        backgroundColor: "lightgrey",
                        border: "5px solid transparent",
                        marginLeft: "auto",
                        marginRight: "auto"
                      }}
                    />

                  </button>
                </div>
                <div
                  className="col-xs-4 aligncenter marginbottom30 "
                  style={{ padding: "0px" }}
                >
                  <button
                    type="button"
                    class="btn btn-sm"
                    style={{ backgroundColor: "transparent", padding: "0px" }}
                    onClick={this.addBoxWithBorderNoBac}
                  >
                    <div
                      className="hoverimage"
                      style={{
                        width: "80px",
                        height: "80px",
                        borderRadius: "0px",
                        backgroundColor: "transparent",
                        border: "5px solid lightgrey",
                        marginLeft: "auto",
                        marginRight: "auto"
                      }}
                    />

                  </button>
                </div>
                <div
                  className="col-xs-4 aligncenter marginbottom30 "
                  style={{ padding: "0px" }}
                >
                  <button
                    type="button"
                    className="btn btn-sm hovertile"
                    style={{ backgroundColor: "transparent", padding: "0px" }}
                    onClick={this.addBoxWithBorderAndBac}
                  >
                    <div
                      className="hoverimage"
                      style={{
                        width: "80px",
                        height: "80px",
                        borderRadius: "0px",
                        backgroundColor: "lightgrey",
                        border: "5px solid grey",
                        marginLeft: "auto",
                        marginRight: "auto"
                      }}
                    />

                  </button>
                </div>

                <div
                  className="col-xs-4 aligncenter marginbottom30 "
                  style={{ padding: "0px" }}
                >
                  <button
                    type="button"
                    style={{ backgroundColor: "transparent", padding: "0px" }}
                    onClick={this.addCircle}
                    className="btn btn-sm hovertile"
                  >
                    <div
                      className="hoverimage"
                      style={{
                        width: "80px",
                        height: "80px",
                        borderRadius: "50%",
                        backgroundColor: "lightgrey",
                        border: "5px solid transparent",
                        marginLeft: "auto",
                        marginRight: "auto"
                      }}
                    />

                  </button>
                </div>
                <div
                  className="col-xs-4 aligncenter marginbottom30 "
                  style={{ padding: "0px" }}
                >
                  <button
                    type="button"
                    style={{ backgroundColor: "transparent", padding: "0px" }}
                    onClick={this.addCircleWithBorderNoBac}
                    className="btn btn-sm hovertile"
                  >
                    <div
                      className="hoverimage"
                      style={{
                        width: "80px",
                        height: "80px",
                        borderRadius: "50%",
                        backgroundColor: "transparent",
                        border: "5px solid lightgrey",
                        marginLeft: "auto",
                        marginRight: "auto"
                      }}
                    />

                  </button>
                </div>
                <div
                  className="col-xs-4 aligncenter marginbottom30 "
                  style={{ padding: "0px" }}
                >
                  <button
                    type="button"
                    style={{ backgroundColor: "transparent", padding: "0px" }}
                    onClick={this.addCircleWithBorderAndBac}
                    className="btn btn-sm"
                  >
                    <div
                      className="hoverimage"
                      style={{
                        width: "80px",
                        height: "80px",
                        borderRadius: "50%",
                        backgroundColor: "lightgrey",
                        border: "5px solid grey",
                        marginLeft: "auto",
                        marginRight: "auto"
                      }}
                    />
                  </button>
                </div>

                <div
                  className="col-xs-4 aligncenter marginbottom30 "
                  style={{ padding: "0px" }}
                >
                  <button
                    type="button"
                    style={{ backgroundColor: "transparent", padding: "0px" }}
                    onClick={this.addCircle}
                    className="btn btn-sm hovertile"
                  >
                    <div
                      className="hoverimage"
                      style={{
                        width: "80px",
                        height: "40px",
                        borderRadius: "50%",
                        backgroundColor: "lightgrey",
                        border: "5px solid transparent",
                        marginLeft: "auto",
                        marginRight: "auto"
                      }}
                    />

                  </button>
                </div>
                <div
                  className="col-xs-4 aligncenter marginbottom30 "
                  style={{ padding: "0px" }}
                >
                  <button
                    type="button"
                    style={{ backgroundColor: "transparent", padding: "0px" }}
                    onClick={this.addCircleWithBorderNoBac}
                    className="btn btn-sm hovertile"
                  >
                    <div
                      className="hoverimage"
                      style={{
                        width: "80px",
                        height: "40px",
                        borderRadius: "50%",
                        backgroundColor: "transparent",
                        border: "5px solid lightgrey",
                        marginLeft: "auto",
                        marginRight: "auto"
                      }}
                    />

                  </button>
                </div>
                <div
                  className="col-xs-4 aligncenter marginbottom30 "
                  style={{ padding: "0px" }}
                >
                  <button
                    type="button"
                    style={{ backgroundColor: "transparent", padding: "0px" }}
                    onClick={this.addCircleWithBorderAndBac}
                    className="btn btn-sm"
                  >
                    <div
                      className="hoverimage"
                      style={{
                        width: "80px",
                        height: "40px",
                        borderRadius: "50%",
                        backgroundColor: "lightgrey",
                        border: "5px solid grey",
                        marginLeft: "auto",
                        marginRight: "auto"
                      }}
                    />

                  </button>
                </div>

                <div
                  className="col-xs-4 aligncenter marginbottom30 "
                  style={{ padding: "0px" }}
                >
                  <button
                    type="button"
                    style={{ backgroundColor: "transparent", padding: "0px" }}
                    onClick={this.addTriangleBac}
                    className="btn btn-sm"
                  >
                    <div style={{ width: "80px", height: "80px" }}>
                      <svg viewBox="0 0 100 100">
                        <polygon
                          id="e1_polygon"
                          points="0 0, 0 100, 100 0"
                          fill="lightgrey"
                        />
                      </svg>
                    </div>
                  </button>
                </div>

                <div
                  className="col-xs-4 aligncenter marginbottom30 "
                  style={{ padding: "0px" }}
                >
                  <button
                    type="button"
                    style={{ backgroundColor: "transparent", padding: "0px" }}
                    onClick={this.addTriangleBorder}
                    className="btn btn-sm"
                  >
                    <div style={{ width: "80px", height: "80px" }}>
                      <svg viewBox="0 0 100 100">
                        <polygon
                          id="e1_polygon"
                          points="0 0, 0 100, 100 0"
                          stroke-width="5"
                          stroke="lightgrey"
                          fill="transparent"
                        />
                      </svg>
                    </div>
                  </button>
                </div>

                <div
                  className="col-xs-4 aligncenter marginbottom30 "
                  style={{ padding: "0px" }}
                >
                  <button
                    type="button"
                    style={{ backgroundColor: "transparent", padding: "0px" }}
                    onClick={this.addTriangleFull}
                    className="btn btn-sm"
                  >
                    <div style={{ width: "80px", height: "80px" }}>
                      <svg viewBox="0 0 100 100">
                        <polygon
                          id="e1_polygon"
                          points="0 0, 0 100, 100 0"
                          stroke-width="5"
                          stroke="grey"
                          fill="lightgrey"
                        />
                      </svg>
                    </div>
                  </button>
                </div>

                <div
                  className="col-xs-4 aligncenter marginbottom30 "
                  style={{ padding: "0px" }}
                >
                  <button
                    type="button"
                    className="btn btn-sm"
                    style={{ backgroundColor: "transparent", padding: "0px" }}
                    onClick={this.addStarBac}
                  >
                    <div style={{ width: "80px", height: "80px" }}>
                      <svg viewBox="0 0 100 100">
                        <path
                          stroke="transparent"
                          stroke-width="5"
                          d="M49 73.5L22.55 87.406l5.05-29.453-21.398-20.86 29.573-4.296L49 6l13.225 26.797 29.573 4.297-21.4 20.86 5.052 29.452z"
                          fill="lightgrey"
                          fill-rule="evenodd"
                        />
                      </svg>
                    </div>
                  </button>
                </div>

                <div
                  className="col-xs-4 aligncenter marginbottom30 "
                  style={{ padding: "0px" }}
                >
                  <button
                    type="button"
                    className="btn btn-sm"
                    style={{ backgroundColor: "transparent", padding: "0px" }}
                    onClick={this.addStarBorder}
                  >
                    <div style={{ width: "80px", height: "80px" }}>
                      <svg viewBox="0 0 100 100">
                        <path
                          stroke="lightgrey"
                          stroke-width="5"
                          d="M49 73.5L22.55 87.406l5.05-29.453-21.398-20.86 29.573-4.296L49 6l13.225 26.797 29.573 4.297-21.4 20.86 5.052 29.452z"
                          fill="transparent"
                          fill-rule="evenodd"
                        />
                      </svg>
                    </div>
                  </button>
                </div>

                <div
                  className="col-xs-4 aligncenter marginbottom30"
                  style={{ padding: "0px" }}
                >
                  <button
                    type="button"
                    className="btn btn-sm"
                    style={{ backgroundColor: "transparent", padding: "0px" }}
                    onClick={this.addStarFull}
                  >
                    <div style={{ width: "80px", height: "80px" }}>
                      <svg viewBox="0 0 100 100">
                        <path
                          stroke="lightgrey"
                          stroke-width="5"
                          d="M49 73.5L22.55 87.406l5.05-29.453-21.398-20.86 29.573-4.296L49 6l13.225 26.797 29.573 4.297-21.4 20.86 5.052 29.452z"
                          fill="grey"
                          fill-rule="evenodd"
                        />
                      </svg>
                    </div>
                  </button>
                </div>
                </Tab>
                <Tab
                  eventKey={2}
                  title={
                    <p style={{ marginBottom: "0px" }}>
                      <img
                        className="hoverimage"
                        style={{ width: "30px" }}
                        src="data:image/png;base64,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"
                      />
                      <p
                        style={{
                          marginBottom: "0px",
                          fontSize: "9px",
                          marginTop: "2px",
                          color: "grey",
                          fontWeight: "bold"
                        }}
                      >
                        TEXT
                      </p>
                    </p>
                  }
                >
                <p className=" marginbottom10 ">
                  <button
                    className="btn btn-sm aligncenter"
                    onClick={this.addHeading}
                    style={{
                      backgroundColor: "transparent",
                      fontSize: "42px",
                      fontFamily: "Times New Roman",
                      fontWeight: "bold",
                      color: "black"
                    }}
                  >
                    Add Heading
                  </button>
                </p>
                <p className=" marginbottom10 ">
                  <button
                    className="btn btn-sm aligncenter"
                    onClick={this.addSubHeading}
                    style={{
                      backgroundColor: "transparent",
                      fontSize: "22px",
                      fontFamily: "Helvetica Neue",
                      fontWeight: "bold",
                      color: "black"
                    }}
                  >
                    Add Subheading
                  </button>
                </p>

                <p className=" marginbottom10 ">
                  <button
                    className="btn btn-sm aligncenter"
                    onClick={this.addALine}
                    style={{
                      backgroundColor: "transparent",
                      fontSize: "16px",
                      color: "black"
                    }}
                  >
                    Add a line
                  </button>
                </p>

                <p className=" marginbottom30 ">
                  <button
                    className="btn btn-sm"
                    onClick={this.addIText}
                    style={{
                      backgroundColor: "transparent",
                      font: "8px",
                      whiteSpace: "pre-wrap",
                      color: "grey",
                      textAlign: "left"
                    }}
                  >
                    Lorem ipsum dolor sit amet,nconsectetur adipisicing
                    elit,nsed do eiusmod tempor incididuntnut labore et dolore
                    magna aliqua. Ut enim ad minim veniam.
                  </button>
                </p>
                <p className=" marginbottom30 ">
                  <button
                    className="btn btn-sm "
                    onClick={this.addTextThreeTemplate}
                    style={{
                      backgroundColor: "transparent",
                      textAlign: "left",
                      whiteSpace: "pre-wrap",
                      fontSize: "42px",
                      fontFamily: "Times New Roman",
                      fontWeight: "bold",
                      color: "grey"
                    }}
                  >
                    <p
                      style={{
                        width: "100%",
                        fontSize: "32px",
                        marginBottom: 0,
                        fontWeight: "bold",
                        fontFamily: "Times New Roman",
                        minheight: "40px",
                        background: "transparent"
                      }}
                    >
                      Hey there!
                    </p>
                    <p
                      style={{
                        width: "100%",
                        fontSize: "16px",
                        fontWeight: "bold",
                        fontFamily: "Monaco",
                        minheight: "20px",
                        background: "transparent"
                      }}
                    >
                      How it going?
                    </p>
                    <p
                      style={{
                        width: "100%",
                        fontSize: "22px",
                        fontWeight: "normal",
                        fontFamily: "Monaco",
                        minheight: "24px",
                        background: "transparent"
                      }}
                    >
                      Im doing fine, how about yourself?
                    </p>
                  </button>
                </p>
                <p className="marginbottom30 ">
                  <button
                    className="btn btn-sm"
                    onClick={this.addTextTwoTemplate}
                    style={{
                      backgroundColor: "transparent",
                      textAlign: "left",
                      whiteSpace: "pre-wrap",
                      fontSize: "42px",
                      fontFamily: "Times New Roman",
                      fontWeight: "bold",
                      color: "grey"
                    }}
                  >
                    <p
                      style={{
                        width: "100%",
                        fontSize: "32px",
                        marginBottom: 0,
                        fontWeight: "bold",
                        fontFamily: "Times New Roman",
                        minheight: "40px",
                        background: "transparent"
                      }}
                    >
                      Hey there!
                    </p>
                    <p
                      style={{
                        width: "100%",
                        fontSize: "16px",
                        fontWeight: "bold",
                        fontFamily: "Monaco",
                        minheight: "20px",
                        background: "transparent"
                      }}
                    >
                      How it going?
                    </p>
                  </button>
                </p>
                <p className=" marginbottom30 ">
                  <button
                    className="btn btn-sm"
                    onClick={this.addTextSideTemplate}
                    style={{
                      width: "100%",
                      backgroundColor: "transparent",
                      textAlign: "left",
                      whiteSpace: "pre-wrap",
                      fontSize: "42px",
                      fontFamily: "Times New Roman",
                      fontWeight: "bold",
                      color: "grey"
                    }}
                  >
                    <p
                      style={{
                        display: "inline-block",
                        fontSize: "16px",
                        marginBottom: 0,
                        fontWeight: "bold",
                        fontFamily: "Times New Roman",
                        minheight: "40px",
                        background: "transparent"
                      }}
                    >
                      Happy
                    </p>
                    <p
                      style={{
                        display: "inline-block",
                        fontSize: "16px",
                        fontWeight: "bold",
                        fontFamily: "Monaco",
                        minheight: "20px",
                        background: "transparent"
                      }}
                    >
                      Birthday!!
                    </p>
                  </button>
                </p>
                </Tab>

                <Tab
                  eventKey={3}
                  title={
                    <p style={{ marginBottom: "0px" }}>
                      <img
                        className="hoverimage"
                        style={{ width: "30px" }}
                        src="data:image/png;base64,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"
                      />
                      <p
                        style={{
                          marginBottom: "0px",
                          fontSize: "9px",
                          color: "grey",
                          fontWeight: "bold"
                        }}
                      >
                        SKETCH
                      </p>
                    </p>
                  }>
                  <div>

                  <div
                    className="col-xs-4 aligncenter marginbottom30 "
                    style={{ padding: "0px" }}
                  >
                    <button
                      type="button"
                      style={{ backgroundColor: "transparent", padding: "0px" }}
                      onClick={this.addHalfArcSolid}
                      className="btn btn-sm hovertile"
                    >
                      <div style={{ width: "80px", height: "20px" }}>
                        <svg viewBox="0 0 100 20">
                          <path
                            d="M10 0 C 0 0, 50 20, 100 0"
                            stroke="grey"
                            fill="transparent"
                            stroke-width="2px"
                            strokeDasharray="0"
                            stroke-dashoffset="0"
                          />
                        </svg>
                      </div>

                    </button>
                  </div>

                  <div
                    className="col-xs-4 aligncenter marginbottom30 "
                    style={{ padding: "0px" }}
                  >
                    <button
                      type="button"
                      style={{ backgroundColor: "transparent", padding: "0px" }}
                      onClick={this.addHalfArcDashed}
                      className="btn btn-sm hovertile"
                    >
                      <div style={{ width: "80px", height: "20px" }}>
                        <svg viewBox="0 0 100 20">
                          <path
                            d="M10 0 C 0 0, 50 20, 100 0"
                            stroke="grey"
                            fill="transparent"
                            stroke-width="2px"
                            strokeDasharray="2"
                            stroke-dashoffset="0"
                          />
                        </svg>
                      </div>

                    </button>
                  </div>

                  <div
                    className="col-xs-4 aligncenter marginbottom30 "
                    style={{ padding: "0px" }}
                  >
                    <button
                      type="button"
                      style={{ backgroundColor: "transparent", padding: "0px" }}
                      onClick={this.addHalfArcDesign}
                      className="btn btn-sm hovertile"
                    >
                      <div style={{ width: "80px", height: "20px" }}>
                        <svg viewBox="0 0 100 20">
                          <path
                            d="M10 0 C 0 0, 50 20, 100 0"
                            stroke="grey"
                            fill="transparent"
                            strokeDasharray="3"
                            stroke-dashoffset="5"
                          />
                        </svg>
                      </div>

                    </button>
                  </div>

                  <div
                    className="col-xs-4 aligncenter marginbottom30 "
                    style={{ padding: "0px" }}
                  >
                    <button
                      type="button"
                      style={{ backgroundColor: "transparent", padding: "0px" }}
                      onClick={this.addHalfArcSolidThick}
                      className="btn btn-sm hovertile"
                    >
                      <div style={{ width: "80px", height: "20px" }}>
                        <svg viewBox="0 0 100 20">
                          <path
                            d="M10 0 C 0 0, 50 20, 100 0"
                            stroke="grey"
                            fill="transparent"
                            strokeWidth="4px"
                            strokeDasharray="0"
                            stroke-dashoffset="0"
                          />
                        </svg>
                      </div>

                    </button>
                  </div>

                  <div
                    className="col-xs-4 aligncenter marginbottom30 "
                    style={{ padding: "0px" }}
                  >
                    <button
                      type="button"
                      style={{ backgroundColor: "transparent", padding: "0px" }}
                      onClick={this.addHalfArcDashedThick}
                      className="btn btn-sm hovertile"
                    >
                      <div style={{ width: "80px", height: "20px" }}>
                        <svg viewBox="0 0 100 20">
                          <path
                            d="M10 0 C 0 0, 50 20, 100 0"
                            stroke="grey"
                            fill="transparent"
                            stroke-width="4px"
                            strokeDasharray="2"
                            stroke-dashoffset="5"
                          />
                        </svg>
                      </div>

                    </button>
                  </div>

                  <div
                    className="col-xs-4 aligncenter marginbottom30 "
                    style={{ padding: "0px" }}
                  >
                    <button
                      type="button"
                      style={{ backgroundColor: "transparent", padding: "0px" }}
                      onClick={this.addHalfArcDesignThick}
                      className="btn btn-sm hovertile"
                    >
                      <div style={{ width: "80px", height: "20px" }}>
                        <svg viewBox="0 0 100 20">
                          <path
                            d="M10 0 C 0 0, 50 20, 100 0"
                            stroke="grey"
                            fill="transparent"
                            stroke-width="4px"
                            strokeDasharray="3"
                            stroke-dashoffset="5"
                          />
                        </svg>
                      </div>

                    </button>
                  </div>

                  <div
                    className="col-xs-4 aligncenter marginbottom30 "
                    style={{ padding: "0px" }}
                  >
                    <button
                      type="button"
                      style={{ backgroundColor: "transparent", padding: "0px" }}
                      onClick={this.addHalfArcSolidFull}
                      className="btn btn-sm hovertile"
                    >
                      <div style={{ width: "80px", height: "20px" }}>
                        <svg viewBox="0 0 100 20">
                          <path
                            d="M10 0 C 0 0, 50 20, 100 0"
                            stroke="grey"
                            fill="lightgrey"
                            strokeWidth="2px"
                            strokeDasharray="0"
                            stroke-dashoffset="0"
                          />
                        </svg>
                      </div>

                    </button>
                  </div>

                  <div
                    className="col-xs-4 aligncenter marginbottom30 "
                    style={{ padding: "0px" }}
                  >
                    <button
                      type="button"
                      style={{ backgroundColor: "transparent", padding: "0px" }}
                      onClick={this.addHalfArcDashedFull}
                      className="btn btn-sm hovertile"
                    >
                      <div style={{ width: "80px", height: "20px" }}>
                        <svg viewBox="0 0 100 20">
                          <path
                            d="M10 0 C 0 0, 50 20, 100 0"
                            stroke="grey"
                            fill="lightgrey"
                            stroke-width="2px"
                            strokeDasharray="2"
                            stroke-dashoffset="5"
                          />
                        </svg>
                      </div>

                    </button>
                  </div>

                  <div
                    className="col-xs-4 aligncenter marginbottom30 "
                    style={{ padding: "0px" }}
                  >
                    <button
                      type="button"
                      style={{ backgroundColor: "transparent", padding: "0px" }}
                      onClick={this.addHalfArcDesignFull}
                      className="btn btn-sm hovertile"
                    >
                      <div style={{ width: "80px", height: "20px" }}>
                        <svg viewBox="0 0 100 20">
                          <path
                            d="M10 0 C 0 0, 50 20, 100 0"
                            stroke="grey"
                            fill="lightgrey"
                            stroke-width="2px"
                            strokeDasharray="3"
                            stroke-dashoffset="5"
                          />
                        </svg>
                      </div>

                    </button>
                  </div>

                  </div>
                  </Tab>

                <Tab
                  eventKey={4}
                  title={
                    <p

                      className="hovertile"
                      style={{ marginBottom: "0px" }}
                    >
                      <img
                        className="hoverimage"
                        style={{ width: "30px" }}
                        src="data:image/png;base64,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"
                      />

                      <p
                        style={{
                          marginBottom: "0px",
                          fontSize: "9px",
                          marginTop: "2px",
                          color: "grey",
                          fontWeight: "bold"
                        }}
                      >
                        PICS
                      </p>
                    </p>
                  }
                >
                  <div>

                    <div className="aligncenter marginbottom30">

                      <input style={{width:'165px',
                      marginLeft:'auto',marginRight:'auto'}}
                        className=" custom-file-input form-control-file"
                        accept="image/*"
                        type="file"
                        onChange={this.onImageUpload}
                        id="file"
                      />
                    </div>
                    <div>
                      <p style={{fontSize:'17px',color:'grey',fontWeight:'bold',marginBottom:'10px',padding:'10px'}}>Your Pics</p>
                      <div className="aligncenter marginbottom30" style={{whiteSpace:'pre-wrap'}}>
                        <p className="aligncenter" style={{marginBottom:'10px',color:'lightgrey',fontSize:'12px',
                        padding:'30px',marginTop:'10px',fontWeight:'bold'}}>Looks like you haven&#39;t added any pics.
                         <br/> <br/>You can upload them by clicking above or try one of our templates below.
                         </p>
                      </div>
                      <p style={{fontSize:'17px',color:'grey',fontWeight:'bold',marginBottom:'10px',padding:'10px'}}>Templates</p>
                      <div
                        className="col-xs-4 aligncenter marginbottom30 "
                        style={{ padding: "0px" }}
                      >
                        <button
                          type="button"
                          style={{ backgroundColor: "transparent", padding: "0px" }}
                          onClick={this.addImagePreview}
                          className="btn btn-sm hovertile"
                        >
                          <div >
                          <img style={{width:'100%'}} src={require("../assets/images/adam-whitlock.jpg")} />
                          </div>

                        </button>
                      </div>


                      <div
                        className="col-xs-4 aligncenter marginbottom30 "
                        style={{ padding: "0px" }}
                      >
                        <button
                          type="button"
                          style={{ backgroundColor: "transparent", padding: "0px" }}
                          onClick={this.addHalfArcDashedFull}
                          className="btn btn-sm hovertile"
                        >
                          <div>
                          <img style={{width:'100%'}} src={require("../assets/images/dakota-corbin.jpg")} />
                          </div>

                        </button>
                      </div>



                      <div
                        className="col-xs-4 aligncenter marginbottom30 "
                        style={{ padding: "0px" }}
                      >
                        <button
                          type="button"
                          style={{ backgroundColor: "transparent", padding: "0px" }}
                          onClick={this.addlucaupper}
                          className="btn btn-sm hovertile"
                        >
                          <div >
                          <img style={{width:'100%'}} src={require("../assets/images/luca-upper.jpg")} />
                          </div>

                        </button>
                      </div>

                    </div>


                  </div>
                </Tab>

                <Tab
                  eventKey={5}
                  title={
                    <p className="hovertile" style={{ marginBottom: "0px" }}>
                      <img
                        className="hoverimage"
                        style={{ width: "30px" }}
                        src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAYAAACtWK6eAAAAAXNSR0IArs4c6QAAEj5JREFUeAHtnQuQHlWVx8/p75tJhiAQIEBQiA8oywdLeMxkEhMTYgQjRsvC4K7sRlZdsiFkguKilqVisQtbq2VlJkCM7xAtJUmpCxYPcRcWQmYm0RCyIuyuawJGkmBMNjGzmcnM18d/98zIZGbyPW7f/h6Zf1fNfN197zn33l/f0/fZ94rwIAESIAESIAESIAESIAESIAESIAESIAESIAESIAESIAESIAESIAESIAESIAESIAESIAESIAESIAESIAESIAESIAESIAESIAESIAESIAESIAESIAESIAESIAESIAESIAESIAESIAESIAESIAESIAESIAESIAESIAESIAESIAESIAESIAESIAESIAESIAESIAESIAESIAESIAESIAESIAESIAESIAESIAESIAESIAESIAESIAESIAESIAESIAESIAESIAESIAESIAESIAESIAESIAESIAESIAESIAESIAESIAESIAESIAESIAESIAESIAESIAESIAESIAESIAESIAESIAESIAESIIExSkBrOd32jemny2F9g2TCMyW0M8Xwp3KGmOA3usa56nikcb+I7RcL9uM+znEd/VrwvEw+f5teuz5X7RxsZdPrJJSrkKapiOubkM4XkN5nJMg+qS3tm6s9/rUav5oyELt7zskSds9CxniHWDgX0KciwyRLg+oh6Nkkok9IgL+zz9sCgzlaTQ/U2hr/Dulcgb+TRo2X6ioZf/YndfED/z+qe8KbA9znShhOAadJeLlMxDMIEqr1IK45PP3fIS478KJ4Tpe1/6cHpceoSJa5jlGVzoXd1TRdcjo/NgiVJmSSunRCGtSqR3D2Y8kGrXpTR+fg3Ur9WmvTKmSAvy8YvsrzMnHi5brop10F/RbpwdpmvEGsD4ZpV0KkvkixSnp7SCT4tN7cud1XJKrWQFCluEpy9jkk9G2+Elu6Hu3EG6pNxk9dr4u/1lu6fDIJWzGjUbS3s+hSUvWLunzzbclC7ZeGYb4fhrEWVxN86CufDrzg6oLLdGnHcz7CrDoDsbbmBWK5zyFTNPpIoCcdu9GW+Qwy3xpP+opSY62Nj4PD7KI893vqkobxF+riJ3eXIDPCq901Y4rk+rbDQE4Z4VgTN3SbLO+8VFUt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5DDs8GwQQ7Wr/recM+XbIpuH3uV5DRJIvQ0ylEm8SafWvw9v72eH3j/BzvdJNnM1qldHT7B0jcnklNVAIsK6fOOLUndSM05/eMIRV/mlaDCjf5A0YepUHQ1MexKF7BpuNGvihnNPuDZX2Q0keni69PHDsnzzB9Cz9Xn8pVjXSZRViheOModKq0yc2IwOif8pXjCPT1PXLelezKO1sJOZa7i7BvaRLxxGDfkobxtkCBjtX4Hvdmtr3oaGwnfReD9liHPtnKo+LFn7jC7dgnR4PFR/4/bqgFySIyM70KFR+mG2o3Sh6peoSAkyFIu2dDwgQWYayhW30eqhysp3HmLwcwPaGpehd26+d+OI06FuGS5ABk9yNGTcDEwThpskzinKVtxAorTpsvbnsWPpDJHgSlw+lWJ6E6rGNy6qaySTfQsMY6He1LE1ocLji79q3HNuMxCC/zi+0sIu/WNKDp0oGmwsrL32fFSFgQxi05s7H9Wbt8xEfX4ezOaJwfsV/1UsE6T6FclmL4BhXB8ZdNpx0r99vBsMvlBiOA9pS3siA4nDC+RTJYWr+is55/w1JcnUiGet5nhi7tUcCcNoBH4u6uNl/jZEX8bA4wbJyH2y9OqNlWiA2rqFGdn9wna0z95cxHNCta/uYl2+KVqTOPGBwdd/R7hXFKdIF6AG8JPi/NaWr6o2kEGUyCj1smfXdBgLShZ7J0oYbI4Tj6YPekn+G+1UJBplrs3oqv2hnHPeY9UwVcRaZ54vcvR7SG80GDr6oboXcf8IetAeHN1D6XetbdYkse5v4sW0II90lwTycezR8fU8fmraqSYMZDjheOr70UNXSM5mI2O8GgaDpYJsEs7PxAONzkfvnYsmTJochP+D8ButrrgNpQTaEfq0jJv6q2pdun+gJPk04rsQ8ce+I0hf1D1uUcM4eEKC+tR2WbK2psUwzo9gQ6JoBkTDwLPYDWadqHbe6q1be/hDrpLrmjSQfOyiWbmyatZp0tsLQ5FTpC57WOzoQZmUPRiP5OcTrgG36BsVCfZdIA31L5Zz75HYSPfuulCyur8cG9fUwKNgFEmABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEDgT0Vbny6I3pR4AAAAAElFTkSuQmCC"
                      />
                      <p
                        style={{
                          marginBottom: "0px",
                          fontSize: "9px",
                          marginTop: "2px",
                          color: "grey",
                          fontWeight: "bold"
                        }}
                      >
                        GIFS
                      </p>
                    </p>
                  }
                >
                  <div >

                  <p className=" marginbottom30 aligncenter ">
                  <input style={{width:'125px',
                  marginLeft:'auto',marginRight:'auto'}}
                    className=" custom-file-input-gif form-control-file"
                    accept="image/*"
                    type="file"
                    onChange={this.onImageUpload}
                    id="file"
                  />

                  </p>
                <div>
                  <p style={{fontSize:'17px',color:'grey',fontWeight:'bold',marginBottom:'10px',padding:'10px'}}>Your Gifs</p>
                  <div className="aligncenter marginbottom30" style={{whiteSpace:'pre-wrap'}}>
                    <p className="aligncenter" style={{marginBottom:'10px',color:'lightgrey',fontSize:'12px',
                    padding:'30px',marginTop:'10px',fontWeight:'bold'}}>Looks like you haven&#39;t added any gifs.
                     <br/> <br/>You can upload them by clicking above or try one of our templates below.
                     </p>
                  </div>
                  <p style={{fontSize:'17px',color:'grey',fontWeight:'bold',marginBottom:'10px',padding:'10px'}}>Templates</p>
                  <div
                    className="col-xs-4 aligncenter marginbottom30 "
                    style={{ padding: "0px" }}
                  >
                    <button
                      type="button"
                      style={{ backgroundColor: "transparent", padding: "0px" }}
                      onClick={this.addHalfArcDashedFull}
                      className="btn btn-sm hovertile"
                    >
                      <div >
                      <img style={{width:'100%'}} src={require("../assets/images/blob.gif")} />
                      </div>

                    </button>
                  </div>


                  <div
                    className="col-xs-4 aligncenter marginbottom30 "
                    style={{ padding: "0px" }}
                  >
                    <button
                      type="button"
                      style={{ backgroundColor: "transparent", padding: "0px" }}
                      onClick={this.addHalfArcDashedFull}
                      className="btn btn-sm hovertile"
                    >
                      <div>
                      <img style={{width:'100%'}} src={require("../assets/images/giphy36.gif")} />
                      </div>

                    </button>
                  </div>



                  <div
                    className="col-xs-4 aligncenter marginbottom30 "
                    style={{ padding: "0px" }}
                  >
                    <button
                      type="button"
                      style={{ backgroundColor: "transparent", padding: "0px" }}
                      onClick={this.addHalfArcDashedFull}
                      className="btn btn-sm hovertile"
                    >
                      <div >
                      <img style={{width:'100%'}} src={require("../assets/images/source30.gif")} />
                      </div>

                    </button>
                  </div>
                  </div>

                  </div>
                </Tab>

                <Tab
                  eventKey={6}
                  title={
                    <p

                      className="hovertile"
                      style={{ marginBottom: "0px" }}
                    >
                      <img
                        className="hoverimage"
                        style={{ width: "30px" }}
                        src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAYAAACtWK6eAAAAAXNSR0IArs4c6QAACxpJREFUeAHt3WuMXGUZwPHnmdmWthSbkioVgSaYEBSVSOwuitKlliomGC+xfvOSqBi63a0mJl6+9Avxk0mvJk2saUwwETUhUUFByrYlvQYaKbGJxlBv2JZbtTQtZec8Pme2M8zuvu+ZMztnZnaX//nQPee9nvd35umc98w5MyIsCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAwJwV0E6NzH629ko5e+4WEbtOJFlc7SfRRFTOSVlPyTuuP6brfnmpnf7H+zh7m5gsE9HFojY+HtP/erv/knfecHw6fdiPP7pUxiofEKmsaGf/gnUTuSDSd1JG1j6tuikJlpmUiOUkkNrmNCxrVfP+7UiA2Nb+B8Rsvb9wl0R3ROVFUb1bh4/8KVomI8M2D9wtmjzsfSyKFlM97XkP6MiRbdEyDRm2deA6seQRb/P9DcmdWVU5Ljrvszp84G9ZHWCZpXM5L6dljpamFClNSWkzwTb3f0sS+35mcKR9mLxdEtljO+68vtUubVv/hzw4fpMZHNU+7BoP1K1e/jPN+rCdg8skSfZ2JTiq++ZBmIztyNovLLN0GvLS/9CaWDaUbmm18ADxU6iv5N8Du1oqr381f/nLJRMZ8hfyFbnrVeTLTctePL/ay9zYtFyxBT6S2RyWmTyTMrMtJxXOu1logJhtStu7KW/n1XJmn2ulvD30hbKX/3QrdXxucnPz8upzji4vKv+J9YhlTCaSnmEZqZErudAAkZ8+fqWf0izI1XOtkNmttu2Oa2ubTf+e/uft3sfSpuUa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"
                      />
                      <p
                        style={{
                          marginBottom: "0px",
                          fontSize: "9px",
                          marginTop: "2px",
                          color: "grey",
                          fontWeight: "bold"
                        }}
                      >
                        MEME
                      </p>
                    </p>
                  }
                >
                  <div>
                  <p className="aligncenter marginbottom30 ">
                    <button
                      className="btn btn-sm "
                      onClick={this.addMeme}
                      style={{
                        backgroundColor: "transparent",
                        fontSize: "17px",
                        fontWeight: "bold",
                        color:'white',
                        backgroundColor:'rgb(43, 147, 255)'
                      }}
                    >
                      + Create a Meme
                    </button>
                  </p>

                  </div>
                </Tab>

                <Tab
                  eventKey={7}
                  title={
                    <p style={{ marginBottom: "0px" }}>
                      <img
                        className="hoverimage"
                        style={{ width: "30px" }}
                        src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAYAAACtWK6eAAAAAXNSR0IArs4c6QAAK3RJREFUeAHtfVusdUtW1lz73M+JJIZo25Jg4wNekHgBTXuBwIstiPii0IltvJEAAY0BxWiM8GDinRi8NsFO0E7bkTYRJHQwmo6YTnwAfQGN2oq0wVa8JOrp7nP+c/Zaft83xlezVs25L+vfe83/Nuqcf40xq0aNqvHVGHWZc661p6lSIVAIFAKFQCFQCBQChUAhUAgUAoVAIVAIFAKFQCFQCBQChUAhUAgUAoVAIVAIFAKFQCFQCBQChUAhUAgUAoVAIVAIFAKFQCFQCBQChUAhUAgUAoVAIVAIFAKFQCFQCBQChUAhUAgUAoVAIVAIFAKFQCFQCBQChUAhUAgUAoVAIVAIFAKFQCFQCBQChUAhUAgUAoVAIVAIFAKFQCFQCBQChUAhUAgUAoVAIVAIFAKFQCHwCBDYPYI2W5OHn/7Yu6YX9r9tOhy+ZNpN7wB9adrtsk97yF3gHymTedLbpBvqHw4HtUXKxHadt6beZU3+APkddIAqndi/hb6x/Rv6v9bHo7wb6t/Y/pGyqWGznf1vTIeLnwO+PzG99fZHd1/wVf956NEml48kQA4//uMvTO/4X98EB/saIJ8ePzrYOMBwRlSAJ4dDL+BxmR12kF+oh9wFZPaWHxUO9VvbKe+6pGuJei2j8hv0LSaAsn+eFCdMRBc/NP33n//+3Zd+6VtrcJ8rb/MAUXD8wv/552DQr6bZ+C8cjJ/szbq70X6XRp93cLgDnJCUyTzpejpugQsVFw8vWGN99uu4f9FX5q2nY/1LGdazDK0Z9c8WLusyZ6j/DNq/2/3r6ec+909tGSTPr4/FGXN/wf/4ZrjGr2nOt9fUGQ6zhxM4YMYuhGvNpQ4EU7oPZ227r12RlMmaLbFHQdSJcn5aV+S4rdAYepw3uitd/0J9J2WiZB9g1hmUO8eQL/tnvG4a/+nwa6fPhf9M0/cYxnNTu9O525H+w09/9F3T4fL7tN8fZ/CxB57d84igmd55o+za9TJA+vl7rcZpee6L+6doc6NQRWS7y7ZaWb7sBz4AyCv4iL7Llnhh4tl9w1Znkm1XkMP+twOQmDHisId51ghwa+R9OtHC5YH78IzhhfzSBVOYbskUc7gVXCL7ArpImXw+8BliPDNQlqsMaSRW5EUqoH71PQWcnXTZHtqGPdbnumV/Anbr8cco7L4a4/A3Y1jO+7ltgEz7X69tR9hkzwuqO0L7C8wOBiwtz8sdDvNx1ygCLM6wu+4mV/DcuDBZ1vp4t2nP1jkQLAcl17ZV3NOjfd8EOOxRqryQ5/LPlkmZzEdv3B6CJvu/bC/DK+2JK2oKfepv2d/wa/PQyvgf9r8BuD2FAbLfv8P+QM84TnBYYZEOHA4YjkhBOSgE7KBwyeSbxx3pGwNAh2uIzods1qNzZn0GIPm8q2ZeNDUzKJ2iH+4Dcq3b6ihom1zpOmrZsl8oXTf+F3gksFHadgU5TK94go4ZnDN0OsR4V+oSCNB9SZ0uc7bl9XjovoQe6iBVMp8zemYG4ScDgWUZEI1v8qkn23QoOZdx4D5I6ao+SKe+Rf3sb9kfiJ4y/pfwo43SxgFyiVXCexJMxwdt9MNUz+ymPKrsIZNHlkVAae+OE17bw0P+AP15EwmRlTwpEvXwTNP0iUd90EghBwldjvLuC6lS6nN7rOVVi+Xsi3Rk+7Ibdct+ocetwJ3GP7Wcm2wcIJxz08E0AxOkK0y045pSzLMtec3eqEzKJOdPyms5LPRHaQYb8puDd7KSh6DvnPBaAYG8K+Wz77M9saZ4S6ZAxym/BfxCHn0r+x96/DlGG6RtA0R7ct+18uzv+3z2ziw/IH8HnpTJPCmTA6tRynXyvUxUSF2uP+g/cC+nVUjS2q7puUpukcb+KHC9irCKV8O8TcVe85wSvWfX0FO02VY88+w3U5aL8nLoX9kf4+fxF2bn/9g2QPbcdjSPoXW4sIc33gJ0ppQB2eOuErcspM5lsaVDDeqolAUAlOeR/kzR6Yu7VGg+9alaf+BBRr9ijfLaM8uebFFnH/B5BtIKpP5Gh2g3dZT9gUcMFEHJ6xPH37XOTLcNEILRPznm9sMubX7eknDGwE1bPozIpFne/EB5OUuSD/CtL0KJEshXYgDBg13LRalkUR/5zmN1PQlHBDd7uJ26pr8LeWijvrI/ADcWwhj4ctyvw5NjsEHaNkA4I7cZm/6rGX420+AwR7ydcha5PZeODkVdcnAwy7wpsjrZmO0xSF6xuCJpBUghEPeR2sz3NjDfSXpos1cs8mX/PAwAqsfuJjyN65npxgFi5zAYdjJcc6HQNj79z3xu6YlegJnlIzA47+bDuyjh2uA85TAOrEMsh4Dzdyg0T6qEbA8Sr82LRsZRf9wWKdOifeQdbdnYjttAWdl/t/En5mdI2wYID71zonfYa5ELnk+6Iy8chrJ0nJZ6vmXOjJ2TOeZNqVrJlP7ZzeDmeydudVxx6C80tP5SpLXV8X2e1LQP180Olf13Hv8G7f0x2wZIOF86hF/rIGVirHCFIV1NrMfCrD/KyNlRJiemaPLtkD5U8PkjH0xoLQE/nwmG1k6Vb321QUP/y/4Yo/sa/2F47+ly6wBBt9Mh5cB2Elpjv+/pUTz4QO2AGgLAgXEVHQImVLcNFVYqBAdkSJXAx6qSHVIAsp/h8N5qmS7vmlGLg4P1oFd9mPVPZX9gQqj6cff1deNPmfOnjQNEh9ywineQPGsrZ3gOIGwAml2M+MU5IVEZAmG8jTqoi7rSFxq5dWOdfgvXb6/4sqHabAHBsfT6kn04InB83ZfOABg6sOxf2X+n8T/C/mwXGwcIHcybcjhnzNA2jhnkw4Hla5LJcvNRLCk5cBbL4cEfO3wWgkhfR6nGdShlXeoCM5DWeOdpcLuQVTywjgXYQ/HRYdnNrLJf2AoeTj4BD/IIDosi46bxDyVn/9w4QLiC5AQrT9K0Gh7FYPELa4KJEzKc6Sr5PeryqSqp5JP3k9bxSbRO0Gy7OejxFsrbKa8i9nPT2H5FH9nens881GYaBL39u2WU6RPtuM6esv+08e+xPSO/cYBgdmgz6DBjyNlwc7Q5eD7V9sNBPzQiZRrlFw/isDzIiXNJUcDgW0ykTC0QOIshjfoWAYZI8a1eyq/V13MSTX0ozwBu7WVglv1Ejwm4a/a5Av8bxj90nP1z4wDhinCFTXpvCYD5+x6UI36Wv+uDtmV9ejy08+DMtvIQHU/X2TBXGARjlrMnIRk9kuNLRfaQfBt06qNW1IlKsoOs7WFpn8p+7ghOGP8evPPx2wYIb+PmhC1nosv5LhD5eLkvPEqOBW+ygykXlaOUiIDXRTosrnt9KuRqkQoodfyjDrFatR9ZgJx+eMEN0pWP9McouH2tBNDvFUErG1aroxUuVxHWlN2oXPYbx+Px4tidNv6h58yf2waIXjgMf05HJywJGD2HPpkeJN/mipPylLIseR+wcwfFqgkwS0OPdNgjpRsFqc/B5XhQu5IJgag7t08556kBynLblPo4+zHYveDEm8ARlJR3XVKmsKXs95iu4n/N+AeKZ//cNkC8WshBiAydzAgpczbY+aZzSXB0NAVJOpz5o4CB7ixeBNTQ3MKBR32S7/pKvWmCOjS+zh7brXmFHNuTXVByZF+n3/mmaqT7eNbt76A4J7txgHA2Tw/WHh68D7E8JJNvh/TkryxPWOxToz4Wu0yiqd8e6basn9KxemUtzF48gmBZiupDf+y4phHtFHVIUuPM0273kVLm3X7Zf9r4E8MN0sYB0r9KAj+MWTbMNG+nWh6qId/VpzP3t4UZDdYhjdjrxLLtMOF0zZJwWusSRW5rN8ulu/u+xyjvtkmZFv1RbvfB5rv+j/1131s/Utb9Y7f6+ov2njH7O2TPyW4cIBxETct0UzgwPr0LN28HgWTKzg5IJOT0oHTz40N35IU0BVNznkFG/SzV6yWgTPykzqvrs9C9BSs73Mew5zp9a/LuEzSj3cCi7OcoMBnbHB+PY9KQOfvnxgGCWZF7Z6bxEMu82TngcBDk9qX92jsFumRHNmXRGu88bYVSp9SYzw5FOXRkhehLBHHIc8DQ+VwxIpjo1JHc90apB4XWx2Zi1g/5sj98gTg4GTte3zT+rnNmunGAAIzmMLBMB+G0MP1pdnJkyFf1ETyhzMuTcWHd4/bYAFeE0BgrUwZB0z4Pnt/DImXyDaw8omBAo26/5WJvveLZbtNlfxRPs33sHhuK7omwTl6y5KS0bI8NPDv2nwTWLLxtgPRbFA61Z2n2x7Nzc6jsZHMIjLCciyPNxILOY2KG5syjUsk6z+I9HWf0aD/7QUHrdns39VcKUT87wGrXbgFv0sc+IJX9gUNbjdt4ZP55ybYBoucgOeR6NQS8v9NNOx0cazbrLg9Qane5IMTdjh0o6s4zNkucR30OlvRf/PgDHhRCAWmUB+8VoF8iDrv/CAX/cLq4+Pj0+pv/bfeeP/5p1XkKPg4/+pdem1587p3T8xe/Cb8d/Lvwrc5fGmYNS+Q4XsZuDS8q8EM/UiauVc7j9aiPeaeMP+U3SNsGCFeA9uRagMFJQZn4SSjt8GOGnlBDQXtSDYEecK5GUd9TzDGNn9tBa7nHYWk/w/uA3b4PAv276W18/oXpy//Ph3e77/JmChWfnpTB/glY9InD4bs+OP3Y57wXdv8J4ATf0HbSI+KRClztzKYauSN55ngMyHMi4q4hJyRwDhLCeer4s84GaeMA4SE9rfKbr6LI01NpYOdXNyhHX27y4ungocDgm1IuAsblxwG3w5fbqZuUafxZHuZZF/mL3dv42dNv3H3lt/9LXj4LKSeBDx0+9lf+0/Tc4f2YQF4A/oFXOLCDZMa2jU++3ewJLAYPpd2ERHybvH50AMU5HqeO/0YDEtG8UWNyQOLFf/yNLFPxgM6UQErOlHXMk+Ifh8iUfCzlQclzZjMVj+A0jd/WQjmfNQy61A7yLqe/+CwFR+8Cshv2B+bEcu1fPybkMflozEj5j3VMyQ/ydx//vstn47cNEKCGWelC/+C9jZLXQ7Ck5Clnqm1P1qUO6aFzM4+y+MfX4k3JMxgaJU8Z05RXHmXxj7pMp8Mnpq94/e+fDfUnQbHsBw7Gl78iTp5UPJ8DMS/HU5MPx4wY45/wTKpxonyOocbzjuO/EYbbBsj+Mpzejm+qYEjwNNOAD4CDCljUNaUe86T8pwdxScmHHlOUK0CSglebSXuectPhI0/rmeO2fhX2Hz7SHF4rAp3fqwnx1CoBSp7Ym4LXWCf1uJtSrsf8ocb/tpbcTW7jMwgAuzJxtmFKalFT3obSPjVvQ5kXjZoazGSbHuvTbSzMWqIU4oj61pYqxSBzy7U7fFw5z/zH/uOCiTgwGHo6jgd3AQ1jSeLDY+rr66hlbzn+16m6x7KtAySDQBaQp/s7z3wLiWM7xwGgcztvTd8YAGoOH26Od1Mok3dV+rtcb7/4qeO2n9GrB89/arp40AA7RsHYkyLpyTd4v/lww2iyBv5ZihrMk66kob0ViXNkbbvF8v40KP0zl2ZgMvPMW/kHQJVP2vNNttdBuCmf9DbyrS+7p+k5x12cRjisjgWx6jEFz1vmzCMV39F1HcN4sX7zA/LDv6G9uxh2Qt2NVxDsPWFnJE4UnkRWejwWW9TVW11njBVWdPZZo7h3W7mD60WfaV5nMiBwI17jij0O0DiAo8IB5bF4rD6In+ty2xWEe1Ld+uNymbz2qTl7KA/ICOvM47tPeg8K+aaaaaCjUfC6g5VUd1tQz9R6TaNezlg8WPLQyNvOQfV0+VyIP0F6hYOw4pgQJ9NjvIQd30gghqJ8O0H4BxXu3Zjr3MjxzTyPiynb8VhfNf4b4bjtCsKlV1MR40MWAiRbiqmbwOigd1QWS8RCfpyhUIfLstNebyZywNyC20oZtscBWlkydm/8YhT8B6t6Zilx0CRDBEa85MUczxwZjR82WYmnXwxt8ENM76nlcGStO4z/JsOycYDgvvnFikPSVDo3XdhOrj/ZjAO0ftBaAhgM+nYGgR7Egs8Hsdj3jr8OzuCY2+P+WPqlBKowsP2PNPT1D5dfhoYqQN5+8GWzwyeW/pN0/Hv3B4Dmv3vPQNFrJBkwPZ4cPo57Px7M69Op49/XPSO/8RaLLgqn5r/+IBc8HzqxLCalcYlldDAvoiR0kLc+uT/K/V8APpeH3ll/1IvAJG9dotN78V7S1ticcZhPVy37D9N7G749PuRj6k+qMQve4zHK9xiTv+v4n27SQ9XYdgXRPrbrZyyzkQHXxX9yc2XEcoy8XHE0MXEMspLrmi7qpy7qVHLdvKQit8HykIs+TNMXTh+d3ofcv6uqz+LHRy/fhxXiCyMOAACHgauCNwDmSZnW8Ceqxt/jZMo6Pb+oz4Y8RpSlsMeQlbdJ286Snl2C0mjAAsP5r3+aSl4HPlO9t4VZJ+mxHurgjMSn5kHF8yDJPB4u1/6xbearD0u63/+Zww/+yd+8zTA8Xq3Ibth/hA23R8IXVDzxZV5ia6xJxXdjso7x3cZ/I8geQYAIVJgnBw0qHtemApRzEmU0N4GyHvmsP1JORzp0c6bJoDN1EPY0BjECs+cts798Afvm74ez/L5nZbtFO2kv7cZk9ALwD0yFtSYbXGsiwsRDmMkH3Dk+vXyOFccwx7pRjOFdxx8atkhwyu3S4Qe/45PzGq1vO6F9UiaCxnglXUsuuyqmGWDWuVbfZW5vlBnrd/K73b+H6g9Pb+1+bHrtrZ/dvecvP0VfmPpjr02ffuHzphcOXw6fxZlj/8sCmc5+ZQz4cNToPTl6wCe2rP5CWyjpPnPL1PZoo/7Txn/3O//853fKz8ZufAYhpEaUgDOZkr8qOPqy62R6XazTJ5eZ9mXgNeAoc/d0kwD5Qek036n4/SwmzX/0HUPlJ/jys+j7Be4uvg167PCBRdwYSQMH7IwVS3XWQIbPHFljJhI+8/jPrd0Xt22AxG/zBqxcbvl1TVKmcYE4oEzOyZkGyXwbMI9mVE8Ph2CILxakUX/zhqyvZsBnc9GmPtc/xv6das+p8mU/AjZ9Yn1EzpK7bYDozodCAcZwg0telItHeHxQzmY8ZAel6XvI4amHKK91v0t54eF82dB5KseSrjp522W86xLtom62zzoOLvHQFhmhf+YzYLMv7FNL3QzLtrmdEIWA+97k1W7Zb/xPHf+G+XmZbQPE39MIm3h4IxcOyAVdD+7SS+23jWYw6WEUq6FAfAqYv7o8gmHeAtjx+/YVYtQO3eSD8tq8a/E+PnnSKB+/I3/86/HRTducNcp+ADHjx7GjHzC1cY/LNtZtfCV19o+NA6Q/PxAXGh/4ABAw+N9brvFMZ8duVHVnh6O8nDb1mbcDczYX6BRk4oUb4fVQbtk2UNlRtz/KS6WNSfVNhoVjYjfK/oce/xHOM11vHCDdFoR7ffkHP5DM52U4M/NbBng5tMTDuRlw6fARWPOZhhX7B4Hy3QxCaojtWFBex3YuKK+ZWttxefzptjPo3TfRlLyuftk/jznhOnn8j0fjXFfbBghffEt/DofUrL9um2IBqFleUg4WXPDevGTSQUN+1q9DMOXaFog8AyLS4kyS+SZj+6qLynZ6t02q5L4lXZVn+yl/avtHbeDiWbc/QD/757YBolu6diTa1vODrXZE06E4FgQ6XBbIIakydTLfeRQx73LnkTJJPqkyrLvv4xqfeTwRaVVqRnFLx8LsoeuashHzu+fwo3Qv4Z7F87OOPX6T6/AmAgH3YFfSTfbdVE6VPRaP1P4V+9w30xWRLbK2DRBvg2hZ7OXDrXg9PmjiVsV5KkcNuyCv7VumfR553hXhgc93xXSXCzrDadFe8n49mxrdJ9ZXA/YaXnLqx2jNW6hj+Tg8Mq+7q+XgSIW9/sZfvDxdPPeybi/LGWCQer57Eb92+ML09p5B8qZseRrtDxxOH39Bev6PjQOE7+3Q6TIZnLik85ILAW+NTFnSyzO/f47C8qOETT7vms0PNgb96Aub4rtETNZtqnqSyRB03y3PaujDbA94aQp9upCMMkPuSB75DA788yxpqhpQpiBHOTt6uHyj9ZHlT4P9DWsZPIxPAnvV+KvK+T82DhB60OxRC/PSFZVvZ3OewTSlUA/eUpkdNWmuAO0QIG+cn0PcWF8Npi7xXCnQOwahEnuaeZmTEZPFx/3h9yh2Ozh/nqFcxZTa5tZegq1v4V98S6bJXINlw9kyj5n9tqGnHmvmBe9Jh9eBhmlf74z8tgHiW68CAAh4zHhN84+dwiCx9BZpVGBlgXQqg5Cv2aJ4VlxJN+lTlb6u+aBj87aVlGk3YeXAasTDelxHd1TMDytgIXjK7w98MeSKtFKngcoqagdC2Z4Qd96aypv0qQ6FnMwHpWqroMRoP+cn56kcH67DayZ1L9hH9bltgOhVkzTV4BlWv0ZAyhQnCM4XBjx47vKVODPqXmlqMJ/1NYM6j/og5kFh/ThBcIa6nT71Bwpaf1DNOtUft9W1L1tyBs9W3No0Pfe8XhfP3rd8yfGDBVxdbB4O8rTptv193O2nWTYTLLoLbGlf4nfj+LPS+dO2AUL3agnO5oMv83Re4PDnliUcal5i6Y10cHmlKvAD+kKw47MN5c/lusSHxTkOe+hs/gxd5Oc+um7oi9dWjl91UV6z6VievZOTill+qJ2uP+oYm3IHhyp7bMn0/XBGJZPk3CYzzK+XS7xr71Hbz8G80/jT5POnjQNEB1x7QDp8Opgd03Rhe0QHHMP1IdGx4dxwk8wjcZ50WbaVx/ljvuvEubk7QwzyPF/EHbA4c1Baee7EQp6Oysx02ManYPpzK2WwYr813yVTr+cPlnE1elrsBy5hSiDgcTedDU9ubfwXQveesXWAYHwxEzL5Fm7//YErwVEFe1S6lH3PjqkVBhc5w4YDcwVKgVE+eqFPfrBf0af1/sVtYar3gNL1qT/Tifp5HnMVacCF7G8KrTgp7dOW6+mw/87jP8BzpsuNA4QzYCY7QwsKe4sdhKLOIwvnoG/KSWYl5jRP69Zn5oinfLbpuunfmr2U5/ZA3SepQGHvkPx6KYODlEk86jhglGldvCBvG1Q490XFKduqjPKuS4rEvrB/T439BAc232n8A5pzfj6CAPEWgY6rPVB4gJw1g0AOATnN0Janc3iZhQBr2ackn3V7B2rOR9ms4BjVJQSidZSTx0XX3NBA16j0oQKU+VCpBjp7pJjB1DfAi2zA/YCE0sL+0R5Wpb5USLW0r6kf5bMcROlxs3/Ea2E/cLpu/G3Xmem2AcK7Mt5ihaNgO2OHSedpMwqu6QDNBSjH7Znl05vbnh35qpvlzdspx0TnIisno3OFe3kLpiI2QVkkPaSDLj+JZ7tH+nleUVuxJVOlzut9niBlGrdw7qYKWR5ijapO5kkGvG5gpKAPuE+q/Q0723Pi+Bu3M9NtA8Q/jkCjYnYIKiMFlJ1uzWyXpUMu5K8v13yEOg5Anx9ImcaA4Qwn/+ycXrNeds3bubaFkwZrpb7oj28CsLu2mSq4NaN+B2S7UKPZSE8gGCvIU2I/LDcmMnMxnr3x5IfxHYvPc71xgHAbkIbYD2YartocmA6BQi8Ac83UwIpaRVIhs+nMWdx4Ozgd0nUomsr9blbTlQ1GcdZhUxzQpCBq+0hfZEqG7LL+vIipvDND1/jo77rJtN5+rr6ypav4JNtPo5GIKZMmsKS8XtjfBtYDTKmzp20DpDkt7ApA+hk9+HBDlDOYgEV/pkBOQ0QzsGQiL2Z06HBAhPdCQQ6BCBWGikX9lfZcVTXYDOtmF6J/6C3qMUkfykmVsh23p3p9fcpC0GLms/aq/X5vjPoX/YfdxO6JsR+9VX+FArE4bfyF8fk/tg0Q/chYZ5RXC2aZNyVucj57TFdP8nRMyzCDPIPD8uYdMMzvHXSoH3/3G4PGaVyixwPovjggQkai+lAzqOrm2JbzetnQvnhrS13r5ZpttgeFzfnJD/1/0uwPW2fjPO6ma/azzsZp2wC59l0sYBXbkoCADrBcQWZ4XNYm7EH+pnJpsrfiQuGAa1KnNljMGFckNcAKKc/DOHkfyqkJdaxjFL/EQ1PnUb15UqY1+49XkFlmTV76EpO1cua1qAS7tf0ea8HK9mG389S1YTyZ9wjStgHCYeAvgisBEfHpEfwzBdw2+M8VmJ+3LOmAiaiBNaXOI56Ojgw7qG8R+8whh1BpeORYzl6yJHsLPp6kX/WrJItDpJrHR6hvttr+7oYcux7fsEzKa1ZzzPE6OiKlcZkdO7LZnZV4yD6u9jMi7jL+AuH8HxsHCGYFD9g84LYSgGmAw6O8nTBlLvkoDT2o0fSZJ2WiLs+KysDVkf7U1PrTNM8tRFnqW8hTq2V7PvK8epAyUVccwrMOsBhTSEaut2fesqnu02S/jAUWzehhfNLwq8Z/xO5M19sGiLcVMobA0FcMkPn0H+VzdclyPZeAuJ9LUMx5YCEWFU0jj5+ZpAvKSJkUQb51GFnHnym3GgSQdN+avi4PrPvW+gt1RysCG2MTV9nPAGJ5BpIIPpo+FR1PGMhqOATPz0yPm/20+zr7VQ6BxGfE02admW4bINPhM7DnNdlEZ+EdfVKlgbqMlInF1+HZCinENFSI9ubvX/AXmJxHcTqg2uQFUvyBnqC8lix0u78X0K867jeFOn5oPrqHTHePeuyzrDom22p56cOsSso0li8yVAGCWcG2tv6jgvOo71HY7zFm++6nqcvWxn83bfbbyBsHyPRfcMb4FcKDHx6syDgeUb6KzllelALmc8sSM+nxk265TZZLp71JF3AIoR8uZz4oBYZy6aETpRL0x3/WjdLqO1TNNhz3f6mPtWZ5bf8iKz61h4LC7i4avWZeEdPWp8T+HosA4Bi/68Z/t/tkj9w5+W0D5HD4pziY/cowaHAIfXVVeTlnmE+HWZRLSzh7KkygMm+hn84HkbapT94qmN+X64IqU2Doj85DyJv3yDG7z5ueri7ZMaktZKZ6fplMvL4SkPnuE+ty9VAdz6nMdOWez7zH3n4EhOzLCci/H+CvMA949+O/v/hnNHiLtG2ATJcfACZ/OIDRaMNGUw62sMoBdr4pCwVeAnoDPLwlqkUoHc48qZJ1eUBu0r8i7y95UZ97ZRqNXPNpwaQk8glXGcrZ7b49i11FH3/7h3G+7fjvsHeAH22U7C0bNYcx/p6v+Wto7JvlUBr0q5qWx6AwHUUODt4OPhRD0NrCJs7nunOUCpbyY8PH9aNh51HW/BX6s2/ekQ3i4yV6xVNQM2/szKL5sB/OEc3LquP6vgqBx9/+GdGl8QmMTcLlPP5/a/dHfhiT7DZp4xUERv2iV759+q+f4TnkK9N1r7GUXp3JjmfKylpcLCMw8RH+gbNBrCCkTASY5wU7WKpthHr1+kbqMz8/h0klWR5v07IP2SCKW9+oNeVMh8vj1YLya8mVUEbdbKu1oWsWZEV2g7Zmdx53+9lrdz0tWJJOIOz+2PRO+M+GaR7cDRs9/IPf/eL0s5/+biD0TWg29tQaX1y5R/P8b5SOJY6vAmznyRZW6zPMk3ZFeanBsshtyhctyjnRaAZka9sNrLTgY8Jae6N4qLVRs2lW7xJSpTHDxmWF4XJsbtH9Ud192D/rWLPH6z9bxr/d354+77Vv233dDzxIAzchhneTxsZGDt/9O75o2j34BpxPfyvC5PMxO+IWcDcjH1XgFMIyT6HmLX9D+fgVz3HAFw4Dva6jftyg/6ivuHDd9qDwjvpkt21mY+ZJmW7o36I/qGKbWd18atNq5Tosv0m/ZLoP131Y+3fT6+jDJ9GvfzIdnv++3bf945/qtG/GGo7NGqyGAoHDv/irP4nBZ5jeJsl9d7/lj37xbYRL5v4Q2P4Mcn99f7I18WVEf5nKP6Ha3iTGfsp5tDIO3P3t3Sfb9ieo9xUgj2qw4vlJrOCxa+wO4OiUn69E/26/1jwqe57SditAHtXAHr26npstrBvqzng+ijtmt92OPSqLnsp2K0Ae1bDqoR9vYyFpBUFsxEoSPToKB11E8ERpfW6EQAXIRkAvmlEw9K+V8G3BjIHFaywIpOMt10JdZZwHgQqQ8+B6s9b9ZTzIpCSDhbHRVhBc+0Gkyh05vKi0JQIVIFui3bfFFcEBweDoFpB4aMcg6SsU/ygQqAB5FKizTW2jMgTiy0Ddq/ss7zoWt3nrDNJBshVbAbIV0mM78Rd/26EDWyo85/CSEhsuVInyfrs16qnrsyJQAXJWeK9Rzj8W4x/CvsDrIuRJmeI9NPxIhNeRfjm5RmcV3TsCFSD3DuktFTo4KB5/GAdbrO6ulu5aeVfFNxXzlvAt1ZfY/SBQAXI/OD6EFgSDtk6uyiBwMp9UL/7lW88WKboJAhUgm8C80ohWC79exVtY5ElXks4n85ffVyQq60wIVICcCdgb1fLbDgc8C2HSi4l6LnLFYUPZ3Qpzo/YSuCcEKkDuCciT1ez3810r38ESpSY9OURA5F0tf/Xj5Eaqwl0RqAC5K4IPWz98P1cFrxBtAWFwUHOU68XGOqQ/LNR3qVcBchf07lK3f9XkVnp8cL+VcAndEwIVIPcE5Mlq9CQ9V4wbzujXnd9PbrcqnIRABchJcN2nMFaE/qZVz4/NtJ3XWFDX50agAuTcCF+lXw8C7fk8X3AL5XOG+dxWWewqXZV/NgQqQM4G7Q2K4wwSrn/AHS3d6uWdLSS9lsXbvuNzkht0VvG9I1ABcu+Q3lYhYoN/9ZeJb+uSJ2U6XIrMFJe7zIuS+twIgQqQjYBeNKNfPmxbqLyd69u6kGaOt1bkrzujLJRXxn0hUAFyX0ieqofbqjkEjmvHnzyId3qjpOePZevqrAhUgJwV3muU80GhfxcrAmVeM2LF8G+cxFbMv5l1jcoqun8EKkDuH9PbaeSrJu3MgScd5B0wwTNAvMlCCOV27HbaS+qeEKgAuScgT1ajX1bML0gtV4z4QYf+l+nztayT26kKd0KgAuRO8N2lMleEXCBWzxxaMUKgguMuQN+pbgXIneC7Q+X4TnooYBgcbagYHFxWcltVb/PeAei7Va0AuRt+D1+7f5Luk4aptHYXtYI8PM53rFkBckcAH7o6A8RfEuQKcfTXrxgR/bLR8w/dYlV8CAQqQB4CtHupou945CrhxcI09ldshvssx0rwyqiPrRCoANkK6bEd3sXSKsECRobOHLxAMp8xcThaXkKkPjdBoAJkE5hXGokziFcFREh318p3t0z5S/D1oHAFxPNnVYCcH+P1Fo5fNfFrJ/HyYrxYEo8LWZt/abf/Ha11jZV7BgQqQM4A6q1U8gwSzz8YAAiJbpXw3w4RpbYsv5XiErpPBCpA7hPNU3TxRlU7lGN7JT6feyhwVB5bsHrN5BRk71W2AuRe4TxBWfzcqAMA0YBt1KF74OHV5QSVJXr/CFSA3D+mt9PIVaEd0fPLUt5Sxemje7ZOwbbc3E5/Sd0LAhUg9wLjQyiJM8hcsV8x/OcO2m/36pbwLFvcZghUgGwG9dAQ71RNh+eUO961aqtFrhpxj6u+UzhAuMWlF/kt2nri28ARYTf9ja/9Q3gt5A/CmC/Cv9fgy7H/8S7IiOo4gQuXxrbJ17wxFbd0iQrj4Lr6lGE67Pi3qGZ55bUWhvxUOrf/OsR/Cn+D5APTt/zQ38Gd44w+Kql0FQKEr9ItEDi8/33vnA4PPgB3/IqY4H2gtsdCCZ9XxMqgC3zACQfvbyeL/fPQhRWkqy+enWE15Gt0sv6Bv+Rw8Rby2AZl9HlU/7bt76d/Pl28+Ad23/jBT1FTpasRqC3W1di0Eq0c3//7v3c6vPobkfmmHFiOilmYfymK6cAZOQ/e5I/yUc5ryUiY12/D0V/jVUsZC+26Z3bTG9Phwj93wrgIfUft3Lr9d6P298Kur62VpAd5yVeALDFZ5nzoW37v9NKr70bBW/OCAG+ObYqXAFPWD57bL+eSMjkIDgfookMfXp3zQqTV4aXq7z4zXVy8odK5/l3bf/f04W99H3T+Pemtj1UEKkBWYRkyX3nl65CDlUPuysJw0/Et9PHacqyxxu92D6bLty+nw/7nSWJZHy1e/L/p4jmeHxwas65Rfrxeq6OGUtfF7utxWQESmKx+VoCswjJkvvTqF8DX3oa35pEcM3/jcXNJv4TY1dGsj2tSJrp2HCrW6v9vrCSvT5f7z4HMywiW56CP5403pud2/xfB8eCG+ndpH3ZVug6BCpDr0HHZy6++BfZNOCpcPg/Hnq2PqMsz02V8Sh7H96vqP4DI67P+k+sjSKj65PYf2MSi6whUgKzjcpz78iv/Bs73xS1TZwc4JF2SThn3lZjRX7M88sj16XGpv5v+bd+t4pcIVIAsMVnmvPDaR6bd/pe3P7Sp00DetdIf78CqIqdH1f6kwG0Yt1Ytj48+sCV7XOofdh9ZGls5PQKaBvuM4pcI6DbvT37wr8O3v0Sl3M4wcbcltg8E8lxTXEbBrlyXj0H93fQT06/6Pd9at3k5IFenWkGuxqaV0IkO/+5D3zntXv7TmP1/3VwALsIhKAvo+8xjEs83RLBy9PkqdHlHmd/Lnav+bvpX0+GNP1vBQcCvTxyCSrdEQCvJz/zoV08Xh6/CavIuVHs5HTrc2mg6aKyX2y+tIkfSUTrX1BFbmeep/1no/hn040emX/KeH6ng8OAULQQKgUKgECgECoFCoBAoBAqBQqAQKAQKgUKgECgECoFCoBAoBAqBQqAQKAQKgUKgECgECoFCoBAoBAqBQqAQKAQKgUKgECgECoFCoBAoBAqBQqAQKAQKgUKgECgECoFCoBAoBAqBQqAQKAQKgUKgECgECoFCoBAoBAqBQqAQKAQKgUKgECgECoFCoBAoBAqBZxCB/w/9fQYuS49bUQAAAABJRU5ErkJggg=="
                      />
                      <p
                        style={{
                          marginBottom: "0px",
                          fontSize: "9px",
                          marginTop: "2px",
                          color: "grey",
                          fontWeight: "bold"
                        }}
                      >
                        SHOWCASE
                      </p>
                    </p>
                  }
                >
                  <div>
                    {/* <ShowCase
                      tabName={"ShowCase"}
                      onHandleShowCaseChange={this.onHandleShowCaseChange}
                    /> */}
                  </div>
                </Tab>

                <Tab
                  eventKey={8}
                  title={
                    <p

                      className="hovertile"
                      style={{ marginBottom: "0px" }}
                    >
                      <img
                        className="hoverimage"
                        style={{ width: "30px" }}
                        src={require("../assets/images/Soundcloud-logo.jpg")}
                      />
                      <p
                        style={{
                          marginBottom: "0px",
                          fontSize: "9px",
                          marginTop: "2px",
                          color: "grey",
                          fontWeight: "bold"
                        }}
                      >
                        SOUNDCLOUD
                      </p>
                    </p>
                  }
                >
                  <div>
                  <p className="aligncenter marginbottom30 ">
                    <button
                      className="btn btn-sm "
                      onClick={()=>this.addVideo('soundcloud')}
                      style={{
                        backgroundColor: "transparent",
                        fontSize: "17px",
                        fontWeight: "bold",
                        color:'white',
                        backgroundColor:'rgb(43, 147, 255)'
                      }}
                    >
                      + Add a Soundcloud Track
                    </button>
                  </p>

                  </div>
                </Tab>
                <Tab
                  eventKey={9}
                  title={
                    <p className="hovertile" style={{ marginBottom: "0px" }}>
                      <img
                        className="hoverimage"
                        style={{ width: "30px" }}
                        src={require("../assets/images/Vimeo_Logo.png")}
                      />
                      <p
                        style={{
                          marginBottom: "0px",
                          fontSize: "9px",
                          marginTop: "2px",
                          color: "grey",
                          fontWeight: "bold"
                        }}
                      >
                        VIMEO
                      </p>
                    </p>
                  }
                >
                  <div>
                  <p className="aligncenter marginbottom30 ">
                    <button
                      className="btn btn-sm "
                      onClick={()=>this.addVideo('vimeo')}
                      style={{
                        backgroundColor: "transparent",
                        fontSize: "17px",
                        fontWeight: "bold",
                        color:'white',
                        backgroundColor:'rgb(43, 147, 255)'
                      }}
                    >
                      + Add a Vimeo Video
                    </button>
                  </p>

                  </div>
                </Tab>
                <Tab
                  eventKey={10}
                  title={
                    <p className="hovertile" style={{ marginBottom: "0px" }}>
                      <img
                        className="hoverimage"
                        style={{ width: "30px" }}
                        src={require("../assets/images/youtube_logo.png")}
                      />
                      <p
                        style={{
                          marginBottom: "0px",
                          fontSize: "9px",
                          marginTop: "2px",
                          color: "grey",
                          fontWeight: "bold"
                        }}
                      >
                        YOUTUBE
                      </p>
                    </p>
                  }
                >
                  <div>
                  <p className="aligncenter marginbottom30 ">
                    <button
                      className="btn btn-sm "
                      onClick={()=>this.addVideo('youtube')}
                      style={{
                        backgroundColor: "transparent",
                        fontSize: "17px",
                        fontWeight: "bold",
                        color:'white',
                        backgroundColor:'rgb(43, 147, 255)'
                      }}
                    >
                      + Create a Youtube Video
                    </button>
                  </p>

                  </div>
                </Tab>
              </Tabs>
            </Col>
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      changeObject
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)((App));
// )(Radium(App));
