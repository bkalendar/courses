import path from 'node:path';
import fs from 'node:fs/promises';

import fetch from 'node-fetch';

const res = await fetch(
    'http://aao.hcmut.edu.vn/catalog/view/theme/default/ctdt_upload/cautrucmonhoc.json'
);

/** @type {import("./types.js").Course[]} */
const courses = await res.json();

const cwd = process.cwd();

const dataDir = path.resolve(cwd, 'courses');

// clean up
await fs.rm(dataDir, { recursive: true, force: true });
await fs.mkdir(dataDir);

let done = 0;
let total = courses.length;
for (const course of courses) {
    const dest = path.resolve(dataDir, `${course.msmh}.json`);
    console.info('[', done, '/', total, '] writing to', dest);
    await fs.writeFile(dest, JSON.stringify(course, null, 4), {
        encoding: 'utf8',
    });
    ++done;
}
console.info('done writing', done, 'files');
