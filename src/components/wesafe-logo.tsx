import Image from "next/image";

type WesafeLogoProps = {
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
};

export function WesafeLogo({ width = 116, height = 39, className = "h-8 w-auto", priority }: WesafeLogoProps) {
  return (
    <>
      <Image
        src="/wesafe-grad-inline-000.svg"
        alt="WeSafe"
        width={width}
        height={height}
        priority={priority}
        className={`dark:hidden ${className}`}
      />
      <Image
        src="/wesafe-grad-inline-fff.svg"
        alt="WeSafe"
        width={width}
        height={height}
        priority={priority}
        className={`hidden dark:block ${className}`}
      />
    </>
  );
}
