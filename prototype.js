const BIKES = [
  ['pulse','PULSE / CYAN','COMMON',0],['streamline','STREAMLINE','RARE',75],['vela','VELA','RARE',100],['sugarrush','SUGAR RUSH','RARE',135],
  ['ion','ION','EPIC',150],['manta','MANTA','EPIC',450],['verdant','VERDANT','EPIC',550],['arcade','ARCADE','EPIC',690],
  ['solaris','SOLARIS','LEGENDARY',220],['phoenix','PHOENIX','LEGENDARY',950],['magma','MAGMA','LEGENDARY',1200],
  ['singularity','SINGULARITY','MYTHIC',2400],['astralis','ASTRALIS','MYTHIC',2800],['drake','DRAKE','MYTHIC',3400],['interstellar','INTERSTELLAR','MYTHIC',3100],['angelica','ANGELICA','MYTHIC',3300]
].map(([id,name,rarity,price])=>({id,name,rarity,price,img:`assets/bikes/${id}.png`}));
const BRAINROTS = [
  ['SixSeven','67 / PRISM','COMMON'],['TralaleroTralala','Tralalero Tralala','COMMON'],['BananaBot','Tung Tung Tung Sahur','COMMON'],['ToasterGoblin','Ballerina Cappuccina','COMMON'],
  ['CactusDude','Lirilì Larilà','COMMON'],['FishWalker','Trippi Troppi','COMMON'],['EspressoNinja','Cappuccino Assassino','RARE'],['CrocRocket','Bombardiro Crocodilo','RARE'],
  ['PigeonBoss','Bombombini Gusini','RARE'],['SharkBusinessman','Boneca Ambalabu','EPIC'],['BananaOverlord','Chimpanzini Bananini','MYTHIC'],['CosmicCapybara','Brr Brr Patapim','MYTHIC'],
  ['StrawberryCow','Mucca Strawberry','RARE'],['VolpinaVoltVolt','Volpina Volt Volt','EPIC'],['PolpoPrismotto','Polpo Prismotto','EPIC'],['FungoBassolino','Fungo Bassolino','COMMON'],
  ['PinguinoMagnetino','Pinguino Magnetino','RARE'],['LumacaCometina','Lumaca Cometina','LEGENDARY'],['RamenMeteorino','Ramen Meteorino','RARE'],['SemaforinoSprint','Semaforino Sprint','COMMON']
].map(([id,name,rarity])=>({id,name,rarity,img:`assets/brainrots/${id}.png`}));
const TRAILS = [
  {id:'clean',name:'PURE SIGNAL',rarity:'COMMON',price:0,color:'#7ddaf8'},
  {id:'pinstripe',name:'PINSTRIPE',rarity:'COMMON',price:90,color:'#f4d6f5'},
  {id:'circuit',name:'CIRCUIT TRACE',rarity:'COMMON',price:160,color:'#63f6da'},
  {id:'comet',name:'COMET MARK',rarity:'RARE',price:3100,color:'#ffd66b'},
  {id:'ember',name:'EMBER SEAM',rarity:'EPIC',price:10000,color:'#ff804c'},
  {id:'halo',name:'HALO NOTCH',rarity:'EPIC',price:21000,color:'#fff4ad'}
];
const BUNDLES = [
  {id:'candy_run',name:'SUGAR RUSH',bike:'sugarrush',trail:'pinstripe',color:'#f47bbf'},
  {id:'arcade_drive',name:'ARCADE DRIVE',bike:'arcade',trail:'circuit',color:'#4ce3f2'},
  {id:'magma_forge',name:'MAGMA FORGE',bike:'magma',trail:'ember',color:'#ff844f'},
  {id:'interstellar',name:'INTERSTELLAR',bike:'interstellar',trail:'comet',color:'#a794ff'},
  {id:'angelic_light',name:'ANGELIC LIGHT',bike:'angelica',trail:'halo',color:'#ffe3a2'}
];
const EGGS = [
  {id:'pulse',name:'PULSE PEARL',texture:'assets/eggs/pulse-pearl-candy-2026-09-29.png',desc:'Ingresso alla collezione'},
  {id:'ember',name:'EMBER NEST',texture:'assets/eggs/ember-nest-lava-2026-09-29.png',desc:'Pool di rarità più alte'},
  {id:'astral',name:'ASTRAL RIFT',texture:'assets/eggs/astral-rift-galaxy-2026-09-29.png',desc:'Rotazione cosmica'},
  {id:'seraph',name:'SKYLINE SERAPH',texture:'assets/eggs/skyline-seraph-gold-2026-09-29.png',desc:'Rotazione Royal'}
];
const RIDERS = [
  {id:'NEON_NOVA',initial:'N',status:'Royal Rider · Lv 31',bike:'interstellar',brainrot:'VolpinaVoltVolt'},
  {id:'LUNA_VOLT',initial:'L',status:'Founder · Lv 27',bike:'angelica',brainrot:'ToasterGoblin'},
  {id:'KAI_ARCADE',initial:'K',status:'Rider · Lv 18',bike:'arcade',brainrot:'SixSeven'}
];

const state={
  page:'home',category:'bikes',wallet:12450,bike:'pulse',brainrot:'TralaleroTralala',trail:'clean',
  ownedBikes:new Set(['pulse','magma']),ownedBrainrots:new Set(['TralaleroTralala','BananaBot','ToasterGoblin','SixSeven']),ownedTrails:new Set(['clean']),
  battleResult:false,royalClaimed:false,tradeStep:0,tradeOffer:'BananaBot',tradeRider:'NEON_NOVA',modal:null
};
const stage=document.getElementById('stage');
const modalRoot=document.getElementById('modal-root');
const money=value=>new Intl.NumberFormat('it-IT').format(value);
const findBike=id=>BIKES.find(x=>x.id===id);
const findBrainrot=id=>BRAINROTS.find(x=>x.id===id);
const findTrail=id=>TRAILS.find(x=>x.id===id);
const findRider=id=>RIDERS.find(x=>x.id===id);
const rarity=value=>`<span class="rarity ${value}">${value}</span>`;
const icon=id=>`<img src="icons/${id}.svg" alt="">`;
const bundlePrice=b=>Math.round(((state.ownedBikes.has(b.bike)?0:findBike(b.bike).price)+(state.ownedTrails.has(b.trail)?0:findTrail(b.trail).price))*.82);

function pageHead(label,title,description,note=''){
  return `<header class="page-head"><div><span class="eyebrow">${label}</span><h2>${title}</h2><p>${description}</p></div>${note?`<span class="right-note">${note}</span>`:''}</header>`;
}

function home(){
  const currentBike=findBike(state.bike),currentBrainrot=findBrainrot(state.brainrot);
  return `<section class="hero"><div class="hero-copy"><span class="eyebrow">CENTRAL PLAZA / PRONTO A PARTIRE</span><h2>LA CITTÀ<br>TI ASPETTA.</h2><p>La prossima gara è a un tocco. Il tuo equipaggiamento è pronto.</p><div class="button-row"><button class="btn" data-page="battle">▶ GIOCA ORA</button></div></div><img class="hero-bike" src="${currentBike.img}" alt="Moto equipaggiata: ${currentBike.name}"><div class="hero-companion"><img src="${currentBrainrot.img}" alt="Brainrot equipaggiato: ${currentBrainrot.name}"><small>${currentBrainrot.name}</small></div></section>
  <div class="home-bottom"><div class="card card-pad loadout"><div><span class="mini">EQUIPAGGIAMENTO ATTUALE</span><h3>${currentBike.name} <span class="muted">+ ${currentBrainrot.name}</span></h3><p>Vuoi cambiare? Tutti gli oggetti sono nella Collezione.</p></div><button class="text-btn" data-page="collection">Apri Collezione →</button></div><div class="card card-pad objective"><span class="mini">PROSSIMO OBIETTIVO</span><h3>Completa 3 gare</h3><p>1 / 3 · 120 Coins demo</p><div class="progress" style="--fill:33%"><i></i></div></div></div>`;
}

function itemCard(type,item){
  let art='',owned=false,status='';
  if(type==='bike'){art=`<img src="${item.img}" alt="Render Tripo ${item.name}" loading="lazy">`;owned=state.ownedBikes.has(item.id);status=item.id===state.bike?'EQUIPAGGIATA':owned?'POSSEDUTA':item.price===0?'GRATUITA':`${money(item.price)} COINS`}
  if(type==='brainrot'){art=`<img src="${item.img}" alt="Render Tripo ${item.name}" loading="lazy">`;owned=state.ownedBrainrots.has(item.id);status=item.id===state.brainrot?'EQUIPAGGIATO':owned?'POSSEDUTO':'DA SCOPRIRE'}
  if(type==='trail'){art=`<div class="trail-art" style="--trail-color:${item.color}"></div>`;owned=state.ownedTrails.has(item.id);status=item.id===state.trail?'EQUIPAGGIATA':owned?'POSSEDUTA':`${money(item.price)} COINS`}
  if(type==='egg'){art=`<div class="egg-art" style="--egg:url('${item.texture}')"></div>`;status='VEDI DETTAGLI'}
  if(type==='bundle'){art=`<img src="${findBike(item.bike).img}" alt="Moto Tripo ${findBike(item.bike).name}" loading="lazy">`;status=bundlePrice(item)?`${money(bundlePrice(item))} COINS`:'COMPLETO'}
  return `<button class="item-card ${type==='brainrot'?'brainrot':''}" data-detail="${type}:${item.id}" data-name="${item.name.toLocaleLowerCase('it')}" ${item.rarity?`data-rarity="${item.rarity}"`:''}><div class="item-art ${type==='bundle'?'bundle-art':''}" ${type==='bundle'?`style="--bundle:${item.color}"`:''}>${art}<span class="state-chip">${status}</span></div><div class="item-body">${item.rarity?rarity(item.rarity):`<span class="mini">${type==='bundle'?'MOTO + SCIA':type==='egg'?'UOVO':''}</span>`}<strong>${item.name}</strong><small>${type==='bundle'?`${findBike(item.bike).name} + ${findTrail(item.trail).name}`:type==='egg'?item.desc:type==='trail'?'Scia cosmetica':type==='brainrot'?'Brainrot Tripo':'Moto Tripo'}</small></div></button>`;
}

function collection(){
  const categories=[['bikes','Moto',BIKES],['brainrots','Brainrot',BRAINROTS],['trails','Scie',TRAILS],['eggs','Uova',EGGS],['bundles','Bundle',BUNDLES]];
  const chosen=categories.find(x=>x[0]===state.category)||categories[0];
  const singular={bikes:'bike',brainrots:'brainrot',trails:'trail',eggs:'egg',bundles:'bundle'}[chosen[0]];
  return pageHead('UN SOLO POSTO PER TUTTI GLI OGGETTI','Collezione','Guarda un oggetto, scopri come ottenerlo e gestiscilo dalla sua scheda.',`${chosen[2].length} ${chosen[1].toLowerCase()}`)+
    `<div class="collection-intro"><div>${icon('equip')}<span><strong>Equipaggiati</strong><small>${findBike(state.bike).name} · ${findBrainrot(state.brainrot).name} · ${findTrail(state.trail).name}</small></span></div></div>
    <div class="category-tabs" role="tablist" aria-label="Categorie della Collezione">${categories.map(([id,label])=>`<button class="category-tab ${state.category===id?'active':''}" role="tab" aria-selected="${state.category===id}" data-category="${id}">${label}</button>`).join('')}</div>
    <div class="collection-tools"><span>Seleziona una card per dettagli e azioni.</span><input class="search" id="item-search" type="search" placeholder="Cerca ${chosen[1].toLowerCase()}" aria-label="Cerca nella categoria"></div>
    <div class="asset-grid" id="item-grid">${chosen[2].map(item=>itemCard(singular,item)).join('')}</div>`;
}

function social(){
  return pageHead('PILOTI VICINI','Social','Apri un profilo per vedere l’equipaggiamento del rider. Da lì puoi provare uno scambio.')+
    `<p class="social-hint"><strong>Un percorso:</strong> scegli rider → controlla il profilo → proponi scambio.</p><div class="social-list">${RIDERS.map(r=>`<div class="rider card"><span class="avatar">${r.initial}</span><span class="rider-main"><strong>${r.id}</strong><small>${r.status}</small></span><button class="btn secondary small" data-rider="${r.id}">VEDI PROFILO</button></div>`).join('')}</div>`;
}

function progress(){
  return pageHead('IL TUO PERCORSO','Progressi','Missioni e stato del rider in un’unica schermata. Eventi, Royal e classifica sono qui quando servono.')+
    `<div class="progress-layout"><div class="card card-pad"><span class="mini">OSCAR / RIDER LV 23</span><h3>Prossimo livello</h3><p>XP 720 / 1.000 · progresso dimostrativo</p><div class="progress" style="--fill:72%;margin:14px 0 20px"><i></i></div><span class="mini">MISSIONI DI OGGI</span>
      ${[['play-gate','Completa 3 gare','1 / 3 · 120 Coins','33%'],['boost','Usa Boost 5 volte','3 / 5 · 70 XP','60%'],['inspect','Visita il profilo di un rider','0 / 1 · 50 Coins','0%']].map(([ic,name,desc,fill])=>`<div class="mission-row">${icon(ic)}<div><strong>${name}</strong><small>${desc}</small><div class="progress" style="--fill:${fill}"><i></i></div></div></div>`).join('')}</div>
      <div class="more-sections"><details class="fold"><summary>Evento · Core Crash</summary><div class="fold-content">Evento dimostrativo. Qui appariranno obiettivo e ricompense quando l’evento sarà attivo.</div></details><details class="fold"><summary>Royal e Founder</summary><div class="fold-content">Royal e Founder rimangono riconoscibili come stati distinti. <button class="text-btn" data-action="royal-claim">${state.royalClaimed?'Ricompensa demo riscattata':'Riscatta ricompensa demo →'}</button></div></details><details class="fold"><summary>Classifica</summary><div class="fold-content">${[['01','NEON_NOVA','18.400'],['02','LUNA_VOLT','16.920'],['03','OSCAR','15.650']].map(([pos,name,points])=>`<div class="rank-line"><span>${pos} · ${name}</span><b>${points}</b></div>`).join('')}</div></details></div></div>`;
}

function battle(){
  if(state.battleResult)return pageHead('RISULTATO / DEMO','Fine gara','Una conclusione breve: posizione e ricompensa, poi la prossima scelta.')+
    `<div class="card result"><span class="eyebrow">POSIZIONE FINALE</span><h3>#03 / 08</h3><p>+120 Coins · +70 XP · progresso missioni aggiornato nella demo</p><div class="button-row" style="justify-content:center;margin-top:22px"><button class="btn" data-action="battle-again">RIGIOCA</button><button class="btn secondary" data-page="progress">VEDI PROGRESSI</button></div></div>`;
  return pageHead('ANTEPRIMA HUD','Arena','Solo le informazioni necessarie alla gara: tempo, posizione, rider vivi e Boost.')+
    `<div class="battle"><img src="${findBike(state.bike).img}" alt="Moto Tripo equipaggiata"><div class="hud-clock"><b>04:32</b><small>6 RIDER VIVI</small></div><button class="btn secondary small battle-control" data-action="battle-finish">SIMULA FINE GARA →</button><div class="hud-pos">#03 / 08</div><div class="hud-boost">⚡ BOOST 80%</div></div><p class="muted" style="font-size:11px;margin:11px 0">La gara reale si svolge in Roblox; qui stai valutando solo la proposta UI.</p><button class="text-btn" data-page="home">← Torna a Gioca</button>`;
}

const pages={home,collection,social,progress,battle};
function render(){
  document.querySelectorAll('.nav-item').forEach(el=>{const active=el.dataset.page===(state.page==='battle'?'home':state.page);el.classList.toggle('active',active);el.setAttribute('aria-current',active?'page':'false')});
  document.body.classList.toggle('in-battle',state.page==='battle');
  document.getElementById('wallet').textContent=money(state.wallet);
  stage.innerHTML=pages[state.page]();
}
function go(page,category){
  if(!pages[page])return;
  state.page=page;
  if(category)state.category=category;
  render();
  const params=new URLSearchParams();params.set('page',page);if(page==='collection')params.set('category',state.category);
  history.replaceState(null,'',`?${params}`);
  stage.scrollIntoView({behavior:'smooth',block:'nearest'});
}
function toast(message){const el=document.getElementById('toast');el.textContent=message;el.hidden=false;clearTimeout(toast.timer);toast.timer=setTimeout(()=>el.hidden=true,3300)}
function openModal(title,content){
  state.modal=true;
  modalRoot.innerHTML=`<section class="modal" role="dialog" aria-modal="true" aria-label="${title}"><div class="modal-header"><div><span class="eyebrow">NEON SURVIVORS / DETTAGLIO</span><h2>${title}</h2></div><button class="close" data-action="close-modal" aria-label="Chiudi">✕</button></div><div class="modal-body">${content}</div></section>`;
  modalRoot.hidden=false;document.body.style.overflow='hidden';modalRoot.querySelector('.close').focus();
}
function closeModal(){state.modal=null;modalRoot.hidden=true;modalRoot.innerHTML='';document.body.style.overflow=''}
function fact(label,value){return `<div class="fact"><span>${label}</span><b>${value}</b></div>`}

function showDetail(type,id){
  state.modal={type,id};
  let name,art,copy,facts,actions;
  if(type==='bike'){
    const x=findBike(id),owned=state.ownedBikes.has(id),equipped=state.bike===id;
    name=x.name;art=`<img src="${x.img}" alt="Render Tripo di ${x.name}">`;copy=`${rarity(x.rarity)}<p>Scegli la moto da portare nella prossima gara.</p>`;
    facts=fact('Stato',equipped?'Equipaggiata':owned?'Posseduta':'Da ottenere')+fact('Prezzo',x.price?`${money(x.price)} Coins`:'Gratuita');
    actions=equipped?`<button class="btn" disabled>EQUIPAGGIATA</button>`:`<button class="btn" data-item-action="${owned?'equip':'buy'}:bike:${id}">${owned?'EQUIPAGGIA':`ACQUISTA · ${money(x.price)} COINS`}</button>`;
  }else if(type==='brainrot'){
    const x=findBrainrot(id),owned=state.ownedBrainrots.has(id),equipped=state.brainrot===id;
    name=x.name;art=`<img src="${x.img}" alt="Render Tripo di ${x.name}">`;copy=`${rarity(x.rarity)}<p>Se lo possiedi, puoi sceglierlo come compagno nella lobby.</p>`;
    facts=fact('Stato',equipped?'Equipaggiato':owned?'Posseduto':'Da scoprire')+fact('Categoria','Brainrot');
    actions=equipped?`<button class="btn" disabled>EQUIPAGGIATO</button>`:owned?`<button class="btn" data-item-action="equip:brainrot:${id}">EQUIPAGGIA</button>`:`<button class="btn" disabled>DA SCOPRIRE</button>`;
  }else if(type==='trail'){
    const x=findTrail(id),owned=state.ownedTrails.has(id),equipped=state.trail===id;
    name=x.name;art=`<div class="trail-art" style="--trail-color:${x.color}"></div>`;copy=`${rarity(x.rarity)}<p>Personalizza la scia della tua moto.</p>`;
    facts=fact('Stato',equipped?'Equipaggiata':owned?'Posseduta':'Da ottenere')+fact('Prezzo',x.price?`${money(x.price)} Coins`:'Gratuita');
    actions=equipped?`<button class="btn" disabled>EQUIPAGGIATA</button>`:`<button class="btn" data-item-action="${owned?'equip':'buy'}:trail:${id}">${owned?'EQUIPAGGIA':`ACQUISTA · ${money(x.price)} COINS`}</button>`;
  }else if(type==='egg'){
    const x=EGGS.find(e=>e.id===id);name=x.name;art=`<div class="egg-art" style="--egg:url('${x.texture}');transform:scale(1.55)"></div>`;
    copy=`<span class="mini">UOVO / ANTEPRIMA</span><p>${x.desc}. Esplora i Brainrot della collezione.</p>`;facts=fact('Contenuto','Pool Brainrot')+fact('Probabilità','Da definire nel gioco');
    actions=`<button class="btn secondary" data-action="see-brainrots">SFOGLIA BRAINROT</button>`;
  }else if(type==='bundle'){
    const x=BUNDLES.find(b=>b.id===id),cost=bundlePrice(x),bike=findBike(x.bike),trail=findTrail(x.trail);
    name=x.name;art=`<img src="${bike.img}" alt="Render Tripo di ${bike.name}">`;copy=`<span class="mini">BUNDLE GARANTITO</span><p>Contiene una moto e una scia garantite. Il prezzo si aggiorna se possiedi già uno dei due oggetti.</p>`;
    facts=fact('Moto',`${bike.name}${state.ownedBikes.has(x.bike)?' · posseduta':''}`)+fact('Scia',`${trail.name}${state.ownedTrails.has(x.trail)?' · posseduta':''}`)+fact('Prezzo demo',cost?`${money(cost)} Coins`:'Completo');
    actions=cost?`<button class="btn" data-item-action="buy:bundle:${id}">ACQUISTA · ${money(cost)} COINS</button>`:`<button class="btn" disabled>GIÀ COMPLETO</button>`;
  }else return;
  openModal(name,`<div class="detail"><div class="detail-art">${art}</div><div class="detail-copy">${copy}<div class="fact-list">${facts}</div><div class="detail-actions button-row">${actions}</div></div></div>`);
  state.modal={type,id};
}

function itemAction(action,type,id){
  if(action==='buy'){
    let cost=0;
    if(type==='bike')cost=findBike(id).price;
    if(type==='trail')cost=findTrail(id).price;
    if(type==='bundle')cost=bundlePrice(BUNDLES.find(x=>x.id===id));
    if(cost>state.wallet){toast('Coins demo insufficienti.');return}
    state.wallet-=cost;
    if(type==='bike')state.ownedBikes.add(id);
    if(type==='trail')state.ownedTrails.add(id);
    if(type==='bundle'){const b=BUNDLES.find(x=>x.id===id);state.ownedBikes.add(b.bike);state.ownedTrails.add(b.trail)}
    toast('Aggiunto alla Collezione della demo.');
  }else if(action==='equip'){
    if(type==='bike'&&state.ownedBikes.has(id))state.bike=id;
    if(type==='brainrot'&&state.ownedBrainrots.has(id))state.brainrot=id;
    if(type==='trail'&&state.ownedTrails.has(id))state.trail=id;
    toast('Equipaggiamento aggiornato nella demo.');
  }
  render();showDetail(type,id);
}

function showRider(id){
  const rider=findRider(id);if(!rider)return;
  openModal(rider.id,`<div class="rider card" style="margin-bottom:13px"><span class="avatar">${rider.initial}</span><span class="rider-main"><strong>${rider.id}</strong><small>${rider.status} · profilo demo</small></span></div><div class="player-showcase"><img src="${findBike(rider.bike).img}" alt="Moto Tripo ${findBike(rider.bike).name}"><img src="${findBrainrot(rider.brainrot).img}" alt="Brainrot Tripo ${findBrainrot(rider.brainrot).name}"></div><div class="fact-list" style="margin-top:12px">${fact('Moto',findBike(rider.bike).name)}${fact('Brainrot',findBrainrot(rider.brainrot).name)}</div><div class="button-row" style="margin-top:17px"><button class="btn" data-trade="${rider.id}">PROPONI SCAMBIO</button></div>`);
  state.modal={rider:id};
}
function showTrade(id){
  const rider=findRider(id);if(!rider)return;
  const offered=findBrainrot(state.tradeOffer),target=findBrainrot(rider.brainrot);
  const step=state.tradeStep;
  openModal('Scambio con '+rider.id,`<p class="muted">Controlla le due offerte. Entrambi i rider devono confermare; questa prova non trasferisce oggetti.</p><div class="trade-grid"><div class="trade-side"><span class="mini">LA TUA OFFERTA</span><img src="${offered.img}" alt="${offered.name}"><strong>${offered.name}</strong><button class="text-btn" data-action="change-offer">Cambia ↗</button></div><div class="trade-side"><span class="mini">${rider.id} OFFRE</span><img src="${target.img}" alt="${target.name}"><strong>${target.name}</strong></div></div><p class="muted">${step===0?'Passo 1 di 2 · verifica gli oggetti.':'Passo 2 di 2 · conferma finale della demo.'}</p><div class="button-row"><button class="btn" data-action="trade-next">${step===0?'SONO PRONTO':'CONFERMA SCAMBIO DEMO'}</button><button class="btn secondary" data-action="close-modal">ANNULLA</button></div>`);
  state.modal={trade:id};
}

document.addEventListener('click',event=>{
  if(event.target===modalRoot){closeModal();return}
  const el=event.target.closest('button');if(!el)return;
  if(el.dataset.page){closeModal();go(el.dataset.page);return}
  if(el.dataset.category){state.category=el.dataset.category;go('collection');return}
  if(el.dataset.detail){const [type,id]=el.dataset.detail.split(':');showDetail(type,id);return}
  if(el.dataset.itemAction){const [action,type,id]=el.dataset.itemAction.split(':');itemAction(action,type,id);return}
  if(el.dataset.rider){showRider(el.dataset.rider);return}
  if(el.dataset.trade){state.tradeRider=el.dataset.trade;state.tradeStep=0;showTrade(state.tradeRider);return}
  switch(el.dataset.action){
    case'close-modal':closeModal();break;
    case'see-brainrots':closeModal();go('collection','brainrots');break;
    case'royal-claim':state.royalClaimed=true;render();toast('Ricompensa riscattata nella demo.');break;
    case'battle-finish':state.battleResult=true;render();break;
    case'battle-again':state.battleResult=false;render();break;
    case'change-offer':state.tradeOffer=state.tradeOffer==='BananaBot'?'SixSeven':'BananaBot';state.tradeStep=0;showTrade(state.tradeRider);break;
    case'trade-next':if(state.tradeStep===0){state.tradeStep=1;showTrade(state.tradeRider)}else{state.tradeStep=0;closeModal();toast('Scambio simulato completato. Nessun oggetto è stato trasferito.')}break;
  }
});
document.addEventListener('input',event=>{
  if(event.target.id!=='item-search')return;
  const term=event.target.value.trim().toLocaleLowerCase('it');
  document.querySelectorAll('#item-grid .item-card').forEach(card=>card.hidden=!card.dataset.name.includes(term));
});
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&!modalRoot.hidden)closeModal()});
const query=new URLSearchParams(location.search);
if(pages[query.get('page')])state.page=query.get('page');
if(['bikes','brainrots','trails','eggs','bundles'].includes(query.get('category')))state.category=query.get('category');
render();
