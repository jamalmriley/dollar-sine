export const bannerMessages: {
  header: string;
  text: string;
  publishDate: Date;
  buttonText?: string;
  buttonHref?: string;
}[] = [
  {
    header: "Example Header",
    text: "This is a test message set to display at 4:00 PM!",
    publishDate: new Date(2024, 10, 19, 16, 0, 0, 0),
  },
  {
    header: "Hello, World! 👋🏿",
    text: "This is a test message set to display at 5:00 PM!",
    publishDate: new Date(2024, 10, 19, 17, 0, 0, 0),
  },
  {
    header: "Hello, World!! 👋🏿",
    text: "This is a test message set to display on Thu, Nov 21 at 2:54 AM!",
    publishDate: new Date(2024, 10, 21, 2, 54, 0, 0),
  },
  {
    header: "banner:header-1",
    text: "banner:message-1",
    publishDate: new Date(2024, 10, 21, 3, 0, 0, 0),
    buttonText: "banner:button-text-1",
    buttonHref: "/onboarding",
  },
];
