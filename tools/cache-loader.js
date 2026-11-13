// Inserted into the compatible material factory only in a locally generated HTML.
let cachedSets = new Map;
if (!t.tex && i.quality.name !== "ultra") {
  await Promise.all(Object.entries(SL_BAKED_TEXTURES).map(async ([key, maps]) => {
    if (!c3[key]) throw new Error("Texture set does not belong to this game build");
    const def = c3[key];
    const tile = Array.isArray(def.tile) ? def.tile : [def.tile, def.tile];
    const set = {key, tile, targets: []};
    await Promise.all(Object.entries(maps).map(async ([kind, packed]) => {
      const compressed = Uint8Array.from(atob(packed.data), c => c.charCodeAt(0));
      const stream = new Blob([compressed]).stream().pipeThrough(new DecompressionStream("deflate"));
      const pixels = new Uint8Array(await new Response(stream).arrayBuffer());
      const texture = new ui(pixels, packed.size, packed.size, _n, yi);
      texture.wrapS = texture.wrapT = Is;
      texture.minFilter = Ln;
      texture.magFilter = Zt;
      texture.generateMipmaps = true;
      texture.needsUpdate = true;
      texture.anisotropy = o;
      texture.colorSpace = hi; // Samples were baked in linear color space.
      texture.repeat.set(1 / tile[0], 1 / tile[1]);
      texture.name = "sl_" + key;
      set[kind] = texture;
      set.size = packed.size;
    }));
    cachedSets.set(key, set);
  }));
}
