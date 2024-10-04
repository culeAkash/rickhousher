import { Popover, PopoverContent } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { PopoverTrigger } from "@radix-ui/react-popover";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import ProfileSheet from "../profile-sheet";
const NavbarProfilePop = ({ user }) => {
  console.log(user?.image);

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
      <PopoverContent className="md:w-50 h-fit mr-3 w-40">
        <div className="space-y-1">
          <p className="text-muted-foreground text-md">Hi Akash</p>
          <Separator />
          <ProfileSheet />
          <p className="font-mono pl-1 hover:border-black hover:shadow-md border-transparent border-2 rounded-sm cursor-pointer hover:bg-gray-700 hover:text-white">
            Pricing
          </p>
          <Separator />
          <Button
            variant="destructive"
            size="sm"
            className="w-full space-x-1 text-sm font-serif"
          >
            <LogOut />
            <span>Logout</span>
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default NavbarProfilePop;
