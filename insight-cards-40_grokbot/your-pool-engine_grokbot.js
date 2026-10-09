/* Shared logic for Your Pool variants (sandbox mockups), v5. Uses window.POOL_REAL.
   Every EDIT sheet mirrors the IHereByCommit Sandbox 2 (k5-s3y63) partner-preference input for that question: same wording, options, order and select type (Want kids is multi-select by request). Each option maps to mutually exclusive survey categories of men; multi-select adds the union once (see pool_edit_inputs_grokbot.md).
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
// row counts in sheets: unrounded under 100 (one decimal under 10) so small groups stay distinct
const fmtR=n=>n>=100?fmt(n):n>=10?String(Math.round(n)):n>0?n.toFixed(1):'0';
// src keys stay as before (variants style badges by key); the text is the simple Census / CDC / EST rule
const SRC={acs:'CENSUS',nhanes:'CDC',pew:'EST',nsfg:'EST',ipeds:'EST',gss:'EST',none:''};
// option lookup; opts rows are [id, site label, (accepted base categories)]
const optL=(k,id)=>{const o=D[k].opts.find(o=>o[0]===id); return o?o[1]:id};
// multi-select label: every pick spelled out in the site's option order (never '+N')
const ordered=k=>D[k].opts.map(o=>o[0]).filter(id=>S[k].includes(id));
const multiL=(k,sep)=>{const a=S[k]; if(!a.length) return k==='intent'?'Any single':'Any'; return ordered(k).map(id=>optL(k,id)).join(sep||' · ')};
const fmtIn=i=>Math.floor(i/12)+'\u2019'+(i%12)+'\u201d';   // site _fmtHeight (US): 5’10”
const H0=58,H1=84,A0=21,A1=80;                               // site slider bounds
const hL=()=>S.hmin<=H0&&S.hmax>=H1?'Any':fmtIn(Math.max(S.hmin,H0))+'–'+fmtIn(Math.min(S.hmax,H1));
const cityName=()=>D.city.names[S.city];
// Header name: the signup's first name (D.user.first) as a possessive with a curly apostrophe; '' = fall back to YOUR POOL
const firstName=()=>((D.user&&D.user.first)||'').trim();
const poss=()=>{const n=firstName(); return n?n+(/s$/i.test(n)?'\u2019':'\u2019s'):''};
const poolTitle=()=>(poss()||'Your')+' Pool';
// shrink an element's font (px) until its text fits `avail` px wide; never wraps or truncates
function fitFont(el,avail,minPx){ if(!el) return; el.style.fontSize=''; let px=parseFloat(getComputedStyle(el).fontSize); while(el.scrollWidth>avail+0.5&&px>minPx){px-=0.5; el.style.fontSize=px+'px';} }
// Seeking mirrors the site's Seeking toggle (MEN / WOMEN / BOTH). Counts exist for men only.
if(!S.seek) S.seek='men';
const SEEK={men:['MALE','single men','MEN'],women:['FEMALE','single women','WOMEN'],both:['EVERYONE','singles','BOTH']};
const seekL=()=>(SEEK[S.seek]||SEEK.men)[0], seekN=()=>(SEEK[S.seek]||SEEK.men)[1];
const distL=()=>'≤'+S.radius+' mi';
const startSub=()=>seekN()+' 21–80 · '+cityName()+' '+distL();
const MEM={threshold:D.members.threshold,count:D.members.count,asOf:D.members.asOf,rates:D.members.rates,preview:false};
if(Q.get('members')==='1'){MEM.preview=true; MEM.count=1240;}
const memOn=()=>MEM.count>=MEM.threshold;
function setMembers(o){Object.assign(MEM,o||{});}
const kidsL=()=>{const a=S.kids; if(!a.length) return 'Any'; return ordered('kids').map(id=>optL('kids',id)).join(' · ')};
const ROWS=[
 {rk:'03',k:'city',fixed:'start',name:'City & distance',src:'acs',label:()=>cityName()+' · ≤'+S.radius+' mi'},
 {rk:'04',k:'age',name:'Age range',src:'acs',label:()=>'Age '+S.amin+'–'+S.amax},
 {rk:'01',k:'intent',name:'Intentions',src:'pew',label:()=>'Looking for: '+multiL('intent')},
 {rk:'02',k:'kids',name:'Want kids',src:'nsfg',label:()=>'Want kids: '+kidsL()},
 {rk:'05',k:'height',name:'Height',src:'nhanes',label:()=>'Height: '+hL()},
 {rk:'06',k:'edu',name:'Education',src:'acs',label:()=>'Degree: '+optL('edu',S.edu)},
 {rk:'07',k:'inc',name:'Income',src:'acs',label:()=>'Income: '+optL('inc',S.inc)},
 // "Any" preferences sort to the end; each can be switched on (then it cuts like any other step)
 opt('08','eth','Ethnicity','acs'),
 opt('09','haskids','Have kids','nsfg'),
 opt('10','relig','Religion','gss'),
 opt('11','tier','Education tier','ipeds'),
 opt('12','pol','Politics','gss'),
];
function isAny(k){return Array.isArray(S[k])?!S[k].length:(S[k]==='any'||S[k]==='none');}
function opt(rk,k,name,src){return {rk,k,name,src,uname:k==='tier'?'Tier':name,optional:true,get fixed(){return isAny(k)?'nocut':undefined},label:()=>name+': '+(Array.isArray(S[k])?multiL(k):optL(k,S[k]))};}
const NOTES={
 city:'CENSUS. ACS 2020–24 5-yr (B12002): single men (never married, divorced or widowed) aged 21–80 in Census tracts within that distance of the city, at every stop of the site’s distance slider (1–300 mi). All my cities counts overlapping areas once (New York and Brooklyn overlap almost fully). Degree, income and ethnicity use the city’s own mix',
 age:'CENSUS. Same ACS table by 5-year age group (65–74 and 75–84 come in 10-year groups; a partial group counts by its share of years). Later steps use age-specific rates for the ages you keep',
 intent:'EST. Pew ATP W111 (Jul 2022) splits unmarried men into exclusive groups: in a relationship / not looking / casual only / open to casual or committed / committed only; the two committed groups are split by want-to-marry (30–49: 51% = Pew 2025 49%×0.4 + AEI 2021 56%×0.4 + SIA 2026 44.6%×0.2) and, of the rest, 43% would take a life partner without marriage (SIA 2026). Each option counts the groups that would pick it; several options add their groups once (no double counting). Any = every single man not already in a relationship',
 kids:'EST. CDC NSFG 2022–23 unmarried men (wants kids: yes / no / don’t know), blended with Pew 2023 (men 18–34 without kids: 57% / 15% / 28% not sure) at weight 0.4 under 35 and 0.2 at 35–39; 50–54 carries 45–49, older ages scaled down (NSFG stops at 49). Three exclusive groups: Yes, No, Not sure. Yes = yes; No = no; Unsure = not sure; Open to either = yes + no (a man with either firm answer; it does not include Not sure, which is its own option). Several options add their groups once',
 height:'CDC. NHANES measured heights (Aug 2021–Aug 2023 and 2017–Mar 2020, averaged), U.S. men by age, by inch like the site slider (4’10”–7’0”)',
 edu:'CENSUS. ACS 2020–24 PUMS: single men in this city area, by age. Doctorate+ includes professional degrees (MD, JD). None Stated = no degree cut (the census has no “not stated”)',
 inc:'CENSUS. ACS 2020–24 PUMS personal income, among single men in this area who pass Degree. $500k+ rests on small samples; $1M+ has no data yet (the Census top-codes high incomes). None Stated = no income cut',
 eth:'CENSUS. ACS 2020–24 PUMS race and Hispanic origin among single men who pass Degree and Income (MENA from ancestry, South Asian from detailed race); exclusive groups, so picks add up. Non-Hispanic except Hispanic / Latino; Other = some other race or two or more races. None Stated adds no one (everyone in the census has a race)',
 haskids:'EST. CDC NSFG 2022–23: unmarried men with or without a biological child, within the Want kids groups you accept. 50+ carries 45–49 (NSFG stops at 49)',
 relig:'EST. GSS 2018–2024 pooled, unmarried men, weighted (n=356–712 per age group); exclusive groups, so picks add up. Jewish, Muslim, Buddhist and Hindu averaged 50/50 with Pew RLS 2023–24 shares (small GSS samples). No religion is split Atheist 5 : Agnostic 6 : nothing in particular 19 (Pew RLS), and nothing in particular goes half to Spiritual, half to Other (assumption). Sikh 0.2% (Pew RLS). None Stated adds no one. National',
 tier:'EST. NCES IPEDS: share of U.S. men’s bachelor’s degrees (classes of 2009 and 2016, averaged). Ivy+ = 8 Ivies + Stanford, MIT, Chicago, Duke: 1.4%. Top 50 / Top 100 = the 50 / 100 most selective colleges by admit rate (4.9% / 10.6%), standing in for a published ranking. Applied to men who pass Degree; national',
 pol:'EST. GSS 2018–2024 pooled, unmarried men, weighted, 7-point scale: 1–2 (extremely) liberal = Left, 3 slightly liberal = Left-leaning, 4 = Moderate, 5 slightly conservative = Right-leaning, 6–7 = Right; no answer / don’t know (about 2%) stands in for Apolitical. Exclusive groups, so picks add up. None Stated adds no one. National'};
const PF={intent:1.42,kids:1.28,height:1.06,edu:1.33,inc:1.21,eth:1,haskids:1.08,relig:.92,tier:1.7,pol:1.18}; // PREVIEW ONLY: fake member multipliers
const pums=()=>D.city.pums[S.city];
const eduK=()=>S.edu==='none'?'any':S.edu, incK=()=>S.inc==='none'?'0':S.inc;
function counts(){return D.city.cnt[S.city][S.radius]||D.city.cnt[S.city][30];}
function frac(g,lo,hi){const [a,b]=D.GB[g]; const ov=Math.min(b,hi)-Math.max(a,lo)+1; return ov>0?ov/(b-a+1):0;}
// accepted base categories for a multi-select step (union, each once)
function accepted(k){const set=new Set(); S[k].forEach(id=>{const o=D[k].opts.find(o=>o[0]===id); (o&&o[2]||[]).forEach(c=>set.add(c));}); return set;}
function rate(k,g){
  const c=pums();
  switch(k){
    case 'intent':{const cl=D.intent.cells[D.PG[g]]; if(!S.intent.length) return 1-cl.tk; const set=new Set(); S.intent.forEach(o=>D.intent.tick[o].forEach(x=>set.add(x))); let v=0; set.forEach(x=>v+=cl[x]); return v;}
    case 'kids':{if(!S.kids.length) return 1; const r=D.kids.rate[g], T=D.kids.base.reduce((t,x)=>t+r[x],0); let v=0; accepted('kids').forEach(x=>v+=r[x]); return v/T;}
    case 'haskids':{if(S.haskids==='any') return 1; const nk=D.haskids.nok[g]; let p=nk.any;
      if(S.kids.length){const r=D.kids.rate[g]; let num=0,den=0; accepted('kids').forEach(x=>{num+=r[x]*nk[x]; den+=r[x];}); if(den>0) p=num/den;}
      return S.haskids==='no'?p:1-p;}
    case 'height': return hRate(D.height.cdf[g]);
    case 'edu': return c.edu[g][eduK()]/1000;
    case 'inc': return incK()==='0'?1:c.inc[g][eduK()][incK()]/1000;
    case 'tier':{if(S.tier==='any') return 1; const sh=D.tier.share[S.tier], ed=c.edu[g], e=eduK(); return ['ba','ma','phd'].includes(e)?sh:(ed[e]?ed.ba/ed[e]:0)*sh;}
    case 'eth':{if(!S.eth.length) return 1; const a=c.eth[g][eduK()][incK()], T=Math.max(1000,a.reduce((t,x)=>t+x,0)); return S.eth.filter(o=>o!=='none').reduce((t,o)=>t+a[D.R.indexOf(o)],0)/T;}
    case 'relig':{if(!S.relig.length) return 1; const r=D.relig.rate[D.GG[g]], T=Math.max(1,Object.values(r).reduce((t,x)=>t+x,0)); return S.relig.filter(o=>o!=='none').reduce((t,o)=>t+r[o],0)/T;}
    case 'pol':{if(!S.pol.length) return 1; const r=D.pol.rate[D.GG[g]], T=Math.max(1,Object.values(r).reduce((t,x)=>t+x,0)); let v=0; accepted('pol').forEach(x=>v+=r[x]); return v/T;}
  } return 1;}
function hRate(a){const i=x=>Math.max(0,Math.min(a.length-1,x-D.height.cdf0)); const lo=S.hmin<=Math.max(H0,D.height.cdf0)?1:a[i(S.hmin)], hi=S.hmax>=H1?0:a[i(S.hmax+1)]; return Math.max(0,lo-hi);}
function memberRate(k,g){
  if(MEM.preview) return Math.min(.97,rate(k,g)*(PF[k]||1));
  const T=MEM.rates&&MEM.rates.man&&MEM.rates.man[k]; const row=T&&(T[g]||T.all); if(!row) return null;
  if(k==='height') return row.cdf?hRate(row.cdf):null;
  const v=S[k];
  if(Array.isArray(v)){ if(!v.length) return 1; const key=v.slice().sort().join('+'); if(row[key]!=null) return row[key];
    const xs=v.map(o=>row[o]).filter(x=>x!=null); if(!xs.length) return null; return k==='intent'?Math.max(...xs):Math.min(1,xs.reduce((a,b)=>a+b,0)); }
  if(v==='any'||v==='0'||v==='none') return 1; return row[v]!=null?row[v]:null;}
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
function tryVal(k,v){const prev=S[k]; S[k]=v; const n=compute().final; S[k]=prev; return n;}
function tryMany(o){const prev={}; for(const k in o){prev[k]=S[k]; S[k]=o[k];} const c=compute(); for(const k in prev) S[k]=prev[k]; return c;}
const SOURCES='<b>YOUR REAL PREFERENCES</b> from your Oct 7, 2026 signup (6:24 PM CT; your most complete single signup), in your What Matters Most order. Every EDIT is the Sandbox 2 preferences input for that question (same wording, options and select type; Want kids is multi-select here). No signup has partner Intentions or Want kids saved, so your own answers stand in for them; Ethnicity, Have kids, Religion and Politics aren’t saved (Any); Education tier has no saved field yet. Counts are our estimates, not a live dating pool. Badges: <b>CENSUS</b> = direct ACS count, <b>CDC</b> = direct NHANES, <b>EST</b> = our blend of studies. '+
 '<b>How options add up:</b> each question’s survey answers are split into groups of men that don’t overlap; each site option counts the groups that would match it, and picking several counts each group once. No 50/50 splits. '+
 '<b>City + distance:</b> '+NOTES.city.slice(8)+'. <b>Age:</b> '+NOTES.age.slice(8)+'. <b>Intentions (EST):</b> '+NOTES.intent.slice(5)+'. <b>Want kids (EST):</b> '+NOTES.kids.slice(5)+'. <b>Height (CDC):</b> '+NOTES.height.slice(5)+'. <b>Degree, Income (CENSUS):</b> ACS 2020–24 PUMS, single men in the same area and age, counted together. '+
 '<b>Unused until you turn them on:</b> Ethnicity (CENSUS, ACS PUMS); Have kids (EST, NSFG, within your Want kids groups); Religion (EST, GSS + Pew RLS); Education tier (EST, NCES IPEDS); Politics (EST, GSS 7-point). '+
 'Survey rates are national and assumed independent of each other, applied age by age. <b>IHBC member rates</b> show next to the study rate once 1,000 people have signed up (now '+D.members.count+', '+D.members.asOf+'). Full input list and mapping: <a href="pool_edit_inputs_grokbot.md" target="_blank" style="color:#c8f135">pool_edit_inputs_grokbot.md</a>; data table <a href="pool_mapping_grokbot.md" target="_blank" style="color:#c8f135">pool_mapping_grokbot.md</a>.';

/* ---------- EDIT sheets: Sandbox 2 (s3y63) preference inputs, re-made in the sandbox palette ---------- */
// site wording: What Matters Most questions (LONG) + Screen 3 field labels
const ASK={intent:['Looking for','What should they be looking for?'],kids:['Want kids','Should they want kids?'],haskids:['Have kids','Can they already have kids?'],
 city:['Distance','How far away can they live?'],age:['Age','How old should they be?'],height:['Height','How tall should they be?'],
 edu:['Degree','How much education should they have?'],tier:['School tier','How much education should they have?'],inc:['Income','How much should they earn?'],
 eth:['Ethnicities','Which ethnicities are you open to?'],relig:['Religion','Which religions are you open to?'],pol:['Politics','Politics']};
const STOPS=D.city.radii;  // site _VK_STOPS: 1,3,5,10,15,20,25,30,40 … 300
const PRESET_AGES=[[25,35],[28,40],[31,45],[31,54],[35,50],[40,60],[21,80]];
const RACE_PANEL={eth:1,relig:1,pol:1};   // site race-opt panels: Any exclusive, None Stated stacks, all items = Any
function injectCSS(){ if(document.getElementById('pf-css')) return; const st=document.createElement('style'); st.id='pf-css'; st.textContent=`
.pf-q{font-family:'Bebas Neue',sans-serif;font-size:24px;line-height:1.05;letter-spacing:.02em;margin:2px 0 6px;color:inherit}
.pf-lab{display:block;font-size:10px;letter-spacing:1.5px;text-transform:uppercase;opacity:.65;margin:10px 0 6px}
.pf-hint{font-size:11px;letter-spacing:0;text-transform:none;opacity:.8}
.pf-res{display:flex;justify-content:space-between;gap:8px;align-items:baseline;padding:8px 10px;margin:0 0 6px;border-radius:8px;background:rgba(200,241,53,.12);border:1px solid rgba(200,241,53,.45);font-size:12px}
.pf-res b{font-family:'Bebas Neue',sans-serif;font-size:22px;font-weight:400;color:#c8f135;letter-spacing:.02em}
.pf-res i{font-style:normal;opacity:.75}
.pf-list{display:flex;flex-direction:column}
.pf-panel .race-opt{display:flex;align-items:center;gap:12px;width:100%;min-height:44px;padding:6px 10px;background:none;border:none;border-bottom:1px solid rgba(240,236,224,.14);color:inherit;font-family:'Space Mono',ui-monospace,monospace;font-size:14px;text-align:left;cursor:pointer;box-sizing:border-box}
.pf-panel .race-opt:active{background:rgba(240,236,224,.08)}
.pf-panel .race-box{flex:none;width:22px;height:22px;border:1.5px solid rgba(240,236,224,.45);border-radius:2px;box-sizing:border-box;position:relative;background:transparent}
.pf-panel .race-opt.round .race-box{border-radius:50%}
.pf-panel .race-opt.selected .race-box{border-color:#c8f135;background:#c8f135}
.pf-panel .race-opt.selected .race-box::after{content:'';position:absolute;left:6px;top:2px;width:6px;height:11px;border:solid #0e0e0e;border-width:0 2px 2px 0;transform:rotate(45deg)}
.pf-panel .race-opt.round.selected .race-box::after{left:5px;top:5px;width:9px;height:9px;border:none;border-radius:50%;background:#0e0e0e;transform:none}
.pf-panel .race-opt-txt{min-width:0;flex:1;line-height:1.3}
.pf-panel .race-opt small{font-size:11px;opacity:.7;font-family:inherit;float:right;white-space:nowrap;margin-left:8px}.pf-in{font-size:9px;font-weight:700;padding:1px 4px;border-radius:3px;background:#c8f135;color:#0e0e0e;margin-right:2px}
.pf-panel .race-opt.dis{opacity:.4;cursor:default}
.pf-panel select.field-input{width:100%;background:transparent;border:1px solid rgba(240,236,224,.35);border-radius:6px;color:inherit;font-family:'Space Mono',ui-monospace,monospace;font-size:16px;padding:12px 14px;min-height:50px;box-sizing:border-box;outline:none;-webkit-appearance:none;appearance:none;background-image:linear-gradient(45deg,transparent 50%,#c8f135 50%),linear-gradient(135deg,#c8f135 50%,transparent 50%);background-position:calc(100% - 20px) 50%,calc(100% - 14px) 50%;background-size:6px 6px;background-repeat:no-repeat}
.pf-panel select.field-input:focus{border-color:#c8f135}
.pf-panel select.field-input option{color:#f0ece0;background:#0e0e0e}
.pf-panel .toggle-group{display:flex;gap:8px;margin-bottom:4px}
.pf-panel .toggle-btn{flex:1;padding:10px 6px;line-height:22px;background:transparent;border:1px solid rgba(240,236,224,.35);border-radius:6px;color:inherit;font-family:'Bebas Neue',sans-serif;font-size:16px;letter-spacing:.05em;text-align:center}
.pf-panel .toggle-btn.selected{background:#c8f135;border-color:#c8f135;color:#0e0e0e}
.pf-panel .toggle-btn:disabled{opacity:.35}
.pf-panel .range-slider-wrap{position:relative;height:44px;display:flex;align-items:center;margin:22px 13px 0}
.pf-panel .range-track{position:absolute;left:0;right:0;height:4px;background:rgba(240,236,224,.2);border-radius:2px}
.pf-panel .range-fill{position:absolute;height:4px;background:#c8f135;border-radius:2px;pointer-events:none}
.pf-panel input[type=range].range-input{position:absolute;left:-13px;width:calc(100% + 26px);-webkit-appearance:none;appearance:none;background:transparent;pointer-events:none;height:44px;margin:0;padding:0;border:none;outline:none}
.pf-panel input[type=range].range-input::-webkit-slider-thumb{-webkit-appearance:none;width:26px;height:26px;border-radius:50%;background:#c8f135;pointer-events:all;cursor:pointer;box-shadow:0 2px 6px rgba(0,0,0,.4)}
.pf-panel input[type=range].range-input::-moz-range-thumb{width:26px;height:26px;border-radius:50%;background:#c8f135;pointer-events:all;cursor:pointer;border:none}
.pf-panel .slider-bubble{position:absolute;top:-16px;transform:translateX(-50%);font-family:'Bebas Neue',sans-serif;font-size:20px;line-height:1;white-space:nowrap;pointer-events:none}
.pf-panel .vk-cb{display:flex;align-items:center;gap:10px;margin:10px 0 2px;font-size:13px;cursor:pointer}
.pf-panel .vk-cb input{width:20px;height:20px;accent-color:#c8f135}
.pf-ends{display:flex;justify-content:space-between;font-size:10px;opacity:.55;margin:0 0 2px}
.pf-flag{font-size:10.5px;line-height:1.4;padding:6px 8px;margin:8px 0 0;border-left:3px solid #FF7A2F;background:rgba(255,122,47,.1)}
.pf-tag{font-size:10px;font-weight:700;padding:1px 5px;border-radius:4px;background:#c8f135;color:#0e0e0e;margin-left:6px;font-family:system-ui,sans-serif}
.pf-tag.sig{background:transparent;color:inherit;border:1px solid rgba(240,236,224,.45)}
`; document.head.appendChild(st);}
function openEdit(k,onChange){
  injectCSS(); const r=ROWS.find(x=>x.k===k); close();
  const wrap=document.createElement('div'); wrap.className='pe-sheet'; wrap.id='pe-sheet';
  const ch=()=>{onChange&&onChange(k);};
  const opt=(id,label,on,cls,extra)=>`<button type="button" class="race-opt${on?' selected':''}${cls?' '+cls:''}" data-id="${id}"${cls&&cls.includes('dis')?' disabled':''}><span class="race-box"></span><span class="race-opt-txt">${label}${extra?` <small>${extra}</small>`:''}</span></button>`;
  const dual=(nm,lo,hi,a,b,fmtv)=>`<div class="range-slider-wrap" data-dual="${nm}"><div class="range-track"></div><div class="range-fill"></div>
      <span class="slider-bubble b0">${fmtv(a)}</span><span class="slider-bubble b1">${fmtv(b)}</span>
      <input type="range" class="range-input r0" min="${lo}" max="${hi}" step="1" value="${a}" aria-label="Minimum"><input type="range" class="range-input r1" min="${lo}" max="${hi}" step="1" value="${b}" aria-label="Maximum"></div>
      <div class="pf-ends"><span>${fmtv(lo)}</span><span>${fmtv(hi)}</span></div>`;
  let body='', top='';
  const result=()=>{const c=compute(), st=c.steps.find(s=>s.r.k===k), ml=memLine(st);
    if(k==='city') return `<div class="pf-res"><span>${fmt(c.start)} ${seekN()} 21–80 within ${S.radius} mi</span><i>pool ≈ ${fmt(c.final)}</i></div>`;
    const keep=k==='tier'&&S.tier==='any'?1:st.keep;
    return `<div class="pf-res"><span>Your pool <b>≈ ${fmtR(c.final)}</b></span><i>this step keeps ${pct(keep)}${ml?' · '+ml:''}</i></div>`;};
  const build=()=>{
    if(k==='city'){
      const others=D.city.ORDER.filter(id=>id!==D.city.home), open=S.city!==D.city.home, si=Math.max(0,STOPS.indexOf(S.radius));
      body=`<label class="pf-lab">Seeking</label><div class="toggle-group">${['men','women','both'].map(s=>`<button type="button" class="toggle-btn${S.seek===s?' selected':''}" data-seek="${s}"${s!=='men'?' disabled title="no data yet"':''}>${SEEK[s][2]}</button>`).join('')}</div>
        <div class="pf-ends" style="opacity:.6"><span>Women and Both: no data yet (the counts are built for single men)</span></div>
        <label class="pf-lab">Distance from ${S.city==='all'?'each of your cities':D.city.names[S.city]}</label>
        <div class="range-slider-wrap" data-dist="1"><div class="range-track"></div><div class="range-fill" style="left:0"></div><span class="slider-bubble b0">${S.radius} miles</span>
        <input type="range" class="range-input r0" min="0" max="${STOPS.length-1}" step="1" value="${si}" aria-label="Distance" style="pointer-events:auto"></div>
        <div class="pf-ends"><span>1 mile</span><span>300 miles</span></div>
        <label class="vk-cb"><input type="checkbox" id="pf-other"${open?' checked':''}> <span class="vk-cb-txt">I'm open to dating in other cities</span></label>
        ${open?`<label class="pf-lab">Partner city <span class="pf-hint">(your signup cities)</span></label><div class="pf-list">${D.city.ORDER.map(id=>opt(id,D.city.names[id]+(id===D.city.home?' · home':''),S.city===id,'round')).join('')}</div>`:''}`;
    } else if(k==='age'){
      const custom=!PRESET_AGES.some(([a,b])=>a===S.amin&&b===S.amax);
      const prow=(a,b)=>{const on=S.amin===a&&S.amax===b, n=tryMany({amin:a,amax:b}).final; return opt(a+'-'+b,`${a}–${b}${on?'<span class="pf-tag">yours</span>':''}${a===D.sel.amin&&b===D.sel.amax?'<span class="pf-tag sig">signup</span>':''}${a===21&&b===80?' · any age':''}`,on,'round','≈ '+fmtR(n));};
      body=`<label class="pf-lab">Age</label>${dual('age',A0,A1,S.amin,S.amax,v=>v)}
        <label class="pf-lab">Quick picks</label><div class="pf-list">${custom?prow(S.amin,S.amax):''}${PRESET_AGES.map(([a,b])=>prow(a,b)).join('')}</div>`;
    } else if(k==='height'){
      body=`<label class="pf-lab">Height</label>${dual('height',H0,H1,Math.max(H0,S.hmin),Math.min(H1,S.hmax),fmtIn)}
        <div class="pf-list">${opt('sig',`${fmtIn(D.sel.hmin)}–${fmtIn(D.sel.hmax)}<span class="pf-tag sig">signup</span>`,S.hmin===D.sel.hmin&&S.hmax===D.sel.hmax,'round')}${opt('any','Any height',S.hmin<=H0&&S.hmax>=H1,'round')}</div>`;
    } else if(k==='edu'||k==='tier'){
      const sel=(id,kk)=>`<select class="field-input" id="${id}" data-k="${kk}">${D[kk].opts.map(([v,l])=>`<option value="${v}"${S[kk]===v?' selected':''}>${l} · ≈ ${fmtR(tryVal(kk,v))}</option>`).join('')}</select>`;
      body=`<label class="pf-lab" for="pf-edu">Degree</label>${sel('pf-edu','edu')}<label class="pf-lab" for="pf-tier">School tier</label>${sel('pf-tier','tier')}`;
    } else if(k==='inc'){
      body=`<label class="pf-lab" for="pf-inc">Income</label><select class="field-input" id="pf-inc" data-k="inc">${D.inc.opts.map(([v,l])=>{const nd=D.inc.nodata.includes(v); return `<option value="${v}"${S.inc===v?' selected':''}${nd?' disabled':''}>${l}${nd?' (no data yet)':' · ≈ '+fmtR(tryVal('inc',v))}</option>`}).join('')}</select>`;
    } else if(k==='haskids'){
      body=`<div class="pf-list">${D.haskids.opts.map(([id,l])=>opt(id,l,S.haskids===id,'round','≈ '+fmtR(tryVal('haskids',id)))).join('')}</div>`;
    } else { // multi-select lists: intent, kids (WMM lists) and eth / relig / pol (race panels)
      // row numbers: unselected = final pool if ADDED to your picks; selected = final pool if REMOVED; Any = no cut
      const cur=S[k], nxt=id=>{let v=cur.includes(id)?cur.filter(x=>x!==id):cur.concat(id); if(RACE_PANEL[k]){const it=D[k].opts.map(o=>o[0]).filter(x=>x!=='any'&&x!=='none'); if(it.every(x=>v.includes(x))) v=[];} return v;};
      body=`<label class="pf-lab">${ASK[k][0]} <span class="pf-hint">(pick any · numbers = your pool if you add <b>+</b> or remove <b>−</b> that pick)</span></label><div class="pf-list">${D[k].opts.map(([id,l])=>{
        if(id==='any') return opt(id,l,!cur.length,'',!cur.length?'no cut · ≈ '+fmtR(compute().final):'no cut → ≈ '+fmtR(tryVal(k,[])));
        const on=cur.includes(id), n=tryVal(k,nxt(id)); return opt(id,l,on,'',on?'<span class="pf-in">in</span> − ≈ '+fmtR(n)+(cur.length===1?' (Any)':''):'+ ≈ '+fmtR(n));}).join('')}</div>`;
      if(k==='kids') body+=`<p class="pf-flag"><b>Open to either</b> = men who want kids + men who don’t; it does <b>not</b> include Unsure (tick Unsure too for them). Sandbox 2 asks this as a single choice; here you can pick several, and each group of men counts once. Your own answer (Yes) stands in until a partner answer is saved.</p>`;
      if(k==='intent') body+=`<p class="pf-flag">Your own Looking for answers stand in until partner Intentions are saved. A man counts if he’d pick any of yours, once.</p>`;
      if(k==='pol') body+=`<p class="pf-flag">Apolitical uses the GSS “no answer / don’t know” share (stand-in). None Stated adds no one.</p>`;
      if(k==='eth'||k==='relig') body+=`<p class="pf-flag">None Stated adds no one: the survey has no “not stated” group.</p>`;
    }
    wrap.innerHTML=`<div class="pe-back"></div><div class="pe-panel pf-panel" role="dialog" aria-label="Edit ${r.name}">
      <div class="pe-top"><span class="pe-k">Edit ${k==='tier'?'Education':r.name} <span class="pe-badge src-${r.src}">${SRC[r.src]}</span></span><button type="button" class="pe-x">DONE</button></div>
      <div class="pf-q">${ASK[k][1]}</div><div class="pf-live">${result()}</div>
      <div class="pe-opts pf-body">${body}</div>
      <p class="pe-note">${NOTES[k]}.</p>
      <button type="button" class="pe-done">Done — update pool</button></div>`;
    wire();};
  const live=()=>{const el=wrap.querySelector('.pf-live'); if(el) el.innerHTML=result(); ch();};
  function paintDual(w,f){const r0=w.querySelector('.r0'),r1=w.querySelector('.r1'),lo=+r0.min,hi=+r0.max,p=v=>(v-lo)/(hi-lo)*100;
    w.querySelector('.range-fill').style.cssText=`left:${p(+r0.value)}%;right:${100-p(+r1.value)}%`;
    const b0=w.querySelector('.b0'),b1=w.querySelector('.b1'); b0.textContent=f(+r0.value); b1.textContent=f(+r1.value);
    b0.style.left=p(+r0.value)+'%'; b1.style.left=p(+r1.value)+'%'; const close_=p(+r1.value)-p(+r0.value)<14; b0.style.transform=close_?'translateX(-100%)':''; b1.style.transform=close_?'translateX(0)':'';}
  function wire(){
    wrap.querySelectorAll('[data-dual]').forEach(w=>{const nm=w.dataset.dual, f=nm==='height'?fmtIn:v=>v, a=nm==='age'?['amin','amax']:['hmin','hmax'];
      const r0=w.querySelector('.r0'), r1=w.querySelector('.r1'); paintDual(w,f);
      // site rule: min <= max - 1 (the thumbs can't cross or meet)
      r0.oninput=()=>{if(+r0.value>+r1.value-1) r0.value=+r1.value-1; S[a[0]]=+r0.value; paintDual(w,f); live();};
      r1.oninput=()=>{if(+r1.value<+r0.value+1) r1.value=+r0.value+1; S[a[1]]=+r1.value; paintDual(w,f); live();};
      r0.onchange=r1.onchange=()=>{build();};});
    const dw=wrap.querySelector('[data-dist]'); if(dw){const rr=dw.querySelector('input'), paint=()=>{const p=rr.value/(STOPS.length-1)*100; dw.querySelector('.range-fill').style.right=(100-p)+'%'; const b=dw.querySelector('.b0'); b.style.left=p+'%'; b.textContent=STOPS[rr.value]+(STOPS[rr.value]===1?' mile':' miles');};
      paint(); rr.oninput=()=>{S.radius=STOPS[+rr.value]; paint(); live();};}
    wrap.querySelectorAll('[data-seek]:not([disabled])').forEach(b=>b.onclick=()=>{S.seek=b.dataset.seek; build(); ch();});
    const oc=wrap.querySelector('#pf-other'); if(oc) oc.onchange=()=>{S.city=oc.checked?'all':D.city.home; build(); ch();};
    wrap.querySelectorAll('select[data-k]').forEach(s=>s.onchange=()=>{S[s.dataset.k]=s.value; live(); });
    wrap.querySelectorAll('.race-opt[data-id]:not([disabled])').forEach(b=>b.onclick=()=>{const id=b.dataset.id;
      if(k==='city') S.city=id;
      else if(k==='age'){const [a,z]=id.split('-').map(Number); S.amin=a; S.amax=z;}
      else if(k==='height'){if(id==='any'){S.hmin=H0; S.hmax=H1;} else {S.hmin=D.sel.hmin; S.hmax=D.sel.hmax;}}
      else if(k==='haskids') S[k]=id;
      else { // multi: Any is exclusive; picking anything else clears Any; empty = Any
        if(id==='any') S[k]=[]; else S[k]=S[k].includes(id)?S[k].filter(x=>x!==id):S[k].concat(id);
        if(RACE_PANEL[k]){const items=D[k].opts.map(o=>o[0]).filter(x=>x!=='any'&&x!=='none'); if(items.every(x=>S[k].includes(x))) S[k]=[];} }
      build(); ch();});
    wrap.querySelector('.pe-x').onclick=wrap.querySelector('.pe-done').onclick=wrap.querySelector('.pe-back').onclick=()=>{close(); ch();};
  }
  build(); document.body.appendChild(wrap); requestAnimationFrame(()=>wrap.classList.add('show'));
}
function close(){const w=document.getElementById('pe-sheet'); if(w) w.remove();}
window.PoolEngine={fmtR,D,S,ROWS,SRC,NOTES,SOURCES,ASK,compute,width,openEdit,close,fmt,pct,memLine,memOn,setMembers,MEM,optL,multiL,kidsL,hL,fmtIn,isAny,tryVal,tryMany,cityName,seekL,seekN,startSub,firstName,poss,poolTitle,fitFont,rate,accepted};
})();
