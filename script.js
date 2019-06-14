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
  
  document.getElementById('create-accordion').onclick = function() {
    createAccordion();
  };
  document.addEventListener('click',function(e){
    if(e.target && e.target.classList.contains('create-block')){
      createBlocks(e.target.parentElement.parentElement.getAttribute("data-ac-id"));
     }
  });
  document.addEventListener('click',function(e){
    if(e.target && e.target.classList.contains('addImg')){
      addImg(e.target.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.getAttribute("data-ac-id"),
      e.target.parentElement.parentElement.parentElement.getAttribute("data-id"), e.target.getAttribute("data-doggy"));
     }
  });
  document.addEventListener('click',function(e){
    if(e.target && e.target.classList.contains('removeBlock')){
      removeBlock(e.target.parentElement.parentElement.parentElement.getAttribute("data-id"), e.target.getAttribute("data-doggy"));
     }
  });
  
  let container = document.querySelector(".container");
  let ac_count = -1;
  let id = 0;
  let c = 0;

  function lsTest(){
    var test = 'test';
    try {
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch(e) {
      return false;
    }
  }

  if(lsTest() === true){
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
  } else {
      createAccordion();
      for (let i = 0; i < 3; i++) {
        createBlock(ac_count);
      }
  }

  function createAccordion() {
    ac_count++;
    localStorage.setItem("ac_count", ac_count);
    htmlAccordion(ac_count);
    createBlock(ac_count);
  }

  function htmlAccordion(ac_id) {
    let divAc = document.createElement('div');
    divAc.setAttribute('data-ac-id', ac_id);
    let buttonBlock = document.createElement('div');
    buttonBlock.classList.add('buttons__block');
    divAc.appendChild(buttonBlock);
    let createButton = document.createElement('input');
    createButton.setAttribute('data-input-ac-id', ac_id);
    createButton.setAttribute('type', 'button');
    createButton.setAttribute('value', 'Создать блоков');
    createButton.classList.add('button');
    createButton.classList.add('create-block');
    buttonBlock.appendChild(createButton);
    let textButton = document.createElement('input');
    textButton.setAttribute('type', 'text');
    textButton.setAttribute('value', '1');
    textButton.classList.add('input_text');
    buttonBlock.appendChild(textButton);
    let accoridonBlock = document.createElement('div');
    accoridonBlock.classList.add('accordion');
    let ulAccordion = document.createElement('ul');
    accoridonBlock.appendChild(ulAccordion);

    divAc.appendChild(accoridonBlock);
    container.appendChild(divAc);
  }

  function createLocalBlock(ac_id, newDoggy, images) {
    doggys_list.splice(doggys_list.indexOf(newDoggy), 1);
    let nameDoggy = newDoggy[0].toUpperCase() + newDoggy.slice(1);
    if (nameDoggy.indexOf("/") >= 1) {
      nameDoggy = nameDoggy.substring(0, nameDoggy.indexOf("/")) + 
      ' ' + nameDoggy.substr(nameDoggy.indexOf("/") + 1);
    }

    htmlBlock(ac_id, nameDoggy, newDoggy);

    
    let li = document.querySelector("[data-id='" + id +"']");
    let blockImages = li.querySelector(".images");

    for (let i = 0; i < images.length; i++) {
      let newImage = document.createElement('img');
      newImage.setAttribute('src', images[i]);
      blockImages.appendChild(newImage);
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
    let currunt_ac = document.querySelector("[data-ac-id='" + ac_id + "']")
    let ul = currunt_ac.querySelector("ul");
    let li_id = id;
    let input_id = "input_" + id;

    let li = document.createElement('li');
    li.setAttribute('data-id', li_id);

    let accordionRadio = document.createElement('input');
    accordionRadio.setAttribute('id', input_id);
    accordionRadio.setAttribute('type', 'radio');
    accordionRadio.setAttribute('name', 'accordion-' + ac_id);
    accordionRadio.classList.add('accordion_button');
    let accordionI = document.createElement('i');
    let accordionLabel = document.createElement('label');
    accordionLabel.setAttribute('for', input_id);
    accordionLabel.innerHTML = nameDoggy;
    let accordionPanel = document.createElement('div');
    accordionPanel.classList.add('panel');

    let panelImages = document.createElement('div');
    panelImages.classList.add('images');
    let panelButtonsBlock = document.createElement('div');
    panelButtonsBlock.classList.add('accoridon__block__buttons');

    let panelButtonAdd = document.createElement('input');
    panelButtonAdd.setAttribute('data-doggy', newDoggy);
    panelButtonAdd.setAttribute('type', 'button');
    panelButtonAdd.setAttribute('value', 'Добавить картинку');
    panelButtonAdd.classList.add('button');
    panelButtonAdd.classList.add('addImg');
    let panelButtonRemove = document.createElement('input');
    panelButtonRemove.setAttribute('data-doggy', newDoggy);
    panelButtonRemove.setAttribute('type', 'button');
    panelButtonRemove.setAttribute('value', 'Убрать блок');
    panelButtonRemove.classList.add('button');
    panelButtonRemove.classList.add('removeBlock');

    panelButtonsBlock.appendChild(panelButtonAdd);
    panelButtonsBlock.appendChild(panelButtonRemove);

    accordionPanel.appendChild(panelImages);
    accordionPanel.appendChild(panelButtonsBlock);
    
    li.appendChild(accordionRadio);
    li.appendChild(accordionI);
    li.appendChild(accordionLabel);
    li.appendChild(accordionPanel);
    ul.appendChild(li);
  }

  function createBlocks(ac_id) {
    let currunt_ac = document.querySelector("[data-ac-id='" + ac_id + "']");
    let countCreate = 0;
    let inputValue = currunt_ac.querySelector(".input_text").value;
    if (!isNaN(inputValue)) countCreate = inputValue;
    for (let i = 0; i < countCreate; i++) {
      createBlock(ac_id);
    }
  }

  function addImg(ac_id, id, doggy) {
    let counts = 2, position = 0;
    let newImagesForDoggy = JSON.parse(localStorage.getItem(doggy));
    position = findPosition(ac_id, id);
    counts = countImages(id, position);
    for (let i = 0; i < counts; i++) {
      newImagesForDoggy.images.push(getRandomImage(id, "https://dog.ceo/api/breed/" + doggy + "/images/random"));
    }
    localStorage.setItem(doggy, JSON.stringify(newImagesForDoggy));
  }

  function removeBlock(id, doggy) {
    document.querySelector("[data-id='" + id + "']").remove();
    localStorage.removeItem(doggy);
    doggys_list.push(doggy);
  }

  function findPosition(ac_id, id) { 
    let ac = document.querySelector("[data-ac-id='" + ac_id + "']");
    let lis = ac.querySelectorAll("li");
    let li = ac.querySelector("[data-id='" + id + "']");
    let dataId = li.getAttribute("data-id");
    let pos = 0;
    for (let i = 0; i < lis.length; i++) {
      if (lis[i].getAttribute("data-id") == dataId) {
        pos = i;
      }
    }
    return pos;
  }

  function countImages(id, position) {
    let li = document.querySelector("[data-id='" + id + "']");
    let button = li.querySelector(".addImg");
    counts = 2;
    if (!button.classList.contains("active")) {
      counts = (position + 1) * 2;
    }
    if (!button.classList.contains("active")) {
      button.classList.add("active");
    }
    return counts;
  }

  function getRandomImage(id, link) {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', link, false);
    xhr.send();
    let obj = JSON.parse(xhr.responseText);
    let li = document.querySelector("[data-id='" + id + "']");
    let blockImages = li.querySelector(".images");
    let newImage = document.createElement('img');
    newImage.setAttribute('src', obj.message);
    blockImages.appendChild(newImage);
    return obj.message;
  }
});