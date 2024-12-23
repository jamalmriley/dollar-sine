import { SquareLogo } from "@/components/Logo";
import { useUser } from "@clerk/nextjs";
import { FaMoneyBillWave } from "react-icons/fa";
import { LiaMoneyBillWaveSolid } from "react-icons/lia";

export default function UserRewardsCard() {
  const { isLoaded, user } = useUser();
  if (!isLoaded || !user) return null;
  return (
    <div className="w-full flex flex-col aspect-[3.375/2.125] bg-primary-foreground select-none overflow-hidden">
      {/* Header */}
      <div className="w-full flex justify-between items-center bg-selective-yellow-400 px-5 py-1">
        <SquareLogo />
        <span className="text-lg font-bold">Rewards Card</span>
        <div className="flex flex-col items-center">
          <span className="text-xs font-bold">0</span>
          <span className="text-xs uppercase">points</span>
        </div>
      </div>

      {/* Icons and User Info */}
      <div className="w-full h-full flex flex-col justify-between items-center px-5 py-3">
        {/* Icons */}
        <div className="w-5/6 flex flex-col gap-3">
          {/* First Row */}
          <div className="w-full flex justify-between">
            {Array(5)
              .fill(0)
              .map((_, i) => (
                <div
                  key={i}
                  className="size-8 min-w-8 min-h-8 flex justify-center items-center rounded-full border hover:bg-selective-yellow-50 hover:scale-110 transition ease-in-out duration-200"
                >
                  <LiaMoneyBillWaveSolid className="size-full p-1.5" />
                </div>
              ))}
          </div>
          {/* Second Row */}
          <div className="w-full flex justify-between">
            {Array(5)
              .fill(0)
              .map((_, i) => (
                <div
                  key={i}
                  className="size-8 min-w-8 min-h-8 flex justify-center items-center rounded-full border hover:bg-selective-yellow-50 hover:scale-110 transition ease-in-out duration-200"
                >
                  <LiaMoneyBillWaveSolid className="size-full p-1.5" />
                </div>
              ))}
          </div>
        </div>

        {/* User Info */}
        <div className="w-full flex flex-col text-left">
          <span className="text-sm font-bold">{user.fullName}</span>
          <span className="text-xs">
            <span className="font-bold">Loyalty ID: </span>
            {user.id.slice(5)}
          </span>
        </div>
      </div>

      <div className="w-full h-5 bg-selective-yellow-400" />
    </div>
  );
}
