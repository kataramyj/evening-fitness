'use strict';
(function () {
  // Session-only TV controller: intentionally never reads or writes training storage.
  var PLAN=window.FITNESS_PLAN, EX=window.FITNESS_COACHING;
  var $=function(id){return document.getElementById(id);};
  var escapeHTML=function(value){return String(value==null?'':value).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});};
  var state={day:1,index:0,screen:'home',variants:{bridge:'dumbbell'},done:{},remaining:1800,deadline:null,restDeadline:null,restOpen:false,follow:null,routine:null};
  var noticeTimeout,mediaToken=0,returnFocus='tv-rest';
  var names=['周日','周一','周二','周三','周四','周五','周六'];
  function focus(id){var el=$(id);if(el&&!el.disabled&&!el.hidden){try{el.focus({preventScroll:true});}catch(e){el.focus();}}}
  function notice(text){$('tv-notice').textContent=text;$('tv-notice').hidden=false;clearTimeout(noticeTimeout);noticeTimeout=setTimeout(function(){$('tv-notice').hidden=true;},6500);}
  function current(){return PLAN[state.day].exercises[state.index];}
  function key(){return state.day+':'+current()[0]+':'+(current()[0]==='bridge'?'dumbbell':'body');}
  function exercise(){var id=current()[0],base=EX[id],variant=id==='bridge'?'dumbbell':'body';return Object.assign({},base,base.variants&&base.variants[variant]||{});}
  function completed(){return state.done[key()]||0;}
  function format(n){n=Math.max(0,n);return String(Math.floor(n/60)).padStart(2,'0')+':'+String(n%60).padStart(2,'0');}
  function tvCopy(text){return String(text||'').replace(/记录每只重量/g,'两手使用同样的重量').replace(/记录单只重量/g,'使用一只哑铃').replace(/重量填 0/g,'不用哑铃').replace(/不能按原重量记录/g,'与负重版的训练负荷不同').replace(/不把简化练习记作完整次数/g,'简化练习无需追求完整次数');}
  function renderGuide(ex){
    $('tv-steps').innerHTML=ex.steps.map(function(step){return '<li>'+escapeHTML(step)+'</li>';}).join('');
    $('tv-equipment').textContent='器材：'+ex.equipment.replace(/；记录.*$/,'');
    $('tv-load').textContent=tvCopy(ex.load);
    $('tv-mistakes').textContent='注意：'+ex.mistakes.join('；');
    $('tv-guide').scrollTop=0;
  }
  function updateProgress(){
    var ex=exercise(),item=current(),id=item[0],dose=id==='sideplank'?'每侧 15 秒':/^(split|abduction|deadbug|birddog)$/.test(id)?'每侧 15 次':'15 次';
    $('tv-dose').textContent=dose+' × '+item[1]+' 组 · '+ex.equipment.replace(/；记录.*$/,'')+' · 跟练进度 '+completed()+'/'+item[1]+' 组';
    $('tv-complete').disabled=completed()>=item[1];$('tv-complete').textContent=completed()>=item[1]?'本动作已做完':'本组完成';
  }
  function status(text,error){$('tv-media-status').textContent=text;$('tv-media-status').setAttribute('data-error',error?'true':'false');}
  function pauseMedia(){
    var v=$('tv-video'),image=$('tv-image');if(v)v.pause();
    if(image&&image.dataset.poster)image.src=image.dataset.poster;
  }
  function failed(token){
    if(token!==mediaToken)return;
    status('示范无法加载或格式不支持；仍可按右侧文字步骤练习。',true);
    var media=$('tv-media').querySelector('video,img');if(media)media.hidden=true;
  }
  function resumeMedia(){
    var video=$('tv-video'),image=$('tv-image'),token=mediaToken;
    if(video){
      try{var pending=video.play();if(pending&&pending.catch)pending.catch(function(){if(token!==mediaToken)return;video.controls=true;status('浏览器未允许自动播放，可尝试视频自带的播放控制；文字步骤仍可使用。',true);});}
      catch(e){video.controls=true;status('浏览器未允许自动播放；文字步骤仍可使用。',true);}
    }else if(image&&image.dataset.gif&&image.src!==new URL(image.dataset.gif,document.baseURI).href)image.src=image.dataset.gif;
  }
  function loadMedia(){
    pauseMedia();var token=++mediaToken,ex=exercise(),src=ex.media;
    $('tv-media').innerHTML='';
    $('tv-media-credit').textContent=ex.credit;$('tv-media-quality').textContent=/\.svg$/.test(src)?'原创静态示意；以文字步骤为准':src.indexOf('assets/videos/')===0||src.indexOf('bent-over-row.gif')>=0?'原库小尺寸动画，放大后较模糊':'';
    status('');
    var media;
    if(/\.mp4$/.test(src)){
      media=document.createElement('video');media.id='tv-video';media.muted=true;media.loop=true;media.preload='auto';media.setAttribute('playsinline','');media.setAttribute('muted','');media.setAttribute('aria-label',ex.name+'动态示范');media.src=src;
      media.addEventListener('playing',function(){if(token===mediaToken){media.controls=false;status('');}});
    }else{
      media=document.createElement('img');media.id='tv-image';media.alt=ex.name+'本地动态示范';media.dataset.poster=/\.svg$/.test(src)?src:src.replace('.gif','-poster.jpg');media.dataset.gif=src;media.src=src;
      if(src.indexOf('assets/videos/')===0||src.indexOf('bent-over-row.gif')>=0)media.className='tv-low-resolution';
    }
    media.addEventListener('error',function(){failed(token);});$('tv-media').appendChild(media);if(media.tagName==='VIDEO'&&!$('tv-lesson').classList.contains('tv-routine-open'))resumeMedia();
  }
  function renderLesson(){
    var item=current(),ex=exercise(),list=PLAN[state.day].exercises;
    $('tv-position').textContent=names[state.day]+' · '+PLAN[state.day].title+' · 动作 '+(state.index+1)+' / '+list.length;
    $('tv-action-name').textContent=ex.label||ex.name;updateProgress();
    $('tv-previous').disabled=state.index===0;$('tv-next').disabled=state.index===list.length-1;
    
    renderGuide(ex);loadMedia();if($('tv-lesson').classList.contains('tv-routine-open'))pauseMedia();renderFollow();updateTimers();
  }
  function renderRoutine(type){
    state.routine=type;var r=window.TV_ROUTINES,items=type==='warmup'?r.days[state.day].warmup:r.days[state.day].cooldown.concat(r.commonCooldown);
    $('tv-routine-content').innerHTML=items.map(function(item){
      var media=item[3]&&window.TV_ROUTINE_MEDIA[item[3]],visual='';
      if(media){var src=escapeHTML(media.src),label=escapeHTML(item[0]);visual=/\.mp4$/.test(media.src)?'<video class="tv-routine-media" src="'+src+'" aria-label="'+label+'示范" autoplay muted loop playsinline controls preload="metadata"></video>':'<img class="tv-routine-media" src="'+src+'" alt="'+label+'动作示范" loading="eager">';}
      else visual='<div class="tv-breath-guide" aria-hidden="true"><span>吸气 · 呼气</span></div>';
      return '<article class="tv-routine-card">'+visual+'<strong>'+escapeHTML(item[0])+'</strong><p>'+escapeHTML(item[1])+'</p><span>'+escapeHTML(item[2])+'</span>'+(media?'<small>'+escapeHTML(media.credit)+'</small>':'')+'</article>';
    }).join('');
    $('tv-routine-content').querySelectorAll('img,video').forEach(function(media){media.addEventListener('error',function(){var note=document.createElement('p');note.className='tv-routine-error';note.textContent='示范未能加载，请按文字步骤进行。';media.replaceWith(note);});});
    $('tv-routine-content').hidden=false;$('tv-lesson').classList.add('tv-routine-open');pauseMedia();$('tv-warmup').setAttribute('aria-pressed',type==='warmup'?'true':'false');$('tv-cooldown').setAttribute('aria-pressed',type==='cooldown'?'true':'false');
  }
  function followTarget(){var id=current()[0];return id==='sideplank'?1:/^(deadbug|birddog)$/.test(id)?30:15;}
  function followSides(){return /^(split|abduction|sideplank)$/.test(current()[0])?2:1;}
  function followSeconds(){return current()[0]==='sideplank'?15:5;}
  function followCount(rep){return /^(deadbug|birddog)$/.test(current()[0])?Math.floor(rep/2)+1:rep+1;}
  function followStage(mode,seconds){var f=state.follow;f.mode=mode;f.duration=seconds*1000;f.left=f.duration;f.deadline=Date.now()+f.duration;renderFollow();}
  function estimatedSeconds(day){
    var items=PLAN[day].exercises,work=0,rest=(items.length-1)*50,switches=0;
    items.forEach(function(item){var id=item[0],sets=item[1],sides=/^(split|abduction|sideplank)$/.test(id)?2:1,reps=/^(deadbug|birddog)$/.test(id)?30:15;
      work+=sets*(id==='sideplank'?15*sides:reps*5*sides);rest+=(sets-1)*30;if(sides===2)switches+=sets*5;
    });
    return 300+work+rest+switches+180;
  }
  function renderFollow(){
    var f=state.follow,orb=$('tv-follow-orb');
    if(!f){orb.hidden=true;$('tv-follow-toggle').textContent='开始自动跟练';$('tv-follow-skip').hidden=true;return;}
    var left=Math.max(0,f.paused?f.left:f.deadline-Date.now()),n=Math.ceil(left/1000);
    var alternating=/^(deadbug|birddog)$/.test(current()[0]);
    var phase=f.paused?'暂停':f.mode==='prepare'?'换边':f.mode==='rest'?'休息':alternating?(f.rep%2?'右侧':'左侧'):f.side===2?'右侧':followSides()===2?'左侧':'动作';
    var count=f.mode==='work'?(current()[0]==='sideplank'?n:followCount(f.rep)):n;
    var progress=f.mode==='work'?(current()[0]==='sideplank'?'秒 · 第 '+(completed()+1)+' 组':'/ 15'):f.mode==='rest'?'秒后继续':'秒后换边';
    orb.hidden=false;orb.dataset.mode=f.mode;orb.dataset.paused=f.paused?'true':'false';
    orb.style.setProperty('--ring-angle',Math.round(360*left/f.duration)+'deg');
    $('tv-follow-phase').textContent=phase;$('tv-follow-count').textContent=String(count);$('tv-follow-progress').textContent=progress;
    orb.setAttribute('aria-label',phase+'，'+(f.mode==='work'&&current()[0]!=='sideplank'?'第 '+count+' 次，当前动作剩余 '+n+' 秒': '剩余 '+n+' 秒')+'，'+progress);
    $('tv-follow-toggle').textContent=f.paused?'继续跟练':'暂停跟练';$('tv-follow-skip').hidden=false;$('tv-follow-skip').textContent=f.mode==='rest'?'结束休息':f.mode==='prepare'?'开始另一侧':'跳过这一次';
  }
  function stopFollow(){state.follow=null;renderFollow();}
  function pauseFollow(){var f=state.follow;if(f&&!f.paused){f.left=Math.max(0,f.deadline-Date.now());f.paused=true;renderFollow();}}
  function toggleFollow(){
    var f=state.follow;if(f){if(f.paused){f.deadline=Date.now()+f.left;f.paused=false;}else pauseFollow();renderFollow();return;}
    if(completed()>=current()[1]){notice('这个动作的组数已完成，请选择下一动作。');return;}
    state.follow={mode:'work',rep:0,side:1,paused:false};$('tv-routine-content').hidden=true;$('tv-lesson').classList.remove('tv-routine-open');resumeMedia();
    followStage('work',followSeconds());
  }
  function finishFollowSet(){
    var f=state.follow;state.done[key()]=Math.min(current()[1],completed()+1);updateProgress();
    var lastSet=completed()>=current()[1],lastAction=state.index>=PLAN[state.day].exercises.length-1;
    if(lastSet&&lastAction){stopFollow();pauseSession();renderRoutine('cooldown');notice('正式训练结束，请按今日放松卡慢慢收尾。');return;}
    followStage('rest',lastSet?50:30);
  }
  function nextFollowStage(){
    var f=state.follow;if(!f)return;
    if(f.mode==='prepare'){followStage('work',followSeconds());return;}
    if(f.mode==='rest'){
      if(completed()>=current()[1]){state.index++;renderLesson();}
      f.rep=0;f.side=1;followStage('work',followSeconds());return;
    }
    f.rep++;
    if(f.rep>=followTarget()){
      if(f.side<followSides()){f.side++;f.rep=0;followStage('prepare',5);return;}
      else{finishFollowSet();return;}
    }else{followStage('work',followSeconds());return;}
  }
  function skipFollow(){nextFollowStage();}
  function tickFollow(){var f=state.follow;if(!f||f.paused)return;if(Date.now()>=f.deadline)nextFollowStage();else renderFollow();}
  function selectDay(day){
    stopFollow();pauseMedia();if(state.day!==day){state.index=0;state.remaining=1800;}state.day=day;state.screen='lesson';state.deadline=null;state.restDeadline=null;
    $('tv-home').hidden=true;$('tv-lesson').hidden=false;$('tv-home-button').hidden=false;$('tv-brand').hidden=true;$('tv-header-lesson').hidden=false;document.querySelector('.tv-header').classList.add('tv-header-lesson-open');
    renderRoutine('warmup');renderLesson();focus('tv-warmup');
  }
  function home(){
    stopFollow();pauseMedia();pauseSession();closeRest();state.screen='home';$('tv-lesson').hidden=true;$('tv-home').hidden=false;$('tv-home-button').hidden=true;$('tv-brand').hidden=false;$('tv-header-lesson').hidden=true;document.querySelector('.tv-header').classList.remove('tv-header-lesson-open');
    $('tv-notice').hidden=true;focus('tv-day-'+state.day);
  }
  function changeAction(step){
    var next=state.index+step;if(next<0||next>=PLAN[state.day].exercises.length)return;
    stopFollow();pauseMedia();state.index=next;renderLesson();
    // Keep navigation focus unless the endpoint disabled the button just used.
    var active=document.activeElement;if(!active||active.disabled||!active.getClientRects().length)focus('tv-follow-toggle');
  }
  function pauseSession(){if(state.deadline!==null){state.remaining=Math.max(0,Math.ceil((state.deadline-Date.now())/1000));state.deadline=null;updateTimers();}}
  function toggleSession(){
    if(state.deadline!==null){pauseSession();return;}
    if(state.remaining<=0)state.remaining=1800;
    state.deadline=Date.now()+state.remaining*1000;updateTimers();
  }
  function openRest(seconds,from){
    pauseMedia();returnFocus=from||'tv-rest';state.restOpen=true;state.restDeadline=Date.now()+seconds*1000;
    $('tv-rest-panel').hidden=false;$('tv-rest-undo').hidden=from!=='tv-complete';$('tv-main').setAttribute('aria-hidden','true');$('tv-rest-note').textContent='秒 · 感觉准备好再开始下一组';$('tv-rest-continue').textContent='结束休息';
    // Contain keyboard and pointer focus even on WebViews without inert support.
    document.querySelectorAll('.tv-header button,#tv-main button,#tv-guide').forEach(function(el){el.dataset.previousTab=String(el.tabIndex);el.tabIndex=-1;});
    updateTimers();focus('tv-rest-continue');
  }
  function closeRest(){
    if(!state.restOpen)return;state.restOpen=false;state.restDeadline=null;$('tv-rest-panel').hidden=true;$('tv-main').removeAttribute('aria-hidden');
    document.querySelectorAll('[data-previous-tab]').forEach(function(el){el.tabIndex=Number(el.dataset.previousTab);delete el.dataset.previousTab;});
    var target=$(returnFocus);if(target&&!target.disabled)focus(returnFocus);else focus('tv-next');
    if(!document.activeElement||document.activeElement.disabled||!document.activeElement.getClientRects().length)focus('tv-follow-toggle');
    if(state.screen==='lesson'&&!$('tv-lesson').classList.contains('tv-routine-open'))resumeMedia();
  }
  function updateTimers(){
    if(state.deadline!==null){state.remaining=Math.max(0,Math.ceil((state.deadline-Date.now())/1000));if(state.remaining===0){state.deadline=null;if(state.follow)notice('已到 30 分钟；按自己的状态完成当前动作或结束训练。');else{pauseMedia();renderRoutine('cooldown');notice('30 分钟到了，请轻柔放松。');}}}
    $('tv-session-time').textContent=format(state.remaining);
    var elapsed=1800-state.remaining,stage=elapsed<300?'热身阶段 · 缓慢活动':elapsed<1620?'正式训练 · 不赶进度':'放松阶段 · 恢复呼吸';
    $('tv-session-stage').textContent=state.remaining===0?'训练结束 · 准备收工':state.follow?'正式训练 · 跟练中':state.deadline!==null?stage:state.remaining===1800?'5 分钟热身起步':'已暂停 · '+stage;
    $('tv-session').textContent=state.deadline!==null?'暂停总计时':state.remaining===1800?'开始 30 分钟':state.remaining===0?'重新计时':'继续总计时';
    if(state.restOpen&&state.restDeadline!==null){var n=Math.max(0,Math.ceil((state.restDeadline-Date.now())/1000));$('tv-rest-time').textContent=String(n);if(n===0){state.restDeadline=null;$('tv-rest-note').textContent='休息时间到了，准备好后再继续';$('tv-rest-continue').textContent='准备好了';}}
  }
  function buttons(){var scope=state.restOpen?$('tv-rest-panel'):document;return Array.prototype.filter.call(scope.querySelectorAll('button,a[href],[tabindex="0"]'),function(el){return !el.disabled&&el.tabIndex>=0&&el.getClientRects().length>0;});}
  function move(direction){
    var all=buttons(),active=document.activeElement;if(all.indexOf(active)<0){if(all[0])all[0].focus();return;}
    var rect=active.getBoundingClientRect(),cx=rect.left+rect.width/2,cy=rect.top+rect.height/2,best=null,bestScore=Infinity;
    all.forEach(function(el){
      if(el===active)return;var r=el.getBoundingClientRect(),dx=r.left+r.width/2-cx,dy=r.top+r.height/2-cy;
      var forward=direction==='ArrowRight'?dx:direction==='ArrowLeft'?-dx:direction==='ArrowDown'?dy:-dy;
      if(forward<=8)return;var perpendicular=direction==='ArrowRight'||direction==='ArrowLeft'?Math.abs(dy):Math.abs(dx);
      // Strong alignment preference makes rows and columns predictable on a remote.
      var score=forward+perpendicular*3+perpendicular*perpendicular/Math.max(forward,1);
      if(score<bestScore){bestScore=score;best=el;}
    });
    if(best){best.focus();try{best.scrollIntoView({block:'nearest',inline:'nearest',behavior:'auto'});}catch(e){best.scrollIntoView(false);}}
  }
  document.addEventListener('keydown',function(event){
    var key=event.key,code=event.keyCode;
    var arrow=key&&key.indexOf('Arrow')===0?key:({19:'ArrowUp',20:'ArrowDown',21:'ArrowLeft',22:'ArrowRight',37:'ArrowLeft',38:'ArrowUp',39:'ArrowRight',40:'ArrowDown'})[code];
    if(arrow){event.preventDefault();move(arrow);return;}
    if(key==='Enter'||key===' '||key==='Select'||key==='Accept'||code===23||code===13||code===32){
      event.preventDefault();if(event.repeat)return;var active=document.activeElement,all=buttons();if(all.indexOf(active)>=0)active.click();else if(all[0])all[0].focus();return;
    }
    if(key==='Escape'||key==='Backspace'||key==='BrowserBack'||key==='GoBack'||code===4||code===461){
      if(state.restOpen){event.preventDefault();closeRest();}else if(state.screen==='lesson'){event.preventDefault();home();}return;
    }
    if(key==='Tab'&&state.restOpen){var list=buttons(),i=list.indexOf(document.activeElement);event.preventDefault();if(list.length)list[(i+(event.shiftKey?-1:1)+list.length)%list.length].focus();}
  });
  $('tv-guide').addEventListener('keydown',function(event){
    if(event.key!=='ArrowDown'&&event.key!=='ArrowUp')return;
    var down=event.key==='ArrowDown',canScroll=down?this.scrollTop+this.clientHeight<this.scrollHeight-2:this.scrollTop>2;
    if(canScroll){event.preventDefault();event.stopPropagation();this.scrollTop+=down?120:-120;}
  });
  document.addEventListener('visibilitychange',function(){if(document.hidden){pauseMedia();pauseSession();pauseFollow();}else if(state.screen==='lesson'&&!state.restOpen&&!$('tv-lesson').classList.contains('tv-routine-open'))resumeMedia();});
  window.addEventListener('pagehide',function(){pauseMedia();pauseSession();pauseFollow();});
  $('tv-home-button').onclick=home;$('tv-previous').onclick=function(){changeAction(-1);};$('tv-next').onclick=function(){changeAction(1);};
  $('tv-warmup').onclick=function(){if(state.routine==='warmup'&&!$('tv-routine-content').hidden){$('tv-routine-content').hidden=true;$('tv-lesson').classList.remove('tv-routine-open');resumeMedia();}else renderRoutine('warmup');};$('tv-cooldown').onclick=function(){if(state.routine==='cooldown'&&!$('tv-routine-content').hidden){$('tv-routine-content').hidden=true;$('tv-lesson').classList.remove('tv-routine-open');resumeMedia();}else renderRoutine('cooldown');};$('tv-follow-toggle').onclick=toggleFollow;$('tv-follow-skip').onclick=skipFollow;
  $('tv-complete').onclick=function(){stopFollow();var target=current()[1];if(completed()>=target)return;state.done[key()]=completed()+1;updateProgress();var lastSet=completed()>=target,lastAction=state.index===PLAN[state.day].exercises.length-1;if(lastSet&&lastAction){pauseSession();renderRoutine('cooldown');notice('正式训练结束，请按今日放松卡慢慢收尾。');}else openRest(lastSet?50:30,'tv-complete');};
  $('tv-rest').onclick=function(){pauseFollow();openRest(30,'tv-rest');};$('tv-rest-continue').onclick=closeRest;$('tv-rest-90').onclick=function(){state.restDeadline=Date.now()+90000;$('tv-rest-note').textContent='秒 · 感觉准备好再开始下一组';$('tv-rest-continue').textContent='结束休息';updateTimers();};$('tv-session').onclick=toggleSession;
  $('tv-rest-undo').onclick=function(){state.done[key()]=Math.max(0,completed()-1);updateProgress();closeRest();focus('tv-complete');};
  if(!PLAN||!EX||!window.TV_ROUTINES){$('tv-home-title').textContent='训练资料没有加载成功';$('tv-today').textContent='请保留 plan.js、coaching.js 与 assets 文件夹，并用浏览器重新打开 tv.html。';return;}
  var date=new Date(),weekday;
  try{var parts=new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Shanghai',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(date),values={};parts.forEach(function(p){values[p.type]=p.value;});weekday=new Date(values.year+'-'+values.month+'-'+values.day+'T12:00:00').getDay();}catch(e){weekday=date.getDay();}
  state.day=weekday>=1&&weekday<=4?weekday:1;
  $('tv-today').textContent=weekday>=1&&weekday<=4?'今天'+names[weekday]+' · '+PLAN[weekday].title:'今天休息 · 也可以提前看动作';
  $('tv-days').innerHTML=[1,2,3,4].map(function(day){var p=PLAN[day],sets=p.exercises.reduce(function(sum,e){return sum+e[1];},0);return '<button class="tv-day" id="tv-day-'+day+'" data-day="'+day+'" aria-current="'+(day===weekday?'true':'false')+'"><span>'+names[day]+'</span><strong class="tv-day-title">'+escapeHTML(p.title)+'</strong><span class="tv-day-meta">'+p.exercises.length+' 个动作 · '+sets+' 组 · 约 '+Math.round(estimatedSeconds(day)/60)+' 分钟</span></button>';}).join('');
  $('tv-days').onclick=function(event){var button=event.target.closest('[data-day]');if(button)selectDay(Number(button.dataset.day));};
  setInterval(function(){updateTimers();tickFollow();},250);focus('tv-day-'+state.day);
})();
