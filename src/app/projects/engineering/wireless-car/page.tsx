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

export default function WirelessCar(): ReactElement {
  return (
    <div className="mx-auto max-w-5xl space-y-10 px-4 py-10">
      <header className="space-y-3">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-50">ESP32 Wireless Car</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Precision-controlled wireless RC car with position feedback, featuring an ESP32 microcontroller,
          dual motor control with encoders, and a Wi-Fi web interface for real-time control and monitoring.
        </p>
      </header>

      <section className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-emerald-900 shadow-sm dark:border-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-100">
        <h2 className="text-lg font-semibold">Project Links</h2>
        <div className="mt-3 flex flex-col gap-2 text-sm md:flex-row md:items-center md:gap-4">
          <a
            href="https://github.com/Deejpotter/esp32-wireless-car"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg bg-emerald-700 px-4 py-2 text-white shadow-sm transition hover:bg-emerald-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500"
          >
            GitHub Repository <span aria-hidden="true">↗</span>
          </a>
          <a
            href="https://github.com/Deejpotter/cyd-wireless-controller"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border border-emerald-600 px-4 py-2 text-emerald-800 transition hover:bg-emerald-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500 dark:border-emerald-400 dark:text-emerald-100 dark:hover:bg-emerald-900/30"
          >
            CYD Wireless Controller
          </a>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Project Overview</h2>
        <p className="text-gray-700 dark:text-gray-200">
          This project demonstrates precision motor control and wireless communication using the ESP32
          microcontroller. Unlike simple RC cars that just toggle motors, it uses encoder feedback for
          accurate position tracking, PID control for consistent speed, and a web interface for remote control
          over Wi-Fi.
        </p>
        <p className="text-gray-700 dark:text-gray-200">
          Built as a learning platform for embedded systems and robotics concepts, the car showcases
          practical applications of interrupt handling, PWM motor control, real-time feedback loops, and
          wireless networking on a resource-constrained microcontroller.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Hardware Components</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {[
            {
              title: "ESP32-WROOM-32",
              bullets: [
                "Processor: Dual-core 240MHz Xtensa LX6",
                "Memory: 520KB SRAM, 4MB Flash",
                "Connectivity: Wi-Fi 802.11 b/g/n, Bluetooth 4.2",
                "GPIO: 34 pins (PWM, ADC, I2C, SPI, UART)",
                "Why chosen: Dual cores allow simultaneous control loops and Wi-Fi handling",
              ],
            },
            {
              title: "L298N Motor Driver",
              bullets: [
                "Control: Dual H-bridge for 2 DC motors",
                "Speed Control: PWM (0-255 values)",
                "Direction: Independent forward/reverse per motor",
                "Power: 5V logic, 12V motor supply",
                "Current: 2A per channel continuous",
              ],
            },
            {
              title: "DC Motors with Encoders",
              bullets: [
                "Type: 6V DC gear motors",
                "Gear Ratio: 1:48 reduction",
                "Encoders: Hall effect, 20 pulses per motor revolution",
                "Resolution: 960 pulses per wheel revolution (48 × 20)",
                "Accuracy: ±5mm over 1 meter travel",
              ],
            },
            {
              title: "Power System",
              bullets: [
                "Main Battery: 7.4V 2S LiPo (motors)",
                "Voltage Regulation: 5V buck converter for logic",
                "Runtime: 45 minutes continuous operation",
                "Safety: Low-voltage monitoring planned",
              ],
            },
          ].map((card) => (
            <div
              key={card.title}
              className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{card.title}</h3>
              <ul className="mt-3 space-y-2 text-sm text-gray-700 dark:text-gray-200">
                {card.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Key Features</h2>
        <ul className="space-y-2 text-gray-700 dark:text-gray-200">
          <li>
            <strong>Precision Position Tracking:</strong> Encoders provide 960 pulses per wheel revolution
            for ±5mm accuracy over 1 meter
          </li>
          <li>
            <strong>PID Speed Control:</strong> Maintains consistent speed despite battery voltage drop or
            terrain variations
          </li>
          <li>
            <strong>Wi-Fi Web Interface:</strong> Control the car from any device with a web browser
          </li>
          <li>
            <strong>Real-time Monitoring:</strong> Live display of distance traveled, wheel RPM, and motor
            status
          </li>
          <li>
            <strong>Interrupt-Driven Encoders:</strong> Fast, accurate position tracking without polling
            overhead
          </li>
          <li>
            <strong>25m Wireless Range:</strong> Extended range with external antenna configuration
          </li>
          <li>
            <strong>50ms Control Latency:</strong> Responsive control from Wi-Fi command to motor response
          </li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Technical Implementation</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {[
            {
              title: "Motor Control & PWM",
              body: [
                "The ESP32 has 16 hardware PWM channels; 4 are used for motor control (2 motors × 2 directions) at 1kHz with 8-bit resolution.",
                "Motor speed function accepts -255 to +255, sets direction pins, and writes PWM duty cycle.",
                "Movement primitives (forward/back/left/right/stop) combine motor speed calls.",
              ],
            },
            {
              title: "Encoder Integration",
              body: [
                "ISRs on encoder pins increment/decrement counts based on channel phase relationship.",
                "Position = pulses / 960 × wheel circumference (π × 65mm diameter).",
                "Speed sampled every 100ms; RPM = (delta / 960) × (60000 / time_ms).",
                "Noise handled with 0.1µF capacitors, INPUT_PULLUP, and minimal ISR logic (IRAM_ATTR).",
              ],
            },
            {
              title: "PID Speed Control",
              body: [
                "Each motor has its own PID controller: Kp=2.0, Ki=0.5, Kd=0.1 (empirically tuned).",
                "Error = setpoint - current speed; anti-windup for integral; derivative on error delta.",
                "Keeps motors matched to avoid veering and compensates for voltage sag or terrain.",
              ],
            },
            {
              title: "Wi-Fi Control System",
              body: [
                "ESP32 runs in AP mode (\"ESP32-Car\"); connect and navigate to its IP (192.168.4.1).",
                "Built-in WebServer serves HTML controls and REST endpoints: /forward, /backward, /left, /right, /stop, /status.",
                "Control page uses fetch() commands and polls /status every 500ms for telemetry.",
                "Range improved to ~25m with external antenna and WIFI_POWER_19_5dBm.",
              ],
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{item.title}</h3>
              <ul className="mt-3 space-y-2 text-sm text-gray-700 dark:text-gray-200">
                {item.body.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Performance Results</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[{ label: "Maximum Speed", value: "0.8 m/s" }, { label: "Position Accuracy (1m)", value: "±5mm" }, { label: "Control Latency", value: "~50ms" }, { label: "Wi-Fi Range", value: "25m" }].map((metric) => (
                <div
                  key={metric.label}
                  className="rounded-2xl border border-gray-200 bg-white p-5 text-center shadow-sm dark:border-gray-800 dark:bg-gray-900"
                >
                  <p className="text-2xl font-semibold text-emerald-700 dark:text-emerald-200">{metric.value}</p>
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">{metric.label}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Challenges Solved</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {[
                {
                  title: "Encoder Noise",
                  problem: "Electrical noise caused false encoder pulses, making position tracking inaccurate.",
                  solution:
                    "Added 0.1µF capacitors across encoder outputs, used INPUT_PULLUP mode, and debounced in ISR (ignore pulses < 1ms apart).",
                },
                {
                  title: "Motor Speed Mismatch",
                  problem: "Identical PWM values still produced different speeds, causing the car to veer.",
                  solution:
                    "Implemented per-motor PID control with encoder feedback; real-time adjustments compensate for differences and voltage drop.",
                },
                {
                  title: "Interrupt Overload",
                  problem: "High wheel RPM triggered too many interrupts, leading to watchdog resets and crashes.",
                  solution:
                    "Kept ISR minimal (just counting), moved processing to the main loop, and used IRAM_ATTR for faster execution from RAM.",
                },
                {
                  title: "Wi-Fi Range",
                  problem: "Initial range was ~10m and dropped when the car moved too far.",
                  solution:
                    "Added external antenna connector, increased transmit power to 19.5dBm, and selected a cleaner channel to reach ~25m.",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900"
                >
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{item.title}</h3>
                  <p className="mt-2 text-sm text-gray-700 dark:text-gray-200">
                    <strong>Problem:</strong> {item.problem}
                  </p>
                  <p className="mt-1 text-sm text-gray-700 dark:text-gray-200">
                    <strong>Solution:</strong> {item.solution}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Future Improvements</h2>
            <ul className="space-y-2 text-gray-700 dark:text-gray-200">
              <li>
                <strong>Bluetooth Control:</strong> Lower latency alternative to Wi-Fi for faster response
              </li>
              <li>
                <strong>Obstacle Avoidance:</strong> Add ultrasonic sensors and autonomous navigation
              </li>
              <li>
                <strong>Line Following:</strong> IR sensors for track-following mode
              </li>
              <li>
                <strong>Camera Integration:</strong> ESP32-CAM module for first-person view control
              </li>
              <li>
                <strong>Battery Monitoring:</strong> ADC to measure LiPo voltage, display in interface, low-battery warning
              </li>
              <li>
                <strong>Mobile App:</strong> Native iOS/Android app for improved control ergonomics
              </li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Related Projects</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {[
                {
                  title: "CYD Wireless Controller",
                  description:
                    "ESP32 display-based controller for the wireless car. Features touch interface and real-time telemetry display.",
                  link: "https://github.com/Deejpotter/cyd-wireless-controller",
                },
                {
                  title: "Simple Drawbot Software",
                  description:
                    "G-code generator for pen plotters and CNC drawing machines. Similar motor control concepts applied to precision positioning.",
                  link: "https://github.com/Deejpotter/simple-drawbot-software",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900"
                >
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{item.title}</h3>
                  <p className="mt-2 text-sm text-gray-700 dark:text-gray-200">{item.description}</p>
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-flex items-center justify-center rounded-lg border border-emerald-600 px-4 py-2 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500 dark:border-emerald-400 dark:text-emerald-200 dark:hover:bg-emerald-900/30"
                  >
                    View on GitHub
                  </a>
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-4">
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-emerald-900 shadow-sm dark:border-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-100">
              <h2 className="text-xl font-semibold">Key Takeaways</h2>
              <p className="mt-2 text-sm">
                The ESP32 is an excellent platform for robotics projects. Its dual-core processor can handle
                control loops and Wi-Fi communication simultaneously without blocking. Encoder feedback is essential
                for precision movement—without it, you&apos;re just guessing where your robot is. PID control compensates for
                real-world inconsistencies that simple on/off control can&apos;t handle.
              </p>
              <p className="mt-2 text-sm">
                This project reinforced that embedded systems programming requires thinking about timing, interrupts,
                and resource constraints in ways web development doesn&apos;t. Every millisecond matters when control
                loops run at 100Hz alongside web requests.
              </p>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Want more details?</h2>
              <p className="mt-2 text-sm text-gray-700 dark:text-gray-200">
                Read the full technical write-up:
                <Link
                  href="/blog/esp32-wireless-car"
                  className="ml-2 font-semibold text-emerald-700 underline decoration-emerald-500 decoration-2 underline-offset-4 hover:text-emerald-800 dark:text-emerald-200"
                >
                  ESP32 Wireless Car: Motor Control and Encoder Integration
                </Link>
              </p>
            </div>
          </section>
        </div>
  );
}
