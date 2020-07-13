const { Router } = require("express");
const router = Router();

const Post = require("../../models/Post");
const { requireLogin } = require("../../config/passport");

router.get("/", requireLogin, async (req, res) => {
  const posts = await Post.find();
  res.json(posts);
});

router.post("/", async (req, res) => {
  try {
    const post = new Post({
      title: req.body.title,
      description: req.body.description
    });
    const savedPost = await post.save();
    res.json(savedPost);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
});

router.get("/:postId", async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    res.json(post);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
});

router.delete("/:postId", async (req, res) => {
  try {
    const removedPost = await Post.remove({ _id: req.params.postId });
    res.json(removedPost);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
});

router.patch("/:postId", async (req, res) => {
  try {
    const updatedPost = await Post.updateOne(
      { _id: req.params.postId },
      { $set: { title: req.body.title } }
    );
    res.json(updatedPost);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
});

module.exports = router;