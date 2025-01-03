import { nanoid } from "nanoid";
import { SignJWT } from "jose";
import type { APIRoute } from "astro";
import { SECRET, TOKEN } from "constant";

export const POST: APIRoute = async (ctx) => {
  try {
    const body = await ctx.request.json();
    if (
      !body.user ||
      typeof body.user !== "string" ||
      !body.password ||
      typeof body.password !== "string"
    ) {
      return new Response(
        JSON.stringify({
          message: "Please provide a valid user and password",
        }),
        {
          status: 400,
        }
      );
    }
    const token = await new SignJWT({
      user: body.user,
      role: "admin",
    })
      .setProtectedHeader({ alg: "HS256" })
      .setJti(nanoid())
      .setIssuedAt()
      .setExpirationTime("2h")
      .sign(SECRET);

    ctx.cookies.set(TOKEN, token, {
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 2,
    });

    return new Response(
      JSON.stringify({
        message: "You're logged in!",
      }),
      {
        status: 200,
      }
    );
  } catch (error) {
    console.debug(error);

    return new Response(
      JSON.stringify({
        message: "Login failed",
      }),
      {
        status: 500,
      }
    );
  }
};
