<?php
    include "includes/header.php";
    include "includes/nav.php";
    include "func/postFunc.php";
    include "func/timeFunc.php";
    include "func/commentFunc.php";
    checkSignedInOnPost();
    $post = getPost($conn);
    $commentList = getCommentList($conn, $_SESSION['lastPostIDVisited']);
?>

<div class="loading-logo d-none">
    <img src="image.php?loadinglogo" alt="">
</div>

<div class="container main-cont">
    <?php if ($post != false): ?>
        <?php
            outputPost($conn, $post, "echo");
        ?>
        <div class="row">
            <div class="col-md-8 offset-md-2">
                <div class="create-comment d-flex">
                    <div class="avatar-wrapper">
                        <img class="avatar-post mr-3" src="image.php?userID= <?php echo $_SESSION['userID']; ?> &avatar" alt="">
                    </div>
                    <form class="comment-form w-100" method="POST" action="createcomment.php">
                        <textarea class="form-control comment" name="comment" id="exampleFormControlTextarea1" value="" placeholder="Write a comment..." rows="3"></textarea>
                        <div class="btn-comment-wrapper d-flex">
                            <p class="m-0 error-msg d-none id="errorEmail">Comment can't be empty</p>
                            <button class="btn btn-secondary btn-sm mt-2 ml-auto" name="comment-submit" type="submit"><i class="bi bi-chat-left"></i> Comment</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>

        <hr>

        <div class="comments">
            <?php
                outputCommentList($conn, $commentList);
            ?>

            <?php if (empty($commentList)): ?>
                <div class="row my-3 mt-5 empty-comment">
                    <div class="col-md-8 offset-md-2 d-flex justify-content-center">
                    <p class="text-secondary font-italic">Be the first one to comment on this post</p>
                </div>
            </div>
            <?php endif; ?>
        </div>

    <?php else: ?>
        <h1 class="text-center font-weight-light">Post not found! (Error: 404)</h1>
    <?php endif; ?>

</div>

<?php
    include "includes/footer.php";
    unsetNotification();
?>