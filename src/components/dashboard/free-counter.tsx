"use client";
import { MAX_FREE_USAGE_COUNTS } from "@/constants";
import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "../ui/button";
import { Zap } from "lucide-react";
import { useProModal } from "@/hooks/use-pro-modal";

const FreeCounter = ({ apiLimitCount = 0 }: { apiLimitCount: number }) => {
  const proModal = useProModal();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="px-3">
      <Card className="bg-white/10 border-0">
        <CardContent className="py-6">
          <div className="text-center text-sm text-white mb-4 space-y-2">
            <p>
              {apiLimitCount}/{MAX_FREE_USAGE_COUNTS} Free generations
            </p>
            <Progress
              className="h-3"
              value={(apiLimitCount / MAX_FREE_USAGE_COUNTS) * 100}
            />
          </div>
          <Button
            type="button"
            variant={"premium"}
            className="w-full"
            onClick={proModal.onOpen}
          >
            Updrade
            <Zap className="w-4 h-4 ml-2 fill-white" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default FreeCounter;