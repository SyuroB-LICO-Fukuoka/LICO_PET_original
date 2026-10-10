/* LICO PET original 共通処理（ヘッダー・フッター・カート・送信） */
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

  /* カート（写真本体は送信済みのファイルIDと、小さな見本画像だけを保存） */
  let mem = [];
  const getCart = () => { try{ return JSON.parse(localStorage.getItem(KEY_CART)||"[]"); }catch(_){ return mem; } };
  const setCart = c => { mem=c; try{ localStorage.setItem(KEY_CART, JSON.stringify(c)); }catch(_){} updateCount(); };
  const cartQty = () => getCart().reduce((a,i)=>a+(i.qty||0),0);
  const subtotal = () => getCart().reduce((a,i)=>a+S.PRODUCT.price*(i.qty||0),0);
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
      ${isCafe()?`<div class="mode-bar">店頭受付モード（カフェ）｜お支払いは毎週まとめて店頭で</div>`:`<div class="notice">${S.SHIPPING_FEE?`送料 全国一律 ${yen(S.SHIPPING_FEE)}`:"送料無料"}｜1点からおつくりします</div>`}
      <header class="site"><div class="wrap head">
        <a href="index.html" class="logo">${esc(S.SHOP_NAME)}</a>
        <nav class="gnav"><a href="product.html">商品</a><a href="index.html#howto">ご注文の流れ</a><a href="index.html#gift">ギフト</a><a href="index.html#about">私たちについて</a><a href="product.html#faq">よくあるご質問</a></nav>
        <a href="cart.html" class="cart-link" aria-label="カート"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M5 7h14l-1.5 13h-11z"/><path d="M9 7a3 3 0 0 1 6 0"/></svg><span class="cart-count" data-n="0">0</span></a>
      </div></header>`;
    }
    const foot = document.getElementById("site-footer");
    if(foot){
      foot.outerHTML = `<footer class="site"><div class="wrap">
        <div class="foot">
          <div><div class="logo">${esc(S.SHOP_NAME)}</div><p style="margin-top:10px;color:#aaa">運営：株式会社かむらっど<br><a href="https://syurob-lico-fukuoka.github.io/syuroB-LICO/" target="_blank" rel="noopener" style="text-decoration:underline">就労継続支援B型 LICO（リコ）</a></p></div>
          <div><h4>ショップ</h4><ul><li><a href="product.html">商品</a></li><li><a href="index.html#howto">ご注文の流れ</a></li><li><a href="cart.html">カート</a></li></ul></div>
          <div><h4>ご案内</h4><ul><li><a href="tokushoho.html">特定商取引法に基づく表記</a></li><li><a href="tokushoho.html#privacy">プライバシーポリシー</a></li><li><a href="${esc(S.LINE_URL)}" target="_blank" rel="noopener">LINEでお問い合わせ</a></li></ul></div>
        </div>
        <div class="pay"><span>VISA</span><span>Mastercard</span><span>JCB</span><span>AMEX</span><span>Apple Pay</span><span>Google Pay</span></div>
        <p class="copy">© 2026 ${esc(S.SHOP_NAME)}</p>
      </div></footer>`;
    }
    updateCount();
  }

  window.LICO = { S, yen, esc, isCafe, cafeId, getCart, setCart, subtotal, shipping, api, loadImage, toJpeg, toast, chrome, qs };
})();
