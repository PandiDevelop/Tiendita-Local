// Ajustes de navegación para continuar editando un registro histórico.
function shop(s) {
  const daily = state.editingSaleId
    ? s.sales.find(x => x.id === state.editingSaleId)
    : s.sales.find(x => x.date === today() && !x.closed);
  let me; try { me = syncClientId; } catch (e) { me = 'local'; }
  const owner = !s.syncKey || !s.createdBy || s.createdBy === me;
  const tabs = [['inicio','Resumen'],['productos','Productos'],['inventario','Inventario'],['ventas','Ventas del día'],['historial','Historial']];
  if (owner) tabs.push(['empleados','Empleados']);
  return `<div class="mobile-head"><button class="menu-btn" onclick="toggleMenu()" aria-label="Abrir menú">☰</button><button class="new-store" onclick="storeModal()">＋ Nueva tienda</button></div><div class="topline"><div class="store-title">${img(s.image,'store-logo')}<div><div class="eyebrow">Tu tienda</div><h1>${esc(s.name)}</h1></div></div><button class="button secondary" onclick="storeModal('${s.id}')">⚙ Editar tienda</button></div><nav class="tabs">${tabs.map(([id,l])=>`<button class="tab ${state.tab===id?'active':''}" onclick="setTab('${id}')">${l}</button>`).join('')}</nav>${state.tab==='inicio'?dashboard(s,daily):state.tab==='productos'?products(s):state.tab==='inventario'?inventoryView(s):state.tab==='ventas'?sales(s,daily):state.tab==='empleados'?employeesView(s):history(s)}`;
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
  const s=store(), name=$('#product-name').value.trim(), price=Number($('#product-price').value), labels=[...document.querySelectorAll('.promo-label')], prices=[...document.querySelectorAll('.promo-price')];
  const promos=labels.map((x,n)=>({id:x.dataset.promoId||crypto.randomUUID(),label:x.value.trim(),price:Number(prices[n].value)})).filter(x=>x.label&&Number.isFinite(x.price)&&x.price>=0);
  if(!name)return toast('Escribe el nombre del producto.');
  if(!Number.isFinite(price)||price<0)return toast('Añade un precio válido.');
  if(id)Object.assign(s.products.find(p=>p.id===id),{name,price,promos}); else s.products.push({id:crypto.randomUUID(),name,price,promos});
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
  const empty = mrec.length ? (mlines.length ? `<tr><td colspan="3" class="muted">No se registraron ventas este mes.</td></tr>` : '') : '';
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
  return `<div class="grid"><div class="card stat"><div class="muted">Productos registrados</div><div class="value">${s.products.length}</div><div class="small">En tu catálogo</div></div><div class="card stat"><div class="muted">Unidades vendidas</div><div class="value">${units}</div><div class="small">Del ${formatDate(selected)}</div></div><div class="card stat accent"><div class="muted">Total producido</div><div class="value">${money(revenue)}</div><div class="small">Del ${formatDate(selected)}</div></div></div><div class="panel"><div class="panel-head"><div><h2>Resumen por día</h2><p class="muted">Consulta hasta cinco días por página.</p></div><button class="button primary" onclick="setTab('ventas')">Registrar ventas</button></div>${dates.length?`<div class="day-tabs">${state.summaryPage>0?`<button class="day-nav" onclick="summaryPage(-1)">← Más recientes</button>`:''}${shown.map(d=>`<button class="day-tab ${d===selected?'active':''}" onclick="selectSummaryDate('${d}')">${formatDate(d)}</button>`).join('')}${(state.summaryPage||0)<pages-1?`<button class="day-nav" onclick="summaryPage(1)">Anteriores →</button>`:''}</div><table><thead><tr><th>Producto o promoción</th><th>Unidades</th><th>Producido</th></tr></thead><tbody>${lines.length?lines.map(x=>`<tr><td class="product-name">${esc(x.name)}</td><td>${x.qty}</td><td><b>${money(x.value)}</b></td></tr>`).join(''):`<tr><td colspan="3" class="muted">No se registraron ventas este día.</td></tr>`}</tbody></table>`:`<div class="notice">Cuando registres ventas, aquí verás el detalle diario.</div>`}</div>${monthPanel(s, mm)}`;
}
function history(s) {
  const closed=s.sales.filter(x=>x.closed).sort((a,b)=>b.date.localeCompare(a.date));
  return `<div class="panel"><div class="panel-head"><div><h2>Historial de ventas</h2><p class="muted">Edita un día para añadir productos o promociones que olvidaste.</p></div></div>${closed.length?closed.map(x=>`<div class="history-row"><div><div class="date">${formatDate(x.date)} <span class="tag">Cerrado</span></div><div class="muted">${x.items.reduce((a,i)=>a+i.qty,0)} unidades · <span class="record-total">Total producido: ${money(total(x,s))}</span></div></div><div class="actions"><button class="button secondary" onclick="editSale('${x.id}')">Editar</button><button class="icon-btn" title="Exportar este día" onclick="exportExcel('${x.id}')">⇩</button><button class="icon-btn delete-record" title="Borrar registro" onclick="deleteSale('${x.id}')">×</button></div></div>`).join(''):`<div class="empty"><div class="emoji">📅</div><b>Aún no hay días finalizados</b><p>Al cerrar un día, quedará guardado aquí.</p></div>`}</div>`;
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
  let me; try { me = syncClientId; } catch (e) { me = ''; }
  const sm = s.members || {};
  const nameOf = uid => (sm[uid] && sm[uid].name) || (uid === me ? (() => { try { return syncName(); } catch (e) { return 'Trabajador'; } })() : 'Trabajador');
  const acc = {};
  s.sales.forEach(x => x.items.forEach(i => {
    if (!i.who) return;
    Object.keys(i.who).forEach(uid => {
      const q = i.who[uid]; if (!q) return;
      const p = s.products.find(p => p.id === i.productId);
      const pr = p && p.promos.find(z => z.id === i.promotionId);
      const val = priceFor(i, s) * q;
      const a = acc[uid] || (acc[uid] = { units: 0, money: 0, days: new Set(), detail: {} });
      a.units += q; a.money += val; a.days.add(x.date);
      const d = a.detail[x.date] || (a.detail[x.date] = { units: 0, money: 0, rows: {} });
      d.units += q; d.money += val;
      const key = i.productId + '|' + (i.promotionId || '');
      const r = d.rows[key] || (d.rows[key] = { name: pr ? pr.label + ' · ' + p.name : (p ? p.name : 'Producto eliminado'), qty: 0, money: 0 });
      r.qty += q; r.money += val;
    });
  }));
  const rows = [];
  Object.keys(sm).forEach(uid => rows.push({ uid, name: nameOf(uid), role: s.createdBy === uid ? 'Creador' : 'Trabajador', a: acc[uid] || null }));
  Object.keys(acc).forEach(uid => { if (!rows.find(r => r.uid === uid)) rows.push({ uid, name: nameOf(uid), role: 'Trabajador', a: acc[uid] }); });
  rows.sort((x, y) => (y.a ? y.a.money : 0) - (x.a ? x.a.money : 0)).sort((x, y) => (y.role === 'Creador' ? 1 : 0) - (x.role === 'Creador' ? 1 : 0));
  const detail = a => {
    if (!a) return '<p class="muted" style="margin:0">Todavía no registra ventas.</p>';
    return Object.keys(a.detail).sort((x, y) => y.localeCompare(x)).map(dt => {
      const d = a.detail[dt];
      return `<div class="emp-date"><b>${formatDate(dt)}</b><span class="muted">${d.units} uds · ${money(d.money)}</span></div><div class="emp-items">${Object.keys(d.rows).map(k => `<div class="emp-item"><span>${esc(d.rows[k].name)}</span><b>${d.rows[k].qty} ×</b><span class="muted">${money(d.rows[k].money)}</span></div>`).join('')}</div>`;
    }).join('');
  };
  const body = rows.length
    ? `<table><thead><tr><th>Empleado</th><th>Unidades vendidas</th><th>Producido</th><th>Días con ventas</th><th></th></tr></thead><tbody>${rows.map(r => `<tr><td class="product-name">${esc(r.name)}${r.role === 'Creador' ? ' <span class="tag">Creador</span>' : ''}</td><td>${r.a ? r.a.units : 0}</td><td><b>${money(r.a ? r.a.money : 0)}</b></td><td>${r.a ? r.a.days.size : 0}</td><td><button class="icon-btn emp-toggle" ${r.a ? '' : 'disabled'} title="${r.a ? 'Ver qué vendió' : 'Sin ventas'}" onclick="toggleEmp(this)">▾</button></td></tr><tr class="emp-detail-row" style="display:none"><td colspan="5"><div class="emp-detail">${detail(r.a)}</div></td></tr>`).join('')}</tbody></table>`
    : `<div class="empty"><div class="emoji">👥</div><b>Aún no hay empleados</b><p>Cuando alguien se una con tu código y toque + en Ventas del día, aquí verás lo que registró.</p></div>`;
  return `<div class="panel"><div class="panel-head"><div><h2>Registro de empleados</h2><p class="muted">Unidades y producido que cada quien registró al tocar + en Ventas del día. Toca ▾ para ver el detalle por fecha.</p></div></div>${body}</div>`;
}
function toggleEmp(btn) {
  const tr = btn.closest('tr');
  const next = tr && tr.nextElementSibling;
  if (!next || !next.classList.contains('emp-detail-row')) return;
  const open = next.style.display !== 'none';
  next.style.display = open ? 'none' : 'table-row';
  btn.classList.toggle('open', !open);
}
function setTab(tab) { if(tab!=='ventas')state.editingSaleId=null; if(tab==='inicio'){state.summaryPage=0;state.summaryDate=null;state.summaryMonth=null;} state.tab=tab;save();render(); }
render();
