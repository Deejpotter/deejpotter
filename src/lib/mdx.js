import fs from "fs";
import path from "path";
import matter from "gray-matter";

export function getPost(slug) {
    const filePath = path.join(process.cwd(), "posts", `${slug}.mdx`);
    const fileContents = fs.readFileSync(filePath, "utf8");
    const { data, content } = matter(fileContents);

    return { data, content };
}
