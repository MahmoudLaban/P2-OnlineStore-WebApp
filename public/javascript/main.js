// Fade out for flash messages...providing a visual cue to the user that the message has been displayed, and will then fade out after a set amount of time to prevent it from cluttering up the UI.

// function is targeting an element with the id flash-msg, which is likely a container for all flash messages. It will fade out the container after 3 seconds (3000 milliseconds) using jQuery's fadeOut method with a slow speed. This will create a fade out effect that lasts for some time.
setTimeout(function () {
    $("#flash-msg").fadeOut("slow");
  }, 3000);
  
  // function is targeting an element with the id success, which could be a specific flash message indicating a successful action. It will also fade out this element after 3 seconds.
  setTimeout(function () {
    $("#success").fadeOut("slow");
  }, 3000);
  

  // function is targeting an element with the id error, which could be a specific flash message indicating an error or failure of some kind. It will also fade out this element after 3 seconds.
  setTimeout(function () {
    $("#error").fadeOut("slow");
  }, 3000);
  