/* Report the content height only to the page embedding this local module. */
(function(){
 'use strict';
 if(window.parent===window)return;
 let frame=0,last=0;
 const origin=location.protocol==='file:'?'*':location.origin;
 function report(){
  frame=0;
  const height=Math.ceil(document.body.getBoundingClientRect().height)+4;
  if(height>0&&height!==last){last=height;parent.postMessage({type:'housing-model-explorer:height',height},origin);}
 }
 function schedule(){if(!frame)frame=requestAnimationFrame(report);}
 new ResizeObserver(schedule).observe(document.body);
 window.addEventListener('load',schedule);
 window.addEventListener('resize',schedule);
 if(document.fonts)document.fonts.ready.then(schedule);
 schedule();
})();
