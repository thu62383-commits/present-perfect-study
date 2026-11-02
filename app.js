const DATA_URL = "data.json";
let data = null, activeGroup = null, activeTerm = null, quizList = [], quizIndex = 0, quizMode = "all", selectedAnswer = null, answered = false, score = 0;

const $ = (s) => document.querySelector(s);
const $$ = (s) => [...document.querySelectorAll(s)];
const escapeHTML = (str="") => String(str).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const toast = (msg) => { const t=$("#toast"); t.textContent=msg; t.classList.add("show"); setTimeout(()=>t.classList.remove("show"),2600); };
const allTerms = () => data.groups.flatMap(g => g.items.map(item => ({...item, group:g})));
const groupById = id => data.groups.find(g=>g.id===id);
const termById = id => allTerms().find(t=>t.id===id);

async function init(){
  try{
    const saved = localStorage.getItem("grammarGardenData");
    if(saved) data = JSON.parse(saved);
    else { const response=await fetch(DATA_URL); if(!response.ok) throw new Error("Không tải được data.json"); data=await response.json(); }
    validateData(data);
    renderAll();
  }catch(err){
    $("#pageTitle").textContent="Không thể tải dữ liệu";
    $("#view-overview").innerHTML=`<div class="notice">Không thể đọc dữ liệu. Hãy chạy trang bằng Live Server trong VS Code và kiểm tra file <b>data.json</b>.<br>${escapeHTML(err.message)}</div>`;
  }
}
function validateData(obj){
  if(!obj || !Array.isArray(obj.groups) || !Array.isArray(obj.exercises)) throw new Error("JSON cần có groups và exercises dạng mảng.");
  if(obj.groups.some(g=>!g.id || !g.title || !Array.isArray(g.items))) throw new Error("Một nhóm kiến thức đang thiếu id, title hoặc items.");
  if(obj.groups.some(g=>g.items.some(i=>!i.id || !i.word || !Array.isArray(i.examples)))) throw new Error("Một dấu hiệu đang thiếu id, word hoặc examples.");
}
function renderAll(){
  $("#pageTitle").textContent=data.title || "Present Perfect";
  renderOverview(); renderMindmap(); renderLibrary(); renderFilter(); renderPractice();
  $("#jsonEditor").value=JSON.stringify(data,null,2);
}
function showView(name){
  $$(".view").forEach(v=>v.classList.toggle("active",v.id===`view-${name}`));
  $$(".nav-link").forEach(b=>b.classList.toggle("active",b.dataset.view===name));
  const titles={overview:"Present Perfect",mindmap:"Sơ đồ mindmap",library:"Kho kiến thức",practice:"Góc luyện tập",manage:"Quản lí dữ liệu"};
  $("#pageTitle").textContent=titles[name]||data.title;
  $(".sidebar").classList.remove("open");
  window.scrollTo({top:0,behavior:"smooth"});
}
function renderOverview(){
  $("#overviewGroups").innerHTML=data.groups.map(g=>`<button class="preview-item" data-open-group="${escapeHTML(g.id)}"><b>${escapeHTML(g.title)}</b><small>${escapeHTML(g.subtitle||"")} · ${g.items.length} dấu hiệu</small></button>`).join("");
  $("#overviewGroups").querySelectorAll("[data-open-group]").forEach(b=>b.onclick=()=>{showView("mindmap");openGroup(b.dataset.openGroup);});
}
function renderMindmap(){
  $("#groupCount").textContent=`${data.groups.length} nhóm · ${allTerms().length} dấu hiệu`;
  $("#treeBranches").innerHTML=data.groups.map(g=>`<div class="tree-group"><button class="tree-group-head" data-group="${escapeHTML(g.id)}" style="background:${groupTint(g.color)}"><span>${escapeHTML(g.title)}<small>${escapeHTML(g.subtitle||"")}</small></span><span>⌄</span></button><div class="tree-children">${g.items.map(i=>`<button class="tree-child" data-term="${escapeHTML(i.id)}">${escapeHTML(i.word)} <span>→</span></button>`).join("")}</div></div>`).join("");
  $$("#treeBranches [data-group]").forEach(b=>b.onclick=()=>openGroup(b.dataset.group));
  $$("#treeBranches [data-term]").forEach(b=>b.onclick=()=>openTermInMindmap(b.dataset.term));
}
function groupTint(color){return ({sage:"#edf3eb",cream:"#f5f0e5",lavender:"#f0edf7",pink:"#f8eeee",blue:"#edf2f6"})[color]||"#edf3eb";}
function openGroup(id){
  activeGroup=id; const g=groupById(id); if(!g)return;
  $("#mindDetail").innerHTML=`<span class="detail-tag">NHÓM DẤU HIỆU</span><h3>${escapeHTML(g.title)}</h3><p>${escapeHTML(g.subtitle||"")}</p><div class="info-block"><b>Ý nghĩa chung</b><p>${escapeHTML(g.description||"")}</p></div><div class="info-block"><b>Các dấu hiệu trong nhóm</b><p>${g.items.map(i=>`<button class="text-btn" data-mind-term="${escapeHTML(i.id)}">${escapeHTML(i.word)}</button>`).join(" · ")}</p></div><div class="info-block"><b>Mẹo ghi nhớ</b><p>Chọn từng dấu hiệu trong nhánh để xem cách dùng, vị trí và ví dụ minh họa.</p></div>`;
  $$("#mindDetail [data-mind-term]").forEach(b=>b.onclick=()=>openTermInMindmap(b.dataset.mindTerm));
}
function openTermInMindmap(id){
  const t=termById(id); if(!t)return;
  $$("#treeBranches [data-term]").forEach(b=>b.classList.toggle("selected",b.dataset.term===id));
  $("#mindDetail").innerHTML=termDetailHTML(t);
}
function termDetailHTML(t){
  return `<span class="detail-tag">${escapeHTML(t.group.title)}</span><h3>${escapeHTML(t.word)}</h3><p><b>${escapeHTML(t.meaning)}</b></p><div class="info-block"><b>Cách dùng</b><p>${escapeHTML(t.use)}</p></div><div class="info-block"><b>Vị trí trong câu</b><p>${escapeHTML(t.position)}</p></div><div class="info-block"><b>Ví dụ minh họa</b>${t.examples.map(exampleHTML).join("")}</div>`;
}
function exampleHTML(e){return `<div class="example"><div class="en">${escapeHTML(e.en)}</div><div class="vi">${escapeHTML(e.vi)}</div>${e.note?`<div class="note">↳ ${escapeHTML(e.note)}</div>`:""}</div>`;}
function renderFilter(){
  $("#groupFilter").innerHTML='<option value="all">Tất cả nhóm</option>'+data.groups.map(g=>`<option value="${escapeHTML(g.id)}">${escapeHTML(g.title)}</option>`).join("");
}
function renderLibrary(){
  const q=($("#searchInput")?.value||"").toLowerCase().trim(), filter=$("#groupFilter")?.value||"all";
  const terms=allTerms().filter(t=>(filter==="all"||t.group.id===filter)&&(!q||[t.word,t.meaning,t.use,t.group.title].join(" ").toLowerCase().includes(q)));
  $("#termList").innerHTML=terms.length?terms.map(t=>`<button class="term-button ${activeTerm===t.id?"active":""}" data-library-term="${escapeHTML(t.id)}">${escapeHTML(t.word)}<small>${escapeHTML(t.meaning)}</small></button>`).join(""):'<div class="empty-state">Không tìm thấy dấu hiệu phù hợp.</div>';
  $$("#termList [data-library-term]").forEach(b=>b.onclick=()=>{activeTerm=b.dataset.libraryTerm;renderLibrary();const t=termById(activeTerm);$("#termDetail").innerHTML=libraryDetailHTML(t);});
  if(activeTerm&&termById(activeTerm)&&terms.some(t=>t.id===activeTerm)) $("#termDetail").innerHTML=libraryDetailHTML(termById(activeTerm));
  else if(!terms.length) $("#termDetail").innerHTML='<div class="empty-state"><span>🔎</span><h3>Chưa có kết quả</h3><p>Thử một từ khóa khác nhé.</p></div>';
  else if(!activeTerm||!terms.some(t=>t.id===activeTerm)){activeTerm=terms[0].id;$("#termList [data-library-term]")?.classList.add("active");$("#termDetail").innerHTML=libraryDetailHTML(terms[0]);}
}
function libraryDetailHTML(t){
  return `<span class="detail-tag">${escapeHTML(t.group.title)}</span><h3>${escapeHTML(t.word)}</h3><p><b>${escapeHTML(t.meaning)}</b></p><div class="info-block"><b>Cách dùng</b><p>${escapeHTML(t.use)}</p></div><div class="info-block"><b>Vị trí trong câu</b><p>${escapeHTML(t.position)}</p></div><h4 class="examples-title">VÍ DỤ ANH – VIỆT</h4>${t.examples.map(exampleHTML).join("")}`;
}
function renderPractice(){
  quizList=data.exercises.filter(q=>quizMode==="all"||q.type===quizMode);
  quizIndex=Math.min(quizIndex,Math.max(0,quizList.length-1));score=0;selectedAnswer=null;answered=false;
  $("#practiceCount").textContent=`${quizList.length} câu hỏi`;
  $$(".mode-tab").forEach(b=>b.classList.toggle("active",b.dataset.mode===quizMode));
  renderQuestion();
}
function renderQuestion(){
  const q=quizList[quizIndex],card=$("#quizCard");
  if(!q){card.innerHTML='<div class="empty-state"><span>🎉</span><h3>Chưa có câu hỏi</h3><p>Hãy thêm bài tập trong file JSON.</p></div>';return;}
  const options=q.options||[];
  card.innerHTML=`<div class="quiz-top"><span>CÂU ${quizIndex+1} / ${quizList.length}</span><span>Điểm: ${score}</span></div><div class="progress"><span style="width:${(quizIndex+1)/quizList.length*100}%"></span></div><span class="quiz-type">${({find:"IDENTIFY THE CLUE",fill:"FILL IN THE BLANK",classify:"CLASSIFY THE CLUE"})[q.type]||"PRACTICE"}</span><h3 class="quiz-question">${escapeHTML(q.question)}</h3><p class="quiz-prompt">${escapeHTML(q.prompt||"Chọn đáp án đúng.")}</p><div class="quiz-options">${options.map((o,i)=>`<button class="option-btn ${selectedAnswer===o?"chosen":""}" data-option="${escapeHTML(o)}">${String.fromCharCode(65+i)}. &nbsp;${escapeHTML(o)}</button>`).join("")}</div><div id="feedback"></div><div class="quiz-actions"><button class="soft-btn" id="restartQuiz">↻ Làm lại</button><button class="primary-btn" id="nextQuestion" ${answered?"":"disabled"}>${quizIndex===quizList.length-1?"Xem kết quả":"Câu tiếp theo →"}</button></div>`;
  $$("#quizCard [data-option]").forEach(b=>b.onclick=()=>chooseAnswer(b.dataset.option));
  $("#nextQuestion").onclick=nextQuestion;$("#restartQuiz").onclick=()=>{quizIndex=0;score=0;selectedAnswer=null;answered=false;renderQuestion();};
}
function chooseAnswer(value){
  if(answered)return;selectedAnswer=value;answered=true;const q=quizList[quizIndex],correct=value.toLowerCase()===String(q.answer).toLowerCase();
  if(correct)score++;
  $$("#quizCard [data-option]").forEach(b=>{b.disabled=true;if(b.dataset.option.toLowerCase()===String(q.answer).toLowerCase())b.classList.add("correct");else if(b.dataset.option===value)b.classList.add("wrong");});
  $("#feedback").innerHTML=`<div class="feedback ${correct?"good":"bad"}"><b>${correct?"Chính xác! 🌿":"Chưa chính xác, hãy ghi nhớ nhé."}</b><br>${escapeHTML(q.explanation||"")}</div>`;
  $("#nextQuestion").disabled=false;
  $(".quiz-top span:last-child").textContent=`Điểm: ${score}`;
}
function nextQuestion(){
  if(!answered)return;
  if(quizIndex===quizList.length-1){$("#quizCard").innerHTML=`<div class="empty-state"><span>🌷</span><h3>Hoàn thành lượt luyện tập!</h3><p>Bạn trả lời đúng <b>${score}/${quizList.length}</b> câu.</p><button class="primary-btn" id="againBtn">Luyện tập lại</button></div>`;$("#againBtn").onclick=()=>{quizIndex=0;renderPractice();};return;}
  quizIndex++;selectedAnswer=null;answered=false;renderQuestion();
}
function saveData(newData){
  validateData(newData);data=newData;localStorage.setItem("grammarGardenData",JSON.stringify(data));activeGroup=null;activeTerm=null;quizIndex=0;renderAll();
}
function exportJSON(){
  const blob=new Blob([JSON.stringify(data,null,2)],{type:"application/json"});
  const url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download="present-perfect-data.json";a.click();URL.revokeObjectURL(url);toast("Đã xuất file JSON!");
}
function applyJSON(){
  try{const obj=JSON.parse($("#jsonEditor").value);saveData(obj);$("#jsonStatus").textContent="✓ Dữ liệu hợp lệ và đã được áp dụng.";toast("Cập nhật dữ liệu thành công!");}
  catch(err){$("#jsonStatus").textContent="Lỗi: "+err.message;toast("JSON chưa hợp lệ. Hãy kiểm tra lại.");}
}

document.addEventListener("click",e=>{
  const nav=e.target.closest("[data-view]");if(nav)showView(nav.dataset.view);
  const go=e.target.closest("[data-goto]");if(go)showView(go.dataset.goto);
});
$$(".mode-tab").forEach(b=>b.addEventListener("click",()=>{quizMode=b.dataset.mode;quizIndex=0;renderPractice();}));
$("#searchInput").addEventListener("input",renderLibrary);$("#groupFilter").addEventListener("change",renderLibrary);
$("#shuffleBtn").onclick=()=>{data.exercises.sort(()=>Math.random()-.5);quizIndex=0;renderPractice();toast("Đã trộn thứ tự câu hỏi!");};
$("#exportBtn").onclick=exportJSON;$("#applyJson").onclick=applyJSON;$("#reloadJson").onclick=()=>$("#jsonEditor").value=JSON.stringify(data,null,2);
$("#importFile").addEventListener("change",async e=>{const file=e.target.files[0];if(!file)return;try{const obj=JSON.parse(await file.text());saveData(obj);toast("Đã nhập dữ liệu JSON!");}catch(err){toast("Không thể nhập: "+err.message);}e.target.value="";});
$("#mobileMenu").onclick=()=>$(".sidebar").classList.toggle("open");
init();