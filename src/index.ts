import Fastify from 'fastify';
import fastifyMultipart from 'fastify-multipart';
import fs from 'fs';
import path from 'path';

const fastify = Fastify();
fastify.register(fastifyMultipart);

fastify.get('/', (request, reply) => {
  reply.type('text/html').send(
    `<!doctype html><html><head></head>
      <body>
        <form action="/upload" method="post" enctype="multipart/form-data">
          <input type="file" name="fileToUpload" />
          <input type="hidden" name="folder" value="/Users/tyler.liu/Desktop" />
          <button type="submit">upload</button>
        </form>
      </body>
    </html>`
  );
});

type Field = {
  fieldname: string;
  value: string;
};

fastify.post('/upload', async (request, reply) => {
  const parts = request.parts();
  let buffer: Buffer | undefined;
  let filename: string | undefined;
  let folder: string | undefined;
  for await (const part of parts) {
    if (part.file) {
      filename = part.filename;
      buffer = await part.toBuffer();
    } else {
      const field = part as unknown as Field;
      if (field.fieldname === 'folder') {
        folder = field.value;
      }
    }
    if (buffer && filename && folder) {
      let filePath = path.join(folder, filename);
      for (let i = 2; i < Number.MAX_VALUE; i++) {
        if (fs.existsSync(filePath)) {
          filePath = path.join(folder, `${i}-${filename}`);
        } else {
          break;
        }
      }
      fs.writeFileSync(filePath, buffer);
      break;
    }
  }
  reply.type('text/html').send('Uploaded');
});

fastify.listen(8090, '127.0.0.1', (err, address) => {
  if (err) {
    throw err;
  }
  console.log(address);
});
