// 日本の都道府県別 名産品データ（中学受験頻出を意識）
//
// prefCode は japan-map-data.ts の PrefectureData.code と一致させる。
// 生産量・水揚げ量1位は農林水産統計（2020〜2023年ごろ）や中学受験用の参考書で
// 一般に紹介されている都道府県を採用している。
//
// imageUrl は Wikimedia Commons のサムネイル URL（直接 hotlink して使用）。
// 個別品目で見つけられなかったものは未設定で、UIは絵文字にフォールバックする。

export type SpecialtyCategory =
  | 'agriculture' // 野菜・果物・穀物・茶など
  | 'fishery'     // 魚介類・海藻
  | 'livestock'   // 畜産・乳製品
  | 'industry'    // 工業製品
  | 'craft';      // 伝統工芸品

export const CATEGORY_LABELS: Record<SpecialtyCategory, string> = {
  agriculture: 'のうさんぶつ',
  fishery: 'すいさんぶつ',
  livestock: 'ちくさん',
  industry: 'こうぎょう',
  craft: 'でんとうこうげい',
};

export interface SpecialtyData {
  id: string;
  name: string;        // 「りんご」「西陣織」など表示用の主テキスト
  kana: string;        // ひらがなよみ
  emoji: string;       // 画像が無い場合のフォールバック
  imageUrl?: string;   // Wikimedia Commons サムネイル URL
  imageCredit?: string; // 表示用クレジット（必要な場合）
  prefCode: string;
  category: SpecialtyCategory;
  hint?: string;       // 中学受験対策の補足
}

export const SPECIALTIES: SpecialtyData[] = [
  // ─────────── 農産物・果物 ───────────
  { id: 'apple', category: 'agriculture', name: 'りんご', kana: 'りんご', emoji: '🍎', prefCode: '02', hint: '青森県津軽地方が中心。生産量は全国の約6割。', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Red_Apple.jpg/320px-Red_Apple.jpg' },
  { id: 'mikan', category: 'agriculture', name: 'みかん', kana: 'みかん', emoji: '🍊', prefCode: '30', hint: '和歌山県有田地方が代表。愛媛・静岡もさかん。', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/Citrus_unshiu_20101127_c.jpg/320px-Citrus_unshiu_20101127_c.jpg' },
  { id: 'strawberry', category: 'agriculture', name: 'いちご', kana: 'いちご', emoji: '🍓', prefCode: '09', hint: '栃木県の「とちおとめ」が有名。福岡の「あまおう」も。', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ed/Strawberries.JPG/320px-Strawberries.JPG' },
  { id: 'grape', category: 'agriculture', name: 'ぶどう', kana: 'ぶどう', emoji: '🍇', prefCode: '19', hint: '山梨県甲府盆地。岡山(マスカット)・長野も多い。', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/06/Autumn_Royal_grapes.jpg/320px-Autumn_Royal_grapes.jpg' },
  { id: 'peach', category: 'agriculture', name: 'もも', kana: 'もも', emoji: '🍑', prefCode: '19', hint: '山梨県・福島県が二大産地。', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/de/Illustration_Prunus_persica0.jpg/320px-Illustration_Prunus_persica0.jpg' },
  { id: 'cherry', category: 'agriculture', name: 'さくらんぼ', kana: 'さくらんぼ', emoji: '🍒', prefCode: '06', hint: '山形県が全国の約7割。「佐藤錦」が有名。', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2d/W_outou4051.jpg/320px-W_outou4051.jpg' },
  { id: 'pear-jp', category: 'agriculture', name: 'なし', kana: 'なし', emoji: '🍐', prefCode: '12', hint: '日本なしは千葉県・茨城県・栃木県でさかん。', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/Pear-tree%2Ckatori-city%2Cjapan.JPG/320px-Pear-tree%2Ckatori-city%2Cjapan.JPG' },
  { id: 'pear-la', category: 'agriculture', name: 'ようなし', kana: 'ようなし', emoji: '🍐', prefCode: '06', hint: '洋なし(ラ・フランス)は山形県が全国1位。', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/Pears.jpg/320px-Pears.jpg' },
  { id: 'melon', category: 'agriculture', name: 'メロン', kana: 'めろん', emoji: '🍈', prefCode: '08', hint: '茨城県の鉾田市が中心。北海道(夕張)も有名。', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Cucumis_melo_var._reticulatus_%28photo_by_Scott_Bauer%29.jpg/320px-Cucumis_melo_var._reticulatus_%28photo_by_Scott_Bauer%29.jpg' },
  { id: 'watermelon', category: 'agriculture', name: 'すいか', kana: 'すいか', emoji: '🍉', prefCode: '43', hint: '熊本県が全国1位。千葉県・山形県も多い。', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Citrullus_lanatus5SHSU.jpg/320px-Citrullus_lanatus5SHSU.jpg' },
  { id: 'mango', category: 'agriculture', name: 'マンゴー', kana: 'まんごー', emoji: '🥭', prefCode: '47', hint: '沖縄県と宮崎県がほぼ全量。', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ee/Mango_and_cross_section_edit.jpg/320px-Mango_and_cross_section_edit.jpg' },
  { id: 'pineapple', category: 'agriculture', name: 'パイナップル', kana: 'ぱいなっぷる', emoji: '🍍', prefCode: '47', hint: '沖縄県が日本唯一の産地。', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/be/Ananas_pflanze.jpg/320px-Ananas_pflanze.jpg' },
  { id: 'ume', category: 'agriculture', name: 'うめ', kana: 'うめ', emoji: '🟢', prefCode: '30', hint: '和歌山県が全国の約6割。南高梅が有名。', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Prunus_mume.JPG/320px-Prunus_mume.JPG' },
  { id: 'yuzu', category: 'agriculture', name: 'ゆず', kana: 'ゆず', emoji: '🍋', prefCode: '39', hint: '高知県が全国1位。', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Yuzu_oranges_%286459456959%29.jpg/320px-Yuzu_oranges_%286459456959%29.jpg' },
  { id: 'lemon', category: 'agriculture', name: 'レモン', kana: 'れもん', emoji: '🍋', prefCode: '34', hint: '広島県の瀬戸内海の島(生口島)が有名。', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Citrus_x_limon_-_K%C3%B6hler%E2%80%93s_Medizinal-Pflanzen-041.jpg/320px-Citrus_x_limon_-_K%C3%B6hler%E2%80%93s_Medizinal-Pflanzen-041.jpg' },

  // ─────────── 野菜 ───────────
  { id: 'lettuce', category: 'agriculture', name: 'レタス', kana: 'れたす', emoji: '🥬', prefCode: '20', hint: '長野県の高原野菜(野辺山・川上)。夏に多い。', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/Lettuce_iceberg_variety.jpeg/320px-Lettuce_iceberg_variety.jpeg' },
  { id: 'cabbage', category: 'agriculture', name: 'キャベツ', kana: 'きゃべつ', emoji: '🥗', prefCode: '23', hint: '愛知県(田原)と群馬県(嬬恋)が二大産地。', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/Cabbage.jpg/320px-Cabbage.jpg' },
  { id: 'chinese-cabbage', category: 'agriculture', name: 'はくさい', kana: 'はくさい', emoji: '🥬', prefCode: '08', hint: '茨城県と長野県でほぼ半分。', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/39/Starr_070730-7855_Brassica_rapa.jpg/320px-Starr_070730-7855_Brassica_rapa.jpg' },
  { id: 'potato', category: 'agriculture', name: 'じゃがいも', kana: 'じゃがいも', emoji: '🥔', prefCode: '01', hint: '北海道が全国の約8割。十勝が中心。', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/Potatoes.jpg/320px-Potatoes.jpg' },
  { id: 'onion', category: 'agriculture', name: 'たまねぎ', kana: 'たまねぎ', emoji: '🧅', prefCode: '01', hint: '北海道(北見)が1位。佐賀・兵庫(淡路)も有名。', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Onions.jpg/320px-Onions.jpg' },
  { id: 'carrot', category: 'agriculture', name: 'にんじん', kana: 'にんじん', emoji: '🥕', prefCode: '01', hint: '北海道が1位。千葉県も多い。', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/94/Mrkva.JPG/320px-Mrkva.JPG' },
  { id: 'broccoli', category: 'agriculture', name: 'ブロッコリー', kana: 'ぶろっこりー', emoji: '🥦', prefCode: '01', hint: '北海道が1位。', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/Broccoli2.jpg/320px-Broccoli2.jpg' },
  { id: 'pumpkin', category: 'agriculture', name: 'かぼちゃ', kana: 'かぼちゃ', emoji: '🎃', prefCode: '01', hint: '北海道が全国1位。', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Cucurbita_2011_G1_Large.jpg/320px-Cucurbita_2011_G1_Large.jpg' },
  { id: 'corn', category: 'agriculture', name: 'スイートコーン', kana: 'すいーとこーん', emoji: '🌽', prefCode: '01', hint: '北海道が全国1位。', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/79/VegCorn.jpg/320px-VegCorn.jpg' },
  { id: 'tomato', category: 'agriculture', name: 'トマト', kana: 'とまと', emoji: '🍅', prefCode: '43', hint: '熊本県が1位。北海道・愛知も多い。', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/Tomatoes-on-the-bush.jpg/320px-Tomatoes-on-the-bush.jpg' },
  { id: 'eggplant', category: 'agriculture', name: 'なす', kana: 'なす', emoji: '🍆', prefCode: '39', hint: '高知県が1位。冬でもとれるハウス栽培。', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fb/Aubergine.jpg/320px-Aubergine.jpg' },
  { id: 'cucumber', category: 'agriculture', name: 'きゅうり', kana: 'きゅうり', emoji: '🥒', prefCode: '45', hint: '宮崎県が1位。促成栽培で有名。', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/ARS_cucumber.jpg/320px-ARS_cucumber.jpg' },
  { id: 'piman', category: 'agriculture', name: 'ピーマン', kana: 'ぴーまん', emoji: '🫑', prefCode: '08', hint: '茨城県が1位。宮崎県も多い。', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/74/GreenPeppers.jpg/320px-GreenPeppers.jpg' },
  { id: 'sweetpotato', category: 'agriculture', name: 'さつまいも', kana: 'さつまいも', emoji: '🍠', prefCode: '46', hint: '鹿児島県が1位。シラス台地で栽培。', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Ipomoea_batatas.jpg/320px-Ipomoea_batatas.jpg' },
  { id: 'satoimo', category: 'agriculture', name: 'さといも', kana: 'さといも', emoji: '🥔', prefCode: '11', hint: '埼玉県が全国1位。', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/Colocasia_esculenta_in_Gwangju_Korea.JPG/320px-Colocasia_esculenta_in_Gwangju_Korea.JPG' },
  { id: 'daikon', category: 'agriculture', name: 'だいこん', kana: 'だいこん', emoji: '🥕', prefCode: '12', hint: '千葉県・北海道が2大産地。', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Daikon.Japan.jpg/320px-Daikon.Japan.jpg' },
  { id: 'negi', category: 'agriculture', name: 'ねぎ', kana: 'ねぎ', emoji: '🌱', prefCode: '12', hint: '千葉県が全国1位。', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/Scallion_Negi.jpg/320px-Scallion_Negi.jpg' },
  { id: 'spinach', category: 'agriculture', name: 'ほうれんそう', kana: 'ほうれんそう', emoji: '🥬', prefCode: '12', hint: '千葉県と埼玉県が2大産地。', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Spinach_produce-1.jpg/320px-Spinach_produce-1.jpg' },
  { id: 'renkon', category: 'agriculture', name: 'れんこん', kana: 'れんこん', emoji: '🪷', prefCode: '08', hint: '茨城県(霞ヶ浦周辺)が全国1位。', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/27/Lotus_root.jpg/320px-Lotus_root.jpg' },
  { id: 'gobo', category: 'agriculture', name: 'ごぼう', kana: 'ごぼう', emoji: '🌱', prefCode: '02', hint: '青森県が全国1位。', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/W_gobou4031.jpg/320px-W_gobou4031.jpg' },
  { id: 'konnyaku', category: 'agriculture', name: 'こんにゃくいも', kana: 'こんにゃくいも', emoji: '🌱', prefCode: '10', hint: '群馬県が全国の約9割。', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/Amorphophallus_konjac_CBM.png/320px-Amorphophallus_konjac_CBM.png' },
  { id: 'nira', category: 'agriculture', name: 'にら', kana: 'にら', emoji: '🌿', prefCode: '39', hint: '高知県が全国1位。', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/W_nira4081.jpg/320px-W_nira4081.jpg' },
  { id: 'shiitake', category: 'agriculture', name: 'しいたけ', kana: 'しいたけ', emoji: '🍄', prefCode: '44', hint: '乾しいたけは大分県が全国1位。', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/64/Shiitakegrowing.jpg/320px-Shiitakegrowing.jpg' },
  { id: 'goya', category: 'agriculture', name: 'ゴーヤ', kana: 'ごーや', emoji: '🥒', prefCode: '47', hint: '沖縄県の代表的な野菜。', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/Momordica_charantia1.jpg/320px-Momordica_charantia1.jpg' },
  { id: 'peanut', category: 'agriculture', name: 'らっかせい', kana: 'らっかせい', emoji: '🥜', prefCode: '12', hint: '千葉県が全国の約8割。', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Arachis_hypogaea_-_K%C3%B6hler%E2%80%93s_Medizinal-Pflanzen-163.jpg/320px-Arachis_hypogaea_-_K%C3%B6hler%E2%80%93s_Medizinal-Pflanzen-163.jpg' },

  // ─────────── 米・穀物・茶 ───────────
  { id: 'rice', category: 'agriculture', name: 'おこめ', kana: 'おこめ', emoji: '🌾', prefCode: '15', hint: '新潟県が全国1位。コシヒカリ。', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/27/Oryza_sativa_-_K%C3%B6hler%E2%80%93s_Medizinal-Pflanzen-232.jpg/320px-Oryza_sativa_-_K%C3%B6hler%E2%80%93s_Medizinal-Pflanzen-232.jpg' },
  { id: 'akitakomachi', category: 'agriculture', name: 'あきたこまち', kana: 'あきたこまち', emoji: '🌾', prefCode: '05', hint: '秋田県の銘柄米。' },
  { id: 'wheat', category: 'agriculture', name: 'こむぎ', kana: 'こむぎ', emoji: '🌾', prefCode: '01', hint: '北海道が全国の約7割。', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/01/Triticum_aestivum_-_K%C3%B6hler%E2%80%93s_Medizinal-Pflanzen-274.jpg/320px-Triticum_aestivum_-_K%C3%B6hler%E2%80%93s_Medizinal-Pflanzen-274.jpg' },
  { id: 'soybean', category: 'agriculture', name: 'だいず', kana: 'だいず', emoji: '🫘', prefCode: '01', hint: '北海道が1位。みそ・しょうゆの原料。', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/W_daizu4111.jpg/320px-W_daizu4111.jpg' },
  { id: 'buckwheat', category: 'agriculture', name: 'そば', kana: 'そば', emoji: '🌾', prefCode: '01', hint: '北海道が全国1位。長野も有名。', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Fagopyrum_esculentum0.jpg/320px-Fagopyrum_esculentum0.jpg' },
  { id: 'tea', category: 'agriculture', name: 'おちゃ', kana: 'おちゃ', emoji: '🍵', prefCode: '22', hint: '静岡県と鹿児島県が2大産地。', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Tea_time_%E3%81%8A%E8%8C%B6%E3%81%AE%E6%99%82%E9%96%93.jpg/320px-Tea_time_%E3%81%8A%E8%8C%B6%E3%81%AE%E6%99%82%E9%96%93.jpg' },
  { id: 'sugarcane', category: 'agriculture', name: 'さとうきび', kana: 'さとうきび', emoji: '🎋', prefCode: '47', hint: '沖縄県と鹿児島県(奄美)で生産。', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/74/Saccharum_officinarum_-_K%C3%B6hler%E2%80%93s_Medizinal-Pflanzen-125.jpg/320px-Saccharum_officinarum_-_K%C3%B6hler%E2%80%93s_Medizinal-Pflanzen-125.jpg' },
  { id: 'igusa', category: 'agriculture', name: 'いぐさ', kana: 'いぐさ', emoji: '🟩', prefCode: '43', hint: '熊本県(八代)が全国のほぼ全量。畳の原料。', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/Juncus_effuses.jpg/320px-Juncus_effuses.jpg' },

  // ─────────── 水産物 ───────────
  { id: 'tuna', category: 'fishery', name: 'まぐろ', kana: 'まぐろ', emoji: '🐟', prefCode: '22', hint: '静岡県焼津港が水揚げ量1位。', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/Fish4499_-_Flickr_-_NOAA_Photo_Library.jpg/320px-Fish4499_-_Flickr_-_NOAA_Photo_Library.jpg' },
  { id: 'katsuo', category: 'fishery', name: 'かつお', kana: 'かつお', emoji: '🐟', prefCode: '22', hint: '静岡県(焼津)・高知県でさかん。', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Kapel_u0.gif/320px-Kapel_u0.gif' },
  { id: 'sanma', category: 'fishery', name: 'さんま', kana: 'さんま', emoji: '🐟', prefCode: '01', hint: '北海道の根室・釧路が中心。' },
  { id: 'buri', category: 'fishery', name: 'ぶり', kana: 'ぶり', emoji: '🐟', prefCode: '42', hint: '長崎県・鹿児島県が養殖でさかん。', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Seriola_quinqueradiata_%28200810%29.jpg/320px-Seriola_quinqueradiata_%28200810%29.jpg' },
  { id: 'tai', category: 'fishery', name: 'たい', kana: 'たい', emoji: '🐟', prefCode: '38', hint: 'まだいの養殖は愛媛県が全国1位。', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Pagrus_major_Red_seabream_ja01.jpg/320px-Pagrus_major_Red_seabream_ja01.jpg' },
  { id: 'salmon', category: 'fishery', name: 'さけ', kana: 'さけ', emoji: '🐟', prefCode: '01', hint: '北海道がさけの水揚げ1位。', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Salmon_%28breeding_color%29.jpg/320px-Salmon_%28breeding_color%29.jpg' },
  { id: 'squid', category: 'fishery', name: 'いか', kana: 'いか', emoji: '🦑', prefCode: '02', hint: 'するめいかは青森県(八戸)が中心。', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Todarodes_pacificus_ruler.jpg/320px-Todarodes_pacificus_ruler.jpg' },
  { id: 'crab', category: 'fishery', name: 'かに', kana: 'かに', emoji: '🦀', prefCode: '01', hint: '北海道が全国の約9割。', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Brachyura_montage.jpg/320px-Brachyura_montage.jpg' },
  { id: 'scallop', category: 'fishery', name: 'ホタテ', kana: 'ほたて', emoji: '🐚', prefCode: '01', hint: '北海道と青森県(陸奥湾)が2大産地。', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/Japan_sea_animal%2C_Ezo_giant_scallop_%28Mizuhopecten_yessoensis%29_%2815152229484%29.jpg/320px-Japan_sea_animal%2C_Ezo_giant_scallop_%28Mizuhopecten_yessoensis%29_%2815152229484%29.jpg' },
  { id: 'oyster', category: 'fishery', name: 'かき', kana: 'かき', emoji: '🦪', prefCode: '34', hint: '広島県が全国の約6割。', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/28/Huitres_Cancale.jpg/320px-Huitres_Cancale.jpg' },
  { id: 'uni', category: 'fishery', name: 'うに', kana: 'うに', emoji: '🟧', prefCode: '01', hint: '北海道が全国1位。', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2d/Echinometra_mathaei_MHNT_Philippines.jpg/320px-Echinometra_mathaei_MHNT_Philippines.jpg' },
  { id: 'fugu', category: 'fishery', name: 'ふぐ', kana: 'ふぐ', emoji: '🐡', prefCode: '35', hint: '山口県下関市が集積地として有名。', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/25/Fugu_in_Tank.jpg/320px-Fugu_in_Tank.jpg' },
  { id: 'eel', category: 'fishery', name: 'うなぎ', kana: 'うなぎ', emoji: '🍣', prefCode: '46', hint: '養殖うなぎは鹿児島県が全国1位。', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/Anguilla_anguilla.jpg/320px-Anguilla_anguilla.jpg' },
  { id: 'nori', category: 'fishery', name: 'のり', kana: 'のり', emoji: '🟫', prefCode: '41', hint: '佐賀県(有明海)が全国1位。', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/be/Nori.jpg/320px-Nori.jpg' },
  { id: 'konbu', category: 'fishery', name: 'こんぶ', kana: 'こんぶ', emoji: '🟩', prefCode: '01', hint: '北海道が全国の約9割。', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7d/Kelp_in_Neskowin.jpg/320px-Kelp_in_Neskowin.jpg' },
  { id: 'wakame', category: 'fishery', name: 'わかめ', kana: 'わかめ', emoji: '🟢', prefCode: '03', hint: '岩手県・宮城県(三陸)で多い。', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/CSIRO_ScienceImage_904_Undaria_pinnatifida_Japanese_kelp.jpg/320px-CSIRO_ScienceImage_904_Undaria_pinnatifida_Japanese_kelp.jpg' },
  { id: 'pearl', category: 'fishery', name: 'しんじゅ', kana: 'しんじゅ', emoji: '⚪', prefCode: '38', hint: '愛媛県(宇和海)が全国1位。三重県(英虞湾)もミキモト発祥地。', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Various_pearls.jpg/320px-Various_pearls.jpg' },

  // ─────────── 畜産・乳製品 ───────────
  { id: 'milk', category: 'livestock', name: 'ぎゅうにゅう', kana: 'ぎゅうにゅう', emoji: '🥛', prefCode: '01', hint: '北海道が生乳の約半分。十勝・根釧台地。', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Milk_glass.jpg/320px-Milk_glass.jpg' },
  { id: 'butter', category: 'livestock', name: 'バター', kana: 'ばたー', emoji: '🧈', prefCode: '01', hint: '北海道が全国1位。', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/NCI_butter.jpg/320px-NCI_butter.jpg' },
  { id: 'cheese', category: 'livestock', name: 'チーズ', kana: 'ちーず', emoji: '🧀', prefCode: '01', hint: '北海道が全国1位。', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/Camembert.jpg/320px-Camembert.jpg' },
  { id: 'beef', category: 'livestock', name: 'にくぎゅう', kana: 'にくぎゅう', emoji: '🐄', prefCode: '46', hint: '飼育頭数は鹿児島県・北海道が二大。', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Prime.jpg/320px-Prime.jpg' },
  { id: 'pork', category: 'livestock', name: 'ぶたにく', kana: 'ぶたにく', emoji: '🐖', prefCode: '46', hint: '鹿児島県が全国1位。', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Pork.jpg/320px-Pork.jpg' },
  { id: 'chicken', category: 'livestock', name: 'にわとり(ブロイラー)', kana: 'にわとり', emoji: '🐔', prefCode: '45', hint: '宮崎県と鹿児島県がブロイラーの2大産地。', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/%E3%83%96%E3%83%AD%E3%82%A4%E3%83%A9%E3%83%BC%E4%B8%AD%E9%9B%9B.jpg/320px-%E3%83%96%E3%83%AD%E3%82%A4%E3%83%A9%E3%83%BC%E4%B8%AD%E9%9B%9B.jpg' },
  { id: 'egg', category: 'livestock', name: 'たまご', kana: 'たまご', emoji: '🥚', prefCode: '08', hint: '茨城県が全国1位。', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Chicken_eggs.jpg/320px-Chicken_eggs.jpg' },

  // ─────────── 工業製品 ───────────
  { id: 'car', category: 'industry', name: 'じどうしゃ', kana: 'じどうしゃ', emoji: '🚗', prefCode: '23', hint: '愛知県豊田市が中心。中京工業地帯。', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/02_Stau_Verkehrsstau_-_heavy_traffic_congestion_in_Budapest_city%2C_Hungary.jpg/320px-02_Stau_Verkehrsstau_-_heavy_traffic_congestion_in_Budapest_city%2C_Hungary.jpg' },
  { id: 'steel', category: 'industry', name: 'てっこう', kana: 'てっこう', emoji: '🏭', prefCode: '12', hint: '千葉県(君津)・愛知県(東海)が代表的。', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/Iron_electrolytic_and_1cm3_cube.jpg/320px-Iron_electrolytic_and_1cm3_cube.jpg' },
  { id: 'petrochemical', category: 'industry', name: 'せきゆかがく', kana: 'せきゆかがく', emoji: '⛽', prefCode: '24', hint: '三重県四日市市。コンビナートで有名。', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/61/Ethylene_oxide_refrigerated_liquid.jpg/320px-Ethylene_oxide_refrigerated_liquid.jpg' },
  { id: 'shipbuilding', category: 'industry', name: 'ぞうせん', kana: 'ぞうせん', emoji: '🚢', prefCode: '42', hint: '長崎県・広島県(呉)・兵庫県(神戸)で発達。', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Pizarroshipbuilding.jpg/320px-Pizarroshipbuilding.jpg' },
  { id: 'paper', category: 'industry', name: 'かみ・パルプ', kana: 'かみぱるぷ', emoji: '📄', prefCode: '38', hint: '愛媛県四国中央市が全国1位。', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Florida_Pulp_and_Paper_Company_mill%2C_Cantonment%2C_Florida.jpg/320px-Florida_Pulp_and_Paper_Company_mill%2C_Cantonment%2C_Florida.jpg' },
  { id: 'cement', category: 'industry', name: 'セメント', kana: 'せめんと', emoji: '🧱', prefCode: '35', hint: '山口県(宇部・周南)が代表的な産地。石灰石。', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Firestop_mortar_mixing.jpg/320px-Firestop_mortar_mixing.jpg' },
  { id: 'semiconductor', category: 'industry', name: 'はんどうたい', kana: 'はんどうたい', emoji: '💾', prefCode: '43', hint: '熊本県(菊陽町・TSMC)・三重・山形が中心。', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Raspberry_Pi_3_%2824986543980%29.png/320px-Raspberry_Pi_3_%2824986543980%29.png' },
  { id: 'towel', category: 'industry', name: 'タオル', kana: 'たおる', emoji: '🛁', prefCode: '38', hint: '愛媛県今治市が全国1位。', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Towels.JPG/320px-Towels.JPG' },
  { id: 'glasses', category: 'industry', name: 'めがね', kana: 'めがね', emoji: '👓', prefCode: '18', hint: '福井県鯖江市が国内の約9割。', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Glasses%26Chart.jpg/320px-Glasses%26Chart.jpg' },
  { id: 'piano', category: 'industry', name: 'ピアノ', kana: 'ぴあの', emoji: '🎹', prefCode: '22', hint: '静岡県浜松市が国内のほぼ全量。', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/Two_pianos_-_grand_piano_and_upright_piano.jpg/320px-Two_pianos_-_grand_piano_and_upright_piano.jpg' },
  { id: 'tableware', category: 'industry', name: 'ようしょっき', kana: 'ようしょっき', emoji: '🍴', prefCode: '15', hint: '新潟県燕市が国内のほぼ全量。', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Silbertafel_Reiss_3_rem.jpg/320px-Silbertafel_Reiss_3_rem.jpg' },
  { id: 'knife', category: 'industry', name: 'はもの', kana: 'はもの', emoji: '🔪', prefCode: '21', hint: '岐阜県関市・新潟県三条市・大阪府堺市が有名。', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/Four_chef%27s_knives_and_an_paring_knife.jpg/320px-Four_chef%27s_knives_and_an_paring_knife.jpg' },

  // ─────────── 伝統工芸品 ───────────
  { id: 'nishijin', category: 'craft', name: 'にしじんおり', kana: 'にしじんおり', emoji: '🧵', prefCode: '26', hint: '京都府の高級織物。', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/Fukuro_obi.JPG/320px-Fukuro_obi.JPG' },
  { id: 'kyo-yuzen', category: 'craft', name: 'きょうゆうぜん', kana: 'きょうゆうぜん', emoji: '👘', prefCode: '26', hint: '京都府の染物。加賀友禅は石川県。', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/%E5%8D%97%E9%80%B2%E4%B8%80%E9%83%8E%E6%B0%8F%E3%81%AE%E9%81%8E%E5%8E%BB%E3%81%AE%E5%8F%97%E8%B3%9E%E4%BD%9C%E5%93%81%E3%81%A7%E3%80%81%E5%8F%8B%E7%A6%85%E6%9F%93%E3%82%81%E3%81%A7%E3%81%AE%E7%9D%80%E7%89%A9%E4%BD%9C%E5%93%81%EF%BC%93.jpg/320px-%E5%8D%97%E9%80%B2%E4%B8%80%E9%83%8E%E6%B0%8F%E3%81%AE%E9%81%8E%E5%8E%BB%E3%81%AE%E5%8F%97%E8%B3%9E%E4%BD%9C%E5%93%81%E3%81%A7%E3%80%81%E5%8F%8B%E7%A6%85%E6%9F%93%E3%82%81%E3%81%A7%E3%81%AE%E7%9D%80%E7%89%A9%E4%BD%9C%E5%93%81%EF%BC%93.jpg' },
  { id: 'kiyomizu', category: 'craft', name: 'きよみずやき', kana: 'きよみずやき', emoji: '🍵', prefCode: '26', hint: '京都府の焼き物。', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8b/Openwork_Hexagonal_Ko-Kiyomizu_Ware_Bowl%2C_c._1731-1752%2C_Japan%2C_artist_unknown%2C_stoneware_with_overglaze_enamels_-_Art_Institute_of_Chicago_-_DSC00215.JPG/320px-Openwork_Hexagonal_Ko-Kiyomizu_Ware_Bowl%2C_c._1731-1752%2C_Japan%2C_artist_unknown%2C_stoneware_with_overglaze_enamels_-_Art_Institute_of_Chicago_-_DSC00215.JPG' },
  { id: 'wajima', category: 'craft', name: 'わじまぬり', kana: 'わじまぬり', emoji: '🥢', prefCode: '17', hint: '石川県の漆器。能登半島。', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/Wajimanurie.JPG/320px-Wajimanurie.JPG' },
  { id: 'kutani', category: 'craft', name: 'くたにやき', kana: 'くたにやき', emoji: '🍵', prefCode: '17', hint: '石川県の焼き物。', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/KUTANI_Ewer.JPG/320px-KUTANI_Ewer.JPG' },
  { id: 'kaga-yuzen', category: 'craft', name: 'かがゆうぜん', kana: 'かがゆうぜん', emoji: '👘', prefCode: '17', hint: '石川県の染物。', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/%E5%8A%A0%E8%B3%80%E5%8F%8B%E7%A6%85%E6%9F%93%E5%85%83_%E5%B0%8F%E5%B7%9D%E6%A0%AA%E5%BC%8F%E4%BC%9A%E7%A4%BE.jpg/320px-%E5%8A%A0%E8%B3%80%E5%8F%8B%E7%A6%85%E6%9F%93%E5%85%83_%E5%B0%8F%E5%B7%9D%E6%A0%AA%E5%BC%8F%E4%BC%9A%E7%A4%BE.jpg' },
  { id: 'nanbu-tetsubin', category: 'craft', name: 'なんぶてっき', kana: 'なんぶてっき', emoji: '🫖', prefCode: '03', hint: '岩手県盛岡市の鉄器。', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/Nambu_Tetsubin.jpg/320px-Nambu_Tetsubin.jpg' },
  { id: 'tsugaru-nuri', category: 'craft', name: 'つがるぬり', kana: 'つがるぬり', emoji: '🥢', prefCode: '02', hint: '青森県弘前の漆器。', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Tsugaru_lacquerware_%28Tsugarunuri%29.jpg/320px-Tsugaru_lacquerware_%28Tsugarunuri%29.jpg' },
  { id: 'kokeshi', category: 'craft', name: 'こけし', kana: 'こけし', emoji: '🪆', prefCode: '04', hint: '宮城県(鳴子)など東北各地でつくられる人形。', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/Syoji.jpg/320px-Syoji.jpg' },
  { id: 'shigaraki', category: 'craft', name: 'しがらきやき', kana: 'しがらきやき', emoji: '🍵', prefCode: '25', hint: '滋賀県甲賀市の焼き物。たぬきの置物が有名。', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/37/Jar%2C_Anonymous_LACMA_63.16.1.jpg/320px-Jar%2C_Anonymous_LACMA_63.16.1.jpg' },
  { id: 'mino-yaki', category: 'craft', name: 'みのやき', kana: 'みのやき', emoji: '🍵', prefCode: '21', hint: '岐阜県(多治見・土岐)。和食器の生産量1位。', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/86/ORIBE_DISH.JPG/320px-ORIBE_DISH.JPG' },
  { id: 'mino-washi', category: 'craft', name: 'みのわし', kana: 'みのわし', emoji: '📜', prefCode: '21', hint: '岐阜県美濃市の和紙。', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/Mino_Washi_Akari_Art_Hall_ac_%282%29.jpg/320px-Mino_Washi_Akari_Art_Hall_ac_%282%29.jpg' },
  { id: 'echizen-washi', category: 'craft', name: 'えちぜんわし', kana: 'えちぜんわし', emoji: '📜', prefCode: '18', hint: '福井県の和紙。', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/db/Japanese_paper_making_03.jpg/320px-Japanese_paper_making_03.jpg' },
  { id: 'arita', category: 'craft', name: 'ありたやき', kana: 'ありたやき', emoji: '🍵', prefCode: '41', hint: '佐賀県有田町の磁器。伊万里港から出荷で伊万里焼とも。', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b0/ImariA.JPG/320px-ImariA.JPG' },
  { id: 'hagi', category: 'craft', name: 'はぎやき', kana: 'はぎやき', emoji: '🍵', prefCode: '35', hint: '山口県萩市の焼き物。', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Hagi_ware_Japanese_tea_bowl%2C_18th-19th_century%2C_Freer_Gallery_of_Art.jpg/320px-Hagi_ware_Japanese_tea_bowl%2C_18th-19th_century%2C_Freer_Gallery_of_Art.jpg' },
  { id: 'bizen', category: 'craft', name: 'びぜんやき', kana: 'びぜんやき', emoji: '🍵', prefCode: '33', hint: '岡山県備前市の焼き物。', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/Imbe_Bizen_Okayama_pref_Japan11n.jpg/320px-Imbe_Bizen_Okayama_pref_Japan11n.jpg' },
  { id: 'mashiko', category: 'craft', name: 'ましこやき', kana: 'ましこやき', emoji: '🍵', prefCode: '09', hint: '栃木県益子町の焼き物。', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Taisho-Showa_Period_Ko-Mashiko_Ware_Mado-e_Dobin_Window_Picture_Teapot_Brooklyn_Museum.jpg/320px-Taisho-Showa_Period_Ko-Mashiko_Ware_Mado-e_Dobin_Window_Picture_Teapot_Brooklyn_Museum.jpg' },
  { id: 'edo-kiriko', category: 'craft', name: 'えどきりこ', kana: 'えどきりこ', emoji: '🥃', prefCode: '13', hint: '東京都のガラス工芸。', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c6/Edokiriko.jpg/320px-Edokiriko.jpg' },
  { id: 'oshima-tsumugi', category: 'craft', name: 'おおしまつむぎ', kana: 'おおしまつむぎ', emoji: '👘', prefCode: '46', hint: '鹿児島県奄美大島の絹織物。', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Dyeing_Oshima-tsumugi.jpg/320px-Dyeing_Oshima-tsumugi.jpg' },
  { id: 'yuki-tsumugi', category: 'craft', name: 'ゆうきつむぎ', kana: 'ゆうきつむぎ', emoji: '👘', prefCode: '08', hint: '茨城県結城市の絹織物(栃木にもまたがる)。' },
  { id: 'kurume-kasuri', category: 'craft', name: 'くるめがすり', kana: 'くるめがすり', emoji: '👘', prefCode: '40', hint: '福岡県久留米市の綿織物。', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/Kurume_Kasuri_%28at_Hirokawa_Town_Industrial_Exhibition_Hall%29_02.jpg/320px-Kurume_Kasuri_%28at_Hirokawa_Town_Industrial_Exhibition_Hall%29_02.jpg' },
  { id: 'hakata-ningyo', category: 'craft', name: 'はかたにんぎょう', kana: 'はかたにんぎょう', emoji: '🎎', prefCode: '40', hint: '福岡県の伝統的な人形。', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/%E6%AD%A6%E8%80%85%E4%BA%BA%E5%BD%A2.jpg/320px-%E6%AD%A6%E8%80%85%E4%BA%BA%E5%BD%A2.jpg' },
  { id: 'iwatsuki-hina', category: 'craft', name: 'いわつきひな', kana: 'いわつきひな', emoji: '🎎', prefCode: '11', hint: '埼玉県さいたま市岩槻区。ひな人形の生産で有名。', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Iwatsukiningyo.jpg/320px-Iwatsukiningyo.jpg' },
  { id: 'tokoname', category: 'craft', name: 'とこなめやき', kana: 'とこなめやき', emoji: '🍵', prefCode: '23', hint: '愛知県常滑市の焼き物。急須が有名。', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/Yakimonosanpomichi2.JPG/320px-Yakimonosanpomichi2.JPG' },
  { id: 'seto-yaki', category: 'craft', name: 'せとやき', kana: 'せとやき', emoji: '🍵', prefCode: '23', hint: '愛知県瀬戸市の焼き物。「せともの」の語源。', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/Found_MUJI_Setoyaki_%286910176253%29.jpg/320px-Found_MUJI_Setoyaki_%286910176253%29.jpg' },
];
