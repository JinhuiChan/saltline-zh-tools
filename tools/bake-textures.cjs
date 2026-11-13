// Locally sample textures from a user-provided original. No game or cache is downloaded.
const fs = require('node:fs');
const path = require('node:path');
const {pathToFileURL} = require('node:url');
const {parseArgs} = require('node:util');
const {deflateSync} = require('node:zlib');
const {chromium} = require('playwright-core');

async function main() {
  const {values} = parseArgs({options: {
    input: {type: 'string'}, output: {type: 'string'},
    channel: {type: 'string', default: 'msedge'}, executable: {type: 'string'},
  }});
  if (!values.input || !values.output) throw new Error('Use --input ORIGINAL.html --output local/textures.json');
  const input = path.resolve(values.input), output = path.resolve(values.output);
  if (input === output || fs.existsSync(output)) throw new Error('Choose a new output path; files are never overwritten');
  if (!fs.readFileSync(input, 'utf8').includes('SALTLINE_POST')) throw new Error('Unrecognized input');
  const browser = await chromium.launch({headless: true,
    ...(values.executable ? {executablePath: values.executable} : {channel: values.channel})});
  try {
    const page = await browser.newPage({viewport: {width: 1280, height: 720}});
    await page.route('https://fonts.googleapis.com/**', route => route.abort());
    const url = pathToFileURL(input);
    url.search = 'q=low&tex=512&noaudio=1';
    await page.goto(url.href, {waitUntil: 'domcontentloaded', timeout: 180000});
    await page.waitForFunction(() => window.__ready || window.__fatal, {}, {timeout: 180000});
    const cache = await page.evaluate(() => {
      if (window.__fatal) throw new Error(window.__fatal);
      const game = window.__G, T = game.THREE, renderer = game.renderer;
      renderer.setAnimationLoop(null);
      const sets = {};
      game.scene.traverse(object => {
        const materials = object.material ? (Array.isArray(object.material) ? object.material : [object.material]) : [];
        for (const material of materials) {
          if (material.userData?.set) sets[material.userData.set] = {
            albedo: material.map, orm: material.roughnessMap, normal: material.normalMap,
          };
        }
      });
      if (Object.keys(sets).length !== game.mats.stats().sets) throw new Error('Incomplete material coverage');
      const scene = new T.Scene(), camera = new T.OrthographicCamera(-1, 1, 1, -1, 0, 1);
      const material = new T.ShaderMaterial({
        vertexShader: 'varying vec2 vUv; void main(){vUv=uv;gl_Position=vec4(position.xy,0.0,1.0);}',
        fragmentShader: 'uniform sampler2D map; varying vec2 vUv; void main(){gl_FragColor=texture2D(map,vUv);}',
        uniforms: {map: {value: null}}, depthTest: false, depthWrite: false,
      });
      const geometry = new T.PlaneGeometry(2, 2);
      scene.add(new T.Mesh(geometry, material));
      const result = {};
      for (const [key, maps] of Object.entries(sets)) {
        result[key] = {};
        for (const [kind, texture] of Object.entries(maps)) {
          const {width, height} = texture.image;
          if (width !== height || width > 2048) throw new Error('Unsupported texture dimensions');
          const target = new T.WebGLRenderTarget(width, height, {depthBuffer: false});
          try {
            material.uniforms.map.value = texture;
            renderer.setRenderTarget(target);
            renderer.render(scene, camera);
            const bytes = new Uint8Array(width * height * 4);
            renderer.readRenderTargetPixels(target, 0, 0, width, height, bytes);
            let binary = '';
            for (let at = 0; at < bytes.length; at += 32768) binary += String.fromCharCode(...bytes.subarray(at, at + 32768));
            result[key][kind] = {size: width, data: btoa(binary)};
          } finally { target.dispose(); }
        }
      }
      renderer.setRenderTarget(null);
      material.dispose(); geometry.dispose();
      return result;
    });
    for (const maps of Object.values(cache)) for (const map of Object.values(maps)) {
      map.data = deflateSync(Buffer.from(map.data, 'base64')).toString('base64');
    }
    fs.mkdirSync(path.dirname(output), {recursive: true});
    fs.writeFileSync(output, JSON.stringify(cache), {encoding: 'utf8', flag: 'wx'});
    console.log(`Baked ${Object.keys(cache).length} material sets locally: ${output}`);
  } finally { await browser.close(); }
}

main().catch(error => {console.error(error.message); process.exitCode = 1;});
