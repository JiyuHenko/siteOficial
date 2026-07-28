/**
 * Loja Inteligente — Área de Teste (sem backend)
 * - Lê config do configurador (localStorage)
 * - Aplica tema por tenant (CSS variables)
 * - Simula: Dashboard, Produtos, Vendas, Registro de Vendas (tudo em cache)
 */

const CONFIG_KEY = "cm_loja_config_v1";
const DEMO_PRODUCTS = "cm_demo_products_v1";
const DEMO_SALES = "cm_demo_sales_v1";

const MODULE_LABELS = {
  dashboard: "Dashboard",
  produtos: "Produtos",
  vendas: "Vendas",
  registro_vendas: "Registro",
  financeiro: "Financeiro",
  crediario: "Crediário",
  etiquetas: "Etiquetas",
  config: "Configurações"
};

function loadConfig(){
  try{
    const raw = localStorage.getItem(CONFIG_KEY);
    if(!raw) return null;
    return JSON.parse(raw);
  }catch(e){ return null; }
}

function save(key, value){ localStorage.setItem(key, JSON.stringify(value)); }
function load(key, fallback){
  try{
    const raw = localStorage.getItem(key);
    if(!raw) return fallback;
    return JSON.parse(raw);
  }catch(e){ return fallback; }
}

function money(n){
  const v = Number(n||0);
  return v.toLocaleString("pt-BR", { style:"currency", currency:"BRL" });
}

function todayKey(){
  const d=new Date();
  const pad = (x)=> String(x).padStart(2,"0");
  return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
}

function applyTheme(theme){
  const r = document.documentElement.style;
  if(theme?.accent) r.setProperty("--accent", theme.accent);
  if(theme?.accent2) r.setProperty("--accent-2", theme.accent2);
  if(theme?.bg) r.setProperty("--bg", theme.bg);
  if(theme?.text) r.setProperty("--text", theme.text);
}

function pickTenant(cfg, id){
  return (cfg.tenants||[]).find(t=>t.id===id) || cfg.tenants?.[0];
}

function enabledModules(cfg){
  return (cfg.modules && cfg.modules.default) ? cfg.modules.default : {};
}

function route(){
  const h = (location.hash || "#dashboard").replace("#","");
  return h || "dashboard";
}

function setActiveNav(routeId){
  document.querySelectorAll("#nav a").forEach(a=>{
    a.classList.toggle("active", a.dataset.route === routeId);
  });
  const badge = document.getElementById("routeBadge");
  badge.textContent = MODULE_LABELS[routeId] || routeId;
}

function renderNav(mods){
  const nav = document.getElementById("nav");
  nav.innerHTML = "";

  const items = [
    ["dashboard","dashboard"],
    ["produtos","produtos"],
    ["vendas","vendas"],
    ["registro_vendas","registro_vendas"]
  ];

  items.forEach(([key, routeId])=>{
    if(!mods[key]) return;
    const a = document.createElement("a");
    a.href = `#${routeId}`;
    a.textContent = MODULE_LABELS[key] || key;
    a.dataset.route = routeId;
    nav.appendChild(a);
  });

  // sempre mostrar link para voltar ao configurador
  const hr = document.createElement("div");
  hr.style.height="1px"; hr.style.background="rgba(255,255,255,.10)"; hr.style.margin="8px 0";
  nav.appendChild(hr);

  const b = document.createElement("a");
  b.href = "../configurator/index.html";
  b.textContent = "↩ Voltar ao configurador";
  b.dataset.route = "__back";
  nav.appendChild(b);
}

function viewDashboard(cfg){
  const mods = enabledModules(cfg);
  const products = load(DEMO_PRODUCTS, []);
  const sales = load(DEMO_SALES, []);
  const today = todayKey();
  const salesToday = sales.filter(s=>s.date===today);
  const totalToday = salesToday.reduce((acc,s)=>acc + (s.total||0), 0);

  const lowStock = products.filter(p=>Number(p.stock||0) <= 3).length;

  return `
    <h1 class="h1">Dashboard</h1>
    <p class="p">Visão geral do sistema (simulação) — com base nos dados que você cadastrar aqui.</p>

    <div class="kpi">
      <div class="k"><strong>${products.length}</strong><span>Produtos cadastrados</span></div>
      <div class="k"><strong>${salesToday.length}</strong><span>Vendas hoje</span></div>
      <div class="k"><strong>${money(totalToday)}</strong><span>Faturamento hoje</span></div>
    </div>

    <div class="hr"></div>

    <div class="grid2">
      <div class="card section">
        <div class="row" style="justify-content:space-between">
          <div><b>Alertas</b><div class="p" style="margin:4px 0 0">Só para demonstração</div></div>
          <div class="badge">Estoque</div>
        </div>
        <div class="p" style="margin-top:10px">Itens com estoque baixo (≤ 3): <b>${lowStock}</b></div>
        <div class="note">Você controla o estoque na aba “Produtos”.</div>
      </div>

      <div class="card section">
        <div class="row" style="justify-content:space-between">
          <div><b>Módulos habilitados</b><div class="p" style="margin:4px 0 0">Do configurador</div></div>
          <div class="badge">Config</div>
        </div>
        <div class="note" style="margin-top:10px">
          ${Object.keys(mods).filter(k=>mods[k]).map(k=>`• ${MODULE_LABELS[k]||k}`).join("<br/>") || "—"}
        </div>
      </div>
    </div>
  `;
}

function productsSeed(){
  save(DEMO_PRODUCTS, [
    { id: "P001", name: "Café especial 250g", price: 29.90, stock: 12 },
    { id: "P002", name: "Pão de queijo (un)", price: 3.50, stock: 25 },
    { id: "P003", name: "Açaí 500ml", price: 18.00, stock: 4 },
  ]);
  save(DEMO_SALES, []);
}

function viewProdutos(){
  const products = load(DEMO_PRODUCTS, []);
  const rows = products.map((p,i)=>`
    <tr>
      <td>${p.id||""}</td>
      <td>${p.name||""}</td>
      <td>${money(p.price||0)}</td>
      <td>${p.stock ?? ""}</td>
      <td>
        <button class="btn" data-act="edit" data-i="${i}">Editar</button>
        <button class="btn" data-act="del" data-i="${i}">Excluir</button>
      </td>
    </tr>
  `).join("");

  return `
    <h1 class="h1">Produtos</h1>
    <p class="p">Cadastre produtos e controle estoque (simulação em cache).</p>

    <div class="card section">
      <div class="row" style="justify-content:space-between">
        <div class="row">
          <div class="field">
            <label>Código</label>
            <input id="p_id" type="text" placeholder="P001"/>
          </div>
          <div class="field" style="min-width:260px">
            <label>Nome</label>
            <input id="p_name" type="text" placeholder="Nome do produto"/>
          </div>
          <div class="field">
            <label>Preço</label>
            <input id="p_price" type="number" step="0.01" placeholder="0,00"/>
          </div>
          <div class="field">
            <label>Estoque</label>
            <input id="p_stock" type="number" step="1" placeholder="0"/>
          </div>
        </div>
        <div class="row">
          <button class="cta" id="p_add">Salvar</button>
          <button class="btn" id="p_clear">Limpar</button>
        </div>
      </div>
      <div class="note" style="margin-top:10px">Dica: depois use “Vendas” para vender e registrar no “Registro”.</div>
    </div>

    <div class="card section">
      <table class="table">
        <thead><tr><th>Código</th><th>Produto</th><th>Preço</th><th>Estoque</th><th>Ações</th></tr></thead>
        <tbody>${rows || `<tr><td colspan="5" class="note">Nenhum produto cadastrado.</td></tr>`}</tbody>
      </table>
    </div>
  `;
}

function viewVendas(){
  const products = load(DEMO_PRODUCTS, []);
  const opts = products.map(p=>`<option value="${p.id}">${p.id} — ${p.name} (${money(p.price)})</option>`).join("");
  return `
    <h1 class="h1">Vendas</h1>
    <p class="p">Simule uma venda: selecione produtos, quantidade e finalize.</p>

    <div class="grid2">
      <div class="card section">
        <div class="row" style="justify-content:space-between">
          <b>Adicionar item</b>
          <span class="badge">Carrinho</span>
        </div>

        <div class="row" style="margin-top:10px">
          <div class="field" style="flex:1; min-width:260px">
            <label>Produto</label>
            <select id="s_prod">${opts}</select>
          </div>
          <div class="field">
            <label>Qtd</label>
            <input id="s_qtd" type="number" value="1" min="1" step="1"/>
          </div>
          <button class="cta" id="s_add" style="margin-top:22px">Adicionar</button>
        </div>

        <div class="note" style="margin-top:10px">
          * Se não tiver produtos, cadastre primeiro na aba “Produtos”.
        </div>
      </div>

      <div class="card section">
        <div class="row" style="justify-content:space-between">
          <b>Resumo</b>
          <span class="badge" id="cartTotal">Total: R$ 0,00</span>
        </div>
        <div id="cart" style="margin-top:10px" class="note">Carrinho vazio.</div>

        <div class="row" style="margin-top:12px">
          <button class="btn" id="s_clear">Limpar</button>
          <button class="cta" id="s_finish">Finalizar venda</button>
        </div>
      </div>
    </div>
  `;
}

function viewRegistro(){
  const sales = load(DEMO_SALES, []);
  const rows = sales.slice().reverse().map(s=>`
    <tr>
      <td>${s.date}</td>
      <td>${s.id}</td>
      <td>${s.items?.length || 0}</td>
      <td>${money(s.total||0)}</td>
      <td><button class="btn" data-act="detail" data-id="${s.id}">Ver</button></td>
    </tr>
  `).join("");

  return `
    <h1 class="h1">Registro de Vendas</h1>
    <p class="p">Histórico das vendas finalizadas na área de teste.</p>

    <div class="card section">
      <table class="table">
        <thead><tr><th>Data</th><th>ID</th><th>Itens</th><th>Total</th><th></th></tr></thead>
        <tbody>${rows || `<tr><td colspan="5" class="note">Nenhuma venda registrada.</td></tr>`}</tbody>
      </table>
      <div class="note" style="margin-top:10px">As vendas também reduzem o estoque dos produtos (simulação).</div>
    </div>
  `;
}

function mount(viewHtml){
  const el = document.getElementById("view");
  el.innerHTML = viewHtml;
}

function wireProdutos(){
  const products = load(DEMO_PRODUCTS, []);
  let editingIndex = null;

  const setForm = (p)=>{
    document.getElementById("p_id").value = p?.id || "";
    document.getElementById("p_name").value = p?.name || "";
    document.getElementById("p_price").value = p?.price ?? "";
    document.getElementById("p_stock").value = p?.stock ?? "";
  };

  document.getElementById("p_add").addEventListener("click", ()=>{
    const id = document.getElementById("p_id").value.trim() || `P${String(products.length+1).padStart(3,"0")}`;
    const name = document.getElementById("p_name").value.trim();
    const price = Number(document.getElementById("p_price").value || 0);
    const stock = Number(document.getElementById("p_stock").value || 0);
    if(!name){ alert("Preencha o nome do produto."); return; }

    const item = { id, name, price, stock };
    if(editingIndex !== null){
      products[editingIndex] = item;
      editingIndex = null;
    }else{
      // avoid duplicates by id: overwrite if exists
      const found = products.findIndex(p=>p.id===id);
      if(found>=0) products[found] = item;
      else products.push(item);
    }
    save(DEMO_PRODUCTS, products);
    renderCurrent();
  });

  document.getElementById("p_clear").addEventListener("click", ()=>{
    editingIndex = null;
    setForm(null);
  });

  document.querySelectorAll("button[data-act='edit']").forEach(btn=>{
    btn.addEventListener("click", ()=>{
      editingIndex = Number(btn.dataset.i);
      setForm(products[editingIndex]);
      window.scrollTo({ top: 0, behavior:"smooth" });
    });
  });

  document.querySelectorAll("button[data-act='del']").forEach(btn=>{
    btn.addEventListener("click", ()=>{
      const i = Number(btn.dataset.i);
      if(!confirm("Excluir produto?")) return;
      products.splice(i,1);
      save(DEMO_PRODUCTS, products);
      renderCurrent();
    });
  });
}

let CART = [];

function wireVendas(){
  const products = load(DEMO_PRODUCTS, []);
  const sel = document.getElementById("s_prod");
  const qtd = document.getElementById("s_qtd");
  const cartEl = document.getElementById("cart");
  const totalEl = document.getElementById("cartTotal");

  const renderCart = ()=>{
    if(CART.length===0){
      cartEl.innerHTML = "Carrinho vazio.";
      totalEl.textContent = "Total: R$ 0,00";
      return;
    }
    const total = CART.reduce((acc,it)=>acc + it.subtotal, 0);
    totalEl.textContent = `Total: ${money(total)}`;
    cartEl.innerHTML = CART.map((it,idx)=>`
      <div class="row" style="justify-content:space-between; border-bottom:1px solid rgba(255,255,255,.06); padding:8px 0">
        <div>
          <b>${it.name}</b><div class="note">${it.id} • ${it.qtd}x • ${money(it.price)}</div>
        </div>
        <div class="row">
          <span class="badge">${money(it.subtotal)}</span>
          <button class="btn" data-act="rm" data-i="${idx}">Remover</button>
        </div>
      </div>
    `).join("");

    cartEl.querySelectorAll("button[data-act='rm']").forEach(b=>{
      b.addEventListener("click", ()=>{
        CART.splice(Number(b.dataset.i), 1);
        renderCart();
      });
    });
  };

  document.getElementById("s_add").addEventListener("click", ()=>{
    const id = sel.value;
    const p = products.find(x=>x.id===id);
    if(!p){ alert("Cadastre produtos primeiro."); return; }
    const q = Math.max(1, Number(qtd.value||1));
    CART.push({ id: p.id, name: p.name, price: Number(p.price||0), qtd: q, subtotal: q*Number(p.price||0) });
    renderCart();
  });

  document.getElementById("s_clear").addEventListener("click", ()=>{ CART = []; renderCart(); });

  document.getElementById("s_finish").addEventListener("click", ()=>{
    if(CART.length===0){ alert("Carrinho vazio."); return; }
    // reduce stock
    const prod = load(DEMO_PRODUCTS, []);
    CART.forEach(it=>{
      const p = prod.find(x=>x.id===it.id);
      if(p) p.stock = Math.max(0, Number(p.stock||0) - it.qtd);
    });
    save(DEMO_PRODUCTS, prod);

    const sales = load(DEMO_SALES, []);
    const id = "V" + Date.now().toString().slice(-6);
    const total = CART.reduce((acc,it)=>acc+it.subtotal,0);
    sales.push({ id, date: todayKey(), total, items: CART });
    save(DEMO_SALES, sales);

    CART = [];
    alert("Venda registrada!");
    location.hash = "#registro_vendas";
    renderCurrent();
  });

  renderCart();
}

function wireRegistro(){
  const sales = load(DEMO_SALES, []);
  document.querySelectorAll("button[data-act='detail']").forEach(btn=>{
    btn.addEventListener("click", ()=>{
      const id = btn.dataset.id;
      const s = sales.find(x=>x.id===id);
      if(!s) return;
      const lines = (s.items||[]).map(it=>`${it.qtd}x ${it.name} (${money(it.subtotal)})`).join("\n");
      alert(`Venda ${s.id}\nData: ${s.date}\nTotal: ${money(s.total)}\n\nItens:\n${lines}`);
    });
  });
}

let CFG = null;

function renderCurrent(){
  if(!CFG){
    mount(`
      <h1 class="h1">Configuração não encontrada</h1>
      <p class="p">Abra primeiro o configurador e salve uma configuração para gerar o teste.</p>
      <div class="row">
        <a class="cta" href="../configurator/index.html">Ir para o configurador</a>
      </div>
    `);
    return;
  }

  const mods = enabledModules(CFG);
  // badge modules
  const enabled = Object.keys(mods).filter(k=>mods[k]).map(k=>MODULE_LABELS[k]||k);
  document.getElementById("modulesBadge").textContent = `Módulos: ${enabled.join(", ") || "—"}`;

  const r = route();
  setActiveNav(r);

  if(r==="dashboard") mount(viewDashboard(CFG));
  else if(r==="produtos") mount(viewProdutos());
  else if(r==="vendas") mount(viewVendas());
  else if(r==="registro_vendas") mount(viewRegistro());
  else mount(viewDashboard(CFG));

  // wire
  if(r==="produtos") wireProdutos();
  if(r==="vendas") wireVendas();
  if(r==="registro_vendas") wireRegistro();
}

function init(){
  CFG = loadConfig();

  // tenant select
  const sel = document.getElementById("tenantSelect");
  if(CFG?.tenants?.length){
    CFG.tenants.forEach(t=>{
      const o=document.createElement("option");
      o.value=t.id; o.textContent=t.name||t.id;
      sel.appendChild(o);
    });
  }

  const applyCurrentTenant = ()=>{
    if(!CFG) return;
    const t = pickTenant(CFG, sel.value);
    // apply theme from tenant
    applyTheme(t?.theme || CFG.theme);
    // brand
    document.getElementById("company").textContent = t?.name || CFG.app?.company_name || "Loja";
    document.getElementById("logo").src = t?.logo || "";
    // nav
    renderNav(enabledModules(CFG));
  };

  sel.addEventListener("change", ()=>{
    applyCurrentTenant();
    renderCurrent();
  });

  document.getElementById("seed").addEventListener("click", ()=>{
    productsSeed();
    alert("Dados de exemplo gerados!");
    renderCurrent();
  });

  document.getElementById("resetDemo").addEventListener("click", ()=>{
    localStorage.removeItem(DEMO_PRODUCTS);
    localStorage.removeItem(DEMO_SALES);
    alert("Dados do teste apagados.");
    renderCurrent();
  });

  window.addEventListener("hashchange", ()=> renderCurrent());

  applyCurrentTenant();
  // default hash to first enabled module
  const mods = enabledModules(CFG||{});
  const first = (mods.dashboard && "dashboard") || (mods.produtos && "produtos") || (mods.vendas && "vendas") || "dashboard";
  if(!location.hash) location.hash = "#" + first;

  renderCurrent();
}

init();
