import React, { Component } from "react";
import ReactPlayer from "react-player";

export class VideoPlayer extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return <ReactPlayer width="100%" height="100%" style={{padding:'10px'}} url={this.props.videoUrl} />;
  }
}

export class Rectangle extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          ...this.props.style
        }}
      />
    );
  }
}

export class Circle extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          borderRadius: "50%",
          ...this.props.style
        }}
      />
    );
  }
}

export class Triangle extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <svg
        reserveAspectRatio="none"
        style={{ width: "100%", height: "100%" }}
        viewBox="0 0 100 100"
      >
        <polygon
          id="e1_polygon"
          style={{ ...this.props.style }}
          points="0 0, 0 100, 100 0"
          fill="lightgrey"
        />
      </svg>
    );
  }
}

export class Star extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <svg
        reserveAspectRatio="none"
        style={{ width: "100%", height: "100%" }}
        viewBox="0 0 100 100"
      >
        <path
          style={{ ...this.props.style }}
          d="M49 73.5L22.55 87.406l5.05-29.453-21.398-20.86 29.573-4.296L49 6l13.225 26.797 29.573 4.297-21.4 20.86 5.052 29.452z"
          fill="transparent"
          fill-rule="evenodd"
        />
      </svg>
    );
  }
}


export class HalfArc extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <svg
        reserveAspectRatio="none"
        style={{ width: "100%", height: "100%" }}
        viewBox="0 0 100 20"
      >
      <path
      style={{ ...this.props.style }}
      d="M0 0 C 0 0, 50 20, 100 0"
      stroke="grey" fill="transparent"
      />
      </svg>
    );
  }
}

export class TextThreeTemplate extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          // background:'black',
          ...this.props.style
        }}
      >
        <TextComponent {...this.props.object1} />
        <TextComponent {...this.props.object2} />
        <TextComponent {...this.props.object3} />
      </div>
    );
  }
}

export class TextTwoTemplate extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          // background:'black',
          ...this.props.style
        }}
      >
        <TextComponent {...this.props.object1} />
        <TextComponent {...this.props.object2} />
      </div>
    );
  }
}

export class TextSideTemplate extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          // background:'black',
          ...this.props.style
        }}
      >
        <TextComponent
          style={{ width: "50%", display: "inline-block" }}
          {...this.props.object1}
        />
        <TextComponent
          style={{ width: "50%", display: "inline-block" }}
          {...this.props.object2}
        />
      </div>
    );
  }
}

export class Svg extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <svg
        preserveAspectRatio="none"
        viewBox="0 0 100 100"
        style={{ width: "100%", height: "100%" }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <polygon points="50,20 100,100 100,100" />
        {/*<path d="M10 10 C 20 20, 40 20, 100 10" stroke="black" fill="transparent"/>*/}
        {/*<polygon points="0,0 0,100 100,20 30,0" />*/}
      </svg>
    );
  }
}

export class ImageComponent extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <img
        draggable="false"
        style={{height:'100%', width: "100%", ...this.props.style }}
        src={this.props.src}
      />
    );
  }
}
export class TextComponent extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div
        contentEditable={true}
        onFocus={e => this.props.onFocus && this.props.onFocus(this.props.id,this.props.e)}
        id={this.props.id}
        style={{
          border: "1px solid transparent",
          whiteSpace: "pre-wrap",
          background: "transparent",
          color: "grey",
          overflow: "hidden",
          ...this.props.style
        }}
      >
        {this.props.text}
      </div>
    );
  }
}
export class Meme extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          ...this.props.style
        }}
      >
        <TextComponent
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            minHeight: "100px",
            zIndex: 10
          }}
          {...this.props.object2}
        />
        <ImageComponent
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            zIndex: 1
          }}
          {...this.props.object1}
        />
        <TextComponent
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            width: "100%",
            minHeight: "100px",
            zIndex: 10
          }}
          {...this.props.object3}
        />
      </div>
    );
  }
}
