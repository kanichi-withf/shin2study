// 世界地図クイズ用のデータ。
// SVG は public/world-map.svg (flekschas/simple-world-map, CC BY-SA 3.0) を使用。
// 各国は ISO 3166-1 alpha-2 小文字コードで SVG の id と一致。

export type AreaId =
  | 'asia'
  | 'europe'
  | 'north-america'
  | 'south-america'
  | 'africa'
  | 'oceania';

export interface AreaData {
  id: AreaId;
  name: string;
  emoji: string;
  gradient: string;
}

export const AREAS: AreaData[] = [
  { id: 'asia', name: 'アジア', emoji: '🌏', gradient: 'linear-gradient(135deg, #FF9F43, #FFD93D)' },
  { id: 'europe', name: 'ヨーロッパ', emoji: '🏰', gradient: 'linear-gradient(135deg, #4D96FF, #85B5FF)' },
  { id: 'north-america', name: 'きたアメリカ', emoji: '🗽', gradient: 'linear-gradient(135deg, #FF7675, #FF85A1)' },
  { id: 'south-america', name: 'みなみアメリカ', emoji: '🦙', gradient: 'linear-gradient(135deg, #6BCB77, #9DFFAC)' },
  { id: 'africa', name: 'アフリカ', emoji: '🦁', gradient: 'linear-gradient(135deg, #FF9F43, #FF7675)' },
  { id: 'oceania', name: 'オセアニア', emoji: '🦘', gradient: 'linear-gradient(135deg, #A55EEA, #C896FF)' },
];

export interface CountryData {
  code: string;   // ISO 3166-1 alpha-2 (lowercase) — SVG id と一致
  name: string;   // 日本語名
  kana: string;   // ひらがな読み
  area: AreaId;
}

export const COUNTRIES: CountryData[] = [
  // ====== Asia ======
  { code: 'jp', name: '日本', kana: 'にほん', area: 'asia' },
  { code: 'cn', name: 'ちゅうごく', kana: 'ちゅうごく', area: 'asia' },
  { code: 'kr', name: 'かんこく', kana: 'かんこく', area: 'asia' },
  { code: 'kp', name: 'きたちょうせん', kana: 'きたちょうせん', area: 'asia' },
  { code: 'mn', name: 'モンゴル', kana: 'もんごる', area: 'asia' },
  { code: 'tw', name: 'たいわん', kana: 'たいわん', area: 'asia' },
  { code: 'th', name: 'タイ', kana: 'たい', area: 'asia' },
  { code: 'vn', name: 'ベトナム', kana: 'べとなむ', area: 'asia' },
  { code: 'la', name: 'ラオス', kana: 'らおす', area: 'asia' },
  { code: 'kh', name: 'カンボジア', kana: 'かんぼじあ', area: 'asia' },
  { code: 'mm', name: 'ミャンマー', kana: 'みゃんまー', area: 'asia' },
  { code: 'my', name: 'マレーシア', kana: 'まれーしあ', area: 'asia' },
  { code: 'sg', name: 'シンガポール', kana: 'しんがぽーる', area: 'asia' },
  { code: 'id', name: 'インドネシア', kana: 'いんどねしあ', area: 'asia' },
  { code: 'ph', name: 'フィリピン', kana: 'ふぃりぴん', area: 'asia' },
  { code: 'in', name: 'インド', kana: 'いんど', area: 'asia' },
  { code: 'pk', name: 'パキスタン', kana: 'ぱきすたん', area: 'asia' },
  { code: 'bd', name: 'バングラデシュ', kana: 'ばんぐらでしゅ', area: 'asia' },
  { code: 'np', name: 'ネパール', kana: 'ねぱーる', area: 'asia' },
  { code: 'lk', name: 'スリランカ', kana: 'すりらんか', area: 'asia' },
  { code: 'ir', name: 'イラン', kana: 'いらん', area: 'asia' },
  { code: 'iq', name: 'イラク', kana: 'いらく', area: 'asia' },
  { code: 'sa', name: 'サウジアラビア', kana: 'さうじあらびあ', area: 'asia' },
  { code: 'ae', name: 'アラブしゅちょうこくれんぽう', kana: 'あらぶしゅちょうこくれんぽう', area: 'asia' },
  { code: 'il', name: 'イスラエル', kana: 'いすらえる', area: 'asia' },
  { code: 'tr', name: 'トルコ', kana: 'とるこ', area: 'asia' },

  // ====== Europe ======
  { code: 'gb', name: 'イギリス', kana: 'いぎりす', area: 'europe' },
  { code: 'fr', name: 'フランス', kana: 'ふらんす', area: 'europe' },
  { code: 'de', name: 'ドイツ', kana: 'どいつ', area: 'europe' },
  { code: 'it', name: 'イタリア', kana: 'いたりあ', area: 'europe' },
  { code: 'es', name: 'スペイン', kana: 'すぺいん', area: 'europe' },
  { code: 'pt', name: 'ポルトガル', kana: 'ぽるとがる', area: 'europe' },
  { code: 'nl', name: 'オランダ', kana: 'おらんだ', area: 'europe' },
  { code: 'be', name: 'ベルギー', kana: 'べるぎー', area: 'europe' },
  { code: 'ch', name: 'スイス', kana: 'すいす', area: 'europe' },
  { code: 'at', name: 'オーストリア', kana: 'おーすとりあ', area: 'europe' },
  { code: 'se', name: 'スウェーデン', kana: 'すうぇーでん', area: 'europe' },
  { code: 'no', name: 'ノルウェー', kana: 'のるうぇー', area: 'europe' },
  { code: 'fi', name: 'フィンランド', kana: 'ふぃんらんど', area: 'europe' },
  { code: 'dk', name: 'デンマーク', kana: 'でんまーく', area: 'europe' },
  { code: 'ie', name: 'アイルランド', kana: 'あいるらんど', area: 'europe' },
  { code: 'gr', name: 'ギリシャ', kana: 'ぎりしゃ', area: 'europe' },
  { code: 'ru', name: 'ロシア', kana: 'ろしあ', area: 'europe' },
  { code: 'pl', name: 'ポーランド', kana: 'ぽーらんど', area: 'europe' },
  { code: 'cz', name: 'チェコ', kana: 'ちぇこ', area: 'europe' },
  { code: 'hu', name: 'ハンガリー', kana: 'はんがりー', area: 'europe' },
  { code: 'ua', name: 'ウクライナ', kana: 'うくらいな', area: 'europe' },
  { code: 'ro', name: 'ルーマニア', kana: 'るーまにあ', area: 'europe' },
  { code: 'is', name: 'アイスランド', kana: 'あいすらんど', area: 'europe' },

  // ====== North America ======
  { code: 'us', name: 'アメリカ', kana: 'あめりか', area: 'north-america' },
  { code: 'ca', name: 'カナダ', kana: 'かなだ', area: 'north-america' },
  { code: 'mx', name: 'メキシコ', kana: 'めきしこ', area: 'north-america' },
  { code: 'cu', name: 'キューバ', kana: 'きゅーば', area: 'north-america' },
  { code: 'jm', name: 'ジャマイカ', kana: 'じゃまいか', area: 'north-america' },
  { code: 'ht', name: 'ハイチ', kana: 'はいち', area: 'north-america' },
  { code: 'do', name: 'ドミニカきょうわこく', kana: 'どみにかきょうわこく', area: 'north-america' },
  { code: 'gt', name: 'グアテマラ', kana: 'ぐあてまら', area: 'north-america' },
  { code: 'hn', name: 'ホンジュラス', kana: 'ほんじゅらす', area: 'north-america' },
  { code: 'ni', name: 'ニカラグア', kana: 'にからぐあ', area: 'north-america' },
  { code: 'cr', name: 'コスタリカ', kana: 'こすたりか', area: 'north-america' },
  { code: 'pa', name: 'パナマ', kana: 'ぱなま', area: 'north-america' },
  { code: 'bs', name: 'バハマ', kana: 'ばはま', area: 'north-america' },

  // ====== South America ======
  { code: 'br', name: 'ブラジル', kana: 'ぶらじる', area: 'south-america' },
  { code: 'ar', name: 'アルゼンチン', kana: 'あるぜんちん', area: 'south-america' },
  { code: 'cl', name: 'チリ', kana: 'ちり', area: 'south-america' },
  { code: 'pe', name: 'ペルー', kana: 'ぺるー', area: 'south-america' },
  { code: 'co', name: 'コロンビア', kana: 'ころんびあ', area: 'south-america' },
  { code: 've', name: 'ベネズエラ', kana: 'べねずえら', area: 'south-america' },
  { code: 'ec', name: 'エクアドル', kana: 'えくあどる', area: 'south-america' },
  { code: 'bo', name: 'ボリビア', kana: 'ぼりびあ', area: 'south-america' },
  { code: 'py', name: 'パラグアイ', kana: 'ぱらぐあい', area: 'south-america' },
  { code: 'uy', name: 'ウルグアイ', kana: 'うるぐあい', area: 'south-america' },
  { code: 'gy', name: 'ガイアナ', kana: 'がいあな', area: 'south-america' },
  { code: 'sr', name: 'スリナム', kana: 'すりなむ', area: 'south-america' },

  // ====== Africa ======
  { code: 'eg', name: 'エジプト', kana: 'えじぷと', area: 'africa' },
  { code: 'ma', name: 'モロッコ', kana: 'もろっこ', area: 'africa' },
  { code: 'dz', name: 'アルジェリア', kana: 'あるじぇりあ', area: 'africa' },
  { code: 'tn', name: 'チュニジア', kana: 'ちゅにじあ', area: 'africa' },
  { code: 'ly', name: 'リビア', kana: 'りびあ', area: 'africa' },
  { code: 'sd', name: 'スーダン', kana: 'すーだん', area: 'africa' },
  { code: 'et', name: 'エチオピア', kana: 'えちおぴあ', area: 'africa' },
  { code: 'ke', name: 'ケニア', kana: 'けにあ', area: 'africa' },
  { code: 'tz', name: 'タンザニア', kana: 'たんざにあ', area: 'africa' },
  { code: 'ug', name: 'ウガンダ', kana: 'うがんだ', area: 'africa' },
  { code: 'ng', name: 'ナイジェリア', kana: 'ないじぇりあ', area: 'africa' },
  { code: 'za', name: 'みなみアフリカ', kana: 'みなみあふりか', area: 'africa' },
  { code: 'gh', name: 'ガーナ', kana: 'がーな', area: 'africa' },
  { code: 'sn', name: 'セネガル', kana: 'せねがる', area: 'africa' },
  { code: 'mg', name: 'マダガスカル', kana: 'まだがすかる', area: 'africa' },
  { code: 'mz', name: 'モザンビーク', kana: 'もざんびーく', area: 'africa' },
  { code: 'ci', name: 'コートジボワール', kana: 'こーとじぼわーる', area: 'africa' },
  { code: 'cm', name: 'カメルーン', kana: 'かめるーん', area: 'africa' },
  { code: 'ao', name: 'アンゴラ', kana: 'あんごら', area: 'africa' },
  { code: 'zw', name: 'ジンバブエ', kana: 'じんばぶえ', area: 'africa' },
  { code: 'na', name: 'ナミビア', kana: 'なみびあ', area: 'africa' },
  { code: 'so', name: 'ソマリア', kana: 'そまりあ', area: 'africa' },

  // ====== Oceania ======
  { code: 'au', name: 'オーストラリア', kana: 'おーすとらりあ', area: 'oceania' },
  { code: 'nz', name: 'ニュージーランド', kana: 'にゅーじーらんど', area: 'oceania' },
  { code: 'pg', name: 'パプアニューギニア', kana: 'ぱぷあにゅーぎにあ', area: 'oceania' },
  { code: 'sb', name: 'ソロモンしょとう', kana: 'そろもんしょとう', area: 'oceania' },
  { code: 'vu', name: 'バヌアツ', kana: 'ばぬあつ', area: 'oceania' },
  { code: 'nc', name: 'ニューカレドニア', kana: 'にゅーかれどにあ', area: 'oceania' },
];

export function getCountriesInArea(area: AreaId): CountryData[] {
  return COUNTRIES.filter((c) => c.area === area);
}
