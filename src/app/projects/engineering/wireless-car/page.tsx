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
    url: "https://deejpotter.com/projects/engineering/wireless-car",
    images: ["/images/og/esp32-wireless-car.png"],
  },
};

export default function WirelessCar(): ReactElement {
  return (
    <div className="container my-5">
      <div className="row">
        <div className="col-lg-10 mx-auto">
          <h1 className="display-4 mb-4">ESP32 Wireless Car</h1>
          <p className="lead mb-4">
            Precision-controlled wireless RC car with position feedback,
            featuring ESP32 microcontroller, dual motor control with encoders,
            and Wi-Fi web interface for real-time control and monitoring.
          </p>

          {/* Quick Links */}
          <div className="alert alert-primary mb-4" role="alert">
            <strong>Project Links:</strong>{" "}
            <a
              href="https://github.com/Deejpotter/esp32-wireless-car"
              target="_blank"
              rel="noopener noreferrer"
              className="alert-link"
            >
              GitHub Repository
            </a>
            {" | "}
            <a
              href="https://github.com/Deejpotter/cyd-wireless-controller"
              target="_blank"
              rel="noopener noreferrer"
              className="alert-link"
            >
              CYD Wireless Controller
            </a>
          </div>

          {/* Overview Section */}
          <section className="mb-5">
            <h2 className="h3 mb-3">Project Overview</h2>
            <p>
              This project demonstrates precision motor control and wireless
              communication using the ESP32 microcontroller. Unlike simple RC
              cars that just turn motors on and off, this implementation uses
              encoder feedback for accurate position tracking, PID control for
              consistent speed, and a web interface for remote control over
              Wi-Fi.
            </p>
            <p>
              Built as a learning platform for embedded systems and robotics
              concepts, the car showcases practical applications of interrupt
              handling, PWM motor control, real-time feedback loops, and
              wireless networking on a resource-constrained microcontroller.
            </p>
          </section>

          {/* Hardware Components */}
          <section className="mb-5">
            <h2 className="h3 mb-4">Hardware Components</h2>
            <div className="row g-3">
              <div className="col-md-6">
                <div className="card h-100">
                  <div className="card-body">
                    <h3 className="h5 card-title">ESP32-WROOM-32</h3>
                    <ul className="list-unstyled mb-0">
                      <li>
                        <strong>Processor:</strong> Dual-core 240MHz Xtensa LX6
                      </li>
                      <li>
                        <strong>Memory:</strong> 520KB SRAM, 4MB Flash
                      </li>
                      <li>
                        <strong>Connectivity:</strong> Wi-Fi 802.11 b/g/n,
                        Bluetooth 4.2
                      </li>
                      <li>
                        <strong>GPIO:</strong> 34 pins (PWM, ADC, I2C, SPI,
                        UART)
                      </li>
                      <li>
                        <strong>Why chosen:</strong> Dual cores allow
                        simultaneous control loops and Wi-Fi handling
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="card h-100">
                  <div className="card-body">
                    <h3 className="h5 card-title">L298N Motor Driver</h3>
                    <ul className="list-unstyled mb-0">
                      <li>
                        <strong>Control:</strong> Dual H-bridge for 2 DC motors
                      </li>
                      <li>
                        <strong>Speed Control:</strong> PWM (0-255 values)
                      </li>
                      <li>
                        <strong>Direction:</strong> Independent forward/reverse
                        per motor
                      </li>
                      <li>
                        <strong>Power:</strong> 5V logic, 12V motor supply
                      </li>
                      <li>
                        <strong>Current:</strong> 2A per channel continuous
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="card h-100">
                  <div className="card-body">
                    <h3 className="h5 card-title">DC Motors with Encoders</h3>
                    <ul className="list-unstyled mb-0">
                      <li>
                        <strong>Type:</strong> 6V DC gear motors
                      </li>
                      <li>
                        <strong>Gear Ratio:</strong> 1:48 reduction
                      </li>
                      <li>
                        <strong>Encoders:</strong> Hall effect, 20 pulses per
                        motor revolution
                      </li>
                      <li>
                        <strong>Resolution:</strong> 960 pulses per wheel
                        revolution (48 × 20)
                      </li>
                      <li>
                        <strong>Accuracy:</strong> ±5mm over 1 meter travel
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="card h-100">
                  <div className="card-body">
                    <h3 className="h5 card-title">Power System</h3>
                    <ul className="list-unstyled mb-0">
                      <li>
                        <strong>Main Battery:</strong> 7.4V 2S LiPo (motors)
                      </li>
                      <li>
                        <strong>Voltage Regulation:</strong> 5V buck converter
                        for logic
                      </li>
                      <li>
                        <strong>Runtime:</strong> 45 minutes continuous
                        operation
                      </li>
                      <li>
                        <strong>Safety:</strong> Low-voltage monitoring planned
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Key Features */}
          <section className="mb-5">
            <h2 className="h3 mb-3">Key Features</h2>
            <ul>
              <li>
                <strong>Precision Position Tracking:</strong> Encoders provide
                960 pulses per wheel revolution for ±5mm accuracy over 1 meter
              </li>
              <li>
                <strong>PID Speed Control:</strong> Maintains consistent speed
                despite battery voltage drop or terrain variations
              </li>
              <li>
                <strong>Wi-Fi Web Interface:</strong> Control car from any
                device with a web browser, no app installation needed
              </li>
              <li>
                <strong>Real-time Monitoring:</strong> Live display of distance
                traveled, wheel RPM, and motor status
              </li>
              <li>
                <strong>Interrupt-Driven Encoders:</strong> Fast, accurate
                position tracking without polling overhead
              </li>
              <li>
                <strong>25m Wireless Range:</strong> Extended range with
                external antenna configuration
              </li>
              <li>
                <strong>50ms Control Latency:</strong> Responsive control from
                Wi-Fi command to motor response
              </li>
            </ul>
          </section>

          {/* Technical Implementation */}
          <section className="mb-5">
            <h2 className="h3 mb-4">Technical Implementation</h2>
            <div className="accordion" id="technicalAccordion">
              <div className="accordion-item">
                <h2 className="accordion-header" id="headingMotorControl">
                  <button
                    className="accordion-button"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#collapseMotorControl"
                    aria-expanded="true"
                    aria-controls="collapseMotorControl"
                  >
                    Motor Control & PWM
                  </button>
                </h2>
                <div
                  id="collapseMotorControl"
                  className="accordion-collapse collapse show"
                  aria-labelledby="headingMotorControl"
                  data-bs-parent="#technicalAccordion"
                >
                  <div className="accordion-body">
                    <p>
                      The ESP32 has 16 hardware PWM channels. I use 4 of them
                      for motor control (2 motors × 2 directions). PWM frequency
                      is set to 1kHz with 8-bit resolution (0-255 speed values).
                    </p>
                    <p>
                      <strong>Motor speed function:</strong> Takes a motor
                      identifier and speed value (-255 to +255). Negative values
                      reverse direction. The function sets direction pins
                      HIGH/LOW and writes PWM duty cycle to control speed.
                    </p>
                    <p>
                      <strong>Movement primitives:</strong> Forward, backward,
                      left turn (differential), right turn, and stop functions
                      combine motor speed calls to create basic car movements.
                    </p>
                  </div>
                </div>
              </div>
              <div className="accordion-item">
                <h2 className="accordion-header" id="headingEncoders">
                  <button
                    className="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#collapseEncoders"
                    aria-expanded="false"
                    aria-controls="collapseEncoders"
                  >
                    Encoder Integration
                  </button>
                </h2>
                <div
                  id="collapseEncoders"
                  className="accordion-collapse collapse"
                  aria-labelledby="headingEncoders"
                  data-bs-parent="#technicalAccordion"
                >
                  <div className="accordion-body">
                    <p>
                      Encoders use interrupt service routines (ISRs) attached to
                      GPIO pins. The ISR fires on every encoder pulse change and
                      increments/decrements a counter based on the phase
                      relationship between encoder channels A and B.
                    </p>
                    <p>
                      <strong>Position calculation:</strong> Convert encoder
                      pulses to distance traveled by dividing pulse count by
                      pulses per revolution (960), then multiplying by wheel
                      circumference (π × 65mm diameter).
                    </p>
                    <p>
                      <strong>Speed measurement:</strong> Sample encoder counts
                      every 100ms, calculate delta, convert to RPM using: (delta
                      / 960) × (60000 / time_ms). This provides real-time wheel
                      speed for PID control.
                    </p>
                    <p>
                      <strong>Challenges solved:</strong> Encoder noise filtered
                      with 0.1µF capacitors and INPUT_PULLUP mode. ISRs kept
                      minimal (just counting) with IRAM_ATTR for faster
                      execution to prevent watchdog timer resets.
                    </p>
                  </div>
                </div>
              </div>
              <div className="accordion-item">
                <h2 className="accordion-header" id="headingPID">
                  <button
                    className="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#collapsePID"
                    aria-expanded="false"
                    aria-controls="collapsePID"
                  >
                    PID Speed Control
                  </button>
                </h2>
                <div
                  id="collapsePID"
                  className="accordion-collapse collapse"
                  aria-labelledby="headingPID"
                  data-bs-parent="#technicalAccordion"
                >
                  <div className="accordion-body">
                    <p>
                      PID (Proportional-Integral-Derivative) control maintains
                      target wheel speed despite variations in battery voltage,
                      motor characteristics, or terrain. Each motor has its own
                      PID controller.
                    </p>
                    <p>
                      <strong>Tuning parameters:</strong> Kp=2.0 (proportional
                      gain), Ki=0.5 (integral gain), Kd=0.1 (derivative gain).
                      These were empirically tuned for the specific motors and
                      load.
                    </p>
                    <p>
                      <strong>Algorithm:</strong> Calculate error (setpoint -
                      current speed), accumulate integral with anti-windup
                      limiting, compute derivative (change in error), combine
                      weighted terms to generate PWM adjustment.
                    </p>
                    <p>
                      <strong>Why it matters:</strong> Without PID, motors run
                      at different speeds due to manufacturing tolerances,
                      causing the car to veer. PID compensates automatically,
                      keeping the car driving straight.
                    </p>
                  </div>
                </div>
              </div>
              <div className="accordion-item">
                <h2 className="accordion-header" id="headingWiFi">
                  <button
                    className="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#collapseWiFi"
                    aria-expanded="false"
                    aria-controls="collapseWiFi"
                  >
                    Wi-Fi Control System
                  </button>
                </h2>
                <div
                  id="collapseWiFi"
                  className="accordion-collapse collapse"
                  aria-labelledby="headingWiFi"
                  data-bs-parent="#technicalAccordion"
                >
                  <div className="accordion-body">
                    <p>
                      ESP32 operates in Access Point (AP) mode, creating its own
                      Wi-Fi network (&quot;ESP32-Car&quot;). Connect any device
                      to this network and navigate to the ESP32&apos;s IP
                      address (typically 192.168.4.1) to access the control
                      interface.
                    </p>
                    <p>
                      <strong>Web server:</strong> Built-in WebServer library
                      serves HTML control page and handles REST endpoints:
                      /forward, /backward, /left, /right, /stop, /status.
                    </p>
                    <p>
                      <strong>Control interface:</strong> Simple HTML page with
                      directional buttons (↑↓←→) and a stop button. JavaScript
                      fetch() calls send commands and polls /status every 500ms
                      for real-time position and speed display.
                    </p>
                    <p>
                      <strong>Range improvement:</strong> Initially limited to
                      10m range. Added external antenna connector and increased
                      transmit power (WIFI_POWER_19_5dBm) for 25m range.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Performance Metrics */}
          <section className="mb-5">
            <h2 className="h3 mb-3">Performance Results</h2>
            <div className="row g-3">
              <div className="col-md-6 col-lg-3">
                <div className="card text-center">
                  <div className="card-body">
                    <h3 className="h1 text-primary">0.8 m/s</h3>
                    <p className="card-text">Maximum Speed</p>
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-lg-3">
                <div className="card text-center">
                  <div className="card-body">
                    <h3 className="h1 text-primary">±5mm</h3>
                    <p className="card-text">Position Accuracy (1m)</p>
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-lg-3">
                <div className="card text-center">
                  <div className="card-body">
                    <h3 className="h1 text-primary">~50ms</h3>
                    <p className="card-text">Control Latency</p>
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-lg-3">
                <div className="card text-center">
                  <div className="card-body">
                    <h3 className="h1 text-primary">25m</h3>
                    <p className="card-text">Wi-Fi Range</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Challenges & Solutions */}
          <section className="mb-5">
            <h2 className="h3 mb-3">Challenges Solved</h2>
            <div className="row g-4">
              <div className="col-md-6">
                <div className="card h-100">
                  <div className="card-body">
                    <h3 className="h5 card-title">Encoder Noise</h3>
                    <p className="card-text">
                      <strong>Problem:</strong> Electrical noise caused false
                      encoder pulses, making position tracking inaccurate.
                    </p>
                    <p className="card-text">
                      <strong>Solution:</strong> Added 0.1µF capacitors across
                      encoder outputs, used INPUT_PULLUP mode, implemented
                      software debouncing in ISR (ignore pulses &lt; 1ms apart).
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="card h-100">
                  <div className="card-body">
                    <h3 className="h5 card-title">Motor Speed Mismatch</h3>
                    <p className="card-text">
                      <strong>Problem:</strong> Despite identical PWM values,
                      motors ran at different speeds, causing the car to veer
                      left or right.
                    </p>
                    <p className="card-text">
                      <strong>Solution:</strong> Implemented PID control for
                      each motor using encoder feedback. Real-time adjustments
                      compensate for motor differences and battery voltage drop.
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="card h-100">
                  <div className="card-body">
                    <h3 className="h5 card-title">Interrupt Overload</h3>
                    <p className="card-text">
                      <strong>Problem:</strong> Too many encoder interrupts
                      (high wheel RPM) caused ESP32 watchdog timer resets,
                      system crashes.
                    </p>
                    <p className="card-text">
                      <strong>Solution:</strong> Minimized ISR code (just
                      increment counter), moved processing to main loop, used
                      IRAM_ATTR attribute for faster ISR execution from RAM.
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="card h-100">
                  <div className="card-body">
                    <h3 className="h5 card-title">Wi-Fi Range</h3>
                    <p className="card-text">
                      <strong>Problem:</strong> Initial range limited to ~10
                      meters, connection dropped when car moved too far.
                    </p>
                    <p className="card-text">
                      <strong>Solution:</strong> Added external antenna
                      connector to ESP32, increased transmit power to maximum
                      (19.5dBm), switched to channel 1 (less interference).
                      Achieved 25m range.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Future Improvements */}
          <section className="mb-5">
            <h2 className="h3 mb-3">Future Improvements</h2>
            <ul>
              <li>
                <strong>Bluetooth Control:</strong> Lower latency alternative to
                Wi-Fi for faster response
              </li>
              <li>
                <strong>Obstacle Avoidance:</strong> Add ultrasonic sensors and
                autonomous navigation
              </li>
              <li>
                <strong>Line Following:</strong> IR sensors for track-following
                mode
              </li>
              <li>
                <strong>Camera Integration:</strong> ESP32-CAM module for
                first-person view control
              </li>
              <li>
                <strong>Battery Monitoring:</strong> ADC to measure LiPo
                voltage, display in interface, low-battery warning
              </li>
              <li>
                <strong>Mobile App:</strong> Native iOS/Android app for improved
                control ergonomics
              </li>
            </ul>
          </section>

          {/* Related Projects */}
          <section className="mb-5">
            <h2 className="h3 mb-3">Related Projects</h2>
            <div className="row g-3">
              <div className="col-md-6">
                <div className="card">
                  <div className="card-body">
                    <h3 className="h5 card-title">CYD Wireless Controller</h3>
                    <p className="card-text">
                      ESP32 display-based controller project for the wireless
                      car. Features touch interface and real-time telemetry
                      display.
                    </p>
                    <a
                      href="https://github.com/Deejpotter/cyd-wireless-controller"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-sm btn-outline-primary"
                    >
                      View on GitHub
                    </a>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="card">
                  <div className="card-body">
                    <h3 className="h5 card-title">Simple Drawbot Software</h3>
                    <p className="card-text">
                      G-code generator for pen plotters and CNC drawing
                      machines. Similar motor control concepts applied to
                      precision positioning.
                    </p>
                    <a
                      href="https://github.com/Deejpotter/simple-drawbot-software"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-sm btn-outline-primary"
                    >
                      View on GitHub
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Key Takeaways */}
          <div className="alert alert-info mb-5" role="alert">
            <h2 className="h4 alert-heading">Key Takeaways</h2>
            <p>
              The ESP32 is an excellent platform for robotics projects. Its
              dual-core processor can handle control loops and Wi-Fi
              communication simultaneously without blocking. Encoder feedback is
              essential for precision movement—without it, you&apos;re just
              guessing where your robot is. PID control compensates for
              real-world inconsistencies that simple on/off control can&apos;t
              handle.
            </p>
            <p className="mb-0">
              This project taught me that embedded systems programming requires
              thinking about timing, interrupts, and resource constraints in
              ways that web development doesn&apos;t. Every millisecond matters
              when you&apos;re running control loops at 100Hz while serving web
              requests.
            </p>
          </div>

          {/* Blog Link */}
          <div className="alert alert-secondary" role="alert">
            <strong>Want more details?</strong> Read the full technical
            write-up:{" "}
            <Link href="/blog/esp32-wireless-car" className="alert-link">
              ESP32 Wireless Car: Motor Control and Encoder Integration
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
