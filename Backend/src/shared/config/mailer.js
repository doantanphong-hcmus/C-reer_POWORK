/**
 * Nodemailer Transporter — dùng chung cho toàn app
 * Đặt ở shared/ vì gửi email không thuộc riêng 1 domain
 */
import nodemailer from 'nodemailer'
import { config } from './index.js'

const transporter = nodemailer.createTransport({
  host: config.mail.host,
  port: config.mail.port,
  secure: config.mail.port === 465,
  auth: {
    user: config.mail.user,
    pass: config.mail.pass,
  },
})

export default transporter
