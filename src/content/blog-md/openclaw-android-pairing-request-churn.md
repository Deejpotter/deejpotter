---
title: OpenClaw Android Pairing Kept Failing - The Real Bug Was Request Churn
slug: openclaw-android-pairing-request-churn
date: 2026-05-11
excerpt: "A real OpenClaw Android troubleshooting note: the pairing flow kept failing because the onboarding screen was rotating pending request IDs faster than they could be approved. Here is the exact symptom, root cause, and workaround."
tags:
  - openclaw
  - android
  - troubleshooting
  - tailscale
  - nextjs
draft: false
---

I hit a frustrating OpenClaw Android pairing failure that looked like a bad network route, a stale approval, or a broken phone app. The real cause was subtler: the Android onboarding screen kept submitting fresh pairing requests while it stayed open, which rotated the pending `requestId` fast enough to make approval fail.

The symptom on the gateway machine was especially misleading. I would run `openclaw devices list`, copy the request ID, then try to approve it a few seconds later and get an error saying the request was unknown. That made it look like the CLI or gateway was broken. In reality, the phone had already submitted a newer request and invalidated the one I was trying to approve.

## The exact failure

On the PC, approval failed like this:

```text
GatewayClientRequestError: unknown requestId
```

On the phone, the app kept surfacing pairing-related errors such as:

- `Gateway error: pairing required: device is not approved yet`
- `Connected (operator offline)`

Those messages sent me down the wrong path at first. I checked Tailscale, TLS, hostnames, ports, old pairings, and gateway status. Some of that was necessary, but it was not the main problem by the end.

## What was actually happening

Once the route was correct, the phone could reach the gateway just fine. The failure shifted into the pairing flow itself.

1. The Android app opened the onboarding final-check screen.
2. It submitted a pairing request.
3. While the screen remained open, it submitted another pairing request.
4. The old pending request ID became stale.
5. `openclaw devices approve <requestId>` then failed because that request no longer existed.

In other words, the approval command was not necessarily wrong. It was just always racing a moving target.

> Important detail: if the request ID keeps changing under you, the pairing problem may be request churn rather than routing, certificates, or permissions.

## The workaround that actually worked

The breakthrough was simple: stop the app from generating new requests long enough to approve one stable request.

1. On the gateway machine, run `openclaw devices list`.
2. Copy the newest pending request ID.
3. Turn the phone screen off, or otherwise stop the app from actively sitting on the pairing screen.
4. Approve the copied request:

```bash
openclaw devices approve <requestId>
```

5. Wake the phone and continue onboarding.

Once the app stopped churning requests, the approval ID stayed valid long enough to work.

## Route sanity check

In my case, the correct route was Tailscale with a secure served gateway. The working gateway shape looked like this:

```text
wss://desktop-ubv27i5.tail4653de.ts.net
```

A few dead ends along the way were useful to rule out:

- Raw tailnet IP plus HTTPS on `:18789` was not the right path for this Android onboarding flow.
- Emulator-style addresses like `10.0.2.2` were irrelevant on a real Samsung phone.
- Once the app reported pairing-required errors instead of route errors, networking was no longer the primary issue.

## How to tell if this is your bug too

You may be hitting the same issue if all of these are true:

- The phone can reach the gateway over the correct route.
- `openclaw devices list` shows a pending request.
- `openclaw devices approve <requestId>` fails with `unknown requestId`.
- Running `openclaw devices list` again shows a different fresh request ID almost immediately.

## Operational note

This is worth documenting in your own notes if you run OpenClaw seriously. It is the kind of edge case that can burn an hour because the symptoms point in three different directions at once.

My short version now is: **if approval says unknown requestId, check whether the phone is still actively creating new pairing requests.**

## Working procedure

- list the newest pending request
- freeze the phone screen
- approve that stable request
- wake the phone and continue
