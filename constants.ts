import { Stage, StageId } from './types';

export const STAGES: Stage[] = [
  {
    id: StageId.PRE_PREG,
    label: '備孕期',
    description: '科學計畫',
    keyFocus: '調整體質，養精蓄銳',
    icon: '🌱',
    topics: [
      { id: 'money_talk', title: '生小孩要存多少錢？', tag: '價值觀', queryPrompt: '台灣生小孩養小孩到大學的預估花費與理財規劃' },
      { id: 'supplements', title: '備孕要吃什麼保健品？', tag: '營養', queryPrompt: '備孕期間男性與女性需要的營養補充品清單' },
      { id: 'timing', title: '排卵期怎麼算最準？', tag: '健康', queryPrompt: '科學計算排卵期與最佳受孕時機' },
      { id: 'lifestyle', title: '男生需要禁慾養精嗎？', tag: '健康', queryPrompt: '備孕期間男性的精子品質與禁慾天數迷思' },
      { id: 'checkup', title: '孕前檢查要做哪些？', tag: '健康', queryPrompt: '備孕夫妻必要的遺傳諮詢與健康檢查項目' },
      { id: 'coffee', title: '備孕可以喝咖啡嗎？', tag: '營養', queryPrompt: '咖啡因攝取對受孕機率的影響研究' },
    ]
  },
  {
    id: StageId.PREG_EARLY,
    label: '懷孕初期',
    subLabel: '0-3個月',
    description: '害喜地獄',
    keyFocus: '胚胎穩定，媽媽放鬆',
    icon: '🤢',
    topics: [
      { id: 'reveal', title: '真的要滿三個月才能說？', tag: '價值觀', queryPrompt: '懷孕三個月不公開的習俗由來與科學流產率數據' },
      { id: 'bleeding', title: '懷孕初期出血正常嗎？', tag: '安全', queryPrompt: '懷孕初期出血的原因分辨與危險徵兆' },
      { id: 'morning_sickness', title: '孕吐太嚴重怎麼辦？', tag: '健康', queryPrompt: '緩解嚴重孕吐的科學方法與飲食建議' },
      { id: 'folic_acid', title: '葉酸要吃到什麼時候？', tag: '營養', queryPrompt: '孕期葉酸補充劑量與截止時間' },
      { id: 'sex', title: '懷孕初期可以愛愛嗎？', tag: '健康', queryPrompt: '懷孕前三個月性行為的安全性評估' },
      { id: 'forbidden_food', title: '真的不能吃薏仁/木瓜？', tag: '營養', queryPrompt: '常見孕期飲食禁忌的科學闢謠' },
    ]
  },
  {
    id: StageId.PREG_MID,
    label: '懷孕中期',
    subLabel: '4-6個月',
    description: '食慾大開',
    keyFocus: '體重控制，補充DHA',
    icon: '🤰',
    topics: [
      { id: 'gender_reveal', title: '性別派對該誰主辦？', tag: '價值觀', queryPrompt: '性別揭曉派對的流行趨勢與預算規劃' },
      { id: 'weight', title: '體重增加多少算正常？', tag: '健康', queryPrompt: '孕期體重控制標準與對胎兒影響' },
      { id: 'movement', title: '什麼時候會感覺到胎動？', tag: '發展', queryPrompt: '初產婦與經產婦胎動出現時間與頻率' },
      { id: 'dha', title: '需要補充DHA/魚油嗎？', tag: '營養', queryPrompt: '孕期DHA補充對胎兒腦部發展的效益與時機' },
      { id: 'constipation', title: '孕期便秘超級嚴重？', tag: '健康', queryPrompt: '改善孕婦便秘的飲食與藥物使用安全' },
      { id: 'travel', title: '這時候可以出國旅遊嗎？', tag: '安全', queryPrompt: '孕中期搭飛機旅遊的風險與適航證明' },
    ]
  },
  {
    id: StageId.PREG_LATE,
    label: '懷孕後期',
    subLabel: '7-9個月',
    description: '準備卸貨',
    keyFocus: '注意產兆，準備待產包',
    icon: '🐘',
    topics: [
      { id: 'confinement_money', title: '月子中心錢誰出？', tag: '價值觀', queryPrompt: '月子中心費用分擔的家庭價值觀討論' },
      { id: 'cramp', title: '半夜腳抽筋怎麼救？', tag: '健康', queryPrompt: '孕期腿部抽筋的原因缺鈣迷思與舒緩方式' },
      { id: 'position', title: '胎位不正一定要剖腹？', tag: '安全', queryPrompt: '胎位不正的矯正運動與生產方式選擇' },
      { id: 'contraction', title: '宮縮還是陣痛怎麼分？', tag: '安全', queryPrompt: '區分假性宮縮與真實產兆的判斷標準' },
      { id: 'gbs', title: '乙型鏈球菌沒過怎辦？', tag: '健康', queryPrompt: '乙型鏈球菌篩檢陽性對生產的影響與處置' },
      { id: 'swelling', title: '腳水腫到像麵龜？', tag: '健康', queryPrompt: '生理性水腫與子癇前症水腫的差別' },
    ]
  },
  // Split Newborn into two phases
  {
    id: StageId.NEWBORN_BIRTH,
    label: '坐月子期',
    subLabel: '0-1個月',
    description: '新手混亂',
    keyFocus: '母體恢復，建立哺乳',
    icon: '🤱',
    topics: [
      { id: 'mother_in_law', title: '婆婆媽媽想幫忙坐月子？', tag: '價值觀', queryPrompt: '給長輩坐月子與請月嫂或去月子中心的優缺點比較' },
      { id: 'poop_color', title: '大便顏色青綠色正常嗎？', tag: '健康', queryPrompt: '新生兒大便顏色色卡對照與健康警訊' },
      { id: 'jaundice', title: '黃疸退很慢要照光嗎？', tag: '健康', queryPrompt: '生理性與病理性黃疸指數標準與居家觀察' },
      { id: 'umbilical', title: '臍帶護理與掉落時間？', tag: '安全', queryPrompt: '新生兒臍帶護理消毒步驟與感染徵兆' },
      { id: 'breastmilk_supply', title: '奶水不足怎麼追奶？', tag: '營養', queryPrompt: '產後黃金追奶期與發奶食物科學' },
      { id: 'lochia', title: '產後惡露要排多久？', tag: '健康', queryPrompt: '產後惡露顏色變化階段與異常出血判斷' },
      { id: 'baby_acne', title: '寶寶臉上長痘痘(脂漏)？', tag: '健康', queryPrompt: '新生兒脂漏性皮膚炎成因與清潔照護' },
    ]
  },
  {
    id: StageId.NEWBORN_ROUTINE,
    label: '第四孕期',
    subLabel: '1-4個月',
    description: '適應世界',
    keyFocus: '睡眠儀式，腸絞痛對策',
    icon: '👶',
    topics: [
      { id: 'crying', title: '半夜無故大哭(腸絞痛)？', tag: '心理', queryPrompt: '嬰兒腸絞痛(Colic)的症狀判斷與安撫技巧5S' },
      { id: 'sleep_training', title: '可以訓練睡過夜嗎？', tag: '發展', queryPrompt: '新生兒睡眠模式與睡眠訓練的最早時機' },
      { id: 'tummy_time', title: '什麼時候練抬頭？', tag: '發展', queryPrompt: 'Tummy Time 趴臥練習的時機與安全' },
      { id: 'flat_head', title: '頭睡扁了怎麼辦？', tag: '外觀', queryPrompt: '嬰兒頭型矯正黃金期與姿勢調整' },
      { id: 'vaccine', title: '打疫苗發燒怎麼照顧？', tag: '健康', queryPrompt: '嬰兒疫苗接種後副作用護理與就醫時機' },
      { id: 'spit_up', title: '喝完奶一直溢奶/吐奶？', tag: '健康', queryPrompt: '生理性溢奶與病理性胃食道逆流分辨' },
      { id: 'vitamin_d', title: '寶寶要補維生素D嗎？', tag: '營養', queryPrompt: '純母乳寶寶與配方奶寶寶的維生素D補充建議' },
    ]
  },
  {
    id: StageId.INFANT,
    label: '嬰兒期',
    subLabel: '4-12個月',
    description: '副食品戰場',
    keyFocus: '嘗試食物，粗大動作',
    icon: '🥣',
    topics: [
      { id: 'parenting_style', title: '保母還是送托嬰中心？', tag: '價值觀', queryPrompt: '保母與托嬰中心的優缺點比較與選擇考量' },
      { id: 'solids_first', title: '第一口副食品吃什麼？', tag: '營養', queryPrompt: '嬰兒副食品添加順序、過敏測試與傳統粥派vsBLW' },
      { id: 'water_drinking', title: '需要喝水嗎？喝多少？', tag: '營養', queryPrompt: '嬰兒開始喝水的時機點與腎臟負擔迷思' },
      { id: 'teething', title: '長牙發燒是正常的嗎？', tag: '健康', queryPrompt: '長牙期的不適症狀與發燒迷思釐清' },
      { id: 'milestone_flip', title: '還不會翻身/坐正常嗎？', tag: '發展', queryPrompt: '嬰兒粗大動作發展里程碑警訊時程' },
      { id: 'allergy', title: '蛋黃/海鮮會過敏不能吃？', tag: '營養', queryPrompt: '延後給予高致敏食物是否能預防過敏的最新研究' },
      { id: 'stranger', title: '開始認生怕生怎麼辦？', tag: '心理', queryPrompt: '嬰兒分離焦慮與認生期的發展心理' },
    ]
  },
  {
    id: StageId.TODDLER,
    label: '幼兒期',
    subLabel: '1-3歲',
    description: '半獸人',
    keyFocus: '規矩建立，語言爆發',
    icon: '🦖',
    topics: [
      { id: 'grandparents', title: '長輩寵孫沒規矩怎麼辦？', tag: '價值觀', queryPrompt: '隔代教養觀念衝突與溝通技巧' },
      { id: 'tantrum', title: '崩潰躺地大叫怎麼教？', tag: '心理', queryPrompt: '兩歲兒情緒調節大腦發展與父母應對策略' },
      { id: 'potty_train', title: '什麼時候開始戒尿布？', tag: '發展', queryPrompt: '如廁訓練的生理與心理準備完成訊號' },
      { id: 'picky_eater', title: '不吃菜/挑食怎麼辦？', tag: '營養', queryPrompt: '幼兒挑食原因與營造快樂餐桌的方法' },
      { id: 'screen_time', title: '可以看電視/手機嗎？', tag: '安全', queryPrompt: '幼兒螢幕時間規範與藍光對視力大腦影響' },
      { id: 'language', title: '還不愛說話是遲緩嗎？', tag: '發展', queryPrompt: '幼兒語言發展里程碑與語言遲緩評估界線' },
      { id: 'sharing', title: '不願意分享玩具？', tag: '心理', queryPrompt: '幼兒物權觀念發展與分享行為引導' },
    ]
  }
];