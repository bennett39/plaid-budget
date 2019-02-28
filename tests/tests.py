from django.test import TestCase

class SampleTestCase(TestCase):
    def setUp(self):
        pass

    def test_test_runner_works(self):
        self.assertEqual(1, 1)
