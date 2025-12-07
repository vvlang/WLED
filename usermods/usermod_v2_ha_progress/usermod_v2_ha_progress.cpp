#include "wled.h"

/*
 * Home Assistant Progress Bar Usermod
 * 从Home Assistant读取实体数据，将灯条显示为进度条
 * 
 * 功能：
 * - 通过HTTP API从Home Assistant读取实体状态
 * - 将状态值转换为百分比（0-100%）
 * - 在LED灯条上显示进度条效果
 * - 支持多种显示方向（正向、反向、中心扩散）
 * - 可配置更新间隔、颜色等
 */

class HAProgressBar : public Usermod {
private:
  unsigned long lastTime = 0;
  String haIP = F("192.168.1.100");  // Home Assistant IP地址
  uint16_t haPort = 8123;             // Home Assistant端口
  String haToken = F("");             // Home Assistant长期访问令牌
  String entityId = F("sensor.example"); // 要读取的实体ID
  uint16_t updateInterval = 5000;     // 更新间隔（毫秒）
  int progressPercent = 0;            // 当前进度百分比
  int direction = 0;                  // 显示方向：0=正向, 1=反向, 2=中心扩散
  uint32_t progressColor = 0x00FF00;  // 进度条颜色（默认绿色）
  uint32_t bgColor = 0x000000;        // 背景颜色（默认黑色）
  float minValue = 0.0f;              // 最小值（用于百分比计算）
  float maxValue = 100.0f;            // 最大值（用于百分比计算）
  String statePath = F("state");     // JSON路径，默认为"state"
  bool useAttributes = false;         // 是否从attributes中读取值
  String attributeKey = F("value");  // attributes中的键名
  WiFiClient wifiClient;
  char errorMessage[200] = "";
  bool initDone = false;

  static const char _name[];
  static const char _enabled[];
  bool enabled = false;

  /**
   * 从Home Assistant获取实体状态
   */
  void fetchHAState(WiFiClient &client, char *errorMessage) {
    client.setTimeout(10000);
    client.stop(); // 确保连接已关闭
    
    if (!client.connect(haIP.c_str(), haPort)) {
      strcpy(errorMessage, "连接失败");
      return;
    }

    // 构建HTTP请求
    String url = "/api/states/";
    url += entityId;
    
    String request = "GET " + url + " HTTP/1.1\r\n";
    request += "Host: " + haIP + ":" + String(haPort) + "\r\n";
    request += "Connection: close\r\n";
    request += "Accept: application/json\r\n";
    
    // 如果提供了访问令牌，添加到请求头
    if (haToken.length() > 0) {
      request += "Authorization: Bearer " + haToken + "\r\n";
    }
    
    request += "\r\n";

    // 发送请求
    if (client.print(request) == 0) {
      strcpy(errorMessage, "发送请求失败");
      client.stop();
      return;
    }

    // 等待响应
    unsigned long timeout = millis();
    while (client.available() == 0) {
      if (millis() - timeout > 10000) {
        strcpy(errorMessage, "响应超时");
        client.stop();
        return;
      }
      delay(10);
    }

    // 检查HTTP状态码
    char status[32] = {0};
    client.readBytesUntil('\r', status, sizeof(status));
    if (strcmp_P(status, PSTR("HTTP/1.1 200 OK")) != 0) {
      strcpy(errorMessage, "HTTP错误: ");
      strcat(errorMessage, status);
      client.stop();
      return;
    }

    // 跳过HTTP头
    char endOfHeaders[] = "\r\n\r\n";
    if (!client.find(endOfHeaders)) {
      strcpy(errorMessage, "无效响应");
      client.stop();
      return;
    }
  }

  /**
   * 从JSON响应中提取数值并转换为百分比
   */
  float parseValueFromJson(JsonDocument &doc) {
    float value = 0.0f;
    
    if (useAttributes && doc["attributes"].is<JsonObject>()) {
      // 从attributes中读取
      JsonObject attrs = doc["attributes"];
      if (attrs[attributeKey].is<float>()) {
        value = attrs[attributeKey].as<float>();
      } else if (attrs[attributeKey].is<int>()) {
        value = (float)attrs[attributeKey].as<int>();
      } else if (attrs[attributeKey].is<String>()) {
        value = attrs[attributeKey].as<String>().toFloat();
      }
    } else {
      // 从state中读取
      if (doc["state"].is<float>()) {
        value = doc["state"].as<float>();
      } else if (doc["state"].is<int>()) {
        value = (float)doc["state"].as<int>();
      } else if (doc["state"].is<String>()) {
        String stateStr = doc["state"].as<String>();
        // 尝试提取百分比（例如 "50%" -> 50）
        if (stateStr.indexOf("%") >= 0) {
          stateStr.replace("%", "");
        }
        value = stateStr.toFloat();
      }
    }
    
    return value;
  }

public:
  void setup() override {
    initDone = true;
  }

  void connected() override {
    // WiFi连接后可以执行初始化操作
  }

  void loop() override {
    if (!enabled || !WLED_CONNECTED || strip.isUpdating()) return;

    if (millis() - lastTime > updateInterval) {
      // 清空错误消息
      errorMessage[0] = '\0';
      
      // 获取Home Assistant状态
      fetchHAState(wifiClient, errorMessage);
      
      if (strlen(errorMessage) == 0) {
        // 解析JSON响应
        PSRAMDynamicJsonDocument doc(2048);
        DeserializationError error = deserializeJson(doc, wifiClient);
        
        if (error) {
          strcpy(errorMessage, "JSON解析失败: ");
          strcat(errorMessage, error.c_str());
          DEBUG_PRINTLN(errorMessage);
        } else {
          // 提取数值
          float value = parseValueFromJson(doc);
          
          // 转换为百分比
          if (maxValue > minValue) {
            float percent = ((value - minValue) / (maxValue - minValue)) * 100.0f;
            progressPercent = constrain((int)round(percent), 0, 100);
          } else {
            // 如果值已经是百分比格式（0-100），直接使用
            progressPercent = constrain((int)round(value), 0, 100);
          }
          
          DEBUG_PRINT(F("HA实体值: "));
          DEBUG_PRINT(value);
          DEBUG_PRINT(F(", 百分比: "));
          DEBUG_PRINT(progressPercent);
          DEBUG_PRINTLN(F("%"));
        }
      } else {
        DEBUG_PRINTLN(errorMessage);
      }
      
      wifiClient.stop();
      lastTime = millis();
    }
  }

  void addToJsonInfo(JsonObject& root) override {
    if (!enabled) return;
    
    JsonObject user = root["u"];
    if (user.isNull()) user = root.createNestedObject("u");

    JsonArray infoArr = user.createNestedArray(FPSTR(_name));
    String infoStr = String(progressPercent) + F("%");
    if (strlen(errorMessage) > 0) {
      infoStr += F(" (错误)");
    }
    infoArr.add(infoStr);
  }

  void addToJsonState(JsonObject& root) override {
    if (!initDone || !enabled) return;

    JsonObject usermod = root[FPSTR(_name)];
    if (usermod.isNull()) usermod = root.createNestedObject(FPSTR(_name));
    
    usermod["enabled"] = enabled;
    usermod["progress"] = progressPercent;
    usermod["entity"] = entityId;
    if (strlen(errorMessage) > 0) {
      usermod["error"] = errorMessage;
    }
  }

  void readFromJsonState(JsonObject& root) override {
    if (!initDone) return;

    JsonObject usermod = root[FPSTR(_name)];
    if (!usermod.isNull()) {
      if (usermod[FPSTR(_enabled)].is<bool>()) {
        enabled = usermod[FPSTR(_enabled)].as<bool>();
      }
    }
  }

  void addToConfig(JsonObject& root) override {
    JsonObject top = root.createNestedObject(FPSTR(_name));
    top[FPSTR(_enabled)] = enabled;
    top["ha-ip"] = haIP;
    top["ha-port"] = haPort;
    top["ha-token"] = haToken;
    top["entity-id"] = entityId;
    top["update-interval"] = updateInterval;
    top["direction"] = direction;
    top["progress-color"] = progressColor;
    top["bg-color"] = bgColor;
    top["min-value"] = minValue;
    top["max-value"] = maxValue;
    top["use-attributes"] = useAttributes;
    top["attribute-key"] = attributeKey;
  }

  bool readFromConfig(JsonObject& root) override {
    JsonObject top = root[FPSTR(_name)];

    bool configComplete = !top.isNull();
    
    if (configComplete) {
      getJsonValue(top[FPSTR(_enabled)], enabled);
      getJsonValue(top["ha-ip"], haIP);
      getJsonValue(top["ha-port"], haPort);
      getJsonValue(top["ha-token"], haToken);
      getJsonValue(top["entity-id"], entityId);
      getJsonValue(top["update-interval"], updateInterval, 5000);
      getJsonValue(top["direction"], direction, 0);
      getJsonValue(top["progress-color"], progressColor, 0x00FF00);
      getJsonValue(top["bg-color"], bgColor, 0x000000);
      getJsonValue(top["min-value"], minValue, 0.0f);
      getJsonValue(top["max-value"], maxValue, 100.0f);
      getJsonValue(top["use-attributes"], useAttributes, false);
      getJsonValue(top["attribute-key"], attributeKey);
    }
    
    return configComplete;
  }

  void appendConfigData() override {
    oappend(F("addInfo('")); 
    oappend(String(FPSTR(_name)).c_str()); 
    oappend(F(":ha-ip")); 
    oappend(F("',1,'<i>Home Assistant的IP地址</i>');"));
    
    oappend(F("addInfo('")); 
    oappend(String(FPSTR(_name)).c_str()); 
    oappend(F(":ha-port")); 
    oappend(F("',1,'<i>Home Assistant的端口（默认8123）</i>');"));
    
    oappend(F("addInfo('")); 
    oappend(String(FPSTR(_name)).c_str()); 
    oappend(F(":ha-token")); 
    oappend(F("',1,'<i>长期访问令牌（在HA中创建）</i>');"));
    
    oappend(F("addInfo('")); 
    oappend(String(FPSTR(_name)).c_str()); 
    oappend(F(":entity-id")); 
    oappend(F("',1,'<i>实体ID，如sensor.battery_level</i>');"));
    
    oappend(F("addInfo('")); 
    oappend(String(FPSTR(_name)).c_str()); 
    oappend(F(":update-interval")); 
    oappend(F("',1,'<i>更新间隔（毫秒）</i>');"));
    
    oappend(F("addInfo('")); 
    oappend(String(FPSTR(_name)).c_str()); 
    oappend(F(":direction")); 
    oappend(F("',1,'<i>0=正向, 1=反向, 2=中心扩散</i>');"));
    
    oappend(F("addInfo('")); 
    oappend(String(FPSTR(_name)).c_str()); 
    oappend(F(":min-value")); 
    oappend(F("',1,'<i>最小值（用于百分比计算）</i>');"));
    
    oappend(F("addInfo('")); 
    oappend(String(FPSTR(_name)).c_str()); 
    oappend(F(":max-value")); 
    oappend(F("',1,'<i>最大值（用于百分比计算）</i>');"));
  }

  /**
   * 在LED条上绘制进度条
   */
  void handleOverlayDraw() override {
    if (!enabled) return;

    uint16_t totalLEDs = strip.getLengthTotal();
    uint16_t activeLEDs = (totalLEDs * progressPercent) / 100;

    if (direction == 0) {
      // 正向：从左到右
      for (uint16_t i = 0; i < totalLEDs; i++) {
        if (i < activeLEDs) {
          strip.setPixelColor(i, progressColor);
        } else {
          strip.setPixelColor(i, bgColor);
        }
      }
    } else if (direction == 1) {
      // 反向：从右到左
      for (uint16_t i = 0; i < totalLEDs; i++) {
        if (i < (totalLEDs - activeLEDs)) {
          strip.setPixelColor(i, bgColor);
        } else {
          strip.setPixelColor(i, progressColor);
        }
      }
    } else if (direction == 2) {
      // 中心扩散：从中心向两边
      uint16_t center = totalLEDs / 2;
      uint16_t halfActive = activeLEDs / 2;
      
      for (uint16_t i = 0; i < totalLEDs; i++) {
        uint16_t distanceFromCenter = abs((int16_t)i - (int16_t)center);
        if (distanceFromCenter < halfActive) {
          strip.setPixelColor(i, progressColor);
        } else {
          strip.setPixelColor(i, bgColor);
        }
      }
    }
  }

  uint16_t getId() override {
    return USERMOD_ID_HA_PROGRESS;
  }
};

const char HAProgressBar::_name[] PROGMEM = "HA_Progress";
const char HAProgressBar::_enabled[] PROGMEM = "enabled";

static HAProgressBar haProgressBar;
REGISTER_USERMOD(haProgressBar);

