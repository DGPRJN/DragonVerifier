import express, { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import cookieParser from "cookie-parser";

import dotenv from "dotenv";
import app from "..";

dotenv.config(); // Load .env variables

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

// Provides frontend with the correct login url
router.get("/login", async (req: Request, res) => {
    const loginUri = generateLoginRedirect(req);

    res.json({ redirect: loginUri });
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
        const data = await fRes.json();

        const token = data.access_token;
        const user: CanvasUser = data.user;

        console.log(data);

        const jwt = await generateAccessToken(user, token);

        console.log(jwt);

        res.cookie("token", jwt);
        res.json({ success: true });
    });
});

router.get("/whoami", async (req: Request, res: Response) => {
    const cookie = req.cookies.token;

    let jose = await import("jose");

    const secret = jose.base64url.decode(process.env.JWT_TOKEN_SECRET!);
    const jwt = await jose.jwtDecrypt(cookie, secret);

    const payload = jwt.payload.payload as JwtPayload;
    const token = payload.access_token;

    fetch(`${canvasUrl}/api/v1/courses`, {
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
    return (
        req.protocol +
        "://" +
        req.hostname +
        (port ? ":" : "") +
        port +
        "/api/v1/oauth/redirect"
    );
}

async function generateAccessToken(user: CanvasUser, canvasApiToken: string) {
    const payload: JwtPayload = {
        user,
        access_token: canvasApiToken,
    };

    // we have to import jose like this because it is not CJS
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
interface CanvasUser {
    id: number;
    name: string;
    global_id: string;
}

interface JwtPayload {
    user: CanvasUser;
    access_token: string;
}

export default router;
