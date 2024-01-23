# EXPRESS/PRISMA - Sample Backend
_Sharukh Rahman S_

This server app is creating using [Express](https://expressjs.com/) and [Prisma Client](https://www.prisma.io/docs/concepts/components/prisma-client). It uses a SQLite database file with some initial dummy data which you can find at [`./prisma/dev.db`](./prisma/dev.db).

## Getting started

### 1. Install dependencies

Install npm dependencies:
```
cd rest-express
npm install
```
</details>

### 2. Create and seed the database

Run the following command to create your SQLite database file. This also creates the `User` and `Post` tables that are defined in [`prisma/schema.prisma`](./prisma/schema.prisma):

```
npx prisma migrate dev --name init
```

When `npx prisma migrate dev` is executed against a newly created database, seeding is also triggered.  The seed file in [`prisma/seed.js`](./prisma/seed.js) will be executed and your database will be populated with the sample data.


### 3. Start the REST API server

```
npm run dev
```

The server is now running on `http://localhost:5000`. You can send the API requests implemented in `index.js`

## Using the REST API

You can access the REST API of the server using the following endpoints:

### `GET`

- `/account/readAccount?userId={userId}`: Fetch a single account by its `userId`
- `/account/readAllAccounts`: Fetch all accounts
- `/post/readPost/:id`: Fetch a single post by its `id`
- `/post/readAllPosts?searchString={searchString}&take={take}&skip={skip}&orderBy={orderBy}`: Fetch all published posts
  - Query Parameters
    - `searchString` (optional): This filters posts by `title` or `content`
    - `take` (optional): This specifies how many objects should be returned in the list
    - `skip` (optional): This specifies how many of the returned objects in the list should be skipped
    - `orderBy` (optional): The sort order for posts in either ascending or descending order. The value can either `asc` or `desc`

### `POST`
### Header should have CL-X-TOKEN and CL-X-REFRESH
- `/account/loginAccount`: Login a user
  - Body:
    - `email: String` (required): The email address of the user
    - `password: String` (required): The password of the user
- `/account/createAccount`: Create a new user
  - Body:
    - `email: String` (required): The email address of the user
    - `name: String` (required): The name of the user
    - `password: String` (required): The password of the user
- `/post/createPost`: Create a new post
  - Body:
    - `title: String` (required): The title of the post
    - `content: String` (optional): The content of the post
- `/post/readAllDrafts`: Read all user draft posts

### `PUT`
### Header should have CL-X-TOKEN and CL-X-REFRESH

- `/account/updateAccount`: Update the name of the user
    - Body:
        - `name: String` (required): The name of the user
- `/post/updatePostStatus`: Toggle the publish value of a post by its `id`
  - Body:
    - `id: UUID` (required): The UUID of the post
    - `published: Boolean` (required): The publish status of the post
- `/post/updatePostViewCount`: Increases the `viewCount` of a `Post` by one `id`
  - Body:
    - `id: UUID` (required): The UUID of the post

### `DELETE`
### Header should have CL-X-TOKEN and CL-X-REFRESH

- `/account/deleteAccount`: Delete a user and all thier posts by `userId`
- `/post/deletePost`: Delete a post by its `id`
  - Body:
    - `id: UUID` (required): The UUID of the post
