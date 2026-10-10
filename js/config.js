/* ============================================================
   LICO PET original ショップ設定
   ・商品名、価格、機種、書体などはここを書き換えます
   ・価格を変えたときは、GAS（Code.gs）の CONFIG.PRICE も同じ金額にしてください
   ============================================================ */
window.LICO_SHOP = {
  // GASのウェブアプリURL（デプロイ後に貼り付け。空欄のままだと注文は送信されません）
  GAS_URL: "https://script.google.com/macros/s/AKfycbxqKozNHchOpsDdxQfzSpkGXcCbiVhPapP05zLj41omgdRF4J-B6IlIIgb8EAHRDF9JVg/exec",

  SHOP_NAME: "LICO PET original",
  SHIPPING_FEE: 0,          // 送料（0なら送料無料と表示）
  LINE_URL: "https://line.me/R/ti/p/@wvp9103a",
  LINE_ID: "@wvp9103a",

  PRODUCT: {
    id: "iphone-case",
    series: "PHOTO CASE SERIES",
    name: "写真でつくるオリジナルiPhoneケース",
    price: 5500,            // 税込
    lead: "お気に入りの写真が、世界にひとつのiPhoneケースに。\nうちの子の写真や思い出の一枚で、毎日持ち歩けるケースをおつくりします。",
    note: "※お名前・メッセージは、全角10文字・半角20文字まで入れられます（入れなくても作れます）。",
    images: ["img/sample-work.jpg"],
    // 取り扱い機種（実際に作れる機種に合わせて直してください）
    models: [
      "iPhone 17 Pro Max", "iPhone 17 Pro", "iPhone Air", "iPhone 17",
      "iPhone 16 Pro Max", "iPhone 16 Pro", "iPhone 16 Plus", "iPhone 16", "iPhone 16e",
      "iPhone 15 Pro Max", "iPhone 15 Pro", "iPhone 15 Plus", "iPhone 15",
      "iPhone 14 Pro Max", "iPhone 14 Pro", "iPhone 14 Plus", "iPhone 14",
      "iPhone 13 Pro Max", "iPhone 13 Pro", "iPhone 13", "iPhone 13 mini",
      "iPhone SE（第2・第3世代）"
    ],
    fonts: [
      { id: "maru",   label: "和文書体1", family: "'Zen Maru Gothic', sans-serif", sample: "もも" },
      { id: "mincho", label: "和文書体2", family: "'Shippori Mincho', serif",       sample: "もも" },
      { id: "hand",   label: "和文書体3", family: "'Yomogi', cursive",              sample: "もも" },
      { id: "script", label: "英文書体4", family: "'Dancing Script', cursive",      sample: "Momo" },
      { id: "sans",   label: "英文書体5", family: "'Jost', sans-serif",             sample: "MOMO" }
    ],
    colors: [
      { id: "white", label: "ホワイト", hex: "#ffffff" },
      { id: "black", label: "ブラック", hex: "#1b1b1b" },
      { id: "gold",  label: "ゴールド", hex: "#c9a24a" },
      { id: "pink",  label: "ピンク",   hex: "#e58fa8" }
    ],
    shipNote: "ご注文（お支払い）の確認後、10日前後で発送します。\n店頭受け取りの場合は、できあがり次第ご連絡します。",
    faq: [
      { q: "どんな写真が使えますか？", a: "スマホで撮った写真で大丈夫です。明るく、ピントの合った写真ほどきれいに仕上がります。ほかの方が撮った写真や、キャラクターなど権利のある画像はご利用いただけません。" },
      { q: "写真をあとから送ることはできますか？", a: "できません。写真はご注文のその場でアップロードしてください。写真の送信が終わると「写真を受け付けました」と表示されます。" },
      { q: "注文後に内容を変えられますか？", a: "製作を始める前であれば変更できます。LINEで注文番号をお知らせください。" }
    ]
  }
};
