'use strict';
// TV-only changes; the desktop plan and stored training history remain unchanged.
window.FITNESS_PLAN[1] = {
  title: '胸背', subtitle: '胸、背、肩与手臂；五个哑铃动作。',
  exercises: [['press',3,'15 次'],['floorfly',3,'15 次'],['row',3,'15 次'],['lateralraise',3,'15 次'],['curl',3,'15 次']]
};
window.FITNESS_PLAN[2] = {
  title:'腿', subtitle:'大腿、小腿与腘绳肌；分腿蹲左右都做。',
  exercises:[['squat',3,'15 次'],['split',3,'每侧 15 次'],['rdl',3,'15 次'],['calf',3,'15 次']]
};
window.FITNESS_PLAN[3] = {
  title: '核心', subtitle: '稳定、两种卷腹与侧腹；侧卧动作左右都做。',
  exercises: [['deadbug',3,'交替共 15 次'],['heeltouches',3,'交替共 15 次'],['crunch',3,'15 次'],['reversecrunch',3,'15 次'],['sideleglift',3,'每侧 15 次']]
};
window.FITNESS_PLAN[4] = {
  title:'臀', subtitle:'徒手臀部训练；不做臀桥、深蹲或硬拉。',
  exercises:[['kickback',3,'每侧 15 次'],['firehydrant',3,'每侧 15 次'],['abduction',3,'每侧 15 次'],['clamshell',3,'每侧 15 次']]
};
window.FITNESS_COACHING.reversecrunch = {
  name:'反向卷腹', equipment:'徒手 · 瑜伽垫',
  steps:['仰卧，双膝弯约 90°，小腿离地；双手放在身体两侧帮助稳定。','呼气，轻收腹并把骨盆向胸口卷起，尾骨小幅离垫；不要猛甩双腿。','吸气，缓慢把骨盆落回垫上，膝盖仍在髋部上方。'],
  mistakes:['只把膝盖甩向脸，骨盆却不卷起。','下放时双腿过低，腰背明显拱起。'],
  load:'与普通卷腹方向不同：这次是骨盆向肋骨卷。目标 15 次，做不到时减小幅度，不借惯性。',
  media:'assets/coaching/reverse-crunch.mp4',credit:'Fitwill · Reverse Crunch',
  sources:[['ACE · Reverse Ab Crunch','https://www.acefitness.org/resources/everyone/exercise-library/76/reverse-crunch/'],['Fitwill · Reverse Crunch','https://fitwill.app/exercise/0872/reverse-crunch/']]
};
window.FITNESS_COACHING.heeltouches = {
  name:'仰卧交替摸脚跟',equipment:'徒手 · 瑜伽垫',
  steps:['仰卧屈膝，双脚踩地，脚跟靠近臀部；双手放身体两侧。','轻抬肩和上背，呼气，用右手朝右脚跟方向伸，感觉右侧腰腹收紧。','回到中间，再向左脚跟伸；左右交替共 15 次，不必真的摸到脚跟。'],
  mistakes:['只甩手臂，躯干没有向侧面小幅弯曲。','抬头拉扯脖子，或脚跟离地。'],
  load:'每组 60 秒内以左右交替共 15 次为目标；先把动作做稳，颈部不适可缩小抬肩幅度。',
  media:'assets/coaching/alternate-heel-touches.mp4',credit:'Fitwill · Alternate Heel Touches',
  sources:[['Fitwill · Alternate Heel Touches','https://fitwill.app/exercise/0006/alternate-heel-touches/']]
};
window.FITNESS_COACHING.sideleglift = {
  name:'侧卧双腿同时上抬', equipment:'徒手 · 瑜伽垫',
  steps:['侧卧在垫上，双腿伸直并拢，头枕在下侧手臂上；上侧手撑在胸前地面。','呼气，保持双腿并拢，同时把两只脚小幅抬离地面；骨盆不要向后翻。','吸气，缓慢放下双腿。左侧做完再换右侧，每侧目标 15 次。'],
  mistakes:['只抬上侧腿，把动作变成侧卧髋外展。','靠摆动双腿或扭转躯干把脚抬高。'],
  load:'这是小幅度侧腹与髋部稳定练习。60 秒内每侧目标 15 次；不适时减小幅度或停止。视频为双腿同时上抬，不是只抬上侧腿。',
  media:'assets/coaching/side-lying-double-leg-lift.mp4',credit:'Fitwill · Side Lying Legs Lift',
  sources:[['Fitwill · Side Lying Legs Lift','https://fitwill.app/exercise/9334/side-lying-legs-lift/'],['Physitrack · Side lying leg lifts version 2','https://ie.physitrack.com/home-exercise-video/side-lying-leg-lifts---version-2']]
};
window.FITNESS_COACHING.kickback = {
  name:'跪姿直腿后伸',equipment:'徒手 · 瑜伽垫',
  steps:['四点跪姿，双手在肩下，支撑膝在髋下；一条腿向身后伸直。','轻收腹，骨盆正对地面；呼气，从髋部把后伸腿小幅抬起。','只抬到臀部发力、腰背不拱的位置，停一瞬再缓慢放下；做完一侧再换侧。'],
  mistakes:['为了抬高而塌腰、转动骨盆。','快速甩腿，或把支撑重量全压到一侧手臂。'],
  load:'徒手即可；每侧目标 15 次，先做小幅度。腰背若开始代偿，缩小幅度或停止。',
  media:'assets/coaching/kneeling-straight-leg-kickback.mp4',credit:'Fitwill · Kneeling Straight Leg Kickback',
  sources:[['Fitwill · Kneeling Straight Leg Kickback','https://fitwill.app/exercise/1477/kneeling-straight-leg-kickback/']]
};
window.FITNESS_COACHING.firehydrant = {
  name:'跪姿屈膝侧抬腿',equipment:'徒手 · 瑜伽垫',
  steps:['四点跪姿，手在肩下、膝在髋下，背保持自然。','工作腿保持屈膝约 90°，呼气，把膝盖向身体侧面缓缓抬起。','骨盆不翻转、腰不侧弯；抬到能控制的位置后慢慢放回。做完一侧再换侧。'],
  mistakes:['把上半身歪向另一侧借力。','膝盖抬得过高，靠扭腰完成动作。'],
  load:'与后伸腿方向不同，这个动作主要向侧面发力；每侧目标 15 次。膝盖压痛可在垫上加折叠毛巾。',
  media:'assets/coaching/kneeling-bent-leg-side-kick.mp4',credit:'Fitwill · Kneeling Bent Leg Side Kick',
  sources:[['Fitwill · Kneeling Bent Leg Side Kick','https://fitwill.app/exercise/1475/kneeling-bent-leg-side-kick/']]
};
window.FITNESS_COACHING.clamshell = {
  name:'侧卧蚌式开合',equipment:'徒手 · 瑜伽垫',
  steps:['侧卧，髋和膝都弯曲，两脚并拢；头枕下侧手臂。','骨盆上下叠齐，两只脚保持接触；呼气，把上侧膝小幅打开。','不让身体向后翻，吸气时慢慢合上膝盖；做完一侧再换侧。'],
  mistakes:['靠骨盆和躯干后滚把膝盖抬高。','双脚分开，或快速甩膝盖。'],
  load:'不需要弹力带；每侧目标 15 次。放慢回落比追求开得很大更重要。',
  media:'assets/coaching/hip-clam-shell.mp4',credit:'Fitwill · Hip Clam Shell',
  sources:[['Fitwill · Hip Clam Shell','https://fitwill.app/exercise/4870/hip-clam-shell/']]
};
window.FITNESS_COACHING.floorfly = {
  name:'哑铃地板飞鸟', equipment:'双哑铃 · 瑜伽垫',
  steps:['坐下后持轻哑铃仰卧，屈膝、双脚踩地；掌心相对，双手在胸部上方。','手肘保持微弯且角度基本不变，吸气，双臂向两侧缓慢打开。','上臂接近轻触地面就停，不要砸地或追求更大幅度。','呼气，靠胸部发力沿弧线把哑铃合回胸部上方；结束先把重量安全放下。'],
  mistakes:['用地板卧推的弯肘推举代替飞鸟。','哑铃过重、手肘锁死，或让手臂快速坠落。'],
  load:'选比卧推明显更轻、能稳定控制的哑铃。60 秒内以 15 次为目标，不赶速度；肩部不适时停止。',
  media:'assets/coaching/dumbbell-floor-fly.mp4',credit:'Fitwill · Dumbbell Floor Fly',
  sources:[['Fitwill · Dumbbell Floor Fly','https://fitwill.app/exercise/4149/dumbbell-floor-fly/video/'],['PureGym · Dumbbell Floor Fly','https://www.puregym.com/exercises/chest/chest-fly/dumbbell-floor-fly/']]
};
window.FITNESS_COACHING.lateralraise = {
  name:'站姿哑铃侧平举', equipment:'双哑铃',
  steps:['双脚约与髋同宽站稳，膝盖微松；两只轻哑铃垂在身体两侧。','手肘微弯，呼气，双臂向两侧抬至约肩高，手腕保持自然。','停一瞬，吸气并慢慢放回；躯干和肩膀尽量稳定。'],
  mistakes:['耸肩、甩腰借力或抬得明显高于肩。','哑铃太重，靠摆动完成次数。'],
  load:'侧平举通常用比卧推、划船更轻的哑铃；60 秒内以 15 次为目标。肩部不适时停止。',
  media:'assets/coaching/dumbbell-lateral-raise.gif',credit:'StrengthLog · Dumbbell Lateral Raise',
  sources:[['StrengthLog · Dumbbell Lateral Raise','https://www.strengthlog.com/dumbbell-lateral-raise/']]
};
window.FITNESS_COACHING.crunch = {
  name: '仰卧卷腹', equipment: '徒手 · 瑜伽垫',
  steps: ['仰卧，屈膝，双脚平放垫上。双手轻放耳侧，不用手拉头。', '呼气，收紧腹部，让肋骨慢慢靠近骨盆；只抬起肩和上背，不坐起。', '停一瞬，吸气并缓慢落回；脚、臀和下背保持贴垫。'],
  mistakes: ['用双手猛拉颈部，或靠甩身体坐起来。', '为了抬高而拱腰、憋气。'],
  load: '动作小而慢；颈部放松。若颈或腰不舒服，缩小幅度或停止。',
  media: 'assets/coaching/crunch-guide.gif', credit: '原创循环示意 · 文字依据 ACE 卷腹教学',
  sources: [['ACE · Crunch','https://www.acefitness.org/resources/everyone/exercise-library/52/crunch/']]
};
window.TV_ROUTINE_MEDIA = {
  chest: {src:'assets/warmup/dynamic-chest.gif',credit:'© Gym visual · 动态胸部活动'},
  armCircles: {src:'assets/warmup/arm-circles.mp4',credit:'Fitwill · Arm Circles'},
  kneeRoll: {src:'assets/warmup/lying-knee-roll-over-stretch.mp4',credit:'Fitwill · Lying Knee Roll Over Stretch'},
  standingKickback: {src:'assets/warmup/standing-alternate-glute-kickback.mp4',credit:'Fitwill · Standing Alternate Glute Kickback'},
  ankle: {src:'assets/warmup/ankle-circles.gif',credit:'© Gym visual · 脚踝绕圈'},
  press: {src:'assets/coaching/dumbbell-floor-press.gif',credit:'StrengthLog · 哑铃地板卧推'},
  row: {src:'assets/coaching/bent-over-row.gif',credit:'© Gym visual · 双臂哑铃划船'},
  split: {src:'assets/videos/2368-9E25EOx.gif',credit:'© Gym visual · 徒手分腿蹲'},
  calfRaise: {src:'assets/videos/1373-bJYHBIN.gif',credit:'© Gym visual · 徒手提踵'},
  pelvicTilt: {src:'assets/warmup/pelvic-tilt.gif',credit:'© Gym visual · 仰卧骨盆轻倾'},
  deadBug: {src:'assets/coaching/dead-bug-1.mp4',credit:'Lyndhurst Chiropractic Clinic · 单腿死虫式'},
  bridge: {src:'assets/videos/3013-u0cNiij.gif',credit:'© Gym visual · 徒手臀桥'},
  abduction: {src:'assets/coaching/side-lying-hip-abduction.mp4',credit:'Physitrack · 侧卧抬腿'},
  lat: {src:'assets/warmup/kneeling-lat-stretch.gif',credit:'© Gym visual · 跪姿背部舒展'},
  quad: {src:'assets/warmup/side-lying-quad-stretch.gif',credit:'© Gym visual · 侧卧股四头肌舒展'},
  calfStretch: {src:'assets/warmup/wall-calf-stretch.gif',credit:'© Gym visual · 扶墙小腿舒展'},
  glute: {src:'assets/warmup/seated-glute-stretch.gif',credit:'© Gym visual · 坐姿臀部舒展'},
  hamstring: {src:'assets/warmup/supine-hamstring-stretch.gif',credit:'© Gym visual · 仰卧腿后侧舒展'}
};
window.TV_ROUTINES = {
  commonCooldown: [['呼吸放慢','坐下或仰卧，缓慢呼吸，让身体逐渐平静。','60 秒',null]],
  days: {
    1: {
      warmup: [
        ['动态打开胸肩','站稳，双臂在胸前缓慢合拢，再向两侧打开；不猛甩。','90 秒','chest'],
        ['跪姿背部动态伸展','四点跪姿，双手向前伸，髋轻轻后移；随后回到四点跪姿，缓慢重复，不停留在最远处。','90 秒','lat'],
        ['手臂轻柔绕圈','站稳，双臂向两侧伸出，以肩为轴画小圈；先向前再向后，保持肩膀放松。','120 秒','armCircles']
      ],
      cooldown: [
        ['缓慢打开胸肩','双臂在胸前合拢，再缓慢打开；只做到轻微舒展。','120 秒','chest'],
        ['跪姿背部舒展','跪在垫上，双手向前伸，髋向后移，胸口自然靠近地面。','120 秒','lat']
      ]
    },
    2: {
      warmup: [
        ['站姿交替轻后伸腿','站稳，左右腿轮流小幅向后伸，脚尖轻点地；上身直立，不塌腰。','60 秒','standingKickback'],
        ['脚踝绕圈','站在墙边轻扶墙，一脚微抬，缓慢绕脚踝；换方向、换脚。','60 秒','ankle'],
        ['徒手原地分腿蹲','不拿哑铃，前后站稳，左右各做浅幅下蹲。','90 秒','split'],
        ['徒手慢提踵','脚掌踩稳，缓慢抬起、落下脚跟，不弹跳。','90 秒','calfRaise']
      ],
      cooldown: [
        ['侧卧大腿前侧舒展','侧卧，弯曲上侧膝盖，用手轻握脚踝向臀部靠近；左右各做。','每侧 60 秒','quad'],
        ['扶墙小腿舒展','双手扶墙，一脚后撤，脚跟着地；左右各做。','每侧 60 秒','calfStretch']
      ]
    },
    3: {
      warmup: [
        ['仰卧骨盆轻倾','屈膝仰卧，呼气时轻收腹，让下背轻贴垫，再放松。','120 秒','pelvicTilt'],
        ['仰卧屈膝左右摆','仰卧屈膝，双脚踩地；两膝并拢，缓慢向左右小幅摆动，双肩保持贴垫。','90 秒','kneeRoll'],
        ['轻柔单腿死虫式','仰卧，腰背稳定；一腿缓慢伸出、收回，再换腿。','90 秒','deadBug']
      ],
      cooldown: [
        ['仰卧骨盆轻倾','屈膝仰卧，轻轻活动骨盆，呼吸放慢。','120 秒','pelvicTilt'],
        ['跪姿背部舒展','双手向前伸，髋慢慢向后移；只到舒服的位置。','120 秒','lat']
      ]
    },
    4: {
      warmup: [
        ['脚踝绕圈','站在墙边轻扶墙，一脚微抬，缓慢绕脚踝；换方向、换脚。','60 秒','ankle'],
        ['站姿交替轻后伸腿','一腿支撑，另一腿缓慢向后抬起再放下；左右交替，腰背保持自然。','120 秒','standingKickback'],
        ['侧卧抬腿准备','侧卧，骨盆叠齐；上侧腿小幅抬起、落下，两边都做。','120 秒','abduction']
      ],
      cooldown: [
        ['坐姿臀部舒展','坐在垫上，一脚跨到另一腿旁，轻轻向前倾；左右各做。','每侧 60 秒','glute'],
        ['仰卧腿后侧舒展','仰卧，一腿抬起，双手扶腿；膝可微弯，左右各做。','每侧 60 秒','hamstring']
      ]
    }
  }
};
