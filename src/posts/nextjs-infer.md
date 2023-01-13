---
title: "How to infer GetStaticProps or GetServerSideProps return types in Next.js"
slug: "how-to-infer-gsp-or-gssp-return-types-in-nextjs"
date: "December 30, 2022"
author: "Luka Hietala"
contributors: ["Luka Hietala"]
---

## Introduction

Have you ever been in a situation where you're using the `GetStaticProps` or `GetServerSideProps` function in your Next.js application to fetch data from an API, but you keep getting a type error when you try to pass the data to your page component? It can be frustrating to not be able to infer the correct return type for these functions, especially if you know the shape of the data you're expecting.

However, there is a way to solve this problem and correctly infer the return type of `GetStaticProps` or `GetServerSideProps`. In this post, we will go over two solutions that will allow you to correctly type the data that is being returned from these functions.

## The Problem

Let's say you have a page that uses `GetStaticProps` to fetch data from an API. You know that the data you're fetching is an object with properties such as `title`, `body`, `id`, and `userId`. To represent this data, you've created an interface called `Post`. However, when you try to pass the post prop to your page component, you get a type error because the type of the post prop is `any`. This is what your code might look like:

```ts
import type { GetStaticProps } from "next";

interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
}

// This `post` prop will be of type `any` because we can't infer the type of the `post` prop from the `GetStaticProps` return type yet
const Home = (post) => {
  return (
    <div>
      <h1>{post.title}</h1>
      <p>{post.body}</p>
    </div>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const res = await fetch("https://jsonplaceholder.typicode.com/posts/1");
  const post: Post = await res.json();

  return {
    props: {
      post,
    },
  };
};

export default Home;
```

## Ideal Solutions

To solve this problem, we can use a type to infer the return type of `GetStaticProps` or `GetServerSideProps`, and then use the `InferGetStaticPropsType` or `InferGetServerSidePropsType` utility types to infer the type of the post prop.

### InferGetStaticPropsType (For GetStaticProps)

```ts
import type { GetStaticProps, InferGetStaticPropsType } from "next";

interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
}

// This `post` prop will be of type `Post` because we can infer the type of the `post` prop from the `GetStaticProps` return type

const Home = ({ post }: InferGetStaticPropsType<typeof getStaticProps>) => {
  return (
    <div>
      <h1>{post.title}</h1>
      <p>{post.body}</p>
    </div>
  );
};

export const getStaticProps: GetStaticProps<{ post: Post }> = async () => {
  const res = await fetch("https://jsonplaceholder.typicode.com/posts/1");
  const post: Post = await res.json();

  return {
    props: {
      post,
    },
  };
};

export default Home;
```

### InferGetServerSidePropsType (For GetServerSideProps)

```ts
import type { GetServerSideProps, InferGetServerSidePropsType } from "next";

interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
}

// This `post` prop will be of type `Post` because we can infer the type of the `post` prop from the `GetServerSideProps` return type

const Home = ({
  post,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return (
    <div>
      <h1>{post.title}</h1>
      <p>{post.body}</p>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps<{
  post: Post;
}> = async () => {
  const res = await fetch("https://jsonplaceholder.typicode.com/posts/1");
  const post: Post = await res.json();

  return {
    props: {
      post,
    },
  };
};

export default Home;
```

> Note: If you don't get intellisense for the GetStaticProps or GetServerSideProps types in your editor, you need to make them asyncronous. You can do this by adding the `async` keyword to the function declaration. For example, `export const getStaticProps: GetStaticProps = async () => { ... }` instead of `export const getStaticProps: GetStaticProps = () => { ... }`... This one of the really weird things about Next.js.

## Conclusion

Now that you know how to correctly infer the return type of `GetStaticProps` or `GetServerSideProps`, you can make your Next.js pages more type-safe. If you have any questions or comments, feel free to leave a comment below (if the comment section happens to be ready).
