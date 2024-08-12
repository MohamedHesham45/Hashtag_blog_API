const Post = require('../models/posts')
const CustomError = require('../utils/customError');

exports.getPosts = async (req, res, next) => {
    try {
        const limit = 10;
        const page = Number(req.query.page) || 1;
        const skip = (page - 1) * limit;
        const postCount = await Post.countDocuments();
        const posts = await Post.find().skip(skip).limit(limit);
        const pagesNumber = Math.ceil(postCount / limit);
        res.status(200).send({
            message: "success",
            data: posts,
            pagination: {
                total: postCount,
                pages: pagesNumber,
                page,
                prev: page > 1,
                next: page < pagesNumber,
            },
        });
    } catch (err) {
        next(new CustomError("Internal server error.", 500));
    }
}

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
        const posts = await Post.find({ userId }); 
        
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
        const { id } = req.user;
        const body = req.body;
        const post = new Post({ ...body,image:req.user.image, userId: id ,imageId:req.user.imageId })
        await post.save()
        res.status(201).send({
            message: "post created",
            data: post
        });

    } catch (err) {
        console.log("err");
        next(new CustomError("Internal server error.", 500));

    }
}
// controllers/postController.js
exports.updatePost = async (req, res, next) => {
    try {
        const postId = req.params.id;
        const userId = req.user.id;

        const post = await Post.findById(postId);

        if (!post) {
            return next(new CustomError('No post found', 404));
        }

        if (post.userId.toString() !== userId.toString()) {
            return next(new CustomError('Unauthorized to update this post', 403));
        }

        const updatedPost = await Post.findByIdAndUpdate(postId, {...req.body,image:req.user.image,imageId:req.user.imageId} ,{ new: true, runValidators: true });

        res.status(200).send({
            message: "Post updated",
            data: updatedPost
        });
        if(req.user.imageId){
            req.user.imageId=post.imageId
            next()
        }
    } catch (err) {
        next(new CustomError("Internal server error.", 500));
    }
}


// controllers/postController.js
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
        req.user.imageId=post.imageId;
        next()
    } catch (err) {
        next(new CustomError("Internal server error.", 500));
    }
}
