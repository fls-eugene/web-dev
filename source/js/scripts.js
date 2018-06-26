'use strict';

window.onload = function()
{
    snackbar_show("JavaScript Loaded!");
}

function snackbar_show(src)
{
    var x = document.getElementById("snackbar");
    x.className = "show";
    if(src)
    x.innerText = src;
    setTimeout(function() { x.className = x.className.replace("show", ""); }, 3000);
}