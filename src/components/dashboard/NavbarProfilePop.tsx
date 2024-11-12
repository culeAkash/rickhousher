import { Popover, PopoverContent } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { PopoverTrigger } from "@radix-ui/react-popover";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { User } from "lucide-react";
import LogoutButton from "./logout-button";
import NavPopLink from "./navbar-popover-link";
const NavbarProfilePop = async ({ user }) => {
  return (
    <Popover>
      <PopoverTrigger asChild className="cursor-pointer">
        <Avatar>
          <AvatarImage src={`${user?.image}`} alt={user?.username} />
          <AvatarFallback delayMs={100}>
            <User />
          </AvatarFallback>
        </Avatar>
      </PopoverTrigger>
      <PopoverContent className="w-fit h-fit mr-2 px-5">
        <div className="flex flex-col mb-3">
          <p className="text-semibold text-md">{user?.username ?? "User"}</p>
          <p className="text-muted-foreground text-sm">{user?.email}</p>
        </div>
        <Separator />
        <NavPopLink label="Profile" link="/home/settings/profile" />
        <NavPopLink label="Pricing" link="/home/settings/pricing" />
        <Separator />
        <LogoutButton />
      </PopoverContent>
    </Popover>
  );
};

export default NavbarProfilePop;
