import { H as defineMiddleware, M as sequence } from "./chunks/render_D6CBBbyb.mjs";
//#endregion
//#region \0virtual:astro:middleware
var onRequest = sequence(defineMiddleware(async (context, next) => {
	const response = await next();
	response.headers.set("X-Content-Type-Options", "nosniff");
	response.headers.set("X-Frame-Options", "DENY");
	response.headers.set("X-XSS-Protection", "1; mode=block");
	response.headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload");
	response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
	response.headers.set("Content-Security-Policy", "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https:;");
	return response;
}));
//#endregion
export { onRequest };
