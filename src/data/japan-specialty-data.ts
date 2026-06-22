// 日本の都道府県別 名産品データ
// prefCode は japan-map-data.ts の PrefectureData.code と一致させる

export interface SpecialtyData {
  id: string;
  name: string;       // 漢字またはカタカナ表記
  kana: string;       // ひらがなよみ
  emoji: string;
  prefCode: string;   // 生産量1位の都道府県コード
}

// 生産量・水揚げ量1位はおおむね2020〜2023年の農林水産統計に基づく
// （小学校低学年でも知っているような身近な品目に絞る）
export const SPECIALTIES: SpecialtyData[] = [
  // くだもの
  { id: 'apple',       name: 'りんご',       kana: 'りんご',         emoji: '🍎', prefCode: '02' }, // 青森
  { id: 'mikan',       name: 'みかん',       kana: 'みかん',         emoji: '🍊', prefCode: '30' }, // 和歌山
  { id: 'strawberry',  name: 'いちご',       kana: 'いちご',         emoji: '🍓', prefCode: '09' }, // 栃木
  { id: 'grape',       name: 'ぶどう',       kana: 'ぶどう',         emoji: '🍇', prefCode: '19' }, // 山梨
  { id: 'peach',       name: 'もも',         kana: 'もも',           emoji: '🍑', prefCode: '19' }, // 山梨
  { id: 'cherry',      name: 'さくらんぼ',   kana: 'さくらんぼ',     emoji: '🍒', prefCode: '06' }, // 山形
  { id: 'melon',       name: 'メロン',       kana: 'めろん',         emoji: '🍈', prefCode: '08' }, // 茨城
  { id: 'watermelon',  name: 'すいか',       kana: 'すいか',         emoji: '🍉', prefCode: '43' }, // 熊本
  { id: 'mango',       name: 'マンゴー',     kana: 'まんごー',       emoji: '🥭', prefCode: '47' }, // 沖縄
  { id: 'pineapple',   name: 'パイナップル', kana: 'ぱいなっぷる',   emoji: '🍍', prefCode: '47' }, // 沖縄

  // やさい
  { id: 'lettuce',     name: 'レタス',       kana: 'れたす',         emoji: '🥬', prefCode: '20' }, // 長野
  { id: 'cabbage',     name: 'キャベツ',     kana: 'きゃべつ',       emoji: '🥗', prefCode: '23' }, // 愛知
  { id: 'potato',      name: 'じゃがいも',   kana: 'じゃがいも',     emoji: '🥔', prefCode: '01' }, // 北海道
  { id: 'onion',       name: 'たまねぎ',     kana: 'たまねぎ',       emoji: '🧅', prefCode: '01' }, // 北海道
  { id: 'carrot',      name: 'にんじん',     kana: 'にんじん',       emoji: '🥕', prefCode: '01' }, // 北海道
  { id: 'broccoli',    name: 'ブロッコリー', kana: 'ぶろっこりー',   emoji: '🥦', prefCode: '01' }, // 北海道
  { id: 'pumpkin',     name: 'かぼちゃ',     kana: 'かぼちゃ',       emoji: '🎃', prefCode: '01' }, // 北海道
  { id: 'corn',        name: 'とうもろこし', kana: 'とうもろこし',   emoji: '🌽', prefCode: '01' }, // 北海道
  { id: 'tomato',      name: 'トマト',       kana: 'とまと',         emoji: '🍅', prefCode: '43' }, // 熊本
  { id: 'eggplant',    name: 'なす',         kana: 'なす',           emoji: '🍆', prefCode: '39' }, // 高知
  { id: 'cucumber',    name: 'きゅうり',     kana: 'きゅうり',       emoji: '🥒', prefCode: '45' }, // 宮崎
  { id: 'sweetpotato', name: 'さつまいも',   kana: 'さつまいも',     emoji: '🍠', prefCode: '46' }, // 鹿児島

  // こくもつ・のうさんぶつ
  { id: 'rice',        name: 'おこめ',       kana: 'おこめ',         emoji: '🌾', prefCode: '15' }, // 新潟
  { id: 'tea',         name: 'おちゃ',       kana: 'おちゃ',         emoji: '🍵', prefCode: '22' }, // 静岡

  // にく・らくのう
  { id: 'milk',        name: 'ぎゅうにゅう', kana: 'ぎゅうにゅう',   emoji: '🥛', prefCode: '01' }, // 北海道
  { id: 'pork',        name: 'ぶたにく',     kana: 'ぶたにく',       emoji: '🥓', prefCode: '46' }, // 鹿児島
  { id: 'egg',         name: 'たまご',       kana: 'たまご',         emoji: '🥚', prefCode: '08' }, // 茨城

  // すいさんぶつ
  { id: 'tuna',        name: 'まぐろ',       kana: 'まぐろ',         emoji: '🐟', prefCode: '22' }, // 静岡（水揚げ）
  { id: 'scallop',     name: 'ホタテ',       kana: 'ほたて',         emoji: '🐚', prefCode: '01' }, // 北海道
  { id: 'fugu',        name: 'ふぐ',         kana: 'ふぐ',           emoji: '🐡', prefCode: '35' }, // 山口（下関）
  { id: 'oyster',      name: 'かき',         kana: 'かき',           emoji: '🦪', prefCode: '34' }, // 広島
  { id: 'eel',         name: 'うなぎ',       kana: 'うなぎ',         emoji: '🍣', prefCode: '46' }, // 鹿児島（養殖）
];
