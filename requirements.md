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
    - Pagination:/api/v1/allBlogs?page=`number`&size=`number`
    - Search: /api/v1/allBlogs?title=`blogName`
- /api/v1/totalBlogs (GET)
- /api/v1/latestBlogs (GET) [Done]
- /api/v1/featuredBlogs(GET) [Done]

## Comments

- /api/v1/create-comments(POST)
- /api/v1/allComments/:blogsId(GET)

## User:

- /api/v1/user/create-blog (POST)
- /api/v1/user/update-blog(PUT)
- /api/v1/user/add-to-wishlist(POST)
- /api/v1/user/remove-from-wishlist(DELETE)

## Auth:

- /api/v1/access-token(POST)
- /api/v1/clear-token(POST)