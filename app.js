'use strict';
(() => {
  const KEY = 'lola-evening-fitness-v1';
  const PLAN = window.FITNESS_PLAN;
  const EX = window.FITNESS_EXERCISES;
  const planFor = (date, record=records[date]) => (record && record.planVersion!==2 ? window.FITNESS_LEGACY_PLAN : PLAN)[dow(date)];
  const viewExercise = (id) => draft.planVersion===2 ? EX[id] : window.FITNESS_LEGACY_EXERCISES[id];
  const modeExercise = (id,variant='body') => ({...EX[id],...(EX[id].variants?.[variant]||{})});
  const $ = (id) => document.getElementById(id);
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const today = () => new Intl.DateTimeFormat('en-CA', {timeZone:'Asia/Shanghai',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
  const parseDate = (s) => new Date(s + 'T12:00:00');
  const dateKey = (d) => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
  const addDays = (s,n) => {const d=parseDate(s);d.setDate(d.getDate()+n);return dateKey(d);};
  const dow = (s) => parseDate(s).getDay();
  const monday = (s) => addDays(s,-((dow(s)+6)%7));
  const label = (s) => `${parseDate(s).getMonth()+1} 月 ${parseDate(s).getDate()} 日`;
  const weekNames = ['周日','周一','周二','周三','周四','周五','周六'];
  const statusLabels = {planned:'尚未训练',completed:'完成训练',partial:'部分完成',rest:'休息 / 跳过'};
  const feedbackKeys = ['status','effort','stomach','pain','notes','sleep'];
  let records = {}, storageBlocked = false, rawStorage = null, selected = today(), weekStart = monday(selected), draft, dirty=false;
  let saveDelay, toastDelay, sessionRemaining=1800, sessionDeadline=null, restDeadline=null;
  const validDate = s => typeof s==='string' && /^\d{4}-\d{2}-\d{2}$/.test(s) && s>='2000-01-01' && s<='2100-12-31' && !Number.isNaN(parseDate(s).getTime()) && dateKey(parseDate(s))===s;
  const string = (x,max) => typeof x==='string' && x.length<=max;
  const numeric = (x,max) => x===null || (typeof x==='number' && Number.isFinite(x) && x>=0 && x<=max);
  function validateBackup(data) {
    if(!data || data.version!==1 || !data.records || typeof data.records!=='object' || Array.isArray(data.records)) throw Error('备份格式不正确，请选择本网页导出的 JSON 文件。');
    const keys=Object.keys(data.records);
    if(keys.length>15000) throw Error('备份记录数量过多。');
    for(const key of keys) {
      const r=data.records[key];
      if(!validDate(key)||!r||r.date!==key||!Object.hasOwn(statusLabels,r.status)) throw Error('备份中有无效的日期或训练状态。');
      const enums={effort:['','easy','moderate','hard'],stomach:['','fine','full','reflux','nausea'],pain:['','none','soreness','joint','back','other'],sleep:['','usual','better','worse']};
      for(const [k,values] of Object.entries(enums)) if(!values.includes(r[k])) throw Error('备份中的反馈字段无效。');
      if(!string(r.notes,2000)||!numeric(r.sleepMinutes,600)||(r.sleepMinutes!==null&&!Number.isInteger(r.sleepMinutes))||!string(r.updatedAt,40)||Number.isNaN(Date.parse(r.updatedAt))) throw Error('备份中的备注、睡眠时间或保存时间无效。');
      if(!r.exercises || typeof r.exercises!=='object'||Array.isArray(r.exercises)) throw Error('备份中的动作记录无效。');
      if(r.planVersion!==undefined && r.planVersion!==2) throw Error('备份中的计划版本无效。');
      const allowed=(planFor(key,r)?.exercises||[]).map(x=>x[0]);
      for(const [id,v] of Object.entries(r.exercises)) {
        if(!allowed.includes(id)||!v||!Number.isInteger(v.target)||v.target<1||v.target>3||!numeric(v.weight,200)||!string(v.reps,80)||!Array.isArray(v.done)||v.done.length!==v.target||!v.done.every(x=>typeof x==='boolean')) throw Error('备份中的动作组数或重量无效。');
        if(v.variant!==undefined && (id!=='bridge'||!['body','dumbbell'].includes(v.variant)||r.planVersion!==2)) throw Error('备份中的动作版本无效。');
      }
    }
    return data.records;
  }
  try {rawStorage=localStorage.getItem(KEY);if(rawStorage) records=validateBackup(JSON.parse(rawStorage));}
  catch(e){storageBlocked=true;}
  function blank(date) {return {date,planVersion:2,status:PLAN[dow(date)]?'planned':'rest',effort:'',stomach:'',pain:'',notes:'',sleep:'',sleepMinutes:null,exercises:{},updatedAt:new Date().toISOString()};}
  function getExercise(id,target) {
    if(draft.exercises[id])return draft.exercises[id];
    const value={target,weight:['split','calf','abduction','deadbug','birddog','sideplank','bridge'].includes(id)&&draft.planVersion===2?0:null,reps:'',done:Array(target).fill(false),...(id==='bridge'&&draft.planVersion===2?{variant:'body'}:{})};
    if(draft.planVersion===2)draft.exercises[id]=value;
    return value;
  }

  function toast(message) {$('toast').textContent=message;$('toast').hidden=false;clearTimeout(toastDelay);toastDelay=setTimeout(()=>{$('toast').hidden=true;},6000);}
  function gather() {
    if($('exercise-list').querySelector('[aria-invalid="true"]')) throw Error('请先修正无效的哑铃重量，当前记录未保存。');
    for(const k of feedbackKeys) draft[k]=$(k).value;
    const raw=$('sleep-minutes').value;
    const n=raw===''?null:Number(raw);
    if(!numeric(n,600)||(n!==null&&!Number.isInteger(n))) {$('sleep-minutes').setAttribute('aria-invalid','true');throw Error('入睡时间请填写 0–600 的整数分钟。');}
    $('sleep-minutes').removeAttribute('aria-invalid');draft.sleepMinutes=n;
  }
  function persist(manual=false) {
    clearTimeout(saveDelay);
    if(storageBlocked){$('save-state').textContent='本地记录无法读取或存储不可用。请先导出备份，原数据未被覆盖。';if(manual)toast('当前无法保存，请先导出备份。');return false;}
    if(selected>today()){if(manual)toast('未来日期只供查看计划，不能打卡。');return false;}
    if(!dirty&&!manual)return true;
    try {
      gather();draft.updatedAt=new Date().toISOString();
      const next={...records,[selected]:structuredClone(draft)};
      localStorage.setItem(KEY,JSON.stringify({version:1,records:next}));records=next;dirty=false;
      $('save-state').textContent=`已${manual?'保存':'自动保存'} · ${new Date().toLocaleTimeString('zh-CN',{hour:'2-digit',minute:'2-digit',timeZone:'Asia/Shanghai'})}`;
      renderWeek();renderHistory();if(manual)toast('今日记录已保存。');return true;
    } catch(e){$('save-state').textContent=`未保存：${e.message}`;if(manual)toast('没有保存成功，请检查输入或导出备份。');return false;}
  }
  function changed() {dirty=true;$('save-state').textContent='正在保存…';clearTimeout(saveDelay);saveDelay=setTimeout(()=>persist(),450);}
  function changeDate(date) {
    if(!validDate(date)){toast('日期超出范围，请选择 2000–2100 年的有效日期。');$('record-date').value=selected;return;}
    if(dirty&&!persist()){toast('当前更改未保存，请先修正输入。');$('record-date').value=selected;return;}
    selected=date;weekStart=monday(date);sessionDeadline=null;sessionRemaining=1800;restDeadline=null;render();
  }
  function renderWeek() {
    $('week-range').textContent=`${weekStart.slice(0,4)} 年 · ${label(weekStart)} — ${label(addDays(weekStart,6))}`;
    $('week-days').innerHTML=Array.from({length:7},(_,i)=>{
      const date=addDays(weekStart,i), day=dow(date), p=planFor(date),r=records[date];
      return `<button class="day-tab${p?'':' rest-day'}" data-date="${date}" aria-pressed="${selected===date}" aria-label="${esc(date+' '+weekNames[day]+' '+(p?.title||'休息'))}"><span class="day-name">${weekNames[day]}</span><span class="day-title">${p?.title||'休息'}</span><span class="day-date">${date.slice(5).replace('-','.')}</span><span class="day-status">${r?{planned:'未开始',completed:'已完成',partial:'部分',rest:'休息'}[r.status]:date===today()?'今天':'—'}</span></button>`;
    }).join('');
    const scheduled=Array.from({length:4},(_,i)=>records[addDays(weekStart,i)]);
    const complete=scheduled.filter(r=>r?.status==='completed').length,partial=scheduled.filter(r=>r?.status==='partial').length;
    $('week-summary').textContent=`计划 4 天 · 完成 ${complete} 天 · 部分完成 ${partial} 天 · 周五至周日放松`;
  }
  function renderExercises() {
    const list=planFor(selected,draft)?.exercises||[];
    $('exercise-list').innerHTML=list.map(([id,sets,reps,optional],index)=>{
      const r=getExercise(id,sets),ex=draft.planVersion===2?modeExercise(id,r.variant):viewExercise(id);
      const body=draft.planVersion===2 && (['split','calf','abduction','deadbug','birddog','sideplank'].includes(id)||(id==='bridge'&&r.variant!=='dumbbell'));
      const variants=id==='bridge'&&draft.planVersion===2?`<label class="variant-field">练习版本<select data-field="variant" aria-label="臀桥练习版本">${Object.entries(EX.bridge.variants).map(([v,m])=>`<option value="${v}"${r.variant===v?' selected':''}>${m.label}</option>`).join('')}</select></label>`:'';
      return `<article class="exercise" data-exercise="${id}"><div class="exercise-head"><div class="exercise-title"><span class="exercise-index">${String(index+1).padStart(2,'0')}</span><h3>${ex.name}</h3></div><button class="quiet teach-button" data-teach="${id}">学动作 ↗</button></div><p class="exercise-meta">${ex.muscle} · ${reps}${optional?' · 辅助，可省略':''}</p><div class="exercise-fields">${variants}<label>目标组数<select data-field="target" aria-label="${ex.name}目标组数">${[1,2,3].map(n=>`<option value="${n}"${r.target===n?' selected':''}>${n} 组</option>`).join('')}</select></label><label>哑铃重量 / kg<input data-field="weight" ${body?'data-body="true" disabled':''} type="number" min="0" max="200" step="any" inputmode="decimal" value="${r.weight??''}" aria-label="${ex.name}哑铃重量" placeholder="徒手填 0"></label><label>实际次数${id==='sideplank'?' / 秒':''}<input data-field="reps" maxlength="80" value="${esc(r.reps)}" aria-label="${ex.name}实际次数" placeholder="例如 10 / 8"></label><div class="sets-field"><span>完成组数</span>${r.done.map((v,i)=>`<label><input type="checkbox" data-field="done" data-set="${i}"${v?' checked':''} aria-label="${ex.name}第${i+1}组完成">${i+1}</label>`).join('')}</div></div><p class="weight-note">${ex.equipment} · 单侧动作做完两侧算一组</p></article>`;
    }).join('');
    const future=selected>today();$('exercise-list').querySelectorAll('input,select').forEach(e=>e.disabled=future||e.dataset.body==='true');updateProgress();
  }
  function updateProgress() {const list=planFor(selected,draft)?.exercises||[];let done=0,total=0;for(const [id,sets] of list){const r=getExercise(id,sets);total+=r.target;done+=r.done.filter(Boolean).length;}$('exercise-progress').textContent=`已勾选 ${done} / ${total} 组 · 组间休息 60–90 秒`;}
  function renderHistory() {
    const dates=Object.keys(records).sort().reverse();
    if(!dates.length){$('history-list').innerHTML='<div class="empty-state"><h3>第一条记录，等你开始。</h3><p>完成多少就记多少。练完保存，明天回来补记睡眠。</p><button class="quiet" id="start-record">去记录 ↑</button></div>';return;}
    $('history-list').innerHTML=dates.map(date=>{
      const r=records[date];const count=Object.values(r.exercises).reduce((sum,v)=>sum+v.done.filter(Boolean).length,0);
      const sleepText=r.sleep?{usual:'睡眠如常',better:'睡眠更好',worse:'睡眠变差'}[r.sleep]:date<today()&&r.status!=='rest'?'睡眠待补记':'睡眠未填写';
      return `<div class="history-row"><div><strong>${esc(date)} · ${planFor(date,r)?.title||'休息'} · ${statusLabels[r.status]}</strong><p>${count} 组已勾选 · ${sleepText}${r.notes?' · '+esc(r.notes.slice(0,45))+(r.notes.length>45?'…':''):''}</p></div><button class="quiet" data-history="${date}">${!r.sleep&&date<today()&&r.status!=='rest'?'补记 / 编辑':'查看 / 编辑'}</button></div>`;
    }).join('');
  }
  function advice() {
    const messages=[];
    if(['joint','back'].includes($('pain').value))messages.push('关节刺痛或腰痛时停止相关动作，不用疼痛判断训练效果。持续或严重不适请寻求专业评估。');
    if(['full','reflux','nausea'].includes($('stomach').value))messages.push('胃部不舒服时停止负重训练，下次先调整晚饭份量和油腻程度。');
    if($('effort').value==='hard')messages.push('下次先减轻重量或减少组数，保留 3–4 次余力。');
    if($('sleep').value==='worse')messages.push('保持固定时间，先减少训练负荷，观察接下来几晚的睡眠。');
    $('feedback-advice').hidden=!messages.length;$('feedback-advice').textContent=messages.join(' ');
  }
  function render() {
    draft=structuredClone(records[selected]||blank(selected));dirty=false;
    const p=planFor(selected,draft),future=selected>today();$('record-date').value=selected;
    $('selected-label').textContent=`${label(selected)} · ${weekNames[dow(selected)]}${selected===today()?' · 今天':''}${future?' · 计划预览':''}`;
    $('workout-title').textContent=p?`${p.title}训练日`:'休息日';$('workout-description').textContent=p?p.subtitle+(draft.planVersion!==2?' 历史记录：保留原计划、原动作与组数。':''):'周末没有训练任务，不需要补课。';
    $('training-area').hidden=!p;$('rest-message').hidden=!!p;renderWeek();renderExercises();
    for(const k of feedbackKeys)$(k).value=draft[k];$('sleep-minutes').value=draft.sleepMinutes??'';
    $('feedback-form').querySelectorAll('input,select,textarea,button').forEach(e=>e.disabled=future);
    for(const id of ['sleep','sleep-minutes']){$(id).disabled=selected>=today();$(id).title=selected>=today()?'第二天再补记这一晚的睡眠':'';}
    $('session-button').disabled=future;$('save-state').textContent=storageBlocked?'本地记录无法读取或存储不可用。请先导出备份，原数据未被覆盖。':future?'未来日期仅用于查看计划。':records[selected]?'已载入记录；修改后自动保存。':'记录只保存在当前浏览器。';
    advice();renderHistory();updateTimers();
  }
  function svgPose(p,caption) {
    const poly=points=>`<polyline points="${points.map(v=>v.join(',')).join(' ')}"/>`;
    return `<svg viewBox="0 0 240 160" role="img" aria-label="${esc(caption)}"><path d="M16 150H224" stroke="currentColor" stroke-width="1" opacity=".35" fill="none"/><g stroke="currentColor" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" fill="none"><circle cx="${p.head[0]}" cy="${p.head[1]}" r="10"/>${poly(p.spine)}${p.arms.map(poly).join('')}${p.legs.map(poly).join('')}</g>${(p.weights||[]).map(([x,y])=>`<g stroke="currentColor" stroke-width="3"><path d="M${x-10} ${y}h20"/><path d="M${x-10} ${y-5}v10M${x+10} ${y-5}v10"/></g>`).join('')}</svg>`;
  }
  function teach(id,previewVariant) {
    if(!EX[id])return;
    const r=draft.exercises[id],variant=previewVariant||r?.variant||'body',ex=modeExercise(id,variant);
    const media=ex.media,video=media.endsWith('.mp4');
    const variants=ex.variants?`<label>查看版本<select id="teaching-variant" data-id="${id}">${Object.entries(ex.variants).map(([key,v])=>`<option value="${key}"${key===variant?' selected':''}>${v.label}</option>`).join('')}</select></label><p>这里切换只用于学习；实际练习版本请在训练卡中选择。</p>`:'';
    const original=window.FITNESS_LIBRARY?.[ex.source];
    $('teaching-content').innerHTML=`<h2 id="teaching-title">${esc(ex.label||ex.name)}</h2><p class="teach-muscle">${esc(ex.muscle)} · ${esc(ex.equipment)}</p>${draft.planVersion!==2?'<p class="variant-note">这是新版教学。历史打卡保留原动作和组数；划船、死虫式与新版有所不同，不能把旧记录当作已完成新版。</p>':''}${variants}<div class="teach-block source-block"><h3>示范版本说明 · 本仓库不含媒体</h3><p>${esc(ex.match)}</p><p class="variant-note">仓库版本不包含第三方动画或视频。完整动态示范保留在本地完整版本；本页提供对应版本的说明和出处，不从网络自动读取媒体。</p><p>示范来源：${esc(ex.credit)}</p><p id="media-error" role="status" hidden></p></div><div class="teach-block"><h3>器材、摆位与安全结束</h3><p>${esc(ex.load)}</p></div><div class="teach-block"><h3>一步一步做</h3><ol>${ex.steps.map(x=>`<li>${esc(x)}</li>`).join('')}</ol><p>用力时呼气、回落时吸气；支撑动作正常持续呼吸，不憋气。</p></div><div class="teach-block"><h3>常见错误</h3><ul>${ex.mistakes.map(x=>`<li>${esc(x)}</li>`).join('')}</ul><p>${esc(ex.feel)}</p><p>降低难度：${esc(ex.easier)}</p></div><div class="teach-block"><h3>说明由谁整理？怎样核对？</h3><p>本页步骤、常见错误与器材提醒由助手依据下列资料改写整理，不是原库逐字引用，也未经专业人士逐条审核。核对日期：2026-10-14。来源资料与文字可用于学习，不能评估你本人的姿势。</p><ul>${ex.sources.map(([name,url])=>`<li><a href="${esc(url)}" target="_blank" rel="noopener noreferrer">${esc(name)}</a></li>`).join('')}</ul>${original&&!['row','shoulder','abduction','deadbug'].includes(id)?`<details><summary>原库中文原文（与整理说明区分）</summary><ol>${(original.instruction_steps?.zh||[]).map(x=>`<li>${esc(x)}</li>`).join('')}</ol></details>`:''}<p>本仓库不含第三方媒体；来源标注不代表取得公开再分发权。</p></div>`;
    $('teaching-content').querySelector('video,img')?.addEventListener('error',()=>{$('media-error').hidden=false;$('media-error').textContent='本地示范加载失败，请保留 assets 文件夹。';});
    if(!$('teaching-dialog').open)$('teaching-dialog').showModal();$('teaching-dialog').scrollTop=0;
  }
  $('teaching-content').addEventListener('change',e=>{if(e.target.id==='teaching-variant')teach(e.target.dataset.id,e.target.value);});
  $('teaching-content').addEventListener('click',e=>{
    const button=e.target.closest('#media-toggle');if(!button)return;
    const playing=button.getAttribute('aria-pressed')==='true';
    $('library-image').src=playing?button.dataset.image:button.dataset.gif;
    button.setAttribute('aria-pressed',String(!playing));button.textContent=playing?button.dataset.startLabel:'停止动画';
  });
  $('teaching-dialog').addEventListener('close',()=>{$('teaching-content').querySelector('video')?.pause();const b=$('media-toggle');if(b&&$('library-image'))$('library-image').src=b.dataset.image;});
  function updateTimers() {
    if(sessionDeadline!==null){sessionRemaining=Math.max(0,Math.ceil((sessionDeadline-Date.now())/1000));if(!sessionRemaining){sessionDeadline=null;toast('30 分钟到了，结束训练并放松。记录需你自己保存。');}}
    $('session-time').textContent=`${String(Math.floor(sessionRemaining/60)).padStart(2,'0')}:${String(sessionRemaining%60).padStart(2,'0')}`;
    $('session-button').textContent=sessionDeadline?'暂停':sessionRemaining===1800?'开始计时':sessionRemaining===0?'重新计时':'继续计时';
    if(sessionDeadline){const elapsed=1800-sessionRemaining;$('session-caption').textContent=elapsed<300?'热身阶段 · 缓慢活动关节':elapsed<1620?'正式训练 · 不赶进度，组间休息':'放松阶段 · 恢复呼吸，准备收工';}else $('session-caption').textContent=sessionRemaining===1800?'5 分钟热身 · 22 分钟训练 · 3 分钟放松':sessionRemaining===0?'训练结束 · 计时不会自动打卡':'计时已暂停';
    if(restDeadline!==null){const n=Math.max(0,Math.ceil((restDeadline-Date.now())/1000));$('rest-countdown').textContent=`${n} 秒`;if(!n){restDeadline=null;toast('休息时间到了，感觉准备好再开始下一组。');}}
    else $('rest-countdown').textContent='—';$('stop-rest').disabled=restDeadline===null;
  }
  $('week-days').addEventListener('click',e=>{const b=e.target.closest('[data-date]');if(b)changeDate(b.dataset.date);});
  $('previous-week').onclick=()=>changeDate(addDays(selected,-7));$('next-week').onclick=()=>changeDate(addDays(selected,7));$('today-button').onclick=()=>changeDate(today());
  $('record-date').onchange=e=>changeDate(e.target.value);
  $('exercise-list').addEventListener('click',e=>{const b=e.target.closest('[data-teach]');if(b)teach(b.dataset.teach);});
  $('exercise-list').addEventListener('input',e=>{
    const field=e.target.dataset.field,box=e.target.closest('[data-exercise]');if(!field||!box)return;
    const id=box.dataset.exercise;const target=planFor(selected,draft).exercises.find(x=>x[0]===id)[1];
    const r=draft.exercises[id] ||= getExercise(id,target);
    if(field==='weight'){
      const n=e.target.value===''?null:Number(e.target.value);if(!numeric(n,200)){e.target.setAttribute('aria-invalid','true');$('save-state').textContent='重量需填写 0–200 kg，当前输入未保存。';return;}e.target.removeAttribute('aria-invalid');r.weight=n;
    }else if(field==='reps')r.reps=e.target.value;
    else if(field==='done')r.done[Number(e.target.dataset.set)]=e.target.checked;
    else if(field==='variant'){if(r.done.some(Boolean)||r.reps||r.weight>0){e.target.value=r.variant;toast('本动作已有记录，不能直接切换版本。可在教学里查看另一版；更正实际记录时先取消勾选并清空次数、重量。');return;}r.variant=e.target.value;r.weight=0;renderExercises();}
    else if(field==='target'){const target=Number(e.target.value);if(target<r.target&&r.done.slice(target).some(Boolean)){e.target.value=String(r.target);toast('已有完成勾选，请先取消多出的组，再减少目标。');return;}r.done=Array.from({length:target},(_,i)=>r.done[i]||false);r.target=target;renderExercises();}
    updateProgress();changed();
  });
  $('feedback-form').addEventListener('input',()=>{advice();changed();});
  $('feedback-form').addEventListener('submit',e=>{e.preventDefault();persist(true);});
  $('session-button').onclick=()=>{if(sessionDeadline){sessionRemaining=Math.max(0,Math.ceil((sessionDeadline-Date.now())/1000));sessionDeadline=null;}else{if(sessionRemaining===0)sessionRemaining=1800;sessionDeadline=Date.now()+sessionRemaining*1000;}updateTimers();};
  document.querySelectorAll('[data-rest]').forEach(b=>b.onclick=()=>{restDeadline=Date.now()+Number(b.dataset.rest)*1000;updateTimers();});
  $('stop-rest').onclick=()=>{restDeadline=null;updateTimers();};setInterval(updateTimers,1000);
  $('history-list').onclick=e=>{const b=e.target.closest('[data-history]');if(b){changeDate(b.dataset.history);$('feedback-title').scrollIntoView({behavior:'smooth',block:'start'});}if(e.target.closest('#start-record'))$('workout').scrollIntoView({behavior:'smooth'});};
  $('guide-button').onclick=()=>$('guide-dialog').showModal();$('close-guide').onclick=()=>$('guide-dialog').close();$('close-teaching').onclick=()=>$('teaching-dialog').close();
  for(const id of ['guide-dialog','teaching-dialog'])$(id).addEventListener('click',e=>{const rect=$(id).getBoundingClientRect();if(e.target===$(id)&&(e.clientX<rect.left||e.clientX>rect.right||e.clientY<rect.top||e.clientY>rect.bottom))$(id).close();});
  function download(text,name) {const url=URL.createObjectURL(new Blob([text],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
  $('export-button').onclick=()=>{
    if(dirty&&!persist())toast('部分输入未保存；正在导出最后保存的记录。');
    if(storageBlocked&&rawStorage!==null){download(rawStorage,`fitness-original-${today()}.json`);toast('已导出原始数据，请保留此文件。');return;}
    download(JSON.stringify({version:1,exportedAt:new Date().toISOString(),records},null,2),`fitness-backup-${today()}.json`);toast('备份已导出，请保存在容易找到的位置。');
  };
  $('import-button').onclick=()=>{if(storageBlocked){toast('当前存储不可用或原数据损坏，请先导出原始数据。');return;}if(dirty&&!persist()){toast('请先修正当前输入再导入。');return;}$('import-file').click();};
  $('import-file').onchange=async e=>{
    const file=e.target.files[0];if(!file)return;$('import-button').disabled=true;$('import-button').textContent='校验中…';
    try {
      if(file.size>5*1024*1024)throw Error('备份超过 5 MB，请选择本网页导出的记录文件。');
      const imported=validateBackup(JSON.parse(await file.text()));const next={...records};let added=0,skipped=0;
      for(const [date,r] of Object.entries(imported)){if(Object.hasOwn(next,date)){skipped++;continue;}next[date]=r;added++;}
      localStorage.setItem(KEY,JSON.stringify({version:1,records:next}));records=next;render();toast(`导入 ${added} 个日期；保留 ${skipped} 个已有同日记录，未覆盖。`);
    }catch(err){toast(`导入失败：${err instanceof SyntaxError?'文件不是有效 JSON。':err.message} 原有记录未改变。`);}
    finally{e.target.value='';$('import-button').disabled=false;$('import-button').textContent='导入备份 ↑';}
  };
  window.addEventListener('beforeunload',()=>{if(dirty)persist();});
  window.addEventListener('storage',e=>{if(e.key===KEY){toast('另一个页面修改了记录。请导出当前备份后刷新，避免覆盖。');storageBlocked=true;$('save-state').textContent='检测到另一页面更新记录，当前页面暂停保存；请备份后刷新。';}});
  render();
})();
