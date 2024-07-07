import { auth } from "@/auth";
import Image from "next/image";
import { Progress } from "@/components/ui/progress";
import Greeting from "./Greeting";
import Module1 from "@/assets/svg/undraw_toy_car_-7-umw.svg";
import Module2 from "@/assets/svg/undraw_interview_re_e5jn.svg";
import Module3 from "@/assets/svg/undraw_make_it_rain_re_w9pc.svg";
import Module4 from "@/assets/svg/undraw_savings_re_eq4w.svg";
import Module5 from "@/assets/svg/undraw_credit_card_payments_re_qboh.svg";
import Module6 from "@/assets/svg/undraw_moving_forward_re_rs8p.svg";
import { FaPlay, FaFilter } from "react-icons/fa";
import { IoGrid, IoList } from "react-icons/io5";
import { Button } from "@/components/ui/button";
import { setTitle } from "@/lib/helpers";
import { Metadata } from "next";

export const metadata: Metadata = setTitle("Dashboard");

export default async function Dashboard() {
  const session = await auth();
  const modules = [
    {
      id: 1,
      name: "Freeloading",
      image: Module1,
      path: "/modules/1",
      chapterCount: 2,
      topicCount: 2,
      tags: ["money", "estimating"],
    },
    {
      id: 2,
      name: "Getting a Bag",
      image: Module2,
      path: "/modules/2",
      chapterCount: 2,
      topicCount: 6,
      tags: [
        "jobs",
        "money",
        "banking",
        "budgeting",
        "bills",
        "expenses",
        "spreadsheets",
      ],
    },
    {
      id: 3,
      name: "Life and Lemons",
      image: Module3,
      path: "/modules/3",
      chapterCount: 3,
      topicCount: 5,
      tags: [
        "word problems",
        "percents",
        "tax",
        "discount",
        "tipping",
        "unit rates",
        "money",
      ],
    },
    {
      id: 4,
      name: "Smart Money",
      image: Module4,
      path: "/modules/4",
      chapterCount: 2,
      topicCount: 3,
      tags: ["savings", "interest", "linear programming"],
    },
    {
      id: 5,
      name: "Adulting",
      image: Module5,
      path: "/modules/5",
      chapterCount: 1,
      topicCount: 2,
      tags: ["credit", "credit cards", "credit reports"],
    },
    {
      id: 6,
      name: "Addtional Practice",
      image: Module6,
      path: "/modules/6",
      chapterCount: 0,
      topicCount: 0,
      tags: [],
    },
  ];

  return (
    <div className="page-container">
      {/* {JSON.stringify(session)} */}
      <div className="flex flex-col lg:flex-row justify-between">
        <Greeting name={session?.user?.name?.split(" ")[0]} />
        <div className="flex gap-3">
          <Button variant="outline" className="rounded-lg h-10 w-10">
            <IoGrid />
          </Button>

          <Button variant="outline" className="rounded-lg h-10 w-10">
            <IoList />
          </Button>

          <Button variant="outline" className="rounded-lg h-10 w-10">
            <FaFilter />
          </Button>
        </div>
      </div>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-10">
        {modules.map((module) => (
          <div key={module.id} className="card">
            <Image
              src={module.image}
              alt={module.name}
              className="w-full h-40 object-contain p-3 border-b"
            />
            <div className="m-3">
              <span className="block text-lg font-bold">
                Module {module.id}: {module.name}
              </span>
              {
                <span
                  className={`text-gray-500 ${
                    module.chapterCount === 0 && module.topicCount === 0
                      ? "hidden"
                      : "block"
                  }`}
                >
                  {`${module.chapterCount} chapter${
                    module.chapterCount === 1 ? "" : "s"
                  }`}{" "}
                  |{" "}
                  {`${module.topicCount} topic${
                    module.topicCount === 1 ? "" : "s"
                  }`}
                </span>
              }

              <Progress value={31} className="h-2" />
              <p>31% completed</p>
            </div>
            <div className="badge">
              <FaPlay />
              <span>Start</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
