#include <Arduino.h>
#include <SPI.h>
#include <MFRC522.h>
#include <WiFi.h>
#include <WiFiClientSecure.h>
#include <HTTPClient.h>

const int lock = 1;       // GPIO 1 (Solenoid) - SESUAI WIRING YANG SUDAH DIRAKIT
const int buzzer = 2;     // GPIO 2 (Buzzer) - SESUAI WIRING YANG SUDAH DIRAKIT
const int led_strip = 3;  // GPIO 3 (Relay LED Strip)
const int LED_R = 4;      // GPIO 4 (LED Indikator Merah)
const int button = 5;     // GPIO 5 (Tombol Refresh)

#define TRIG_PIN 6
#define ECHO_PIN 7

#define RST_PIN 8
#define SS_PIN 9

MFRC522 mfrc522(SS_PIN, RST_PIN);

bool isFirstTap = true;
bool refresh = false;
String tap = "KUNCI";

// Konfigurasi WiFi
const char *ssid = "CPS LAB_2.4G";
const char *password = "CPSLaboratory";

String API_URL = "https://gewhvhqlzyqcqjqbfonr.supabase.co/rest/v1/";
String API_KEY = "sb_publishable_2_doS0Q8qbFFf8KqG8AFmg_adKkllCA";
// Sesuaikan jika alamat IPv4 laptop berubah saat berganti jaringan.
String BACKEND_URL = "http://192.168.0.169:3000";

String TableUsers = "users";
String TableLogs = "usage_history";
WiFiClientSecure client;

String uidString = "";
String status_barang = "";
String last_reported_status = "";
unsigned long last_report_attempt_ms = 0;
unsigned long last_report_success_ms = 0;
unsigned long last_sensor_sample_ms = 0;
bool has_report_attempt = false;

void reportBoxStatus(int distance_cm)
{
  const unsigned long now = millis();
  if ((has_report_attempt && now - last_report_attempt_ms < 5000) ||
      (status_barang == last_reported_status && now - last_report_success_ms < 30000))
  {
    return;
  }

  has_report_attempt = true;
  last_report_attempt_ms = now;

  HTTPClient http;
  http.setConnectTimeout(5000);
  http.setTimeout(15000);
  if (!http.begin(BACKEND_URL + "/availability/report"))
  {
    Serial.println("Box Status: cannot initialize HTTP request");
    http.end();
    return;
  }
  http.addHeader("Content-Type", "application/json");

  String payload = "{\"status\":\"" + status_barang + "\",\"distance_cm\":" + String(distance_cm) + "}";
  Serial.println("Box Status Payload: " + payload);
  int httpCode = http.POST(payload);
  String response = http.getString();

  Serial.print("Box Status HTTP Code: ");
  Serial.println(httpCode);
  Serial.println("Box Status Response: " + response);

  if (httpCode >= 200 && httpCode < 300)
  {
    last_reported_status = status_barang;
    last_report_success_ms = millis();
  }
  else if (httpCode < 0)
  {
    Serial.println("Box Status Error: " + HTTPClient::errorToString(httpCode));
  }

  http.end();
}

void setup()
{
  pinMode(LED_BUILTIN, OUTPUT);
  digitalWrite(LED_BUILTIN, HIGH);

  client.setInsecure();
  Serial.begin(115200);
  Serial.println("SiJaga firmware: ultrasonic-report-v2");
  Serial.println("Backend: " + BACKEND_URL);

  pinMode(lock, OUTPUT);
  pinMode(led_strip, OUTPUT);
  pinMode(TRIG_PIN, OUTPUT);
  pinMode(ECHO_PIN, INPUT);
  pinMode(LED_R, OUTPUT);
  pinMode(buzzer, OUTPUT);
  pinMode(button, INPUT_PULLUP);

  // Kondisi Awal: Relay MATI (Solenoid Terkunci & LED Strip MATI)
  digitalWrite(lock, HIGH);
  digitalWrite(led_strip, HIGH);

  digitalWrite(LED_R, LOW);
  noTone(buzzer);

  SPI.begin();
  mfrc522.PCD_Init();

  Serial.print("Connecting to ");
  Serial.println(ssid);
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED)
  {
    delay(500);
    Serial.print(".");
  }

  Serial.println("\nWiFi connected.");
}

void loop()
{
  if (WiFi.status() == WL_CONNECTED)
  {
    digitalWrite(LED_BUILTIN, LOW);

    // ================= LOGIKA ULTRASONIK =================
    if (last_sensor_sample_ms == 0 || millis() - last_sensor_sample_ms >= 500)
    {
      last_sensor_sample_ms = millis();
      digitalWrite(TRIG_PIN, LOW);
      delayMicroseconds(2);
      digitalWrite(TRIG_PIN, HIGH);
      delayMicroseconds(10);
      digitalWrite(TRIG_PIN, LOW);

      long duration = pulseIn(ECHO_PIN, HIGH, 30000);
      if (duration == 0)
      {
        Serial.println("Ultrasonic timeout");
      }
      else
      {
        int distance_cm = (duration / 2) / 29.1;
        Serial.print("Ultrasonic distance (cm): ");
        Serial.println(distance_cm);

        if (distance_cm < 15)
        {
          digitalWrite(LED_R, HIGH);
          status_barang = "ADA BARANG";
        }
        else
        {
          digitalWrite(LED_R, LOW);
          status_barang = "TIDAK ADA BARANG";
        }

        reportBoxStatus(distance_cm);
      }
    }

    // ================= LOGIKA BUTTON REFRESH =================
    if (digitalRead(button) == LOW)
    {
      refresh = true;
    }
    else if (refresh)
    {
      Serial.println("System refreshed");
      digitalWrite(lock, LOW);
      digitalWrite(led_strip, LOW);
      delay(1000);
      ESP.restart();
      refresh = false;
    }

    // ================= LOGIKA RFID SCAN =================
    if (!mfrc522.PICC_IsNewCardPresent() || !mfrc522.PICC_ReadCardSerial())
    {
      return;
    }

    Serial.print("UID tag :");
    String content = "";
    for (byte i = 0; i < mfrc522.uid.size; i++)
    {
      content.concat(String(mfrc522.uid.uidByte[i] < 0x10 ? "0" : ""));
      content.concat(String(mfrc522.uid.uidByte[i], HEX));
    }
    content.toUpperCase();
    uidString = content;
    Serial.println(uidString);

    // ================= JALUR PROSES DATABASE =================
    HTTPClient https;

    // Cek status pendaftaran UID di tabel 'users'
    String checkURL = API_URL + TableUsers + "?card_id=eq." + uidString + "&select=status";
    https.begin(client, checkURL);
    https.addHeader("apikey", API_KEY);
    https.addHeader("Authorization", "Bearer " + API_KEY);

    int httpCode = https.GET();
    String response = https.getString();
    https.end();

    Serial.print("Check User HTTP Code: ");
    Serial.println(httpCode);
    Serial.println("Server Response: " + response);

    // KONDISI A: Jika kartu BELUM PERNAH TERDAFTAR (Array kosong "[]")
    if (httpCode == 200 && response == "[]")
    {
      Serial.println("Kartu Baru!");

      HTTPClient localHttp;

      localHttp.begin(
          BACKEND_URL + "/card-id/create");

      localHttp.addHeader(
          "Content-Type",
          "application/json");

      String payload = "{\"cardId\":\"" + uidString + "\"}";

      int code = localHttp.POST(payload);

      String result =
          localHttp.getString();

      Serial.println(code);
      Serial.println(result);

      localHttp.end();

      digitalWrite(buzzer, HIGH);
      delay(150);
      digitalWrite(buzzer, LOW);

      delay(100);

      digitalWrite(buzzer, HIGH);
      delay(150);
      digitalWrite(buzzer, LOW);
    }

    // KONDISI B & C: Jika kartu sudah ada di database, periksa persetujuan admin web
    else if (httpCode == 200 && response != "[]")
    {

      if (response.indexOf("APPROVED") > -1)
      {
        HTTPClient localHttp;

        localHttp.begin(
            BACKEND_URL +
            "/history/scan-locker");

        localHttp.addHeader(
            "Content-Type",
            "application/json");

        String payload = "{\"cardId\":\"" + uidString + "\",\"name\":\"" + status_barang + "\"}";
        int code = localHttp.POST(payload);

        String result =
            localHttp.getString();

        Serial.println(result);

        localHttp.end();

        if (result.indexOf("OPEN") > -1)
        {
          Serial.println("Locker OPEN");

          digitalWrite(lock, LOW);
          digitalWrite(led_strip, LOW);

          delay(5000);

          digitalWrite(lock, HIGH);
          digitalWrite(led_strip, HIGH);

          digitalWrite(buzzer, HIGH);
          delay(200);
          digitalWrite(buzzer, LOW);
        }
        else
        {
          Serial.println("ACCESS DENIED");

          digitalWrite(buzzer, HIGH);
          delay(1000);
          digitalWrite(buzzer, LOW);
        }
      }
    }
    else
    {
      Serial.println("Gagal terhubung ke database.");
    }

    delay(2000);
  }
}