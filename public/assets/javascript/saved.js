// $(document).on("click", ".btn-note", function() {
  
//     $(".modal-title").empty();
//     $(".input").empty();
  
//     // Save the id from .btn-note
//     var thisId = $(this).attr("data-id");
  
//     $.ajax({
//       method: "GET",
//       url: "/articles/" + thisId
//     })
//       // With that done, add the note information to the page
//       .done(function(data) {
//         console.log(data);
  
//         $(".modal-title").append("<h5>" + data.title + "</h5>");
//         $(".input").append("<textarea id='bodyinput' name='body'></textarea>");
//         $(".input").append("<button data-id='" + data._id + "' id='savenote' class='btn btn-primary btn-sm' style='margin-top:20px;'data-dismiss='modal'>Save Note</button>");
  
//         // If there's a note in the article
//         if (data.note) {
//           // Place the body of the note in the body textarea
//           $("#bodyinput").val(data.note.body);
//         }
//       });
//   });
  

$(document).ready(function(){
    var articleContainer = $(".article-container");

    $(document).on("click", ".btn.delete", handleArticleDelete);
    $(document).on("click", ".btn-note", handleArticleNotes);
    $(document).on("click", ".btn-save", handleNoteSave);
    $(document).on("click", ".btn.note-delete", handleNoteDelete);

    initPage();

    function initPage() {
        articleContainer.empty();
        $.getJSON("/api/headlines?saved=true").then(function(data){
            if (data && data.length) {
                renderArticles(data);
            }
            else {
                renderEmpty();
            }
        });
    }
    function renderArticles(articles) {
        var articleCards = [];

        for (var i = 0; i < articles.length; i++){
            articleCards.push(createArticleDiv(articles[i]));
        }
        articleContainer.append(articleCards);
    }

    function createArticleDiv(article){
        var savedArticleDiv = 
            $([
                "<div class='card'>",
                "<div class='card-body'>",
                "<div class='card-title'>",
                "<h6>",
                "<a href='" + article.url + "'>",
                article.headline,
                "</a>",
                "<a class='btn btn-sm btn-warning btn-note'>",
                "Add Note",
                "</a>",
                "</h6>",
                "</div>",
                "<div class='card-text'>","<p>",
                article.summary,"</p>",
                "</div>",
                "</div>",
                "</div>"
        ].join(""));
    savedArticleDiv.data("_id", article._id);
    return savedArticleDiv;
    }
    function renderEmpty(){
        var emptyAlert =
            $([
                "<div class='alert text-center'>",
                "<h5='UH OH'></h5>",
                "<div class='card-body'>",
                "<h3>No saved articles. Would you like to browse articles?</h3>",
                "<h4><a class='btn-sm btn-warning scrape-new'></a></h4>",
                "<h4><a href='/'>Browse Articles</a></h4>",
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
        var articleToDelete = $(this).parents(".card").data();
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
        
    }ßç
    
    function handleArticleNotes() {
        var currentArticle = $(".card").data();
        $.get("/api/notes/" + currentArticle._id).then(function(data){
            var modalText = [
                "<div class='container-fluid'>",
                "<h3>Article Notes: ",
                currentArticle._id,
                "</h3>",
                "<hr />",
                "<ul class='list-group note-container'>",
                "</ul>",
                "<textarea placeholder='New Note' rows='4' cols='60'></textarea>",
                "<button class='btn btn-warning btn-note'></button>",
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
            $(".btn-save").data("article", noteData);
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