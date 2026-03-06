import dotenv from 'dotenv'
import { Resend } from 'resend'

dotenv.config()

const resend = new Resend(process.env.RESEND_API_KEY)

const transporter = {
  async sendMail({ to, subject, html, from }) {
    const fromAddress = from || `"CyberMapp" <${process.env.MAIL_USER}>`

    const { error } = await resend.emails.send({
      from: fromAddress,
      to,
      subject,
      html,
    })

    if (error) {
      throw new Error(error.message || 'Erreur envoi email Resend')
    }
  },
}

export default transporter