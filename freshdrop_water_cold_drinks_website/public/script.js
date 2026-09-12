const products=[
{id:1,name:"Mineral Water 1L",price:20,emoji:"💧"},
{id:2,name:"Mineral Water 2L",price:35,emoji:"💦"},
{id:3,name:"Cola 750ml",price:45,emoji:"🥤"},
{id:4,name:"Orange Drink 600ml",price:40,emoji:"🍊"},
{id:5,name:"Lemon Soft Drink",price:35,emoji:"🍋"},
{id:6,name:"Energy Drink",price:90,emoji:"⚡"}
];
let cart=JSON.parse(localStorage.getItem("freshdrop_cart")||"[]");

function renderProducts(){
 document.getElementById("productGrid").innerHTML=products.map(p=>`
 <article class="product"><div class="emoji">${p.emoji}</div><h3>${p.name}</h3>
 <p class="price">₹${p.price}</p><button onclick="addToCart(${p.id})">Add to Cart</button></article>`).join("");
 updateCart();
}
function addToCart(id){cart.push(products.find(p=>p.id===id));save();toast("Added to cart");}
function save(){localStorage.setItem("freshdrop_cart",JSON.stringify(cart));updateCart();}
function updateCart(){document.getElementById("cartCount").textContent=cart.length;}
function showCart(){
 if(!cart.length)return toast("Your cart is empty");
 const total=cart.reduce((s,p)=>s+p.price,0);
 alert("Cart items: "+cart.map(p=>p.name).join(", ")+"\nTotal: ₹"+total+"\n\nFill the order form to place the order.");
}
function toast(msg){const t=document.getElementById("toast");t.textContent=msg;t.style.display="block";setTimeout(()=>t.style.display="none",1800);}

document.getElementById("orderForm").addEventListener("submit",async e=>{
 e.preventDefault();
 if(!cart.length)return toast("Please add a product first");
 const data={name:name.value,phone:phone.value,address:address.value,items:cart};
 try{
   const r=await fetch("/api/orders",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(data)});
   if(!r.ok)throw new Error();
   const result=await r.json();
   toast("Order #"+result.orderId+" placed successfully");
   cart=[];save();e.target.reset();
 }catch(err){toast("Order saved locally. Backend is not running.");}
});
renderProducts();