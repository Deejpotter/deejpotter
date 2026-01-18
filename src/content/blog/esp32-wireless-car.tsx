import { BlogPost } from "@/lib/blog";

const content = (
  <article className="blog-post">
    <p className="lead">
      Building a precision-controlled wireless car using ESP32 microcontroller,
      DC motors with encoders, and Wi-Fi control interface. Position accuracy:
      ±5mm over 1 meter travel.
    </p>

    <h2>Hardware Overview</h2>

    <h3>Components</h3>
    <ul>
      <li>
        <strong>ESP32-WROOM-32:</strong> Dual-core 240MHz, Wi-Fi/Bluetooth, 34
        GPIO pins
      </li>
      <li>
        <strong>L298N H-Bridge:</strong> Controls 2 DC motors, PWM speed control
      </li>
      <li>
        <strong>DC Motors with Encoders:</strong> 6V motors, Hall effect
        encoders (960 pulses/revolution)
      </li>
      <li>
        <strong>Power:</strong> 7.4V 2S LiPo battery, 5V buck converter
      </li>
    </ul>

    <h2>Motor Control Implementation</h2>

    <h3>PWM Speed Control</h3>
    <p>
      ESP32 has 16 PWM channels. Using 4 for motor control (2 motors × 2
      directions):
    </p>

    <pre>
      <code>{`// Motor pin definitions
#define MOTOR_A_IN1 25
#define MOTOR_A_IN2 26
#define MOTOR_A_PWM 27

#define MOTOR_B_IN1 32
#define MOTOR_B_IN2 33
#define MOTOR_B_PWM 14

// PWM configuration
#define PWM_FREQ 1000    // 1kHz
#define PWM_RESOLUTION 8 // 0-255

void setupMotors() {
  // Configure PWM channels
  ledcSetup(0, PWM_FREQ, PWM_RESOLUTION); // Motor A
  ledcSetup(1, PWM_FREQ, PWM_RESOLUTION); // Motor B
  
  // Attach PWM to pins
  ledcAttachPin(MOTOR_A_PWM, 0);
  ledcAttachPin(MOTOR_B_PWM, 1);
  
  // Direction pins as outputs
  pinMode(MOTOR_A_IN1, OUTPUT);
  pinMode(MOTOR_A_IN2, OUTPUT);
  pinMode(MOTOR_B_IN1, OUTPUT);
  pinMode(MOTOR_B_IN2, OUTPUT);
}`}</code>
    </pre>

    <h3>Movement Functions</h3>
    <pre>
      <code>{`void setMotorSpeed(uint8_t motor, int speed) {
  // speed: -255 to +255 (negative = reverse)
  uint8_t pwmChannel = (motor == MOTOR_A) ? 0 : 1;
  uint8_t in1 = (motor == MOTOR_A) ? MOTOR_A_IN1 : MOTOR_B_IN1;
  uint8_t in2 = (motor == MOTOR_A) ? MOTOR_A_IN2 : MOTOR_B_IN2;
  
  if (speed > 0) {
    // Forward
    digitalWrite(in1, HIGH);
    digitalWrite(in2, LOW);
    ledcWrite(pwmChannel, speed);
  } else if (speed < 0) {
    // Reverse
    digitalWrite(in1, LOW);
    digitalWrite(in2, HIGH);
    ledcWrite(pwmChannel, abs(speed));
  } else {
    // Stop
    digitalWrite(in1, LOW);
    digitalWrite(in2, LOW);
    ledcWrite(pwmChannel, 0);
  }
}`}</code>
    </pre>

    <h2>Encoder Integration</h2>

    <h3>Hardware Connections</h3>
    <p>Encoders connected to GPIO with interrupt capability:</p>

    <pre>
      <code>{`#define ENCODER_A_PIN1 18
#define ENCODER_A_PIN2 19
#define ENCODER_B_PIN1 21
#define ENCODER_B_PIN2 22

volatile long encoderA_count = 0;
volatile long encoderB_count = 0;

void IRAM_ATTR encoderA_ISR() {
  int stateA = digitalRead(ENCODER_A_PIN1);
  int stateB = digitalRead(ENCODER_A_PIN2);
  
  // Determine direction based on phase relationship
  if (stateA == stateB) {
    encoderA_count++;
  } else {
    encoderA_count--;
  }
}

void setupEncoders() {
  pinMode(ENCODER_A_PIN1, INPUT_PULLUP);
  pinMode(ENCODER_A_PIN2, INPUT_PULLUP);
  pinMode(ENCODER_B_PIN1, INPUT_PULLUP);
  pinMode(ENCODER_B_PIN2, INPUT_PULLUP);
  
  // Attach interrupts
  attachInterrupt(digitalPinToInterrupt(ENCODER_A_PIN1), encoderA_ISR, CHANGE);
  attachInterrupt(digitalPinToInterrupt(ENCODER_B_PIN1), encoderB_ISR, CHANGE);
}`}</code>
    </pre>

    <h3>Position Tracking</h3>
    <p>Convert encoder pulses to distance:</p>

    <pre>
      <code>{`#define WHEEL_DIAMETER 65.0  // mm
#define PULSES_PER_REV 960.0

float getDistance(long pulses) {
  float revolutions = pulses / PULSES_PER_REV;
  float circumference = PI * WHEEL_DIAMETER;
  return revolutions * circumference; // mm
}`}</code>
    </pre>

    <h2>Precision Movement</h2>

    <h3>Move Specific Distance</h3>
    <p>Use encoders for precise distance control:</p>

    <pre>
      <code>{`void moveDistance(float targetDistance, uint8_t speed) {
  // Reset encoders
  encoderA_count = 0;
  encoderB_count = 0;
  
  // Calculate target pulses
  float revolutions = targetDistance / (PI * WHEEL_DIAMETER);
  long targetPulses = revolutions * PULSES_PER_REV;
  
  // Move forward
  moveForward(speed);
  
  // Wait until target reached
  while (abs(encoderA_count) < targetPulses && 
         abs(encoderB_count) < targetPulses) {
    delay(10);
  }
  
  // Stop
  stopMotors();
}`}</code>
    </pre>

    <h3>PID Speed Control</h3>
    <p>Maintain consistent speed despite load variations:</p>

    <pre>
      <code>{`struct PID {
  float kp = 2.0;
  float ki = 0.5;
  float kd = 0.1;
  
  float setpoint = 0;
  float integral = 0;
  float lastError = 0;
};

float calculatePID(PID &pid, float current) {
  float error = pid.setpoint - current;
  
  pid.integral += error;
  pid.integral = constrain(pid.integral, -100, 100); // Anti-windup
  
  float derivative = error - pid.lastError;
  pid.lastError = error;
  
  float output = (pid.kp * error) + 
                 (pid.ki * pid.integral) + 
                 (pid.kd * derivative);
  
  return constrain(output, -255, 255);
}`}</code>
    </pre>

    <h2>Wireless Control</h2>

    <h3>Wi-Fi Access Point Mode</h3>
    <p>ESP32 creates its own network:</p>

    <pre>
      <code>{`#include <WiFi.h>
#include <WebServer.h>

const char* ssid = "ESP32-Car";
const char* password = "12345678";

WebServer server(80);

void setupWiFi() {
  WiFi.softAP(ssid, password);
  IPAddress IP = WiFi.softAPIP();
  
  // Define routes
  server.on("/", handleRoot);
  server.on("/forward", handleForward);
  server.on("/backward", handleBackward);
  server.on("/left", handleLeft);
  server.on("/right", handleRight);
  server.on("/stop", handleStop);
  server.on("/status", handleStatus);
  
  server.begin();
}

void handleStatus() {
  float distA = getDistance(encoderA_count);
  float distB = getDistance(encoderB_count);
  
  String json = "{";
  json += "\\"distanceA\\":" + String(distA) + ",";
  json += "\\"distanceB\\":" + String(distB) + ",";
  json += "\\"rpmA\\":" + String(currentRPM_A) + ",";
  json += "\\"rpmB\\":" + String(currentRPM_B);
  json += "}";
  
  server.send(200, "application/json", json);
}`}</code>
    </pre>

    <h3>Web Interface</h3>
    <p>
      Simple HTML control panel served by ESP32 with directional buttons and
      real-time status display.
    </p>

    <h2>Challenges Solved</h2>

    <h3>1. Encoder Noise</h3>
    <p>
      <strong>Problem:</strong> False pulses from electrical noise causing
      inaccurate counts.
    </p>
    <p>
      <strong>Solution:</strong> Added 0.1µF capacitors across encoder outputs,
      used INPUT_PULLUP mode, implemented debouncing in ISR (ignore changes &lt;
      1ms apart).
    </p>

    <h3>2. Motor Speed Mismatch</h3>
    <p>
      <strong>Problem:</strong> Motors don&apos;t run at same speed despite same
      PWM value. Car veers left/right.
    </p>
    <p>
      <strong>Solution:</strong> Calibrated motor speed profiles, PID control to
      maintain target RPM, real-time adjustment based on encoder feedback.
    </p>

    <h3>3. Interrupt Overload</h3>
    <p>
      <strong>Problem:</strong> Too many encoder interrupts causing ESP32
      watchdog resets.
    </p>
    <p>
      <strong>Solution:</strong> Moved heavy processing out of ISRs (just count,
      process in loop), used IRAM_ATTR for faster execution, reduced encoder
      resolution for simple projects.
    </p>

    <h3>4. Wi-Fi Range</h3>
    <p>
      <strong>Problem:</strong> Connection drops beyond 10 meters.
    </p>
    <p>
      <strong>Solution:</strong> External antenna on ESP32, increased Wi-Fi
      transmit power to max (19.5dBm), changed to channel 1 (less interference).
    </p>

    <h2>Performance Results</h2>
    <div className="row">
      <div className="col-md-6">
        <ul>
          <li>
            <strong>Speed:</strong> 0.8 m/s maximum
          </li>
          <li>
            <strong>Battery life:</strong> 45 minutes continuous
          </li>
          <li>
            <strong>Control latency:</strong> ~50ms
          </li>
        </ul>
      </div>
      <div className="col-md-6">
        <ul>
          <li>
            <strong>Position accuracy:</strong> ±5mm over 1m
          </li>
          <li>
            <strong>Wi-Fi range:</strong> 25 meters
          </li>
        </ul>
      </div>
    </div>

    <h2>Future Improvements</h2>
    <ol>
      <li>
        <strong>Bluetooth Control:</strong> Lower latency alternative to Wi-Fi
      </li>
      <li>
        <strong>Obstacle Avoidance:</strong> Ultrasonic sensors + autonomous
        navigation
      </li>
      <li>
        <strong>Line Following:</strong> IR sensors for track following
      </li>
      <li>
        <strong>Camera Integration:</strong> ESP32-CAM for FPV control
      </li>
      <li>
        <strong>Battery Monitoring:</strong> ADC for voltage measurement,
        low-battery warning
      </li>
    </ol>

    <div className="alert alert-success mt-4">
      <strong>Key Takeaway:</strong> ESP32 ideal for robotics projects.
      Dual-core processor handles control loops and Wi-Fi simultaneously.
      Encoder feedback essential for precision movement. PID control compensates
      for real-world inconsistencies.
    </div>

    <p>
      <strong>Code Repository:</strong>{" "}
      <a
        href="https://github.com/Deejpotter/esp32-wireless-car"
        target="_blank"
        rel="noopener noreferrer"
      >
        github.com/Deejpotter/esp32-wireless-car
      </a>
    </p>
  </article>
);

export const esp32CarPost: BlogPost = {
  slug: "esp32-wireless-car",
  title: "ESP32 Wireless Car: Motor Control and Encoder Integration",
  date: "2024-11-04",
  excerpt:
    "Building a precision-controlled wireless car with ESP32, L298N motor driver, and Hall effect encoders. PID control for consistent speed, Wi-Fi web interface, ±5mm position accuracy.",
  tags: ["esp32", "hardware", "embedded", "robotics"],
  content,
  readTime: 9,
  bookstackUrl:
    "http://bookstack.deejpotter.com/books/technical-blog-project-write-ups/page/esp32-wireless-car-motor-control-and-encoder-integration",
};
