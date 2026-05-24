import { prisma } from "@/lib/prisma";
import { updateSiteSettings } from "@/actions/admin";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default async function AdminSettingsPage() {
  const settings = await prisma.siteSettings.findUniqueOrThrow({
    where: { id: "default" },
  });

  return (
    <div>
      <h1 className="font-display text-4xl">Настройки</h1>
      <form
        action={async (fd) => {
          "use server";
          await updateSiteSettings({
            address: fd.get("address") as string,
            phone: fd.get("phone") as string,
            email: fd.get("email") as string,
            workingHours: fd.get("workingHours") as string,
            mapEmbedUrl: fd.get("mapEmbedUrl") as string,
            socialTelegram: fd.get("socialTelegram") as string,
            socialInstagram: fd.get("socialInstagram") as string,
            telegramBotToken: fd.get("telegramBotToken") as string,
            telegramChatId: fd.get("telegramChatId") as string,
          });
        }}
        className="mt-8 max-w-lg space-y-4"
      >
        {(
          [
            ["address", "Адрес", settings.address],
            ["phone", "Телефон", settings.phone],
            ["email", "Email", settings.email],
            ["workingHours", "Часы работы", settings.workingHours],
            ["mapEmbedUrl", "Карта (iframe URL)", settings.mapEmbedUrl ?? ""],
            ["socialTelegram", "Telegram URL", settings.socialTelegram ?? ""],
            ["socialInstagram", "Instagram URL", settings.socialInstagram ?? ""],
            ["telegramBotToken", "Telegram Bot Token", settings.telegramBotToken ?? ""],
            ["telegramChatId", "Telegram Chat ID", settings.telegramChatId ?? ""],
          ] as const
        ).map(([name, label, defaultValue]) => (
          <div key={name}>
            <Label>{label}</Label>
            <input
              name={name}
              defaultValue={defaultValue}
              className="mt-1 w-full border-b border-black bg-transparent py-2 text-sm"
            />
          </div>
        ))}
        <Button type="submit">Сохранить</Button>
      </form>
    </div>
  );
}
