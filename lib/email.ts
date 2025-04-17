import { EmailConfig } from "next-auth/providers/email";
import nodemailer from "nodemailer";

import { env } from "@/env.mjs";
import { siteConfig } from "@/config/site";

import { getUserByEmail } from "./user";
import { absoluteUrl } from "./utils";

// Configuração do transporte do Nodemailer
const transporter = nodemailer.createTransport({
  host: env.EMAIL_SERVER_HOST,
  port: parseInt(env.EMAIL_SERVER_PORT || "587"),
  auth: {
    user: env.EMAIL_SERVER_USER,
    pass: env.EMAIL_SERVER_PASSWORD,
  },
  secure: env.EMAIL_SERVER_PORT === "465",
});

interface PasswordResetEmailProps {
  email: string;
  name: string;
  resetToken: string;
}

export const sendPasswordResetEmail = async ({
  email,
  name,
  resetToken,
}: PasswordResetEmailProps) => {
  const resetUrl = absoluteUrl(`/reset-password/${resetToken}`);

  try {
    // HTML do email
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Redefinição de senha para ${siteConfig.name}</h2>
        <p>Olá ${name},</p>
        <p>Recebemos uma solicitação para redefinir a senha da sua conta no ${siteConfig.name}. Clique no botão abaixo para criar uma nova senha.</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" style="background-color: #4CAF50; color: white; padding: 12px 20px; text-decoration: none; border-radius: 4px; font-weight: bold;">Redefinir minha senha</a>
        </div>
        <p>Este link expira em 1 hora e só pode ser usado uma vez.</p>
        <p>Se você não solicitou a redefinição de senha, pode ignorar este email com segurança.</p>
        <hr style="border: 1px solid #eee; margin: 20px 0;" />
        <p style="color: #777; font-size: 12px;">© ${new Date().getFullYear()} ${siteConfig.name}. Todos os direitos reservados.</p>
      </div>
    `;

    // Texto simples do email
    const emailText = `
      Redefinição de senha para ${siteConfig.name}

      Olá ${name},

      Recebemos uma solicitação para redefinir a senha da sua conta no ${siteConfig.name}.
      Para criar uma nova senha, acesse o link abaixo:

      ${resetUrl}

      Este link expira em 1 hora e só pode ser usado uma vez.

      Se você não solicitou a redefinição de senha, pode ignorar este email com segurança.

      © ${new Date().getFullYear()} ${siteConfig.name}. Todos os direitos reservados.
    `;

    // Enviar email
    const info = await transporter.sendMail({
      from: env.EMAIL_FROM || `"${siteConfig.name}" <noreply@example.com>`,
      to: process.env.NODE_ENV === "development" ? email : email, // Mesmo em desenvolvimento, enviamos para o email real
      subject: `Redefinição de senha para ${siteConfig.name}`,
      text: emailText,
      html: emailHtml,
    });

    console.log("Email enviado:", info.messageId);

    // Retorna sucesso
    console.log("Email enviado com sucesso para:", email);

    return { success: true };
  } catch (error) {
    console.error("Erro ao enviar email de redefinição de senha:", error);
    throw new Error("Falha ao enviar email de redefinição de senha.");
  }
};

export const sendVerificationRequest: EmailConfig["sendVerificationRequest"] =
  async ({ identifier, url, provider }) => {
    const user = await getUserByEmail(identifier);
    if (!user || !user.name) return;

    // Definir o assunto do email
    const authSubject = `Link de acesso para ${siteConfig.name}`;

    try {
      // HTML do email
      const emailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Link de acesso para ${siteConfig.name}</h2>
          <p>Olá ${user.name},</p>
          <p>Clique no botão abaixo para acessar sua conta no ${siteConfig.name}.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${url}" style="background-color: #4CAF50; color: white; padding: 12px 20px; text-decoration: none; border-radius: 4px; font-weight: bold;">Acessar minha conta</a>
          </div>
          <p>Este link expira em 24 horas e só pode ser usado uma vez.</p>
          <p>Se você não solicitou este link, pode ignorar este email com segurança.</p>
          <hr style="border: 1px solid #eee; margin: 20px 0;" />
          <p style="color: #777; font-size: 12px;">© ${new Date().getFullYear()} ${siteConfig.name}. Todos os direitos reservados.</p>
        </div>
      `;

      // Texto simples do email
      const emailText = `
        Link de acesso para ${siteConfig.name}

        Olá ${user.name},

        Clique no link abaixo para acessar sua conta no ${siteConfig.name}.

        ${url}

        Este link expira em 24 horas e só pode ser usado uma vez.

        Se você não solicitou este link, pode ignorar este email com segurança.

        © ${new Date().getFullYear()} ${siteConfig.name}. Todos os direitos reservados.
      `;

      // Enviar email
      const info = await transporter.sendMail({
        from: provider.from,
        to: identifier, // Enviamos para o email real
        subject: authSubject,
        text: emailText,
        html: emailHtml,
      });

      console.log("Email de verificação enviado:", info.messageId);
      console.log("Email enviado com sucesso para:", identifier);
    } catch (error) {
      console.error("Erro ao enviar email de verificação:", error);
      throw new Error("Falha ao enviar email de verificação.");
    }
  };
