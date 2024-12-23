var current_photo = 1

var i = 0;

var x = window.matchMedia("(max-width: 768px)")

function avanti() {

  if (x.matches) {

    document.getElementById("img" + current_photo).style.display = "none";
    if (current_photo == 6) {
      document.getElementById("img1").style.display = "block";
      current_photo = 0;
    }
    else {
      document.getElementById("img" + (current_photo + 1)).style.display = "block";

    }
    current_photo += 1
  }
  else {
    document.getElementById("img" + current_photo).style.display = "none";

    if (current_photo == 5) {
      document.getElementById("img6").style.display = "none";
      document.getElementById("img1").style.display = "block";
      document.getElementById("img2").style.display = "block";
      current_photo = 0
    }
    else {
      document.getElementById("img" + (current_photo + 2)).style.display = "block";
    }
    current_photo += 1

  }

}

function indietro() {


  if (!x) {
    document.getElementById("img" + (current_photo + 1)).style.display = "none";

    if (current_photo == 1) {
      document.getElementById("img" + current_photo).style.display = "none";
      document.getElementById("img5").style.display = "block";
      document.getElementById("img6").style.display = "block";
      current_photo = 6;
    }
    else {
      document.getElementById("img" + (current_photo - 1)).style.display = "block";
    }

    current_photo -= 1
  }
  else {
    document.getElementById("img" + current_photo).style.display = "none";
    if (current_photo == 1) {
      document.getElementById("img6").style.display = "block";
      current_photo = 7;
    }
    else {
      document.getElementById("img" + (current_photo - 1)).style.display = "block";
    }
    current_photo -= 1
  }


}

setInterval(avanti, 2000);

/*
function change() {
  if (i % 2 == 0) {
    document.getElementById("img" + current_photo).style.display = "none";
  }
  else {
    document.getElementById("img" + (current_photo + 1)).style.display = "block";
  }
  i += 1
  
  if (x) {

    document.getElementById("img" + current_photo).style.display = "none";

    if (current_photo == 6) {
      document.getElementById("img1").style.display = "block";
      current_photo = 0
    }
    else{
      document.getElementById("img" + current_photo).style.display = "block";
    }
  }
}*/