import clsx from "clsx";
import { map, range } from "lodash";
import React, { FC, memo } from "react";

type Props = {
  count?: number;
  type?: "line" | "circle";
  className?: string;
  boxSize?: number | string;
  height?: number | string;
  width?: number | string;
};

const Skeleton: FC<Props> = ({
  count = 1,
  type = "line",
  className,
  boxSize = 40,
  height = 25,
  width,
}) => {
  if (count === 1 && type === "line") {
    return (
      <div
        style={{
          height,
          width: width || "100%",
        }}
        className={clsx("flex animate-pulse rounded bg-gray-300", className)}
      />
    );
  }
  if (count === 1 && type === "circle")
    return (
      <div
        style={{
          height: boxSize,
          width: boxSize,
        }}
        className={clsx(
          "flex animate-pulse  rounded-full bg-gray-300",
          className
        )}
      />
    );
  if (count > 1 && type === "line")
    return (
      <div className="flex animate-pulse flex-col space-y-1">
        {map(range(count - 1), (number: number) => (
          <div
            key={number}
            style={{
              height,
              width: width || "100%",
            }}
            className={clsx(
              "flex animate-pulse rounded bg-gray-300",
              className
            )}
          />
        ))}
        <div
          style={{
            height,
            width: width || "50%",
          }}
          className={clsx("flex animate-pulse rounded bg-gray-300", className)}
        />
      </div>
    );
  if (count > 1 && type === "circle")
    return (
      <div className="flex w-full animate-pulse flex-col ">
        {map(range(count), (number: number) => (
          <div
            key={number}
            style={{
              height: boxSize,
              width: boxSize,
            }}
            className={clsx(
              "flex animate-pulse  rounded-full bg-gray-300",
              className
            )}
          />
        ))}
      </div>
    );
  return null;
};

export default memo(Skeleton);
