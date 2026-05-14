"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "~/components/ui/button";
import { Spinner } from "~/components/ui/spinner";
import { api } from "~/trpc/react";

export function BrandKitCreateRedirect() {
  const router = useRouter();
  const ran = useRef(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const createMutation = api.brandKit.create.useMutation({
    onSuccess: (data) => {
      router.replace(`/brand-kits/${data.id}`);
      router.refresh();
    },
    onError: (err) => {
      setErrorMessage(err.message);
    },
  });

  useEffect(() => {
    if (ran.current) {
      return;
    }
    ran.current = true;
    createMutation.mutate({});
  }, [createMutation]);

  return (
    <main className="flex grow flex-col items-center justify-center gap-6 px-10 py-24">
      {errorMessage !== null && errorMessage !== "" && (
        <>
          <p className="max-w-md text-center text-destructive t-body">
            {errorMessage}
          </p>
          <Button
            size="sm"
            type="button"
            variant="outline"
            onClick={() => {
              setErrorMessage(null);
              createMutation.mutate({});
            }}
          >
            Retry
          </Button>
        </>
      )}
      {(errorMessage === null || errorMessage === "") &&
        createMutation.isPending && <Spinner className="size-10" />}
    </main>
  );
}
