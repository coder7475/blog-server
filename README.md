# All APIS
  Domain: 
    * https://server-programmers-blog.vercel.app/
    * https://server-programmers-blog.vercel.app/
## All Blogs:
* Get All Blogs
  - https://server-programmers-blog.vercel.app/api/v1/allBlogs (GET) 
    - Filter by category : /allBlogs?category=`name` [Done]
    - Pagination:/api/v1/allBlogs?page=`number`&size=`number` [Done]
    - Search: /api/v1/allBlogs?title=`blogName` [Done]
- https://server-programmers-blog.vercel.app/api/v1/totalBlogs (GET) [Done]
- https://server-programmers-blog.vercel.app/api/v1/latestBlogs (GET) [Done]
- https://server-programmers-blog.vercel.app/api/v1/featuredBlogs (GET) [Done]

## User:

- https://server-programmers-blog.vercel.app/api/v1/user/create-blog (POST) [Done]
- https://server-programmers-blog.vercel.app/api/v1/user/update-blog/:blogId (PATCH) [Done]
- https://server-programmers-blog.vercel.app/api/v1/user/add-to-wishlist (POST) [Done]
- https://server-programmers-blog.vercel.app/api/v1/user/wishlist?email=userMail [Done]
- https://server-programmers-blog.vercel.app/api/v1/user/remove-from-wishlist/:id (DELETE) [Done]
- https://server-programmers-blog.vercel.app/api/v1/user/create-comment (POST) [Done]
- https://server-programmers-blog.vercel.app/api/v1/user/allComments/:blogId (GET) [Done]

## Auth:

- https://server-programmers-blog.vercel.app//api/v1/access-token (POST) [Done]
- https://server-programmers-blog.vercel.app//api/v1/clear-token (POST) [Done]
