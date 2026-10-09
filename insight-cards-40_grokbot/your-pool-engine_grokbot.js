/* Shared logic for Your Pool variants (sandbox mockups), v6. Uses window.POOL_REAL.
   Every EDIT sheet mirrors the IHereByCommit Sandbox 2 (k5-s3y63) partner-preference input for that question (wording, options, order).
   RULE (Amanda, Oct 9): every partner preference is MULTI-SELECT (what you're looking for); only your own answers are single-choice.
   EXCEPTION (Amanda, Oct 9): minimum-style 'X or more' options are SINGLE-select: Income (minimum income), Degree (minimum degree) and School tier
   (nested Top 100 > Top 50 > Ivy+). A pick = at least this; Any / None Stated = no cut. Height and Age are ranges (one answer).
   Each option maps to mutually exclusive survey groups; several picks count each group once. Minimum-style ones (income, degree, tier) are single-select, kept as a one-item array.
   Seeking: men, women or both (both = men + women; the two never overlap). Every rate is sex-specific (see pool_edit_inputs_grokbot.md).
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
const cityName=()=>{const a=cityIds(); return a.length===D.city.ORDER.length?D.city.names.all:a.map(id=>D.city.names[id]).join(' + ');};
// Header name: the signup's first name (D.user.first) as a possessive with a curly apostrophe; '' = fall back to YOUR POOL
const firstName=()=>((D.user&&D.user.first)||'').trim();
const poss=()=>{const n=firstName(); return n?n+(/s$/i.test(n)?'\u2019':'\u2019s'):''};
const poolTitle=()=>(poss()||'Your')+' Pool';
// shrink an element's font (px) until its text fits `avail` px wide; never wraps or truncates
function fitFont(el,avail,minPx){ if(!el) return; el.style.fontSize=''; let px=parseFloat(getComputedStyle(el).fontSize); while(el.scrollWidth>avail+0.5&&px>minPx){px-=0.5; el.style.fontSize=px+'px';} }
// Seeking mirrors the site's Seeking toggle (MEN / WOMEN / BOTH); multi-select: men, women or both. Empty = both.
const SEEK={men:['MALE','single men','MEN'],women:['FEMALE','single women','WOMEN'],both:['EVERYONE','singles','BOTH']};
const SXS=()=>{const a=S.seek.filter(x=>x==='men'||x==='women'); return (a.length?a:['men','women']).map(x=>x==='men'?'m':'f');};
const seekKey=()=>{const a=SXS(); return a.length>1?'both':a[0]==='m'?'men':'women';};
const seekL=()=>SEEK[seekKey()][0], seekN=()=>SEEK[seekKey()][1];
const peopleN=()=>({men:'men',women:'women',both:'people'})[seekKey()];
// partner cities: multi-select of her signup cities (union, each tract once); empty = home
const cityIds=()=>{const a=D.city.ORDER.filter(id=>S.city.includes(id)); return a.length?a:[D.city.home];};
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
 {rk:'06',k:'edu',name:'Education',src:'acs',label:()=>'Degree: '+multiL('edu')},
 {rk:'07',k:'inc',name:'Income',get src(){return incEst()?'pew':'acs'},label:()=>'Income: '+multiL('inc')},
 // "Any" preferences sort to the end; each can be switched on (then it cuts like any other step)
 opt('08','eth','Ethnicity','acs'),
 opt('09','haskids','Have kids','nsfg'),
 opt('10','relig','Religion','gss'),
 opt('11','tier','Education tier','ipeds'),
 opt('12','pol','Politics','gss'),
];
function isAny(k){return !S[k].length;}
function opt(rk,k,name,src){return {rk,k,name,src,uname:k==='tier'?'Tier':name,optional:true,get fixed(){return isAny(k)?'nocut':undefined},label:()=>name+': '+multiL(k)};}
const NOTES={
 city:'CENSUS. ACS 2020–24 5-yr (B12002, by sex): single men and/or women (never married, divorced or widowed) aged 21–80 in Census tracts within that distance of the city, at every stop of the site’s distance slider (1–300 mi). Both = men + women (no overlap). Several cities count each tract once (New York and Brooklyn overlap almost fully); a tract near several of your cities uses the mix of the city that keeps the most people. Degree, income and ethnicity use each city’s own mix for that sex',
 age:'CENSUS. Same ACS table by 5-year age group (65–74 and 75–84 come in 10-year groups; a partial group counts by its share of years). Later steps use age-specific rates for the ages you keep',
 intent:'EST. Pew ATP W111 (Jul 2022) splits unmarried men (and, for women, unmarried women; Supabase research_pew_w111) into exclusive groups: in a relationship / not looking / casual only / open to casual or committed / committed only; the two committed groups are split by want-to-marry (30–49: 51% = Pew 2025 49%×0.4 + AEI 2021 56%×0.4 + SIA 2026 44.6%×0.2) and, of the rest, 43% would take a life partner without marriage (SIA 2026). Each option counts the groups that would pick it; several options add their groups once (no double counting). Any = every single person not already in a relationship. Women use the same want-to-marry blend (no by-sex source stored)',
 kids:'EST. CDC NSFG 2022–23 unmarried men (wants kids: yes / no / don’t know), blended with Pew 2023 (men 18–34 without kids: 57% / 15% / 28% not sure) at weight 0.4 under 35 and 0.2 at 35–39; women: NSFG 2022–23 female respondents alone. 50–54 carries 45–49, older ages scaled down (NSFG stops at 49). Three exclusive groups: Yes, No, Not sure (Not sure stands in for “open to either”). Yes = yes + not sure (anyone who wants kids or is open to them); No = no; Open to either = yes + no + not sure; Unsure = not sure. Several options add their groups once',
 height:'CDC. NHANES measured heights (men: Aug 2021–Aug 2023 and 2017–Mar 2020, averaged; women: CDC/NCHS anthropometric reference percentiles, 2018 and 2023 editions, from Supabase), by sex and age, by inch like the site slider (4’10”–7’0”)',
 edu:'CENSUS. ACS 2020–24 PUMS: single men / women in this city area, by age. Doctorate+ includes professional degrees (MD, JD). Single select (a minimum degree, like the site’s dropdown). Any or None Stated = no degree cut (the census has no “not stated”)',
 inc:'CENSUS. ACS 2020–24 PUMS personal income, among single men / women in this area who pass Degree. Single select (the site’s minimum-income dropdown): a pick means at least that much. $500k+ rests on small samples. $1M+, $2M+, $3M+ are EST: the Census top-codes the highest incomes, so we extend the $300k–$500k tail as a Pareto curve (share above X = share above $500k × (500k/X)^a; a = '+D.inc.alpha.m+' men, '+D.inc.alpha.f+' women, fitted to single adults 21–80 in your 6 states). None Stated = no income cut',
 eth:'CENSUS. ACS 2020–24 PUMS race and Hispanic origin among single men / women who pass Degree and Income (MENA from ancestry, South Asian from detailed race); exclusive groups, so picks add up. Non-Hispanic except Hispanic / Latino; Other = some other race or two or more races. None Stated adds no one (everyone in the census has a race)',
 haskids:'EST. CDC NSFG 2022–23: unmarried men (no biological child) / women (no birth) with or without a child, within the Want kids groups you accept. 50+ carries 45–49 (NSFG stops at 49)',
 relig:'EST. GSS 2018–2024 pooled, unmarried men / women by sex, weighted (n=356–712 per age group for men); exclusive groups, so picks add up. Jewish, Muslim, Buddhist and Hindu averaged 50/50 with Pew RLS 2023–24 shares (small GSS samples). No religion is split Atheist 5 : Agnostic 6 : nothing in particular 19 (Pew RLS), and nothing in particular goes half to Spiritual, half to Other (assumption). Sikh 0.2% (Pew RLS). None Stated adds no one. National',
 tier:'EST. NCES IPEDS: share of U.S. men’s (or women’s) bachelor’s degrees (classes of 2009 and 2016, averaged). Ivy+ = 8 Ivies + Stanford, MIT, Chicago, Duke: 1.4%. Top 50 / Top 100 = the 50 / 100 most selective colleges by admit rate (4.9% / 10.6%), standing in for a published ranking. Women: 1.1% / 4.0% / 9.3%. Single select (Top 100 includes Top 50 and Ivy+). Applied to people who pass Degree; a tier implies a bachelor’s, so Income and Ethnicity then use Bachelor’s+ mixes; national',
 pol:'EST. GSS 2018–2024 pooled, unmarried men / women by sex, weighted, 7-point scale: 1–2 (extremely) liberal = Left, 3 slightly liberal = Left-leaning, 4 = Moderate, 5 slightly conservative = Right-leaning, 6–7 = Right; no answer / don’t know (about 2%) stands in for Apolitical. Exclusive groups, so picks add up. None Stated adds no one. National'};
const PF={intent:1.42,kids:1.28,height:1.06,edu:1.33,inc:1.21,eth:1,haskids:1.08,relig:.92,tier:1.7,pol:1.18}; // PREVIEW ONLY: fake member multipliers
// context for rate(): sex ('m'/'f') and the city whose mix applies
const CX={sx:'m',c:'austin'};
const TB=sx=>sx==='m'?{cells:D.intent.cells,kids:D.kids.rate,nok:D.haskids.nok,hcdf:D.height.cdf,tier:D.tier.share,relig:D.relig.rate,pol:D.pol.rate}:D.F;
const pums=()=>D.city.pums[CX.sx][CX.c];
const ordIdx=(k,id)=>D[k].opts.findIndex(o=>o[0]===id);
// minimum-style 'X or more' keys (single-select, one-item array): the pick; None Stated (or nothing) = no cut
const lowest=k=>{const a=S[k]; if(!a.length||a.includes('none')) return null; return a.slice().sort((x,y)=>ordIdx(k,x)-ordIdx(k,y))[0];};
const eduK=()=>lowest('edu')||'any', incK=()=>lowest('inc')||'0';
// a School tier pick means a bachelor's degree, so income and ethnicity mixes use at least Bachelor's+ when a tier is picked
// (otherwise widening Degree below Bachelor's would wrongly lower the income share of the tiered graduates)
const BAUP={ba:1,ma:1,phd:1}, eduM=()=>{const e=eduK(); return tierK()&&!BAUP[e]?'ba':e;};
const TAIL={'1m':1,'2m':1,'3m':1}, incEst=()=>!!TAIL[incK()];
const tierK=()=>['top100','top50','ivy'].find(t=>S.tier.includes(t));  // widest tier picked
const hasKidsMode=()=>{const a=S.haskids; return a.length===1?a[0]:'any';};
function frac(g,lo,hi){const [a,b]=D.GB[g]; const ov=Math.min(b,hi)-Math.max(a,lo)+1; return ov>0?ov/(b-a+1):0;}
// accepted base categories for a multi-select step (union, each once)
function accepted(k){const set=new Set(); S[k].forEach(id=>{const o=D[k].opts.find(o=>o[0]===id); (o&&o[2]||[]).forEach(c=>set.add(c));}); return set;}
function rate(k,g){
  const c=pums(), T=TB(CX.sx);
  switch(k){
    case 'intent':{const cl=T.cells[D.PG[g]]; if(!S.intent.length) return 1-cl.tk; const set=new Set(); S.intent.forEach(o=>D.intent.tick[o].forEach(x=>set.add(x))); let v=0; set.forEach(x=>v+=cl[x]); return v;}
    case 'kids':{if(!S.kids.length) return 1; const r=T.kids[g], tot=D.kids.base.reduce((t,x)=>t+r[x],0); let v=0; accepted('kids').forEach(x=>v+=r[x]); return v/tot;}
    case 'haskids':{const md=hasKidsMode(); if(md==='any') return 1; const nk=T.nok[g]; let p=nk.any;
      if(S.kids.length){const r=T.kids[g]; let num=0,den=0; accepted('kids').forEach(x=>{num+=r[x]*nk[x]; den+=r[x];}); if(den>0) p=num/den;}
      return md==='no'?p:1-p;}
    case 'height': return hRate(T.hcdf[g]);
    case 'edu': return c.edu[g][eduK()]/1000;
    case 'inc':{const i=incK(); if(i==='0') return 1; if(TAIL[i]) return c.inc[g][eduM()]['500000']/1000*D.inc.tail[CX.sx][i]; return c.inc[g][eduM()][i]/1000;}
    case 'tier':{const t=tierK(); if(!t) return 1; const sh=T.tier[t], ed=c.edu[g], e=eduK(); return ['ba','ma','phd'].includes(e)?sh:(ed[e]?ed.ba/ed[e]:0)*sh;}
    case 'eth':{if(!S.eth.length) return 1; const a=c.eth[g][eduM()][TAIL[incK()]?'500000':incK()],  /* $1M+: ethnic mix of $500k+ */ T=Math.max(1000,a.reduce((t,x)=>t+x,0)); return S.eth.filter(o=>o!=='none').reduce((t,o)=>t+a[D.R.indexOf(o)],0)/T;}
    case 'relig':{if(!S.relig.length) return 1; const r=T.relig[D.GG[g]], tot=Math.max(1,Object.values(r).reduce((t,x)=>t+x,0)); return S.relig.filter(o=>o!=='none').reduce((t,o)=>t+(r[o]||0),0)/tot;}
    case 'pol':{if(!S.pol.length) return 1; const r=T.pol[D.GG[g]], tot=Math.max(1,Object.values(r).reduce((t,x)=>t+x,0)); let v=0; accepted('pol').forEach(x=>v+=r[x]); return v/tot;}
  } return 1;}
function hRate(a){const i=x=>Math.max(0,Math.min(a.length-1,x-D.height.cdf0)); const lo=S.hmin<=Math.max(H0,D.height.cdf0)?1:a[i(S.hmin)], hi=S.hmax>=H1?0:a[i(S.hmax+1)]; return Math.max(0,lo-hi);}
function memberRate(k,g){
  if(MEM.preview) return Math.min(.97,rate(k,g)*(PF[k]||1));
  const who=CX.sx==='m'?'man':'woman', T=MEM.rates&&MEM.rates[who]&&MEM.rates[who][k]; const row=T&&(T[g]||T.all); if(!row) return null;
  if(k==='height') return row.cdf?hRate(row.cdf):null;
  const v=k==='edu'?(lowest('edu')?[eduK()]:[]):k==='inc'?(lowest('inc')?[incK()]:[]):k==='tier'?(tierK()?[tierK()]:[]):k==='haskids'?(hasKidsMode()==='any'?[]:[hasKidsMode()]):S[k];
  if(!v.length) return 1; const key=v.slice().sort().join('+'); if(row[key]!=null) return row[key];
  const xs=v.map(o=>row[o]).filter(x=>x!=null); if(!xs.length) return null; return k==='intent'?Math.max(...xs):Math.min(1,xs.reduce((a,b)=>a+b,0));}
// Tract counts are stored per exact covering pattern (which of her cities are within the distance), so any set of cities
// counts each tract once. Within a pattern, the chain runs with each picked city's mix and keeps the one with the most
// people at the end (age by age), so adding a city or any pick can never lower the pool.
function chain(sx,c,base){const cx0={...CX}; CX.sx=sx; CX.c=c; const cur=D.G.map((g,i)=>base[i]*frac(g,21,80)), out=[], mon=memOn();
  ROWS.forEach(r=>{const before=cur.slice(); let mn=null;
    if(r.k==='age') D.G.forEach((g,i)=>{const f0=frac(g,21,80); cur[i]=f0?cur[i]*frac(g,S.amin,S.amax)/f0:0;});
    else if(r.k!=='city'&&!r.fixed){
      if(mon){mn=D.G.map((g,i)=>{if(!cur[i]) return 0; const m=memberRate(r.k,g); return m==null?NaN:cur[i]*m;});}
      D.G.forEach((g,i)=>cur[i]*=rate(r.k,g));}
    out.push({n:cur.slice(),mn,before});});
  Object.assign(CX,cx0); return out;}
function compute(){
  const ids=cityIds(), R_=ROWS.length, n=Array(R_).fill(0), bf=Array(R_).fill(0), mnum=Array(R_).fill(0), mok=Array(R_).fill(true), mon=memOn(); let start=0;
  SXS().forEach(sx=>{Object.entries(D.city.cnt[sx]).forEach(([pat,byR])=>{const cand=pat.split('+').filter(id=>ids.includes(id)); if(!cand.length) return;
    const base=byR[S.radius]||byR[30]; if(!base) return;
    const chs=cand.map(c=>chain(sx,c,base));
    D.G.forEach((g,i)=>{start+=base[i]*frac(g,21,80); let best=chs[0]; chs.forEach(ch=>{if(ch[R_-1].n[i]>best[R_-1].n[i]) best=ch;});
      best.forEach((st,j)=>{n[j]+=st.n[i]; bf[j]+=st.before[i]; if(st.mn){const v=st.mn[i]; if(Number.isNaN(v)) mok[j]=false; else mnum[j]+=v;}});});});});
  const steps=ROWS.map((r,j)=>{const before=j?n[j-1]:start; const member=(mon&&ROWS[j].k!=='city'&&ROWS[j].k!=='age'&&!r.fixed&&mok[j]&&bf[j]>0)?mnum[j]/bf[j]:null;
    return {r,n:n[j],before,keep:before?n[j]/before:1,member};});
  return {start,steps,final:steps.at(-1).n,members:mon?{count:MEM.count,preview:MEM.preview}:null};}
// Learn more: pool if one source of a blended rate were used ALONE (D.blend[k].parts[i].patch swaps in that source's table)
function setPath(p,v){const ks=p.split('.'); let o=D; ks.slice(0,-1).forEach(x=>o=o[x]); const last=ks.at(-1), old=o[last]; o[last]=v; return old;}
function alone(k,i){const pt=D.blend[k].parts[i].patch, old={}; for(const p in pt) old[p]=setPath(p,pt[p]); let c; try{c=compute();} finally{for(const p in old) setPath(p,old[p]);} return c;}
function width(n,start,min){min=min||24; const lo=40; const f=Math.max(0,Math.min(1,Math.log(Math.max(n,1)/lo)/Math.log(start/lo))); return min+(100-min)*f;}
const pct=k=>k>=0.995?'100%':k<0.01?'<1%':Math.round(k*100)+'%';
function memLine(st){return st&&st.member!=null?`IHBC members ${pct(st.member)} · studies ${pct(st.keep)}${MEM.preview?' · PREVIEW':''}`:'';}
function tryVal(k,v){const prev=S[k]; S[k]=v; const n=compute().final; S[k]=prev; return n;}
function tryMany(o){const prev={}; for(const k in o){prev[k]=S[k]; S[k]=o[k];} const c=compute(); for(const k in prev) S[k]=prev[k]; return c;}
const SOURCES='<b>YOUR REAL PREFERENCES</b> from your Oct 7, 2026 signup (6:24 PM CT; your most complete single signup), in your What Matters Most order. Every EDIT is the Sandbox 2 preferences input for that question (same wording and options). Partner preferences take several picks (Looking for, Want kids, Have kids, Ethnicity, Religion, Politics, Seeking, cities) except the minimum-style ones, which take one like the site’s dropdowns: Income, Degree and School tier (a pick = at least this). Your own answers take one; several picks count each group once. Seeking men, women or both: every step uses that sex’s rates; both = men + women. No signup has partner Intentions or Want kids saved, so your own answers stand in for them; Ethnicity, Have kids, Religion and Politics aren’t saved (Any); Education tier has no saved field yet. Counts are our estimates, not a live dating pool. Badges: <b>CENSUS</b> = direct ACS count, <b>CDC</b> = direct NHANES, <b>EST</b> = our blend of studies. '+
 '<b>How options add up:</b> each question’s survey answers are split into groups of people that don’t overlap; each site option counts the groups that would match it, and picking several counts each group once. No 50/50 splits. '+
 '<b>City + distance:</b> '+NOTES.city.slice(8)+'. <b>Age:</b> '+NOTES.age.slice(8)+'. <b>Intentions (EST):</b> '+NOTES.intent.slice(5)+'. <b>Want kids (EST):</b> '+NOTES.kids.slice(5)+'. <b>Height (CDC):</b> '+NOTES.height.slice(5)+'. <b>Degree, Income (CENSUS):</b> ACS 2020–24 PUMS, single men / women in the same area and age, counted together; $1M+ and up are EST (top-coded tail, Pareto). '+
 '<b>Unused until you turn them on:</b> Ethnicity (CENSUS, ACS PUMS); Have kids (EST, NSFG, within your Want kids groups); Religion (EST, GSS + Pew RLS); Education tier (EST, NCES IPEDS); Politics (EST, GSS 7-point). '+
 'Survey rates are national and assumed independent of each other, applied age by age. Each EST sheet has <b>Learn more</b>: the pool with each source alone vs blended. <b>IHBC member rates</b> show next to the study rate once 1,000 people have signed up (now '+D.members.count+', '+D.members.asOf+'). Full input list and mapping: <a href="pool_edit_inputs_grokbot.md" target="_blank" style="color:#c8f135">pool_edit_inputs_grokbot.md</a>; data table <a href="pool_mapping_grokbot.md" target="_blank" style="color:#c8f135">pool_mapping_grokbot.md</a>.';

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
.pf-tag.est{background:#FF7A2F}
.pf-lm{background:none;border:none;color:#c8f135;font:inherit;font-size:12px;text-decoration:underline;padding:6px 0 0;cursor:pointer}
.pf-single{font-size:10.5px;opacity:.75;margin:6px 0 0}
.pf-lmp{margin:6px 0 0;border:1px solid rgba(200,241,53,.4);border-radius:8px;max-height:46vh;overflow:auto;-webkit-overflow-scrolling:touch}
.pf-lmh{font-size:10.5px;line-height:1.4;padding:7px 9px;opacity:.85;border-bottom:1px solid rgba(240,236,224,.14)}
.pf-lmr{display:flex;gap:8px;justify-content:space-between;padding:7px 9px;border-bottom:1px solid rgba(240,236,224,.14);font-size:11px;line-height:1.35}
.pf-lmr .t{min-width:0;flex:1}.pf-lmr .t b{font-size:11.5px}.pf-lmr .t span{display:block;opacity:.75}
.pf-lmr .v{flex:none;text-align:right;white-space:nowrap}.pf-lmr .v b{font-family:'Bebas Neue',sans-serif;font-size:19px;font-weight:400;color:#c8f135;display:block;line-height:1}
.pf-lmr.bl{background:rgba(200,241,53,.12)}.pf-lmr.bl .v b{color:#c8f135}
.pf-lmr.one .v{opacity:.6}
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
  let body='', top='', lmOpen=false;
  // Learn more: one row per source of the blended rate, with the pool if that source were used alone; Blended = current
  const SINGLE={haskids:'Single source: CDC NSFG 2022–23 (men: EVBIOKID; women: PARITY).',pol:'Single source: GSS 2018–2024 polviews (7-point), by sex.',
    eth:'Single source: ACS 2020–24 PUMS (direct count).',edu:'Single source: ACS 2020–24 PUMS (direct count).',
    inc:'Single source: ACS 2020–24 PUMS; $1M+ and up = Pareto tail fitted to the same PUMS (one model, EST).',height:'CDC: NHANES measured (men: two survey cycles averaged; women: CDC/NCHS reference, 2018 + 2023 editions averaged).'};
  const learn=kk=>{const B=D.blend[kk]; if(!B) return SINGLE[kk]?`<p class="pf-single">${SINGLE[kk]}</p>`:'';
    let h=`<button type="button" class="pf-lm" data-lm="1">${lmOpen?'Hide sources':'Learn more · each source alone vs blended'}</button>`;
    if(lmOpen){const cur=compute();
      h+=`<div class="pf-lmp"><div class="pf-lmh">Blended rate: <b>${B.what}</b>. Each row: that source alone (ages it doesn’t cover keep the blend), with your current picks.</div>`+
      B.parts.map((p,i)=>{const c=alone(kk,i), st=c.steps.find(x=>x.r.k===kk); return `<div class="pf-lmr"><span class="t"><b>${p.name} ${p.year}</b><span>${p.base}</span><span>${p.own}</span><span>weight ${p.w}</span></span><span class="v"><b>≈ ${fmtR(c.final)}</b>keeps ${pct(st.keep)}</span></div>`;}).join('')+
      (B.parts.every((p,i)=>Math.abs(alone(kk,i).final-cur.final)<0.5)?`<div class="pf-lmh">With your current picks every source gives the same pool${kk==='intent'?': you picked Marriage and Relationship / Life partner, so how committed people split on wanting marriage doesn’t change who counts. Untick one to see them differ':''}.</div>`:'')+
      `<div class="pf-lmr bl"><span class="t"><b>Blended (what you see)</b><span>${B.blend}</span></span><span class="v"><b>≈ ${fmtR(cur.final)}</b>keeps ${pct(cur.steps.find(x=>x.r.k===kk).keep)}</span></div>`+
      (B.single?`<div class="pf-lmh">${B.single}</div>`:'')+`</div>`;}
    return h;};
  const ESTN={'1m':1,'2m':1,'3m':1};
  // multi-select list for one preference key (row numbers: + = pool if you add that pick, − = pool if you remove it)
  // single-select list (Income): each row = final pool if that option is the pick
  const slist=(kk,title)=>{const cur=S[kk][0]||'any';
    return `<label class="pf-lab">${title} <span class="pf-hint">(pick one · at least this · numbers = your pool with that pick)</span></label><div class="pf-list" data-sk="${kk}">${D[kk].opts.map(([id,l])=>{
      const lab=l+(kk==='inc'&&ESTN[id]?'<span class="pf-tag est">EST</span>':''), on=cur===id;
      return opt(id,lab,on,'round',(on?'<span class="pf-in">in</span> ':'')+(id==='any'||id==='none'?'no cut · ':'')+'≈ '+fmtR(tryVal(kk,id==='any'?[]:[id])));}).join('')}</div>`;};
  const mlist=(kk,title)=>{const cur=S[kk], nxt=id=>{let v=cur.includes(id)?cur.filter(x=>x!==id):cur.concat(id); if(RACE_PANEL[kk]){const it=D[kk].opts.map(o=>o[0]).filter(x=>x!=='any'&&x!=='none'); if(it.every(x=>v.includes(x))) v=[];} return v;};
    return `<label class="pf-lab">${title||ASK[kk][0]} <span class="pf-hint">(pick any · numbers = your pool if you add <b>+</b> or remove <b>−</b> that pick)</span></label><div class="pf-list" data-mk="${kk}">${D[kk].opts.map(([id,l])=>{
      const lab=l+(kk==='inc'&&ESTN[id]?'<span class="pf-tag est">EST</span>':'');
      if(id==='any') return opt(id,lab,!cur.length,'',!cur.length?'no cut · ≈ '+fmtR(compute().final):'no cut → ≈ '+fmtR(tryVal(kk,[])));
      const on=cur.includes(id), n=tryVal(kk,nxt(id)); return opt(id,lab,on,'',on?'<span class="pf-in">in</span> − ≈ '+fmtR(n)+(cur.length===1?' (Any)':''):'+ ≈ '+fmtR(n));}).join('')}</div>`;};
  const result=()=>{const c=compute(), st=c.steps.find(s=>s.r.k===k), ml=memLine(st);
    if(k==='city') return `<div class="pf-res"><span>${fmt(c.start)} ${seekN()} 21–80 within ${S.radius} mi</span><i>pool ≈ ${fmt(c.final)}</i></div>`;
    const keep=k==='tier'&&!S.tier.length?1:st.keep;
    return `<div class="pf-res"><span>Your pool <b>≈ ${fmtR(c.final)}</b></span><i>this step keeps ${pct(keep)}${ml?' · '+ml:''}</i></div>`;};
  const build=()=>{
    if(k==='city'){
      const ids=cityIds(), open=!(ids.length===1&&ids[0]===D.city.home), si=Math.max(0,STOPS.indexOf(S.radius)), sk=seekKey();
      const seekBtn=s=>{const on=s==='both'?sk==='both':sk==='both'||sk===s; const n=tryVal('seek',s==='both'?['men','women']:[s]); return `<button type="button" class="toggle-btn${on?' selected':''}" data-seek="${s}">${SEEK[s][2]}<br><small style="font-family:'Space Mono',monospace;font-size:10px;letter-spacing:0">≈ ${fmtR(n)}</small></button>`;};
      body=`<label class="pf-lab">Seeking <span class="pf-hint">(pick one or both · numbers = your pool)</span></label><div class="toggle-group">${['men','women','both'].map(seekBtn).join('')}</div>
        <label class="pf-lab">Distance from ${ids.length>1?'each of your cities':D.city.names[ids[0]]}</label>
        <div class="range-slider-wrap" data-dist="1"><div class="range-track"></div><div class="range-fill" style="left:0"></div><span class="slider-bubble b0">${S.radius} miles</span>
        <input type="range" class="range-input r0" min="0" max="${STOPS.length-1}" step="1" value="${si}" aria-label="Distance" style="pointer-events:auto"></div>
        <div class="pf-ends"><span>1 mile</span><span>300 miles</span></div>
        <label class="vk-cb"><input type="checkbox" id="pf-other"${open?' checked':''}> <span class="vk-cb-txt">I'm open to dating in other cities</span></label>
        ${open?`<label class="pf-lab">Partner cities <span class="pf-hint">(your signup cities · pick any · each area once)</span></label><div class="pf-list" data-mk="city">${D.city.ORDER.map(id=>{const on=ids.includes(id), nx=on?ids.filter(x=>x!==id):ids.concat(id); return opt(id,D.city.names[id]+(id===D.city.home?' · home':''),on,'',(on?'<span class="pf-in">in</span> − ≈ ':'+ ≈ ')+fmtR(tryVal('city',nx.length?nx:[D.city.home])));}).join('')}</div>`:''}`;
    } else if(k==='age'){
      const custom=!PRESET_AGES.some(([a,b])=>a===S.amin&&b===S.amax);
      const prow=(a,b)=>{const on=S.amin===a&&S.amax===b, n=tryMany({amin:a,amax:b}).final; return opt(a+'-'+b,`${a}–${b}${on?'<span class="pf-tag">yours</span>':''}${a===D.sel.amin&&b===D.sel.amax?'<span class="pf-tag sig">signup</span>':''}${a===21&&b===80?' · any age':''}`,on,'round','≈ '+fmtR(n));};
      body=`<label class="pf-lab">Age</label>${dual('age',A0,A1,S.amin,S.amax,v=>v)}
        <label class="pf-lab">Quick picks</label><div class="pf-list">${custom?prow(S.amin,S.amax):''}${PRESET_AGES.map(([a,b])=>prow(a,b)).join('')}</div>`;
    } else if(k==='height'){
      body=`<label class="pf-lab">Height</label>${dual('height',H0,H1,Math.max(H0,S.hmin),Math.min(H1,S.hmax),fmtIn)}
        <div class="pf-list">${opt('sig',`${fmtIn(D.sel.hmin)}–${fmtIn(D.sel.hmax)}<span class="pf-tag sig">signup</span>`,S.hmin===D.sel.hmin&&S.hmax===D.sel.hmax,'round')}${opt('any','Any height',S.hmin<=H0&&S.hmax>=H1,'round')}</div>`;
    } else if(k==='edu'||k==='tier'){
      body=slist('edu','Degree')+`<p class="pf-flag">One pick, a minimum degree: Bachelor’s+ already includes Master’s+ and Doctorate+. Any or None Stated = no degree cut.</p>`+learn('edu')+slist('tier','School tier')+`<p class="pf-flag">One pick: Top 100 already includes Top 50 and Ivy+.</p>`+learn('tier');
    } else if(k==='inc'){
      body=slist('inc','Income')+`<p class="pf-flag">One pick, like the site’s minimum-income dropdown: a pick means at least that much. <b>$1M+, $2M+, $3M+ are EST</b>: the Census top-codes the highest incomes, so these extend the $300k–$500k curve (Pareto). None Stated = no income cut.</p>`+learn('inc');
    } else { // multi-select lists: intent, kids, haskids (WMM lists) and eth / relig / pol (race panels)
      body=mlist(k);
      if(k==='kids') body+=`<p class="pf-flag"><b>Yes</b> = people who want kids + people open to either (the survey’s Not sure); <b>No</b> = people who don’t want kids (Not sure is not counted); <b>Open to either</b> = all three groups; <b>Unsure</b> = Not sure only. Each group counts once. Checked boxes are your own answer until partner picks are saved.</p>`;
      if(k==='haskids') body+=`<p class="pf-flag">Pick both = no cut. Uses the Want kids groups you accept.</p>`;
      if(k==='intent') body+=`<p class="pf-flag">Checked boxes are your own Looking-for answers until partner picks are saved; percentages come from Pew 2022 + SIA 2026 + AEI.</p>`;
      if(k==='pol') body+=`<p class="pf-flag">Apolitical uses the GSS “no answer / don’t know” share (stand-in). None Stated adds no one.</p>`;
      if(k==='eth'||k==='relig') body+=`<p class="pf-flag">None Stated adds no one: the survey has no “not stated” group.</p>`;
      body+=learn(k);
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
    // Seeking: MEN / WOMEN toggle on and off (at least one stays on); BOTH = both on (all three show selected)
    wrap.querySelectorAll('[data-seek]').forEach(b=>b.onclick=()=>{const v=b.dataset.seek, cur=SXS().map(x=>x==='m'?'men':'women');
      if(v==='both') S.seek=['men','women']; else {const nx=cur.includes(v)?cur.filter(x=>x!==v):cur.concat(v); if(nx.length) S.seek=nx;}
      build(); ch();});
    const oc=wrap.querySelector('#pf-other'); if(oc) oc.onchange=()=>{S.city=oc.checked?D.city.ORDER.slice():[D.city.home]; build(); ch();};
    const lm=wrap.querySelector('[data-lm]'); if(lm) lm.onclick=()=>{lmOpen=!lmOpen; build(); const p=wrap.querySelector('.pf-lmp'); if(p) p.scrollIntoView({block:'nearest'});};
    wrap.querySelectorAll('.race-opt[data-id]:not([disabled])').forEach(b=>b.onclick=()=>{const id=b.dataset.id, mk=(b.closest('[data-mk]')||{}).dataset;
      const kk=mk&&mk.mk, sk=(b.closest('[data-sk]')||{dataset:{}}).dataset.sk;
      if(sk) S[sk]=id==='any'?[]:[id];
      else if(kk==='city'){const a=cityIds(); S.city=a.includes(id)?a.filter(x=>x!==id):a.concat(id); if(!S.city.length) S.city=[D.city.home];}
      else if(k==='age'){const [a,z]=id.split('-').map(Number); S.amin=a; S.amax=z;}
      else if(k==='height'){if(id==='any'){S.hmin=H0; S.hmax=H1;} else {S.hmin=D.sel.hmin; S.hmax=D.sel.hmax;}}
      else if(kk){ // multi: Any is exclusive; picking anything else clears Any; empty = Any
        if(id==='any') S[kk]=[]; else S[kk]=S[kk].includes(id)?S[kk].filter(x=>x!==id):S[kk].concat(id);
        if(RACE_PANEL[kk]){const items=D[kk].opts.map(o=>o[0]).filter(x=>x!=='any'&&x!=='none'); if(items.every(x=>S[kk].includes(x))) S[kk]=[];} }
      build(); ch();});
    wrap.querySelector('.pe-x').onclick=wrap.querySelector('.pe-done').onclick=wrap.querySelector('.pe-back').onclick=()=>{close(); ch();};
  }
  build(); document.body.appendChild(wrap); requestAnimationFrame(()=>wrap.classList.add('show'));
}
function close(){const w=document.getElementById('pe-sheet'); if(w) w.remove();}
window.PoolEngine={alone,cityIds,SXS,seekKey,peopleN,eduK,incK,tierK,incEst,lowest,CX,fmtR,D,S,ROWS,SRC,NOTES,SOURCES,ASK,compute,width,openEdit,close,fmt,pct,memLine,memOn,setMembers,MEM,optL,multiL,kidsL,hL,fmtIn,isAny,tryVal,tryMany,cityName,seekL,seekN,startSub,firstName,poss,poolTitle,fitFont,rate,accepted};
})();
