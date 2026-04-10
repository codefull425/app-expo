const fs = require('fs');
const path = require('path');
const jsonServer = require('json-server');

const root = __dirname;
const serverJsonPath = path.join(root, 'server.json');
const routesJsonPath = path.join(root, 'routes.json');

const db = JSON.parse(fs.readFileSync(serverJsonPath, 'utf8'));
const routes = JSON.parse(fs.readFileSync(routesJsonPath, 'utf8'));

function rewriteItemsToCategories(url) {
  if (!url) return url;
  if (url === '/items' || url.startsWith('/items?') || url.startsWith('/items/')) {
    return '/categories' + url.slice('/items'.length);
  }
  return url;
}

const app = jsonServer.create();
app.use((req, res, next) => {
  req.url = rewriteItemsToCategories(req.url || '');
  req.originalUrl = rewriteItemsToCategories(req.originalUrl || '');
  next();
});

app.use(jsonServer.defaults({ logger: true }));

app.use(jsonServer.rewriter(routes));
app.use(jsonServer.router(db));

const port = parseInt(process.env.PORT || '3000', 10);
const host = process.env.HOST || '0.0.0.0';

app.listen(port, host, () => {
  console.log(`JSON Server is running on http://${host}:${port}`);
});
