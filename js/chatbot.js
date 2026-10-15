/* ITTENMON チャットボット（よくある質問に自動で答える。AIは使わず、この中の答えだけを返す）
   ・答えを直すときは、下の QA の a（答え）を書き換える
   ・質問の言い回しを増やすときは、k（キーワード）に言葉を足す
   ・答えられない質問は LINE・メール・電話を案内する */
(function(){
  const L = window.LICO; if(!L) return;
  const { S, yen, esc } = L;
  const P = id => S.PRODUCTS.find(p => p.id === id) || {};
  const priceOf = p => p.kind === "variant" ? p.variants.map(v => `${v.label.replace(/（.*/, "")} ${yen(v.price)}`).join("／") : yen(p.price);
  const link = (href, text) => `<a href="${href}">${text}</a>`;
  const LINE = `<a href="${esc(S.LINE_URL)}" target="_blank" rel="noopener">LINE（${esc(S.LINE_ID)}）</a>`;

  /* ===== 質問と答え ===== */
  const QA = [
    { id: "price", label: "値段を知りたい", k: ["値段", "価格", "料金", "~いくら", "~円", "金額", "費用", "~高い", "~安い"],
      a: () => `税込の価格です。<ul>${S.PRODUCTS.map(p => `<li>${link("product.html?id=" + p.id, esc(p.short))}：${priceOf(p)}</li>`).join("")}</ul>送料は無料です。1個からおつくりします。` },
    { id: "model", label: "スマホの機種に対応してる？", k: ["機種", "対応", "android", "アンドロイド", "iphone", "アイフォン", "galaxy", "ギャラクシー", "xperia", "エクスペリア", "aquos", "アクオス", "pixel", "ピクセル", "arrows", "アローズ", "oppo", "redmi", "xiaomi", "シャオミ", "らくらく"],
      a: () => `iPhoneのほか、Galaxy・Xperia・AQUOS・Google Pixel・arrows・OPPOなど <b>600機種以上</b> に対応しています。<br>お使いの機種名（例：「iPhone 16」「Galaxy S24」「SO-51E」）を送っていただければ、対応しているかお調べします。` },
    { id: "casecolor", label: "スマホケースの色は？", k: ["スマホケースの色", "透明", "クリア", "~白", "~黒", "ホワイト", "ブラック", "ハードケース", "~素材"],
      a: () => `スマホケースはハードケースで、<b>白・黒・透明</b> の3色から選べます（どれも${yen(P("phone").price)}）。<br>透明を選んで写真の背景を消すと、ペットだけがケースに浮かんだように仕上がります。` },
    { id: "keycase", label: "キーケースについて", k: ["キーケース", "キーケースの色", "鍵", "かぎ", "革", "レザー", "本革"],
      a: () => { const p = P("keycase"); return `牛本革のキーケースです（${yen(p.price)}）。<br>サイズ：${esc(p.size || "")}<br>色は全${(p.colors || []).length}色：${(p.colors || []).map(c => esc(c.label)).join("・")}。<br>明るい色の革ほど、写真がはっきり出ます。${link("product.html?id=keycase", "キーケースを見る")}`; } },
    { id: "cardcase", label: "名刺入れの2Dと3Dの違い", k: ["名刺", "2d", "3d", "立体", "平面", "凹凸", "ステンレス", "メタル"],
      a: () => `ステンレスの名刺入れです。<ul>${P("cardcase").variants.map(v => `<li><b>${esc(v.label)}</b> ${yen(v.price)}：${esc(v.desc || "")}</li>`).join("")}</ul>写真を置かない部分は、ステンレスの銀色のまま仕上がります。${link("product.html?id=cardcase", "名刺入れを見る")}` },
    { id: "interior", label: "インテリアボードについて", k: ["インテリア", "ボード", "木", "飾", "壁", "まな板"],
      a: () => `木のボードに写真をプリントした、お部屋に飾れるインテリアです（${yen(P("interior").price)}）。上に穴があるので、壁に掛けられます。木目がうっすら透けて、やさしい風合いに仕上がります。<br>大きさの詳細は ${LINE} でお問い合わせください。${link("product.html?id=interior", "インテリアボードを見る")}` },
    { id: "lead", label: "いつ届く？", k: ["いつ", "届", "納期", "日数", "期間", "何日", "発送", "到着", "急ぎ", "間に合"],
      a: () => `お支払いを確認してから <b>1か月ほど</b> で発送します。店頭で受け取る場合は、できあがり次第ご連絡します。<br>お急ぎの場合は、ご注文の前に ${LINE} でご相談ください。` },
    { id: "ship", label: "送料は？", k: ["送料", "配送料", "配送", "送って", "郵送", "宅配"],
      a: () => S.SHIPPING_FEE ? `送料は全国一律 ${yen(S.SHIPPING_FEE)} です。` : `送料は <b>無料</b>（全国一律）です。店頭での受け取りもできます。` },
    { id: "pay", label: "支払い方法は？", k: ["支払", "払い", "決済", "カード", "クレジット", "apple", "google pay", "現金", "振込", "代引", "paypay", "ペイペイ"],
      a: () => `ネットでのご注文は、<b>クレジットカード（Visa・Mastercard・JCB・American Express）・Apple Pay・Google Pay</b> でお支払いいただけます。<br>店頭（カフェ）でのご注文は、現金かクレジットカードをお選びいただけます。<br>代金引換やPayPayには対応していません。` },
    { id: "photo", label: "どんな写真が使える？", k: ["写真", "画像", "画質", "解像度", "スマホで撮", "データ", "アップロード", "あとから送", "後から送", "送り方"],
      a: () => `スマホで撮った写真で大丈夫です。明るく、ピントの合った写真ほどきれいに仕上がります。<br>写真はご注文のときに、その画面でアップロードしてください（あとから送ることはできません）。<br>ほかの方が撮った写真や、キャラクター・ロゴなど権利のある画像は使えません。` },
    { id: "bg", label: "背景を消せる？", k: ["背景", "透過", "切り抜", "切抜", "消せ", "消す"],
      a: () => `デザインの画面に「背景を消す（透過）」ボタンがあります。ペットや人だけを切り抜けます。消したあとに、好きな背景色を選ぶこともできます。` },
    { id: "text", label: "名前や文字を入れられる？", k: ["文字", "名前", "名入れ", "メッセージ", "テキスト", "書体", "フォント", "日付", "誕生日"],
      a: () => `お名前やメッセージを <b>3つまで</b> 入れられます（1つにつき全角10文字まで）。書体は${S.DESIGN.fonts.length}種類、文字の色は100色以上から選べます。入れなくてもおつくりできます。` },
    { id: "how", label: "注文のしかた", k: ["注文", "流れ", "方法", "やり方", "どうやって", "手順", "買い方", "申し込"],
      a: () => `<ol><li>${link("product.html", "商品一覧")}から商品を選ぶ</li><li>機種や色・数量を選んで「デザインする」</li><li>写真を入れて、位置や大きさ・文字を決める</li><li>「デザインの確認」→ カートに入れる</li><li>お客様情報を入れて、カードでお支払い</li></ol>できあがりのイメージを確認してから注文できます。` },
    { id: "change", label: "注文の変更・キャンセル", k: ["キャンセル", "変更", "取り消", "取消", "間違", "修正", "やり直"],
      a: () => `製作を始める前であれば、変更・キャンセルができます。<b>注文番号</b> を添えて ${LINE} でご連絡ください。製作を始めたあとは、オーダー品のためお受けできません。` },
    { id: "return", label: "返品・交換・不良品", k: ["返品", "交換", "不良", "破損", "壊れ", "傷", "印刷が", "汚れ", "返金"],
      a: () => `お客様の写真でおつくりするオーダー品のため、ご都合による返品・交換はお受けできません。<br>破損や印刷の不良があった場合は、<b>到着後7日以内</b> に ${LINE} かメールでご連絡ください。新しい商品と交換いたします。` },
    { id: "gift", label: "プレゼントにできる？", k: ["ギフト", "プレゼント", "贈", "ラッピング", "包装", "のし", "金額を", "値段を入れ", "明細"],
      a: () => `プレゼントにもおすすめです。カートの「ご要望など」に <b>「ギフト」</b> とお書きいただければ、価格のわかるものを同封せずにお届けします。お届け先を贈る方のご住所にすることもできます。` },
    { id: "pickup", label: "店頭で受け取れる？", k: ["店頭", "受け取", "受取", "取りに", "場所", "住所", "どこ", "カフェ", "お店"],
      a: () => `店頭での受け取りもできます（送料なし）。受け取り場所：〒819-0161 福岡県福岡市西区今宿東1丁目19-14。できあがり次第ご連絡します。<br>カフェでご注文の方は、ご注文いただいたカフェでお受け取りください。` },
    { id: "receipt", label: "領収書はもらえる？", k: ["領収", "レシート", "請求書", "インボイス"],
      a: () => `カードでお支払いの場合は、お支払い完了のメールが領収の控えになります。宛名入りの領収書が必要な方は、注文番号と宛名を添えて ${LINE} かメール（${esc(S.SHOP_EMAIL || "info.lico2026@gmail.com")}）でお知らせください。` },
    { id: "bulk", label: "たくさん注文したい", k: ["まとめ", "大量", "たくさん", "法人", "団体", "記念品", "ノベルティ", "10個", "20個", "割引"],
      a: () => `1回のご注文で、1つのデザインにつき20個までお選びいただけます。それ以上のご注文や、団体・記念品のご相談は ${LINE} かお電話（092-600-4927・平日9:00〜18:00）でお問い合わせください。` },
    { id: "about", label: "どんなお店？", k: ["会社", "運営", "どんな", "lico", "リコ", "就労", "誰が", "作って"],
      a: () => `ITTENMON は、福岡市西区の就労継続支援B型事業所「LICO（リコ）」のオリジナルブランドです（運営：株式会社かむらっど）。写真のデータを整えるところから、仕上げ・梱包まで、メンバーがていねいに手がけています。` },
    { id: "contact", label: "人に問い合わせたい", k: ["問い合わせ", "問合せ", "連絡", "電話", "メール", "line", "ライン", "相談", "人と", "担当"],
      a: () => `${LINE} がいちばん早くお返事できます。<br>メール：${esc(S.SHOP_EMAIL || "info.lico2026@gmail.com")}<br>お電話：092-600-4927（平日9:00〜18:00）` }
  ];
  const QUICK = ["price", "model", "lead", "pay", "photo", "change", "contact"];

  /* ===== 言葉のゆれをそろえる（全角→半角、カタカナ→ひらがな、小文字） ===== */
  const norm = s => String(s || "").normalize("NFKC").toLowerCase().replace(/[ァ-ヶ]/g, c => String.fromCharCode(c.charCodeAt(0) - 0x60)).replace(/\s+/g, "");
  const KEYS = QA.map(q => ({ q, keys: q.k.map(k => k[0] === "~" ? { k: norm(k.slice(1)), w: 1 } : { k: norm(k), w: norm(k).length }) }));

  /* スマホの機種名が入っていたら、対応しているか調べる（機種一覧はそのとき読み込む） */
  function loadModels(){
    if(window.LICO_MODELS) return Promise.resolve(window.LICO_MODELS);
    return new Promise(ok => { const sc = document.createElement("script"); sc.src = "js/models.js?v=1015e"; sc.onload = () => ok(window.LICO_MODELS); sc.onerror = () => ok(null); document.head.appendChild(sc); });
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
    if(/[a-z0-9]/.test(t) && (!best || best.id === "model" || score < 4)){ const m = await modelAnswer(text); if(m) return m; }
    if(best) return best.a();
    return `すみません、その質問にはうまくお答えできませんでした。${LINE} かメール（${esc(S.SHOP_EMAIL || "info.lico2026@gmail.com")}）でお問い合わせください。スタッフがお返事します。`;
  }

  /* ===== 画面 ===== */
  const css = `
  .cb-btn{position:fixed;right:18px;bottom:calc(18px + env(safe-area-inset-bottom,0px));z-index:150;background:var(--text);color:#fff;border:0;border-radius:999px;padding:13px 18px;font-size:14px;display:flex;align-items:center;gap:8px;cursor:pointer;box-shadow:0 6px 18px rgba(0,0,0,.18);font-family:var(--f-body)}
  .cb-btn svg{width:20px;height:20px}
  .cb{position:fixed;right:18px;bottom:calc(18px + env(safe-area-inset-bottom,0px));z-index:160;width:min(380px,calc(100vw - 32px));height:min(560px,calc(100vh - 100px));background:#fff;border:1px solid var(--line);box-shadow:0 12px 32px rgba(0,0,0,.18);display:flex;flex-direction:column;font-family:var(--f-body)}
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
  .cb-f{display:flex;border-top:1px solid var(--line)}
  .cb-f input{flex:1;border:0;padding:12px;font-size:16px;min-width:0}
  .cb-f button{border:0;background:var(--text);color:#fff;padding:0 16px;font-size:13px;cursor:pointer}
  .cb-note{font-size:10px;color:var(--sub);text-align:center;padding:4px 8px;background:#fff}`;
  const st = document.createElement("style"); st.textContent = css; document.head.appendChild(st);
  const wrap = document.createElement("div");
  wrap.innerHTML = `<button class="cb-btn" type="button" aria-label="質問する（チャット）"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 5h16v11H9l-5 4z"/></svg>質問する</button>
    <section class="cb" role="dialog" aria-label="ITTENMON チャット" hidden>
      <div class="cb-h"><div><b>${esc(S.SHOP_NAME)}</b><span>よくある質問に自動でお答えします</span></div><button type="button" aria-label="閉じる">×</button></div>
      <div class="cb-log" aria-live="polite"></div>
      <form class="cb-f"><input type="text" placeholder="質問を入力（例：送料は？ iPhone 16）" aria-label="質問"><button type="submit">送信</button></form>
      <p class="cb-note">自動でお答えしています。くわしくは LINE でスタッフがお答えします。</p>
    </section>`;
  document.body.appendChild(wrap);
  const btn = wrap.querySelector(".cb-btn"), box = wrap.querySelector(".cb"), log = wrap.querySelector(".cb-log"), form = wrap.querySelector(".cb-f"), input = form.querySelector("input");
  const add = (html, who) => { const d = document.createElement("div"); d.className = "cb-m " + who; d.innerHTML = html; log.appendChild(d); log.scrollTop = log.scrollHeight; return d; };
  const quick = () => { const d = document.createElement("div"); d.className = "cb-q"; d.innerHTML = QUICK.map(id => `<button type="button" data-q="${id}">${esc(QA.find(q => q.id === id).label)}</button>`).join(""); log.appendChild(d); log.scrollTop = log.scrollHeight; };
  let started = false;
  function open(){ box.hidden = false; btn.hidden = true; if(!started){ started = true; add(`こんにちは！${esc(S.SHOP_NAME)}です。<br>ご質問をどうぞ。下のボタンからも選べます。`, "bot"); quick(); } setTimeout(() => input.focus(), 50); }
  btn.onclick = open;
  wrap.querySelector(".cb-h button").onclick = () => { box.hidden = true; btn.hidden = false; };
  log.addEventListener("click", e => { const b = e.target.closest("button[data-q]"); if(!b) return; const q = QA.find(x => x.id === b.dataset.q); add(esc(q.label), "me"); add(q.a(), "bot"); quick(); });
  form.onsubmit = async e => {
    e.preventDefault(); const v = input.value.trim(); if(!v) return; input.value = "";
    add(esc(v), "me"); const wait = add("…", "bot"); wait.innerHTML = await answer(v); log.scrollTop = log.scrollHeight;
  };
  if(new URLSearchParams(location.search).get("chat")) open();
})();
