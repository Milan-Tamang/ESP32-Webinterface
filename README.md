# ESP32 Web LED Controller

This project allows you to control the built-in LED on an ESP32 via a web interface. You can toggle the LED, set it to flash with a custom delay, and view its current state directly from your browser.

## Features
- Toggle the built-in LED from a web page
- Set a custom flash delay (in milliseconds)
- See live LED state (ON/OFF) in the web interface
- LED state is printed to Serial at 115200 baud
- ESP32 serves the web interface from SPIFFS
- Works as a WiFi Access Point (default) or can be configured to connect to an existing WiFi network

## File Structure
```
Web Interface Test/
├── data/
│   └── web/
│       ├── index.html
│       ├── style.css
│       └── script.js
├── src/
│   └── main.cpp         # ESP32 firmware
├── platformio.ini       # PlatformIO config
└── README.md            # This file
```

## Basic Setup

### 1. Prerequisites
- ESP32 development board
- PlatformIO (recommended) or Arduino IDE

### 2. Build & Upload
1. Open this project in PlatformIO or your IDE.
2. Connect your ESP32 to your computer.
3. Build and upload the firmware (`main.cpp`).
4. 

### 3. Connect to ESP32
By default, the ESP32 creates its own WiFi hotspot:
- SSID: `ESP32-LED`
- Password: `12345678`

1. On your phone or computer, connect to the `ESP32-LED` WiFi network.
2. Open a browser and go to: [http://192.168.4.1/web/index.html](http://192.168.4.1/web/index.html)

### 4. Using the Web Interface
- **Toggle LED:** Click the toggle button to switch the LED ON/OFF.
- **Flash LED:** Enter a delay (minimum 100 ms) and click the flash button to make the LED flash.
- **LED State:** The indicator shows the current state. Serial monitor also prints ON/OFF.

### 5. Connect to Mobile Hotspot (Optional)
To connect the ESP32 to your phone's hotspot instead of creating its own:
1. Change the `ssid` and `password` in `main.cpp` to match your hotspot.
2. Replace `WiFi.softAP(ssid, password);` with:
   ```cpp
   WiFi.begin(ssid, password);
   while (WiFi.status() != WL_CONNECTED) {
     delay(500);
     Serial.print(".");
   }
   Serial.println("Connected!");
   Serial.println(WiFi.localIP());
   ```
3. After upload, check the Serial Monitor for the ESP32's IP address and use it in your browser.

## Troubleshooting
- If the web page doesn't load, check your WiFi connection and ensure the ESP32 is running.
- Use the Serial Monitor (115200 baud) for debug output.
- Make sure the web files are uploaded to SPIFFS if using Arduino IDE.

## Uploading Files to SPIFFS (VSCode + PlatformIO)

### Initial Setup
1. Make sure your web files are in the correct location:
   ```
   Web Interface Test/
   ├── data/
   │   └── web/
   │       ├── index.html
   │       ├── style.css
   │       └── script.js
   ```

2. If your `platformio.ini` doesn't have SPIFFS configuration, add:
   ```ini
   board_build.filesystem = spiffs
   ```

### Uploading SPIFFS
1. In VSCode, click on the PlatformIO icon in the sidebar (looks like an alien head)
2. Under "PROJECT TASKS", expand your project
3. Look for "Platform" section
4. Click "Build Filesystem Image" to build SPIFFS
5. Click "Upload Filesystem Image" to upload to ESP32

Alternative method using Command Palette:
1. Press `Ctrl+Shift+P` (Windows/Linux) or `Cmd+Shift+P` (Mac)
2. Type "PlatformIO: Upload Filesystem Image"
3. Press Enter

### Tips
- Always upload SPIFFS after making changes to web files
- Upload SPIFFS before uploading firmware
- If web interface shows "not found", verify SPIFFS upload was successful
- Check Serial Monitor for any SPIFFS-related messages

## License
MIT
