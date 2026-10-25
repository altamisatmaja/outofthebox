---
name: outofthebox-auth
description: "Out of the Box for authentication and sessions: hunt sign up, sign in, sign out, password reset, verification, MFA, social login, tokens and sessions across devices and roles. Load with the outofthebox core for any login, account, session, token or permission change in your own product."
allowed-tools: Read Write Edit Glob Grep Bash
---
# outofthebox-auth

> Out of the Box: relentless testing for AI agents. Authentication skill.

> Part of the outofthebox system. Read together with the core
> (`skills/outofthebox/SKILL.md`). The core holds the loop, the rules
> (O-01 to O-16) and the Delivery Gate; this skill adds what to hunt for in
> this concern. It cites core rules and never renumbers them.

Scope: your own product and infrastructure, in a test or staging
environment, with written permission from whoever owns it. Never point any
of this at systems you do not own or are not authorized to assess (O-02).
Findings about secrets or exposure are reported privately, never pasted into
issues, chats or logs.

Use test accounts made for this hunt, never real users' credentials.

## Every door into an account

List them all and hunt each: sign up, sign in, social or SSO sign in, magic
link, OTP, password reset, email or phone change, account deletion, invite
acceptance, admin impersonation, API tokens. A control on one door and not
another is the classic gap.

## Questions per door

- **Identity:** the same email or phone in two accounts or two roles; case
  and whitespace differences; an unverified address that can already act.
- **Links and codes:** single use? Expire? Invalidated when a newer one is
  sent, when the password changes, after use? Tied to the account they were
  sent for?
- **Rate and lockout:** is there a limit on attempts per account and per
  source, and does the limit also cover OTP and reset codes?
- **Messages:** do sign in, reset and sign up answer the same way whether or
  not the account exists, when the product needs that?
- **Sessions:** does sign out end the session on the server? Does a password
  change or role change end other sessions? What happens to a session held
  by a deactivated or deleted user?
- **Tokens:** expiry enforced by the server; refresh tokens rotated and
  revocable; tokens never in URLs, logs or analytics.
- **Roles:** a role change takes effect on open sessions; a demoted admin
  loses admin actions immediately.
- **Devices:** two devices at once; a shared device where one person signs
  out and another signs in; the back button after sign out.

## Assert (O-15)

Assert the refusal, not only the success: the expired link refused, the old
session rejected, the field absent from the response.

## Auth checklist

- [ ] Every door listed and hunted, not only the sign in form
- [ ] Links and codes: single use, expiry, invalidation
- [ ] Sessions end on sign out, password change, role change, deactivation
- [ ] Limits on attempts cover every code, not only passwords
- [ ] Test accounts only; nothing real typed anywhere
