# Requirement Analysis

## User

- Signup, login & logout (firebase)
- Signin with google (firebase)
- Add blog to database
- Update his blog
- Add blog to wish list
- Delete from wish list
- Comment on blogs of others

## Tech Used

- Backend:
    - Nodejs
    - Express
    - Mongodb
- Frontend:
    - React
    - React Router
    - tailwindcss
    - Daisy UI
    

## API Design:

- /api/v1 (old version)
- /api/v2 (new version)

## All Blogs:

- /api/v1/allBlogs (GET) [Done]
    - Filter by category : /allBlogs?category=`name` [Done]
    - Pagination:/api/v1/allBlogs?page=`number`&size=`number` [Done]
    - Search: /api/v1/allBlogs?title=`blogName` [Done]
- /api/v1/totalBlogs (GET) [Done]
- /api/v1/latestBlogs (GET) [Done]
- /api/v1/featuredBlogs(GET) [Done]

## User:

- /api/v1/user/create-blog (POST) [Done]
- /api/v1/user/update-blog/:blogId(PATCH) [Done]
- /api/v1/user/add-to-wishlist/:blogId(POST) [Done]
- /api/v1/user/wishlist?email=userMail [Done]
- /api/v1/user/remove-from-wishlist/:id(DELETE) [Done]
- /api/v1/user/create-comment(POST) [Done]
- /api/v1/user/allComments/:blogId(GET) [Done]

## Auth:

- /api/v1/access-token(POST) [Done]
- /api/v1/clear-token(POST) [Done]
- create middleware tokenChecker [Done]