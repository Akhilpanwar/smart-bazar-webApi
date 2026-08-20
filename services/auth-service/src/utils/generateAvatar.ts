import type { Style } from "@dicebear/core";

const generateAvatar = async (seed: string): Promise<string> => {
  // Use eval to prevent TypeScript from converting import() to require()
  const { createAvatar } = await (eval('import("@dicebear/core")') as Promise<
    typeof import("@dicebear/core")
  >);
  const { lorelei } = await (eval('import("@dicebear/collection")') as Promise<{
    lorelei: Style<object>;
  }>);

  const avatar = createAvatar(lorelei, {
    seed: seed,
  });

  return avatar.toDataUri();
};

export default generateAvatar;
