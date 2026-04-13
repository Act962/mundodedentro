import { PageHeader } from "@/components/admin/PageHeader";
import { ContactForm } from "@/features/contact/components/ContactForm";

export default function ContactPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Contato"
        description="Telefone, e-mail, horário, localização e mapa."
      />
      <ContactForm />
    </div>
  );
}
