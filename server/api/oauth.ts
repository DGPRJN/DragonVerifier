import express, { NextFunction, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import cookieParser from "cookie-parser";
import { JWEInvalid } from "jose/errors";
import next from "next";

const prisma = new PrismaClient();
const router = express.Router();
router.use(cookieParser());

const canvasUrl = process.env.CANVAS_BASE_URL;
const clientId = process.env.CANVAS_API_KEY_ID;
const clientSecret = process.env.CANVAS_API_KEY;
const port = process.env.EXPRESS_PORT!;
const scopes = [
    "url:GET|/api/v1/accounts",
    "url:GET|/api/v1/courses",
    "url:GET|/api/v1/courses/:course_id/assignments",
    "url:GET|/api/v1/courses/:course_id/assignments/:id",
    "url:GET|/api/v1/users/:user_id/avatars",
    "url:GET|/api/v1/users/:user_id/profile",
    "url:POST|/api/v1/courses/:course_id/assignments",
    "url:POST|/api/v1/courses/:course_id/assignments/:assignment_id/submissions/update_grades",
    "url:PUT|/api/v1/courses/:course_id/assignments/:assignment_id/submissions/:user_id",
    "url:PUT|/api/v1/courses/:course_id/assignments/:id",
];

const frontend = process.env.NEXT_PUBLIC_FRONTEND_URL;
const backend = process.env.NEXT_PUBLIC_BACKEND_LOCAL;

// Provides frontend with the correct login url
router.get("/login", async (req: Request, res) => {
    const loginUri = generateLoginRedirect(req);

    res.json({ redirect: loginUri });
});

router.get("/logout", async (req, res) => {
    const cookie = req.cookies.token as string;

    if (!cookie || typeof cookie !== "string") {
        res.status(400).json({ error: "Invalid or missing token" });
        return;
    }

    res.clearCookie("token");
    res.json({ success: true });
});

// Consumes the OAuth2 Redirect URI and grabs the authorization token
router.get("/redirect", async (req: Request, res: Response) => {
    const code = req.query.code!;

    const body = JSON.stringify({
        grant_type: "authorization_code",
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: generateRedirectUri(req),
        code: code,
        replace_tokens: 1,
    });

    fetch(canvasUrl + "/login/oauth2/token", {
        method: "POST",
        body,
        headers: {
            "Content-Type": "application/json",
        },
    }).then(async (fRes) => {
        if (!fRes.ok) {
            res.redirect(`${frontend}/login/redirect?success=false`);
            return;
        }

        const data = await fRes.json();

        const token = data.access_token;
        const user: CanvasUser = data.user;

        const jwt = await generateAccessToken(user, token);

        res.cookie("token", jwt);
        res.redirect(`${frontend}/login/redirect?success=true`);
    });
});

router.get("/whoami", async (req: Request, res: Response) => {
    const cookie = req.cookies.token as string;

    let jose = await import("jose");

    const secret = jose.base64url.decode(process.env.JWT_TOKEN_SECRET!);
    if (!cookie || typeof cookie !== "string") {
        res.status(400).json({ error: "Invalid or missing token" });
        return;
    }

    let jwt;
    try {
        jwt = await jose.jwtDecrypt(cookie, secret);
    } catch (error) {
        res.status(400).json({ error: "Failed to decrypt token" });
        return;
    }

    const payload = jwt.payload.payload as JwtPayload;
    const token = payload.canvas_api_token;

    fetch(`${canvasUrl}/api/v1/users/${payload.user.id}/profile`, {
        headers: { Authorization: `Bearer ${token}` },
    }).then(async (fRes) => {
        const data = await fRes.json();

        res.json([fRes.status, data]);
    });
});

function generateLoginRedirect(req: Request) {
    const redirectUri = generateRedirectUri(req);
    var combinedScopes = scopes.join(" ");

    return (
        canvasUrl +
        "/login/oauth2/auth?client_id=" +
        clientId +
        "&response_type=code&state=true&redirect_uri=" +
        encodeURIComponent(redirectUri) +
        "&scope=" +
        encodeURIComponent(combinedScopes)
    );
}

function generateRedirectUri(req: Request) {
    return backend + "/api/v1/oauth/redirect";
}

async function generateAccessToken(user: CanvasUser, canvasApiToken: string) {
    const payload: JwtPayload = {
        user,
        canvas_api_token: canvasApiToken,
    };

    // we have to import jose like this because it is not CommonJS >:(
    let jose = await import("jose");

    const secret = jose.base64url.decode(process.env.JWT_TOKEN_SECRET!);
    const jwt = await new jose.EncryptJWT({ payload })
        .setProtectedHeader({ alg: "dir", enc: "A128CBC-HS256" })
        .setIssuedAt()
        .setExpirationTime("1h")
        .encrypt(secret);

    return jwt;
}

// local user object
export interface CanvasUser {
    id: number;
    name: string;
    global_id: string;
}

export interface JwtPayload {
    user: CanvasUser;
    canvas_api_token: string;
}

export default router;
