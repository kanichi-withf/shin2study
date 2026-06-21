// 47都道府県のデータ（JIS X 0401コード順）
// SVGは public/japan-map.svg (Geolonia japanese-prefectures map-full.svg, GFDL) を使用

export interface PrefectureData {
  code: string;
  name: string;
  kana: string;
  romaji: string;
  region: string;
}

export const PREFECTURES: PrefectureData[] = [
  { code: '01', name: '北海道', kana: 'ほっかいどう', romaji: 'Hokkaido', region: '北海道' },
  { code: '02', name: '青森県', kana: 'あおもりけん', romaji: 'Aomori', region: '東北' },
  { code: '03', name: '岩手県', kana: 'いわてけん', romaji: 'Iwate', region: '東北' },
  { code: '04', name: '宮城県', kana: 'みやぎけん', romaji: 'Miyagi', region: '東北' },
  { code: '05', name: '秋田県', kana: 'あきたけん', romaji: 'Akita', region: '東北' },
  { code: '06', name: '山形県', kana: 'やまがたけん', romaji: 'Yamagata', region: '東北' },
  { code: '07', name: '福島県', kana: 'ふくしまけん', romaji: 'Fukushima', region: '東北' },
  { code: '08', name: '茨城県', kana: 'いばらきけん', romaji: 'Ibaraki', region: '関東' },
  { code: '09', name: '栃木県', kana: 'とちぎけん', romaji: 'Tochigi', region: '関東' },
  { code: '10', name: '群馬県', kana: 'ぐんまけん', romaji: 'Gunma', region: '関東' },
  { code: '11', name: '埼玉県', kana: 'さいたまけん', romaji: 'Saitama', region: '関東' },
  { code: '12', name: '千葉県', kana: 'ちばけん', romaji: 'Chiba', region: '関東' },
  { code: '13', name: '東京都', kana: 'とうきょうと', romaji: 'Tokyo', region: '関東' },
  { code: '14', name: '神奈川県', kana: 'かながわけん', romaji: 'Kanagawa', region: '関東' },
  { code: '15', name: '新潟県', kana: 'にいがたけん', romaji: 'Niigata', region: '中部' },
  { code: '16', name: '富山県', kana: 'とやまけん', romaji: 'Toyama', region: '中部' },
  { code: '17', name: '石川県', kana: 'いしかわけん', romaji: 'Ishikawa', region: '中部' },
  { code: '18', name: '福井県', kana: 'ふくいけん', romaji: 'Fukui', region: '中部' },
  { code: '19', name: '山梨県', kana: 'やまなしけん', romaji: 'Yamanashi', region: '中部' },
  { code: '20', name: '長野県', kana: 'ながのけん', romaji: 'Nagano', region: '中部' },
  { code: '21', name: '岐阜県', kana: 'ぎふけん', romaji: 'Gifu', region: '中部' },
  { code: '22', name: '静岡県', kana: 'しずおかけん', romaji: 'Shizuoka', region: '中部' },
  { code: '23', name: '愛知県', kana: 'あいちけん', romaji: 'Aichi', region: '中部' },
  { code: '24', name: '三重県', kana: 'みえけん', romaji: 'Mie', region: '近畿' },
  { code: '25', name: '滋賀県', kana: 'しがけん', romaji: 'Shiga', region: '近畿' },
  { code: '26', name: '京都府', kana: 'きょうとふ', romaji: 'Kyoto', region: '近畿' },
  { code: '27', name: '大阪府', kana: 'おおさかふ', romaji: 'Osaka', region: '近畿' },
  { code: '28', name: '兵庫県', kana: 'ひょうごけん', romaji: 'Hyogo', region: '近畿' },
  { code: '29', name: '奈良県', kana: 'ならけん', romaji: 'Nara', region: '近畿' },
  { code: '30', name: '和歌山県', kana: 'わかやまけん', romaji: 'Wakayama', region: '近畿' },
  { code: '31', name: '鳥取県', kana: 'とっとりけん', romaji: 'Tottori', region: '中国' },
  { code: '32', name: '島根県', kana: 'しまねけん', romaji: 'Shimane', region: '中国' },
  { code: '33', name: '岡山県', kana: 'おかやまけん', romaji: 'Okayama', region: '中国' },
  { code: '34', name: '広島県', kana: 'ひろしまけん', romaji: 'Hiroshima', region: '中国' },
  { code: '35', name: '山口県', kana: 'やまぐちけん', romaji: 'Yamaguchi', region: '中国' },
  { code: '36', name: '徳島県', kana: 'とくしまけん', romaji: 'Tokushima', region: '四国' },
  { code: '37', name: '香川県', kana: 'かがわけん', romaji: 'Kagawa', region: '四国' },
  { code: '38', name: '愛媛県', kana: 'えひめけん', romaji: 'Ehime', region: '四国' },
  { code: '39', name: '高知県', kana: 'こうちけん', romaji: 'Kochi', region: '四国' },
  { code: '40', name: '福岡県', kana: 'ふくおかけん', romaji: 'Fukuoka', region: '九州' },
  { code: '41', name: '佐賀県', kana: 'さがけん', romaji: 'Saga', region: '九州' },
  { code: '42', name: '長崎県', kana: 'ながさきけん', romaji: 'Nagasaki', region: '九州' },
  { code: '43', name: '熊本県', kana: 'くまもとけん', romaji: 'Kumamoto', region: '九州' },
  { code: '44', name: '大分県', kana: 'おおいたけん', romaji: 'Oita', region: '九州' },
  { code: '45', name: '宮崎県', kana: 'みやざきけん', romaji: 'Miyazaki', region: '九州' },
  { code: '46', name: '鹿児島県', kana: 'かごしまけん', romaji: 'Kagoshima', region: '九州' },
  { code: '47', name: '沖縄県', kana: 'おきなわけん', romaji: 'Okinawa', region: '九州' },
];
