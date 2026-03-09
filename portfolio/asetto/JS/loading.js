(function () {
  var waveform = document.getElementById("waveform");
  var playBtn  = document.getElementById("playBtn");
  var barCount = 50;

  // 波形生成
  for (var i = 0; i < barCount; i++) {
    var bar = document.createElement("div");
    bar.classList.add("bar");
    var duration = 0.4 + Math.random() * 0.8;
    var delay    = Math.random() * 2;
    bar.style.animationDuration = duration + "s";
    bar.style.animationDelay   = "-" + delay + "s";
    var centerDist = Math.abs(i - barCount / 2);
    var baseHeight = Math.max(15, 75 - centerDist * 2.8);
    bar.style.height = baseHeight + "%";
    waveform.appendChild(bar);
  }

  // 3秒後: 再生ボタンを押し込み → 0.5秒後: ローディング終了
  window.addEventListener("load", function () {
    setTimeout(function () {
      playBtn.classList.add("clicked");

      setTimeout(function () {
        document.body.classList.remove("is-loading");
        document.body.classList.add("loaded");
      }, 500);
    }, 3000);
  });
})();
