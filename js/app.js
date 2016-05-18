$(document).ready(function() {
  $(document).foundation();
  $("button").click(function() {
    $(this).append("<div class='flex-video widescreen'><iframe width='420' height='315' src='https://www.youtube.com/v/gER7xe11nz8?rel=0&autoplay=1' frameborder='0' allowfullscreen></iframe></div>");
  });
});
