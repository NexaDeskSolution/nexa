"use strict";

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

const statusClasses = {
  "ABERTO":"aberto","TRIAGEM":"triagem","ANÁLISE":"analise","MANUTENÇÃO":"manutencao",
  "AGUARDANDO PEÇA":"aguardando-peca","AGUARDANDO CLIENTE":"aguardando-peca",
  "FINALIZADO":"finalizado","DEVOLVIDO":"devolvido","SEM SOLUÇÃO":"sem-solucao",
  "APROVADO":"finalizado","PAGO":"finalizado","RECUSADO":"recusado","ATIVO":"finalizado",
  "INATIVO":"sem-solucao","DISPONÍVEL":"finalizado","EM SERVIÇO":"aberto","EM MANUTENÇÃO":"manutencao"
};
const modules = {
  "dashboard": {title:"Dashboard", desc:"Acompanhe o que está acontecendo na sua operação hoje."},
  "chamados": {title:"Chamados", desc:"Gerencie solicitações, prioridades, responsáveis e o fluxo de atendimento.", create:"Novo chamado", columns:["Chamado","Cliente","Assunto","Técnico","Prioridade","Status","Abertura"], fields:[["cliente","Cliente"],["equipamento","Equipamento"],["descricao","Descrição do problema","textarea"],["prioridade","Prioridade","select",["BAIXA","MÉDIA","ALTA","CRÍTICA"]],["categoria","Categoria","select",["HARDWARE","SOFTWARE","REDE","SEGURANÇA","INFRAESTRUTURA","OUTROS"]],["tecnico","Técnico responsável"],["status","Status","select",["ABERTO","TRIAGEM","ANÁLISE","AGUARDANDO PEÇA","MANUTENÇÃO","AGUARDANDO CLIENTE","FINALIZADO","SEM SOLUÇÃO"]]]},
  "meus-chamados": {title:"Meus chamados", desc:"Visualize os chamados atribuídos ao técnico conectado.", create:"Novo chamado", columns:["Chamado","Cliente","Assunto","Prioridade","Status","Abertura"]},
  "clientes": {title:"Clientes", desc:"Cadastre e consulte empresas atendidas pela NexaTech.", create:"Novo cliente", columns:["Cliente","CPF / CNPJ","E-mail","Telefone","Status","Cadastro"], fields:[["nome","Nome / razão social"],["documento","CPF / CNPJ"],["email","E-mail","email"],["telefone","Telefone"],["endereco","Endereço","text"],["status","Status","select",["ATIVO","INATIVO"]]]},
  "equipamentos": {title:"Equipamentos", desc:"Controle patrimônio, identificação e situação dos equipamentos.", create:"Novo equipamento", columns:["Patrimônio","Equipamento","Cliente","Fabricante / modelo","Nº de série","Status"], fields:[["patrimonio","Número do patrimônio"],["tipo","Tipo de equipamento"],["fabricante","Fabricante"],["modelo","Modelo"],["serie","Número de série"],["cliente","Cliente"],["status","Status","select",["DISPONÍVEL","EM SERVIÇO","EM MANUTENÇÃO","AGUARDANDO PEÇA","FINALIZADO","DEVOLVIDO"]]]},
  "tecnicos": {title:"Técnicos", desc:"Acompanhe especialidades, disponibilidade e carga de trabalho.", create:"Novo técnico", columns:["Técnico","E-mail","Especialidade","Chamados ativos","Status","Contratação"], fields:[["nome","Nome completo"],["email","E-mail","email"],["especialidade","Especialidade","select",["HARDWARE","SOFTWARE","REDES","SEGURANÇA","INFRAESTRUTURA"]],["contratacao","Data de contratação","date"],["status","Status","select",["ATIVO","INATIVO"]]]},
  "estoque": {title:"Estoque de peças", desc:"Monitore quantidades, fornecedores e alertas de estoque mínimo.", create:"Cadastrar peça", columns:["Peça","Código","Quantidade","Estoque mínimo","Preço unitário","Fornecedor","Situação"], fields:[["nome","Nome da peça"],["codigo","Código"],["quantidade","Quantidade","number"],["minimo","Estoque mínimo","number"],["preco","Preço unitário","number"],["fornecedor","Fornecedor"],["status","Situação","select",["DISPONÍVEL","ESTOQUE BAIXO"]]]},
  "fornecedores": {title:"Fornecedores", desc:"Mantenha os dados dos parceiros e suas peças vinculadas.", create:"Novo fornecedor", columns:["Fornecedor","CNPJ","E-mail","Telefone","Status"], fields:[["nome","Nome do fornecedor"],["cnpj","CNPJ"],["email","E-mail","email"],["telefone","Telefone"],["endereco","Endereço","text"],["status","Status","select",["ATIVO","INATIVO"]]]},
  "orcamentos": {title:"Orçamentos", desc:"Consulte valores, aprovações e situação dos orçamentos por chamado.", create:"Novo orçamento", columns:["Orçamento","Chamado","Cliente","Serviços","Peças","Valor total","Status"], fields:[["chamado","Número do chamado"],["cliente","Cliente"],["servicos","Valor dos serviços","number"],["pecas","Valor das peças","number"],["status","Status","select",["ORÇAMENTO","AGUARDANDO APROVAÇÃO","APROVADO","RECUSADO","PAGO"]]]},
  "financeiro": {title:"Financeiro", desc:"Acompanhe pagamentos registrados, valores e datas de recebimento.", create:"Registrar pagamento", columns:["Pagamento","Orçamento","Cliente","Valor","Forma","Data","Status"], fields:[["orcamento","Orçamento"],["cliente","Cliente"],["valor","Valor recebido","number"],["forma","Forma de pagamento","select",["PIX","Cartão","Transferência","Dinheiro","Boleto"]],["data","Data do pagamento","date"],["status","Status","select",["PENDENTE","PAGO"]]]},
  "historico": {title:"Histórico / auditoria", desc:"Consulte o registro cronológico das principais ações do sistema.", columns:["Data e hora","Usuário","Ação","Registro afetado","Detalhes"]},
  "usuarios": {title:"Usuários", desc:"Gerencie acessos e perfis de usuários internos.", create:"Novo usuário", columns:["Usuário","E-mail","Perfil","Status","Criado em"], fields:[["nome","Nome completo"],["email","E-mail","email"],["perfil","Perfil","select",["ADMINISTRADOR","TÉCNICO","ATENDENTE"]],["status","Status","select",["ATIVO","INATIVO"]]]}
};

const data = {
  "chamados":[
    ["#CH-1048","Acme Tecnologia","Falha no servidor de arquivos","Mariana Costa","CRÍTICA","MANUTENÇÃO","15/10/2026"],
    ["#CH-1047","Grupo Horizonte","Notebook não inicia","Rafael Lima","ALTA","AGUARDANDO PEÇA","15/10/2026"],
    ["#CH-1046","Clínica Vida Plena","Instabilidade na rede Wi-Fi","Lucas Mendes","MÉDIA","ANÁLISE","14/10/2026"],
    ["#CH-1045","Nova Era Contábil","Atualização de sistema","Mariana Costa","BAIXA","ABERTO","14/10/2026"],
    ["#CH-1044","Acme Tecnologia","Substituição de SSD","Rafael Lima","ALTA","FINALIZADO","13/10/2026"],
    ["#CH-1043","Grupo Horizonte","Configuração de VPN","Lucas Mendes","MÉDIA","TRIAGEM","13/10/2026"],
    ["#CH-1042","Mercado Central","Estação de trabalho lenta","Mariana Costa","BAIXA","AGUARDANDO CLIENTE","12/10/2026"],
    ["#CH-1041","Clínica Vida Plena","Falha em backup","Rafael Lima","CRÍTICA","MANUTENÇÃO","12/10/2026"]
  ],
  "clientes":[
    ["Acme Tecnologia","12.345.678/0001-90","contato@acme.example","(27) 3333-1000","ATIVO","02/03/2026"],
    ["Grupo Horizonte","23.456.789/0001-01","ti@horizonte.example","(27) 3333-2000","ATIVO","11/03/2026"],
    ["Clínica Vida Plena","34.567.890/0001-12","suporte@vidaplena.example","(27) 3333-3000","ATIVO","18/03/2026"],
    ["Nova Era Contábil","45.678.901/0001-23","contato@novaera.example","(27) 3333-4000","ATIVO","25/03/2026"],
    ["Mercado Central","56.789.012/0001-34","infra@mercado.example","(27) 3333-5000","INATIVO","02/04/2026"]
  ],
  "equipamentos":[
    ["PAT-00081","Servidor Dell PowerEdge","Acme Tecnologia","Dell / R450","SN-DEMO-8101","EM MANUTENÇÃO"],
    ["PAT-00080","Notebook corporativo","Grupo Horizonte","Lenovo / ThinkPad E14","SN-DEMO-8002","AGUARDANDO PEÇA"],
    ["PAT-00079","Access point","Clínica Vida Plena","Ubiquiti / U6-Lite","SN-DEMO-7903","EM SERVIÇO"],
    ["PAT-00078","Desktop corporativo","Nova Era Contábil","HP / ProDesk 400","SN-DEMO-7804","DISPONÍVEL"],
    ["PAT-00077","Servidor de backup","Mercado Central","HPE / MicroServer","SN-DEMO-7705","FINALIZADO"]
  ],
  "meus-chamados":[],
  "tecnicos":[
    ["Mariana Costa","mariana.costa@example.com","INFRAESTRUTURA","8","ATIVO","10/02/2025"],
    ["Rafael Lima","rafael.lima@example.com","HARDWARE","6","ATIVO","18/05/2025"],
    ["Lucas Mendes","lucas.mendes@example.com","REDES","4","ATIVO","03/08/2025"],
    ["Ana Souza","ana.souza@example.com","SEGURANÇA","2","INATIVO","12/11/2024"]
  ],
  "estoque":[
    ["SSD 480 GB","SSD-480","2","5","R$ 189,90","TechParts","ESTOQUE BAIXO"],
    ["Memória DDR4 8 GB","MEM-DDR4-8","3","6","R$ 119,00","InfoSupply","ESTOQUE BAIXO"],
    ["Fonte ATX 500 W","FNT-500","1","3","R$ 229,90","TechParts","ESTOQUE BAIXO"],
    ["Cabo de rede Cat6","CAB-CAT6","42","15","R$ 2,50","Conecta TI","DISPONÍVEL"],
    ["Cooler 120 mm","COL-120","18","5","R$ 35,00","InfoSupply","DISPONÍVEL"]
  ],
  "fornecedores":[
    ["TechParts Distribuidora","11.222.333/0001-44","vendas@techparts.example","(11) 4000-1000","ATIVO"],
    ["InfoSupply","22.333.444/0001-55","comercial@infosupply.example","(21) 4000-2000","ATIVO"],
    ["Conecta TI","33.444.555/0001-66","contato@conectati.example","(31) 4000-3000","ATIVO"]
  ],
  "orcamentos":[
    ["#OR-0208","#CH-1048","Acme Tecnologia","R$ 850,00","R$ 1.120,00","R$ 1.970,00","AGUARDANDO APROVAÇÃO"],
    ["#OR-0207","#CH-1047","Grupo Horizonte","R$ 180,00","R$ 390,00","R$ 570,00","ORÇAMENTO"],
    ["#OR-0206","#CH-1044","Acme Tecnologia","R$ 220,00","R$ 189,90","R$ 409,90","PAGO"],
    ["#OR-0205","#CH-1042","Mercado Central","R$ 120,00","R$ 0,00","R$ 120,00","RECUSADO"]
  ],
  "financeiro":[
    ["#PG-0311","#OR-0206","Acme Tecnologia","R$ 409,90","PIX","13/10/2026","PAGO"],
    ["#PG-0310","#OR-0203","Clínica Vida Plena","R$ 280,00","Transferência","12/10/2026","PAGO"],
    ["#PG-0309","#OR-0202","Nova Era Contábil","R$ 650,00","Boleto","10/10/2026","PENDENTE"]
  ],
  "historico":[
    ["15/10/2026 14:32","Mariana Costa","Status alterado","#CH-1048","ANÁLISE → MANUTENÇÃO"],
    ["15/10/2026 13:58","Kaike Almeida","Técnico atribuído","#CH-1048","Mariana Costa atribuída ao chamado"],
    ["15/10/2026 11:20","Rafael Lima","Peça adicionada","#CH-1047","SSD 480 GB · quantidade 1"],
    ["14/10/2026 17:44","Lucas Mendes","Serviço registrado","#CH-1046","Diagnóstico de conectividade"],
    ["14/10/2026 16:10","Kaike Almeida","Chamado criado","#CH-1046","Solicitação recebida"]
  ],
  "usuarios":[
    ["Kaike Almeida","kaike.almeida@example.com","ADMINISTRADOR","ATIVO","01/10/2026"],
    ["Mariana Costa","mariana.costa@example.com","TÉCNICO","ATIVO","10/10/2026"],
    ["Rafael Lima","rafael.lima@example.com","TÉCNICO","ATIVO","10/10/2026"],
    ["Lucas Mendes","lucas.mendes@example.com","TÉCNICO","ATIVO","10/10/2026"],
    ["Ana Souza","ana.souza@example.com","ATENDENTE","INATIVO","11/10/2026"]
  ]
};
data["meus-chamados"] = data.chamados.filter(row => row[3] === "Mariana Costa").map(row => [row[0],row[1],row[2],row[4],row[5],row[6]]);

let currentPage = "dashboard";
let activeFormModule = null;
let nextDemoId = 1;

function escapeHTML(value) {
  return String(value ?? "").replace(/[&<>"']/g, ch => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]));
}
function statusPill(value) {
  const key = String(value || "").toUpperCase();
  const css = statusClasses[key] || "aberto";
  return `<span class="status-pill ${css}">${escapeHTML(value)}</span>`;
}
function priorityPill(value) {
  const key = String(value || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"");
  return `<span class="priority ${key}">${escapeHTML(value)}</span>`;
}
function cellHTML(value, column) {
  if (column === "Status" || column === "Situação" || column === "Perfil") return statusPill(value);
  if (column === "Prioridade") return priorityPill(value);
  if (column === "Chamado" || column === "Orçamento" || column === "Pagamento" || column === "Patrimônio") return `<span class="ticket-id">${escapeHTML(value)}</span>`;
  if (column === "Cliente" || column === "Técnico" || column === "Fornecedor" || column === "Usuário" || column === "Peça" || column === "Equipamento") return `<span class="client-cell">${escapeHTML(value)}</span>`;
  return escapeHTML(value);
}
function renderRecent() {
  const rows = data.chamados.slice(0,4);
  $("#recent-tickets").innerHTML = rows.map(row => `<tr><td>${cellHTML(row[0],"Chamado")}</td><td>${cellHTML(row[1],"Cliente")}</td><td>${escapeHTML(row[2])}</td><td>${priorityPill(row[4])}</td><td>${statusPill(row[5])}</td></tr>`).join("");
  const low = data.estoque.filter(row => row[6] === "ESTOQUE BAIXO").slice(0,3);
  $("#low-stock-list").innerHTML = low.map(row => `<div class="stock-item"><span class="stock-item-icon">▧</span><div class="stock-info"><strong>${escapeHTML(row[0])}</strong><small>Código: ${escapeHTML(row[1])} · Mínimo: ${escapeHTML(row[3])}</small></div><span class="stock-qty">${escapeHTML(row[2])} un.</span></div>`).join("");
}
function renderModule(page) {
  const config = modules[page];
  if (!config) return;
  currentPage = page;
  $("#page-dashboard").classList.toggle("hidden", page !== "dashboard");
  $("#page-generic").classList.toggle("hidden", page === "dashboard");
  $$(".nav-item").forEach(btn => btn.classList.toggle("active", btn.dataset.page === page));
  $("#breadcrumb-current").textContent = config.title;
  if (page === "dashboard") return;
  $("#generic-title").textContent = config.title;
  $("#generic-description").textContent = config.desc;
  $("#generic-eyebrow").textContent = page === "historico" ? "RASTREABILIDADE" : "GESTÃO OPERACIONAL";
  $("#generic-create").classList.toggle("hidden", !config.create);
  $("#generic-create-label").textContent = config.create || "Novo registro";
  $("#table-search").value = "";
  $("#status-filter").innerHTML = '<option value="">Todos os status</option>';
  const statusIndex = config.columns.indexOf("Status") >= 0 ? config.columns.indexOf("Status") : config.columns.indexOf("Situação");
  if (statusIndex >= 0) {
    const vals = [...new Set((data[page] || []).map(r => r[statusIndex]).filter(Boolean))];
    vals.forEach(v => $("#status-filter").insertAdjacentHTML("beforeend", `<option>${escapeHTML(v)}</option>`));
    $("#status-filter").disabled = false;
  } else {
    $("#status-filter").disabled = true;
  }
  $("#priority-filter").value = "";
  $("#category-filter").value = "";
  $("#date-filter").value = "";
  $("#generic-alert").classList.add("hidden");
  $("#generic-thead").innerHTML = `<tr>${config.columns.map(c=>`<th>${escapeHTML(c.toUpperCase())}</th>`).join("")}</tr>`;
  renderTable();
  $("#sidebar").classList.remove("sidebar-open");
}
function renderTable() {
  const config = modules[currentPage];
  if (!config || currentPage === "dashboard") return;
  const rows = (data[currentPage] || []).filter(row => {
    const query = $("#table-search").value.trim().toLocaleLowerCase("pt-BR");
    const matchesQuery = !query || row.join(" ").toLocaleLowerCase("pt-BR").includes(query);
    const statusIdx = config.columns.indexOf("Status") >= 0 ? config.columns.indexOf("Status") : config.columns.indexOf("Situação");
    const status = $("#status-filter").value;
    const matchesStatus = !status || statusIdx < 0 || row[statusIdx] === status;
    const pIdx = config.columns.indexOf("Prioridade");
    const matchesPriority = !$("#priority-filter").value || pIdx < 0 || row[pIdx] === $("#priority-filter").value;
    const cat = $("#category-filter").value;
    const matchesCategory = !cat || row.join(" ").includes(cat);
    return matchesQuery && matchesStatus && matchesPriority && matchesCategory;
  });
  $("#generic-tbody").innerHTML = rows.length ? rows.map(row => `<tr>${config.columns.map((col,i)=>`<td>${cellHTML(row[i] ?? "—",col)}</td>`).join("")}</tr>`).join("") : `<tr><td colspan="${config.columns.length}" style="text-align:center;padding:36px;color:#98a6b7">Nenhum registro corresponde aos filtros.</td></tr>`;
  $("#table-count").textContent = `Exibindo ${rows.length} de ${(data[currentPage] || []).length} registros demonstrativos`;
}
function showToast(message) {
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;
  $("#toast-region").appendChild(toast);
  setTimeout(() => toast.remove(), 3600);
}
function openModal(page) {
  const config = modules[page];
  if (!config || !config.fields) { showToast("O formulário deste módulo será definido durante a integração."); return; }
  activeFormModule = page;
  $("#modal-title").textContent = config.create || "Novo registro";
  $("#modal-fields").innerHTML = config.fields.map(([name,label,type="text",options=[]]) => {
    const full = type === "textarea" || ["endereco","descricao"].includes(name) ? " full" : "";
    let control = "";
    if (type === "select") control = `<select id="field-${name}" name="${name}" required><option value="">Selecione...</option>${options.map(v=>`<option>${escapeHTML(v)}</option>`).join("")}</select>`;
    else if (type === "textarea") control = `<textarea id="field-${name}" name="${name}" placeholder="${escapeHTML(label)}" required></textarea>`;
    else control = `<input id="field-${name}" name="${name}" type="${["email","number","date"].includes(type)?type:"text"}" ${type==="number"?'min="0" step="0.01"':""} placeholder="${escapeHTML(label)}" required>`;
    return `<div class="form-field${full}"><label for="field-${name}">${escapeHTML(label)}</label>${control}</div>`;
  }).join("");
  $("#modal-backdrop").classList.remove("hidden");
  const first = $("#modal-fields input, #modal-fields select, #modal-fields textarea");
  if (first) first.focus();
}
function closeModal() { $("#modal-backdrop").classList.add("hidden"); $("#record-form").reset(); activeFormModule = null; }
function saveDemoRecord(event) {
  event.preventDefault();
  if (!activeFormModule) return;
  const config = modules[activeFormModule];
  const values = config.fields.map(([name,label]) => {
    const el = $(`#field-${name}`);
    return el ? el.value.trim() : "";
  });
  if (activeFormModule === "chamados") {
    const prefix = `#CH-${1050 + nextDemoId++}`;
    const row = [prefix,values[0],values[2],values[5] || "Não atribuído",values[3],values[6] || "ABERTO",new Date().toLocaleDateString("pt-BR")];
    data.chamados.unshift(row);
    data["meus-chamados"].unshift([row[0],row[1],row[2],row[4],row[5],row[6]]);
  } else {
    const row = values.map((v,i) => v || "—");
    if (activeFormModule === "clientes") row.push(new Date().toLocaleDateString("pt-BR"));
    if (activeFormModule === "equipamentos") {}
    data[activeFormModule].unshift(row);
  }
  const moduleName = config.title;
  closeModal();
  renderModule(currentPage);
  renderRecent();
  const alert = $("#generic-alert");
  alert.textContent = `Registro de demonstração adicionado em ${moduleName}. Nenhum dado foi enviado ao banco de dados.`;
  alert.classList.remove("hidden","error");
  showToast("Registro adicionado à demonstração.");
}
function goTo(page) {
  if (!modules[page]) return;
  renderModule(page);
  if (page === "dashboard") window.scrollTo({top:0,behavior:"smooth"});
  else window.scrollTo({top:0,behavior:"smooth"});
}
function enterDemo(event) {
  event.preventDefault();
  const email = $("#login-email").value.trim();
  const password = $("#login-password").value;
  if (!email || !password) { $("#login-message").textContent = "Preencha o e-mail e a senha para continuar."; return; }
  const displayName = email.split("@")[0].replace(/[._-]+/g," ").replace(/\b\w/g, c => c.toUpperCase()) || "Usuário";
  $("#sidebar-user").textContent = displayName;
  $("#top-user").textContent = displayName;
  $("#login-screen").classList.add("hidden");
  $("#app-shell").classList.remove("hidden");
  showToast("Acesso demonstrativo iniciado. Autenticação real ainda não implementada.");
}
function exportDemo() {
  const config = modules[currentPage];
  const rows = data[currentPage] || [];
  const csv = [config.columns.join(";"),...rows.map(row=>row.map(value=>`"${String(value ?? "").replace(/"/g,'""')}"`).join(";"))].join("\n");
  const blob = new Blob(["\ufeff"+csv],{type:"text/csv;charset=utf-8;"});
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = `nexadesk-${currentPage}.csv`; a.click();
  URL.revokeObjectURL(url);
  showToast("Exportação dos dados demonstrativos iniciada.");
}

document.addEventListener("DOMContentLoaded", () => {
  $("#login-form").addEventListener("submit", enterDemo);
  $("#toggle-password").addEventListener("click", () => {
    const input = $("#login-password");
    input.type = input.type === "password" ? "text" : "password";
  });
  $$(".nav-item").forEach(button => button.addEventListener("click", () => goTo(button.dataset.page)));
  $$("[data-go]").forEach(button => button.addEventListener("click", () => goTo(button.dataset.go)));
  $("#generic-create").addEventListener("click", () => openModal(currentPage));
  $("#modal-close").addEventListener("click", closeModal);
  $("#modal-cancel").addEventListener("click", closeModal);
  $("#modal-backdrop").addEventListener("click", event => { if (event.target === $("#modal-backdrop")) closeModal(); });
  $("#record-form").addEventListener("submit", saveDemoRecord);
  $("#table-search").addEventListener("input", renderTable);
  $("#status-filter").addEventListener("change", renderTable);
  $("#priority-filter").addEventListener("change", renderTable);
  $("#category-filter").addEventListener("change", renderTable);
  $("#date-filter").addEventListener("change", renderTable);
  $("#filter-button").addEventListener("click", () => $("#extra-filters").classList.toggle("hidden"));
  $("#dismiss-banner").addEventListener("click", () => $(".demo-banner").remove());
  $("#open-sidebar").addEventListener("click", () => $("#sidebar").classList.add("sidebar-open"));
  $("#close-sidebar").addEventListener("click", () => $("#sidebar").classList.remove("sidebar-open"));
  $("#notifications-button").addEventListener("click", () => showToast("Você está vendo notificações de exemplo."));
  $("#profile-button").addEventListener("click", () => showToast("Perfil demonstrativo. A gestão real de sessão será integrada ao backend."));
  $("#top-profile").addEventListener("click", () => showToast("Perfil demonstrativo. A gestão real de sessão será integrada ao backend."));
  $("#help-link").addEventListener("click", event => { event.preventDefault(); showToast("A central de ajuda será adicionada em uma etapa futura."); });
  $("#period-button").addEventListener("click", () => showToast("Seletor de período visual para a futura integração do dashboard."));
  $("#chart-period").addEventListener("click", () => showToast("Gráfico com dados estáticos de demonstração."));
  $$("[data-action='export']").forEach(button => button.addEventListener("click", exportDemo));
  document.addEventListener("keydown", event => {
    if (event.key === "Escape") { closeModal(); $("#sidebar").classList.remove("sidebar-open"); }
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
      if (!$("#app-shell").classList.contains("hidden")) { event.preventDefault(); $("#table-search").focus(); }
    }
  });
  renderRecent();
});
