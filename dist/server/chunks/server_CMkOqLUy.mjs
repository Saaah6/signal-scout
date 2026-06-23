import { Auth } from "@auth/core";
import { parseString } from "set-cookie-parser";
import Google from "@auth/core/providers/google";
//#region node_modules/auth-astro/src/config.ts
var defineConfig = (config) => {
	config.prefix ??= "/api/auth";
	config.basePath = config.prefix;
	return config;
};
//#endregion
//#region \0auth:config
var _auth_config_default = defineConfig({ providers: [Google({
	clientId: void 0,
	clientSecret: void 0
})] });
//#endregion
//#region node_modules/auth-astro/server.ts
var actions = [
	"providers",
	"session",
	"csrf",
	"signin",
	"signout",
	"callback",
	"verify-request",
	"error"
];
function AstroAuthHandler(prefix, options = _auth_config_default) {
	return async ({ cookies, request }) => {
		const url = new URL(request.url);
		const action = url.pathname.slice(prefix.length + 1).split("/")[0];
		if (!actions.includes(action) || !url.pathname.startsWith(prefix + "/")) return;
		const res = await Auth(request, options);
		if ([
			"callback",
			"signin",
			"signout"
		].includes(action)) {
			const getSetCookie = res.headers.getSetCookie();
			if (getSetCookie.length > 0) {
				getSetCookie.forEach((cookie) => {
					const { name, value, ...options2 } = parseString(cookie);
					cookies.set(name, value, options2);
				});
				res.headers.delete("Set-Cookie");
			}
		}
		return res;
	};
}
function AstroAuth(options = _auth_config_default) {
	const { AUTH_SECRET, AUTH_TRUST_HOST, VERCEL, NODE_ENV } = Object.assign({
		"ASSETS_PREFIX": void 0,
		"BASE_URL": "/",
		"DEV": false,
		"MODE": "production",
		"PROD": true,
		"SITE": "https://signal-scout.com",
		"SSR": true
	}, {
		NODE: "C:\\Program Files\\nodejs\\node.exe",
		NODE_ENV: "production",
		OS: "Windows_NT"
	});
	options.secret ??= AUTH_SECRET;
	options.trustHost ??= !!(AUTH_TRUST_HOST ?? VERCEL ?? NODE_ENV !== "production");
	const { prefix = "/api/auth", ...authOptions } = options;
	const handler = AstroAuthHandler(prefix, authOptions);
	return {
		async GET(context) {
			return await handler(context);
		},
		async POST(context) {
			return await handler(context);
		}
	};
}
async function getSession(req, options = _auth_config_default) {
	options.secret ??= Object.assign({
		"ASSETS_PREFIX": void 0,
		"BASE_URL": "/",
		"DEV": false,
		"MODE": "production",
		"PROD": true,
		"SITE": "https://signal-scout.com",
		"SSR": true
	}, {
		NODE: "C:\\Program Files\\nodejs\\node.exe",
		NODE_ENV: "production",
		OS: "Windows_NT"
	}).AUTH_SECRET;
	options.trustHost ??= true;
	const url = new URL(`${options.prefix}/session`, req.url);
	const response = await Auth(new Request(url, { headers: req.headers }), options);
	const { status = 200 } = response;
	const data = await response.json();
	if (!data || !Object.keys(data).length) return null;
	if (status === 200) return data;
	throw new Error(data.message);
}
//#endregion
export { getSession as n, AstroAuth as t };
