import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

if (process.env.STRIPE_SECRET_KEY === undefined)
  throw new Error("STRIPE_SECRET_KEY is not defined.");

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(request: NextRequest) {
  try {
    const { amount } = await request.json();
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "usd",
      automatic_payment_methods: { enabled: true },
    });
    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error(error);
    // TODO: Handle other errors (e.g. network issues, parsing errors, etc.)
    return NextResponse.json({ error }, { status: 400 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const clientSecret = searchParams.get("clientSecret") as string;
    const paymentIntent = await stripe.paymentIntents.retrieve(clientSecret);
    return NextResponse.json({ status: 200, paymentIntent });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error }, { status: 400 });
  }
}
