(function(){
 'use strict';
 const data=window.HOUSING_DATA;
 if(!data||!Array.isArray(data.models))return;
 const models=data.models, byId=Object.fromEntries(models.map(m=>[m.id,m]));
 const state={model:'hybrid',step:0,scenario:'values',view:'explore',left:'hybrid',right:'municipal',filter:'all'};
 const $=id=>document.getElementById(id);
 const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const arrow='<svg class="ui-arrow" viewBox="0 0 20 20" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 16 16 4M5 4h11v11"/></svg>';
 const link=(url,text)=>'<a href="'+esc(url)+'" target="_blank" rel="noopener noreferrer">'+esc(text)+' '+arrow+'</a>';
 const families={public:'Public ownership',community:'Collective & community ownership',shared:'Ownership with limited personal equity'};
 const stepNames=['Ownership','Decisions','Payments','Moving out','Protection'];
 const scenarios=[['values','Property values rise','trend'],['leaves','Someone moves out','door'],['repairs','Major repairs','tools'],['sale','A sale is proposed','sale']];
 const iconPaths={
  home:'<path d="m3 12 13-10 13 10M6 11v18h20V11M13 29V19h7v10"/>',
  city:'<path d="M5 29V8h22v21M2 29h28M11 8V3h10v5M11 13h2m6 0h2m-10 6h2m6 0h2M13 29v-5h6v5"/>',
  people:'<circle cx="16" cy="8" r="4"/><circle cx="5" cy="13" r="3"/><circle cx="27" cy="13" r="3"/><path d="M9 29V20q0-7 7-7t7 7v9M1 29v-7q0-5 5-5M31 29v-7q0-5-5-5"/>',
  land:'<path d="m2 12 14-8 14 8-14 8ZM2 18l14 8 14-8M2 24l14 7 14-7"/>',
  shield:'<path d="M16 2 29 7v9c0 7-8 12-13 15C11 28 3 23 3 16V7Z"/><path d="m10 16 4 4 8-10"/>',
  network:'<rect x="2" y="3" width="9" height="9"/><rect x="21" y="3" width="9" height="9"/><rect x="11" y="22" width="10" height="9"/><path d="M6 12v5h20v-5M16 17v5"/>',
  key:'<circle cx="10" cy="11" r="7"/><path d="m15 16 14 14m-8-8 4-4m-9-2 4-4"/>',
  coins:'<ellipse cx="16" cy="7" rx="13" ry="5"/><path d="M3 7v8c0 7 26 7 26 0V7M3 15v8c0 7 26 7 26 0v-8"/>',
  ballot:'<path d="M6 19 2 26v5h28v-5l-4-7M2 26h28M8 19h16"/><path d="m9 8 8-6 10 12-8 6ZM15 9l3 1 1-4"/>',
  trend:'<path d="M3 3v27h27M6 23l8-8 6 3 10-14M21 4h9v9"/>',
  door:'<path d="M3 29V3h19v8M3 3l13 4v24L3 29M21 20h10m-5-5 5 5-5 5"/>',
  tools:'<path d="M22 2a9 9 0 0 0-10 12L2 24l6 6 10-10A9 9 0 0 0 30 10l-7 4-5-5Z"/>',
  sale:'<path d="M5 3v28M5 5h24v16H5M11 10h12M11 15h8"/>'
 };
 const modelIcon={municipal:'city',nonprofit:'people',common:'home',use:'key',syndikat:'network',hybrid:'land',clt:'home',limited:'coins',mutual:'coins',feenix:'people'};
 function icon(name){return '<svg viewBox="0 0 32 34" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square" stroke-linejoin="miter">'+(iconPaths[name]||iconPaths.home)+'</svg>';}
 const modelOptions=()=>models.map(m=>'<option value="'+m.id+'">'+esc(m.name)+'</option>').join('');
 $('model-picker').innerHTML=models.map(m=>'<button type="button" class="model-choice" data-model="'+m.id+'" aria-pressed="false" style="--model-color:var(--'+m.color+')">'+icon(modelIcon[m.id])+'<span>'+esc(m.shortName)+'</span></button>').join('');
 $('step-buttons').innerHTML=stepNames.map((s,i)=>'<button type="button" class="step-button" data-step="'+i+'" aria-pressed="false"><span>0'+(i+1)+'</span>'+s+'</button>').join('');
 $('scenario-buttons').innerHTML=scenarios.map(([id,name,ico])=>'<button type="button" class="scenario-button" data-scenario="'+id+'" aria-pressed="false">'+icon(ico)+'<span>'+name+'</span></button>').join('');
 $('compare-a').innerHTML=modelOptions();$('compare-b').innerHTML=modelOptions();$('example-filter').insertAdjacentHTML('beforeend',modelOptions());
 function setView(view,scroll){
  state.view=['explore','compare','examples'].includes(view)?view:'explore';
  ['explore','compare','examples'].forEach(v=>$(v+'-view').hidden=v!==state.view);
  document.querySelectorAll('[data-view]').forEach(a=>{if(a.dataset.view===state.view)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');});
  if(state.view==='compare')renderComparison();if(state.view==='examples')renderExamples();
  if(state.view==='explore')requestAnimationFrame(drawDiagram);
  const params=new URLSearchParams({model:state.model,step:String(state.step+1)});
  history.replaceState(null,'','#'+state.view+'?'+params);
  if(scroll)$('workspace').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'start'});
 }
 function renderModel(){
  const m=byId[state.model];
  document.querySelectorAll('[data-model]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.model===m.id)));
  document.querySelector('.walkthrough').style.setProperty('--model-color','var(--'+m.color+')');
  $('model-family').textContent=families[m.kind]||families.community;
  $('model-title').textContent=m.name;$('model-tagline').textContent=m.tagline;
  const c=m.cases[0];$('case-mark').innerHTML=icon(modelIcon[m.id]);$('case-status').textContent=c.status;$('case-name').textContent=c.name;$('case-place').textContent=c.location;$('case-summary').textContent=c.summary;$('affordability-check').textContent=m.compare.access;
  $('model-sources').innerHTML=m.sources.map(s=>'<li>'+link(s.url,s.title)+'</li>').join('');
  renderStep();renderScenario();
 }
 function renderStep(){
  const m=byId[state.model],s=m.steps[state.step];
  document.querySelectorAll('[data-step]').forEach(b=>b.setAttribute('aria-pressed',String(Number(b.dataset.step)===state.step)));
  $('step-counter').textContent='STEP 0'+(state.step+1)+' / 05';$('step-title').textContent=s.title;$('step-takeaway').textContent=s.takeaway;$('step-body').textContent=s.body;$('step-points').innerHTML=s.points.map(p=>'<li>'+esc(p)+'</li>').join('');
  $('prev-step').disabled=state.step===0;$('next-step').disabled=state.step===4;$('step-position').textContent=(state.step+1)+' of 5';
  $('diagram-qualification').textContent=m.id==='feenix'?(state.step===0?'Intended structure • dashed arrows = not verified as complete':'Principles / evolving Finnish adaptation'):(m.id==='use'?'Diagram uses La Borda’s arrangement':'Simplified structure • arrows are labeled');
  requestAnimationFrame(drawDiagram);
 }
 function renderScenario(){
  const m=byId[state.model],s=m.scenarios[state.scenario];
  document.querySelectorAll('[data-scenario]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.scenario===state.scenario)));
  $('scenario-result').innerHTML='<div class="scenario-main"><p class="eyebrow">'+esc(m.shortName)+' / '+esc(s.title)+'</p><h3>'+esc(s.outcome)+'</h3><p>'+esc(s.body)+'</p></div><div class="scenario-watch"><p class="eyebrow">WHAT TO PAY ATTENTION TO</p><p>'+esc(s.watch)+'</p></div>';
 }
 function graphFor(m,step){
  const node=(label,kind='people')=>({label,kind});const e=(a,b,label,planned=false)=>({a,b,label,planned});
  if(step===0){
   if(['hybrid','clt','use','feenix'].includes(m.id)){
    let first=m.id==='use'?'Municipality':m.id==='feenix'?'Land foundation':'Community land trust';
    let second=m.id==='clt'?'Homeowner':'Resident cooperative';if(m.id==='feenix')second='Hub Feenix cooperative';
    let label=m.id==='use'?'75-year land lease':m.id==='feenix'?'Intended arrangement':'Ground lease';
    return {nodes:[node(first,'land'),node(second,m.id==='clt'?'people':'network'),node('Land','land'),node('Homes','home')],edges:[e(0,1,label,m.id==='feenix'),e(0,2,m.id==='feenix'?'Intended owner':'Owns',m.id==='feenix'),e(1,3,m.id==='feenix'?'Intended owner':'Owns',m.id==='feenix')]};
   }
   if(m.id==='syndikat')return {nodes:[node('Resident association'),node('Mietshäuser Syndikat','network'),node('Property company','network'),node('Land + homes','home')],edges:[e(0,2,'Partner'),e(1,2,'Partner'),e(2,3,'Owns')]};
   const owners={municipal:'Municipality',nonprofit:'Nonprofit association',common:'Housing cooperative',limited:'Housing cooperative',mutual:'Mutual ownership society'};
   return {nodes:[node(owners[m.id]||'Collective owner','network'),node('Land + homes','home'),node('Residents'),node(['municipal','nonprofit'].includes(m.id)?'Tenancy rights':'Membership + occupancy','key')],edges:[e(0,1,'Owns'),e(2,3,'Holds'),e(3,1,'Right to live')]};
  }
  if(step===1){
   if(m.id==='syndikat')return {nodes:[node('Resident association'),node('Mietshäuser Syndikat','network'),node('Daily decisions','ballot'),node('Sale / conversion','sale')],edges:[e(0,2,'Decides'),e(0,3,'Must agree'),e(1,3,'Can veto')]};
   if(m.id==='feenix')return {nodes:[node('Residents'),node('Core team','people'),node('Shared input','ballot'),node('Operations','tools')],edges:[e(0,2,'Participate'),e(2,1,'Informs'),e(1,3,'Handles')]};
   if(m.id==='clt')return {nodes:[node('Homeowner'),node('CLT membership','people'),node('Daily home use','home'),node('CLT board','ballot')],edges:[e(0,2,'Controls'),e(0,1,'Resident voice'),e(1,3,'Elects')]};
   if(m.id==='municipal')return {nodes:[node('Residents'),node('City / public provider','city'),node('Tenant participation','people'),node('Policy + management','ballot')],edges:[e(0,2,'Participate'),e(2,1,'Input'),e(1,3,'Authority')]};
   const first=m.id==='hybrid'?'Land trust stewardship':'Resident members';
   return {nodes:[node(first,m.id==='hybrid'?'land':'people'),node('Resident-led governance','ballot'),node(m.id==='hybrid'?'Co-op members':'Budgets + rules','ballot'),node('Housing management','tools')],edges:m.id==='hybrid'?[e(0,1,'Stewards'),e(2,1,'Elect'),e(1,3,'Oversees')]:[e(0,1,'Govern'),e(1,2,'Decides'),e(1,3,'Oversees')]};
  }
  if(step===2){
   if(m.id==='clt')return {nodes:[node('Homeowner'),node('Household housing budget','coins'),node('Mortgage lender','coins'),node('Upkeep + other charges','tools')],edges:[e(0,1,'Funds'),e(1,2,'Repays'),e(1,3,'Pays')]};
   if(m.id==='feenix')return {nodes:[node('Residents / contributors'),node('Collective finance','coins'),node('Housing costs + reserves','tools'),node('Contribution repayments','coins')],edges:[e(0,1,'Contributions / charges'),e(1,2,'Funds'),e(1,3,'Under agreements')]};
   const recipient=m.id==='municipal'?'Public housing budget':m.id==='nonprofit'?'Association budget':m.id==='syndikat'?'Property company budget':'Cooperative budget';
   return {nodes:[node('Resident households'),node(recipient,'coins'),node(m.id==='mutual'?'Debt + equity units':'Operations + financing','tools'),node(m.id==='syndikat'?'Reserves + solidarity':'Maintenance reserves','shield')],edges:[e(0,1,m.id==='mutual'?'Income-linked charges':'Monthly payments'),e(1,2,'Pays'),e(1,3,'Funds')]};
  }
  if(step===3){
   const exit=m.id==='clt'?'Restricted home resale':m.id==='mutual'?'Eligible equity withdrawal':m.id==='feenix'?'Contribution agreement':['hybrid','limited'].includes(m.id)?'Limited-equity transfer':m.id==='use'?'Cooperative exit rules':'Tenancy / exit rules';
   const retained=m.id==='clt'?'Community-held land':'Collectively held homes';
   return {nodes:[node('Departing resident'),node(exit,'key'),node(retained,m.id==='clt'?'land':'home'),node('Incoming resident')],edges:[e(0,1,'Leaves under'),e(1,3,'New occupancy'),e(2,3,'Remains available')]};
  }
  const safeguard={municipal:'Public retention policy',nonprofit:'Nonprofit regulation',common:'Common-ownership rules',use:'Collective ownership',syndikat:'Syndikat sale veto',hybrid:'CLT ground lease',clt:'Ground lease + resale cap',limited:'Resale restrictions',mutual:'Collective title + rules',feenix:'Non-speculation aim'};
  return {nodes:[node(safeguard[m.id],'shield'),node('Long-term funding','coins'),node('Housing for future use','home'),node('Future residents')],edges:[e(0,2,m.id==='feenix'?'Needs legal implementation':'Protects',m.id==='feenix'),e(1,2,'Maintains'),e(2,3,'Serves')]};
 }
 const svgNS='http://www.w3.org/2000/svg';
 function se(tag,attrs,parent){const el=document.createElementNS(svgNS,tag);Object.entries(attrs||{}).forEach(([k,v])=>el.setAttribute(k,String(v)));if(parent)parent.appendChild(el);return el;}
 function wrap(text,maxWidth,ctx){const lines=[];let line='';text.split(' ').forEach(word=>{const trial=line?line+' '+word:word;if(line&&ctx.measureText(trial).width>maxWidth){lines.push(line);line=word;}else line=trial;});if(line)lines.push(line);return lines;}
 function textSvg(parent,text,x,y,width,font,weight){const ctx=document.createElement('canvas').getContext('2d');ctx.font=weight+' '+font+'px "Atkinson Hyperlegible Next", Arial';const lines=wrap(text,width,ctx);const t=se('text',{x,y,fill:'#222A2A','font-family':'Atkinson Hyperlegible Next,Arial,sans-serif','font-size':font,'font-weight':weight,'text-anchor':'middle','dominant-baseline':'middle'},parent);lines.forEach((line,i)=>{se('tspan',{x,y:y+(i-(lines.length-1)/2)*(font+4)},t).textContent=line;});return t;}
 function edgeBoundary(a,b,extra){const dx=b.cx-a.cx,dy=b.cy-a.cy;const t=Math.min((a.w/2+extra)/Math.max(Math.abs(dx),.001),(a.h/2+extra)/Math.max(Math.abs(dy),.001));return {x:a.cx+dx*t,y:a.cy+dy*t};}
 function drawDiagram(){
  if(state.view!=='explore'||!$('diagram').clientWidth)return;
  const m=byId[state.model],graph=graphFor(m,state.step),host=$('diagram');const width=Math.max(220,Math.round(host.clientWidth));const narrow=width<420;const height=narrow?420:315;
  const gap=narrow?58:110;const boxWidth=Math.min(narrow?140:226,(width-gap-24)/2);const boxHeight=narrow?103:100;const pad=12;const positions=[[pad,narrow?60:20],[width-boxWidth-pad,narrow?60:20],[pad,height-boxHeight-20],[width-boxWidth-pad,height-boxHeight-20]];const boxes=positions.map(([x,y])=>({x,y,w:boxWidth,h:boxHeight,cx:x+boxWidth/2,cy:y+boxHeight/2}));
  const svg=se('svg',{viewBox:'0 0 '+width+' '+height,height,role:'img','aria-labelledby':'structure-title structure-desc'});host.replaceChildren(svg);
  se('title',{id:'structure-title'},svg).textContent=m.name+': '+m.steps[state.step].title;
  se('desc',{id:'structure-desc'},svg).textContent=graph.edges.map(e=>graph.nodes[e.a].label+' '+e.label.toLowerCase()+' '+graph.nodes[e.b].label+'.').join(' ');
  const defs=se('defs',{},svg);const marker=se('marker',{id:'structure-arrow',viewBox:'0 0 10 10',refX:9,refY:5,markerWidth:7,markerHeight:7,orient:'auto-start-reverse'},defs);se('path',{d:'M0 0 10 5 0 10Z',fill:'#222A2A'},marker);
  const edges=se('g',{},svg),nodes=se('g',{},svg),labels=se('g',{},svg);
  graph.edges.forEach(edge=>{const from=boxes[edge.a],to=boxes[edge.b],a=edgeBoundary(from,to,3),b=edgeBoundary(to,from,6);const horizontal=Math.abs(a.y-b.y)<1;let path='M'+a.x+' '+a.y+' L'+b.x+' '+b.y;let x=(a.x+b.x)/2,y=(a.y+b.y)/2;let available=horizontal?Math.max(47,Math.abs(a.x-b.x)-4):(narrow?75:120);if(horizontal)y-=17;
   if(narrow&&horizontal){const routeY=from.y-20;path='M'+from.cx+' '+(from.y-3)+' V'+routeY+' H'+to.cx+' V'+(to.y-6);x=(from.cx+to.cx)/2;y=routeY-21;available=Math.min(width-30,145);}
   const attrs={d:path,fill:'none',stroke:'#222A2A','stroke-width':1.8,'marker-end':'url(#structure-arrow)'};if(edge.planned)attrs['stroke-dasharray']='5 4';se('path',attrs,edges);
   const group=se('g',{},labels);const text=textSvg(group,edge.label,x,y,available,narrow?11:12,700);const bounds=text.getBBox();const back=se('rect',{x:bounds.x-3,y:bounds.y-2,width:bounds.width+6,height:bounds.height+4,fill:'#F0ECDF'});group.insertBefore(back,text);
  });
  const palette={yellow:'#D4E94A',mint:'#CBD370',pink:'#FF5C30',lavender:'#6CB6BB',blue:'#93B9C4'};
  boxes.forEach((box,i)=>{se('rect',{x:box.x+3,y:box.y+3,width:box.w,height:box.h,fill:'#222A2A'},nodes);se('rect',{x:box.x,y:box.y,width:box.w,height:box.h,fill:i<2?palette[m.color]:'#F0ECDF',stroke:'#222A2A','stroke-width':2},nodes);const ico=se('g',{transform:'translate('+(box.cx-13)+' '+(box.y+11)+') scale(.76)',fill:'none',stroke:'#222A2A','stroke-width':2},nodes);ico.innerHTML=iconPaths[graph.nodes[i].kind]||iconPaths.home;textSvg(nodes,graph.nodes[i].label,box.cx,box.y+box.h*.68,box.w-13,narrow?11:13,700);});
 }
 function renderComparison(){
  $('compare-a').value=state.left;$('compare-b').value=state.right;const a=byId[state.left],b=byId[state.right];
  const rows=[['land','Who owns the land?'],['homes','Who owns the homes?'],['voice','Who has a say?'],['payments','What do residents pay?'],['exit','What happens on exit?'],['protection','What protects affordability?'],['access','What can limit access?']];
  let html='<table class="comparison-table" style="--left-color:var(--'+a.color+');--right-color:var(--'+b.color+')"><caption class="sr-only">Housing model comparison</caption><thead><tr><th scope="col">The same questions</th>';
  [a,b].forEach(m=>{html+='<th scope="col"><p class="eyebrow">'+esc(families[m.kind])+'</p><h3>'+esc(m.name)+'</h3><p class="location">'+esc(m.example||m.cases[0].name)+'</p><button type="button" class="text-button" data-explore="'+m.id+'">Explore this model '+arrow+'</button></th>';});html+='</tr></thead><tbody>';
  rows.forEach(([key,title])=>{html+='<tr><th scope="row">'+title+'</th><td data-model="'+esc(a.shortName)+'">'+esc(a.compare[key])+'</td><td data-model="'+esc(b.shortName)+'">'+esc(b.compare[key])+'</td></tr>';});html+='</tbody></table>';$('comparison').innerHTML=html;
 }
 function renderExamples(){
  $('example-filter').value=state.filter;const visible=state.filter==='all'?models:[byId[state.filter]];
  $('examples-grid').innerHTML=visible.flatMap(m=>m.cases.map(c=>'<article class="example-card" style="--card-color:var(--'+m.color+')"><div class="example-card-top">'+icon(modelIcon[m.id])+'<span class="status">'+esc(c.status)+'</span></div><div class="example-card-body"><h3>'+esc(c.name)+'</h3><p class="location">'+esc(c.location)+'</p><p class="summary">'+esc(c.summary)+'</p><p class="limit"><strong>Keep in view</strong>'+esc(c.limitation)+'</p><div class="example-card-links"><button type="button" class="text-button" data-explore="'+m.id+'">Explore the model '+arrow+'</button>'+link(c.url,'Source')+'</div></div></article>')).join('');
  $('context-grid').innerHTML=data.contexts.map(c=>'<article class="context-card"><span class="status">'+esc(c.status)+'</span><h3>'+esc(c.title)+'</h3><p class="location">'+esc(c.place)+'</p><p>'+esc(c.body)+'</p><p class="lesson">'+esc(c.lesson)+'</p>'+link(c.url,'Read the source')+'</article>').join('');
 }
 function selectModel(id,reset){if(!byId[id])return;state.model=id;if(reset){state.step=0;state.scenario='values';}renderModel();setView('explore',false);$('announcer').textContent=byId[id].name+' selected.';}
 document.addEventListener('click',function(event){
  const button=event.target.closest('button');const nav=event.target.closest('a[data-view]');const brand=event.target.closest('.brand');
  if(nav||brand){event.preventDefault();setView(nav?nav.dataset.view:'explore',true);return;}
  if(!button)return;
  if(button.dataset.model){selectModel(button.dataset.model,true);return;}
  if(button.dataset.step!==undefined){state.step=Number(button.dataset.step);renderStep();setView('explore',false);return;}
  if(button.dataset.scenario){state.scenario=button.dataset.scenario;renderScenario();return;}
  if(button.dataset.explore){selectModel(button.dataset.explore,true);$('workspace').scrollIntoView({behavior:'smooth'});return;}
 });
 $('prev-step').addEventListener('click',()=>{if(state.step>0){state.step--;renderStep();setView('explore',false);}});
 $('next-step').addEventListener('click',()=>{if(state.step<4){state.step++;renderStep();setView('explore',false);}});
 $('compare-current').addEventListener('click',()=>{state.left=state.model;if(state.right===state.left)state.right=state.left==='municipal'?'hybrid':'municipal';setView('compare',true);});
 $('view-case').addEventListener('click',()=>{state.filter=state.model;setView('examples',true);});
 $('compare-a').addEventListener('change',e=>{state.left=e.target.value;renderComparison();});$('compare-b').addEventListener('change',e=>{state.right=e.target.value;renderComparison();});
 $('swap-models').addEventListener('click',()=>{[state.left,state.right]=[state.right,state.left];renderComparison();});$('example-filter').addEventListener('change',e=>{state.filter=e.target.value;renderExamples();});
 function readHash(){const raw=location.hash.slice(1);const [view,search]=raw.split('?');const params=new URLSearchParams(search||'');if(byId[params.get('model')])state.model=params.get('model');const s=Number(params.get('step'));if(Number.isInteger(s)&&s>=1&&s<=5)state.step=s-1;return ['explore','compare','examples'].includes(view)?view:'explore';}
 const initialView=readHash();renderModel();renderExamples();renderComparison();setView(initialView,false);
 window.addEventListener('hashchange',()=>{if(location.hash==='#workspace')return;const view=readHash();renderModel();setView(view,true);});
 if(document.fonts)document.fonts.ready.then(drawDiagram);
 new ResizeObserver(()=>requestAnimationFrame(drawDiagram)).observe($('diagram'));
})();
