import { RegisterForm } from "@/features/auth/register-form";

export const metadata = { title: "Регистрация" };

export default function RegisterPage() {
  return (
    <section className="container-site grid min-h-[calc(100vh-65px-210px)] lg:grid-cols-2">
      <div className="flex flex-col justify-between border-r border-border py-16 pr-8">
        <p className="text-xs uppercase tracking-[0.3em] text-muted">№ 014 / Новый клиент</p>
        <h1 className="font-display text-[clamp(4rem,10vw,10rem)] leading-[0.85] whitespace-pre-line">
          {"ПОД\nКОЖУ\nНАВ-\nСЕГДА."}
        </h1>
        <p className="text-xs text-muted">Сохрани избранные эскизы / Запишись онлайн</p>
      </div>
      <div className="flex items-center justify-center py-16">
        <RegisterForm />
      </div>
    </section>
  );
}
