/* ITTENMON 共通処理（ヘッダー・フッター・カート・送信） */
(function(){
  const S = window.LICO_SHOP;
  const KEY_CART = "lico-cart-v1", KEY_MODE = "lico-mode";

  const yen = n => "¥" + (Number(n)||0).toLocaleString("ja-JP");
  const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));

  /* 店頭受付モード（URLに ?mode=cafe を付けて開くと、その端末は店頭モードになる） */
  const qs = new URLSearchParams(location.search);
  try{
    if(qs.get("mode")==="cafe"){ sessionStorage.setItem(KEY_MODE,"cafe"); if(qs.get("cafe")) sessionStorage.setItem("lico-cafe", qs.get("cafe")); }
    if(qs.get("mode")==="online") sessionStorage.removeItem(KEY_MODE);
  }catch(_){}
  const isCafe = () => { try{ return sessionStorage.getItem(KEY_MODE)==="cafe"; }catch(_){ return false; } };
  const cafeId = () => { try{ return sessionStorage.getItem("lico-cafe")||""; }catch(_){ return ""; } };
  const cafeName = () => (S.CAFES||{})[cafeId()] || "カフェ";

  /* カート（写真本体は送信済みのファイルIDと、小さな見本画像だけを保存） */
  let mem = [];
  const getCart = () => { try{ return JSON.parse(localStorage.getItem(KEY_CART)||"[]"); }catch(_){ return mem; } };
  const setCart = c => { mem=c; try{ localStorage.setItem(KEY_CART, JSON.stringify(c)); }catch(_){} updateCount(); };
  const cartQty = () => getCart().reduce((a,i)=>a+(i.qty||0),0);
  /* 商品と値段（カートの中身は以前のiPhoneケースだけの形式も読めるようにする） */
  const product = id => S.PRODUCTS.find(p=>p.id===id) || S.PRODUCTS[0];
  const unitPrice = i => { const p=product(i.productId||"phone"); if(p.kind==="variant"){ const v=(p.variants||[]).find(x=>x.id===i.variant); return v?v.price:p.price; } return p.price; };
  const optionText = i => (i.option || i.model || "") + (i.caseColor ? "／ケース：" + i.caseColor : "");
  const subtotal = () => getCart().reduce((a,i)=>a+unitPrice(i)*(i.qty||0),0);

  /* 印刷する形（印刷用の座標・px）。スマホは機種ごとにカメラの穴の位置が変わる */
  const phoneModel = name => { const M=window.LICO_MODELS; if(!M) return null; for(const g of M.groups) for(const s of g.subs) for(const m of s.models) if(m.n===name) return m; return null; };
  function shapeOf(productId, option, caseColor){
    const p = product(productId);
    if(p.kind==="phone"){
      const m = phoneModel(option) || { s:"sq", a:1.94 };
      const w = 1092, h = Math.round(w*(m.a||1.94));
      const holes = ((window.LICO_MODELS||{}).shapes||{})[m.s] || [[.055,.028,.40,.43,.11]];
      const cc = (p.caseColors||[]).find(c=>c.id===caseColor);
      return { w, h, kind:"round", r:150, holes: holes.map(([x,y,hw,hh,r])=>({x:x*w,y:y*w,w:hw*w,h:hh*w,r:r*w})),
        base: cc ? cc.hex : null, baseLabel: cc ? `ケースの色（${cc.label}）のまま（印刷しない）` : "" };
    }
    const pr = p.print || { w:1100, h:1100, shape:"round", r:40 };
    let base = pr.base || null;
    if(p.kind==="color"){ const c=(p.colors||[]).find(x=>x.label===option); base = c ? c.hex : (p.colors||[{}])[0].hex; }
    const holes = pr.shape==="board" ? [{ x:600-55, y:150-55, w:110, h:110, r:55 }] : [];
    return { w:pr.w, h:pr.h, kind:pr.shape, r:pr.r||0, holes, base, baseLabel: pr.baseLabel||"" };
  }
  /* 形の線を引く（s＝表示の倍率） */
  function shapePath(c, sh, s){
    c.beginPath();
    if(sh.kind==="board"){ // まな板の形：上に持ち手、下が長方形
      const k = v => v*s, W=sh.w, H=sh.h;
      c.moveTo(k(390), k(220)); c.arc(k(600), k(220), k(210), Math.PI, 0);
      c.lineTo(k(810), k(560)); c.bezierCurveTo(k(810), k(700), k(W), k(640), k(W), k(800));
      c.lineTo(k(W), k(H-60)); c.arcTo(k(W), k(H), k(W-60), k(H), k(60)); c.lineTo(k(60), k(H)); c.arcTo(0, k(H), 0, k(H-60), k(60));
      c.lineTo(0, k(800)); c.bezierCurveTo(0, k(640), k(390), k(700), k(390), k(560)); c.closePath();
    } else c.roundRect(0, 0, sh.w*s, sh.h*s, (sh.r||0)*s);
  }
  /* 機種・商品の小さな絵（SVG） */
  function shapeIcon(productId, option, px, caseColor){
    const sh = shapeOf(productId, option, caseColor), k = (px||60)/Math.max(sh.w, sh.h), W=sh.w*k, H=sh.h*k;
    const holes = sh.holes.map(h=>`<rect x="${Math.max(0,h.x*k).toFixed(1)}" y="${(h.y*k).toFixed(1)}" width="${Math.min(W,h.w*k).toFixed(1)}" height="${(h.h*k).toFixed(1)}" rx="${(h.r*k).toFixed(1)}" fill="#555"/>`).join("");
    const body = sh.kind==="board" ? `<path d="M${390*k} ${220*k} A${210*k} ${210*k} 0 0 1 ${810*k} ${220*k} L${810*k} ${560*k} C${810*k} ${700*k} ${W} ${640*k} ${W} ${800*k} L${W} ${H} L0 ${H} L0 ${800*k} C0 ${640*k} ${390*k} ${700*k} ${390*k} ${560*k} Z" fill="${sh.base||"#fff"}" stroke="#333" stroke-width="1.2"/>`
      : `<rect x="0.6" y="0.6" width="${(W-1.2).toFixed(1)}" height="${(H-1.2).toFixed(1)}" rx="${((sh.r||0)*k).toFixed(1)}" fill="${sh.base==="clear"?"#e8eef2":(sh.base||"#fff")}" stroke="#333" stroke-width="1.2"/>`;
    return `<svg viewBox="0 0 ${W.toFixed(1)} ${H.toFixed(1)}" width="${W.toFixed(0)}" height="${H.toFixed(0)}" aria-hidden="true">${body}${holes}</svg>`;
  }
  const shipping = delivery => (delivery==="pickup" || isCafe()) ? 0 : (S.SHIPPING_FEE||0);
  function updateCount(){ document.querySelectorAll(".cart-count").forEach(el=>{ const n=cartQty(); el.textContent=n; el.dataset.n=n; }); }

  /* GASへの送信（text/plainで送るので事前確認なしで届く） */
  async function api(payload){
    if(!S.GAS_URL) throw new Error("注文の受付先がまだ設定されていません（テスト表示中）。");
    const res = await fetch(S.GAS_URL, {method:"POST", body: JSON.stringify(payload)});
    if(!res.ok) throw new Error("通信に失敗しました（"+res.status+"）。時間をおいてもう一度お試しください。");
    const j = await res.json();
    if(!j.ok) throw new Error(j.error || "受付できませんでした。");
    return j;
  }

  /* 写真を長辺2400pxのJPEGにして送れる大きさにする */
  function loadImage(file){
    return new Promise((ok,ng)=>{ const u=URL.createObjectURL(file); const im=new Image(); im.onload=()=>{ok(im);}; im.onerror=()=>ng(new Error("この画像は読み込めませんでした。JPEGかPNGの写真を選んでください。")); im.src=u; });
  }
  function toJpeg(im, max, q){
    const r = Math.min(1, max/Math.max(im.naturalWidth, im.naturalHeight));
    const c = document.createElement("canvas"); c.width=Math.round(im.naturalWidth*r); c.height=Math.round(im.naturalHeight*r);
    c.getContext("2d").drawImage(im,0,0,c.width,c.height);
    return c.toDataURL("image/jpeg", q);
  }

  function toast(msg){ let t=document.querySelector(".toast"); if(!t){ t=document.createElement("div"); t.className="toast"; t.setAttribute("role","status"); document.body.appendChild(t);} t.textContent=msg; t.classList.add("show"); clearTimeout(toast.h); toast.h=setTimeout(()=>t.classList.remove("show"),2200); }

  /* ヘッダー・フッター */
  function chrome(){
    const head = document.getElementById("site-header");
    if(head){
      head.outerHTML = `
      ${isCafe()?`<div class="mode-bar">${esc(cafeName())}でのご注文｜できあがったらこのカフェでお渡しします</div>`:`<div class="notice">${S.SHIPPING_FEE?`送料 全国一律 ${yen(S.SHIPPING_FEE)}`:"送料無料"}｜1点からおつくりします</div>`}
      <header class="site"><div class="wrap head">
        <a href="index.html" class="logo">${esc(S.SHOP_NAME)}</a>
        <nav class="gnav"><a href="product.html">商品</a><a href="gallery.html">ギャラリー</a><a href="index.html#howto">ご注文の流れ</a><a href="index.html#gift">ギフト</a><a href="index.html#about">私たちについて</a><a href="product.html#faq">よくあるご質問</a></nav>
        <a href="cart.html" class="cart-link" aria-label="カート"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M5 7h14l-1.5 13h-11z"/><path d="M9 7a3 3 0 0 1 6 0"/></svg><span class="cart-count" data-n="0">0</span></a>
      </div></header>`;
    }
    const foot = document.getElementById("site-footer");
    if(foot){
      foot.outerHTML = `<footer class="site"><div class="wrap">
        <div class="foot">
          <div><div class="logo">${esc(S.SHOP_NAME)}</div><p style="margin-top:10px;color:#aaa">運営：株式会社かむらっど<br><a href="https://syurob-lico-fukuoka.github.io/syuroB-LICO/" target="_blank" rel="noopener" style="text-decoration:underline">就労継続支援B型 LICO（リコ）</a></p></div>
          <div><h4>ショップ</h4><ul><li><a href="product.html">商品</a></li><li><a href="gallery.html">ギャラリー（制作実績）</a></li><li><a href="index.html#howto">ご注文の流れ</a></li><li><a href="cart.html">カート</a></li></ul></div>
          <div><h4>ご案内</h4><ul><li><a href="tokushoho.html">特定商取引法に基づく表記</a></li><li><a href="tokushoho.html#privacy">プライバシーポリシー</a></li><li><a href="${esc(S.LINE_URL)}" target="_blank" rel="noopener">LINEでお問い合わせ</a></li><li><a href="#" data-install="1">アプリで使う（ホーム画面に追加）</a></li><li style="margin-top:10px"><a href="staff.html" style="color:#888;font-size:11px">スタッフ用（受注管理）</a></li></ul></div>
        </div>
        <div class="pay"><span>VISA</span><span>Mastercard</span><span>JCB</span><span>AMEX</span><span>Apple Pay</span><span>Google Pay</span></div>
        <p class="copy">© 2026 ${esc(S.SHOP_NAME)}</p>
      </div></footer>`;
    }
    // スマホではアプリのように画面下にタブを出す
    if(head || foot){
      const here = (location.pathname.split("/").pop() || "index.html");
      const tab = (href, label, icon, extra) => `<a href="${href}" ${here===href.split("#")[0]?'aria-current="page"':""}>${icon}<span>${label}</span>${extra||""}</a>`;
      const nav = document.createElement("nav"); nav.className = "tabbar"; nav.setAttribute("aria-label","メニュー");
      nav.innerHTML = tab("index.html","ホーム",'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/></svg>')
        + tab("product.html","つくる",'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="6" y="2.5" width="12" height="19" rx="2.5"/><circle cx="12" cy="11" r="3"/></svg>')
        + tab("gallery.html","ギャラリー",'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3" y="3" width="8" height="8" rx="1"/><rect x="13" y="3" width="8" height="8" rx="1"/><rect x="3" y="13" width="8" height="8" rx="1"/><rect x="13" y="13" width="8" height="8" rx="1"/></svg>')
        + tab("cart.html","カート",'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M5 7h14l-1.5 13h-11z"/><path d="M9 7a3 3 0 0 1 6 0"/></svg>','<span class="cart-count" data-n="0">0</span>');
      document.body.appendChild(nav); document.body.classList.add("has-tabbar");
    }
    document.querySelectorAll("[data-install]").forEach(a => a.onclick = e => { e.preventDefault(); installApp(); });
    updateCount();
  }

  /* ホーム画面に追加（アプリとして使う）。Androidはそのまま追加、iPhoneは手順を表示 */
  let deferredPrompt = null;
  window.addEventListener("beforeinstallprompt", e => { e.preventDefault(); deferredPrompt = e; });
  function installApp(){
    if(deferredPrompt){ deferredPrompt.prompt(); deferredPrompt.userChoice.finally(() => { deferredPrompt = null; }); return; }
    const standalone = matchMedia("(display-mode: standalone)").matches || navigator.standalone;
    const ios = /iPhone|iPad|iPod/.test(navigator.userAgent);
    const box = document.createElement("div"); box.className = "install-modal";
    box.innerHTML = `<div class="install-box" role="dialog" aria-label="ホーム画面に追加"><h3>ホーム画面に追加</h3>
      ${standalone ? "<p>すでにアプリとして開いています。</p>" : ios ? "<ol><li>Safariでこのページを開きます</li><li>画面下の<b>共有ボタン</b>（四角から矢印が出ているマーク）を押します</li><li><b>「ホーム画面に追加」</b>を押します</li></ol><p>ホーム画面の「ITTENMON」アイコンから、アプリのように開けます。</p>"
        : "<ol><li>ブラウザの右上の <b>︙</b> を押します</li><li><b>「ホーム画面に追加」</b>または<b>「アプリをインストール」</b>を選びます</li></ol>"}
      <button type="button" class="btn btn-block">閉じる</button></div>`;
    box.onclick = e => { if(e.target === box || e.target.tagName === "BUTTON") box.remove(); };
    document.body.appendChild(box);
  }
  if("serviceWorker" in navigator) window.addEventListener("load", () => navigator.serviceWorker.register("sw.js").catch(() => {}));

  window.LICO = { S, yen, esc, isCafe, cafeId, cafeName, installApp, getCart, setCart, subtotal, shipping, api, loadImage, toJpeg, toast, chrome, qs, product, unitPrice, optionText, phoneModel, shapeOf, shapePath, shapeIcon };
})();
