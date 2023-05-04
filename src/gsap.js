import React from 'react';
import { Tween, Timeline } from 'react-gsap';


const TweenComponent = () => (
  <Tween from={{ x: '-700px' }} to={{ x: '300px'}}>
    <div  >Helping you with your holiday shopping</div>
  </Tween>
);

const TimelineComponent = () => (
  <Timeline
    target={
      <div style={{'z-index':'10'}} ></div>
    }
  >
    <Tween from={{ opacity: 0 }} to={{ opacity: 1 }} />
    <Tween to={{ x: '550px' }} />

          <Tween to={{ scale: 10, rotation: -360 }} duration={1.5} position="+=4" />
          <Tween to={{ opacity: 0 }} />
          <Tween from={{opacity:0 }} to={{opacity: 1}} duration={2} >
            <div id='secondtitle' style={{'position':'absolute','top':'65%'}}><h2>Come Inside for a look at some great stocking stuffers</h2></div>
          </Tween>
	  <Tween from={{opacity:0}} to={{opacity:1}}><img src={} alt /></Tween>

  </Timeline>
);



export default TimelineComponent
