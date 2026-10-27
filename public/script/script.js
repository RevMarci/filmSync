import { loadWatchlist } from "./watchlist.js";

$("#sidenav").load("../pages/sidenav.html");
$("#content").load("../pages/watchlist.html", function() {
    loadWatchlist();
});

$("#watchlist").click(function() {
    $("#content").load("../pages/watchlist.html", function() {
        loadWatchlist();
    });
});

$("#lists").click(function() {
    $("#content").load("../pages/lists.html");
});