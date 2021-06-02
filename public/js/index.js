let limit = 5;
let offset = 0; // default offset;
let reachedEnd = false;
$(document).ready(function() {
    $('[data-toggle="popover"]').popover();
    $('.notification').popover('show');
    setTimeout(() => {
        $('.notification').popover('hide');
    }, 3000);


    $(".input-create").click(() => {
        $(".form-create").submit();
    });

    $(window).scroll(function() {
        if((($(window).scrollTop() + $(window).height()) >= $(document).height()) && reachedEnd == false) {
            offset += 5;
            console.log("loading new posts from record " + offset + " to " + (offset + 5) + " (limit = " + limit + ")");
            let xhr = new XMLHttpRequest();
            let request = "getmoreposts.php?offset=" + offset + "&limit=" + limit;
            xhr.open("GET", request, true);
            xhr.onload = function() {
                if(this.status == 200) {
                    let newPostList = JSON.parse(this.responseText);
                    console.log(newPostList);
                    outputNewPosts(newPostList);
                }
            }
            xhr.send();
        }
    });

});

function outputNewPosts(newPostList) {
    let currentUserID = newPostList['currentUserID'];
    if(newPostList['posts'] != '') {
        let output = '';
        newPostList['posts'].forEach(post => {
            let isLikedClass = [];
            if(post['liked'] == true) { 
                isLikedClass.push("text-danger");
                isLikedClass.push("bi-heart-fill");
            }
            else {
                isLikedClass.push("text-dark");
                isLikedClass.push("bi-heart");
            }

            let ownedPostButton = ` <a class="ml-auto" href="editpost.php?id=${post['post_ID']}">
                                        <i class="bi bi-pencil-square"></i>
                                    </a>`;
            output += `
                <div class="row my-3">
                    <div class="col-md-8 offset-md-2">
                        <a class="a-post" href="post.php?id=${post['post_ID']}">
                            <div class="card post">`;

                if (post['post_img_url'] != null) {
                    output += `
                                <img class="card-img-top post-img" src="${post['post_img_url']}" alt="Post image">`;
                }
                output += `
                                <div class="card-body post-body pb-2">
                                    <div class="title-edit d-flex">
                                        <h5 class="card-title post-title font-weight-normal">${post['post_title']}</h5>`;
                if(checkOwnedPost(post['post_author_ID'], currentUserID)){
                    output += ownedPostButton;
                }                    
                    output +=`
                                    </div>
                                    <p class="card-text post-content">${post['post_content']}</p>
                                    <div class="author-date d-flex mt-4">
                                        <a class="text-dark font-weight-bold d-flex align-items-center" href="profile.php?id=">
                                            <img class="avatar-post mr-2" src="image.php?defaultAvatar" alt="">
                                            ${post['user_username']}
                                        </a>
                                        <p class="font-weight-light my-2 post-info ml-auto">${post['post_date_time']}</p>
                                    </div>
                                    <div class="no-like-cmt d-flex mt-2">
                                        <p class="post-info mb-0 mr-3"><i class="bi bi-heart-fill text-danger"></i> ${post['post_no_likes']}</p>
                                        <p class="post-info mb-0"><i class="bi bi-chat-left-fill text-secondary"></i> ${post['post_no_comments']}</p>
                                    </div>
                                    <hr class="mb-2">
                                    <div class="interaction">
                                        <div class="row">
                                            <form class="like-form col-md-6 d-flex justify-content-center" method="POST" action="createlike.php">
                                                <button type="submit" data-post-id="${post['post_ID']}" name="like-submit" class="like-btn ${isLikedClass[0]} text-center">
                                                    <i class="like-logo bi ${isLikedClass[1]}"></i>
                                                    Like
                                                </button>
                                            </form> 
                                            <div class="col-md-6 d-flex justify-content-center">
                                                <a class="text-dark text-center" href="post.php?id=${post['post_ID']}">
                                                    <i class="bi bi-chat-left"></i>
                                                    Comment
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </a>    
                    </div>
                </div>
                `;
            });
        $(".posts").append(output);
    }
    else {
        reachedEnd = true;
        console.log("Reached end = " + reachedEnd);
        $(".loading").css("display", "none");
        $(".main-cont").append( `
        <div class="row my-3 mt-5 ending">
            <div class="col-md-8 offset-md-2 d-flex justify-content-center">
            <p class="text-secondary font-italic">Phew! You've reached the end. That was fun, wasn't it? </p>
            </div>
        </div>`)
    }

}

function checkOwnedPost(postAuthorID, currentUserID) {
    if(postAuthorID == currentUserID) 
        return true;
    else return false;
}
