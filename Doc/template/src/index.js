import "./../css/main.scss";
import $ from "jquery";
import email1 from "./components/email";
import email2 from "./components/notEmail";
import test from "./components/testEmail";

const $renderDiv = str => {
    return $("<div></div>").html(str)
}

$(document).ready(e => {
    $("body").append($renderDiv(test(email1)))
        .append($renderDiv(test(email2)))

})
