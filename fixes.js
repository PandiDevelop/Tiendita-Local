// Ajustes de navegación para continuar editando un registro histórico.
function shop(s) {
  if (state.tab === 'ventas') state.tab = 'inicio';
  let me; try { me = syncClientId; } catch (e) { me = 'local'; }
  const owner = !s.syncKey || !s.createdBy || s.createdBy === me;
  const tabs = [['inicio','Inicio'],['productos','Catálogo'],['inventario','Inventario'],['historial','Historial']];
  if (owner) tabs.push(['empleados','Empleados']);
  return `<div class="mobile-head"><button class="menu-btn" onclick="toggleMenu()" aria-label="Abrir menú">☰</button><button class="new-store" onclick="storeModal()">＋ Nueva tienda</button></div><div class="topline"><div class="store-title">${img(s.image,'store-logo')}<div><div class="eyebrow">Tu tienda</div><h1>${esc(s.name)}</h1></div></div><button class="button secondary" onclick="storeModal('${s.id}')">⚙ Editar tienda</button></div><nav class="tabs">${tabs.map(([id,l])=>`<button class="tab ${state.tab===id?'active':''}" onclick="setTab('${id}')">${l}</button>`).join('')}</nav>${state.tab==='inicio'?dashboard(s):state.tab==='productos'?products(s):state.tab==='inventario'?inventoryView(s):state.tab==='empleados'?employeesView(s):history(s)}`;
}
function setTab(tab) { if (tab !== 'ventas') state.editingSaleId = null; state.tab = tab; save(); render(); }
function startDay() {
  const s = store(); let sale = s.sales.find(x => x.date === today());
  if (sale) { syncSale(sale,s); sale.closed = false; }
  else { sale = {id:crypto.randomUUID(),date:today(),closed:false,items:[]}; syncSale(sale,s); s.sales.push(sale); }
  state.editingSaleId = sale.id; state.tab = 'ventas'; save(); render(); toast('Registro de hoy abierto.');
}
function closeDay(id) { store().sales.find(x=>x.id===id).closed=true; state.editingSaleId=null; save(); render(); toast('Día finalizado y guardado.'); }
function editSale(id) { const s=store(),sale=s.sales.find(x=>x.id===id); syncSale(sale,s); sale.closed=false; state.editingSaleId=id; state.tab='ventas'; save(); render(); toast('Registro abierto; se añadieron productos nuevos para que puedas completarlo.'); }
// Conserva la identidad de cada promoción al editarla, para no perder sus ventas históricas.
function promoInput(pr={label:'',price:''}) { return `<div class="promo-input"><input class="promo-label" data-promo-id="${pr.id||''}" value="${esc(pr.label||'')}" maxlength="70" placeholder="Nombre de la promoción"><input class="promo-price" value="${pr.price??''}" min="0" type="number" placeholder="Precio"><button class="icon-btn" onclick="this.parentElement.remove()">×</button></div>`; }
function saveProduct(id) {
  const s=store(), name=$('#product-name').value.trim(), price=Number($('#product-price').value), image=($('#product-image-data').value.trim()||defaultProductImage), qtyRaw=$('#product-qty').value.trim(), labels=[...document.querySelectorAll('.promo-label')], prices=[...document.querySelectorAll('.promo-price')];
  const promos=labels.map((x,n)=>({id:x.dataset.promoId||crypto.randomUUID(),label:x.value.trim(),price:Number(prices[n].value)})).filter(x=>x.label&&Number.isFinite(x.price)&&x.price>=0);
  if(!name)return toast('Escribe el nombre del producto.');
  if(!Number.isFinite(price)||price<0)return toast('Añade un precio válido.');
  let pid;
  if(id){Object.assign(s.products.find(p=>p.id===id),{name,price,image,promos});pid=id;} else {pid=crypto.randomUUID();s.products.push({id:pid,name,price,image,promos});}
  if(qtyRaw!==''){const q=Number(qtyRaw);if(Number.isFinite(q)&&q>=0){s.inventory=s.inventory||{};s.inventory[pid]=q;}}
  save();closeModal();render();toast('Producto guardado.');
}
function summaryDates(s) { return [...new Set(s.sales.map(x=>x.date))].sort((a,b)=>b.localeCompare(a)); }
function selectSummaryDate(date) { state.summaryDate=date; save(); render(); }
function summaryPage(delta) { state.summaryPage=Math.max(0,(state.summaryPage||0)+delta); save(); render(); }
// ---- Resumen mensual: navegación entre meses y agregado de todas las ventas del mes ----
function monthOf(d) { return (d || today()).slice(0, 7); }
function shiftMonth(mm, delta) {
  let y = +mm.slice(0, 4), m = +mm.slice(5, 7) + delta;
  while (m < 1) { m += 12; y--; }
  while (m > 12) { m -= 12; y++; }
  return y + '-' + ('0' + m).slice(-2);
}
function monthLabel(mm) {
  let s = new Date(mm + '-01T12:00:00').toLocaleDateString('es-CO', { month: 'long', year: 'numeric' });
  return s.charAt(0).toUpperCase() + s.slice(1);
}
function monthStep(delta) { state.summaryMonth = shiftMonth(state.summaryMonth || monthOf(state.summaryDate || today()), delta); save(); render(); }
function monthLines(s, records) {
  const lines = [];
  records.forEach(x => x.items.forEach(i => {
    if (!i.qty) return;
    const p = s.products.find(p => p.id === i.productId), pr = p?.promos.find(z => z.id === i.promotionId), name = pr?.label || p?.name || 'Producto eliminado', key = i.productId + '-' + (i.promotionId || '');
    let line = lines.find(z => z.key === key); if (!line) { line = { key, name, qty: 0, value: 0 }; lines.push(line) }
    line.qty += i.qty; line.value += priceFor(i, s) * i.qty;
  }));
  return lines.sort((a, b) => b.value - a.value);
}
function monthPanel(s, mm) {
  const mrec = s.sales.filter(x => x.date.startsWith(mm));
  const mdays = [...new Set(mrec.map(x => x.date))].length;
  const munits = mrec.reduce((a, x) => a + x.items.reduce((b, i) => b + i.qty, 0), 0);
  const mrev = mrec.reduce((a, x) => a + total(x, s), 0);
  const mlines = monthLines(s, mrec);
  const empty = mrec.length ? (mlines.length ? '' : `<tr><td colspan="3" class="muted">No se registraron ventas este mes.</td></tr>`) : '';
  return `<div class="panel"><div class="panel-head"><div><h2>Resumen del mes</h2><p class="muted">Suma de todas las ventas del mes.</p></div></div><div class="day-tabs"><button class="day-nav" onclick="monthStep(-1)">← Mes anterior</button><b class="month-label">${monthLabel(mm)}</b><button class="day-nav" onclick="monthStep(1)">Siguiente mes →</button></div><div class="month-stats"><span>${mdays} día${mdays === 1 ? '' : 's'} con ventas</span><b>${munits} unidades vendidas</b><b>${money(mrev)} producido</b></div>${mrec.length ? `<table><thead><tr><th>Producto o promoción</th><th>Unidades</th><th>Producido</th></tr></thead><tbody>${mlines.map(x => `<tr><td class="product-name">${esc(x.name)}</td><td>${x.qty}</td><td><b>${money(x.value)}</b></td></tr>`).join('')}${empty}</tbody></table>` : `<div class="notice">No hay ventas registradas en ${monthLabel(mm).toLowerCase()}.</div>`}</div>`;
}
function dashboard(s) {
  const dates=summaryDates(s), page=state.summaryPage||0, pages=Math.max(1,Math.ceil(dates.length/5));
  if(page>=pages) state.summaryPage=0;
  const shown=dates.slice((state.summaryPage||0)*5,(state.summaryPage||0)*5+5);
  const selected=shown.includes(state.summaryDate)?state.summaryDate:(shown[0]||today());
  const records=s.sales.filter(x=>x.date===selected), units=records.reduce((a,x)=>a+x.items.reduce((b,i)=>b+i.qty,0),0), revenue=records.reduce((a,x)=>a+total(x,s),0), lines=[];
  records.forEach(x=>x.items.forEach(i=>{if(!i.qty)return;const p=s.products.find(p=>p.id===i.productId),pr=p?.promos.find(z=>z.id===i.promotionId),name=pr?.label||p?.name||'Producto eliminado',key=i.productId+'-'+(i.promotionId||'');let line=lines.find(z=>z.key===key);if(!line){line={key,name,qty:0,value:0};lines.push(line)}line.qty+=i.qty;line.value+=priceFor(i,s)*i.qty}));
  lines.sort((a,b)=>b.value-a.value);
  const mm = state.summaryMonth || monthOf(selected);
  return `${salePanel(s)}<div class="grid"><div class="card stat"><div class="muted">Productos registrados</div><div class="value">${s.products.length}</div><div class="small">En tu catálogo</div></div><div class="card stat"><div class="muted">Unidades vendidas</div><div class="value">${units}</div><div class="small">Del ${formatDate(selected)}</div></div><div class="card stat accent"><div class="muted">Total producido</div><div class="value">${money(revenue)}</div><div class="small">Del ${formatDate(selected)}</div></div></div><div class="panel"><div class="panel-head"><div><h2>Resumen por día</h2><p class="muted">Consulta hasta cinco días por página.</p></div><button class="button primary" onclick="saleGo()">＋ Registrar venta</button></div>${dates.length?`<div class="day-tabs">${state.summaryPage>0?`<button class="day-nav" onclick="summaryPage(-1)">← Más recientes</button>`:''}${shown.map(d=>`<button class="day-tab ${d===selected?'active':''}" onclick="selectSummaryDate('${d}')">${formatDate(d)}</button>`).join('')}${(state.summaryPage||0)<pages-1?`<button class="day-nav" onclick="summaryPage(1)">Anteriores →</button>`:''}</div><table><thead><tr><th>Producto o promoción</th><th>Unidades</th><th>Producido</th></tr></thead><tbody>${lines.length?lines.map(x=>`<tr><td class="product-name">${esc(x.name)}</td><td>${x.qty}</td><td><b>${money(x.value)}</b></td></tr>`).join(''):`<tr><td colspan="3" class="muted">No se registraron ventas este día.</td></tr>`}</tbody></table>`:`<div class="notice">Cuando registres ventas, aquí verás el detalle diario.</div>`}</div>${monthPanel(s, mm)}`;
}
function history(s) {
  const sales=[...s.sales].sort((a,b)=>(b.date||'').localeCompare(a.date||'')||(b.time||'').localeCompare(a.time||''));
  const groups={};
  sales.forEach(x=>{const d=x.date||today();(groups[d]=groups[d]||[]).push(x)});
  const dates=Object.keys(groups).sort((a,b)=>b.localeCompare(a));
  const head=`<div class="panel-head"><div><h2>Historial de ventas</h2><p class="muted">Cada venta se guarda con fecha, hora y el empleado que la registró. Toca "Detalles" para ver los productos.</p></div><button class="button secondary" onclick="exportExcel()">⇩ Exportar a Excel</button></div>`;
  if(!dates.length)return `<div class="panel">${head}<div class="empty"><div class="emoji">📅</div><b>Aún no hay ventas registradas</b><p>Registra tu primera venta desde la pestaña Inicio.</p></div></div>`;
  return `<div class="panel">${head}${dates.map(d=>{
    const list=groups[d];
    const dayUnits=list.reduce((a,x)=>a+saleUnits(x),0);
    const dayMoney=list.reduce((a,x)=>a+total(x,s),0);
    return `<div class="history-day"><div class="history-day-title"><b>${formatDate(d)}</b><span class="muted">${list.length} venta${list.length===1?'':'s'} · ${dayUnits} unidades · ${money(dayMoney)}</span></div><table class="history-table"><thead><tr><th>Fecha</th><th>Hora</th><th>Productos</th><th>Precio</th><th>Empleado</th><th></th></tr></thead><tbody>${list.map(x=>{
      const u=saleUnits(x),t=total(x,s);
      return `<tr><td>${shortDate(x.date)}</td><td>${esc(x.time||'—')}</td><td>${u}</td><td><b>${money(t)}</b></td><td>${esc(x.employee||'—')}</td><td><button class="button secondary sale-details-btn" title="Ver detalles de la venta" onclick="toggleSale(this)">Detalles <span class="sale-caret">▾</span></button></td></tr><tr class="sale-detail-row" style="display:none"><td colspan="6"><div class="sale-detail">${saleDetail(x,s)}</div></td></tr>`;
    }).join('')}</tbody></table></div>`;
  }).join('')}</div>`;
}
function saleUnits(x){return x.items.reduce((a,i)=>a+(i.qty||0),0)}
function shortDate(d){return d?new Intl.DateTimeFormat('es-CO',{day:'2-digit',month:'2-digit',year:'2-digit'}).format(new Date(d+'T12:00:00')):'—'}
function saleDetail(x,s){
  const rows=x.items.filter(i=>i.qty>0).map(i=>{
    const p=s.products.find(p=>p.id===i.productId),pr=p?.promos.find(z=>z.id===i.promotionId);
    const name=pr?pr.label+' · '+p.name:(p?p.name:'Producto eliminado');
    return `<div class="sale-detail-line"><span>${esc(name)} <b>× ${i.qty}</b></span><b class="sale-detail-cost">${money(priceFor(i,s)*i.qty)}</b></div>`;
  });
  return rows.length?`<div class="sale-detail-title">Detalles de la venta</div>${rows.join('')}`:'<p class="muted" style="margin:0">Sin productos en esta venta.</p>';
}
function toggleSale(btn){
  const tr=btn.closest('tr'),next=tr&&tr.nextElementSibling;
  if(!next||!next.classList.contains('sale-detail-row'))return;
  const open=next.style.display!=='none';
  next.style.display=open?'none':'table-row';
  btn.classList.toggle('open',!open);
}
function deleteSale(id) { if(!confirm('¿Borrar este registro de ventas? Esta acción no se puede deshacer.'))return; const s=store();s.sales=s.sales.filter(x=>x.id!==id);if(state.editingSaleId===id)state.editingSaleId=null;save();render();toast('Registro eliminado.'); }

// ---- Inventario (opcional): las existencias solo aumentan manualmente; las
// ventas las restan de forma automática porque el disponible se CALCULA como
// comprado - vendido. Por eso subir una venta y luego bajarla devuelve el número.
function inventorySold(s) {
  const t = {};
  s.sales.forEach(x => x.items.forEach(i => { if (i.qty) t[i.productId] = (t[i.productId] || 0) + i.qty; }));
  return t;
}
function inventoryView(s) {
  const sold = inventorySold(s), base = s.inventory || {};
  const rows = s.products.map(p => {
    const has = base[p.id] != null;
    const buy = has ? base[p.id] : null;
    const avail = has ? Math.max(0, base[p.id] - (sold[p.id] || 0)) : null;
    return `<tr><td class="product-name">${esc(p.name)}</td><td>${buy == null ? '—' : buy}</td><td>${avail == null ? '—' : avail}</td><td class="inv-actions"><button class="icon-btn" title="Agregar 1" onclick="invAdd('${p.id}',1)">+1</button><button class="icon-btn" title="Agregar 10" onclick="invAdd('${p.id}',10)">+10</button></td></tr>`;
  });
  return `<div class="panel"><div class="panel-head"><div><h2>Inventario</h2><p class="muted">Repón existencias aquí. Las ventas las descuentan solas; si vendes más que las existencias, el disponible simplemente se queda en 0 (vender nunca está bloqueado).</p></div></div>${rows.length?`<table><thead><tr><th>Producto</th><th>Comprado</th><th>Disponible</th><th>Reponer</th></tr></thead><tbody>${rows.join('')}</tbody></table>`:`<div class="notice">Aún no hay productos en el catálogo.</div>`}</div>`;
}
function invAdd(productId, n) {
  const s = store();
  s.inventory = s.inventory || {};
  s.inventory[productId] = (s.inventory[productId] || 0) + n;
  save(); render(); toast('Existencias aumentadas.');
}
// ---- Registro de empleados (solo lo ve el creador de la tienda) ----
// Cada +/− en Ventas del día queda atribuido a quien lo tocó (item.who). Cada
// empleado trae un desplegable (▾) que muestra QUÉ vendió, separado por fechas.
function employeesView(s) {
  const acc = {};
  s.sales.forEach(x => {
    const emp = (x.employee || '').trim() || 'Trabajador';
    const a = acc[emp] || (acc[emp] = { units: 0, money: 0, days: new Set(), detail: {} });
    x.items.forEach(i => {
      if (!i.qty) return;
      const val = priceFor(i, s) * i.qty;
      a.units += i.qty; a.money += val; a.days.add(x.date);
      const d = a.detail[x.date] || (a.detail[x.date] = { units: 0, money: 0, rows: {} });
      d.units += i.qty; d.money += val;
      const key = i.productId + '|' + (i.promotionId || '');
      const r = d.rows[key] || (d.rows[key] = { name: itemLabel(i, s), qty: 0, money: 0 });
      r.qty += i.qty; r.money += val;
    });
  });
  const rows = Object.keys(acc).map(emp => ({ name: emp, a: acc[emp] })).sort((x, y) => y.a.money - x.a.money);
  const detail = a => {
    if (!a) return '<p class="muted" style="margin:0">Todavía no registra ventas.</p>';
    return Object.keys(a.detail).sort((x, y) => y.localeCompare(x)).map(dt => {
      const d = a.detail[dt];
      return `<div class="emp-date"><b>${formatDate(dt)}</b><span class="muted">${d.units} uds · ${money(d.money)}</span></div><div class="emp-items">${Object.keys(d.rows).map(k => `<div class="emp-item"><span>${esc(d.rows[k].name)}</span><b>${d.rows[k].qty} ×</b><span class="muted">${money(d.rows[k].money)}</span></div>`).join('')}</div>`;
    }).join('');
  };
  const body = rows.length
    ? `<table><thead><tr><th>Empleado</th><th>Unidades vendidas</th><th>Producido</th><th>Días con ventas</th><th></th></tr></thead><tbody>${rows.map(r => `<tr><td class="product-name">${esc(r.name)}</td><td>${r.a.units}</td><td><b>${money(r.a.money)}</b></td><td>${r.a.days.size}</td><td><button class="icon-btn emp-toggle" title="Ver qué vendió" onclick="toggleEmp(this)">▾</button></td></tr><tr class="emp-detail-row" style="display:none"><td colspan="5"><div class="emp-detail">${detail(r.a)}</div></td></tr>`).join('')}</tbody></table>`
    : `<div class="empty"><div class="emoji">👥</div><b>Aún no hay ventas registradas</b><p>Cuando alguien registre una venta con su nombre, aquí verás lo que produjo.</p></div>`;
  return `<div class="panel"><div class="panel-head"><div><h2>Registro de empleados</h2><p class="muted">Unidades y producido de cada empleado según el nombre con el que registró sus ventas. Toca ▾ para ver el detalle por fecha.</p></div></div>${body}</div>`;
}
function toggleEmp(btn) {
  const tr = btn.closest('tr');
  const next = tr && tr.nextElementSibling;
  if (!next || !next.classList.contains('emp-detail-row')) return;
  const open = next.style.display !== 'none';
  next.style.display = open ? 'none' : 'table-row';
  btn.classList.toggle('open', !open);
}
function setTab(tab) { if(tab==='inicio'){state.summaryPage=0;state.summaryDate=null;state.summaryMonth=null;} state.tab=tab;save();render(); }
function itemLabel(i, s) {
  const p = s.products.find(p => p.id === i.productId);
  const pr = p && p.promos.find(z => z.id === i.promotionId);
  return pr ? pr.label + ' · ' + p.name : (p ? p.name : 'Producto eliminado');
}
function currentName() { try { return syncName(); } catch (e) { return 'Trabajador'; } }
function saleGo(){const e=document.getElementById('sale-panel')||document.querySelector('.register-cta');if(e){e.scrollIntoView({behavior:'smooth',block:'start'});const se=document.getElementById('sale-product');if(se)se.focus();}}
function salePanel(s){
  if(!s.products.length)return `<div class="panel register-cta" id="sale-panel"><div class="panel-head"><div><h2>Registrar una venta</h2><p class="muted">Primero agrega productos al catálogo para poder registrarlos.</p></div><button class="button primary" onclick="setTab('productos')">Ir al catálogo</button></div></div>`;
  return `<div class="panel register-cta" id="sale-panel"><div class="panel-head"><div><h2>Registrar una venta</h2><p class="muted">Elige un producto, anota la cantidad y guárdala. Puedes repetir el mismo producto y aplicar promociones.</p></div></div><div class="sale-builder"><div class="field"><label>Empleado que registra</label><input id="sale-employee" maxlength="40" placeholder="Tu nombre" value="${esc(currentName())}"></div><label class="sale-pick-label">Producto</label><select id="sale-product" onchange="addSaleLine(this)"><option value="">Selecciona un producto…</option>${s.products.map(p=>`<option value="${p.id}">${esc(p.name)}</option>`).join('')}</select><div id="sale-lines" class="sale-lines"></div><div class="sale-total"><span>Total de la venta</span><b id="sale-total">${money(0)}</b></div><button class="button primary sale-save" onclick="registerSale()">Guardar venta</button></div></div>`;
}
function addSaleLine(sel){
  const s=store(),pid=sel.value;
  if(!pid)return;
  sel.value='';
  const p=s.products.find(x=>x.id===pid);if(!p)return;
  const line=document.createElement('div');
  line.className='sale-builder-line';
  line.dataset.pid=pid;line.dataset.price=p.price;
  const promos=(p.promos||[]).filter(x=>Number.isFinite(x.price));
  const promoDrop=promos.length?`<div class="sale-promo"><select class="sale-promo-select" onchange="changeLinePrice(this)"><option value="${p.price}">Precio normal · ${money(p.price)}</option>${promos.map(pr=>`<option value="${pr.price}">${esc(pr.label)} · ${money(pr.price)}</option>`).join('')}</select></div>`:'';
  line.innerHTML=`<div class="sale-builder-head"><div class="sale-brand">${img(p.image||defaultProductImage,'product-image-sale')}<div class="sale-builder-name">${esc(p.name)}</div></div><button class="icon-btn sale-del" title="Quitar" onclick="this.closest('.sale-builder-line').remove();updateSaleTotal()">×</button></div><div class="sale-builder-price">${money(p.price)} <span class="muted">c/u</span></div>${promoDrop}<div class="sale-builder-qty"><button type="button" class="qty-btn" onclick="stepQty(this,-1)">−</button><input class="qty-input" type="number" min="0" value="0" inputmode="numeric" oninput="updateSaleTotal()"><button type="button" class="qty-btn" onclick="stepQty(this,1)">+</button></div>`;
  document.getElementById('sale-lines').appendChild(line);
  updateSaleTotal();
}
function changeLinePrice(sel){
  const line=sel.closest('.sale-builder-line'),v=Number(sel.value);
  line.dataset.price=v;
  const el=line.querySelector('.sale-builder-price');
  if(el)el.innerHTML=`${money(v)} <span class="muted">c/u</span>`;
  updateSaleTotal();
}
function stepQty(btn,d){
  const inp=btn.parentElement.querySelector('.qty-input');
  inp.value=Math.max(0,(+inp.value||0)+d);
  updateSaleTotal();
}
function updateSaleTotal(){
  let t=0;
  document.querySelectorAll('.sale-builder-line').forEach(l=>{const q=+l.querySelector('.qty-input').value||0;t+=q*(+l.dataset.price||0);});
  const el=document.getElementById('sale-total');
  if(el)el.textContent=money(t);
}
function registerSale() {
  const s = store();
  const emp = ($('#sale-employee').value.trim() || currentName()).trim() || 'Trabajador';
  const items = [];
  document.querySelectorAll('.sale-builder-line').forEach(l => {
    const qty = +l.querySelector('.qty-input').value;
    const pr = +l.dataset.price;
    if (qty > 0) items.push({ productId: l.dataset.pid, promotionId: null, qty, price: pr });
  });
  if (!items.length) return toast('Añade al menos un producto con cantidad mayor a cero.');
  const now = new Date();
  s.sales.push({ id: crypto.randomUUID(), date: today(), time: now.toTimeString().slice(0, 5), employee: emp, items });
  save(); render(); toast('Venta registrada.');
}
function exportExcel() {
  const s = store(), sales = s.sales;
  if (!sales.length) { toast('No hay ventas para exportar.'); return; }
  const rows = [['Tienda', 'Fecha', 'Hora', 'Producto', 'Ítem', 'Precio', 'Cantidad vendida', 'Total', 'Empleado']];
  sales.forEach(x => x.items.forEach(i => {
    const p = s.products.find(p => p.id === i.productId), pr = p && p.promos.find(z => z.id === i.promotionId);
    const name = pr ? pr.label : (p ? p.name : 'Producto eliminado'), parent = pr ? p.name : 'Producto';
    rows.push([s.name, x.date, x.time || '', parent, name, priceFor(i, s), i.qty, priceFor(i, s) * i.qty, x.employee || '']);
  }));
  const csv = '\ufeff' + rows.map(r => r.map(v => '"' + String(v == null ? '' : v).replace(/"/g, '""') + '"').join(';')).join('\r\n');
  const fname = 'ventas-' + s.name.toLowerCase().replace(/[^a-z0-9]+/gi, '-') + '-' + today() + '.csv';
  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }));
  const a = document.createElement('a');
  a.href = url; a.download = fname; a.style.display = 'none';
  document.body.appendChild(a); a.click();
  setTimeout(() => { if (a.parentNode) a.parentNode.removeChild(a); URL.revokeObjectURL(url); }, 1000);
  toast('Archivo listo para abrir en Excel.');
}
render();
