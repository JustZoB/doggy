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
  getDoggysList("https://dog.ceo/api/breeds/list/all");

  function getDoggysList(link) {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', link, false);
    xhr.send();
    let lss = JSON.parse(xhr.responseText);
    //alert( lss.message );
  }


  let accordion = $(".accordion");
  let ul = accordion.find("ul");
  let id = 0;
  let key = 0;
  let doggys = [];

  for (let i = 0; i < 4; i++) {
    createBlock();
  }

  $("#create").on( "click", function() {
    createBlocks();
  });
  $("#remove").on( "click", function() {
    removeBlock();
  });

  function createBlocks() {
    let countCreate = 0;
    let inputValue = $(".input_text").val();
    if (!isNaN(inputValue)) countCreate = inputValue;
    for (let i = 0; i < countCreate; i++) {
      createBlock();
    }
  }
  
  function createBlock() {
    let newDoggy = doggys_list[Math.round(Math.random() * doggys_list.length)];
    
    doggys_list.splice( doggys_list.indexOf(newDoggy), 1 );

    let nameDoggy = newDoggy[0].toUpperCase() + newDoggy.slice(1);
    if (nameDoggy.indexOf("/") >= 1) {
      nameDoggy = nameDoggy.substring(0, nameDoggy.indexOf("/")) + ' ' + nameDoggy.substr(nameDoggy.indexOf("/") + 1);
    }
    doggys[key] = {};
    doggys[key].id = id;
    doggys[key].link = newDoggy;
    doggys[key].name = nameDoggy;

    ul.append("<li id='" + doggys[key].id + 
    "'><input type='checkbox' class='accordion_button'><i></i><h2>" +
      doggys[key].name + "</h2><div class='panel'><div class='images'></div>" +
     "<div class='accoridon__block__buttons'><input type='button' value='Добавить картинку' class='button addImg'>" +
     "<input type='button' value='Убрать блок' id='remove' class='button removeBlock'></div></div></li>");

    getRandomImage("https://dog.ceo/api/breed/" + doggys[key].link + "/images/random", doggys[key].id);
  
    let button__addImg = ul.find("#" + doggys[key].id + " .addImg");
    button__addImg.on( "click", function() {
      addImg($(this).parent().parent().parent().attr("id"));
    });
    let button__removeBlock = ul.find("#" + doggys[key].id + " .removeBlock");
    button__removeBlock.on( "click", function() {
      removeBlock($(this).parent().parent().parent().attr("id"));
    });
    $(".accordion_button").unbind("click").on( "click", function() {
      toggleAccordion($(this).parent().attr("id"));
    });
    id++;
    key++;
  }

  function findKey(thisId) { 
    let i = 0;
    let thisKey = 0;
    doggys.forEach(element => {
      if (element.id == thisId) {
        thisKey = i;
      }
      i++;
    });
    return thisKey;
  }

  function addImg(thisId) {
    let counts = 2;
    let thisKey = 0;
    thisKey = findKey(thisId);

    counts = countImages(thisId, thisKey);
    for (let i = 0; i < counts; i++) {
      getRandomImage("https://dog.ceo/api/breed/" + 
      doggys[thisKey].link + 
      "/images/random", thisId);
    }
  }

  function countImages(thisId, position) {
    let thisLi = $("#" + thisId);
    let thisButton = thisLi.find(".addImg");
    if (!thisButton.hasClass("active")) {
      counts = (+position + 1) * 2;
    } else {
      counts = 2;
    }
    if (!thisButton.hasClass("active")) {
      thisButton.toggleClass("active");
    }
    return counts;
  }

  function removeBlock(thisId) {
    ul.find("#" + (thisId)).remove();
    thisKey = findKey(thisId);
    doggys_list.push(doggys[thisKey].link);
    doggys.splice(thisId, 1);
    key--;
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