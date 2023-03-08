$(document).ready(function() {
  $('#menu-icon').click(function() {
    $('.menu').slideToggle();
  });
  
  $(window).resize(function() {
    var screenWidth = $(window).width();
    if (screenWidth > 768) {
      $('.menu').removeAttr('style');
    }
  });
});