const generateAvatar = async (seed: string): Promise<string> => {
  const { createAvatar } = await import("@dicebear/core");
  const { lorelei } = await import("@dicebear/collection");

  const avatar = createAvatar(lorelei, {
    seed: seed,
  });

  return avatar.toDataUri();
};

export default generateAvatar;
