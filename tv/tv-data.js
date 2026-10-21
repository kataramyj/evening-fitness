'use strict';
// TV-only changes; the desktop plan and stored training history remain unchanged.
window.FITNESS_PLAN[3] = {
  title: '核心', subtitle: '腹部卷曲与躯干稳定；不夹带胸背训练。',
  exercises: [['crunch',3,'10–12 次'],['deadbug',2,'每侧 6–8 次'],['birddog',2,'每侧 6 次'],['sideplank',2,'每侧 15–20 秒']]
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
  standingPelvis: {src:'assets/warmup/standing-pelvic-tilt.gif',credit:'© Gym visual · 站姿骨盆活动'},
  ankle: {src:'assets/warmup/ankle-circles.gif',credit:'© Gym visual · 脚踝绕圈'},
  press: {src:'assets/coaching/dumbbell-floor-press.gif',credit:'StrengthLog · 哑铃地板卧推'},
  row: {src:'assets/coaching/bent-over-row.gif',credit:'© Gym visual · 双臂哑铃划船'},
  split: {src:'assets/videos/2368-9E25EOx.gif',credit:'© Gym visual · 徒手分腿蹲'},
  calfRaise: {src:'assets/videos/1373-bJYHBIN.gif',credit:'© Gym visual · 徒手提踵'},
  pelvicTilt: {src:'assets/warmup/pelvic-tilt.gif',credit:'© Gym visual · 仰卧骨盆轻倾'},
  birdDog: {src:'assets/coaching/bird-dog-2.mp4',credit:'Lyndhurst Chiropractic Clinic · 鸟狗式'},
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
        ['动态打开胸肩','站稳，双臂在胸前缓慢合拢，再向两侧打开；不猛甩。','60 秒','chest'],
        ['站姿骨盆轻倾','双膝微弯，双手扶髋，轻轻前后调整骨盆；幅度小。','60 秒','standingPelvis'],
        ['轻重量地板卧推','用明显轻于正式训练的双哑铃，缓慢推起、回落。','90 秒','press'],
        ['轻重量俯身划船','双脚站稳，从髋部前倾，用轻哑铃缓慢拉肘。','90 秒','row']
      ],
      cooldown: [
        ['缓慢打开胸肩','双臂在胸前合拢，再缓慢打开；只做到轻微舒展。','60 秒','chest'],
        ['跪姿背部舒展','跪在垫上，双手向前伸，髋向后移，胸口自然靠近地面。','60 秒','lat']
      ]
    },
    2: {
      warmup: [
        ['站姿骨盆轻倾','双膝微弯，双手扶髋，小幅活动骨盆。','60 秒','standingPelvis'],
        ['脚踝绕圈','站在墙边轻扶墙，一脚微抬，缓慢绕脚踝；换方向、换脚。','60 秒','ankle'],
        ['徒手原地分腿蹲','不拿哑铃，前后站稳，左右各做浅幅下蹲。','90 秒','split'],
        ['徒手慢提踵','脚掌踩稳，缓慢抬起、落下脚跟，不弹跳。','90 秒','calfRaise']
      ],
      cooldown: [
        ['侧卧大腿前侧舒展','侧卧，弯曲上侧膝盖，用手轻握脚踝向臀部靠近；左右各做。','每侧 30 秒','quad'],
        ['扶墙小腿舒展','双手扶墙，一脚后撤，脚跟着地；左右各做。','每侧 30 秒','calfStretch']
      ]
    },
    3: {
      warmup: [
        ['仰卧骨盆轻倾','屈膝仰卧，呼气时轻收腹，让下背轻贴垫，再放松。','120 秒','pelvicTilt'],
        ['轻柔鸟狗式','四点跪姿，对侧手脚缓慢伸出、收回，动作小而稳。','90 秒','birdDog'],
        ['轻柔单腿死虫式','仰卧，腰背稳定；一腿缓慢伸出、收回，再换腿。','90 秒','deadBug']
      ],
      cooldown: [
        ['仰卧骨盆轻倾','屈膝仰卧，轻轻活动骨盆，呼吸放慢。','60 秒','pelvicTilt'],
        ['跪姿背部舒展','双手向前伸，髋慢慢向后移；只到舒服的位置。','60 秒','lat']
      ]
    },
    4: {
      warmup: [
        ['站姿骨盆轻倾','双膝微弯，双手扶髋，小幅活动骨盆。','60 秒','standingPelvis'],
        ['轻柔徒手臀桥','仰卧屈膝、脚掌踩稳，缓慢抬髋、落下，不顶腰。','120 秒','bridge'],
        ['侧卧抬腿准备','侧卧，骨盆叠齐；上侧腿小幅抬起、落下，两边都做。','120 秒','abduction']
      ],
      cooldown: [
        ['坐姿臀部舒展','坐在垫上，一脚跨到另一腿旁，轻轻向前倾；左右各做。','每侧 30 秒','glute'],
        ['仰卧腿后侧舒展','仰卧，一腿抬起，双手扶腿；膝可微弯，左右各做。','每侧 30 秒','hamstring']
      ]
    }
  }
};
