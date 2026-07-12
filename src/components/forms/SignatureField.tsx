"use client";

import { useRef } from "react";
import SignatureCanvas from "react-signature-canvas";
import { Eraser } from "lucide-react";

interface Props {
  onChange?: (value: string) => void;
}

export default function SignatureField({ onChange }: Props) {
  const signatureRef = useRef<InstanceType<typeof SignatureCanvas> | null>(null);

  const clear = () => {
    signatureRef.current?.clear();
    onChange?.("");
  };

  const save = () => {
  if (!signatureRef.current || signatureRef.current.isEmpty()) return;

  const image = signatureRef.current
    .getTrimmedCanvas()
    .toDataURL("image/png");

  onChange?.(image);
};

  return (
    <div className="rounded-2xl border-2 border-gray-100 bg-white p-5">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm font-semibold text-primary">
          امضای دیجیتال
        </span>

        <button
          type="button"
          onClick={clear}
          className="flex items-center gap-1 text-[11px] text-gray-400 hover:text-danger"
        >
          <Eraser className="h-3.5 w-3.5" />
          پاک کردن
        </button>
      </div>

      <p className="mb-3 text-xs text-gray-400">
        با ماوس یا لمس صفحه داخل کادر امضا کنید.
      </p>

      <div className="overflow-hidden rounded-xl border border-dashed border-gray-200 bg-gray-50">
        <SignatureCanvas
          ref={signatureRef}
          penColor="#4338CA"
          onEnd={save}
          canvasProps={{
            className: "w-full h-40",
          }}
        />
      </div>

      <div className="mt-2 text-center text-[10px] text-gray-300">
        امضای رضایت‌نامه
      </div>
    </div>
  );
}