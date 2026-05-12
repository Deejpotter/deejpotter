import { ReactElement } from "react";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "ESP32 Wireless Car | Deej Potter",
  description:
    "Precision-controlled wireless RC car built with ESP32, featuring dual motor control with encoders, PID speed control, and Wi-Fi web interface. Technical deep-dive into motor control, encoder integration, and wireless communication.",
  openGraph: {
    title: "ESP32 Wireless Car | Deej Potter",
    description:
      "Precision-controlled wireless RC car built with ESP32, featuring encoders, PID control, and a web interface.",
    type: "article",
    url: "https://deejpotter.com/projects/engineering/wireless-car",
    images: ["/images/og/esp32-wireless-car.png"],
  },
};

const hardware = [
  {
    title: "ESP32-WROOM-32",
    points: [
      ["Processor", "Dual-core 240MHz Xtensa LX6"],
      ["Memory", "520KB SRAM, 4MB Flash"],
      ["Connectivity", "Wi-Fi 802.11 b/g/n, Bluetooth 4.2"],
      ["GPIO", "34 pins (PWM, ADC, I2C, SPI, UART)"],
      ["Why chosen", "Dual cores allow simultaneous control loops and Wi-Fi handling"],
    ],
  },
  {
    title: "L298N Motor Driver",
    points: [
      ["Control", "Dual H-bridge for 2 DC motors"],
      ["Speed Control", "PWM (0-255 values)"],
      ["Direction", "Independent forward/reverse per motor"],
      ["Power", "5V logic, 12V motor supply"],
      ["Current", "2A per channel continuous"],
    ],
  },
  {
    title: "DC Motors with Encoders",
    points: [
      ["Type", "6V DC gear motors"],
      ["Gear Ratio", "1:48 reduction"],
      ["Encoders", "Hall effect, 20 pulses per motor revolution"],
      ["Resolution", "960 pulses per wheel revolution (48 × 20)"],
      ["Accuracy", "±5mm over 1 meter travel"],
    ],
  },
  {
    title: "Power System",
    points: [
      ["Main Battery", "7.4V 2S LiPo (motors)"],
      ["Voltage Regulation", "5V buck converter for logic"],
      ["Runtime", "45 minutes continuous operation"],
      ["Safety", "Low-voltage monitoring planned"],
    ],
  },
];

const performance = [
  ["0.8 m/s", "Maximum Speed"],
  ["±5mm", "Position Accuracy (1m)"],
  ["~50ms", "Control Latency"],
  ["25m", "Wi-Fi Range"],
];

const challenges = [
  {
    title: "Encoder Noise",
    problem:
      "Electrical noise caused false encoder pulses, making position tracking inaccurate.",
    solution:
      "Added 0.1µF capacitors across encoder outputs, used INPUT_PULLUP mode, implemented software debouncing in ISR (ignore pulses < 1ms apart).",
  },
  {
    title: "Motor Speed Mismatch",
    problem:
      "Despite identical PWM values, motors ran at different speeds, causing the car to veer left or right.",
    solution:
      "Implemented PID control for each motor using encoder feedback. Real-time adjustments compensate for motor differences and battery voltage drop.",
  },
  {
    title: "Interrupt Overload",
    problem:
      "Too many encoder interrupts (high wheel RPM) caused ESP32 watchdog timer resets and system crashes.",
    solution:
      "Minimized ISR code, moved processing to the main loop, and used IRAM_ATTR for faster ISR execution from RAM.",
  },
  {
    title: "Wi-Fi Range",
    problem: "Initial range was limited to about 10 meters and dropped when the car moved too far away.",
    solution:
      "Added an external antenna connector, increased transmit power to maximum (19.5dBm), and switched to channel 1 to reduce interference. Range improved to 25m.",
  },
];

const future = [
  "Bluetooth Control: Lower latency alternative to Wi-Fi for faster response",
  "Obstacle Avoidance: Add ultrasonic sensors and autonomous navigation",
  "Line Following: IR sensors for track-following mode",
  "Camera Integration: ESP32-CAM module for first-person view control",
  "Battery Monitoring: ADC to measure LiPo voltage and display warnings",
  "Mobile App: Native iOS/Android app for improved control ergonomics",
];

type ImplementationSection = {
  title: string;
  summary: string;
  bullets: string[];
};

const implementationSections: ImplementationSection[] = [
  {
    title: "Motor Control & PWM",
    summary:
      "The ESP32 has 16 hardware PWM channels. I use 4 of them for motor control (2 motors × 2 directions). PWM frequency is set to 1kHz with 8-bit resolution (0-255 speed values).",
    bullets: [
      "Motor speed takes a motor identifier and speed value (-255 to +255). Negative values reverse direction.",
      "Movement primitives - forward, backward, left turn, right turn, and stop - combine motor speed calls.",
    ],
  },
  {
    title: "Encoder Integration",
    summary:
      "Encoders use interrupt service routines attached to GPIO pins. Each pulse updates a counter based on the phase relationship between encoder channels A and B.",
    bullets: [
      "Position calculation converts encoder pulses to distance using 960 pulses per revolution and wheel circumference.",
      "Speed measurement samples encoder counts every 100ms and converts the delta into RPM for PID control.",
      "Noise filtering uses 0.1µF capacitors, INPUT_PULLUP mode, and minimal ISR work with IRAM_ATTR.",
    ],
  },
  {
    title: "PID Speed Control",
    summary:
      "PID control maintains target wheel speed despite battery voltage, terrain, or motor variation. Each motor has its own controller.",
    bullets: [
      "Tuning parameters were set empirically at Kp=2.0, Ki=0.5, Kd=0.1.",
      "The algorithm computes error, integral, and derivative terms to adjust PWM output.",
      "PID keeps the car straight when motors differ slightly in real-world conditions.",
    ],
  },
  {
    title: "Wi-Fi Control System",
    summary:
      "The ESP32 runs in Access Point mode, serves a control page, and exposes REST endpoints for movement and status.",
    bullets: [
      "The web interface uses directional buttons and polls status every 500ms.",
      "Transmit power and an external antenna increased the usable range from about 10m to 25m.",
    ],
  },
];

export default function WirelessCar(): ReactElement {
  return (
    <div className="mx-auto max-w-6xl space-y-10 py-8 sm:py-12 lg:py-16">
      <section className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:p-8 lg:p-10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-3xl">
            <span className="mb-4 inline-flex rounded-full bg-primary/10 px-3 py-2 text-sm font-semibold text-primary">
              Engineering deep-dive
            </span>
            <h1 className="mb-4 text-4xl font-extrabold leading-tight text-gray-900 dark:text-white sm:text-5xl">
              ESP32 Wireless Car
            </h1>
            <p className="text-lg text-gray-700 dark:text-gray-300">
              Precision-controlled wireless RC car with position feedback, featuring an ESP32 microcontroller,
              dual motor control with encoders, PID control, and a Wi-Fi web interface for real-time monitoring.
            </p>
          </div>

          <div className="rounded-2xl border border-blue-200 bg-blue-50 p-5 text-blue-900 dark:border-blue-800 dark:bg-blue-950/40 dark:text-blue-100">
            <div className="mb-3 text-sm font-semibold uppercase tracking-wide text-blue-700 dark:text-blue-300">
              Project Links
            </div>
            <div className="flex flex-col gap-3">
              <a
                href="https://github.com/Deejpotter/esp32-wireless-car"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold underline decoration-blue-400 underline-offset-4 hover:decoration-blue-700"
              >
                GitHub Repository
              </a>
              <a
                href="https://github.com/Deejpotter/cyd-wireless-controller"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold underline decoration-blue-400 underline-offset-4 hover:decoration-blue-700"
              >
                CYD Wireless Controller
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <h2 className="mb-3 text-2xl font-bold text-gray-900 dark:text-white">Project Overview</h2>
          <div className="space-y-4 text-gray-700 dark:text-gray-300">
            <p>
              This project demonstrates precision motor control and wireless communication using the ESP32 microcontroller.
              Unlike simple RC cars that just turn motors on and off, this implementation uses encoder feedback for accurate
              position tracking, PID control for consistent speed, and a web interface for remote control over Wi-Fi.
            </p>
            <p>
              Built as a learning platform for embedded systems and robotics concepts, the car showcases practical applications
              of interrupt handling, PWM motor control, real-time feedback loops, and wireless networking on a resource-constrained
              microcontroller.
            </p>
          </div>
        </div>

        <div className="rounded-3xl border border-gray-100 bg-gray-50 p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">
          <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">Performance Results</h2>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {performance.map(([value, label]) => (
              <div key={label} className="rounded-2xl border border-gray-200 bg-white p-4 text-center dark:border-gray-700 dark:bg-gray-800">
                <div className="text-3xl font-extrabold text-primary">{value}</div>
                <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Hardware Components</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {hardware.map((item) => (
            <article key={item.title} className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <h3 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">{item.title}</h3>
              <dl className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
                {item.points.map(([label, value]) => (
                  <div key={label} className="grid gap-1 sm:grid-cols-[130px_minmax(0,1fr)]">
                    <dt className="font-semibold text-gray-900 dark:text-gray-100">{label}</dt>
                    <dd>{value}</dd>
                  </div>
                ))}
              </dl>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Key Features</h2>
        <ul className="grid gap-3 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:grid-cols-2">
          {[
            ["Precision Position Tracking", "Encoders provide 960 pulses per wheel revolution for ±5mm accuracy over 1 meter."],
            ["PID Speed Control", "Maintains consistent speed despite battery voltage drop or terrain variations."],
            ["Wi-Fi Web Interface", "Control the car from any browser without installing an app."],
            ["Real-time Monitoring", "Live display of distance traveled, wheel RPM, and motor status."],
            ["Interrupt-Driven Encoders", "Fast, accurate position tracking without polling overhead."],
            ["25m Wireless Range", "External antenna configuration improves range."],
            ["50ms Control Latency", "Responsive control from Wi-Fi command to motor response."],
          ].map(([title, desc]) => (
            <li key={title} className="rounded-2xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900">
              <strong className="block text-gray-900 dark:text-white">{title}:</strong>
              <span className="text-gray-700 dark:text-gray-300">{desc}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Technical Implementation</h2>
        <div className="space-y-3">
          {implementationSections.map((section) => (
            <details
              key={section.title}
              className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800"
              open={section.title === "Motor Control & PWM"}
            >
              <summary className="cursor-pointer list-none px-6 py-4 text-lg font-bold text-gray-900 dark:text-white">
                {section.title}
              </summary>
              <div className="border-t border-gray-100 px-6 py-5 dark:border-gray-700">
                <p className="mb-4 text-gray-700 dark:text-gray-300">{section.summary}</p>
                <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                  {section.bullets.map((bullet) => (
                    <li key={bullet} className="flex gap-2">
                      <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-primary" />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </details>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Challenges Solved</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {challenges.map((item) => (
            <article key={item.title} className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <h3 className="mb-3 text-xl font-bold text-gray-900 dark:text-white">{item.title}</h3>
              <p className="mb-3 text-gray-700 dark:text-gray-300">
                <strong>Problem:</strong> {item.problem}
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                <strong>Solution:</strong> {item.solution}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Future Improvements</h2>
        <ul className="grid gap-3 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:grid-cols-2">
          {future.map((item) => (
            <li key={item} className="rounded-2xl border border-gray-200 bg-gray-50 p-4 text-gray-700 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300">
              {item}
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Related Projects</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <article className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <h3 className="mb-3 text-xl font-bold text-gray-900 dark:text-white">CYD Wireless Controller</h3>
            <p className="mb-4 text-gray-700 dark:text-gray-300">
              ESP32 display-based controller project for the wireless car. Features touch interface and real-time telemetry display.
            </p>
            <a
              href="https://github.com/Deejpotter/cyd-wireless-controller"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex rounded-full border border-primary/30 px-4 py-2 font-semibold text-primary transition hover:bg-primary/5"
            >
              View on GitHub
            </a>
          </article>

          <article className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <h3 className="mb-3 text-xl font-bold text-gray-900 dark:text-white">Simple Drawbot Software</h3>
            <p className="mb-4 text-gray-700 dark:text-gray-300">
              G-code generator for pen plotters and CNC drawing machines. Similar motor control concepts applied to precision positioning.
            </p>
            <a
              href="https://github.com/Deejpotter/simple-drawbot-software"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex rounded-full border border-primary/30 px-4 py-2 font-semibold text-primary transition hover:bg-primary/5"
            >
              View on GitHub
            </a>
          </article>
        </div>
      </section>

      <section className="rounded-3xl border border-blue-200 bg-blue-50 p-6 text-blue-900 dark:border-blue-800 dark:bg-blue-950/40 dark:text-blue-100">
        <h2 className="mb-3 text-2xl font-bold">Key Takeaways</h2>
        <div className="space-y-4 text-blue-900/90 dark:text-blue-100/90">
          <p>
            The ESP32 is an excellent platform for robotics projects. Its dual-core processor can handle control loops and Wi-Fi communication simultaneously
            without blocking. Encoder feedback is essential for precision movement - without it, you are just guessing where your robot is.
          </p>
          <p className="mb-0">
            This project taught me that embedded systems programming requires thinking about timing, interrupts, and resource constraints in ways that web
            development does not. Every millisecond matters when you are running control loops at 100Hz while serving web requests.
          </p>
        </div>
      </section>

      <section className="rounded-3xl border border-gray-200 bg-gray-50 p-6 dark:border-gray-700 dark:bg-gray-900">
        <p className="text-gray-800 dark:text-gray-200">
          <strong>Want more details?</strong> Read the full technical write-up: {" "}
          <Link href="/blog/esp32-wireless-car" className="font-semibold text-primary underline decoration-primary/30 underline-offset-4">
            ESP32 Wireless Car: Motor Control and Encoder Integration
          </Link>
        </p>
      </section>
    </div>
  );
}
