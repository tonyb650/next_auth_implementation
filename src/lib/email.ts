import {Resend} from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export const sendVerificationEmail = async (email: string, token: string) => {

  const confirmLink = `http://localhost:3000/auth/new-verification?token=${token}`

  await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: "Verify your email for Auth MasterClass now",
    
    html: `<p>Verify email by clicking this link: <a href=${confirmLink}>link</a></p>`
  })

}