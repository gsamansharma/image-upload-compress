const { app } = require('@azure/functions');
const busboy = require('busboy');
const { Readable } = require('stream');

const parseForm = async (req) => {
  return new Promise(async (resolve, reject) => {
    try {
      const arrayBuffer = await req.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const stream = Readable.from(buffer);
      
      const bb = busboy({ headers: { 'content-type': req.headers.get('content-type') } });
      let fileBuffer = null;
      
      bb.on('file', (fieldname, file, info) => {
        const chunks = [];
        file.on('data', chunk => chunks.push(chunk));
        file.on('end', () => { fileBuffer = Buffer.concat(chunks); });
      });
      
      bb.on('error', reject);
      bb.on('finish', () => {
        if (!fileBuffer) {
          reject(new Error('No file found in request'));
        } else {
          resolve(fileBuffer);
        }
      });
      stream.pipe(bb);
    } catch (error) {
      reject(error);
    }
  });
};

app.http('uploadImage', {
  methods: ['POST'],
  authLevel: 'anonymous',
  handler: async (request, context) => {
    context.log(`Received upload request at ${request.url}`);
    
    try {
      const contentType = request.headers.get('content-type');
      if (!contentType || !contentType.includes('multipart/form-data')) {
        return { status: 400, body: 'Please send multipart/form-data with an image file.' };
      }
      
      const imageBuffer = await parseForm(request);
      context.log('Image parsed from request. Size:', imageBuffer.length);
      
      return { status: 200, body: 'Image received successfully.' };

    } catch (err) {
      context.log(`Upload error:`, err);
      return { status: 500, body: `Internal server error: ${err.message || err}` };
    }
  }
});
