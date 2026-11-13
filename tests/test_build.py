import importlib.util
from pathlib import Path
import tempfile
import unittest

spec = importlib.util.spec_from_file_location('build', Path(__file__).parents[1] / 'tools' / 'build.py')
build = importlib.util.module_from_spec(spec)
spec.loader.exec_module(build)


class BuildTests(unittest.TestCase):
    def test_translation_keeps_selectors_and_keys(self):
        original = '<button data-act="deploy">Deploy</button><kbd>Space</kbd><span>Settings</span>'
        result = build.translate(original)
        self.assertIn('>开始行动<', result)
        self.assertIn('>设置<', result)
        self.assertIn('data-act="deploy"', result)
        self.assertIn('<kbd>Space</kbd>', result)

    def test_escaped_dialogue_translates(self):
        self.assertIn('鼠标已锁定', build.translate('const hint="Mouse captured \\u2014 Esc releases it";'))

    def test_escaped_catalog_key_matches_decoded_literal(self):
        original = r'const note="The port\u2019s security net has gone feral. Cut its three uplinks. Reach the boat.";'
        self.assertIn('港区安防系统已经失控', build.translate(original))

    def test_output_never_overwrites_source(self):
        with tempfile.TemporaryDirectory() as directory:
            source = Path(directory) / 'original.html'
            source.write_text('source', encoding='utf-8')
            with self.assertRaises(ValueError):
                build.write_output(source, source, 'changed')
            self.assertEqual(source.read_text(), 'source')

    def test_existing_output_requires_force(self):
        with tempfile.TemporaryDirectory() as directory:
            source, output = Path(directory)/'a.html', Path(directory)/'b.html'
            source.write_text('a'); output.write_text('keep')
            with self.assertRaises(FileExistsError):
                build.write_output(source, output, 'changed')
            self.assertEqual(output.read_text(), 'keep')

    def test_rejects_unrecognized_document(self):
        with self.assertRaises(ValueError):
            build.transform('<html>unrelated</html>')

    def test_refuses_second_application(self):
        with self.assertRaises(ValueError):
            build.transform(build.MARKER)

    def test_cache_validation_rejects_incorrect_pixel_count(self):
        import base64, zlib
        cache = {'paint': {kind: {'size': 4, 'data': base64.b64encode(zlib.compress(b'bad')).decode()} for kind in ['albedo','orm','normal']}}
        with self.assertRaises(ValueError):
            build.validate_cache(cache)


if __name__ == '__main__':
    unittest.main()
