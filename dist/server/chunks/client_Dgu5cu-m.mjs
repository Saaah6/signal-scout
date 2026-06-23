//#region node_modules/auth-astro/client.ts
/**
* Client-side method to initiate a signin flow
* or send the user to the signin page listing all possible providers.
* Automatically adds the CSRF token to the request.
*
* [Documentation](https://authjs.dev/reference/utilities/#signin)
*/
async function signIn(providerId, options, authorizationParams) {
	const { callbackUrl = window.location.href, redirect = true } = options ?? {};
	const { prefix = "/api/auth", ...opts } = options ?? {};
	const isCredentials = providerId === "credentials";
	const isSupportingReturn = isCredentials || providerId === "email";
	const _signInUrl = `${`${prefix}/${isCredentials ? "callback" : "signin"}/${providerId}`}?${new URLSearchParams(authorizationParams)}`;
	const { csrfToken } = await (await fetch(`${prefix}/csrf`)).json();
	const res = await fetch(_signInUrl, {
		method: "post",
		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
			"X-Auth-Return-Redirect": "1"
		},
		body: new URLSearchParams({
			...opts,
			csrfToken,
			callbackUrl
		})
	});
	const data = await res.clone().json();
	const error = new URL(data.url).searchParams.get("error");
	if (redirect || !isSupportingReturn || !error) {
		window.location.href = data.url ?? callbackUrl;
		if (data.url.includes("#")) window.location.reload();
		return;
	}
	return res;
}
/**
* Signs the user out, by removing the session cookie.
* Automatically adds the CSRF token to the request.
*
* [Documentation](https://authjs.dev/reference/utilities/#signout)
*/
async function signOut(options) {
	const { callbackUrl = window.location.href, prefix = "/api/auth" } = options ?? {};
	const { csrfToken } = await (await fetch(`${prefix}/csrf`)).json();
	const url = (await (await fetch(`${prefix}/signout`, {
		method: "post",
		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
			"X-Auth-Return-Redirect": "1"
		},
		body: new URLSearchParams({
			csrfToken,
			callbackUrl
		})
	})).json()).url ?? callbackUrl;
	window.location.href = url;
	if (url.includes("#")) window.location.reload();
}
//#endregion
export { signIn, signOut };
