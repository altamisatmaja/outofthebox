---
name: outofthebox-infra
description: "Out of the Box for infrastructure you did not realise was exposed: a defensive self audit of your own servers, cloud, storage, DNS, CI, secrets and logs for misconfigurations that leak data or access. Load with the outofthebox core before a release, after an infra change, or when asked to check what might be exposed. For systems you own only."
allowed-tools: Read Write Edit Glob Grep Bash
---
# outofthebox-infra

> Out of the Box: relentless testing for AI agents. Infrastructure self audit.

> Part of the outofthebox system. Read together with the core
> (`skills/outofthebox/SKILL.md`). The core holds the loop, the rules
> (O-01 to O-16) and the Delivery Gate; this skill adds what to hunt for in
> this concern. It cites core rules and never renumbers them.

Scope: your own product and infrastructure, in a test or staging
environment, with written permission from whoever owns it. Never point any
of this at systems you do not own or are not authorized to assess (O-02).
Findings about secrets or exposure are reported privately, never pasted into
issues, chats or logs.

Read configuration and use the provider's own security tools first. Prefer
reading settings over probing; when you must check from outside, check only
your own hosts, gently, and stop at the first confirmation.

## Inventory before anything

List what you run: domains and subdomains, servers, containers, databases,
buckets, queues, CI runners, admin panels, staging copies, old releases,
third party services with your data. Most leaks live in the thing nobody
listed: the forgotten staging site, the old bucket, the test admin panel.

## Questions to answer from your own config

- **Secrets:** are any keys, passwords or tokens in the repo, its history,
  CI logs, container images, client bundles, or error pages? Are production
  and staging keys different? Can each key be rotated today?
- **Debug and defaults:** is debug mode, a stack trace page, a default
  password or a sample app reachable in any environment people can reach?
- **Files that should never be served:** environment files, backups, dumps,
  source maps you did not mean to publish, version control folders.
- **Storage:** is every bucket private unless it must be public, and is each
  public one meant to be? Do signed links expire?
- **Network:** are databases, caches, queues and admin panels reachable only
  from where they must be? Which ports are open to the internet, and is each
  one intended?
- **Identity and access:** least privilege for people, CI and services; no
  shared accounts; former staff removed; MFA on every console.
- **Transport and headers:** TLS everywhere, certificates renewing,
  security headers and CORS set to what the app needs and no wider.
- **CI and supply chain:** who can change the pipeline, which secrets it
  sees, dependencies with known vulnerabilities, pinned versions.
- **Backups:** they exist, are encrypted, are not public, and a restore has
  actually been tested.
- **Logs:** no passwords, tokens or personal data written to logs; logs kept
  long enough to investigate.

## Tools (defensive, on your own accounts)

Your cloud provider's security posture tools, secret scanners on your own
repos, dependency audits (`npm audit`, `composer audit`, `pip-audit`,
`govulncheck`), and configuration linters. Record the command and the
result (O-03).

## Reporting

Rank by impact (O-13): exposed data or credentials first. Report secrets by
location only, never the value. Say what was checked by reading config and
what was confirmed from outside, and what was not checked (O-16).

## Infra checklist

- [ ] Inventory written, including staging, old and forgotten things
- [ ] Secrets searched in repo, history, CI, images, bundles
- [ ] Debug, defaults and never-serve files checked per environment
- [ ] Storage, network and access reviewed against least privilege
- [ ] Backups restored once; logs free of secrets
- [ ] Findings reported privately, values never pasted
