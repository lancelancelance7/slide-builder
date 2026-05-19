"use client";

import { Loader2, Sparkles } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { OpenAiImageModelSelect } from "~/components/ai/open-ai-image-model-select";
import { Button } from "~/components/ui/button";
import { Textarea } from "~/components/ui/textarea";
import {
  OPENAI_IMAGE_MODEL_DEFAULT,
  persistOpenAiImageModel,
  readStoredOpenAiImageModel,
  type OpenAiImageModel,
} from "~/lib/openai-image-model";
import { api } from "~/trpc/react";

type SlideImageBriefSectionProps = {
  slideId: string;
  imagePrompt: string;
  onImagePromptChange: (value: string) => void;
  onImageGenerated: (payload: { url: string; key?: string }) => void;
  disabled?: boolean;
};

export function SlideImageBriefSection(props: SlideImageBriefSectionProps) {
  const [imageModel, setImageModel] = useState<OpenAiImageModel>(
    readStoredOpenAiImageModel,
  );

  const generateImage = api.ai.generateSlideImage.useMutation({
    onSuccess: (result) => {
      props.onImageGenerated(result);
      toast.success("Image generated — save the slide to keep it.");
    },
    onError: (error) => {
      toast.error(error.message || "Image generation failed.");
    },
  });

  const promptReady = props.imagePrompt.trim().length > 0;
  const generateDisabled =
    !!props.disabled || !promptReady || generateImage.isPending;

  return (
    <div className="flex flex-col gap-2">
      <label className="block">
        <span className="t-caption mb-1 block text-(--app-text-2)">
          Image brief
        </span>
        <Textarea
          value={props.imagePrompt}
          onChange={(e) => {
            props.onImagePromptChange(e.target.value);
          }}
          rows={6}
          className="t-caption resize-y"
          placeholder="Art direction for this slide…"
          disabled={props.disabled}
        />
      </label>
      <div className="flex flex-wrap items-center gap-2">
        <OpenAiImageModelSelect
          value={imageModel}
          onValueChange={(model) => {
            setImageModel(model);
            persistOpenAiImageModel(model);
          }}
          disabled={!!props.disabled || generateImage.isPending}
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="shrink-0 gap-1.5"
          disabled={generateDisabled}
          onClick={() => {
            generateImage.mutate({
              slideId: props.slideId,
              prompt: props.imagePrompt.trim(),
              model: imageModel ?? OPENAI_IMAGE_MODEL_DEFAULT,
            });
          }}
        >
          {generateImage.isPending && (
            <Loader2 className="size-3.5 animate-spin" aria-hidden />
          )}
          {!generateImage.isPending && (
            <Sparkles className="size-3.5" aria-hidden />
          )}
          Generate image
        </Button>
      </div>
      <p className="t-micro text-(--app-text-3)">
        Uses your brief plus the brand kit image style. Saves when you click
        Save slide on the canvas.
      </p>
    </div>
  );
}
