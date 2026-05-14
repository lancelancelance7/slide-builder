import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";

const PROMPT_MAX = 1200;

type NewDeckBriefFormProps = {
  title: string;
  prompt: string;
  onTitleChange: (v: string) => void;
  onPromptChange: (v: string) => void;
};

export function NewDeckBriefForm(props: NewDeckBriefFormProps) {
  return (
    <div>
      <Label htmlFor="deck-title" className="sr-only">
        Deck title
      </Label>
      <Input
        id="deck-title"
        placeholder="Deck title"
        value={props.title}
        maxLength={200}
        aria-invalid={props.title.trim().length === 0}
        className="mb-4 border-transparent bg-transparent px-0 shadow-none placeholder:text-muted-foreground"
        onChange={(e) => props.onTitleChange(e.target.value)}
      />
      <Label htmlFor="deck-brief" className="sr-only">
        Deck brief
      </Label>
      <Textarea
        id="deck-brief"
        placeholder="Audience, bullets, timeline, asks — explain what you want the deck to accomplish."
        value={props.prompt}
        maxLength={PROMPT_MAX}
        aria-invalid={props.prompt.trim().length === 0}
        className="min-h-[140px] border-transparent px-0 py-1 shadow-none resize-y placeholder:text-muted-foreground"
        onChange={(e) => props.onPromptChange(e.target.value)}
      />
    </div>
  );
}

export { PROMPT_MAX };
