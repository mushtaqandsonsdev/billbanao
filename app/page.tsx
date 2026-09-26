"use client";
import React, { useState, useRef } from "react";

type Item = { id: string; name: string; qty: number; rate: number };
type Theme = "classic" | "corporate" | "minimal" | "Green";

const themes = {
  classic: { label: "Classic", head: "bg-black text-white", accent: "#0A0A0A", border: "#e5e7eb", headerBg: "#ffffff" },
  corporate: { label: "Corporate Blue", head: "bg-[#1e40af] text-white", accent: "#1e40af", border: "#bfdbfe", headerBg: "#eff6ff" },
  minimal: { label: "Modern Minimal", head: "bg-[#6C5CE7] text-white", accent: "#6C5CE7", border: "#e9d5ff", headerBg: "#faf5ff" },
  Green: { label: "Green Pro", head: "bg-[#065f46] text-white", accent: "#065f46", border: "#a7f3d0", headerBg: "#ecfdf5" },
};

export default function BillBanaoFinal() {
  const [theme, setTheme] = useState<Theme>("classic");
  const [showAbout, setShowAbout] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [logo, setLogo] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [nl, setNl] = useState({ name: "", email: "", business: "", accept: false });
  const [nlDone, setNlDone] = useState(false);

  const [business, setBusiness] = useState({
    name: "Mushtaq & Sons Dev Co.",
    email: "hello@mushtaqandsons.dev",
    phone: "+92 300 1234567",
    address: "Gulberg III, Lahore, Pakistan",
  });
  const [client, setClient] = useState({
    name: "Acme Pvt Ltd",
    email: "accounts@acme.pk",
    address: "DHA Phase 6, Karachi",
  });
  const [meta, setMeta] = useState({
    number: "INV-2026-001",
    date: new Date().toISOString().split("T")[0],
    due: new Date(Date.now() + 7 * 86400000).toISOString().split("T")[0],
    notes: "Thank you for your business!",
    terms: "Payment due within 7 days. Late fee 2% per month. Payment via Bank Transfer / JazzCash.",
  });
  const [items, setItems] = useState<Item[]>([
    { id: "1", name: "Website Development - Landing Page", qty: 1, rate: 75000 },
    { id: "2", name: "Brand Identity + Logo", qty: 1, rate: 25000 },
  ]);
  const [tax, setTax] = useState(5);
  const [discount, setDiscount] = useState(0);

  const subtotal = items.reduce((s, i) => s + i.qty * i.rate, 0);
  const taxAmt = (subtotal * tax) / 100;
  const discAmt = (subtotal * discount) / 100;
  const total = subtotal + taxAmt - discAmt;
  const T = themes[theme];

  const handleLogo = (e: any) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setLogo(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const addItem = () => setItems([...items, { id: Date.now().toString(), name: "New Service", qty: 1, rate: 0 }]);
  const updateItem = (id: string, p: Partial<Item>) => setItems(items.map((i) => (i.id === id ? { ...i, ...p } : i)));
  const removeItem = (id: string) => setItems(items.filter((i) => i.id !== id));

  return (
    <div className="min-h-screen bg-white text-black selection:bg-[#6C5CE7]/20">
      <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-zinc-100">
        <div className="max-w-[1280px] mx-auto px-6 h-[72px] flex justify-between items-center">
          <div className="flex items-center gap-3">
            {logo ? <img src={logo} className="w-10 h-10 rounded-xl object-contain border" alt="logo" /> : <img src="/logo.png" className="w-10 h-10 rounded-xl object-contain" alt="B" onError={(e: any) => { e.currentTarget.style.display = "none"; const fb = e.currentTarget.nextElementSibling as HTMLElement; if (fb) fb.style.display = "flex"; }} />}
            <div className="hidden w-10 h-10 rounded-xl bg-[#6C5CE7] text-white font-black items-center justify-center">B</div>
            <b className="text-[20px] tracking-[-0.02em]">BillBanao</b>
          </div>
          <div className="hidden md:flex gap-6 text-[13px] font-medium">
            <a href="#generator" className="hover:text-[#6C5CE7]">Generator</a>
            <button onClick={() => setShowAbout(true)} className="hover:text-[#6C5CE7]">About Us</button>
            <button onClick={() => setShowTerms(true)} className="hover:text-[#6C5CE7]">Terms</button>
            <a href="#footer" className="hover:text-[#6C5CE7]">Feedback</a>
          </div>
          <a href="#generator" className="h-9 px-5 rounded-full bg-black text-white text-[13px] font-semibold flex items-center">Generate Invoice →</a>
        </div>
      </nav>

      <section className="max-w-[1280px] mx-auto px-6 py-20 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F0FDF4] border border-[#BBF7D0] text-[#15803D] text-[11px] font-bold"><span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> Loved by 2,500+ Pakistani freelancers & agencies ✨</div>
          <h1 className="text-[56px] font-[900] leading-[0.95] tracking-[-0.04em] mt-5">Create Professional <br /><span className="text-[#6C5CE7]">Invoices in 60s.</span></h1>
          <p className="text-zinc-600 mt-5 text-[15px] leading-relaxed">The cleanest invoice generator for Pakistani freelancers. Real table borders, proper GST, PKR support. No signup, no watermark. Built by Mushtaq & Sons Dev Co. in Lahore.</p>
          <div className="mt-7 flex gap-3">
            <a href="#generator" className="h-12 px-7 rounded-full bg-black text-white font-semibold flex items-center">⚡ Start Creating — It&apos;s Free</a>
            <button onClick={() => setShowAbout(true)} className="h-12 px-7 rounded-full border border-zinc-200 font-semibold flex items-center">About Us / Portfolio</button>
          </div>
          <div className="mt-6 flex gap-5 text-[12px] text-zinc-500"><span>✓ No signup • Free forever</span><span>✓ PKR & GST Ready</span><span>✓ Print-perfect borders</span></div>
        </div>
        <div className="bg-[#F8F8FF] rounded-[24px] p-6 border shadow-[0_20px_60px_rgba(108,92,231,0.15)]">
          <div className="bg-white rounded-[16px] border p-5">
            <div className="flex justify-between items-start"><div>{logo ? <img src={logo} className="h-12 object-contain" alt="logo" /> : <img src="/logo.png" className="h-12 object-contain" alt="logo" />}</div><div className="text-right"><div className="font-black text-[22px]">INVOICE</div><div className="text-[11px] font-mono mt-1 px-2 py-1 bg-zinc-100 rounded-full">{meta.number}</div></div></div>
            <hr className="my-4" />
            <table className="w-full text-[11px] border-collapse border"><thead><tr className={T.head}><th className="text-left p-2 border">DESCRIPTION</th><th className="p-2 border">QTY</th><th className="p-2 border">RATE</th><th className="p-2 border text-right">AMOUNT</th></tr></thead><tbody>{items.map((it) => (<tr key={it.id}><td className="p-2 border">{it.name}</td><td className="p-2 border text-center">{it.qty}</td><td className="p-2 border text-right">Rs {it.rate.toLocaleString()}</td><td className="p-2 border text-right font-bold">Rs {(it.qty * it.rate).toLocaleString()}</td></tr>))}</tbody></table>
            <div className="mt-3 text-right text-[12px] font-bold">TOTAL: Rs {total.toLocaleString()}</div>
          </div>
        </div>
      </section>

      <section id="generator" className="bg-[#FAFAFA] border-y py-12">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between gap-4 items-start md:items-center mb-6"><div><h2 className="font-bold text-[24px]">Invoice Generator</h2><p className="text-[13px] text-zinc-500">Left: Your data • Right: Live preview with real borders</p></div><div className="flex gap-2 flex-wrap">{(Object.keys(themes) as Theme[]).map((t) => (<button key={t} onClick={() => setTheme(t)} className={`px-4 h-8 rounded-full text-[11px] font-bold border ${theme === t ? "bg-black text-white" : "bg-white"}`}>{themes[t].label}</button>))}</div></div>
          <div className="grid lg:grid-cols-[420px_1fr] gap-8">
            <div id="generator-left" className="bg-white rounded-[20px] border p-6 h-fit lg:sticky top-[88px]">
              <h3 className="font-bold flex items-center gap-2">Invoice Banao <span className="text-[10px] px-2 py-1 rounded-full bg-[#F5F3FF] text-[#6C5CE7]">Secure • Sanitized</span></h3>
              <div className="mt-5"><label className="text-[11px] font-bold uppercase text-zinc-500">Company Logo Upload</label><div className="mt-2 flex gap-3 items-center"><div onClick={() => fileRef.current?.click()} className="w-[72px] h-[72px] rounded-[16px] border-2 border-dashed border-zinc-300 bg-zinc-50 flex items-center justify-center cursor-pointer overflow-hidden">{logo ? <img src={logo} className="w-full h-full object-contain" alt="logo" /> : <span className="text-[10px] font-bold text-center leading-tight">Upload<br />Logo</span>}</div><div><button onClick={() => fileRef.current?.click()} className="h-8 px-4 rounded-full bg-black text-white text-[12px]">Logo Upload Karo</button>{logo && <button onClick={() => setLogo(null)} className="ml-2 text-[11px] text-red-600">Remove</button>}<p className="text-[10px] text-zinc-400 mt-1">PNG/JPG ≤2MB</p></div><input ref={fileRef} type="file" accept="image/*" onChange={handleLogo} className="hidden" /></div></div>
              <div className="mt-5 grid gap-3"><input value={business.name} onChange={(e) => setBusiness({ ...business, name: e.target.value })} className="w-full h-10 rounded-xl border px-3 text-[13px]" placeholder="Business Name" /><input value={business.email} onChange={(e) => setBusiness({ ...business, email: e.target.value })} className="w-full h-10 rounded-xl border px-3 text-[13px]" placeholder="Email" /><input value={client.name} onChange={(e) => setClient({ ...client, name: e.target.value })} className="w-full h-10 rounded-xl border px-3 text-[13px]" placeholder="Client Name" /></div>
              <div className="mt-6"><div className="flex justify-between items-center"><label className="text-[11px] font-bold uppercase text-zinc-500">Items</label><button onClick={addItem} className="text-[11px] bg-[#6C5CE7] text-white px-3 py-1 rounded-full">+ Add Line</button></div>{items.map((it) => (<div key={it.id} className="grid grid-cols-[1fr_50px_80px_30px] gap-2 mt-2"><input value={it.name} onChange={(e) => updateItem(it.id, { name: e.target.value })} className="h-9 rounded-lg border px-2 text-[12px]" /><input type="number" value={it.qty} onChange={(e) => updateItem(it.id, { qty: Number(e.target.value) })} className="h-9 rounded-lg border px-2 text-[12px] text-center" /><input type="number" value={it.rate} onChange={(e) => updateItem(it.id, { rate: Number(e.target.value) })} className="h-9 rounded-lg border px-2 text-[12px]" /><button onClick={() => removeItem(it.id)} className="h-9 text-zinc-400 hover:text-black">✕</button></div>))}</div>
              <textarea value={meta.terms} onChange={(e) => setMeta({ ...meta, terms: e.target.value })} className="w-full mt-4 rounded-xl border p-3 text-[12px] h-[80px]" placeholder="Terms & Conditions" />
            </div>
            <div>
              <div id="invoice-preview" className="bg-white rounded-[20px] border p-8 shadow-[0_16px_48px_rgba(0,0,0,0.06)]" style={{ borderColor: T.border }}>
                <div className="flex justify-between items-start pb-6 border-b" style={{ borderColor: T.border }}><div className="flex gap-4"><div className="w-[56px] h-[56px] rounded-[12px] border bg-zinc-50 flex items-center justify-center overflow-hidden">{logo ? <img src={logo} className="w-full h-full object-contain" alt="logo" /> : <img src="/logo.png" className="w-full h-full object-contain" alt="logo" />}</div><div><div className="font-bold">{business.name}</div><div className="text-[12px] text-zinc-600 leading-relaxed">{business.email} <span className="ml-1 px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">Coming Soon</span><br />{business.phone}<br />{business.address}</div></div></div><div className="text-right"><div className="text-[28px] font-black">INVOICE</div><div className="mt-1 px-2.5 py-1 rounded-full text-[11px] font-bold text-white inline-flex" style={{ background: T.accent }}>{meta.number}</div></div></div>
                <div className="mt-6 border rounded-[12px] overflow-hidden" style={{ borderColor: T.border }}><table className="w-full border-collapse"><thead><tr className="border-b" style={{ borderColor: T.border, background: T.headerBg }}><th className="text-left text-[11px] px-4 py-3 border-r" style={{ borderColor: T.border }}>ITEM</th><th className="text-center text-[11px] px-3 py-3 border-r w-[80px]" style={{ borderColor: T.border }}>QTY</th><th className="text-right text-[11px] px-3 py-3 border-r w-[110px]" style={{ borderColor: T.border }}>RATE</th><th className="text-right text-[11px] px-4 py-3 w-[130px]">AMOUNT</th></tr></thead><tbody>{items.map((it) => (<tr key={it.id} className="border-b last:border-0" style={{ borderColor: T.border }}><td className="px-4 py-3 text-[13px] border-r" style={{ borderColor: T.border }}>{it.name}</td><td className="px-3 py-3 text-center font-mono text-[13px] border-r" style={{ borderColor: T.border }}>{it.qty}</td><td className="px-3 py-3 text-right font-mono text-[13px] border-r" style={{ borderColor: T.border }}>Rs {it.rate.toLocaleString()}</td><td className="px-4 py-3 text-right font-mono text-[13px] font-semibold">Rs {(it.qty * it.rate).toLocaleString()}</td></tr>))}</tbody></table></div>
                <div className="mt-6 flex justify-end"><div className="w-[320px] rounded-[12px] border p-4 space-y-2" style={{ borderColor: T.border, background: T.headerBg }}><div className="flex justify-between text-[13px]"><span>Subtotal</span><span className="font-mono">Rs {subtotal.toLocaleString()}</span></div><div className="flex justify-between text-[13px]"><span>Tax ({tax}%)</span><span className="font-mono">Rs {taxAmt.toLocaleString()}</span></div><div className="flex justify-between font-bold"><span>Total</span><span className="font-mono" style={{ color: T.accent }}>Rs {total.toLocaleString()}</span></div></div></div>
                <div className="mt-6 text-[12px]"><b>TERMS:</b> {meta.terms}</div>
              </div>
              <div className="mt-6 space-y-3"><button onClick={() => window.print()} className="w-full h-12 rounded-full bg-[#6C5CE7] text-white font-bold text-[14px] shadow-lg hover:bg-[#5a4bd1] flex items-center justify-center gap-2">⬇ Download / Print Invoice</button><div className="grid grid-cols-2 gap-3"><button onClick={() => window.print()} className="h-10 rounded-full border bg-white text-[13px] font-medium">📄 Save as PDF</button><button onClick={() => { navigator.clipboard.writeText(window.location.href); alert("Link copied!"); }} className="h-10 rounded-full border bg-white text-[13px] font-medium">🔗 Copy Link</button></div></div>
            </div>
          </div>
        </div>
      </section>

      <footer id="footer" className="bg-black text-white">
        <div className="max-w-[1280px] mx-auto px-6 py-12 grid md:grid-cols-3 gap-10">
          <div><img src="/logo.png" className="w-12 h-12 rounded-xl object-contain bg-white" alt="logo" onError={(e:any)=>{e.currentTarget.style.display='none'}} /><div className="mt-4 font-bold">Mushtaq & Sons Dev Co.</div><div className="text-[12px] text-zinc-400 mt-2">Official email: {business.email} <span className="ml-2 px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">Coming Soon</span></div><div className="text-[11px] text-zinc-500 mt-3">Copyright © Mushtaq & Sons Dev Co. 2026 • Built in Lahore with ♥ • No secrets in frontend</div></div>
          <div><div className="font-semibold">Our Products</div><ul className="mt-3 space-y-2 text-[13px] text-zinc-300 list-disc pl-5"><li>BillBanao Invoice</li><li>WhatsApp Link Tool (Soon)</li><li>Portfolio Builder (Soon)</li></ul></div>
          <div><div className="font-semibold">Subscribe</div><div className="mt-4 space-y-2"><input placeholder="Name" value={nl.name} onChange={(e) => setNl({ ...nl, name: e.target.value })} className="w-full h-10 rounded-lg bg-white text-black px-3 text-[13px]" /><input placeholder="Email" value={nl.email} onChange={(e) => setNl({ ...nl, email: e.target.value })} className="w-full h-10 rounded-lg bg-white text-black px-3 text-[13px]" /><label className="flex gap-2 text-[11px] mt-2"><input type="checkbox" checked={nl.accept} onChange={(e) => setNl({ ...nl, accept: e.target.checked })} /> I accept privacy</label><button onClick={() => { if(nl.email && nl.accept) { setNlDone(true); setNl({name:"", email:"", business:"", accept:false}); }}} className="w-full h-10 rounded-full bg-zinc-700 text-white text-[13px] mt-2">Subscribe — Join 1,200+ founders</button>{nlDone && <div className="text-[12px] text-green-400">✓ Thanks!</div>}</div></div>
        </div>
      </footer>

      {showAbout && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowAbout(false)} />
          <div className="relative bg-white rounded-[24px] max-w-[920px] w-full max-h-[90vh] overflow-hidden flex flex-col md:flex-row">
            <div className="absolute top-0 left-0 right-0 h-[56px] flex justify-between items-center px-6 border-b bg-white z-10"><div className="flex items-center gap-2"><img src="/logo.png" className="w-7 h-7 rounded-lg" alt="B" /><b>About Me</b></div><button onClick={() => setShowAbout(false)} className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center">✕</button></div>
            <div className="md:w-[340px] bg-[#F5F3FF] p-6 pt-[72px] overflow-auto" style={{ backgroundImage: "radial-gradient(#e9d5ff 1px, transparent 1px)", backgroundSize: "16px 16px" }}>
              <div className="relative"><div className="absolute -inset-3 bg-[#6C5CE7]/20 rounded-[24px] blur-xl"></div><img src="/about.jpg" alt="Ubaid" className="relative w-full h-[260px] object-cover rounded-[20px] border-4 border-white shadow-xl" onError={(e:any)=>{ e.currentTarget.src="/logo.png"; }} /><div className="relative -mt-8 mx-4 bg-black text-white rounded-[14px] p-3 flex items-center gap-3"><div className="text-[10px] px-2 py-1 rounded-full bg-white/20">FOUNDER & CEO</div><div className="font-bold text-[13px]">Ubaid Bin Mushtaq</div></div></div>
              <div className="grid grid-cols-2 gap-3 mt-5"><div className="bg-white rounded-[12px] p-3 border"><div className="text-[10px] text-zinc-500 font-bold">📍 LOCATION</div><div className="text-[13px] font-semibold mt-1">Lahore, PK</div></div><div className="bg-white rounded-[12px] p-3 border"><div className="text-[10px] text-zinc-500 font-bold">EXPERIENCE</div><div className="text-[13px] font-semibold mt-1">Self-Taught • 20s</div></div><div className="bg-white rounded-[12px] p-3 border"><div className="text-[10px] text-zinc-500 font-bold">PRODUCT LIVE</div><div className="text-[12px] font-semibold mt-1">1 Product • BillBanao</div></div><div className="bg-black text-white rounded-[12px] p-3"><div className="text-[10px] text-zinc-400 font-bold">MISSION</div><div className="text-[11px] font-semibold mt-1 leading-tight">Empower 10k PK Freelancers</div></div></div>
              {/* INSTAGRAM + FACEBOOK - AB SHOW HONGE - ch_ubaid_17 + Ubaid1M */}
              <div className="mt-4 flex gap-2 items-center">
                <a href="https://instagram.com/ch_ubaid_17" target="_blank" className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 text-white flex items-center justify-center shadow-md hover:scale-110 transition" title="Instagram @ch_ubaid_17">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.979C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                </a>
                <a href="https://facebook.com/Ubaid1M" target="_blank" className="w-9 h-9 rounded-full bg-[#1877F2] text-white flex items-center justify-center shadow-md hover:scale-110 transition" title="Facebook Ubaid1M">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </a>
                <a href="mailto:ubaidmushtaq434@gmail.com" className="w-9 h-9 rounded-full bg-white border flex items-center justify-center hover:bg-zinc-50 transition" title="Email">
                  ✉️
                </a>
                <span className="text-[10px] text-zinc-500 ml-2 font-bold">CONNECT</span>
              </div>
            </div>
            <div className="flex-1 p-6 pt-[72px] overflow-auto">
              <h2 className="text-[32px] font-[900] tracking-[-0.03em]">Ubaid Bin Mushtaq</h2><div className="text-[13px]"><span className="text-[#6C5CE7] font-semibold">Founder & CEO</span> • Mushtaq & Sons Dev Co. • Lahore, Pakistan</div>
              <div className="inline-flex items-center gap-2 mt-3 px-3 py-1 rounded-full bg-[#F0FDF4] border text-[#15803D] text-[11px] font-bold"><span className="w-2 h-2 bg-green-500 rounded-full"></span>Building in Public</div>
              <div className="mt-5 space-y-3 text-[13px] leading-relaxed text-zinc-700"><p>I&apos;m Ubaid Bin Mushtaq, a self-taught developer from Lahore, Pakistan.</p><p>I started Mushtaq & Sons Dev Co. with a simple mission: build world-class micro-SaaS tools that Pakistani freelancers and small agencies can actually afford — most of them free.</p><p>I learned coding by watching YouTube tutorials, building projects at night after college, and shipping fast. BillBanao is our Product #1 — born from seeing freelancers in Gulberg and DHA struggle with boring Word invoices.</p><div className="bg-[#F5F3FF] border border-[#E9D5FF] rounded-[12px] p-4 text-[#5B21B6]"><b>What drives me?</b> Seeing a freelancer from Lahore send a professional invoice that looks like it came from a $100/month SaaS, but made for free in Pakistan.</div><p>When I&apos;m not coding, I&apos;m exploring new SaaS ideas, helping local businesses go digital, and planning our next 5 products.</p><p className="font-bold text-black">Let&apos;s build the future of Pakistani freelancing, one tool at a time.</p></div>
              <div className="grid grid-cols-3 gap-3 mt-5"><div className="border rounded-[12px] p-3 text-center"><div className="font-black text-[18px]">10k</div><div className="text-[10px] text-zinc-500">GOAL</div></div><div className="border rounded-[12px] p-3 text-center"><div className="font-black text-[14px]">Gulberg III</div><div className="text-[10px] text-zinc-500">LAHORE BASE</div></div><div className="border rounded-[12px] p-3 text-center"><div className="font-black text-[18px]">5</div><div className="text-[10px] text-zinc-500">NEXT PRODUCTS</div></div></div>
              <div className="flex gap-3 mt-5"><a href="https://wa.me/92371021332" target="_blank" className="flex-1 h-11 rounded-full bg-[#22C55E] text-white font-bold flex items-center justify-center text-[13px]">WhatsApp Me</a><a href="mailto:ubaidmushtaq434@gmail.com" className="flex-1 h-11 rounded-full bg-black text-white font-bold flex items-center justify-center text-[13px]">Email Me</a></div>
              <div className="mt-4 grid grid-cols-2 gap-2"><a href="https://instagram.com/ch_ubaid_17" target="_blank" className="h-10 rounded-full border flex items-center justify-center gap-2 text-[12px] font-semibold"><span className="w-5 h-5 rounded-full bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 flex items-center justify-center text-white text-[10px]">IG</span> @ch_ubaid_17</a><a href="https://facebook.com/Ubaid1M" target="_blank" className="h-10 rounded-full border flex items-center justify-center gap-2 text-[12px] font-semibold"><span className="w-5 h-5 rounded-full bg-[#1877F2] flex items-center justify-center text-white text-[10px]">f</span> Ubaid1M</a></div>
              <div className="mt-6 flex flex-col gap-2 border-t pt-4"><div className="flex justify-between items-center"><button onClick={()=>setShowAbout(false)} className="h-9 px-5 rounded-full bg-zinc-100 text-[13px]">Close</button><div className="text-[11px] text-zinc-500">Official email: {business.email} <span className="ml-2 px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">Coming Soon</span></div></div><div className="text-[10px] text-zinc-400 text-center">✨ Premium clean profile • Built with care in Lahore</div></div>
            </div>
          </div>
        </div>
      )}
      {showTerms && (<div className="fixed inset-0 z-[100] flex items-center justify-center p-4"><div className="absolute inset-0 bg-black/70" onClick={() => setShowTerms(false)} /><div className="relative bg-white rounded-[20px] max-w-[520px] w-full p-8"><h2 className="font-bold text-[18px]">Terms Kya Hai?</h2><p className="mt-3 text-[13px] leading-relaxed">Terms = Invoice ke rules. Example: Payment 7 days me, 2% late fee, JazzCash/Bank Transfer. Ye field client ko batata hai kab aur kaise pay karna hai.</p><button onClick={() => setShowTerms(false)} className="mt-5 w-full h-10 rounded-full bg-black text-white text-[13px]">Samajh Gaya</button></div></div>)}
    </div>
  );
}

