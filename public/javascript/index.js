//don't run js until ready
$(document).ready(function(){
    //div that references div that holds articles
    var articleContainer = $(".article-container");
    $(document).on("click", ".btn-save", handleArticleSave);
    $(document).on("click", ".scrape-new", handleArticleScrape);

    initPage();
    //empties article container, runs ajax get request to headlines route
    function initPage() {
        articleContainer.empty();
        //if user hasnt saved, then render articles or render empty 
        $.get("/api/headlines?saved=false")
        .then(function(data){
            if (data && data.length) {
                renderArticles(data);
            }
            else {
                renderEmpty();
            }
        });
    }
    //create an array
    function renderArticles(articles) {
        var articlePanels = [];

        for (var i = 0; i < articles.length; i++){
            articlePanels.push(createPanel(articles[i]));
        }
        articleContainer.append(articlePanels);
    }

    function createPanel(article){
        var panel = 
            $([
            "<div class='card article-container'>",
            "<h5 class='card-header'>",
            article.headline,
            "<a class='btn btn-save btn-warning ml-auto'>",
            "Save Article",
            "</a>",
            "</h5>",
            "<div class='card-body'>",
            "<p class='card-text'>",
            article.summary,
            "</p>",
            "</div>",
            "</div>"
        ].join(""));
    panel.data("_id", article._id);
    return panel;
    }

    function renderEmpty(){
        var emptyAlert =
            $([
                "<div class='alert alert-warning text-center'>",
                "<h5='UH OH'></h5>",
                "<div class='card-body'>",
                "<h3>No new articles. What would you like to do?</h3>",
                "<h4><a class='scrape-new'></a></h4>",
                "<h4><a href='/saved'></a>Go to Saved</h4>",
                "</div>",
                "</div>"
            ].join(""));
        articleContainer.append(emptyAlert);
    }
    function handleArticleSave() {
        var articleToSave = $(this).parents(".panel").data();
        articleToSave.saved = true;

        $.ajax({
            method: "PATCH",
            url: "/api/headlines",
            data: articleToSave
        })
        .then(function(data){
            if(data.ok) {
                initPage();
            }
        });
    }
    
    function handleArticleScrape() {
        $.get("/api/fetch")
        .then(function(data){
            initPage();
            bootbox.alert("<h3 class='text-center' m-top-80'>" + data.message + "</h3>");
        });
    }
});