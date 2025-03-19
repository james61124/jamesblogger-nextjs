// 使用 CommonJS 模式
const fs = require('fs');
const path = require('path');

/** @type {import('next-sitemap').IConfig} */
const siteUrl = 'https://jamesblogger.com';

// 掃描 public/articles 下的所有檔案，生成動態路徑
const getArticlePaths = (basePath) => {
  const categories = fs.readdirSync(basePath);
  let paths = [];

  categories.forEach((category) => {
    const articleDir = path.join(basePath, category);
    if (fs.statSync(articleDir).isDirectory()) {
      const articles = fs.readdirSync(articleDir);
      articles.forEach((article) => {
        paths.push({
          loc: `/article/${category}/${article.replace('.md', '')}`,
          changefreq: 'daily',
          priority: 0.7,
        });
      });
    }
  });

  return paths;
};

module.exports = {
  siteUrl,
  generateRobotsTxt: true,
  sitemapSize: 5000,

  additionalPaths: async () => {
    // 固定頁面
    const staticPaths = [
      { loc: '/program', changefreq: 'daily', priority: 0.8 },
      { loc: '/life', changefreq: 'daily', priority: 0.8 },
      { loc: '/travel', changefreq: 'daily', priority: 0.8 },
    ];

    // 掃描 public/articles 下的文章路徑
    const articlePaths = getArticlePaths(path.join(__dirname, 'public'));

    return [...staticPaths, ...articlePaths];
  },
};
