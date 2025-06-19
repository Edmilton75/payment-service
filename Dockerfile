# Estágio 1: Build da Aplicação
FROM node:20-alpine AS builder

WORKDIR /usr/src/app

COPY package*.json ./

# CORREÇÃO: Instala TODAS as dependências (incluindo devDependencies)
# para que o comando 'npm run build' funcione.
RUN npm install

COPY . .

RUN npm run build

# Estágio 2: Imagem Final de Produção
FROM node:20-alpine

WORKDIR /usr/src/app

# Copia apenas as dependências de produção e a aplicação compilada do estágio de build
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/dist ./dist

CMD ["node", "dist/main"]