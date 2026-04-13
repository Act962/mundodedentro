"use client";
import {
  BookOpen,
  Image,
  Info,
  LayoutDashboard,
  LogOut,
  Phone,
  Search,
  Settings,
  Sparkles,
  Star,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Painel", href: "/admin", icon: LayoutDashboard, exact: true },
  { label: "Geral", href: "/admin/general", icon: Settings },
  { label: "Hero", href: "/admin/hero", icon: Sparkles },
  { label: "Sobre", href: "/admin/about", icon: Info },
  { label: "Serviços", href: "/admin/services", icon: BookOpen },
  { label: "Galeria", href: "/admin/gallery", icon: Image },
  { label: "Equipe", href: "/admin/team", icon: Users },
  { label: "Depoimentos", href: "/admin/testimonials", icon: Star },
  { label: "Contato", href: "/admin/contact", icon: Phone },
  { label: "SEO", href: "/admin/seo", icon: Search },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    toast.success("Sessão encerrada.");
    router.push("/admin/login");
  }

  return (
    <aside className="flex w-56 shrink-0 flex-col border-r bg-background">
      <div className="flex h-14 items-center border-b px-4">
        <span className="text-sm font-semibold">Mundo de Dentro</span>
      </div>

      <nav className="flex flex-1 flex-col gap-0.5 p-2">
        {navItems.map((item) => {
          const active = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-colors",
                active
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <item.icon className="size-4 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t p-2">
        <Button
          variant="ghost"
          className="w-full justify-start gap-2.5 text-sm text-muted-foreground"
          onClick={handleLogout}
        >
          <LogOut className="size-4 shrink-0" />
          Sair
        </Button>
      </div>
    </aside>
  );
}
