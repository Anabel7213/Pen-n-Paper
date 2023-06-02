//defining variables
const removeIcon = $(".close-icon");
const searchInput = $("input");
const discoverBtn = $(".word-search-btn");
const backToSearch = $(".back-to-search");
const searchSection = $(".search");
const revealedSection = $(".revealed");
const errorMessage = $(".error-msg");
const playSound = $(".play-sound");
const definitionsContainer = $(".definitions");
const synonymsContainer = $(".synonyms");
const examplesContainer = $(".examples");
const mobileMenuToggle = $("#hamburger-icon");
const mobileMenu = $(".hamburger");
const hideMenu = $("#close-mobile-menu-icon");

//toggling mobile menu 
mobileMenuToggle.on("click", function () {
    mobileMenu.addClass("active");
    hideMenu.css("display", "block");
    mobileMenuToggle.css("display", "none");
});
hideMenu.on("click", function () {
    mobileMenu.removeClass("active");
    hideMenu.css("display", "none");
    mobileMenuToggle.css("display", "block");
});

//erasing input
removeIcon.on("click", function () {
    const input = $(this).closest(".search-bar").find("input");
    input.val("");
    errorMessage.css("display", "none");
});

//going back to search
backToSearch.on("click", function () {
    searchInput.val("");
    searchSection.css("display", "block");
    revealedSection.css("display", "none");
    errorMessage.css("display", "none");
});

//pulling up relevant data values based on the search input
function data(result, word) {
    //displaying error if a searched word does not exist, if it does carrying out our set of instructions
    if (result.title) {
        errorMessage.html(`Oopsie... nothing on <span>"${word}"</span>! Try another word :)`);
        errorMessage.css("display", "block");
    } else {
        console.log(result);
        searchSection.css("display", "none");
        revealedSection.css("display", "block");
        const meanings = result[0].meanings;
        let notEmpty = meanings.find(meaning => meaning.synonyms.length > 0);
        const definitions = result[0].meanings[0].definitions;
        const definitionsList = $("<ol>").addClass("d-flex flex-column gap-2");
        for (let i = 0; i < Math.min(definitions.length, 3); i++) {
            const definition = definitions[i];
            const listItem = $("<li>").text(definition.definition);
            definitionsList.append(listItem);
        }
        definitionsContainer.html("").append(definitionsList);
        if (notEmpty) {
            const synonyms = notEmpty.synonyms;
            synonymsContainer.html("");
            for (let i = 0; i < Math.min(synonyms.length, 5); i++) {
                const synonym = synonyms[i];
                const span = $("<span>")
                    .addClass("synonym")
                    .text(synonym)
                    .on("click", function () {
                        searchInput.val(synonym);
                        fetchAPI(synonym);
                    });
                synonymsContainer.append(span);
            }
        } else {
            synonymsContainer.text("No synonyms found ¯\\_(ツ)_/¯");
        }
        examplesContainer.html("");
        const examplesHeading = $("<h2>").text("Examples");
        examplesContainer.append(examplesHeading);
        const examplesList = $("<ul>").addClass("d-flex flex-column gap-2");
        examplesContainer.append(examplesList);

        let examplesCount = 0;
        for (let i = 0; i < meanings.length; i++) {
            const definitions = meanings[i].definitions;
            for (let j = 0; j < definitions.length; j++) {
                const definition = definitions[j];
                if (definition.example) {
                    const listItem = $("<li>").text(definition.example);
                    examplesList.append(listItem);
                    examplesCount++;
                    if (examplesCount === 5) {
                        break;
                    }
                }
            }
            if (examplesCount === 5) {
                break;
            }
        }
        if (examplesCount === 0) {
            examplesContainer.html('<p>Oh no! No examples were found for this one...</p>');
        }
//enabling audio speech
        $(".word h1").html(result[0].word);
        $(".phonetic").html(`${result[0].meanings[0].partOfSpeech} ${result[0].phonetics[0].text}`);
        if (result[0].phonetics.length > 0) {
            for (let i = 0; i < result[0].phonetics.length; i++) {
                if (result[0].phonetics[i].audio) {
                    audio = new Audio(result[0].phonetics[i].audio);
                    break;
                }
            }
        } else {
            audio = new Audio();
        }
    }
}

//fetching API 
function fetchAPI(word) {
    let url = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;
    fetch(url).then(res => res.json()).then(result => data(result, word)).catch(error => console.error(error));
  }

//making the search button work
discoverBtn.on("click", function () {
    const searchSection = $(this).closest(".search, .mobile-search-container");
    const searchInput = searchSection.find("input");
    const word = searchInput.val();
  
    if (word) {
      fetchAPI(word);
    }
  });

//listening to the "Enter" key press and responding with function execution
searchInput.on("keyup", function (event) {
    if (event.key === "Enter" && event.target.value) {
        fetchAPI(event.target.value);
    }
});

//playing sound 
let audio = new Audio();
playSound.on("click", function () {
    if (audio.src) {
      audio.play();
    }
  });
  