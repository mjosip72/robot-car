
let Toast = {

  duration: 6000,
  element: document.getElementById("toast"),
  visible: false,
  timeout: undefined,

  hide: function() {
    Toast.visible = false;
    Toast.timeout = undefined;
    Toast.element.classList.remove("active");
  },

  show: function(message) {

    if(Toast.visible) {
      clearTimeout(Toast.timeout);
      Toast.element.innerHTML += "<br>" + message;
      Toast.timeout = setTimeout(Toast.hide, Toast.duration);
    }else{
      Toast.visible = true;
      Toast.element.innerHTML = message;
      Toast.element.classList.add("active");
      Toast.timeout = setTimeout(Toast.hide, Toast.duration);
    }

  }

};
