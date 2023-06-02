//defining variables
const selectLanguage = $("select");
const translateBtn = $(".translatebtn");
const fromText = $(".enter-text");
const toText = $(".translation");
const icons = $("i");
const switchLanguages = $(".switch-languages-icon");

//selecting language
selectLanguage.each(function(id) {
  for (var country_code in countries) {
    let selected;
    if (id == 0 && country_code == "en-GB") {
      selected = "selected";
    } else if (id == 1 && country_code == "es-ES") {
      selected = "selected";
    }
    let option = `<option value="${country_code}" ${selected}> ${countries[country_code]} </option>`; //setting the value parameter of option, and the contents of our option
    $(this).append(option);
  }
});

//defining icons functionality
icons.on("click", function(e) {
  var target = $(e.target);
  if (target.hasClass("copy-icon")) {
    if(target.attr("id") == "copy-from") {
      navigator.clipboard.writeText(fromText.val());
    } else {
      navigator.clipboard.writeText(toText.val());
    }
  } else if (target.hasClass("sound-icon")) {
    let utterance;
    if (target.attr("id") == "sound-from") {
      utterance = new SpeechSynthesisUtterance(fromText.val());
      utterance.lang = selectLanguage.eq(0).val();
    } else {
      utterance = new SpeechSynthesisUtterance(toText.val());
      utterance.lang = selectLanguage.eq(1).val();
    }
    speechSynthesis.speak(utterance);
  }
});

//switching between languages 
switchLanguages.on("click", function() {
  let storedText = fromText.val();
  fromText.val(toText.val());
  toText.val(storedText);
  let storedLanguage = selectLanguage.eq(0).val();
  selectLanguage.eq(0).val(selectLanguage.eq(1).val());
  selectLanguage.eq(1).val(storedLanguage);
});

//making translate button work
translateBtn.on("click", function() {
  let text = fromText.val();
  translateFromLanguage = selectLanguage.eq(0).val();
  translateToLanguage = selectLanguage.eq(1).val();
  let myApi = `https://api.mymemory.translated.net/get?q=${text}!&langpair=${translateFromLanguage}|${translateToLanguage}`;
  $.getJSON(myApi, function(data) {
    toText.val(data.responseData.translatedText);

    //toggling icons based on content presence
    if (toText.val().trim() !== "") {
      $(".to-text-sound-icon, .to-text-copy-icon").css("display", "block");
    } else {
      $(".to-text-sound-icon, .to-text-copy-icon").css("display", "none");
    }
  });
});