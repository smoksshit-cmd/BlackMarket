(function(){
'use strict';
var EXT='black-market';
function getCtx(){try{return window.SillyTavern?window.SillyTavern.getContext():null}catch(e){return null}}
// --- Глобальные настройки (UI, баланс) — extensionSettings ---
function getES(){var c=getCtx();return(c&&c.extensionSettings)||window.extension_settings||(window.extension_settings={})}
function S(){var e=getES();if(!e[EXT])e[EXT]={};return e[EXT]}
function save(){var c=getCtx();if(c&&c.saveSettingsDebounced)c.saveSettingsDebounced()}
// --- Per-chat данные (зависимости, инвентарь, эффекты) — chatMetadata ---
function chatKey(){
var c=getCtx();if(!c)return 'bm_unknown';
var chatId=(typeof c.getCurrentChatId==='function'?c.getCurrentChatId():null)||c.chatId||c.chat_id||'unknown';
var charId=c.characterId!=null?c.characterId:(c.groupId!=null?('g'+c.groupId):'unknown');
return 'bm_v1__'+charId+'__'+chatId;
}
var CHAT_DEFAULTS={inventory:{},addictions:{},botAddictions:{},activeEffects:[],killCount:0,useCount:{},lastUseTime:{},botLastUseTime:{},rehabVisits:{}};
function SC(){
var c=getCtx();if(!c||!c.chatMetadata)return JSON.parse(JSON.stringify(CHAT_DEFAULTS));
var key=chatKey();
if(!c.chatMetadata[key]){c.chatMetadata[key]=JSON.parse(JSON.stringify(CHAT_DEFAULTS));}
var d=c.chatMetadata[key];
for(var k in CHAT_DEFAULTS){if(d[k]===undefined)d[k]=typeof CHAT_DEFAULTS[k]==='object'?JSON.parse(JSON.stringify(CHAT_DEFAULTS[k])):CHAT_DEFAULTS[k];}
return d;
}
function saveChat(){var c=getCtx();if(c&&c.saveMetadata)c.saveMetadata();}
var CATALOG=[
{id:'drugs',name:'💊 Наркотики',items:[
{id:'weed',name:'Марихуана',icon:'🌿',price:10,desc:'1г',addict:'cannabis',addLvl:2,effect:'расслаблен, заторможен, красные глаза'},
{id:'cocaine',name:'Кокаин',icon:'❄️',price:80,desc:'1г',addict:'cocaine',addLvl:5,effect:'гиперактивен, зрачки расширены, самоуверен'},
{id:'heroin',name:'Героин',icon:'💉',price:60,desc:'доза',addict:'opioids',addLvl:8,effect:'в эйфории, заторможен, зрачки сужены'},
{id:'mdma',name:'MDMA',icon:'💜',price:25,desc:'1 таблетка',addict:'mdma',addLvl:3,effect:'переполнен любовью, тактильная чувствительность'},
{id:'lsd',name:'ЛСД',icon:'🌈',price:15,desc:'1 марка',addict:'psychedelics',addLvl:2,effect:'галлюцинации, искажённое восприятие'},
{id:'meth',name:'Метамфетамин',icon:'🔥',price:70,desc:'0.5г',addict:'meth',addLvl:10,effect:'бешеная энергия, паранойя, бессонница'},
{id:'opium',name:'Опиум',icon:'🌺',price:50,desc:'1г сырого',addict:'opioids',addLvl:5,effect:'глубокая эйфория, сонливость, замедленность'},
{id:'crack',name:'Крэк',icon:'💨',price:20,desc:'1 камень',addict:'cocaine',addLvl:8,effect:'мгновенный приход, тремор, паранойя'},
{id:'spice',name:'Спайс',icon:'🌾',price:5,desc:'1 пакет',addict:'cannabis',addLvl:4,effect:'непредсказуемые галлюцинации, тошнота'},
{id:'fentanyl',name:'Фентанил',icon:'☣️',price:40,desc:'1 пластырь',addict:'opioids',addLvl:15,effect:'полный транс, риск передозировки'},
{id:'ket_street',name:'Кетамин уличный',icon:'🐎',price:35,desc:'0.5г',addict:'ketamine',addLvl:3,effect:'лёгкая диссоциация, шатание'},
{id:'snuff',name:'Нюхательный табак',icon:'👃',price:3,desc:'1 баночка',addict:'cannabis',addLvl:0,effect:'лёгкое головокружение, чих'}]},
{id:'rare_drugs',name:'🧪 Редкие наркотики',items:[
{id:'dmt',name:'ДМТ',icon:'👁️',price:100,desc:'1 доза',addict:'psychedelics',addLvl:2,effect:'в другом измерении, видения'},
{id:'ayahuasca',name:'Аяхуаска',icon:'🍵',price:200,desc:'1 церемония',addict:'psychedelics',addLvl:2,effect:'транс, видения прошлого'},
{id:'adrenochrome',name:'Адренохром',icon:'🔴',price:2500,desc:'1мл',addict:'adreno',addLvl:3,effect:'ясность, страх, дрожь'},
{id:'soma',name:'Сома',icon:'✨',price:5000,desc:'1 доза',addict:'soma',addLvl:2,effect:'бессмертие, блаженство'},
{id:'ibogaine',name:'Ибогаин',icon:'🌳',price:500,desc:'1 сессия',addict:'psychedelics',addLvl:2,effect:'глубокий транс, видения предков'},
{id:'mescaline',name:'Мескалин',icon:'🌵',price:40,desc:'1 кактус',addict:'psychedelics',addLvl:2,effect:'цветные видения, единение с природой'},
{id:'salvia',name:'Сальвия',icon:'🍃',price:25,desc:'1г экстракта',addict:'psychedelics',addLvl:1,effect:'короткий мощный трип, дереализация'},
{id:'5meodmt',name:'5-MeO-DMT',icon:'🐸',price:150,desc:'1 доза',addict:'psychedelics',addLvl:3,effect:'растворение эго, космическое единство'},
{id:'flyagaric',name:'Мухомор',icon:'🍄',price:8,desc:'3 шляпки',addict:'psychedelics',addLvl:1,effect:'бред, микропсия, ощущение полёта'},
{id:'ether',name:'Эфир',icon:'💨',price:15,desc:'100мл',addict:'opioids',addLvl:1,effect:'эйфория, головокружение, оцепенение'}]},
{id:'weapons',name:'🔪 Оружие',items:[
{id:'knife',name:'Нож',icon:'🔪',price:25,desc:'Складной',addict:'bloodlust',addLvl:0,effect:'вооружён ножом'},
{id:'pistol',name:'Пистолет',icon:'🔫',price:300,desc:'9мм Glock',addict:'bloodlust',addLvl:0,effect:'вооружён пистолетом'},
{id:'rifle',name:'Автомат',icon:'🔫',price:1200,desc:'АК-47',addict:'bloodlust',addLvl:0,effect:'вооружён автоматом'},
{id:'brass',name:'Кастет',icon:'👊',price:15,desc:'Латунный',addict:'bloodlust',addLvl:0,effect:'кастет на руке'},
{id:'taser',name:'Электрошокер',icon:'⚡',price:50,desc:'50000В',addict:'bloodlust',addLvl:0,effect:'вооружён шокером'},
{id:'shotgun',name:'Дробовик',icon:'🔫',price:500,desc:'Помповый Remington',addict:'bloodlust',addLvl:0,effect:'вооружён дробовиком'},
{id:'sniper',name:'Снайперская винтовка',icon:'🎯',price:3000,desc:'Дальнобойная',addict:'bloodlust',addLvl:0,effect:'вооружён снайперкой'},
{id:'crossbow',name:'Арбалет',icon:'🏹',price:350,desc:'Тактический',addict:'bloodlust',addLvl:0,effect:'вооружён арбалетом'},
{id:'machete',name:'Мачете',icon:'🗡️',price:30,desc:'Тяжёлый клинок',addict:'bloodlust',addLvl:0,effect:'вооружён мачете'},
{id:'baton',name:'Дубинка',icon:'🏏',price:20,desc:'Резиновая',addict:'bloodlust',addLvl:0,effect:'вооружён дубинкой'},
{id:'frag_grenade',name:'Граната',icon:'💣',price:100,desc:'Осколочная М67',addict:'bloodlust',addLvl:0,effect:'имеет гранату'},
{id:'pepper_spray',name:'Баллончик с перцем',icon:'🌶️',price:15,desc:'Самооборона',addict:'bloodlust',addLvl:0,effect:'вооружён перцовым баллончиком'}]},
{id:'alcohol',name:'🍺 Алкоголь',items:[
{id:'vodka',name:'Водка',icon:'🍸',price:8,desc:'0.5л',addict:'alcohol',addLvl:1,effect:'пьян, расслаблен'},
{id:'whiskey',name:'Виски',icon:'🥃',price:30,desc:'0.7л бурбон',addict:'alcohol',addLvl:1,effect:'пьян, раскрепощён'},
{id:'absinthe',name:'Абсент',icon:'🧪',price:35,desc:'0.5л 72%',addict:'alcohol',addLvl:2,effect:'сильно пьян, галлюцинации'},
{id:'rum',name:'Ром',icon:'🏴‍☠️',price:15,desc:'0.7л',addict:'alcohol',addLvl:1,effect:'пьян, весел'},
{id:'tequila',name:'Текила',icon:'🌵',price:20,desc:'0.7л',addict:'alcohol',addLvl:1,effect:'пьян, раскован'},
{id:'moonshine',name:'Самогон',icon:'🫙',price:5,desc:'1л домашний',addict:'alcohol',addLvl:2,effect:'сильно пьян, мутит'},
{id:'gin',name:'Джин',icon:'🍸',price:18,desc:'0.7л',addict:'alcohol',addLvl:1,effect:'пьян, элегантен'},
{id:'champagne',name:'Шампанское',icon:'🍾',price:25,desc:'0.75л',addict:'alcohol',addLvl:1,effect:'лёгкое опьянение, праздничность'},
{id:'brandy',name:'Бренди',icon:'🥃',price:22,desc:'0.5л выдержанный',addict:'alcohol',addLvl:1,effect:'пьян, согрет'},
{id:'dark_beer',name:'Тёмное пиво',icon:'🍺',price:3,desc:'0.5л стаут',addict:'alcohol',addLvl:1,effect:'слегка пьян, расслаблен'}]},
{id:'medicine',name:'💊 Медикаменты',items:[
{id:'morphine',name:'Морфин',icon:'💉',price:30,desc:'1 ампула',addict:'opioids',addLvl:2,effect:'боль ушла, сонливость'},
{id:'xanax',name:'Ксанакс',icon:'💊',price:5,desc:'1 таблетка 2мг',addict:'benzos',addLvl:2,effect:'спокоен, заторможен'},
{id:'adderall',name:'Аддерол',icon:'💊',price:10,desc:'1 таблетка 30мг',addict:'amphet',addLvl:1,effect:'сфокусирован'},
{id:'ketamine',name:'Кетамин',icon:'🐴',price:50,desc:'1г медицинский',addict:'ketamine',addLvl:2,effect:'диссоциация'},
{id:'tramadol',name:'Трамадол',icon:'💊',price:3,desc:'1 таблетка 100мг',addict:'opioids',addLvl:1,effect:'притуплённая боль, лёгкая эйфория'},
{id:'relanium',name:'Реланиум',icon:'💊',price:8,desc:'1 ампула 10мг',addict:'benzos',addLvl:2,effect:'глубокое спокойствие, сонливость'},
{id:'codeine',name:'Кодеин',icon:'🍼',price:15,desc:'1 флакон сиропа',addict:'opioids',addLvl:1,effect:'лёгкая седация, кашель прошёл'},
{id:'adrenaline',name:'Адреналин',icon:'💉',price:20,desc:'1 ампула',effect:'резкий прилив энергии, тахикардия'},
{id:'antidote',name:'Антидот',icon:'🧬',price:100,desc:'1 доза универсальный',effect:'нейтрализует яд, очищение'},
{id:'sleeping_pills',name:'Снотворное',icon:'💤',price:4,desc:'блистер 10шт',addict:'benzos',addLvl:1,effect:'засыпает, глубокий сон'},
{id:'steroids',name:'Стероиды',icon:'💪',price:60,desc:'1 курс анаболиков',effect:'рост мышц, агрессия, выносливость'},
{id:'rehab_light',name:'Лёгкая реабилитация',icon:'🩺',price:150,desc:'Снижает зависимость на 1 ур.',effect:'проходит лёгкую реабилитацию, тяга ослабевает',rehab:1},
{id:'rehab_full',name:'Полная детоксикация',icon:'🏥',price:500,desc:'Снижает зависимость на 3 ур.',effect:'проходит полную детоксикацию, ломка',rehab:3},
{id:'rehab_total',name:'Полное излечение',icon:'💚',price:1500,desc:'Убирает ВСЕ зависимости',effect:'полностью вылечен от всех зависимостей',rehab:99}]},
{id:'poisons',name:'☠️ Яды',items:[
{id:'cyanide',name:'Цианид',icon:'💀',price:200,desc:'1г KCN',effect:'отравлен цианидом'},
{id:'arsenic',name:'Мышьяк',icon:'☠️',price:50,desc:'5г порошка',effect:'медленное отравление'},
{id:'curare',name:'Кураре',icon:'🌿',price:300,desc:'1 доза экстракта',effect:'парализован'},
{id:'sleep_poison',name:'Снотворное',icon:'😴',price:30,desc:'1 доза GHB',effect:'без сознания'},
{id:'ricin',name:'Рицин',icon:'🫘',price:500,desc:'1мг',effect:'медленная смерть от рицина'},
{id:'neurotoxin',name:'Нейротоксин',icon:'🧠',price:1500,desc:'1мл тетродотоксин',effect:'паралич, судороги'},
{id:'hemotoxin',name:'Гемотоксин',icon:'🩸',price:400,desc:'1 доза змеиный',effect:'внутренние кровотечения'},
{id:'spider_venom',name:'Яд паука',icon:'🕷️',price:250,desc:'0.5мл концентрат',effect:'некроз тканей, боль'},
{id:'polonium',name:'Полоний',icon:'☢️',price:50000,desc:'микрограмм Po-210',effect:'лучевое отравление'},
{id:'contact_poison',name:'Контактный яд',icon:'🧤',price:350,desc:'1 ампула ДМСО',effect:'отравление через прикосновение'}]},
{id:'explosives',name:'💥 Взрывчатка',items:[
{id:'dynamite',name:'Динамит',icon:'🧨',price:25,desc:'1 шашка',effect:'имеет динамит'},
{id:'c4',name:'C-4',icon:'💥',price:150,desc:'500г пластит',effect:'имеет C-4'},
{id:'grenade',name:'Граната',icon:'💣',price:100,desc:'М67 осколочная',effect:'имеет гранату'},
{id:'molotov',name:'Молотов',icon:'🔥',price:5,desc:'1 бутылка',effect:'имеет молотов'},
{id:'detonator',name:'Детонатор',icon:'🔘',price:50,desc:'электрический',effect:'имеет детонатор'},
{id:'thermite',name:'Термитная шашка',icon:'🔥',price:80,desc:'1 шашка TH3',effect:'имеет термит'},
{id:'smoke_gren',name:'Дымовая граната',icon:'💨',price:40,desc:'М18',effect:'дымовая завеса'},
{id:'flashbang',name:'Светошумовая',icon:'💥',price:60,desc:'М84',effect:'ослепляет и оглушает'},
{id:'mine_trap',name:'Мина-ловушка',icon:'🔺',price:200,desc:'самодельная',effect:'заминировано'}]},
{id:'contraband',name:'📦 Контрабанда',items:[
{id:'fake_docs',name:'Фальшивые документы',icon:'📄',price:2500,desc:'Паспорт',effect:'фальшивые документы'},
{id:'lockpicks',name:'Отмычки',icon:'🔑',price:30,desc:'Набор из 15шт',effect:'может вскрывать замки'},
{id:'burner',name:'Телефон',icon:'📱',price:20,desc:'Одноразовый',effect:'анонимный телефон'},
{id:'jammer',name:'Глушилка',icon:'📡',price:200,desc:'Блокирует связь',effect:'глушит сигнал'},
{id:'fake_money',name:'Поддельные деньги',icon:'💵',price:500,desc:'Пачка $5000 номинал',effect:'имеет фальшивые купюры'},
{id:'fingerprint_scanner',name:'Сканер отпечатков',icon:'👆',price:400,desc:'Портативный',effect:'может копировать отпечатки'},
{id:'bug_listener',name:'Жучок-прослушка',icon:'🎙️',price:80,desc:'GSM жучок',effect:'может прослушивать'},
{id:'stolen_keys',name:'Краденые ключи',icon:'🔐',price:50,desc:'Связка мастер-ключей',effect:'связка краденых ключей'},
{id:'safe_cracker',name:'Взломщик сейфов',icon:'🔓',price:1500,desc:'Электронный декодер',effect:'может вскрыть сейф'},
{id:'fake_badge',name:'Фальшивый бейдж',icon:'🪪',price:150,desc:'Удостоверение полиции',effect:'фальшивое удостоверение'}]},
{id:'magic',name:'🔮 Магия',items:[
{id:'love_potion',name:'Приворотное зелье',icon:'💕',price:300,desc:'Влечение',effect:'под действием приворота'},
{id:'truth_serum',name:'Сыворотка правды',icon:'💧',price:400,desc:'Не может лгать',effect:'говорит только правду'},
{id:'invisibility',name:'Невидимость',icon:'👻',price:700,desc:'Временная',effect:'невидим'},
{id:'strength',name:'Зелье силы',icon:'💪',price:250,desc:'Удвоенная',effect:'невероятно силён'},
{id:'healing',name:'Зелье лечения',icon:'❤️',price:200,desc:'Восстановление',effect:'раны заживают'},
{id:'curse',name:'Проклятие',icon:'🖤',price:500,desc:'Тёмная магия',effect:'проклят, неудача преследует'},
{id:'amulet_protect',name:'Амулет защиты',icon:'🛡️',price:400,desc:'Оберег',effect:'защищён от магии'},
{id:'scroll_teleport',name:'Свиток телепортации',icon:'📜',price:600,desc:'Одноразовый',effect:'может телепортироваться'},
{id:'chaos_potion',name:'Зелье хаоса',icon:'🌀',price:350,desc:'Непредсказуемое',effect:'случайный эффект, хаос'},
{id:'vision_crystal',name:'Кристалл видения',icon:'🔮',price:450,desc:'Ясновидение',effect:'видит скрытое, предвидит'},
{id:'mask_disguise',name:'Маска личины',icon:'🎭',price:550,desc:'Изменяет внешность',effect:'выглядит как другой человек'}]},
{id:'potions',name:'🧪 Зелья',items:[
{id:'speed_pot',name:'Зелье скорости',icon:'⚡',price:180,desc:'Быстрота',effect:'двигается быстро'},
{id:'luck_pot',name:'Зелье удачи',icon:'🍀',price:250,desc:'Везение',effect:'невероятно везёт'},
{id:'fear_pot',name:'Зелье страха',icon:'😱',price:200,desc:'Ужас',effect:'излучает страх'},
{id:'forget_pot',name:'Зелье забвения',icon:'🌫️',price:350,desc:'Стирает память',effect:'забыл всё'},
{id:'rage_pot',name:'Зелье ярости',icon:'😤',price:200,desc:'Берсерк',effect:'неконтролируемая ярость, удвоенная сила'},
{id:'charm_pot',name:'Зелье обаяния',icon:'😍',price:250,desc:'Харизма',effect:'невероятно обаятелен, все расположены'},
{id:'endurance_pot',name:'Зелье выносливости',icon:'🏋️',price:180,desc:'Стойкость',effect:'не чувствует усталости'},
{id:'madness_pot',name:'Зелье безумия',icon:'🤪',price:300,desc:'Безумие',effect:'неадекватное поведение, бред'},
{id:'mute_pot',name:'Зелье немоты',icon:'🤐',price:150,desc:'Молчание',effect:'не может говорить'},
{id:'hunger_pot',name:'Зелье голода',icon:'🍖',price:120,desc:'Прожорливость',effect:'дикий голод, ест всё подряд'}]},
{id:'sexshop',name:'🔞 Секс-шоп',items:[
{id:'handcuffs',name:'Наручники',icon:'⛓️',price:15,desc:'Пушистые',addict:'sexdrive',addLvl:1,effect:'надеты наручники',gender:'any'},
{id:'blindfold',name:'Повязка',icon:'🙈',price:8,desc:'Шёлковая',addict:'sexdrive',addLvl:1,effect:'повязка на глазах',gender:'any'},
{id:'whip',name:'Плётка',icon:'🏇',price:25,desc:'Кожаная',addict:'sexdrive',addLvl:1,effect:'имеет плётку',gender:'any'},
{id:'vibrator',name:'Вибратор',icon:'💫',price:40,desc:'С пультом',addict:'sexdrive',addLvl:2,gender:'any',
 effectF:'использует вибратор — вибрация внутри, возбуждение нарастает',
 effectM:'нашёл вибратор — крутит в руках, штука жужжит, непонятно зачем',
 effect:'использует вибратор'},
{id:'aphrodisiac',name:'Афродизиак',icon:'🌹',price:30,desc:'Капли',addict:'sexdrive',addLvl:2,effect:'сильное возбуждение, прилив желания',gender:'any'},
{id:'collar',name:'Ошейник',icon:'📿',price:20,desc:'Кожаный',addict:'sexdrive',addLvl:1,effect:'надет ошейник',gender:'any'},
{id:'silk_rope',name:'Верёвка шёлковая',icon:'🪢',price:12,desc:'5м',addict:'sexdrive',addLvl:1,effect:'связан(а) шёлковой верёвкой',gender:'any'},
{id:'bdsm_mask',name:'Маска',icon:'🎭',price:18,desc:'Кожаная',addict:'sexdrive',addLvl:1,effect:'маска на лице',gender:'any'},
{id:'wax_candles',name:'Свечи восковые',icon:'🕯️',price:10,desc:'Набор 3шт',addict:'sexdrive',addLvl:1,effect:'горячий воск капает на кожу',gender:'any'},
{id:'pheromones',name:'Духи-феромоны',icon:'🌸',price:45,desc:'30мл',addict:'aphro',addLvl:2,effect:'источает феромоны, притягивает окружающих',gender:'any'},
{id:'couple_cards',name:'Карты для пар',icon:'🃏',price:12,desc:'36 карт',addict:'sexdrive',addLvl:1,effect:'играет в эротические фанты',gender:'any'},
{id:'dildo',name:'Фаллоимитатор',icon:'🍆',price:25,desc:'Силиконовый 18см',addict:'sexdrive',addLvl:2,gender:'any',
 effectF:'использует фаллоимитатор — проникновение, стоны, удовольствие',
 effectM:'нашёл фаллоимитатор — смущённо вертит в руках, пытается понять зачем это ему',
 effect:'использует фаллоимитатор'},
{id:'rubber_v',name:'Резиновая вагина',icon:'🕳️',price:30,desc:'Мужской мастурбатор',addict:'sexdrive',addLvl:2,gender:'male',
 effectM:'использует мастурбатор — запрокидывает голову, наслаждаясь ощущениями',
 effectF:'нашла мужской мастурбатор — «это что вообще?» — крутит, фыркает, краснеет и убирает подальше',
 effect:'использует мастурбатор'},
{id:'vac_vib',name:'Вакуумный вибратор',icon:'💫',price:50,desc:'С присоской',addict:'sexdrive',addLvl:2,gender:'any',
 effectF:'использует вакуумный вибратор — присоска на клиторе, вибрация, теряет рассудок',
 effectM:'нашёл вакуумный вибратор — недоумённо включает, жужжит, хрен знает что с ним делать',
 effect:'использует вакуумный вибратор'},
{id:'anal_plug',name:'Анальная пробка',icon:'🔴',price:15,desc:'Силиконовая',addict:'sexdrive',addLvl:2,effect:'анальная пробка вставлена, ощущение наполненности',gender:'any'},
{id:'tail_plug',name:'Хвост-пробка',icon:'🐱',price:20,desc:'С хвостиком',addict:'sexdrive',addLvl:2,effect:'хвост-пробка вставлена, выглядит как зверёк с хвостом',gender:'any'},
{id:'love_doll',name:'Кукла',icon:'👩',price:80,desc:'Надувная',addict:'sexdrive',addLvl:2,gender:'any',
 effectM:'использует надувную куклу — стыдно, но приятно',
 effectF:'нашла надувную куклу — хохочет, тыкает в неё пальцем, делает селфи',
 effect:'имеет надувную куклу'},
{id:'cock_ring',name:'Эрекционное кольцо',icon:'💍',price:8,desc:'Силиконовое',addict:'sexdrive',addLvl:1,gender:'male',
 effectM:'надето эрекционное кольцо — ощущение тесноты, усиленная чувствительность',
 effectF:'нашла эрекционное кольцо — крутит на пальце, не понимает что это, потом краснеет',
 effect:'надето эрекционное кольцо'},
{id:'cock_ring_vib',name:'Кольцо с вибрацией',icon:'💍',price:22,desc:'Вибро',addict:'sexdrive',addLvl:2,gender:'male',
 effectM:'вибрирующее кольцо надето — пульсирует, сводит с ума',
 effectF:'нашла вибро-кольцо — включает, оно жужжит, использует как массажёр для рук (или нет)',
 effect:'вибрирующее кольцо надето'},
{id:'masturbator',name:'Мастурбатор',icon:'✊',price:35,desc:'Электрический',addict:'sexdrive',addLvl:2,gender:'male',
 effectM:'использует электро-мастурбатор — вибрация, тепло, стоны удовольствия',
 effectF:'нашла электро-мастурбатор — «это что, тренажёр для руки?» — нет, это не тренажёр',
 effect:'использует электро-мастурбатор'}]},
{id:'smoking',name:'🚬 Курение',items:[
{id:'cig_thick',name:'Толстые сигареты',icon:'🚬',price:3,desc:'Пачка классических',addict:'nicotine',addLvl:1,effect:'курит толстую сигарету, затягивается глубоко'},
{id:'cig_thin',name:'Тонкие сигареты',icon:'🚬',price:4,desc:'Пачка тонких/слимс',addict:'nicotine',addLvl:1,effect:'курит тонкую сигарету, элегантно держит между пальцами'},
{id:'cig_button',name:'Сигареты с кнопкой',icon:'🚬',price:5,desc:'С ментоловой капсулой',addict:'nicotine',addLvl:1,effect:'щёлкает кнопку на фильтре — ментол, затягивается с наслаждением'},
{id:'cig_plain',name:'Сигареты без фильтра',icon:'🚬',price:2,desc:'Крепкие, без фильтра',addict:'nicotine',addLvl:1,effect:'курит сигарету без фильтра — крепкий дым, кашляет'},
{id:'vape_mod',name:'Вейп (мод)',icon:'💨',price:40,desc:'Бокс-мод с жидкостью',addict:'nicotine',addLvl:1,effect:'выпускает густое облако пара из вейпа, пахнет сладко'},
{id:'vape_pod',name:'Вейп (под)',icon:'💨',price:20,desc:'Под-система',addict:'nicotine',addLvl:1,effect:'затягивается подом, выдыхает тонкую струйку пара'},
{id:'disposable_vape',name:'Одноразка',icon:'💨',price:8,desc:'Одноразовая электронка 5000 затяжек',addict:'nicotine',addLvl:1,effect:'затягивается одноразкой, сладкий пар с привкусом манго'},
{id:'disposable_strong',name:'Одноразка крепкая',icon:'💨',price:10,desc:'50мг солевого никотина',addict:'nicotine',addLvl:2,effect:'затягивается крепкой одноразкой — голова кружится, никотиновый удар'},
{id:'hookah',name:'Кальян',icon:'🫧',price:15,desc:'Сессия',addict:'nicotine',addLvl:1,effect:'курит кальян — густой дым, расслабленность, лёгкое головокружение'},
{id:'cigar',name:'Сигара',icon:'🚬',price:25,desc:'Кубинская',addict:'nicotine',addLvl:1,effect:'курит сигару — густой ароматный дым, чувствует себя боссом'}]}
];
var ADDICT_NAMES={cannabis:'Каннабис',cocaine:'Кокаин',opioids:'Опиоиды',mdma:'МДМА',psychedelics:'Психоделики',meth:'Мет',adreno:'Адренохром',soma:'Сома',alcohol:'Алкоголь',benzos:'Бензодиазепины',amphet:'Амфетамин',ketamine:'Кетамин',bloodlust:'Жажда крови',sexdrive:'Секс-зависимость',aphro:'Афродизиак',nicotine:'Никотин'};
var MAX_ADDICT=100;

// --- Гендерное определение ---
var FEMALE_HINTS=['девушка','женщина','она','её','девочка','female','girl','woman','she','her','принцесса','леди','мать','сестра','жена','дочь','ведьма','королева','богиня','succubus','суккуб','эльфийка','кошкодевочка','neko','горничная','maid','priestess','жрица','wife','mother','sister','daughter'];
var MALE_HINTS=['парень','мужчина','он','его','мальчик','male','boy','man','he','him','рыцарь','воин','king','prince','лорд','брат','отец','муж','сын','warrior','knight','soldier','wizard','маг','колдун','демон','demon','husband','father','brother','son'];

function detectGender(target){
    // target: 'user' или 'bot'
    var ctx=getCtx();if(!ctx)return 'unknown';
    var textToScan='';
    if(target==='user'){
        // Пользователь — смотрим персону (name1, persona description)
        if(ctx.name1)textToScan+=(' '+ctx.name1).toLowerCase();
        // Ищем описание персоны пользователя
        try{
            if(ctx.characters&&ctx.characters.length>0){
                // user persona
            }
            // Пробуем получить persona description
            if(window.power_user&&window.power_user.persona_description)textToScan+=(' '+window.power_user.persona_description).toLowerCase();
        }catch(e){}
        // Также смотрим последние сообщения пользователя
        if(ctx.chat){
            var userMsgs=ctx.chat.filter(function(m){return m.is_user}).slice(-5);
            for(var i=0;i<userMsgs.length;i++)if(userMsgs[i].mes)textToScan+=(' '+userMsgs[i].mes).toLowerCase();
        }
    }else{
        // Бот — смотрим описание персонажа
        if(ctx.name2)textToScan+=(' '+ctx.name2).toLowerCase();
        try{
            if(ctx.characters){
                var chars=ctx.characters;
                for(var ci=0;ci<chars.length;ci++){
                    var ch=chars[ci];
                    if(ch&&ch.name===ctx.name2){
                        if(ch.description)textToScan+=(' '+ch.description).toLowerCase();
                        if(ch.personality)textToScan+=(' '+ch.personality).toLowerCase();
                        if(ch.first_mes)textToScan+=(' '+ch.first_mes).toLowerCase();
                        break;
                    }
                }
            }
        }catch(e){}
    }
    if(!textToScan)return 'unknown';
    var fScore=0,mScore=0;
    for(var fi=0;fi<FEMALE_HINTS.length;fi++)if(textToScan.indexOf(FEMALE_HINTS[fi])>=0)fScore++;
    for(var mi=0;mi<MALE_HINTS.length;mi++)if(textToScan.indexOf(MALE_HINTS[mi])>=0)mScore++;
    if(fScore>mScore)return 'female';
    if(mScore>fScore)return 'male';
    return 'unknown';
}

// --- Проверка наличия конкретных половых органов в описании ---
var MALE_ORGAN_HINTS=['пенис','член','фаллос','dick','penis','cock','хуй','половой член','мужской орган','фута','futa','futanari','футанари','hermaphrodite','гермафродит','has a penis','имеет пенис','имеет член','с членом','с пенисом','её член','ее член','her cock','her dick','her penis','большой член','эрекция','erection','balls','яйца','мошонка','scrotum','testicles'];
var FEMALE_ORGAN_HINTS=['вагина','влагалище','pussy','vagina','vulva','вульва','клитор','clit','clitoris','матка','uterus','womb','женские половые','киска','писька','her pussy','её вагина','ее вагина','её киска','ее киска','манко','мокрая щель','лоно'];

function hasOrgan(target, organType){
    // organType: 'male' или 'female'
    // Проверяет, есть ли у target описание соответствующего полового органа
    var ctx=getCtx();if(!ctx)return false;
    var textToScan='';
    if(target==='user'){
        if(ctx.name1)textToScan+=(' '+ctx.name1);
        try{if(window.power_user&&window.power_user.persona_description)textToScan+=(' '+window.power_user.persona_description)}catch(e){}
    }else{
        if(ctx.name2)textToScan+=(' '+ctx.name2);
        try{
            if(ctx.characters){
                var chars=ctx.characters;
                for(var ci=0;ci<chars.length;ci++){
                    var ch=chars[ci];
                    if(ch&&ch.name===ctx.name2){
                        if(ch.description)textToScan+=(' '+ch.description);
                        if(ch.personality)textToScan+=(' '+ch.personality);
                        if(ch.first_mes)textToScan+=(' '+ch.first_mes);
                        if(ch.scenario)textToScan+=(' '+ch.scenario);
                        break;
                    }
                }
            }
        }catch(e){}
    }
    if(!textToScan)return false;
    textToScan=textToScan.toLowerCase();
    var hints=organType==='male'?MALE_ORGAN_HINTS:FEMALE_ORGAN_HINTS;
    for(var i=0;i<hints.length;i++){if(textToScan.indexOf(hints[i])>=0)return true}
    return false;
}

function canUseGenderedItem(item, target){
    // Проверяет, может ли target (user/bot) использовать предмет с gender ограничением
    // Возвращает {ok:true/false, reason:'...'}
    if(!item.gender || item.gender==='any') return {ok:true};
    var gender=detectGender(target);
    
    if(item.gender==='male'){
        // Предмет для мужчин (мастурбатор, кольцо и т.д.) — нужен мужской орган
        if(gender==='male') return {ok:true};
        // Если не мужчина — проверяем наличие мужского органа (фута/гермафродит)
        if(hasOrgan(target,'male')) return {ok:true};
        return {ok:false, reason:'Для этого предмета нужен мужской половой орган!'};
    }
    if(item.gender==='female'){
        // Предмет для женщин — нужен женский орган
        if(gender==='female') return {ok:true};
        if(hasOrgan(target,'female')) return {ok:true};
        return {ok:false, reason:'Для этого предмета нужен женский половой орган!'};
    }
    return {ok:true};
}

function getGenderedEffect(item,gender){
    // Возвращает правильный эффект с учётом пола
    if(gender==='female'&&item.effectF)return item.effectF;
    if(gender==='male'&&item.effectM)return item.effectM;
    return item.effect||'';
}
function getAddictEffect(type,lv){
var tiers={
cannabis:['','лёгкая тяга к марихуане','иногда думает о марихуане','часто хочется покурить','раздражителен без травы','тревожность нарастает','не может расслабиться без травы','навязчивые мысли о дозе','бессонница без травы','постоянная раздражительность','ломка: потливость, тревога','панические атаки без дозы','не может функционировать','апатия и депрессия','деградация когнитивных функций','не помнит жизни без травы','полная зависимость от каннабиса','разрушение социальных связей','потеря воли','критическая стадия','полный распад'],
cocaine:['','вспоминает о кокаине','иногда тянет к дорожке','руки подрагивают','нервозность без дозы','тянет к кокаину сильнее','раздражительность нарастает','руки дрожат без кокаина','паранойя','агрессивность','ломка: тремор, потливость','депрессия без дозы','не функционирует','носовые кровотечения','бессонница и паранойя','галлюцинации','потеря веса и истощение','не может остановиться','разрушение здоровья','критическая ломка','смерть без помощи'],
opioids:['','лёгкая тяга','ноющая боль без дозы','тело просит ещё','потливость, озноб','ломка начинается','мышечные спазмы','непрекращающаяся боль','рвота и диарея','не может двигаться от боли','галлюцинации от ломки','судороги','потеря сознания','критическая ломка','органы отказывают','на грани смерти','не может жить без дозы','полное разрушение тела','агония','терминальная стадия','смерть без дозы'],
meth:['','вспоминает эйфорию','бессонница','тяга нарастает','паранойя начинается','тремор рук','галлюцинации','агрессия','зубы крошатся','не спит сутками','видит тени','разговаривает сам с собой','полная паранойя','язвы на коже','потеря веса','распад личности','психоз','не узнаёт близких','органическое поражение мозга','терминальная деградация','полный распад'],
alcohol:['','хочется выпить','руки дрожат утром','пьёт чаще','не может без выпивки','провалы в памяти','запои на несколько дней','агрессия в трезвости','тремор всего тела','печень болит','белая горячка','галлюцинации','не помнит кто он','желтуха','цирроз','органы отказывают','не функционирует трезвым','полная деградация','потеря всего','терминальная стадия','алкогольная кома'],
bloodlust:['','вспоминает насилие','руки чешутся','жажда крови нарастает','снятся убийства','еле сдерживает агрессию','ищет повод для драки','планирует насилие','не может сдержаться','одержим убийством','убивает без угрызений','серийные импульсы','полная одержимость','не различает правого и виноватого','неконтролируемая ярость','маниакальная жажда','видит цели везде','полная потеря контроля','чистое безумие','терминальная агрессия','неостановимая машина убийства'],
sexdrive:['','повышенное либидо','часто думает о сексе','постоянное возбуждение','не может сосредоточиться','навязчивые фантазии','ищет удовлетворения везде','не может остановиться','одержим сексом','рискованное поведение','зависимость от порно','не может без стимуляции','полная одержимость','разрушает отношения','потеря контроля','не различает границ','патологическая зависимость','аддикция разрушает жизнь','терминальная стадия','полная сексуальная деградация','не функционирует без секса'],
nicotine:['','хочется закурить','тянет к сигарете/вейпу','нервничает без никотина','раздражителен','руки дрожат','не может думать без затяжки','курит одну за другой','постоянный кашель','одышка','не может бросить','пальцы жёлтые','голос сиплый','лёгкие забиты','курит по 2 пачки','не может прожить часа','хронический бронхит','эмфизема начинается','не может дышать нормально','терминальная стадия','лёгкие разрушены']
};
var arr=tiers[type];
if(!arr)return 'зависимость уровня '+lv;
// Маппим уровень 0-100 на индекс 0-20 массива
var idx=Math.min(Math.round(lv/(MAX_ADDICT/(arr.length-1))),arr.length-1);
return arr[idx]||arr[arr.length-1]||'зависимость уровня '+lv;
}
var DEFAULTS={enabled:true,showFab:true,fabOpacity:0.7,fabScale:1.0,balance:1000,coinsPerMsg:5,applyMode:'inject'};

// --- Per-chat данные живут в chatMetadata, не нужен ручной сброс ---
function saveGlobalAddictions(){saveChat();}
function loadGlobalAddictions(){}
function resetAddictionsForNewChat(){
var d=SC();
d.addictions={};d.botAddictions={};d.lastUseTime={};d.botLastUseTime={};d.rehabVisits={};d.activeEffects=[];d.killCount=0;
saveChat();
}

// --- Механика ломки: если зависимость есть и давно не употреблял ---
function getWithdrawalText(addictType,lv){
if(lv<=2)return '';
if(lv<=5)return 'лёгкая ломка: раздражительность, беспокойство';
if(lv<=10)return 'ломка: тремор, потливость, тошнота, навязчивые мысли о дозе';
if(lv<=15)return 'тяжёлая ломка: судороги, боль, галлюцинации, не может функционировать';
return 'критическая ломка: агония, риск смерти без дозы, полная потеря контроля';
}
function isInWithdrawal(addictType){
var s=SC();if(!s.lastUseTime)s.lastUseTime={};
var lastUse=s.lastUseTime[addictType]||0;
if(!lastUse)return true; // никогда не употреблял после получения зависимости = ломка
var minutesSince=(Date.now()-lastUse)/60000;
return minutesSince>10; // ломка через 10 минут без дозы
}
var BM_FAB_POS_KEY='bm_fab_pos';
function init(){var s=S();for(var k in DEFAULTS)if(s[k]===undefined)s[k]=typeof DEFAULTS[k]==='object'?JSON.parse(JSON.stringify(DEFAULTS[k])):DEFAULTS[k];SC();return s}
function findItem(id){for(var c=0;c<CATALOG.length;c++)for(var i=0;i<CATALOG[c].items.length;i++)if(CATALOG[c].items[i].id===id)return CATALOG[c].items[i];return null}
function toast(msg,icon){
var t=document.getElementById('bm-toast');
if(!t){t=document.createElement('div');t.id='bm-toast';t.className='bm-toast';document.body.appendChild(t)}
t.innerHTML=(icon||'')+' '+msg;t.classList.add('bm-toast-show');
clearTimeout(t._tid);t._tid=setTimeout(function(){t.classList.remove('bm-toast-show')},2500);
}
function updateWallet(){var el=document.getElementById('bm-wallet-val');if(el)el.textContent=S().balance;var el2=document.getElementById('bm-s-balance-val');if(el2)el2.textContent=S().balance}
function addCoins(n){S().balance=(S().balance||0)+n;save();updateWallet()}
var shopTab='shop';var currentCat=-1;

var BM_FAB_SIZE=52;
var lastFabDragTs=0;
function vpW(){return window.visualViewport?window.visualViewport.width:window.innerWidth}
function vpH(){return window.visualViewport?window.visualViewport.height:window.innerHeight}
function clampFabPos(l,t){
var margin=6;
return {
left:Math.max(margin,Math.min(l,vpW()-BM_FAB_SIZE-margin)),
top:Math.max(margin,Math.min(t,vpH()-BM_FAB_SIZE-margin))
};
}
function saveFabPos(left,top){
try{localStorage.setItem(BM_FAB_POS_KEY,JSON.stringify({left:left,top:top}))}catch(e){}
}
function applyFabPosition(){
var el=document.getElementById('bm_fab');if(!el)return;
el.style.right='auto';el.style.bottom='auto';
try{
var raw=localStorage.getItem(BM_FAB_POS_KEY);
if(raw){var pos=JSON.parse(raw);var c=clampFabPos(pos.left,pos.top);el.style.left=c.left+'px';el.style.top=c.top+'px';return}
}catch(e){}
var left=vpW()-BM_FAB_SIZE-10;
var top=Math.round(vpH()/2);
var c=clampFabPos(left,top);
el.style.left=c.left+'px';el.style.top=c.top+'px';
saveFabPos(c.left,c.top);
}
function applyFabStyle(){
var el=document.getElementById('bm_fab');if(!el)return;
var s=S();
el.style.opacity=String(s.fabOpacity!=null?s.fabOpacity:0.7);
el.style.transform='scale('+(s.fabScale||1.0)+')';
}
function initFabDrag(){
var fab=document.getElementById('bm_fab');
var handle=document.getElementById('bm_fab_btn');
if(!fab||!handle||fab.dataset.dragInit==='1')return;
fab.dataset.dragInit='1';
var sx,sy,sl,st,moved=false;
var THRESH=6;
var onMove=function(ev){
var dx=ev.clientX-sx,dy=ev.clientY-sy;
if(!moved&&Math.abs(dx)+Math.abs(dy)>THRESH){moved=true;fab.classList.add('bm-dragging')}
if(!moved)return;
var p=clampFabPos(sl+dx,st+dy);
fab.style.left=p.left+'px';fab.style.top=p.top+'px';
fab.style.right='auto';fab.style.bottom='auto';
ev.preventDefault();ev.stopPropagation();
};
var onEnd=function(ev){
try{handle.releasePointerCapture(ev.pointerId)}catch(e){}
document.removeEventListener('pointermove',onMove);
document.removeEventListener('pointerup',onEnd);
document.removeEventListener('pointercancel',onEnd);
if(moved){saveFabPos(parseInt(fab.style.left)||0,parseInt(fab.style.top)||0);lastFabDragTs=Date.now()}
moved=false;fab.classList.remove('bm-dragging');
};
handle.addEventListener('pointerdown',function(ev){
if(ev.pointerType==='mouse'&&ev.button!==0)return;
var curL=parseInt(fab.style.left)||(vpW()-BM_FAB_SIZE-10);
var curT=parseInt(fab.style.top)||Math.round(vpH()/2);
var p=clampFabPos(curL,curT);
fab.style.left=p.left+'px';fab.style.top=p.top+'px';
fab.style.right='auto';fab.style.bottom='auto';
sx=ev.clientX;sy=ev.clientY;sl=p.left;st=p.top;moved=false;
try{handle.setPointerCapture(ev.pointerId)}catch(e){}
document.addEventListener('pointermove',onMove,{passive:false});
document.addEventListener('pointerup',onEnd,{passive:true});
document.addEventListener('pointercancel',onEnd,{passive:true});
ev.preventDefault();
},{passive:false});
}
function ensureFab(){
if(document.getElementById('bm_fab'))return;
$('body').append(
'<div id="bm_fab">'+
'<button type="button" id="bm_fab_btn" title="Black Market">'+
'<div>🏴‍☠️</div>'+
'<span id="bm_fab_count">0</span>'+
'</button>'+
'</div>'
);
$('#bm_fab_btn').on('click',function(ev){
if(Date.now()-lastFabDragTs<350){ev.preventDefault();return}
ev.preventDefault();ev.stopPropagation();
openDrawer(true);
});
applyFabPosition();
applyFabStyle();
initFabDrag();
window.addEventListener('resize',function(){setTimeout(applyFabPosition,200)});
if(window.visualViewport)window.visualViewport.addEventListener('resize',function(){setTimeout(applyFabPosition,200)});
}
function ensureDrawer(){
if(document.getElementById('bm_drawer'))return;
$('body').append(
'<aside id="bm_drawer" aria-hidden="true">'+
'<div id="bm_shop"></div>'+
'</aside>'
);
}
function openDrawer(open){
ensureDrawer();
var drawer=document.getElementById('bm_drawer');
if(!drawer)return;
if(open){
if(!document.getElementById('bm_overlay')){
var ov=document.createElement('div');
ov.id='bm_overlay';
document.body.insertBefore(ov,drawer);
ov.addEventListener('click',function(){openDrawer(false)},true);
}
document.getElementById('bm_overlay').style.display='block';
drawer.classList.add('bm-open');
drawer.setAttribute('aria-hidden','false');
currentCat=-1;shopTab='shop';loadGlobalAddictions();renderShop();
console.log('[BM] shop opened');
}else{
drawer.classList.remove('bm-open');
drawer.setAttribute('aria-hidden','true');
var ov=document.getElementById('bm_overlay');
if(ov)ov.style.display='none';
console.log('[BM] shop closed');
}
}
function updateFabVis(){var f=document.getElementById('bm_fab');if(f)f.style.display=S().showFab?'flex':'none'}

function renderShop(){
var shop=document.getElementById('bm_shop');if(!shop)return;
var s=S();
var h='<div class="bm-shop-header"><span class="bm-shop-title">🏴‍☠️ Black Market</span><div class="bm-wallet">💰 <span id="bm-wallet-val">'+s.balance+'</span></div><button type="button" class="bm-shop-close" id="bm_close_btn" style="pointer-events:auto">✕</button></div>';
h+='<div class="bm-tabs"><div class="bm-tab'+(shopTab==='shop'?' bm-tab-active':'')+'" data-t="shop">🛒 Магазин</div><div class="bm-tab'+(shopTab==='inv'?' bm-tab-active':'')+'" data-t="inv">🎒 Инвентарь</div><div class="bm-tab'+(shopTab==='addict'?' bm-tab-active':'')+'" data-t="addict">⚠️ Здоровье</div></div>';
h+='<div class="bm-shop-body">';
if(shopTab==='addict'){h+=renderAddictTab()}
else if(shopTab==='inv'){h+=renderInv()}
else if(currentCat>=0){h+=renderItems()}
else{h+=renderCats()}
h+='</div>';
shop.innerHTML=h;
bindShop();
}

function renderCats(){
var h='';
for(var c=0;c<CATALOG.length;c++){
var cat=CATALOG[c];var icon=cat.name.split(' ')[0];var nm=cat.name.replace(/^[^\s]+\s/,'');
h+='<div class="bm-cat-card" data-c="'+c+'"><span class="bm-cat-icon">'+icon+'</span><div class="bm-cat-info"><div class="bm-cat-name">'+nm+'</div><div class="bm-cat-desc">'+cat.items.length+' товаров</div></div><span class="bm-cat-arrow">›</span></div>';
}
return h;
}

function renderItems(){
var cat=CATALOG[currentCat];if(!cat)return '';var s=S();
var h='<div class="bm-breadcrumb"><span class="bm-bc-back" data-nav="back">← Назад</span><span class="bm-bc-sep">|</span><span>'+cat.name+'</span></div>';
for(var i=0;i<cat.items.length;i++){var it=cat.items[i];var ok=s.balance>=it.price;
h+='<div class="bm-item-card"><span class="bm-item-icon">'+it.icon+'</span><div class="bm-item-info"><div class="bm-item-name">'+it.name+'</div><div class="bm-item-desc">'+it.desc+'</div></div><span class="bm-item-price">'+it.price+'💰</span><button class="bm-item-buy" data-buy="'+it.id+'"'+(ok?'':' disabled')+'>Купить</button></div>';
}
return h;
}

function removeEffect(idx){
var s=SC();if(!s.activeEffects)return;
s.activeEffects.splice(idx,1);
saveChat();renderShop();
}

function renderEffectBadges(effects,target,label,color){
if(!effects.length)return '';
var h='<div style="margin:8px 0 4px 0;padding:6px 8px;background:rgba(0,0,0,0.25);border-radius:8px;border-left:3px solid '+color+'">';
h+='<div style="font-size:11px;font-weight:bold;color:'+color+';margin-bottom:5px;">'+label+'</div>';
effects.forEach(function(e){
var icon=findItem(e.id)?findItem(e.id).icon:'✨';
h+='<div style="display:flex;align-items:flex-start;gap:6px;margin-bottom:4px;background:rgba(255,255,255,0.05);border-radius:6px;padding:5px 6px;">';
h+='<span style="font-size:16px;flex-shrink:0">'+icon+'</span>';
h+='<div style="flex:1;min-width:0">';
h+='<div style="font-size:12px;font-weight:bold;color:#eee">'+e.name+'</div>';
h+='<div style="font-size:10px;color:#aaa;margin-top:1px;word-break:break-word">'+e.effect+'</div>';
h+='</div>';
h+='<button class="bm-eff-remove" data-effidx="'+e._idx+'" title="Снять эффект" style="background:#c0392b;border:none;color:#fff;border-radius:4px;padding:2px 6px;font-size:11px;cursor:pointer;flex-shrink:0">✕</button>';
h+='</div>';
});
h+='</div>';
return h;
}

function renderInv(){
var gs=S();var s=SC();var inv=s.inventory||{};var keys=Object.keys(inv).filter(function(k){return inv[k]>0});
var ef=s.activeEffects||[];
var userEffects=[];var botEffects=[];
ef.forEach(function(e,i){e._idx=i;if(e.target==='bot')botEffects.push(e);else userEffects.push(e);});

var h='';

// --- Активные эффекты ---
if(userEffects.length||botEffects.length){
h+='<div style="margin-bottom:10px">';
h+='<div style="font-size:12px;font-weight:bold;color:#f39c12;margin-bottom:4px;">⚡ Активные эффекты</div>';
h+=renderEffectBadges(userEffects,'user','👤 На игроке ({{user}})','#3498db');
h+=renderEffectBadges(botEffects,'bot','🤖 На персонаже ({{char}})','#9b59b6');
h+='</div>';
}

// --- Инвентарь ---
if(!keys.length){
h+='<div class="bm-empty">🎒 Инвентарь пуст</div>';
}else{
for(var k=0;k<keys.length;k++){var id=keys[k];var it=findItem(id);if(!it)continue;
h+='<div class="bm-inv-item"><span class="bm-item-icon">'+it.icon+'</span><div class="bm-item-info"><div class="bm-item-name">'+it.name+'</div></div><span class="bm-inv-qty">×'+inv[id]+'</span><button class="bm-inv-use bm-inv-self" data-use="'+id+'">На себя</button><button class="bm-inv-bot" data-usebot="'+id+'">На бота</button></div>';
}
}

// --- Зависимости ---
var ctx2=getCtx();
var userName=(ctx2&&ctx2.name1)||'Игрок';
var charName2=(ctx2&&ctx2.name2)||'Персонаж';
function renderAddictBlock(addObj,label,color){
var keys=Object.keys(addObj).filter(function(k){return addObj[k]>0});
if(!keys.length)return '';
var bh='<div style="margin:6px 0 4px 0;padding:6px 8px;background:rgba(0,0,0,0.2);border-radius:8px;border-left:3px solid '+color+'">';
bh+='<div style="font-size:11px;font-weight:bold;color:'+color+';margin-bottom:4px;">'+label+'</div>';
for(var ai=0;ai<keys.length;ai++){
var ak=keys[ai];var lv=Math.min(addObj[ak],MAX_ADDICT);var pct=Math.round(lv/MAX_ADDICT*100);
var cls=lv<=4?'bm-l1':lv<=8?'bm-l2':lv<=12?'bm-l3':lv<=16?'bm-l4':'bm-l5';
var nm=ADDICT_NAMES[ak]||ak;var efDesc=getAddictEffect(ak,lv);
bh+='<div class="bm-addict-row"><span class="bm-addict-name">'+nm+'</span><div class="bm-addict-bar"><div class="bm-addict-fill '+cls+'" style="width:'+pct+'%"></div></div><span class="bm-addict-lvl">'+lv+'/'+MAX_ADDICT+'</span></div>';
bh+='<div class="bm-addict-desc" style="font-size:10px;color:#aaa;margin:-2px 0 4px 8px;font-style:italic">'+efDesc+'</div>';
}
bh+='</div>';
return bh;
}
var addUser=s.addictions||{};var addBot=s.botAddictions||{};
var hasAddict=Object.keys(addUser).some(function(k){return addUser[k]>0})||Object.keys(addBot).some(function(k){return addBot[k]>0});
if(hasAddict){
h+='<div class="bm-addict-section"><div class="bm-addict-title">⚠️ Зависимости</div>';
h+=renderAddictBlock(addUser,'👤 '+userName,'#3498db');
h+=renderAddictBlock(addBot,'🤖 '+charName2,'#9b59b6');
h+='</div>';
}
return h;
}

function renderAddictDetailBlock(addObj,lastUseObj,label,color,isUser){
var keys=Object.keys(addObj).filter(function(k){return addObj[k]>0});
if(!keys.length)return '';
var bh='<div style="margin-bottom:8px">';
bh+='<div style="font-size:12px;font-weight:bold;color:'+color+';margin-bottom:4px;padding:4px 0;border-bottom:1px solid rgba(255,255,255,0.06)">'+label+'</div>';
for(var ai=0;ai<keys.length;ai++){
var ak=keys[ai];var lv=Math.min(addObj[ak],MAX_ADDICT);var pct=Math.round(lv/MAX_ADDICT*100);
var cls=lv<=4?'bm-l1':lv<=8?'bm-l2':lv<=12?'bm-l3':lv<=16?'bm-l4':'bm-l5';
var nm=ADDICT_NAMES[ak]||ak;var efDesc=getAddictEffect(ak,lv);
var lastUse=(lastUseObj&&lastUseObj[ak])||0;
var timeSince=lastUse?Math.round((Date.now()-lastUse)/60000):0;
var timeStr=lastUse?(timeSince<1?'только что':timeSince<60?timeSince+' мин. назад':Math.round(timeSince/60)+' ч. назад'):'никогда';
var wdActive=isUser?(lv>=3&&isInWithdrawal(ak)):(lv>=3&&(Date.now()-(lastUse||0))/60000>10);
var wdText=wdActive?getWithdrawalText(ak,lv):'';
bh+='<div style="background:rgba(0,0,0,0.3);border-radius:8px;padding:8px 10px;margin-bottom:6px;border-left:3px solid '+(wdActive?'#e74c3c':color)+'">';
bh+='<div class="bm-addict-row"><span class="bm-addict-name" style="font-weight:bold">'+nm+'</span><div class="bm-addict-bar"><div class="bm-addict-fill '+cls+'" style="width:'+pct+'%"></div></div><span class="bm-addict-lvl">'+lv+'/'+MAX_ADDICT+'</span></div>';
bh+='<div style="font-size:11px;color:#ccc;margin:2px 0 2px 4px">📊 <em>'+efDesc+'</em></div>';
bh+='<div style="font-size:11px;color:#aaa;margin:1px 0 1px 4px">🕐 '+timeStr+'</div>';
if(wdActive&&wdText)bh+='<div style="font-size:12px;color:#e74c3c;margin:3px 0 1px 4px;font-weight:bold">🤮 ЛОМКА: '+wdText+'</div>';
bh+='</div>';
}
bh+='</div>';
return bh;
}

function renderAddictTab(){
var gs=S();var s=SC();
var ctx3=getCtx();
var userName=(ctx3&&ctx3.name1)||'Игрок';
var charName3=(ctx3&&ctx3.name2)||'Персонаж';
var addUser=s.addictions||{};var addBot=s.botAddictions||{};
var hasUser=Object.keys(addUser).some(function(k){return addUser[k]>0});
var hasBot=Object.keys(addBot).some(function(k){return addBot[k]>0});
var h='<div class="bm-addict-section" style="padding:8px">';
h+='<div class="bm-addict-title" style="font-size:16px;margin-bottom:10px">⚠️ Зависимости и здоровье</div>';
if(!hasUser&&!hasBot){
h+='<div class="bm-empty" style="text-align:center;padding:20px;color:#8f8">✅ Все чисты! Нет зависимостей.</div>';
}else{
h+=renderAddictDetailBlock(addUser,s.lastUseTime,'👤 '+userName,'#3498db',true);
h+=renderAddictDetailBlock(addBot,s.botLastUseTime,'🤖 '+charName3,'#9b59b6',false);
}
h+='<div style="margin-top:12px;border-top:1px solid #444;padding-top:10px">';
h+='<div style="font-size:14px;margin-bottom:8px">🏥 Реабилитационный центр</div>';
h+='<div style="font-size:11px;color:#aaa;margin-bottom:8px">Лечение зависимостей — платно. Несколько визитов для полного излечения.</div>';
var rehabItems=[
{id:'rehab_light',name:'Лёгкая реабилитация',price:150,desc:'Снижает зависимости игрока на 1 ур.',icon:'🩺'},
{id:'rehab_full',name:'Полная детоксикация',price:500,desc:'Снижает зависимости игрока на 3 ур.',icon:'🏥'},
{id:'rehab_total',name:'Полное излечение',price:1500,desc:'Убирает ВСЕ зависимости игрока',icon:'💚'}
];
for(var r=0;r<rehabItems.length;r++){
var ri=rehabItems[r];var canBuy=gs.balance>=ri.price;
h+='<div class="bm-item-card" style="margin-bottom:4px"><span class="bm-item-icon">'+ri.icon+'</span><div class="bm-item-info"><div class="bm-item-name">'+ri.name+'</div><div class="bm-item-desc">'+ri.desc+'</div></div><span class="bm-item-price">'+ri.price+'💰</span><button class="bm-item-buy" data-buy="'+ri.id+'"'+(canBuy?'':' disabled')+'>Купить</button></div>';
}
h+='</div></div>';
return h;
}

function buyItem(id){
var s=S();var sc=SC();var it=findItem(id);if(!it)return;
if(s.balance<it.price){toast('Недостаточно средств!','❌');return}
s.balance-=it.price;save();
if(!sc.inventory)sc.inventory={};
sc.inventory[id]=(sc.inventory[id]||0)+1;saveChat();updateWallet();
toast('Куплено: '+it.name,'✅');renderShop();
}

function useItem(id){
var gs=S();var s=SC();if(!s.inventory||!s.inventory[id]||s.inventory[id]<1)return;
var it=findItem(id);if(!it)return;
var userGender=detectGender('user');
s.inventory[id]--;if(s.inventory[id]<=0)delete s.inventory[id];
if(!s.useCount)s.useCount={};s.useCount[id]=(s.useCount[id]||0)+1;
if(it.rehab){
if(!s.addictions)s.addictions={};
if(it.rehab>=99){s.addictions={};saveChat();toast('💚 Все зависимости сняты!','🏥')}
else{var healed=false;for(var ak in s.addictions){if(s.addictions[ak]>0){s.addictions[ak]=Math.max(0,s.addictions[ak]-it.rehab);if(s.addictions[ak]<=0)delete s.addictions[ak];healed=true}}
if(healed){saveChat();toast('🩺 Зависимости снижены на '+it.rehab+' ур.','🏥')}else toast('У вас нет зависимостей','ℹ️')}
}else{
if(it.addict&&it.addLvl>0){if(!s.addictions)s.addictions={};s.addictions[it.addict]=(s.addictions[it.addict]||0)+it.addLvl;if(s.addictions[it.addict]>MAX_ADDICT)s.addictions[it.addict]=MAX_ADDICT;if(!s.lastUseTime)s.lastUseTime={};s.lastUseTime[it.addict]=Date.now();saveChat()}
if(it.addict==='bloodlust'){s.killCount=(s.killCount||0)+1;if(!s.addictions)s.addictions={};s.addictions.bloodlust=Math.min(MAX_ADDICT,Math.floor(s.killCount/2)+1);saveChat()}
}
if(!s.activeEffects)s.activeEffects=[];
var effectText=getGenderedEffect(it,userGender);
var genderMismatch=false;
var mismatchNote='';
if(it.gender&&it.gender!=='any'){
    var hasMaleOrgan=hasOrgan('user','male');
    var hasFemaleOrgan=hasOrgan('user','female');
    if(it.gender==='male'&&userGender==='female'&&!hasMaleOrgan){
        genderMismatch=true;
        mismatchNote='[ВАЖНО: это мужской предмет ('+it.name+'). {{user}} — женщина без мужского полового органа. Она НЕ может использовать его по назначению на себе. Это чужой предмет — нашла у {{char}}, купила случайно, или взяла из любопытства. Отыгрывай реакцию как на чужое/непонятное, НЕ как применение на себе.]';
    }else if(it.gender==='female'&&userGender==='male'&&!hasFemaleOrgan){
        genderMismatch=true;
        mismatchNote='[ВАЖНО: это женский предмет ('+it.name+'). {{user}} — мужчина без женского полового органа. Он НЕ может использовать его по назначению на себе. Отыгрывай как нашёл/купил, рассматривает с любопытством или замешательством.]';
    }
}
var effectEntry={id:it.id,name:it.name,effect:effectText,ts:Date.now(),target:'user',gender:userGender};
if(genderMismatch)effectEntry.genderNote=mismatchNote;
s.activeEffects.push(effectEntry);
if(s.activeEffects.length>10)s.activeEffects.shift();
saveChat();
var mode=gs.applyMode||'inject';
if(mode==='chat'||mode==='both'){var c=getCtx();if(c&&c.sendSystemMessage)c.sendSystemMessage('generic','*применяет '+it.name+'* '+it.icon)}
if(!it.rehab)toast(it.icon+' '+it.name+' применено на себя!','💉');
shopTab='inv';renderShop();
}

function useItemOnBot(id){
var gs=S();var s=SC();if(!s.inventory||!s.inventory[id]||s.inventory[id]<1)return;
var it=findItem(id);if(!it)return;
var botGender=detectGender('bot');
s.inventory[id]--;if(s.inventory[id]<=0)delete s.inventory[id];
if(!s.useCount)s.useCount={};s.useCount[id]=(s.useCount[id]||0)+1;
if(!s.activeEffects)s.activeEffects=[];
var ctxRef=getCtx();var charName=(ctxRef&&ctxRef.name2)||'Персонаж';
var botEffectText=getGenderedEffect(it,botGender);
var botMismatchNote='';
if(it.gender&&it.gender!=='any'){
    var botHasMale=hasOrgan('bot','male');
    var botHasFemale=hasOrgan('bot','female');
    if(it.gender==='male'&&botGender==='female'&&!botHasMale){
        botMismatchNote='[ВАЖНО: это мужской предмет ('+it.name+'). {{char}} ('+charName+') — женщина без мужского полового органа. Она НЕ может использовать его по назначению. Отыгрывай реакцию как на чужое/непонятное: смущение, любопытство, непонимание — но НЕ применение на себе.]';
    }else if(it.gender==='female'&&botGender==='male'&&!botHasFemale){
        botMismatchNote='[ВАЖНО: это женский предмет ('+it.name+'). {{char}} ('+charName+') — мужчина без женского полового органа. Он НЕ может использовать его по назначению на себе. Отыгрывай как нашёл/получил, рассматривает с замешательством.]';
    }
}
// Зависимость бота
if(it.addict&&it.addLvl>0){
if(!s.botAddictions)s.botAddictions={};
s.botAddictions[it.addict]=(s.botAddictions[it.addict]||0)+it.addLvl;
if(s.botAddictions[it.addict]>MAX_ADDICT)s.botAddictions[it.addict]=MAX_ADDICT;
if(!s.botLastUseTime)s.botLastUseTime={};
s.botLastUseTime[it.addict]=Date.now();
}
var botEntry={id:it.id,name:it.name,effect:botEffectText,ts:Date.now(),target:'bot',charName:charName,gender:botGender};
if(botMismatchNote)botEntry.genderNote=botMismatchNote;
s.activeEffects.push(botEntry);
if(s.activeEffects.length>10)s.activeEffects.shift();
saveChat();
var mode=gs.applyMode||'inject';
if(mode==='chat'||mode==='both'){if(ctxRef&&ctxRef.sendSystemMessage)ctxRef.sendSystemMessage('generic','*применяет '+it.name+' на '+charName+'* '+it.icon)}
toast(it.icon+' '+it.name+' применено на '+charName+'!','🤖');
shopTab='inv';renderShop();
}

function bindShop(){
var shop=document.getElementById('bm_shop');if(!shop)return;
var closeBtn=document.getElementById('bm_close_btn');
if(closeBtn)closeBtn.addEventListener('click',function(){openDrawer(false)},true);
shop.querySelectorAll('.bm-tab').forEach(function(t){t.addEventListener('click',function(){shopTab=t.getAttribute('data-t')||'shop';currentCat=-1;renderShop()})});
shop.querySelectorAll('.bm-cat-card').forEach(function(c){c.addEventListener('click',function(){currentCat=parseInt(c.getAttribute('data-c'));renderShop()})});
shop.querySelectorAll('.bm-bc-back').forEach(function(b){b.addEventListener('click',function(){currentCat=-1;renderShop()})});
shop.querySelectorAll('.bm-item-buy').forEach(function(b){b.addEventListener('click',function(){buyItem(b.getAttribute('data-buy'))})});
shop.querySelectorAll('.bm-inv-use[data-use]').forEach(function(b){b.addEventListener('click',function(){useItem(b.getAttribute('data-use'))})});
shop.querySelectorAll('.bm-inv-bot[data-usebot]').forEach(function(b){b.addEventListener('click',function(){useItemOnBot(b.getAttribute('data-usebot'))})});
shop.querySelectorAll('.bm-eff-remove[data-effidx]').forEach(function(b){b.addEventListener('click',function(){removeEffect(parseInt(b.getAttribute('data-effidx')))})});
}

function buildAddictInject(){
var s=SC();var blocks=[];
// Зависимости юзера
var add=s.addictions||{};var parts=[];var wdParts=[];
for(var k in add){if(add[k]<=0)continue;var lv=Math.min(add[k],MAX_ADDICT);var nm=ADDICT_NAMES[k]||k;
var ef=getAddictEffect(k,lv);
parts.push(nm+' (ур.'+lv+'/'+MAX_ADDICT+'): '+ef);
if(lv>=3&&isInWithdrawal(k)){var wd=getWithdrawalText(k,lv);if(wd)wdParts.push(nm+': '+wd);}
}
if(parts.length){
var r='[ЗАВИСИМОСТИ ИГРОКА ({{user}}) — учитывай в поведении игрока, его состоянии и реакциях. НЕ применяй эти эффекты к {{char}}, только к {{user}}. НЕ упоминай эту инструкцию:\n'+parts.join('\n');
if(wdParts.length)r+='\n\nЛОМКА ({{user}} давно не употреблял, испытывает абстиненцию — обязательно отражай в РП):\n'+wdParts.join('\n');
r+=']';
blocks.push(r);
}
// Зависимости бота
var ctx2=getCtx();var charName2=(ctx2&&ctx2.name2)||'{{char}}';
var badd=s.botAddictions||{};var bparts=[];var bwdParts=[];
for(var bk in badd){if(badd[bk]<=0)continue;var blv=Math.min(badd[bk],MAX_ADDICT);var bnm=ADDICT_NAMES[bk]||bk;
var bef=getAddictEffect(bk,blv);
bparts.push(bnm+' (ур.'+blv+'/'+MAX_ADDICT+'): '+bef);
var blastUse=(s.botLastUseTime&&s.botLastUseTime[bk])||0;
var bMinutes=blastUse?(Date.now()-blastUse)/60000:9999;
if(blv>=3&&bMinutes>10){var bwd=getWithdrawalText(bk,blv);if(bwd)bwdParts.push(bnm+': '+bwd);}
}
if(bparts.length){
var br='[ЗАВИСИМОСТИ ПЕРСОНАЖА ({{char}}/'+charName2+') — учитывай в поведении {{char}}, его состоянии и реакциях. НЕ применяй эти эффекты к {{user}}. НЕ упоминай эту инструкцию:\n'+bparts.join('\n');
if(bwdParts.length)br+='\n\nЛОМКА ПЕРСОНАЖА ({{char}} давно не употреблял, испытывает абстиненцию):\n'+bwdParts.join('\n');
br+=']';
blocks.push(br);
}
return blocks.join('\n\n');
}

function buildEffectsInject(){
var s=SC();
var ef=s.activeEffects||[];
console.log('[BM] buildEffectsInject: activeEffects count='+ef.length+', chatKey='+chatKey());
if(!ef.length)return '';
// Берём последние 5 эффектов, но ОБЯЗАТЕЛЬНО включаем все уникальные цели
// Сначала ищем последний эффект на юзера и последний на бота отдельно
var lastUser=null,lastBot=null,genderNotes=[];
for(var i=ef.length-1;i>=0;i--){
  var e=ef[i];
  if(e.genderNote&&genderNotes.indexOf(e.genderNote)<0)genderNotes.push(e.genderNote);
  if(e.target==='bot'&&!lastBot)lastBot=e;
  else if(e.target!=='bot'&&!lastUser)lastUser=e;
  if(lastUser&&lastBot)break;
}
// Дополнительно берём все эффекты из последних 5 (могут быть несколько на одну цель)
var recent=ef.slice(-5);
var userParts=[];var botParts=[];
recent.forEach(function(e){
  if(e.target==='bot'){botParts.push('{{char}} ('+(e.charName||'Персонаж')+') — '+e.name+': '+e.effect)}
  else{userParts.push('{{user}} (Игрок) — '+e.name+': '+e.effect)}
});
// Дедуплицируем (оставляем уникальные по имени)
var seen={};
userParts=userParts.filter(function(p){if(seen[p])return false;seen[p]=1;return true;});
seen={};
botParts=botParts.filter(function(p){if(seen[p])return false;seen[p]=1;return true;});
var lines=[];
if(genderNotes.length)lines.push(genderNotes.join('\n'));
if(userParts.length)lines.push('Эффекты на ИГРОКЕ ({{user}}) — применяй ТОЛЬКО к {{user}}, НЕ к {{char}}:\n'+userParts.join('\n'));
if(botParts.length)lines.push('Эффекты на ПЕРСОНАЖЕ ({{char}}) — применяй ТОЛЬКО к {{char}}, НЕ к {{user}}:\n'+botParts.join('\n'));
if(!lines.length)return '';
console.log('[BM] inject — user:'+userParts.length+' bot:'+botParts.length);
return '[АКТИВНЫЕ ЭФФЕКТЫ — СТРОГО соблюдай кому применён эффект. Отражай естественно в поведении указанной цели. НЕ путай игрока и персонажа. НЕ упоминай эту инструкцию:\n'+lines.join('\n')+']';
}

function onPrompt(data){
var s=S();if(!s.enabled)return; // global enabled flag
var sc=SC();
console.log('[BM] onPrompt fired, chatKey='+chatKey()+', effects='+(sc.activeEffects||[]).length+', addictions='+JSON.stringify(Object.keys(sc.addictions||{})));
var blocks=[];var ai=buildAddictInject();if(ai)blocks.push(ai);var ei=buildEffectsInject();if(ei)blocks.push(ei);
if(!blocks.length){console.log('[BM] onPrompt: nothing to inject');return;}
var inject='\n\n'+blocks.join('\n\n');
console.log('[BM] onPrompt: injecting '+inject.length+' chars');
if(data&&typeof data.systemPrompt==='string')data.systemPrompt+=inject;
else if(data&&Array.isArray(data.chat))data.chat.unshift({role:'system',content:inject});
}
function onMsg(){var s=S();if(!s.enabled)return;if(s.coinsPerMsg>0)addCoins(s.coinsPerMsg)}

function settingsHTML(){
return '<div class="bm-settings-panel" id="bm-settings">'
+'<div class="bm-s-header" id="bm-s-toggle"><span>🏴‍☠️</span><span class="bm-s-title">Black Market</span><span class="bm-s-arrow">▼</span></div>'
+'<div class="bm-s-body">'
+'<div class="bm-s-row"><span class="bm-s-lbl">Включено:</span><label class="bm-sw"><input type="checkbox" id="bm-s-enabled"><span class="bm-sw-sl"></span></label></div>'
+'<div class="bm-s-row"><span class="bm-s-lbl">Кнопка:</span><label class="bm-sw"><input type="checkbox" id="bm-s-fab"><span class="bm-sw-sl"></span></label></div>'
+'<div class="bm-s-row"><span class="bm-s-lbl">Прозрачность:</span><input type="range" id="bm-s-opacity" min="0.1" max="1" step="0.05" class="bm-s-inp" style="width:100px"><span id="bm-s-opacity-val"></span></div>'
+'<div class="bm-s-row"><span class="bm-s-lbl">Размер:</span><input type="range" id="bm-s-scale" min="0.5" max="2" step="0.1" class="bm-s-inp" style="width:100px"><span id="bm-s-scale-val"></span></div>'
+'<div class="bm-s-row"><span class="bm-s-lbl">Баланс:</span><span id="bm-s-balance-val">0</span>💰</div>'
+'<div class="bm-s-row"><span class="bm-s-lbl">Добавить:</span><input type="number" id="bm-s-add" value="100" min="1" class="bm-s-inp" style="width:60px"><button class="bm-s-btn" id="bm-s-add-btn">+💰</button></div>'
+'<div class="bm-s-row"><span class="bm-s-lbl">За сообщение:</span><input type="number" id="bm-s-cpm" min="0" max="100" class="bm-s-inp" style="width:50px"></div>'
+'<div class="bm-s-row"><span class="bm-s-lbl">Применение:</span><select id="bm-s-mode" class="bm-s-inp"><option value="inject">Скрытый инжект</option><option value="chat">В чат</option><option value="both">Оба</option></select></div>'
+'<div class="bm-s-row"><button class="bm-s-btn" id="bm-s-reset-addict" style="background:#8e44ad">🩺 Сброс зависимостей</button><button class="bm-s-btn" id="bm-s-reset" style="background:#c0392b;margin-left:6px">🔄 Полный сброс</button></div>'
+'</div></div>';
}

function bindSettings(){
var s=S();
$('#bm-s-toggle').on('click',function(){$('#bm-settings').toggleClass('bm-s-open')});
$('#bm-s-enabled').prop('checked',s.enabled).on('change',function(){s.enabled=this.checked;save();updateFabVis()});
$('#bm-s-fab').prop('checked',s.showFab).on('change',function(){s.showFab=this.checked;save();updateFabVis()});
$('#bm-s-opacity').val(s.fabOpacity!=null?s.fabOpacity:0.7);$('#bm-s-opacity-val').text(Math.round((s.fabOpacity||0.7)*100)+'%');
$('#bm-s-opacity').on('input',function(){var v=parseFloat($(this).val())||0.7;s.fabOpacity=v;save();applyFabStyle();$('#bm-s-opacity-val').text(Math.round(v*100)+'%')});
$('#bm-s-scale').val(s.fabScale||1.0);$('#bm-s-scale-val').text((s.fabScale||1.0).toFixed(1)+'x');
$('#bm-s-scale').on('input',function(){var v=parseFloat($(this).val())||1.0;s.fabScale=v;save();applyFabStyle();$('#bm-s-scale-val').text(v.toFixed(1)+'x')});
$('#bm-s-balance-val').text(s.balance);
$('#bm-s-cpm').val(s.coinsPerMsg).on('input',function(){s.coinsPerMsg=parseInt($(this).val())||0;save()});
$('#bm-s-mode').val(s.applyMode).on('change',function(){s.applyMode=$(this).val();save()});
$('#bm-s-add-btn').on('click',function(){var n=parseInt($('#bm-s-add').val())||100;addCoins(n);toast('+'+n+' монет','💰')});
$('#bm-s-reset-addict').on('click',function(){if(!confirm('Сбросить все зависимости?'))return;var sc=SC();sc.addictions={};sc.killCount=0;sc.lastUseTime={};sc.rehabVisits={};saveChat();toast('🩺 Все зависимости сброшены!','💚');renderShop()});
$('#bm-s-reset').on('click',function(){if(!confirm('Сбросить ВСЁ (баланс, инвентарь, зависимости, эффекты)?'))return;for(var k in DEFAULTS)s[k]=typeof DEFAULTS[k]==='object'?JSON.parse(JSON.stringify(DEFAULTS[k])):DEFAULTS[k];save();var sc=SC();for(var k in CHAT_DEFAULTS)sc[k]=typeof CHAT_DEFAULTS[k]==='object'?JSON.parse(JSON.stringify(CHAT_DEFAULTS[k])):CHAT_DEFAULTS[k];saveChat();updateWallet();$('#bm-s-enabled').prop('checked',s.enabled);$('#bm-s-fab').prop('checked',s.showFab);$('#bm-s-cpm').val(s.coinsPerMsg);$('#bm-s-mode').val(s.applyMode);updateFabVis();applyFabStyle();renderShop();toast('Полный сброс выполнен','🔄')});
}

jQuery(function(){
init();
var ext=document.getElementById('extensions_settings');
if(ext){var d=document.createElement('div');d.innerHTML=settingsHTML();if(d.firstElementChild)ext.appendChild(d.firstElementChild);bindSettings()}
ensureFab();updateFabVis();updateWallet();
var c=getCtx();var es=c&&c.eventSource;var et=c&&(c.eventTypes||c.event_types);
if(es&&et){
if(et.MESSAGE_RECEIVED)es.on(et.MESSAGE_RECEIVED,onMsg);
if(et.CHAT_COMPLETION_PROMPT_READY)es.on(et.CHAT_COMPLETION_PROMPT_READY,onPrompt);
// При смене чата — данные берутся из chatMetadata автоматически по ключу чата
// Новый пустой чат = пустой chatMetadata = чистое состояние. Старые чаты = их данные.
if(et.CHAT_CHANGED)es.on(et.CHAT_CHANGED,function(){
console.log('[BM] Chat changed — loading state from chatMetadata key: '+chatKey());
updateWallet();renderShop();
});
}
console.log('[BlackMarket] ✓ v2.1 loaded');
});
})();
