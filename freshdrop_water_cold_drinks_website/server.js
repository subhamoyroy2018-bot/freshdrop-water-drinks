const express=require("express");
const path=require("path");
const fs=require("fs");
const app=express();
const PORT=process.env.PORT||3000;
const DATA=path.join(__dirname,"orders.json");

app.use(express.json());
app.use(express.static(path.join(__dirname,"public")));

app.post("/api/orders",(req,res)=>{
 const {name,phone,address,items}=req.body;
 if(!name||!phone||!address||!items?.length)return res.status(400).json({error:"Missing order details"});
 const orders=fs.existsSync(DATA)?JSON.parse(fs.readFileSync(DATA,"utf8")):[];
 const order={id:Date.now(),name,phone,address,items,total:items.reduce((s,p)=>s+Number(p.price||0),0),createdAt:new Date().toISOString()};
 orders.push(order);fs.writeFileSync(DATA,JSON.stringify(orders,null,2));
 res.json({orderId:order.id});
});

app.get("/api/orders",(req,res)=>{
 const orders=fs.existsSync(DATA)?JSON.parse(fs.readFileSync(DATA,"utf8")):[];
 res.json(orders);
});

app.get("*",(req,res)=>res.sendFile(path.join(__dirname,"public","index.html")));
app.listen(PORT,()=>console.log(`FreshDrop running on http://localhost:${PORT}`));