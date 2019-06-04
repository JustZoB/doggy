$(document).ready(function() {
  let doggys_list = getDoggysList("https://dog.ceo/api/breeds/list/all");

  function getDoggysList(link) {
    let xhr = new XMLHttpRequest();
    let doggys_list = [];
    xhr.open('GET', link, false);
    xhr.send();
    let DoggysList = JSON.parse(xhr.responseText);
    for (key in DoggysList.message) {
      if (DoggysList.message[key] == "") {
        doggys_list.push(key);
      } else {
        for (key_breed in DoggysList.message[key]) {
          doggys_list.push(key + "/" + DoggysList.message[key][key_breed])
        }
      }
    }
    return doggys_list;
  }

  // События для кнопок
  $("#create-accordion").on( "click", function() {
    createAccordion();
  });
  $("body").on( "click", ".create-block", function() {
    createBlocks($(this).attr("data-input-ac-id"));
  });
  $("body").on( "click", ".addImg", function() {
    addImg($(this).attr("data-input-ac-id"), $(this).attr("data-input-add-id"), $(this).attr("data-doggy"));
  });
  $("body").on( "click", ".removeBlock", function() {
    removeBlock($(this).attr("data-input-remove-id"), $(this).attr("data-doggy"));
  });

  let container = $(".container");
  let ac_count = -1;
  let id = 0;

  createAccordion();
  for (let i = 0; i < 3; i++) {
    createBlock(ac_count);
  }

  function createAccordion() {
    ac_count++;
    
    container.append("<div data-ac-id='" + ac_count + 
    "'><div class='buttons__block'><input data-input-ac-id='" + ac_count + 
    "' type='button' value='Создать блоков' class='button create-block'>" +
    "<input type='text' value='1' class='input_text'></div><div class='accordion'><ul></ul></div></div>");

    createBlock(ac_count);
  }

  function createBlocks(ac_id) {
    let currunt_ac = container.find("[data-ac-id='" + ac_id)
    let countCreate = 0;
    let inputValue = currunt_ac.find(".input_text").val();
    if (!isNaN(inputValue)) countCreate = inputValue;
    for (let i = 0; i < countCreate; i++) {
      createBlock(ac_id);
    }
  }
  
  function createBlock(ac_id) {
    let newDoggy = doggys_list[Math.round(Math.random() * doggys_list.length)];
    doggys_list.splice(doggys_list.indexOf(newDoggy), 1);

    let nameDoggy = newDoggy[0].toUpperCase() + newDoggy.slice(1);
    if (nameDoggy.indexOf("/") >= 1) {
      nameDoggy = nameDoggy.substring(0, nameDoggy.indexOf("/")) + 
      ' ' + nameDoggy.substr(nameDoggy.indexOf("/") + 1);
    }

    let currunt_ac = $("[data-ac-id='" + ac_id + "']");
    let ul = currunt_ac.find("ul");
    let li_id = id;
    let input_id = "input_" + id;
    
    ul.append("<li data-id='" + li_id + 
    "'><input id='" + input_id + "' name='accordion-" + ac_id + 
    "' type='radio' class='accordion_button'" + 
    "><i></i><label for='" + input_id + "'>" + nameDoggy + 
    "</label><div class='panel'><div class='images'></div>" +
     "<div class='accoridon__block__buttons'>" +
     "<input data-input-ac-id='" + ac_id + "' data-input-add-id='" + li_id + 
     "' data-doggy='" + newDoggy + 
     "' type='button' value='Добавить картинку' class='button addImg'>" +
     "<input data-input-remove-id='" + li_id + "' data-doggy='" + newDoggy + 
     "' type='button' value='Убрать блок' class='button removeBlock'>" + 
     "</div></div></li>");

    getRandomImage(id, "https://dog.ceo/api/breed/" + newDoggy + "/images/random");

    id++;
  }

  function addImg(thisAcId, thisId, thisDoggy) {
    let counts = 2;
    let position = 0;
    position = findPosition(thisAcId, thisId);
    counts = countImages(thisId, position);
    for (let i = 0; i < counts; i++) {
      getRandomImage(thisId, "https://dog.ceo/api/breed/" + thisDoggy + "/images/random");
    }
  }

  function removeBlock(thisId, thisDoggy) {
    container.find("[data-id='" + thisId + "']").remove();
    doggys_list.push(thisDoggy);
  }

  function findPosition(thisAcId, thisId) { 
    let thisAc = $("[data-ac-id='" + thisAcId + "']");
    let thisLis = thisAc.find("li");
    let thisLi = thisAc.find("[data-id='" + thisId + "']");
    let pos = 0;
    pos = thisLis.index(thisLi);
    return pos;
  }

  function countImages(thisId, position) {
    let thisLi = $("[data-input-add-id='" + thisId + "']");
    let thisButton = thisLi.find(".addImg");
    counts = 2;
    if (!thisButton.hasClass("active")) {
      counts = (+position + 1) * 2;
    }
    if (!thisButton.hasClass("active")) {
      thisButton.addClass("active");
    }
    return counts;
  }

  function getRandomImage(thisId, link) {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', link, false);
    xhr.send();
    let obj = JSON.parse(xhr.responseText);
    let thisLi = container.find("[data-id='" + thisId + "']");
    let blockImages = thisLi.find(".images");
    blockImages.append("<img src='" + obj.message +"'>");
  }
});