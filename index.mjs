/*  LittleSkin-AutoSign: Automatic daily sign for littleskin.cn 
    Copyright (C) 2023 方而静

    This program is free software; you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation; either version 2 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License along
    with this program; if not, write to the Free Software Foundation, Inc.,
    51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.
    */

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
	let res = await req.post('user/sign', null, {
		headers: { 'X-CSRF-TOKEN': csrf }
	});
	console.log(res.data);
}

main().catch(err => {
	console.log('Error', err);
});

