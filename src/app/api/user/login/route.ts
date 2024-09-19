import { DB } from "@lib/DB";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken"

//POST /api/user/login
export const POST = async (request: NextRequest) => {
  const body = await request.json();
  const { username, password } = body;
  // username validation

  // เช็คว่ามีusernameนี้ในฐานขอมูลไหม
  const user = DB.users.find(
    (u) => u.username === username && u.password === password
  )

  if (!user) {
    return NextResponse.json({
      ok: false,
      message: "Username or password is incorrect",
    }, {status: 404})
  }

  const secret = process.env.JWT_SECRET || "This is another secret"
  const token = jwt.sign(
    {username: username, role: user.role, studenId: user.studentId}, //ข้อมูลที่จะฝังลงในtoken
    secret, 
    {expiresIn: "8h"} //tokenอายุนานเท่าไหร่ (เป็นoptionเสริม)
  );

  // return NextResponse.json(
  //   {
  //     ok: false,
  //     message: "Username or password is incorrect",
  //   },
  //   { status: 400 }
  // );

  return NextResponse.json({ ok: true, token: token });
};
