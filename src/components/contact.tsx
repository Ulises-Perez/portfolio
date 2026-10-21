import { CopyButton } from "@/components/copy-button";
import { Cta } from "@/components/cta";
import { site } from "@/data/site.config";
import { profile } from "@/lib/github";

type Channel = {
  key: string;
  label: string;
  value: string;
  action: string;
  href?: string;
  external?: boolean;
  copyable?: boolean;
};

/**
 * Every way to start a conversation: GitHub, email and Discord. A Discord
 * username has no resolvable link on its own, so the handle is shown with a
 * copy action unless an invite URL is configured.
 */
export function Contact() {
  const channels: Channel[] = [
    {
      key: "github",
      label: "github",
      value: `github.com/${site.owner}`,
      action: "open profile",
      href: site.contact.github,
      external: true,
    },
    {
      key: "email",
      label: "email",
      value: site.contact.email,
      action: "write me",
      href: `mailto:${site.contact.email}`,
    },
    {
      key: "discord",
      label: "discord",
      value: site.contact.discord,
      action: "copy handle",
      copyable: true,
      ...(site.contact.discordUrl
        ? { href: site.contact.discordUrl, external: true }
        : {}),
    },
  ];

  return (
    <section id="contact" className="border-b border-rule-strong">
      <div className="grid grid-cols-4 md:grid-cols-12">
        <div className="col-span-4 border-x border-rule-strong pb-0 md:col-span-10 md:col-start-2 md:pt-40">
          <div className="grid grid-cols-4 border-b border-rule-strong md:grid-cols-10">
            <div className="col-span-4 p-3 md:col-span-10 md:p-4">
              <p className="eyebrow mb-2 md:mb-3">got something in mind</p>
              <h2 className="display text-5xl md:text-7xl lg:text-8xl">
                want to chat?
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-4 border-b border-rule-strong md:grid-cols-10">
            <div className="col-span-4 p-3 py-10 md:col-span-5 md:p-4 md:py-16">
              <p className="max-w-[42ch] text-lg leading-relaxed md:text-xl">
                {site.roles.length}&nbsp;disciplines, one inbox. Tell me what
                you are building and I will tell you honestly whether I am the
                right person for it.
              </p>
            </div>
            <div className="col-span-4 border-l border-rule-strong p-3 md:col-span-5 md:p-4">
              <p className="eyebrow">currently</p>
              <p className="mt-2 max-w-[40ch] text-lg leading-relaxed">
                Open to remote work, freelance projects and anything with a real
                problem to solve.
              </p>
              <p className="eyebrow mt-8">based in</p>
              <p className="mt-2 text-lg">
                {profile.location || "Remote · worldwide"}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3">
            {channels.map((channel) => (
              <div
                key={channel.key}
                className="flex flex-col justify-between gap-6 border-b border-rule-strong p-3 pb-8 last:border-b-0 sm:border-b-0 sm:border-r sm:last:border-r-0 md:p-4 md:pb-10"
              >
                <p className="eyebrow">{channel.label}</p>
                <div>
                  <p className="display text-xl break-words md:text-3xl">
                    <span translate="no">{channel.value}</span>
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {channel.href ? (
                      <Cta
                        href={channel.href}
                        label={
                          channel.key === "discord" ? "open discord" : channel.action
                        }
                        external={channel.external}
                        className="text-base"
                      />
                    ) : null}
                    {channel.copyable ? (
                      <CopyButton
                        value={channel.value}
                        label={channel.action}
                        className="text-base"
                      />
                    ) : null}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
