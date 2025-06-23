import { WelcomeEmail } from "@/components/Emails";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST() {
  try {
    const { data, error } = await resend.emails.send({
      from: "Jamal from Dollar Sine <jamal@dollarsine.app>",
      to: ["jamal@dollarsine.app"],
      subject: "Welcome to Dollar Sine!",
      react: WelcomeEmail({ firstName: "Jamal" }),
      tags: [
        {
          name: "category",
          value: "confirm_email",
        },
      ],
    });

    if (error) {
      return Response.json({ error }, { status: 500 });
    }

    return Response.json(data);
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}
