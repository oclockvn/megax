import { trimRight } from "@/lib/string.helper";

export default function ShortLink({
  url,
  target = "_blank",
  ...rest
}: {
  url: string;
  target?: string;
  [x: string]: any;
}) {
  const trimmed = trimRight(url, "/");
  const short = trimmed.split("/").at(-1);

  return (
    <a href={url} target={target} {...rest}>
      {short}
    </a>
  );
}
