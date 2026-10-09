/* Shared logic for Your Pool variants (sandbox mockups), v4. Uses window.POOL_REAL.
   Every step and EDIT option mirrors an IHereByCommit onboarding question + its answer choices; the % behind each is a study estimate (see NOTES / Sources).
   City (with distance) is the first band, Age the second; both editable. No ZIP/address stored or shown.
   MEMBER RATES HOOK: once real IHereByCommit signups reach D.members.threshold (1,000), every step also shows the members' own rate next to the study rate.
     PoolEngine.setMembers({count, rates}) where rates = {man:{<step key>:{<age group or 'all'>:{<option id>:share}}}}
       step keys: intent, kids, haskids, height ({cdf:[share >= 58in .. >= 85in]}), edu (share at or above), inc (share at or above), eth, relig, pol, tier.
       age groups: D.G ('20-24' ... '75-84'). For multi-select steps, '<a>+<b>' keys (sorted) give the exact union; otherwise single-answer
       questions add up and Intentions (multi-answer) uses the largest option as a floor.
     Below the threshold only study estimates show. ?members=1 previews the layout with FAKE member numbers (labelled PREVIEW). No live polling. */
(function(){
const D=window.POOL_REAL, S=JSON.parse(JSON.stringify(D.sel)), Q=new URLSearchParams(location.search);
const sig=n=>{n=Math.round(n); if(n<1000) return Math.round(n/10)*10||n; const p=Math.pow(10,Math.floor(Math.log10(n))-2); return Math.round(n/p)*p};
const fmt=n=>sig(n).toLocaleString('en-US');
// src keys stay as before (variants style badges by key); the text is the simple Census / CDC / EST rule
const SRC={acs:'CENSUS',nhanes:'CDC',pew:'EST',nsfg:'EST',ipeds:'EST',gss:'EST',none:''};
const optL=(k,id)=>{const o=D[k].opts.find(o=>o[0]===id); return o?o[1]:id};
const multiL=(k,short)=>{const a=S[k]; if(!a.length) return k==='intent'?'Any single':'Any'; const l=a.map(id=>optL(k,id)); return a.length===1?l[0]:(short?l[0]+' +'+(a.length-1):l.join(', '))};
const hL=()=>{const p=D.height.presets.find(p=>p[0]===S.hmin&&p[1]===S.hmax); if(p) return p[2]; const f=i=>i<=0?'Any':`${Math.floor(i/12)}′${i%12}″`; return f(S.hmin)+'–'+f(S.hmax)};
const cityName=()=>D.city.names[S.city];
// Header name: the signup's first name (D.user.first) as a possessive with a curly apostrophe; '' = fall back to YOUR POOL
const firstName=()=>((D.user&&D.user.first)||'').trim();
const poss=()=>{const n=firstName(); return n?n+(/s$/i.test(n)?'\u2019':'\u2019s'):''};
const poolTitle=()=>(poss()||'Your')+' Pool';
// shrink an element's font (px) until its text fits `avail` px wide; never wraps or truncates
function fitFont(el,avail,minPx){ if(!el) return; el.style.fontSize=''; let px=parseFloat(getComputedStyle(el).fontSize); while(el.scrollWidth>avail+0.5&&px>minPx){px-=0.5; el.style.fontSize=px+'px';} }
// Seeking (mirrors the app's I'm seeking: men / women / everyone). Counts are built for men only, so men is the default and the only data today.
if(!S.seek) S.seek='men';
const SEEK={men:['MALE','single men'],women:['FEMALE','single women'],everyone:['EVERYONE','singles']};
const seekL=()=>(SEEK[S.seek]||SEEK.men)[0], seekN=()=>(SEEK[S.seek]||SEEK.men)[1];
const distL=()=>S.radius==='any'?'any distance':'≤'+S.radius+' mi';
const startSub=()=>seekN()+' 21–80 · '+cityName()+' '+distL();
const MEM={threshold:D.members.threshold,count:D.members.count,asOf:D.members.asOf,rates:D.members.rates,preview:false};
if(Q.get('members')==='1'){MEM.preview=true; MEM.count=1240;}
const memOn=()=>MEM.count>=MEM.threshold;
function setMembers(o){Object.assign(MEM,o||{});}
const ROWS=[
 {rk:'03',k:'city',fixed:'start',name:'City & distance',src:'acs',label:()=>cityName()+' · '+(S.radius==='any'?'any distance':'≤'+S.radius+' mi')},
 {rk:'04',k:'age',name:'Age range',src:'acs',label:()=>'Age '+S.amin+'–'+S.amax},
 {rk:'01',k:'intent',name:'Intentions',src:'pew',label:()=>'Intentions: '+multiL('intent',true)},
 {rk:'02',k:'kids',name:'Want kids',src:'nsfg',label:()=>'Want kids: '+optL('kids',S.kids)},
 {rk:'05',k:'height',name:'Height',src:'nhanes',label:()=>'Height: '+hL()},
 {rk:'06',k:'edu',name:'Education',src:'acs',label:()=>'Degree: '+optL('edu',S.edu)},
 {rk:'07',k:'inc',name:'Income',src:'acs',label:()=>'Income: '+optL('inc',S.inc)},
 // "Any" preferences sort to the end of the ranking; each can be switched on (then it cuts like any other step)
 opt('08','eth','Ethnicity','acs'),
 opt('09','haskids','Have kids','nsfg'),
 opt('10','relig','Religion','gss'),
 opt('11','tier','Education tier','ipeds'),
 opt('12','pol','Politics','gss'),
];
function isAny(k){return Array.isArray(S[k])?!S[k].length:S[k]==='any';}
function opt(rk,k,name,src){return {rk,k,name,src,uname:k==='tier'?'Tier':name,optional:true,get fixed(){return isAny(k)?'nocut':undefined},label:()=>name+': '+(Array.isArray(S[k])?multiL(k,true):optL(k,S[k]))};}
const NOTES={
 city:'CENSUS. ACS 2020–24 5-yr (B12002): single men (never married, divorced or widowed) aged 21–80 in Census tracts within that distance of the city. All my cities counts overlapping areas once (New York and Brooklyn overlap almost fully). Any distance = all U.S.; it still uses your city’s mix for degree, income and ethnicity',
 age:'CENSUS. Same ACS table by 5-year age group (65–74 and 75–84 come in 10-year groups; a partial group is counted by its share of years). Later steps use age-specific rates for the ages you keep',
 intent:'EST. Mirrors the app’s Intentions choices (multi-select: a man counts if he’d pick any of yours). Pew ATP W111 (Jul 2022) splits unmarried men into: in a relationship / not looking / casual only / open to either / committed only (men 30–49: committed or either 29.8%, n=503; 50–64: 24.9%, n=422). Marriage = committed seekers × want-to-marry blend (30–49: 51% = Pew 2025 49%×0.4 + AEI 2021 56%×0.4 + SIA 2026 44.6%×0.2). Life partner = Marriage + 43% of the other committed seekers (SIA 2026: 30.0% open to committed without marriage vs 39.9% leading to marriage). Dating = anyone looking. Casual = casual-only + open to either. Any = all single men',
 kids:'EST. CDC NSFG 2022–23, unmarried men (yes / no / don’t know), blended with Pew 2023 (men 18–34 without kids: 57% want, 15% don’t, 28% not sure) at weight 0.4 under 35 and 0.2 at 35–39. Open to either and Unsure split the not-sure share 50/50 (assumption). 50–54 carries 45–49; older ages scaled down (NSFG stops at 49)',
 height:'CDC. NHANES measured heights (Aug 2021–Aug 2023 and 2017–Mar 2020, averaged), U.S. men by age, rounded to the inch like the app slider',
 edu:'CENSUS. ACS 2020–24 PUMS: single men in this city area, by age. Doctorate+ includes professional degrees (MD, JD)',
 inc:'CENSUS. ACS 2020–24 PUMS personal income, among single men in this area who pass Degree. $500k+ rests on small samples; $1M+ has no data yet (the Census top-codes high incomes)',
 eth:'CENSUS. ACS 2020–24 PUMS race and Hispanic origin among single men who pass Degree and Income (MENA from ancestry, South Asian from detailed race). Non-Hispanic except Hispanic / Latino; Other = some other race or two or more races',
 haskids:'EST. CDC NSFG 2022–23: unmarried men with or without a biological child, given their Want kids answer. 50+ carries 45–49 (NSFG stops at 49)',
 relig:'EST. GSS 2018–2024 pooled, unmarried men, weighted (n=356–712 per age group). Jewish, Muslim, Buddhist and Hindu are averaged 50/50 with Pew RLS 2023–24 shares (small GSS samples). No religion is split Atheist 5 : Agnostic 6 : nothing in particular 19 (Pew RLS), and nothing in particular goes half to Spiritual, half to Other (assumption). Sikh 0.2% (Pew RLS: under 0.3%). National',
 tier:'EST. NCES IPEDS: share of U.S. men’s bachelor’s degrees (classes of 2009 and 2016, averaged). Ivy+ = 8 Ivies + Stanford, MIT, Chicago, Duke: 1.4%. Top 50 / Top 100 = the 50 / 100 most selective colleges by admit rate (4.9% / 10.6%), standing in for a published ranking. Applied to men who pass Degree; national',
 pol:'EST. GSS 2018–2024 pooled, unmarried men, weighted: 1–3 liberal = Left-leaning, 4 = Moderate, 5–7 conservative = Right-leaning. National'};
const PF={intent:1.42,kids:1.28,height:1.06,edu:1.33,inc:1.21,eth:1,haskids:1.08,relig:.92,tier:1.7,pol:1.18}; // PREVIEW ONLY: fake member multipliers
const pums=()=>D.city.pums[S.city];
function counts(){const c=S.radius==='any'?D.city.us:D.city.cnt[S.city][S.radius]; return c;}
function frac(g,lo,hi){const [a,b]=D.GB[g]; const ov=Math.min(b,hi)-Math.max(a,lo)+1; return ov>0?ov/(b-a+1):0;}
function rate(k,g){
  const c=pums();
  switch(k){
    case 'intent':{const cl=D.intent.cells[D.PG[g]]; if(!S.intent.length) return 1-cl.tk; const set=new Set(); S.intent.forEach(o=>D.intent.tick[o].forEach(x=>set.add(x))); let v=0; set.forEach(x=>v+=cl[x]); return v;}
    case 'kids': return D.kids.rate[g][S.kids];
    case 'haskids':{if(S.haskids==='any') return 1; const p=D.haskids.nok[g][S.kids]; return S.haskids==='no'?p:1-p;}
    case 'height': return hRate(D.height.cdf[g]);
    case 'edu': return c.edu[g][S.edu]/1000;
    case 'inc': return S.inc==='0'?1:c.inc[g][S.edu][S.inc]/1000;
    case 'tier':{if(S.tier==='any') return 1; const sh=D.tier.share[S.tier], ed=c.edu[g]; return ['ba','ma','phd'].includes(S.edu)?sh:(ed[S.edu]?ed.ba/ed[S.edu]:0)*sh;}
    case 'eth':{if(!S.eth.length) return 1; const a=c.eth[g][S.edu][S.inc]; return S.eth.reduce((t,o)=>t+a[D.R.indexOf(o)],0)/1000;}
    case 'relig': case 'pol': return S[k].length?Math.min(1,S[k].reduce((t,o)=>t+D[k].rate[D.GG[g]][o],0)):1;
  } return 1;}
function hRate(a){const i=x=>Math.max(0,Math.min(a.length-1,x-D.height.cdf0)); const lo=S.hmin<=D.height.cdf0?1:a[i(S.hmin)], hi=S.hmax+1>=D.height.cdf0+a.length?0:a[i(S.hmax+1)]; return Math.max(0,lo-hi);}
function memberRate(k,g){
  if(MEM.preview) return Math.min(.97,rate(k,g)*(PF[k]||1));
  const T=MEM.rates&&MEM.rates.man&&MEM.rates.man[k]; const row=T&&(T[g]||T.all); if(!row) return null;
  if(k==='height') return row.cdf?hRate(row.cdf):null;
  const v=S[k];
  if(Array.isArray(v)){ if(!v.length) return 1; const key=v.slice().sort().join('+'); if(row[key]!=null) return row[key];
    const xs=v.map(o=>row[o]).filter(x=>x!=null); if(!xs.length) return null; return k==='intent'?Math.max(...xs):Math.min(1,xs.reduce((a,b)=>a+b,0)); }
  if(v==='any'||v==='0') return 1; return row[v]!=null?row[v]:null;}
function compute(){
  const base=counts(), cur={}; D.G.forEach(g=>cur[g]=base[g]*frac(g,21,80));
  const sum=()=>D.G.reduce((a,g)=>a+cur[g],0), start=sum(), steps=[], mon=memOn();
  ROWS.forEach(r=>{const before=sum(); let member=null;
    if(r.k==='age') D.G.forEach(g=>{const f0=frac(g,21,80); cur[g]=f0?cur[g]*frac(g,S.amin,S.amax)/f0:0;});
    else if(r.k!=='city'&&!r.fixed){
      if(mon&&before>0){let t=0,ok=true; D.G.forEach(g=>{if(!cur[g]) return; const m=memberRate(r.k,g); if(m==null) ok=false; else t+=cur[g]*m;}); member=ok?t/before:null;}
      D.G.forEach(g=>cur[g]*=rate(r.k,g));}
    const n=sum(); steps.push({r,n,before,keep:before?n/before:1,member});});
  return {start,steps,final:steps.at(-1).n,members:mon?{count:MEM.count,preview:MEM.preview}:null};}
function width(n,start,min){min=min||24; const lo=40; const f=Math.max(0,Math.min(1,Math.log(Math.max(n,1)/lo)/Math.log(start/lo))); return min+(100-min)*f;}
const pct=k=>k>=0.995?'100%':k<0.01?'<1%':Math.round(k*100)+'%';
function memLine(st){return st&&st.member!=null?`IHBC members ${pct(st.member)} · studies ${pct(st.keep)}${MEM.preview?' · PREVIEW':''}`:'';}
// final pool if S[k] were v (restores S)
function tryVal(k,v){const prev=S[k]; S[k]=v; const n=compute().final; S[k]=prev; return n;}
function tryMany(o){const prev={}; for(const k in o){prev[k]=S[k]; S[k]=o[k];} const c=compute(); for(const k in prev) S[k]=prev[k]; return c;}
const SOURCES='<b>YOUR REAL PREFERENCES</b> from your Oct 7, 2026 signup, in your What Matters Most order; each step asks what the app asks. This is your most complete single signup (Oct 7, 6:24 PM CT; 7 of 15 partner fields saved). No signup has partner Intentions or Want kids saved, so your own answers stand in; Ethnicity, Have kids, Religion and Politics aren’t saved (Any); Education tier and the What Matters Most order have no saved field yet. Counts are our estimates, not a live dating pool. Badges: <b>CENSUS</b> = direct ACS count, <b>CDC</b> = direct NHANES, <b>EST</b> = our blend of studies. '+
 '<b>City + distance:</b> '+NOTES.city.slice(8)+'. <b>Age:</b> '+NOTES.age.slice(8)+'. <b>Intentions (EST):</b> '+NOTES.intent.slice(5)+'. <b>Want kids (EST):</b> '+NOTES.kids.slice(5)+'. <b>Height (CDC):</b> '+NOTES.height.slice(5)+'. <b>Degree, Income (CENSUS):</b> ACS 2020–24 PUMS, single men in the same area and age, counted together. '+
 '<b>Unused until you turn them on:</b> Ethnicity (CENSUS, ACS PUMS); Have kids (EST, NSFG); Religion (EST, GSS + Pew RLS); Education tier (EST, NCES IPEDS); Politics (EST, GSS). '+
 'Survey rates are national and assumed independent of each other, applied age by age. <b>IHBC member rates</b> show next to the study rate once 1,000 people have signed up (now '+D.members.count+', '+D.members.asOf+'). Full mapping table: <a href="pool_mapping_grokbot.md" target="_blank" style="color:#c8f135">pool_mapping_grokbot.md</a> (CSV alongside).';
const PRESET_AGES=[[25,35],[28,40],[31,45],[31,54],[35,50],[40,60],[21,80]];
function openEdit(k,onChange){
  const r=ROWS.find(x=>x.k===k); close();
  const wrap=document.createElement('div'); wrap.className='pe-sheet'; wrap.id='pe-sheet';
  const row=(id,label,n,on,dis)=>`<button type="button" class="pe-opt${on?' on':''}${dis?' dis':''}" data-id="${id}"${dis?' disabled':''}><span>${label}</span><b>${dis?'no data yet':'≈ '+fmt(n)}</b></button>`;
  const draw=()=>{const c=compute(), st=c.steps.find(s=>s.r.k===k); let body='';
    if(k==='city'){
      body=`<div class="pe-sub">City</div>`+D.city.ORDER.map(id=>{const cs=tryMany({city:id}); return row(id,`${D.city.names[id]}${id===D.city.home?' · home':''}<small class="pe-sm">${fmt(cs.start)} single men 21–80 within ${S.radius==='any'?'any distance':S.radius+' mi'}</small>`,cs.final,S.city===id);}).join('')+
        `<div class="pe-sub">Distance</div><div class="pe-chips">${D.city.radii.concat(['any']).map(rd=>`<button type="button" class="pe-chip${S.radius===rd?' on':''}" data-rad="${rd}">${rd==='any'?'Any':rd+' mi'}</button>`).join('')}</div>`;
    } else if(k==='age'){
      const sel=(nm,v)=>`<select class="pe-sel" data-age="${nm}">${Array.from({length:60},(_,i)=>i+21).map(a=>`<option${a===v?' selected':''}>${a}</option>`).join('')}</select>`;
      body=`<div class="pe-agerow"><label>Min ${sel('amin',S.amin)}</label><span>to</span><label>Max ${sel('amax',S.amax)}</label></div>`+
        PRESET_AGES.map(([a,b])=>row(a+'-'+b,`${a}–${b}${a===D.sel.amin&&b===D.sel.amax?' · yours':''}${a===21&&b===80?' · any age':''}`,tryMany({amin:a,amax:b}).final,S.amin===a&&S.amax===b)).join('');
    } else if(k==='height'){
      body=D.height.presets.map(([a,b,l])=>row(a+'-'+b,l+(a===D.sel.hmin&&b===D.sel.hmax?' · yours':''),tryMany({hmin:a,hmax:b}).final,S.hmin===a&&S.hmax===b)).join('');
    } else if(D[k].multi){
      body=`<div class="pe-sub">Pick any (a man counts if he matches one)</div>`+D[k].opts.map(([id,l])=>{const nv=id==='any'?[]:(S[k].includes(id)?S[k].filter(x=>x!==id):S[k].concat(id)); const on=id==='any'?!S[k].length:S[k].includes(id);
        return row(id,l,tryVal(k,nv),on);}).join('');
    } else {
      body=D[k].opts.map(([id,l])=>{const dis=D[k].nodata&&D[k].nodata.includes(id); return row(id,l,dis?0:tryVal(k,id),S[k]===id,dis);}).join('');
    }
    const ml=memLine(st);
    wrap.innerHTML=`<div class="pe-back"></div><div class="pe-panel" role="dialog" aria-label="Edit ${r.name}">
      <div class="pe-top"><span class="pe-k">Edit ${r.name} <span class="pe-badge src-${r.src}">${SRC[r.src]}</span></span><button type="button" class="pe-x">DONE</button></div>
      ${st&&k!=='city'?`<div class="pe-now">This step keeps <b>${pct(st.keep)}</b>${ml?` · <span class="pe-mem">${ml}</span>`:''}</div>`:''}
      <div class="pe-opts">${body}</div>
      <p class="pe-note">${NOTES[k]}. Numbers are your final pool with that option.</p>
      <button type="button" class="pe-done">Done — update pool</button></div>`;
    wrap.querySelectorAll('.pe-opt[data-id]:not([disabled])').forEach(b=>b.onclick=()=>{const id=b.dataset.id;
      if(k==='age'){const [a,z]=id.split('-').map(Number); S.amin=a; S.amax=z;}
      else if(k==='height'){const [a,z]=id.split('-').map(Number); S.hmin=a; S.hmax=z;}
      else if(D[k]&&D[k].multi){S[k]=id==='any'?[]:(S[k].includes(id)?S[k].filter(x=>x!==id):S[k].concat(id));}
      else S[k]=id;
      draw(); onChange&&onChange(k);});
    wrap.querySelectorAll('.pe-chip[data-rad]').forEach(b=>b.onclick=()=>{const v=b.dataset.rad; S.radius=v==='any'?'any':+v; draw(); onChange&&onChange(k);});
    wrap.querySelectorAll('.pe-sel').forEach(s=>s.onchange=()=>{S[s.dataset.age]=+s.value; if(S.amin>S.amax){if(s.dataset.age==='amin') S.amax=S.amin; else S.amin=S.amax;} draw(); onChange&&onChange(k);});
    wrap.querySelector('.pe-x').onclick=wrap.querySelector('.pe-done').onclick=wrap.querySelector('.pe-back').onclick=close;
  };
  draw(); document.body.appendChild(wrap); requestAnimationFrame(()=>wrap.classList.add('show'));
}
function close(){const w=document.getElementById('pe-sheet'); if(w) w.remove();}
window.PoolEngine={D,S,ROWS,SRC,NOTES,SOURCES,compute,width,openEdit,close,fmt,pct,memLine,memOn,setMembers,MEM,optL,multiL,hL,isAny,tryVal,cityName,seekL,seekN,startSub,firstName,poss,poolTitle,fitFont};
})();
