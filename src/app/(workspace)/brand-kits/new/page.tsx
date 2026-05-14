import { BrandKitCreateRedirect } from "~/components/brand-kit/brand-kit-create-redirect";
import { HydrateClient } from "~/trpc/server";

export default function NewBrandKitPage() {
  return (
    <HydrateClient>
      <BrandKitCreateRedirect />
    </HydrateClient>
  );
}
