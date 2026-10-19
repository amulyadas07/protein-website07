const FLAVORS=[
  {n:"Strawberry Milk",c:"#FF86C8",w:"slaps."},
  {n:"Blueberry Blast",c:"#7D8BFF",w:"hits."},
  {n:"Mango Lassi",c:"#FFC933",w:"goes hard."},
  {n:"Mint Choco",c:"#6EE7B7",w:"is elite."}
];
const PRODUCTS=[
  {id:1,name:"Whey Gold",emoji:"🥛",bg:"#FFE24D",tag:"Best seller",price:2499,old:2999,desc:"25g whey protein, 5.5g BCAAs, 120 calories per scoop."},
  {id:2,name:"Plant Power",emoji:"🌱",bg:"#7CF2C2",tag:"100% vegan",price:2299,old:2699,desc:"Pea and rice protein blend. Smooth, creamy, easy on the stomach."},
  {id:3,name:"Snack Bars (12)",emoji:"🍫",bg:"#FF86C8",tag:"On the go",price:1199,old:1399,desc:"20g protein per bar. Crunchy, chewy, and zero chalk."}
];
const fmt=n=>"₹"+n.toLocaleString("en-IN");
const $=s=>document.querySelector(s);
let cart=[];
try{cart=JSON.parse(localStorage.getItem("pumpd-cart")||"[]")}catch(e){}

/* flavor picker */
const fwrap=$(".flavors");
FLAVORS.forEach((f,i)=>{
  const b=document.createElement("button");
  b.className="chip";b.style.background=f.c;b.setAttribute("aria-label",f.n);b.setAttribute("aria-pressed",i===0);
  b.onclick=()=>{
    document.documentElement.style.setProperty("--accent",f.c);
    $("#tubFlavor").textContent=f.n;$("#word").textContent=f.w;
    fwrap.querySelectorAll(".chip").forEach(c=>c.setAttribute("aria-pressed",c===b));
  };
  fwrap.appendChild(b);
});

/* ticker */
const words=["25G PROTEIN","NO CHALK","LAB TESTED","REAL FLAVORS","ZERO NONSENSE"];
$("#tick").innerHTML=Array(8).fill(words.map(w=>w+" ✦ ").join("")).join("");

/* products */
$("#products").innerHTML=PRODUCTS.map(p=>`
  <article class="card">
    <div class="thumb" style="background:${p.bg}">${p.emoji}</div>
    <span class="tag">${p.tag}</span>
    <h3>${p.name}</h3><p>${p.desc}</p>
    <div class="buy"><div class="price">${fmt(p.price)} <s>${fmt(p.old)}</s></div>
    <button class="btn" data-add="${p.id}">Add to cart</button></div>
  </article>`).join("");
document.addEventListener("click",e=>{
  const a=e.target.closest("[data-add]");
  if(a){add(+a.dataset.add)}
  const q=e.target.closest("[data-q]");
  if(q){change(+q.dataset.id,+q.dataset.q)}
});

/* cart */
function save(){try{localStorage.setItem("pumpd-cart",JSON.stringify(cart))}catch(e){}}
function add(id){
  const i=cart.find(x=>x.id===id);i?i.q++:cart.push({id,q:1});
  save();render();toast("Added to cart ✓");
}
function change(id,d){
  const i=cart.find(x=>x.id===id);if(!i)return;
  i.q+=d;if(i.q<=0)cart=cart.filter(x=>x.id!==id);
  save();render();
}
function render(){
  const n=cart.reduce((s,i)=>s+i.q,0);
  $("#count").textContent=n;
  let total=0;
  $("#items").innerHTML=cart.length?cart.map(i=>{
    const p=PRODUCTS.find(x=>x.id===i.id);total+=p.price*i.q;
    return `<div class="row"><span class="e">${p.emoji}</span><div><b>${p.name}</b><small>${fmt(p.price)}</small></div>
    <span class="qty"><button data-id="${i.id}" data-q="-1" aria-label="Remove one">–</button> ${i.q} <button data-id="${i.id}" data-q="1" aria-label="Add one">+</button></span></div>`}).join("")
    :"<p>Your cart is empty. Add some protein to get started.</p>";
  $("#total").textContent=fmt(total);
}
const drawer=$("#drawer"),shade=$("#shade");
const open=o=>{drawer.classList.toggle("on",o);shade.classList.toggle("on",o)};
$("#openCart").onclick=()=>open(true);$("#closeCart").onclick=()=>open(false);shade.onclick=()=>open(false);
document.addEventListener("keydown",e=>{if(e.key==="Escape")open(false)});
$("#checkout").onclick=()=>toast(cart.length?"This is a demo, checkout isn’t connected.":"Add something to your cart first.");
let tt;function toast(m){const t=$("#toast");t.textContent=m;t.classList.add("on");clearTimeout(tt);tt=setTimeout(()=>t.classList.remove("on"),2200)}

/* count-up stats (once, when visible) */
const io=new IntersectionObserver(es=>es.forEach(e=>{
  if(!e.isIntersecting)return;io.unobserve(e.target);
  const to=+e.target.dataset.to;let v=0;const step=()=>{v+=Math.max(1,to/30);if(v>=to){e.target.textContent=to;return}e.target.textContent=Math.floor(v);requestAnimationFrame(step)};step();
}),{threshold:.6});
document.querySelectorAll("[data-to]").forEach(el=>io.observe(el));

/* signup */
$("#signup").addEventListener("submit",e=>{
  e.preventDefault();
  const v=$("#email").value.trim(),m=$("#msg");
  if(!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v)){m.textContent="Enter a valid email, like you@email.com.";return}
  m.textContent="You’re in! Check your inbox for your 15% code.";$("#email").value="";
});
render();
