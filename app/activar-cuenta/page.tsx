import { Suspense } from "react";
import ActivarCuentaForm from "./ActivarCuentaForm";

export default function ActivarCuentaPage() {
  return (
    <Suspense fallback={null}>
      <ActivarCuentaForm />
    </Suspense>
  );
}