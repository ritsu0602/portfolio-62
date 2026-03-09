document.addEventListener("DOMContentLoaded", function () {
  var scrollZone = document.querySelector(".fv-scroll-zone");
  var fv1        = document.querySelector(".FV_1");
  var noizuEl    = document.querySelector(".noizu");
  var about      = document.querySelector(".about");
  if (!scrollZone || !fv1) return;

  var isMobile = window.innerWidth <= 768;

  // ── 黒フェードオーバーレイを生成 ──────────────────────────
  var blackOverlay = document.createElement("div");
  blackOverlay.className = "fv-black-overlay";
  document.body.appendChild(blackOverlay);

  if (about && !isMobile) {
    about.classList.add("about-will-animate");
  }

  // about 登場は一度だけ（スクロールゾーン再突入でリセット可能）
  var aboutRevealed = false;
  var revealTimer   = null;

  // ── イージング ────────────────────────────────────────────
  function easeInQuart(t) { return t * t * t * t; }
  function easeInQuad(t)  { return t * t; }

  function getMaxScale() {
    return Math.max(
      window.innerWidth  / fv1.offsetWidth,
      window.innerHeight / fv1.offsetHeight
    ) * 30;
  }

  // ── スクロールハンドラ ────────────────────────────────────
  function update() {
    if (isMobile) {
      fv1.style.transform = "";
      return;
    }

    var scrollY  = window.scrollY;
    var animEnd  = scrollZone.offsetHeight - window.innerHeight;
    var progress = scrollY / animEnd; // 0 〜 1（以上）

    // ① FV_1 ズーム：常にスクロール位置に追従（戻しても逆再生）
    if (progress <= 0) {
      fv1.style.transform = "scale(1)";
    } else if (progress >= 1) {
      fv1.style.transform = "scale(" + getMaxScale() + ")";
    } else {
      // 0→0.6 でズーム完了、0.6→1 は最大スケール維持
      var zoomEase = easeInQuart(Math.min(1, progress / 0.6));
      fv1.style.transform =
        "scale(" + (1 + (getMaxScale() - 1) * zoomEase) + ")";
    }

    // ② 黒オーバーレイ：スクロール位置で不透明度を決定（逆再生にも対応）
    if (progress < 0.6) {
      blackOverlay.style.opacity = "0";
    } else if (progress < 0.75) {
      // ズーム完了後にすばやく黒くなる
      blackOverlay.style.opacity = String(easeInQuad((progress - 0.6) / 0.15));
    } else {
      // 0.75 以降は常に真っ黒（about・works 以下は z-index で上に出す）
      blackOverlay.style.opacity = "1";
    }

    // ③ about 登場制御
    if (progress >= 1) {
      // ゾーン終了 → 500ms 後に about を登場させる
      if (!aboutRevealed && !revealTimer) {
        revealTimer = setTimeout(function () {
          revealTimer    = null;
          aboutRevealed  = true;
          about.style.transition =
            "opacity 1.2s ease, transform 1.2s cubic-bezier(0.16, 1, 0.3, 1)";
          about.classList.add("is-visible");
        }, 500);
      }
    } else {
      // スクロールゾーンに戻った → タイマーをキャンセルして about をリセット
      if (revealTimer) {
        clearTimeout(revealTimer);
        revealTimer = null;
      }
      if (aboutRevealed) {
        aboutRevealed = false;
        about.style.transition = "none"; // 瞬時にリセット
        about.classList.remove("is-visible");
        // transition:none を解除（次の登場アニメーションのため）
        requestAnimationFrame(function () {
          about.style.transition = "";
        });
      }
    }
  }

  window.addEventListener("scroll", update, { passive: true });
  update();

  // ── noizu の中心を固定ズームターゲットに設定 ─────────────
  if (!isMobile && noizuEl) {
    var noizuRect = noizuEl.getBoundingClientRect();
    var fv1Rect   = fv1.getBoundingClientRect();
    var centerX   = (noizuRect.left - fv1Rect.left) + noizuRect.width  * 0.5;
    var centerY   = (noizuRect.top  - fv1Rect.top)  + noizuRect.height * 0.5;
    fv1.style.transformOrigin =
      (centerX / fv1.offsetWidth  * 100).toFixed(1) + "% " +
      (centerY / fv1.offsetHeight * 100).toFixed(1) + "%";
  }
});
