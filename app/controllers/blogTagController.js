const BlogTag = require("../models/blogTag");
const Blog = require("../models/blog");
const blogEs = require("../services/elastic-search/blogEs");

exports.addBlogTag = (req, res) => {
  const tag = req.body.tag;
  const postId = req.params.postId;
  const bloggerId = req.user.id;

  Blog.findOne({
    where: {
      id: postId,
      blogger_id: bloggerId
    }
  }).then(blog => {
    if (blog) {
      const tagObj = {
        tag,
        blog_id: postId
      };
      BlogTag.create(tagObj).then(blogTag => {
        /* Indexing on elastic search */
        // if(blog.published)
        //   blogEs.postBlog(req.user.id);

        BlogTag.findAll({
          where: {
            blog_id: postId
          }
        }).then(blogTags => {
          res.json(blogTags);
        });
      });
    }
  });
};

exports.removeBlogTag = (req, res) => {
  const tagId = req.params.tagId;
  const postId = req.params.postId;
  const bloggerId = req.user.id;

  Blog.findOne({
    where: {
      id: postId,
      blogger_id: bloggerId
    }
  }).then(blog => {
    if (blog) {
      BlogTag.destroy({
        where: {
          id: tagId
        }
      }).then(() => {
        /* Indexing on elastic search */
        //if (blog.published) blogEs.postBlog(req.user.id);

        BlogTag.findAll({
          where: {
            blog_id: postId
          }
        }).then(blogTags => {
          res.json(blogTags);
        });
      });
    }
  });
};

exports.fetchBlogTag = (req, res) => {
  const blogId = req.params.postId;
  const bloggerId = req.user.id;
  BlogTag.findAll({
    attributes: ["tag", "id"],
    include: [
      {
        model: Blog,
        attributes: [],
        where: {
          id: blogId,
          blogger_id: bloggerId
        }
      }
    ]
  }).then(blogTags => {
    res.send(blogTags);
  });
};
