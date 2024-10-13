import fs from "fs";
import path from "path";
import matter from "gray-matter";

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
  // The path to the post file is constructed using the process.cwd() function to get the current working directory, the path.join() function to join the paths, and the slug parameter.
  const filePath = path.join(process.cwd(), "posts", `${slug}.mdx`);
  // The fs.readFileSync() function reads the file at the given path and returns the contents as a string.
  const fileContents = fs.readFileSync(filePath, "utf8");
  // The matter() function from the gray-matter package is used to parse the front matter and content of the file.
  // Destructure the data and content properties from the parsed file contents.
  const { data, content }: getPostResponse = matter(fileContents);

  // Finally, return an object with the data and content properties.
  return { data, content };
}
