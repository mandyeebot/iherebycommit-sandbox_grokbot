// Checks every + / − row number on the remaining multi-select sheets: with picks in place, '+' (add) is never below the
// current pool and '−' (remove) never above it. From Any (no picks) a first pick replaces Any, so it can only cut.
global.window={};global.location={search:''};const dir=process.argv[2];require(dir+'/your-pool-real-data_grokbot.js');require(dir+'/your-pool-engine_grokbot.js');
const E=window.PoolEngine,D=E.D,S=E.S,base=JSON.parse(JSON.stringify(S));let bad=0,n=0;const A=D.city.ORDER.slice();
const ctxs=[{},{seek:['women'],hmin:58,hmax:84},{seek:['men','women']},{city:A},{intent:['committed'],kids:['yes','open'],eth:['white','asian'],relig:['catholic','jewish'],pol:['mod','lleft'],haskids:['no']},
 {seek:['women'],hmin:58,hmax:84,intent:['either'],kids:['no'],eth:['hisp'],relig:['none','christian'],pol:['right'],haskids:['yes'],city:['nyc','bk']}];
for(const c of ctxs){Object.assign(S,JSON.parse(JSON.stringify(base)),JSON.parse(JSON.stringify(c)));const cur=E.compute().final;
 for(const k of ['kids','haskids','eth','relig','pol','city','seek']){if(!S[k].length) continue; const ids=k==='city'?A:D[k].opts.map(o=>o[0]).filter(x=>x!=='any');
  for(const id of ids){const on=S[k].includes(id);const nx=on?S[k].filter(x=>x!==id):S[k].concat(id);if(!nx.length)continue;const v=E.tryVal(k,nx);n++;if(on?v>cur+1e-9:v<cur-1e-9){bad++;console.log('BAD',k,id,on,cur,v)}}}}
console.log('row-number check: '+n+' add/remove rows on kids, haskids, eth, relig, pol, cities, seeking in '+ctxs.length+' contexts; '+bad+' wrong');
