const { model, Schema } = require("mongoose");

const commentSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    text: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

const postSchema = new Schema({
    title: String,
    description: String,
    image: String,
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    likes: [{
        type: Schema.Types.ObjectId,
        ref: "User",
    }],
    comments: [commentSchema]  
}, {
    timestamps: true
});

const Post = model("Post", postSchema);
module.exports = Post;
