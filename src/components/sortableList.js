import React from "react";
import { SortableContainer, SortableElement } from "react-sortable-hoc";

import {
  VideoPlayer,
  TextComponent,
  ImageComponent,
  Rectangle,
  Circle,
  Triangle,
  Star,
  TextTwoTemplate,
  TextSideTemplate,
  TextThreeTemplate,
  HalfArc,
  Meme
} from "./ObjectComponents";

const style = {
  position: 'absolute',
      'user-select': 'auto',
      'touch-action': 'none',
      width: '30px',
      height: '30px',
      display: 'inline-block',
      top: '0px',
      left: '0px',
      'max-width': '9.0072e+15px',
      'max-height': '9.0072e+15px',
      'box-sizing': 'border-box',
      padding:'0px',
      transform:'translate(0px, 0px)'
};

function SetObjectElement(object)
{
  switch (object.type) {
    case "video":
      return <VideoPlayer {...object} />;
    case "img":
      return <ImageComponent {...object} />;
    case "rect":
      return <Rectangle {...object} />;
    case "text":
      return <TextComponent {...object} />;
    case "circle":
      return <Circle {...object} />;
    case "triangle":
      return <Triangle {...object} />;
    case "star":
      return <Star {...object} />;
    case "textThreeTemplate":
        return <TextThreeTemplate {...object} />;
    case "textSideTemplate":
        return <TextSideTemplate {...object} />;
    case "textTwoTemplate":
        return <TextTwoTemplate {...object} />;
    case "halfArc":
          return <HalfArc {...object} />;
    case "meme":
        return <Meme {...object} />;
    default:
      return <Rectangle {...object} />;
  }
}


export const SortableItem = SortableElement((props) => (
  <div>
    {!props.item.isDeleted && (
      <div onClick={()=>{props.onItemClick(props.index)}} style={{ padding: "2px",paddingLeft:'10px',backgroundColor:props.isSelected?'#f2f2f2':'' }}>
      <div style={{width:'15px',display:'inline-block'}}>
            {SetObjectElement(props.item)}
      </div>
        <span style={{padding:'2px',paddingLeft:'10px',borderBottom:'1px solid rgb(250,250,250)',marginBottom:'0px',
      fontSize:'11px',textTransform:'capitalize',color:'grey',fontWeight:'bold'}}>{props.item.type}</span>


      </div>
    )}
  </div>
));

export const SortableList = SortableContainer(({ items, activeObjectIndex,onItemClick }) => {
  return (
    <div>
      {items.map((value, index) => (
        <SortableItem key={index} isSelected={activeObjectIndex==index} onItemClick index={index} item={value} />
      ))}
    </div>
  );
});
