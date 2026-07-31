#include <Arduino.h>
#include <SPI.h>
#include <MFRC522.h>
#include <WiFi.h>
#include <WiFiClientSecure.h>
#include <HTTPClient.h>

const int lock = 1;
const int buzzer = 2;
const int led_strip = 3;
const int LED_R = 4;
const int button = 5;

#define TRIG_PIN 6
#define ECHO_PIN 7

#define RST_PIN 8
#define SS_PIN 9

MFRC522 mfrc522(SS_PIN, RST_PIN);

bool isFirstTap = true;
bool refresh = false;
String tap = "KUNCI";

// Konfigurasi WiFi
const char *ssid = "CPS LAB";
const char *password = "CPSLaboratory";

String API_URL = "https://gewhvhqlzyqcqjqbfonr.supabase.co/rest/v1/";
String API_KEY = "sb_publishable_2_doS0Q8qbFFf8KqG8AFmg_adKkllCA";
String BACKEND_URL = "http://192.168.0.206:3000";

String TableUsers = "users";
String TableLogs = "usage_history";
WiFiClientSecure client;

String uidString = "";
String status_barang = "";

void setup()
{
  pinMode(LED_BUILTIN, OUTPUT);
  digitalWrite(LED_BUILTIN, HIGH);

  client.setInsecure();
  Serial.begin(115200);

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
    digitalWrite(TRIG_PIN, LOW);
    delayMicroseconds(2);
    digitalWrite(TRIG_PIN, HIGH);
    delayMicroseconds(10);
    digitalWrite(TRIG_PIN, LOW);

    long duration = pulseIn(ECHO_PIN, HIGH);
    int distance_cm = (duration / 2) / 29.1;

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

