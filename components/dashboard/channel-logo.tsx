type ChannelLogoKey = "alfamart" | "aksesmu" | "indomaret";

const logoMap: Record<ChannelLogoKey, { src: string; alt: string }> = {
  alfamart: {
    src: "/channel-logos/alfamart.png",
    alt: "Logo Alfamart",
  },
  aksesmu: {
    src: "/channel-logos/aksesmu.ico",
    alt: "Logo AksesMu",
  },
  indomaret: {
    src: "/channel-logos/indomaret.png",
    alt: "Logo Indomaret",
  },
};

type ChannelLogoProps = {
  channel: ChannelLogoKey;
  className?: string;
  imageClassName?: string;
};

export function ChannelLogo({ channel, className, imageClassName }: ChannelLogoProps) {
  const logo = logoMap[channel];

  return (
    <div
      className={className ?? "flex h-10 w-10 items-center justify-center rounded-2xl border border-border/40 bg-white p-2 shadow-soft"}
    >
      <img
        src={logo.src}
        alt={logo.alt}
        className={imageClassName ?? "max-h-full max-w-full object-contain"}
      />
    </div>
  );
}
