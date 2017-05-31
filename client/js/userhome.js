
String.prototype.toTitleCase = function(){
  return this.replace(/\b(\w+)/g, function(m,p){ return p[0].toUpperCase() + p.substr(1).toLowerCase() })
}

var hidePreloader = function(option){
    console.log("In hidePreloader Function");
     $(".preloader-div").fadeOut(500,function(){
          $('#main').css('display','block');
          $('#main').css('justify-content','none');
          $('#main').css('align-items','none');
          $(".tabsContainer").show();
          $(".container .page-content").fadeIn(200,function(){
                                                    if(option!=null){
                                                        console.log("option executed");
                                                        option();
                                                    }
         });
     });
};
var showPreloader = function(){
    console.log('inside show preloader');
    $('#main').css('display','flex');
    $('.preloader-div').css('display','flex');
    $('#main').css('justify-content','center');
    $('#main').css('align-items','center');
    $(".tabsContainer").hide();
    $(".container .page-content").hide();
    $(".preloader-div").show();

};
var clearContent = function(){
    console.log("In clear content site ");
    $(".container .page-content").empty();
};


function toggleFullScreen(elem) {
    
    console.log("elem valus is :"+elem);
    elem = document.getElementById(elem);
    console.log("elem valus afer is :"+elem);
    if ((document.fullScreenElement !== undefined && document.fullScreenElement === null) || (document.msFullscreenElement !== undefined && document.msFullscreenElement === null) || (document.mozFullScreen !== undefined && !document.mozFullScreen) || (document.webkitIsFullScreen !== undefined && !document.webkitIsFullScreen)) {
        console.log("inside if no fullscreen");
      if (elem.requestFullScreen) {
        elem.requestFullScreen();
      }
      else if (elem.mozRequestFullScreen) {
        elem.mozRequestFullScreen();
      }
      else if (elem.webkitRequestFullScreen) {
        elem.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
      }
    }
    else {
      if (document.cancelFullScreen) {
        document.cancelFullScreen();
      }
      else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      }
      else if (document.webkitCancelFullScreen) {
        document.webkitCancelFullScreen();
      }
    }
}


$(document).ready(function(){
    
});
    


    


