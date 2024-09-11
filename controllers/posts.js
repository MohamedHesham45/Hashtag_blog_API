const Post = require('../models/posts')
const CustomError = require('../utils/customError');

exports.getPosts = async (req, res, next) => {
    try {
        const posts = await Post.find().populate({path: "userId"})
            .populate({
                path: 'comments.userId',  
                select: 'name image'      
            }).sort({ createdAt: -1 });
            


        res.status(200).send({
            message: "success",
            data: posts,
        });
    } catch (err) {
        next(new CustomError("Internal server error.", 500));
    }
}; 

exports.getPostById = async (req, res, next) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return next(new CustomError('No post found', 404));
        }

        res.status(200).send({
            message: "success",
            data: post
        });
    } catch (err) {
        next(new CustomError("Internal server error.", 500));
    }
};

exports.getHesPosts = async (req, res, next) => {
    try {
        const userId = req.user.id; 
        const posts = await Post.find({userId})
        .populate("likes", "name email") 
        .populate("comments.userId", "name email"); 
        
        if (!posts || posts.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No posts found for this user'
            });
        }

        res.status(200).json({
            success: true,
            data: posts
        });
    } catch (err) {
        next(err); 
    }
};


exports.createPosts = async (req, res, next) => {
    try {
        const userId = req.user.id; 
        const body = req.body;
        let post
        if(req.file){
             post = new Post({ ...body, image: req.user.image, userId: userId });
        }else{
             post = new Post({ ...body, userId: userId });

        }
        
        await post.save();

        const populatedPost = await Post.findById(post._id)
            .populate({ path: 'userId', select: 'name image' })
            .populate({
                path: 'comments.userId',
                select: 'name image'
            });

        res.status(201).send({
            message: "Post created",
            data: populatedPost
        });
    } catch (err) {
        next(new CustomError("Internal server error.", 500));
    }
};

exports.updatePost = async (req, res, next) => {
    try {
        const postId = req.params.id;
        const userId = req.user.id;
        let updatedPost
        const post = await Post.findById(postId);

        if (!post) {
            return next(new CustomError('No post found', 404));
        }

        if (post.userId.toString() !== userId.toString()) {
            return next(new CustomError('Unauthorized to update this post', 403));
        }
        if(req.file){
            updatedPost = await Post.findByIdAndUpdate(postId, {...req.body,image:req.user.image} ,{ new: true, runValidators: true });
        }
        else {
            updatedPost = await Post.findByIdAndUpdate(postId, {...req.body} ,{ new: true, runValidators: true });
        }
        res.status(200).send({
            message: "Post updated",
            data: updatedPost
        });
        
    } catch (err) {
        next(new CustomError("Internal server error.", 500));
    }
}


exports.deletePost = async (req, res, next) => {
    try {
        const postId = req.params.id;
        const userId = req.user.id;

        const post = await Post.findById(postId);

        if (!post) {
            return next(new CustomError('No post found', 404));
        }

        if (post.userId.toString() !== userId.toString()) {
            return next(new CustomError('Unauthorized to delete this post', 403));
        }

        await Post.findByIdAndDelete(postId);

        res.status(200).json({
            message: "Post deleted",
            data: post
        });
       
    } catch (err) {
        next(new CustomError("Internal server error.", 500));
    }
}

exports.toggleLike = async (req, res, next) => {
    try {
        const { postId } = req.params;
        const userId = req.user.id;

        const post = await Post.findById(postId);

        if (!post) {
            return next(new CustomError('Post not found', 404));
        }

        const index = post.likes.indexOf(userId);

        if (index === -1) {
            post.likes.push(userId);
        } else {
            post.likes.splice(index, 1);
        }

        await post.save();

        res.status(200).json({
            message: index === -1 ? "Post liked" : "Post unliked",
            data: post.likes,
        });

    } catch (err) {
        next(new CustomError("Internal server error.", 500));
    }
};

exports.createComment = async (req, res, next) => {
    const { postId } = req.params;  
    const  text  = req.body.text;
    const userId = req.user.id;  

    try {
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        const newComment = {
            userId: userId,
            text: text,
        };

        post.comments.push(newComment);

        await post.save();
        newComment.userId={
            _id:userId,
            name: req.user.name,
            image: req.user.image,
        }
        res.status(201).json({ message: "Comment added", comment:newComment});
    } catch (error) {
        next(new CustomError("Internal server error.", 500));
        }
};

