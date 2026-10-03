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
  {id:'pulse',name:'PULSE PEARL',rarity:'COMMON',texture:'assets/eggs/pulse-pearl-candy-2026-09-29.png',desc:'Ingresso alla collezione'},
  {id:'ember',name:'EMBER NEST',rarity:'RARE',texture:'assets/eggs/ember-nest-lava-2026-09-29.png',desc:'Pool di rarità più alte'},
  {id:'astral',name:'ASTRAL RIFT',rarity:'MYTHIC',texture:'assets/eggs/astral-rift-galaxy-2026-09-29.png',desc:'Rotazione cosmica'},
  {id:'seraph',name:'SKYLINE SERAPH',rarity:'MYTHIC',texture:'assets/eggs/skyline-seraph-gold-2026-09-29.png',desc:'Rotazione Royal'}
];
const RIDERS = [
  {id:'NEON_NOVA',initial:'N',status:'Royal Rider · Lv 31',bike:'interstellar',brainrot:'VolpinaVoltVolt'},
  {id:'LUNA_VOLT',initial:'L',status:'Founder · Lv 27',bike:'angelica',brainrot:'ToasterGoblin'},
  {id:'KAI_ARCADE',initial:'K',status:'Rider · Lv 18',bike:'arcade',brainrot:'SixSeven'}
];
const FEATURED_TODAY=new Set(['bike:sugarrush','bike:arcade','trail:pinstripe','trail:circuit']);

const state={
  page:'home',category:'bikes',wallet:12450,bike:'pulse',brainrot:'TralaleroTralala',trail:'clean',
  ownedBikes:new Set(['pulse','magma']),ownedBrainrots:new Set(['TralaleroTralala','BananaBot','ToasterGoblin','SixSeven']),ownedTrails:new Set(['clean']),ownedEggs:new Set(['pulse']),
  battleResult:false,royalClaimed:false,tradeStep:0,tradeOffer:'BananaBot',tradeRider:'NEON_NOVA',modal:null
};
const stage=document.getElementById('stage');
const modalRoot=document.getElementById('modal-root');
const money=value=>new Intl.NumberFormat('it-IT').format(value);
const findBike=id=>BIKES.find(x=>x.id===id);
const findBrainrot=id=>BRAINROTS.find(x=>x.id===id);
const findTrail=id=>TRAILS.find(x=>x.id===id);
const findRider=id=>RIDERS.find(x=>x.id===id);
const RARITY_LABEL={COMMON:'COMUNE',RARE:'RARO',EPIC:'EPICO',LEGENDARY:'LEGGENDARIO',MYTHIC:'MITICO'};
const rarity=value=>`<span class="rarity ${value}">${RARITY_LABEL[value]||value}</span>`;
const icon=id=>`<img src="icons/${id}.svg" alt="">`;
const bundlePrice=b=>Math.round(((state.ownedBikes.has(b.bike)?0:findBike(b.bike).price)+(state.ownedTrails.has(b.trail)?0:findTrail(b.trail).price))*.82);
const isOwned=(type,id)=>type==='bike'?state.ownedBikes.has(id):type==='brainrot'?state.ownedBrainrots.has(id):type==='trail'?state.ownedTrails.has(id):type==='egg'?state.ownedEggs.has(id):false;
const typeIcon={bike:'garage',brainrot:'brainrot',trail:'trail',egg:'egg',bundle:'reward'};
const lockArt=type=>`<div class="locked-visual" aria-label="Anteprima nascosta: da sbloccare"><img class="hidden-shape" src="icons/${typeIcon[type]}.svg" alt=""><img class="big-lock" src="icons/locked.svg" alt=""><span>DA SBLOCCARE</span></div>`;
const rarityLegend=()=>`<div class="rarity-legend" aria-label="Colori delle rarità">${Object.entries(RARITY_LABEL).map(([key,label])=>`<span class="legend-${key}"><i></i>${label}</span>`).join('')}</div>`;

function pageHead(label,title,description,note=''){
  return `<header class="page-head"><div><span class="eyebrow">${label}</span><h2>${title}</h2><p>${description}</p></div>${note?`<span class="right-note">${note}</span>`:''}</header>`;
}

function home(){
  const currentBike=findBike(state.bike),currentBrainrot=findBrainrot(state.brainrot);
  return `<section class="hero"><div class="hero-copy"><span class="eyebrow">CENTRAL PLAZA / PRONTO A PARTIRE</span><h2>LA CITTÀ<br>TI ASPETTA.</h2><p>La prossima gara è a un tocco. Il tuo equipaggiamento è pronto.</p><div class="button-row"><button class="btn" data-page="battle">▶ GIOCA ORA</button></div></div><img class="hero-bike" src="${currentBike.img}" alt="Moto equipaggiata: ${currentBike.name}"><div class="hero-companion"><img src="${currentBrainrot.img}" alt="Brainrot equipaggiato: ${currentBrainrot.name}"><small>${currentBrainrot.name}</small></div></section>
  <div class="home-bottom"><div class="card card-pad loadout"><div><span class="mini">EQUIPAGGIAMENTO ATTUALE</span><h3>${currentBike.name} <span class="muted">+ ${currentBrainrot.name}</span></h3><p>Vuoi cambiare? Tutti gli oggetti sono nella Collezione.</p></div><button class="text-btn" data-page="collection">Apri Collezione →</button></div><div class="card card-pad objective"><div class="next-unlock">${icon('locked')}<span><span class="mini">PROSSIMO SBLOCCO</span><h3>Completa 3 gare</h3></span></div><p>1 / 3 · 120 Coins demo da sbloccare</p><div class="progress" style="--fill:33%"><i></i></div><button class="text-btn" data-page="progress">Vedi i progressi →</button></div></div>`;
}

function itemCard(type,item){
  const owned=isOwned(type,item.id);
  const art=!owned?lockArt(type):type==='trail'?`<div class="trail-art" style="--trail-color:${item.color}"></div>`:type==='egg'?`<div class="egg-art" style="--egg:url('${item.texture}')"></div>`:`<img src="${item.img}" alt="Render Tripo ${item.name}" loading="lazy">`;
  const equipped=(type==='bike'&&state.bike===item.id)||(type==='brainrot'&&state.brainrot===item.id)||(type==='trail'&&state.trail===item.id);
  const status=equipped?'IN USO':owned?'POSSEDUTO':'BLOCCATO';
  const subtitle={bike:'Moto Tripo',brainrot:'Brainrot Tripo',trail:'Scia cosmetica',egg:item.desc}[type];
  return `<button class="item-card ${type==='brainrot'?'brainrot':''} ${owned?'is-owned':'is-locked'}" data-detail="${type}:${item.id}" data-name="${item.name.toLocaleLowerCase('it')}" data-rarity="${item.rarity}"><div class="item-art">${art}<span class="state-chip">${status}</span></div><div class="item-body">${rarity(item.rarity)}<strong>${item.name}</strong><small>${subtitle}</small></div></button>`;
}

function collection(){
  const categories=[['bikes','Moto','garage',BIKES],['brainrots','Brainrot','brainrot',BRAINROTS],['trails','Scie','trail',TRAILS],['eggs','Uova','egg',EGGS]];
  const chosen=categories.find(x=>x[0]===state.category)||categories[0];
  const singular={bikes:'bike',brainrots:'brainrot',trails:'trail',eggs:'egg'}[chosen[0]];
  const owned=chosen[3].filter(x=>isOwned(singular,x.id)).length;
  return pageHead('I TUOI SBLOCCHI','Collezione','Un posto per vedere ciò che possiedi e scoprire cosa manca.',`${owned} / ${chosen[3].length} sbloccati`)+
    `<div class="collection-intro"><div>${icon('equip')}<span><strong>Equipaggiati</strong><small>${findBike(state.bike).name} · ${findBrainrot(state.brainrot).name} · ${findTrail(state.trail).name}</small></span></div></div>
    <div class="category-tabs" role="tablist" aria-label="Categorie della Collezione">${categories.map(([id,label,ic])=>`<button class="category-tab ${state.category===id?'active':''}" role="tab" aria-selected="${state.category===id}" data-category="${id}">${icon(ic)}<span>${label}</span></button>`).join('')}</div>
    ${rarityLegend()}<div class="collection-tools"><span>${owned} sbloccati · tocca un oggetto per sapere come ottenerlo.</span><input class="search" id="item-search" type="search" placeholder="Cerca ${chosen[1].toLowerCase()}" aria-label="Cerca nella categoria"></div>
    <div class="asset-grid" id="item-grid">${chosen[3].map(item=>itemCard(singular,item)).join('')}</div>`;
}

function shopCard(type,item){
  const owned=isOwned(type,item.id);
  const art=owned?(type==='bike'?`<img src="${item.img}" alt="Render Tripo ${item.name}">`:`<div class="trail-art" style="--trail-color:${item.color}"></div>`):lockArt(type);
  return `<button class="item-card shop-card ${owned?'is-owned':'is-locked'}" data-shop-item="${type}:${item.id}" data-rarity="${item.rarity}"><div class="item-art">${art}<span class="state-chip">${owned?'POSSEDUTO':'IN EVIDENZA'}</span></div><div class="item-body">${rarity(item.rarity)}<strong>${item.name}</strong><small>${owned?'Già nella Collezione':`${money(item.price)} Coins · ${type==='bike'?'moto':'scia'}`}</small></div></button>`;
}
function bundleCard(item){
  const bike=findBike(item.bike),cost=bundlePrice(item),complete=cost===0;
  return `<button class="item-card bundle-card ${complete?'is-owned':'is-locked'}" data-shop-bundle="${item.id}" data-rarity="${bike.rarity}"><div class="item-art">${complete?`<img src="${bike.img}" alt="Render Tripo ${bike.name}">`:lockArt('bundle')}<span class="state-chip">${complete?'COMPLETO':'BUNDLE'}</span></div><div class="item-body">${rarity(bike.rarity)}<strong>${item.name}</strong><small>${bike.name} + ${findTrail(item.trail).name}</small><b class="shop-price">${complete?'POSSEDUTO':`${money(cost)} COINS`}</b></div></button>`;
}
function shop(){
  const featured=[['bike','sugarrush'],['bike','arcade'],['trail','pinstripe'],['trail','circuit']];
  return pageHead('SBLOCCA E TORNA IN COLLEZIONE','Shop','Scegli un acquisto singolo oppure un bundle. Prezzi e acquisti sono simulati in questa anteprima.','Offerte demo')+
    `<div class="shop-guide">${icon('shop')}<span><strong>Come funziona</strong><small>Acquista qui → l’oggetto si sblocca → lo trovi in Collezione.</small></span></div>${rarityLegend()}
    <section class="shop-section"><div class="section-head"><div><span class="mini">01 / SCELTA RAPIDA</span><h3>In evidenza oggi</h3><p>Acquisti singoli: scegli solo quello che vuoi.</p></div></div><div class="asset-grid">${featured.map(([type,id])=>shopCard(type,type==='bike'?findBike(id):findTrail(id))).join('')}</div></section>
    <section class="shop-section"><div class="section-head"><div><span class="mini">02 / PIÙ OGGETTI INSIEME</span><h3>Bundles</h3><p>Ogni bundle contiene una moto e una scia. Aprilo per vedere il contenuto e il prezzo demo.</p></div></div><div class="asset-grid">${BUNDLES.map(bundleCard).join('')}</div></section>`;
}

function social(){
  return pageHead('PILOTI VICINI','Social','Apri un profilo per vedere l’equipaggiamento del rider. Da lì puoi provare uno scambio.')+
    `<p class="social-hint"><strong>Un percorso:</strong> scegli rider → controlla il profilo → proponi scambio.</p><div class="social-list">${RIDERS.map(r=>`<div class="rider card"><span class="avatar">${r.initial}</span><span class="rider-main"><strong>${r.id}</strong><small>${r.status}</small></span><button class="btn secondary small" data-rider="${r.id}">VEDI PROFILO</button></div>`).join('')}</div>`;
}

function progress(){
  return pageHead('IL TUO PERCORSO','Progressi','Livello, missioni e attività del rider. Apri Rank/Titoli o Founder per i relativi sblocchi.')+
    `<div class="progress-layout"><div class="card card-pad"><span class="mini">OSCAR / RIDER LV 23</span><h3>Prossimo livello</h3><p>XP 720 / 1.000 · progresso dimostrativo</p><div class="progress" style="--fill:72%;margin:14px 0 20px"><i></i></div><span class="mini">MISSIONI DI OGGI</span>
      ${[['play-gate','Completa 3 gare','1 / 3 · 120 Coins','33%'],['boost','Usa Boost 5 volte','3 / 5 · 70 XP','60%'],['inspect','Visita il profilo di un rider','0 / 1 · 50 Coins','0%']].map(([ic,name,desc,fill])=>`<div class="mission-row">${icon(ic)}<div><strong>${name}</strong><small>${desc}</small><div class="progress" style="--fill:${fill}"><i></i></div></div></div>`).join('')}</div>
      <div class="more-sections"><button class="route-card route-ranks" data-page="ranks">${icon('leaderboard')}<span><strong>Rank e Titoli</strong><small>Guarda la classifica e i titoli da sbloccare.</small></span><b>→</b></button><button class="route-card route-founder" data-page="founder">${icon('founder')}<span><strong>Founder</strong><small>Requisiti e ricompense esclusive.</small></span><b>→</b></button><details class="fold"><summary>Evento · Core Crash</summary><div class="fold-content">Evento dimostrativo. Qui appariranno obiettivo e ricompense quando l’evento sarà attivo.</div></details><details class="fold"><summary>Royal</summary><div class="fold-content">Royal è uno stato separato da Founder. <button class="text-btn" data-action="royal-claim">${state.royalClaimed?'Ricompensa demo riscattata':'Riscatta ricompensa demo →'}</button></div></details></div></div>`;
}

function ranks(){
  const tiers=[['ROOKIE RIDER',1],['NEON RIDER',5],['TRACK ACE',15],['LAST SURVIVOR',30],['NEON LEGEND',50]];
  const achievements=[['SURVIVOR','Vinci 10 gare','4 / 10'],['ELIMINATOR','Ottieni 50 eliminazioni','18 / 50'],['UNSTOPPABLE','Vinci 100 gare','4 / 100']];
  return pageHead('PROGRESSI / PAGINA DEDICATA','Rank e Titoli','Ogni traguardo sblocca un nuovo nome da mostrare sul profilo. Stato e punteggi sono dimostrativi.')+
    `<button class="text-btn back-link" data-page="progress">← Torna a Progressi</button><div class="rank-hero card"><div>${icon('leaderboard')}<span><small>TITOLO ATTUALE · LIVELLO 23</small><strong>TRACK ACE</strong><em>Prossimo: LAST SURVIVOR al livello 30</em></span></div><div class="progress" style="--fill:76%"><i></i></div></div>
    <div class="section-head"><div><span class="mini">SBLOCCHI DI LIVELLO</span><h3>Titoli del rider</h3></div></div><div class="tier-list">${tiers.map(([name,level])=>`<div class="tier-card ${level<=23?'unlocked':''}" data-rarity="${level>=50?'MYTHIC':level>=30?'LEGENDARY':level>=15?'EPIC':level>=5?'RARE':'COMMON'}">${icon(level<=23?'equip':'locked')}<span><strong>${name}</strong><small>Livello ${level} · ${level<=23?'Sbloccato':'Da sbloccare'}</small></span>${level===15?'<b>IN USO</b>':''}</div>`).join('')}</div>
    <div class="section-head"><div><span class="mini">SFIDE EXTRA</span><h3>Titoli obiettivo</h3><p>Completa la condizione indicata per ottenerli.</p></div></div><div class="achievement-grid">${achievements.map(([name,goal,current])=>`<div class="achievement card">${icon('locked')}<strong>${name}</strong><small>${goal}</small><span>${current} · demo</span></div>`).join('')}</div>
    <div class="section-head"><div><span class="mini">CLASSIFICA DIMOSTRATIVA</span><h3>Top rider</h3></div></div><div class="card card-pad">${[['01','NEON_NOVA','18.400'],['02','LUNA_VOLT','16.920'],['03','OSCAR','15.650']].map(([pos,name,points])=>`<div class="rank-line"><span>${pos} · ${name}</span><b>${points}</b></div>`).join('')}</div>`;
}

function founder(){
  const requirements=[['Livello rider',23,10,'Raggiungi il livello 10'],['Gare completate',8,20,'Completa 20 gare'],['Giorni attivi',1,3,'Gioca in 3 giorni diversi'],['Tempo attivo',2100,5400,'Resta attivo per 90 minuti totali']];
  return pageHead('PROGRESSI / PAGINA DEDICATA','Founder','Una ricompensa da guadagnare giocando. Requisiti della campagna Founder; numeri di progresso dimostrativi.')+
    `<button class="text-btn back-link" data-page="progress">← Torna a Progressi</button><div class="founder-hero card">${icon('founder')}<div><span class="mini">CAMPAGNA FOUNDERS V1</span><h3>Diventa Founder</h3><p>La configurazione del gioco prevede fino a 1.000 posti. Questa anteprima non verifica i posti disponibili in tempo reale.</p></div><span class="founder-stamp">DA SBLOCCARE</span></div>
    <div class="section-head"><div><span class="mini">IL PERCORSO</span><h3>Completa tutti i requisiti</h3><p>Per i giorni attivi servono almeno 10 minuti di attività per giorno.</p></div></div><div class="founder-steps">${requirements.map(([name,current,target,desc])=>`<div class="founder-step card">${icon(current>=target?'equip':'locked')}<span><strong>${name}</strong><small>${desc}</small><div class="progress" style="--fill:${Math.min(100,Math.round(current/target*100))}%"><i></i></div></span><b>${current>=target?'FATTO':`${current} / ${target}`}</b></div>`).join('')}</div>
    <div class="section-head"><div><span class="mini">RICOMPENSE ESCLUSIVE</span><h3>Premi Founder</h3></div></div><div class="founder-rewards">${[['brainrot','Founder Signal','Brainrot'],['trail','Founder Signal','Scia'],['garage','Founder Signal','Livrea']].map(([ic,name,type])=>`<div class="reward-card card">${lockArt(ic==='garage'?'bike':ic)}<span class="mini">${type.toUpperCase()}</span><strong>${name}</strong></div>`).join('')}</div>`;
}

function battle(){
  if(state.battleResult)return pageHead('RISULTATO / DEMO','Fine gara','Una conclusione breve: posizione e ricompensa, poi la prossima scelta.')+
    `<div class="card result"><span class="eyebrow">POSIZIONE FINALE</span><h3>#03 / 08</h3><p>+120 Coins · +70 XP · progresso missioni aggiornato nella demo</p><div class="button-row" style="justify-content:center;margin-top:22px"><button class="btn" data-action="battle-again">RIGIOCA</button><button class="btn secondary" data-page="progress">VEDI PROGRESSI</button></div></div>`;
  return pageHead('ANTEPRIMA HUD','Arena','Solo le informazioni necessarie alla gara: tempo, posizione, rider vivi e Boost.')+
    `<div class="battle"><img src="${findBike(state.bike).img}" alt="Moto Tripo equipaggiata"><div class="hud-clock"><b>04:32</b><small>6 RIDER VIVI</small></div><button class="btn secondary small battle-control" data-action="battle-finish">SIMULA FINE GARA →</button><div class="hud-pos">#03 / 08</div><div class="hud-boost">⚡ BOOST 80%</div></div><p class="muted" style="font-size:11px;margin:11px 0">La gara reale si svolge in Roblox; qui stai valutando solo la proposta UI.</p><button class="text-btn" data-page="home">← Torna a Gioca</button>`;
}

const pages={home,collection,shop,social,progress,ranks,founder,battle};
function render(){
  document.querySelectorAll('.nav-item').forEach(el=>{const active=el.dataset.page===(state.page==='battle'?'home':['ranks','founder'].includes(state.page)?'progress':state.page);el.classList.toggle('active',active);el.setAttribute('aria-current',active?'page':'false')});
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

function showDetail(type,id,source='collection'){
  const item=type==='bike'?findBike(id):type==='brainrot'?findBrainrot(id):type==='trail'?findTrail(id):EGGS.find(x=>x.id===id);
  if(!item)return;
  const owned=isOwned(type,id),equipped=(type==='bike'&&state.bike===id)||(type==='brainrot'&&state.brainrot===id)||(type==='trail'&&state.trail===id);
  const art=!owned?lockArt(type):type==='trail'?`<div class="trail-art" style="--trail-color:${item.color}"></div>`:type==='egg'?`<div class="egg-art" style="--egg:url('${item.texture}')"></div>`:`<img src="${item.img}" alt="Render Tripo di ${item.name}">`;
  const featured=FEATURED_TODAY.has(`${type}:${id}`);
  const unlock=type==='brainrot'?'Si scopre dalle uova e dalle ricompense del gioco.':type==='egg'?'Si ottiene tramite la progressione e le rotazioni del gioco.':featured?'È in evidenza oggi nello Shop demo.':'Non è in evidenza nello Shop demo. Continua a giocare per sbloccarlo.';
  const copy=`${rarity(item.rarity)}<p>${owned?type==='egg'?'Uovo già scoperto nella collezione.':'Questo oggetto è nella tua Collezione.':unlock}</p>`;
  const facts=fact('Stato',equipped?'In uso':owned?'Posseduto':'Bloccato')+(item.price?fact('Prezzo demo',`${money(item.price)} Coins`):'');
  let actions='';
  if(equipped)actions='<button class="btn" disabled>IN USO</button>';
  else if(owned&&type!=='egg')actions=`<button class="btn" data-item-action="equip:${type}:${id}">EQUIPAGGIA</button>`;
  else if(!owned&&source==='shop'&&(type==='bike'||type==='trail'))actions=`<button class="btn" data-item-action="buy:${type}:${id}">ACQUISTA · ${money(item.price)} COINS</button>`;
  else if(!owned&&featured)actions=`<button class="btn" data-page="shop">VAI ALLO SHOP</button>`;
  else if(type==='brainrot')actions='<button class="btn secondary" data-action="see-eggs">VEDI LE UOVA</button>';
  else if(type==='egg')actions='<button class="btn secondary" data-action="see-brainrots">VEDI I BRAINROT</button>';
  openModal(item.name,`<div class="detail"><div class="detail-art ${owned?'':'detail-locked'}" data-rarity="${item.rarity}">${art}</div><div class="detail-copy">${copy}<div class="fact-list">${facts}</div><div class="detail-actions button-row">${actions}</div></div></div>`);
  state.modal={type,id,source};
}
function showBundle(id){
  const item=BUNDLES.find(x=>x.id===id);if(!item)return;
  const bike=findBike(item.bike),trail=findTrail(item.trail),cost=bundlePrice(item),complete=cost===0;
  const art=complete?`<img src="${bike.img}" alt="Render Tripo di ${bike.name}">`:lockArt('bundle');
  const copy=`${rarity(bike.rarity)}<p>Bundle demo: moto e scia garantite. Il prezzo tiene conto degli oggetti che possiedi già.</p>`;
  const facts=fact('Moto',`${bike.name}${state.ownedBikes.has(item.bike)?' · posseduta':''}`)+fact('Scia',`${trail.name}${state.ownedTrails.has(item.trail)?' · posseduta':''}`)+fact('Prezzo demo',complete?'Completo':`${money(cost)} Coins`);
  const actions=complete?'<button class="btn" data-page="collection">APRI COLLEZIONE</button>':`<button class="btn" data-item-action="buy:bundle:${id}">ACQUISTA · ${money(cost)} COINS</button>`;
  openModal(item.name,`<div class="detail"><div class="detail-art ${complete?'':'detail-locked'}" data-rarity="${bike.rarity}">${art}</div><div class="detail-copy">${copy}<div class="fact-list">${facts}</div><div class="detail-actions button-row">${actions}</div></div></div>`);
  state.modal={type:'bundle',id,source:'shop'};
}

function itemAction(action,type,id){
  const source=state.modal?.source||'collection';
  if(action==='buy'){
    if((type==='bike'||type==='trail')&&isOwned(type,id))return;
    let cost=0;
    if(type==='bike')cost=findBike(id).price;
    if(type==='trail')cost=findTrail(id).price;
    if(type==='bundle')cost=bundlePrice(BUNDLES.find(x=>x.id===id));
    if(cost>state.wallet){toast('Coins demo insufficienti.');return}
    state.wallet-=cost;
    if(type==='bike')state.ownedBikes.add(id);
    if(type==='trail')state.ownedTrails.add(id);
    if(type==='bundle'){const b=BUNDLES.find(x=>x.id===id);state.ownedBikes.add(b.bike);state.ownedTrails.add(b.trail)}
    toast('Sbloccato! Lo trovi nella Collezione.');
  }else if(action==='equip'){
    if(type==='bike'&&state.ownedBikes.has(id))state.bike=id;
    if(type==='brainrot'&&state.ownedBrainrots.has(id))state.brainrot=id;
    if(type==='trail'&&state.ownedTrails.has(id))state.trail=id;
    toast('Equipaggiamento aggiornato nella demo.');
  }
  render();if(type==='bundle')showBundle(id);else showDetail(type,id,source);
}

function showRider(id){
  const rider=findRider(id);if(!rider)return;
  const bike=isOwned('bike',rider.bike)?`<img src="${findBike(rider.bike).img}" alt="Moto Tripo ${findBike(rider.bike).name}">`:lockArt('bike');
  const brainrot=isOwned('brainrot',rider.brainrot)?`<img src="${findBrainrot(rider.brainrot).img}" alt="Brainrot Tripo ${findBrainrot(rider.brainrot).name}">`:lockArt('brainrot');
  openModal(rider.id,`<div class="rider card" style="margin-bottom:13px"><span class="avatar">${rider.initial}</span><span class="rider-main"><strong>${rider.id}</strong><small>${rider.status} · profilo demo</small></span></div><div class="player-showcase"><div>${bike}</div><div>${brainrot}</div></div><div class="fact-list" style="margin-top:12px">${fact('Moto',findBike(rider.bike).name)}${fact('Brainrot',findBrainrot(rider.brainrot).name)}</div><div class="button-row" style="margin-top:17px"><button class="btn" data-trade="${rider.id}">PROPONI SCAMBIO</button></div>`);
  state.modal={rider:id};
}
function showTrade(id){
  const rider=findRider(id);if(!rider)return;
  const offered=findBrainrot(state.tradeOffer),target=findBrainrot(rider.brainrot);
  const step=state.tradeStep;
  openModal('Scambio con '+rider.id,`<p class="muted">Controlla le due offerte. Entrambi i rider devono confermare; questa prova non trasferisce oggetti.</p><div class="trade-grid"><div class="trade-side"><span class="mini">LA TUA OFFERTA</span><img src="${offered.img}" alt="${offered.name}"><strong>${offered.name}</strong><button class="text-btn" data-action="change-offer">Cambia ↗</button></div><div class="trade-side"><span class="mini">${rider.id} OFFRE</span>${isOwned('brainrot',target.id)?`<img src="${target.img}" alt="${target.name}">`:lockArt('brainrot')}<strong>${target.name}</strong></div></div><p class="muted">${step===0?'Passo 1 di 2 · verifica gli oggetti.':'Passo 2 di 2 · conferma finale della demo.'}</p><div class="button-row"><button class="btn" data-action="trade-next">${step===0?'SONO PRONTO':'CONFERMA SCAMBIO DEMO'}</button><button class="btn secondary" data-action="close-modal">ANNULLA</button></div>`);
  state.modal={trade:id};
}

document.addEventListener('click',event=>{
  if(event.target===modalRoot){closeModal();return}
  const el=event.target.closest('button');if(!el)return;
  if(el.dataset.page){closeModal();go(el.dataset.page);return}
  if(el.dataset.category){state.category=el.dataset.category;go('collection');return}
  if(el.dataset.detail){const [type,id]=el.dataset.detail.split(':');showDetail(type,id);return}
  if(el.dataset.shopItem){const [type,id]=el.dataset.shopItem.split(':');showDetail(type,id,'shop');return}
  if(el.dataset.shopBundle){showBundle(el.dataset.shopBundle);return}
  if(el.dataset.itemAction){const [action,type,id]=el.dataset.itemAction.split(':');itemAction(action,type,id);return}
  if(el.dataset.rider){showRider(el.dataset.rider);return}
  if(el.dataset.trade){state.tradeRider=el.dataset.trade;state.tradeStep=0;showTrade(state.tradeRider);return}
  switch(el.dataset.action){
    case'close-modal':closeModal();break;
    case'see-brainrots':closeModal();go('collection','brainrots');break;
    case'see-eggs':closeModal();go('collection','eggs');break;
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
if(['bikes','brainrots','trails','eggs'].includes(query.get('category')))state.category=query.get('category');
render();
