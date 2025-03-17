import { SelectedCourse } from "@/types/course";
import { Response } from "@/types/general";
import Stripe from "stripe";

if (process.env.STRIPE_SECRET_KEY === undefined)
  throw new Error("STRIPE_SECRET_KEY is not defined.");
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function createPaymentIntent(
  amount: number,
  courses: SelectedCourse[] | null
): Promise<Response> {
  const invalidRes: Response = {
    status: 422,
    success: false,
    message: {
      title: "Missing required details",
      description:
        "A payment amount and course info are required to create a payment intent.",
    },
  };
  if (!amount || !courses) return invalidRes;

  const paymentIntent = await stripe.paymentIntents
    .create({
      amount,
      currency: "usd",
      automatic_payment_methods: { enabled: true },
      metadata: { courses: JSON.stringify(courses) },
    })
    .then((paymentIntent) => {
      return paymentIntent.client_secret;
    });

  return {
    status: paymentIntent ? 200 : 400,
    success: Boolean(paymentIntent),
    data: paymentIntent,
    message: {
      title: `Payment intent retrieved ${
        paymentIntent ? "successfully" : "unsuccessfully"
      }`,
      description: "",
    },
  };
}

export async function getPaymentIntent(clientSecret: string) {
  const invalidRes: Response = {
    status: 422,
    success: false,
    message: {
      title: "Missing required amount",
      description: "A client secret is required to retrieve a payment intent.",
    },
  };
  if (!clientSecret === undefined) return invalidRes;

  const paymentIntent = await stripe.paymentIntents
    .retrieve(clientSecret)
    .then((paymentIntent) => {
      return paymentIntent;
    });

  return {
    status: paymentIntent ? 200 : 400,
    success: Boolean(paymentIntent),
    data: paymentIntent,
    message: {
      title: `Payment intent retrieved ${
        paymentIntent ? "successfully" : "unsuccessfully"
      }`,
      description: "",
    },
  };
}
