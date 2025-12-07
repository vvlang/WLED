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
  uint32_t progressColor = 0x00FF00;  // 进度条颜色（默认绿色）- 单色模式使用
  uint32_t bgColor = 0x000000;        // 背景颜色（默认黑色）
  bool useMultiColor = false;         // 是否使用多色模式
  bool useUniformColor = false;        // 是否使用整体变色模式（所有LED显示相同颜色，根据当前进度）
  uint32_t colorPoints[5] = {0xFF0000, 0xFFFF00, 0x00FF00, 0x00FFFF, 0x0000FF}; // 多色模式颜色点（红-黄-绿-青-蓝）
  uint8_t colorThresholds[5] = {0, 25, 50, 75, 100}; // 每个颜色对应的百分比阈值
  uint8_t numColorPoints = 5;         // 实际使用的颜色点数量
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
    usermod["use-multi-color"] = useMultiColor;
    usermod["use-uniform-color"] = useUniformColor;
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
    top["use-multi-color"] = useMultiColor;
    top["use-uniform-color"] = useUniformColor;
    top["num-color-points"] = numColorPoints;
    
    // 保存颜色点和阈值数组
    JsonArray colorArray = top.createNestedArray("color-points");
    for (uint8_t i = 0; i < numColorPoints; i++) {
      colorArray.add(colorPoints[i]);
    }
    
    JsonArray thresholdArray = top.createNestedArray("color-thresholds");
    for (uint8_t i = 0; i < numColorPoints; i++) {
      thresholdArray.add(colorThresholds[i]);
    }
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
      getJsonValue(top["use-multi-color"], useMultiColor, false);
      getJsonValue(top["use-uniform-color"], useUniformColor, false);
      
      // 读取颜色点数量
      uint8_t newNumColorPoints = numColorPoints;
      getJsonValue(top["num-color-points"], newNumColorPoints, 5);
      numColorPoints = constrain(newNumColorPoints, 1, 5);
      
      // 读取颜色点数组
      JsonArray colorArray = top["color-points"];
      if (!colorArray.isNull()) {
        uint8_t count = min((uint8_t)colorArray.size(), (uint8_t)5);
        for (uint8_t i = 0; i < count; i++) {
          if (colorArray[i].is<uint32_t>()) {
            colorPoints[i] = colorArray[i].as<uint32_t>();
          } else if (colorArray[i].is<String>()) {
            // 支持十六进制字符串格式
            String hexStr = colorArray[i].as<String>();
            colorPoints[i] = strtoul(hexStr.c_str(), NULL, 16);
          }
        }
        numColorPoints = count;
      }
      
      // 读取阈值数组
      JsonArray thresholdArray = top["color-thresholds"];
      if (!thresholdArray.isNull()) {
        uint8_t count = min((uint8_t)thresholdArray.size(), (uint8_t)5);
        for (uint8_t i = 0; i < count; i++) {
          colorThresholds[i] = constrain(thresholdArray[i].as<uint8_t>(), 0, 100);
        }
        // 确保阈值是递增的
        for (uint8_t i = 1; i < count; i++) {
          if (colorThresholds[i] < colorThresholds[i-1]) {
            colorThresholds[i] = colorThresholds[i-1];
          }
        }
      }
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
    
    oappend(F("addInfo('")); 
    oappend(String(FPSTR(_name)).c_str()); 
    oappend(F(":use-multi-color")); 
    oappend(F("',1,'<i>启用多色渐变模式，进度条从开始到结束显示颜色渐变</i>');"));
    
    oappend(F("addInfo('")); 
    oappend(String(FPSTR(_name)).c_str()); 
    oappend(F(":use-uniform-color")); 
    oappend(F("',1,'<i>启用整体变色模式，所有LED显示相同颜色，根据当前进度变化</i>');"));
    
    oappend(F("addInfo('")); 
    oappend(String(FPSTR(_name)).c_str()); 
    oappend(F(":num-color-points")); 
    oappend(F("',1,'<i>颜色点数量（1-5）</i>');"));
    
    // 为颜色字段添加可视化功能
    oappend(F("(function(){"));
    oappend(F("function hexToRgb(hex) {"));
    oappend(F("  var result = /^([a-f\\d]{2})([a-f\\d]{2})([a-f\\d]{2})$/i.exec(hex);"));
    oappend(F("  return result ? {"));
    oappend(F("    r: parseInt(result[1], 16),"));
    oappend(F("    g: parseInt(result[2], 16),"));
    oappend(F("    b: parseInt(result[3], 16)"));
    oappend(F("  } : null;"));
    oappend(F("}"));
    oappend(F("function intToHex(val) {"));
    oappend(F("  var hex = val.toString(16).toUpperCase();"));
    oappend(F("  while(hex.length < 6) hex = '0' + hex;"));
    oappend(F("  return '#' + hex;"));
    oappend(F("}"));
    oappend(F("function addColorPicker(fieldName) {"));
    oappend(F("  var inputs = d.getElementsByName(fieldName);"));
    oappend(F("  if(!inputs.length) return;"));
    oappend(F("  var input = inputs[0];"));
    oappend(F("  if(input.type === 'hidden') input = inputs[1];"));
    oappend(F("  if(!input || input.type !== 'number') return;"));
    oappend(F("  var val = parseInt(input.value) || 0;"));
    oappend(F("  var hexColor = intToHex(val);"));
    oappend(F("  var colorInput = cE('input');"));
    oappend(F("  colorInput.type = 'color';"));
    oappend(F("  colorInput.value = hexColor;"));
    oappend(F("  colorInput.style.width = '50px';"));
    oappend(F("  colorInput.style.height = '30px';"));
    oappend(F("  colorInput.style.marginLeft = '10px';"));
    oappend(F("  colorInput.style.cursor = 'pointer';"));
    oappend(F("  var preview = cE('span');"));
    oappend(F("  preview.style.display = 'inline-block';"));
    oappend(F("  preview.style.width = '30px';"));
    oappend(F("  preview.style.height = '30px';"));
    oappend(F("  preview.style.border = '1px solid #ccc';"));
    oappend(F("  preview.style.borderRadius = '3px';"));
    oappend(F("  preview.style.marginLeft = '5px';"));
    oappend(F("  preview.style.backgroundColor = hexColor;"));
    oappend(F("  preview.style.verticalAlign = 'middle';"));
    oappend(F("  function updateColor() {"));
    oappend(F("    var hex = colorInput.value;"));
    oappend(F("    var rgb = hexToRgb(hex.substring(1));"));
    oappend(F("    if(rgb) {"));
    oappend(F("      var intVal = (rgb.r << 16) | (rgb.g << 8) | rgb.b;"));
    oappend(F("      input.value = intVal;"));
    oappend(F("      preview.style.backgroundColor = hex;"));
    oappend(F("    }"));
    oappend(F("  }"));
    oappend(F("  function updatePicker() {"));
    oappend(F("    var val = parseInt(input.value) || 0;"));
    oappend(F("    var hex = intToHex(val);"));
    oappend(F("    colorInput.value = hex;"));
    oappend(F("    preview.style.backgroundColor = hex;"));
    oappend(F("  }"));
    oappend(F("  colorInput.addEventListener('change', updateColor);"));
    oappend(F("  colorInput.addEventListener('input', updateColor);"));
    oappend(F("  input.addEventListener('input', updatePicker);"));
    oappend(F("  input.parentElement.insertBefore(colorInput, input.nextSibling);"));
    oappend(F("  input.parentElement.insertBefore(preview, colorInput.nextSibling);"));
    oappend(F("}"));
    oappend(F("function addColorPickerForAll(fieldName) {"));
    oappend(F("  var inputs = d.getElementsByName(fieldName);"));
    oappend(F("  if(!inputs.length) return;"));
    oappend(F("  for(var i=0; i<inputs.length; i++) {"));
    oappend(F("    var input = inputs[i];"));
    oappend(F("    if(input.type === 'hidden' || input.type !== 'number') continue;"));
    oappend(F("    var val = parseInt(input.value) || 0;"));
    oappend(F("    var hexColor = intToHex(val);"));
    oappend(F("    var colorInput = cE('input');"));
    oappend(F("    colorInput.type = 'color';"));
    oappend(F("    colorInput.value = hexColor;"));
    oappend(F("    colorInput.style.width = '50px';"));
    oappend(F("    colorInput.style.height = '30px';"));
    oappend(F("    colorInput.style.marginLeft = '10px';"));
    oappend(F("    colorInput.style.cursor = 'pointer';"));
    oappend(F("    var preview = cE('span');"));
    oappend(F("    preview.style.display = 'inline-block';"));
    oappend(F("    preview.style.width = '30px';"));
    oappend(F("    preview.style.height = '30px';"));
    oappend(F("    preview.style.border = '1px solid #ccc';"));
    oappend(F("    preview.style.borderRadius = '3px';"));
    oappend(F("    preview.style.marginLeft = '5px';"));
    oappend(F("    preview.style.backgroundColor = hexColor;"));
    oappend(F("    preview.style.verticalAlign = 'middle';"));
    oappend(F("    (function(inp, cp, pv) {"));
    oappend(F("      function updateColor() {"));
    oappend(F("        var hex = cp.value;"));
    oappend(F("        var rgb = hexToRgb(hex.substring(1));"));
    oappend(F("        if(rgb) {"));
    oappend(F("          var intVal = (rgb.r << 16) | (rgb.g << 8) | rgb.b;"));
    oappend(F("          inp.value = intVal;"));
    oappend(F("          pv.style.backgroundColor = hex;"));
    oappend(F("        }"));
    oappend(F("      }"));
    oappend(F("      function updatePicker() {"));
    oappend(F("        var val = parseInt(inp.value) || 0;"));
    oappend(F("        var hex = intToHex(val);"));
    oappend(F("        cp.value = hex;"));
    oappend(F("        pv.style.backgroundColor = hex;"));
    oappend(F("      }"));
    oappend(F("      cp.addEventListener('change', updateColor);"));
    oappend(F("      cp.addEventListener('input', updateColor);"));
    oappend(F("      inp.addEventListener('input', updatePicker);"));
    oappend(F("    })(input, colorInput, preview);"));
    oappend(F("    input.parentElement.insertBefore(colorInput, input.nextSibling);"));
    oappend(F("    input.parentElement.insertBefore(preview, colorInput.nextSibling);"));
    oappend(F("  }"));
    oappend(F("}"));
    oappend(F("setTimeout(function() {"));
    oappend(F("  addColorPicker('")); 
    oappend(String(FPSTR(_name)).c_str());
    oappend(F(":progress-color');"));
    oappend(F("  addColorPicker('")); 
    oappend(String(FPSTR(_name)).c_str());
    oappend(F(":bg-color');"));
    oappend(F("  addColorPickerForAll('")); 
    oappend(String(FPSTR(_name)).c_str());
    oappend(F(":color-points[]');"));
    oappend(F("}, 100);"));
    oappend(F("})();"));
  }

  /**
   * 根据进度百分比获取颜色（多色模式）
   * @param percent 进度百分比（0-100）
   * @param useCurrentProgress 如果为true，使用当前进度百分比；如果为false，使用传入的percent参数
   */
  uint32_t getColorForProgress(int percent, bool useCurrentProgress = false) {
    // 如果使用整体变色模式，使用当前进度百分比
    if (useCurrentProgress && useUniformColor) {
      percent = progressPercent;
    }
    
    if (!useMultiColor && !useUniformColor) {
      return progressColor;
    }

    // 确保百分比在有效范围内
    percent = constrain(percent, 0, 100);

    // 如果只有一个颜色点，直接返回
    if (numColorPoints == 1) {
      return colorPoints[0];
    }

    // 找到当前百分比所在的两个颜色点之间
    for (uint8_t i = 0; i < numColorPoints - 1; i++) {
      if (percent <= colorThresholds[i + 1]) {
        // 计算在两个颜色点之间的插值
        uint8_t range = colorThresholds[i + 1] - colorThresholds[i];
        if (range == 0) {
          return colorPoints[i];
        }
        uint8_t position = percent - colorThresholds[i];
        uint8_t blend = (position * 255) / range;
        return color_blend(colorPoints[i], colorPoints[i + 1], blend);
      }
    }

    // 如果超过最后一个阈值，返回最后一个颜色
    return colorPoints[numColorPoints - 1];
  }

  /**
   * 在LED条上绘制进度条
   */
  void handleOverlayDraw() override {
    if (!enabled) return;

    uint16_t totalLEDs = strip.getLengthTotal();
    uint16_t activeLEDs = (totalLEDs * progressPercent) / 100;

    // 整体变色模式：所有激活的LED显示相同颜色（根据当前进度百分比）
    uint32_t uniformColor = progressColor;
    if (useUniformColor) {
      uniformColor = getColorForProgress(progressPercent);
    }

    // 多色渐变模式：当进度完成（100%）时，所有激活的LED显示同一个颜色（最后一个颜色点）
    bool isComplete = (progressPercent >= 100);
    uint32_t completeColor = progressColor;
    if (isComplete && useMultiColor && !useUniformColor) {
      // 使用最后一个颜色点作为完成颜色
      completeColor = colorPoints[numColorPoints - 1];
    }

    if (direction == 0) {
      // 正向：从左到右
      for (uint16_t i = 0; i < totalLEDs; i++) {
        if (i < activeLEDs) {
          uint32_t pixelColor;
          if (useUniformColor) {
            // 整体变色模式：所有LED显示相同颜色
            pixelColor = uniformColor;
          } else if (isComplete && useMultiColor) {
            // 进度完成时：所有LED显示同一个颜色
            pixelColor = completeColor;
          } else if (useMultiColor && activeLEDs > 0) {
            // 多色渐变模式：根据LED在进度条中的位置计算颜色
            // 将LED位置映射到当前进度百分比范围内（0%到当前进度%）
            int pixelPercent = (i * progressPercent) / activeLEDs;
            pixelPercent = constrain(pixelPercent, 0, progressPercent);
            pixelColor = getColorForProgress(pixelPercent);
          } else {
            pixelColor = progressColor;
          }
          strip.setPixelColor(i, pixelColor);
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
          uint32_t pixelColor;
          if (useUniformColor) {
            // 整体变色模式：所有LED显示相同颜色
            pixelColor = uniformColor;
          } else if (isComplete && useMultiColor) {
            // 进度完成时：所有LED显示同一个颜色
            pixelColor = completeColor;
          } else if (useMultiColor && activeLEDs > 0) {
            // 多色渐变模式：根据LED在进度条中的位置计算颜色
            uint16_t posInProgress = totalLEDs - i - 1;
            int pixelPercent = (posInProgress * progressPercent) / activeLEDs;
            pixelPercent = constrain(pixelPercent, 0, progressPercent);
            pixelColor = getColorForProgress(pixelPercent);
          } else {
            pixelColor = progressColor;
          }
          strip.setPixelColor(i, pixelColor);
        }
      }
    } else if (direction == 2) {
      // 中心扩散：从中心向两边
      uint16_t center = totalLEDs / 2;
      uint16_t halfActive = activeLEDs / 2;
      
      for (uint16_t i = 0; i < totalLEDs; i++) {
        uint16_t distanceFromCenter = abs((int16_t)i - (int16_t)center);
        if (distanceFromCenter < halfActive) {
          uint32_t pixelColor;
          if (useUniformColor) {
            // 整体变色模式：所有LED显示相同颜色
            pixelColor = uniformColor;
          } else if (isComplete && useMultiColor) {
            // 进度完成时：所有LED显示同一个颜色
            pixelColor = completeColor;
          } else if (useMultiColor && halfActive > 0) {
            // 多色渐变模式：根据距离中心的距离计算颜色
            // 将距离映射到当前进度百分比范围内（0%到当前进度%）
            int pixelPercent = ((halfActive - distanceFromCenter) * progressPercent) / halfActive;
            pixelPercent = constrain(pixelPercent, 0, progressPercent);
            pixelColor = getColorForProgress(pixelPercent);
          } else {
            pixelColor = progressColor;
          }
          strip.setPixelColor(i, pixelColor);
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

