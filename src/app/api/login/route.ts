import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
    try {
        const { username, password } = await req.json();

        if (!username || !password) {
            return NextResponse.json({ ok: false, error: "缺少参数" }, { status: 400 });
        }

        const user = await db.user.findUnique({ where: { username } });
        if (!user) {
            return NextResponse.json({ ok: false, error: "账号或密码错误" }, { status: 401 });
        }

        const ok = await bcrypt.compare(password, user.passwordHash);
        if (!ok) {
            return NextResponse.json({ ok: false, error: "账号或密码错误" }, { status: 401 });
        }

        // ✅ 校验成功（这里简单返回 ok，实际项目建议设置 session / JWT）
        return NextResponse.json({ ok: true });
    } catch (e) {
        return NextResponse.json({ ok: false, error: "服务器错误" }, { status: 500 });
    }
}
