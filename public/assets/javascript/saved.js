$(document).ready(function(){
    var articleContainer = $(".article-container");

    $(document).on("click", ".btn.delete", handleArticleDelete);
    $(document).on("click", ".btn.notes", handleArticleNotes);
    $(document).on("click", ".btn.save", handleNoteSave);
    $(document).on("click", ".btn.note-delete", handleNoteDelete);

    initPage();

    function initPage() {
        articleContainer.empty();
        $.get("/api/headlines?saved=true").then(function(data){
            if (data && data.length) {
                renderArticles(data);
            }
            else {
                renderEmpty();
            }
        });
    }
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
            "<a class='btn btn-delete delete btn-warning ml-auto'>",
            "Delete From Saved",
            "</a>",
            "</h5>",
            "<div class='card-body'>",
            "<p class='card-text'>",
            article.summary,
            "</p>",
            "</div>",
            "<div>","<p>",article.date,"</p>","</div>"
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
                "<h3>No saved articles. Would you like to browse articles?</h3>",
                "<h4><a class='scrape-new'></a></h4>",
                "<h4><a href='/'></a>Browse Articles</h4>",
                "</div>",
                "</div>"
            ].join(""));
        articleContainer.append(emptyAlert);
    }
    function renderNotesList(data){
        var notesToRender = [];
        var currentNote;
        if(!data.notes.length){
            currentNote = [
                "<li class='list-group-item'>",
                "No notes exist yet.",
                "</li>"
            ].join("");
            notesToRender.push(currentNote);
        }
        else {
            for (var i = 0; i < data.notes.length; i++){
                currentNote = $[
                    "<li class='list-group-item note'>",
                    data.notes[i].noteText,
                    "<button class='btn btn-warning note-delete'></button>",
                    "</li>"
                ].join("");
                currentNote.children("button").data("_id", data.notes[i]._id);
                notesToRender.push(currentNote);
            }
        }
        $(".note-container").append(notesToRender);
    }

    function handleArticleDelete() {
        var articleToDelete = $(this).parents(".panel").data();
        articleToSave.saved = true;

        $.ajax({
            method: "DELETE",
            url: "/api/headlines" + articleToDelete._id,
        })
        .then(function(data){
            if(data.ok) {
                initPage();
            }
        });
    }
    
    function handleArticleNotes() {
        var currentArticle = $(this).parents(".panel").data();
        $.get("/api/notes/" + currentArticle._id).then(function(data){
            var modalText = [
                "<div class='container-fluid text-center'>",
                "<h3>Article Notes: ",
                currentArticle._id,
                "</h3>",
                "<hr />",
                "<ul class='list-group note-container'>",
                "</ul>",
                "<textarea placeholder='New Note' rows='4' cols='60'></textarea>",
                "<button class='btn btn-warning save'></button>",
                "</div>"
            ].join("");
            bootbox.dialog({
                message: modalText,
                closeButton: true
            });
            var noteData = {
                _id: currentArticle._id,
                notes: data || []
            };
            $(".btn.save").data("article", noteData);
            renderNotesList(noteData);
        })  
    }
    function handleNoteSave(){
        var noteData;
        var newNote = $(".bootbox-body textarea").val().trim();

        if(newNote) {
            noteData = {
                _id: $(this).data("article").id,
                noteText:newNote
            };
            $.post("/api/notes", noteData).then(function(){
                bootbox.hideAll();
            });
        }
    }
    function handleNoteDelete(){
        var noteToDelete = $(this).data("_id");
        $.ajax({
            url: "/api/notes/" + noteToDelete,
            method: "DELETE"
        }).then(function(){
            bootbox.hideAll();
        });
    }

})