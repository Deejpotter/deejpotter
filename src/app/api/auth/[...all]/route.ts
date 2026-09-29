import { toNextJsHandler } from "better-auth/next-js";
import { auth } from "@/lib/auth-spike";

export const { GET, POST } = toNextJsHandler(auth);
