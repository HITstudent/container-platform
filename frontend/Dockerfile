# 构建阶段
FROM node:18-alpine as builder

WORKDIR /app

# 复制 package.json 和 package-lock.json
COPY package*.json ./

# 安装依赖
RUN npm install

# 复制源代码
COPY . .

# 构建应用
RUN npm run build

# 生产阶段
FROM nginx:alpine

# 复制构建产物到 nginx 目录
COPY --from=builder /app/build /usr/share/nginx/html

# 复制 nginx 配置
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf

# 添加健康检查
HEALTHCHECK --interval=30s --timeout=3s \
  CMD wget --no-verbose --tries=1 --spider http://localhost:80/ || exit 1

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"] 