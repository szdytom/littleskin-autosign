import axios from 'axios';
import { wrapper } from 'axios-cookiejar-support';
import { CookieJar } from 'tough-cookie';

const cookie_jar = new CookieJar();
const endpoint = 'https://littleskin.cn/';

const req = wrapper(axios.create({
	jar: cookie_jar,
	withCredentials: true,
	baseURL: endpoint,
	headers: (await import('./headers.json', { assert: { type: 'json' } })).default,
}));

const credentials = JSON.parse(process.env.CREDENTIALS);

function sleep(t) {
	return new Promise((resolve, reject) => {
		setTimeout(() => { resolve(); }, t);
	});
}

function extract_csrf(page) {
	return /<meta name="csrf-token" content="(\w+)">/.exec(page)[1];
}

async function main() {
	let home_page = await req.get('auth/login');
	let csrf = extract_csrf(home_page.data);
	await sleep(500);
	await req.post('auth/login', {
		identification: credentials.handle,
		keep: false,
		password: credentials.password,
	}, {
		headers: { 'X-CSRF-TOKEN': csrf }
	});
	await sleep(200);
	csrf = extract_csrf((await req.get('user')).data);
	await sleep(500);
	await req.post('user/sign', null, {
		headers: { 'X-CSRF-TOKEN': csrf }
	});
}

main().catch(err => {
	console.log('Error');
});

