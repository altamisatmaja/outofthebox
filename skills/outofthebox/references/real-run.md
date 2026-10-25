# Run the real thing

Tests check what you thought of. A real run checks what the user will meet.

## Web apps

- Open a fresh tab, not a reused one with state you forgot about. Clear the
  draft or session storage the page restores from, or you test yesterday's form.
- Walk the flow like the user: pick the date, pick the time, add the items,
  press the button. Use scripts only for repetition (pressing + twenty times),
  and then read the result back from the page.
- Take a screenshot and **look at it**. A blank frame, an empty skeleton, a
  button that greys out for no reason are failures.
- Try the other actor in the same browser: the owner opening the friend's
  link, the signed in user opening a guest link.
- Try a phone width.
- Do not trigger browser dialogs (alert, confirm); they freeze automation.

## APIs

- Hit the endpoint with curl against the running server, with and without a
  token, and read the body, not just the status.
- Ask for the record afterwards and check the stored state.

## Payments and other outside services

- Use the provider's test mode or a local webhook simulation, never real money.
- Say clearly which one you used: "settled through a local webhook, no real
  QR was scanned".

## Clean up and tell

- Revoke test tokens, close the tabs you opened, delete or mark test rows.
- Say what local data you created or repaired, and that production was not touched.

## CLIs and jobs

- Run the command a user would type, with a representative input, and check
  the exit code and the output, not only that it started.
- Run it twice: a job that is not idempotent shows itself on the second run.

## Mobile and devices

- Run on a simulator or a device, not only in unit tests. Say which.
- Try airplane mode, a denied permission, and the app killed in the
  background.

## Documents and processes

- Follow the document or process as a newcomer would, step by step, without
  filling gaps from what you already know. Every gap is a finding.
- Recompute every number and open every link.
