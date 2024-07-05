import { NextResponse } from "next/server";
import jwt from "@tsndr/cloudflare-worker-jwt";
import Cookies from "js-cookie";

export const config = {
  matcher: [
    // "/dashboard",
    "/mandir-users",
    "/committee-members",
    "/donation",
    "/event",
    "/expenses",
   
  ],
};
export default async function middleware(req) {
  let token = req.cookies.get("token");
  if (!token) {
    console.log('1')
    return NextResponse.redirect("https://jaintemple.netlify.app/login");
  } else {
    try {
      const cleanedToken = token.value.replace(/"/g, '');
      const isValid = await jwt.verify(cleanedToken, process.env.JWT_SECRET_KEY);
      
      if (!isValid) {
        console.log('2')
        return NextResponse.redirect("https://jaintemple.netlify.app/login");
      }
      return NextResponse.next();
    } catch (e) {
      
      console.log('3')
      return NextResponse.redirect("https://jaintemple.netlify.app/login");
    }
  }
}
