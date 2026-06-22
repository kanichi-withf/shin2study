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
  code: string;        // ISO 3166-1 alpha-2 (lowercase) — SVG id と一致
  name: string;        // 日本語名
  kana: string;        // ひらがな読み
  capital: string;     // 首都
  capitalKana: string; // 首都の読み
  area: AreaId;
}

export const COUNTRIES: CountryData[] = [
  // ====== Asia ======
  { code: 'jp', name: '日本', kana: 'にほん', capital: '東京', capitalKana: 'とうきょう', area: 'asia' },
  { code: 'cn', name: 'ちゅうごく', kana: 'ちゅうごく', capital: 'ペキン', capitalKana: 'ぺきん', area: 'asia' },
  { code: 'kr', name: 'かんこく', kana: 'かんこく', capital: 'ソウル', capitalKana: 'そうる', area: 'asia' },
  { code: 'kp', name: 'きたちょうせん', kana: 'きたちょうせん', capital: 'ピョンヤン', capitalKana: 'ぴょんやん', area: 'asia' },
  { code: 'mn', name: 'モンゴル', kana: 'もんごる', capital: 'ウランバートル', capitalKana: 'うらんばーとる', area: 'asia' },
  { code: 'tw', name: 'たいわん', kana: 'たいわん', capital: 'タイペイ', capitalKana: 'たいぺい', area: 'asia' },
  { code: 'th', name: 'タイ', kana: 'たい', capital: 'バンコク', capitalKana: 'ばんこく', area: 'asia' },
  { code: 'vn', name: 'ベトナム', kana: 'べとなむ', capital: 'ハノイ', capitalKana: 'はのい', area: 'asia' },
  { code: 'la', name: 'ラオス', kana: 'らおす', capital: 'ビエンチャン', capitalKana: 'びえんちゃん', area: 'asia' },
  { code: 'kh', name: 'カンボジア', kana: 'かんぼじあ', capital: 'プノンペン', capitalKana: 'ぷのんぺん', area: 'asia' },
  { code: 'mm', name: 'ミャンマー', kana: 'みゃんまー', capital: 'ネピドー', capitalKana: 'ねぴどー', area: 'asia' },
  { code: 'my', name: 'マレーシア', kana: 'まれーしあ', capital: 'クアラルンプール', capitalKana: 'くあらるんぷーる', area: 'asia' },
  { code: 'sg', name: 'シンガポール', kana: 'しんがぽーる', capital: 'シンガポール', capitalKana: 'しんがぽーる', area: 'asia' },
  { code: 'id', name: 'インドネシア', kana: 'いんどねしあ', capital: 'ジャカルタ', capitalKana: 'じゃかるた', area: 'asia' },
  { code: 'ph', name: 'フィリピン', kana: 'ふぃりぴん', capital: 'マニラ', capitalKana: 'まにら', area: 'asia' },
  { code: 'in', name: 'インド', kana: 'いんど', capital: 'ニューデリー', capitalKana: 'にゅーでりー', area: 'asia' },
  { code: 'pk', name: 'パキスタン', kana: 'ぱきすたん', capital: 'イスラマバード', capitalKana: 'いすらまばーど', area: 'asia' },
  { code: 'bd', name: 'バングラデシュ', kana: 'ばんぐらでしゅ', capital: 'ダッカ', capitalKana: 'だっか', area: 'asia' },
  { code: 'np', name: 'ネパール', kana: 'ねぱーる', capital: 'カトマンズ', capitalKana: 'かとまんず', area: 'asia' },
  { code: 'lk', name: 'スリランカ', kana: 'すりらんか', capital: 'コロンボ', capitalKana: 'ころんぼ', area: 'asia' },
  { code: 'ir', name: 'イラン', kana: 'いらん', capital: 'テヘラン', capitalKana: 'てへらん', area: 'asia' },
  { code: 'iq', name: 'イラク', kana: 'いらく', capital: 'バグダッド', capitalKana: 'ばぐだっど', area: 'asia' },
  { code: 'sa', name: 'サウジアラビア', kana: 'さうじあらびあ', capital: 'リヤド', capitalKana: 'りやど', area: 'asia' },
  { code: 'ae', name: 'アラブしゅちょうこくれんぽう', kana: 'あらぶしゅちょうこくれんぽう', capital: 'アブダビ', capitalKana: 'あぶだび', area: 'asia' },
  { code: 'il', name: 'イスラエル', kana: 'いすらえる', capital: 'エルサレム', capitalKana: 'えるされむ', area: 'asia' },
  { code: 'tr', name: 'トルコ', kana: 'とるこ', capital: 'アンカラ', capitalKana: 'あんから', area: 'asia' },

  // ====== Europe ======
  { code: 'gb', name: 'イギリス', kana: 'いぎりす', capital: 'ロンドン', capitalKana: 'ろんどん', area: 'europe' },
  { code: 'fr', name: 'フランス', kana: 'ふらんす', capital: 'パリ', capitalKana: 'ぱり', area: 'europe' },
  { code: 'de', name: 'ドイツ', kana: 'どいつ', capital: 'ベルリン', capitalKana: 'べるりん', area: 'europe' },
  { code: 'it', name: 'イタリア', kana: 'いたりあ', capital: 'ローマ', capitalKana: 'ろーま', area: 'europe' },
  { code: 'es', name: 'スペイン', kana: 'すぺいん', capital: 'マドリード', capitalKana: 'まどりーど', area: 'europe' },
  { code: 'pt', name: 'ポルトガル', kana: 'ぽるとがる', capital: 'リスボン', capitalKana: 'りすぼん', area: 'europe' },
  { code: 'nl', name: 'オランダ', kana: 'おらんだ', capital: 'アムステルダム', capitalKana: 'あむすてるだむ', area: 'europe' },
  { code: 'be', name: 'ベルギー', kana: 'べるぎー', capital: 'ブリュッセル', capitalKana: 'ぶりゅっせる', area: 'europe' },
  { code: 'ch', name: 'スイス', kana: 'すいす', capital: 'ベルン', capitalKana: 'べるん', area: 'europe' },
  { code: 'at', name: 'オーストリア', kana: 'おーすとりあ', capital: 'ウィーン', capitalKana: 'うぃーん', area: 'europe' },
  { code: 'se', name: 'スウェーデン', kana: 'すうぇーでん', capital: 'ストックホルム', capitalKana: 'すとっくほるむ', area: 'europe' },
  { code: 'no', name: 'ノルウェー', kana: 'のるうぇー', capital: 'オスロ', capitalKana: 'おすろ', area: 'europe' },
  { code: 'fi', name: 'フィンランド', kana: 'ふぃんらんど', capital: 'ヘルシンキ', capitalKana: 'へるしんき', area: 'europe' },
  { code: 'dk', name: 'デンマーク', kana: 'でんまーく', capital: 'コペンハーゲン', capitalKana: 'こぺんはーげん', area: 'europe' },
  { code: 'ie', name: 'アイルランド', kana: 'あいるらんど', capital: 'ダブリン', capitalKana: 'だぶりん', area: 'europe' },
  { code: 'gr', name: 'ギリシャ', kana: 'ぎりしゃ', capital: 'アテネ', capitalKana: 'あてね', area: 'europe' },
  { code: 'ru', name: 'ロシア', kana: 'ろしあ', capital: 'モスクワ', capitalKana: 'もすくわ', area: 'europe' },
  { code: 'pl', name: 'ポーランド', kana: 'ぽーらんど', capital: 'ワルシャワ', capitalKana: 'わるしゃわ', area: 'europe' },
  { code: 'cz', name: 'チェコ', kana: 'ちぇこ', capital: 'プラハ', capitalKana: 'ぷらは', area: 'europe' },
  { code: 'hu', name: 'ハンガリー', kana: 'はんがりー', capital: 'ブダペスト', capitalKana: 'ぶだぺすと', area: 'europe' },
  { code: 'ua', name: 'ウクライナ', kana: 'うくらいな', capital: 'キーウ', capitalKana: 'きーう', area: 'europe' },
  { code: 'ro', name: 'ルーマニア', kana: 'るーまにあ', capital: 'ブカレスト', capitalKana: 'ぶかれすと', area: 'europe' },
  { code: 'is', name: 'アイスランド', kana: 'あいすらんど', capital: 'レイキャビク', capitalKana: 'れいきゃびく', area: 'europe' },

  // ====== North America ======
  { code: 'us', name: 'アメリカ', kana: 'あめりか', capital: 'ワシントン D.C.', capitalKana: 'わしんとん でぃーしー', area: 'north-america' },
  { code: 'ca', name: 'カナダ', kana: 'かなだ', capital: 'オタワ', capitalKana: 'おたわ', area: 'north-america' },
  { code: 'mx', name: 'メキシコ', kana: 'めきしこ', capital: 'メキシコシティ', capitalKana: 'めきしこしてぃ', area: 'north-america' },
  { code: 'cu', name: 'キューバ', kana: 'きゅーば', capital: 'ハバナ', capitalKana: 'はばな', area: 'north-america' },
  { code: 'jm', name: 'ジャマイカ', kana: 'じゃまいか', capital: 'キングストン', capitalKana: 'きんぐすとん', area: 'north-america' },
  { code: 'ht', name: 'ハイチ', kana: 'はいち', capital: 'ポルトープランス', capitalKana: 'ぽるとーぷらんす', area: 'north-america' },
  { code: 'do', name: 'ドミニカきょうわこく', kana: 'どみにかきょうわこく', capital: 'サントドミンゴ', capitalKana: 'さんとどみんご', area: 'north-america' },
  { code: 'gt', name: 'グアテマラ', kana: 'ぐあてまら', capital: 'グアテマラシティ', capitalKana: 'ぐあてまらしてぃ', area: 'north-america' },
  { code: 'hn', name: 'ホンジュラス', kana: 'ほんじゅらす', capital: 'テグシガルパ', capitalKana: 'てぐしがるぱ', area: 'north-america' },
  { code: 'ni', name: 'ニカラグア', kana: 'にからぐあ', capital: 'マナグア', capitalKana: 'まなぐあ', area: 'north-america' },
  { code: 'cr', name: 'コスタリカ', kana: 'こすたりか', capital: 'サンホセ', capitalKana: 'さんほせ', area: 'north-america' },
  { code: 'pa', name: 'パナマ', kana: 'ぱなま', capital: 'パナマシティ', capitalKana: 'ぱなましてぃ', area: 'north-america' },
  { code: 'bs', name: 'バハマ', kana: 'ばはま', capital: 'ナッソー', capitalKana: 'なっそー', area: 'north-america' },

  // ====== South America ======
  { code: 'br', name: 'ブラジル', kana: 'ぶらじる', capital: 'ブラジリア', capitalKana: 'ぶらじりあ', area: 'south-america' },
  { code: 'ar', name: 'アルゼンチン', kana: 'あるぜんちん', capital: 'ブエノスアイレス', capitalKana: 'ぶえのすあいれす', area: 'south-america' },
  { code: 'cl', name: 'チリ', kana: 'ちり', capital: 'サンティアゴ', capitalKana: 'さんてぃあご', area: 'south-america' },
  { code: 'pe', name: 'ペルー', kana: 'ぺるー', capital: 'リマ', capitalKana: 'りま', area: 'south-america' },
  { code: 'co', name: 'コロンビア', kana: 'ころんびあ', capital: 'ボゴタ', capitalKana: 'ぼごた', area: 'south-america' },
  { code: 've', name: 'ベネズエラ', kana: 'べねずえら', capital: 'カラカス', capitalKana: 'からかす', area: 'south-america' },
  { code: 'ec', name: 'エクアドル', kana: 'えくあどる', capital: 'キト', capitalKana: 'きと', area: 'south-america' },
  { code: 'bo', name: 'ボリビア', kana: 'ぼりびあ', capital: 'ラパス', capitalKana: 'らぱす', area: 'south-america' },
  { code: 'py', name: 'パラグアイ', kana: 'ぱらぐあい', capital: 'アスンシオン', capitalKana: 'あすんしおん', area: 'south-america' },
  { code: 'uy', name: 'ウルグアイ', kana: 'うるぐあい', capital: 'モンテビデオ', capitalKana: 'もんてびでお', area: 'south-america' },
  { code: 'gy', name: 'ガイアナ', kana: 'がいあな', capital: 'ジョージタウン', capitalKana: 'じょーじたうん', area: 'south-america' },
  { code: 'sr', name: 'スリナム', kana: 'すりなむ', capital: 'パラマリボ', capitalKana: 'ぱらまりぼ', area: 'south-america' },

  // ====== Africa ======
  { code: 'eg', name: 'エジプト', kana: 'えじぷと', capital: 'カイロ', capitalKana: 'かいろ', area: 'africa' },
  { code: 'ma', name: 'モロッコ', kana: 'もろっこ', capital: 'ラバト', capitalKana: 'らばと', area: 'africa' },
  { code: 'dz', name: 'アルジェリア', kana: 'あるじぇりあ', capital: 'アルジェ', capitalKana: 'あるじぇ', area: 'africa' },
  { code: 'tn', name: 'チュニジア', kana: 'ちゅにじあ', capital: 'チュニス', capitalKana: 'ちゅにす', area: 'africa' },
  { code: 'ly', name: 'リビア', kana: 'りびあ', capital: 'トリポリ', capitalKana: 'とりぽり', area: 'africa' },
  { code: 'sd', name: 'スーダン', kana: 'すーだん', capital: 'ハルツーム', capitalKana: 'はるつーむ', area: 'africa' },
  { code: 'et', name: 'エチオピア', kana: 'えちおぴあ', capital: 'アディスアベバ', capitalKana: 'あでぃすあべば', area: 'africa' },
  { code: 'ke', name: 'ケニア', kana: 'けにあ', capital: 'ナイロビ', capitalKana: 'ないろび', area: 'africa' },
  { code: 'tz', name: 'タンザニア', kana: 'たんざにあ', capital: 'ドドマ', capitalKana: 'どどま', area: 'africa' },
  { code: 'ug', name: 'ウガンダ', kana: 'うがんだ', capital: 'カンパラ', capitalKana: 'かんぱら', area: 'africa' },
  { code: 'ng', name: 'ナイジェリア', kana: 'ないじぇりあ', capital: 'アブジャ', capitalKana: 'あぶじゃ', area: 'africa' },
  { code: 'za', name: 'みなみアフリカ', kana: 'みなみあふりか', capital: 'プレトリア', capitalKana: 'ぷれとりあ', area: 'africa' },
  { code: 'gh', name: 'ガーナ', kana: 'がーな', capital: 'アクラ', capitalKana: 'あくら', area: 'africa' },
  { code: 'sn', name: 'セネガル', kana: 'せねがる', capital: 'ダカール', capitalKana: 'だかーる', area: 'africa' },
  { code: 'mg', name: 'マダガスカル', kana: 'まだがすかる', capital: 'アンタナナリボ', capitalKana: 'あんたななりぼ', area: 'africa' },
  { code: 'mz', name: 'モザンビーク', kana: 'もざんびーく', capital: 'マプト', capitalKana: 'まぷと', area: 'africa' },
  { code: 'ci', name: 'コートジボワール', kana: 'こーとじぼわーる', capital: 'ヤムスクロ', capitalKana: 'やむすくろ', area: 'africa' },
  { code: 'cm', name: 'カメルーン', kana: 'かめるーん', capital: 'ヤウンデ', capitalKana: 'やうんで', area: 'africa' },
  { code: 'ao', name: 'アンゴラ', kana: 'あんごら', capital: 'ルアンダ', capitalKana: 'るあんだ', area: 'africa' },
  { code: 'zw', name: 'ジンバブエ', kana: 'じんばぶえ', capital: 'ハラレ', capitalKana: 'はられ', area: 'africa' },
  { code: 'na', name: 'ナミビア', kana: 'なみびあ', capital: 'ウィントフック', capitalKana: 'うぃんとふっく', area: 'africa' },
  { code: 'so', name: 'ソマリア', kana: 'そまりあ', capital: 'モガディシュ', capitalKana: 'もがでぃしゅ', area: 'africa' },

  // ====== Oceania ======
  { code: 'au', name: 'オーストラリア', kana: 'おーすとらりあ', capital: 'キャンベラ', capitalKana: 'きゃんべら', area: 'oceania' },
  { code: 'nz', name: 'ニュージーランド', kana: 'にゅーじーらんど', capital: 'ウェリントン', capitalKana: 'うぇりんとん', area: 'oceania' },
  { code: 'pg', name: 'パプアニューギニア', kana: 'ぱぷあにゅーぎにあ', capital: 'ポートモレスビー', capitalKana: 'ぽーともれすびー', area: 'oceania' },
  { code: 'sb', name: 'ソロモンしょとう', kana: 'そろもんしょとう', capital: 'ホニアラ', capitalKana: 'ほにあら', area: 'oceania' },
  { code: 'vu', name: 'バヌアツ', kana: 'ばぬあつ', capital: 'ポートビラ', capitalKana: 'ぽーとびら', area: 'oceania' },
  { code: 'nc', name: 'ニューカレドニア', kana: 'にゅーかれどにあ', capital: 'ヌーメア', capitalKana: 'ぬーめあ', area: 'oceania' },
];

export function getCountriesInArea(area: AreaId): CountryData[] {
  return COUNTRIES.filter((c) => c.area === area);
}
