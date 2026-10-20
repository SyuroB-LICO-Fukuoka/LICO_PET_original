/* ITTENMON チャットボット（よくある質問に自動で答える。AIは使わず、この中の答えだけを返す）
   ・答えを直すときは、下の QA の a（答え）を書き換える
   ・質問の言い回しを増やすときは、k（キーワード）に言葉を足す。先頭に ~ を付けた言葉は弱い手がかり（1点）
   ・cat はボタンで選ぶときの分類
   ・オーナー方針：チャットではLINE・メール・電話を案内しない。考えられる質問にはすべてここで答える */
(function(){
  const L = window.LICO; if(!L) return;
  const { S, yen, esc } = L;
  const P = id => S.PRODUCTS.find(p => p.id === id) || {};
  const priceOf = p => p.kind === "variant" ? p.variants.map(v => `${v.label.replace(/（.*/, "")} ${yen(v.price)}`).join("／") : yen(p.price);
  const link = (href, text) => `<a href="${href}">${text}</a>`;
  const LEGAL = link("tokushoho.html", "特定商取引法に基づく表記");
  const CATS = [
    { id: "item", label: "商品・値段" }, { id: "phone", label: "スマホケース" }, { id: "design", label: "写真・デザイン" },
    { id: "order", label: "注文・支払い" }, { id: "ship", label: "お届け・受け取り" }, { id: "after", label: "注文のあと" }, { id: "other", label: "その他" }
  ];

  /* ===== 質問と答え ===== */
  const QA = [
    /* --- 商品・値段 --- */
    { id: "price", cat: "item", label: "値段を知りたい", k: ["値段", "価格", "料金", "~いくら", "~円", "金額", "費用", "~高い", "~安い", "税込", "消費税"],
      a: () => `税込の価格です。<ul>${S.PRODUCTS.map(p => `<li>${link("product.html?id=" + p.id, esc(p.short))}：${priceOf(p)}</li>`).join("")}</ul>送料は無料、文字入れや背景を消すのも追加料金はかかりません。` },
    { id: "items", cat: "item", label: "どんな商品がある？", k: ["商品", "種類", "何が作れ", "なにが作れ", "ラインナップ", "ほかの商品", "他の商品", "グッズ"],
      a: () => `いまおつくりしている商品は${S.PRODUCTS.length}つです。<ul>${S.PRODUCTS.map(p => `<li>${link("product.html?id=" + p.id, esc(p.name))}</li>`).join("")}</ul>このほかの商品（Tシャツ・マグカップなど）は、いまは取り扱っていません。` },
    { id: "cardcase", cat: "item", label: "名刺入れの2Dと3Dの違い", k: ["名刺", "2d", "3d", "立体", "平面", "凹凸", "ステンレス", "メタル", "カードケース"],
      a: () => `ステンレスの名刺入れです。<ul>${P("cardcase").variants.map(v => `<li><b>${esc(v.label)}</b> ${yen(v.price)}：${esc(v.desc || "")}</li>`).join("")}</ul>名刺はおよそ20枚入ります。プリントするのは表面だけです。写真を置かない部分は、ステンレスの銀色のまま仕上がります。${link("product.html?id=cardcase", "名刺入れを見る")}` },
    { id: "interior", cat: "item", label: "インテリアボードについて", k: ["インテリア", "ボード", "木", "飾", "壁", "まな板", "掛け", "かけ"],
      a: () => `木のボードに写真をプリントした、お部屋に飾れるインテリアです（${yen(P("interior").price)}）。上に穴があいているので、ひもやフックで壁に掛けられます。立てかけて飾ることもできます。<br>木目がうっすら透けて、やさしい風合いに仕上がります。プリントするのは表面だけです。${link("product.html?id=interior", "インテリアボードを見る")}` },
    { id: "colorlook", cat: "item", label: "色は画面と同じになる？", k: ["色味", "色合い", "画面と", "仕上がりの色", "色が違", "イメージと違", "見本と"],
      a: () => `画面の色と実際の仕上がりは、少しちがって見えることがあります（画面の明るさや、素材の色・質感によるもの）。<br>インテリアボードは木目が、少し透けて見えます。透明のスマホケースは、写真のない部分が透けます。` },
    { id: "durable", cat: "item", label: "すぐはがれない？", k: ["はがれ", "剥がれ", "色あせ", "色褪せ", "耐久", "長持ち", "丈夫", "こすれ", "水", "濡れ", "防水", "洗え"],
      a: () => `ふだんの使い方で、プリントがすぐにはがれることはありません。長く使っていただくために、かたいものでこすったり、強い洗剤やアルコールでふいたりするのは避けてください。汚れたときは、やわらかい布でやさしくふいてください。水洗いや防水には対応していません。` },
    { id: "sample", cat: "item", label: "見本や実物を見られる？", k: ["見本", "サンプル", "実物", "試し", "現物"],
      a: () => `見本のお貸し出しや、サンプルの販売はしていません。各商品ページの写真と、デザインの画面のできあがりイメージでご確認ください。` },

    /* --- スマホケース --- */
    { id: "model", cat: "phone", label: "わたしの機種に対応してる？", k: ["機種", "対応", "android", "アンドロイド", "iphone", "アイフォン", "galaxy", "ギャラクシー", "xperia", "エクスペリア", "aquos", "アクオス", "pixel", "ピクセル", "arrows", "アローズ", "oppo", "redmi", "xiaomi", "シャオミ", "らくらく"],
      a: () => `iPhoneのほか、Galaxy・Xperia・AQUOS・Google Pixel・arrows・OPPOなど <b>600機種以上</b> に対応しています。<br>このチャットに機種名（例：「iPhone 16」「Galaxy S24」「SO-51E」）を送っていただければ、対応しているかお調べします。` },
    { id: "nomodel", cat: "phone", label: "機種が一覧にない", k: ["一覧にない", "見つからない", "ない機種", "載ってない", "のってない", "対応してない", "新しい機種", "発売"],
      a: () => `一覧にない機種は、ケースの用意がないため、おつくりできません。新しい機種は、ケースが手に入りしだい一覧に追加します。<br>機種名の検索は「16」「S24」「SO-51E」のように、型番の一部だけでも探せます。` },
    { id: "whichmodel", cat: "phone", label: "自分の機種がわからない", k: ["わからない", "分からない", "調べ方", "確認方法", "どの機種", "型番"],
      a: () => `<b>iPhone</b>：「設定」→「一般」→「情報」の「機種名」で確認できます。<br><b>Android</b>：「設定」→「デバイス情報」（または「端末情報」「スマートフォン情報」）で確認できます。<br>docomo・au・SoftBankのスマホは、型番（例：SO-51E、SCG25、A401SH）でも探せます。` },
    { id: "casecolor", cat: "phone", label: "ケースの色・種類は？", k: ["スマホケースの色", "透明", "クリア", "~白", "~黒", "ホワイト", "ブラック", "ハードケース", "~素材", "手帳", "ソフト", "シリコン", "tpu"],
      a: () => `スマホケースは <b>ハードケース</b> で、<b>白・黒・透明</b> の3色から選べます（どれも${yen(P("phone").price)}）。<br>手帳型・ソフトケース（シリコン・TPU）はお取り扱いしていません。<br>透明を選んで写真の背景を消すと、ペットだけがケースに浮かんだように仕上がります。` },
    { id: "camera", cat: "phone", label: "カメラやボタンの穴は？", k: ["カメラ", "レンズ", "穴", "ボタン", "充電口", "スピーカー", "ピッタリ", "ぴったり", "サイズ合"],
      a: () => `ケースは機種ごとに専用の形なので、カメラ・ボタン・充電口の位置はぴったり合います。<br>カメラの穴の部分には印刷されません。デザインの画面では、カメラの位置を灰色で表示しています（位置は目安です）。` },
    { id: "charge", cat: "phone", label: "ワイヤレス充電やMagSafeは？", k: ["ワイヤレス", "充電", "magsafe", "マグセーフ", "磁石", "マグネット", "qi"],
      a: () => `ハードケースは薄いので、ふつうのワイヤレス充電はケースをつけたままご利用いただけることが多いです（機種や充電器によります）。MagSafe用の磁石は入っていないため、MagSafeの磁石でぴったりくっつく使い方には対応していません。` },
    { id: "strap", cat: "phone", label: "ストラップやショルダーは？", k: ["ストラップ", "ショルダー", "紐", "ひも", "リング", "スマホリング", "グリップ"],
      a: () => `ストラップホールはありません。スマホリングやグリップは、ケースの上から貼るタイプであれば付けられますが、はがすときにプリントがはがれることがあるのでご注意ください。` },

    /* --- 写真・デザイン --- */
    { id: "photo", cat: "design", label: "どんな写真が使える？", k: ["どんな写真", "使える写真", "画質", "解像度", "スマホで撮", "暗い", "ピンぼけ", "ぼやけ", "古い写真", "白黒"],
      a: () => `スマホで撮った写真で大丈夫です。明るく、ピントの合った写真ほどきれいに仕上がります。暗い写真やぼやけた写真は、そのままの写りで印刷されます。<br>ペットのほか、人・車・景色・白黒写真・ご自分で描いたイラストもお使いいただけます。` },
    { id: "rights", cat: "design", label: "使えない写真はある？", k: ["使えない", "キャラクター", "芸能人", "有名人", "アニメ", "ロゴ", "著作", "権利", "ネットの画像", "拾った", "ブランド"],
      a: () => `ほかの方が撮った写真や、インターネットで見つけた画像、キャラクター・アニメ・芸能人・ブランドのロゴなど、権利のある画像はお使いいただけません。そのような画像でのご注文は、おつくりできないことがあります。` },
    { id: "upload", cat: "design", label: "写真の送り方", k: ["アップロード", "送り方", "あとから送", "後から送", "写真を送", "データ", "形式", "heic", "jpeg", "png", "ファイル", "パソコン", "pc"],
      a: () => `写真は、デザインの画面で「写真をえらぶ」を押して、その場でアップロードしてください。スマホやパソコンに入っている写真（JPEG・PNG、iPhoneの写真もそのまま）が使えます。<br>写真をあとから送ることはできません。「写真を受け付けました」と出たら送信完了です。` },
    { id: "multi", cat: "design", label: "写真を何枚か使いたい", k: ["何枚", "2枚", "複数", "コラージュ", "組み合わせ", "並べ", "両面", "裏面", "裏も"],
      a: () => `写真は <b>10枚まで</b> 重ねられます。デザインの画面で「写真を追加する（重ねる）」を押すと、どんどん重ねられます。あとから入れた写真ほど上に重なり、「ひとつ上へ」「ひとつ下へ」で順番も変えられます。<br>上の写真の背景を消すと、きれいに重なります。印刷するのは表面だけです（両面・裏面への印刷はできません）。` },
    { id: "frame", cat: "design", label: "写真を丸やハートの形にできる？", k: ["形", "丸く", "まる", "ハート", "星", "花", "くも", "雲", "だ円", "角丸", "フレーム", "ふちどり", "縁取り", "ふち", "枠", "境界"],
      a: () => `できます。写真ごとに <b>四角・角丸・まる・だ円・ハート・星・お花・くも</b> の形に切り抜けます。<br>「ふちどり」で、線・二重線・点線・水玉の縁取りを付けられます。太さは3段階、色も自由に選べます。` },
    { id: "bg", cat: "design", label: "背景を消せる？", k: ["背景", "透過", "切り抜", "切抜", "消せ", "消す", "背景色"],
      a: () => `デザインの画面に「背景を消す（透過）」ボタンがあります。ペットや人だけを切り抜けます（はじめて使うときは準備に30秒〜1分ほどかかります）。<br>消したあとは「背景色」から100色以上の色を選ぶか、素材の色のまま（透明ケースなら透ける）にできます。うまく切り抜けないときは「背景を元に戻す」で戻せます。` },
    { id: "text", cat: "design", label: "名前や文字を入れられる？", k: ["文字", "名前", "名入れ", "メッセージ", "テキスト", "書体", "フォント", "日付", "誕生日", "絵文字", "英語", "ローマ字"],
      a: () => `お名前やメッセージを <b>3つまで</b> 入れられます（1つにつき全角10文字・半角20文字まで）。書体は${S.DESIGN.fonts.length}種類、文字の色は100色以上と自由な色から選べます。影をつけることもできます。<br>絵文字は、きれいに印刷できないことがあるのでおすすめしません。文字は入れなくてもおつくりできます。` },
    { id: "edit", cat: "design", label: "写真の位置や大きさを変えたい", k: ["位置", "大きさ", "拡大", "縮小", "回転", "向き", "ずらし", "動かし", "傾き", "はみ出"],
      a: () => `デザインの画面で、写真を指やマウスで動かせます。大きさ・回転はスライダーで、スマホなら2本指で拡大・回転もできます。「全体に合わせる」「中央にそろえる」「90°回す」のボタンもあります。<br>ピンクの線の内側が印刷される範囲です。「元に戻す」「やり直し」も使えます。` },
    { id: "onlytext", cat: "design", label: "写真なしで文字だけでも作れる？", k: ["文字だけ", "写真なし", "写真がない", "色だけ", "無地"],
      a: () => `写真は1枚必要です。文字だけ・色だけのデザインはおつくりできません。` },
    { id: "save", cat: "design", label: "デザインを保存して後で注文できる？", k: ["保存", "途中", "あとで", "後で", "続き", "下書き"],
      a: () => `デザインの途中は保存できません。最後まで作って「この内容でカートに入れる」を押すと、カートに残ります（同じスマホ・同じブラウザなら、あとからお支払いに進めます）。` },
    { id: "check", cat: "design", label: "仕上がりを確認できる？", k: ["確認", "仕上がり", "プレビュー", "イメージ", "完成"],
      a: () => `デザインの画面の右上「デザインの確認」を押すと、できあがりのイメージを見られます。よければ「この内容でカートに入れる」、直したいときは「デザインを直す」を押してください。<br>ご注文後に、こちらからデザインの確認のご連絡はしません。この画面でのイメージのとおりにおつくりします。` },

    /* --- 注文・支払い --- */
    { id: "how", cat: "order", label: "注文のしかた", k: ["注文", "流れ", "方法", "やり方", "どうやって", "手順", "買い方", "申し込"],
      a: () => `<ol><li>${link("product.html", "商品一覧")}から商品を選ぶ</li><li>機種や色・数量を選んで「デザインする」</li><li>写真を入れて、位置や大きさ・文字を決める</li><li>「デザインの確認」→ カートに入れる</li><li>お客様情報を入れて、カードでお支払い</li></ol>できあがりのイメージを確認してから注文できます。` },
    { id: "pay", cat: "order", label: "支払い方法は？", k: ["支払", "払い", "決済", "カード", "クレジット", "apple", "google pay", "現金", "振込", "代引", "paypay", "ペイペイ", "コンビニ", "後払い"],
      a: () => `ネットでのご注文は、お支払いの画面に表示される方法でお支払いいただけます（<b>クレジットカード（Visa・Mastercard・JCB・American Express）・Apple Pay・Google Pay</b> など）。<br>店頭（カフェ）でのご注文は、現金かクレジットカードを選べます。<br>代金引換・銀行振込・後払いには対応していません。` },
    { id: "split", cat: "order", label: "分割払いはできる？", k: ["分割", "リボ", "回数"],
      a: () => `お支払いは1回払いです。分割にしたいときは、お使いのカード会社の「あとから分割」「あとからリボ」などのサービスをご利用ください。` },
    { id: "cardsafe", cat: "order", label: "カード情報は安全？", k: ["安全", "セキュリティ", "カード情報", "個人情報", "stripe", "ストライプ", "怪しい", "大丈夫"],
      a: () => `カード情報は、世界中で使われている決済サービス <b>Stripe</b> の画面で入力していただきます。カード番号は当店には届かず、保存もしません。<br>お名前・ご住所・写真などは、商品の製作とお届けのためだけに使います（${link("tokushoho.html#privacy", "プライバシーポリシー")}）。` },
    { id: "payerror", cat: "order", label: "カード払いがうまくいかない", k: ["エラー", "決済できない", "払えない", "通らない", "使えない", "失敗", "止まった"],
      a: () => `次のことをお試しください。<ul><li>カード番号・有効期限・セキュリティコードをもう一度確かめる</li><li>別のカード、または Apple Pay・Google Pay を使う</li><li>カードのご利用枠や、本人確認（3Dセキュア）の画面を確かめる</li><li>少し時間をおいて、カートからもう一度「カード決済へ進む」を押す</li></ul>お支払いが終わっていないご注文は、24時間で自動的に取り消されます（料金はかかりません）。` },
    { id: "qty", cat: "order", label: "同じデザインを何個も注文できる？", k: ["何個", "複数個", "同じデザイン", "まとめ", "大量", "たくさん", "法人", "団体", "記念品", "ノベルティ", "数量"],
      a: () => `数量を選ぶ画面で、1つのデザインにつき <b>20個まで</b> 選べます。それ以上ほしいときは、カートの「＋ 別の写真・別の商品でもうひとつ作る」から同じデザインをもう一度作って追加してください。<br>ちがう商品・ちがう写真も、1回のご注文にまとめられます。` },
    { id: "member", cat: "order", label: "会員登録は必要？", k: ["会員", "登録", "アカウント", "ログイン", "パスワード"],
      a: () => `会員登録はいりません。ご注文のときに、お名前・ご連絡先・お届け先を入れていただくだけです。` },
    { id: "coupon", cat: "order", label: "クーポンや割引はある？", k: ["クーポン", "割引", "セール", "キャンペーン", "ポイント", "コード", "無料", "タダ", "0円"],
      a: () => `クーポンをお持ちの方は、カートの「クーポンコード」の欄にコードを入れて「使う」を押してください。<b>商品1個分が0円</b> になります（クーポン1つにつき1回、数に限りがあります）。<br>いまのところ、ポイントやセールはありません。` },
    { id: "gift", cat: "order", label: "プレゼントにできる？", k: ["ギフト", "プレゼント", "贈", "ラッピング", "包装", "のし", "金額を", "値段を入れ", "明細", "サプライズ"],
      a: () => `プレゼントにもおすすめです。カートの「ご要望など」に <b>「ギフト」</b> とお書きいただければ、価格のわかるものを同封せずにお届けします。お届け先を、贈る方のご住所にすることもできます。<br>ラッピング・のしのサービスはありません。` },
    { id: "receipt", cat: "order", label: "領収書はもらえる？", k: ["領収", "レシート", "請求書", "インボイス", "宛名", "経費"],
      a: () => `カードでお支払いの場合は、お支払い完了のメールが領収の控えになります。<br>宛名入りの領収書が必要な方は、ご注文のときにカートの「ご要望など」に <b>「領収書希望・宛名（例：株式会社〇〇）」</b> とお書きください。商品といっしょにお送りします。` },

    /* --- お届け・受け取り --- */
    { id: "lead", cat: "ship", label: "いつ届く？", k: ["いつ", "届", "納期", "日数", "期間", "何日", "発送", "到着", "急ぎ", "間に合", "早く"],
      a: () => `お支払いを確認してから <b>1か月ほど</b> で発送します。ひとつずつ手作業でおつくりしているため、お急ぎの対応はできません。誕生日などに合わせたいときは、余裕をもってご注文ください。` },
    { id: "ship", cat: "ship", label: "送料は？", k: ["送料", "配送料", "~配送", "送って", "郵送", "宅配"],
      a: () => S.SHIPPING_FEE ? `送料は全国一律 ${yen(S.SHIPPING_FEE)} です。` : `送料は <b>無料</b>（全国一律）です。店頭での受け取りもできます。` },
    { id: "date", cat: "ship", label: "日時の指定はできる？", k: ["日時", "指定", "時間指定", "日にち", "曜日", "午前", "夜"],
      a: () => `お届け日・時間帯のご指定はお受けしていません。ご不在のときは、配送業者の不在票から再配達をお申し込みください。` },
    { id: "abroad", cat: "ship", label: "海外や離島にも送れる？", k: ["海外", "外国", "離島", "沖縄", "北海道", "国外"],
      a: () => `お届けは日本国内のみです。北海道・沖縄・離島も、送料無料でお届けします（日数が少し多くかかることがあります）。海外へのお届けはできません。` },
    { id: "addr", cat: "ship", label: "別の住所に送りたい", k: ["別の住所", "ちがう住所", "違う住所", "実家", "職場", "会社に", "届け先", "複数の住所", "それぞれ"],
      a: () => `ご注文のときに入れた住所にお届けします。ご自宅以外（ご実家・職場・贈る方のご住所）も入れられます。<br>何か所かに分けて送りたいときは、届け先ごとに分けてご注文ください。` },
    { id: "pickup", cat: "ship", label: "店頭で受け取れる？", k: ["店頭", "受け取", "受取", "取りに", "場所", "住所", "どこ", "カフェ", "お店", "直接"],
      a: () => `店頭での受け取りもできます（カートで「店頭で受け取る」を選んでください）。受け取り場所：〒819-0161 福岡県福岡市西区今宿東1丁目19-14。できあがり次第ご連絡します。<br>カフェでご注文の方は、ご注文いただいたカフェでお受け取りください。` },

    /* --- 注文のあと --- */
    { id: "mail", cat: "after", label: "注文確認のメールが来ない", k: ["メールが来", "メールが届", "確認メール", "注文メール", "迷惑メール", "届かない", "来ない"],
      a: () => `ご注文のお知らせメールは、お支払いの確認後に送ります。届かないときは、<b>迷惑メールフォルダ</b> をご確認ください。「info.lico2026@gmail.com」からのメールを受け取れるように設定してください。<br>注文番号は、お支払い後に表示される「ご注文ありがとうございました」の画面にも出ています。` },
    { id: "orderno", cat: "after", label: "注文番号はどこ？", k: ["注文番号", "番号", "受付番号"],
      a: () => `注文番号（例：261015-01）は、お支払い後の「ご注文ありがとうございました」の画面と、ご注文のお知らせメールに書いてあります。` },
    { id: "status", cat: "after", label: "製作の状況を知りたい", k: ["状況", "進み", "いまどこ", "今どこ", "まだ", "遅い", "届かない", "追跡", "発送した"],
      a: () => `お支払いの確認から1か月ほどで発送します。それまでの間は、順番に製作しています。発送までお待ちください。` },
    { id: "change", cat: "after", label: "注文の変更・キャンセル", k: ["キャンセル", "変更", "取り消", "取消", "間違", "修正", "やり直", "写真を変え"],
      a: () => `お客様の写真でおつくりするオーダー品のため、ご注文後の変更・キャンセルは原則お受けしていません。ご注文の前に「デザインの確認」の画面で、写真・文字・機種・色をよくお確かめください。<br>お支払いの前（カード決済の画面で止めた場合）であれば、ご注文は24時間で自動的に取り消されます。` },
    { id: "return", cat: "after", label: "返品・交換・不良品", k: ["返品", "交換", "不良", "破損", "壊れ", "傷", "印刷が", "汚れ", "返金", "割れ", "サイズが合わ"],
      a: () => `お客様の写真でおつくりするオーダー品のため、ご都合による返品・交換はお受けできません。<br>届いた商品に破損や印刷の不良があった場合は、<b>到着後7日以内</b> にお知らせください。新しい商品と交換いたします。お知らせの方法は ${LEGAL} のページに書いてあります。` },

    /* --- その他 --- */
    { id: "about", cat: "other", label: "どんなお店？", k: ["会社", "運営", "どんな", "lico", "リコ", "就労", "誰が", "作って", "ittenmon", "いってんもん"],
      a: () => `ITTENMON は、福岡市西区の就労継続支援B型事業所「LICO（リコ）」のオリジナルブランドです（運営：株式会社かむらっど）。写真のデータを整えるところから、仕上げ・梱包まで、メンバーがひとつひとつ手がけています。` },
    { id: "privacy", cat: "other", label: "写真や個人情報の扱いは？", k: ["プライバシー", "写真の扱い", "保存期間", "削除", "使い回", "悪用", "sns", "掲載"],
      a: () => `お預かりした写真や個人情報は、商品の製作とお届けのためだけに使います。写真は、商品の発送から6か月後に削除します。お客様の写真を、許可なくSNSや広告に使うことはありません。くわしくは ${link("tokushoho.html#privacy", "プライバシーポリシー")} をご覧ください。` },
    { id: "legal", cat: "other", label: "特定商取引法の表記", k: ["特定商取引", "特商法", "販売事業者", "責任者"],
      a: () => `${LEGAL} のページをご覧ください。` },
    { id: "contact", cat: "other", label: "スタッフに聞きたい", k: ["問い合わせ", "問合せ", "連絡", "電話", "メール", "line", "ライン", "相談", "人と", "担当", "スタッフ"],
      a: () => `ご質問には、このチャットでお答えしています。下のボタンから知りたいことを選ぶか、質問を短い言葉（例：「送料」「納期」「キャンセル」「iPhone 16」）で送ってみてください。` }
  ];

  /* ===== 言葉のゆれをそろえる（全角→半角、カタカナ→ひらがな、小文字） ===== */
  const norm = s => String(s || "").normalize("NFKC").toLowerCase().replace(/[ァ-ヶ]/g, c => String.fromCharCode(c.charCodeAt(0) - 0x60)).replace(/\s+/g, "");
  const KEYS = QA.map(q => ({ q, keys: q.k.map(k => k[0] === "~" ? { k: norm(k.slice(1)), w: 1 } : { k: norm(k), w: norm(k).length }) }));

  /* スマホの機種名が入っていたら、対応しているか調べる（機種一覧はそのとき読み込む） */
  function loadModels(){
    if(window.LICO_MODELS) return Promise.resolve(window.LICO_MODELS);
    return new Promise(ok => { const sc = document.createElement("script"); sc.src = "js/models.js?v=1015g"; sc.onload = () => ok(window.LICO_MODELS); sc.onerror = () => ok(null); document.head.appendChild(sc); });
  }
  async function modelAnswer(text){
    let t = norm(text);
    if(!/(らくらく|かんたん|あんしん|しんぷる|きっず|じゅにあ)/.test(t)) t = t.replace(/[ぁ-ゖー]/g, "");
    t = t.replace(/(対応|機種|使用|大丈夫|可能|[?？!！。、・])/g, "");
    if(/[a-z0-9]/.test(t) && !/(らくらく|かんたん|あんしん|しんぷる|きっず|じゅにあ)/.test(t)) t = t.replace(/[^a-z0-9+\-()]/g, "");   // 英数字の機種名だけを使う
    if(t.length < 2) return null;
    const M = await loadModels(); if(!M) return null;
    const hits = [];
    M.groups.forEach(g => g.subs.forEach(s => s.models.forEach(m => { const n = norm(m.n); if((n.includes(t) || (t.length >= 4 && t.includes(n))) && !hits.includes(m.n)) hits.push(m.n); })));
    if(!hits.length) return null;
    const list = hits.slice(0, 8).map(h => `<li>${esc(h)}</li>`).join("");
    return `はい、対応しています。<ul>${list}</ul>${hits.length > 8 ? `ほか${hits.length - 8}機種。` : ""}${link("product.html?id=phone&open=1", "スマホケースをつくる")}`;
  }
  async function answer(text){
    const t = norm(text);
    let best = null, score = 0;
    KEYS.forEach(({ q, keys }) => { const s = keys.reduce((a, x) => a + (x.k && t.includes(x.k) ? x.w : 0), 0); if(s > score){ score = s; best = q; } });
    // 機種の名前らしいもの（英数字を含む・機種の質問）は機種一覧から調べる
    if(/[a-z0-9]/.test(t) && (!best || best.id === "model" || score < 4)){ const m = await modelAnswer(text); if(m) return { html: m }; }
    if(best) return { html: best.a(), q: best };
    return { html: `すみません、うまく見つけられませんでした。短い言葉（例：「送料」「納期」「キャンセル」「iPhone 16」）で送るか、下のボタンから選んでください。`, menu: true };
  }

  /* ===== 画面 ===== */
  const css = `
  .cb-btn{position:fixed;right:18px;bottom:calc(18px + env(safe-area-inset-bottom,0px));z-index:150;background:var(--text);color:#fff;border:0;border-radius:999px;padding:13px 18px;font-size:14px;display:flex;align-items:center;gap:8px;cursor:pointer;box-shadow:0 6px 18px rgba(0,0,0,.18);font-family:var(--f-body)}
  .cb-btn svg{width:20px;height:20px}
  .cb{position:fixed;right:18px;bottom:calc(18px + env(safe-area-inset-bottom,0px));z-index:160;width:min(380px,calc(100vw - 32px));height:min(580px,calc(100vh - 100px));background:#fff;border:1px solid var(--line);box-shadow:0 12px 32px rgba(0,0,0,.18);display:flex;flex-direction:column;font-family:var(--f-body)}
  .cb[hidden],.cb-btn[hidden]{display:none}
  .cb-h{display:flex;justify-content:space-between;align-items:center;padding:12px 14px;background:var(--text);color:#fff}
  .cb-h b{font-family:var(--f-en);letter-spacing:.08em;font-size:14px}
  .cb-h span{font-size:11px;opacity:.75;margin-left:8px}
  .cb-h button{background:none;border:0;color:#fff;font-size:22px;line-height:1;cursor:pointer}
  .cb-log{flex:1;overflow-y:auto;padding:14px;display:flex;flex-direction:column;gap:10px;background:var(--bg-sub)}
  .cb-m{max-width:88%;padding:10px 12px;font-size:13px;line-height:1.7;overflow-wrap:anywhere}
  .cb-m.bot{background:#fff;border:1px solid var(--line);align-self:flex-start}
  .cb-m.me{background:var(--text);color:#fff;align-self:flex-end}
  .cb-m a{color:var(--accent);text-decoration:underline}
  .cb-m ul,.cb-m ol{margin:6px 0 6px 18px}
  .cb-q{display:flex;flex-wrap:wrap;gap:6px}
  .cb-q button{border:1px solid var(--accent);color:var(--accent);background:#fff;border-radius:999px;padding:6px 10px;font-size:12px;cursor:pointer}
  .cb-q button.cat{background:var(--accent);color:#fff}
  .cb-f{display:flex;border-top:1px solid var(--line)}
  .cb-f input{flex:1;border:0;padding:12px;font-size:16px;min-width:0}
  .cb-f button{border:0;background:var(--text);color:#fff;padding:0 16px;font-size:13px;cursor:pointer}
  .cb-note{font-size:10px;color:var(--sub);text-align:center;padding:4px 8px;background:#fff}`;
  const st = document.createElement("style"); st.textContent = css; document.head.appendChild(st);
  const wrap = document.createElement("div");
  wrap.innerHTML = `<button class="cb-btn" type="button" aria-label="質問する（チャット）"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 5h16v11H9l-5 4z"/></svg>質問する</button>
    <section class="cb" role="dialog" aria-label="${esc(S.SHOP_NAME)} チャット" hidden>
      <div class="cb-h"><div><b>${esc(S.SHOP_NAME)}</b><span>よくある質問に自動でお答えします</span></div><button type="button" aria-label="閉じる">×</button></div>
      <div class="cb-log" aria-live="polite"></div>
      <form class="cb-f"><input type="text" placeholder="質問を入力（例：送料は？ iPhone 16）" aria-label="質問"><button type="submit">送信</button></form>
      <p class="cb-note">自動でお答えしています。短い言葉で送ると見つかりやすくなります。</p>
    </section>`;
  document.body.appendChild(wrap);
  const btn = wrap.querySelector(".cb-btn"), box = wrap.querySelector(".cb"), log = wrap.querySelector(".cb-log"), form = wrap.querySelector(".cb-f"), input = form.querySelector("input");
  const add = (html, who) => { const d = document.createElement("div"); d.className = "cb-m " + who; d.innerHTML = html; log.appendChild(d); log.scrollTop = log.scrollHeight; return d; };
  const buttons = html => { const d = document.createElement("div"); d.className = "cb-q"; d.innerHTML = html; log.appendChild(d); log.scrollTop = log.scrollHeight; };
  // 分類のボタン
  const menu = () => buttons(CATS.map(c => `<button type="button" class="cat" data-cat="${c.id}">${esc(c.label)}</button>`).join(""));
  // 分類の中の質問ボタン（＋分類にもどる）
  const inCat = cat => buttons(QA.filter(q => q.cat === cat).map(q => `<button type="button" data-q="${q.id}">${esc(q.label)}</button>`).join("") + `<button type="button" class="cat" data-cat="">ほかの分類を見る</button>`);
  let started = false;
  function open(){ box.hidden = false; btn.hidden = true; if(!started){ started = true; add(`こんにちは！${esc(S.SHOP_NAME)}です。<br>知りたいことの分類を選ぶか、質問を送ってください。`, "bot"); menu(); } setTimeout(() => input.focus(), 50); }
  btn.onclick = open;
  wrap.querySelector(".cb-h button").onclick = () => { box.hidden = true; btn.hidden = false; };
  log.addEventListener("click", e => {
    const c = e.target.closest("button[data-cat]");
    if(c){ if(!c.dataset.cat){ menu(); return; } const cat = CATS.find(x => x.id === c.dataset.cat); add(esc(cat.label), "me"); inCat(cat.id); return; }
    const b = e.target.closest("button[data-q]"); if(!b) return;
    const q = QA.find(x => x.id === b.dataset.q); add(esc(q.label), "me"); add(q.a(), "bot"); inCat(q.cat);
  });
  form.onsubmit = async e => {
    e.preventDefault(); const v = input.value.trim(); if(!v) return; input.value = "";
    add(esc(v), "me"); const wait = add("…", "bot"); const r = await answer(v); wait.innerHTML = r.html;
    if(r.menu) menu(); else if(r.q) inCat(r.q.cat);
    log.scrollTop = log.scrollHeight;
  };
  if(new URLSearchParams(location.search).get("chat")) open();
})();
