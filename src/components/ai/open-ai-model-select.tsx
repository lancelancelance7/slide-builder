"use client";

import type { OpenAiChatModel } from "~/lib/openai-chat-model";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

type OpenAiModelSelectProps = {
  value: OpenAiChatModel;
  onValueChange: (value: OpenAiChatModel) => void;
  disabled?: boolean;
  id?: string;
};

export function OpenAiModelSelect(props: OpenAiModelSelectProps) {
  return (
    <Select
      value={props.value}
      onValueChange={(v) => props.onValueChange(v as OpenAiChatModel)}
      disabled={props.disabled}
    >
      <SelectTrigger id={props.id} size="sm" className="min-w-36">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="gpt-4o">GPT-4o</SelectItem>
        <SelectItem value="gpt-5.5">GPT-5.5</SelectItem>
      </SelectContent>
    </Select>
  );
}
