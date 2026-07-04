import unittest

from clientraw import ClientRawParser, TARGETS, fetch_clientraw


class TestClientRaw(unittest.TestCase):

    """ Simple testing suite to validate that the clientraw.txt endpoint 
    is reachable and returns a non-empty payload."""

    def test_fetch_returns_non_empty_non_zero_string(self) -> None:
        payload = fetch_clientraw(TARGETS.DELFT).strip()

        self.assertTrue(payload)
        self.assertNotEqual(payload, "0")

    def test_payload_contains_start_and_end_fields(self) -> None:
        payload = fetch_clientraw(TARGETS.DELFT).strip()
        fields = payload.split()

        self.assertGreaterEqual(len(fields), 2)
        self.assertEqual(fields[0], "12345")
        self.assertTrue(
            fields[-1].endswith("!!"),
            msg=f"Expected final field to end with '!!', got: {fields[-1]}",
        )

    def test_temperature_returns_float_from_field_4(self) -> None:
        sample_payload = "12345 1 2 3 12.5 0!!"
        parser = ClientRawParser(sample_payload)

        self.assertEqual(parser.temperature(), 12.5)


if __name__ == "__main__":
    unittest.main()
