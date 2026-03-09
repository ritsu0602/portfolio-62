document.addEventListener("DOMContentLoaded", function () {
  var menu = document.querySelector(".hb-menu");
  var btn  = document.querySelector(".hb-btn");
  var nav  = document.querySelector(".hb-nav");
  if (!menu || !btn) return;

  btn.addEventListener("click", function () {
    var isOpen = menu.classList.toggle("is-open");
    btn.setAttribute("aria-expanded", isOpen ? "true" : "false");
  });

  // リンクをタップしたらメニューを閉じる
  if (nav) {
    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        menu.classList.remove("is-open");
        btn.setAttribute("aria-expanded", "false");
      });
    });
  }
});
