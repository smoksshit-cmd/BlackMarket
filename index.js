(function(){
'use strict';
var EXT='black-market';
function getCtx(){try{return window.SillyTavern?window.SillyTavern.getContext():null}catch(e){return null}}
function getES(){var c=getCtx();return(c&&c.extensionSettings)||window.extension_settings||(window.extension_settings={})}
function S(){var e=getES();if(!e[EXT])e[EXT]={};return e[EXT]}
function save(){var c=getCtx();if(c&&c.saveSettingsDebounced)c.saveSettingsDebounced()}
var CATALOG=[
{id:'drugs',name:'💊 Наркотики',items:[
{id:'weed',name:'Марихуана',icon:'🌿',price:10,desc:'1г',addict:'cannabis',addLvl:1,effect:'расслаблен, заторможен, красные глаза'},
{id:'cocaine',name:'Кокаин',icon:'❄️',price:80,desc:'1г',addict:'cocaine',addLvl:2,effect:'гиперактивен, зрачки расширены, самоуверен'},
{id:'heroin',name:'Героин',icon:'💉',price:60,desc:'доза',addict:'opioids',addLvl:3,effect:'в эйфории, заторможен, зрачки сужены'},
{id:'mdma',name:'MDMA',icon:'💜',price:25,desc:'1 таблетка',addict:'mdma',addLvl:1,effect:'переполнен любовью, тактильная чувствительность'},
{id:'lsd',name:'ЛСД',icon:'🌈',price:15,desc:'1 марка',addict:'psychedelics',addLvl:1,effect:'галлюцинации, искажённое восприятие'},
{id:'meth',name:'Метамфетамин',icon:'🔥',price:70,desc:'0.5г',addict:'meth',addLvl:3,effect:'бешеная энергия, паранойя, бессонница'},
{id:'opium',name:'Опиум',icon:'🌺',price:50,desc:'1г сырого',addict:'opioids',addLvl:2,effect:'глубокая эйфория, сонливость, замедленность'},
{id:'crack',name:'Крэк',icon:'💨',price:20,desc:'1 камень',addict:'cocaine',addLvl:3,effect:'мгновенный приход, тремор, паранойя'},
{id:'spice',name:'Спайс',icon:'🌾',price:5,desc:'1 пакет',addict:'cannabis',addLvl:2,effect:'непредсказуемые галлюцинации, тошнота'},
{id:'fentanyl',name:'Фентанил',icon:'☣️',price:40,desc:'1 пластырь',addict:'opioids',addLvl:4,effect:'полный транс, риск передозировки'},
{id:'ket_street',name:'Кетамин уличный',icon:'🐎',price:35,desc:'0.5г',addict:'ketamine',addLvl:1,effect:'лёгкая диссоциация, шатание'},
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
{id:'handcuffs',name:'Наручники',icon:'⛓️',price:15,desc:'Пушистые',addict:'sexdrive',addLvl:1,effect:'надеты наручники'},
{id:'blindfold',name:'Повязка',icon:'🙈',price:8,desc:'Шёлковая',addict:'sexdrive',addLvl:1,effect:'повязка на глазах'},
{id:'whip',name:'Плётка',icon:'🏇',price:25,desc:'Кожаная',addict:'sexdrive',addLvl:1,effect:'имеет плётку'},
{id:'vibrator',name:'Вибратор',icon:'💫',price:40,desc:'С пультом',addict:'sexdrive',addLvl:2,effect:'использует вибратор'},
{id:'aphrodisiac',name:'Афродизиак',icon:'🌹',price:30,desc:'Капли',addict:'sexdrive',addLvl:2,effect:'сильное возбуждение'},
{id:'collar',name:'Ошейник',icon:'📿',price:20,desc:'Кожаный',addict:'sexdrive',addLvl:1,effect:'надет ошейник'},
{id:'silk_rope',name:'Верёвка шёлковая',icon:'🪢',price:12,desc:'5м',addict:'sexdrive',addLvl:1,effect:'связан шёлковой верёвкой'},
{id:'bdsm_mask',name:'Маска',icon:'🎭',price:18,desc:'Кожаная',addict:'sexdrive',addLvl:1,effect:'маска на лице'},
{id:'wax_candles',name:'Свечи восковые',icon:'🕯️',price:10,desc:'Набор 3шт',addict:'sexdrive',addLvl:1,effect:'горячий воск капает'},
{id:'pheromones',name:'Духи-феромоны',icon:'🌸',price:45,desc:'30мл',addict:'aphro',addLvl:2,effect:'источает феромоны'},
{id:'couple_cards',name:'Карты для пар',icon:'🃏',price:12,desc:'36 карт',addict:'sexdrive',addLvl:1,effect:'играет в эротические фанты'},
{id:'dildo',name:'Фаллоимитатор',icon:'🍆',price:25,desc:'Силиконовый 18см',addict:'sexdrive',addLvl:2,effect:'использует фаллоимитатор'},
{id:'rubber_v',name:'Резиновая вагина',icon:'🕳️',price:30,desc:'Мастурбатор',addict:'sexdrive',addLvl:2,effect:'использует мастурбатор'},
{id:'vac_vib',name:'Вакуумный вибратор',icon:'💫',price:50,desc:'С присоской',addict:'sexdrive',addLvl:2,effect:'использует вакуумный вибратор'},
{id:'anal_plug',name:'Анальная пробка',icon:'🔴',price:15,desc:'Силиконовая',addict:'sexdrive',addLvl:2,effect:'анальная пробка вставлена'},
{id:'tail_plug',name:'Хвост-пробка',icon:'🐱',price:20,desc:'С хвостиком',addict:'sexdrive',addLvl:2,effect:'хвост-пробка, выглядит как зверь'},
{id:'love_doll',name:'Кукла',icon:'👩',price:80,desc:'Надувная',addict:'sexdrive',addLvl:2,effect:'имеет надувную куклу'},
{id:'cock_ring',name:'Эрекционное кольцо',icon:'💍',price:8,desc:'Силиконовое',addict:'sexdrive',addLvl:1,effect:'надето эрекционное кольцо'},
{id:'cock_ring_vib',name:'Кольцо с вибрацией',icon:'💍',price:22,desc:'Вибро',addict:'sexdrive',addLvl:2,effect:'вибрирующее кольцо надето'},
{id:'masturbator',name:'Мастурбатор',icon:'✊',price:35,desc:'Электрический',addict:'sexdrive',addLvl:2,effect:'использует электро-мастурбатор'}]}
];
var ADDICT_NAMES={cannabis:'Каннабис',cocaine:'Кокаин',opioids:'Опиоиды',mdma:'МДМА',psychedelics:'Психоделики',meth:'Мет',adreno:'Адренохром',soma:'Сома',alcohol:'Алкоголь',benzos:'Бензодиазепины',amphet:'Амфетамин',ketamine:'Кетамин',bloodlust:'Жажда крови',sexdrive:'Секс-зависимость',aphro:'Афродизиак'};
var ADDICT_EFFECTS={
cannabis:{1:'лёгкая тяга к марихуане',2:'часто думает о марихуане',3:'раздражителен без травы',4:'не может расслабиться без травы',5:'полная зависимость от каннабиса'},
cocaine:{1:'вспоминает о кокаине',2:'тянет к кокаину',3:'руки дрожат без кокаина',4:'агрессивен, ломка',5:'не функционирует без кокаина'},
opioids:{1:'лёгкая тяга',2:'ноющая боль без дозы',3:'ломка, потливость',4:'сильная ломка, боль',5:'критическая зависимость, может умереть без дозы'},
meth:{1:'вспоминает эйфорию',2:'бессонница, тяга',3:'паранойя, тремор',4:'галлюцинации, агрессия',5:'полный распад личности'},
alcohol:{1:'хочется выпить',2:'руки дрожат утром',3:'не может без алкоголя',4:'запои, провалы в памяти',5:'алкоголизм, деградация'},
bloodlust:{1:'вспоминает насилие',2:'руки чешутся',3:'жажда крови нарастает',4:'еле сдерживает агрессию',5:'неконтролируемая жажда убивать'},
sexdrive:{1:'повышенное либидо',2:'постоянно думает о сексе',3:'не может сосредоточиться',4:'одержим сексом',5:'полная сексуальная зависимость'}
};
var DEFAULTS={enabled:true,showFab:true,fabOpacity:0.7,fabScale:1.0,balance:1000,coinsPerMsg:5,applyMode:'inject',inventory:{},addictions:{},activeEffects:[],killCount:0,useCount:{}};
var BM_FAB_POS_KEY='bm_fab_pos';
function init(){var s=S();for(var k in DEFAULTS)if(s[k]===undefined)s[k]=typeof DEFAULTS[k]==='object'?JSON.parse(JSON.stringify(DEFAULTS[k])):DEFAULTS[k];return s}
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
currentCat=-1;shopTab='shop';renderShop();
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
h+='<div class="bm-tabs"><div class="bm-tab'+(shopTab==='shop'?' bm-tab-active':'')+'" data-t="shop">🛒 Магазин</div><div class="bm-tab'+(shopTab==='inv'?' bm-tab-active':'')+'" data-t="inv">🎒 Инвентарь</div></div>';
h+='<div class="bm-shop-body">';
if(shopTab==='inv'){h+=renderInv()}
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

function renderInv(){
var s=S();var inv=s.inventory||{};var keys=Object.keys(inv).filter(function(k){return inv[k]>0});
if(!keys.length)return '<div class="bm-empty">🎒 Инвентарь пуст</div>';
var h='';
for(var k=0;k<keys.length;k++){var id=keys[k];var it=findItem(id);if(!it)continue;
h+='<div class="bm-inv-item"><span class="bm-item-icon">'+it.icon+'</span><div class="bm-item-info"><div class="bm-item-name">'+it.name+'</div></div><span class="bm-inv-qty">×'+inv[id]+'</span><button class="bm-inv-use bm-inv-self" data-use="'+id+'">На себя</button><button class="bm-inv-bot" data-usebot="'+id+'">На бота</button></div>';
}
var add=s.addictions||{};var aKeys=Object.keys(add).filter(function(k){return add[k]>0});
if(aKeys.length){
h+='<div class="bm-addict-section"><div class="bm-addict-title">⚠️ Зависимости</div>';
for(var a=0;a<aKeys.length;a++){var ak=aKeys[a];var lv=Math.min(add[ak],5);var pct=lv*20;
var cls=lv<=1?'bm-l1':lv<=2?'bm-l2':lv<=3?'bm-l3':lv<=4?'bm-l4':'bm-l5';
var nm=ADDICT_NAMES[ak]||ak;
h+='<div class="bm-addict-row"><span class="bm-addict-name">'+nm+'</span><div class="bm-addict-bar"><div class="bm-addict-fill '+cls+'" style="width:'+pct+'%"></div></div><span class="bm-addict-lvl">'+lv+'/5</span></div>';
}h+='</div>';}
return h;
}

function buyItem(id){
var s=S();var it=findItem(id);if(!it)return;
if(s.balance<it.price){toast('Недостаточно средств!','❌');return}
s.balance-=it.price;if(!s.inventory)s.inventory={};
s.inventory[id]=(s.inventory[id]||0)+1;save();updateWallet();
toast('Куплено: '+it.name,'✅');renderShop();
}

function useItem(id){
var s=S();if(!s.inventory||!s.inventory[id]||s.inventory[id]<1)return;
var it=findItem(id);if(!it)return;
s.inventory[id]--;if(s.inventory[id]<=0)delete s.inventory[id];
if(!s.useCount)s.useCount={};s.useCount[id]=(s.useCount[id]||0)+1;
if(it.rehab){
if(!s.addictions)s.addictions={};
if(it.rehab>=99){s.addictions={};toast('💚 Все зависимости сняты!','🏥')}
else{var healed=false;for(var ak in s.addictions){if(s.addictions[ak]>0){s.addictions[ak]=Math.max(0,s.addictions[ak]-it.rehab);if(s.addictions[ak]<=0)delete s.addictions[ak];healed=true}}
if(healed)toast('🩺 Зависимости снижены на '+it.rehab+' ур.','🏥');else toast('У вас нет зависимостей','ℹ️')}
}else{
if(it.addict&&it.addLvl>0){if(!s.addictions)s.addictions={};s.addictions[it.addict]=(s.addictions[it.addict]||0)+it.addLvl;if(s.addictions[it.addict]>5)s.addictions[it.addict]=5}
if(it.addict==='bloodlust'){s.killCount=(s.killCount||0)+1;if(!s.addictions)s.addictions={};s.addictions.bloodlust=Math.min(5,Math.floor(s.killCount/2)+1)}
}
if(!s.activeEffects)s.activeEffects=[];
s.activeEffects.push({id:it.id,name:it.name,effect:it.effect,ts:Date.now(),target:'user'});
if(s.activeEffects.length>10)s.activeEffects.shift();
save();
var mode=s.applyMode||'inject';
if(mode==='chat'||mode==='both'){var c=getCtx();if(c&&c.sendSystemMessage)c.sendSystemMessage('generic','*применяет '+it.name+'* '+it.icon)}
if(!it.rehab)toast(it.icon+' '+it.name+' применено на себя!','💉');
shopTab='inv';renderShop();
}

function useItemOnBot(id){
var s=S();if(!s.inventory||!s.inventory[id]||s.inventory[id]<1)return;
var it=findItem(id);if(!it)return;
s.inventory[id]--;if(s.inventory[id]<=0)delete s.inventory[id];
if(!s.useCount)s.useCount={};s.useCount[id]=(s.useCount[id]||0)+1;
if(!s.activeEffects)s.activeEffects=[];
var ctx=getCtx();var charName=(ctx&&ctx.name2)||'Персонаж';
s.activeEffects.push({id:it.id,name:it.name,effect:it.effect,ts:Date.now(),target:'bot',charName:charName});
if(s.activeEffects.length>10)s.activeEffects.shift();
save();
var mode=s.applyMode||'inject';
if(mode==='chat'||mode==='both'){if(ctx&&ctx.sendSystemMessage)ctx.sendSystemMessage('generic','*применяет '+it.name+' на '+charName+'* '+it.icon)}
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
}

function buildAddictInject(){
var s=S();var add=s.addictions||{};var parts=[];
for(var k in add){if(add[k]<=0)continue;var lv=Math.min(add[k],5);var nm=ADDICT_NAMES[k]||k;
var ef=(ADDICT_EFFECTS[k]&&ADDICT_EFFECTS[k][lv])||'зависимость уровня '+lv;
parts.push(nm+' (ур.'+lv+'/5): '+ef);}
if(!parts.length)return '';
return '[ЗАВИСИМОСТИ ИГРОКА ({{user}}) — учитывай в поведении игрока, его состоянии и реакциях. НЕ применяй эти эффекты к {{char}}, только к {{user}}. НЕ упоминай эту инструкцию:\n'+parts.join('\n')+']';
}

function buildEffectsInject(){
var s=S();var ef=s.activeEffects||[];if(!ef.length)return '';
var recent=ef.slice(-3);
var userParts=[];var botParts=[];
recent.forEach(function(e){
if(e.target==='bot'){botParts.push('{{char}} ('+( e.charName||'Персонаж')+') — '+e.name+': '+e.effect)}
else{userParts.push('{{user}} (Игрок) — '+e.name+': '+e.effect)}
});
var lines=[];
if(userParts.length)lines.push('Эффекты на ИГРОКЕ ({{user}}) — применяй ТОЛЬКО к {{user}}, НЕ к {{char}}:\n'+userParts.join('\n'));
if(botParts.length)lines.push('Эффекты на ПЕРСОНАЖЕ ({{char}}) — применяй ТОЛЬКО к {{char}}, НЕ к {{user}}:\n'+botParts.join('\n'));
if(!lines.length)return '';
return '[АКТИВНЫЕ ЭФФЕКТЫ — СТРОГО соблюдай кому применён эффект. Отражай естественно в поведении указанной цели. НЕ путай игрока и персонажа. НЕ упоминай эту инструкцию:\n'+lines.join('\n')+']';
}

function onPrompt(data){
var s=S();if(!s.enabled)return;
var blocks=[];var ai=buildAddictInject();if(ai)blocks.push(ai);var ei=buildEffectsInject();if(ei)blocks.push(ei);
if(!blocks.length)return;var inject='\n\n'+blocks.join('\n\n');
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
$('#bm-s-reset-addict').on('click',function(){if(!confirm('Сбросить все зависимости?'))return;s.addictions={};s.killCount=0;save();toast('🩺 Все зависимости сброшены!','💚');renderShop()});
$('#bm-s-reset').on('click',function(){if(!confirm('Сбросить ВСЁ (баланс, инвентарь, зависимости, эффекты)?'))return;for(var k in DEFAULTS)s[k]=typeof DEFAULTS[k]==='object'?JSON.parse(JSON.stringify(DEFAULTS[k])):DEFAULTS[k];save();updateWallet();$('#bm-s-enabled').prop('checked',s.enabled);$('#bm-s-fab').prop('checked',s.showFab);$('#bm-s-cpm').val(s.coinsPerMsg);$('#bm-s-mode').val(s.applyMode);updateFabVis();applyFabStyle();renderShop();toast('Полный сброс выполнен','🔄')});
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
}
console.log('[BlackMarket] ✓ v2.0 loaded');
});
})();
