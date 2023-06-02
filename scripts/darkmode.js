//making theme persist across pages utilizing local storage
const toggleThemes = $(".toggle-theme");
var storedTheme = localStorage.getItem("theme");
if (storedTheme === "dark") {
  $("body").addClass("dark-theme");
  toggleThemes.addClass("fa-rotate-180");
}

//toggling theme
toggleThemes.on("click", function () {
  $("body").toggleClass("dark-theme");
  var isDark = $("body").hasClass("dark-theme");
  if (isDark) {
    localStorage.setItem("theme", "dark");
    toggleThemes.addClass("fa-rotate-180");
  } else {
    localStorage.setItem("theme", "light");
    toggleThemes.removeClass("fa-rotate-180");
  }
});

//removing padding
function removeBgPaddingOnSmallScreen() {
  const pageContainer = $("#pageContainer");
  var screenWidth = $(window).width();
  const body = $("body");

  if (screenWidth <= 1024) {
    pageContainer.removeClass("bg-padding");
    body.removeClass("vh-100");
  } else {
    pageContainer.addClass("bg-padding");
    body.addClass("vh-100");
  }
}

//calling the function upon loading and resizing
$(window).on("load resize", removeBgPaddingOnSmallScreen);