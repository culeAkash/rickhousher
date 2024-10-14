import { db } from "@/db";
import { MAX_FREE_USAGE_COUNTS } from "@/constants";
import { getServerSession } from "next-auth";
import { AuthOptions } from "@/app/api/auth/[...nextauth]/options";

export const increaseApiLimit = async () => {
  const session = await getServerSession(AuthOptions);

  if (!session || !session?.user || !session.user.id) {
    return;
  }

  const userId = session.user.id;

  const userApiLimit = await db.userApiLimit.findUnique({
    where: {
      userId: userId,
    },
  });

  if (userApiLimit) {
    await db.userApiLimit.update({
      where: { userId: userId },
      data: {
        count: userApiLimit.count + 1,
      },
    });
  } else {
    await db.userApiLimit.create({
      data: {
        userId: userId,
      },
    });
  }
};

export const checkApiLimit = async () => {
  const session = await getServerSession(AuthOptions);

  if (!session || !session.user || !session.user.id) {
    return false;
  }

  const userId = session.user.id;

  const userApiLimit = await db.userApiLimit.findUnique({
    where: {
      userId,
    },
  });

  console.log(userApiLimit);

  if (!userApiLimit || userApiLimit.count <= MAX_FREE_USAGE_COUNTS) return true;

  return false;
};

export const getApiLimitCount = async () => {
  const session = await getServerSession(AuthOptions);

  if (!session || !session.user || !session.user.id) {
    return 0;
  }

  const userApiLimit = await db.userApiLimit.findUnique({
    where: {
      userId: session.user.id,
    },
  });

  return userApiLimit?.count;
};
