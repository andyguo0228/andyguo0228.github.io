var rootElement = document.documentElement

function scrollToTopFunction() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth' // For smooth scrolling
    });
}

window.onscroll = function() {
    let button = document.getElementById("scrollToTop");

    var scrollTotal = rootElement.scrollHeight - rootElement.clientHeight
    if ((rootElement.scrollTop / scrollTotal ) > 0.80 ) {
        button.style.display = "block";
    } else {
        button.style.display = "none";
    }
};
