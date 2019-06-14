document.addEventListener("DOMContentLoaded", function(event) {
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
  //localStorage.clear();
  // События для кнопок
  document.getElementById('create-accordion').onclick = function() {
    createAccordion();
  };

  /*document.querySelectorAll(".create-block").addEventListener('click', function() {
    createBlocks();
  });*/

  //-----------------------------------//
  $("body").on( "click", ".create-block", function() {
    createBlocks($(this).parents().eq(1).attr("data-ac-id"));
  });
  $("body").on( "click", ".addImg", function() {
    addImg($(this).parents().eq(5).attr("data-ac-id"),
     $(this).parents().eq(2).attr("data-id"), $(this).attr("data-doggy"));
  });
  $("body").on( "click", ".removeBlock", function() {
    removeBlock($(this).parents().eq(2).attr("data-id"), $(this).attr("data-doggy"));
  });
  //-------------------------//
  let container = $(".container"); //------------
  let ac_count = -1;
  let id = 0;
  let c = 0;
  if (localStorage.length == 0) {
    createAccordion();
    for (let i = 0; i < 3; i++) {
      createBlock(ac_count);
    }
  } else {
    for (let key in localStorage) {
      if (key == "ac_count") {
        for (let i = 0; i <= localStorage[key]; i++) {
          htmlAccordion(i);
        }
        ac_count = localStorage[key];
      } 
    }
    for (let key in localStorage) {
      if (c < localStorage.length) {
        let newImagesForDoggy = JSON.parse(localStorage.getItem(key));
        if (newImagesForDoggy.ac != undefined) {
          let ac = newImagesForDoggy.ac;
          let name = newImagesForDoggy.name;
          let images = newImagesForDoggy.images;
          createLocalBlock(ac, name, images);
        }
        c++;
      }
    }
  }
  
  function createAccordion() {
    ac_count++;
    localStorage.setItem("ac_count", ac_count);
    htmlAccordion(ac_count);
    createBlock(ac_count);
  }

  function htmlAccordion(ac_id) {
    container.append("<div data-ac-id='" + ac_id + "'></div");
    let newAc = container.find("[data-ac-id=" + ac_id +"]");
    newAc.append("<div class='buttons__block'></div>");
    let buttons__block = newAc.find(".buttons__block");
    buttons__block.append("<input data-input-ac-id='" + ac_id + "' type='button' value='Создать блоков' class='button create-block'>");
    buttons__block.append("<input type='text' value='1' class='input_text'>");
    newAc.append("<div class='accordion'><ul></ul></div>");
  }

  function createBlocks(ac_id) {
    let currunt_ac = container.find("[data-ac-id='" + ac_id + "']");
    let countCreate = 0;
    let inputValue = currunt_ac.find(".input_text").val();
    if (!isNaN(inputValue)) countCreate = inputValue;
    for (let i = 0; i < countCreate; i++) {
      createBlock(ac_id);
    }
  }

  function createLocalBlock(ac_id, newDoggy, images) {
    doggys_list.splice(doggys_list.indexOf(newDoggy), 1);
    let nameDoggy = newDoggy[0].toUpperCase() + newDoggy.slice(1);
    if (nameDoggy.indexOf("/") >= 1) {
      nameDoggy = nameDoggy.substring(0, nameDoggy.indexOf("/")) + 
      ' ' + nameDoggy.substr(nameDoggy.indexOf("/") + 1);
    }

    htmlBlock(ac_id, nameDoggy, newDoggy);

    let currunt_ac = container.find("[data-ac-id='" + ac_id + "']");
    let ul = currunt_ac.find("ul");
    let li_id = id;
    let li = ul.find("[data-id=" + li_id +"]");
     
    for (let i = 0; i < images.length; i++) {
      let blockImages = li.find(".images");
      blockImages.append("<img src='" + images[i] +"'>");
    }

    id++;
  }

  function createBlock(ac_id) {
    let newDoggy = doggys_list[Math.round(Math.random() * doggys_list.length)];

    doggys_list.splice(doggys_list.indexOf(newDoggy), 1);
    let nameDoggy = newDoggy[0].toUpperCase() + newDoggy.slice(1);
    if (nameDoggy.indexOf("/") >= 1) {
      nameDoggy = nameDoggy.substring(0, nameDoggy.indexOf("/")) + 
      ' ' + nameDoggy.substr(nameDoggy.indexOf("/") + 1);
    }

    htmlBlock(ac_id, nameDoggy, newDoggy);

    let newLocalDog = {}; 
    newLocalDog.ac = ac_id; 
    newLocalDog.name = newDoggy;
    newLocalDog.images = [];

    newLocalDog.images.push(getRandomImage(id, "https://dog.ceo/api/breed/" + newDoggy + "/images/random"));
    localStorage.setItem(newDoggy, JSON.stringify(newLocalDog));

    id++;
  }

  function htmlBlock(ac_id, nameDoggy, newDoggy) {
    let currunt_ac = container.find("[data-ac-id='" + ac_id + "']");
    let ul = currunt_ac.find("ul");
    let li_id = id;
    let input_id = "input_" + id;
    
    ul.append("<li data-id='" + li_id + "'></li>");
    let li = ul.find("[data-id=" + li_id +"]");
    li.append("<input id='" + input_id + "' name='accordion-" + ac_id + "' type='radio' class='accordion_button'>");
    li.append("<i></i>");
    li.append("<label for='" + input_id + "'>" + nameDoggy + "</label>");
    li.append("<div class='panel'></div>");
    let panel = li.find(".panel");
    panel.append("<div class='images'></div>");
    panel.append("<div class='accoridon__block__buttons'></div>");
    let ac_block_buttons = panel.find(".accoridon__block__buttons");
    ac_block_buttons.append("<input data-doggy='" + newDoggy + "' type='button' value='Добавить картинку' class='button addImg'>");
    ac_block_buttons.append("<input data-doggy='" + newDoggy + "' type='button' value='Убрать блок' class='button removeBlock'>");
  }

  function addImg(ac_id, id, doggy) {
    let counts = 2;
    let position = 0;
    let newImagesForDoggy = JSON.parse(localStorage.getItem(doggy));
    position = findPosition(ac_id, id);
    counts = countImages(id, position);
    for (let i = 0; i < counts; i++) {
      newImagesForDoggy.images.push(getRandomImage(id, "https://dog.ceo/api/breed/" + doggy + "/images/random")); //
    }
    localStorage.setItem(doggy, JSON.stringify(newImagesForDoggy));
  }

  function removeBlock(id, doggy) {
    container.find("[data-id='" + id + "']").remove();
    localStorage.removeItem(doggy);
    doggys_list.push(doggy);
  }

  function findPosition(ac_id, id) { 
    let ac = container.find("[data-ac-id='" + ac_id + "']");
    let lis = ac.find("li");
    let li = ac.find("[data-id='" + id + "']");
    let pos = 0;
    pos = lis.index(li);
    return pos;
  }

  function countImages(id, position) {
    let li = container.find("[data-id='" + id + "']");
    let button = li.find(".addImg");
    counts = 2;
    if (!button.hasClass("active")) {
      counts = (position + 1) * 2;
    }
    if (!button.hasClass("active")) {
      button.addClass("active");
    }
    return counts;
  }

  function getRandomImage(id, link) {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', link, false);
    xhr.send();
    let obj = JSON.parse(xhr.responseText);
    let li = container.find("[data-id='" + id + "']");
    let blockImages = li.find(".images");
    blockImages.append("<img src='" + obj.message +"'>");
    return obj.message;
  }
});