# Home Assistant 进度条功能说明

## 功能概述

新增了 `usermod_v2_ha_progress` usermod，允许 WLED 从 Home Assistant 读取实体数据，并将 LED 灯条显示为实时进度条。

## 新增文件

- `usermods/usermod_v2_ha_progress/usermod_v2_ha_progress.cpp` - 主程序文件
- `usermods/usermod_v2_ha_progress/library.json` - PlatformIO 配置文件
- `usermods/usermod_v2_ha_progress/readme.md` - 详细使用文档

## 修改文件

- `wled00/const.h` - 添加 `USERMOD_ID_HA_PROGRESS` (ID: 59)
- `platformio.ini` - 在 `esp32c3dev` 环境中添加 `custom_usermods = usermod_v2_ha_progress`

## 主要特性

1. **Home Assistant 集成**
   - 通过 HTTP REST API 读取实体状态
   - 支持长期访问令牌认证
   - 自动错误处理和重试机制

2. **灵活的数值处理**
   - 支持从 `state` 或 `attributes` 中读取数据
   - 自动百分比转换（0-100%）
   - 可配置最小值和最大值范围
   - 支持多种数据类型（数字、字符串百分比等）

3. **多种显示模式**
   - 正向：从左到右填充
   - 反向：从右到左填充
   - 中心扩散：从中心向两边扩散

4. **可配置选项**
   - 进度条颜色和背景颜色
   - 更新间隔（默认5秒）
   - 显示方向
   - 数值范围映射

## 使用方法

### 1. 编译固件

在 `platformio.ini` 中已配置 `esp32c3dev` 环境自动包含此 usermod。

编译命令：
```bash
pio run -e esp32c3dev
```

### 2. 配置

通过 WLED Web 界面：
- 进入 **设置** → **Usermods**
- 找到 **HA_Progress** 模块
- 启用并配置参数

或通过 JSON API：
```bash
curl -X POST http://wled-ip/json/state -d '{
  "HA_Progress": {
    "enabled": true,
    "ha-ip": "192.168.1.100",
    "entity-id": "sensor.battery_level"
  }
}'
```

### 3. 配置参数

- **ha-ip**: Home Assistant IP 地址
- **ha-port**: 端口（默认 8123）
- **ha-token**: 长期访问令牌（推荐）
- **entity-id**: 实体 ID（如 `sensor.battery_level`）
- **update-interval**: 更新间隔（毫秒）
- **direction**: 显示方向（0/1/2）
- **progress-color**: 进度条颜色（十六进制）
- **min-value / max-value**: 数值范围

## 使用示例

### 显示电池电量
```json
{
  "HA_Progress": {
    "enabled": true,
    "entity-id": "sensor.phone_battery_level",
    "direction": 0,
    "progress-color": 65280
  }
}
```

### 显示温度进度（20-30度范围）
```json
{
  "HA_Progress": {
    "enabled": true,
    "entity-id": "sensor.living_room_temperature",
    "min-value": 20,
    "max-value": 30,
    "direction": 2,
    "progress-color": 16711680
  }
}
```

## 技术实现

- 使用 `WiFiClient` 进行 HTTP 请求
- 使用 `ArduinoJson` 解析 JSON 响应
- 使用 `handleOverlayDraw()` 在 LED 条上绘制进度条
- 支持 PSRAM（如果可用）

## 贡献

如需向 WLED 官方仓库贡献此功能，请：

1. Fork WLED 仓库
2. 创建新分支
3. 提交 Pull Request

详细说明请参考 `usermods/readme.md`

## 许可证

与 WLED 项目相同的许可证（EUPL v1.2）

