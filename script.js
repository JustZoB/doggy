$(document).ready(function() {
  let doggys_list = [
    "affenpinscher", 
    "african",
    "airedale",
    "akita",
    "appenzeller",
    "basenji",
    "beagle",
    "bluetick",
    "borzoi",
    "bouvier",
    "boxer",
    "brabancon",
    "briard",
    "bulldog/boston",
    "bulldog/english",
    "bulldog/french",
    "bullterrier/staffordshire",
    "cairn",
    "cattledog/australian",
    "chihuahua",
    "chow",
    "clumber",
    "cockapoo",
    "collie/border",
    "coonhound",
    "corgi/cardigan",
    "cotondetulear",
    "dachshund",
    "dalmatian",
    "dane/great",
    "deerhound/scottish",
    "dhole",
    "dingo",
    "doberman",
    "elkhound/norwegian",
    "entlebucher",
    "eskimo",
    "frise/bichon",
    "germanshepherd",
    "greyhound/italian",
    "groenendael",
    "hound/afghan",
    "hound/basset",
    "hound/blood",
    "hound/english",
    "hound/ibizan",
    "husky",
    "keeshond",
    "kelpie",
    "komondor",
    "kuvasz",
    "labrador",
    "leonberg",
    "lhasa",
    "malamute",
    "malinois",
    "maltese",
    "mastiff/bull",
    "mastiff/english",
    "mastiff/tibetan",
    "mexicanhairless",
    "mix",
    "mountain/bernese",
    "mountain/swiss",
    "newfoundland",
    "otterhound",
    "papillon",
    "pekinese",
    "pembroke",
    "pinscher/miniature",
    "pointer/german",
    "pointer/germanlonghair",
    "pomeranian",
    "poodle/miniature",
    "poodle/standard",
    "poodle/toy",
    "pug",
    "puggle",
    "pyrenees",
    "redbone",
    "retriever/chesapeake",
    "retriever/curly",
    "retriever/flatcoated",
    "retriever/golden",
    "ridgeback/rhodesian",
    "rottweiler",
    "saluki",
    "samoyed",
    "schipperke",
    "schnauzer/giant",
    "schnauzer/miniature",
    "setter/english",
    "setter/gordon",
    "setter/irish",
    "sheepdog/english",
    "sheepdog/shetland",
    "shiba",
    "shihtzu",
    "spaniel/blenheim",
    "spaniel/brittany",
    "spaniel/cocker",
    "spaniel/irish",
    "spaniel/japanese",
    "spaniel/sussex",
    "spaniel/welsh",
    "springer/english",
    "stbernard",
    "terrier/american",
    "terrier/australian",
    "terrier/bedlington",
    "terrier/border",
    "terrier/dandie",
    "terrier/fox",
    "terrier/irish",
    "terrier/kerryblue",
    "terrier/lakeland",
    "terrier/norfolk",
    "terrier/norwich",
    "terrier/patterdale",
    "terrier/russell",
    "terrier/scottish",
    "terrier/sealyham",
    "terrier/silky",
    "terrier/tibetan",
    "terrier/toy",
    "terrier/westhighland",
    "terrier/wheaten",
    "terrier/yorkshire",
    "vizsla",
    "weimaraner",
    "whippet",
    "wolfhound/irish"
  ]
  let accordion = $(".accordion");
  let ul = accordion.find("ul");
  let id = 0;
  let doggys = [];

  for (let i = 0; i < 4; i++) {
    createBlock();
  }

  $("#create").on( "click", function() {
    createBlock();
  });
  $("#remove").on( "click", function() {
    removeBlock();
  });
  
  

  function removeBlock() {
    ul.find("#" + (id - 1)).remove();
    id--;
  }

  function createBlock() {

    let newDoggy = doggys_list[Math.round(Math.random() * doggys_list.length)];
    let nameDoggy = newDoggy[0].toUpperCase() + newDoggy.slice(1);
    if (nameDoggy.indexOf("/") >= 1) {
      nameDoggy = nameDoggy.substring(0, nameDoggy.indexOf("/")) + ' ' + nameDoggy.substr(nameDoggy.indexOf("/") + 1);
    }
    doggys[id] = {};
    doggys[id].id = id;
    doggys[id].link = newDoggy;
    doggys[id].name = nameDoggy;

    ul.append("<li id='" + doggys[id].id + 
    "'><input type='checkbox' class='accordion_button'><i></i><h2>" +
      doggys[id].name + "</h2><div class='panel'><div class='images'></div>" +
     "<input type='button' value='Добавить картинку' class='button addImg'></div></li>");

    getRandomImage("https://dog.ceo/api/breed/" + doggys[id].link + "/images/random", doggys[id].id);
    
    $(".addImg").unbind("click").on( "click", function() {
      let parentId = $(this).parent().parent().attr("id");
      let counts = 2;
      counts = countImages(parentId);
      for (let i = 0; i < counts; i++) {
        getRandomImage("https://dog.ceo/api/breed/" + 
        doggys[parentId].link + 
        "/images/random", parentId);
      }
    });

    $(".accordion_button").unbind("click").on( "click", function() {
      toggleAccordion($(this).parent().attr("id"));
    });

    id++;
  }


  function countImages(thisId) {
    let thisLi = $("#" + thisId);
    let thisButton = thisLi.find(".addImg");
    if (!thisButton.hasClass("active")) {
      counts = (+thisId + 1) * 2;
    } else {
      counts = 2;
    }
    if (!thisButton.hasClass("active")) {
      thisButton.toggleClass("active");
    }
    return counts;
  }

  function toggleAccordion(thisId) {
    let thisLi = $("#" + thisId);
    let panel = thisLi.find(".panel");
    if (panel.hasClass("active")) {
      panel.css({'display' : 'none'});
    } else {
      panel.css({'display' : 'block'});
    }
    panel.toggleClass("active");
  }

  function getRandomImage(link, thisId) {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', link, false);
    xhr.send();
    let obj = JSON.parse(xhr.responseText);
    let newLi = ul.find("#" + thisId);
    let blockImages = newLi.find(".images");
    blockImages.append("<img src='" + obj.message +"'>");
  }
});