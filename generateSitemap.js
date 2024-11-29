const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://superxnero.github.io'; // استبدل هذا بعنوان موقعك

function generateSitemap(dir, baseUrl) {
    let sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n';
    sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

    function scanDir(directory) {
        const files = fs.readdirSync(directory);
        files.forEach(file => {
            const fullPath = path.join(directory, file);
            const stats = fs.statSync(fullPath);

            if (stats.isDirectory()) {
                scanDir(fullPath);
            } else if (stats.isFile() && file !== 'sitemap.xml') {
                const relativePath = fullPath.replace(__dirname, '').replace(/\\/g, '/');
                const url = `${baseUrl}${relativePath}`;
                sitemap += `
                <url>
                    <loc>${url}</loc>
                    <lastmod>${new Date(stats.mtime).toISOString()}</lastmod>
                    <changefreq>weekly</changefreq>
                    <priority>0.8</priority>
                </url>`;
            }
        });
    }

    scanDir(dir);
    sitemap += '\n</urlset>';
    return sitemap;
}

const sitemapContent = generateSitemap(__dirname, BASE_URL);
fs.writeFileSync('sitemap.xml', sitemapContent);
console.log('Sitemap generated successfully!');