/* Shared logic for Your Pool v2 variants (sandbox mockups). Uses window.POOL_REAL (Amanda's real prefs x public data).
   City switch (D.city) is optional: variants that ignore it get the home city. No ZIP/address stored or shown. */
(function(){
const D=window.POOL_REAL, S=Object.assign({city:'austin',tier:'any'},D.sel);
const sig=n=>{n=Math.round(n); if(n<1000) return Math.round(n/10)*10||n; const p=Math.pow(10,Math.floor(Math.log10(n))-2); return Math.round(n/p)*p};
const fmt=n=>sig(n).toLocaleString('en-US');
const SRC={acs:'ACS',nhanes:'NHANES',pew:'PEW EST',nsfg:'NSFG EST',ipeds:'IPEDS EST',none:''};
const optL=(k,id)=>D[k].opts.find(o=>o[0]===id)[1];
const SHORT={intent:{rel:'Relationship',looking:'Any dating',single:'Any'},kids:{yes:'Yes',any:'Any'}};
const ROWS=[
 {rk:'01',k:'intent',name:'Intentions',src:'pew',label:()=>'Intent: '+SHORT.intent[S.intent]},
 {rk:'02',k:'kids',name:'Want kids',src:'nsfg',label:()=>'Want kids: '+SHORT.kids[S.kids]},
 {rk:'03',fixed:'start',src:'acs',label:()=>'Distance: 30 mi'},
 {rk:'04',fixed:'start',src:'acs',label:()=>'Age: 31–54'},
 {rk:'05',k:'height',name:'Height',src:'nhanes',label:()=>'Height: '+optL('height',S.height)},
 {rk:'06',k:'edu',name:'Degree',src:'acs',label:()=>'Degree: '+optL('edu',S.edu)},
 {rk:'07',k:'inc',name:'Income',src:'acs',label:()=>'Income: '+optL('inc',S.inc)},
 // "Any" preferences sort to the end of the ranking
 {rk:'08',fixed:'nocut',src:'none',label:()=>'Ethnicity: Any'},
 {rk:'09',fixed:'nocut',src:'none',label:()=>'Have kids: Any'},
 {rk:'10',fixed:'nocut',src:'none',label:()=>'Religion: Any'},
 {rk:'11',k:'tier',name:'School tier',src:'ipeds',get fixed(){return S.tier==='any'?'nocut':undefined},label:()=>'School tier: '+(S.tier==='any'?'Any':optL('tier',S.tier))},
];
const NOTES={intent:'Pew W56 (2019): unmarried U.S. men, not in a relationship, who want this',
 kids:'CDC NSFG 2022–23: unmarried U.S. men who want a(nother) child',
 height:'CDC NHANES 2021–23 measured heights: U.S. men at or above this, by age',
 edu:'Census ACS 2020–24 PUMS: single men in this city area, by age',
 inc:'Census ACS 2020–24 PUMS: personal income, among single men in this area who pass Degree',
 city:'Census ACS 2020–24 (B12002): single men 31–54 within 30 mi of each city. All my cities counts overlapping areas once (New York and Brooklyn overlap almost fully)',
 tier:'ESTIMATE. Share of U.S. men’s bachelor’s degrees from colleges at each admit rate: NCES IPEDS completions 2008–09 and 2015–16 × admissions (IC2009, ADM2016), averaged. Applied to men who pass Degree; national, same for every age and city; assumes tier is independent of income'};
const city=()=>(D.city&&D.city.by[S.city])||{start:D.start,edu:D.edu.rate,inc:D.inc.rate};
function rate(k,b){
  if(k==='tier'){ if(S.tier==='any') return 1; const sh=D.tier.share[S.tier]; return S.edu==='any'?city().edu[b].ba*sh:sh; }
  if(k==='edu') return city().edu[b][S.edu];
  if(k==='inc') return city().inc[b][S.edu][S.inc];
  return D[k].rate[b][S[k]];}
function compute(){
  const cur={}, st=city().start; D.bands.forEach(b=>cur[b]=st[b]);
  const sum=()=>Object.values(cur).reduce((a,c)=>a+c,0);
  const start=sum(), steps=[];
  ROWS.forEach(r=>{const before=sum(); if(r.k) D.bands.forEach(b=>cur[b]*=rate(r.k,b)); const n=sum(); steps.push({r,n,before,keep:n/before});});
  return {start,steps,final:steps.at(-1).n};
}
function width(n,start,min){min=min||24; const lo=40; const f=Math.max(0,Math.min(1,Math.log(n/lo)/Math.log(start/lo))); return min+(100-min)*f;}
const EXTRA={city:{k:'city',name:'City',src:'acs'}};
const cityLabel=(id,l)=>{const c=D.city.by[id]; return `${l}${c.home?' · home':''}<small class="pe-sm">${fmt(Object.values(c.start).reduce((a,x)=>a+x,0))} single men 31–54 in range</small>`};
const tierLabel=(id,l)=>id==='any'?l:`${l}<small class="pe-sm">${+(D.tier.share[id]*100).toFixed(1)}% of U.S. men’s bachelor’s degrees</small>`;
function options(k){return D[k].opts.map(([id,l])=>{if(k==='city') l=cityLabel(id,l); if(k==='tier') l=tierLabel(id,l);const prev=S[k]; S[k]=id; const n=compute().final; S[k]=prev; return {id,label:l,n,on:S[k]===id};});}
const SOURCES='<b>YOUR REAL PREFERENCES</b> from your Oct 7, 2026 signup, in your What Matters Most order. Counts are our estimates, not a live dating pool. '+
 '<b>Start (city):</b> Census ACS 2020–24 5-yr (B12002), single men (never married, divorced or widowed) 31–54 in Census tracts within 30 mi of the city you pick; All my cities counts overlapping tracts once. '+
 '<b>Degree + income:</b> ACS 2020–24 PUMS, single men in the same area, counted together. '+
 '<b>School tier (estimate):</b> NCES IPEDS men’s bachelor’s completions 2008–09 + 2015–16 by college admit rate (&lt;50%: 21%, &lt;25%: 4.6%, &lt;15%: 1.6% of degrees). '+
 '<b>Height:</b> CDC NHANES Aug 2021–Aug 2023 measured heights, U.S. men by age. '+
 '<b>Intent:</b> Pew Research Center ATP Wave 56 (Oct 2019), unmarried U.S. men 30–64, n=843. '+
 '<b>Wants kids:</b> CDC NSFG 2022–23, unmarried U.S. men 30–49, n=1,111 (50–54 uses the 45–49 rate). '+
 'National survey rates are applied to your area and assumed independent. Tap EDIT to try other cutoffs.';
function openEdit(k,onChange){
  const r=ROWS.find(x=>x.k===k)||EXTRA[k]; close();
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
window.PoolEngine={D,S,ROWS,SRC,NOTES,SOURCES,compute,width,options,openEdit,close,fmt,city};
})();
