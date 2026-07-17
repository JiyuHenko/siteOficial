const LS_KEY = "cm_loja_config_v1";

const DEFAULTS = {
  app: { company_name: "Loja do onis", domain: "", favicon_png: "static/generated/favicon.png", icon_ico: "static/generated/icon.ico" },
  theme: { accent: "#4a1acb", accent2: "#1b5cac", bg: "#7c367d", text: "#000000" },
  tenants: [
    { id:"loja", name:"Loja", logo:"", theme:{ accent:"#482828", accent2:"#765b5b", bg:"#ea8181", text:"#000000" } }
  ],
  modules: { default: { config:true, crediario:true, dashboard:true, etiquetas:false, financeiro:true, produtos:true, registro_vendas:true, vendas:true }, tenants: { "loja": {} } },
  etiquetas: {}
};

const MODULE_LABELS = {
  dashboard: "Dashboard",
  vendas: "Vendas",
  registro_vendas: "Registro de vendas",
  produtos: "Produtos",
  financeiro: "Financeiro",
  crediario: "Crediário",
  etiquetas: "Etiquetas",
  config: "Configuração"
};

function deepClone(o){ return JSON.parse(JSON.stringify(o)); }

function loadState(){
  try{
    const raw = localStorage.getItem(LS_KEY);
    if(!raw) return deepClone(DEFAULTS);
    return { ...deepClone(DEFAULTS), ...JSON.parse(raw) };
  }catch(e){ return deepClone(DEFAULTS); }
}
function saveState(state){
  localStorage.setItem(LS_KEY, JSON.stringify(state));
  const s = document.getElementById("saved");
  if(s){
    s.textContent = "Salvo ✓";
    setTimeout(()=> s.textContent = "Salvando em cache automaticamente…", 1200);
  }
}

function toSlug(s){
  return (s||"").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"")
    .replace(/[^a-z0-9]+/g,"-").replace(/(^-|-$)/g,"").slice(0,40) || "loja";
}

function setVar(doc, name, val){ doc.documentElement.style.setProperty(name, val); }

async function fetchTemplate(){
  const tryPaths = ["templates/index.html","templates/preview.html","templates/base.html","templates/home.html"];
  for(const p of tryPaths){
    try{
      const r = await fetch(p, { cache:"no-store" });
      if(r.ok){
        const t = await r.text();
        if(t && t.trim().length > 50) return t;
      }
    }catch(e){}
  }
  // fallback
  return `
<!doctype html><html lang="pt-BR"><head>
<meta charset="utf-8"/><meta name="viewport" content="width=device-width, initial-scale=1"/>
<link rel="stylesheet" href="../theme.css"/>
<style>
body{font-family:system-ui;margin:0;background:var(--bg);color:var(--text)}
header{padding:22px;background:linear-gradient(90deg,var(--accent),var(--accent-2));color:#fff}
.wrap{padding:18px}
.cards{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px}
.card{border:1px solid rgba(255,255,255,.15);border-radius:16px;padding:12px;background:rgba(255,255,255,.06)}
@media (max-width:900px){.cards{grid-template-columns:1fr}}
</style></head><body>
<header><div style="display:flex;align-items:center;gap:12px">
<img id="logo" src="" style="width:46px;height:46px;border-radius:12px;object-fit:cover;background:rgba(255,255,255,.25)"/>
<div><div style="font-weight:800;font-size:18px" id="company">Loja</div>
<div style="opacity:.9;font-size:13px">Preview — Loja Inteligente</div></div></div></header>
<div class="wrap"><div class="cards" id="mods"></div>
<p style="opacity:.75;font-size:12px;margin-top:14px">* Preview demonstrativo (sem backend) — valida tema e módulos.</p></div>
<script>
window.addEventListener("message",(e)=>{
  if(!e.data||e.data.type!=="APPLY") return;
  const st=e.data.state; const labels=e.data.labels||{};
  document.getElementById("company").textContent = st.app.company_name || "Loja";
  document.getElementById("logo").src = (st.tenants&&st.tenants[0]&&st.tenants[0].logo)||"";
  const mods=(st.modules&&st.modules.default)||{};
  const el=document.getElementById("mods"); el.innerHTML="";
  Object.keys(mods).forEach(k=>{
    if(!mods[k]) return;
    const d=document.createElement("div"); d.className="card";
    d.innerHTML="<b>"+(labels[k]||k)+"</b><div style='opacity:.8;font-size:12px;margin-top:6px'>Módulo habilitado</div>";
    el.appendChild(d);
  });
});
</script></body></html>`;
}

function escapeHtml(s){ return (s||"").replace(/[&<>"']/g,(c)=>({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;" }[c])); }

function setPath(obj, path, value){
  const parts = path.split(".");
  let ref = obj;
  for(let i=0;i<parts.length-1;i++){
    ref[parts[i]] = ref[parts[i]] || {};
    ref = ref[parts[i]];
  }
  ref[parts[parts.length-1]] = value;
}

function fileToDataUrl(file){
  return new Promise((res, rej)=>{
    const r=new FileReader();
    r.onload=()=>res(r.result);
    r.onerror=rej;
    r.readAsDataURL(file);
  });
}

function fillTenantSelect(state){
  const sel=document.getElementById("tenantSelect");
  sel.innerHTML="";
  (state.tenants||[]).forEach(t=>{
    const o=document.createElement("option");
    o.value=t.id; o.textContent=t.name||t.id;
    sel.appendChild(o);
  });
}

function pickTenant(state){
  const sel=document.getElementById("tenantSelect");
  const id=sel.value || (state.tenants?.[0]?.id);
  return (state.tenants||[]).find(t=>t.id===id) || state.tenants?.[0];
}

function buildTenantsUI(state){
  const wrap=document.getElementById("tenants");
  wrap.innerHTML="";
  state.tenants.forEach((t, idx)=>{
    const box=document.createElement("div");
    box.className="card";
    box.style.padding="12px";
    box.style.marginBottom="10px";
    box.innerHTML=`
      <div class="row" style="justify-content:space-between">
        <div><b>${escapeHtml(t.name||("Tenant "+(idx+1)))}</b><div class="small">${escapeHtml(t.id||"")}</div></div>
        <button class="btn" data-act="remove" data-i="${idx}">Remover</button>
      </div>
      <div class="field" style="margin-top:10px">
        <label>Nome</label>
        <input type="text" value="${escapeHtml(t.name||"")}" data-k="name" data-i="${idx}"/>
      </div>
      <div class="field">
        <label>ID (slug)</label>
        <input type="text" value="${escapeHtml(t.id||"")}" data-k="id" data-i="${idx}"/>
      </div>
      <div class="row">
        <div class="field" style="flex:1">
          <label>Accent</label>
          <div class="row">
            <input type="color" value="${t.theme?.accent||"#4a1acb"}" data-k="theme.accent" data-i="${idx}"/>
            <input type="text" value="${escapeHtml(t.theme?.accent||"#4a1acb")}" data-k="theme.accent" data-i="${idx}"/>
          </div>
        </div>
        <div class="field" style="flex:1">
          <label>Accent 2</label>
          <div class="row">
            <input type="color" value="${t.theme?.accent2||"#1b5cac"}" data-k="theme.accent2" data-i="${idx}"/>
            <input type="text" value="${escapeHtml(t.theme?.accent2||"#1b5cac")}" data-k="theme.accent2" data-i="${idx}"/>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="field" style="flex:1">
          <label>Background</label>
          <div class="row">
            <input type="color" value="${t.theme?.bg||"#0b0b0b"}" data-k="theme.bg" data-i="${idx}"/>
            <input type="text" value="${escapeHtml(t.theme?.bg||"#0b0b0b")}" data-k="theme.bg" data-i="${idx}"/>
          </div>
        </div>
        <div class="field" style="flex:1">
          <label>Text</label>
          <div class="row">
            <input type="color" value="${t.theme?.text||"#ffffff"}" data-k="theme.text" data-i="${idx}"/>
            <input type="text" value="${escapeHtml(t.theme?.text||"#ffffff")}" data-k="theme.text" data-i="${idx}"/>
          </div>
        </div>
      </div>
      <div class="field">
        <label>Logo (upload opcional — salvo no cache do navegador)</label>
        <input type="file" accept="image/*" data-k="logoUpload" data-i="${idx}"/>
        <div class="small">O preview aplica na hora.</div>
      </div>
    `;
    wrap.appendChild(box);
  });

  wrap.querySelectorAll("button[data-act='remove']").forEach(btn=>{
    btn.addEventListener("click", ()=>{
      const i=Number(btn.dataset.i);
      state.tenants.splice(i,1);
      if(state.tenants.length===0){
        state.tenants.push(deepClone(DEFAULTS.tenants[0]));
      }
      render(state);
    });
  });

  wrap.querySelectorAll("input").forEach(inp=>{
    inp.addEventListener("input", async (e)=>{
      const i=Number(e.target.dataset.i);
      const k=e.target.dataset.k;
      if(k==="logoUpload"){
        const f=e.target.files?.[0]; if(!f) return;
        state.tenants[i].logo = await fileToDataUrl(f);
        render(state);
        return;
      }
      setPath(state.tenants[i], k, e.target.value);
      if(k==="name" && (!state.tenants[i].id || state.tenants[i].id.trim()==="")){
        state.tenants[i].id = toSlug(state.tenants[i].name);
      }
      render(state, true);
    });
  });
}

function buildModulesUI(state){
  const wrap=document.getElementById("modules");
  wrap.innerHTML="";
  Object.keys(MODULE_LABELS).forEach(k=>{
    const checked=!!state.modules?.default?.[k];
    const div=document.createElement("div");
    div.className="mod";
    div.innerHTML=`
      <input type="checkbox" data-k="${k}" ${checked?"checked":""}/>
      <div>
        <div style="font-weight:750;font-size:13px">${MODULE_LABELS[k]}</div>
        <div class="small">Ativa/desativa este módulo.</div>
      </div>`;
    wrap.appendChild(div);
  });
  wrap.querySelectorAll("input[type='checkbox']").forEach(ch=>{
    ch.addEventListener("change",(e)=>{
      state.modules.default[e.target.dataset.k]=!!e.target.checked;
      render(state);
    });
  });
}

function applyPreview(state){
  const frame=document.getElementById("preview");
  const doc=frame.contentDocument; if(!doc) return;
  const tenant=pickTenant(state);
  const theme=tenant?.theme || state.theme;

  setVar(doc,"--accent", theme.accent);
  setVar(doc,"--accent-2", theme.accent2);
  setVar(doc,"--bg", theme.bg);
  setVar(doc,"--text", theme.text);

  frame.contentWindow.postMessage({ type:"APPLY", state, labels: MODULE_LABELS }, "*");
}

function downloadJson(state){
  const blob=new Blob([JSON.stringify(state,null,2)],{type:"application/json"});
  const a=document.createElement("a");
  a.href=URL.createObjectURL(blob);
  a.download="app_config.json";
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(()=>URL.revokeObjectURL(a.href),800);
}

function copyJson(state){
  const txt=JSON.stringify(state,null,2);
  navigator.clipboard.writeText(txt).then(()=>{
    const b=document.getElementById("copyStatus");
    if(b){ b.textContent="Copiado ✓"; setTimeout(()=>b.textContent="",1200); }
  });
}

async function init(){
  const state=loadState();

  document.getElementById("company").value=state.app.company_name||"";
  document.getElementById("domain").value=state.app.domain||"";

  document.getElementById("g_acc").value=state.theme.accent;
  document.getElementById("g_acc2").value=state.theme.accent2;
  document.getElementById("g_bg").value=state.theme.bg;
  document.getElementById("g_text").value=state.theme.text;

  const tpl=await fetchTemplate();
  const frame=document.getElementById("preview");
  frame.contentDocument.open(); frame.contentDocument.write(tpl); frame.contentDocument.close();

  fillTenantSelect(state);
  buildTenantsUI(state);
  buildModulesUI(state);

  document.getElementById("tenantSelect").addEventListener("change", ()=>render(state,true));

  document.getElementById("company").addEventListener("input",(e)=>{ state.app.company_name=e.target.value; render(state); });
  document.getElementById("domain").addEventListener("input",(e)=>{ state.app.domain=e.target.value; render(state,true); });

  const bind=(id,key)=> document.getElementById(id).addEventListener("input",(e)=>{ state.theme[key]=e.target.value; render(state,true); });
  bind("g_acc","accent"); bind("g_acc2","accent2"); bind("g_bg","bg"); bind("g_text","text");

  document.getElementById("addTenant").addEventListener("click", ()=>{
    const n=state.tenants.length+1;
    state.tenants.push({
      id:"loja-"+n,
      name:"Loja "+n,
      logo:"",
      theme:{ accent: state.theme.accent, accent2: state.theme.accent2, bg: state.theme.bg, text: state.theme.text }
    });
    render(state);
  });

  document.getElementById("reset").addEventListener("click", ()=>{ localStorage.removeItem(LS_KEY); location.reload(); });
  document.getElementById("download").addEventListener("click", ()=>downloadJson(state));
  document.getElementById("copy").addEventListener("click", ()=>copyJson(state));

  render(state,true);
}

function render(state, quiet){
  const sel=document.getElementById("tenantSelect");
  const keep=sel.value;
  fillTenantSelect(state);
  if([...sel.options].some(o=>o.value===keep)) sel.value=keep;

  buildTenantsUI(state);
  buildModulesUI(state);

  document.getElementById("json").value=JSON.stringify(state,null,2);
  applyPreview(state);

  saveState(state);
}

init();
