# Nuxt Minimal Starter

```
Vue3.51 + Nuxt3.14 + Ant Design Vue
```
Look at the [Nuxt documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## 该项目所需环境
前端：Node + yarn
后端：Node + Docker

## Setup
Make sure to install dependencies:
```bash
# yarn
yarn install
```

## Development Server

Start the development server on `http://localhost:3000`:
```bash
# 测试环境
yarn dev
# 生产环境
yarn prod
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.



# 
### docker构造环境
#### stage：
```
# mysql
docker run --name stage-mysql -e MYSQL_ROOT_PASSWORD=symxll -p 3307:3306 --restart always -d mysql:latest

# redis
docker run --name stage-redis -p 6380:6379 --restart always -d redis:alpine --requirepass symxll
```

#### prod：
```
# mysql
docker run --name prod-mysql -e MYSQL_ROOT_PASSWORD=symxll -p 3306:3306 --restart always -d mysql:latest

# redis
docker run --name stage-redis -p 6379:6379 --restart always -d redis:alpine redis-server --requirepass symxll
# Tip：--requirepass your-password 
```


# Docker Build
```
<!-- build -->
docker build -t name .

<!-- run -->
docker run -d -p 3000:3000 --name newname name
```

