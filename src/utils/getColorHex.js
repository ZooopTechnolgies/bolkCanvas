function parseJSON(obj)
{
  try {
    return JSON.parse(obj);
  } catch(ex){
    return null;
  }
}

module.exports=
{
  getColorHex:function(rgb)
  {
    rgb=rgb?JSON.parse(rgb):null;
    if(rgb)
    {
      var r = parseInt(rgb.r,10),
          g = parseInt(rgb.g,10),
          b = parseInt(rgb.b,10),
          a = rgb.a

    if (a || a===0) {
        rgb= "rgba(" + r + ", " + g + ", " + b + ", " + a + ")";
    } else {
        rgb= "rgb(" + r + ", " + g + ", " + b + ")";
    }

      // return (rgb && rgb.a) ? "#" +
      // ("0" + parseInt(rgb.r,10).toString(16)).slice(-2) +
      // ("0" + parseInt(rgb.g,10).toString(16)).slice(-2) +
      // ("0" + parseInt(rgb.b,10).toString(16)).slice(-2) : '';
    }
    else return 'white';

    return rgb;
  }
  ,

  getColorHex1:function(state,name)
  {

    let rgb=state[name];
    let typeofColor=state['defaultActiveKey'+name] || 'solid';
    if(typeofColor=='solid')
    {
      rgb=parseJSON(rgb) || rgb;
      // rgb=rgb?JSON.parse(rgb):null;
      if(rgb)
      {
        var r = parseInt(rgb.r,10),
            g = parseInt(rgb.g,10),
            b = parseInt(rgb.b,10),
            a = rgb.a

      if (a || a===0) {
          rgb="rgba(" + r + ", " + g + ", " + b + ", " + a + ")";
      } else {
          rgb= "rgb(" + r + ", " + g + ", " + b + ")";
      }

      }
      else rgb= 'white';

      return ({'backgroundColor':rgb})
    }
    else if(typeofColor=='linear')
    {
      let rgb1=rgb;
      let rgb2=state[name+'2'];
      let angle=state[name+'AngleSlider'] || 90;

      rgb1=parseJSON(rgb1) || rgb1;
      if(rgb1)
      {
        var r = parseInt(rgb1.r,10),
            g = parseInt(rgb1.g,10),
            b = parseInt(rgb1.b,10),
            a = rgb1.a

      if (a || a===0) {
          rgb1= "rgba(" + r + ", " + g + ", " + b + ", " + a + ")";
      } else {
          rgb1= "rgb(" + r + ", " + g + ", " + b + ")";
      }

      }
      else rgb1= 'white';

      rgb2=parseJSON(rgb2) || rgb2;
      if(rgb2)
      {
        var r = parseInt(rgb2.r,10),
            g = parseInt(rgb2.g,10),
            b = parseInt(rgb2.b,10),
            a = rgb2.a

      if (a || a===0) {
          rgb2= "rgba(" + r + ", " + g + ", " + b + ", " + a + ")";
      } else {
          rgb2= "rgb(" + r + ", " + g + ", " + b + ")";
      }

      }
      else rgb2= 'white';

      let finalString='linear-gradient('+angle+'deg, '+rgb1+', '+rgb2+')';
      return ({background:finalString});
    }
    else if(typeofColor=='radial')
    {
      let rgb1=rgb;
      let rgb2=state[name+'2'];

      rgb1=parseJSON(rgb1) || rgb1;
      if(rgb1)
      {
        var r = parseInt(rgb1.r,10),
            g = parseInt(rgb1.g,10),
            b = parseInt(rgb1.b,10),
            a = rgb1.a

      if (a || a===0) {
          rgb1= "rgba(" + r + ", " + g + ", " + b + ", " + a + ")";
      } else {
          rgb1= "rgb(" + r + ", " + g + ", " + b + ")";
      }

      }
      else rgb1= 'white';

      rgb2=parseJSON(rgb2) || rgb2;
      if(rgb2)
      {
        var r = parseInt(rgb2.r,10),
            g = parseInt(rgb2.g,10),
            b = parseInt(rgb2.b,10),
            a = rgb2.a

      if (a || a===0) {
          rgb2= "rgba(" + r + ", " + g + ", " + b + ", " + a + ")";
      } else {
          rgb2= "rgb(" + r + ", " + g + ", " + b + ")";
      }

      }
      else rgb2= 'white';

      let finalString='radial-gradient('+rgb1+', '+rgb2+')';
      return ({background:finalString});
    }


  },
  getColorHexOrImage:function(state,name)
  {
    if(state['defaultActiveKeybodyBackgroundColor'] && state['defaultActiveKeybodyBackgroundColor']=='bodyBackgroundImage' && state[name+'ImagePreviewUrl'])
    {
      return ({backgroundImage:`url(${state[name+'ImagePreviewUrl']})`,backgroundRepeat:'no-repeat',backgroundSize:'cover'})
    }
    if(state['defaultActiveKeybodyBackgroundColor'] && state['defaultActiveKeybodyBackgroundColor']=='bodyBackgroundImage' && state[name+'Image'])
    {
      return ({backgroundImage:`url(${state[name+'Image']})`,backgroundRepeat:'no-repeat',backgroundSize:'cover'})
    }

    name=name+'Color';
    let rgb=state[name];
    let typeofColor=state['defaultActiveKey'+name] || 'solid';
    if(typeofColor=='solid')
    {
      rgb=parseJSON(rgb) || rgb;
      // rgb=rgb?JSON.parse(rgb):null;
      if(rgb)
      {
        var r = parseInt(rgb.r,10),
            g = parseInt(rgb.g,10),
            b = parseInt(rgb.b,10),
            a = rgb.a

      if (a || a===0) {
          rgb="rgba(" + r + ", " + g + ", " + b + ", " + a + ")";
      } else {
          rgb= "rgb(" + r + ", " + g + ", " + b + ")";
      }

      }
      else rgb= 'white';

      return ({'backgroundColor':rgb})
    }
    else if(typeofColor=='linear')
    {
      let rgb1=rgb;
      let rgb2=state[name+'2'];
      let angle=state[name+'AngleSlider'] || 90;

      rgb1=parseJSON(rgb1) || rgb1;
      if(rgb1)
      {
        var r = parseInt(rgb1.r,10),
            g = parseInt(rgb1.g,10),
            b = parseInt(rgb1.b,10),
            a = rgb1.a

      if (a || a===0) {
          rgb1= "rgba(" + r + ", " + g + ", " + b + ", " + a + ")";
      } else {
          rgb1= "rgb(" + r + ", " + g + ", " + b + ")";
      }

      }
      else rgb1= 'white';

      rgb2=parseJSON(rgb2) || rgb2;
      if(rgb2)
      {
        var r = parseInt(rgb2.r,10),
            g = parseInt(rgb2.g,10),
            b = parseInt(rgb2.b,10),
            a = rgb2.a

      if (a || a===0) {
          rgb2= "rgba(" + r + ", " + g + ", " + b + ", " + a + ")";
      } else {
          rgb2= "rgb(" + r + ", " + g + ", " + b + ")";
      }

      }
      else rgb2= 'white';

      let finalString='linear-gradient('+angle+'deg, '+rgb1+', '+rgb2+')';
      return ({background:finalString});
    }
    else if(typeofColor=='radial')
    {
      let rgb1=rgb;
      let rgb2=state[name+'2'];

      rgb1=parseJSON(rgb1) || rgb1;
      if(rgb1)
      {
        var r = parseInt(rgb1.r,10),
            g = parseInt(rgb1.g,10),
            b = parseInt(rgb1.b,10),
            a = rgb1.a

      if (a || a===0) {
          rgb1= "rgba(" + r + ", " + g + ", " + b + ", " + a + ")";
      } else {
          rgb1= "rgb(" + r + ", " + g + ", " + b + ")";
      }

      }
      else rgb1= 'white';

      rgb2=parseJSON(rgb2) || rgb2;
      if(rgb2)
      {
        var r = parseInt(rgb2.r,10),
            g = parseInt(rgb2.g,10),
            b = parseInt(rgb2.b,10),
            a = rgb2.a

      if (a || a===0) {
          rgb2= "rgba(" + r + ", " + g + ", " + b + ", " + a + ")";
      } else {
          rgb2= "rgb(" + r + ", " + g + ", " + b + ")";
      }

      }
      else rgb2= 'white';

      let finalString='radial-gradient('+rgb1+', '+rgb2+')';
      return ({background:finalString});
    }


  }

}
