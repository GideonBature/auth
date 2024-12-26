/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import M from 'backblaze-b2';
import path from 'path';
import { TFileSchema } from '../middlewares/fileUpload';
import { configs } from './env.configs';

const b2 = new M({
    applicationKeyId: configs.M_KEY_ID as string,
    applicationKey: configs.M_APP_KEY as string,
});

export async function backBlazeSingle(file: TFileSchema): Promise<string> {
    await b2.authorize();

    // Read the file data into a Buffer
    const fileData = file.buffer;
    // const fileData = fs.readFileSync(file.path);

    const fileExt = path.extname(file.originalname);
    const fileFirstName = `${file.originalname
        .replace(fileExt, '')
        .toLowerCase()
        .split(' ')
        .join('-')}-${Date.now()}`;

    const fileName = `${file.fieldname}-${fileFirstName}${fileExt}`;

    // Set the file name and MIME type
    // const fileName = file.filename;
    const mimeType = file.mimetype;

    // Get an upload URL and authorization token from Backblaze M
    const { data } = await b2.getUploadUrl({
        bucketId: configs.M_BUCKET_ID as string,
    });
    // console.log(data);

    const { uploadUrl } = data;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const uploadAuthToken = data.authorizationToken;

    // Upload the file to Backblaze M using the upload URL and authorization token
    const response = await b2.uploadFile({
        uploadUrl,
        uploadAuthToken,
        fileName,
        data: fileData,
        mime: mimeType,
    });

    if (response.status === 200) {
        const downloadUrl = `${configs.M_DOWNLOAD_PREFIX}/${fileName}`;

        return downloadUrl;
    }
    return 'bad_url';

    // Get the download URL for the uploaded file
}
