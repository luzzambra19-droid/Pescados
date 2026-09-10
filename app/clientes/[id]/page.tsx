import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { EditarClienteForm } from "./EditarClienteForm";

export default async function EditarClientePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: cliente } = await supabase
    .from("clientes")
    .select("*")
    .eq("id", id)
    .single();

  if (!cliente) notFound();

  return <EditarClienteForm cliente={cliente} />;
}
