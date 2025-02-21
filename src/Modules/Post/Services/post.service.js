import { Post, User } from "../../../DB/models/index.js"
import { pagination } from "../../../utils/pagination.utils.js"

export const createPost = async (req, res, next) => {
    const {_id} = req.loggedInUser
    const { title , desc  , allowedComments  , tags} = req.body
    const {files} = req

    if(tags){
        const users  = await User.find({ _id:{ $in: tags}})
        if(users.length != tags.length){
            return res.status(404).json({ message: 'User not found' })
        }
    }

    const postObject =  {
        title,
        description:desc,
        ownerId:_id,
        allowedComments,
        tags
    }

    const post = await Post.create(postObject)

    return res.status(200).json({ message: 'Post created successfully'  , post})
}



export const listPosts = async (req, res, next) => {
  // page , limit
  const {page , limit = 2} = req.query
  // const {skip,limit:size } = pagination(page,limit)

  // const posts  = await Post.find().limit(size).skip(skip).sort({createdAt:-1})
  // const allPosts = await Post.countDocuments()


  const posts = await Post.paginate({allowedComments:true},{
    page,
    limit, 
    sort:{createdAt:-1},
    populate:'ownerId',
    customLabels:{
      totalDocs:'totalPosts',
      docs:'posts',
      page:'currentPage',
      limit:'postsPerPage'
    }
  })

  return res.status(200).json({ message: 'Posts fetched successfully'  , posts })
}