# Gunakan imej rasmi Node.js
FROM node:16

# Tentukan direktori kerja dalam container
WORKDIR /app

# Salin semua fail ke dalam container
COPY package*.json ./
COPY . .

# Pasang dependencies
RUN npm install

# Tetapkan port yang akan digunakan
EXPOSE 3001

# Jalankan aplikasi
CMD ["node", "server.js"]
