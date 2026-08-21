import { site } from "@/lib/site";

const BRAND = {
  color: "#37b54a", // accent-500 — matches the site's primary CTA buttons
  headerText: "#ffffff",
  title: "Chat with us",
  position: "right" as const, // "left" | "right"
  font: "var(--font-montserrat), ui-sans-serif, system-ui, sans-serif",
};

export default function Clarion() {
  const { siteKey, api } = site.widgets.clarion;
  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `:root{
  --clarion-chat-color: ${BRAND.color};
  --clarion-chat-header-text: ${BRAND.headerText};
  --clarion-chat-font: ${BRAND.font};
  --clarion-chat-position: ${BRAND.position};
}`,
        }}
      />
      <script
        src="https://www.clarionlabs.ai/widget.v1.js"
        async
        data-site-key={siteKey}
        data-api={api}
        data-color={BRAND.color}
        data-header-text={BRAND.headerText}
        data-title={BRAND.title}
        data-position={BRAND.position}
        data-font={BRAND.font}
      />
      {/*
        Form capture. Inert on this site by design, and it must stay that way:
        the script only auto-wires forms carrying data-clarion-form, and ours
        carry data-intent instead. components/LeadForm.tsx builds and posts its
        own body so that attribution survives a second pageview.

        NEVER add data-clarion-form to those forms. The script does not check
        defaultPrevented, so it would fire its own POST alongside LeadForm's and
        every lead would reach Clarion twice.

        Kept loaded only so the vendor still sees the integration installed; it
        can be dropped outright if Clarion confirms that signal is not needed.
      */}
      <script
        src="https://www.clarionlabs.ai/forms-capture.v1.js"
        async
        data-site-key={siteKey}
        data-api={api}
      />
    </>
  );
}
