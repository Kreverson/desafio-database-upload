import path from 'path';
import crypt from 'crypto';

const tmpFolder = path.resolve(__dirname, '..', '..', 'tmp');


export default {
    directory: tmpFolder,
    filename: (
        req: Request,
        file: Express.Multer.File,
        callback: (error: Error | null, filename: string) => {}

    ) => {
        const fileHash = crypt.randomBytes(10).toString('HEX');
        const fileName = `${fileHash}-${file.originalname}`;

        return callback(null, fileName);
    }

}