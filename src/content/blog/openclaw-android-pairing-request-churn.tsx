import { BlogPost } from "@/lib/blog";

const content = (
  <article className="blog-post">
    <p className="lead">
      I hit a frustrating OpenClaw Android pairing failure that looked like a
      bad network route, a stale approval, or a broken phone app. The real
      cause was subtler: the Android onboarding screen kept submitting fresh
      pairing requests while it stayed open, which rotated the pending
      <code>requestId</code> fast enough to make approval fail.
    </p>

    <p>
      The symptom on the gateway machine was especially misleading. I would run
      <code>openclaw devices list</code>, copy the request ID, then try to
      approve it a few seconds later and get an error saying the request was
      unknown. That made it look like the CLI or gateway was broken. In
      reality, the phone had already submitted a newer request and invalidated
      the one I was trying to approve.
    </p>

    <h2>The exact failure</h2>
    <p>On the PC, approval failed like this:</p>
    <pre>
      <code>{`GatewayClientRequestError: unknown requestId`}</code>
    </pre>

    <p>On the phone, the app kept surfacing pairing-related errors such as:</p>
    <ul>
      <li>
        <code>Gateway error: pairing required: device is not approved yet</code>
      </li>
      <li>
        <code>Connected (operator offline)</code>
      </li>
    </ul>

    <p>
      Those messages sent me down the wrong path at first. I checked Tailscale,
      TLS, hostnames, ports, old pairings, and gateway status. Some of that was
      necessary, but it was not the main problem by the end.
    </p>

    <h2>What was actually happening</h2>
    <p>
      Once the route was correct, the phone could reach the gateway just fine.
      The failure shifted into the pairing flow itself.
    </p>

    <ol>
      <li>The Android app opened the onboarding final-check screen.</li>
      <li>It submitted a pairing request.</li>
      <li>
        While the screen remained open, it submitted another pairing request.
      </li>
      <li>The old pending request ID became stale.</li>
      <li>
        <code>openclaw devices approve &lt;requestId&gt;</code> then failed because
        that request no longer existed.
      </li>
    </ol>

    <p>
      In other words, the approval command was not necessarily wrong. It was
      just always racing a moving target.
    </p>

    <div className="alert alert-warning mt-4">
      <strong>Important detail:</strong> if the request ID keeps changing under
      you, the pairing problem may be request churn rather than routing,
      certificates, or permissions.
    </div>

    <h2>The workaround that actually worked</h2>
    <p>
      The breakthrough was simple: stop the app from generating new requests
      long enough to approve one stable request.
    </p>

    <ol>
      <li>
        On the gateway machine, run <code>openclaw devices list</code>.
      </li>
      <li>Copy the newest pending request ID.</li>
      <li>
        Turn the phone screen off, or otherwise stop the app from actively
        sitting on the pairing screen.
      </li>
      <li>
        Approve the copied request:
        <pre>
          <code>{`openclaw devices approve <requestId>`}</code>
        </pre>
      </li>
      <li>Wake the phone and continue onboarding.</li>
    </ol>

    <p>
      Once the app stopped churning requests, the approval ID stayed valid long
      enough to work.
    </p>

    <h2>Route sanity check</h2>
    <p>
      In my case, the correct route was Tailscale with a secure served gateway.
      The working gateway shape looked like this:
    </p>

    <pre>
      <code>{`wss://desktop-ubv27i5.tail4653de.ts.net`}</code>
    </pre>

    <p>
      A few dead ends along the way were useful to rule out:
    </p>
    <ul>
      <li>
        Raw tailnet IP plus HTTPS on <code>:18789</code> was not the right path
        for this Android onboarding flow.
      </li>
      <li>
        Emulator-style addresses like <code>10.0.2.2</code> were irrelevant on a
        real Samsung phone.
      </li>
      <li>
        Once the app reported pairing-required errors instead of route errors,
        networking was no longer the primary issue.
      </li>
    </ul>

    <h2>How to tell if this is your bug too</h2>
    <p>You may be hitting the same issue if all of these are true:</p>
    <ul>
      <li>The phone can reach the gateway over the correct route.</li>
      <li>
        <code>openclaw devices list</code> shows a pending request.</li>
      <li>
        <code>openclaw devices approve &lt;requestId&gt;</code> fails with
        <code>unknown requestId</code>.
      </li>
      <li>
        Running <code>openclaw devices list</code> again shows a different fresh
        request ID almost immediately.
      </li>
    </ul>

    <h2>Operational note</h2>
    <p>
      This is worth documenting in your own notes if you run OpenClaw seriously.
      It is the kind of edge case that can burn an hour because the symptoms
      point in three different directions at once.
    </p>

    <p>
      My short version now is: <strong>if approval says unknown requestId, check
      whether the phone is still actively creating new pairing requests.</strong>
    </p>

    <div className="alert alert-success mt-4">
      <strong>Working procedure:</strong> list the newest pending request, freeze
      the phone screen, approve that request, then wake the phone and continue.
    </div>
  </article>
);

export const openclawAndroidPairingRequestChurnPost: BlogPost = {
  slug: "openclaw-android-pairing-request-churn",
  title: "OpenClaw Android Pairing Kept Failing - The Real Bug Was Request Churn",
  date: "2026-05-11",
  excerpt:
    "A real OpenClaw Android troubleshooting note: the pairing flow kept failing because the onboarding screen was rotating pending request IDs faster than they could be approved. Here is the exact symptom, root cause, and workaround.",
  tags: ["openclaw", "android", "troubleshooting", "tailscale", "nextjs"],
  content,
  readTime: 6,
};
