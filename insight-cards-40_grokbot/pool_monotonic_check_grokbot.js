// Monotonic check (v6): for EVERY multi-select partner preference (Seeking, partner cities, Intentions, Want kids, Have kids,
// Degree, School tier, Income, Ethnicity, Religion, Politics), adding one option to any pick set never lowers the step's kept
// share or the final pool (unrounded), and Any (no pick) is never below a pick set. Contexts include women, both, all cities.
// Run: node pool_monotonic_check_grokbot.js <dir with data+engine>
const dir=process.argv[2]||'.'; global.window={}; global.location={search:''};
require(dir+'/your-pool-real-data_grokbot.js'); require(dir+'/your-pool-engine_grokbot.js');
const E=window.PoolEngine, S=E.S, D=E.D; const base=JSON.parse(JSON.stringify(S));
const ALL=D.city.ORDER.slice();
const ctx=[{},{amin:25,amax:35},{amin:41,amax:42},{seek:['women'],hmin:58,hmax:84},{seek:['men','women']},{city:ALL,radius:50},{city:['nyc','bk'],seek:['men','women'],radius:10},
  {relig:['catholic'],pol:['mod'],eth:['white'],haskids:['no'],tier:['top100'],inc:['500000']},{seek:['women'],inc:['1m'],edu:['ma'],city:['la','chi']}];
const norm=(k,v)=>{if(['eth','relig','pol'].includes(k)){const it=D[k].opts.map(o=>o[0]).filter(x=>x!=='any'&&x!=='none'); if(it.every(x=>v.includes(x))) return [];} return v;};
const KEYS={seek:D.seek.opts.map(o=>o[0]),city:ALL};
let tests=0, fails=[]; const per={};
for(const k of ['seek','city','intent','kids','haskids','edu','tier','inc','eth','relig','pol']){
  const ids=KEYS[k]||D[k].opts.map(o=>o[0]).filter(x=>x!=='any'), N=ids.length; per[k]=0;
  for(const c of ctx){ Object.assign(S,JSON.parse(JSON.stringify(base)),JSON.parse(JSON.stringify(c)));
    const val=v=>{const prev=S[k]; S[k]=norm(k,v); const r=E.compute(); S[k]=prev; const st=r.steps.find(s=>s.r.k===k); return {fin:r.final, keep:st?st.keep:1};};
    const anyV=k==='city'?null:val([]);
    for(let m=1;m<(1<<N);m++){ const set=ids.filter((_,i)=>m>>i&1), v0=val(set);
      if(anyV&&v0.fin>anyV.fin*(1+1e-9)+1e-9) fails.push([k,JSON.stringify(c),'Any < '+set.join('+')]);
      for(let i=0;i<N;i++){ if(m>>i&1) continue; tests++; per[k]++; const v1=val(set.concat(ids[i]));
        if(v1.fin<v0.fin*(1-1e-9)-1e-9||v1.keep<v0.keep-1e-12) fails.push([k,JSON.stringify(c),set.join('+')+' + '+ids[i],v0.fin,v1.fin,v0.keep,v1.keep]); } } } }
console.log('monotonic check v6:',tests,'add-one-option comparisons over every subset of',Object.keys(per).join(', '),'in',ctx.length,'contexts (men, women, both, several cities);',fails.length,'failures'); console.log(' per step:',JSON.stringify(per)); const byK={}; fails.forEach(f=>byK[f[0]+' '+f[1]]=(byK[f[0]+' '+f[1]]||0)+1); console.log(byK); fails.slice(0,10).forEach(f=>console.log(' FAIL',f));
process.exit(fails.length?1:0);
