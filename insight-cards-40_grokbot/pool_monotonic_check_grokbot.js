// Monotonic check: for every multi-select step, adding an option to any pick set never lowers the step's kept share
// or the final pool (unrounded). Run: node pool_monotonic_check_grokbot.js <dir with data+engine>
const dir=process.argv[2]||'.'; global.window={}; global.location={search:''};
require(dir+'/your-pool-real-data_grokbot.js'); require(dir+'/your-pool-engine_grokbot.js');
const E=window.PoolEngine, S=E.S, D=E.D; const base=JSON.parse(JSON.stringify(S));
const ctx=[{},{amin:25,amax:35},{amin:41,amax:42},{city:'all',radius:50},{relig:['catholic'],pol:['mod'],eth:['white'],haskids:'no',tier:'top100'}];
const norm=(k,v)=>{if(['eth','relig','pol'].includes(k)){const it=D[k].opts.map(o=>o[0]).filter(x=>x!=='any'&&x!=='none'); if(it.every(x=>v.includes(x))) return [];} return v;};
let tests=0, fails=[];
for(const k of ['intent','kids','eth','relig','pol']){
  const ids=D[k].opts.map(o=>o[0]).filter(x=>x!=='any'), N=ids.length;
  for(const c of ctx){ Object.assign(S,JSON.parse(JSON.stringify(base)),JSON.parse(JSON.stringify(c)));
    const val=v=>{const prev=S[k]; S[k]=norm(k,v); const r=E.compute(); S[k]=prev; return {fin:r.final, keep:r.steps.find(s=>s.r.k===k).keep};};
    const anyV=val([]);
    for(let m=1;m<(1<<N);m++){ const set=ids.filter((_,i)=>m>>i&1), v0=val(set);
      if(v0.fin>anyV.fin*(1+1e-9)+1e-9){fails.push([k,JSON.stringify(c),'Any < '+set.join('+')]);}
      for(let i=0;i<N;i++){ if(m>>i&1) continue; tests++; const v1=val(set.concat(ids[i]));
        if(v1.fin<v0.fin*(1-1e-9)-1e-9||v1.keep<v0.keep-1e-12) fails.push([k,JSON.stringify(c),set.join('+')+' + '+ids[i],v0.fin,v1.fin]); } } } }
console.log('monotonic check:',tests,'add-one-option comparisons over every subset of intent, kids, eth, relig, pol in',ctx.length,'contexts;',fails.length,'failures'); fails.slice(0,10).forEach(f=>console.log(' FAIL',f));
process.exit(fails.length?1:0);
