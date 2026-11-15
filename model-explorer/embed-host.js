/* Same-origin, source-checked resize bridge; it does not read or change model data. */
(function(){
 'use strict';
 const frame=document.getElementById('model-explorer-frame');
 if(!frame)return;
 window.addEventListener('message',function(event){
  if(event.source!==frame.contentWindow)return;
  const expected=location.protocol==='file:'?'null':location.origin;
  if(event.origin!==expected)return;
  const data=event.data;
  if(!data||data.type!=='housing-model-explorer:height'||!Number.isFinite(data.height))return;
  if(data.height<1||data.height>30000)return;
  frame.style.height=Math.max(600,Math.ceil(data.height))+'px';
 });
})();
