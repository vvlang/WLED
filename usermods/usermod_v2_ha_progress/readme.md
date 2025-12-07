# Home Assistant 进度条 Usermod

这个usermod允许WLED从Home Assistant读取实体数据，并将LED灯条显示为进度条。

## 功能特性

- ✅ 通过HTTP REST API从Home Assistant读取实体状态
- ✅ 自动将实体值转换为百分比（0-100%）
- ✅ 在LED灯条上实时显示进度条效果
- ✅ 支持多种显示方向：
  - 正向：从左到右填充
  - 反向：从右到左填充
  - 中心扩散：从中心向两边扩散
- ✅ 可配置进度条颜色和背景颜色
- ✅ 支持自定义最小值和最大值范围
- ✅ 支持从state或attributes中读取数据
- ✅ 可配置更新间隔

## 安装方法

### 方法1：使用PlatformIO自动加载（推荐）

1. 将 `usermod_v2_ha_progress` 文件夹复制到WLED项目的 `usermods` 目录
2. PlatformIO会自动检测并编译usermod（如果配置了自动加载）
3. 重新编译并上传固件到ESP设备

### 方法2：手动集成

1. 将 `usermod_v2_ha_progress` 文件夹复制到WLED项目的 `usermods` 目录
2. 确保 `wled00/const.h` 中已定义 `USERMOD_ID_HA_PROGRESS`（已在代码中添加）
3. 重新编译并上传固件到ESP设备

**注意**：v2 usermod使用 `REGISTER_USERMOD` 宏自动注册，无需手动添加到 `usermods_list.cpp`

## 配置说明

### 在WLED Web界面配置

1. 进入 **设置** → **Usermods**
2. 找到 **HA_Progress** 模块
3. 配置以下参数：

#### 基本设置

- **Enabled**: 启用/禁用此usermod
- **ha-ip**: Home Assistant的IP地址（例如：192.168.1.100）
- **ha-port**: Home Assistant的端口（默认：8123）
- **ha-token**: Home Assistant长期访问令牌（可选，但推荐使用）
- **entity-id**: 要读取的实体ID（例如：`sensor.battery_level`、`sensor.temperature`等）

#### 显示设置

- **update-interval**: 更新间隔（毫秒，默认5000，即5秒）
- **direction**: 显示方向
  - `0`: 正向（从左到右）
  - `1`: 反向（从右到左）
  - `2`: 中心扩散
- **progress-color**: 进度条颜色（十六进制，默认：0x00FF00，绿色）
- **bg-color**: 背景颜色（十六进制，默认：0x000000，黑色）

#### 数值范围设置

- **min-value**: 最小值（用于百分比计算，默认：0.0）
- **max-value**: 最大值（用于百分比计算，默认：100.0）

#### 高级设置

- **use-attributes**: 是否从attributes中读取值（默认：false）
- **attribute-key**: 如果使用attributes，指定键名（默认：value）

### 获取Home Assistant长期访问令牌

1. 登录Home Assistant
2. 点击左下角用户名
3. 滚动到底部，找到 **长期访问令牌**
4. 点击 **创建令牌**
5. 复制生成的令牌并粘贴到WLED配置中

## 使用示例

### 示例1：显示电池电量

- **entity-id**: `sensor.phone_battery_level`
- **min-value**: 0
- **max-value**: 100
- **direction**: 0（正向）
- **progress-color**: 0x00FF00（绿色）

### 示例2：显示温度进度（20-30度范围）

- **entity-id**: `sensor.living_room_temperature`
- **min-value**: 20
- **max-value**: 30
- **direction**: 2（中心扩散）
- **progress-color**: 0xFF0000（红色）

### 示例3：显示下载进度

- **entity-id**: `sensor.download_progress`
- **min-value**: 0
- **max-value**: 100
- **direction**: 0（正向）
- **progress-color**: 0x0000FF（蓝色）

### 示例4：从attributes读取值

如果实体数据在attributes中，例如：
```json
{
  "state": "unknown",
  "attributes": {
    "value": 75.5
  }
}
```

配置：
- **entity-id**: `sensor.example`
- **use-attributes**: true
- **attribute-key**: value
- **min-value**: 0
- **max-value**: 100

## API使用

### 获取当前状态

```bash
curl http://wled-ip/json/state
```

响应中包含：
```json
{
  "HA_Progress": {
    "enabled": true,
    "progress": 75,
    "entity": "sensor.battery_level",
    "error": ""
  }
}
```

### 启用/禁用

```bash
curl -X POST http://wled-ip/json/state -d '{"HA_Progress":{"enabled":true}}'
```

## 故障排除

### 连接失败

- 检查Home Assistant的IP地址和端口是否正确
- 确保WLED设备可以访问Home Assistant（网络连通性）
- 检查防火墙设置

### 获取不到数据

- 检查实体ID是否正确
- 如果使用长期访问令牌，确保令牌有效
- 查看串口调试输出（如果启用）查看错误信息
- 检查实体是否确实存在且可访问

### 百分比显示不正确

- 检查min-value和max-value设置是否合理
- 如果实体值已经是百分比格式（0-100），确保min-value=0，max-value=100
- 检查实体返回的数据类型（数字、字符串等）

### 进度条不显示

- 确保usermod已启用
- 检查LED灯条是否正常工作
- 尝试调整进度条颜色和背景颜色
- 检查direction设置是否正确

## 技术细节

- 使用WiFiClient进行HTTP请求
- 支持JSON解析（使用ArduinoJson库）
- 使用handleOverlayDraw()在LED条上绘制进度条
- 支持PSRAM（如果可用）

## 许可证

与WLED项目相同的许可证（EUPL v1.2）

## 贡献

欢迎提交问题和改进建议！

