---
effect: foresee
schema: red before green
situation: about to fix a bug whose cause looks obvious
cues: [fix, bug, failing, flaky, reproduce, regression, broken, wrong result, off by]
evidence: untested
---
The report said refund totals were off by one cent, and the rounding call in `refund.py` looked like the culprit. He wrote a test that refunded 10.005 and asserted the cent, then ran it before changing anything. It passed. The next test, against the tax line, went red on its first run, and a one-line change in `tax.py` turned it green with `refund.py` untouched.
