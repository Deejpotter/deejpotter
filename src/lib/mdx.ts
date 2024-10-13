import fs from "fs";
import path from "path";
import matter from "gray-matter";

// Define the shape of the data object returned by the getPost function.
type getPostResponse = {
  data: {
    [key: string]: any;
  };
  content: string;
};

/**
 * Finds the post with the given slug and returns its data and content.
 * @param {string} slug The slug of the post to find.
 */
export function getPost(slug: string): getPostResponse {
  const filePath = path.join(process.cwd(), "posts", `${slug}.mdx`);
  const fileContents = fs.readFileSync(filePath, "utf8");
  const { data, content }: getPostResponse = matter(fileContents);

  return { data, content };
}
