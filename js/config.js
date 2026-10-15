/* ============================================================
   LICO PET original ショップ設定
   ・商品名、価格、色、書体などはここを書き換えます
   ・価格を変えたときは、GAS（Code.gs）の CONFIG.PRODUCTS も同じ金額にしてください
   ・スマホケースの機種一覧は js/models.js にあります
   ============================================================ */
window.LICO_SHOP = {
  // GASのウェブアプリURL（デプロイ後に貼り付け。空欄のままだと注文は送信されません）
  GAS_URL: "https://script.google.com/macros/s/AKfycbxqKozNHchOpsDdxQfzSpkGXcCbiVhPapP05zLj41omgdRF4J-B6IlIIgb8EAHRDF9JVg/exec",

  SHOP_NAME: "LICO PET original",
  SHIPPING_FEE: 0,          // 送料（0なら送料無料と表示）
  LINE_URL: "https://line.me/R/ti/p/@wvp9103a",
  LINE_ID: "@wvp9103a",

  // 全商品で共通の書体と文字の色
  DESIGN: {
    // 書体：label は印刷のときに探せる正式な書体名（すべて無料・商用利用OKのGoogle Fonts）
    fonts: [
      { id: "notosans",  label: "Noto Sans JP（ゴシック）",           family: "'Noto Sans JP', sans-serif",      weight: 700 },
      { id: "zenmaru",   label: "Zen Maru Gothic（丸ゴシック）",       family: "'Zen Maru Gothic', sans-serif",   weight: 700 },
      { id: "mplusr",    label: "M PLUS Rounded 1c（丸ゴシック）",     family: "'M PLUS Rounded 1c', sans-serif", weight: 800 },
      { id: "notoserif", label: "Noto Serif JP（明朝）",               family: "'Noto Serif JP', serif",          weight: 700 },
      { id: "shippori",  label: "Shippori Mincho（しっぽり明朝）",     family: "'Shippori Mincho', serif",        weight: 600 },
      { id: "klee",      label: "Klee One（クレー・手書き風）",         family: "'Klee One', cursive",             weight: 600 },
      { id: "yomogi",    label: "Yomogi（よもぎ・手書き風）",           family: "'Yomogi', cursive",               weight: 400 },
      { id: "kaisei",    label: "Kaisei Decol（解星デコール）",         family: "'Kaisei Decol', serif",           weight: 700 },
      { id: "dancing",   label: "Dancing Script（英字・筆記体）",       family: "'Dancing Script', cursive",       weight: 600 },
      { id: "greatv",    label: "Great Vibes（英字・筆記体）",          family: "'Great Vibes', cursive",          weight: 400 },
      { id: "pacifico",  label: "Pacifico（英字・ポップ）",             family: "'Pacifico', cursive",             weight: 400 },
      { id: "playfair",  label: "Playfair Display（英字・クラシック）", family: "'Playfair Display', serif",       weight: 700 },
      { id: "jost",      label: "Jost（英字・シンプル）",               family: "'Jost', sans-serif",              weight: 500 }
    ],
    // よく使う文字の色（名前つき）。このほかに100色と自由選択がある
    colors: [
      { id: "white", label: "ホワイト", hex: "#ffffff" },
      { id: "black", label: "ブラック", hex: "#1b1b1b" },
      { id: "gold",  label: "ゴールド", hex: "#c9a24a" },
      { id: "silver",label: "シルバー", hex: "#a8a9ad" },
      { id: "pink",  label: "ピンク",   hex: "#e58fa8" },
      { id: "red",   label: "レッド",   hex: "#d7263d" },
      { id: "orange",label: "オレンジ", hex: "#f08a24" },
      { id: "yellow",label: "イエロー", hex: "#f4c430" },
      { id: "green", label: "グリーン", hex: "#3a9d5d" },
      { id: "sky",   label: "水色",     hex: "#5bb8e6" },
      { id: "navy",  label: "ネイビー", hex: "#1f3a68" },
      { id: "purple",label: "パープル", hex: "#8a5cc2" },
      { id: "brown", label: "ブラウン", hex: "#7a5c43" },
      { id: "beige", label: "ベージュ", hex: "#d8c3a5" }
    ]
  },

  shipNote: "ご注文（お支払い）の確認後、1か月ほどで発送します。\n店頭受け取りの場合は、できあがり次第ご連絡します。",
  faq: [
    { q: "どんな写真が使えますか？", a: "スマホで撮った写真で大丈夫です。明るく、ピントの合った写真ほどきれいに仕上がります。ほかの方が撮った写真や、キャラクターなど権利のある画像はご利用いただけません。" },
    { q: "写真をあとから送ることはできますか？", a: "できません。写真はご注文のその場でアップロードしてください。写真の送信が終わると「写真を受け付けました」と表示されます。" },
    { q: "注文後に内容を変えられますか？", a: "製作を始める前であれば変更できます。LINEで注文番号をお知らせください。" },
    { q: "スマホケースは、どの機種に対応していますか？", a: "iPhoneのほか、Galaxy・Xperia・AQUOS・Google Pixel・arrows・OPPOなど600機種以上に対応しています。「デザインする」を押すと、機種の一覧から選べます。" }
  ],

  /* 商品（並び順のとおりに表示）
     kind：phone＝機種を選ぶ／color＝色を選ぶ／variant＝種類で値段が変わる／none＝選ぶものなし
     print：印刷用の大きさ（px）と形。base＝写真を置かない部分に見える素材の色（印刷しない） */
  PRODUCTS: [
    {
      id: "phone", kind: "phone", series: "PHOTO CASE SERIES",
      name: "写真でつくるオリジナルスマホケース", short: "スマホケース", price: 5500,
      lead: "お気に入りの写真が、世界にひとつのスマホケースに。\niPhoneはもちろん、Galaxy・Xperia・AQUOS・Pixelなど600機種以上からお選びいただけます。",
      images: ["img/sample-work.jpg"], optionLabel: "機種",
      points: ["iPhone・Android 600機種以上に対応", "画面の上で、写真の位置・大きさ・向きを自由に決められます", "機種ごとのカメラの位置に合わせた形で確認できます"],
      note: "ケースの形とカメラの位置は目安です。印刷はカメラの穴をよけて仕上げます。"
    },
    {
      id: "keycase", kind: "color", series: "LEATHER SERIES",
      name: "写真でつくる本革キーケース", short: "キーケース", price: 5500,
      lead: "毎日持ち歩く鍵を、うちの子の写真といっしょに。\nやわらかな牛本革のキーケースに、写真や名前をプリントします。",
      images: ["img/keycase.svg"], optionLabel: "色",
      size: "縦 約10cm × 横 約5.5cm × 厚さ 約2cm（キーフック6連・ナスカン付き）",
      points: ["牛本革・男女兼用", "全12色から選べます", "表面に写真と文字をプリント"],
      colors: [
        { label: "ブラック", hex: "#1f1f1f" }, { label: "ダークブラウン", hex: "#4a3024" }, { label: "ライトブラウン", hex: "#a8744a" },
        { label: "レッド", hex: "#b5302f" }, { label: "オレンジ", hex: "#d9792b" }, { label: "イエロー", hex: "#e2b33c" },
        { label: "グリーン", hex: "#4f7a4a" }, { label: "ブルー", hex: "#2f5d9a" }, { label: "パープル", hex: "#6b4a7a" },
        { label: "ピンク", hex: "#df7fa0" }, { label: "ライトピンク", hex: "#f2c1cc" }, { label: "サーモンピンク", hex: "#e89a86" }
      ],
      print: { w: 1100, h: 2000, shape: "round", r: 120, baseLabel: "革の色のまま（印刷しない）" },
      note: "革の色によって、写真の色の見え方が少し変わります。明るい色の革ほど写真がはっきり出ます。"
    },
    {
      id: "cardcase", kind: "variant", series: "CARD CASE SERIES",
      name: "写真でつくるメタル名刺入れ", short: "名刺入れ", price: 4400,
      lead: "ステンレスの名刺入れに、好きな写真をプリント。\n名刺を渡すたびに話がはずむ、自分だけの名刺入れです。",
      images: ["img/cardcase.jpg"], optionLabel: "仕上げ",
      variants: [
        { id: "2d", label: "2D（平面プリント）", price: 4400, desc: "写真をそのままきれいに印刷します" },
        { id: "3d", label: "3D（立体プリント）", price: 5500, desc: "インクを重ねて盛り上げ、さわると凹凸のある仕上がりにします" }
      ],
      points: ["2D 4,400円／3D 5,500円（税込）", "ステンレス製", "名刺がおよそ20枚入ります"],
      print: { w: 1122, h: 709, shape: "round", r: 24, base: "#c7c9cc", baseLabel: "ステンレスの地のまま（印刷しない）" },
      note: "写真を置かない部分は、ステンレスの銀色のまま仕上がります。"
    },
    {
      id: "interior", kind: "none", series: "INTERIOR SERIES",
      name: "写真でつくるインテリアボード", short: "インテリアボード", price: 4400,
      lead: "お部屋に飾れる、木のボードに写真をプリント。\n愛車やペット、家族の写真を、木目をいかしたやさしい風合いで仕上げます。",
      images: ["img/interior.jpg"], optionLabel: "",
      points: ["木製（持ち手と穴つきで、壁に掛けられます）", "木目がうっすら見える仕上がり", "プレゼントにもおすすめ"],
      print: { w: 1200, h: 1960, shape: "board", base: "#ece6dc", baseLabel: "木の地のまま（印刷しない）" },
      note: "木目が透けて見えるため、写真は少し落ち着いた色合いになります。"
    }
  ]
};
// 以前の画面との互換用（スマホケース）
window.LICO_SHOP.PRODUCT = Object.assign({}, window.LICO_SHOP.PRODUCTS[0], window.LICO_SHOP.DESIGN, { shipNote: window.LICO_SHOP.shipNote, faq: window.LICO_SHOP.faq });
