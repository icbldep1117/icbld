$.notify.addStyle("needs-login", 
{
  html: "<div><span data-notify-text/><br><br><div class='server-form'>" +
          "<button class='input-field button' onclick='navigation_load_page(\"login\");'>Login</button>" + 
          "<button class='input-field button' onclick='navigation_load_page(\"sign-up\");'>Sign Up</button>" + 
        "</div></div>",
  classes: 
    {
      base: 
        {
          "background-color": "rgb(240, 244, 248)",
          "padding": "10px",
          "opacity": "0.95",
          "border-radius": "7px",
          "box-shadow" : "0px 0px 8px #444",
          "max-width" : "300px",
          "text-align" : "center",
        },
      notification: 
        {
  
        },
      success: 
        {

        },
      error: 
        {

        },
    }
});

$.notify.addStyle("ic", 
{
  html: "<div><span data-notify-text/>" + 
        "</div>",
  classes: 
    {
      base: 
        {
          "background-color": "rgb(240, 244, 248)",
          "padding": "10px",
          "opacity": "0.95",
          "border-radius": "7px",
          "box-shadow" : "0px 0px 8px #444",
          "max-width" : "300px",
          "text-align" : "center",
        },
      notification: 
        {
  
        },
      success: 
        {

        },
      error: 
        {

        },
    }
});

$.notify.defaults
({
  position: "top left", 
  className: "default", 
  style: "needs-login", 
  autoHideDelay:5000,
});

