/* Shared logic for Your Pool v2 variants (sandbox mockups). Uses window.POOL_REAL (Amanda's real prefs x public data).
   No location is stored or shown. */
(function(){
const D=window.POOL_REAL, S=Object.assign({},D.sel);
const sig=n=>{n=Math.round(n); if(n<1000) return Math.round(n/10)*10||n; const p=Math.pow(10,Math.floor(Math.log10(n))-2); return Math.round(n/p)*p};
const fmt=n=>sig(n).toLocaleString('en-US');
const SRC={acs:'ACS',nhanes:'NHANES',pew:'PEW EST',nsfg:'NSFG EST',none:''};
const optL=(k,id)=>D[k].opts.find(o=>o[0]===id)[1];
const SHORT={intent:{rel:'Relationship',looking:'Any dating',single:'Any'},kids:{yes:'Yes',any:'Any'}};
const ROWS=[
 {rk:'01',k:'intent',name:'Intentions',src:'pew',label:()=>'Intent: '+SHORT.intent[S.intent]},
 {rk:'02',k:'kids',name:'Want kids',src:'nsfg',label:()=>'Want kids: '+SHORT.kids[S.kids]},
 {rk:'03',fixed:'start',src:'acs',label:()=>'Distance: 30 mi'},
 {rk:'04',fixed:'start',src:'acs',label:()=>'Age: 31–54'},
 {rk:'05',k:'height',name:'Height',src:'nhanes',label:()=>'Height: '+optL('height',S.height)},
 {rk:'06',k:'edu',name:'Education',src:'acs',label:()=>'Education: '+optL('edu',S.edu)},
 {rk:'07',fixed:'nocut',src:'none',label:()=>'Ethnicity: Any'},
 {rk:'08',k:'inc',name:'Income',src:'acs',label:()=>'Income: '+optL('inc',S.inc)},
 {rk:'09',fixed:'nocut',src:'none',label:()=>'Have kids: Any'},
 {rk:'10',fixed:'nocut',src:'none',label:()=>'Religion: Any'},
];
const NOTES={intent:'Pew W56 (2019): unmarried U.S. men, not in a relationship, who want this',
 kids:'CDC NSFG 2022–23: unmarried U.S. men who want a(nother) child',
 height:'CDC NHANES 2021–23 measured heights: U.S. men at or above this, by age',
 edu:'Census ACS 2020–24 PUMS: single men in your area, by age',
 inc:'Census ACS 2020–24 PUMS: personal income, among men who pass Education'};
function rate(k,b){const r=D[k].rate[b]; return k==='inc'?r[S.edu][S.inc]:r[S[k]];}
function compute(){
  const cur={}; D.bands.forEach(b=>cur[b]=D.start[b]);
  const sum=()=>Object.values(cur).reduce((a,c)=>a+c,0);
  const start=sum(), steps=[];
  ROWS.forEach(r=>{const before=sum(); if(r.k) D.bands.forEach(b=>cur[b]*=rate(r.k,b)); const n=sum(); steps.push({r,n,before,keep:n/before});});
  return {start,steps,final:steps.at(-1).n};
}
function width(n,start,min){min=min||24; const lo=40; const f=Math.max(0,Math.min(1,Math.log(n/lo)/Math.log(start/lo))); return min+(100-min)*f;}
function options(k){return D[k].opts.map(([id,l])=>{const prev=S[k]; S[k]=id; const n=compute().final; S[k]=prev; return {id,label:l,n,on:S[k]===id};});}
const SOURCES='<b>YOUR REAL PREFERENCES</b> from your Oct 7, 2026 signup, in your What Matters Most order. Counts are our estimates, not a live dating pool. '+
 '<b>Start:</b> Census ACS 2020–24 5-yr (B12002), single men (never married, divorced or widowed) 31–54 in Census tracts within 30 mi of you. '+
 '<b>Education + income:</b> ACS 2020–24 PUMS, single men in the same area, counted together. '+
 '<b>Height:</b> CDC NHANES Aug 2021–Aug 2023 measured heights, U.S. men by age. '+
 '<b>Intent:</b> Pew Research Center ATP Wave 56 (Oct 2019), unmarried U.S. men 30–64, n=843. '+
 '<b>Wants kids:</b> CDC NSFG 2022–23, unmarried U.S. men 30–49, n=1,111 (50–54 uses the 45–49 rate). '+
 'National survey rates are applied to your area and assumed independent. Tap EDIT to try other cutoffs.';
function openEdit(k,onChange){
  const r=ROWS.find(x=>x.k===k); close();
  const wrap=document.createElement('div'); wrap.className='pe-sheet'; wrap.id='pe-sheet';
  const draw=()=>{const ops=options(k);
    wrap.innerHTML=`<div class="pe-back"></div><div class="pe-panel" role="dialog" aria-label="Edit ${r.name}">
      <div class="pe-top"><span class="pe-k">Edit ${r.name} <span class="pe-badge src-${r.src}">${SRC[r.src]}</span></span><button type="button" class="pe-x">DONE</button></div>
      <div class="pe-opts">${ops.map(o=>`<button type="button" class="pe-opt${o.on?' on':''}" data-id="${o.id}"><span>${o.label}</span><b>≈ ${fmt(o.n)}</b></button>`).join('')}</div>
      <p class="pe-note">${NOTES[k]}. Each number is your final pool with that option.</p>
      <button type="button" class="pe-done">Done — update pool</button></div>`;
    wrap.querySelectorAll('.pe-opt').forEach(b=>b.onclick=()=>{S[k]=b.dataset.id; draw(); onChange&&onChange(k);});
    wrap.querySelector('.pe-x').onclick=wrap.querySelector('.pe-done').onclick=wrap.querySelector('.pe-back').onclick=close;
  };
  draw(); document.body.appendChild(wrap); requestAnimationFrame(()=>wrap.classList.add('show'));
}
function close(){const w=document.getElementById('pe-sheet'); if(w) w.remove();}
window.PoolEngine={D,S,ROWS,SRC,NOTES,SOURCES,compute,width,options,openEdit,close,fmt};
})();
