// 47都道府県のデータ（JIS X 0401コード順）
// SVGは public/japan-map.svg (Geolonia japanese-prefectures map-full.svg, GFDL) を使用

export interface PrefectureData {
  code: string;
  name: string;
  kana: string;
  romaji: string;
  region: string;
  capital: string;      // 県庁所在地（市名）
  capitalKana: string;  // 県庁所在地の読み
}

export const PREFECTURES: PrefectureData[] = [
  { code: '01', name: '北海道', kana: 'ほっかいどう', romaji: 'Hokkaido', region: '北海道', capital: '札幌市', capitalKana: 'さっぽろし' },
  { code: '02', name: '青森県', kana: 'あおもりけん', romaji: 'Aomori', region: '東北', capital: '青森市', capitalKana: 'あおもりし' },
  { code: '03', name: '岩手県', kana: 'いわてけん', romaji: 'Iwate', region: '東北', capital: '盛岡市', capitalKana: 'もりおかし' },
  { code: '04', name: '宮城県', kana: 'みやぎけん', romaji: 'Miyagi', region: '東北', capital: '仙台市', capitalKana: 'せんだいし' },
  { code: '05', name: '秋田県', kana: 'あきたけん', romaji: 'Akita', region: '東北', capital: '秋田市', capitalKana: 'あきたし' },
  { code: '06', name: '山形県', kana: 'やまがたけん', romaji: 'Yamagata', region: '東北', capital: '山形市', capitalKana: 'やまがたし' },
  { code: '07', name: '福島県', kana: 'ふくしまけん', romaji: 'Fukushima', region: '東北', capital: '福島市', capitalKana: 'ふくしまし' },
  { code: '08', name: '茨城県', kana: 'いばらきけん', romaji: 'Ibaraki', region: '関東', capital: '水戸市', capitalKana: 'みとし' },
  { code: '09', name: '栃木県', kana: 'とちぎけん', romaji: 'Tochigi', region: '関東', capital: '宇都宮市', capitalKana: 'うつのみやし' },
  { code: '10', name: '群馬県', kana: 'ぐんまけん', romaji: 'Gunma', region: '関東', capital: '前橋市', capitalKana: 'まえばしし' },
  { code: '11', name: '埼玉県', kana: 'さいたまけん', romaji: 'Saitama', region: '関東', capital: 'さいたま市', capitalKana: 'さいたまし' },
  { code: '12', name: '千葉県', kana: 'ちばけん', romaji: 'Chiba', region: '関東', capital: '千葉市', capitalKana: 'ちばし' },
  { code: '13', name: '東京都', kana: 'とうきょうと', romaji: 'Tokyo', region: '関東', capital: '東京', capitalKana: 'とうきょう' },
  { code: '14', name: '神奈川県', kana: 'かながわけん', romaji: 'Kanagawa', region: '関東', capital: '横浜市', capitalKana: 'よこはまし' },
  { code: '15', name: '新潟県', kana: 'にいがたけん', romaji: 'Niigata', region: '中部', capital: '新潟市', capitalKana: 'にいがたし' },
  { code: '16', name: '富山県', kana: 'とやまけん', romaji: 'Toyama', region: '中部', capital: '富山市', capitalKana: 'とやまし' },
  { code: '17', name: '石川県', kana: 'いしかわけん', romaji: 'Ishikawa', region: '中部', capital: '金沢市', capitalKana: 'かなざわし' },
  { code: '18', name: '福井県', kana: 'ふくいけん', romaji: 'Fukui', region: '中部', capital: '福井市', capitalKana: 'ふくいし' },
  { code: '19', name: '山梨県', kana: 'やまなしけん', romaji: 'Yamanashi', region: '中部', capital: '甲府市', capitalKana: 'こうふし' },
  { code: '20', name: '長野県', kana: 'ながのけん', romaji: 'Nagano', region: '中部', capital: '長野市', capitalKana: 'ながのし' },
  { code: '21', name: '岐阜県', kana: 'ぎふけん', romaji: 'Gifu', region: '中部', capital: '岐阜市', capitalKana: 'ぎふし' },
  { code: '22', name: '静岡県', kana: 'しずおかけん', romaji: 'Shizuoka', region: '中部', capital: '静岡市', capitalKana: 'しずおかし' },
  { code: '23', name: '愛知県', kana: 'あいちけん', romaji: 'Aichi', region: '中部', capital: '名古屋市', capitalKana: 'なごやし' },
  { code: '24', name: '三重県', kana: 'みえけん', romaji: 'Mie', region: '近畿', capital: '津市', capitalKana: 'つし' },
  { code: '25', name: '滋賀県', kana: 'しがけん', romaji: 'Shiga', region: '近畿', capital: '大津市', capitalKana: 'おおつし' },
  { code: '26', name: '京都府', kana: 'きょうとふ', romaji: 'Kyoto', region: '近畿', capital: '京都市', capitalKana: 'きょうとし' },
  { code: '27', name: '大阪府', kana: 'おおさかふ', romaji: 'Osaka', region: '近畿', capital: '大阪市', capitalKana: 'おおさかし' },
  { code: '28', name: '兵庫県', kana: 'ひょうごけん', romaji: 'Hyogo', region: '近畿', capital: '神戸市', capitalKana: 'こうべし' },
  { code: '29', name: '奈良県', kana: 'ならけん', romaji: 'Nara', region: '近畿', capital: '奈良市', capitalKana: 'ならし' },
  { code: '30', name: '和歌山県', kana: 'わかやまけん', romaji: 'Wakayama', region: '近畿', capital: '和歌山市', capitalKana: 'わかやまし' },
  { code: '31', name: '鳥取県', kana: 'とっとりけん', romaji: 'Tottori', region: '中国', capital: '鳥取市', capitalKana: 'とっとりし' },
  { code: '32', name: '島根県', kana: 'しまねけん', romaji: 'Shimane', region: '中国', capital: '松江市', capitalKana: 'まつえし' },
  { code: '33', name: '岡山県', kana: 'おかやまけん', romaji: 'Okayama', region: '中国', capital: '岡山市', capitalKana: 'おかやまし' },
  { code: '34', name: '広島県', kana: 'ひろしまけん', romaji: 'Hiroshima', region: '中国', capital: '広島市', capitalKana: 'ひろしまし' },
  { code: '35', name: '山口県', kana: 'やまぐちけん', romaji: 'Yamaguchi', region: '中国', capital: '山口市', capitalKana: 'やまぐちし' },
  { code: '36', name: '徳島県', kana: 'とくしまけん', romaji: 'Tokushima', region: '四国', capital: '徳島市', capitalKana: 'とくしまし' },
  { code: '37', name: '香川県', kana: 'かがわけん', romaji: 'Kagawa', region: '四国', capital: '高松市', capitalKana: 'たかまつし' },
  { code: '38', name: '愛媛県', kana: 'えひめけん', romaji: 'Ehime', region: '四国', capital: '松山市', capitalKana: 'まつやまし' },
  { code: '39', name: '高知県', kana: 'こうちけん', romaji: 'Kochi', region: '四国', capital: '高知市', capitalKana: 'こうちし' },
  { code: '40', name: '福岡県', kana: 'ふくおかけん', romaji: 'Fukuoka', region: '九州', capital: '福岡市', capitalKana: 'ふくおかし' },
  { code: '41', name: '佐賀県', kana: 'さがけん', romaji: 'Saga', region: '九州', capital: '佐賀市', capitalKana: 'さがし' },
  { code: '42', name: '長崎県', kana: 'ながさきけん', romaji: 'Nagasaki', region: '九州', capital: '長崎市', capitalKana: 'ながさきし' },
  { code: '43', name: '熊本県', kana: 'くまもとけん', romaji: 'Kumamoto', region: '九州', capital: '熊本市', capitalKana: 'くまもとし' },
  { code: '44', name: '大分県', kana: 'おおいたけん', romaji: 'Oita', region: '九州', capital: '大分市', capitalKana: 'おおいたし' },
  { code: '45', name: '宮崎県', kana: 'みやざきけん', romaji: 'Miyazaki', region: '九州', capital: '宮崎市', capitalKana: 'みやざきし' },
  { code: '46', name: '鹿児島県', kana: 'かごしまけん', romaji: 'Kagoshima', region: '九州', capital: '鹿児島市', capitalKana: 'かごしまし' },
  { code: '47', name: '沖縄県', kana: 'おきなわけん', romaji: 'Okinawa', region: '九州', capital: '那覇市', capitalKana: 'なはし' },
];
