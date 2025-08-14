#include <WiFi.h>
#include <WebServer.h>
#include <SPIFFS.h>


#define PIN_21 21
#define PIN_22 22
#define PIN_19 19
#define PIN_23 23

bool pin21State = false;
bool pin22State = false;
bool pin19State = false;
bool pin23State = false;

const char *ssid = "ESP32-LED";
const char *password = "12345678";

WebServer server(80);
bool ledState = false;
bool flashing = false;
unsigned long flashDelay = 500;
unsigned long lastFlash = 0;

void handleRoot()
{
  server.send(200, "text/html", "<html><head><meta http-equiv='refresh' content='0; url=/web/index.html'></head></html>");
}

void handleToggle()
{
  flashing = false;
  ledState = !ledState;
  digitalWrite(LED_BUILTIN, ledState);
  Serial.println(ledState ? "ON" : "OFF");
  server.send(200, "application/json", String("{\"led\":") + (ledState ? "true" : "false") + "}");
}

void handleTogglePin21()
{
  pin21State = !pin21State;
  digitalWrite(PIN_21, pin21State);
  Serial.printf("Pin 21 toggled to %s\n", pin21State ? "ON" : "OFF");
  server.send(200, "application/json", String("{\"state\":") + (pin21State ? "true" : "false") + "}");
}

void handleTogglePin22()
{
  pin22State = !pin22State;
  digitalWrite(PIN_22, pin22State);
  Serial.printf("Pin 22 toggled to %s\n", pin22State ? "ON" : "OFF");
  server.send(200, "application/json", String("{\"state\":") + (pin22State ? "true" : "false") + "}");
}

void handleTogglePin19()
{
  pin19State = !pin19State;
  digitalWrite(PIN_19, pin19State);
  Serial.printf("Pin 19 toggled to %s\n", pin19State ? "ON" : "OFF");
  server.send(200, "application/json", String("{\"state\":") + (pin19State ? "true" : "false") + "}");
}

void handleTogglePin23()
{
  pin23State = !pin23State;
  digitalWrite(PIN_23, pin23State);
  Serial.printf("Pin 23 toggled to %s\n", pin23State ? "ON" : "OFF");
  server.send(200, "application/json", String("{\"state\":") + (pin23State ? "true" : "false") + "}");
}

void handleFlash()
{
  flashing = true;
  if (server.hasArg("value"))
  {
    flashDelay = server.arg("value").toInt();
    if (flashDelay < 100)
      flashDelay = 100;
  }
  server.send(200, "application/json", String("{\"led\":") + (ledState ? "true" : "false") + "}");
}

void handleState()
{
  server.send(200, "application/json", String("{\"led\":") + (ledState ? "true" : "false") + "}");
}

void handleHold()
{
  if (server.hasArg("state")) {
    flashing = false;
    ledState = (server.arg("state") == "true");
    digitalWrite(LED_BUILTIN, ledState);
    Serial.printf("LED held %s\n", ledState ? "ON" : "OFF");
    server.send(200, "application/json", String("{\"led\":") + (ledState ? "true" : "false") + "}");
  }
}

void setup()
{
  Serial.begin(115200);
  pinMode(LED_BUILTIN, OUTPUT);
  pinMode(PIN_21, OUTPUT);
  pinMode(PIN_22, OUTPUT);
  pinMode(PIN_19, OUTPUT);
  pinMode(PIN_23, OUTPUT);
  digitalWrite(LED_BUILTIN, LOW);
  digitalWrite(PIN_21, LOW);
  digitalWrite(PIN_22, LOW);
  digitalWrite(PIN_19, LOW);
  digitalWrite(PIN_23, LOW);
  WiFi.softAP(ssid, password);
  server.on("/", handleRoot);
  server.on("/toggle", handleToggle);
  server.on("/flash", handleFlash);
  server.on("/state", handleState);
  server.on("/hold", handleHold);
  server.on("/toggle21", handleTogglePin21);
  server.on("/toggle22", handleTogglePin22);
  server.on("/toggle19", handleTogglePin19);
  server.on("/toggle23", handleTogglePin23);
  server.serveStatic("/web/", SPIFFS, "/web/");
  SPIFFS.begin(true);
  server.begin();
}

void loop()
{
  server.handleClient();
  if (flashing)
  {
    unsigned long now = millis();
    if (now - lastFlash >= flashDelay)
    {
      ledState = !ledState;
      digitalWrite(LED_BUILTIN, ledState);
      Serial.println(ledState ? "ON" : "OFF");
      lastFlash = now;
    }
  }
}