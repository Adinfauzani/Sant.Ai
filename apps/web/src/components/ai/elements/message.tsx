"use client";

import type { ComponentProps, ReactNode } from "react";
import { Bot } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@santai/ui/avatar";
import { Bubble, BubbleContent } from "@santai/ui/bubble";
import {
  Message,
  MessageAvatar,
  MessageContent,
  MessageHeader,
} from "@santai/ui/message";

export { Message, MessageAvatar, MessageContent, MessageHeader, Bubble, BubbleContent };

export function ChatMessageRow({
  role,
  header,
  children,
  ...props
}: {
  role: "user" | "assistant";
  userInitial?: string;
  header?: ReactNode;
  children: ReactNode;
} & ComponentProps<typeof Message>) {
  const isUser = role === "user";
  return (
    <Message align={isUser ? "end" : "start"} {...props}>
      <MessageContent>
        {!isUser && header ? <MessageHeader className="px-0">{header}</MessageHeader> : null}
        {children}
      </MessageContent>
    </Message>
  );
}

export function UserBubble({ text, className }: { text: string; className?: string }) {
  return (
    <Bubble variant="tinted" className={cn("max-w-[88%] md:max-w-[78%]", className)}>
      <BubbleContent className="whitespace-pre-wrap">{text}</BubbleContent>
    </Bubble>
  );
}

export function AssistantText({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("w-full min-w-0 max-w-[42rem] break-words text-sm leading-relaxed text-text", className)}>
      {children}
    </div>
  );
}
