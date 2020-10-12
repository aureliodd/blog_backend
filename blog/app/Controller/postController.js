class PostController{
    
    constructor(){
        this.posts = [];
        this.orderedposts = [];
        this.restController = new RestController();
        this.httpUrl = "http://localhost:3000/posts";
        this.modify = false;

        //UI
        this.postContainer;
        this.orderPriorityCheckbox;
        this.newPostButton;
        this.titlePost;
        this.bodyPost;
        this.userName;
        this.tags;
        this.modal;
    }

    init(){
        $(document).ready(function(){
            this.postContainer = $("#posts");
            this.orderPriorityCheckbox = $("#order-priority");
            this.newPostButton = $("#post");
            this.modal = $("#modal");


            this.orderPriorityCheckbox.change(function() {
                this.posts.orderPosts();
                this.checked ? this.posts.displayPosts(1) : this.posts.displayPosts(0);
            }.bind(this)); 
            
            this.newPostButton.click(function(){
                this.userName = $("#name");
                this.titlePost = $("#recipient-name");
                this.bodyPost = $("#message-text");
                this.privatePost = $("#private-post"); 
                this.importnt = $("#in-evidence");
                let user = this.userName.val(); 
                var title = this.titlePost.val();
                var content = this.bodyPost.val();
                let importnt = this.importnt.prop("checked"); //true se è importante
                let priv = this.privatePost.prop("checked"); //false se è pubblico
                console.log (importnt + " " + priv);
                this.CreateModifyPost(user, title, content, importnt, priv);
            }.bind(this));

            this.getPosts();

        }.bind(this));
    }

    addPostToArray(post){ 
        this.posts.push(post);
    }

    getPosts(){
        this.restController.get(this.httpUrl,function(data,status,xhr){
            console.log(data);
            for(var element in data){
                var post = new Post(data[element]._id,data[element].creator,data[element].title,data[element].content,data[element].priority,data[element].public,data[element].tags);
                this.addPostToArray(post);
            }            
            this.displayPosts(); //IMPORTANTISSIMO: se lo metto fuori a questa funzione anonima, essendo che è asincrono si rompe tutto il sito!
        }.bind(this));
    }


    displayPosts(prior = 0){

    this.postContainer.html("");
    var newpost = null;

    if(prior == 0)
        for(var post of this.posts){

            newpost = this.addTextPost(post,0);
                        
            if(this.checkPriority(post.priority)) this.important(newpost);
            if(!this.checkPublic(post.public_post)) this.privatePost(newpost);

            this.addPostToFeed(newpost);


            this.deleteBtn = $(".delete",newpost);
            this.modifyBtn = $(".modify",newpost);



            this.deleteBtn.click(function(event){

                var div_id_to_delete = event.target.closest("section");
                var id_to_delete = $(div_id_to_delete).data("identifier");        
                
                console.log(this.httpUrl +"/" + id_to_delete);

                this.restController.delete(this.httpUrl + "/" + id_to_delete, function(){
                    console.log("successo");
                    location.reload();
                });
            }.bind(this));


            this.modifyBtn.click(function(event){
                this.modify = true;

                this.openModal();
            }.bind(this));

        }
        else 
            for(var post of this.orderedposts){

                newpost = this.addTextPost(post,0);
                    
                if(this.checkPriority(post.priority)) this.important(newpost);
                if(!this.checkPublic(post.public_post)) this.privatePost(newpost);
        
                this.addPostToFeed(newpost);
            }
    }

    CreateModifyPost(user, title, content, importnt, priv){

        var string_tags = $("#tags").val();
        var tags = string_tags.split(",");

        if(this.modify == false){

            let post_to_send = {creator: user, title: title, content: content, public: !priv, priority: Number(importnt), tags: tags };
    

            console.log(post_to_send);
    
        
            var data = {
                url: this.httpUrl,
                crossDomain: true,
                data: post_to_send,
                dataType: "json",
                success: function(data,textStatus,jqXHR){
                    console.log("data",data);

                    this.addPostToArray(new Post(data._id, data.creator, data.title, data.content, data.priority, data.public, tags));
                    var newpost = this.addTextPost(post,1);
                
                    if(data.priority) this.important(newpost);
                    if(!data.public) this.privatePost(newpost);

                    $(".send-comment",newpost).click(function(event){
                        var commentSection = event.target.parentNode.parentNode;
                        this.comment(commentSection);
                    }.bind(this));

                    this.addPostToFeed(newpost);
            }.bind(this)};

            $.post(data);
        
        } else {
            var div_id_to_modify = event.target.closest("section");
                var id_to_modify = $(div_id_to_modify).data("identifier"); 

                var post_to_modify = {
                    title: this.titlePost,
                    body: this.bodyPost,
                    public: true, //da cambiare con il riferimento alla checkbox
                    featured: true, // pure
                    tag: tags,
                 };
        
                 var json_post_to_modify = JSON.stringify(post_to_modify);
        
            
                var data = {
                    url: this.httpUrl+ "/" + id_to_modify,
                    data: json_post_to_modify,
                    dataType: "json",
                    success: function(data,textStatus,jqXHR){
                        console.log("data",data);
                }};
                
                this.restController.patch(data);
                this.modify = false;

        }

        this.hideModal();
        this.resetModal();
    }

    addTextPost(post, isItMyPost){
        var newpost = $("#blanktext").clone();
        newpost.removeAttr("id");


        $(newpost).data("identifier", post.id);
        //console.log($(newpost).data()); //è il dataset

        if(isItMyPost === 0) $(".creator",newpost).attr("href",post.creator + ".html");
            else $(".creator",newpost).attr("href","profile.html");
        if(post.creator != "") $(".creator",newpost).html(post.creator);
            else $(".creator",newpost).html("Anonimo")
        $(".title",newpost).html(post.title);
        $(".content", newpost).html(post.content);

        //tags
        var aux = "";
        if(post.tags != null){
            for(var tag of post.tags)
            aux += " #"+ tag;

            $(".tags", newpost).html(aux);
        }


        $(".send-comment",newpost).click(function(event){
            var commentSection = event.target.parentNode.parentNode;
            //comment(commentSection);

            var name = $("#name").val() ? $("#name").val() : "Anonimo";
    
            var textarea = $(".write-comment", commentSection);
                if(textarea.val()!== ""){
                        var commentarea = $(".comment-area",commentSection.parentNode);
        
                        var newdiv = $('<div class="card py-1 px-2 my-2"><p> <span class="badge badge-primary">'+ name +'</span>  ' + textarea.val() + '</p></div>');
            
                        textarea.val("");
                        if(commentarea.html()=="Nessun commento"){
                            commentarea.html("");
                            newdiv.appendTo(commentarea);
                        } else 
                            newdiv.appendTo(commentarea);
                }
        });
    
        return newpost;
    }

    hideModal(){
        $(this.modal).modal("hide");
    }
    
    resetModal(){
        $("#recipient-name").val("");
        $("#message-text").val("");
    }

    openModal(){
        $(this.modal).modal('show');
    }
    
    checkPriority(priority){
        if(priority == true) return 1
        return 0;
    }
    
    setPriority(checked){
        if(checked == 1) return 1;
        return 0;
    }

    checkPublic(public_post){
        if(public_post == true) return 1
        return 0;
    }

    setPrivate(checked){
        if(checked == 1) return 1;
        return 0;
    }
    
    important(content){
        content.addClass("border border-primary");
    }

    privatePost(content){
        content.addClass("private-post");
    }
    
    addPostToFeed(newpost){
        this.show(newpost);
        this.postContainer.append(newpost);
    }
    
    show(content){
        content.addClass("visible");
        content.removeClass("hide");
    }

    orderPosts(){
        this.orderedposts = [];
        for(var i = 0; i<this.posts.length;i++)
            if(this.checkPriority(this.posts[i].priority)) this.orderedposts.push(this.posts[i]);
        
        for(var i = 0; i<this.posts.length;i++)
            if(!this.checkPriority(this.posts[i].priority))  this.orderedposts.push(this.posts[i]);
    }
    
    comment(commentSection){
        var name = $("#name").val() ? $("#name").val() : "Anonimo";
    
        var textarea = $(".write-comment", commentSection);
            if(textarea.val()!== ""){
                    var commentarea = $(".comment-area",commentSection.parentNode);
    
                    var newdiv = $('<div class="card py-1 px-2 my-2"><p> <span class="badge badge-primary">'+ name +'</span>  ' + textarea.val() + '</p></div>');
        
                    textarea.val("");
                    if(commentarea.html()=="Nessun commento"){
                        commentarea.html("");
                        newdiv.appendTo(commentarea);
                    } else 
                        newdiv.appendTo(commentarea);
            }
    }
}