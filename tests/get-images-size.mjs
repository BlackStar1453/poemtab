import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import https from 'https';
import { fileURLToPath } from 'url';

// 获取 __dirname
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// 读取原始的 meta.json 文件
const meta = JSON.parse(fs.readFileSync(path.join(__dirname, '../docs/meta.json'), 'utf8'));

// 创建一个函数来下载图片并获取尺寸
async function getImageDimensions(url) {
  return new Promise((resolve, reject) => {
    https.get(url, response => {
      const chunks = [];
      response.on('data', chunk => chunks.push(chunk));
      response.on('end', async () => {
        try {
          const buffer = Buffer.concat(chunks);
          const metadata = await sharp(buffer).metadata();
          resolve({
            width: metadata.width,
            height: metadata.height
          });
        } catch (error) {
          reject(error);
        }
      });
      response.on('error', reject);
    }).on('error', reject);
  });
}

// 主函数
async function main() {
  const newMeta = [];
  
  // 处理每个图片
  for (let i = 0; i < meta.length; i++) {
    const item = { ...meta[i] };
    try {
      console.log(`Processing image ${i + 1}/${meta.length}: ${item.image}`);
      const dimensions = await getImageDimensions(item.image);
      item.width = dimensions.width;
      item.height = dimensions.height;
      newMeta.push(item);
    } catch (error) {
      console.error(`Error processing image ${item.image}:`, error);
      // 如果出错，仍然保留原始数据
      newMeta.push(item);
    }
  }

  // 写入新的 meta1.json 文件
  fs.writeFileSync(
    path.join(__dirname, '../docs/meta1.json'),
    JSON.stringify(newMeta, null, 2)
  );
  console.log('Done! New metadata written to meta1.json');
}

// 运行脚本
main().catch(console.error); 