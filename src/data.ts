import { Industry, Room, Participant, UserHistory } from './types';

export const industries: Industry[] = [
  { id: 'tech', name: '互联网', icon: '💻', color: '#6366f1', gradient: 'from-indigo-500 to-purple-600' },
  { id: 'finance', name: '金融', icon: '💰', color: '#f59e0b', gradient: 'from-amber-500 to-orange-600' },
  { id: 'education', name: '教育', icon: '📚', color: '#10b981', gradient: 'from-emerald-500 to-teal-600' },
  { id: 'medical', name: '医疗', icon: '🏥', color: '#ef4444', gradient: 'from-red-500 to-pink-600' },
  { id: 'design', name: '设计', icon: '🎨', color: '#8b5cf6', gradient: 'from-violet-500 to-purple-600' },
  { id: 'media', name: '传媒', icon: '📺', color: '#06b6d4', gradient: 'from-cyan-500 to-blue-600' },
  { id: 'realestate', name: '房地产', icon: '🏢', color: '#78716c', gradient: 'from-stone-500 to-zinc-600' },
  { id: 'manufacture', name: '制造业', icon: '🏭', color: '#64748b', gradient: 'from-slate-500 to-gray-600' },
  { id: 'service', name: '服务业', icon: '🛎️', color: '#ec4899', gradient: 'from-pink-500 to-rose-600' },
  { id: 'government', name: '体制内', icon: '🏛️', color: '#dc2626', gradient: 'from-red-600 to-red-800' },
];

const randomAvatars = ['🐱', '🐶', '🦊', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🐔', '🦄', '🐲', '🦉', '🐳'];
const randomNicknames = [
  '匿名打工人', '摸鱼达人', '加班战士', '佛系员工', '吐槽大师',
  '职场小白', '资深社畜', '快乐摸鱼', '深夜加班人', '周一综合症',
  '佛系打工', '快乐搬砖', '社恐患者', '话痨本痨', '沉默的羔羊',
];

function getRandomAvatar() {
  return randomAvatars[Math.floor(Math.random() * randomAvatars.length)];
}

function getRandomNickname() {
  return randomNicknames[Math.floor(Math.random() * randomNicknames.length)];
}

export function generateParticipant(id: string): Participant {
  return {
    id,
    avatar: getRandomAvatar(),
    nickname: getRandomNickname(),
    isSpeaking: false,
    joinedAt: Date.now(),
  };
}

export const mockRooms: Room[] = [
  {
    id: 'room-1',
    industryId: 'tech',
    name: '996加班吐槽大会',
    description: '来聊聊那些年加过的班，熬过的夜',
    maxParticipants: 3,
    currentParticipants: 2,
    duration: 25,
    price: 5,
    status: 'waiting',
    tags: ['996', '加班', 'ICU'],
    participants: [generateParticipant('p1'), generateParticipant('p2')],
  },
  {
    id: 'room-2',
    industryId: 'tech',
    name: '产品经理vs程序员',
    description: '需求变更的那些事儿，你懂的',
    maxParticipants: 3,
    currentParticipants: 3,
    duration: 20,
    price: 5,
    status: 'active',
    tags: ['需求变更', '撕逼', '背锅'],
    participants: [generateParticipant('p3'), generateParticipant('p4'), generateParticipant('p5')],
  },
  {
    id: 'room-3',
    industryId: 'finance',
    name: '韭菜的自我修养',
    description: 'A股港股美股，今天你又绿了吗',
    maxParticipants: 3,
    currentParticipants: 1,
    duration: 30,
    price: 5,
    status: 'waiting',
    tags: ['股市', '韭菜', '亏钱'],
    participants: [generateParticipant('p6')],
  },
  {
    id: 'room-4',
    industryId: 'education',
    name: '家长群里的那些事',
    description: '辅导作业到崩溃，教育内卷何时休',
    maxParticipants: 3,
    currentParticipants: 0,
    duration: 25,
    price: 5,
    status: 'waiting',
    tags: ['辅导作业', '家长群', '内卷'],
    participants: [],
  },
  {
    id: 'room-5',
    industryId: 'design',
    name: '甲方又双叒改需求了',
    description: 'LOGO大一点再小一点，五彩斑斓的黑',
    maxParticipants: 3,
    currentParticipants: 2,
    duration: 20,
    price: 5,
    status: 'waiting',
    tags: ['甲方', '改稿', '五彩斑斓的黑'],
    participants: [generateParticipant('p7'), generateParticipant('p8')],
  },
  {
    id: 'room-6',
    industryId: 'medical',
    name: '夜班医生联盟',
    description: '值夜班的辛酸谁人知，来吐吐槽',
    maxParticipants: 3,
    currentParticipants: 1,
    duration: 25,
    price: 5,
    status: 'waiting',
    tags: ['夜班', '医患', '值班'],
    participants: [generateParticipant('p9')],
  },
  {
    id: 'room-7',
    industryId: 'media',
    name: '新媒体人的秃头日常',
    description: '10万+的焦虑，追热点的疲惫',
    maxParticipants: 3,
    currentParticipants: 3,
    duration: 30,
    price: 5,
    status: 'active',
    tags: ['10万+', '热点', '秃头'],
    participants: [generateParticipant('p10'), generateParticipant('p11'), generateParticipant('p12')],
  },
  {
    id: 'room-8',
    industryId: 'service',
    name: '服务业的心酸谁懂',
    description: '顾客永远是对的？来聊聊奇葩顾客',
    maxParticipants: 3,
    currentParticipants: 0,
    duration: 20,
    price: 5,
    status: 'waiting',
    tags: ['奇葩顾客', '微笑服务', '委屈'],
    participants: [],
  },
  {
    id: 'room-9',
    industryId: 'government',
    name: '体制内吐槽圈',
    description: '体制内的那些事，你懂的',
    maxParticipants: 3,
    currentParticipants: 2,
    duration: 25,
    price: 5,
    status: 'waiting',
    tags: ['体制', '开会', '写材料'],
    participants: [generateParticipant('p13'), generateParticipant('p14')],
  },
  {
    id: 'room-10',
    industryId: 'realestate',
    name: '房产中介的血泪史',
    description: '带看50套还不买？来吐槽你的客户',
    maxParticipants: 3,
    currentParticipants: 1,
    duration: 20,
    price: 5,
    status: 'waiting',
    tags: ['带看', '佣金', '跳单'],
    participants: [generateParticipant('p15')],
  },
];

export const mockHistory: UserHistory[] = [
  {
    id: 'h1',
    roomName: '996加班吐槽大会',
    industry: '互联网',
    date: '2025-01-15',
    duration: 25,
    rating: 5,
  },
  {
    id: 'h2',
    roomName: '韭菜的自我修养',
    industry: '金融',
    date: '2025-01-14',
    duration: 30,
    rating: 4,
  },
  {
    id: 'h3',
    roomName: '甲方又双叒改需求了',
    industry: '设计',
    date: '2025-01-12',
    duration: 20,
    rating: 5,
  },
];

export const hotTopics = [
  '今天又被领导PUA了',
  '加班到凌晨3点是什么体验',
  '年终奖发了个寂寞',
  '同事卷王本王',
  '周一综合征',
  '35岁被裁了',
  '调休制度太恶心了',
  '开会开会又是开会',
];
