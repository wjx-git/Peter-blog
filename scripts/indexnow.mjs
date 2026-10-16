// 将所有站点 URL 主动推送给 IndexNow（Bing / Yandex / Seznam / Naver 等）
// 用法：node scripts/indexnow.mjs   （需先部署最新代码，确保 sitemap 已在线上）
const HOST = 'wjx-git.github.io';
const KEY = '9b8efbff-f98a-47dd-a354-fa211e810b23';
const BASE = `https://${HOST}/Peter-blog`;
const KEY_LOCATION = `${BASE}/${KEY}.txt`;
const SITEMAP_INDEX = `${BASE}/sitemap-index.xml`;

async function collectUrls() {
  const indexXml = await (await fetch(SITEMAP_INDEX)).text();
  const sitemapLocs = [...indexXml.matchAll(/<loc>\s*(.*?)\s*<\/loc>/g)].map((m) => m[1]);
  const sitemaps = sitemapLocs.filter((u) => u.endsWith('.xml'));
  const urls = [];
  for (const sm of sitemaps) {
    const xml = await (await fetch(sm)).text();
    urls.push(...[...xml.matchAll(/<loc>\s*(.*?)\s*<\/loc>/g)].map((m) => m[1]));
  }
  return [...new Set(urls)];
}

const urlList = await collectUrls();
console.log(`找到 ${urlList.length} 个 URL：`);
console.log(urlList.join('\n'));

const res = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify({ host: HOST, key: KEY, keyLocation: KEY_LOCATION, urlList }),
});
console.log(`\nIndexNow 响应：HTTP ${res.status} ${res.statusText}`);
if (res.status === 200 || res.status === 202) {
  console.log('✅ 提交成功！搜索引擎将尽快抓取这些页面。');
} else {
  console.log(await res.text());
}
