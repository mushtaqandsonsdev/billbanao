"use client";
import React, { useState, useRef, useEffect } from "react";
import jsPDF from "jspdf";

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
    date: "",
    due: "",
    notes: "Thank you for your business!",
    terms: "Payment due within 7 days. Late fee 2% per month. Payment via Bank Transfer / JazzCash.",
  });

  useEffect(() => {
    setMeta(m => ({
     ...m,
      date: new Date().toISOString().split("T")[0],
      due: new Date(Date.now() + 7 * 86400000).toISOString().split("T")[0],
    }));
  }, []);

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

  const handleLogo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if(file.size > 2*1024*1024){ alert("Logo must be <2MB"); return; }
      const reader = new FileReader();
      reader.onload = (ev) => setLogo(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const addItem = () => setItems([...items, { id: Date.now().toString(), name: "New Service", qty: 1, rate: 0 }]);
  const updateItem = (id: string, p: Partial<Item>) => setItems(items.map((i) => (i.id === id? {...i,...p } : i)));
  const removeItem = (id: string) => setItems(items.filter((i) => i.id!== id));

  const downloadPremiumPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    // Header Gold Bar
    doc.setFillColor(255, 199, 0);
    doc.rect(0, 0, pageWidth, 8, "F");

    doc.setFontSize(22);
    doc.setTextColor(0,0,0);
    doc.setFont("helvetica","bold");
    doc.text("INVOICE", 14, 20);

    doc.setFontSize(10);
    doc.setFont("helvetica","normal");
    doc.text(`${business.name}`, 14, 28);
    doc.text(`${business.email} | ${business.phone}`, 14, 33);
    doc.text(`Invoice: ${meta.number} | Date: ${meta.date}`, pageWidth-14, 28, { align: "right" });
    doc.text(`Due: ${meta.due}`, pageWidth-14, 33, { align: "right" });

    doc.setFont("helvetica","bold");
    doc.text("Bill To:", 14, 45);
    doc.setFont("helvetica","normal");
    doc.text(`${client.name}`, 14, 50);
    doc.text(`${client.address}`, 14, 55);

    // Table
    let y = 65;
    doc.setFillColor(0,0,0);
    doc.setTextColor(255,255,255);
    doc.rect(14, y, pageWidth-28, 8, "F");
    doc.text("ITEM", 16, y+5);
    doc.text("QTY", 110, y+5);
    doc.text("RATE", 130, y+5);
    doc.text("AMOUNT", 170, y+5);

    doc.setTextColor(0,0,0);
    y += 12;
    items.forEach(it => {
      doc.text(it.name.substring(0,45), 16, y);
      doc.text(it.qty.toString(), 110, y);
      doc.text(`Rs ${it.rate.toLocaleString()}`, 130, y);
      doc.text(`Rs ${(it.qty*it.rate).toLocaleString()}`, 170, y);
      y += 7;
      if(y > 270){ doc.addPage(); y = 20; }
    });

    y += 5;
    doc.setFont("helvetica","bold");
    doc.text(`Subtotal: Rs ${subtotal.toLocaleString()}`, pageWidth-14, y, { align: "right" });
    y+=6;
    doc.text(`Tax (${tax}%): Rs ${taxAmt.toLocaleString()}`, pageWidth-14, y, { align: "right" });
    y+=8;
    doc.setFontSize(12);
    doc.text(`TOTAL: Rs ${total.toLocaleString()}`, pageWidth-14, y, { align: "right" });

    doc.setFontSize(8);
    doc.setFont("helvetica","normal");
    doc.setTextColor(100,100,100);
    doc.text(`Terms: ${meta.terms}`, 14, 285);
    doc.text("Crafted with love in Lahore | BillBanao.pk by Mushtaq & Sons Dev Co.", pageWidth/2, 292, { align: "center" });

    doc.save(`${meta.number}-${client.name}.pdf`);
  };

  const shareWhatsApp = () => {
    const text = `*INVOICE ${meta.number}* from ${business.name}\n\nClient: ${client.name}\nTotal: Rs ${total.toLocaleString()}\nDue: ${meta.due}\n\nGenerated via BillBanao.pk - by Mushtaq & Sons Dev Co.`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-white text-black selection:bg-[#6C5CE7]/20">
      <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-zinc-100">
        <div className="max-w- mx-auto px-6 h- flex justify-between items-center">
          <div className="flex items-center gap-3">
            {logo? <img src={logo} className="w-10 h-10 rounded-xl object-contain border" alt="logo" /> : <div className="w-10 h-10 rounded-xl bg-[#6C5CE7] text-white font-black flex items-center justify-center">B</div>}
            <b className="text- tracking-[-0.02em]">BillBanao</b>
          </div>
          <div className="hidden md:flex gap-6 text- font-medium">
            <a href="#generator" className="hover:text-[#6C5CE7]">Generator</a>
            <button onClick={() => setShowAbout(true)} className="hover:text-[#6C5CE7]">About Us</button>
            <button onClick={() => setShowTerms(true)} className="hover:text-[#6C5CE7]">Terms</button>
            <a href="#footer" className="hover:text-[#6C5CE7]">Feedback</a>
          </div>
          <a href="#generator" className="h-9 px-5 rounded-full bg-black text-white text- font-semibold flex items-center">Generate Invoice →</a>
        </div>
      </nav>

      <section className="max-w- mx-auto px-6 py-20 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F0FDF4] border border-[#BBF7D0] text-[#15803D] text- font-bold"><span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> Loved by 2,500+ Pakistani freelancers & agencies ✨</div>
          <h1 className="text- font-[900] leading-[0.95] tracking-[-0.04em] mt-5">Create Professional <br /><span className="text-[#6C5CE7]">Invoices in 60s.</span></h1>
          <p className="text-zinc-600 mt-5 text- leading-relaxed">The cleanest invoice generator for Pakistani freelancers. Real table borders, proper GST, PKR support. No signup, no watermark. Built by Mushtaq & Sons Dev Co. in Lahore.</p>
          <div className="mt-7 flex gap-3">
            <a href="#generator" className="h-12 px-7 rounded-full bg-black text-white font-semibold flex items-center">⚡ Start Creating — It&apos;s Free</a>
            <button onClick={() => setShowAbout(true)} className="h-12 px-7 rounded-full border border-zinc-200 font-semibold flex items-center">About Us / Portfolio</button>
          </div>
          <div className="mt-6 flex gap-5 text- text-zinc-500"><span>✓ No signup • Free forever</span><span>✓ PKR & GST Ready</span><span>✓ Print-perfect borders</span></div>
        </div>
        <div className="bg-[#F8F8FF] rounded- p-6 border shadow-[0_20px_60px_rgba(108,92,231,0.15)]">
          <div className="bg-white rounded- border p-5">
            <div className="flex justify-between items-start"><div>{logo? <img src={logo} className="h-12 object-contain" alt="logo" /> : <div className="w-12 h-12 bg-[#6C5CE7] rounded-xl flex items-center justify-center text-white font-bold">B</div>}</div><div className="text-right"><div className="font-black text-">INVOICE</div><div className="text- font-mono mt-1 px-2 py-1 bg-zinc-100 rounded-full">{meta.number}</div></div></div>
            <hr className="my-4" />
            <table className="w-full text- border-collapse border"><thead><tr className={T.head}><th className="text-left p-2 border">DESCRIPTION</th><th className="p-2 border">QTY</th><th className="p-2 border">RATE</th><th className="p-2 border text-right">AMOUNT</th></tr></thead><tbody>{items.map((it) => (<tr key={it.id}><td className="p-2 border">{it.name}</td><td className="p-2 border text-center">{it.qty}</td><td className="p-2 border text-right">Rs {it.rate.toLocaleString()}</td><td className="p-2 border text-right font-bold">Rs {(it.qty * it.rate).toLocaleString()}</td></tr>))}</tbody></table>
            <div className="mt-3 text-right text- font-bold">TOTAL: Rs {total.toLocaleString()}</div>
          </div>
        </div>
      </section>

      <section id="generator" className="bg-[#FAFAFA] border-y py-12">
        <div className="max-w- mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between gap-4 items-start md:items-center mb-6"><div><h2 className="font-bold text-">Invoice Generator</h2><p className="text- text-zinc-500">Left: Your data • Right: Live preview with real borders</p></div><div className="flex gap-2 flex-wrap">{(Object.keys(themes) as Theme[]).map((t) => (<button key={t} onClick={() => setTheme(t)} className={`px-4 h-8 rounded-full text- font-bold border ${theme === t? "bg-black text-white" : "bg-white"}`}>{themes[t].label}</button>))}</div></div>
          <div className="grid lg:grid-cols-[420px_1fr] gap-8">
            <div className="bg-white rounded- border p-6 h-fit lg:sticky top-">
              <h3 className="font-bold flex items-center gap-2">Invoice Banao <span className="text- px-2 py-1 rounded-full bg-[#F5F3FF] text-[#6C5CE7]">Secure • Sanitized</span></h3>
              <div className="mt-5"><label className="text- font-bold uppercase text-zinc-500">Company Logo Upload</label><div className="mt-2 flex gap-3 items-center"><div onClick={() => fileRef.current?.click()} className="w- h- rounded- border-2 border-dashed border-zinc-300 bg-zinc-50 flex items-center justify-center cursor-pointer overflow-hidden">{logo? <img src={logo} className="w-full h-full object-contain" alt="logo" /> : <span className="text- font-bold text-center leading-tight">Upload<br />Logo</span>}</div><div><button onClick={() => fileRef.current?.click()} className="h-8 px-4 rounded-full bg-black text-white text-">Logo Upload Karo</button>{logo && <button onClick={() => setLogo(null)} className="ml-2 text- text-red-600">Remove</button>}<p className="text- text-zinc-400 mt-1">PNG/JPG ≤2MB</p></div><input ref={fileRef} type="file" accept="image/*" onChange={handleLogo} className="hidden" /></div></div>
              <div className="mt-5 grid gap-3">
                <input value={business.name} onChange={(e) => setBusiness({...business, name: e.target.value })} className="w-full h-10 rounded-xl border px-3 text- bg-white text-black" placeholder="Business Name" />
                <input value={business.email} onChange={(e) => setBusiness({...business, email: e.target.value })} className="w-full h-10 rounded-xl border px-3 text- bg-white text-black" placeholder="Email" />
                <input value={client.name} onChange={(e) => setClient({...client, name: e.target.value })} className="w-full h-10 rounded-xl border px-3 text- bg-white text-black" placeholder="Client Name" />
              </div>
              <div className="mt-6"><div className="flex justify-between items-center"><label className="text- font-bold uppercase text-zinc-500">Items</label><button onClick={addItem} className="text- bg-[#6C5CE7] text-white px-3 py-1 rounded-full">+ Add Line</button></div>{items.map((it) => (<div key={it.id} className="grid grid-cols-[1fr_50px_80px_30px] gap-2 mt-2"><input value={it.name} onChange={(e) => updateItem(it.id, { name: e.target.value })} className="h-9 rounded-lg border px-2 text- bg-white text-black" /><input type="number" value={it.qty} onChange={(e) => updateItem(it.id, { qty: Number(e.target.value) })} className="h-9 rounded-lg border px-2 text- text-center bg-white text-black" /><input type="number" value={it.rate} onChange={(e) => updateItem(it.id, { rate: Number(e.target.value) })} className="h-9 rounded-lg border px-2 text- bg-white text-black" /><button onClick={() => removeItem(it.id)} className="h-9 text-zinc-400 hover:text-black">✕</button></div>))}</div>
              <textarea value={meta.terms} onChange={(e) => setMeta({...meta, terms: e.target.value })} className="w-full mt-4 rounded-xl border p-3 text- h- bg-white text-black" placeholder="Terms & Conditions" />
              <div className="mt-4 flex gap-2">
                <div className="flex-1"><label className="text- font-bold">TAX %</label><input type="number" value={tax} onChange={e=>setTax(Number(e.target.value))} className="w-full h-9 border rounded-lg px-2 text- bg-white text-black" /></div>
                <div className="flex-1"><label className="text- font-bold">DISCOUNT %</label><input type="number" value={discount} onChange={e=>setDiscount(Number(e.target.value))} className="w-full h-9 border rounded-lg px-2 text- bg-white text-black" /></div>
              </div>
            </div>
            <div>
              <div id="invoice-preview" className="bg-white rounded- border p-8 shadow-[0_16px_48px_rgba(0,0,0,0.06)]" style={{ borderColor: T.border }}>
                <div className="flex justify-between items-start pb-6 border-b" style={{ borderColor: T.border }}><div className="flex gap-4"><div className="w- h- rounded- border bg-zinc-50 flex items-center justify-center overflow-hidden">{logo? <img src={logo} className="w-full h-full object-contain" alt="logo" /> : <div className="w-full h-full bg-[#6C5CE7] flex items-center justify-center text-white font-bold">B</div>}</div><div><div className="font-bold">{business.name}</div><div className="text- text-zinc-600 leading-relaxed">{business.email}<br />{business.phone}<br />{business.address}</div></div></div><div className="text-right"><div className="text- font-black">INVOICE</div><div className="mt-1 px-2.5 py-1 rounded-full text- font-bold text-white inline-flex" style={{ background: T.accent }}>{meta.number}</div></div></div>
                <div className="mt-6 border rounded- overflow-hidden" style={{ borderColor: T.border }}><table className="w-full border-collapse"><thead><tr className="border-b" style={{ borderColor: T.border, background: T.headerBg }}><th className="text-left text- px-4 py-3 border-r" style={{ borderColor: T.border }}>ITEM</th><th className="text-center text- px-3 py-3 border-r w-" style={{ borderColor: T.border }}>QTY</th><th className="text-right text- px-3 py-3 border-r w-" style={{ borderColor: T.border }}>RATE</th><th className="text-right text- px-4 py-3 w-">AMOUNT</th></tr></thead><tbody>{items.map((it) => (<tr key={it.id} className="border-b last:border-0" style={{ borderColor: T.border }}><td className="px-4 py-3 text- border-r" style={{ borderColor: T.border }}>{it.name}</td><td className="px-3 py-3 text-center font-mono text- border-r" style={{ borderColor: T.border }}>{it.qty}</td><td className="px-3 py-3 text-right font-mono text- border-r" style={{ borderColor: T.border }}>Rs {it.rate.toLocaleString()}</td><td className="px-4 py-3 text-right font-mono text- font-semibold">Rs {(it.qty * it.rate).toLocaleString()}</td></tr>))}</tbody></table></div>
                <div className="mt-6 flex justify-end"><div className="w- rounded- border p-4 space-y-2" style={{ borderColor: T.border, background: T.headerBg }}><div className="flex justify-between text-"><span>Subtotal</span><span className="font-mono">Rs {subtotal.toLocaleString()}</span></div><div className="flex justify-between text-"><span>Tax ({tax}%)</span><span className="font-mono">Rs {taxAmt.toLocaleString()}</span></div><div className="flex justify-between font-bold"><span>Total</span><span className="font-mono" style={{ color: T.accent }}>Rs {total.toLocaleString()}</span></div></div></div>
                <div className="mt-6 text-"><b>TERMS:</b> {meta.terms}</div>
              </div>
              <div className="mt-6 space-y-3">
                <button onClick={downloadPremiumPDF} className="w-full h-12 rounded-full bg-black text-white font-bold text- shadow-lg hover:bg-zinc-800 flex items-center justify-center gap-2">⬇ Download Premium PDF - Mushtaq & Sons</button>
                <div className="grid grid-cols-2 gap-3">
                  <button onClick={shareWhatsApp} className="h-11 rounded-full bg-[#25D366] text-white text- font-bold">💬 Share on WhatsApp</button>
                  <button onClick={() => { navigator.clipboard.writeText(window.location.href); alert("Link copied!"); }} className="h-11 rounded-full border bg-white text- font-medium">🔗 Copy Link</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer id="footer" className="bg-black text-white">
        <div className="max-w- mx-auto px-6 py-12 grid md:grid-cols-3 gap-10">
          <div><div className="w-12 h-12 rounded-xl bg-white text-black flex items-center justify-center font-black">B</div><div className="mt-4 font-bold">Mushtaq & Sons Dev Co.</div><div className="text- text-zinc-400 mt-2">Official email: {business.email}</div><div className="text- text-zinc-500 mt-3">Copyright © Mushtaq & Sons Dev Co. 2026 • Built in Lahore with ♥</div></div>
          <div><div className="font-semibold">Our Products</div><ul className="mt-3 space-y-2 text- text-zinc-300 list-disc pl-5"><li>BillBanao Invoice - Product 1</li><li>WhatsApp Link Tool (Next)</li><li>Portfolio Builder (Soon)</li></ul></div>
          <div><div className="font-semibold">Subscribe</div><div className="mt-4 space-y-2"><input placeholder="Name" value={nl.name} onChange={(e) => setNl({...nl, name: e.target.value })} className="w-full h-10 rounded-lg bg-white text-black px-3 text-" /><input placeholder="Email" value={nl.email} onChange={(e) => setNl({...nl, email: e.target.value })} className="w-full h-10 rounded-lg bg-white text-black px-3 text-" /><label className="flex gap-2 text- mt-2"><input type="checkbox" checked={nl.accept} onChange={(e) => setNl({...nl, accept: e.target.checked })} /> I accept privacy</label><button onClick={() => { if(nl.email && nl.accept) { setNlDone(true); setNl({name:"", email:"", business:"", accept:false}); }}} className="w-full h-10 rounded-full bg-zinc-700 text-white text- mt-2">Subscribe — Join 1,200+ founders</button>{nlDone && <div className="text- text-green-400">✓ Thanks! You joined Mushtaq & Sons family.</div>}</div></div>
        </div>
      </footer>

      {showAbout && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowAbout(false)} />
          <div className="relative bg-white rounded- max-w- w-full max-h- overflow-hidden flex flex-col md:flex-row">
            <div className="absolute top-0 left-0 right-0 h- flex justify-between items-center px-6 border-b bg-white z-10"><div className="flex items-center gap-2"><b>About Me</b></div><button onClick={() => setShowAbout(false)} className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center">✕</button></div>
            <div className="md:w- bg-[#F5F3FF] p-6 pt- overflow-auto">
              <div className="bg-black text-white rounded- p-3 flex items-center gap-3"><div className="text- px-2 py-1 rounded-full bg-white/20">FOUNDER & CEO</div><div className="font-bold text-">Ubaid Bin Mushtaq</div></div>
              <div className="grid grid-cols-2 gap-3 mt-5"><div className="bg-white rounded- p-3 border"><div className="text- text-zinc-500 font-bold">📍 LOCATION</div><div className="text- font-semibold mt-1">Lahore, PK</div></div><div className="bg-white rounded- p-3 border"><div className="text- text-zinc-500 font-bold">EXPERIENCE</div><div className="text- font-semibold mt-1">Self-Taught • 20s</div></div></div>
              <div className="mt-4 flex gap-2 items-center">
                <a href="https://instagram.com/ch_ubaid_17" target="_blank" className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 text-white flex items-center justify-center">IG</a>
                <a href="https://facebook.com/Ubaid1M" target="_blank" className="w-9 h-9 rounded-full bg-[#1877F2] text-white flex items-center justify-center">f</a>
              </div>
            </div>
            <div className="flex-1 p-6 pt- overflow-auto">
              <h2 className="text- font-[900]">Ubaid Bin Mushtaq</h2>
              <p className="text- mt-3 text-zinc-700 leading-relaxed">I&apos;m Ubaid Bin Mushtaq, self-taught developer from Lahore. I started Mushtaq & Sons Dev Co. with a mission: build world-class micro-SaaS tools that Pakistani freelancers can afford — most free.</p>
              <div className="flex gap-3 mt-5"><a href="https://wa.me/92371021332" target="_blank" className="flex-1 h-11 rounded-full bg-[#22C55E] text-white font-bold flex items-center justify-center text-">WhatsApp Me</a><a href="mailto:ubaidmushtaq434@gmail.com" className="flex-1 h-11 rounded-full bg-black text-white font-bold flex items-center justify-center text-">Email Me</a></div>
            </div>
          </div>
        </div>
      )}
      {showTerms && (<div className="fixed inset-0 z-[100] flex items-center justify-center p-4"><div className="absolute inset-0 bg-black/70" onClick={() => setShowTerms(false)} /><div className="relative bg-white rounded- max-w- w-full p-8"><h2 className="font-bold text-">Terms Kya Hai?</h2><p className="mt-3 text- leading-relaxed">Terms = Invoice ke rules. Example: Payment 7 days me, 2% late fee, JazzCash/Bank Transfer. Ye field client ko batata hai kab aur kaise pay karna hai.</p><button onClick={() => setShowTerms(false)} className="mt-5 w-full h-10 rounded-full bg-black text-white text-">Samajh Gaya</button></div></div>)}
    </div>
  );
}