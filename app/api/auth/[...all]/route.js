import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

const handlers = toNextJsHandler(auth);

export const GET = async (req) => {
  try {
    const res = await handlers.GET(req);
    return res;
  } catch (err) {
    console.error("❌ [Better-Auth GET error]:", err);
    return Response.json(
      {
        success: false,
        message: err.message,
        stack: err.stack,
      },
      { status: 500 }
    );
  }
};

export const POST = async (req) => {
  try {
    const res = await handlers.POST(req);
    return res;
  } catch (err) {
    console.error("❌ [Better-Auth POST error]:", err);
    return Response.json(
      {
        success: false,
        message: err.message,
        stack: err.stack,
      },
      { status: 500 }
    );
  }
};
