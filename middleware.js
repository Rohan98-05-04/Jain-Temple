import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { API_WEB_URL } from "utils/config";

export const config = {
  matcher: [
    "/mandir-users",
    "/committee-members",
    "/donation",
    "/event",
    "/expenses",
  ],
};

export default async function middleware(req) {
  const token = req.cookies.get("token");
  
  if (!token) {
    console.log('Token not found');
    return NextResponse.redirect(`${API_WEB_URL}/login`);
  }

  try {
    const cleanedToken = token.value.replace(/"/g, "");
    const isValid = await jwtVerify(cleanedToken, new TextEncoder().encode("thisisasamplesecret"));

    if (!isValid) {
      console.log('2')
      return NextResponse.redirect(`${API_WEB_URL}/login`);
    }

    return NextResponse.next();
  } catch (error) {
    console.log('Token verification failed:', error);
    return NextResponse.redirect(`${API_WEB_URL}/login`);
  }
}
