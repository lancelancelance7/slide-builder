"use client";

import type { OpenAiImageModel } from "~/lib/openai-image-model";
import { OPENAI_IMAGE_MODEL_LABEL } from "~/lib/openai-image-model";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

type OpenAiImageModelSelectProps = {
  value: OpenAiImageModel;
  onValueChange: (value: OpenAiImageModel) => void;
  disabled?: boolean;
  id?: string;
};

const IMAGE_MODELS = [
  "gpt-image-1",
  "gpt-image-1-mini",
  "dall-e-3",
  "dall-e-2",
] as const satisfies readonly OpenAiImageModel[];

export function OpenAiImageModelSelect(props: OpenAiImageModelSelectProps) {
  return (
    <Select
      value={props.value}
      onValueChange={(v) => props.onValueChange(v as OpenAiImageModel)}
      disabled={props.disabled}
    >
      <SelectTrigger id={props.id} size="sm" className="min-w-0 flex-1">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {IMAGE_MODELS.map((model) => (
          <SelectItem key={model} value={model}>
            {OPENAI_IMAGE_MODEL_LABEL[model]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
