import nodemailer from 'nodemailer';
import { configs } from '../configs/env.configs';

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: configs.senderEmail,
        pass: configs.senderPass,
    },
});

export default transporter;
