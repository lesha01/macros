﻿/*
(c) Copyright Ipswitch, Inc. - https://www.ipswitch.com
*/
// Custom prompt function 
// as alternative for JavaScript prompt()

function sendResponse(response) {
    chrome.windows.getCurrent(null, function (w) {
        let bg = chrome.extension.getBackgroundPage();
        bg.dialogUtils.setDialogResult(w.id, response)
    })
}

function getArguments(windowId) {
    let bg = chrome.extension.getBackgroundPage()
    return bg.dialogUtils.getDialogArgs(windowId)
}

function ok() {
    let prompt_value = document.getElementById('prompt-input-text').value;
    sendResponse({ inputValue: prompt_value });
    window.close()
}

function cancel() {
    sendResponse({ canceled: true })
    window.close()
}

window.addEventListener("load", function (evt) {

    chrome.windows.getCurrent(null, function (w) {
        var myArgs = getArguments(w.id);
        document.getElementById("dialogboxhead").innerHTML = myArgs.text;
        var promptInput = document.getElementById("prompt-input-text");
        document.getElementById("ok-button").addEventListener("click", ok);
        // prompt dialog: type = askInput
        if (myArgs.type == "askInput") {
            if (typeof(myArgs.default) != "undefined") {
               promptInput.defaultValue = myArgs.default;
            }
            promptInput.focus();
            promptInput.select();
            var cancelButton = document.createElement("div");
            cancelButton.id = "cancel-button";
            cancelButton.className = "button icon-button";
            cancelButton.innerHTML = "<span>Cancel</span>";
            cancelButton.addEventListener("click", cancel);
            document.getElementById('buttons').appendChild(cancelButton);
            
            resizeToContent(window, document.getElementById('container'));
        }
        // alert dialog: type = alert
        else {
            promptInput.style.display = "none";            
            //document.getElementById("buttons").style.webkitBoxPack = "end"; // moves the button to right
            resizeToContent(window, document.getElementById('container'));
        }
    });
    // document.addeventlistener("keypress", function (e) {
    //    if (e.which == 13) ok();
    // });

    // prevent right-click
    document.body.oncontextmenu = function (e) {
        e.preventDefault();
        return false;
    };
}, true);
