import React, {useMemo, useState} from "react";
import {createRoot} from "react-dom/client";
import "./style.css";

const businesses = [
  {id:1,name:"BT Events & Functions",cat:"Events",area:"KPHB",phone:"8790108149",desc:"Function-hall support, event supplies and coordination."},
  {id:2,name:"BT Medical Supplies",cat:"Medical",area:"Kukatpally",phone:"8790108149",desc:"Medical instruments and hospital supply enquiries."},
  {id:3,name:"BT Local Services",cat:"Services",area:"Hyderabad",phone:"8790108149",desc:"Connect with local service providers and businesses."}
];

function App(){
  const [tab,setTab]=useState("home");
  const [q,setQ]=useState("");
  const [cat,setCat]=useState("All");
  const [showAdd,setShowAdd]=useState(false);
  const [saved,setSaved]=useState([]);
  const [form,setForm]=useState({name:"",cat:"Services",area:"",phone:"",desc:""});
  const [list,setList]=useState(businesses);

  const results=useMemo(()=>list.filter(b=>
    (cat==="All"||b.cat===cat) &&
    (b.name+b.cat+b.area+b.desc).toLowerCase().includes(q.toLowerCase())
  ),[list,q,cat]);

  const addBusiness=e=>{
    e.preventDefault();
    if(!form.name.trim()) return;
    setList([{id:Date.now(),...form},...list]);
    setForm({name:"",cat:"Services",area:"",phone:"",desc:""});
    setShowAdd(false); setTab("discover");
  };

  const whatsapp=p=>window.open("https://wa.me/91"+p.replace(/\D/g,""),"_blank");
  return <div className="app">
    <header>
      <div className="brand"><span>BT</span> CONNECT</div>
      <button className="add" onClick={()=>setShowAdd(true)}>＋ Add Business</button>
    </header>

    {tab==="home" && <main>
      <section className="hero">
        <p className="eyebrow">LOCAL BUSINESS NETWORK</p>
        <h1>Find it. Connect. Grow.</h1>
        <p>Discover businesses and services around you, and help local businesses get discovered.</p>
        <div className="search"><span>⌕</span><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search businesses or services"/></div>
        <button className="primary" onClick={()=>setTab("discover")}>Explore Businesses →</button>
      </section>
      <section className="quick">
        {["Services","Events","Medical","Restaurants","Shops"].map(x=><button key={x} onClick={()=>{setCat(x==="Restaurants"||x==="Shops"?"Services":x);setTab("discover")}}>{x}</button>)}
      </section>
      <h2>Featured on BT CONNECT</h2>
      <div className="cards">{list.slice(0,3).map(b=><BusinessCard key={b.id} b={b} saved={saved} setSaved={setSaved} whatsapp={whatsapp}/>)}</div>
    </main>}

    {tab==="discover" && <main>
      <h1>Discover</h1>
      <div className="search"><span>⌕</span><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search..."/></div>
      <div className="filters">{["All","Services","Events","Medical"].map(x=><button className={cat===x?"active":""} onClick={()=>setCat(x)} key={x}>{x}</button>)}</div>
      <div className="cards">{results.map(b=><BusinessCard key={b.id} b={b} saved={saved} setSaved={setSaved} whatsapp={whatsapp}/>)}</div>
      {!results.length && <div className="empty">No businesses found. Try another search.</div>}
    </main>}

    {tab==="saved" && <main><h1>Saved</h1><div className="cards">{list.filter(b=>saved.includes(b.id)).map(b=><BusinessCard key={b.id} b={b} saved={saved} setSaved={setSaved} whatsapp={whatsapp}/>)}</div>{!saved.length&&<div className="empty">Your saved businesses will appear here.</div>}</main>}

    {tab==="profile" && <main>
      <div className="profile"><div className="logo">BT</div><h1>BT CONNECT</h1><p>Local business discovery platform</p>
      <div className="contact"><b>Business contact</b><br/>WhatsApp: 8790108149<br/>Email: connectbt56@gmail.com</div>
      <button className="primary" onClick={()=>setShowAdd(true)}>List a Business</button></div>
    </main>}

    <nav>
      {[["home","⌂","Home"],["discover","⌕","Discover"],["saved","♡","Saved"],["profile","◉","Profile"]].map(([id,icon,label])=><button className={tab===id?"selected":""} onClick={()=>setTab(id)} key={id}><strong>{icon}</strong><small>{label}</small></button>)}
    </nav>

    {showAdd && <div className="modal"><form onSubmit={addBusiness}><button type="button" className="close" onClick={()=>setShowAdd(false)}>×</button><h2>Add your business</h2>
      {["name","area","phone"].map(k=><input key={k} required={k==="name"} placeholder={k==="name"?"Business name":k==="area"?"Area / city":"Phone"} value={form[k]} onChange={e=>setForm({...form,[k]:e.target.value})}/>)}
      <select value={form.cat} onChange={e=>setForm({...form,cat:e.target.value})}><option>Services</option><option>Events</option><option>Medical</option></select>
      <textarea placeholder="Short description" value={form.desc} onChange={e=>setForm({...form,desc:e.target.value})}/>
      <button className="primary">Publish Business</button>
    </form></div>}
  </div>
}

function BusinessCard({b,saved,setSaved,whatsapp}){
  const is=saved.includes(b.id);
  return <article className="card"><div className="icon">{b.cat[0]}</div><div className="info"><h3>{b.name}</h3><p>{b.cat} · {b.area}</p><span>{b.desc}</span><div className="actions"><button onClick={()=>whatsapp(b.phone)}>WhatsApp</button><button onClick={()=>setSaved(is?saved.filter(x=>x!==b.id):[...saved,b.id])}>{is?"Saved":"Save"}</button></div></div></article>
}
createRoot(document.getElementById("root")).render(<App/>);